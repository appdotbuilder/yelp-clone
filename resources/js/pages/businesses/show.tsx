import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { type SharedData } from '@/types';

interface Business {
    id: number;
    name: string;
    description: string;
    category: string;
    phone: string | null;
    email: string | null;
    website: string | null;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    image_url: string | null;
    price_range: number;
    average_rating: number;
    reviews_count: number;
    reviews: Array<{
        id: number;
        rating: number;
        comment: string;
        created_at: string;
        user: {
            id: number;
            name: string;
        };
    }>;
}

interface Props {
    business: Business;
    [key: string]: unknown;
}

export default function BusinessShow({ business }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span 
                key={i} 
                className={`text-2xl cursor-pointer ${i < rating ? 'text-yellow-400' : 'text-gray-300'} ${interactive ? 'hover:text-yellow-400' : ''}`}
                onClick={() => interactive && onStarClick && onStarClick(i + 1)}
            >
                ★
            </span>
        ));
    };

    const renderPriceRange = (price: number) => {
        return Array.from({ length: 4 }, (_, i) => (
            <span key={i} className={`text-lg ${i < price ? 'text-green-600' : 'text-gray-300'}`}>
                $
            </span>
        ));
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('reviews.store', business.id), {
            rating,
            comment
        }, {
            onSuccess: () => {
                setShowReviewForm(false);
                setComment('');
                setRating(5);
            }
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const userHasReviewed = business.reviews.some(review => review.user.id === auth.user?.id);

    return (
        <>
            <Head title={`${business.name} - LocalReviews`} />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('home')}
                                className="text-red-600 hover:text-red-700 font-medium"
                            >
                                ← Back to Search
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Business Header */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            {business.name}
                                        </h1>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                                {business.category}
                                            </span>
                                            <div className="flex items-center space-x-1">
                                                {renderPriceRange(business.price_range)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Rating Summary */}
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center space-x-1">
                                        {renderStars(Math.floor(business.average_rating))}
                                    </div>
                                    <span className="text-lg font-semibold">
                                        {business.average_rating.toFixed(1)}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        ({business.reviews_count} reviews)
                                    </span>
                                </div>

                                {/* Business Image */}
                                {business.image_url && (
                                    <div className="mb-6">
                                        <img 
                                            src={business.image_url} 
                                            alt={business.name}
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                    </div>
                                )}

                                {/* Description */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">About</h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {business.description}
                                    </p>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Reviews ({business.reviews_count})
                                    </h2>
                                    {auth.user && !userHasReviewed && (
                                        <Button 
                                            onClick={() => setShowReviewForm(!showReviewForm)}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Write a Review
                                        </Button>
                                    )}
                                </div>

                                {/* Review Form */}
                                {showReviewForm && auth.user && (
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                                        <form onSubmit={handleSubmitReview}>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                                    Your Rating
                                                </label>
                                                <div className="flex items-center space-x-1">
                                                    {renderStars(rating, true, setRating)}
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                                    Your Review
                                                </label>
                                                <textarea
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    rows={4}
                                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Share your experience..."
                                                    required
                                                    minLength={10}
                                                />
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                                                    Submit Review
                                                </Button>
                                                <Button 
                                                    type="button" 
                                                    variant="outline"
                                                    onClick={() => setShowReviewForm(false)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Reviews List */}
                                <div className="space-y-6">
                                    {business.reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-600 pb-6 last:border-b-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                        {review.user.name}
                                                    </h4>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex items-center space-x-1">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatDate(review.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {business.reviews.length === 0 && (
                                    <div className="text-center py-8">
                                        <span className="text-4xl mb-4 block">💭</span>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            No reviews yet. Be the first to share your experience!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                    Business Information
                                </h3>
                                
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</span>
                                        <p className="text-gray-900 dark:text-white">
                                            {business.address}<br />
                                            {business.city}, {business.state} {business.zip_code}
                                        </p>
                                    </div>
                                    
                                    {business.phone && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</span>
                                            <p className="text-gray-900 dark:text-white">
                                                <a href={`tel:${business.phone}`} className="hover:text-red-600">
                                                    {business.phone}
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                    
                                    {business.email && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
                                            <p className="text-gray-900 dark:text-white">
                                                <a href={`mailto:${business.email}`} className="hover:text-red-600">
                                                    {business.email}
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                    
                                    {business.website && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</span>
                                            <p className="text-gray-900 dark:text-white">
                                                <a 
                                                    href={business.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="hover:text-red-600"
                                                >
                                                    Visit Website →
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!auth.user && (
                                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                                            Want to leave a review?
                                        </p>
                                        <div className="space-y-2">
                                            <Link
                                                href={route('login')}
                                                className="w-full block text-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                Log In
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="w-full block text-center border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Sign Up
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}