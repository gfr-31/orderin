<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;

class OrderNotificationWidget extends Widget
{
    protected static string $view = 'filament.widgets.order-notification';

    protected static bool $isLazy = false;

    protected int|string|array $columnSpan = 'full';

    public static function canView(): bool
    {
        return true;
    }
}
