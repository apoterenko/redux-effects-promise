import { Store } from 'redux';
import { Container } from 'inversify';

export class EffectsService {

  public static effects(actionType: string): (...arfs) => void {
    const this0 = this;
    return (target: any, propertyKey: string): void => {
      if (this.fromEffectsMap(actionType)) {
        throw new Error(`There is already exist an effect for the action type ${actionType}`);
      }
      this.effectsMap.set(
          actionType,
          function(): any {
            const proxyObject = this0.container.get(target.constructor);
            const effectsFn: (...arfs) => {} = Reflect.get(proxyObject, propertyKey);
            return effectsFn.apply(
                proxyObject,
                Array.from(arguments).concat(this0.store.getState())
            );
          }
      );
    };
  }

  public static fromEffectsMap(type: string): (...arfs) => {} {
    return this.effectsMap.get(type);
  }

  public static configure(container: Container, store: Store<any>): void {
    this.container = container;
    this.store = store;
  }

  private static container: Container;
  private static store: Store<any>;
  private static effectsMap = new Map<string, (...arfs) => {}>();
}
