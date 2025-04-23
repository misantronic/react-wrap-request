import * as React from 'react';
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

export function useWrapRequest<
    T,
    Y extends ToupleArray,
    DD extends T | undefined = undefined,
    MD = any
>(
    req: (...deps: Y) => T | Promise<T>,
    options?: ReactWrapRequestOptions<T, Y, DD, MD>
): WrapRequest<T, EmptyArray<Y>, T, MD, DD>;

export function useWrapRequest<
    T,
    Y extends ToupleArray,
    DD extends T | undefined = undefined,
    MD = any
>(
    req: (...deps: Y) => T | Promise<T>,
    options: ReactWrapRequestOptions<T, Y, DD, MD> = {}
): WrapRequest<T, Y, T, any, DD> {
    const mountedRef = React.useRef(true);
    const [, setResult] = React.useState<T>();
    const [, setState] = React.useState<string | Error>();
    const { deps: orgDeps, ...wrapRequestOptions } = options;
    const deps = (orgDeps || []) as Y;

    const wrapped = React.useMemo(() => {
        const wrapRequestFn = options.wrapRequestFn || wrapRequest;

        const wr = wrapRequestFn(async (deps: Y) => {
            try {
                const res = await req(...(deps || []));

                if (mountedRef.current) {
                    setResult(res);
                }

                return res;
            } catch (e) {
                if (mountedRef.current) {
                    setState(e as Error);
                }

                throw e;
            }
        }, wrapRequestOptions);

        wr.match({
            default: () => mountedRef.current && setState('default'),
            empty: () => mountedRef.current && setState('empty'),
            error: (e) => mountedRef.current && setState(e),
            fetched: () => mountedRef.current && setState('fetched'),
            loading: () => mountedRef.current && setState('loading'),
        });

        return wr;
    }, []);

    React.useEffect(() => {
        if (mountedRef.current && orgDeps?.every((dep) => dep !== undefined)) {
            // @ts-ignore
            wrapped.request(deps);
        }
    }, deps);

    React.useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    return wrapped;
}
