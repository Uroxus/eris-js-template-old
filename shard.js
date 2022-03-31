/**
 * @file The base bot client for each cluster
 */
import { BaseClusterWorker } from "eris-fleet"
import { EventManager } from "./Managers/EventManager.js"

/**
 * The bot instance that runs for each cluster
 * @class
 */
export class Shard extends BaseClusterWorker {
    constructor( setup ) {
        super( setup )

        this.EventManager = new EventManager( this.bot )
    }
}