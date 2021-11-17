/**
 * @file Initialise event listeners
 */

import { promises as fs } from "fs"
import { fileURLToPath } from "url"
import * as path from "path"
import { Logger } from "./Logger.js"

/**
 * Load and event listeners
 * @param {botClient} Client 
 * @param {String} directory 
 */
export async function loadEvents ( Client, directory = "../Events" ) {
    const eventsDir = fileURLToPath( `file://${ path.join( path.dirname( fileURLToPath( import.meta.url ) ), directory ) }` )
    const files = await fs.readdir( eventsDir )
    let eventCount = 0

    for ( const event of files ) {
        const loc = path.join( eventsDir, event )

        if ( ( await fs.lstat( path.join( eventsDir, event ) ) ).isDirectory() && !event.startsWith( "." ) ) {
            await loadEvents( Client, `${ directory }/${ event }` )
        } else if ( event.endsWith( ".js" ) ) {
            const eventFile = await import( `file://${ loc }` )
            loc.includes( "once/" ) || loc.includes( "once\\" ) ? Client.once( event.split( "." )[ 0 ], ( ...args ) => eventFile.default( Client, ...args ) ) : Client.on( event.split( "." )[ 0 ], ( ...args ) => eventFile.default( Client, ...args ) )
            eventCount += 1
        }
    }

    eventCount > 0 ? Logger.status( `[EVENT LOADER] Loaded ${ eventCount } events from ${ directory }` ) : ''
}
