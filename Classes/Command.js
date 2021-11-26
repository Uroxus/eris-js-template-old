/**
 * @file Define a structure for all commands available within the bot
 */

import Eris from "eris"

export class Command {
    /**
     * Define a new command
     * @param {Object} config 
     * @param {String} config.name The name of the command
     * @param {Array<String>=} config.aliases 
     * @param {Array<Eris.ChatInputApplicationCommandStructure|Eris.UserApplicationCommandStructure|Eris.MessageApplicationCommandStructure>=} config.applicationCommands
     */
    constructor( config ) {
        this.name = config.name
        this.aliases = config.aliases

        this.applicationCommands = config.applicationCommands
    }
}
