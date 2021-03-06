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
 *   @ignore
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
const clone_class_1 = require("clone-class");
const accessory_1 = require("../accessory");
const config_1 = require("../config");
const helper_functions_1 = require("../helper-functions");
const wechaty_puppet_1 = require("wechaty-puppet");
/**
 * Send, receive friend request, and friend confirmation events.
 *
 * 1. send request
 * 2. receive request(in friend event)
 * 3. confirmation friendship(friend event)
 *
 * [Examples/Friend-Bot]{@link https://github.com/Chatie/wechaty/blob/1523c5e02be46ebe2cc172a744b2fbe53351540e/examples/friend-bot.ts}
 */
class Friendship extends accessory_1.Accessory {
    constructor(id) {
        super();
        this.id = id;
        config_1.log.verbose('Friendship', 'constructor(id=%s)', id);
        // tslint:disable-next-line:variable-name
        const MyClass = clone_class_1.instanceToClass(this, Friendship);
        if (MyClass === Friendship) {
            throw new Error('Friendship class can not be instanciated directly! See: https://github.com/Chatie/wechaty/issues/1217');
        }
        if (!this.puppet) {
            throw new Error('Friendship class can not be instanciated without a puppet!');
        }
    }
    /**
     * @private
     */
    static load(id) {
        const newFriendship = new this(id);
        return newFriendship;
    }
    /**
     * @description
     * use {@link Friendship#add} instead
     * @deprecated
     */
    static send(contact, hello) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.warn('Friendship', 'static send() DEPRECATED， use add() instead.');
            return this.add(contact, hello);
        });
    }
    /**
     * Send a Friend Request to a `contact` with message `hello`.
     *
     * The best practice is to send friend request once per minute.
     * Remeber not to do this too frequently, or your account may be blocked.
     *
     * @param {Contact} contact - Send friend request to contact
     * @param {string} hello    - The friend request content
     * @returns {Promise<void>}
     *
     * @example
     * const memberList = await room.memberList()
     * for (let i = 0; i < memberList.length; i++) {
     *   await bot.Friendship.add(member, 'Nice to meet you! I am wechaty bot!')
     * }
     */
    static add(contact, hello) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Friendship', 'static add(%s, %s)', contact.id, hello);
            yield this.puppet.friendshipAdd(contact.id, hello);
        });
    }
    static del(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Friendship', 'static del(%s)', contact.id);
            throw new Error('to be implemented');
        });
    }
    toString() {
        if (!this.payload) {
            return this.constructor.name;
        }
        return [
            'Friendship#',
            wechaty_puppet_1.FriendshipType[this.payload.type],
            '<',
            this.payload.contactId,
            '>',
        ].join('');
    }
    isReady() {
        return !!this.payload && (Object.keys(this.payload).length > 0);
    }
    /**
     * no `dirty` support because Friendship has no rawPayload(yet)
     * @ignore
     */
    ready() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isReady()) {
                return;
            }
            this.payload = yield this.puppet.friendshipPayload(this.id);
            if (!this.payload) {
                throw new Error('no payload');
            }
        });
    }
    /**
     * Accept Friend Request
     *
     * @returns {Promise<void>}
     *
     * @example
     * const bot = new Wechaty()
     * bot.on('friendship', async friendship => {
     *   try {
     *     console.log(`received friend event.`)
     *     switch (friendship.type()) {
     *
     *     // 1. New Friend Request
     *
     *     case Friendship.Type.Receive:
     *       await friendship.accept()
     *       break
     *
     *     // 2. Friend Ship Confirmed
     *
     *     case Friendship.Type.Confirm:
     *       console.log(`friend ship confirmed`)
     *       break
     *     }
     *   } catch (e) {
     *     console.error(e)
     *   }
     * }
     * .start()
     */
    accept() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Friendship', 'accept()');
            if (!this.payload) {
                throw new Error('no payload');
            }
            if (this.payload.type !== Friendship.Type.Receive) {
                throw new Error('accept() need type to be FriendshipType.Receive, but it got a ' + Friendship.Type[this.payload.type]);
            }
            config_1.log.silly('Friendship', 'accept() to %s', this.payload.contactId);
            yield this.puppet.friendshipAccept(this.id);
            const contact = this.contact();
            yield helper_functions_1.tryWait((retry, attempt) => __awaiter(this, void 0, void 0, function* () {
                config_1.log.silly('Friendship', 'accept() retry() ready() attempt %d', attempt);
                yield contact.ready();
                if (contact.isReady()) {
                    config_1.log.verbose('Friendship', 'accept() with contact %s ready()', contact.name());
                    return;
                }
                retry(new Error('Friendship.accept() contact.ready() not ready'));
            })).catch((e) => {
                config_1.log.warn('Friendship', 'accept() contact %s not ready because of %s', contact, (e && e.message) || e);
            });
            // try to fix issue #293
            yield contact.sync();
        });
    }
    /**
     * Get verify message from
     *
     * @returns {string}
     * @example <caption>If request content is `ding`, then accept the friendship</caption>
     * const bot = new Wechaty()
     * bot.on('friendship', async friendship => {
     *   try {
     *     console.log(`received friend event from ${friendship.contact().name()}`)
     *     if (friendship.type() === Friendship.Type.Receive && friendship.hello() === 'ding') {
     *       await friendship.accept()
     *     }
     *   } catch (e) {
     *     console.error(e)
     *   }
     * }
     * .start()
     */
    hello() {
        if (!this.payload) {
            throw new Error('no payload');
        }
        return this.payload.hello || '';
    }
    /**
     * Get the contact from friendship
     *
     * @returns {Contact}
     * @example
     * const bot = new Wechaty()
     * bot.on('friendship', async friendship => {
     *   const contact = friendship.contact()
     *   const name = contact.name()
     *   console.log(`received friend event from ${name}`)
     * }
     * .start()
     */
    contact() {
        if (!this.payload) {
            throw new Error('no payload');
        }
        const contact = this.wechaty.Contact.load(this.payload.contactId);
        return contact;
    }
    /**
     * Return the Friendship Type
     * > Tips: FriendshipType is enum here. </br>
     * - FriendshipType.Unknown  </br>
     * - FriendshipType.Confirm  </br>
     * - FriendshipType.Receive  </br>
     * - FriendshipType.Verify   </br>
     *
     * @returns {FriendshipType}
     *
     * @example <caption>If request content is `ding`, then accept the friendship</caption>
     * const bot = new Wechaty()
     * bot.on('friendship', async friendship => {
     *   try {
     *     if (friendship.type() === Friendship.Type.Receive && friendship.hello() === 'ding') {
     *       await friendship.accept()
     *     }
     *   } catch (e) {
     *     console.error(e)
     *   }
     * }
     * .start()
     */
    type() {
        return this.payload
            ? this.payload.type
            : wechaty_puppet_1.FriendshipType.Unknown;
    }
}
// tslint:disable-next-line:variable-name
Friendship.Type = wechaty_puppet_1.FriendshipType;
exports.Friendship = Friendship;
//# sourceMappingURL=friendship.js.map