export interface LogFn {
  (message: string, ...args: any[]): void;
}

interface ILogger {
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  debug: LogFn;
}

type LogLevel = "info" | "warn" | "debug";

const DISABLED = () => { };


class Logger implements ILogger {
  readonly info: LogFn = console.log.bind(null, "%c[INFO]: %s", "background: #595959; color: #ebebeb");
  readonly warn: LogFn = console.log.bind(null, "%c[WARN]: %s", "background: #574d36; color: #eba21a");
  readonly error: LogFn = console.log.bind(null, "%c[ERROR]: %s", "background: #694140; color: #ff8080");
  readonly debug: LogFn = console.log.bind(null, "%c[DEBUG]: %s", "background: ; color: #c2c2c2");

  constructor(settings?: {
    logLevel?: LogLevel;
  }) {

    switch (settings?.logLevel) {
      case "info":
        this.warn = DISABLED;
      case "warn":
        this.debug = DISABLED;
      case "debug":
        break;
    }
  }
}

export const ENV_LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel | undefined;

export const logger = new Logger({ logLevel: ENV_LOG_LEVEL });
