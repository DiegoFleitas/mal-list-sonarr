import { getListCached } from "./list";
import { MyAnimeListEntry } from "./types";

export const fetchEntriesFromSlug = async (
    slug: string
): Promise<MyAnimeListEntry[]> => {
    return await getListCached(slug);
};
