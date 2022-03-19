/**
 * @file Defines general purpose functions for use throughout the project
 */

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