import pLimit from "p-limit";
import * as cache from "../cache/index";
import { logger } from "../logger";
import { AnimeListMini, MyAnimeListEntry } from "./types";
import axios from "axios";

const showsLogger = logger.child({ module: "ShowsDetails" });

export const getAnimesDetailCached = async (
    entries: MyAnimeListEntry[],
    concurrencyLimit: number = 7,
    onDetail?: (entry: MyAnimeListEntry, detail: AnimeListMini) => void,
    shouldCancel?: () => boolean
) => {
    // we have to remove empty entries to prevent infinite loading
    entries = entries.filter((entry) => entry);
    const limit = pLimit(concurrencyLimit);
    const shows = await Promise.all(
        entries.map(async (entry) => {
            const detail = await limit(async () => {
                // Cancel running operations in case client connection closed.
                if (shouldCancel && shouldCancel()) {
                    return;
                }

                try {
                    return await getCachedShowDetail(entry.anime_url);
                } catch (e: any) {
                    showsLogger.error(`Error fetching '${entry}'.`);
                }
            });
            console.log(detail);

            if (onDetail && detail) {
                onDetail(entry, detail);
            }
            return detail;
        })
    );
    return shows;
    // return shows.filter((show): show is AnimeListMini => !!show);
};

export const getShowDetail = async (entry: string) => {
    console.log("getShowDetail", entry);
    const malId = entry.split("/")[2];

    try {
        const data = await getCachedAnimeList();

        if (!data?.length) return null;

        // Search the data for the entry by matching mal_id
        return data.find((show) => show.mal_id === parseInt(malId)) || null;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

export const getCachedShowDetail = async (entry: string) => {
    if (await cache.has(entry)) {
        showsLogger.debug(`Fetched '${entry}' from redis.`);
        return await cache.get<AnimeListMini>(entry);
    }

    const data = await getShowDetail(entry);
    showsLogger.debug(`Fetched '${entry}' live.`);

    // We cache shows indefinitely, assuming they don't change.
    // Be sure to configure redis with a maxmemory and an eviction policy or this will eat all your RAM
    await cache.set(entry, data);

    return data;
};

export const getCachedAnimeList = async (key = "animeListMini") => {
    // Check if the anime list is already in the cache
    if (await cache.has(key)) {
        showsLogger.debug("Fetched anime list from cache.");
        return await cache.get(key);
    }

    // Fetch the anime list and cache it
    try {
        const response = await axios.get(
            "https://raw.githubusercontent.com/Fribb/anime-lists/master/anime-list-mini.json"
        );
        await cache.set(key, response.data);
        showsLogger.debug("Fetched anime list live and cached.");
        return response.data;
    } catch (error) {
        console.error("Error fetching anime list:", error);
        return null;
    }
};
