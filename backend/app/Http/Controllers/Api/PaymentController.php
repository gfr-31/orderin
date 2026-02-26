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
        $orderId = $request->order_id;
        $statusCode = $request->status_code;
        $grossAmount = $request->gross_amount;
        $serverKey = config('services.midtrans.server_key');

        // Validasi Signature Dari Midtrans
        $signature = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

        if ($signature !== $request->signature_key) {
            return response()->json([
                'message' => 'Invalid Signature',
            ], 403);
        }

        $payment = Payment::where('reference_id', $orderId)->first();

        if (! $payment) {
            return response()->json([
                'message' => 'Payment Not Found',
            ], 404);
        }

        // Update Status Payment
        if ($request->transaction_status === 'settlement') {
            $payment->update([
                'status' => 'padi',
                'paid_at' => now(),
            ]);

            // Update Status Order
            $payment->order->update(['status' => 'confirmed']);
        } elseif (in_array($request->transaction_status, ['cancel', 'expire', 'deny'])) {
            $payment->update(['status' => 'failed']);
            $payment->order->update(['status' => 'cancelled']);
        }

        return response()->json(['message' => 'Webhook Processes']);
    }
}
