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
 */
const state_switch_1 = require("state-switch");
const ws_1 = __importDefault(require("ws"));
const config_1 = require("./config");
exports.IO_EVENT_DICT = {
    botie: 'tbw',
    error: 'tbw',
    heartbeat: 'tbw',
    login: 'tbw',
    logout: 'tbw',
    message: 'tbw',
    raw: 'tbw',
    reset: 'tbw',
    scan: 'tbw',
    shutdown: 'tbw',
    sys: 'tbw',
    update: 'tbw',
};
class Io {
    constructor(options) {
        this.options = options;
        this.eventBuffer = [];
        this.state = new state_switch_1.StateSwitch('Io', config_1.log);
        options.apihost = options.apihost || config_1.config.apihost;
        options.protocol = options.protocol || config_1.config.default.DEFAULT_PROTOCOL;
        this.id = options.wechaty.id;
        this.protocol = options.protocol + '|' + options.wechaty.id;
        config_1.log.verbose('Io', 'instantiated with apihost[%s], token[%s], protocol[%s], cuid[%s]', options.apihost, options.token, options.protocol, this.id);
    }
    toString() {
        return `Io<${this.options.token}>`;
    }
    connected() {
        return this.ws && this.ws.readyState === ws_1.default.OPEN;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Io', 'start()');
            if (this.lifeTimer) {
                throw new Error('lifeTimer exist');
            }
            this.state.on('pending');
            try {
                this.initEventHook();
                this.ws = yield this.initWebSocket();
                this.options.wechaty.on('scan', (qrcode, status) => {
                    this.scanPayload = Object.assign({}, this.scanPayload, { qrcode,
                        status });
                });
                this.lifeTimer = setInterval(() => {
                    if (this.ws && this.connected()) {
                        config_1.log.silly('Io', 'start() setInterval() ws.ping()');
                        // TODO: check 'pong' event on ws
                        this.ws.ping();
                    }
                }, 1000 * 10);
                this.state.on(true);
                return;
            }
            catch (e) {
                config_1.log.warn('Io', 'start() exception: %s', e.message);
                this.state.off(true);
                throw e;
            }
        });
    }
    initEventHook() {
        config_1.log.verbose('Io', 'initEventHook()');
        const wechaty = this.options.wechaty;
        wechaty.on('error', error => this.send({ name: 'error', payload: error }));
        wechaty.on('heartbeat', data => this.send({ name: 'heartbeat', payload: { cuid: this.id, data } }));
        wechaty.on('login', user => this.send({ name: 'login', payload: user }));
        wechaty.on('logout', user => this.send({ name: 'logout', payload: user }));
        wechaty.on('message', message => this.ioMessage(message));
        // FIXME: payload schema need to be defined universal
        // wechaty.on('scan',      (url, code) =>  this.send({ name: 'scan',       payload: { url, code } }))
        wechaty.on('scan', (qrcode, status) => this.send({ name: 'scan', payload: { qrcode, status } }));
    }
    initWebSocket() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Io', 'initWebSocket()');
            // this.state.current('on', false)
            // const auth = 'Basic ' + new Buffer(this.setting.token + ':X').toString('base64')
            const auth = 'Token ' + this.options.token;
            const headers = { Authorization: auth };
            if (!this.options.apihost) {
                throw new Error('no apihost');
            }
            let endpoint = 'wss://' + this.options.apihost + '/v0/websocket';
            // XXX quick and dirty: use no ssl for APIHOST other than official
            // FIXME: use a configuarable VARIABLE for the domain name at here:
            if (!/api\.chatie\.io/.test(this.options.apihost)) {
                endpoint = 'ws://' + this.options.apihost + '/v0/websocket';
            }
            const ws = this.ws = new ws_1.default(endpoint, this.protocol, { headers });
            ws.on('open', () => this.wsOnOpen(ws));
            ws.on('message', data => this.wsOnMessage(data));
            ws.on('error', e => this.wsOnError(e));
            ws.on('close', (code, reason) => this.wsOnClose(ws, code, reason));
            yield new Promise((resolve, reject) => {
                ws.once('open', resolve);
                ws.once('error', reject);
                ws.once('close', reject);
            });
            return ws;
        });
    }
    wsOnOpen(ws) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.protocol !== ws.protocol) {
                config_1.log.error('Io', 'initWebSocket() require protocol[%s] failed', this.protocol);
                // XXX deal with error?
            }
            config_1.log.verbose('Io', 'initWebSocket() connected with protocol [%s]', ws.protocol);
            // this.currentState('connected')
            // this.state.current('on')
            // FIXME: how to keep alive???
            // ws._socket.setKeepAlive(true, 100)
            this.reconnectTimeout = undefined;
            const name = 'sys';
            const payload = 'Wechaty version ' + this.options.wechaty.version() + ` with CUID: ${this.id}`;
            const initEvent = {
                name,
                payload,
            };
            yield this.send(initEvent);
        });
    }
    wsOnMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.silly('Io', 'initWebSocket() ws.on(message): %s', data);
            // flags.binary will be set if a binary data is received.
            // flags.masked will be set if the data was masked.
            if (typeof data !== 'string') {
                throw new Error('data should be string...');
            }
            const ioEvent = {
                name: 'raw',
                payload: data,
            };
            try {
                const obj = JSON.parse(data);
                ioEvent.name = obj.name;
                ioEvent.payload = obj.payload;
            }
            catch (e) {
                config_1.log.verbose('Io', 'on(message) recv a non IoEvent data[%s]', data);
            }
            switch (ioEvent.name) {
                case 'botie':
                    const payload = ioEvent.payload;
                    if (payload.onMessage) {
                        const script = payload.script;
                        try {
                            /* eslint-disable-next-line */
                            const fn = eval(script);
                            if (typeof fn === 'function') {
                                this.onMessage = fn;
                            }
                            else {
                                config_1.log.warn('Io', 'server pushed function is invalid');
                            }
                        }
                        catch (e) {
                            config_1.log.warn('Io', 'server pushed function exception: %s', e);
                            this.options.wechaty.emit('error', e);
                        }
                    }
                    break;
                case 'reset':
                    config_1.log.verbose('Io', 'on(reset): %s', ioEvent.payload);
                    yield this.options.wechaty.reset(ioEvent.payload);
                    break;
                case 'shutdown':
                    config_1.log.info('Io', 'on(shutdown): %s', ioEvent.payload);
                    process.exit(0);
                    // eslint-disable-next-line
                    break;
                case 'update':
                    config_1.log.verbose('Io', 'on(update): %s', ioEvent.payload);
                    const wechaty = this.options.wechaty;
                    if (wechaty.logonoff()) {
                        const loginEvent = {
                            name: 'login',
                            payload: {
                                id: wechaty.userSelf().id,
                                name: wechaty.userSelf().name(),
                            },
                        };
                        yield this.send(loginEvent);
                    }
                    if (this.scanPayload) {
                        const scanEvent = {
                            name: 'scan',
                            payload: this.scanPayload,
                        };
                        yield this.send(scanEvent);
                    }
                    break;
                case 'sys':
                    // do nothing
                    break;
                case 'logout':
                    config_1.log.info('Io', 'on(logout): %s', ioEvent.payload);
                    yield this.options.wechaty.logout();
                    break;
                default:
                    config_1.log.warn('Io', 'UNKNOWN on(%s): %s', ioEvent.name, ioEvent.payload);
                    break;
            }
        });
    }
    // FIXME: it seems the parameter `e` might be `undefined`.
    // @types/ws might has bug for `ws.on('error',    e => this.wsOnError(e))`
    wsOnError(e) {
        config_1.log.warn('Io', 'initWebSocket() error event[%s]', e && e.message);
        if (!e) {
            return;
        }
        this.options.wechaty.emit('error', e);
        // when `error`, there must have already a `close` event
        // we should not call this.reconnect() again
        //
        // this.close()
        // this.reconnect()
    }
    wsOnClose(ws, code, message) {
        if (this.state.on()) {
            config_1.log.warn('Io', 'initWebSocket() close event[%d: %s]', code, message);
            ws.close();
            this.reconnect();
        }
    }
    reconnect() {
        config_1.log.verbose('Io', 'reconnect()');
        if (this.state.off()) {
            config_1.log.warn('Io', 'reconnect() canceled because state.target() === offline');
            return;
        }
        if (this.connected()) {
            config_1.log.warn('Io', 'reconnect() on a already connected io');
            return;
        }
        if (this.reconnectTimer) {
            config_1.log.warn('Io', 'reconnect() on a already re-connecting io');
            return;
        }
        if (!this.reconnectTimeout) {
            this.reconnectTimeout = 1;
        }
        else if (this.reconnectTimeout < 10 * 1000) {
            this.reconnectTimeout *= 3;
        }
        config_1.log.warn('Io', 'reconnect() will reconnect after %d s', Math.floor(this.reconnectTimeout / 1000));
        this.reconnectTimer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            this.reconnectTimer = undefined;
            yield this.initWebSocket();
        }), this.reconnectTimeout); // as any as NodeJS.Timer
    }
    send(ioEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ws) {
                throw new Error('no ws');
            }
            const ws = this.ws;
            if (ioEvent) {
                config_1.log.silly('Io', 'send(%s)', JSON.stringify(ioEvent));
                this.eventBuffer.push(ioEvent);
            }
            else {
                config_1.log.silly('Io', 'send()');
            }
            if (!this.connected()) {
                config_1.log.verbose('Io', 'send() without a connected websocket, eventBuffer.length = %d', this.eventBuffer.length);
                return;
            }
            const list = [];
            while (this.eventBuffer.length) {
                const data = JSON.stringify(this.eventBuffer.shift());
                const p = new Promise((resolve, reject) => ws.send(data, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                }));
                list.push(p);
            }
            try {
                yield Promise.all(list);
            }
            catch (e) {
                config_1.log.error('Io', 'send() exceptio: %s', e.stack);
                throw e;
            }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Io', 'stop()');
            if (!this.ws) {
                throw new Error('no ws');
            }
            this.state.off('pending');
            // try to send IoEvents in buffer
            yield this.send();
            this.eventBuffer = [];
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = undefined;
            }
            if (this.lifeTimer) {
                clearInterval(this.lifeTimer);
                this.lifeTimer = undefined;
            }
            this.ws.close();
            yield new Promise(resolve => {
                if (this.ws) {
                    this.ws.once('close', resolve);
                }
                else {
                    resolve();
                }
            });
            this.ws = undefined;
            this.state.off(true);
        });
    }
    /**
     *
     * Prepare to be overwriten by server setting
     *
     */
    ioMessage(m) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.silly('Io', 'ioMessage() is a nop function before be overwriten from cloud');
            if (typeof this.onMessage === 'function') {
                yield this.onMessage(m);
            }
        });
    }
}
exports.Io = Io;
//# sourceMappingURL=io.js.map