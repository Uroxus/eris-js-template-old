/**
 * @file Exports useful functions to use throughout the project
 */

/**
 * 
 * @param {String} webhook Webhook URL string
 * @returns {[id: String, token: String]} [id, token]
 * @example https://discord.com/api/webhooks/xxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
 */
export function extractWebhookValues ( webhook ) {
    const values = webhook.split( "/" )
    return [ values.at( -2 ), values.at( -1 ) ]
}