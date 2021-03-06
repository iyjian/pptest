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
/**
 * DO NOT use `require('../')` here!
 * because it will casue a LOOP require ERROR
 */
const state_switch_1 = require("state-switch");
const config_1 = require("./config");
const io_1 = require("./io");
class IoClient {
    constructor(options) {
        this.options = options;
        config_1.log.verbose('IoClient', 'constructor(%s)', JSON.stringify(options));
        this.state = new state_switch_1.StateSwitch('IoClient', config_1.log);
        this.io = new io_1.Io({
            token: this.options.token,
            wechaty: this.options.wechaty,
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('IoClient', 'init()');
            if (this.state.pending()) {
                config_1.log.warn('IoClient', 'start() with a pending state, not the time');
                const e = new Error('state.pending() when start()');
                throw e;
            }
            this.state.on('pending');
            try {
                yield this.startIo();
                yield this.hookWechaty(this.options.wechaty);
                this.state.on(true);
            }
            catch (e) {
                config_1.log.error('IoClient', 'init() exception: %s', e.message);
                this.state.off(true);
                throw e;
            }
        });
    }
    hookWechaty(wechaty) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('IoClient', 'initWechaty()');
            if (this.state.off()) {
                const e = new Error('state.off() is true, skipped');
                config_1.log.warn('IoClient', 'initWechaty() %s', e.message);
                throw e;
            }
            wechaty
                .on('login', user => config_1.log.info('IoClient', `${user.name()} logined`))
                .on('logout', user => config_1.log.info('IoClient', `${user.name()} logouted`))
                .on('scan', (url, code) => config_1.log.info('IoClient', `[${code}] ${url}`))
                .on('message', msg => this.onMessage(msg));
        });
    }
    startIo() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('IoClient', 'startIo() with token %s', this.options.token);
            if (this.state.off()) {
                const e = new Error('startIo() state.off() is true, skipped');
                config_1.log.warn('IoClient', e.message);
                throw e;
            }
            try {
                yield this.io.start();
            }
            catch (e) {
                config_1.log.verbose('IoClient', 'startIo() init fail: %s', e.message);
                throw e;
            }
        });
    }
    onMessage(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('IoClient', 'onMessage(%s)', msg);
            // const from = m.from()
            // const to = m.to()
            // const content = m.toString()
            // const room = m.room()
            // log.info('Bot', '%s<%s>:%s'
            //               , (room ? '['+room.topic()+']' : '')
            //               , from.name()
            //               , m.toStringDigest()
            //         )
            // if (/^wechaty|chatie|botie/i.test(m.text()) && !m.self()) {
            //   await m.say('https://www.chatie.io')
            //     .then(_ => log.info('Bot', 'REPLIED to magic word "chatie"'))
            // }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('IoClient', 'stop()');
            this.state.off('pending');
            // XXX
            if (!this.io) {
                config_1.log.warn('IoClient', 'stop() without this.io');
                this.state.off(true);
                return;
            }
            yield this.io.stop();
            this.state.off(true);
            // XXX 20161026
            // this.io = null
        });
    }
    restart() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('IoClient', 'restart()');
            try {
                yield this.stop();
                yield this.start();
            }
            catch (e) {
                config_1.log.error('IoClient', 'restart() exception %s', e.message);
                throw e;
            }
        });
    }
    quit() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('IoClient', 'quit()');
            if (this.state.off() === 'pending') {
                config_1.log.warn('IoClient', 'quit() with state.off() = `pending`, skipped');
                throw new Error('quit() with state.off() = `pending`');
            }
            this.state.off('pending');
            try {
                if (this.options.wechaty) {
                    yield this.options.wechaty.stop();
                    // this.wechaty = null
                }
                else {
                    config_1.log.warn('IoClient', 'quit() no this.wechaty');
                }
                if (this.io) {
                    yield this.io.stop();
                    // this.io = null
                }
                else {
                    config_1.log.warn('IoClient', 'quit() no this.io');
                }
            }
            catch (e) {
                config_1.log.error('IoClient', 'exception: %s', e.message);
                throw e;
            }
            finally {
                this.state.off(true);
            }
        });
    }
}
exports.IoClient = IoClient;
//# sourceMappingURL=io-client.js.map