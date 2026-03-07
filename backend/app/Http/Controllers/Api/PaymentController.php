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
        // Pastikan order milik customer yang login
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Pastikan order masih pending
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order tidak bisa dibayar'], 422);
        }

        // Setup Midtrans
        \Midtrans\Config::$serverKey = config('services.midtrans.server_key');
        \Midtrans\Config::$isProduction = config('services.midtrans.is_production');
        \Midtrans\Config::$isSanitized = true;
        \Midtrans\Config::$is3ds = true;

        // Parameter untuk Midtrans
        $params = [
            'transaction_details' => [
                'order_id' => $order->payment->reference_id ?? $order->order_number.'-'.time(),
                'gross_amount' => (int) $order->total, // ← total sudah include tax
            ],
            'customer_details' => [
                'first_name' => $request->user()->name,
                'email' => $request->user()->email,
                'phone' => $request->user()->phone,
            ],
            'item_details' => array_merge(
                // Item menu
                $order->orderItems->map(function ($item) {
                    return [
                        'id' => $item->menu_item_id,
                        'price' => (int) $item->unit_price,
                        'quantity' => $item->quantity,
                        'name' => $item->menuItem->name,
                    ];
                })->toArray(),
                // Tax sebagai item terpisah
                [
                    [
                        'id' => 'TAX',
                        'price' => (int) $order->tax,
                        'quantity' => 1,
                        'name' => 'PPN 11%',
                    ],
                ]
            ),
        ];

        // Generate snap token
        $snapToken = \Midtrans\Snap::getSnapToken($params);

        // Simpan snap token & reference id ke payment
        $order->payment->update([
            'snap_token' => $snapToken,
            'reference_id' => $params['transaction_details']['order_id'],
        ]);

        return response()->json([
            'snap_token' => $snapToken,
        ]);
    }
}
