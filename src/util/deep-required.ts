/**
 * like Required<T> but for the entire node hierarchy in the Type
 */
export type DeepRequired<Type> = {
  [Key in keyof Type]-?: Required<DeepRequired<Type[Key]>>;
};
