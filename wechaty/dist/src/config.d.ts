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
/// <reference path="../../src/typings.d.ts" />
import Raven from 'raven';
import { log } from 'brolog';
import { FileBox } from 'file-box';
import { PuppetModuleName } from './puppet-config';
import { VERSION } from './version';
export interface DefaultSetting {
    DEFAULT_HEAD: number;
    DEFAULT_PORT: number;
    DEFAULT_APIHOST: string;
    DEFAULT_TOKEN: string;
    DEFAULT_PROTOCOL: string;
}
export declare class Config {
    default: DefaultSetting;
    apihost: string;
    head: boolean;
    systemPuppetName(): PuppetModuleName;
    profile: string | undefined;
    name: string | undefined;
    token: string | undefined;
    debug: boolean;
    httpPort: string | number;
    docker: boolean;
    constructor();
    gitRevision(): string | null;
    validApiHost(apihost: string): boolean;
}
export declare const CHATIE_OFFICIAL_ACCOUNT_ID = "gh_051c89260e5d";
export declare function qrCodeForChatie(): FileBox;
export declare const FOUR_PER_EM_SPACE: string;
export declare const AT_SEPRATOR_REGEX: RegExp;
export declare function qrcodeValueToImageUrl(qrcodeValue: string): string;
export declare function isProduction(): boolean;
export { log, Raven, VERSION, };
export declare const config: Config;
//# sourceMappingURL=config.d.ts.map