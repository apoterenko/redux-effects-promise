# redux-effects-promise

An implementation of declarative promises effects for redux. The solution is based on **inversify** library.

## Installation

```sh
npm install redux-effects-promise --save
```

## Dependencies

* [inversify](https://www.npmjs.com/package/inversify)
* [redux](https://github.com/reactjs/redux)

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
import { AnyAction } from 'redux';
import { EffectsAction, EffectsService } from 'redux-effects-promise';
...
@provide(DashboardFormEffects)
export class DashboardFormEffects extends BaseEffects {

	@EffectsService.effects('dashboard.form.submit')
	saveProduct(action: AnyAction, state: IAppState): Promise<EffectsAction[]> {
		return this.api.saveProduct(action.data)
			.then(result => {
				return [
					EffectsAction.create('dashboard.form.submit.done', result),
					EffectsAction.create('dashboard.list.update', action.data),
					EffectsAction.create('dashboard.list.deselect'),
					EffectsAction.create('dashboard.next1')
				];
			});
	}

	@EffectsService.effects('dashboard.next1')
	next1(action: AnyAction): Promise<EffectsAction> {
		return Promise.resolve(
			EffectsAction.create('dashboard.next2')
		);
	}

	@EffectsService.effects('dashboard.next2')
	next2(action: AnyAction): EffectsAction {
		return EffectsAction.create('dashboard.next3');
	}

	@EffectsService.effects('dashboard.next3')
	next3(action: AnyAction): EffectsAction[] {
		return [
			EffectsAction.create('router.navigate', '/dashboard'),
			EffectsAction.create('dashboard.next4')
		];
	}

	@EffectsService.effects('dashboard.next4')
	next4(): Promise<EffectsAction[]>{
		return Promise.resolve(
			[
				EffectsAction.create('dashboard.next5'),
				EffectsAction.create('dashboard.next6')
			]
		);
	}

	@EffectsService.effects('dashboard.next5')
	next5(): void {
		console.log('Nothing to do within next5');
	}

	@EffectsService.effects('dashboard.next6')
	next6(): void {
		console.log('Nothing to do within next6');
	}
}
```

```typescript
...
@provide(BaseEffects)
export class BaseEffects {
	@lazyInject(DI_TYPES.Api) protected api: IApi;
}
```

## Preview

![00](preview/00.png)

## License

Licensed under MIT.