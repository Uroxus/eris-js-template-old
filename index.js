/**
 * @file Defines, manages and starts a new bot instance 
 */
import { isMaster } from "cluster"
import { Fleet } from "eris-fleet"

import dotenv from "dotenv"
dotenv.config()

import { Shard } from "./shard.js"
import winston from "winston"

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
        levels: {
            error: 0,
            warn: 1,
            info: 2,
            main: 3,
            debug: 4
        },
        transports: [
            new winston.transports.Console( { format: winston.format.colorize( { all: true } ), stderrLevels: [ "error", "warn" ] } ),
            new winston.transports.File( { filename: "logs/error.log", level: "error" } ),
            new winston.transports.File( { filename: "logs/main.log" } )
        ],
        level: process.env.DEBUG ? "debug" : "main",
        format: winston.format.combine(
            winston.format.timestamp( { format: "DD-MM-YY HH:mm:ss" } ),
            winston.format.printf( ( info ) => {
                const { timestamp, level, message, ...args } = info

                return `[${ timestamp }] [${ level.toUpperCase() }] | ${ message } ${ Object.keys( args ).length ? JSON.stringify( args, null, 2 ) : "" }`
            } )
        ),
    } )

    winston.addColors( {
        error: "red",
        warn: "yellow",
        info: "green",
        main: "magenta",
        debug: "cyan"
    } )

    Admiral.on( 'error', ( msg ) => logger.error( msg ) )
    Admiral.on( 'warn', ( msg ) => logger.warn( msg ) )
    Admiral.on( 'info', ( msg ) => logger.info( msg ) )
    Admiral.on( 'log', ( msg ) => logger.main( msg ) )
    Admiral.on( 'debug', ( msg ) => logger.main( msg ) )
}