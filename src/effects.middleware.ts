import { AnyAction } from 'redux';

import { EffectsService } from './effects.service';
import { EffectsAction } from './effects.action';
import { EffectsActionBuilder } from './effects-action.builder';

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

export const effectsMiddleware = ({dispatch}) => (
  (next: <A extends AnyAction>(action: A) => A) => <A extends AnyAction>(action: A) => {
    const proxyFn = EffectsService.fromEffectsMap(action.type);
    if (proxyFn) {
      const proxyFnResult = proxyFn(action);
      const initialData = action.data;

      if (proxyFnResult instanceof Promise) {
        return next({
          ...action || {},
          promise: proxyFnResult.then(
            (result) => toActions(action, result).forEach((action0) => dispatch(
              {...action0, initialData}
            )),
            (error) => dispatch({type: EffectsActionBuilder.buildErrorActionType(action.type), error, initialData})
          ),
        } as any);
      } else if (proxyFnResult) {
        const nextActionResult = next(action);
        toActions(action, proxyFnResult).forEach((action0) => dispatch(
          {...action0, initialData}
        ));
        return nextActionResult;
      }
    }
    return next(action);
  });
