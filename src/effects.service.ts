import { Store } from 'redux';
import { Container } from 'inversify';
import {
  ILogger,
  LoggerFactory,
} from 'ts-smart-logger';

import { IEffectsAction } from './effects.interface';

export class EffectsService {

  /**
   * @stable [15.03.2020]
   * @param {string} actionType
   * @param {boolean} override
   * @returns {(...args) => void}
   */
  public static effects(actionType: string, override = false): (...args) => void {
    return (target: { new(...args): void }, propertyKey: string): void => {
      if (this.effectsMap.has(actionType)) {
        if (override) {
          this.logger.debug(`[$EffectsService] An effect does already exist for the action type ${actionType}. Will be overridden..`);
        } else {
          this.logger.warn(`[$EffectsService] An effect does already exist for the action type ${actionType}. Exit...`);
          return;
        }
      }
      this.addEffect(actionType, propertyKey, target);
    };
  }

  /**
   * @stable [10.01.2020]
   * @param {string} type
   * @returns {(...args) => {}}
   */
  public static fromEffectsMap(type: string): (...args) => {} {
    return this.effectsMap.get(type);
  }

  /**
   * @stable [10.01.2020]
   * @param {Container} $IoCContainer
   * @param {Store<{}>} store
   */
  public static configure($IoCContainer: Container, store: Store<{}>): void {
    this.$IoCContainer = $IoCContainer;
    this.store = store;
  }

  private static $IoCContainer: Container;
  private static readonly effectsMap = new Map<string, (...args) => {}>();
  private static readonly ERROR_ACTION_TYPE = '$$-REP-unhandled.error';
  private static readonly logger = LoggerFactory.makeLogger(EffectsService);
  private static store: Store<{}>;

  /**
   * @stable [10.01.2020]
   * @param {string} actionType
   * @param {string} propertyKey
   * @param {{new(...args): void}} target
   */
  private static addEffect(actionType: string, propertyKey: string, target: { new(...args): void }): void {
    this.effectsMap.set(
      actionType,
      function(): IEffectsAction | IEffectsAction[] | Promise<IEffectsAction | IEffectsAction[]> {
        const proxyObject = EffectsService.$IoCContainer.get(target.constructor);
        const effectsFn = Reflect.get(proxyObject, propertyKey) as (...args) => {};
        const currentState = EffectsService.store.getState();
        const args = [...Array.from(arguments), currentState];

        try {
          return effectsFn.apply(proxyObject, args);
        } catch (error) {
          EffectsService.logger.error('[$EffectsService] The error:', error);
          return {type: EffectsService.ERROR_ACTION_TYPE, error};
        }
      }
    );
  }
}
