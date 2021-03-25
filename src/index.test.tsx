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
        useWrapRequest(async (id) => `/path/to/${id}`)
    );

    await act(async () => {
        await result.current.request(100);
    });

    expect(result.current.$).toBe('/path/to/100');
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

    expect(result.current.source?.[1]).toEqual({ id: 500 });
    expect(result.current.$?.[1]).toEqual({ doubleId: 1000 });
});
