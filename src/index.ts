import * as React from 'react';
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

export function useWrapRequest<
    T,
    Y extends ToupleArray,
    DD extends T | undefined = undefined
>(
    req: (...deps: Y) => T | Promise<T>,
    options?: ReactWrapRequestOptions<Y, DD>
): WrapRequest<T, EmptyArray<Y>, T, any, DD>;

export function useWrapRequest<
    T,
    Y extends ToupleArray,
    DD extends T | undefined = undefined
>(
    req: (...deps: Y) => T | Promise<T>,
    options: ReactWrapRequestOptions<Y, DD> = {}
): WrapRequest<T, Y, T, any, DD> {
    const mountedRef = React.useRef(true);
    const mounted = mountedRef.current;
    const [, setResult] = React.useState<T>();
    const [, setState] = React.useState<string | Error>();
    const { deps: orgDeps, ...wrapRequestOptions } = options;
    const deps = (orgDeps || []) as Y;

    const wrapped = React.useMemo(() => {
        const wrapRequestFn = options.wrapRequestFn || wrapRequest;

        const wr = wrapRequestFn(async (deps: Y) => {
            try {
                const res = await req(...(deps || []));

                if (mounted) {
                    setResult(res);
                }

                return res;
            } catch (e) {
                if (mounted) {
                    setState(e as Error);
                }

                throw e;
            }
        }, wrapRequestOptions);

        wr.match({
            default: () => mounted && setState('default'),
            empty: () => mounted && setState('empty'),
            error: (e) => mounted && setState(e),
            fetched: () => mounted && setState('fetched'),
            loading: () => mounted && setState('loading'),
        });

        return wr;
    }, []);

    React.useEffect(() => {
        if (mounted && orgDeps?.every((dep) => dep !== undefined)) {
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
