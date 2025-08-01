<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class BusinessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some users first
        $users = User::factory(20)->create();

        // Create businesses with reviews
        Business::factory(50)->create()->each(function ($business) use ($users) {
            // Each business gets 1-10 reviews from random users
            $reviewCount = random_int(1, 10);
            $randomUsers = $users->random($reviewCount);
            
            foreach ($randomUsers as $user) {
                Review::factory()->create([
                    'user_id' => $user->id,
                    'business_id' => $business->id,
                ]);
            }
        });
    }
}