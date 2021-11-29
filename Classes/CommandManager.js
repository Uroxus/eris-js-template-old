/**
 * @file Manage command caching, publishing and retrieving
 */

import { Command } from "./Command.js"
import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { Logger } from "../Modules/Logger.js"
import botClient from "./Client.js"

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
    }

    /**
     * Create a map entry in `this.commandFiles` of commandFile.name.toLowerCase() -> Command
     * @private
     * @param {Command} commandFile 
     */
    _cacheBaseCommand ( commandFile ) {
        if ( !this.commandFiles.has( commandFile.name.toLowerCase() ) ) {
            this.commandFiles.set( commandFile.name.toLowerCase(), commandFile )
        } else {
            throw new Error( `[COMMAND MANAGER] Attempted to cache command with a duplicate name ${ commandFile.name.toLowerCase() }` )
        }
    }

    /**
     * Create a map entry in `this.aliases` of [command alias].toLowerCase() -> commandFile.name.toLowerCase()
     * @private
     * @param {Command} commandFile 
     */
    _cacheAliases ( commandFile ) {
        if ( commandFile?.aliases?.length > 0 ) {
            for ( const alias of commandFile.aliases ) {
                if ( !this.commandFiles.has( alias.toLowerCase() ) && !this.aliases.has( alias.toLowerCase() ) ) {
                    this.aliases.set( alias.toLowerCase(), commandFile.name.toLowerCase() )
                } else {
                    throw new Error( `[COMMAND MANAGER] Attempted to cache alias which already exists ${ alias }` )
                }
            }
            Logger.debug( `[COMMAND MANAGER] [ALIASES] Cached ${ commandFile.aliases.length } aliases for ${ commandFile.name }` )
        }
    }

    /**
     * Create a map entry in `this.applicationCommands` of [application command type][application command name.toLowerCase()] ->  commandFile.name.toLowerCase()
     * @private
     * @param {Command} commandFile 
     */
    _cacheApplicationCommand ( commandFile ) {
        if ( commandFile?.applicationCommands?.length > 0 ) {
            for ( const applicationCommand of commandFile.applicationCommands ) {
                if ( !this.applicationCommands.has( `${ applicationCommand.type || 1 }${ applicationCommand.name.toLowerCase() } ` ) ) {
                    this.applicationCommands.set( `${ applicationCommand.type || 1 }${ applicationCommand.name.toLowerCase() }`, commandFile.name.toLowerCase() )
                } else {
                    throw new Error( `[COMMAND MANAGER] Attempted to cache application command with same name & type: ${ applicationCommand.type || 1 }${ applicationCommand.name.toLowerCase() }` )
                }
            }
            Logger.debug( `[COMMAND MANAGER] [APPLICATION COMMANDS] Cached ${ commandFile.applicationCommands.length } commands from ${ commandFile.name }` )
        }
    }

    /**
     * Populate `this.commandFiles` with command callers and their files
     * @param {String} commandDir 
     */
    async cacheCommands ( commandDir ) {
        const commandDirPath = fileURLToPath( `file://${ path.join( path.dirname( fileURLToPath( import.meta.url ) ), commandDir ) }` )
        const files = await fs.readdir( commandDirPath )
        let commandCount = 0

        for ( const commandFile of files ) {
            const commandPath = path.join( commandDirPath, commandFile )

            if ( ( await fs.lstat( commandPath ) ).isDirectory() && !commandFile.startsWith( "." ) ) {
                await this.cacheCommands( `${ commandDir }\\${ commandFile } ` )

            } else if ( commandFile.endsWith( ".js" ) ) {
                const { default: CommandClass } = await import( `file://${ commandPath }` )
                commandCount += 1

                /** @type {Command} */
                const targetFile = new CommandClass( this.Client )

                this._cacheBaseCommand( targetFile )
                this._cacheAliases( targetFile )
                this._cacheApplicationCommand( targetFile )
            }
        }
        Logger.status( `[COMMAND MANAGER] Loaded ${ commandCount } /${ files.filter( file => file.endsWith( ".js" ) ).length } commands from ${ commandDir }` )
    }

    /**
     * Get the command file from the raw command collection, aliases or application command names
     * @param {String} commandName 
     * @param {Boolean} [expectedApplicationCommand=false] If true will search only the application command cache, otherwise search base command names and aliases
     * @returns {Object|undefined} The instantiated command object or undefined
     */
    fetchCommand ( commandName, expectedApplicationCommand = false ) {
        return ( expectedApplicationCommand ? this.commandFiles.get( this.applicationCommands.get( commandName ) ) : this.commandFiles.get( commandName ) || this.commandFiles.get( this.aliases.get( commandName ) ) ) ?? undefined
    }

    /**
     * Publish any application command updates to Discord
     * @param {botClient} Client
     */
    async publishCommands ( Client ) {
        let applicationCommands = []
        for ( const [ commandName, commandFile ] of this.commandFiles.entries() ) {
            if ( commandFile.applicationCommands ) {
                applicationCommands.push( ...commandFile.applicationCommands )
            }
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