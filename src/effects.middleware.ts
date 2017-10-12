import { AnyAction } from 'redux';

import { EffectsService } from './effects.service';
import { EffectsAction } from './effects.action';

const toActions = (action: AnyAction, result: any): AnyAction[] => {
  const initialData = action.data;
  let actionsForDispatch: AnyAction[];

  if (Array.isArray(result)) {
    if (result.length) {
      const thisIsArrayOfActionEffects =
          !!(result as Array<any>).find(item => item instanceof EffectsAction);

      if (thisIsArrayOfActionEffects) {
        actionsForDispatch = result.map(resultAction => ({
          ...resultAction,
          initialData: initialData
        }));
      }
    }
  } else if (result instanceof EffectsAction) {
    actionsForDispatch = [{
      ...result,
      initialData: initialData
    }];
  }
  actionsForDispatch = actionsForDispatch || [
    {
      type: `${action.type}.done`,
      data: result,
      initialData: initialData
    }
  ];
  return actionsForDispatch;
};

export const effectsMiddleware = ({dispatch}) => (
    (next: Function) => (action: AnyAction) => {
      const proxyFn = EffectsService.fromEffectsMap(action.type);
      if (proxyFn) {
        const proxyFnResult = proxyFn(action);
        const initialData = action.data;

        if (proxyFnResult instanceof Promise) {
          return next({
            type: action.type,
            data: action.data,
            promise: proxyFnResult.then(
                result => toActions(action, result).forEach((action) => dispatch(
                    {type: action.type, data: action.data, initialData: initialData}
                )),
                error => dispatch({type: `${action.type}.error`, error: error, initialData: initialData})
            )
          });
        } else if (proxyFnResult) {
          const nextActionResult = next(action);
          toActions(action, proxyFnResult).forEach((action) => dispatch(
              {type: action.type, data: action.data, initialData: initialData}
          ));
          return nextActionResult;
        }
      }
      return next(action);
    });
