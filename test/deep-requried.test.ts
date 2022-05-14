import { DeepRequired } from "../src";

type HelloType = DeepRequired<{
  name?: string;
}>;

test("deep-required", () => {
  const hello: HelloType = { name: "world" };
  expect(hello).toEqual({ name: "world" });
});
