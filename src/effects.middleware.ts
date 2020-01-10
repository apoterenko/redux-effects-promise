import { AnyAction } from 'redux';

import { EffectsAction } from './effects.action';
import { EffectsActionBuilder } from './effects-action.builder';
import { EffectsService } from './effects.service';
import {
  IEffectsAction,
  IEffectsMiddlewareAPI,
} from './effects.interface';
import {
  isDefined,
  isFn,
  isPromiseLike,
} from './effects.utils';

const toActions = (action: AnyAction, result: any): AnyAction[] => {
  const initialData = action.data;
  let actionsForDispatch: AnyAction[];

  if (Array.isArray(result)) {
    if (result.length) {
      const thisIsArrayOfActionEffects =
        !!(result as any[]).find((item) => item instanceof EffectsAction);

      if (thisIsArrayOfActionEffects) {
        actionsForDispatch = result.map((resultAction) => ({
          ...resultAction,
          initialData,
        }));
      }
    }
  } else if (result instanceof EffectsAction) {
    actionsForDispatch = [{
      ...result,
      initialData,
    }];
  }
  actionsForDispatch = actionsForDispatch || [
    {
      type: EffectsActionBuilder.buildDoneActionType(action.type),
      data: result,
      initialData,
    }
  ];
  return actionsForDispatch;
};

/**
 * @stable [10.01.2020]
 * @param {IEffectsMiddlewareAPI} payload
 * @returns {(next: (action: IEffectsAction) => IEffectsAction) => (initialAction: IEffectsAction) => (IEffectsAction | undefined)}
 */
export const effectsMiddleware = (payload: IEffectsMiddlewareAPI) => (
  (next: (action: IEffectsAction) => IEffectsAction) => (initialAction: IEffectsAction) => {
    const {dispatch} = payload;
    const nextActionResult = next(initialAction);
    const proxy = EffectsService.fromEffectsMap(initialAction.type);

    if (!isFn(proxy)) {
      // Native redux behavior (!)
      return nextActionResult;
    }

    const initialData = initialAction.data;
    const proxyResult = proxy(initialAction);
    if (!isDefined(proxyResult)) {
      // Stop chaining. An effect does return nothing (!)
      return;
    }

    const dispatchCallback = ($nextAction: IEffectsAction) => dispatch({...$nextAction, initialData});
    if (isPromiseLike(proxyResult)) {
      // Bluebird Promise supporting
      // An effect does return a promise object - we should build the async chain (!)

      (proxyResult as Promise<{}>)
        .then(
          (result) => toActions(initialAction, result).forEach(dispatchCallback),
          (error) => dispatch({type: EffectsActionBuilder.buildErrorActionType(initialAction.type), error, initialData})
        );
    } else {
      toActions(initialAction, proxyResult).forEach(dispatchCallback);
    }
    return nextActionResult;
  });
