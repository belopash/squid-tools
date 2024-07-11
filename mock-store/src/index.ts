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
        return this.transactHot2(info, async (store, sliceBeg, sliceEnd) => {
            for (let i = sliceBeg; i < sliceEnd; i++) {
                await cb(store, info.newBlocks[i])
            }
        })
    }

    async transactHot2(info: HotTxInfo, cb: (store: S, sliceBeg: number, sliceEnd: number) => Promise<void>): Promise<void> {
        const store = this.createStore()

        if (info.newBlocks.length) {
            let finalizedEnd = info.finalizedHead.height - info.newBlocks[0].height + 1
            if (finalizedEnd > 0) {
                await cb(store, 0, finalizedEnd)
            } else {
                finalizedEnd = 0
            }
            for (let i = finalizedEnd; i < info.newBlocks.length; i++) {
                await cb(store, i, i + 1)
            }
        }
    }

    private createStore() {
        return this.storeConstructor ? new this.storeConstructor() : (null as S)
    }
}
