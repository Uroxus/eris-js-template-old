/**
 * @file Exports useful functions to use throughout the project
 */

import { User } from "eris"

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
 * Get the username#discriminator string of a user
 * @param {User} User
 * @returns {String} name#discrim
 * @example Uroxoos#0420
 */
export function getUserString ( User ) {
    return `${ User.username }#${ User.discriminator }`
}