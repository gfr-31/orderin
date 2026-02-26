<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::with('category')->where('is_available', true);

        // Filter by Category
        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter Featured Only
        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        // Search by Name
        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        $menuItems = $query->get();

        return response()->json([
            'data' => MenuItemResource::collection($menuItems),
        ]);
    }

    public function show(MenuItem $menuItem)
    {
        $menuItem->load('category');

        return response()->json([
            'data' => new MenuItemResource($menuItem),
        ]);
    }
}
