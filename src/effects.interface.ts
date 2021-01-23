import { Action } from 'redux';

/**
 * @stable [23.01.2021]
 */
export interface IEffectsAction<TData = unknown>
  extends Action {
  data?: TData;
  error?: unknown;
  initialData?: unknown;
}

/**
 * @stable [23.01.2021]
 */
export interface IEffectsMiddlewareAPI {
  dispatch: (action: IEffectsAction) => IEffectsAction;
}
