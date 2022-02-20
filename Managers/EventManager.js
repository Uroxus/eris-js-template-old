/**
 * @file Manage loading & running of BotClient events
 */
import { BotClient } from "../Classes/Client.js"
import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { Event } from "../Classes/Event.js"
import { Logger } from "../Modules/Logger.js"

export class EventManager {
    /**
     * Define a new EventManager and load all events in the /Events directory
     * @param {BotClient} BotClient 
     */
    constructor( BotClient ) {
        this._loadEvents( BotClient )
    }

    /**
     * 
     * @param {BotClient} BotClient 
     * @param {String} EventDirectory Relative path to the event directory to be read to find event files
     */
    async _loadEvents ( BotClient, EventDirectory = '../Events' ) {
        const eventsPath = fileURLToPath( `file://${ path.join( path.dirname( fileURLToPath( import.meta.url ) ), EventDirectory ) }` )
        const events = await fs.readdir( eventsPath )
        let count = 0

        for ( const event of events ) {
            const eventPath = path.join( eventsPath, event )

            if ( ( await fs.lstat( path.join( eventsPath, event ) ) ).isDirectory() && !event.startsWith( "." ) ) {
                await this._loadEvents( BotClient, `${ EventDirectory }/${ event }` )
            } else if ( event.endsWith( ".js" ) ) {
                const { default: Event } = await import( `file://${ eventPath }` )

                /** @type {Event} */
                const eventFile = new Event( BotClient )

                eventFile.once ? BotClient.once( eventFile.name, ( ...args ) => eventFile.invoke( BotClient, ...args ) ) : BotClient.on( eventFile.name, ( ...args ) => eventFile.invoke( BotClient, ...args ) )
                count += 1
            }
        }
        count > 0 ? Logger.info( `[EVENT MANAGER] Loaded ${ count } events from ${ EventDirectory.split( "/" ).at( -1 ) }` ) : ''
    }
}