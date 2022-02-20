/**
 * @file index starts the bot instance
 */
import Debug from "debug"
const defualtArgFormat = Debug.formatArgs

Debug.formatArgs = function ( args ) {
    this.namespace = this.namespace.padEnd( 36, "." )
    defualtArgFormat.call( this, args )
}


import { BotClient } from "./Classes/Client.js"

new BotClient( ( process.env.TESTING === "true" ? process.env.DEV_TOKEN : process.env.PROD_TOKEN ), {
    "defaultImageFormat": "png",
    "restMode": true,
    "maxShards": "auto",
    "intents": [ "guilds", "guildMessages", "guildIntegrations", "directMessages" ]
} )