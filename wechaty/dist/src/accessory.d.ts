/// <reference types="node" />
import { EventEmitter } from 'events';
import { Puppet } from 'wechaty-puppet';
import { Wechaty } from './wechaty';
export declare const SYMBOL_NAME: unique symbol;
export declare const SYMBOL_COUNTER: unique symbol;
export declare abstract class Accessory extends EventEmitter {
    private [SYMBOL_NAME];
    private [SYMBOL_COUNTER];
    /**
     *
     * 1. Static Properties & Methods
     *
     */
    private static _puppet?;
    private static _wechaty?;
    /**
     * @private
     */
    /**
    * @private
    */
    static puppet: Puppet;
    /**
     * @private
     */
    /**
    * @private
    */
    static wechaty: Wechaty;
    /**
     *
     * 2. Instance Properties & Methods
     *
     * The ability of set different `puppet` to the instance is required.
     * For example: the Wechaty instances have to have different `puppet`.
     */
    private _puppet?;
    /**
     * @private
     */
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
    puppet: Puppet;
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
    readonly wechaty: Wechaty;
    constructor(name?: string);
}
//# sourceMappingURL=accessory.d.ts.map