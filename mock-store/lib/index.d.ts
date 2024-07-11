import { HotDatabaseState, FinalTxInfo, HotTxInfo, HashAndHeight } from '@subsquid/util-internal-processor-tools';
export interface MockDatabaseOptions<S> {
    storeConstructor?: new () => S;
    supportHotBlocks?: boolean;
}
export declare class MockDatabase<S> {
    readonly supportsHotBlocks: boolean;
    private storeConstructor?;
    constructor(options?: MockDatabaseOptions<S>);
    connect(): Promise<HotDatabaseState>;
    transact(info: FinalTxInfo, cb: (store: S) => Promise<void>): Promise<void>;
    transactHot(info: HotTxInfo, cb: (store: S, block: HashAndHeight) => Promise<void>): Promise<void>;
    transactHot2(info: HotTxInfo, cb: (store: S, sliceBeg: number, sliceEnd: number) => Promise<void>): Promise<void>;
    private createStore;
}
//# sourceMappingURL=index.d.ts.map