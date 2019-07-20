import { CronJob } from "cron";
import fetch, { Response } from "node-fetch";
import "reflect-metadata";
import { createConnection, Repository } from "typeorm";
import config from "./config/Config";
import Snapshot from "./entities/Snapshot";
import logger from "./logger";

process.on("unhandledRejection", err => {
    logger.error("Unhandled rejection:", err);
});

let job: CronJob;
let snapshotRepository: Repository<Snapshot>;

config.typeorm.entities = [__dirname + "/entities/*.js"];

createConnection(config.typeorm).then(conn => {
    job = new CronJob("0 0 0 * * *", update, null, true, "Europe/Rome");
    snapshotRepository = conn.getRepository(Snapshot);

    if (config.runAtLaunch) {
        update();
    }
}).catch(err => {
    logger.fatal("Connection error", err);
});

async function update() {
    for (const channel of config.channels) {
        logger.info("Updating", channel);

        try {
            const count = await getMembersCount(channel);
            const snap = new Snapshot(channel, count);
            await snapshotRepository.save(snap);
        } catch (ex) {
            logger.error("Error updating", channel, ex);
        }
    }

    logger.info("Done for now");
}

async function getMembersCount(channel: string): Promise<number> {
    const url = `https://api.telegram.org/bot${config.botToken}/getChatMembersCount?chat_id=@${channel}`;

    const resp: Response = await fetch(url);

    if (resp.status === 200) {
        return (await resp.json()).result;
    } else {
        throw new Error("Telegram response was unsuccessful: " + await resp.text());
    }
}
