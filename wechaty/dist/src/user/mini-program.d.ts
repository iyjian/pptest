import { MiniProgramPayload } from 'wechaty-puppet';
export declare class MiniProgram {
    readonly payload: MiniProgramPayload;
    /**
     *
     * Create
     *
     */
    static create(): Promise<MiniProgram>;
    constructor(payload: MiniProgramPayload);
    appid(): undefined | string;
    title(): undefined | string;
    pagepath(): undefined | string;
    username(): undefined | string;
    description(): undefined | string;
    thumbnailurl(): undefined | string;
}
//# sourceMappingURL=mini-program.d.ts.map