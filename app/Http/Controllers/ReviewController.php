<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Models\Business;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Store a newly created review.
     */
    public function store(StoreReviewRequest $request, Business $business)
    {
        // Check if user already reviewed this business
        $existingReview = Review::where('user_id', auth()->id())
            ->where('business_id', $business->id)
            ->first();

        if ($existingReview) {
            return back()->withErrors(['review' => 'You have already reviewed this business.']);
        }

        Review::create([
            'user_id' => auth()->id(),
            'business_id' => $business->id,
            'rating' => $request->validated()['rating'],
            'comment' => $request->validated()['comment'],
        ]);

        return redirect()->route('businesses.show', $business)
            ->with('success', 'Review posted successfully!');
    }

    /**
     * Update the specified review.
     */
    public function update(StoreReviewRequest $request, Review $review)
    {
        // Ensure user can only update their own review
        if ($review->user_id !== auth()->id()) {
            abort(403);
        }

        $review->update($request->validated());

        return redirect()->route('businesses.show', $review->business)
            ->with('success', 'Review updated successfully!');
    }

    /**
     * Remove the specified review.
     */
    public function destroy(Review $review)
    {
        // Ensure user can only delete their own review
        if ($review->user_id !== auth()->id()) {
            abort(403);
        }

        $business = $review->business;
        $review->delete();

        return redirect()->route('businesses.show', $business)
            ->with('success', 'Review deleted successfully!');
    }
}