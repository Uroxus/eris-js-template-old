import { BotClient } from "../../../../Classes/Client.js"
import { Event } from "../../../../Classes/Event.js"
import { EmbedColours } from "../../../../Constants/Message.js"
import Eris, { Message, Constants } from "eris"
import { getUserString } from "../../../../Modules/Utilities.js"
import { extractWebhookValues } from "../../../../Modules/Utilities.js"

/**
 * @class
 * @event messageUpdate
 * @link https://abal.moe/Eris/docs/Client#event-messageUpdate
 */
export default class MessageUpdate extends Event {
    constructor() {
        super( 'messageUpdate' )
    }

    /**
     * Called every time the bot receives an event of this type
     * @param {BotClient} BotClient 
     * @param {Message} Message 
     * @param {Object?} oldMessage 
     */
    async invoke ( BotClient, Message, oldMessage ) {
        if ( !Message.channel?.guild ) return // Only log guild events
        if ( Message?.embeds?.length !== 0 && ( oldMessage?.embeds?.length === undefined || oldMessage?.embeds?.length === 0 ) ) return // Ignore messages with embeds
        if ( Message.flags & Constants.MessageFlags.CROSSPOSTED ) return // Ignore messages in News channels
        if ( Message.content === oldMessage?.content ) return

        this.debug( `received update to ${ Message }` )

        if ( process.env.MODLOGS_WEBHOOK && ( ( process.env.TESTING === "true" && process.env.MODLOGS_WEBHOOK_ON_TESTING === "true" ) || process.env.TESTING !== "true" ) ) {
            const [ id, token ] = extractWebhookValues( process.env.MODLOGS_WEBHOOK )

            BotClient.executeWebhook( id, token, {
                /** @type {[Eris.EmbedOptions]} */
                "embeds": [
                    {
                        "author": {
                            "name": getUserString( Message.author ),
                            "icon_url": Message.author.dynamicAvatarURL()
                        },
                        "thumbnail": {
                            "url": Message.author.dynamicAvatarURL()
                        },

                        "description": `**Message updated in <#${ Message.channel.id }>**\n**Author:** <@${ Message.author.id }>\n[Jump to message](${ Message.jumpLink })`,
                        "fields": [
                            {
                                "name": "Before",
                                "value": oldMessage?.content?.length > 1024 ? `${ oldMessage.content.substring( 0, 1021 ) }...` : ( oldMessage?.content || '*Unknown*' )
                            },
                            {
                                "name": "After",
                                "value": Message.content.length > 1024 ? `${ Message.content.substring( 0, 1021 ) }...` : Message.content
                            },
                        ],

                        "footer": {
                            "text": `${ Message.author.id }'s message update`,
                        },
                        "timestamp": new Date(),
                        "color": EmbedColours.orange
                    }
                ]
            } ).catch( ( error ) => {
                this.logger.alert( `[MESSAGE UPDATE] Failed to log update of a message by ${ Message.author.id }... ${ error }` )
            } )
        }
    }
}