<?php

namespace App\Http\Controllers\Api;

use App\Events\NewOrderReceived;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Lihat Semua Order Milik Customer Yang login
    public function index(Request $request)
    {
        $orders = Order::with(['orderItems.menuItem', 'payment'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => OrderResource::collection($orders),
        ]);
    }

    // Lihat Detail Satu Order
    public function show(Request $request, Order $order)
    {
        // Pastikan Order Milik Customer Yang Login
        if ($order->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $order->load(['orderItems.menuItem', 'payment', 'user']);

        return response()->json([
            'data' => new OrderResource($order),
        ]);
    }

    // Buat Order Baru
    public function store(Request $request)
    {
        $request->validate([
            'delivery_address' => 'required|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|integer|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $subtotal = 0;

            // Hitung Subtotal
            foreach ($request->items as $item) {
                $menuItem = MenuItem::findOrFail($item['menu_item_id']);
                $subtotal += $menuItem->price * $item['quantity'];
            }

            $tax = $subtotal * 0.11; // PPN 11%
            $total = $subtotal + $tax;

            // Buat Order
            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'delivery_address' => $request->delivery_address,
                'notes' => $request->notes,
            ]);

            // Buat Order Items
            foreach ($request->items as $item) {
                $menuItem = MenuItem::findOrFail($item['menu_item_id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $menuItem->price,
                    'subtotal' => $menuItem->price * $item['quantity'],
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            // Buat Payment Dengan Status Panding
            Payment::create([
                'order_id' => $order->id,
                'method' => 'midtrans',
                'status' => 'pending',
                'amount' => $total,
            ]);

            DB::commit();

            $order->load(['orderItems.menuItem', 'payment']);

            // Broadcast notifikasi ke admin
try {
    broadcast(new NewOrderReceived($order));
} catch (\Exception $e) {
    // Broadcast gagal tapi order tetap sukses
    \Log::warning('Broadcast failed: ' . $e->getMessage());
}

return response()->json([
    'message' => 'Order Created Successfully',
    'data' => new OrderResource($order),
], 201);

    // Cancel Order
    public function cancel(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        if (! in_array($order->status, ['pending', 'confirmed'])) {
            return response()->json([
                'message' => 'Order cannot be cancelled',
            ], 422);
        }

        $order->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Order Cancelled Successfully',
            'data' => new OrderResource($order),
        ]);
    }
}
