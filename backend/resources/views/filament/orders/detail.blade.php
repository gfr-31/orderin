<div class="space-y-4 p-2">
    {{-- Info Customer --}}
    <div class="bg-gray-50 rounded-xl p-4">
        <p class="text-sm font-semibold text-gray-500 mb-2">Info Customer</p>
        <p class="font-bold text-gray-800">{{ $order->user->name }}</p>
        <p class="text-sm text-gray-500">{{ $order->user->email }}</p>
        <p class="text-sm text-gray-500 mt-1">📍 {{ $order->delivery_address }}</p>
        @if ($order->notes)
            <p class="text-sm text-orange-600 mt-1">📝 {{ $order->notes }}</p>
        @endif
    </div>

    {{-- Item Pesanan --}}
    <div class="bg-gray-50 rounded-xl p-4">
        <p class="text-sm font-semibold text-gray-500 mb-3">Item Pesanan</p>
        <div class="space-y-3">
            @foreach ($order->orderItems as $item)
                <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3">
                        @if ($item->menuItem->image)
                            <img src="{{ Storage::url($item->menuItem->image) }}"
                                class="w-10 h-10 rounded-lg object-cover" />
                        @else
                            <div class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-lg">🍽️
                            </div>
                        @endif
                        <div>
                            <p class="font-semibold text-sm text-gray-800">{{ $item->menuItem->name }}</p>
                            <p class="text-xs text-gray-500">{{ $item->quantity }}x @ Rp
                                {{ number_format($item->unit_price, 0, ',', '.') }}</p>
                            @if ($item->notes)
                                <p class="text-xs text-orange-500 mt-0.5">📝 {{ $item->notes }}</p>
                            @endif
                        </div>
                    </div>
                    <p class="font-bold text-sm text-gray-800">
                        Rp {{ number_format($item->subtotal, 0, ',', '.') }}
                    </p>
                </div>
            @endforeach
        </div>
    </div>

    {{-- Total --}}
    <div class="bg-gray-50 rounded-xl p-4 space-y-2">
        <div class="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>Rp {{ number_format($order->subtotal, 0, ',', '.') }}</span>
        </div>
        <div class="flex justify-between text-sm text-gray-500">
            <span>PPN 11%</span>
            <span>Rp {{ number_format($order->tax, 0, ',', '.') }}</span>
        </div>
        <div class="flex justify-between font-bold text-gray-800 border-t pt-2">
            <span>Total</span>
            <span>Rp {{ number_format($order->total, 0, ',', '.') }}</span>
        </div>
    </div>
</div>
