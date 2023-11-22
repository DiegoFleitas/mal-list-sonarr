import { MAL_ORIGIN } from "./util";
import axios from "axios";
import * as cache from "../cache/index";
import { MyAnimeListEntry } from "./types";

// Cache Lists for 30min
const LIST_CACHE_TIMEOUT = 30 * 60;

interface MyAnimeListPage {
    next: string;
    entries: MyAnimeListEntry[];
}

export const getList = async (
    listSlug: string,
    onPage?: (page: number) => void
): Promise<MyAnimeListEntry[]> => {
    const entries: MyAnimeListEntry[] = [];
    let nextPage: number | null = 1;
    while (nextPage) {
        const result = await getListPaginated(listSlug, nextPage);
        if (onPage) {
            onPage(nextPage);
        }
        entries.push(...result.entries);
        nextPage = Number.parseInt(result.next);
        nextPage = Number.isNaN(nextPage) ? null : nextPage;
    }

    return entries;
};

export const getListCached = async (
    listSlug: string,
    onPage?: (page: number) => void
): Promise<MyAnimeListEntry[]> => {
    const cached = await cache.get(listSlug);
    if (cached && Array.isArray(cached)) {
        return cached;
    }
    if (cached !== undefined) {
        await cache.del(listSlug);
    }

    const entries = await getList(listSlug, onPage);
    await cache.set(listSlug, entries, LIST_CACHE_TIMEOUT);

    return entries;
};

export const getListPaginated = async (
    listSlug: string,
    page: number
): Promise<MyAnimeListPage> => {
    return axios
        .get(`${MAL_ORIGIN}${listSlug}load.json?status=6`)
        .then((response) => {
            console.log(response.data);
            return {
                next: "0",
                entries: response.data,
            };
        })
        .catch((error) => {
            console.log(error);
            return {
                next: "0",
                entries: [],
            };
        });
};
