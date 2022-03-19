/**
 * @file The base bot client for each cluster
 */
import { BaseClusterWorker } from "eris-fleet"

/**
 * The bot instance that runs for each cluster
 * @class
 */
export class BotWorker extends BaseClusterWorker {
    constructor( setup ) {
        super( setup )
    }
}