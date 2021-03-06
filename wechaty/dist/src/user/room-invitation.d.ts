import { Accessory } from '../accessory';
import { Acceptable } from '../types';
import { Contact } from './contact';
/**
 *
 * accept room invitation
 */
export declare class RoomInvitation extends Accessory implements Acceptable {
    readonly id: string;
    static load<T extends typeof RoomInvitation>(this: T, id: string): T['prototype'];
    /**
     * @ignore
     * Instance Properties
     *
     */
    constructor(id: string);
    toString(): string;
    /**
     * @ignore
     */
    toStringAsync(): Promise<string>;
    /**
     * Accept Room Invitation
     *
     * @returns {Promise<void>}
     *
     * @example
     * const bot = new Wechaty()
     * bot.on('room-invite', async roomInvitation => {
     *   try {
     *     console.log(`received room-invite event.`)
     *     await roomInvitation.accept()
     *   } catch (e) {
     *     console.error(e)
     *   }
     * }
     * .start()
     */
    accept(): Promise<void>;
    /**
     * Get the inviter from room invitation
     *
     * @returns {Contact}
     * @example
     * const bot = new Wechaty()
     * bot.on('room-invite', async roomInvitation => {
     *   const inviter = await roomInvitation.inviter()
     *   const name = inviter.name()
     *   console.log(`received room invitation event from ${name}`)
     * }
     * .start()
     */
    inviter(): Promise<Contact>;
    /**
     * Get the room topic from room invitation
     *
     * @returns {Contact}
     * @example
     * const bot = new Wechaty()
     * bot.on('room-invite', async roomInvitation => {
     *   const topic = await roomInvitation.topic()
     *   console.log(`received room invitation event from room ${topic}`)
     * }
     * .start()
     */
    topic(): Promise<string>;
    /**
     * @deprecated: use topic() instead
     */
    roomTopic(): Promise<string>;
    roomMemberCount(): Promise<number>;
    /**
     * List of Room Members that you known(is friend)
     * @ignore
     */
    roomMemberList(): Promise<Contact[]>;
    /**
     * Get the invitation time
     *
     * @returns {Promise<Date>}
     */
    date(): Promise<Date>;
    /**
     * Returns the roopm invitation age in seconds. <br>
     *
     * For example, the invitation is sent at time `8:43:01`,
     * and when we received it in Wechaty, the time is `8:43:15`,
     * then the age() will return `8:43:15 - 8:43:01 = 14 (seconds)`
     * @returns {number}
     */
    age(): Promise<number>;
}
//# sourceMappingURL=room-invitation.d.ts.map