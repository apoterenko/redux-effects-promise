export class EffectsActionBuilder {

  public static buildDoneActionType(type: string): string {
    return `${type}.done`;
  }

  public static buildErrorActionType(type: string): string {
    return `${type}.error`;
  }
}
