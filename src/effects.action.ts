import { IEffectsAction } from './effects.interface';

export class EffectsAction implements IEffectsAction {

  public static create(type: string, data?: any): EffectsAction {
    return new EffectsAction(type, data);
  }

  public initialData?: any;
  public data?: any;
  public error?: any;
  public type: string;

  constructor(type: string, data?: any) {
    this.type = type;
    this.data = data;
  }

  public setData(data: any): EffectsAction {
    this.data = data;
    return this;
  }

  public setError(error: any): EffectsAction {
    this.error = error;
    return this;
  }

  public setInitialData(initialData: any): EffectsAction {
    this.initialData = initialData;
    return this;
  }
}
