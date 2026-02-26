<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Payment;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $todayRevenue = Payment::where('status', 'paid')
            ->whereDate('paid_at', Carbon::today())
            ->sum('amount');

        $monthRevenue = Payment::where('status', 'paid')
            ->whereMonth('paid_at', Carbon::now()->format('m'))
            ->whereYear('paid_at', Carbon::now()->format('y'))
            ->sum('amount');

        $todayOrders = Order::whereDate('created_at', today())->count();
        $pendingOrders = Order::where('status', 'pending')->count();

        return [
            Stat::make("Today's Revenue ", 'Rp '.number_format($todayRevenue, 0, ',', '.'))
                ->description('Total pemasukan hari ini')
                ->descriptionIcon('heroicon-o-banknotes')
                ->color('success'),

            Stat::make('Monthly Revenue ', 'Rp '.number_format($monthRevenue, 0, ',', '.'))
                ->description('Total pemasukan bulan ini')
                ->descriptionIcon('heroicon-o-chart-bar')
                ->color('primary'),

            Stat::make("Today's Orders", $todayOrders)
                ->description('Total order hari ini')
                ->descriptionIcon('heroicon-o-shopping-cart')
                ->color('warning'),

            Stat::make('Pending Orders', $pendingOrders)
                ->description('Order menunggu konfirmasi')
                ->descriptionIcon('heroicon-o-clock')
                ->color('danger'),
        ];
    }
}
