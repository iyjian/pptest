import { FileBox } from 'file-box';
import { ContactGender, ContactPayload, ContactQueryFilter, ContactType } from 'wechaty-puppet';
import { Accessory } from '../accessory';
import { Sayable } from '../types';
import { UrlLink } from './url-link';
import { MiniProgram } from './mini-program';
export declare const POOL: unique symbol;
/**
 * All wechat contacts(friend) will be encapsulated as a Contact.
 * [Examples/Contact-Bot]{@link https://github.com/Chatie/wechaty/blob/1523c5e02be46ebe2cc172a744b2fbe53351540e/examples/contact-bot.ts}
 *
 * @property {string}  id               - Get Contact id.
 * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
 */
export declare class Contact extends Accessory implements Sayable {
    readonly id: string;
    static Type: typeof ContactType;
    static Gender: typeof ContactGender;
    protected static [POOL]: Map<string, Contact>;
    protected static pool: Map<string, Contact>;
    /**
     * @private
     * About the Generic: https://stackoverflow.com/q/43003970/1123955
     *
     * Get Contact by id
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @static
     * @param {string} id
     * @returns {Contact}
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * const contact = bot.Contact.load('contactId')
     */
    static load<T extends typeof Contact>(this: T, id: string): T['prototype'];
    /**
     * The way to search Contact
     *
     * @typedef    ContactQueryFilter
     * @property   {string} name    - The name-string set by user-self, should be called name
     * @property   {string} alias   - The name-string set by bot for others, should be called alias
     * [More Detail]{@link https://github.com/Chatie/wechaty/issues/365}
     */
    /**
     * Try to find a contact by filter: {name: string | RegExp} / {alias: string | RegExp}
     *
     * Find contact by name or alias, if the result more than one, return the first one.
     *
     * @static
     * @param {ContactQueryFilter} query
     * @returns {(Promise<Contact | null>)} If can find the contact, return Contact, or return null
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * const contactFindByName = await bot.Contact.find({ name:"ruirui"} )
     * const contactFindByAlias = await bot.Contact.find({ alias:"lijiarui"} )
     */
    static find<T extends typeof Contact>(this: T, query: string | ContactQueryFilter): Promise<T['prototype'] | null>;
    /**
     * Find contact by `name` or `alias`
     *
     * If use Contact.findAll() get the contact list of the bot.
     *
     * #### definition
     * - `name`   the name-string set by user-self, should be called name
     * - `alias`  the name-string set by bot for others, should be called alias
     *
     * @static
     * @param {ContactQueryFilter} [queryArg]
     * @returns {Promise<Contact[]>}
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * const contactList = await bot.Contact.findAll()                      // get the contact list of the bot
     * const contactList = await bot.Contact.findAll({ name: 'ruirui' })    // find allof the contacts whose name is 'ruirui'
     * const contactList = await bot.Contact.findAll({ alias: 'lijiarui' }) // find all of the contacts whose alias is 'lijiarui'
     */
    static findAll<T extends typeof Contact>(this: T, query?: string | ContactQueryFilter): Promise<Array<T['prototype']>>;
    static delete(contact: Contact): Promise<void>;
    /**
     *
     * Instance properties
     * @private
     *
     */
    protected payload?: ContactPayload;
    /**
     * @private
     */
    constructor(id: string);
    /**
     * @private
     */
    toString(): string;
    say(text: string): Promise<void>;
    say(contact: Contact): Promise<void>;
    say(file: FileBox): Promise<void>;
    say(mini: MiniProgram): Promise<void>;
    say(url: UrlLink): Promise<void>;
    /**
     * Get the name from a contact
     *
     * @returns {string}
     * @example
     * const name = contact.name()
     */
    name(): string;
    alias(): Promise<null | string>;
    alias(newAlias: string): Promise<void>;
    alias(empty: null): Promise<void>;
    /**
     *
     * @description
     * Should use {@link Contact#friend} instead
     *
     * @deprecated
     * @private
     */
    stranger(): null | boolean;
    /**
     * Check if contact is friend
     *
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @returns {boolean | null}
     *
     * <br>True for friend of the bot <br>
     * False for not friend of the bot, null for unknown.
     * @example
     * const isFriend = contact.friend()
     */
    friend(): null | boolean;
    /**
     * @ignore
     * @see {@link https://github.com/Chatie/webwx-app-tracker/blob/7c59d35c6ea0cff38426a4c5c912a086c4c512b2/formatted/webwxApp.js#L3243|webwxApp.js#L324}
     * @see {@link https://github.com/Urinx/WeixinBot/blob/master/README.md|Urinx/WeixinBot/README}
     */
    /**
     * @description
     * Check if it's a offical account, should use {@link Contact#type} instead
     * @deprecated
     * @private
     */
    official(): boolean;
    /**
     * @description
     * Check if it's a personal account, should use {@link Contact#type} instead
     * @deprecated
     * @private
     */
    personal(): boolean;
    /**
     * Enum for ContactType
     * @enum {number}
     * @property {number} Unknown    - ContactType.Unknown    (0) for Unknown
     * @property {number} Personal   - ContactType.Personal   (1) for Personal
     * @property {number} Official   - ContactType.Official   (2) for Official
     */
    /**
     * Return the type of the Contact
     * > Tips: ContactType is enum here.</br>
     * @returns {ContactType.Unknown | ContactType.Personal | ContactType.Official}
     *
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * const isOfficial = contact.type() === bot.Contact.Type.Official
     */
    type(): ContactType;
    /**
     * @private
     * TODO
     * Check if the contact is star contact.
     *
     * @returns {boolean | null} - True for star friend, False for no star friend.
     * @example
     * const isStar = contact.star()
     */
    star(): null | boolean;
    /**
     * Contact gender
     * > Tips: ContactGender is enum here. </br>
     *
     * @returns {ContactGender.Unknown | ContactGender.Male | ContactGender.Female}
     * @example
     * const gender = contact.gender() === bot.Contact.Gender.Male
     */
    gender(): ContactGender;
    /**
     * Get the region 'province' from a contact
     *
     * @returns {string | null}
     * @example
     * const province = contact.province()
     */
    province(): null | string;
    /**
     * Get the region 'city' from a contact
     *
     * @returns {string | null}
     * @example
     * const city = contact.city()
     */
    city(): null | string;
    /**
     * Get avatar picture file stream
     *
     * @returns {Promise<FileBox>}
     * @example
     * // Save avatar to local file like `1-name.jpg`
     *
     * const file = await contact.avatar()
     * const name = file.name
     * await file.toFile(name, true)
     * console.log(`Contact: ${contact.name()} with avatar file: ${name}`)
     */
    avatar(): Promise<FileBox>;
    /**
     * @description
     * Force reload(re-ready()) data for Contact, use {@link Contact#sync} instead
     *
     * @deprecated
     * @private
     */
    refresh(): Promise<void>;
    /**
     * Force reload data for Contact, Sync data from lowlevel API again.
     *
     * @returns {Promise<this>}
     * @example
     * await contact.sync()
     */
    sync(): Promise<void>;
    /**
     * `ready()` is For FrameWork ONLY!
     *
     * Please not to use `ready()` at the user land.
     * If you want to sync data, uyse `sync()` instead.
     *
     * @private
     */
    ready(forceSync?: boolean): Promise<void>;
    /**
     * @private
     */
    isReady(): boolean;
    /**
     * Check if contact is self
     *
     * @returns {boolean} True for contact is self, False for contact is others
     * @example
     * const isSelf = contact.self()
     */
    self(): boolean;
    /**
     * Get the weixin number from a contact.
     *
     * Sometimes cannot get weixin number due to weixin security mechanism, not recommend.
     *
     * @private
     * @returns {string | null}
     * @example
     * const weixin = contact.weixin()
     */
    weixin(): null | string;
}
//# sourceMappingURL=contact.d.ts.map