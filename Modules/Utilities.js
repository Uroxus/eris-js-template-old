/**
 * @file Exports useful functions to use throughout the project
 */

const { User } = require( "eris" )

/**
 * From a Discord API webhook link, extract the ID and token
 * @param {String} webhook Webhook URL string
 * @returns {[id: String, token: String]} [id, token]
 * @example https://discord.com/api/webhooks/xxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
 */
module.exports.extractWebhookValues = ( webhook ) => {
    const values = webhook.split( "/" )
    return [ values.at( -2 ), values.at( -1 ) ]
}

/**
 * Get the username#discriminator string of a user
 * @param {User} User
 * @returns {String} name#discrim
 * @example Uroxoos#0420
 */
module.exports.getUserString = ( User ) => {
    return `${ User.username }#${ User.discriminator }`
}