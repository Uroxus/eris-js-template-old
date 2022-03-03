const { Event } = require( "../../../Classes/Event.js" )
const { EmbedColours } = require( "../../../Constants/Message.js" )
const { Guild, Member, EmbedOptions } = require( "eris" )
const { extractWebhookValues } = require( "../../../Modules/Utilities.js" )
const { getUserString } = require( "../../../../Modules/Utilities.js" )

/**
 * @class
 * @event guildMemberAdd
 * @link https://abal.moe/Eris/docs/Client#event-guildMemberAdd
 */
export default class GuildMemberAdd extends Event {
    constructor() {
        super( 'guildMemberAdd' )

        this.newAccountThreshhold = 7 // Days
        this.kickNewAccounts = true
    }

    /**
     * Called every time the bot receives an event of this type
     * @param {import("../Classes/Client.js").BotClient} BotClient 
     * @param {Guild} Guild 
     * @param {Member} Member 
     */
    async invoke ( BotClient, Guild, Member ) {
        const isNewAccount = Date.now() - Member.createdAt < ( this.newAccountThreshhold * 86400000 )

        if ( process.env.MODLOGS_WEBHOOK && ( ( process.env.TESTING === "true" && process.env.MODLOGS_WEBHOOK_ON_TESTING === "true" ) || process.env.TESTING !== "true" ) ) {
            const [ id, token ] = extractWebhookValues( process.env.MODLOGS_WEBHOOK )

            BotClient.executeWebhook( id, token, {
                /** @type {[EmbedOptions]} */
                "embeds": [
                    {
                        "author": {
                            "name": "Member Joined",
                            "icon_url": Message.author.dynamicAvatarURL()
                        },
                        "thumbnail": {
                            "url": Message.author.dynamicAvatarURL()
                        },

                        "description": `<@${ Member.id }>\n${ getUserString( Member.user ) }\nAccount created: **${ moment( Member.createdAt ).fromNow( true ) }** ago`,
                        ...( isNewAccount ) && {
                            "fields": [
                                {
                                    "name": "Warning",
                                    "value": "🍼 | New account"
                                }
                            ]
                        },

                        "footer": {
                            "text": `${ Member.user.id } joined`,
                        },
                        "timestamp": new Date(),
                        "color": EmbedColours.green
                    }
                ]
            } ).catch( ( error ) => {
                this.logger.alert( `[MEMBER ADDED] Failed to log new member (${ Member }) message in guild ${ Guild.name } (${ Guild.id })... ${ error }` )
            } )
        }

        if ( this.kickNewAccounts && isNewAccount ) Member.kick( "Suspicious account" ).catch( ( error ) => this.logger.alert( `[MEMBER KICK] Failed to kick suspicious user ${ Member.user.id }... ${ error }` ) )
    }
}