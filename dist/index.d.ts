import { WrapRequest, wrapRequest } from 'wrap-request';
declare type ToupleArray = ReadonlyArray<any> | readonly [any];
export interface ReactWrapRequestOptions<Y, T> {
    deps?: Y;
    defaultData?: T;
    cacheKey?: string;
    wrapRequestFn?: typeof wrapRequest;
}
export declare function useWrapRequest<T, Y = undefined>(req: () => T | Promise<T>, options?: ReactWrapRequestOptions<Y, T>): WrapRequest<T, Y, T>;
export declare function useWrapRequest<T, Y extends ToupleArray>(req: (...deps: Y) => T | Promise<T>, options?: ReactWrapRequestOptions<Y, T>): WrapRequest<T, Y, T>;
export {};
