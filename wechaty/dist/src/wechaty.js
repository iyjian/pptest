"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
 *  @ignore
 */
const cuid_1 = __importDefault(require("cuid"));
const os_1 = __importDefault(require("os"));
const clone_class_1 = require("clone-class");
const hot_import_1 = require("hot-import");
const memory_card_1 = require("memory-card");
const state_switch_1 = require("state-switch");
const wechaty_puppet_1 = require("wechaty-puppet");
const accessory_1 = require("./accessory");
const config_1 = require("./config");
const io_1 = require("./io");
const puppet_manager_1 = require("./puppet-manager");
const user_1 = require("./user/");
exports.WECHATY_EVENT_DICT = Object.assign({}, wechaty_puppet_1.CHAT_EVENT_DICT, { dong: 'Should be emitted after we call `Wechaty.ding()`', error: `Will be emit when there's an Error occurred.`, heartbeat: 'Will be emited periodly after the Wechaty started. If not, means that the Wechaty had died.', ready: 'All underlined data source are ready for use.', start: 'Will be emitted after the Wechaty had been started.', stop: 'Will be emitted after the Wechaty had been stopped.' });
const PUPPET_MEMORY_NAME = 'puppet';
/**
 * Main bot class.
 *
 * A `Bot` is a wechat client depends on which puppet you use.
 * It may equals
 * - web-wechat, when you use: [puppet-puppeteer](https://github.com/chatie/wechaty-puppet-puppeteer)/[puppet-wechat4u](https://github.com/chatie/wechaty-puppet-wechat4u)
 * - ipad-wechat, when you use: [puppet-padchat](https://github.com/lijiarui/wechaty-puppet-padchat)
 * - ios-wechat, when you use: puppet-ioscat
 *
 * See more:
 * - [What is a Puppet in Wechaty](https://github.com/Chatie/wechaty-getting-started/wiki/FAQ-EN#31-what-is-a-puppet-in-wechaty)
 *
 * > If you want to know how to send message, see [Message](#Message) <br>
 * > If you want to know how to get contact, see [Contact](#Contact)
 *
 * @example <caption>The World's Shortest ChatBot Code: 6 lines of JavaScript</caption>
 * const { Wechaty } = require('wechaty')
 * const bot = new Wechaty()
 * bot.on('scan',    (qrcode, status) => console.log(['https://api.qrserver.com/v1/create-qr-code/?data=',encodeURIComponent(qrcode),'&size=220x220&margin=20',].join('')))
 * bot.on('login',   user => console.log(`User ${user} logined`))
 * bot.on('message', message => console.log(`Message: ${message}`))
 * bot.start()
 */
