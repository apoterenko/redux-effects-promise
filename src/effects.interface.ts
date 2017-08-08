import { Action } from 'redux';

export interface IEffectsAction extends Action {
	initialData?: any;
	data?: any;
	error?: any;
}
