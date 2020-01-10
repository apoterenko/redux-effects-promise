import { Action } from 'redux';

/**
 * @stable [10.01.2020]
 */
export interface IEffectsAction
  extends Action {
  data?: any;
  error?: any;
  initialData?: any;
}

/**
 * @stable [10.01.2020]
 */
export interface IEffectsMiddlewareAPI {
  dispatch: (action: IEffectsAction) => IEffectsAction;
}
