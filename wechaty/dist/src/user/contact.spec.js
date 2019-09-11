#!/usr/bin/env ts-node
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
// tslint:disable:no-shadowed-variable
// tslint:disable:max-classes-per-file
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
const blue_tape_1 = __importDefault(require("blue-tape"));
const sinon_1 = __importDefault(require("sinon"));
const wechaty_puppet_mock_1 = require("wechaty-puppet-mock");
const wechaty_1 = require("../wechaty");
blue_tape_1.default('findAll()', (t) => __awaiter(this, void 0, void 0, function* () {
    const EXPECTED_CONTACT_ID = 'test-id';
    const EXPECTED_CONTACT_NAME = 'test-name';
    const EXPECTED_CONTACT_ID_LIST = [EXPECTED_CONTACT_ID];
    const sandbox = sinon_1.default.createSandbox();
    const puppet = new wechaty_puppet_mock_1.PuppetMock();
    const wechaty = new wechaty_1.Wechaty({ puppet });
    yield wechaty.start();
    sandbox.stub(puppet, 'contactSearch').resolves(EXPECTED_CONTACT_ID_LIST);
    sandbox.stub(puppet, 'contactPayload').callsFake(() => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setImmediate(resolve));
        return {
            name: EXPECTED_CONTACT_NAME,
        };
    }));
    const contactList = yield wechaty.Contact.findAll();
    t.equal(contactList.length, 1, 'should find 1 contact');
    t.equal(contactList[0].name(), EXPECTED_CONTACT_NAME, 'should get name from payload');
    yield wechaty.stop();
}));
//# sourceMappingURL=contact.spec.js.map