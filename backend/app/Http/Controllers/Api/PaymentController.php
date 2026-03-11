<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // Lihat Payment Detail by Order
    public function show(Request $request, Order $order)
    {
        // Pastikan Order Milik Customer Yang Login
        if ($order->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $payment = $order->payment;

        if (! $payment) {
            return response()->json([
                'message' => 'Payment not found',
            ], 403);
        }

        return response()->json([
            'data' => new PaymentResource($payment),
        ]);
    }

    // Update Payment Status (webhook dari Midtrans)
    public function webhook(Request $request)
    {
        // \Log::info('Webhook received', $request->all());

        $orderId = $request->order_id;
        $statusCode = $request->status_code;
        $grossAmount = $request->gross_amount;
        $serverKey = config('services.midtrans.server_key');

        // Validasi signature
        $signature = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);
        if ($signature !== $request->signature_key) {
            // \Log::warning('Invalid signature', ['expected' => $signature, 'received' => $request->signature_key]);

            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $payment = Payment::where('reference_id', $orderId)->first();

        if (! $payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $status = $request->transaction_status;

        // \Log::info('Status', ['status' => $status]);

        // Tambahkan capture untuk kartu kredit
        if (in_array($status, ['settlement', 'capture', 'penyelesaian'])) {
            $payment->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);
            $payment->order->update(['status' => 'confirmed']);
        } elseif (in_array($status, ['cancel', 'expire', 'deny'])) {
            $payment->update(['status' => 'failed']);
            $payment->order->update(['status' => 'cancelled']);
        }

        return response()->json(['message' => 'Webhook processed']);
    }

    public function getSnapToken(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order tidak bisa dibayar'], 422);
        }

        \Midtrans\Config::$serverKey = config('services.midtrans.server_key');
        \Midtrans\Config::$isProduction = config('services.midtrans.is_production');
        \Midtrans\Config::$isSanitized = true;
        \Midtrans\Config::$is3ds = true;

        // Kalau sudah ada snap token → cancel dulu transaksi lama
        if ($order->payment->snap_token) {
            try {
                \Midtrans\Transaction::cancel($order->payment->reference_id);
            } catch (\Exception $e) {
                // Abaikan kalau gagal cancel
            }

            $order->payment->update([
                'snap_token' => null,
                'reference_id' => null,
            ]);
        }

        $referenceId = $order->order_number.'-'.time();

        $params = [
            'transaction_details' => [
                'order_id' => $referenceId,
                'gross_amount' => (int) $order->total,
            ],
            'customer_details' => [
                'first_name' => $request->user()->name,
                'email' => $request->user()->email,
                'phone' => $request->user()->phone ?? '',
            ],
            'item_details' => array_merge(
                $order->orderItems->map(function ($item) {
                    return [
                        'id' => $item->menu_item_id,
                        'price' => (int) $item->unit_price,
                        'quantity' => $item->quantity,
                        'name' => $item->menuItem->name,
                    ];
                })->toArray(),
                [[
                    'id' => 'TAX',
                    'price' => (int) $order->tax,
                    'quantity' => 1,
                    'name' => 'PPN 11%',
                ]]
            ),
            'enabled_payments' => [
                // 'gopay',
                // 'shopeepay',
                // 'dana',
                // 'ovo',
                'other_qris',
                // 'credit_card',
            ],
        ];

        $snapToken = \Midtrans\Snap::getSnapToken($params);

        $order->payment->update([
            'snap_token' => $snapToken,
            'reference_id' => $referenceId,
        ]);

        return response()->json(['snap_token' => $snapToken]);
    }
}
