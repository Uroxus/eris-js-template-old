/**
 * @file index starts the bot instance
 */

import { BotClient } from "./Classes/Client.js"

new BotClient( ( process.env.TESTING === "true" ? process.env.DEV_TOKEN : process.env.PROD_TOKEN ), {
    "defaultImageFormat": "png",
    "restMode": true,
    "maxShards": "auto",
    "intents": [ "guilds", "guildMessages", "guildIntegrations", "directMessages" ]
} )