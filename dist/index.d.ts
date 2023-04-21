import { WrapRequest, wrapRequest } from 'wrap-request';
type ToupleArray = ReadonlyArray<any> | readonly [any];
export interface ReactWrapRequestOptions<Y, DD> {
    deps?: Y;
    defaultData?: DD;
    cacheKey?: string;
    wrapRequestFn?: typeof wrapRequest;
}
type UnArray<T> = T extends Array<infer U> ? U : T;
type EmptyArray<P> = UnArray<P> extends undefined ? undefined : P;
export declare function useWrapRequest<T, Y extends ToupleArray, DD extends T | undefined = undefined>(req: (...deps: Y) => T | Promise<T>, options?: ReactWrapRequestOptions<Y, DD>): WrapRequest<T, EmptyArray<Y>, T, any, DD>;
export {};
