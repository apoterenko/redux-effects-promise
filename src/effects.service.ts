import { Store } from 'redux';
import { Container } from 'inversify';

export class EffectsService {

	private static container: Container;
	private static store: Store<any>;
	private static effectsMap = new Map<string, Function>();

	static effects(value: string): Function {
		const this0 = this;
		return (target: any, propertyKey: string): void => {
			this.effectsMap.set(
				value,
				function (): any {
					const proxyObject = this0.container.get(target.constructor);
					const effectsFn: Function = Reflect.get(proxyObject, propertyKey);
					return effectsFn.apply(
						proxyObject,
						Array.from(arguments).concat(this0.store.getState())
					);
				}
			);
		};
	}

	static fromEffectsMap(type: string): Function {
		return this.effectsMap.get(type);
	}

	static configure(container: Container, store: Store<any>): void {
		this.container = container;
		this.store = store;
	}
}
