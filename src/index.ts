import * as React from 'react';
import { wrapRequest } from 'wrap-request';

type ToupleArray = ReadonlyArray<any> | readonly [any];

interface WrapRequestOptions<Y, T> {
    deps?: Y;
    defaultData?: T;
}

export function useWrapRequest<T, Y extends ToupleArray>(
    req: (...deps: Y) => Promise<T>,
    options: WrapRequestOptions<Y, T> = {}
) {
    const [, setResult] = React.useState();
    const [, setState] = React.useState();
    const deps = (options.deps || []) as Y;

    const wrapped = React.useMemo(
        () =>
            wrapRequest(
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
                {
                    defaultData: options.defaultData,
                }
            ),
        []
    );

    return React.useMemo(() => {
        if (options.deps && options.deps.every((dep) => dep !== undefined)) {
            wrapped.request(deps);
        }

        wrapped.match({
            default: () => setState('default'),
            empty: () => setState('empty'),
            error: (e) => setState(e),
            fetched: () => setState('fetched'),
            loading: () => setState('loading'),
        });

        return wrapped;
    }, deps);
}
