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
    const EXPECTED_ROOM_ID = 'test-id';
    const EXPECTED_ROOM_TOPIC = 'test-topic';
    const EXPECTED_ROOM_ID_LIST = [EXPECTED_ROOM_ID];
    const sandbox = sinon_1.default.createSandbox();
    const puppet = new wechaty_puppet_mock_1.PuppetMock();
    const wechaty = new wechaty_1.Wechaty({ puppet });
    yield wechaty.start();
    sandbox.stub(puppet, 'roomSearch').resolves(EXPECTED_ROOM_ID_LIST);
    sandbox.stub(puppet, 'roomPayload').callsFake(() => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setImmediate(resolve));
        return {
            topic: EXPECTED_ROOM_TOPIC,
        };
    }));
    const roomList = yield wechaty.Room.findAll();
    t.equal(roomList.length, 1, 'should find 1 room');
    t.equal(yield roomList[0].topic(), EXPECTED_ROOM_TOPIC, 'should get topic from payload');
    yield wechaty.stop();
}));
blue_tape_1.default('say()', () => __awaiter(this, void 0, void 0, function* () {
    const sandbox = sinon_1.default.createSandbox();
    const callback = sinon_1.default.spy();
    const puppet = new wechaty_puppet_mock_1.PuppetMock();
    const wechaty = new wechaty_1.Wechaty({ puppet });
    yield wechaty.start();
    const EXPECTED_ROOM_ID = 'roomId';
    const EXPECTED_ROOM_TOPIC = 'test-topic';
    const EXPECTED_CONTACT_1_ID = 'contact1';
    const EXPECTED_CONTACT_1_ALIAS = 'little1';
    const EXPECTED_CONTACT_2_ID = 'contact2';
    const EXPECTED_CONTACT_2_ALIAS = 'big2';
    const CONTACT_MAP = {};
    CONTACT_MAP[EXPECTED_CONTACT_1_ID] = EXPECTED_CONTACT_1_ALIAS;
    CONTACT_MAP[EXPECTED_CONTACT_2_ID] = EXPECTED_CONTACT_2_ALIAS;
    sandbox.stub(puppet, 'roomMemberPayload').callsFake((_, contactId) => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setImmediate(resolve));
        return {
            id: contactId,
            roomAlias: CONTACT_MAP[contactId],
        };
    }));
    sandbox.stub(puppet, 'roomPayload').callsFake(() => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setImmediate(resolve));
        return {
            topic: EXPECTED_ROOM_TOPIC,
        };
    }));
    sandbox.stub(puppet, 'contactPayload').callsFake((contactId) => __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setImmediate(resolve));
        return {
            id: contactId,
        };
    }));
    // sandbox.spy(puppet, 'messageSendText')
    sandbox.stub(puppet, 'messageSendText').callsFake(callback);
    const room = wechaty.Room.load(EXPECTED_ROOM_ID);
    const contact1 = wechaty.Contact.load(EXPECTED_CONTACT_1_ID);
    const contact2 = wechaty.Contact.load(EXPECTED_CONTACT_2_ID);
    yield contact1.sync();
    yield contact2.sync();
    yield room.sync();
    blue_tape_1.default('say with Tagged Template', (t) => __awaiter(this, void 0, void 0, function* () {
        callback.resetHistory();
        yield room.say `To be ${contact1} or not to be ${contact2}`;
        t.deepEqual(callback.getCall(0).args, [
            { contactId: EXPECTED_CONTACT_1_ID, roomId: EXPECTED_ROOM_ID },
            'To be @little1 or not to be @big2',
            [EXPECTED_CONTACT_1_ID, EXPECTED_CONTACT_2_ID],
        ], 'Tagged Template say should be matched');
    }));
    blue_tape_1.default('say with regular mention contact', (t) => __awaiter(this, void 0, void 0, function* () {
        callback.resetHistory();
        yield room.say('Yo', contact1);
        t.deepEqual(callback.getCall(0).args, [
            { contactId: EXPECTED_CONTACT_1_ID, roomId: EXPECTED_ROOM_ID },
            '@little1 Yo',
            [EXPECTED_CONTACT_1_ID],
        ], 'Single mention should work with old ways');
    }));
    blue_tape_1.default('say with multiple mention contact', (t) => __awaiter(this, void 0, void 0, function* () {
        callback.resetHistory();
        yield room.say('hey buddies, let\'s party', contact1, contact2);
        t.deepEqual(callback.getCall(0).args, [
            { contactId: EXPECTED_CONTACT_1_ID, roomId: EXPECTED_ROOM_ID },
            '@little1 @big2 hey buddies, let\'s party',
            [EXPECTED_CONTACT_1_ID, EXPECTED_CONTACT_2_ID],
        ], 'Multiple mention should work with new way');
    }));
    yield wechaty.stop();
}));
//# sourceMappingURL=room.spec.js.map