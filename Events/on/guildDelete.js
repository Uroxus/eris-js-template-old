/**
 * @file Create a log every time the bot leaves or is removed from a server
 */

import Eris from "eris"
import botClient from "../../Classes/Client.js"
import { Logger } from "../../Modules/Logger.js"
import { extractWebhookElements } from "../../Modules/Utilities.js"

/**
 * @event guildDelete
 * @link https://abal.moe/Eris/docs/Client#event-guildDelete
 * @param {botClient} Client
 * @param {Eris.Guild} Guild
 */
export default async function ( Client, Guild ) {
    if ( process.env.GUILD_WEBHOOK && ( ( process.env.TESTING === "true" && process.env.GUILD_WEBHOOK_ON_TESTING === 'true' ) || process.env.TESTING !== "true" ) ) {
        const [ id, token ] = extractWebhookElements( process.env.GUILD_WEBHOOK )
        Client.executeWebhook( id, token, {
            "embeds": [
                {
                    "title": "Guild Left",
                    "description": `${ Guild.name ?? `*${ Guild.id }*` }`,
                    "color": parseInt( process.env.EMBED_RED ),
                    "timestamp": new Date(),
                    "footer": { "text": `${ Client.getUserString( Client.user ) }`, "icon_url": Client.user.dynamicAvatarURL() },
                    ...( Guild.memberCount ) && {
                        "fields": [
                            {
                                "name": "Members",
                                "value": Guild.memberCount
                            }
                        ]
                    }
                }
            ]
        } ).catch( ( error ) => {
            Logger.warn( `[GUILDS] Failed to post guild delete status: ${ error }` )
        } )
    }
}