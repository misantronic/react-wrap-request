import * as React from 'react';
import { wrapRequest } from 'wrap-request';

type ToupleArray = ReadonlyArray<any> | readonly [any];

export interface ReactWrapRequestOptions<Y, T> {
    deps?: Y;
    defaultData?: T;
    cacheKey?: string;
    wrapRequestFn?: typeof wrapRequest;
}

export function useWrapRequest<T, Y extends ToupleArray>(
    req: (...deps: Y) => Promise<T>,
    options: ReactWrapRequestOptions<Y, T> = {}
) {
    const [, setResult] = React.useState<T>();
    const [, setState] = React.useState<string | Error>();
    const { deps: orgDeps, ...wrapRequestOptions } = options;
    const deps = (orgDeps || []) as Y;

    const wrapped = React.useMemo(() => {
        const wrapRequestFn = options.wrapRequestFn || wrapRequest;

        // @ts-ignore
        const wr = wrapRequestFn(async (...deps: Y) => {
            try {
                const res = await req(...deps);

                setResult(res);

                return res;
            } catch (e) {
                setState(e as Error);

                throw e;
            }
        }, wrapRequestOptions);

        wr.match({
            default: () => setState('default'),
            empty: () => setState('empty'),
            error: (e) => setState(e),
            fetched: () => setState('fetched'),
            loading: () => setState('loading'),
        });

        return wr;
    }, []);

    React.useEffect(() => {
        if (orgDeps?.every((dep) => dep !== undefined)) {
            wrapped.request(...(deps as any));
        }
    }, deps);

    return wrapped;
}
