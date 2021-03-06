import { FileBox } from 'file-box';
import { MemoryCard } from 'memory-card';
import { StateSwitch } from 'state-switch';
import { Puppet, PuppetOptions, ScanStatus } from 'wechaty-puppet';
import { Accessory } from './accessory';
import { Sayable } from './types';
import { PuppetModuleName } from './puppet-config';
import { Contact, ContactSelf, Friendship, Message, Room, RoomInvitation, UrlLink, MiniProgram } from './user/';
export declare const WECHATY_EVENT_DICT: {
    dong: string;
    error: string;
    heartbeat: string;
    ready: string;
    start: string;
    stop: string;
    friendship: string;
    login: string;
    logout: string;
    message: string;
    'room-invite': string;
    'room-join': string;
    'room-leave': string;
    'room-topic': string;
    scan: string;
};
export declare type WechatyEventName = keyof typeof WECHATY_EVENT_DICT;
export interface WechatyOptions {
    memory?: MemoryCard;
    name?: string;
    profile?: null | string;
    puppet?: PuppetModuleName | Puppet;
    puppetOptions?: PuppetOptions;
    ioToken?: string;
}
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
export declare class Wechaty extends Accessory implements Sayable {
    private options;
    static readonly VERSION = "0.0.0";
    readonly state: StateSwitch;
    private readonly readyState;
    /**
     * singleton globalInstance
     * @private
     */
    private static globalInstance;
    private memory?;
    private lifeTimer?;
    private io?;
    /**
     * the cuid
     * @private
     */
    readonly id: string;
    readonly Contact: typeof Contact;
    readonly ContactSelf: typeof ContactSelf;
    readonly Friendship: typeof Friendship;
    readonly Message: typeof Message;
    readonly RoomInvitation: typeof RoomInvitation;
    readonly Room: typeof Room;
    readonly UrlLink: typeof UrlLink;
    readonly MiniProgram: typeof MiniProgram;
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
    static instance(options?: WechatyOptions): Wechaty;
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
    constructor(options?: WechatyOptions);
    /**
     * @private
     */
    toString(): string;
    emit(event: 'dong', data?: string): boolean;
    emit(event: 'error', error: Error): boolean;
    emit(event: 'friendship', friendship: Friendship): boolean;
    emit(event: 'heartbeat', data: any): boolean;
    emit(event: 'login' | 'logout', user: ContactSelf): boolean;
    emit(event: 'message', message: Message): boolean;
    emit(event: 'ready'): boolean;
    emit(event: 'room-invite', roomInvitation: RoomInvitation): boolean;
    emit(event: 'room-join', room: Room, inviteeList: Contact[], inviter: Contact, date: Date): boolean;
    emit(event: 'room-leave', room: Room, leaverList: Contact[], remover: Contact, date: Date): boolean;
    emit(event: 'room-topic', room: Room, newTopic: string, oldTopic: string, changer: Contact, date: Date): boolean;
    emit(event: 'scan', qrcode: string, status: ScanStatus, data?: string): boolean;
    emit(event: 'start' | 'stop'): boolean;
    emit(event: never, listener: never): never;
    on(event: 'dong', listener: string | ((this: Wechaty, data?: string) => void)): this;
    on(event: 'error', listener: string | ((this: Wechaty, error: Error) => void)): this;
    on(event: 'friendship', listener: string | ((this: Wechaty, friendship: Friendship) => void)): this;
    on(event: 'heartbeat', listener: string | ((this: Wechaty, data: any) => void)): this;
    on(event: 'login' | 'logout', listener: string | ((this: Wechaty, user: ContactSelf) => void)): this;
    on(event: 'message', listener: string | ((this: Wechaty, message: Message) => void)): this;
    on(event: 'ready', listener: string | ((this: Wechaty) => void)): this;
    on(event: 'room-invite', listener: string | ((this: Wechaty, roomInvitation: RoomInvitation) => void)): this;
    on(event: 'room-join', listener: string | ((this: Wechaty, room: Room, inviteeList: Contact[], inviter: Contact, date?: Date) => void)): this;
    on(event: 'room-leave', listener: string | ((this: Wechaty, room: Room, leaverList: Contact[], remover?: Contact, date?: Date) => void)): this;
    on(event: 'room-topic', listener: string | ((this: Wechaty, room: Room, newTopic: string, oldTopic: string, changer: Contact, date?: Date) => void)): this;
    on(event: 'scan', listener: string | ((this: Wechaty, qrcode: string, status: ScanStatus, data?: string) => void)): this;
    on(event: 'start' | 'stop', listener: string | ((this: Wechaty) => void)): this;
    on(event: never, listener: never): never;
    private addListenerModuleFile;
    private addListenerFunction;
    private initPuppet;
    protected initPuppetEventBridge(puppet: Puppet): void;
    protected initPuppetAccessory(puppet: Puppet): void;
    /**
     * @desc
     * use {@link Wechaty#start} instead
     * @deprecated
     * @private
     */
    init(): Promise<void>;
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
    start(): Promise<void>;
    /**
     * Stop the bot
     *
     * @returns {Promise<void>}
     * @example
     * await bot.stop()
     */
    stop(): Promise<void>;
    ready(): Promise<void>;
    /**
     * Logout the bot
     *
     * @returns {Promise<void>}
     * @example
     * await bot.logout()
     */
    logout(): Promise<void>;
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
    logonoff(): boolean;
    /**
     * @description
     * Should use {@link Wechaty#userSelf} instead
     * @deprecated Use `userSelf()` instead
     * @private
     */
    self(): Contact;
    /**
     * Get current user
     *
     * @returns {ContactSelf}
     * @example
     * const contact = bot.userSelf()
     * console.log(`Bot is ${contact.name()}`)
     */
    userSelf(): ContactSelf;
    say(text: string): Promise<void>;
    say(contact: Contact): Promise<void>;
    say(file: FileBox): Promise<void>;
    say(mini: MiniProgram): Promise<void>;
    say(url: UrlLink): Promise<void>;
    say(...args: never[]): Promise<never>;
    /**
     * @private
     */
    static version(forceNpm?: boolean): string;
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
    version(forceNpm?: boolean): string;
    /**
     * @private
     */
    static sleep(millisecond: number): Promise<void>;
    /**
     * @private
     */
    ding(data?: string): void;
    /**
     * @private
     */
    private memoryCheck;
    /**
     * @private
     */
    reset(reason?: string): Promise<void>;
    unref(): void;
}
//# sourceMappingURL=wechaty.d.ts.map