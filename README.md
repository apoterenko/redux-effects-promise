# redux-effects-promise

An implementation of declarative promises effects for redux. The solution is based on **inversify** library.

## Installation

```sh
npm install redux-effects-promise --save
```

## Dependencies

* [inversify](https://www.npmjs.com/package/inversify)
* [redux](https://www.npmjs.com/package/redux)
* [core-js](https://www.npmjs.com/package/core-js)

## Usage

```typescript
import 'reflect-metadata';
import { createStore } from 'redux';
import { Container } from 'inversify';
import { EffectsService, effectsMiddleware } from 'redux-effects-promise';

export const middlewares = [..., effectsMiddleware];
EffectsService.configure(new Container(), createStore(...));
```

```typescript
import { EffectsService } from 'redux-effects-promise';
...
@provide(DashboardListEffects)
export class DashboardListEffects {
	...
	@EffectsService.effects('dashboard.list.load')
	loadProducts(): Promise<IProduct[]> {
		return this.api.loadProducts();
	}

    // Or ...
    // @EffectsService.effects('dashboard.list.load')
    // loadProducts(): IProduct[] {
    //    return [{ name: 'Product1', id: 1901 }, { name: 'Product2', id: 1902 }];
    // }
}
```

```typescript
import { AnyAction } from 'redux';
import { EffectsAction, EffectsService } from 'redux-effects-promise';
...
@provide(DashboardFormEffects)
export class DashboardFormEffects {
    ...
	@EffectsService.effects('dashboard.form.submit')
	saveProduct(action: AnyAction, state: IAppState): Promise<EffectsAction[]> {
		return this.api.saveProduct(action.data)
			.then(result => {
				return [
					EffectsAction.create('dashboard.form.submit.done', result),
					EffectsAction.create('dashboard.list.update', action.data),
					EffectsAction.create('dashboard.back', action.data)  // Parameter1=action.data
				];
			});
	}

	@EffectsService.effects('dashboard.back')
	back(): EffectsAction[] {
		// A inheriting of the parameters works finely so input parameter
		// "Parameter1" would pass within an action = { type: ..., data: ..., initialData: Parameter1 }
		return [
			EffectsAction.create('dashboard.list.deselect'),
			EffectsAction.create('router.navigate', '/dashboard')
		];
	}
}
```

## Preview

![00](preview/00.png)

## License

Licensed under MIT.