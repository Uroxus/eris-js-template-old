/**
 * @file Define a structure for all commands available within the bot
 */

import Eris, { CommandInteraction, Message } from "eris"

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
     * @param {CommandInteraction} Interaction 
     * @param {*} interactionData 
     */
    async chatInputCommand ( Interaction, interactionData ) {
        Interaction.createMessage( `[Chat Input] Hello` )
    }

    /**
     * Process a received user application command
     * @param {CommandInteraction} Interaction
     * @param {*} interactionData 
     */
    async userAppCommand ( Interaction, interactionData ) {
        Interaction.createMessage( `[User App] Hello` )
    }

    /**
     * Process a received message application command
     * @param {CommandInteraction} Interaction
     * @param {*} interactionData
     */
    async messageAppCommand ( Interaction, interactionData ) {
        Interaction.createMessage( `[Message App] Hello` )
    }

    /**
     * Process a received component (button, drop down) interaction
     * @param {Interaction} Interaction 
     */
    async componentInteraction ( Interaction ) { }

    /**
     * Process a text channel message command
     * @param {Message} Message
     */
    async textCommand ( Message ) { }
}
