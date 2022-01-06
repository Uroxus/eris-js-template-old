/**
 * @file Check status of or add a user to the blacklist which will prevent them from interacting with the bot
 */

import { Command } from '../../Classes/Command.js'
import { inspect } from 'util'
import { ComponentInteraction, Constants } from 'eris'
import BlacklistModel from "../../Models/Blacklist.js"

export default class Blacklist extends Command {
    constructor( Client ) {
        super( Client, {
            "name": "blacklist",
            "aliases": [ "bl" ],
            "isDevOnly": true,
            "applicationCommands": [ {
                "name": "blacklist",
                "description": "Prevent a user from interacting with the bot",
                "type": Constants.ApplicationCommandTypes.CHAT_INPUT,
                "options": [
                    {
                        "name": "user",
                        "description": "The user in which to blacklist",
                        "type": Constants.ApplicationCommandOptionTypes.USER,
                        "required": true
                    },
                    {
                        "name": "duration",
                        "description": "How long to blacklist for",
                        "type": Constants.ApplicationCommandOptionTypes.NUMBER,
                        "required": true
                    },
                    {
                        "name": "scope",
                        "description": "The scope of the action",
                        "type": Constants.ApplicationCommandOptionTypes.STRING,
                        "choices": [
                            {
                                "name": "minutes",
                                "value": "minutes"
                            },
                            {
                                "name": "hours",
                                "value": "hours"
                            },
                            {
                                "name": "days",
                                "value": "days"
                            },
                            {
                                "name": "weeks",
                                "value": "weeks"
                            }
                        ],
                        "required": true
                    },
                    {
                        "name": "notes",
                        "description": "Reasoning for the blacklist or any other additional information",
                        "type": Constants.ApplicationCommandOptionTypes.STRING,
                        "required": false
                    },
                ]
            } ]
        } )
    }

    /**
     * @param {Message} Message
     */
    async textCommand ( Message ) {

    }


    async chatInputCommand ( Interaction, interactionData ) {

    }
}

async function blacklistUser ( user, endTimestamp, moderator, notes ) {

}


/**
 * Blacklists should also be recorded in a players' document to keep a history record instead of deleted after expiary
*/