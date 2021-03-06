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
// tslint:disable:no-shadowed-variable
const blue_tape_1 = __importDefault(require("blue-tape"));
const io_1 = require("./io");
const wechaty_1 = require("./wechaty");
blue_tape_1.default('Io restart without problem', (t) => __awaiter(this, void 0, void 0, function* () {
    const io = new io_1.Io({
        token: 'mock_token',
        wechaty: new wechaty_1.Wechaty(),
    });
    try {
        for (let i = 0; i < 2; i++) {
            yield io.start();
            yield io.stop();
            t.pass('start/stop-ed at #' + i);
        }
        t.pass('start/restart successed.');
    }
    catch (e) {
        t.fail(e);
    }
}));
//# sourceMappingURL=io.spec.js.map