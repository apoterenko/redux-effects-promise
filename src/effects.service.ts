import { Store } from 'redux';
import { Container } from 'inversify';
import { ILogger, LoggerFactory } from 'ts-smart-logger';

import { IEffectsAction } from './effects.interface';

export class EffectsService {

  public static effects(actionType?: string, protect = false): (...args) => void {
    const this0 = this;
    return (target: { new(...args): void }, propertyKey: string): void => {
      if (!actionType) {
        return;
      }
      if (protect) {
        EffectsService.protectedSections.add(actionType);
      }
      if (this.fromEffectsMap(actionType)) {
        if (EffectsService.protectedSections.has(actionType)) {
          EffectsService.logger.warn(`[$EffectsService] An effect does already exist and it is protected for the action type ${actionType}.`);
          return;
        }
        EffectsService.logger.warn(`[$EffectsService] An effect does already exist for the action type ${actionType}. Will be overridden.`);
      }
      this.effectsMap.set(
        actionType,
        function(): IEffectsAction | IEffectsAction[] | Promise<IEffectsAction | IEffectsAction[]> {
          const proxyObject = this0.container.get(target.constructor);
          const effectsFn: (...args) => {} = Reflect.get(proxyObject, propertyKey);

          try {
            return effectsFn.apply(
              proxyObject,
              Array.from(arguments).concat(this0.store.getState())
            );
          } catch (e) {
            EffectsService.logger.debug(`[$EffectsService] The error:`, e);
            return {type: '$$-REP-unhandled.error', error: e};
          }
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
  private static protectedSections = new Set<string>();
}
