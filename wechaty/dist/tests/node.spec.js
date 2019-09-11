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
// import { log }  from '../src/config'
const sinon_1 = require("sinon");
blue_tape_1.default('Node.js function params destructuring behaviour test', (t) => __awaiter(this, void 0, void 0, function* () {
    const DEFAULT_N = 1;
    const DEFAULT_S = 't';
    const paramSpy = sinon_1.spy();
    function paramTest({ n = DEFAULT_N, s = DEFAULT_S, } = {}) {
        paramSpy(n, s);
    }
    paramSpy.resetHistory();
    paramTest();
    t.deepEqual(paramSpy.args[0], [DEFAULT_N, DEFAULT_S], 'should be equal to default args');
    paramSpy.resetHistory();
    paramTest({ n: 42 });
    t.deepEqual(paramSpy.args[0], [42, DEFAULT_S], 'should be equal to default s args');
    paramSpy.resetHistory();
    paramTest({ s: 'life' });
    t.deepEqual(paramSpy.args[0], [DEFAULT_N, 'life'], 'should be equal to default n args');
}));
//# sourceMappingURL=node.spec.js.map