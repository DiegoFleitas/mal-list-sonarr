import { MyAnimeListEntry, AnimeListMini } from "./lib/myanimelist/types";
import express from "express";
import { normalizeSlug } from "./lib/myanimelist/util";
import { transformMyAnimeListShowToSonarr } from "./lib/sonarr/transform";
import { getAnimesDetailCached } from "./lib/myanimelist/anime-details";
import { sendChunkedJson } from "./lib/express/send-chunked-json";
import { fetchEntriesFromSlug } from "./lib/myanimelist";
import { logger } from "./lib/logger";

const appLogger = logger.child({ module: "App" });

const PORT = process.env.PORT || 5000;

const app = express();
const server = app.listen(PORT, () =>
    appLogger.info(`Listening on port ${PORT}`)
);

server.keepAliveTimeout = 78;

app.get("/", (_, res) => res.send("Use myanimelist.net path as path here."));

app.get("/favicon.ico", (_, res) => res.status(404).send());

app.get(/(.*)/, async (req, res) => {
    const chunk = sendChunkedJson(res);

    // Abort fetching on client close
    let isConnectionOpen = true;
    let isFinished = false;
    req.connection.on("close", () => {
        isConnectionOpen = false;
        if (!isFinished) {
            appLogger.warn("Client closed connection before finish.");
        }
    });

    const slug = normalizeSlug(req.params[0]);
    const limit = req.query.limit
        ? Number.parseInt(req.query.limit as string)
        : undefined;

    let entries: MyAnimeListEntry[];

    try {
        appLogger.info(`Fetching entries for ${slug}`);
        entries = await fetchEntriesFromSlug(slug);
        if (!Array.isArray(entries)) {
            throw new Error(`Fetching entries failed for ${slug}`);
        }
        if (limit) {
            entries = entries.slice(0, limit);
        }
    } catch (e: any) {
        isFinished = true;
        appLogger.error(`Failed to fetch entries for ${slug} - ${e.message}`);
        chunk.fail(404, e.message);
        return;
    }

    const onAnime = (anime: MyAnimeListEntry, mapping: AnimeListMini) => {
        // If there's no tvdb_id it may be a movie
        // sonarr throws an error, if an entry is missing an id
        if (!mapping.thetvdb_id) {
            return;
        }
        chunk.push(transformMyAnimeListShowToSonarr(anime, mapping));
    };

    await getAnimesDetailCached(entries, 7, onAnime, () => !isConnectionOpen);

    isFinished = true;
    chunk.end();
});

process.on("unhandledRejection", (reason) => {
    throw reason;
});

process.on("uncaughtException", (error) => {
    appLogger.error("Uncaught Exception", error);
    process.exit(1);
});
