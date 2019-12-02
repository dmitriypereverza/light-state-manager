import React from "react";
export declare class StoreContext<State extends Record<string, any>, Actions> {
    static connectContexts(storeContexts: StoreContext<any, any>[], Component: React.FC<any>): React.FC<any>;
    private readonly context;
    private readonly Provider;
    private readonly actions;
    constructor({ initialState, actions, }: {
        initialState: State;
        actions: Actions;
    });
    getState(): Actions & State;
    provideContext<T>(Component: React.FC<T>): React.FC<T>;
}
export declare class Action<State> {
    create<CallerData, CallerResult, Actions extends {
        [name: string]: (state: State, payload?: any) => State;
    }>(actions: Actions, caller: (this: State, actions: {
        [K in keyof Actions]: (payload?: Parameters<Actions[K]>[1]) => State;
    }, data: CallerData) => CallerResult): unknown extends CallerData ? () => CallerResult : (data: CallerData) => CallerResult;
}
export declare type LoadingState<LOADING extends string = "loading", ERROR extends string = "error"> = {
    [T in LOADING]: boolean;
} & {
    [T in ERROR]: string;
};
