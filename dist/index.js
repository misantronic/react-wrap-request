import { __awaiter, __generator, __read, __spread } from "tslib";
import { useState, useCallback, useEffect } from 'react';
/** @see https://stackoverflow.com/a/4994244/1138860 */
function isEmpty(obj) {
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
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}
export function useWrapRequest(req, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var _a = __read(useState(options.defaultData), 2), $ = _a[0], set$ = _a[1];
    var _b = __read(useState(), 2), state = _b[0], setState = _b[1];
    var loading = state === 'loading';
    var fetched = state === 'fetched';
    var error = state instanceof Error ? state : undefined;
    var empty = fetched && isEmpty($);
    var deps = (options.deps || []);
    var mounted = true;
    var request = useCallback(function (params, options) { return __awaiter(_this, void 0, void 0, function () {
        var res, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (options === undefined || options.stateLoading === true) {
                        setState('loading');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (params
                            ? req(params)
                            : req.apply(void 0, __spread(deps)))];
                case 2:
                    res = _a.sent();
                    if (mounted) {
                        set$(res);
                        // ensure state-transation from potential 'fetched' to 'fetched'
                        setState(undefined);
                        setState('fetched');
                    }
                    return [2 /*return*/, res];
                case 3:
                    e_1 = _a.sent();
                    if (mounted) {
                        setState(e_1);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, undefined];
            }
        });
    }); }, deps);
    var match = useCallback(function (handlers) {
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
    }, [error, empty, loading, fetched]);
    useEffect(function () {
        if (options.deps) {
            request();
        }
        return function () {
            mounted = false;
        };
    }, deps);
    return {
        $: $,
        result: $,
        loading: loading,
        fetched: fetched,
        error: error,
        empty: empty,
        reset: set$,
        request: request,
        match: match
    };
}
//# sourceMappingURL=index.js.map