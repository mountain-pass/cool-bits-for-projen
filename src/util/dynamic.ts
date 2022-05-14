import merge from "merge";
import traverse from "traverse";
import { DeepRequired } from "./deep-required";

/**
 * Creates a union of the passed in Type and a function that returns Type.
 */
export type InnerDynamic<Type, Argument> =
  | Type
  | ((argument: Argument) => Type);

/**
 * Recursively creates a union of the passed in Type and a function that returns Type.
 */
export type Dynamic<Type, Argument> = {
  [Key in keyof Type]: InnerDynamic<Dynamic<Type[Key], Argument>, Argument>;
};

/**
 * Resolves the dynamic values in the passed in object.
 *
 * @param argument the argument to pass into the dynamic functions
 * @param dynamicValue the dynamic value to resolve
 * @param defaultValue the dynamic defaults values to merge with the resolved dynamicValue
 * @returns the resolved dynamic value
 */
export function resolve<Type, Argument>(
  argument: Argument,
  dynamicValue?: Dynamic<Type, Argument>,
  defaultValue?: Dynamic<DeepRequired<Type>, Argument>
): DeepRequired<Type> {
  if (defaultValue === undefined) {
    return dynamicValue === undefined
      ? undefined
      : traverse(traverse.clone(dynamicValue)).map(function (value) {
          if (typeof value === "function") {
            this.update(value(argument));
          }
        });
  } else {
    const resolvedValue = resolve(argument, dynamicValue);
    const resolvedDefaultValue = resolve(argument, defaultValue);
    return merge.recursive(resolvedDefaultValue, resolvedValue);
  }
}
