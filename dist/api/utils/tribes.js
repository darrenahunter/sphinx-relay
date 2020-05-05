"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const zbase32 = require("./zbase32");
const lightning_1 = require("./lightning");
const path = require("path");
const mqtt = require("mqtt");
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../../config/app.json'))[env];
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        const pwd = yield genSignedTimestamp();
        const info = yield lightning_1.getInfo();
        const client = mqtt.connect(`tcp://${config.tribes_host}`, {
            username: info.identity_pubkey,
            password: pwd,
        });
        client.on('connect', function () {
            console.log("MQTT CLIENT CONNECTED!");
            // subscribe to all public groups here
            // that you are NOT admin of (dont sub to your own!)
        });
        client.on('close', function () {
            console.log("MQTT CLOSED");
        });
    });
}
exports.connect = connect;
function genSignedTimestamp() {
    return __awaiter(this, void 0, void 0, function* () {
        const now = moment().unix();
        const tsBytes = Buffer.from(now.toString(16), 'hex');
        const sig = yield lightning_1.signBuffer(tsBytes);
        const sigBytes = zbase32.decode(sig);
        const totalLength = tsBytes.length + sigBytes.length;
        const buf = Buffer.concat([tsBytes, sigBytes], totalLength);
        return urlBase64(buf);
    });
}
exports.genSignedTimestamp = genSignedTimestamp;
function getHost() {
    return config.tribes_host || '';
}
exports.getHost = getHost;
function urlBase64(buf) {
    return buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
}
//# sourceMappingURL=tribes.js.map