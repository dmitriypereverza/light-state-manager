"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
function useForceUpdate() {
    var _a = react_1.useState(), updateState = _a[1];
    return react_1.useCallback(function () { return updateState({}); }, []);
}
exports.useForceUpdate = useForceUpdate;
var StoreContext = /** @class */ (function () {
    function StoreContext(initialState, actions) {
        var _this = this;
        this.context = react_1.default.createContext(null);
        this.actions = actions;
        var storeInitialState = Object.assign({}, initialState, actions);
        this.Provider = function (_a) {
            var children = _a.children;
            var state = react_1.default.useRef(storeInitialState);
            var update = useForceUpdate();
            var actions = {};
            var _loop_1 = function (thisActionKey) {
                var realAction = _this.actions[thisActionKey];
                var patchedAction = {};
                var _loop_2 = function (actionKey) {
                    patchedAction[actionKey] = function (payload) {
                        state.current = Object.assign({}, state.current, realAction.actions[actionKey].call(null, state.current, payload));
                        update();
                    };
                };
                for (var actionKey in realAction.actions) {
                    _loop_2(actionKey);
                }
                actions[thisActionKey] = realAction.caller.bind(state.current, patchedAction);
            };
            for (var thisActionKey in _this.actions) {
                _loop_1(thisActionKey);
            }
            return (react_1.default.createElement(_this.context.Provider, { value: Object.assign({}, state.current, actions) }, children));
        };
    }
    StoreContext.connectContexts = function (storeContexts, Component) {
        var current = Component;
        storeContexts.forEach(function (_a) {
            var storeContext = _a[0], name = _a[1];
            current = storeContext.provideContext(current, name);
        });
        return current;
    };
    StoreContext.prototype.getState = function () {
        return react_1.default.useContext(this.context);
    };
    StoreContext.prototype.provideContext = function (Component, name) {
        var _this = this;
        var cmp = function (props) { return (react_1.default.createElement(_this.Provider, null,
            react_1.default.createElement(Component, tslib_1.__assign({}, props)))); };
        cmp.displayName = name;
        return cmp;
    };
    return StoreContext;
}());
exports.StoreContext = StoreContext;
var Action = /** @class */ (function () {
    function Action() {
    }
    Action.prototype.create = function (actions, caller) {
        // @ts-ignore
        return {
            actions: actions,
            caller: caller,
        };
    };
    return Action;
}());
exports.Action = Action;
function pureConnect(Cmp, callback) {
    var contextProps = callback();
    var MemoCmp = react_1.default.memo(Cmp);
    return function (props) {
        return react_1.default.createElement(MemoCmp, tslib_1.__assign({}, props, contextProps));
    };
}
exports.pureConnect = pureConnect;
