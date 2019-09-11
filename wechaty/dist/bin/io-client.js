#!/usr/bin/env node
"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../src/config");
const io_client_1 = require("../src/io-client");
const wechaty_1 = require("../src/wechaty");
const welcome = `
| __        __        _           _
| \\ \\      / /__  ___| |__   __ _| |_ _   _
|  \\ \\ /\\ / / _ \\/ __| '_ \\ / _\` | __| | | |
|   \\ V  V /  __/ (__| | | | (_| | |_| |_| |
|    \\_/\\_/ \\___|\\___|_| |_|\\__,_|\\__|\\__, |
|                                     |___/

=============== Powered by Wechaty ===============
       -------- https://www.chatie.io --------

My super power: download cloud bot from www.chatie.io

__________________________________________________

`;
let token = config_1.config.token;
if (!token) {
    config_1.log.error('Client', 'token not found: please set WECHATY_TOKEN in environment before run io-client');
    // process.exit(-1)
    token = config_1.config.default.DEFAULT_TOKEN;
    config_1.log.warn('Client', `set token to "${token}" for demo purpose`);
}
console.info(welcome);
config_1.log.info('Client', 'Starting for WECHATY_TOKEN: %s', token);
const client = new io_client_1.IoClient({
    token,
    wechaty: new wechaty_1.Wechaty({ name: token }),
});
client.start()
    .catch(onError.bind(client));
// client.initWeb()
//     .catch(onError.bind(client))
function onError(e) {
    return __awaiter(this, void 0, void 0, function* () {
        config_1.log.error('Client', 'initWeb() fail: %s', e);
        yield this.quit();
        process.exit(-1);
    });
}
//# sourceMappingURL=io-client.js.map