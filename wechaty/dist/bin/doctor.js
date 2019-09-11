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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const config_1 = require("../src/config");
const doctor_1 = require("../src/doctor");
const wechaty_1 = require("../src/wechaty");
const wechaty = wechaty_1.Wechaty.instance();
const doctor = new doctor_1.Doctor();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let ipcTestResult;
        try {
            yield doctor.testTcp();
            ipcTestResult = 'PASS';
        }
        catch (err) {
            console.info(err);
            ipcTestResult = 'FAIL. Please check your tcp network, Wechaty need to listen on localhost and connect to it.';
        }
        console.info(`
  #### Wechaty Doctor

  1. Wechaty version: ${wechaty.version()}
  2. ${os_1.default.type()} ${os_1.default.arch()} version ${os_1.default.release()} memory ${Math.floor(os_1.default.freemem() / 1024 / 1024)}/${Math.floor(os_1.default.totalmem() / 1024 / 1024)} MB
  3. Docker: ${config_1.config.docker}
  4. Node version: ${process.version}
  5. Tcp IPC TEST: ${ipcTestResult}

  `);
    });
}
main()
    .catch(err => console.error('main() exception: %s', err));
//# sourceMappingURL=doctor.js.map