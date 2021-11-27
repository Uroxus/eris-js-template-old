/**
 * @file Create and start a new instance of the bot
 */

import botClient from "./Classes/Client.js"

new botClient( ( process.env.TESTING === "true" ? process.env.DEV_TOKEN : process.env.PROD_TOKEN ), {
    "defaultImageFormat": "png",
    "restMode": true,
    "maxShards": "auto",
    "intents": [ "guilds", "guildMessages", "guildIntegrations", "directMessages" ]
} )