<?php

namespace App\Tags;

use App\Models\Sport;
use Statamic\Tags\Tags;
use App\Models\Event as EventModel;

class Event extends Tags
{
    /**
     * The {{ event }} tag.
     *
     * @return string|array
     */
    public function index()
    {
        if($this->params->get('sport') && $this->params->get('sport') != "all"){
            return EventModel::where('is_published', true)->where("sport_id",Sport::where("slug",$this->params->get('sport'))->first()?->id)->with(["ageGroup","sport"])->get();
        }
        return EventModel::where('is_published', true)->with(["ageGroup","sport"])->get();
    }

    /**
     * The {{ event:show_by_slug }} tag.
     *
     * @return string|array
     */
    public function showBySlug()
    {
        return EventModel::where('slug', $this->params->get('slug'))->first();
    }

    /**
     * The {{ event:show_by_id }} tag.
     *
     * @return string|array
     */
    public function showByID()
    {
        return EventModel::find($this->params->get('id'));
    }
}
