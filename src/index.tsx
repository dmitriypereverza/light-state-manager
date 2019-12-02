import React, { useCallback, useState } from "react";

function useForceUpdate() {
  const [, updateState] = useState();
  return useCallback(() => updateState({}), []);
}

export class StoreContext<State extends Record<string, any>, Actions> {
  static connectContexts(
    storeContexts: StoreContext<any, any>[],
    Component: React.FC<any>,
  ) {
    let current = Component;
    storeContexts.forEach(storeContext => {
      current = storeContext.provideContext(current);
    });
    return current;
  }

  private readonly context: React.Context<any>;
  private readonly Provider: React.FunctionComponent<{ children: any }>;
  private readonly actions: any;

  constructor({
    initialState,
    actions,
  }: {
    initialState: State;
    actions: Actions;
  }) {
    this.context = React.createContext(null);
    this.actions = actions;

    const storeInitialState = Object.assign({}, initialState, actions);

    const Provider = ({ children }) => {
      const state = React.useRef(storeInitialState);
      const update = useForceUpdate();

      const actions: any = {};
      for (const thisActionKey in this.actions) {
        const realAction = this.actions[thisActionKey];
        const patchedAction: any = {};
        for (const actionKey in realAction.actions) {
          patchedAction[actionKey] = payload => {
            state.current = Object.assign(
              {},
              state.current,
              realAction.actions[actionKey].call(null, state.current, payload),
            );
            update();
          };
        }
        actions[thisActionKey] = realAction.caller.bind(
          state.current,
          patchedAction,
        );
      }

      return (
        <this.context.Provider
          value={Object.assign({}, state.current, actions)}
        >
          {children}
        </this.context.Provider>
      );
    };
    this.Provider = Provider;
  }

  getState() {
    return React.useContext<Actions & State>(this.context);
  }

  provideContext<T>(Component: React.FC<T>): React.FC<T> {
    return props => (
      <this.Provider>
        <Component {...props} />
      </this.Provider>
    );
  }
}

export class Action<State> {
  create<
    CallerData,
    CallerResult,
    Actions extends {
      [name: string]: (state: State, payload?: any) => State;
    }
  >(
    actions: Actions,
    caller: (
      this: State,
      actions: {
        [K in keyof Actions]: (payload?: Parameters<Actions[K]>[1]) => State;
      },
      data: CallerData,
    ) => CallerResult,
  ): unknown extends CallerData
    ? () => CallerResult
    : (data: CallerData) => CallerResult {
    // @ts-ignore
    return {
      actions,
      caller,
    };
  }
}

export type LoadingState<
  LOADING extends string = "loading",
  ERROR extends string = "error"
> = { [T in LOADING]: boolean } & { [T in ERROR]: string };
