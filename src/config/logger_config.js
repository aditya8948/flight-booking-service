const { createLogger, format, transports } = require("winston");

const Logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),
    defaultMeta: { service: "base-node-js-project-template" },
    transports: [
        new transports.Console()
    ]
});

module.exports = Logger;
