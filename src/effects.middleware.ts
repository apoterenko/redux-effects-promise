import { AnyAction } from 'redux';

import { EffectsService } from './effects.service';
import { EffectsAction } from './effects.action';

export const effectsMiddleware = ({dispatch}) => (
	(next: Function) => (action: AnyAction) => {
		const proxyFn = EffectsService.fromEffectsMap(action.type);

		if (proxyFn) {
			const proxyFnResult = proxyFn(action);
			if (proxyFnResult instanceof Promise) {
				const initialData = action.data;
				return next({
					type: action.type,
					data: action.data,
					promise: proxyFnResult.then(
						result => {
							if (Array.isArray(result)) {
								const thisIsNotArrayOfActionEffects =
									!!(result as Array<any>).find(item => (!(item instanceof EffectsAction)));

								if (!thisIsNotArrayOfActionEffects) {
									[].concat(result).forEach(resultAction => dispatch({
										type: resultAction.type,
										data: resultAction.data,
										initialData: initialData
									}));
									return;
								}
							} else if (result instanceof EffectsAction) {
								const resultAction = result;
								dispatch({
									type: resultAction.type,
									data: resultAction.data,
									initialData: initialData
								});
								return;
							}

							// Default behaviour
							dispatch({
								type: `${action.type}.done`,
								data: result,
								initialData: initialData
							});
						}
					)
				});
			} else if (proxyFnResult) {
				const result = next(action);
				[].concat(proxyFnResult).forEach(action => dispatch({ type: action.type, data: action.data }));
				return result;
			}
		}
		return next(action);
	});
