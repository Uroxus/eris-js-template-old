/**
 * @file Manage loading & running of BotClient events
 */
const fs = require( "fs" )
const path = require( "path" )
const { fileURLToPath } = require( "url" )
const { Logger } = require( "../Modules/Logger.js" )

module.exports.EventManager = class {
    /**
     * Define a new EventManager and load all events in the /Events directory
     * @param {import("../Classes/Client.js").BotClient} BotClient 
     */
    constructor( BotClient ) {
        /** @private */
        this.BotClient = BotClient

        this._loadEvents( BotClient )
    }

    /**
     * Import and initialise events from the /Events directory
     * @param {import("../Classes/Client.js").BotClient} BotClient 
     * @param {String} EventDirectory Relative path to the event directory to be read to find event files
     * @private
     */
    async _loadEvents ( BotClient, EventDirectory = '../Events' ) {
        const eventsPath = fileURLToPath( `file://${ path.join( __dirname, EventDirectory ) }` )
        let count = 0

        await fs.readdir( ( eventsPath ), ( error, events ) => {
            for ( const event of events ) {
                const eventPath = path.join( eventsPath, event )

                if ( fs.lstatSync( eventPath ).isDirectory() && !event.startsWith( "." ) ) {
                    this._loadEvents( BotClient, `${ EventDirectory }/${ event }` )
                } else if ( event.endsWith( ".js" ) ) {
                    delete require.cache[ require.resolve( eventPath ) ]

                    /** @type {import("../Classes/Event.js").Event} */
                    const eventFile = new ( require( eventPath ) )

                    eventFile.once ? BotClient.once( eventFile.name, ( ...args ) => eventFile.invoke( BotClient, ...args ) ) : BotClient.on( eventFile.name, ( ...args ) => eventFile.invoke( BotClient, ...args ) )
                    count += 1
                }
            }
            count > 0 ? Logger.info( `[EVENT MANAGER] Loaded ${ count } events from ${ EventDirectory.split( "/" ).at( -1 ) }` ) : ''
        } )
    }

    async reload () {
        await this.BotClient.removeAllListeners()
        this._loadEvents( this.BotClient )
    }
}