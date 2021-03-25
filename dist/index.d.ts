declare type ToupleArray = ReadonlyArray<any> | readonly [any];
interface WrapRequestOptions<Y, T> {
    deps?: Y;
    defaultData?: T;
}
export declare function useWrapRequest<T, Y extends ToupleArray>(req: (...deps: Y) => Promise<T>, options?: WrapRequestOptions<Y, T>): import("wrap-request").WrapRequest<T, T, any, any>;
export {};
