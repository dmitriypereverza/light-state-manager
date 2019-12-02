"use strict";
exports.__esModule = true;
var react_1 = require("react");
function useForceUpdate() {
    var _a = react_1.useState(), updateState = _a[1];
    return react_1.useCallback(function () { return updateState({}); }, []);
}
var StoreContext = /** @class */ (function () {
    function StoreContext(_a) {
        var _this = this;
        var initialState = _a.initialState, actions = _a.actions;
        this.context = react_1["default"].createContext(null);
        this.actions = actions;
        var storeInitialState = Object.assign({}, initialState, actions);
        var Provider = function (_a) {
            var children = _a.children;
            var state = react_1["default"].useRef(storeInitialState);
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
            return (<_this.context.Provider value={Object.assign({}, state.current, actions)}>
          {children}
        </_this.context.Provider>);
        };
        this.Provider = Provider;
    }
    StoreContext.connectContexts = function (storeContexts, Component) {
        var current = Component;
        storeContexts.forEach(function (storeContext) {
            current = storeContext.provideContext(current);
        });
        return current;
    };
    StoreContext.prototype.getState = function () {
        return react_1["default"].useContext(this.context);
    };
    StoreContext.prototype.provideContext = function (Component) {
        var _this = this;
        return function (props) { return (<_this.Provider>
        <Component {...props}/>
      </_this.Provider>); };
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
            caller: caller
        };
    };
    return Action;
}());
exports.Action = Action;
