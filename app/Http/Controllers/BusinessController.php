<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessController extends Controller
{
    /**
     * Display a listing of businesses.
     */
    public function index(Request $request)
    {
        $query = Business::active()->with(['reviews']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category', $request->get('category'));
        }

        // City filter
        if ($request->filled('city')) {
            $query->where('city', $request->get('city'));
        }

        // Price range filter
        if ($request->filled('price_range')) {
            $query->where('price_range', '<=', $request->get('price_range'));
        }

        // Rating filter
        if ($request->filled('rating')) {
            $minRating = $request->get('rating');
            $query->whereHas('reviews', function ($q) use ($minRating) {
                $q->groupBy('business_id')
                  ->havingRaw('AVG(rating) >= ?', [$minRating]);
            });
        }

        $businesses = $query->paginate(12)->withQueryString();

        // Add average rating to each business
        $businesses->getCollection()->transform(function ($business) {
            $business->setAttribute('average_rating', $business->reviews->avg('rating') ?? 0);
            $business->setAttribute('reviews_count', $business->reviews->count());
            return $business;
        });

        // Get filter options
        $categories = Business::active()->distinct()->pluck('category')->sort()->values();
        $cities = Business::active()->distinct()->pluck('city')->sort()->values();

        // Determine which view to render based on route
        $component = request()->routeIs('home') ? 'welcome' : 'businesses/index';
        
        return Inertia::render($component, [
            'businesses' => $businesses,
            'categories' => $categories,
            'cities' => $cities,
            'filters' => $request->only(['search', 'category', 'city', 'price_range', 'rating']),
        ]);
    }

    /**
     * Display the specified business.
     */
    public function show(Business $business)
    {
        $business->load(['reviews.user']);
        
        // Calculate average rating and review count
        $business->setAttribute('average_rating', $business->reviews->avg('rating') ?? 0);
        $business->setAttribute('reviews_count', $business->reviews->count());

        return Inertia::render('businesses/show', [
            'business' => $business,
        ]);
    }
}