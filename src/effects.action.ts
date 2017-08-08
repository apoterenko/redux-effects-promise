import { IEffectsAction } from './effects.interface';

export class EffectsAction implements IEffectsAction {

	initialData?: any;
	data?: any;
	error?: any;

	constructor(public type: string) {
	}

	static create(type: string): EffectsAction {
		return new EffectsAction(type);
	}

	setData(data: any): EffectsAction {
		this.data = data;
		return this;
	}

	setError(error: any): EffectsAction {
		this.error = error;
		return this;
	}

	setInitialData(initialData: any): EffectsAction {
		this.initialData = initialData;
		return this;
	}
}
