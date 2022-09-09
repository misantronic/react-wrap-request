declare type ToupleArray = ReadonlyArray<any> | readonly [any];
export interface ReactWrapRequestOptions<Y, T> {
    deps?: Y;
    defaultData?: T;
    cacheKey?: string;
}
export declare function useWrapRequest<T, Y extends ToupleArray>(req: (...deps: Y) => Promise<T>, options?: ReactWrapRequestOptions<Y, T>): import("wrap-request").WrapRequest<T, Y[0], T, any>;
export {};
