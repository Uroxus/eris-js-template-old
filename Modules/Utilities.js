/**
 * @file Export useful functions used throughout the project
 */
import { promises as fs } from "fs"
import path from "path"

/**
 * Extract the ID & token from a webhook URL
 * @param {String} webhook The webhook URL string
 * @returns {[id: String, token: String]} [id, token]
 * @example https://discord.com/api/webhooks/xxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
 */
export function extractWebhookElements ( webhook ) {
    const elements = webhook.split( "/" )
    return [ elements.at( -2 ), elements.at( -1 ) ]
}

/**
 * Get a list of filenames from a given directory 
 * @param {String} directory The path to the directory where the files are expected
 * @returns {Array<String>} Filenames of the things found in the directory
 */
export function fetchFilesFromDirectory ( directory ) {
    return ( await fs.readdir( fileURLToPath( `file://${ path.join( path.dirname( fileURLToPath( import.meta.url ) ), directory ) }` ) ) )
}