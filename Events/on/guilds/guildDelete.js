const { Event } = require( "../../../Classes/Event.js" )
const { EmbedColours } = require( "../../../Constants/Message.js" )
const { Guild, EmbedOptions } = require( "eris" )
const { extractWebhookValues } = require( "../../../Modules/Utilities.js" )

/**
 * @class
 * @event guildDelete
 * @link https://abal.moe/Eris/docs/Client#event-guildDelete
 */
export default class GuildDelete extends Event {
    constructor() {
        super( 'guildDelete' )
    }

    /**
     * Called every time the bot receives an event of this type
     * @param {import("../Classes/Client.js").BotClient} BotClient 
     * @param {Guild} Guild
     */
    async invoke ( BotClient, Guild ) {
        this.debug( `Guild ${ Guild.name } - ${ Guild.id } deleted` )
        this.logger.info( `[GUILD DELETED] ${ Guild.name } - ${ Guild.id } ${ Guild.memberCount ? `| Members: ${ Guild.memberCount }` : '' } ${ Guild.ownerID ? `| Owner: ${ Guild.ownerID }` : '' }` )

        if ( !BotClient.unavailableGuilds.has( Guild.id ) ) {
            if ( process.env.GUILDS_WEBHOOK && ( ( process.env.TESTING === "true" && process.env.GUILDS_WEBHOOK_ON_TESTING === "true" ) || process.env.TESTING !== "true" ) ) {
                const [ id, token ] = extractWebhookValues( process.env.GUILDS_WEBHOOK )

                BotClient.executeWebhook( id, token, {
                    /** @type {[EmbedOptions]} */
                    "embeds": [
                        {
                            "title": `**Left** ${ Guild.name }`,
                            "description": `*${ Guild.id }*`,
                            "color": EmbedColours.red,
                            "timestamp": new Date(),
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
                    this.logger.alert( `[GUILD DELETE] Failed to log deletion of guild ${ Guild.name } - ${ Guild.id }... ${ error }` )
                } )
            }
        }
    }
}