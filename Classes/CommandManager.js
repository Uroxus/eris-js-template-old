/**
 * @file Manage command caching, publishing and retrieving
 */

import { Command } from "./Command.js"
import { promises as fs } from "fs"
import path from "path"
import { Logger } from "../Modules/Logger.js"
import { fileURLToPath } from "url"

export default class CommandManager {
    constructor( Client ) {
        /**
         * Command name & Command file pairs
         * @type {Map<String, Command>}
         * @public
         */
        this.commandFiles = new Map()

        /**
         * Map alias strings of text-based commands to the raw command name
         * @type {Map<String, String>}
         * @public
         */
        this.aliases = new Map()

        /**
         * Map application commands to the raw command name
         * @type {Map<String, String>}
         * @public
         */
        this.applicationCommands = new Map()

        this.cacheCommands( `../Commands/` )
        //TODO: Publish application commands somewhere
    }

    /**
     * Populate `this.commandFiles` with command callers and their files
     * @param {String} commandDir 
     */
    //TODO: Standardize to lowercase strings
    async cacheCommands ( commandDir ) {
        const commandDirPath = fileURLToPath( `file://${ path.join( path.dirname( fileURLToPath( import.meta.url ) ), commandDir ) }` )
        const files = await fs.readdir( commandDirPath )
        let commandCount = 0

        for ( const commandFile of files ) {
            const commandPath = path.join( commandDirPath, commandFile )

            if ( ( await fs.lstat( commandPath ) ).isDirectory() && !commandFile.startsWith( "." ) ) {
                await this.cacheCommands( `${ commandDir }\\${ commandFile }` )
            } else if ( commandFile.endsWith( ".js" ) ) {
                const { default: CommandClass } = await import( `file://${ commandPath }` )

                /** @type {Command} */
                const targetFile = new CommandClass( this.Client )

                if ( !this.commandFiles.has( targetFile.name ) ) {
                    this.commandFiles.set( targetFile.name, targetFile )
                } else {
                    throw new Error( `Command manager attempted to cache commands with duplicate name ${ targetFile.name } ` )
                }

                if ( targetFile.aliases && targetFile.aliases.length > 0 ) {
                    for ( const alias of targetFile.aliases ) {
                        this.aliases.set( alias, targetFile.name )
                    }
                }

                try {
                    for ( const applicationCommand of targetFile.applicationCommands ) {
                        this.applicationCommands.set( `${ applicationCommand.type || 1 }${ applicationCommand.name }`, targetFile.name )
                    }
                } finally {
                    Logger.debug( `[COMMAND MANAGER] Cached ${ targetFile?.applicationCommands?.length } application commands from ${ targetFile.name }` )
                    commandCount += 1
                }
            }
        }
        Logger.status( `[COMMAND MANAGER] Loaded ${ commandCount }/${ files.filter( file => file.endsWith( ".js" ) ).length } commands from ${ commandDir }` )
    }

    /**
     * Publish any application command updates to Discord
     */
    async publishCommands ( Client ) {
        let applicationCommands = []
        for ( const [ commandName, commandFile ] of this.commandFiles.entries() ) {
            applicationCommands.push( ...commandFile.applicationCommands )
        }
        Logger.debug( `[COMMAND PUBLISHER]: Extracted application command data list: ${ JSON.stringify( applicationCommands, null, 1 ) }` )

        //TODO: Compare cached application command array to the list of existing published commands and make individual changes (or not at all) otherwise there will be client errors while the command cache refreshes
        if ( process.env.TESTING === "true" ) {
            await Client.bulkEditGuildCommands( process.env.TESTING_SERVER, applicationCommands ).catch( ( error ) => Logger.error( `[COMMAND MANAGER] Failed to bulk publish guild application commands: ${ error }` ) )
        } else {
            await Client.bulkEditCommands( applicationCommands ).catch( ( error ) => Logger.error( `[COMMAND MANAGER] Failed to publish application commands: ${ error }` ) )
        }
    }
}