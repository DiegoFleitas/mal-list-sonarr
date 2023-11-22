export const MAL_ORIGIN = "https://myanimelist.net";

/**
 * Ensures slug starts and ends with a single slash.
 */
export const normalizeSlug = (slug: string): string =>
    "/" + slug.replace(/^\/*(.*?)\/*$/, "$1") + "/";
