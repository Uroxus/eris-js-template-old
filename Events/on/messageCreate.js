/**
 * @file Define the actions for any time a message is sent in a visible channel
 */
import { Event } from "../../Classes/Event.js"
import { Message } from "eris"

/**
 * @class
 * @event messageCreate
 * @link https://abal.moe/Eris/docs/0.16.1/Client#event-messageCreate
 */
export default class MessageCreate extends Event {
    constructor() {
        super( 'messageCreate' )
    }

    /**
     * Called every time the bot receives a message
     * @param {import("../../bot.js").BotWorker} BotWorker
     * @param {Message} Message
     * @returns 
     */
    async invoke ( BotWorker, Message ) {
        if ( Message.author.bot ) return

        Message.channel.createMessage( 'i hope this changes' )
    }
}