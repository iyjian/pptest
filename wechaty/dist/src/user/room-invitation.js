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
 *   @ignore
 *
 */
const clone_class_1 = require("clone-class");
const accessory_1 = require("../accessory");
const config_1 = require("../config");
/**
 *
 * accept room invitation
 */
class RoomInvitation extends accessory_1.Accessory {
    /**
     * @ignore
     * Instance Properties
     *
     */
    constructor(id) {
        super();
        this.id = id;
        config_1.log.verbose('RoomInvitation', 'constructor(id=%s)', id);
        // tslint:disable-next-line:variable-name
        const MyClass = clone_class_1.instanceToClass(this, RoomInvitation);
        if (MyClass === RoomInvitation) {
            throw new Error('RoomInvitation class can not be instanciated directly! See: https://github.com/Chatie/wechaty/issues/1217');
        }
        if (!this.puppet) {
            throw new Error('RoomInvitation class can not be instanciated without a puppet!');
        }
    }
    static load(id) {
        const newRoomInvitation = new this(id);
        return newRoomInvitation;
    }
    toString() {
        return [
            'RoomInvitation#',
            this.id || 'loading',
        ].join('');
    }
    /**
     * @ignore
     */
    toStringAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield this.puppet.roomInvitationPayload(this.id);
            return [
                'RoomInvitation#',
                this.id,
                '<',
                payload.roomTopic,
                ',',
                payload.inviterId,
                '>',
            ].join('');
        });
    }
    /**
     * Accept Room Invitation
     *
     * @returns {Promise<void>}
     *
     * @example
     * const bot = new Wechaty()
     * bot.on('room-invite', async roomInvitation => {
     *   try {
     *     console.log(`received room-invite event.`)
     *     await roomInvitation.accept()
     *   } catch (e) {
     *     console.error(e)
     *   }
     * }
     * .start()
     */
    accept() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('RoomInvitation', 'accept()');
            yield this.puppet.roomInvitationAccept(this.id);
            const inviter = yield this.inviter();
            const topic = yield this.topic();
            try {
                yield inviter.ready();
                config_1.log.verbose('RoomInvitation', 'accept() with room(%s) & inviter(%s) ready()', topic, inviter);
                return;
            }
            catch (e) {
                config_1.log.warn('RoomInvitation', 'accept() inviter(%s) is not ready because of %s', inviter, (e && e.message) || e);
            }
        });
    }
    /**
     * Get the inviter from room invitation
     *
     * @returns {Contact}
     * @example
     * const bot = new Wechaty()
     * bot.on('room-invite', async roomInvitation => {
     *   const inviter = await roomInvitation.inviter()
     *   const name = inviter.name()
     *   console.log(`received room invitation event from ${name}`)
     * }
     * .start()
     */
    inviter() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('RoomInvitation', 'inviter()');
            const payload = yield this.puppet.roomInvitationPayload(this.id);
            const inviter = this.wechaty.Contact.load(payload.inviterId);
            return inviter;
        });
    }
    /**
     * Get the room topic from room invitation
     *
     * @returns {Contact}
     * @example
     * const bot = new Wechaty()
     * bot.on('room-invite', async roomInvitation => {
     *   const topic = await roomInvitation.topic()
     *   console.log(`received room invitation event from room ${topic}`)
     * }
     * .start()
     */
    topic() {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield this.puppet.roomInvitationPayload(this.id);
            return payload.roomTopic;
        });
    }
    /**
     * @deprecated: use topic() instead
     */
    roomTopic() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.topic();
        });
    }
    roomMemberCount() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('RoomInvitation', 'roomMemberCount()');
            const payload = yield this.puppet.roomInvitationPayload(this.id);
            return payload.roomMemberCount;
        });
    }
    /**
     * List of Room Members that you known(is friend)
     * @ignore
     */
    roomMemberList() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('RoomInvitation', 'roomMemberList()');
            const payload = yield this.puppet.roomInvitationPayload(this.id);
            const contactIdList = payload.roomMemberIdList;
            const contactList = contactIdList.map(id => this.wechaty.Contact.load(id));
            yield Promise.all(contactList.map(c => c.ready()));
            return contactList;
        });
    }
    /**
     * Get the invitation time
     *
     * @returns {Promise<Date>}
     */
    date() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('RoomInvitation', 'date()');
            const payload = yield this.puppet.roomInvitationPayload(this.id);
            // convert the unit timestamp to milliseconds
            // (from seconds to milliseconds)
            return new Date(1000 * payload.timestamp);
        });
    }
    /**
     * Returns the roopm invitation age in seconds. <br>
     *
     * For example, the invitation is sent at time `8:43:01`,
     * and when we received it in Wechaty, the time is `8:43:15`,
     * then the age() will return `8:43:15 - 8:43:01 = 14 (seconds)`
     * @returns {number}
     */
    age() {
        return __awaiter(this, void 0, void 0, function* () {
            const recvDate = yield this.date();
            const ageMilliseconds = Date.now() - recvDate.getTime();
            const ageSeconds = Math.floor(ageMilliseconds / 1000);
            return ageSeconds;
        });
    }
}
exports.RoomInvitation = RoomInvitation;
//# sourceMappingURL=room-invitation.js.map