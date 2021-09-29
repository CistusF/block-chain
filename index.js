"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = __importStar(require("crypto-js"));
const users = [
    {
        "name": "홍둘리",
        "age": 19,
        "money": 7777,
        "createdAt": 1632898635377
    },
    {
        "name": "홍길동",
        "age": 596,
        "money": 4635092,
        "createdAt": 1632898738608
    }
];
class Block {
    constructor(index, hash, previous, data, timestamp) {
        this.index = index;
        this.hash = hash;
        this.previous = previous;
        this.data = data;
        this.timestamp = timestamp;
    }
}
Block.calculateBlockHash = (index, previousHash, timestamp, data) => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
Block.validateStructure = (aBlock) => typeof aBlock.index === "number" && typeof aBlock.hash === "string" && typeof aBlock.previous === "string" && typeof aBlock.timestamp === "number" && typeof aBlock.data === "object";
let blockchain = [];
const getLastestBlock = () => blockchain.length !== 0 ? blockchain[blockchain.length - 1] : null;
const getNewTimeStamp = () => new Date().getTime();
const createNewBlock = (data) => {
    const previousBlock = getLastestBlock();
    const newIndex = previousBlock ? previousBlock.index + 1 : 0;
    const newTimestamp = getNewTimeStamp();
    const newHash = Block.calculateBlockHash(newIndex, previousBlock ? previousBlock.hash : "", newTimestamp, data);
    const newBlock = new Block(newIndex, newHash, previousBlock ? previousBlock.hash : "", data, newTimestamp);
    addBlock(newBlock);
    return newBlock;
};
const getHashforBlock = (aBlock) => Block.calculateBlockHash(aBlock.index, aBlock.previous, aBlock.timestamp, aBlock.data);
const isValidUsers = (depositor, depositTarget) => {
    switch (undefined) {
        case users.find(u => u.name === (depositor === null || depositor === void 0 ? void 0 : depositor.name)):
        case users.find(u => u.name === (depositTarget === null || depositTarget === void 0 ? void 0 : depositTarget.name)):
            return false;
        default:
            return true;
    }
    ;
};
const isBlockValid = (candidateBlock, previousBlock) => {
    switch (true) {
        case !Block.validateStructure(candidateBlock):
        case previousBlock ? (previousBlock.index + 1) : 0 !== candidateBlock.index:
        case previousBlock ? previousBlock.hash : "" !== candidateBlock.previous:
        case getHashforBlock(candidateBlock) !== candidateBlock.hash:
            return false;
        default:
            return true;
    }
    ;
};
const addBlock = (candidateBlock) => {
    if (!isBlockValid(candidateBlock, getLastestBlock()))
        return;
    blockchain.push(candidateBlock);
};
const trade = (price, depositor, depositTarget) => {
    if (!isValidUsers(depositor, depositTarget))
        return;
    depositor.money -= price;
    depositTarget.money += price;
    createNewBlock({ price: price, depositor: depositor, depositTarget: depositTarget });
    return;
};
trade(1000, users[0], users[1]);
trade(4000, users[1], users[0]);
console.log(blockchain);
console.log(users);
;
;
//# sourceMappingURL=index.js.map