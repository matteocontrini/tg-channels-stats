import * as config from "./config.json";

class Config {
    public channels: string[];
    public botToken: string;
    public typeorm: any;

    constructor() {
        this.channels = config.channels;
        this.botToken = config.botToken;
        this.typeorm = config.typeorm;
    }
}

export default new Config();
