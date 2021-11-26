/**
 * @file Define a structure for all commands available within the bot
 */

import Eris, { Interaction } from "eris"

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

    /**
     * Process a received slash command 
     * @param {Interaction} Interaction 
     * @param {*} interactionData 
     */
    async chatInputCommand ( Interaction, interactionData ) { }

    /**
     * Process a received user application command
     * @param {Interaction} Interaction 
     * @param {*} interactionData 
     */
    async userAppCommand ( Interaction, interactionData ) { }

    /**
     * Process a received message application command
     * @param {Interaction} Interaction
     * @param {*} interactionData
     */
    async messageAppCommand ( Interaction, interactionData ) { }

    /**
     * Process a received component (button, drop down) interaction
     * @param {Interaction} Interaction 
     */
    async componentInteraction ( Interaction ) { }
}
