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
        Schema::create('reports', function (Blueprint $table) {
            $table->id('report_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onUpdate('cascade');
            $table->string('title');
            $table->text('description');
            $table->foreignId('category_id')->constrained('categories', 'category_id')->onUpdate('cascade');
            $table->string('image');
            $table->enum('status', ['PENDING', 'IN_PROCESS', 'RESOLVED', 'REJECTED']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
