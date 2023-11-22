export const MAL_ORIGIN = "https://myanimelist.net";

export const getFirstMatch =
    (regex: RegExp) =>
    (val?: string): string => {
        if (!val) {
            return "";
        }
        const match = val.match(regex);
        if (!match || match.length < 2) {
            return "";
        }
        return match[1];
    };

/**
 * Ensures slug starts and ends with a single slash.
 */
export const normalizeSlug = (slug: string): string =>
    "/" + slug.replace(/^\/*(.*?)\/*$/, "$1") + "/";
