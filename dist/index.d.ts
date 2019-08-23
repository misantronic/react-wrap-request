export { WrapRequestHook };
interface RequestOptions {
    stateLoading?: boolean;
}
interface WrapRequestHook<T = any, TT = T, Y = undefined> {
    $: T;
    result: T;
    loading: boolean;
    fetched: boolean;
    empty: boolean;
    error?: Error;
    request(params?: Y, options?: RequestOptions): Promise<T | undefined>;
    reset($: T): void;
    match(handlers: Handlers<TT>): any;
}
interface Handlers<T> {
    default?(): any;
    loading?(): any;
    fetched?(value: T): any;
    empty?(): any;
    error?(...e: Error[]): any;
}
export declare function useWrapRequest<T, Y>(req: (...deps: Y[]) => Promise<T>, options?: {
    deps?: Y[];
    defaultData: T;
}): WrapRequestHook<T, T, Y>;
export declare function useWrapRequest<T, Y>(req: (...deps: Y[]) => Promise<T>, options?: {
    deps?: Y[];
    defaultData?: T;
}): WrapRequestHook<T | undefined, T, Y>;
