"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const clone_class_1 = require("clone-class");
const config_1 = require("./config");
// use Symbol to prevent conflicting with the child class properties
// This symbol must be exported (for now).
// See: https://github.com/Microsoft/TypeScript/issues/20080
exports.SYMBOL_NAME = Symbol('name');
exports.SYMBOL_COUNTER = Symbol('counter');
let COUNTER = 0;
class Accessory extends events_1.EventEmitter {
    constructor(name) {
        super();
        this[exports.SYMBOL_NAME] = name || this.toString();
        this[exports.SYMBOL_COUNTER] = COUNTER++;
        config_1.log.silly('Accessory', '#%d<%s> constructor(%s)', this[exports.SYMBOL_COUNTER], this[exports.SYMBOL_NAME], name || '');
    }
    /**
     * @private
     */
    static set puppet(puppet) {
        config_1.log.silly('Accessory', '<%s> static set puppet = "%s"', this.name, puppet);
        if (this._puppet) {
            throw new Error('puppet can not be set twice');
        }
        this._puppet = puppet;
    }
    /**
     * @private
     */
    static get puppet() {
        // log.silly('Accessory', '<%s> static get puppet()',
        //                               this.name,
        //           )
        if (this._puppet) {
            return this._puppet;
        }
        throw new Error([
            'static puppet not found for ',
            this.name,
            ', ',
            'please see issue #1217: https://github.com/Chatie/wechaty/issues/1217',
        ].join(''));
    }
    /**
     * @private
     */
    static set wechaty(wechaty) {
        config_1.log.silly('Accessory', '<%s> static set wechaty = "%s"', this.name, wechaty);
        if (this._wechaty) {
            throw new Error('wechaty can not be set twice');
        }
        this._wechaty = wechaty;
    }
    /**
     * @private
     */
    static get wechaty() {
        // log.silly('Accessory', '<%s> static get wechaty()',
        //                               this.name,
        //           )
        if (this._wechaty) {
            return this._wechaty;
        }
        throw new Error('static wechaty not found for ' + this.name);
    }
    /**
     * @private
     */
    set puppet(puppet) {
        config_1.log.silly('Accessory', '<%s> set puppet = "%s"', this[exports.SYMBOL_NAME] || this, puppet);
        if (this._puppet) {
            throw new Error('puppet can not be set twice');
        }
        this._puppet = puppet;
    }
    /**
     * @private
     *
     * instance.puppet
     *
     * Needs to support different `puppet` between instances.
     *
     * For example: every Wechaty instance needs its own `puppet`
     *
     * So: that's the reason that there's no `private _wechaty: Wechaty` for the instance.
     *
     */
    get puppet() {
        // log.silly('Accessory', '#%d<%s> get puppet()',
        //                               this[SYMBOL_COUNTER],
        //                               this[SYMBOL_NAME] || this,
        //           )
        if (this._puppet) {
            return this._puppet;
        }
        /**
         * Get `puppet` from Class Static puppet property
         * note: use `instanceToClass` at here is because
         *    we might have many copy/child of `Accessory` Classes
         */
        return clone_class_1.instanceToClass(this, Accessory).puppet;
    }
    /**
     * @private
     *
     * instance.wechaty is for:
     *  Contact.wechaty
     *  FriendRequest.wechaty
     *  Message.wechaty
     *  Room.wechaty
     *
     * So it only need one `wechaty` for all the instances
     */
    get wechaty() {
        // log.silly('Accessory', '#%d<%s> get wechaty()',
        //                               this[SYMBOL_COUNTER],
        //                               this[SYMBOL_NAME] || this,
        //           )
        /**
         * Get `wechaty` from Class Static puppet property
         * note: use `instanceToClass` at here is because
         *    we might have many copy/child of `Accessory` Classes
         */
        return clone_class_1.instanceToClass(this, Accessory).wechaty;
    }
}
exports.Accessory = Accessory;
//# sourceMappingURL=accessory.js.map