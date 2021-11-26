/**
 * @file An example command file structure with all types of application command
 */

import { Command } from "../Classes/Command.js"
import { Constants } from "eris"

export default class TemplateCommand extends Command {
    constructor() {
        super( {
            "name": "template",
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
}