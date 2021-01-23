import { IEffectsAction } from './effects.interface';

export class EffectsAction<TData = unknown> implements IEffectsAction {

  public static create<TData = unknown>(type: string, data?: TData): EffectsAction {
    return new EffectsAction(type, data);
  }

  public initialData?: unknown;
  public data?: TData;
  public error?: unknown;
  public type: string;

  constructor(type: string, data?: TData) {
    this.type = type;
    this.data = data;
  }

  public setData(data: TData): EffectsAction {
    this.data = data;
    return this;
  }

  public setError(error: unknown): EffectsAction {
    this.error = error;
    return this;
  }

  public setInitialData(initialData: unknown): EffectsAction {
    this.initialData = initialData;
    return this;
  }
}
