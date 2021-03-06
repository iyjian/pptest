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
const config_1 = require("../config");
const contact_1 = require("./contact");
/**
 * Bot itself will be encapsulated as a ContactSelf.
 *
 * > Tips: this class is extends Contact
 * @example
 * const bot = new Wechaty()
 * await bot.start()
 * bot.on('login', (user: ContactSelf) => {
 *   console.log(`user ${user} login`)
 * })
 */
class ContactSelf extends contact_1.Contact {
    /**
     * GET / SET bot avatar
     *
     * @param {FileBox} [file]
     * @returns {(Promise<void | FileBox>)}
     *
     * @example <caption> GET the avatar for bot, return {Promise<FileBox>}</caption>
     * // Save avatar to local file like `1-name.jpg`
     *
     * bot.on('login', (user: ContactSelf) => {
     *   console.log(`user ${user} login`)
     *   const file = await user.avatar()
     *   const name = file.name
     *   await file.toFile(name, true)
     *   console.log(`Save bot avatar: ${contact.name()} with avatar file: ${name}`)
     * })
     *
     * @example <caption>SET the avatar for a bot</caption>
     * import { FileBox }  from 'file-box'
     * bot.on('login', (user: ContactSelf) => {
     *   console.log(`user ${user} login`)
     *   const fileBox = FileBox.fromUrl('https://chatie.io/wechaty/images/bot-qr-code.png')
     *   await user.avatar(fileBox)
     *   console.log(`Change bot avatar successfully!`)
     * })
     *
     */
    avatar(file) {
        const _super = Object.create(null, {
            avatar: { get: () => super.avatar }
        });
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Contact', 'avatar(%s)', file ? file.name : '');
            if (!file) {
                const filebox = yield _super.avatar.call(this);
                return filebox;
            }
            if (this.id !== this.puppet.selfId()) {
                throw new Error('set avatar only available for user self');
            }
            yield this.puppet.contactAvatar(this.id, file);
        });
    }
    /**
     * Get bot qrcode
     *
     * @returns {Promise<string>}
     *
     * @example
     * import { generate } from 'qrcode-terminal'
     * bot.on('login', (user: ContactSelf) => {
     *   console.log(`user ${user} login`)
     *   const qrcode = await user.qrcode()
     *   console.log(`Following is the bot qrcode!`)
     *   generate(qrcode, { small: true })
     * })
     */
    qrcode() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Contact', 'qrcode()');
            let puppetId;
            try {
                puppetId = this.puppet.selfId();
            }
            catch (e) {
                throw Error('Can not get qrcode, user might be either not logged in or already logged out');
            }
            if (this.id !== puppetId) {
                throw new Error('only can get qrcode for the login userself');
            }
            const qrcodeValue = yield this.puppet.contactSelfQrcode();
            return qrcodeValue;
        });
    }
    name(name) {
        config_1.log.verbose('ContactSelf', 'name(%s)', name || '');
        if (typeof name === 'undefined') {
            return super.name();
        }
        let puppetId;
        try {
            puppetId = this.puppet.selfId();
        }
        catch (e) {
            throw Error('Can not set name for user self, user might be either not logged in or already logged out');
        }
        if (this.id !== puppetId) {
            throw new Error('only can set name for user self');
        }
        return this.puppet.contactSelfName(name).then(this.sync.bind(this));
    }
    /**
     * Change bot signature
     *
     * @param signature The new signature that the bot will change to
     *
     * @example
     * bot.on('login', async user => {
     *   console.log(`user ${user} login`)
     *   try {
     *     await user.signature(`Signature changed by wechaty on ${new Date()}`)
     *   } catch (e) {
     *     console.error('change signature failed', e)
     *   }
     * })
     */
    signature(signature) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('ContactSelf', 'signature()');
            let puppetId;
            try {
                puppetId = this.puppet.selfId();
            }
            catch (e) {
                throw Error('Can not set signature for user self, user might be either not logged in or already logged out');
            }
            if (this.id !== puppetId) {
                throw new Error('only can change signature for user self');
            }
            return this.puppet.contactSelfSignature(signature).then(this.sync.bind(this));
        });
    }
}
exports.ContactSelf = ContactSelf;
//# sourceMappingURL=contact-self.js.map