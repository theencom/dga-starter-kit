<?php

namespace App\Tags;

use App\Models\Sport as SportModel;
use Statamic\Tags\Tags;

class Sport extends Tags
{
    /**
     * The {{ sport }} tag.
     *
     * @return string|array
     */
    public function index()
    {
        return SportModel::all();
    }
}
