<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // Forms\Components\TextInput::make('user_id')
                //     ->required()
                //     ->numeric(),
                Forms\Components\TextInput::make('order_number')
                    ->disabled()
                    ->dehydrated(false),
                Forms\Components\TextInput::make('user.name')
                    ->label('Customer')
                    ->disabled()
                    ->dehydrated(false),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'processing' => 'Processing',
                        'delivered' => 'Delivered',
                        'cancelled' => 'Cancelled',
                    ])
                    ->required(),
                Forms\Components\TextInput::make('subtotal')
                    ->disabled()
                    ->dehydrated(false)
                    ->prefix('Rp'),
                Forms\Components\TextInput::make('tax')
                    ->disabled()
                    ->dehydrated(false)
                    ->prefix('Rp'),
                Forms\Components\TextInput::make('total')
                    ->disabled()
                    ->dehydrated(false)
                    ->prefix('Rp'),
                Forms\Components\Textarea::make('delivery_address')
                    ->disabled()
                    ->dehydrated(false)
                    ->columnSpanFull(),
                Forms\Components\Textarea::make('notes')
                    ->disabled()
                    ->dehydrated(false)
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Customer')
                    ->sortable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'gray' => 'pending',
                        'info' => 'confirmed',
                        'warning' => 'preparing',
                        'primary' => 'out_for_delivery',
                        'success' => 'delivered',
                        'danger' => 'cancelled',
                    ])
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'pending' => 'Menunggu Pembayaran',
                        'confirmed' => 'Dibayar',
                        'preparing' => 'Sedang Disiapkan',
                        'out_for_delivery' => 'Sedang Diantar',
                        'delivered' => 'Selesai',
                        'cancelled' => 'Dibatalkan',
                        default => $state,
                    }),
                // Tables\Columns\TextColumn::make('subtotal')
                //     ->numeric()
                //     ->sortable(),
                // Tables\Columns\TextColumn::make('tax')
                //     ->numeric()
                //     ->sortable(),
                Tables\Columns\TextColumn::make('total')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
                // ->toggleable(isToggledHiddenByDefault: true),
                // Tables\Columns\TextColumn::make('updated_at')
                //     ->dateTime()
                //     ->sortable()
                //     ->toggleable(isToggledHiddenByDefault: true),

            ])
            ->defaultSort('created_at', 'desc')
            ->poll('10s')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Menunggu Pembayaran',
                        'confirmed' => 'Dibayar',
                        'preparing' => 'Sedang Disiapkan',
                        'out_for_delivery' => 'Sedang Diantar',
                        'delivered' => 'Selesai',
                        'cancelled' => 'Dibatalkan',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('view_detail')
                    ->label('Detail')
                    ->icon('heroicon-o-eye')
                    ->color('gray')
                    ->modalHeading(fn ($record) => 'Detail Order '.$record->order_number)
                    ->modalContent(fn ($record) => view('filament.orders.detail', [
                        'order' => $record->load(['orderItems.menuItem', 'user']),
                    ]))
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel('Tutup'),

                Tables\Actions\Action::make('prepare')
                    ->label('Siapkan')
                    ->icon('heroicon-o-fire')
                    ->color('warning')
                    ->visible(fn ($record) => $record->status === 'confirmed')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['status' => 'preparing'])),

                Tables\Actions\Action::make('deliver')
                    ->label('Antar')
                    ->icon('heroicon-o-truck')
                    ->color('primary')
                    ->visible(fn ($record) => $record->status === 'preparing')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['status' => 'out_for_delivery'])),

                Tables\Actions\Action::make('complete')
                    ->label('Selesai')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn ($record) => $record->status === 'out_for_delivery')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['status' => 'delivered'])),

                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
