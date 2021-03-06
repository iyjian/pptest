const messages = require('../proto/chatbothub/chatbothub_pb')
const services = require('../proto/chatbothub/chatbothub_grpc_pb')
const grpc = require('grpc')
const config = require('./../../config')
const log = require('../log')
const _ = require('lodash')
const BotAdapter = require('./BotAdapter')
const EventEmitter = require('events')

const mutePingPongLog = true;

/**
 * BotClient is the middle proxy between hub and client.
 * - communicate with hub with grpc long connection
 * - communicate with client with client's sdk
 * @type {module.BotClient}
 */
class BotClient extends EventEmitter {
    constructor(botAdapter) {
        super();

        this.botAdapter = botAdapter;
        this._setupBotAdapter();

        this.running = false;

        /**
         * loginInfo:
         * {
         *     userId: '',
         *     token: '',
         *     wxData: ''
         * }
         * @type {null}
         */
        this.loginInfo = null;
        this.botId = null;
        this.tunnel = null;

        this.heartBeatTimer = null;
        this.heartBeatInterval = 10 * 1000;
    }

    _setupBotAdapter() {
        const adapter = this.botAdapter;

        adapter.registerBotCallback(BotAdapter.Callback.SEND_HUB_EVENT, async ({eventType, eventBody }) => {
            if (eventType === 'LOGINDONE') {
                eventBody['botId'] = this.botId;
            }

            return this._sendEventToHub(eventType, eventBody);
        });
    }

    _stop(notify = false) {
        if (!this.running) {
            return;
        }

        this._stopHubHeartBeat();

        this.tunnel.end();
        this.tunnel = null;
        this.running = false;

        if (notify) {
            this.emit('stop')
        }

        // stop client will not logout client botAdapter
    }

    // 允许重复登录，重复登录直接返回 login done
    async _handleLoginRequest(body) {
        log.info('begin login');

        const loginBody = JSON.parse(body);

        this.botId = loginBody.botId;

        if (loginBody.loginInfo.length > 0) {
            try {
                const loginInfo = JSON.parse(loginBody.loginInfo);
                if (Object.keys(loginInfo).length > 0) {
                    loginInfo.userId = loginBody.login;

                    this.loginInfo = loginInfo;
                }

            }
            catch (e) {
                console.error('login info is not json format: ');
                console.error(e);
            }
        }

        await this.botAdapter.login(this.loginInfo);
    }

    async _handleEventFromHub(event) {
        const eventType = event.getEventtype();
        const body = event.getBody();
        const clientId = event.getClientid();
        const clientType = event.getClienttype();

        const startTime = new Date();

        if (eventType === 'PONG') {
            !mutePingPongLog && log.debug("PONG " + clientType + " " + clientId);
            return;
        }

        if (eventType === 'PING') {
          log.trace(`received tunnel event: ${eventType}`)
        } else {
          log.info(`received tunnel event: ${eventType} ${body}`)
        }

        if (eventType === 'LOGIN') {
            await this._handleLoginRequest(body);
        }
        else if (eventType === 'LOGOUT') {
            if (!this.botAdapter.isSignedIn()) {
                await this._replyActionToHub(eventType, body, null, 'Can not logout, because the bot is not signed on');
                log.error(`Can not logout, because the bot is not signed on`);
                return;
            }

            await this.botAdapter.logout();
        } else if (eventType === 'PING') {
          log.trace(`recieved ping from chathub`);
        } else {
            if (!this.botAdapter.isSignedIn()) {
                await this._replyActionToHub(eventType, body, null, 'Bot is not signed on, can not execute any action.');
                log.error(`[${eventType}] Bot is not signed on, can not execute any action: ${body}`);
                return;
            }


            let actionType
            let parsedBody

            try {
                let response = null;
                let handled = false;


                if (eventType === 'BOTACTION') {
                    handled = true;

                    parsedBody = JSON.parse(body);
                    actionType = parsedBody.actionType;
                    const actionBody = parsedBody.body;

                    if (actionType === undefined || actionBody === undefined) {
                        log.error("actionBody empty", body);
                        return
                    }

                    response = await this.botAdapter.handleHubAction(actionType, actionBody);
                }

                const cost = (new Date()) - startTime;

                if (handled) {
                    log.debug(`> handel event from hub: ${actionType} ${body } [${cost}ms], success: ${JSON.stringify(response)}`);

                    await this._replyActionToHub(actionType, parsedBody, response);
                }
                else {
                    log.error(`> handel event from hub: ${actionType} ${body} [${cost}ms], fail: unhandled message`);

                    await this._replyActionToHub(actionType, parsedBody, 'unhandled message');
                }
            }
            catch (e) {
                const cost = (new Date()) - startTime;
                log.error(`> handel event from hub: ${actionType} ${body} [${cost}ms], fail: ${e.toString()}`);
                await this._replyActionToHub(actionType, parsedBody, null, e.toString());
            }
        }
    }

