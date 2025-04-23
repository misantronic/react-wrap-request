import { renderHook, act } from '@testing-library/react-hooks';
import { useWrapRequest } from '.';
import { useState } from 'react';

test('it should not request when no deps are set', async () => {
    const { result } = renderHook(() => useWrapRequest(async () => true));

    expect(result.current.$).toBe(undefined);
    expect(result.current.loading).toBe(false);
    expect(result.current.fetched).toBe(false);
    expect(result.current.error).toBe(undefined);
});

test('it should not request when deps-value are undefined', async () => {
    const { result } = renderHook(() =>
        useWrapRequest(async (_) => true, { deps: [undefined] })
    );

    expect(result.current.$).toBe(undefined);
    expect(result.current.loading).toBe(false);
    expect(result.current.fetched).toBe(false);
    expect(result.current.error).toBe(undefined);
});

test('it should manual request with empty deps', async () => {
    const { result } = renderHook(() =>
        useWrapRequest(async () => true, { deps: [] })
    );

    await act(async () => {
        await result.current.request();
    });

    expect(result.current.$).toBe(true);
});

test('it should manual request with filles deps', async () => {
    const { result } = renderHook(() =>
        useWrapRequest(async (token) => token, { deps: ['token'] })
    );

    await act(async () => {
        await result.current.request(['new_token']);
    });

    expect(result.current.$).toBe('new_token');
});

test('it should initially request', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
        useWrapRequest(async () => 'abc', { deps: [] })
    );

    await waitForNextUpdate();

    expect(result.current.$).toBe('abc');
    expect(result.current.loading).toBe(false);
    expect(result.current.fetched).toBe(true);
    expect(result.current.error).toBe(undefined);
});

test('it should manually request', async () => {
    const { result } = renderHook(() => useWrapRequest(async () => 'abc'));

    await act(async () => {
        await result.current.request();
    });

    expect(result.current.$).toBe('abc');
    expect(result.current.loading).toBe(false);
    expect(result.current.fetched).toBe(true);
    expect(result.current.error).toBe(undefined);
});

test('it should have default values', async () => {
    const { result } = renderHook(() =>
        useWrapRequest(async () => 'abc', { defaultData: 'cba' })
    );

    expect(result.current.$).toBe('cba');
    expect(result.current.loading).toBe(false);
    expect(result.current.fetched).toBe(false);
    expect(result.current.error).toBe(undefined);
});

test('it should match', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
        useWrapRequest(async () => 'abc', { deps: [] })
    );

    const getMatched = () =>
        result.current.match({
            default: () => 'default',
            loading: () => 'loading',
            empty: () => 'empty',
            error: (e) => e.message,
            fetched: (data) => data,
        });

    expect(getMatched()).toBe('loading');

    await waitForNextUpdate();

    expect(getMatched()).toBe('abc');
});

test('it should match error', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
        useWrapRequest(
            async () => {
                throw new Error('error');
            },
            { deps: [] }
        )
    );

    const getMatched = () =>
        result.current.match({
            default: () => 'default',
            loading: () => 'loading',
            error: (e) => e.message,
            empty: () => 'empty',
        });

    expect(getMatched()).toBe('loading');

    await waitForNextUpdate();

    expect(getMatched()).toBe('error');
});

test('it should match empty', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
        useWrapRequest(async () => '', { deps: [] })
    );

    const getMatched = () =>
        result.current.match({
            default: () => 'default',
            loading: () => 'loading',
            error: (e) => e.message,
            empty: () => 'empty',
        });

    expect(getMatched()).toBe('loading');

    await waitForNextUpdate();

    expect(getMatched()).toBe('empty');
});

test('it should request when deps change', async () => {
    function useHookWrapper() {
        const [value, setValue] = useState(0);
        const wrapRequest = useWrapRequest(async (value) => value, {
            deps: [value],
        });

        return {
            increment: () => {
                setValue(value + 1);
            },
            wrapRequest,
        };
    }

    const { result, waitForNextUpdate } = renderHook(() => useHookWrapper());

    act(() => {
        result.current.increment();
    });

    act(() => {
        result.current.increment();
    });

    await waitForNextUpdate();

    expect(result.current.wrapRequest.$).toBe(2);
});

test('it should error', async () => {
    const error = new Error('Error');
    const { result, waitForNextUpdate } = renderHook(() =>
        useWrapRequest(
            async () => {
                throw error;
            },
            { deps: [] }
        )
    );

    await waitForNextUpdate();

    expect(result.current.$).toBe(undefined);
    expect(result.current.loading).toBe(false);
    expect(result.current.fetched).toBe(false);
    expect(result.current.error).toBe(error);
});

test('it should request with param', async () => {
    const { result } = renderHook(() =>
        useWrapRequest(async (id: number) => `/path/to/${id}`)
    );

    await act(async () => {
        await result.current.request([100]);
    });

    expect(result.current.$).toBe('/path/to/100');
});

test('it should request with multiple params', async () => {
    const { result } = renderHook(() =>
        useWrapRequest(
            async (id: number, token: string) => `/path/to/${id}/${token}`
        )
    );

    await act(async () => {
        await result.current.request([100, 'token']);
    });

    expect(result.current.$).toBe('/path/to/100/token');
});

test('it should transform', async () => {
    const { result } = renderHook(() =>
        useWrapRequest(
            async () => [
                { id: 1000000 },
                { id: 500 },
                { id: 1000 },
                { id: 2000000 },
            ],
            {
                defaultData: [],
            }
        ).pipe((items) => items?.map((item) => ({ doubleId: item.id * 2 })))
    );

    await act(async () => {
        await result.current.request();
    });

    expect(result.current.source[1]).toEqual({ id: 500 });
    expect(result.current.$?.[1]).toEqual({ doubleId: 1000 });
});

test('it should transform with default data', async () => {
    const { result } = renderHook(() =>
        useWrapRequest(
            async () => [
                { id: 1000000 },
                { id: 500 },
                { id: 1000 },
                { id: 2000000 },
            ],
            {
                defaultData: [],
            }
        ).pipe((items) => items?.map((item) => ({ doubleId: item.id * 2 })))
    );

    await act(async () => {
        await result.current.request();
    });

    expect(result.current.source[1]).toEqual({ id: 500 });
    expect(result.current.$[1]).toEqual({ doubleId: 1000 });
});

test('it should store metadata', async () => {
    const { result } = renderHook(() =>
        useWrapRequest(() => [{ id: 1 }], {
            metadata: (data) => data[0].id,
            defaultData: [],
        })
    );

    await act(async () => {
        await result.current.request();
    });

    expect(result.current.metadata).toEqual(1);
});
