import { useState, useCallback, useEffect } from 'react';

export { WrapRequestHook };

interface RequestOptions {
    stateLoading?: boolean;
}

type State = 'loading' | 'fetched' | Error | undefined;
type ToupleArray = ReadonlyArray<any> | readonly [any];

interface WrapRequestHook<T = any, TX = T> {
    $: TX;
    result: TX;
    source: T;
    loading: boolean;
    fetched: boolean;
    empty: boolean;
    error?: Error;
    request(params?: unknown, options?: RequestOptions): Promise<T | undefined>;
    reset($: T | TX): void;
    match(handlers: Handlers<TX>): any;
}

interface Handlers<T> {
    default?(): any;
    loading?(): any;
    fetched?(value: Exclude<T, undefined>): any;
    empty?(): any;
    error?(...e: Error[]): any;
}

/** @see https://stackoverflow.com/a/4994244/1138860 */
function isEmpty(obj: any): boolean {
    if (!obj) {
        return true;
    }
    if (obj > 0) {
        return false;
    }
    if (obj.length > 0) {
        return false;
    }
    if (obj.length === 0) {
        return true;
    }
    if (typeof obj !== 'object') {
        return true;
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

interface WrapRequestOptions<Y, T, TX> {
    deps?: Y;
    defaultData?: T;
    transform?($: T): TX;
}

interface WrapRequestOptionsDefaultData<Y, T, TX>
    extends WrapRequestOptions<Y, T, TX> {
    defaultData: T;
}

function useResult<T, TX>(
    options: WrapRequestOptions<any, T, TX>
): [TX, T, (data: T | TX) => void] {
    const defaultData = options.defaultData as any;

    const [$, set$] = useState<TX>(defaultData);
    const [source, setSource] = useState<T>(defaultData);

    function setResult(data: any) {
        setSource(data);

        if (options.transform) {
            set$(options.transform(data));
        } else {
            set$(data);
        }
    }

    return [$, source, setResult];
}

export function useWrapRequest<T, Y extends ToupleArray, TX = T>(
    req: (...deps: Y) => Promise<T>,
    options?: WrapRequestOptionsDefaultData<Y, T, TX>
): WrapRequestHook<T, TX>;

export function useWrapRequest<T, Y extends ToupleArray, TX = T>(
    req: (...deps: Y) => Promise<T>,
    options?: WrapRequestOptions<Y, T, TX>
): WrapRequestHook<T | undefined, TX>;

export function useWrapRequest<T, Y extends ToupleArray, TX = T>(
    req: (...deps: Y) => Promise<T>,
    options: WrapRequestOptions<Y, T, TX> = {}
): WrapRequestHook<T, TX> {
    const [$, source, setResult] = useResult(options);
    const [state, setState] = useState<State>();
    const loading = state === 'loading';
    const fetched = state === 'fetched';
    const error = state instanceof Error ? state : undefined;
    const empty = fetched && isEmpty($);
    const deps = (options.deps || []) as Y;
    let mounted = true;

    const request = useCallback(
        async (params?: unknown, reqOptions?: RequestOptions) => {
            if (reqOptions === undefined || reqOptions.stateLoading === true) {
                setState('loading');
            }

            try {
                const res = await (params
                    ? (req as any)(params)
                    : req(...deps));

                if (mounted) {
                    setResult(res);

                    // ensure state-transation from potential 'fetched' to 'fetched'
                    setState(undefined);
                    setState('fetched');
                }

                return res;
            } catch (e) {
                if (mounted) {
                    setState(e);
                }
            }

            return undefined;
        },
        deps
    );

    const match = useCallback(
        (handlers: Handlers<TX>) => {
            if (error && handlers.error) {
                return handlers.error(error);
            }

            if (empty && handlers.empty) {
                return handlers.empty();
            }

            if (loading && handlers.loading) {
                return handlers.loading();
            }

            if (fetched && handlers.fetched) {
                return handlers.fetched($ as any);
            }

            if (handlers.default) {
                return handlers.default();
            }

            return null;
        },
        [$, source, error, empty, loading, fetched]
    );

    useEffect(() => {
        if (options.deps && options.deps.every((dep) => dep !== undefined)) {
            request();
        }

        return () => {
            mounted = false;
        };
    }, deps);

    return {
        $,
        result: $,
        source,
        loading,
        fetched,
        error,
        empty,
        reset: setResult,
        request,
        match,
    };
}
