import { FileBox } from 'file-box';
import { Accessory } from '../accessory';
import { Sayable } from '../types';
import { Contact } from './contact';
import { RoomInvitation } from './room-invitation';
import { UrlLink } from './url-link';
import { MiniProgram } from './mini-program';
import { RoomMemberQueryFilter, RoomPayload, RoomQueryFilter } from 'wechaty-puppet';
export declare const ROOM_EVENT_DICT: {
    invite: string;
    join: string;
    leave: string;
    topic: string;
};
export declare type RoomEventName = keyof typeof ROOM_EVENT_DICT;
/**
 * All wechat rooms(groups) will be encapsulated as a Room.
 *
 * [Examples/Room-Bot]{@link https://github.com/Chatie/wechaty/blob/1523c5e02be46ebe2cc172a744b2fbe53351540e/examples/room-bot.ts}
 *
 * @property {string}  id               - Get Room id.
 * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
 */
export declare class Room extends Accessory implements Sayable {
    readonly id: string;
    protected static pool: Map<string, Room>;
    /**
     * Create a new room.
     *
     * @static
     * @param {Contact[]} contactList
     * @param {string} [topic]
     * @returns {Promise<Room>}
     * @example <caption>Creat a room with 'lijiarui' and 'juxiaomi', the room topic is 'ding - created'</caption>
     * const helperContactA = await Contact.find({ name: 'lijiarui' })  // change 'lijiarui' to any contact in your wechat
     * const helperContactB = await Contact.find({ name: 'juxiaomi' })  // change 'juxiaomi' to any contact in your wechat
     * const contactList = [helperContactA, helperContactB]
     * console.log('Bot', 'contactList: %s', contactList.join(','))
     * const room = await Room.create(contactList, 'ding')
     * console.log('Bot', 'createDingRoom() new ding room created: %s', room)
     * await room.topic('ding - created')
     * await room.say('ding - created')
     */
    static create(contactList: Contact[], topic?: string): Promise<Room>;
    /**
     * The filter to find the room:  {topic: string | RegExp}
     *
     * @typedef    RoomQueryFilter
     * @property   {string} topic
     */
    /**
     * Find room by by filter: {topic: string | RegExp}, return all the matched room
     * @static
     * @param {RoomQueryFilter} [query]
     * @returns {Promise<Room[]>}
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in
     * const roomList = await bot.Room.findAll()                    // get the room list of the bot
     * const roomList = await bot.Room.findAll({topic: 'wechaty'})  // find all of the rooms with name 'wechaty'
     */
    static findAll<T extends typeof Room>(this: T, query?: RoomQueryFilter): Promise<Array<T['prototype']>>;
    /**
     * Try to find a room by filter: {topic: string | RegExp}. If get many, return the first one.
     *
     * @param {RoomQueryFilter} query
     * @returns {Promise<Room | null>} If can find the room, return Room, or return null
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const roomList = await bot.Room.find()
     * const roomList = await bot.Room.find({topic: 'wechaty'})
     */
    static find<T extends typeof Room>(this: T, query: string | RoomQueryFilter): Promise<T['prototype'] | null>;
    /**
     * @private
     * About the Generic: https://stackoverflow.com/q/43003970/1123955
     *
     * Load room by topic. <br>
     * > Tips: For Web solution, it cannot get the unique topic id,
     * but for other solutions besides web,
     * we can get unique and permanent topic id.
     *
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * @static
     * @param {string} id
     * @returns {Room}
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = bot.Room.load('roomId')
     */
    static load<T extends typeof Room>(this: T, id: string): T['prototype'];
    /**
     * @private
     *
     * Instance Properties
     *
     *
     */
    protected payload?: RoomPayload;
    /**
     * @private
     */
    constructor(id: string);
    /**
     * @private
     */
    toString(): string;
    [Symbol.asyncIterator](): AsyncIterableIterator<Contact>;
    /**
     * @ignore
     * @private
     * @deprecated: Use `sync()` instead
     */
    refresh(): Promise<void>;
    /**
     * Force reload data for Room, Sync data from lowlevel API again.
     *
     * @returns {Promise<void>}
     * @example
     * await room.sync()
     */
    sync(): Promise<void>;
    /**
     * `ready()` is For FrameWork ONLY!
     *
     * Please not to use `ready()` at the user land.
     * If you want to sync data, use `sync()` instead.
     *
     * @private
     */
    ready(forceSync?: boolean): Promise<void>;
    /**
     * @private
     */
    isReady(): boolean;
    say(text: string): Promise<void>;
    say(text: string, ...mentionList: Contact[]): Promise<void>;
    say(textList: TemplateStringsArray, ...mentionList: Contact[]): Promise<void>;
    say(file: FileBox): Promise<void>;
    say(url: UrlLink): Promise<void>;
    say(mini: MiniProgram): Promise<void>;
    say(...args: never[]): never;
    private sayTemplateStringsArray;
    emit(event: 'invite', inviter: Contact, invitation: RoomInvitation): boolean;
    emit(event: 'leave', leaverList: Contact[], remover: Contact, date: Date): boolean;
    emit(event: 'join', inviteeList: Contact[], inviter: Contact, date: Date): boolean;
    emit(event: 'topic', topic: string, oldTopic: string, changer: Contact, date: Date): boolean;
    emit(event: never, ...args: never[]): never;
    on(event: 'invite', listener: (this: Room, inviter: Contact, invitation: RoomInvitation) => void): this;
    on(event: 'leave', listener: (this: Room, leaverList: Contact[], remover?: Contact, date?: Date) => void): this;
    on(event: 'join', listener: (this: Room, inviteeList: Contact[], inviter: Contact, date?: Date) => void): this;
    on(event: 'topic', listener: (this: Room, topic: string, oldTopic: string, changer: Contact, date?: Date) => void): this;
    on(event: never, ...args: never[]): never;
    /**
     * Add contact in a room
     *
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * >
     * > see {@link https://github.com/Chatie/wechaty/issues/1441|Web version of WeChat closed group interface}
     *
     * @param {Contact} contact
     * @returns {Promise<void>}
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const contact = await bot.Contact.find({name: 'lijiarui'}) // change 'lijiarui' to any contact in your wechat
     * const room = await bot.Room.find({topic: 'wechat'})        // change 'wechat' to any room topic in your wechat
     * if (room) {
     *   try {
     *      await room.add(contact)
     *   } catch(e) {
     *      console.error(e)
     *   }
     * }
     */
    add(contact: Contact): Promise<void>;
    /**
     * Delete a contact from the room
     * It works only when the bot is the owner of the room
     *
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * >
     * > see {@link https://github.com/Chatie/wechaty/issues/1441|Web version of WeChat closed group interface}
     *
     * @param {Contact} contact
     * @returns {Promise<void>}
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'wechat'})          // change 'wechat' to any room topic in your wechat
     * const contact = await bot.Contact.find({name: 'lijiarui'})   // change 'lijiarui' to any room member in the room you just set
     * if (room) {
     *   try {
     *      await room.del(contact)
     *   } catch(e) {
     *      console.error(e)
     *   }
     * }
     */
    del(contact: Contact): Promise<void>;
    /**
     * Bot quit the room itself
     *
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @returns {Promise<void>}
     * @example
     * await room.quit()
     */
    quit(): Promise<void>;
    topic(): Promise<string>;
    topic(newTopic: string): Promise<void>;
    announce(): Promise<string>;
    announce(text: string): Promise<void>;
    /**
     * Get QR Code of the Room from the room, which can be used as scan and join the room.
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * @returns {Promise<string>}
     */
    qrcode(): Promise<string>;
    /**
     * Return contact's roomAlias in the room
     * @param {Contact} contact
     * @returns {Promise<string | null>} - If a contact has an alias in room, return string, otherwise return null
     * @example
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   const room = m.room()
     *   const contact = m.from()
     *   if (room) {
     *     const alias = await room.alias(contact)
     *     console.log(`${contact.name()} alias is ${alias}`)
     *   }
     * })
     * .start()
     */
    alias(contact: Contact): Promise<null | string>;
    /**
     * Same as function alias
     * @param {Contact} contact
     * @returns {Promise<string | null>}
     * @deprecated: use room.alias() instead
     * @private
     */
    roomAlias(contact: Contact): Promise<null | string>;
    /**
     * Check if the room has member `contact`, the return is a Promise and must be `await`-ed
     *
     * @param {Contact} contact
     * @returns {Promise<boolean>} Return `true` if has contact, else return `false`.
     * @example <caption>Check whether 'lijiarui' is in the room 'wechaty'</caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const contact = await bot.Contact.find({name: 'lijiarui'})   // change 'lijiarui' to any of contact in your wechat
     * const room = await bot.Room.find({topic: 'wechaty'})         // change 'wechaty' to any of the room in your wechat
     * if (contact && room) {
     *   if (await room.has(contact)) {
     *     console.log(`${contact.name()} is in the room wechaty!`)
     *   } else {
     *     console.log(`${contact.name()} is not in the room wechaty!`)
     *   }
     * }
     */
    has(contact: Contact): Promise<boolean>;
    memberAll(): Promise<Contact[]>;
    memberAll(name: string): Promise<Contact[]>;
    memberAll(filter: RoomMemberQueryFilter): Promise<Contact[]>;
    member(name: string): Promise<null | Contact>;
    member(filter: RoomMemberQueryFilter): Promise<null | Contact>;
    /**
     * @ignore
     * @private
     *
     * Get all room member from the room
     *
     * @returns {Promise<Contact[]>}
     * @example
     * await room.memberList()
     */
    private memberList;
    /**
     * Get room's owner from the room.
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * @returns {(Contact | null)}
     * @example
     * const owner = room.owner()
     */
    owner(): null | Contact;
    avatar(): Promise<FileBox>;
}
//# sourceMappingURL=room.d.ts.map