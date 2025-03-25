<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $guarded = ['category_id'];
    protected $primaryKey = 'category_id';

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'category_id', 'category_id');
    }
}
