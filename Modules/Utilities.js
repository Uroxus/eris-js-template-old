/**
 * @file Defines general purpose functions for use throughout the project
 */
import { readdir } from "fs/promises"

/**
 * From a Discord API webhook link, extract the ID and token
 * @param {String} webhook Webhook URL string
 * @returns {[id: String, token: String]} [id, token]
 * @example https://discord.com/api/webhooks/xxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
 */
export function extractWebhookValues ( webhook ) {
    const values = webhook.split( "/" )
    return [ values.at( -2 ), values.at( -1 ) ]
}

/**
 * Scan for and return an absolute filepath for all js files from a given directory (includes nested)
 * @param {String} Directory Absolute path to highest level directory to scan from
 * @param {Boolean} [includeNested=false]
 * @example import { resolve, dirname } from "path"; import { fileURLToPath } from "url"; resolve( dirname( fileURLToPath( import.meta.url ) ), [relativePath]
 */
export async function* getJSFiles ( Directory, includeNested = false ) {
    const dirContents = await readdir( Directory, { withFileTypes: true } )
    for ( const item of dirContents ) {
        const itemName = Directory + ( Directory.charAt( -1 ) !== "/" ? "/" : "" ) + item.name
        if ( item.isDirectory() ) {
            yield* getJSFiles( itemName )
        } else if ( itemName.endsWith( ".js" ) ) {
            yield `file://${ itemName }`
        }
    }
}