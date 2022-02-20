import { BotClient } from "../../Classes/Client.js"
import { Event } from "../../Classes/Event.js"
import { EmbedColours } from "../../Constants/Message.js"
import { Guild } from "eris"

/**
 * @class
 * @event guildCreate
 * @link https://abal.moe/Eris/docs/Client#event-guildCreate
 */
export default class GuildCreate extends Event {
    constructor() {
        super( 'guildCreate' )
    }

    /**
     * Called every time the bot receives an event of this type
     * @param {BotClient} BotClient 
     * @param {Guild} Guild
     */
    async invoke ( BotClient, Guild ) {
        this.debug( `Guild ${ Guild.name } - ${ Guild.id } created` )
        this.logger.info( `[GUILD CREATED] ${ Guild.name } - ${ Guild.id } ${ Guild.memberCount ? `| Members: ${ Guild.memberCount }` : '' } ${ Guild.ownerID ? `| Owner: ${ Guild.ownerID }` : '' }` )

        if ( process.env.GUILDS_WEBHOOK && ( ( process.env.TESTING === "true" && process.env.GUILDS_WEBHOOK_ON_TESTING === "true" ) || process.env.TESTING !== "true" ) ) {
            const [ id, token ] = extractWebhookValues( process.env.GUILDS_WEBHOOK )

            BotClient.executeWebhook( id, token, {
                "embeds": [
                    {
                        "title": `**Joined** ${ Guild.name }`,
                        "description": `*${ Guild.id }*`,
                        "color": parseInt( EmbedColours.green ),
                        "timestamp": new Date(),
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
                this.logger.alert( `[GUILD CREATE] Failed to log creation of guild ${ Guild.name } - ${ Guild.id }... ${ error }` )
            } )
        }
    }
}