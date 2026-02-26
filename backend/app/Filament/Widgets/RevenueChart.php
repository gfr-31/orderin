<?php

namespace App\Filament\Widgets;

use App\Models\Payment;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;

class RevenueChart extends ChartWidget
{
    protected static ?string $heading = 'Revenue Last 7 Days';

    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $data = [];
        $labels = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $labels[] = $date->format('d M');
            $data[] = Payment::where('status', 'paid')
                ->whereDate('paid_at', $date)
                ->sum('amount');
        }

        return [
            'datasets' => [
                [
                    'label' => 'Revenue (Rp)',
                    'data' => $data,
                    'borderColor' => '#f97316',
                    'backgoroundColor' => 'rgba(249, 115, 22, 0.1)',
                    'fill' => true,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
