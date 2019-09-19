import { __awaiter, __generator } from "tslib";
import { renderHook, act
// HookResult,
// RenderHookOptions
 } from '@testing-library/react-hooks';
// import * as React from 'react';
import { useWrapRequest } from '.';
// import { useState, useEffect, useCallback } from 'react';
// async function renderHookAct<T>(
//     action: () => T,
//     options?: RenderHookOptions<T>
// ) {
//     let hookResult: HookResult<T> | undefined;
//     await act(async () => {
//         const { result } = renderHook(action, options);
//         hookResult = result;
//     });
//     if (hookResult) {
//         return hookResult.current;
//     }
//     throw new Error('HookResult is not defined');
// }
// test('it should not fetch when no deps are set', async () => {
//     const hookResult = await renderHookAct(() =>
//         useWrapRequest(async () => true)
//     );
//     expect(hookResult.$).toBe(undefined);
// });
test('it should request when deps are set and empty', function () {
    var hookResult = renderHook(function () { return useWrapRequest(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, true];
    }); }); }); });
    act(function () {
        hookResult.result.current.request();
    });
    expect(hookResult.result.current.$).toBe(true);
});
// test('it should set fetched state when requested', async () => {
//     const hookResult = await renderHookAct(() =>
//         useWrapRequest(async () => true, { deps: [] })
//     );
//     expect(hookResult.fetched).toBe(true);
// });
// test.only('it should re-fetch', async () => {
//     function useHookWrapper() {
//         const [value, setValue] = React.useState(0);
//         const wrapRequest = useWrapRequest(async value => value, {
//             deps: [value]
//         });
//         return {
//             setValue,
//             wrapRequest
//         };
//     }
//     const hookResult = await renderHookAct(() => useHookWrapper());
//     act(() => {
//         hookResult.setValue(1);
//     });
//     expect(hookResult.wrapRequest.$).toBe(1);
// });
//# sourceMappingURL=index.test.js.map