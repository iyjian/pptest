"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
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
const accessory_1 = require("../accessory");
const config_1 = require("../config");
const contact_1 = require("./contact");
const url_link_1 = require("./url-link");
const mini_program_1 = require("./mini-program");
exports.ROOM_EVENT_DICT = {
    invite: 'tbw',
    join: 'tbw',
    leave: 'tbw',
    topic: 'tbw',
};
/**
 * All wechat rooms(groups) will be encapsulated as a Room.
 *
 * [Examples/Room-Bot]{@link https://github.com/Chatie/wechaty/blob/1523c5e02be46ebe2cc172a744b2fbe53351540e/examples/room-bot.ts}
 *
 * @property {string}  id               - Get Room id.
 * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
 */
class Room extends accessory_1.Accessory {
    /**
     * @private
     */
    constructor(id) {
        super();
        this.id = id;
        config_1.log.silly('Room', `constructor(${id})`);
        // tslint:disable-next-line:variable-name
        const MyClass = clone_class_1.instanceToClass(this, Room);
        if (MyClass === Room) {
            throw new Error('Room class can not be instanciated directly! See: https://github.com/Chatie/wechaty/issues/1217');
        }
        if (!this.puppet) {
            throw new Error('Room class can not be instanciated without a puppet!');
        }
    }
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
    static create(contactList, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'create(%s, %s)', contactList.join(','), topic);
            if (!contactList
                || !Array.isArray(contactList)) {
                throw new Error('contactList not found');
            }
            if (contactList.length < 2) {
                throw new Error('contactList need at least 2 contact to create a new room');
            }
            try {
                const contactIdList = contactList.map(contact => contact.id);
                const roomId = yield this.puppet.roomCreate(contactIdList, topic);
                const room = this.load(roomId);
                return room;
            }
            catch (e) {
                config_1.log.error('Room', 'create() exception: %s', (e && e.stack) || e.message || e);
                config_1.Raven.captureException(e);
                throw e;
            }
        });
    }
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
    static findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'findAll(%s)', JSON.stringify(query) || '');
            const invalidDict = {};
            try {
                const roomIdList = yield this.puppet.roomSearch(query);
                const roomList = roomIdList.map(id => this.load(id));
                yield Promise.all(roomList.map(room => room.ready()
                    .catch(e => {
                    config_1.log.warn('Room', 'findAll() room.ready() rejection: %s', e);
                    invalidDict[room.id] = true;
                })));
                return roomList.filter(room => !invalidDict[room.id]);
            }
            catch (e) {
                config_1.log.verbose('Room', 'findAll() rejected: %s', e.message);
                console.error(e);
                config_1.Raven.captureException(e);
                return []; // fail safe
            }
        });
    }
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
    static find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'find(%s)', JSON.stringify(query));
            if (typeof query === 'string') {
                query = { topic: query };
            }
            const roomList = yield this.findAll(query);
            if (!roomList) {
                return null;
            }
            if (roomList.length < 1) {
                return null;
            }
            if (roomList.length > 1) {
                config_1.log.warn('Room', 'find() got more than one(%d) result', roomList.length);
            }
            let n = 0;
            for (n = 0; n < roomList.length; n++) {
                const room = roomList[n];
                // use puppet.roomValidate() to confirm double confirm that this roomId is valid.
                // https://github.com/lijiarui/wechaty-puppet-padchat/issues/64
                // https://github.com/Chatie/wechaty/issues/1345
                const valid = yield this.puppet.roomValidate(room.id);
                if (valid) {
                    config_1.log.verbose('Room', 'find() confirm room[#%d] with id=%d is valid result, return it.', n, room.id);
                    return room;
                }
                else {
                    config_1.log.verbose('Room', 'find() confirm room[#%d] with id=%d is INVALID result, try next', n, room.id);
                }
            }
            config_1.log.warn('Room', 'find() got %d rooms but no one is valid.', roomList.length);
            return null;
        });
    }
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
    static load(id) {
        if (!this.pool) {
            this.pool = new Map();
        }
        const existingRoom = this.pool.get(id);
        if (existingRoom) {
            return existingRoom;
        }
        const newRoom = new this(id);
        this.pool.set(id, newRoom);
        return newRoom;
    }
    /**
     * @private
     */
    toString() {
        if (!this.payload) {
            return this.constructor.name;
        }
        return `Room<${this.payload.topic || 'loadind...'}>`;
    }
    [Symbol.asyncIterator]() {
        return __asyncGenerator(this, arguments, function* _a() {
            const memberList = yield __await(this.memberList());
            for (const contact of memberList) {
                yield yield __await(contact);
            }
        });
    }
    /**
     * @ignore
     * @private
     * @deprecated: Use `sync()` instead
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sync();
        });
    }
    /**
     * Force reload data for Room, Sync data from lowlevel API again.
     *
     * @returns {Promise<void>}
     * @example
     * await room.sync()
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
     * If you want to sync data, use `sync()` instead.
     *
     * @private
     */
    ready(forceSync = false) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'ready()');
            if (!forceSync && this.isReady()) {
                return;
            }
            if (forceSync) {
                yield this.puppet.roomPayloadDirty(this.id);
                yield this.puppet.roomMemberPayloadDirty(this.id);
            }
            this.payload = yield this.puppet.roomPayload(this.id);
            if (!this.payload) {
                throw new Error('ready() no payload');
            }
            const memberIdList = yield this.puppet.roomMemberList(this.id);
            yield Promise.all(memberIdList
                .map(id => this.wechaty.Contact.load(id))
                .map(contact => {
                contact.ready()
                    .catch(e => {
                    config_1.log.verbose('Room', 'ready() member.ready() rejection: %s', e);
                });
            }));
        });
    }
    /**
     * @private
     */
    isReady() {
        return !!(this.payload);
    }
    /**
     * Send message inside Room, if set [replyTo], wechaty will mention the contact as well.
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @param {(string | Contact | FileBox)} textOrContactOrFileOrUrlOrMini - Send `text` or `media file` inside Room. <br>
     * You can use {@link https://www.npmjs.com/package/file-box|FileBox} to send file
     * @param {(Contact | Contact[])} [mention] - Optional parameter, send content inside Room, and mention @replyTo contact or contactList.
     * @returns {Promise<void>}
     *
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'wechaty'})
     *
     * // 1. Send text inside Room
     *
     * await room.say('Hello world!')
     *
     * // 2. Send media file inside Room
     * import { FileBox }  from 'file-box'
     * const fileBox1 = FileBox.fromUrl('https://chatie.io/wechaty/images/bot-qr-code.png')
     * const fileBox2 = FileBox.fromLocal('/tmp/text.txt')
     * await room.say(fileBox1)
     * await room.say(fileBox2)
     *
     * // 3. Send Contact Card in a room
     * const contactCard = await bot.Contact.find({name: 'lijiarui'}) // change 'lijiarui' to any of the room member
     * await room.say(contactCard)
     *
     * // 4. Send text inside room and mention @mention contact
     * const contact = await bot.Contact.find({name: 'lijiarui'}) // change 'lijiarui' to any of the room member
     * await room.say('Hello world!', contact)
     *
     * // 5. Send text inside room and mention someone with Tagged Template
     * const contact2 = await bot.Contact.find({name: 'zixia'}) // change 'zixia' to any of the room member
     * await room.say`Hello ${contact}, here is the world ${contact2}`
     *
     * // 6. send url link in a room
     *
     * const urlLink = new UrlLink ({
     *   description : 'WeChat Bot SDK for Individual Account, Powered by TypeScript, Docker, and Love',
     *   thumbnailUrl: 'https://avatars0.githubusercontent.com/u/25162437?s=200&v=4',
     *   title       : 'Welcome to Wechaty',
     *   url         : 'https://github.com/chatie/wechaty',
     * })
     * await room.say(urlLink)
     *
     * // 7. send mini program in a room
     *
     * const miniProgram = new MiniProgram ({
     *   username           : 'gh_xxxxxxx',     //get from mp.weixin.qq.com
     *   appid              : '',               //optional, get from mp.weixin.qq.com
     *   title              : '',               //optional
     *   pagepath           : '',               //optional
     *   description        : '',               //optional
     *   thumbnailurl       : '',               //optional
     * })
     * await room.say(miniProgram)
     */
    say(something, ...mentionList) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'say(%s, %s)', something, mentionList.join(', '));
            let text;
            if (typeof something === 'string') {
                if (mentionList.length > 0) {
                    const AT_SEPARATOR = config_1.FOUR_PER_EM_SPACE;
                    const mentionAlias = yield Promise.all(mentionList.map((contact) => __awaiter(this, void 0, void 0, function* () { return '@' + ((yield this.alias(contact)) || contact.name()); })));
                    const mentionText = mentionAlias.join(AT_SEPARATOR);
                    text = mentionText + ' ' + something;
                }
                else {
                    text = something;
                }
                const receiver = {
                    contactId: (mentionList.length && mentionList[0].id) || undefined,
                    roomId: this.id,
                };
                yield this.puppet.messageSendText(receiver, text, mentionList.map(c => c.id));
            }
            else if (something instanceof file_box_1.FileBox) {
                /**
                 * 2. File Message
                 */
                yield this.puppet.messageSendFile({
                    roomId: this.id,
                }, something);
            }
            else if (something instanceof contact_1.Contact) {
                /**
                 * 3. Contact Card
                 */
                yield this.puppet.messageSendContact({
                    roomId: this.id,
                }, something.id);
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
            else if (something instanceof Array) {
                yield this.sayTemplateStringsArray(something, ...mentionList);
            }
            else {
                throw new Error('arg unsupported: ' + something);
            }
        });
    }
    sayTemplateStringsArray(textList, ...mentionList) {
        return __awaiter(this, void 0, void 0, function* () {
            const receiver = {
                contactId: (mentionList.length && mentionList[0].id) || undefined,
                roomId: this.id,
            };
            if (mentionList.length === 0) {
                /**
                 * No mention in the string
                 */
                yield this.puppet.messageSendText(receiver, textList[0]);
            }
            else if (textList.length === 1) {
                /**
                 * Constructed mention string, skip inserting @ signs
                 */
                yield this.puppet.messageSendText(receiver, textList[0], mentionList.map(c => c.id));
            }
            else {
                /**
                 * Mention in the string
                 */
                const strLength = textList.length;
                const mentionLength = mentionList.length;
                if (strLength - mentionLength !== 1) {
                    throw new Error(`Can not say message, invalid Tagged Template.`);
                }
                let constructedString = '';
                let i = 0;
                for (; i < mentionLength; i++) {
                    constructedString += textList[i] + '@' + ((yield this.alias(mentionList[i])) || mentionList[i].name());
                }
                constructedString += textList[i];
                yield this.puppet.messageSendText(receiver, constructedString, mentionList.map(c => c.id));
            }
        });
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    /**
     * @desc       Room Class Event Type
     * @typedef    RoomEventName
     * @property   {string}  join  - Emit when anyone join any room.
     * @property   {string}  topic - Get topic event, emitted when someone change room topic.
     * @property   {string}  leave - Emit when anyone leave the room.<br>
     *                               If someone leaves the room by themselves, wechat will not notice other people in the room, so the bot will never get the "leave" event.
     */
    /**
     * @desc       Room Class Event Function
     * @typedef    RoomEventFunction
     * @property   {Function} room-join       - (this: Room, inviteeList: Contact[] , inviter: Contact)  => void
     * @property   {Function} room-topic      - (this: Room, topic: string, oldTopic: string, changer: Contact) => void
     * @property   {Function} room-leave      - (this: Room, leaver: Contact) => void
     */
    /**
     * @listens Room
     * @param   {RoomEventName}      event      - Emit WechatyEvent
     * @param   {RoomEventFunction}  listener   - Depends on the WechatyEvent
     * @return  {this}                          - this for chain
     *
     * @example <caption>Event:join </caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'topic of your room'}) // change `event-room` to any room topic in your wechat
     * if (room) {
     *   room.on('join', (room, inviteeList, inviter) => {
     *     const nameList = inviteeList.map(c => c.name()).join(',')
     *     console.log(`Room got new member ${nameList}, invited by ${inviter}`)
     *   })
     * }
     *
     * @example <caption>Event:leave </caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'topic of your room'}) // change `event-room` to any room topic in your wechat
     * if (room) {
     *   room.on('leave', (room, leaverList) => {
     *     const nameList = leaverList.map(c => c.name()).join(',')
     *     console.log(`Room lost member ${nameList}`)
     *   })
     * }
     *
     * @example <caption>Event:topic </caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'topic of your room'}) // change `event-room` to any room topic in your wechat
     * if (room) {
     *   room.on('topic', (room, topic, oldTopic, changer) => {
     *     console.log(`Room topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
     *   })
     * }
     *
     * @example <caption>Event:invite </caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'topic of your room'}) // change `event-room` to any room topic in your wechat
     * if (room) {
     *   room.on('invite', roomInvitation => roomInvitation.accept())
     * }
     *
     */
    on(event, listener) {
        config_1.log.verbose('Room', 'on(%s, %s)', event, typeof listener);
        super.on(event, listener); // Room is `Sayable`
        return this;
    }
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
    add(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'add(%s)', contact);
            yield this.puppet.roomAdd(this.id, contact.id);
        });
    }
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
    del(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'del(%s)', contact);
            yield this.puppet.roomDel(this.id, contact.id);
            // this.delLocal(contact)
        });
    }
    // private delLocal(contact: Contact): void {
    //   log.verbose('Room', 'delLocal(%s)', contact)
    //   const memberIdList = this.payload && this.payload.memberIdList
    //   if (memberIdList && memberIdList.length > 0) {
    //     for (let i = 0; i < memberIdList.length; i++) {
    //       if (memberIdList[i] === contact.id) {
    //         memberIdList.splice(i, 1)
    //         break
    //       }
    //     }
    //   }
    // }
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
    quit() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'quit() %s', this);
            yield this.puppet.roomQuit(this.id);
        });
    }
    /**
     * SET/GET topic from the room
     *
     * @param {string} [newTopic] If set this para, it will change room topic.
     * @returns {Promise<string | void>}
     *
     * @example <caption>When you say anything in a room, it will get room topic. </caption>
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   const room = m.room()
     *   if (room) {
     *     const topic = await room.topic()
     *     console.log(`room topic is : ${topic}`)
     *   }
     * })
     * .start()
     *
     * @example <caption>When you say anything in a room, it will change room topic. </caption>
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   const room = m.room()
     *   if (room) {
     *     const oldTopic = await room.topic()
     *     await room.topic('change topic to wechaty!')
     *     console.log(`room topic change from ${oldTopic} to ${room.topic()}`)
     *   }
     * })
     * .start()
     */
    topic(newTopic) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'topic(%s)', newTopic || '');
            if (!this.isReady()) {
                config_1.log.warn('Room', 'topic() room not ready');
                throw new Error('not ready');
            }
            if (typeof newTopic === 'undefined') {
                if (this.payload && this.payload.topic) {
                    return this.payload.topic;
                }
                else {
                    const memberIdList = yield this.puppet.roomMemberList(this.id);
                    const memberList = memberIdList
                        .filter(id => id !== this.puppet.selfId())
                        .map(id => this.wechaty.Contact.load(id));
                    let defaultTopic = (memberList[0] && memberList[0].name()) || '';
                    for (let i = 1; i < 3 && memberList[i]; i++) {
                        defaultTopic += ',' + memberList[i].name();
                    }
                    return defaultTopic;
                }
            }
            const future = this.puppet
                .roomTopic(this.id, newTopic)
                .catch(e => {
                config_1.log.warn('Room', 'topic(newTopic=%s) exception: %s', newTopic, (e && e.message) || e);
                config_1.Raven.captureException(e);
            });
            return future;
        });
    }
    /**
     * SET/GET announce from the room
     * > Tips: It only works when bot is the owner of the room.
     * >
     * > This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @param {string} [text] If set this para, it will change room announce.
     * @returns {(Promise<void | string>)}
     *
     * @example <caption>When you say anything in a room, it will get room announce. </caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'your room'})
     * const announce = await room.announce()
     * console.log(`room announce is : ${announce}`)
     *
     * @example <caption>When you say anything in a room, it will change room announce. </caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'your room'})
     * const oldAnnounce = await room.announce()
     * await room.announce('change announce to wechaty!')
     * console.log(`room announce change from ${oldAnnounce} to ${room.announce()}`)
     */
    announce(text) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'announce(%s)', text || '');
            if (text) {
                yield this.puppet.roomAnnounce(this.id, text);
            }
            else {
                const announcement = yield this.puppet.roomAnnounce(this.id);
                return announcement;
            }
        });
    }
    /**
     * Get QR Code of the Room from the room, which can be used as scan and join the room.
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * @returns {Promise<string>}
     */
    qrcode() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'qrcode()');
            const qrcode = yield this.puppet.roomQrcode(this.id);
            return qrcode;
        });
    }
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
    alias(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberPayload = yield this.puppet.roomMemberPayload(this.id, contact.id);
            if (memberPayload && memberPayload.roomAlias) {
                return memberPayload.roomAlias;
            }
            return null;
        });
    }
    /**
     * Same as function alias
     * @param {Contact} contact
     * @returns {Promise<string | null>}
     * @deprecated: use room.alias() instead
     * @private
     */
    roomAlias(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.warn('Room', 'roomAlias() DEPRECATED. use room.alias() instead');
            return this.alias(contact);
        });
    }
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
    has(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberIdList = yield this.puppet.roomMemberList(this.id);
            if (!memberIdList) {
                return false;
            }
            return memberIdList
                .filter(id => id === contact.id)
                .length > 0;
        });
    }
    /**
     * The way to search member by Room.member()
     *
     * @typedef    RoomMemberQueryFilter
     * @property   {string} name            -Find the contact by wechat name in a room, equal to `Contact.name()`.
     * @property   {string} roomAlias       -Find the contact by alias set by the bot for others in a room.
     * @property   {string} contactAlias    -Find the contact by alias set by the contact out of a room, equal to `Contact.alias()`.
     * [More Detail]{@link https://github.com/Chatie/wechaty/issues/365}
     */
    /**
     * Find all contacts in a room
     *
     * #### definition
     * - `name`                 the name-string set by user-self, should be called name, equal to `Contact.name()`
     * - `roomAlias`            the name-string set by user-self in the room, should be called roomAlias
     * - `contactAlias`         the name-string set by bot for others, should be called alias, equal to `Contact.alias()`
     * @param {(RoomMemberQueryFilter | string)} [query] -Optional parameter, When use memberAll(name:string), return all matched members, including name, roomAlias, contactAlias
     * @returns {Promise<Contact[]>}
     * @example
     * const roomList:Conatct[] | null = await room.findAll()
     * if(roomList)
     *  console.log(`room all member list: `, roomList)
     * const memberContactList: Conatct[] | null =await room.findAll(`abc`)
     * console.log(`contact list with all name, room alias, alias are abc:`, memberContactList)
     */
    memberAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.silly('Room', 'memberAll(%s)', JSON.stringify(query) || '');
            if (!query) {
                return this.memberList();
            }
            const contactIdList = yield this.puppet.roomMemberSearch(this.id, query);
            const contactList = contactIdList.map(id => this.wechaty.Contact.load(id));
            return contactList;
        });
    }
    /**
     * Find all contacts in a room, if get many, return the first one.
     *
     * @param {(RoomMemberQueryFilter | string)} queryArg -When use member(name:string), return all matched members, including name, roomAlias, contactAlias
     * @returns {Promise<null | Contact>}
     *
     * @example <caption>Find member by name</caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'wechaty'})           // change 'wechaty' to any room name in your wechat
     * if (room) {
     *   const member = await room.member('lijiarui')             // change 'lijiarui' to any room member in your wechat
     *   if (member) {
     *     console.log(`wechaty room got the member: ${member.name()}`)
     *   } else {
     *     console.log(`cannot get member in wechaty room!`)
     *   }
     * }
     *
     * @example <caption>Find member by MemberQueryFilter</caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'wechaty'})          // change 'wechaty' to any room name in your wechat
     * if (room) {
     *   const member = await room.member({name: 'lijiarui'})        // change 'lijiarui' to any room member in your wechat
     *   if (member) {
     *     console.log(`wechaty room got the member: ${member.name()}`)
     *   } else {
     *     console.log(`cannot get member in wechaty room!`)
     *   }
     * }
     */
    member(queryArg) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'member(%s)', JSON.stringify(queryArg));
            let memberList;
            // ISSUE #622
            // error TS2345: Argument of type 'string | MemberQueryFilter' is not assignable to parameter of type 'MemberQueryFilter' #622
            if (typeof queryArg === 'string') {
                memberList = yield this.memberAll(queryArg);
            }
            else {
                memberList = yield this.memberAll(queryArg);
            }
            if (!memberList || !memberList.length) {
                return null;
            }
            if (memberList.length > 1) {
                config_1.log.warn('Room', 'member(%s) get %d contacts, use the first one by default', JSON.stringify(queryArg), memberList.length);
            }
            return memberList[0];
        });
    }
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
    memberList() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'memberList()');
            const memberIdList = yield this.puppet.roomMemberList(this.id);
            if (!memberIdList) {
                config_1.log.warn('Room', 'memberList() not ready');
                return [];
            }
            const contactList = memberIdList.map(id => this.wechaty.Contact.load(id));
            return contactList;
        });
    }
    /**
     * Get room's owner from the room.
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * @returns {(Contact | null)}
     * @example
     * const owner = room.owner()
     */
    owner() {
        config_1.log.verbose('Room', 'owner()');
        const ownerId = this.payload && this.payload.ownerId;
        if (!ownerId) {
            return null;
        }
        const owner = this.wechaty.Contact.load(ownerId);
        return owner;
    }
    avatar() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Room', 'avatar()');
            return this.puppet.roomAvatar(this.id);
        });
    }
}
exports.Room = Room;
//# sourceMappingURL=room.js.map