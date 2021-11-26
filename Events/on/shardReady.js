/**
 * @file Create a log every time a shard turns ready
 */

import botClient from "../../Classes/Client.js"
import { Logger } from "../../Modules/Logger.js"
import { extractWebhookElements } from "../../Modules/Utilities.js"

/**
 * @event shardReady
 * @link https://abal.moe/Eris/docs/Client#event-shardReady
 * @param {botClient} Client
 * @param {Number} shardId
 */
export default async function ( Client, shardId ) {
    Logger.status( `[SHARD] Shard ${ shardId } is ready` )

    if ( shardId === 0 ) {
        Logger.debug( `[COMMAND CACHE] Cached command list: ${ JSON.stringify( [ ...Client.commandManager.commandFiles.entries() ], null, 1 ) }` )
        Logger.debug( `[COMMAND CACHE] Cached alias list: ${ JSON.stringify( [ ...Client.commandManager.aliases.entries() ], null, 1 ) }` )
        Logger.debug( `[COMMAND CACHE] Cached application command name list: ${ JSON.stringify( [ ...Client.commandManager.applicationCommands.entries() ], null, 1 ) }` )
        Client.commandManager.publishCommands( Client )
    }

    if ( process.env.CONNECTIVITY_WEBHOOK && ( ( process.env.TESTING === "true" && process.env.CONNECTIVITY_WEBHOOK_ON_TESTING === 'true' ) || process.env.TESTING !== "true" ) ) {
        const [ id, token ] = extractWebhookElements( process.env.CONNECTIVITY_WEBHOOK )
        Client.executeWebhook( id, token, {
            "embeds": [
                {
                    "title": "Shard Status",
                    "description": `Shard ${ shardId } is **Ready**`,
                    "color": parseInt( process.env.EMBED_GREEN ),
                    "timestamp": new Date(),
                    "footer": { "text": `${ Client.getUserString( Client.user ) }`, "icon_url": Client.user.dynamicAvatarURL() }
                }
            ]
        } ).catch( ( error ) => {
            Logger.warn( `[SHARD] Shard ${ shardId } failed to post a ready status: ${ error }` )
        } )
    }
}