export { WrapRequestHook };
interface RequestOptions {
    stateLoading?: boolean;
}
declare type ToupleArray = ReadonlyArray<any> | readonly [any];
interface WrapRequestHook<T = any, TT = T> {
    $: T;
    result: T;
    loading: boolean;
    fetched: boolean;
    empty: boolean;
    error?: Error;
    request(params?: unknown, options?: RequestOptions): Promise<T | undefined>;
    reset($: T): void;
    match(handlers: Handlers<TT>): any;
}
interface Handlers<T> {
    default?(): any;
    loading?(): any;
    fetched?(value: Exclude<T, undefined>): any;
    empty?(): any;
    error?(...e: Error[]): any;
}
export declare function useWrapRequest<T, Y extends ToupleArray>(req: (...deps: Y) => Promise<T>, options?: {
    deps?: Y;
    defaultData: T;
}): WrapRequestHook<T, T>;
export declare function useWrapRequest<T, Y extends ToupleArray>(req: (...deps: Y) => Promise<T>, options?: {
    deps?: Y;
    defaultData?: T;
}): WrapRequestHook<T | undefined, T>;
