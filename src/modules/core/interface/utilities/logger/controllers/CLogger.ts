import * as winston from "winston"

/**
 * A class representing the core logger controller
 *
 * @version 1.0.0
 * @since 04/09/23
 * @author
 *  - Devitrax
 */
const CLogger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.File({
            handleExceptions: true,
            filename: `./log/bot.log`,
            format: winston.format.simple()
        }),
        new winston.transports.Console({
            handleExceptions: true,
            // colorize: true,
            format: winston.format.combine(
                winston.format.colorize({
                    all: true
                }),
                winston.format.timestamp({
                    format: "YY-MM-DD HH:MM:SS"
                }),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `(${timestamp}) [${level}]: ${message}`
                })
            ),
        }),
    ],
})

export default CLogger