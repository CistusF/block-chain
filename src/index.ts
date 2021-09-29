import * as CryptoJS from 'crypto-js';

const users: traderInfo[] = [
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
    public index: number;
    public hash: string;
    public previous: string;
    public data: tradeInfo;
    public timestamp: number;

    static calculateBlockHash = (index: number, previousHash: string, timestamp: number, data: tradeInfo) => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
    static validateStructure = (aBlock: Block): boolean => typeof aBlock.index === "number" && typeof aBlock.hash === "string" && typeof aBlock.previous === "string" && typeof aBlock.timestamp === "number" && typeof aBlock.data === "object"

    constructor(index: number, hash: string, previous: string, data: tradeInfo, timestamp: number) {
        this.index = index;
        this.hash = hash;
        this.previous = previous;
        this.data = data;
        this.timestamp = timestamp;
    }
}

let blockchain: Block[] = [];

const getLastestBlock = (): Block | null => blockchain.length !== 0 ? blockchain[blockchain.length - 1] : null;

const getNewTimeStamp = (): number => new Date().getTime();

const createNewBlock = (data: tradeInfo): Block | void => {
    const previousBlock: Block = getLastestBlock()!;
    const newIndex: number = previousBlock ? previousBlock.index + 1 : 0;
    const newTimestamp: number = getNewTimeStamp();
    const newHash: string = Block.calculateBlockHash(newIndex, previousBlock ? previousBlock.hash : "", newTimestamp, data);
    const newBlock: Block = new Block(newIndex, newHash, previousBlock ? previousBlock.hash : "", data, newTimestamp);
    addBlock(newBlock);
    return newBlock;
};

const getHashforBlock = (aBlock: Block): string => Block.calculateBlockHash(aBlock.index, aBlock.previous, aBlock.timestamp, aBlock.data);

const isValidUsers = (depositor: traderInfo, depositTarget: traderInfo): boolean => {
    switch (undefined) {
        case users.find(u => u.name === depositor?.name):
        case users.find(u => u.name === depositTarget?.name):
            return false;
        default:
            return true;
    };
};

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    switch (true) {
        case !Block.validateStructure(candidateBlock):
        case previousBlock ? (previousBlock.index + 1) : 0 !== candidateBlock.index:
        case previousBlock ? previousBlock.hash : "" !== candidateBlock.previous:
        case getHashforBlock(candidateBlock) !== candidateBlock.hash:
            return false
        default:
            return true;
    };
}

const addBlock = (candidateBlock: Block): void => {
    if (!isBlockValid(candidateBlock, getLastestBlock()!)) return;
    blockchain.push(candidateBlock);
}

const trade = (price: number, depositor: traderInfo, depositTarget: traderInfo): void => {
    if (!isValidUsers(depositor, depositTarget)) return;
    depositor!.money -= price;
    depositTarget!.money += price;
    createNewBlock({ price: price, depositor: depositor, depositTarget: depositTarget });
    return;
};

trade(1000, users[0], users[1]);
trade(4000, users[1], users[0]);

console.log(blockchain);
console.log(users);


export { };

interface traderInfo {
    name: string;
    age: number;
    createdAt: number;
    money: number;
};

interface tradeInfo {
    price: number;
    depositor: traderInfo;
    depositTarget: traderInfo;
};