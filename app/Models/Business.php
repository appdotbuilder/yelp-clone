<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Business
 *
 * @property int $id
 * @property string $name
 * @property string $description
 * @property string $category
 * @property string|null $phone
 * @property string|null $email
 * @property string|null $website
 * @property string $address
 * @property string $city
 * @property string $state
 * @property string $zip_code
 * @property float|null $latitude
 * @property float|null $longitude
 * @property string|null $image_url
 * @property float $price_range
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read float $average_rating
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Business newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Business newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Business query()
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereImageUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business wherePriceRange($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereState($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereWebsite($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business whereZipCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Business active()
 * @method static \Database\Factories\BusinessFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Business extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
        'category',
        'phone',
        'email',
        'website',
        'address',
        'city',
        'state',
        'zip_code',
        'latitude',
        'longitude',
        'image_url',
        'price_range',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'price_range' => 'decimal:1',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the reviews for the business.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the average rating for the business.
     *
     * @return float
     */
    public function getAverageRatingAttribute(): float
    {
        return $this->reviews()->avg('rating') ?? 0.0;
    }

    /**
     * Scope a query to only include active businesses.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}