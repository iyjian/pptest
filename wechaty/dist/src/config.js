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
// tslint:disable-next-line:no-reference
/// <reference path="./typings.d.ts" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const qr_image_1 = __importDefault(require("qr-image"));
const raven_1 = __importDefault(require("raven"));
exports.Raven = raven_1.default;
const read_pkg_up_1 = __importDefault(require("read-pkg-up"));
const brolog_1 = require("brolog");
exports.log = brolog_1.log;
const file_box_1 = require("file-box");
const puppet_config_1 = require("./puppet-config");
const version_1 = require("./version");
exports.VERSION = version_1.VERSION;
const pkg = read_pkg_up_1.default.sync({ cwd: __dirname }).package;
/**
 * Raven.io
 */
raven_1.default.disableConsoleAlerts();
raven_1.default
    .config(isProduction()
    && 'https://f6770399ee65459a82af82650231b22c:d8d11b283deb441e807079b8bb2c45cd@sentry.io/179672', {
    release: version_1.VERSION,
    tags: {
        git_commit: '',
        platform: process.env.WECHATY_DOCKER
            ? 'docker'
            : os_1.default.platform(),
    },
})
    .install();
/*
try {
    doSomething(a[0])
} catch (e) {
    Raven.captureException(e)
}

Raven.context(function () {
  doSomething(a[0])
})
 */
const logLevel = process.env.WECHATY_LOG;
if (logLevel) {
    brolog_1.log.level(logLevel.toLowerCase());
    brolog_1.log.silly('Config', 'WECHATY_LOG set level to %s', logLevel);
}
/**
 * to handle unhandled exceptions
 */
if (brolog_1.log.level() === 'verbose' || brolog_1.log.level() === 'silly') {
    brolog_1.log.info('Config', 'registering process.on("unhandledRejection") for development/debug');
    process.on('unhandledRejection', (reason, promise) => {
        brolog_1.log.error('Config', '###########################');
        brolog_1.log.error('Config', 'unhandledRejection: %s %s', reason, promise);
        brolog_1.log.error('Config', '###########################');
        promise.catch(err => {
            brolog_1.log.error('Config', 'process.on(unhandledRejection) promise.catch(%s)', err.message);
            console.error('Config', err); // I don't know if log.error has similar full trace print support like console.error
        });
    });
}
const DEFAULT_SETTING = pkg.wechaty;
class Config {
    // private _puppetInstance: Puppet | null = null
    constructor() {
        this.default = DEFAULT_SETTING;
        this.apihost = process.env.WECHATY_APIHOST || DEFAULT_SETTING.DEFAULT_APIHOST;
        this.head = ('WECHATY_HEAD' in process.env) ? (!!process.env.WECHATY_HEAD) : (!!(DEFAULT_SETTING.DEFAULT_HEAD));
        // DEPRECATED: Use WECHATY_NAME instead
        this.profile = process.env.WECHATY_PROFILE;
        this.name = process.env.WECHATY_NAME || process.env.WECHATY_PROFILE; // replace WECHATY_PROFILE
        this.token = process.env.WECHATY_TOKEN; // DO NOT set DEFAULT, because sometimes user do not want to connect to io cloud service
        this.debug = !!(process.env.WECHATY_DEBUG);
        this.httpPort = process.env.PORT || process.env.WECHATY_PORT || DEFAULT_SETTING.DEFAULT_PORT;
        this.docker = !!(process.env.WECHATY_DOCKER);
        brolog_1.log.verbose('Config', 'constructor()');
        this.validApiHost(this.apihost);
        if (this.profile) {
            brolog_1.log.warn('Config', 'constructor() WECHATY_PROFILE is DEPRECATED, use WECHATY_NAME instead.');
        }
    }
    systemPuppetName() {
        return (process.env.WECHATY_PUPPET || puppet_config_1.PUPPET_NAME_DEFAULT).toLowerCase();
    }
    gitRevision() {
        const dotGitPath = path_1.default.join(__dirname, '..', '.git'); // only for ts-node, not for dist
        // const gitLogArgs  = ['log', '--oneline', '-1']
        // TODO: use git rev-parse HEAD ?
        const gitArgs = ['rev-parse', 'HEAD'];
        try {
            // Make sure this is a Wechaty repository
            fs_1.default.statSync(dotGitPath).isDirectory();
            const ss = require('child_process')
                .spawnSync('git', gitArgs, { cwd: __dirname });
            if (ss.status !== 0) {
                throw new Error(ss.error);
            }
            const revision = ss.stdout
                .toString()
                .trim()
                .slice(0, 7);
            return revision;
        }
        catch (e) { /* fall safe */
            /**
             *  1. .git not exist
             *  2. git log fail
             */
            brolog_1.log.silly('Wechaty', 'version() form development environment is not availble: %s', e.message);
            return null;
        }
    }
    validApiHost(apihost) {
        if (/^[a-zA-Z0-9.\-_]+:?[0-9]*$/.test(apihost)) {
            return true;
        }
        throw new Error('validApiHost() fail for ' + apihost);
    }
}
exports.Config = Config;
exports.CHATIE_OFFICIAL_ACCOUNT_ID = 'gh_051c89260e5d';
function qrCodeForChatie() {
    const CHATIE_OFFICIAL_ACCOUNT_QRCODE = 'http://weixin.qq.com/r/qymXj7DEO_1ErfTs93y5';
    const name = 'qrcode-for-chatie.png';
    const type = 'png';
    const qrStream = qr_image_1.default.image(CHATIE_OFFICIAL_ACCOUNT_QRCODE, { type });
    return file_box_1.FileBox.fromStream(qrStream, name);
}
exports.qrCodeForChatie = qrCodeForChatie;
// http://jkorpela.fi/chars/spaces.html
// String.fromCharCode(8197)
exports.FOUR_PER_EM_SPACE = String.fromCharCode(0x2005);
// mobile: \u2005, PC、mac: \u0020
exports.AT_SEPRATOR_REGEX = /[\u2005\u0020]/;
function qrcodeValueToImageUrl(qrcodeValue) {
    return [
        'https://api.qrserver.com/v1/create-qr-code/?data=',
        encodeURIComponent(qrcodeValue),
        '&size=220x220&margin=20',
    ].join('');
}
exports.qrcodeValueToImageUrl = qrcodeValueToImageUrl;
function isProduction() {
    return process.env.NODE_ENV === 'production'
        || process.env.NODE_ENV === 'prod';
}
exports.isProduction = isProduction;
exports.config = new Config();
//# sourceMappingURL=config.js.map