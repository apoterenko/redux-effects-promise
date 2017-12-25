import { Store } from 'redux';
import { Container } from 'inversify';
import { ILogger, LoggerFactory } from 'ts-smart-logger';

export class EffectsService {

  public static effects(actionType?: string): (...args) => void {
    const this0 = this;
    return (target: any, propertyKey: string): void => {
      if (!actionType) {
        return;
      }
      if (this.fromEffectsMap(actionType)) {
        EffectsService.logger.warn(`[$EffectsService] An effect already exists for the action type ${actionType}. Will be overridden.`);
      }
      this.effectsMap.set(
          actionType,
          function(): any {
            const proxyObject = this0.container.get(target.constructor);
            const effectsFn: (...args) => {} = Reflect.get(proxyObject, propertyKey);
            EffectsService.logger.debug(
                `[$EffectsService] The effects callback "${propertyKey}" for the action "${actionType}" is called`
            );

            return effectsFn.apply(
                proxyObject,
                Array.from(arguments).concat(this0.store.getState())
            );
          }
      );
    };
  }

  public static fromEffectsMap(type: string): (...args) => {} {
    return this.effectsMap.get(type);
  }

  public static configure(container: Container, store: Store<any>): void {
    this.container = container;
    this.store = store;
  }

  private static logger: ILogger = LoggerFactory.makeLogger(EffectsService);
  private static container: Container;
  private static store: Store<any>;
  private static effectsMap = new Map<string, (...args) => {}>();
}
