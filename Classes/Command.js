/**
 * @file Define a structure for all commands available within the bot
 */

import Eris, { CommandInteraction, Message } from "eris"
import botClient from "./Client.js"

export class Command {
    /**
     * Define a new command
     * @param {Object} config 
     * @param {String} config.name The base name of the command
     * @param {Array<String>=} config.aliases Alternative text-channel inputs to trigger the command
     * @param {Array<Eris.ChatInputApplicationCommandStructure|Eris.UserApplicationCommandStructure|Eris.MessageApplicationCommandStructure>=} config.applicationCommands Application command data structures
     * @param {Boolean=} config.isDevOnly Whether to limit command use only to the developer
     * @param {Array<Eris.Constants.Permissions>=} config.clientPermissions
     * @param {Array<Eris.Constants.Permissions>=} config.userPermissions
     */
    constructor( config ) {
        this.name = config.name
        this.aliases = config.aliases

        this.applicationCommands = config.applicationCommands

        // Command Permissions
        this.isDevOnly = config.isDevOnly
        this.clientPermissions = config.clientPermissions || [ 'sendMessages', 'embedLinks' ]
        this.userPermissions = config.userPermissions
    }

    /**
     * Check whether a user is authorised to use a command
     * @param {Message} Message 
     * @returns {Boolean} Whether or not the user is authorised
     */
    checkUserPermissions ( Message ) {
        if ( !this.isDevOnly && !this.userPermissions ) return true // No use restriction
        if ( Message.author.id === process.env.DEV_ID ) return true // Dev can do anything
        if ( this.isDevOnly && !Message.author.id === process.env.DEV_ID ) return false // Prevent randoms using dev command

        if ( this.userPermissions ) {
            const missingPerms = this.userPermissions.filter( ( permission ) => {
                return !Message.member.permissions.has( permission )
            } )

            if ( missingPerms.length > 0 ) return {
                "authorised": false,
                "error": `You are missing the following permissions: ${ missingPerms.join( ", " ) }`
            }
        }
        return true
    }

    /**
     * Check whether the bot client is authorised to respond to commands
     * @param {botClient} Client
     * @param {Message} Message 
     * @returns {Boolean} Whether or not the bot client has sufficient channel permissions to respond properly
     */
    checkClientPermissions ( Client, Message ) {
        const missingPerms = this.clientPermissions.filter( ( permission ) => {
            return !Message.channel.permissionsOf( Client.user.id ).has( permission )
        } )

        return !( missingPerms.length > 0 )
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
     * @param {botClient} Client
     * @param {Message} Message
     */
    async textCommand ( Client, Message ) { }
}
