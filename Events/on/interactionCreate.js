/**
 * @file Define the actions for any time an interaction is received
 */

import Eris, { Constants } from "eris"
import botClient from "../../Classes/Client.js"
import { Logger } from "../../Modules/Logger.js"

/**
 * @event interactionCreate
 * @link 
 * @param {botClient} Client
 * @param {Eris.CommandInteraction|Eris.ComponentInteraction} Interaction
 */
export default async function ( Client, Interaction ) {
    if ( Interaction.type === Constants.InteractionTypes.APPLICATION_COMMAND ) {
        const interactionArgs = getApplicationCommandOptions( Interaction.data.options, { "COMMAND": `${ Interaction.data.type }${ Interaction.data.name.toLowerCase() }`, "RESOLVED": Interaction.data?.resolved } )
        const command = Client.commandManager.fetchCommand( `${ Interaction.data.type }${ Interaction.data.name.toLowerCase() }`, true )

        if ( command ) {
            switch ( Interaction.data.type ) {
                case Constants.ApplicationCommandTypes.CHAT_INPUT:
                    command.chatInputCommand( Interaction, interactionArgs )
                    break
                case Constants.ApplicationCommandTypes.USER:
                    command.userAppCommand( Interaction, interactionArgs )
                    break
                case Constants.ApplicationCommandTypes.MESSAGE:
                    command.messageAppCommand( Interaction, interactionArgs )
                    break
            }
        }

    } else if ( Interaction.type === Constants.InteractionTypes.MESSAGE_COMPONENT ) { // Buttons etc
        const command = Client.commandManager.fetchCommand( Interaction.data.custom_id.split( "-" )[ 0 ] )

        if ( command ) {
            command.componentInteraction( Interaction )
        }
    }
}

/**
 * Extract any option values from a given application interaction
 * @param {Eris.InteractionDataOptions} options 
 * @param {{optionKey: userGivenValue}} extractedInformation 
 * @returns extractedInformation
 */
function getApplicationCommandOptions ( options, extractedInformation ) {
    try {
        for ( const option of options ) {
            if ( option.type === Constants.ApplicationCommandOptionTypes.SUB_COMMAND || option.type === Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP ) {
                extractedInformation[ option.type === Constants.ApplicationCommandOptionTypes.SUB_COMMAND ? 'SUB_COMMAND' : 'SUB_COMMAND_GROUP' ] = option.name
            } else {
                extractedInformation[ option.name ] = option.value
            }
            if ( option.options ) getApplicationCommandOptions( option.options, extractedInformation )
        }
    } catch ( error ) {
    } finally {
        Logger.debug( `Extracted application command options: ${ JSON.stringify( extractedInformation ) }` )
        return extractedInformation
    }
}