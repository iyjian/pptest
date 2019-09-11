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
 */
const src_1 = require("../src/"); // from 'wechaty'
const file_box_1 = require("file-box");
const qrcode_terminal_1 = require("qrcode-terminal");
/**
 *
 * 1. Declare your Bot!
 *
 */
const bot = new src_1.Wechaty({
    name: 'ding-dong-bot',
});
/**
 *
 * 2. Register event handlers for Bot
 *
 */
bot
    .on('logout', onLogout)
    .on('login', onLogin)
    .on('scan', onScan)
    .on('error', onError)
    .on('message', onMessage);
/**
 *
 * 3. Start the bot!
 *
 */
bot.start()
    .catch((e) => __awaiter(this, void 0, void 0, function* () {
    console.error('Bot start() fail:', e);
    yield bot.stop();
    process.exit(-1);
}));
/**
 *
 * 4. You are all set. ;-]
 *
 */
/**
 *
 * 5. Define Event Handler Functions for:
 *  `scan`, `login`, `logout`, `error`, and `message`
 *
 */
function onScan(qrcode, status) {
    qrcode_terminal_1.generate(qrcode);
    // Generate a QR Code online via
    // http://goqr.me/api/doc/create-qr-code/
    const qrcodeImageUrl = [
        'https://api.qrserver.com/v1/create-qr-code/?data=',
        encodeURIComponent(qrcode),
    ].join('');
    console.info('%s(%s) - %s', src_1.ScanStatus[status], status, qrcodeImageUrl);
    // console.info(`[${ScanStatus[status]}(${status})] ${qrcodeImageUrl}\nScan QR Code above to log in: `)
}
function onLogin(user) {
    console.info(`${user.name()} login`);
    bot.say('Wechaty login').catch(console.error);
}
function onLogout(user) {
    console.info(`${user.name()} logouted`);
}
function onError(e) {
    console.error('Bot error:', e);
    /*
    if (bot.logonoff()) {
      bot.say('Wechaty error: ' + e.message).catch(console.error)
    }
    */
}
/**
 *
 * 6. The most important handler is for:
 *    dealing with Messages.
 *
 */
function onMessage(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        console.info(msg.toString());
        if (msg.age() > 2 * 60) {
            console.info('Message discarded because its TOO OLD(than 2 minutes)');
            return;
        }
        if (msg.type() !== bot.Message.Type.Text
            || !/^(ding|ping|bing|code)$/i.test(msg.text())
        /* && !msg.self() */
        ) {
            console.info('Message discarded because it does not match ding/ping/bing/code');
            return;
        }
        /**
         * 1. reply 'dong'
         */
        yield msg.say('dong');
        console.info('REPLY: dong');
        /**
         * 2. reply image(qrcode image)
         */
        const fileBox = file_box_1.FileBox.fromUrl('https://chatie.io/wechaty/images/bot-qr-code.png');
        yield msg.say(fileBox);
        console.info('REPLY: %s', fileBox.toString());
        /**
         * 3. reply 'scan now!'
         */
        yield msg.say([
            'Join Wechaty Developers Community\n\n',
            'Scan now, because other Wechaty developers want to talk with you too!\n\n',
            '(secret code: wechaty)',
        ].join(''));
    });
}
/**
 *
 * 7. Output the Welcome Message
 *
 */
const welcome = `
| __        __        _           _
| \\ \\      / /__  ___| |__   __ _| |_ _   _
|  \\ \\ /\\ / / _ \\/ __| '_ \\ / _\` | __| | | |
|   \\ V  V /  __/ (__| | | | (_| | |_| |_| |
|    \\_/\\_/ \\___|\\___|_| |_|\\__,_|\\__|\\__, |
|                                     |___/

=============== Powered by Wechaty ===============
-------- https://github.com/chatie/wechaty --------
          Version: ${bot.version(true)}

I'm a bot, my superpower is talk in Wechat.

If you send me a 'ding', I will reply you a 'dong'!
__________________________________________________

Hope you like it, and you are very welcome to
upgrade me to more superpowers!

Please wait... I'm trying to login in...

`;
console.info(welcome);
//# sourceMappingURL=ding-dong-bot.js.map