/**
 * @file Manage loading & running of eris client events
 */
import { Client } from "eris"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import { Event } from "../Classes/Event.js"
import { getJSFiles } from "../Modules/Utilities.js"

/**
 * Load and manage the running of eris client events
 * @class
 */
export class EventManager {
    /**
     * @param {Client} Client 
     */
    constructor( Client ) {
        this.loadEvents( Client )
    }

    /**
     * Import and initialise events from the /Events directory
     * @private
     * @param {Client} Client 
     * @param {String} EventDirectory Top level directory where the client events are stored
     */
    async loadEvents ( Client, EventDirectory = "../Events" ) {
        for await ( const file of getJSFiles( resolve( dirname( fileURLToPath( import.meta.url ) ), EventDirectory ) ) ) {
            const { default: Event } = await import( file )

            /** @type {Event} */
            const eventFile = new Event()

            eventFile.once ? Client.once( eventFile.name, ( ...args ) => eventFile.invoke( Client, ...args ) ) : Client.on( eventFile.name, ( ...args ) => eventFile.invoke( Client, ...args ) )
        }
    }
}