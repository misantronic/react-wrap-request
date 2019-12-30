export { WrapRequestHook };
interface RequestOptions {
    stateLoading?: boolean;
}
declare type ToupleArray = ReadonlyArray<any> | readonly [any];
interface WrapRequestHook<T = any, TT = T, TX = T> {
    $: TX;
    result: TX;
    source: T;
    loading: boolean;
    fetched: boolean;
    empty: boolean;
    error?: Error;
    request(params?: unknown, options?: RequestOptions): Promise<T | undefined>;
    reset($: T | TX): void;
    match(handlers: Handlers<TT>): any;
}
interface Handlers<T> {
    default?(): any;
    loading?(): any;
    fetched?(value: Exclude<T, undefined>): any;
    empty?(): any;
    error?(...e: Error[]): any;
}
export declare function useWrapRequest<T, Y extends ToupleArray, TX = T>(req: (...deps: Y) => Promise<T>, options?: {
    deps?: Y;
    defaultData: T;
    transform?($: T): TX;
}): WrapRequestHook<T, T, TX>;
export declare function useWrapRequest<T, Y extends ToupleArray, TX = T>(req: (...deps: Y) => Promise<T>, options?: {
    deps?: Y;
    defaultData?: T;
    transform?($: T): TX;
}): WrapRequestHook<T | undefined, T, TX>;
