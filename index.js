/**
 * @file Defines, manages and starts a new bot instance 
 */
import { isMaster } from "cluster"
import { Fleet } from "eris-fleet"

import dotenv from "dotenv"
dotenv.config()

import { BotWorker } from "./bot.js"
import { inspect } from "util"

const Admiral = new Fleet( {
    BotWorker,
    token: process.env.BOT_TOKEN,
    clientOptions: {
        "defaultImageFormat": "png",
        "restMode": true,
        "intents": [ "guilds", "guildMessages", "guildIntegrations", "directMessages" ]
    },
    "useCentralRequestHandler": true,
    "whatToLog": {
        "whitelist": [ "all_clusters_launched", "all_services_launched", "cluster_launch", "service_launch" ]
    }
} )

if ( isMaster ) {
    Admiral.on( 'log', msg => console.log( msg ) )
    Admiral.on( 'debug', msg => console.debug( msg ) )
    Admiral.on( 'warn', msg => console.warn( msg ) )
    Admiral.on( 'error', msg => console.error( inspect( msg ) ) )
}