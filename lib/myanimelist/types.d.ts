/* used to be MyAnimeListShowDetails */
export interface AnimeListMini {
    livechart_id: number;
    thetvdb_id: number;
    "anime-planet_id": string;
    anisearch_id: number;
    anidb_id: number;
    kitsu_id: number;
    mal_id: number;
    type: string;
    "notify.moe_id": string;
    anilist_id: number;
}

export interface MyAnimeListEntry {
    status: number;
    score: number;
    tags: string;
    is_rewatching: number;
    num_watched_episodes: number;
    created_at: number;
    updated_at: number;
    anime_title: string;
    anime_title_eng: string;
    anime_num_episodes: number;
    anime_airing_status: number;
    anime_id: number;
    anime_studios: any;
    anime_licensors: any;
    anime_season: any;
    anime_total_members: number;
    anime_total_scores: number;
    anime_score_val: number;
    anime_score_diff: number;
    anime_popularity: number;
    has_episode_video: boolean;
    has_promotion_video: boolean;
    has_video: boolean;
    video_url: string;
    genres: Genre[];
    demographics: Demographic[];
    title_localized: any;
    anime_url: string;
    anime_image_path: string;
    is_added_to_list: boolean;
    anime_media_type_string: string;
    anime_mpaa_rating_string: string;
    start_date_string: any;
    finish_date_string: any;
    anime_start_date_string: string;
    anime_end_date_string: string;
    days_string: any;
    storage_string: string;
    priority_string: string;
    notes: string;
    editable_notes: string;
}

interface Genre {
    id: number;
    name: string;
}

interface Demographic {
    id: number;
    name: string;
}
