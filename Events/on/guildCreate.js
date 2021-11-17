/**
 * @file Create a log every time the bot is added to a server
 */

import Eris from "eris"
import botClient from "../../Classes/Client.js"
import { Logger } from "../../Modules/Logger.js"
import { extractWebhookElements } from "../../Modules/Utilities.js"

/**
 * @event guildCreate
 * @link https://abal.moe/Eris/docs/Client#event-guildCreate
 * @param {botClient} Client
 * @param {Eris.Guild} Guild
 */
export default async function ( Client, Guild ) {
    if ( process.env.GUILD_WEBHOOK && ( ( process.env.TESTING === "true" && process.env.GUILD_WEBHOOK_ON_TESTING === 'true' ) || process.env.TESTING !== "true" ) ) {
        const [ id, token ] = extractWebhookElements( process.env.GUILD_WEBHOOK )
        Client.executeWebhook( id, token, {
            "embeds": [
                {
                    "title": "Guild Joined",
                    "description": `${ Guild.name }\n*${ Guild.id }*`,
                    "color": parseInt( process.env.EMBED_GREEN ),
                    "timestamp": new Date(),
                    "footer": { "text": `${ Client.getUserString( Client.user ) }`, "icon_url": Client.user.dynamicAvatarURL() },
                    "fields": [
                        {
                            "name": "Members",
                            "value": Guild.memberCount,
                            "inline": true
                        },
                        {
                            "name": "Created",
                            "value": new Date( Guild.createdAt ).toDateString(),
                            "inline": true
                        }
                    ]
                }
            ]
        } ).catch( ( error ) => {
            Logger.warn( `[GUILDS] Failed to post guild join status: ${ error }` )
        } )
    }
}