/**
 * @stable [10.01.2020]
 * @param value
 * @returns {boolean}
 */
export const isFn = (value: any): boolean => typeof value === 'function';

/**
 * @stable [10.01.2020]
 * @param {AnyT} value
 * @returns {boolean}
 */
export const isUndef = (value: any): boolean => typeof value === 'undefined';

/**
 * @stable [10.01.2020]
 * @param value
 * @returns {boolean}
 */
export const isNil = (value: any): boolean => value === null;

/**
 * @stable [10.01.2020]
 * @param value
 * @returns {boolean}
 */
export const isDefined = (value: any): boolean => !isNil(value) && !isUndef(value);

/**
 * @stable [10.01.2020]
 * @param value
 * @returns {boolean}
 */
export const isPromiseLike = (value: any): boolean =>
  value instanceof Promise || (
    isDefined(value) && isFn(value.then) && isFn(value.catch)
  );
