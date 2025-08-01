<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->integer('rating')->comment('1-5 star rating');
            $table->text('comment');
            $table->timestamps();
            
            // Prevent duplicate reviews from same user for same business
            $table->unique(['user_id', 'business_id']);
            
            // Indexes for performance
            $table->index('business_id');
            $table->index('user_id');
            $table->index('rating');
            $table->index(['business_id', 'rating']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};