/**
 * @file Export useful functions used throughout the project
 */

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