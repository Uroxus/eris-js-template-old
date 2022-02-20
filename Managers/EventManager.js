/**
 * @file Manage loading & running of BotClient events
 */

import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { Event } from "../Classes/Event.js"

export class EventManager {
    constructor( BotClient ) {
        this._loadEvents( BotClient )
    }

    async _loadEvents ( BotClient, EventDirectory = '../Events' ) {
        const eventsPath = fileURLToPath( `file://${ path.join( path.dirname( fileURLToPath( import.meta.url ) ), EventDirectory ) }` )
        const events = await fs.readdir( eventsPath )

        for ( const event of events ) {
            const eventPath = path.join( eventsPath, event )

            if ( ( await fs.lstat( path.join( eventsPath, event ) ) ).isDirectory() && !event.startsWith( "." ) ) {
                await this._loadEvents( BotClient, `${ EventDirectory }/${ event }` )
            } else if ( event.endsWith( ".js" ) ) {
                const { default: Event } = await import( `file://${ eventPath }` )

                /** @type {Event} */
                const eventFile = new Event( BotClient )

                eventFile.once ? BotClient.once( eventFile.name, ( ...args ) => eventFile.invoke( BotClient, ...args ) ) : BotClient.on( eventFile.name, ( ...args ) => eventFile.invoke( BotClient, ...args ) )
            }
        }
    }
}