/**
 * @file Manage loading & running of eris client events
 */
import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { Event } from "../Classes/Event.js"

/**
 * Load and manage the running of eris client events
 * @class
 */
export class EventManager {
    constructor( BotWorker ) {
        this.loadEvents( BotWorker )
    }

    /**
     * Import and initialise events from the /Events directory
     * @private
     * @param {import("../bot.js").BotWorker} BotWorker 
     * @param {String} EventDirectory Top level directory where the client events are stored
     */
    async loadEvents ( BotWorker, EventDirectory = "../Events" ) {
        const eventsPath = fileURLToPath( `file://${ path.join( path.dirname( fileURLToPath( import.meta.url ) ), EventDirectory ) }` )
        const events = await fs.readdir( eventsPath )
        let count = 0

        for ( const event of events ) {
            const eventPath = path.join( eventsPath, event )

            if ( ( await fs.lstat( path.join( eventsPath, event ) ) ).isDirectory() && !event.startsWith( "." ) ) {
                await this.loadEvents( BotWorker, `${ EventDirectory }/${ event }` )
            } else if ( event.endsWith( ".js" ) ) {
                const { default: Event } = await import( `file://${ eventPath }` )

                /** @type {Event} */
                const eventFile = new Event( BotWorker )

                eventFile.once ? BotWorker.bot.once( eventFile.name, eventFile.invoke.bind( null, BotWorker ) ) : BotWorker.bot.on( eventFile.name, eventFile.invoke.bind( null, BotWorker ) )
                count += 1
            }
        }
        count > 0 ? console.log( `[EVENT MANAGER] Loaded ${ count } events from ${ EventDirectory.split( "/" ).at( -1 ) }` ) : ''
    }
}