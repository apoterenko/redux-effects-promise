import { Action } from 'redux';

/**
 * @stable [23.01.2021]
 */
export interface IEffectsAction<TData = unknown,
  TInitialData = unknown,
  TError = unknown>
  extends Action {
  data?: TData;
  error?: TError;
  initialData?: TInitialData;
}

/**
 * @stable [23.01.2021]
 */
export interface IEffectsMiddlewareAPI {
  dispatch: (action: IEffectsAction) => IEffectsAction;
}
