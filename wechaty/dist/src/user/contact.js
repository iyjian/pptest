"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 *   @ignore
 */
const clone_class_1 = require("clone-class");
const file_box_1 = require("file-box");
const wechaty_puppet_1 = require("wechaty-puppet");
const accessory_1 = require("../accessory");
const config_1 = require("../config");
const url_link_1 = require("./url-link");
const mini_program_1 = require("./mini-program");
exports.POOL = Symbol('pool');
/**
 * All wechat contacts(friend) will be encapsulated as a Contact.
 * [Examples/Contact-Bot]{@link https://github.com/Chatie/wechaty/blob/1523c5e02be46ebe2cc172a744b2fbe53351540e/examples/contact-bot.ts}
 *
 * @property {string}  id               - Get Contact id.
 * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
 */
class Contact extends accessory_1.Accessory {
    /**
     * @private
     */
    constructor(id) {
        super();
        this.id = id;
        config_1.log.silly('Contact', `constructor(${id})`);
        // tslint:disable-next-line:variable-name
        const MyClass = clone_class_1.instanceToClass(this, Contact);
        if (MyClass === Contact) {
            throw new Error('Contact class can not be instanciated directly!'
                + 'See: https://github.com/Chatie/wechaty/issues/1217');
        }
        if (!this.puppet) {
            throw new Error('Contact class can not be instanciated without a puppet!');
        }
    }
    static get pool() {
        return this[exports.POOL];
    }
    static set pool(newPool) {
        if (this === Contact) {
            throw new Error('The global Contact class can not be used directly!'
                + 'See: https://github.com/Chatie/wechaty/issues/1217');
        }
        this[exports.POOL] = newPool;
    }
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
    static load(id) {
        if (!this.pool) {
            config_1.log.verbose('Contact', 'load(%s) init pool', id);
            this.pool = new Map();
        }
        if (this === Contact) {
            throw new Error('The lgobal Contact class can not be used directly!'
                + 'See: https://github.com/Chatie/wechaty/issues/1217');
        }
        if (this.pool === Contact.pool) {
            throw new Error('the current pool is equal to the global pool error!');
        }
        const existingContact = this.pool.get(id);
        if (existingContact) {
            return existingContact;
        }
        // when we call `load()`, `this` should already be extend-ed a child class.
        // so we force `this as any` at here to make the call.
        const newContact = new this(id);
        this.pool.set(id, newContact);
        return newContact;
    }
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
    static find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Contact', 'find(%s)', JSON.stringify(query));
            const contactList = yield this.findAll(query);
            if (!contactList) {
                return null;
            }
            if (contactList.length < 1) {
                return null;
            }
            if (contactList.length > 1) {
                config_1.log.warn('Contact', 'find() got more than one(%d) result', contactList.length);
            }
            let n = 0;
            for (n = 0; n < contactList.length; n++) {
                const contact = contactList[n];
                // use puppet.contactValidate() to confirm double confirm that this contactId is valid.
                // https://github.com/lijiarui/wechaty-puppet-padchat/issues/64
                // https://github.com/Chatie/wechaty/issues/1345
                const valid = yield this.puppet.contactValidate(contact.id);
                if (valid) {
                    config_1.log.verbose('Contact', 'find() confirm contact[#%d] with id=%d is valid result, return it.', n, contact.id);
                    return contact;
                }
                else {
                    config_1.log.verbose('Contact', 'find() confirm contact[#%d] with id=%d is INVALID result, try next', n, contact.id);
                }
            }
            config_1.log.warn('Contact', 'find() got %d contacts but no one is valid.', contactList.length);
            return null;
        });
    }
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
    static findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Contact', 'findAll(%s)', JSON.stringify(query) || '');
            try {
                const contactIdList = yield this.puppet.contactSearch(query);
                const contactList = contactIdList.map(id => this.load(id));
                const BATCH_SIZE = 16;
                let batchIndex = 0;
                const invalidDict = {};
                while (batchIndex * BATCH_SIZE < contactList.length) {
                    const batchContactList = contactList.slice(BATCH_SIZE * batchIndex, BATCH_SIZE * (batchIndex + 1));
                    yield Promise.all(batchContactList.map(c => c.ready()
                        .catch(e => {
                        config_1.log.error('Contact', 'findAll() contact.ready() exception: %s', e.message);
                        invalidDict[c.id] = true;
                    })));
                    batchIndex++;
                }
                return contactList.filter(contact => !invalidDict[contact.id]);
            }
            catch (e) {
                config_1.log.error('Contact', 'this.puppet.contactFindAll() rejected: %s', e.message);
                return []; // fail safe
            }
        });
    }
    // TODO
    static delete(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Contact', 'static delete(%s)', contact.id);
        });
    }
    /**
     * @private
     */
    toString() {
        if (!this.payload) {
            return this.constructor.name;
        }
        const identity = this.payload.alias
            || this.payload.name
            || this.id
            || 'loading...';
        return `Contact<${identity}>`;
    }
    /**
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @param {(string | Contact | FileBox | UrlLink | MiniProgram)} something
     * send text, Contact, or file to contact. </br>
     * You can use {@link https://www.npmjs.com/package/file-box|FileBox} to send file
     * @returns {Promise<void>}
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * const contact = await bot.Contact.find({name: 'lijiarui'})  // change 'lijiarui' to any of your contact name in wechat
     *
     * // 1. send text to contact
     *
     * await contact.say('welcome to wechaty!')
     *
     * // 2. send media file to contact
     *
     * import { FileBox }  from 'file-box'
     * const fileBox1 = FileBox.fromUrl('https://chatie.io/wechaty/images/bot-qr-code.png')
     * const fileBox2 = FileBox.fromFile('/tmp/text.txt')
     * await contact.say(fileBox1)
     * await contact.say(fileBox2)
     *
     * // 3. send contact card to contact
     *
     * const contactCard = bot.Contact.load('contactId')
     * await contact.say(contactCard)
     *
     * // 4. send url link to contact
     *
     * const urlLink = new UrlLink ({
     *   description : 'WeChat Bot SDK for Individual Account, Powered by TypeScript, Docker, and Love',
     *   thumbnailUrl: 'https://avatars0.githubusercontent.com/u/25162437?s=200&v=4',
     *   title       : 'Welcome to Wechaty',
     *   url         : 'https://github.com/chatie/wechaty',
     * })
     * await contact.say(urlLink)
     *
     * // 5. send mini program to contact
     *
     * const miniProgram = new MiniProgram ({
     *   username           : 'gh_xxxxxxx',     //get from mp.weixin.qq.com
     *   appid              : '',               //optional, get from mp.weixin.qq.com
     *   title              : '',               //optional
     *   pagepath           : '',               //optional
     *   description        : '',               //optional
     *   thumbnailurl       : '',               //optional
     * })
     * await contact.say(miniProgram)
     */
    say(something) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Contact', 'say(%s)', something);
            if (typeof something === 'string') {
                /**
                 * 1. Text
                 */
                yield this.puppet.messageSendText({
                    contactId: this.id,
                }, something);
            }
            else if (something instanceof Contact) {
                /**
                 * 2. Contact
                 */
                yield this.puppet.messageSendContact({
                    contactId: this.id,
                }, something.id);
            }
            else if (something instanceof file_box_1.FileBox) {
                /**
                 * 3. File
                 */
                yield this.puppet.messageSendFile({
                    contactId: this.id,
                }, something);
            }
            else if (something instanceof url_link_1.UrlLink) {
                /**
                 * 4. Link Message
                 */
                yield this.puppet.messageSendUrl({
                    contactId: this.id,
                }, something.payload);
            }
            else if (something instanceof mini_program_1.MiniProgram) {
                /**
                 * 5. Mini Program
                 */
                yield this.puppet.messageSendMiniProgram({
                    contactId: this.id,
                }, something.payload);
            }
            else {
                throw new Error('unsupported arg: ' + something);
            }
        });
    }
    /**
     * Get the name from a contact
     *
     * @returns {string}
     * @example
     * const name = contact.name()
     */
    name() {
        return (this.payload && this.payload.name) || '';
    }
    /**
     * GET / SET / DELETE the alias for a contact
     *
     * Tests show it will failed if set alias too frequently(60 times in one minute).
     * @param {(none | string | null)} newAlias
     * @returns {(Promise<null | string | void>)}
     * @example <caption> GET the alias for a contact, return {(Promise<string | null>)}</caption>
     * const alias = await contact.alias()
     * if (alias === null) {
     *   console.log('You have not yet set any alias for contact ' + contact.name())
     * } else {
     *   console.log('You have already set an alias for contact ' + contact.name() + ':' + alias)
     * }
     *
     * @example <caption>SET the alias for a contact</caption>
     * try {
     *   await contact.alias('lijiarui')
     *   console.log(`change ${contact.name()}'s alias successfully!`)
     * } catch (e) {
     *   console.log(`failed to change ${contact.name()} alias!`)
     * }
     *
     * @example <caption>DELETE the alias for a contact</caption>
     * try {
     *   const oldAlias = await contact.alias(null)
     *   console.log(`delete ${contact.name()}'s alias successfully!`)
     *   console.log('old alias is ${oldAlias}`)
     * } catch (e) {
     *   console.log(`failed to delete ${contact.name()}'s alias!`)
     * }
     */
    alias(newAlias) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.silly('Contact', 'alias(%s)', newAlias === undefined
                ? ''
                : newAlias);
            if (!this.payload) {
                throw new Error('no payload');
            }
            if (typeof newAlias === 'undefined') {
                return this.payload.alias || null;
            }
            try {
                yield this.puppet.contactAlias(this.id, newAlias);
                yield this.puppet.contactPayloadDirty(this.id);
                this.payload = yield this.puppet.contactPayload(this.id);
                if (newAlias && newAlias !== this.payload.alias) {
                    config_1.log.warn('Contact', 'alias(%s) sync with server fail: set(%s) is not equal to get(%s)', newAlias, this.payload.alias);
                }
            }
            catch (e) {
                config_1.log.error('Contact', 'alias(%s) rejected: %s', newAlias, e.message);
                config_1.Raven.captureException(e);
            }
        });
    }
    /**
     *
     * @description
     * Should use {@link Contact#friend} instead
     *
     * @deprecated
     * @private
     */
    stranger() {
        config_1.log.warn('Contact', 'stranger() DEPRECATED. use friend() instead.');
        if (!this.payload)
            return null;
        return !this.friend();
    }
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
    friend() {
        config_1.log.verbose('Contact', 'friend()');
        if (!this.payload) {
            return null;
        }
        return this.payload.friend || null;
    }
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
    official() {
        config_1.log.warn('Contact', 'official() DEPRECATED. use type() instead');
        return !!this.payload && (this.payload.type === wechaty_puppet_1.ContactType.Official);
    }
    /**
     * @description
     * Check if it's a personal account, should use {@link Contact#type} instead
     * @deprecated
     * @private
     */
    personal() {
        config_1.log.warn('Contact', 'personal() DEPRECATED. use type() instead');
        return !!this.payload && this.payload.type === wechaty_puppet_1.ContactType.Personal;
    }
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
    type() {
        if (!this.payload) {
            throw new Error('no payload');
        }
        return this.payload.type;
    }
    /**
     * @private
     * TODO
     * Check if the contact is star contact.
     *
     * @returns {boolean | null} - True for star friend, False for no star friend.
     * @example
     * const isStar = contact.star()
     */
    star() {
        if (!this.payload) {
            return null;
        }
        return this.payload.star === undefined
            ? null
            : this.payload.star;
    }
    /**
     * Contact gender
     * > Tips: ContactGender is enum here. </br>
     *
     * @returns {ContactGender.Unknown | ContactGender.Male | ContactGender.Female}
     * @example
     * const gender = contact.gender() === bot.Contact.Gender.Male
     */
    gender() {
        return this.payload
            ? this.payload.gender
            : wechaty_puppet_1.ContactGender.Unknown;
    }
    /**
     * Get the region 'province' from a contact
     *
     * @returns {string | null}
     * @example
     * const province = contact.province()
     */
    province() {
        return (this.payload && this.payload.province) || null;
    }
    /**
     * Get the region 'city' from a contact
     *
     * @returns {string | null}
     * @example
     * const city = contact.city()
     */
    city() {
        return (this.payload && this.payload.city) || null;
    }
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
    avatar() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Contact', 'avatar()');
            try {
                const fileBox = yield this.puppet.contactAvatar(this.id);
                return fileBox;
            }
            catch (e) {
                config_1.log.error('Contact', 'avatar() exception: %s', e.message);
                return config_1.qrCodeForChatie();
            }
        });
    }
    /**
     * @description
     * Force reload(re-ready()) data for Contact, use {@link Contact#sync} instead
     *
     * @deprecated
     * @private
     */
    refresh() {
        config_1.log.warn('Contact', 'refresh() DEPRECATED. use sync() instead.');
        return this.sync();
    }
    /**
     * Force reload data for Contact, Sync data from lowlevel API again.
     *
     * @returns {Promise<this>}
     * @example
     * await contact.sync()
     */
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ready(true);
        });
    }
    /**
     * `ready()` is For FrameWork ONLY!
     *
     * Please not to use `ready()` at the user land.
     * If you want to sync data, uyse `sync()` instead.
     *
     * @private
     */
    ready(forceSync = false) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.silly('Contact', 'ready() @ %s', this.puppet);
            if (!forceSync && this.isReady()) { // already ready
                config_1.log.silly('Contact', 'ready() isReady() true');
                return;
            }
            try {
                if (forceSync) {
                    yield this.puppet.contactPayloadDirty(this.id);
                }
                this.payload = yield this.puppet.contactPayload(this.id);
                // log.silly('Contact', `ready() this.puppet.contactPayload(%s) resolved`, this)
            }
            catch (e) {
                config_1.log.verbose('Contact', `ready() this.puppet.contactPayload(%s) exception: %s`, this, e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
        });
    }
    /**
     * @private
     */
    isReady() {
        return !!(this.payload && this.payload.name);
    }
    /**
     * Check if contact is self
     *
     * @returns {boolean} True for contact is self, False for contact is others
     * @example
     * const isSelf = contact.self()
     */
    self() {
        const userId = this.puppet.selfId();
        if (!userId) {
            return false;
        }
        return this.id === userId;
    }
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
    weixin() {
        return (this.payload && this.payload.weixin) || null;
    }
}
// tslint:disable-next-line:variable-name
Contact.Type = wechaty_puppet_1.ContactType;
// tslint:disable-next-line:variable-name
Contact.Gender = wechaty_puppet_1.ContactGender;
exports.Contact = Contact;
//# sourceMappingURL=contact.js.map