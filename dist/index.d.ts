export { WrapRequest };
interface RequestOptions {
    stateLoading?: boolean;
}
interface WrapRequest<T, TT, Y> {
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
    fetched?(...value: T[]): any;
    empty?(): any;
    error?(...e: Error[]): any;
}
export declare function useWrapRequest<T, Y>(req: (...deps: Y[]) => Promise<T>, options?: {
    deps?: Y[];
    defaultData: T;
}): WrapRequest<T, T, Y>;
export declare function useWrapRequest<T, Y>(req: (...deps: Y[]) => Promise<T>, options?: {
    deps?: Y[];
    defaultData?: T;
}): WrapRequest<T | undefined, T, Y>;
