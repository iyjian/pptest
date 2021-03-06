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
const xml_1 = require("./xml");
blue_tape_1.default('stripHtml()', (t) => __awaiter(this, void 0, void 0, function* () {
    const HTML_BEFORE_STRIP = 'Outer<html>Inner</html>';
    const HTML_AFTER_STRIP = 'OuterInner';
    const strippedHtml = xml_1.stripHtml(HTML_BEFORE_STRIP);
    t.is(strippedHtml, HTML_AFTER_STRIP, 'should strip html as expected');
}));
blue_tape_1.default('unescapeHtml()', (t) => __awaiter(this, void 0, void 0, function* () {
    const HTML_BEFORE_UNESCAPE = '&apos;|&quot;|&gt;|&lt;|&amp;';
    const HTML_AFTER_UNESCAPE = `'|"|>|<|&`;
    const unescapedHtml = xml_1.unescapeHtml(HTML_BEFORE_UNESCAPE);
    t.is(unescapedHtml, HTML_AFTER_UNESCAPE, 'should unescape html as expected');
}));
blue_tape_1.default('plainText()', (t) => __awaiter(this, void 0, void 0, function* () {
    const PLAIN_BEFORE = '&amp;<html>&amp;</html>&amp;<img class="emoji emoji1f4a4" text="[流汗]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />';
    const PLAIN_AFTER = '&&&[流汗]';
    const text = xml_1.plainText(PLAIN_BEFORE);
    t.is(text, PLAIN_AFTER, 'should convert plain text as expected');
}));
blue_tape_1.default('digestEmoji()', (t) => __awaiter(this, void 0, void 0, function* () {
    const EMOJI_XML = [
        '<img class="emoji emoji1f4a4" text="[流汗]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />',
        '<img class="qqemoji qqemoji13" text="[呲牙]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />',
        '<img class="emoji emoji1f44d" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />',
        '<span class="emoji emoji1f334"></span>',
    ];
    const EMOJI_AFTER_DIGEST = [
        '[流汗]',
        '[呲牙]',
        '',
        '[emoji1f334]',
    ];
    for (let i = 0; i < EMOJI_XML.length; i++) {
        const emojiDigest = xml_1.digestEmoji(EMOJI_XML[i]);
        t.is(emojiDigest, EMOJI_AFTER_DIGEST[i], 'should digest emoji string ' + i + ' as expected');
    }
}));
blue_tape_1.default('unifyEmoji()', (t) => __awaiter(this, void 0, void 0, function* () {
    const ORIGNAL_XML_LIST = [
        [
            [
                '<img class="emoji emoji1f602" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />',
                '<span class="emoji emoji1f602"></span>',
            ],
            '<emoji code="emoji1f602"/>',
        ],
    ];
    ORIGNAL_XML_LIST.forEach(([xmlList, expectedEmojiXml]) => {
        xmlList.forEach(xml => {
            const unifiedXml = xml_1.unifyEmoji(xml);
            t.is(unifiedXml, expectedEmojiXml, 'should convert the emoji xml to the expected unified xml');
        });
    });
}));
blue_tape_1.default('stripEmoji()', (t) => __awaiter(this, void 0, void 0, function* () {
    const EMOJI_STR = [
        [
            'ABC<img class="emoji emoji1f4a4" text="[流汗]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />DEF',
            'ABCDEF',
        ],
        [
            'UVW<span class="emoji emoji1f334"></span>XYZ',
            'UVWXYZ',
        ],
    ];
    EMOJI_STR.forEach(([emojiStr, expectResult]) => {
        const result = xml_1.stripEmoji(emojiStr);
        t.is(result, expectResult, 'should strip to the expected str');
    });
    const empty = xml_1.stripEmoji(undefined);
    t.is(empty, '', 'should return empty string for `undefined`');
}));
//# sourceMappingURL=xml.spec.js.map