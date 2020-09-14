export { WrapRequestHook };
interface RequestOptions {
    stateLoading?: boolean;
}
declare type ToupleArray = ReadonlyArray<any> | readonly [any];
interface WrapRequestHook<T = any, TX = T> {
    $: TX;
    result: TX;
    source: T;
    loading: boolean;
    fetched: boolean;
    empty: boolean;
    error?: Error;
    request(params?: unknown, options?: RequestOptions): Promise<T | undefined>;
    reset($: T | TX): void;
    match(handlers: Handlers<TX>): any;
}
interface Handlers<T> {
    default?(): any;
    loading?(): any;
    fetched?(value: Exclude<T, undefined>): any;
    empty?(): any;
    error?(...e: Error[]): any;
}
interface WrapRequestOptions<Y, T, TX> {
    deps?: Y;
    defaultData?: T;
    transform?($: T): TX;
}
interface WrapRequestOptionsDefaultData<Y, T, TX> extends WrapRequestOptions<Y, T, TX> {
    defaultData: T;
}
export declare function useWrapRequest<T, Y extends ToupleArray, TX = T>(req: (...deps: Y) => Promise<T>, options?: WrapRequestOptionsDefaultData<Y, T, TX>): WrapRequestHook<T, TX>;
export declare function useWrapRequest<T, Y extends ToupleArray, TX = T>(req: (...deps: Y) => Promise<T>, options?: WrapRequestOptions<Y, T, TX>): WrapRequestHook<T | undefined, TX>;
