/**
 * @file Enable the developer to execute JavaScript commands through Discord messages
 */

import { Command } from '../../Classes/Command.js'
import { inspect } from 'util'
import botClient from '../../Classes/Client.js'
import { ComponentInteraction } from 'eris'

export default class Eval extends Command {
    constructor() {
        super( {
            "name": "eval",
            "aliases": [ "e" ],
            "isDevOnly": true
        } )
    }

    /**
     * @param {botClient} Client
     * @param {Message} Message
     */
    async textCommand ( Client, Message ) {
        if ( !Message.content.toLowerCase().includes( "token" ) ) {
            let output, resultType

            try {
                output = await awaitEval( Message.content ).catch( ( err ) => eval( Message.content ) )
            } catch ( error ) {
                output = `${ error.message }`
            }

            if ( typeof output !== "string" ) {
                resultType = typeof output
                output = inspect( output, { depth: 1 } )
            }

            const cleaned = clean( output )

            Message.channel.createMessage( {
                "messageReference": {
                    "messageID": Message.id
                },
                "embeds": [
                    {
                        "fields": [
                            {
                                "name": `\`📥 Input\``,
                                "value": `\`\`\`js\n${ Message.content.length >= 1024 ? Message.content.substring( 0, 1010 ) + "..." : Message.content } \`\`\``
                            },

                            {
                                "name": `\`📤 Output\``,
                                "value": `\`\`\`js\n${ cleaned.length >= 1024 ? cleaned.substring( 0, 1010 ) + "..." : cleaned } \`\`\``
                            },

                            {
                                "name": `\`<Return Type>\``,
                                "value": `\`\`\`js\n${ resultType || typeof output }\`\`\``
                            },
                        ],
                        "footer": { "text": `${ Client.getUserString( Client.user ) }`, "icon_url": Client.user.dynamicAvatarURL() },
                        "timestamp": new Date()
                    }
                ],
                "components": [
                    {
                        "type": 1,
                        "components": [
                            {
                                "type": 2,
                                "style": 4,
                                "emoji": {
                                    "name": "trashcan",
                                    "id": "880525129401127002"
                                },
                                "custom_id": "eval-delete"
                            }
                        ]

                    }
                ]
            } )
        } else {
            Message.channel.createMessage( {
                "messageReference": {
                    "messageID": Message.id
                },
                "content": "(╯°□°)╯︵ ┻━┻ Protect the token!"
            } )
        }
    }

    /**
     * Enable the developer to delete the bots' eval reply
     * @param {ComponentInteraction} Interaction 
     */
    async componentInteraction ( Interaction ) {
        if ( Interaction?.member?.id === process.env.DEV_ID ) {
            await Interaction.acknowledge()
            Interaction.deleteOriginalMessage()
        }
    }
}

const awaitEval = ( input ) => {
    return new Promise( ( resolve, reject ) => {
        resolve( eval( input ) )
    } )
}

const clean = ( text ) => {
    if ( typeof ( text ) === "string" )
        return text.replace( /`/g, "`" + String.fromCharCode( 8203 ) ).replace( /@/g, "@" + String.fromCharCode( 8203 ) )
    else
        return text.toString()
}