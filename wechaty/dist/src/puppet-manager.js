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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const read_pkg_up_1 = __importDefault(require("read-pkg-up"));
const npm_programmatic_1 = __importDefault(require("npm-programmatic"));
const pkg_dir_1 = __importDefault(require("pkg-dir"));
const semver_1 = __importDefault(require("semver"));
const in_gfw_1 = __importDefault(require("in-gfw"));
const wechaty_puppet_1 = require("wechaty-puppet");
const config_1 = require("./config");
const puppet_config_1 = require("./puppet-config");
class PuppetManager {
    static resolve(options) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('PuppetManager', 'resolve({puppet: %s, puppetOptions: %s})', options.puppet, JSON.stringify(options.puppetOptions));
            let puppetInstance;
            if (options.puppet instanceof wechaty_puppet_1.Puppet) {
                puppetInstance = yield this.resolveInstance(options.puppet);
            }
            else {
                const MyPuppet = yield this.resolveName(options.puppet);
                /**
                 * We will meet the following error:
                 *
                 *  [ts] Cannot use 'new' with an expression whose type lacks a call or construct signature.
                 *
                 * When we have different puppet with different `constructor()` args.
                 * For example: PuppetA allow `constructor()` but PuppetB requires `constructor(options)`
                 *
                 * SOLUTION: we enforce all the PuppetImplenmentation to have `options` and should not allow default parameter.
                 * Issue: https://github.com/Chatie/wechaty-puppet/issues/2
                 */
                puppetInstance = new MyPuppet(options.puppetOptions);
            }
            return puppetInstance;
        });
    }
    static resolveName(puppetName) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('PuppetManager', 'resolveName(%s)', puppetName);
            if (!puppetName) {
                throw new Error('must provide a puppet name');
            }
            puppetName = 'wechaty-puppet-padplus';
            // TODO(huan): remove the unnecessary switch
            switch (puppetName) {
                // case 'padchat':
                //   // issue #1496 https://github.com/Chatie/wechaty/issues/1496
                //   // compatible old settings for padchat
                //   puppetName = 'wechaty-puppet-padchat'
                //   break
                // case 'mock':
                //   puppetName = 'wechaty-puppet-mock'
                //   break
                // case 'PuppetPadplus':
                //   puppetName = PUPPET_NAME_DEFAULT
                //   break
                default:
                    if (!(puppetName in puppet_config_1.PUPPET_DEPENDENCIES)) {
                        throw new Error([
                            '',
                            'puppet npm module not supported: "' + puppetName + '"',
                            'learn more about supported Wechaty Puppet from our directory at',
                            '<https://github.com/Chatie/wechaty-puppet/wiki/Directory>',
                            '',
                        ].join('\n'));
                    }
                    // PuppetName is valid
                    break;
            }
            yield this.checkModule(puppetName);
            const puppetModule = yield Promise.resolve().then(() => __importStar(require(puppetName)));
            const MyPuppet = puppetModule.default;
            return MyPuppet;
        });
    }
    static checkModule(puppetName) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('PuppetManager', 'checkModule(%s)', puppetName);
            const versionRange = puppet_config_1.PUPPET_DEPENDENCIES[puppetName];
            /**
             * 1. Not Installed
             */
            if (!this.installed(puppetName)) {
                config_1.log.silly('PuppetManager', 'checkModule(%s) not installed.', puppetName);
                yield this.install(puppetName, versionRange);
                return;
            }
            const moduleVersion = this.getModuleVersion(puppetName);
            const satisfy = semver_1.default.satisfies(moduleVersion, versionRange);
            /**
             * 2. Installed But Version Not Satisfy
             */
            if (!satisfy) {
                config_1.log.silly('PuppetManager', 'checkModule() %s installed version %s NOT satisfied range %s', puppetName, moduleVersion, versionRange);
                yield this.install(puppetName, versionRange);
                return;
            }
            /**
             * 3. Installed and Version Satisfy
             */
            config_1.log.silly('PuppetManager', 'checkModule() %s installed version %s satisfied range %s', puppetName, moduleVersion, versionRange);
        });
    }
    static getModuleVersion(moduleName) {
        const modulePath = path_1.default.dirname(require.resolve(moduleName));
        const pkg = read_pkg_up_1.default.sync({ cwd: modulePath }).package;
        const version = pkg.version;
        return version;
    }
    static resolveInstance(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('PuppetManager', 'resolveInstance(%s)', instance);
            // const version = instance.version()
            // const name = instance.name()
            // const satisfy = semver.satisfies(
            //   version,
            //   puppetConfig.npm.version,
            // )
            // TODO: check the instance version to satisfy semver
            return instance;
        });
    }
    static installed(moduleName) {
        try {
            require.resolve(moduleName);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    static preInstallPuppeteer() {
        return __awaiter(this, void 0, void 0, function* () {
            let gfw = false;
            try {
                gfw = yield in_gfw_1.default();
                if (gfw) {
                    config_1.log.verbose('PuppetManager', 'preInstallPuppeteer() inGfw = true');
                }
            }
            catch (e) {
                config_1.log.verbose('PuppetManager', 'preInstallPuppeteer() exception: %s', e);
            }
            // https://github.com/GoogleChrome/puppeteer/issues/1597#issuecomment-351945645
            if (gfw && !process.env['PUPPETEER_DOWNLOAD_HOST']) {
                config_1.log.info('PuppetManager', 'preInstallPuppeteer() set PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors/');
                process.env['PUPPETEER_DOWNLOAD_HOST'] = 'https://npm.taobao.org/mirrors/';
            }
        });
    }
    static install(puppetModule, puppetVersion = 'latest') {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.info('PuppetManager', 'install(%s@%s) please wait ...', puppetModule, puppetVersion);
            if (puppetModule === 'wechaty-puppet-puppeteer') {
                yield this.preInstallPuppeteer();
            }
            yield npm_programmatic_1.default.install(`${puppetModule}@${puppetVersion}`, {
                cwd: yield pkg_dir_1.default(__dirname),
                output: true,
                save: false,
            });
            config_1.log.info('PuppetManager', 'install(%s@%s) done', puppetModule, puppetVersion);
        });
    }
    /**
     * Install all `wechaty-puppet-*` modules from `puppet-config.ts`
     */
    static installAll() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.info('PuppetManager', 'installAll() please wait ...');
            const moduleList = [];
            for (const puppetModuleName of Object.keys(puppet_config_1.PUPPET_DEPENDENCIES)) {
                const version = puppet_config_1.PUPPET_DEPENDENCIES[puppetModuleName];
                if (version !== '0.0.0') {
                    moduleList.push(`${puppetModuleName}@${version}`);
                }
            }
            yield npm_programmatic_1.default.install(moduleList, {
                cwd: yield pkg_dir_1.default(__dirname),
                output: true,
                save: false,
            });
        });
    }
}
exports.PuppetManager = PuppetManager;
//# sourceMappingURL=puppet-manager.js.map