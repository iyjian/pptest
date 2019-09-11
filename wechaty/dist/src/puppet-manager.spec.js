#!/usr/bin/env ts-node
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
// tslint:disable:no-shadowed-variable
const blue_tape_1 = __importDefault(require("blue-tape"));
const puppet_manager_1 = require("./puppet-manager");
blue_tape_1.default('resolve an unsupported puppet name', (t) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield puppet_manager_1.PuppetManager.resolve('fasdfsfasfsfdfs');
        t.fail('should reject');
    }
    catch (e) {
        t.pass('reject when options is a string: ' + e);
    }
    try {
        yield puppet_manager_1.PuppetManager.resolve({ puppet: 'fadfdsafa' });
        t.fail('should reject');
    }
    catch (e) {
        t.pass('reject when options.puppet is unknown: ' + e);
    }
    try {
        yield puppet_manager_1.PuppetManager.resolve({ puppet: 'wechaty-puppet-mock' });
        t.pass('should allow "wechaty-puppet-mock" as puppet name');
    }
    catch (e) {
        t.fail('should pass "mock" as puppet name');
    }
}));
//# sourceMappingURL=puppet-manager.spec.js.map