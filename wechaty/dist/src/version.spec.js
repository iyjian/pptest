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
const version_1 = require("./version");
blue_tape_1.default('Make sure the VERSION is fresh in source code', (t) => __awaiter(this, void 0, void 0, function* () {
    t.equal(version_1.VERSION, '0.0.0', 'version should be 0.0.0 in source code, only updated before publish to NPM');
}));
//# sourceMappingURL=version.spec.js.map