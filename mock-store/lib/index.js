"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockDatabase = void 0;
class MockDatabase {
    constructor(options) {
        this.supportsHotBlocks = options?.supportHotBlocks !== false;
    }
    async connect() {
        return { height: -1, hash: '0x', top: [] };
    }
    async transact(info, cb) {
        const store = this.createStore();
        return await cb(store);
    }
    async transactHot(info, cb) {
        return this.transactHot2(info, async (store, sliceBeg, sliceEnd) => {
            for (let i = sliceBeg; i < sliceEnd; i++) {
                await cb(store, info.newBlocks[i]);
            }
        });
    }
    async transactHot2(info, cb) {
        const store = this.createStore();
        if (info.newBlocks.length) {
            let finalizedEnd = info.finalizedHead.height - info.newBlocks[0].height + 1;
            if (finalizedEnd > 0) {
                await cb(store, 0, finalizedEnd);
            }
            else {
                finalizedEnd = 0;
            }
            for (let i = finalizedEnd; i < info.newBlocks.length; i++) {
                await cb(store, i, i + 1);
            }
        }
    }
    createStore() {
        return this.storeConstructor ? new this.storeConstructor() : null;
    }
}
exports.MockDatabase = MockDatabase;
//# sourceMappingURL=index.js.map