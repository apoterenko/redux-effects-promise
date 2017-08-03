import { Action } from 'redux';

export interface IEffectsAction extends Action {
	initialData?: any;
	data?: any;
}

export class EffectsAction implements EffectsAction {

	initialData?: any;

	constructor(public type: string,
				public data?: any) {
	}

	static create(type: string, data?: any): EffectsAction {
		return new EffectsAction(type, data);
	}
}
