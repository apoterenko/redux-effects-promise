import { IEffectsAction } from './effects.interface';

export class EffectsAction implements IEffectsAction {

	initialData?: any;
	data?: any;
	error?: any;
	type: string;

	constructor(type: string, data?: any) {
		this.type = type;
		this.data = data;
	}

	static create(type: string, data?: any): EffectsAction {
		return new EffectsAction(type, data);
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
