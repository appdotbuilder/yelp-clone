import { type SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Props {
    businesses: {
        data: Array<{
            id: number;
            name: string;
            description: string;
            category: string;
            city: string;
            state: string;
            image_url: string | null;
            average_rating: number;
            reviews_count: number;
            price_range: number;
        }>;
    };
    categories: string[];
    cities: string[];
    filters: {
        search?: string;
        category?: string;
        city?: string;
        price_range?: number;
        rating?: number;
    };
    [key: string]: unknown;
}

export default function Welcome({ businesses, categories, cities, filters }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', { search }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleFilter = (key: string, value: string | number) => {
        router.get('/', { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        router.get('/', {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
            </span>
        ));
    };

    const renderPriceRange = (price: number) => {
        return Array.from({ length: 4 }, (_, i) => (
            <span key={i} className={`${i < price ? 'text-green-600' : 'text-gray-300'}`}>
                $
            </span>
        ));
    };

    return (
        <>
            <Head title="🍽️ LocalReviews - Find the Best Local Businesses" />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
                {/* Header */}
                <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">🍽️</span>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">LocalReviews</h1>
                            </div>
                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Welcome, {auth.user.name}!
                                        </span>
                                        <Link
                                            href={route('dashboard')}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl md:text-6xl font-bold mb-4">
                            🌟 Find Amazing Local Businesses
                        </h2>
                        <p className="text-xl md:text-2xl mb-8 opacity-90">
                            Discover, review, and connect with the best restaurants, shops, and services in your area
                        </p>
                        
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="🔍 Search for restaurants, coffee shops, bars..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 text-lg py-3 px-4 text-gray-900"
                                />
                                <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8">
                                    Search
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Filters */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
                        <div className="flex flex-wrap gap-4 items-center">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
                            
                            <select
                                value={filters.category || ''}
                                onChange={(e) => handleFilter('category', e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <select
                                value={filters.city || ''}
                                onChange={(e) => handleFilter('city', e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">All Cities</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>

                            <select
                                value={filters.rating || ''}
                                onChange={(e) => handleFilter('rating', Number(e.target.value))}
                                className="border rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">Any Rating</option>
                                <option value="4">4+ Stars</option>
                                <option value="3">3+ Stars</option>
                                <option value="2">2+ Stars</option>
                            </select>

                            <select
                                value={filters.price_range || ''}
                                onChange={(e) => handleFilter('price_range', Number(e.target.value))}
                                className="border rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">Any Price</option>
                                <option value="1">$ Budget</option>
                                <option value="2">$$ Moderate</option>
                                <option value="3">$$$ Expensive</option>
                                <option value="4">$$$$ Very Expensive</option>
                            </select>

                            <Button 
                                onClick={clearFilters}
                                variant="outline"
                                size="sm"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>

                    {/* Business Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {businesses.data.map((business) => (
                            <Link
                                key={business.id}
                                href={route('businesses.show', business.id)}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                            >
                                <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    {business.image_url ? (
                                        <img 
                                            src={business.image_url} 
                                            alt={business.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl">🏪</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                                            {business.name}
                                        </h3>
                                        <div className="flex items-center space-x-1">
                                            {renderPriceRange(business.price_range)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {business.category} • {business.city}, {business.state}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                            {renderStars(business.average_rating)}
                                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                                                ({business.reviews_count})
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                                        {business.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {businesses.data.length === 0 && (
                        <div className="text-center py-12">
                            <span className="text-6xl mb-4 block">🔍</span>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No businesses found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                        </div>
                    )}
                </div>

                {/* Feature Highlights */}
                {!filters.search && !filters.category && !filters.city && (
                    <div className="bg-white dark:bg-gray-900 py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                                Why Choose LocalReviews? 🤔
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <span className="text-5xl mb-4 block">⭐</span>
                                    <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Real Reviews</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Get honest feedback from real customers who've been there
                                    </p>
                                </div>
                                <div className="text-center">
                                    <span className="text-5xl mb-4 block">🔍</span>
                                    <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Smart Search</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Filter by category, location, price, and rating to find exactly what you need
                                    </p>
                                </div>
                                <div className="text-center">
                                    <span className="text-5xl mb-4 block">📍</span>
                                    <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Local Focus</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Discover hidden gems and support local businesses in your community
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-gray-400">
                            Built with ❤️ for local communities • LocalReviews 2024
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}