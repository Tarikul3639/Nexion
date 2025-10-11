"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageHandler = void 0;
const getMessagesHandler_1 = require("./getMessagesHandler");
const sendMessageHandler_1 = require("./sendMessageHandler");
const deleteMessageHandler_1 = require("./deleteMessageHandler");
const messageReadHandler_1 = require("./messageReadHandler");
const messageHandler = (io, socket, userSockets) => {
    (0, getMessagesHandler_1.getMessagesHandler)(socket);
    (0, sendMessageHandler_1.sendMessageHandler)(io, socket, userSockets);
    (0, deleteMessageHandler_1.deleteMessageHandler)(socket);
    (0, messageReadHandler_1.messageReadHandler)(io, socket, userSockets);
};
exports.messageHandler = messageHandler;
