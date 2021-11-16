/**
 * @file Create a log every time a shard encounters an error
 */

import botClient from "../../Classes/Client"
import { Logger } from "../../Modules/Logger"

/**
 * @event error
 * @link https://abal.moe/Eris/docs/Client#event-error
 * @param {botClient} Client
 * @param {Error} Error 
 * @param {Number} shardId 
 */
export default function ( Client, Error, shardId ) {
    Logger.error( `[SHARD] Shard ${ shardId } encountered an error: ${ Error }` )
}