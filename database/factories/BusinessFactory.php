<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Business>
 */
class BusinessFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Restaurant',
            'Coffee Shop',
            'Bar',
            'Shopping',
            'Hotel',
            'Gym',
            'Salon',
            'Auto Repair',
            'Medical',
            'Entertainment',
        ];

        $cities = [
            'New York',
            'Los Angeles',
            'Chicago',
            'Houston',
            'Phoenix',
            'Philadelphia',
            'San Antonio',
            'San Diego',
            'Dallas',
            'San Jose',
        ];

        $states = [
            'NY',
            'CA',
            'IL',
            'TX',
            'AZ',
            'PA',
            'TX',
            'CA',
            'TX',
            'CA',
        ];

        $cityIndex = array_rand($cities);
        $city = $cities[$cityIndex];
        $state = $states[$cityIndex];

        return [
            'name' => fake()->company(),
            'description' => fake()->paragraph(3),
            'category' => fake()->randomElement($categories),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->companyEmail(),
            'website' => fake()->optional()->url(),
            'address' => fake()->streetAddress(),
            'city' => $city,
            'state' => $state,
            'zip_code' => fake()->postcode(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'image_url' => fake()->optional()->imageUrl(400, 300, 'business'),
            'price_range' => fake()->randomFloat(1, 1, 4),
            'is_active' => fake()->boolean(90),
        ];
    }
}