import { DeepRequired } from "../src";

/**
 * just testing
 */
type HelloType = DeepRequired<{
  name?: string;
}>;

test("deep-required", () => {
  const hello: HelloType = { name: "world" };
  expect(hello).toEqual({ name: "world" });
});
