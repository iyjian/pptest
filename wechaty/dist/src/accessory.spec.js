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
// import sinon from 'sinon'
const clone_class_1 = require("clone-class");
const accessory_1 = require("./accessory");
const EXPECTED_PUPPET1 = { p: 1 };
const EXPECTED_PUPPET2 = { p: 2 };
blue_tape_1.default('Accessory smoke testing', (t) => __awaiter(this, void 0, void 0, function* () {
    class FixtureClass extends accessory_1.Accessory {
    }
    t.throws(() => FixtureClass.puppet, 'should throw if read static puppet before initialize');
    const c = new FixtureClass();
    t.throws(() => c.puppet, 'should throw if read instance puppet before initialization');
    FixtureClass.puppet = EXPECTED_PUPPET1;
    t.equal(FixtureClass.puppet, EXPECTED_PUPPET1, 'should get EXPECTED_PUPPET1 from static puppet after set static puppet');
    t.equal(c.puppet, EXPECTED_PUPPET1, 'should get EXPECTED_PUPPET1 from instance puppet after set static puppet');
    // c.puppet = EXPECTED_PUPPET2
    // t.equal(FixtureClass.puppet,  EXPECTED_PUPPET1, 'should get EXPECTED_PUPPET1 from static puppet after set instance puppet to EXPECTED_PUPPET2')
    // t.equal(c.puppet,             EXPECTED_PUPPET2, 'should get EXPECTED_PUPPET2 from instance puppet after set instance puppet to EXPECTED_PUPPET2')
}));
blue_tape_1.default('Two clone-ed classes have different static puppet value', (t) => __awaiter(this, void 0, void 0, function* () {
    class FixtureClass extends accessory_1.Accessory {
    }
    // tslint:disable-next-line:variable-name
    const ClonedClass1 = clone_class_1.cloneClass(FixtureClass);
    // tslint:disable-next-line:variable-name
    const ClonedClass2 = clone_class_1.cloneClass(FixtureClass);
    ClonedClass1.puppet = EXPECTED_PUPPET1;
    ClonedClass2.puppet = EXPECTED_PUPPET2;
    const c1 = new ClonedClass1();
    const c2 = new ClonedClass2();
    t.equal(c1.puppet, EXPECTED_PUPPET1, 'should get the puppet as 1 from 1st cloned class');
    t.equal(c2.puppet, EXPECTED_PUPPET2, 'should get the puppet as 2 from 2nd cloned class');
}));
blue_tape_1.default('Throw error when set the value again', (t) => __awaiter(this, void 0, void 0, function* () {
    class FixtureClass extends accessory_1.Accessory {
    }
    const fixture = new FixtureClass();
    t.doesNotThrow(() => { fixture.puppet = {}; }, 'instance: should not throw when set at 1st time');
    t.throws(() => { fixture.puppet = {}; }, 'instance: should throw when set at 2nd time');
    t.doesNotThrow(() => { FixtureClass.puppet = {}; }, 'static: should not throw when set at 1st time');
    t.throws(() => { FixtureClass.puppet = {}; }, 'static: should throw when set at 2nd time');
}));
//# sourceMappingURL=accessory.spec.js.map