class Wechaty extends accessory_1.Accessory {
    /**
     * The term [Puppet](https://github.com/Chatie/wechaty/wiki/Puppet) in Wechaty is an Abstract Class for implementing protocol plugins.
     * The plugins are the component that helps Wechaty to control the Wechat(that's the reason we call it puppet).
     * The plugins are named XXXPuppet, for example:
     * - [PuppetPuppeteer](https://github.com/Chatie/wechaty-puppet-puppeteer):
     * - [PuppetPadchat](https://github.com/lijiarui/wechaty-puppet-padchat)
     *
     * @typedef    PuppetModuleName
     * @property   {string}  PUPPET_DEFAULT
     * The default puppet.
     * @property   {string}  wechaty-puppet-wechat4u
     * The default puppet, using the [wechat4u](https://github.com/nodeWechat/wechat4u) to control the [WeChat Web API](https://wx.qq.com/) via a chrome browser.
     * @property   {string}  wechaty-puppet-padchat
     * - Using the WebSocket protocol to connect with a Protocol Server for controlling the iPad Wechat program.
     * @property   {string}  wechaty-puppet-puppeteer
     * - Using the [google puppeteer](https://github.com/GoogleChrome/puppeteer) to control the [WeChat Web API](https://wx.qq.com/) via a chrome browser.
     * @property   {string}  wechaty-puppet-mock
     * - Using the mock data to mock wechat operation, just for test.
     */
    /**
     * The option parameter to create a wechaty instance
     *
     * @typedef    WechatyOptions
     * @property   {string}                 name            -Wechaty Name. </br>
     *          When you set this: </br>
     *          `new Wechaty({name: 'wechaty-name'}) ` </br>
     *          it will generate a file called `wechaty-name.memory-card.json`. </br>
     *          This file stores the bot's login information. </br>
     *          If the file is valid, the bot can auto login so you don't need to scan the qrcode to login again. </br>
     *          Also, you can set the environment variable for `WECHATY_NAME` to set this value when you start. </br>
     *          eg:  `WECHATY_NAME="your-cute-bot-name" node bot.js`
     * @property   {PuppetModuleName | Puppet}    puppet             -Puppet name or instance
     * @property   {Partial<PuppetOptions>} puppetOptions      -Puppet TOKEN
     * @property   {string}                 ioToken            -Io TOKEN
     */
    /**
     * Creates an instance of Wechaty.
     * @param {WechatyOptions} [options={}]
     *
     */
    constructor(options = {}) {
        super();
        this.options = options;
        config_1.log.verbose('Wechaty', 'contructor()');
        if (!options.name && options.profile) {
            config_1.log.verbose('Wechaty', 'constuctor() WechatyOptions.profile DEPRECATED. use WechatyOptions.name instead.');
            options.name = options.profile;
        }
        this.memory = this.options.memory;
        this.id = cuid_1.default();
        this.state = new state_switch_1.StateSwitch('Wechaty', config_1.log);
        this.readyState = new state_switch_1.StateSwitch('WechatyReady', config_1.log);
        /**
         * @ignore
         * Clone Classes for this bot and attach the `puppet` to the Class
         *
         *   https://stackoverflow.com/questions/36886082/abstract-constructor-type-in-typescript
         *   https://github.com/Microsoft/TypeScript/issues/5843#issuecomment-290972055
         *   https://github.com/Microsoft/TypeScript/issues/19197
         */
        // TODO: make Message & Room constructor private???
        this.Contact = clone_class_1.cloneClass(user_1.Contact);
        this.ContactSelf = clone_class_1.cloneClass(user_1.ContactSelf);
        this.Friendship = clone_class_1.cloneClass(user_1.Friendship);
        this.Message = clone_class_1.cloneClass(user_1.Message);
        this.Room = clone_class_1.cloneClass(user_1.Room);
        this.RoomInvitation = clone_class_1.cloneClass(user_1.RoomInvitation);
        // No need to set puppet/wechaty, so no need to clone
        this.UrlLink = user_1.UrlLink;
        this.MiniProgram = user_1.MiniProgram;
    }
    /**
     * Get the global instance of Wechaty
     *
     * @param {WechatyOptions} [options={}]
     *
     * @example <caption>The World's Shortest ChatBot Code: 6 lines of JavaScript</caption>
     * const { Wechaty } = require('wechaty')
     *
     * Wechaty.instance() // Global instance
     * .on('scan', (url, status) => console.log(`Scan QR Code to login: ${status}\n${url}`))
     * .on('login',       user => console.log(`User ${user} logined`))
     * .on('message',  message => console.log(`Message: ${message}`))
     * .start()
     */
    static instance(options) {
        if (options && this.globalInstance) {
            throw new Error('instance can be only inited once by options!');
        }
        if (!this.globalInstance) {
            this.globalInstance = new Wechaty(options);
        }
        return this.globalInstance;
    }
    /**
     * @private
     */
    toString() {
        if (!this.options) {
            return this.constructor.name;
        }
        return [
            'Wechaty#',
            this.id,
            `<${(this.options && this.options.puppet) || ''}>`,
            `(${(this.memory && this.memory.name) || ''})`,
        ].join('');
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    /**
     * @desc       Wechaty Class Event Type
     * @typedef    WechatyEventName
     * @property   {string}  error       - When the bot get error, there will be a Wechaty error event fired.
     * @property   {string}  login       - After the bot login full successful, the event login will be emitted, with a Contact of current logined user.
     * @property   {string}  logout      - Logout will be emitted when bot detected log out, with a Contact of the current login user.
     * @property   {string}  heartbeat   - Get bot's heartbeat.
     * @property   {string}  friendship  - When someone sends you a friend request, there will be a Wechaty friendship event fired.
     * @property   {string}  message     - Emit when there's a new message.
     * @property   {string}  ready       - Emit when all data has load completed, in wechaty-puppet-padchat, it means it has sync Contact and Room completed
     * @property   {string}  room-join   - Emit when anyone join any room.
     * @property   {string}  room-topic  - Get topic event, emitted when someone change room topic.
     * @property   {string}  room-leave  - Emit when anyone leave the room.<br>
     *                                   - If someone leaves the room by themselves, wechat will not notice other people in the room, so the bot will never get the "leave" event.
     * @property   {string}  room-invite - Emit when there is a room invitation, see more in  {@link RoomInvitation}
     * @property   {string}  scan        - A scan event will be emitted when the bot needs to show you a QR Code for scanning. </br>
     *                                    It is recommend to install qrcode-terminal(run `npm install qrcode-terminal`) in order to show qrcode in the terminal.
     */
    /**
     * @desc       Wechaty Class Event Function
     * @typedef    WechatyEventFunction
     * @property   {Function} error           -(this: Wechaty, error: Error) => void callback function
     * @property   {Function} login           -(this: Wechaty, user: ContactSelf)=> void
     * @property   {Function} logout          -(this: Wechaty, user: ContactSelf) => void
     * @property   {Function} scan            -(this: Wechaty, url: string, code: number) => void <br>
     * <ol>
     * <li>URL: {String} the QR code image URL</li>
     * <li>code: {Number} the scan status code. some known status of the code list here is:</li>
     * </ol>
     * <ul>
     * <li>0 initial_</li>
     * <li>200 login confirmed</li>
     * <li>201 scaned, wait for confirm</li>
     * <li>408 waits for scan</li>
     * </ul>
     * @property   {Function} heartbeat       -(this: Wechaty, data: any) => void
     * @property   {Function} friendship      -(this: Wechaty, friendship: Friendship) => void
     * @property   {Function} message         -(this: Wechaty, message: Message) => void
     * @property   {Function} ready           -(this: Wechaty) => void
     * @property   {Function} room-join       -(this: Wechaty, room: Room, inviteeList: Contact[],  inviter: Contact) => void
     * @property   {Function} room-topic      -(this: Wechaty, room: Room, newTopic: string, oldTopic: string, changer: Contact) => void
     * @property   {Function} room-leave      -(this: Wechaty, room: Room, leaverList: Contact[]) => void
     * @property   {Function} room-invite     -(this: Wechaty, room: Room, roomInvitation: RoomInvitation) => void <br>
     *                                        see more in  {@link RoomInvitation}
     */
    /**
     * @listens Wechaty
     * @param   {WechatyEventName}      event      - Emit WechatyEvent
     * @param   {WechatyEventFunction}  listener   - Depends on the WechatyEvent
     *
     * @return  {Wechaty}                          - this for chaining,
     * see advanced {@link https://github.com/Chatie/wechaty-getting-started/wiki/FAQ-EN#36-why-wechatyonevent-listener-return-wechaty|chaining usage}
     *
     * @desc
     * When the bot get message, it will emit the following Event.
     *
     * You can do anything you want when in these events functions.
     * The main Event name as follows:
     * - **scan**: Emit when the bot needs to show you a QR Code for scanning. After scan the qrcode, you can login
     * - **login**: Emit when bot login full successful.
     * - **logout**: Emit when bot detected log out.
     * - **message**: Emit when there's a new message.
     *
     * see more in {@link WechatyEventName}
     *
     * @example <caption>Event:scan</caption>
     * // Scan Event will emit when the bot needs to show you a QR Code for scanning
     *
     * bot.on('scan', (url, status) => {
     *   console.log(`[${status}] Scan ${url} to login.` )
     * })
     *
     * @example <caption>Event:login </caption>
     * // Login Event will emit when bot login full successful.
     *
     * bot.on('login', (user) => {
     *   console.log(`user ${user} login`)
     * })
     *
     * @example <caption>Event:logout </caption>
     * // Logout Event will emit when bot detected log out.
     *
     * bot.on('logout', (user) => {
     *   console.log(`user ${user} logout`)
     * })
     *
     * @example <caption>Event:message </caption>
     * // Message Event will emit when there's a new message.
     *
     * wechaty.on('message', (message) => {
     *   console.log(`message ${message} received`)
     * })
     *
     * @example <caption>Event:friendship </caption>
     * // Friendship Event will emit when got a new friend request, or friendship is confirmed.
     *
     * bot.on('friendship', (friendship) => {
     *   if(friendship.type() === Friendship.Type.Receive){ // 1. receive new friendship request from new contact
     *     const contact = friendship.contact()
     *     let result = await friendship.accept()
     *       if(result){
     *         console.log(`Request from ${contact.name()} is accept succesfully!`)
     *       } else{
     *         console.log(`Request from ${contact.name()} failed to accept!`)
     *       }
     *  } else if (friendship.type() === Friendship.Type.Confirm) { // 2. confirm friendship
     *       console.log(`new friendship confirmed with ${contact.name()}`)
     *    }
     *  })
     *
     * @example <caption>Event:room-join </caption>
     * // room-join Event will emit when someone join the room.
     *
     * bot.on('room-join', (room, inviteeList, inviter) => {
     *   const nameList = inviteeList.map(c => c.name()).join(',')
     *   console.log(`Room ${room.topic()} got new member ${nameList}, invited by ${inviter}`)
     * })
     *
     * @example <caption>Event:room-leave </caption>
     * // room-leave Event will emit when someone leave the room.
     *
     * bot.on('room-leave', (room, leaverList) => {
     *   const nameList = leaverList.map(c => c.name()).join(',')
     *   console.log(`Room ${room.topic()} lost member ${nameList}`)
     * })
     *
     * @example <caption>Event:room-topic </caption>
     * // room-topic Event will emit when someone change the room's topic.
     *
     * bot.on('room-topic', (room, topic, oldTopic, changer) => {
     *   console.log(`Room ${room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
     * })
     *
     * @example <caption>Event:room-invite, RoomInvitation has been encapsulated as a RoomInvitation Class. </caption>
     * // room-invite Event will emit when there's an room invitation.
     *
     * bot.on('room-invite', async roomInvitation => {
     *   try {
     *     console.log(`received room-invite event.`)
     *     await roomInvitation.accept()
     *   } catch (e) {
     *     console.error(e)
     *   }
     * }
     *
     * @example <caption>Event:error </caption>
     * // error Event will emit when there's an error occurred.
     *
     * bot.on('error', (error) => {
     *   console.error(error)
     * })
     */
    on(event, listener) {
        config_1.log.verbose('Wechaty', 'on(%s, %s) registered', event, typeof listener === 'string'
            ? listener
            : typeof listener);
        // DEPRECATED for 'friend' event
        if (event === 'friend') {
            config_1.log.warn('Wechaty', `on('friend', contact, friendRequest) is DEPRECATED. use on('friendship', friendship) instead`);
            if (typeof listener === 'function') {
                const oldListener = listener;
                listener = (...args) => {
                    config_1.log.warn('Wechaty', `on('friend', contact, friendRequest) is DEPRECATED. use on('friendship', friendship) instead`);
                    oldListener.apply(this, args);
                };
            }
        }
        if (typeof listener === 'function') {
            this.addListenerFunction(event, listener);
        }
        else {
            this.addListenerModuleFile(event, listener);
        }
        return this;
    }
    addListenerModuleFile(event, modulePath) {
        const absoluteFilename = hot_import_1.callerResolve(modulePath, __filename);
        config_1.log.verbose('Wechaty', 'onModulePath() hotImport(%s)', absoluteFilename);
        hot_import_1.hotImport(absoluteFilename)
            .then((func) => super.on(event, (...args) => {
            try {
                func.apply(this, args);
            }
            catch (e) {
                config_1.log.error('Wechaty', 'onModulePath(%s, %s) listener exception: %s', event, modulePath, e);
                this.emit('error', e);
            }
        }))
            .catch(e => {
            config_1.log.error('Wechaty', 'onModulePath(%s, %s) hotImport() exception: %s', event, modulePath, e);
            this.emit('error', e);
        });
        if (config_1.isProduction()) {
            config_1.log.silly('Wechaty', 'addListenerModuleFile() disable watch for hotImport because NODE_ENV is production.');
            hot_import_1.hotImport(absoluteFilename, false)
                .catch(e => config_1.log.error('Wechaty', 'addListenerModuleFile() hotImport() rejection: %s', e));
        }
    }
    addListenerFunction(event, listener) {
        config_1.log.verbose('Wechaty', 'onFunction(%s)', event);
        super.on(event, (...args) => {
            try {
                listener.apply(this, args);
            }
            catch (e) {
                config_1.log.error('Wechaty', 'onFunction(%s) listener exception: %s', event, e);
                this.emit('error', e);
            }
        });
    }
    initPuppet() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Wechaty', 'initPuppet() %s', this.options.puppet || '');
            let inited = false;
            try {
                inited = !!this.puppet;
            }
            catch (e) {
                inited = false;
            }
            if (inited) {
                config_1.log.verbose('Wechaty', 'initPuppet(%s) had already been inited, no need to init twice', this.options.puppet);
                return;
            }
            if (!this.memory) {
                throw new Error('no memory');
            }
            const puppet = this.options.puppet || config_1.config.systemPuppetName();
            const puppetMemory = this.memory.multiplex(PUPPET_MEMORY_NAME);
            const puppetInstance = yield puppet_manager_1.PuppetManager.resolve({
                puppet,
                puppetOptions: this.options.puppetOptions,
            });
            /**
             * Plug the Memory Card to Puppet
             */
            puppetInstance.setMemory(puppetMemory);
            this.initPuppetEventBridge(puppetInstance);
            this.initPuppetAccessory(puppetInstance);
        });
    }
    initPuppetEventBridge(puppet) {
        config_1.log.verbose('Wechaty', 'initPuppetEventBridge(%s)', puppet);
        const eventNameList = Object.keys(wechaty_puppet_1.PUPPET_EVENT_DICT);
        for (const eventName of eventNameList) {
            config_1.log.verbose('Wechaty', 'initPuppetEventBridge() puppet.on(%s) registered', eventName);
            switch (eventName) {
                case 'dong':
                    puppet.on('dong', data => {
                        this.emit('dong', data);
                    });
                    break;
                case 'error':
                    puppet.on('error', error => {
                        this.emit('error', new Error(error));
                    });
                    break;
                case 'watchdog':
                    puppet.on('watchdog', data => {
                        /**
                         * Use `watchdog` event from Puppet to `heartbeat` Wechaty.
                         */
                        // TODO: use a throttle queue to prevent beat too fast.
                        this.emit('heartbeat', data);
                    });
                    break;
                case 'friendship':
                    puppet.on('friendship', (friendshipId) => __awaiter(this, void 0, void 0, function* () {
                        const friendship = this.Friendship.load(friendshipId);
                        yield friendship.ready();
                        this.emit('friendship', friendship);
                        friendship.contact().emit('friendship', friendship);
                        // support deprecated event name: friend.
                        // Huan LI 201806
                        this.emit('friend', friendship);
                    }));
                    break;
                case 'login':
                    puppet.on('login', (contactId) => __awaiter(this, void 0, void 0, function* () {
                        const contact = this.ContactSelf.load(contactId);
                        yield contact.ready();
                        this.emit('login', contact);
                    }));
                    break;
                case 'logout':
                    puppet.on('logout', (contactId) => __awaiter(this, void 0, void 0, function* () {
                        const contact = this.ContactSelf.load(contactId);
                        yield contact.ready();
                        this.emit('logout', contact);
                    }));
                    break;
                case 'message':
                    puppet.on('message', (messageId) => __awaiter(this, void 0, void 0, function* () {
                        const msg = this.Message.load(messageId);
                        yield msg.ready();
                        this.emit('message', msg);
                    }));
                    break;
                case 'ready':
                    puppet.on('ready', () => {
                        config_1.log.silly('Wechaty', 'initPuppetEventBridge() puppet.on(ready)');
                        this.emit('ready');
                        this.readyState.on(true);
                    });
                    break;
                case 'room-invite':
                    puppet.on('room-invite', (roomInvitationId) => __awaiter(this, void 0, void 0, function* () {
                        const roomInvitation = this.RoomInvitation.load(roomInvitationId);
                        this.emit('room-invite', roomInvitation);
                    }));
                    break;
                case 'room-join':
                    puppet.on('room-join', (roomId, inviteeIdList, inviterId, timestamp) => __awaiter(this, void 0, void 0, function* () {
                        const room = this.Room.load(roomId);
                        yield room.sync();
                        const inviteeList = inviteeIdList.map(id => this.Contact.load(id));
                        yield Promise.all(inviteeList.map(c => c.ready()));
                        const inviter = this.Contact.load(inviterId);
                        yield inviter.ready();
                        const date = new Date(timestamp);
                        this.emit('room-join', room, inviteeList, inviter, date);
                        room.emit('join', inviteeList, inviter, date);
                    }));
                    break;
                case 'room-leave':
                    puppet.on('room-leave', (roomId, leaverIdList, removerId, timestamp) => __awaiter(this, void 0, void 0, function* () {
                        const room = this.Room.load(roomId);
                        yield room.sync();
                        const leaverList = leaverIdList.map(id => this.Contact.load(id));
                        yield Promise.all(leaverList.map(c => c.ready()));
                        const remover = this.Contact.load(removerId);
                        yield remover.ready();
                        const date = new Date(timestamp);
                        this.emit('room-leave', room, leaverList, remover, date);
                        room.emit('leave', leaverList, remover, date);
                        // issue #254
                        if (leaverIdList.includes(this.puppet.selfId())) {
                            yield this.puppet.roomPayloadDirty(roomId);
                            yield this.puppet.roomMemberPayloadDirty(roomId);
                        }
                    }));
                    break;
                case 'room-topic':
                    puppet.on('room-topic', (roomId, newTopic, oldTopic, changerId, timestamp) => __awaiter(this, void 0, void 0, function* () {
                        const room = this.Room.load(roomId);
                        yield room.sync();
                        const changer = this.Contact.load(changerId);
                        yield changer.ready();
                        const date = new Date(timestamp);
                        this.emit('room-topic', room, newTopic, oldTopic, changer, date);
                        room.emit('topic', newTopic, oldTopic, changer, date);
                    }));
                    break;
                case 'scan':
                    puppet.on('scan', (qrcode, status, data) => __awaiter(this, void 0, void 0, function* () {
                        this.emit('scan', qrcode, status, data);
                    }));
                    break;
                case 'reset':
                    break;
                default:
                    throw new Error('eventName ' + eventName + ' unsupported!');
            }
        }
    }
    initPuppetAccessory(puppet) {
        config_1.log.verbose('Wechaty', 'initAccessory(%s)', puppet);
        /**
         * 1. Set Wechaty
         */
        this.Contact.wechaty = this;
        this.ContactSelf.wechaty = this;
        this.Friendship.wechaty = this;
        this.Message.wechaty = this;
        this.Room.wechaty = this;
        this.RoomInvitation.wechaty = this;
        /**
         * 2. Set Puppet
         */
        this.Contact.puppet = puppet;
        this.ContactSelf.puppet = puppet;
        this.Friendship.puppet = puppet;
        this.Message.puppet = puppet;
        this.Room.puppet = puppet;
        this.RoomInvitation.puppet = puppet;
        this.puppet = puppet;
    }
    /**
     * @desc
     * use {@link Wechaty#start} instead
     * @deprecated
     * @private
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.warn('Wechaty', 'init() DEPRECATED. use start() instead.');
            return this.start();
        });
    }
    /**
     * Start the bot, return Promise.
     *
     * @returns {Promise<void>}
     * @description
     * When you start the bot, bot will begin to login, need you wechat scan qrcode to login
     * > Tips: All the bot operation needs to be triggered after start() is done
     * @example
     * await bot.start()
     * // do other stuff with bot here
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.info('Wechaty', '<%s>(%s) start() v%s is starting...', this.options.puppet || config_1.config.systemPuppetName(), this.options.name || '', this.version());
            config_1.log.verbose('Wechaty', 'puppet: %s', this.options.puppet);
            config_1.log.verbose('Wechaty', 'name: %s', this.options.name);
            config_1.log.verbose('Wechaty', 'id: %s', this.id);
            if (this.state.on()) {
                config_1.log.silly('Wechaty', 'start() on a starting/started instance');
                yield this.state.ready('on');
                config_1.log.silly('Wechaty', 'start() state.ready() resolved');
                return;
            }
            this.readyState.off(true);
            if (this.lifeTimer) {
                throw new Error('start() lifeTimer exist');
            }
            this.state.on('pending');
            try {
                if (!this.memory) {
                    this.memory = new memory_card_1.MemoryCard(this.options.name);
                }
                try {
                    yield this.memory.load();
                }
                catch (e) {
                    config_1.log.silly('Wechaty', 'start() memory.load() had already loaded');
                }
                yield this.initPuppet();
                yield this.puppet.start();
                if (this.options.ioToken) {
                    this.io = new io_1.Io({
                        token: this.options.ioToken,
                        wechaty: this,
                    });
                    yield this.io.start();
                }
            }
            catch (e) {
                console.error(e);
                config_1.log.error('Wechaty', 'start() exception: %s', e && e.message);
                config_1.Raven.captureException(e);
                this.emit('error', e);
                try {
                    yield this.stop();
                }
                catch (e) {
                    config_1.log.error('Wechaty', 'start() stop() exception: %s', e && e.message);
                    config_1.Raven.captureException(e);
                    this.emit('error', e);
                }
                return;
            }
            this.on('heartbeat', () => this.memoryCheck());
            this.lifeTimer = setInterval(() => {
                config_1.log.silly('Wechaty', 'start() setInterval() this timer is to keep Wechaty running...');
            }, 1000 * 60 * 60);
            this.state.on(true);
            this.emit('start');
        });
    }
    /**
     * Stop the bot
     *
     * @returns {Promise<void>}
     * @example
     * await bot.stop()
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.info('Wechaty', '<%s> stop() v%s is stoping ...', this.options.puppet || config_1.config.systemPuppetName(), this.version());
            if (this.state.off()) {
                config_1.log.silly('Wechaty', 'stop() on an stopping/stopped instance');
                yield this.state.ready('off');
                config_1.log.silly('Wechaty', 'stop() state.ready(off) resolved');
                return;
            }
            this.readyState.off(true);
            this.state.off('pending');
            if (this.lifeTimer) {
                clearInterval(this.lifeTimer);
                this.lifeTimer = undefined;
            }
            try {
                yield this.puppet.stop();
            }
            catch (e) {
                config_1.log.warn('Wechaty', 'stop() puppet.stop() exception: %s', e.message);
            }
            try {
                if (this.io) {
                    yield this.io.stop();
                    this.io = undefined;
                }
            }
            catch (e) {
                config_1.log.error('Wechaty', 'stop() exception: %s', e.message);
                config_1.Raven.captureException(e);
                this.emit('error', e);
            }
            this.state.off(true);
            this.emit('stop');
        });
    }
    ready() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Wechaty', 'ready()');
            return this.readyState.ready('on').then(() => {
                return config_1.log.silly('Wechaty', 'ready() this.readyState.ready(on) resolved');
            });
        });
    }
    /**
     * Logout the bot
     *
     * @returns {Promise<void>}
     * @example
     * await bot.logout()
     */
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Wechaty', 'logout()');
            try {
                yield this.puppet.logout();
            }
            catch (e) {
                config_1.log.error('Wechaty', 'logout() exception: %s', e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
        });
    }
    /**
     * Get the logon / logoff state
     *
     * @returns {boolean}
     * @example
     * if (bot.logonoff()) {
     *   console.log('Bot logined')
     * } else {
     *   console.log('Bot not logined')
     * }
     */
    logonoff() {
        return this.puppet.logonoff();
    }
    /**
     * @description
     * Should use {@link Wechaty#userSelf} instead
     * @deprecated Use `userSelf()` instead
     * @private
     */
    self() {
        config_1.log.warn('Wechaty', 'self() DEPRECATED. use userSelf() instead.');
        return this.userSelf();
    }
    /**
     * Get current user
     *
     * @returns {ContactSelf}
     * @example
     * const contact = bot.userSelf()
     * console.log(`Bot is ${contact.name()}`)
     */
    userSelf() {
        const userId = this.puppet.selfId();
        const user = this.ContactSelf.load(userId);
        return user;
    }
    /**
     * Send message to userSelf, in other words, bot send message to itself.
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @param {(string | Contact | FileBox | UrlLink | MiniProgram)} something
     * send text, Contact, or file to bot. </br>
     * You can use {@link https://www.npmjs.com/package/file-box|FileBox} to send file
     *
     * @returns {Promise<void>}
     *
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in
     *
     * // 1. send text to bot itself
     * await bot.say('hello!')
     *
     * // 2. send Contact to bot itself
     * const contact = await bot.Contact.find()
     * await bot.say(contact)
     *
     * // 3. send Image to bot itself from remote url
     * import { FileBox }  from 'file-box'
     * const fileBox = FileBox.fromUrl('https://chatie.io/wechaty/images/bot-qr-code.png')
     * await bot.say(fileBox)
     *
     * // 4. send Image to bot itself from local file
     * import { FileBox }  from 'file-box'
     * const fileBox = FileBox.fromFile('/tmp/text.jpg')
     * await bot.say(fileBox)
     *
     * // 5. send Link to bot itself
     * const linkPayload = new UrlLink ({
     *   description : 'WeChat Bot SDK for Individual Account, Powered by TypeScript, Docker, and Love',
     *   thumbnailUrl: 'https://avatars0.githubusercontent.com/u/25162437?s=200&v=4',
     *   title       : 'Welcome to Wechaty',
     *   url         : 'https://github.com/chatie/wechaty',
     * })
     * await bot.say(linkPayload)
     *
     * // 6. send MiniProgram to bot itself
     * const miniPayload = new MiniProgram ({
     *   username           : 'gh_xxxxxxx',     //get from mp.weixin.qq.com
     *   appid              : '',               //optional, get from mp.weixin.qq.com
     *   title              : '',               //optional
     *   pagepath           : '',               //optional
     *   description        : '',               //optional
     *   thumbnailurl       : '',               //optional
     * })
     * await bot.say(miniPayload)
     */
    say(something) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Wechaty', 'say(%s)', something);
            // huan: to make TypeScript happy
            yield this.userSelf().say(something);
        });
    }
    /**
     * @private
     */
    static version(forceNpm = false) {
        if (!forceNpm) {
            const revision = config_1.config.gitRevision();
            if (revision) {
                return `#git[${revision}]`;
            }
        }
        return config_1.VERSION;
    }
    /**
     * @private
     * Return version of Wechaty
     *
     * @param {boolean} [forceNpm=false]  - If set to true, will only return the version in package.json. </br>
     *                                      Otherwise will return git commit hash if .git exists.
     * @returns {string}                  - the version number
     * @example
     * console.log(Wechaty.instance().version())       // return '#git[af39df]'
     * console.log(Wechaty.instance().version(true))   // return '0.7.9'
     */
    version(forceNpm = false) {
        return Wechaty.version(forceNpm);
    }
    /**
     * @private
     */
    static sleep(millisecond) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => {
                setTimeout(resolve, millisecond);
            });
        });
    }
    /**
     * @private
     */
    ding(data) {
        config_1.log.silly('Wechaty', 'ding(%s)', data || '');
        try {
            this.puppet.ding(data);
        }
        catch (e) {
            config_1.log.error('Wechaty', 'ding() exception: %s', e.message);
            config_1.Raven.captureException(e);
            throw e;
        }
    }
    /**
     * @private
     */
    memoryCheck(minMegabyte = 4) {
        const freeMegabyte = Math.floor(os_1.default.freemem() / 1024 / 1024);
        config_1.log.silly('Wechaty', 'memoryCheck() free: %d MB, require: %d MB', freeMegabyte, minMegabyte);
        if (freeMegabyte < minMegabyte) {
            const e = new Error(`memory not enough: free ${freeMegabyte} < require ${minMegabyte} MB`);
            config_1.log.warn('Wechaty', 'memoryCheck() %s', e.message);
            this.emit('error', e);
        }
    }
    /**
     * @private
     */
    reset(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Wechaty', 'reset() because %s', reason || 'no reason');
            yield this.puppet.stop();
            yield this.puppet.start();
        });
    }
    unref() {
        config_1.log.verbose('Wechaty', 'unref()');
        if (this.lifeTimer) {
            this.lifeTimer.unref();
        }
        this.puppet.unref();
    }
}
Wechaty.VERSION = config_1.VERSION;
exports.Wechaty = Wechaty;
//# sourceMappingURL=wechaty.js.map