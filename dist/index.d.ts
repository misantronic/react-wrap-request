import { WrapRequest, wrapRequest } from 'wrap-request';
type ToupleArray = ReadonlyArray<any> | readonly [any];
export interface ReactWrapRequestOptions<T, Y, DD, MD> {
    deps?: Y;
    defaultData?: DD;
    metadata?: ($: T) => MD;
    cacheKey?: string;
    wrapRequestFn?: typeof wrapRequest;
}
type UnArray<T> = T extends Array<infer U> ? U : T;
type EmptyArray<P> = UnArray<P> extends undefined ? undefined : P;
export declare function useWrapRequest<T, Y extends ToupleArray, DD extends T | undefined = undefined, MD = any>(req: (...deps: Y) => T | Promise<T>, options?: ReactWrapRequestOptions<T, Y, DD, MD>): WrapRequest<T, EmptyArray<Y>, T, MD, DD>;
export {};
