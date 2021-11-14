/**
 * @file Create a log the first time all shards turn ready
 */

import botClient from "../../Classes/Client";
import { Logger } from "../../Modules/Logger";

/**
 * @event ready
 * @link https://abal.moe/Eris/docs/Client#event-ready
 */
export default async function () {
    Logger.status( `[SHARD] ALL - Connection Established` )
}