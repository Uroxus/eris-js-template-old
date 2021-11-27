/**
 * @file An example command file structure with all types of application command
 */

import { Command } from "../Classes/Command.js"
import { Constants, Message } from "eris"

export default class TemplateCommand extends Command {
    constructor() {
        super( {
            "name": "template",
            "aliases": [ "tmplt" ],
            "applicationCommands": [ {
                "name": "template",
                "description": "Template for a slash command",
                "type": Constants.ApplicationCommandTypes.CHAT_INPUT
            }, {
                "name": "Template User Action",
                "type": Constants.ApplicationCommandTypes.USER
            },
            {
                "name": "Template Message Action",
                "type": Constants.ApplicationCommandTypes.MESSAGE
            } ]
        } )
    }

    /**
     * 
     * @param {Message} Message 
     */
    textCommand ( Message ) {
        Message.channel.createMessage( {
            "embeds": [
                {
                    "author": {
                        "name": Message.author.username,
                        "icon_url": Message.author.dynamicAvatarURL()
                    },
                    "thumbnail": {
                        "url": Message.author.dynamicAvatarURL()
                    },
                    "description": "Template text command response",
                    "color": parseInt( process.env.EMBED_DEFAULT )
                }
            ],
            "messageReference": {
                "messageID": Message.id
            }
        } )
    }
}