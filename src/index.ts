import { useState, useCallback, useEffect } from 'react';

export { WrapRequestHook };

interface RequestOptions {
    stateLoading?: boolean;
}

interface WrapRequestHook<T, TT, Y> {
    $: T;
    result: T;
    loading: boolean;
    fetched: boolean;
    empty: boolean;
    error?: Error;
    request(params?: Y, options?: RequestOptions): Promise<T | undefined>;
    reset($: T): void;
    match(handlers: Handlers<TT>): any;
}

interface Handlers<T> {
    default?(): any;
    loading?(): any;
    fetched?(...value: T[]): any;
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

export function useWrapRequest<T, Y>(
    req: (...deps: Y[]) => Promise<T>,
    options?: {
        deps?: Y[];
        defaultData: T;
    }
): WrapRequestHook<T, T, Y>;
export function useWrapRequest<T, Y>(
    req: (...deps: Y[]) => Promise<T>,
    options?: {
        deps?: Y[];
        defaultData?: T;
    }
): WrapRequestHook<T | undefined, T, Y>;
export function useWrapRequest<T, Y>(
    req: (...deps: Y[]) => Promise<T>,
    options: {
        deps?: Y[];
        defaultData?: T;
    } = {}
): WrapRequestHook<T, T, Y> {
    const [$, set$] = useState<T>(options.defaultData as any);
    const [state, setState] = useState<
        'loading' | 'fetched' | Error | undefined
    >();
    const loading = state === 'loading';
    const fetched = state === 'fetched';
    const error = state instanceof Error ? state : undefined;
    const empty = fetched && isEmpty($);
    const deps = options.deps || [];
    let mounted = true;

    const request = useCallback(
        async (params?: Y, options?: RequestOptions) => {
            if (options === undefined || options.stateLoading === true) {
                setState('loading');
            }

            try {
                const res = await (params ? req(params) : req(...deps));

                if (mounted) {
                    set$(res);
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
        [deps]
    );

    const match = useCallback(
        (handlers: Handlers<T>) => {
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
                return handlers.fetched($);
            }

            if (handlers.default) {
                return handlers.default();
            }

            return null;
        },
        [error, empty, loading, fetched]
    );

    useEffect(() => {
        if (options.deps) {
            request();
        }

        return () => {
            mounted = false;
        };
    }, deps);

    return {
        $,
        result: $,
        loading,
        fetched,
        error,
        empty,
        reset: set$,
        request,
        match
    };
}
