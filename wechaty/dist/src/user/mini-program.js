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
const config_1 = require("../config");
class MiniProgram {
    constructor(payload) {
        this.payload = payload;
        config_1.log.verbose('MiniProgram', 'constructor()');
    }
    /**
     *
     * Create
     *
     */
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('MiniProgram', 'create()');
            // TODO: get appid and username from wechat
            const payload = {
                appid: 'todo',
                description: 'todo',
                pagepath: 'todo',
                thumbnailurl: 'todo',
                title: 'todo',
                username: 'todo',
            };
            return new MiniProgram(payload);
        });
    }
    appid() {
        return this.payload.appid;
    }
    title() {
        return this.payload.title;
    }
    pagepath() {
        return this.payload.pagepath;
    }
    username() {
        return this.payload.username;
    }
    description() {
        return this.payload.description;
    }
    thumbnailurl() {
        return this.payload.thumbnailurl;
    }
}
exports.MiniProgram = MiniProgram;
//# sourceMappingURL=mini-program.js.map