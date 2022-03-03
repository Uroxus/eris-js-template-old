/**
 * @file index starts the bot instance
 */
const Debug = require( "debug" )
const defualtArgFormat = Debug.formatArgs

Debug.formatArgs = function ( args ) {
    this.namespace = this.namespace.padEnd( 36, "." )
    defualtArgFormat.call( this, args )
}


const { BotClient } = require( "./Classes/Client.js" )
const { ClientOptions } = require( "./Constants/Client.js" )

new BotClient( ( process.env.TESTING === "true" ? process.env.DEV_TOKEN : process.env.PROD_TOKEN ), ClientOptions )