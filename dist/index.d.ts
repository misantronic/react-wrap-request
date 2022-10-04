import { WrapRequest, wrapRequest } from 'wrap-request';
declare type ToupleArray = ReadonlyArray<any> | readonly [any];
export interface ReactWrapRequestOptions<Y, T> {
    deps?: Y;
    defaultData?: T;
    cacheKey?: string;
    wrapRequestFn?: typeof wrapRequest;
}
declare type UnArray<T> = T extends Array<infer U> ? U : T;
declare type EmptyArray<P> = UnArray<P> extends undefined ? undefined : P;
export declare function useWrapRequest<T, Y extends ToupleArray>(req: (...deps: Y) => T | Promise<T>, options?: ReactWrapRequestOptions<Y, T>): WrapRequest<T, EmptyArray<Y>>;
export {};
