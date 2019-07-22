import * as fs from "fs";

const config = JSON.parse(fs.readFileSync(__dirname + "/config.json").toString());

class Config {
    public channels: string[];
    public botToken: string;
    public typeorm: any;
    public runAtLaunch: boolean;

    constructor() {
        this.channels = config.channels;
        this.botToken = config.botToken;
        this.typeorm = config.typeorm;
        this.runAtLaunch = config.runAtLaunch;
    }
}

export default new Config();
