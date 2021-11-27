/**
 * @file Define the actions for any time a message is sent in a visible channel
 */

import { Constants, Message } from "eris"
import botClient from "../../Classes/Client.js"
import { Command } from "../../Classes/Command.js"

/**
 * @event messageCreate
 * @link https://abal.moe/Eris/docs/0.16.1/Client#event-messageCreate
 * @param {botClient} Client
 * @param {Message} Message
 */
export default async function ( Client, Message ) {
    if ( Message.channel.type !== Constants.ChannelTypes.GUILD_TEXT ) return
    if ( Message.author.bot ) return

    if ( new RegExp( "^<@!*&*" + Client.user.id + "+>", 'i' ).test( Message.content ) ) { // Bot was pinged at the start of the message
        Message.content = Message.content.substring( Message.content.indexOf( ">" ) + 1 ).trim().toLowerCase()

        if ( Message.content.length > 0 ) {
            const attemptedCommand = Message.content.split( " " ).filter( Boolean )[ 0 ]

            /** @type {Command} */
            const command = Client.commandManager.fetchCommand( attemptedCommand )

            if ( command ) {
                if ( command.checkClientPermissions( Client, Message ) ) {
                    const userPerms = command.checkUserPermissions( Message )
                    if ( userPerms === true ) {
                        Message.content = Message.content.split( " " ).slice( 1 ).join( " " )
                        command.textCommand( Client, Message )
                    } else if ( userPerms?.error ) {
                        Message.channel.createMessage( { "messageReference": Message.id, "content": userPerms.error } )
                    }
                }
            }
        } else {
            if ( Message.channel.permissionsOf( Client.user.id ).has( 'sendMessages' ) ) {
                Message.channel.createMessage( {
                    "embeds": [
                        {
                            "author": {
                                "name": Client.user.username,
                                "icon_url": Client.user.dynamicAvatarURL()
                            },
                            "thumbnail": {
                                "url": Client.user.dynamicAvatarURL()
                            },
                            "description": "Hello 👋",
                            "color": parseInt( process.env.EMBED_DEFAULT )
                        }
                    ],
                    "messageReference": {
                        "messageID": Message.id
                    }
                } )
            }
        }
    }
}