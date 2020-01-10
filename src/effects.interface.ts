import { Action } from 'redux';

export interface IEffectsAction extends Action {
  data?: any;
  error?: any;
  initialData?: any;
}
