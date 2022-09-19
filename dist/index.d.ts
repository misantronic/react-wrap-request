import { wrapRequest } from 'wrap-request';
declare type ToupleArray = ReadonlyArray<any> | readonly [any];
export interface ReactWrapRequestOptions<Y, T> {
    deps?: Y;
    defaultData?: T;
    cacheKey?: string;
    wrapRequestFn?: typeof wrapRequest;
}
export declare function useWrapRequest<T, Y extends ToupleArray>(req: (...deps: Y) => T | Promise<T>, options?: ReactWrapRequestOptions<Y, T>): import("wrap-request").WrapRequest<T, Y, T, any>;
export {};
