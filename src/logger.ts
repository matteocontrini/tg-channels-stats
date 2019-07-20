import * as util from "util";

enum LogLevel {
    Debug = "DEBUG",
    Info = "INFO",
    Warn = "WARN",
    Error = "ERROR",
}

class Logger {
    public debug(...args: any[]) { this.log(LogLevel.Debug, ...args); }
    public info(...args: any[]) { this.log(LogLevel.Info, ...args); }
    public warn(...args: any[]) { this.log(LogLevel.Warn, ...args); }
    public error(...args: any[]) { this.log(LogLevel.Error, ...args); }
    public fatal(...args: any[]) { this.log(LogLevel.Error, ...args); process.exit(1); }

    private log(level: LogLevel, ...args: any[]) {
        args[0] = [new Date().toISOString(), level, args[0]].join(" ");

        // tslint:disable-next-line: no-console
        console.log(util.format.apply(util, args));
    }
}

export default new Logger();
