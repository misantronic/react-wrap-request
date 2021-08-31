import * as React from 'react';
import { wrapRequest } from 'wrap-request';

type ToupleArray = ReadonlyArray<any> | readonly [any];

interface WrapRequestOptions<Y, T> {
    deps?: Y;
    defaultData?: T;
    cacheKey?: string;
}

export function useWrapRequest<T, Y extends ToupleArray>(
    req: (...deps: Y) => Promise<T>,
    options: WrapRequestOptions<Y, T> = {}
) {
    const [, setResult] = React.useState<T>();
    const [, setState] = React.useState<string | Error>();
    const {deps: orgDepts, ...wrapRequestOptions } = options;
    const deps = (orgDepts || []) as Y;

    const wrapped = React.useMemo(() => {
        const wr = wrapRequest(
            async (deps = []) => {
                try {
                    const res = await req(...deps);

                    setResult(res);

                    return res;
                } catch (e) {
                    setState(e);

                    throw e;
                }
            },
            wrapRequestOptions
        );

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
        if (orgDepts && orgDepts.every((dep) => dep !== undefined)) {
            wrapped.request(deps);
        }
    }, deps);

    return wrapped;
}
