import {HotDatabaseState, FinalTxInfo, HotTxInfo, HashAndHeight} from '@subsquid/util-internal-processor-tools'

export interface MockDatabaseOptions<S> {
    storeConstructor?: new () => S
    supportHotBlocks?: boolean
}

export class MockDatabase<S> {
    readonly supportsHotBlocks: boolean

    private storeConstructor?: new () => S

    constructor(options?: MockDatabaseOptions<S>) {
        this.supportsHotBlocks = options?.supportHotBlocks !== false
    }

    async connect(): Promise<HotDatabaseState> {
        return {height: -1, hash: '0x', top: []}
    }

    async transact(info: FinalTxInfo, cb: (store: S) => Promise<void>): Promise<void> {
        const store = this.createStore()
        return await cb(store)
    }

    async transactHot(info: HotTxInfo, cb: (store: S, block: HashAndHeight) => Promise<void>): Promise<void> {
        const store = this.createStore()
        for (let b of info.newBlocks) {
            await cb(store, b)
        }
    }

    private createStore() {
        return this.storeConstructor ? new this.storeConstructor() : (null as S)
    }
}
