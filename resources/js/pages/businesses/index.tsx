import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Business {
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
}

interface Props {
    businesses: {
        data: Business[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
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

export default function BusinessIndex({ businesses, categories, cities, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('businesses.index'), { search }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleFilter = (key: string, value: string | number) => {
        router.get(route('businesses.index'), { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        router.get(route('businesses.index'), {}, {
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
            <Head title="Browse Businesses - LocalReviews" />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <Link
                                href={route('home')}
                                className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white"
                            >
                                <span className="text-2xl">🍽️</span>
                                <span>LocalReviews</span>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <form onSubmit={handleSearch} className="max-w-2xl">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Search businesses..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit">Search</Button>
                            </div>
                        </form>
                    </div>

                    {/* Filters */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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

                    {/* Pagination */}
                    {businesses.last_page > 1 && (
                        <div className="flex justify-center">
                            <nav className="flex items-center space-x-2">
                                {businesses.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        className={`px-3 py-2 text-sm rounded-lg ${
                                            link.active
                                                ? 'bg-red-600 text-white'
                                                : link.url
                                                ? 'bg-white text-gray-700 hover:bg-gray-50 border'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}

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
            </div>
        </>
    );
}