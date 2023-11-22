import { AnimeListMini, MyAnimeListEntry } from "../myanimelist/types";
import { SonarrShowDetails } from "./types";

export const transformMyAnimeListShowToSonarr = (
    anime: MyAnimeListEntry,
    mapping: AnimeListMini
): SonarrShowDetails => {
    return {
        id: mapping.mal_id ? Number.parseInt(mapping.mal_id) : undefined,
        tvdbId: mapping.thetvdb_id,
        title: anime.anime_title ? anime.anime_title : "",
        release_year: anime.anime_start_date_string
            ? anime.anime_start_date_string
            : "",
        clean_title: anime.anime_title,
        adult: false, // FIXME: remove hardcoded value
    };
};
