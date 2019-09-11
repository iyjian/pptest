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
// tslint:disable:no-shadowed-variable
// tslint:disable:max-classes-per-file
const blue_tape_1 = __importDefault(require("blue-tape"));
const sinon_1 = __importDefault(require("sinon"));
const wechaty_puppet_1 = require("wechaty-puppet");
const wechaty_puppet_mock_1 = require("wechaty-puppet-mock");
const wechaty_1 = require("../wechaty");
blue_tape_1.default('recalled()', (t) => __awaiter(this, void 0, void 0, function* () {
    const EXPECTED_RECALL_MESSAGE_ID = '1';
    const EXPECTED_RECALLED_MESSAGE_ID = '2';
    const EXPECTED_MESSAGE_TIMESTAMP = new Date().getTime();
    const EXPECTED_ROOM_TOPIC = 'topic';
    const EXPECTED_ROOM_ID = 'room1';
    const EXPECTED_FROM_CONTACT_ID = 'contact1';
    const EXPECTED_TO_CONTACT_ID = 'contact1';
    const sandbox = sinon_1.default.createSandbox();
    const puppet = new wechaty_puppet_mock_1.PuppetMock();
    const wechaty = new wechaty_1.Wechaty({ puppet });
    yield wechaty.start();
    sandbox.stub(puppet, 'messagePayload').callsFake((id) => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setImmediate(resolve));
        if (id === EXPECTED_RECALL_MESSAGE_ID) {
            return {
                id: EXPECTED_RECALL_MESSAGE_ID,
                text: EXPECTED_RECALLED_MESSAGE_ID,
                timestamp: EXPECTED_MESSAGE_TIMESTAMP,
                type: wechaty_puppet_1.MessageType.Recalled,
            };
        }
        else {
            return {
                fromId: EXPECTED_FROM_CONTACT_ID,
                id: EXPECTED_RECALLED_MESSAGE_ID,
                roomId: EXPECTED_ROOM_ID,
                text: '',
                timestamp: EXPECTED_MESSAGE_TIMESTAMP,
                toId: EXPECTED_TO_CONTACT_ID,
                type: wechaty_puppet_1.MessageType.Text,
            };
        }
    }));
    sandbox.stub(puppet, 'roomPayload').callsFake(() => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setImmediate(resolve));
        return {
            topic: EXPECTED_ROOM_TOPIC,
        };
    }));
    sandbox.stub(puppet, 'roomMemberList').callsFake(() => __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => setImmediate(resolve));
        return [EXPECTED_FROM_CONTACT_ID, EXPECTED_TO_CONTACT_ID];
    }));
    sandbox.stub(puppet, 'contactPayload').callsFake((id) => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setImmediate(resolve));
        return {
            id,
            name: id,
        };
    }));
    const message = wechaty.Message.load(EXPECTED_RECALL_MESSAGE_ID);
    yield message.ready();
    const recalledMessage = yield message.toRecalled();
    t.assert(recalledMessage, 'recalled message should exist.');
    t.equal(recalledMessage.id, EXPECTED_RECALLED_MESSAGE_ID, 'Recalled message should have the right id.');
    t.equal(recalledMessage.from().id, EXPECTED_FROM_CONTACT_ID, 'Recalled message should have the right from contact id.');
    t.equal(recalledMessage.to().id, EXPECTED_TO_CONTACT_ID, 'Recalled message should have the right to contact id.');
    t.equal(recalledMessage.room().id, EXPECTED_ROOM_ID, 'Recalled message should have the right room id.');
    yield wechaty.stop();
}));
//# sourceMappingURL=message.spec.js.map