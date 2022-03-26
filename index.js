/**
 * @file Defines, manages and starts a new bot instance 
 */
import { isMaster } from "cluster"
import { Fleet } from "eris-fleet"

import dotenv from "dotenv"
dotenv.config()

import { BotWorker as Shard } from "./bot.js"
import { inspect } from "util"

const Admiral = new Fleet( {
    BotWorker: Shard,
    token: `Bot ${ process.env.BOT_TOKEN }`,

    startingStatus: {
        "status": "idle",
        "game": {
            "type": `Booting up...`
        }
    },

    whatToLog: {
        blacklist: [ "stats_update" ]
    },

    clientOptions: {
        "defaultImageFormat": "png",
        "restMode": true,
        "disableEvents": {
            "GUILD_BAN_ADD": true,
            "GUILD_BAN_REMOVE": true,
            "GUILD_MEMBER_ADD": true,
            "GUILD_MEMBER_REMOVE": true,
            "GUILD_MEMBER_UPDATE": true,
            "GUILD_ROLE_CREATE": true,
            "GUILD_ROLE_DELETE": true,
            "GUILD_ROLE_UPDATE": true,

            "CHANNEL_CREATE": true,
            "CHANNEL_DELETE": true,
            "CHANNEL_UPDATE": true,

            "MESSAGE_DELETE": true,
            "MESSAGE_DELETE_BULK": true,
            "MESSAGE_UPDATE": true,

            "STAGE_INSTANCE_CREATE": true,
            "STAGE_INSTANCE_DELETE": true,
            "STAGE_INSTANCE_UPDATE": true,

            "MESSAGE_REACTION_ADD": true,
            "MESSAGE_REACTION_REMOVE": true,
            "MESSAGE_REACTION_REMOVE_ALL": true,
            "MESSAGE_REACTION_REMOVE_EMOJI": true,

            "INVITE_CREATE": true,
            "INVITE_DELETE": true,

            "THREAD_UPDATE": true,
            "THREAD_DELETE": true,

            "PRESENCE_UPDATE": true,
            "TYPING_START": true,
            "USER_UPDATE": true,
            "WEBHOOKS_UPDATE": true,
            "VOICE_STATE_UPDATE": true
        },
        "allowedMentions": {
            "everyone": false,
            "roles": false,
            "repliedUser": true,
            "users": true
        },
        "intents": [ "guilds", "guildMessages", "guildIntegrations", "directMessages" ],
        "messageLimit": 0,
    },

    "useCentralRequestHandler": true,
} )

if ( isMaster ) {
    const logger = winston.createLogger( {

    } )


    Admiral.on( 'log', msg => console.log( msg ) )
    Admiral.on( 'debug', msg => console.debug( msg ) )
    Admiral.on( 'warn', msg => console.warn( msg ) )
    Admiral.on( 'error', msg => console.error( inspect( msg ) ) )
}