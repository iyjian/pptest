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
 *   @ignore
 */
const clone_class_1 = require("clone-class");
const file_box_1 = require("file-box");
const wechaty_puppet_1 = require("wechaty-puppet");
const accessory_1 = require("../accessory");
const config_1 = require("../config");
const contact_1 = require("./contact");
const room_1 = require("./room");
const url_link_1 = require("./url-link");
const mini_program_1 = require("./mini-program");
/**
 * All wechat messages will be encapsulated as a Message.
 *
 * [Examples/Ding-Dong-Bot]{@link https://github.com/Chatie/wechaty/blob/1523c5e02be46ebe2cc172a744b2fbe53351540e/examples/ding-dong-bot.ts}
 */
class Message extends accessory_1.Accessory {
    /**
     * @private
     */
    constructor(id) {
        super();
        this.id = id;
        config_1.log.verbose('Message', 'constructor(%s) for class %s', id || '', this.constructor.name);
        // tslint:disable-next-line:variable-name
        const MyClass = clone_class_1.instanceToClass(this, Message);
        if (MyClass === Message) {
            throw new Error('Message class can not be instanciated directly! See: https://github.com/Chatie/wechaty/issues/1217');
        }
        if (!this.puppet) {
            throw new Error('Message class can not be instanciated without a puppet!');
        }
    }
    /**
     * Find message in cache
     */
    static find(userQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Message', 'find(%s)', JSON.stringify(userQuery));
            if (typeof userQuery === 'string') {
                userQuery = { text: userQuery };
            }
            const messageList = yield this.findAll(userQuery);
            if (messageList.length < 1) {
                return null;
            }
            if (messageList.length > 1) {
                config_1.log.warn('Message', 'findAll() got more than one(%d) result', messageList.length);
            }
            return messageList[0];
        });
    }
    /**
     * Find messages in cache
     */
    static findAll(userQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Message', 'findAll(%s)', JSON.stringify(userQuery) || '');
            let puppetQuery;
            if (userQuery) {
                puppetQuery = {
                    fromId: userQuery.from && userQuery.from.id,
                    roomId: userQuery.room && userQuery.room.id,
                    text: userQuery.text,
                    toId: userQuery.to && userQuery.to.id,
                    type: userQuery.type,
                };
            }
            const invalidDict = {};
            try {
                const MessageIdList = yield this.puppet.messageSearch(puppetQuery);
                const messageList = MessageIdList.map(id => this.load(id));
                yield Promise.all(messageList.map(message => message.ready()
                    .catch(e => {
                    config_1.log.warn('Room', 'findAll() message.ready() rejection: %s', e);
                    invalidDict[message.id] = true;
                })));
                return messageList.filter(message => !invalidDict[message.id]);
            }
            catch (e) {
                config_1.log.warn('Message', 'findAll() rejected: %s', e.message);
                console.error(e);
                config_1.Raven.captureException(e);
                return []; // fail safe
            }
        });
    }
    /**
     * Create a Mobile Terminated Message
     * @ignore
     * @private
     * "mobile originated" or "mobile terminated"
     * https://www.tatango.com/resources/video-lessons/video-mo-mt-sms-messaging/
     */
    static load(id) {
        config_1.log.verbose('Message', 'static load(%s)', id);
        /**
         * Must NOT use `Message` at here
         * MUST use `this` at here
         *
         * because the class will be `cloneClass`-ed
         */
        const msg = new this(id);
        return msg;
    }
    /**
     * TODO: rename create to load ??? Huan 201806
     * @deprecated: use load() instead
     * @private
     */
    static create(id) {
        config_1.log.warn('Message', 'static create(%s) DEPRECATED. Use load() instead', id);
        return this.load(id);
    }
    /**
     * @private
     */
    toString() {
        if (!this.payload) {
            return this.constructor.name;
        }
        const msgStrList = [
            'Message',
            `#${wechaty_puppet_1.MessageType[this.type()]}`,
            '[',
            this.from()
                ? '🗣' + this.from()
                : '',
            this.room()
                ? '@👥' + this.room()
                : '',
            ']',
        ];
        if (this.type() === Message.Type.Text
            || this.type() === Message.Type.Unknown) {
            msgStrList.push(`\t${this.text().substr(0, 70)}`);
        }
        else {
            config_1.log.silly('Message', 'toString() for message type: %s(%s)', Message.Type[this.type()], this.type());
            if (!this.payload) {
                throw new Error('no payload');
            }
            // const filename = this.puppet.messagefile payload.filename
            // if (!filename) {
            //   throw new Error(
            //     'no file for message id: ' + this.id
            //     + ' with type: ' + Message.Type[this.payload.type]
            //     + '(' + this.payload.type + ')',
            //   )
            // }
            // msgStrList.push(`<${filename || 'unknown file name'}>`)
        }
        return msgStrList.join('');
    }
    /**
     * Get the sender from a message.
     * @returns {Contact}
     * @example
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   const contact = msg.from()
     *   const text = msg.text()
     *   const room = msg.room()
     *   if (room) {
     *     const topic = await room.topic()
     *     console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`)
     *   } else {
     *     console.log(`Contact: ${contact.name()} Text: ${text}`)
     *   }
     * })
     * .start()
     */
    from() {
        if (!this.payload) {
            throw new Error('no payload');
        }
        // if (contact) {
        //   this.payload.from = contact
        //   return
        // }
        const fromId = this.payload.fromId;
        if (!fromId) {
            return null;
        }
        const from = this.wechaty.Contact.load(fromId);
        return from;
    }
    /**
     * Get the destination of the message
     * Message.to() will return null if a message is in a room, use Message.room() to get the room.
     * @returns {(Contact|null)}
     */
    to() {
        if (!this.payload) {
            throw new Error('no payload');
        }
        const toId = this.payload.toId;
        if (!toId) {
            return null;
        }
        const to = this.wechaty.Contact.load(toId);
        return to;
    }
    /**
     * Get the room from the message.
     * If the message is not in a room, then will return `null`
     *
     * @returns {(Room | null)}
     * @example
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   const contact = msg.from()
     *   const text = msg.text()
     *   const room = msg.room()
     *   if (room) {
     *     const topic = await room.topic()
     *     console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`)
     *   } else {
     *     console.log(`Contact: ${contact.name()} Text: ${text}`)
     *   }
     * })
     * .start()
     */
    room() {
        if (!this.payload) {
            throw new Error('no payload');
        }
        const roomId = this.payload.roomId;
        if (!roomId) {
            return null;
        }
        const room = this.wechaty.Room.load(roomId);
        return room;
    }
    /**
     * @description
     * use {@link Message#text} instead
     *
     * @deprecated
     */
    content() {
        config_1.log.warn('Message', 'content() DEPRECATED. use text() instead.');
        return this.text();
    }
    /**
     * Get the text content of the message
     *
     * @returns {string}
     * @example
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   const contact = msg.from()
     *   const text = msg.text()
     *   const room = msg.room()
     *   if (room) {
     *     const topic = await room.topic()
     *     console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`)
     *   } else {
     *     console.log(`Contact: ${contact.name()} Text: ${text}`)
     *   }
     * })
     * .start()
     */
    text() {
        if (!this.payload) {
            throw new Error('no payload');
        }
        return this.payload.text || '';
    }
    /**
     * Get the recalled message
     *
     * @example
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   if (m.type() === MessageType.Recalled) {
     *     const recalledMessage = await m.toRecalled()
     *     console.log(`Message: ${recalledMessage} has been recalled.`)
     *   }
     * })
     * .start()
     */
    toRecalled() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.type() !== wechaty_puppet_1.MessageType.Recalled) {
                throw new Error('Can not call toRecalled() on message which is not recalled type.');
            }
            const originalMessageId = this.text();
            if (!originalMessageId) {
                throw new Error('Can not find recalled message');
            }
            try {
                const message = this.wechaty.Message.load(originalMessageId);
                yield message.ready();
                return message;
            }
            catch (e) {
                config_1.log.verbose(`Can not retrieve the recalled message with id ${originalMessageId}.`);
                return null;
            }
        });
    }
    /**
     * Reply a Text or Media File message to the sender.
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @see {@link https://github.com/Chatie/wechaty/blob/1523c5e02be46ebe2cc172a744b2fbe53351540e/examples/ding-dong-bot.ts|Examples/ding-dong-bot}
     * @param {(string | Contact | FileBox | UrlLink | MiniProgram)} textOrContactOrFile
     * send text, Contact, or file to bot. </br>
     * You can use {@link https://www.npmjs.com/package/file-box|FileBox} to send file
     * @param {(Contact|Contact[])} [mention]
     * If this is a room message, when you set mention param, you can `@` Contact in the room.
     * @returns {Promise<void>}
     *
     * @example
     * import { FileBox }  from 'file-box'
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *
     * // 1. send Image
     *
     *   if (/^ding$/i.test(m.text())) {
     *     const fileBox = FileBox.fromUrl('https://chatie.io/wechaty/images/bot-qr-code.png')
     *     await msg.say(fileBox)
     *   }
     *
     * // 2. send Text
     *
     *   if (/^dong$/i.test(m.text())) {
     *     await msg.say('dingdingding')
     *   }
     *
     * // 3. send Contact
     *
     *   if (/^lijiarui$/i.test(m.text())) {
     *     const contactCard = await bot.Contact.find({name: 'lijiarui'})
     *     if (!contactCard) {
     *       console.log('not found')
     *       return
     *     }
     *     await msg.say(contactCard)
     *   }
     *
     * // 4. send Link
     *
     *   if (/^link$/i.test(m.text())) {
     *     const linkPayload = new UrlLink ({
     *       description : 'WeChat Bot SDK for Individual Account, Powered by TypeScript, Docker, and Love',
     *       thumbnailUrl: 'https://avatars0.githubusercontent.com/u/25162437?s=200&v=4',
     *       title       : 'Welcome to Wechaty',
     *       url         : 'https://github.com/chatie/wechaty',
     *     })
     *     await msg.say(linkPayload)
     *   }
     *
     * // 5. send MiniProgram
     *
     *   if (/^link$/i.test(m.text())) {
     *     const miniProgramPayload = new MiniProgram ({
     *       username           : 'gh_xxxxxxx',     //get from mp.weixin.qq.com
     *       appid              : '',               //optional, get from mp.weixin.qq.com
     *       title              : '',               //optional
     *       pagepath           : '',               //optional
     *       description        : '',               //optional
     *       thumbnailurl       : '',               //optional
     *     })
     *     await msg.say(miniProgramPayload)
     *   }
     *
     * })
     * .start()
     */
    say(textOrContactOrFileOrUrlOrMini) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Message', 'say(%s)', textOrContactOrFileOrUrlOrMini);
            // const user = this.puppet.userSelf()
            const from = this.from();
            // const to   = this.to()
            const room = this.room();
            if (typeof textOrContactOrFileOrUrlOrMini === 'string') {
                /**
                 * Text Message
                 */
                yield this.puppet.messageSendText({
                    contactId: (from && from.id) || undefined,
                    roomId: (room && room.id) || undefined,
                }, textOrContactOrFileOrUrlOrMini);
            }
            else if (textOrContactOrFileOrUrlOrMini instanceof contact_1.Contact) {
                /**
                 * Contact Card
                 */
                yield this.puppet.messageSendContact({
                    contactId: (from && from.id) || undefined,
                    roomId: (room && room.id) || undefined,
                }, textOrContactOrFileOrUrlOrMini.id);
            }
            else if (textOrContactOrFileOrUrlOrMini instanceof file_box_1.FileBox) {
                /**
                 * File Message
                 */
                yield this.puppet.messageSendFile({
                    contactId: (from && from.id) || undefined,
                    roomId: (room && room.id) || undefined,
                }, textOrContactOrFileOrUrlOrMini);
            }
            else if (textOrContactOrFileOrUrlOrMini instanceof url_link_1.UrlLink) {
                /**
                 * Link Message
                 */
                yield this.puppet.messageSendUrl({
                    contactId: (from && from.id) || undefined,
                    roomId: (room && room.id) || undefined,
                }, textOrContactOrFileOrUrlOrMini.payload);
            }
            else if (textOrContactOrFileOrUrlOrMini instanceof mini_program_1.MiniProgram) {
                /**
                 * MiniProgram
                 */
                yield this.puppet.messageSendMiniProgram({
                    contactId: (from && from.id) || undefined,
                    roomId: (room && room.id) || undefined,
                }, textOrContactOrFileOrUrlOrMini.payload);
            }
            else {
                throw new Error('unknown msg: ' + textOrContactOrFileOrUrlOrMini);
            }
        });
    }
    /**
     * Get the type from the message.
     * > Tips: MessageType is Enum here. </br>
     * - MessageType.Unknown     </br>
     * - MessageType.Attachment  </br>
     * - MessageType.Audio       </br>
     * - MessageType.Contact     </br>
     * - MessageType.Emoticon    </br>
     * - MessageType.Image       </br>
     * - MessageType.Text        </br>
     * - MessageType.Video       </br>
     * - MessageType.Url         </br>
     * @returns {MessageType}
     *
     * @example
     * const bot = new Wechaty()
     * if (message.type() === bot.Message.Type.Text) {
     *   console.log('This is a text message')
     * }
     */
    type() {
        if (!this.payload) {
            throw new Error('no payload');
        }
        return this.payload.type || wechaty_puppet_1.MessageType.Unknown;
    }
    /**
     * Check if a message is sent by self.
     *
     * @returns {boolean} - Return `true` for send from self, `false` for send from others.
     * @example
     * if (message.self()) {
     *  console.log('this message is sent by myself!')
     * }
     */
    self() {
        const userId = this.puppet.selfId();
        const from = this.from();
        return !!from && from.id === userId;
    }
    /**
     *
     * Get message mentioned contactList.
     *
     * Message event table as follows
     *
     * |                                                                            | Web  |  Mac PC Client | iOS Mobile |  android Mobile |
     * | :---                                                                       | :--: |     :----:     |   :---:    |     :---:       |
     * | [You were mentioned] tip ([有人@我]的提示)                                   |  ✘   |        √       |     √      |       √         |
     * | Identify magic code (8197) by copy & paste in mobile                       |  ✘   |        √       |     √      |       ✘         |
     * | Identify magic code (8197) by programming                                  |  ✘   |        ✘       |     ✘      |       ✘         |
     * | Identify two contacts with the same roomAlias by [You were  mentioned] tip |  ✘   |        ✘       |     √      |       √         |
     *
     * @returns {Promise<Contact[]>} - Return message mentioned contactList
     *
     * @example
     * const contactList = await message.mention()
     * console.log(contactList)
     */
    mention() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Message', 'mention()');
            const room = this.room();
            if (this.type() !== wechaty_puppet_1.MessageType.Text || !room) {
                return [];
            }
            // Use mention list if mention list is available
            // otherwise, process the message and get the mention list
            if (this.payload && this.payload.mentionIdList) {
                return Promise.all(this.payload.mentionIdList.map((id) => __awaiter(this, void 0, void 0, function* () {
                    const contact = this.wechaty.Contact.load(id);
                    yield contact.ready();
                    return contact;
                })));
            }
            // define magic code `8197` to identify @xxx
            // const AT_SEPRATOR = String.fromCharCode(8197)
            const AT_SEPRATOR = config_1.AT_SEPRATOR_REGEX;
            const atList = this.text().split(AT_SEPRATOR);
            // console.log('atList: ', atList)
            if (atList.length === 0)
                return [];
            // Using `filter(e => e.indexOf('@') > -1)` to filter the string without `@`
            const rawMentionList = atList
                .filter(str => str.includes('@'))
                .map(str => multipleAt(str));
            // convert 'hello@a@b@c' to [ 'c', 'b@c', 'a@b@c' ]
            function multipleAt(str) {
                str = str.replace(/^.*?@/, '@');
                let name = '';
                const nameList = [];
                str.split('@')
                    .filter(mentionName => !!mentionName)
                    .reverse()
                    .forEach(mentionName => {
                    // console.log('mentionName: ', mentionName)
                    name = mentionName + '@' + name;
                    nameList.push(name.slice(0, -1)); // get rid of the `@` at beginning
                });
                return nameList;
            }
            let mentionNameList = [];
            // Flatten Array
            // see http://stackoverflow.com/a/10865042/1123955
            mentionNameList = mentionNameList.concat.apply([], rawMentionList);
            // filter blank string
            mentionNameList = mentionNameList.filter(s => !!s);
            config_1.log.verbose('Message', 'mention() text = "%s", mentionNameList = "%s"', this.text(), JSON.stringify(mentionNameList));
            const contactListNested = yield Promise.all(mentionNameList.map(name => room.memberAll(name)));
            let contactList = [];
            contactList = contactList.concat.apply([], contactListNested);
            if (contactList.length === 0) {
                config_1.log.silly('Message', `message.mention() can not found member using room.member() from mentionList, metion string: ${JSON.stringify(mentionNameList)}`);
            }
            return contactList;
        });
    }
    /**
     * @description
     * should use {@link Message#mention} instead
     * @deprecated
     * @private
     */
    mentioned() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.warn('Message', 'mentioned() DEPRECATED. use mention() instead.');
            return this.mention();
        });
    }
    /**
     * Check if a message is mention self.
     *
     * @returns {Promise<boolean>} - Return `true` for mention me.
     * @example
     * if (await message.mentionSelf()) {
     *  console.log('this message were mentioned me! [You were mentioned] tip ([有人@我]的提示)')
     * }
     */
    mentionSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const selfId = this.puppet.selfId();
            const mentionList = yield this.mention();
            return mentionList.some(contact => contact.id === selfId);
        });
    }
    /**
     * @private
     */
    isReady() {
        return !!this.payload;
    }
    /**
     * @private
     */
    ready() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Message', 'ready()');
            if (this.isReady()) {
                return;
            }
            this.payload = yield this.puppet.messagePayload(this.id);
            if (!this.payload) {
                throw new Error('no payload');
            }
            const fromId = this.payload.fromId;
            const roomId = this.payload.roomId;
            const toId = this.payload.toId;
            if (roomId) {
                yield this.wechaty.Room.load(roomId).ready();
            }
            if (fromId) {
                yield this.wechaty.Contact.load(fromId).ready();
            }
            if (toId) {
                yield this.wechaty.Contact.load(toId).ready();
            }
        });
    }
    //       case WebMsgType.APP:
    //         if (!this.rawObj) {
    //           throw new Error('no rawObj')
    //         }
    //         switch (this.typeApp()) {
    //           case WebAppMsgType.ATTACH:
    //             if (!this.rawObj.MMAppMsgDownloadUrl) {
    //               throw new Error('no MMAppMsgDownloadUrl')
    //             }
    //             // had set in Message
    //             // url = this.rawObj.MMAppMsgDownloadUrl
    //             break
    //           case WebAppMsgType.URL:
    //           case WebAppMsgType.READER_TYPE:
    //             if (!this.rawObj.Url) {
    //               throw new Error('no Url')
    //             }
    //             // had set in Message
    //             // url = this.rawObj.Url
    //             break
    //           default:
    //             const e = new Error('ready() unsupported typeApp(): ' + this.typeApp())
    //             log.warn('PuppeteerMessage', e.message)
    //             throw e
    //         }
    //         break
    //       case WebMsgType.TEXT:
    //         if (this.typeSub() === WebMsgType.LOCATION) {
    //           url = await puppet.bridge.getMsgPublicLinkImg(this.id)
    //         }
    //         break
    /**
     * Forward the received message.
     *
     * @param {(Sayable | Sayable[])} to Room or Contact
     * The recipient of the message, the room, or the contact
     * @returns {Promise<void>}
     * @example
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   const room = await bot.Room.find({topic: 'wechaty'})
     *   if (room) {
     *     await m.forward(room)
     *     console.log('forward this message to wechaty room!')
     *   }
     * })
     * .start()
     */
    forward(to) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Message', 'forward(%s)', to);
            let roomId;
            let contactId;
            if (to instanceof room_1.Room) {
                roomId = to.id;
            }
            else if (to instanceof contact_1.Contact) {
                contactId = to.id;
            }
            try {
                yield this.puppet.messageForward({
                    contactId,
                    roomId,
                }, this.id);
            }
            catch (e) {
                config_1.log.error('Message', 'forward(%s) exception: %s', to, e);
                throw e;
            }
        });
    }
    /**
     * Message sent date
     */
    date() {
        if (!this.payload) {
            throw new Error('no payload');
        }
        // convert the unit timestamp to milliseconds
        // (from seconds to milliseconds)
        return new Date(1000 * this.payload.timestamp);
    }
    /**
     * Returns the message age in seconds. <br>
     *
     * For example, the message is sent at time `8:43:01`,
     * and when we received it in Wechaty, the time is `8:43:15`,
     * then the age() will return `8:43:15 - 8:43:01 = 14 (seconds)`
     * @returns {number}
     */
    age() {
        const ageMilliseconds = Date.now() - this.date().getTime();
        const ageSeconds = Math.floor(ageMilliseconds / 1000);
        return ageSeconds;
    }
    /**
     * @description
     * use {@link Message#toFileBox} instead
     * @deprecated
     */
    file() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.warn('Message', 'file() DEPRECATED. use toFileBox() instead.');
            return this.toFileBox();
        });
    }
    /**
     * Extract the Media File from the Message, and put it into the FileBox.
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @returns {Promise<FileBox>}
     *
     * @example <caption>Save media file from a message</caption>
     * const fileBox = await message.toFileBox()
     * const fileName = fileBox.name
     * fileBox.toFile(fileName)
     */
    toFileBox() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.type() === Message.Type.Text) {
                throw new Error('text message no file');
            }
            const fileBox = yield this.puppet.messageFile(this.id);
            return fileBox;
        });
    }
    /**
     * Get Share Card of the Message
     * Extract the Contact Card from the Message, and encapsulate it into Contact class
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * @returns {Promise<Contact>}
     */
    toContact() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.warn('Message', 'toContact() to be implemented');
            if (this.type() === Message.Type.Contact) {
                throw new Error('message not a ShareCard');
            }
            // TODO: return the ShareCard Contact
            const contact = this.wechaty.userSelf();
            return contact;
        });
    }
    toUrlLink() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Message', 'toUrlLink()');
            if (!this.payload) {
                throw new Error('no payload');
            }
            if (this.type() !== Message.Type.Url) {
                throw new Error('message not a Url Link');
            }
            const urlPayload = yield this.puppet.messageUrl(this.id);
            if (!urlPayload) {
                throw new Error(`no url payload for message ${this.id}`);
            }
            return new url_link_1.UrlLink(urlPayload);
        });
    }
    toMiniProgram() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Message', 'toMiniProgram()');
            if (!this.payload) {
                throw new Error('no payload');
            }
            if (this.type() !== Message.Type.MiniProgram) {
                throw new Error('message not a MiniProgram');
            }
            const miniProgramPayload = yield this.puppet.messageMiniProgram(this.id);
            if (!miniProgramPayload) {
                throw new Error(`no miniProgram payload for message ${this.id}`);
            }
            return new mini_program_1.MiniProgram(miniProgramPayload);
        });
    }
}
/**
 *
 * Static Properties
 *
 */
/**
 * @private
 */
// tslint:disable-next-line:variable-name
Message.Type = wechaty_puppet_1.MessageType;
exports.Message = Message;
//# sourceMappingURL=message.js.map