    _sendEventToHub(eventType, eventBody) {
        if (this.tunnel === undefined) {
            log.error('grpc connection not established while receiving wxlogin callback, exit.')
            return
        }

        if (_.isEmpty(eventType)) {
            log.error('wxcallback data.eventType undefined');
            return
        }

        let bodyStr = '';
        if (eventBody) {
            bodyStr = eventBody;
            if (typeof eventBody !== 'string') {
                bodyStr = JSON.stringify(eventBody);
            }

            if (bodyStr.length > 1200) {
                bodyStr = bodyStr.substr(0, 1200);
            }
        }

        if (eventType === 'PING') {
            !mutePingPongLog && log.trace(`tunnel send: [${eventType}] ${bodyStr}`);
        }
        else {
            log.debug(`tunnel send: [${eventType}] ${bodyStr}`);
        }

        const newEventRequest = (eventType, body) => {
            const req = new messages.EventRequest();
            req.setEventtype(eventType);

            if (body) {
                if (typeof body === 'string') {
                    req.setBody(body);
                }
                else {
                    req.setBody(JSON.stringify(body));
                }
            }

            req.setClientid(this.botAdapter.clientId);
            req.setClienttype(this.botAdapter.clientType);

            return req;
        };

        this.tunnel.write(newEventRequest(eventType, eventBody))
    }

    _replyActionToHub(eventType, originalEventBody, data, error) {
        const result = {};
        if (error) {
            result.success = false;
            result.error = error;
        }
        else {
            result.success = true;
            result.data = Object.assign({status: 0}, data);
        }

        return this._sendEventToHub(
            'ACTIONREPLY',
            {
                eventType: eventType,
                body: originalEventBody,
                result
            });
    }

    _startHubHeartBeat() {
        if (this.heartBeatTimer) {
            return;
        }

        this.heartBeatTimer = setInterval(async () => {
            this._sendEventToHub("PING", "");
        }, this.heartBeatInterval);
    }

    _stopHubHeartBeat() {
        if (!this.heartBeatTimer) {
            return;
        }

        clearInterval(this.heartBeatTimer);
        this.heartBeatTimer = null;
    }

    async start() {
        if (this.running) {
            return;
        }
        this.running = true;

        log.info("begin grpc connection");

        // init new grpc connection
        log.debug('GRPC Connect', `${config.hubhost}:${config.hubport}`)
        const client = new services.ChatBotHubClient(`${config.hubhost}:${config.hubport}`, grpc.credentials.createInsecure());
        this.tunnel = client.eventTunnel();

        this.tunnel.on('data', async (eventReply) => {
            return this._handleEventFromHub(eventReply);
        });

        this.tunnel.on('error', async (e) => {
            log.error("grpc connection error", "code", e.code, e.details);
            await this._stop(true);
        });

        this.tunnel.on('end', async () => {
            log.info("grpc connection closed");
            await this._stop(true);
        });

        // Register client with hub instantly.
        await this._sendEventToHub("REGISTER", "HELLO");

        await this.botAdapter.tryToSendLoginInfoToHub();

        this._startHubHeartBeat();
    }

    async stop() {
        this._stop();
    }
}

module.exports = BotClient;
