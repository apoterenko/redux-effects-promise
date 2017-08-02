# redux-effects-promise

An implementation of promises effects for redux.

## Installation

```sh
npm install redux-effects-promise --save
```

## Dependencies

* [inversify](https://www.npmjs.com/package/inversify)
* [redux](https://github.com/reactjs/redux)

## Usage

```typescript
import { AnyAction } from 'redux';
import { EffectsAction, EffectsService } from 'redux-effects-promise';

import { IAppState } from '../../redux/store.interface';
import { provide } from '../../di/di.service';
import { BaseEffects } from '../../redux/base.effects';

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
	next3(action: AnyAction): number {
		return 100;
	}
}
```

## License

Licensed under MIT.