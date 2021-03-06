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
const sinon_1 = __importDefault(require("sinon"));
const wechaty_puppet_mock_1 = require("wechaty-puppet-mock");
const wechaty_1 = require("./wechaty");
const _1 = require("./");
const wechaty_puppet_1 = require("wechaty-puppet");
class WechatyTest extends wechaty_1.Wechaty {
    initPuppetAccessoryTest(puppet) {
        return this.initPuppetAccessory(puppet);
    }
}
blue_tape_1.default('Export of the Framework', (t) => __awaiter(this, void 0, void 0, function* () {
    t.ok(_1.Contact, 'should export Contact');
    t.ok(_1.Friendship, 'should export Friendship');
    t.ok(_1.IoClient, 'should export IoClient');
    t.ok(_1.Message, 'should export Message');
    t.ok(wechaty_puppet_1.Puppet, 'should export Puppet');
    t.ok(_1.Room, 'should export Room');
    t.ok(wechaty_1.Wechaty, 'should export Wechaty');
    t.ok(_1.log, 'should export log');
}));
blue_tape_1.default('static VERSION', (t) => __awaiter(this, void 0, void 0, function* () {
    t.true('VERSION' in wechaty_1.Wechaty, 'Wechaty should has a static VERSION property');
}));
blue_tape_1.default('Config setting', (t) => __awaiter(this, void 0, void 0, function* () {
    t.ok(_1.config, 'should export Config');
    // t.ok(config.default.DEFAULT_PUPPET  , 'should has DEFAULT_PUPPET')
}));
blue_tape_1.default('event:start/stop', (t) => __awaiter(this, void 0, void 0, function* () {
    const wechaty = new wechaty_1.Wechaty({ puppet: 'wechaty-puppet-mock' });
    const startSpy = sinon_1.default.spy();
    const stopSpy = sinon_1.default.spy();
    wechaty.on('start', startSpy);
    wechaty.on('stop', stopSpy);
    yield wechaty.start();
    yield wechaty.stop();
    // console.log(startSpy.callCount)
    t.ok(startSpy.calledOnce, 'should get event:start once');
    t.ok(stopSpy.calledOnce, 'should get event:stop once');
}));
//
// FIXME: restore this unit test !!!
//
// test.only('event:scan', async t => {
//   const m = {} as any
//   const asyncHook = asyncHooks.createHook({
//     init(asyncId: number, type: string, triggerAsyncId: number, resource: Object) {
//       m[asyncId] = type
//     },
//     before(asyncId) {
//       // delete m[asyncId]
//     },
//     after(asyncId) {
//       // delete m[asyncId]
//     },
//     destroy(asyncId) {
//       delete m[asyncId]
//     },
//   })
//   asyncHook.enable()
//   const wechaty = Wechaty.instance()
//   const spy = sinon.spy()
//   wechaty.on('scan', spy)
//   const scanFuture  = new Promise(resolve => wechaty.once('scan', resolve))
//   // wechaty.once('scan', () => console.log('FAINT'))
//   await wechaty.start()
//   await scanFuture
//   // await new Promise(r => setTimeout(r, 1000))
//   await wechaty.stop()
//   t.ok(spy.calledOnce, 'should get event:scan')
//   asyncHook.disable()
//   console.log(m)
// })
blue_tape_1.default('on(event, Function)', (t) => __awaiter(this, void 0, void 0, function* () {
    const spy = sinon_1.default.spy();
    const wechaty = wechaty_1.Wechaty.instance();
    const EXPECTED_ERROR = new Error('testing123');
    wechaty.on('message', () => { throw EXPECTED_ERROR; });
    wechaty.on('scan', () => 42);
    wechaty.on('error', spy);
    const messageFuture = new Promise(resolve => wechaty.once('message', resolve));
    wechaty.emit('message', {});
    yield messageFuture;
    yield wechaty.stop();
    t.ok(spy.calledOnce, 'should get event:error once');
    t.equal(spy.firstCall.args[0], EXPECTED_ERROR, 'should get error from message listener');
}));
blue_tape_1.default('initPuppetAccessory()', (t) => __awaiter(this, void 0, void 0, function* () {
    const wechatyTest = new WechatyTest();
    const puppet = new wechaty_puppet_mock_1.PuppetMock();
    t.doesNotThrow(() => wechatyTest.initPuppetAccessoryTest(puppet), 'should not throw for the 1st time init');
    t.throws(() => wechatyTest.initPuppetAccessoryTest(puppet), 'should throw for the 2nd time init');
}));
// TODO: add test for event args
blue_tape_1.default('Wechaty restart for many times', (t) => __awaiter(this, void 0, void 0, function* () {
    const wechaty = new wechaty_1.Wechaty({
        puppet: new wechaty_puppet_mock_1.PuppetMock(),
    });
    try {
        for (let i = 0; i < 3; i++) {
            yield wechaty.start();
            yield wechaty.stop();
            t.pass('start/stop-ed at #' + i);
        }
        t.pass('Wechaty start/restart successed.');
    }
    catch (e) {
        t.fail(e);
    }
}));
blue_tape_1.default('@event ready', (t) => __awaiter(this, void 0, void 0, function* () {
    const puppet = new wechaty_puppet_mock_1.PuppetMock();
    const wechaty = new wechaty_1.Wechaty({ puppet });
    const sandbox = sinon_1.default.createSandbox();
    const spy = sandbox.spy();
    wechaty.on('ready', spy);
    t.true(spy.notCalled, 'should no ready event with new wechaty instance');
    yield wechaty.start();
    t.true(spy.notCalled, 'should no ready event right start wechaty started');
    puppet.emit('ready');
    t.true(spy.calledOnce, 'should fire ready event after puppet ready');
    yield wechaty.stop();
    yield wechaty.start();
    puppet.emit('ready');
    t.true(spy.calledTwice, 'should fire ready event second time after stop/start wechaty');
    yield wechaty.stop();
}));
blue_tape_1.default('ready()', (t) => __awaiter(this, void 0, void 0, function* () {
    const puppet = new wechaty_puppet_mock_1.PuppetMock();
    const wechaty = new wechaty_1.Wechaty({ puppet });
    const sandbox = sinon_1.default.createSandbox();
    const spy = sandbox.spy();
    wechaty.ready()
        .then(spy)
        .catch(e => t.fail('rejection: ' + e));
    t.true(spy.notCalled, 'should not ready with new wechaty instance');
    yield wechaty.start();
    t.true(spy.notCalled, 'should not ready after right start wechaty');
    puppet.emit('ready');
    yield new Promise(resolve => setImmediate(resolve));
    t.true(spy.calledOnce, 'should ready after puppet ready');
    yield wechaty.stop();
    yield wechaty.start();
    wechaty.ready()
        .then(spy)
        .catch(e => t.fail('rejection: ' + e));
    puppet.emit('ready');
    yield new Promise(resolve => setImmediate(resolve));
    t.true(spy.calledTwice, 'should ready again after stop/start wechaty');
    yield wechaty.stop();
}));
//# sourceMappingURL=wechaty.spec.js.map