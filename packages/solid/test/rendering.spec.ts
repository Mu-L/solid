import { describe, expect, test } from "vitest";
import { createResource } from "../src/index.js";
import { mergeProps } from "../src/server/rendering.js";
import { resolveSSRNode } from "dom-expressions/src/server.js";

describe("resolveSSRNode", () => {
  test("should resolve a string node", () => {
    expect(resolveSSRNode("Hello World")).toBe("Hello World");
  });

  test("should resolve a null or boolean node", () => {
    expect(resolveSSRNode(null)).toBe("");
    expect(resolveSSRNode(false)).toBe("");
  });

  test("should resolve an array of nodes", () => {
    const nodes = ["<div>", "<span>", "</span>", "</div>"];
    expect(resolveSSRNode(nodes)).toBe("<div><!--!$--><span><!--!$--></span><!--!$--></div>");
  });

  test("should resolve an object with 't' property", () => {
    const node = { t: "<div>Text</div>" };
    expect(resolveSSRNode(node)).toBe("<div>Text</div>");
  });

  test("should resolve a function node", () => {
    const fn = () => "dynamic content";
    expect(resolveSSRNode(fn)).toBe("dynamic content");
  });
});

describe("createResource", () => {
  test("should return initial value immediately if provided", () => {
    const [data] = createResource(() => Promise.resolve("test"), { initialValue: "loading" });
    expect(data()).toBe("loading");
  });

  test("should handle a promise and update the value", async () => {
    const [data, { refetch }] = createResource(
      () => new Promise(resolve => setTimeout(() => resolve("Success!"), 10))
    );

    // Initially, data should be undefined, and loading should be true
    expect(data()).toBeUndefined();
    expect(data.loading).toBe(true);

    await new Promise(r => setTimeout(r, 20)); // Wait for the promise to resolve

    // After resolution, data should have the new value, and loading should be false
    expect(data()).toBe("Success!");
    expect(data.loading).toBe(false);
  });
});
describe("server mergeProps", () => {
  test("preserves properties that shadow Object.prototype methods (toString, valueOf)", () => {
    expect(mergeProps({ toString: 1 }).toString).toBe(1);
    expect(mergeProps({ valueOf: 42 }).valueOf).toBe(42);
    expect(mergeProps({ hasOwnProperty: true }).hasOwnProperty).toBe(true);
  });

  test("last source wins for Object.prototype-shadowing keys", () => {
    expect(mergeProps({ toString: 1 }, { toString: 2 }).toString).toBe(2);
    expect(mergeProps({ toString: 2 }, { toString: undefined }).toString).toBe(2);
  });

  test("still skips __proto__ and constructor to match client behaviour", () => {
    const evil = JSON.parse('{"__proto__":{"evil":true}}');
    mergeProps(evil);
    expect(({} as any).evil).toBeUndefined();

    const withCtor = mergeProps({ constructor: "custom" });
    expect(withCtor.constructor).toBe(Object);
  });

  test("deduplication still works: first source wins when key already added", () => {
    const props = mergeProps({ a: 1 }, { a: 2, b: 3 });
    expect(props.a).toBe(2);
    expect(props.b).toBe(3);
  });
});
