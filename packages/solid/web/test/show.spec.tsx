/**
 * @jsxImportSource solid-js
 * @vitest-environment jsdom
 */
import { describe, expect, test } from "vitest";
import { createRoot, createSignal } from "../../src/index.js";
import { Show } from "../src/index.js";

describe("Testing an only child show control flow", () => {
  let div!: HTMLDivElement, disposer: () => void;
  const [count, setCount] = createSignal(0);
  const Component = () => (
    <div ref={div}>
      <Show when={count() >= 5}>{count()}</Show>
    </div>
  );

  test("Create show control flow", () => {
    createRoot(dispose => {
      disposer = dispose;
      <Component />;
    });

    expect(div.innerHTML).toBe("");
  });

  test("Toggle show control flow", () => {
    setCount(7);
    expect(div.innerHTML).toBe("7");
    setCount(5);
    expect(div.innerHTML).toBe("5");
    setCount(2);
    expect(div.innerHTML).toBe("");
  });

  test("dispose", () => disposer());
});

describe("Testing an only child show control flow with DOM children", () => {
  let div!: HTMLDivElement, disposer: () => void;
  const [count, setCount] = createSignal(0);
  const Component = () => (
    <div ref={div}>
      <Show when={count() >= 5}>
        <span>{count()}</span>
        <span>counted</span>
      </Show>
    </div>
  );

  test("Create show control flow", () => {
    createRoot(dispose => {
      disposer = dispose;
      <Component />;
    });

    expect(div.innerHTML).toBe("");
  });

  test("Toggle show control flow", () => {
    setCount(7);
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("7");
    setCount(5);
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("5");
    setCount(2);
    expect(div.innerHTML).toBe("");
  });

  test("dispose", () => disposer());
});

describe("Testing nonkeyed show control flow", () => {
  let div!: HTMLDivElement, disposer: () => void;
  const [count, setCount] = createSignal(0);
  let whenExecuted = 0;
  let childrenExecuted = 0;
  function when() {
    whenExecuted++;
    return count();
  }
  const Component = () => (
    <div ref={div}>
      <Show when={when()}>
        <span>{count()}</span>
        <span>{childrenExecuted++}</span>
      </Show>
    </div>
  );

  test("Create show control flow", () => {
    createRoot(dispose => {
      disposer = dispose;
      <Component />;
    });

    expect(div.innerHTML).toBe("");
    expect(whenExecuted).toBe(1);
    expect(childrenExecuted).toBe(0);
  });

  test("Toggle show control flow", () => {
    setCount(7);
    expect(whenExecuted).toBe(2);
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("7");
    expect(childrenExecuted).toBe(1);
    setCount(5);
    expect(whenExecuted).toBe(3);
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("5");
    expect(childrenExecuted).toBe(1);
    setCount(5);
    expect(whenExecuted).toBe(3);
    setCount(0);
    expect(whenExecuted).toBe(4);
    expect(div.innerHTML).toBe("");
    expect(childrenExecuted).toBe(1);
    setCount(5);
    expect(whenExecuted).toBe(5);
  });

  test("dispose", () => disposer());
});

describe("Testing keyed show control flow", () => {
  let div!: HTMLDivElement, disposer: () => void;
  const [count, setCount] = createSignal(0);
  let whenExecuted = 0;
  let childrenExecuted = 0;
  function when() {
    whenExecuted++;
    return count();
  }
  const Component = () => (
    <div ref={div}>
      <Show when={when()} keyed>
        <span>{count()}</span>
        <span>{childrenExecuted++}</span>
      </Show>
    </div>
  );

  test("Create show control flow", () => {
    createRoot(dispose => {
      disposer = dispose;
      <Component />;
    });

    expect(div.innerHTML).toBe("");
    expect(whenExecuted).toBe(1);
    expect(childrenExecuted).toBe(0);
  });

  test("Toggle show control flow", () => {
    setCount(7);
    expect(whenExecuted).toBe(2);
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("7");
    expect(childrenExecuted).toBe(1);
    setCount(5);
    expect(whenExecuted).toBe(3);
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("5");
    expect(childrenExecuted).toBe(2);
    setCount(5);
    expect(whenExecuted).toBe(3);
    setCount(0);
    expect(whenExecuted).toBe(4);
    expect(div.innerHTML).toBe("");
    expect(childrenExecuted).toBe(2);
    setCount(5);
    expect(whenExecuted).toBe(5);
  });

  test("dispose", () => disposer());
});

describe("Testing nonkeyed function show control flow", () => {
  let div!: HTMLDivElement, disposer: () => void;
  const [count, setCount] = createSignal(0);
  let whenExecuted = 0;
  let childrenExecuted = 0;
  function when() {
    whenExecuted++;
    return count();
  }
  const Component = () => (
    <div ref={div}>
      <Show when={when()}>
        {count => (
          <>
            <span>{count()}</span>
            <span>{childrenExecuted++}</span>
          </>
        )}
      </Show>
    </div>
  );

  test("Create show control flow", () => {
    createRoot(dispose => {
      disposer = dispose;
      <Component />;
    });

    expect(div.innerHTML).toBe("");
    expect(whenExecuted).toBe(1);
    expect(childrenExecuted).toBe(0);
  });

  test("Toggle show control flow", () => {
    setCount(7);
    expect(whenExecuted).toBe(2);
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("7");
    expect(childrenExecuted).toBe(1);
    setCount(5);
    expect(whenExecuted).toBe(3);
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("5");
    expect(childrenExecuted).toBe(1);
    setCount(5);
    expect(whenExecuted).toBe(3);
    setCount(0);
    expect(whenExecuted).toBe(4);
    expect(div.innerHTML).toBe("");
    expect(childrenExecuted).toBe(1);
    setCount(5);
    expect(whenExecuted).toBe(5);
  });

  test("dispose", () => disposer());
});

describe("Testing keyed function show control flow", () => {
  let div!: HTMLDivElement, disposer: () => void;
  const [count, setCount] = createSignal(0);
  let executed = 0;
  const Component = () => (
    <div ref={div}>
      <Show when={count()} keyed>
        {count => (
          <>
            <span>{count}</span>
            <span>{executed++}</span>
          </>
        )}
      </Show>
    </div>
  );

  test("Create show control flow", () => {
    createRoot(dispose => {
      disposer = dispose;
      <Component />;
    });

    expect(div.innerHTML).toBe("");
    expect(executed).toBe(0);
  });

  test("Toggle show control flow", () => {
    setCount(7);
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("7");
    expect(executed).toBe(1);
    setCount(5);
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("5");
    expect(executed).toBe(2);
    setCount(0);
    expect(div.innerHTML).toBe("");
    expect(executed).toBe(2);
  });

  test("dispose", () => disposer());
});

describe("Testing an only child show control flow with keyed function", () => {
  let div!: HTMLDivElement, disposer: () => void;
  const [data, setData] = createSignal<{ count: number }>();
  const Component = () => (
    <div ref={div}>
      <Show when={data()} keyed>
        {({ count }) => (
          <>
            <span>{count}</span>
            <span>counted</span>
          </>
        )}
      </Show>
    </div>
  );

  test("Create show control flow", () => {
    createRoot(dispose => {
      disposer = dispose;
      <Component />;
    });

    expect(div.innerHTML).toBe("");
  });

  test("Toggle show control flow", () => {
    setData({ count: 7 });
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("7");
    setData({ count: 5 });
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("5");
    setData({ count: 2 });
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("2");
  });

  test("dispose", () => disposer());
});

describe("Testing an only child show control flow with non-keyed function", () => {
  let div!: HTMLDivElement, disposer: () => void;
  const [data, setData] = createSignal<{ count: number }>();
  const Component = () => (
    <div ref={div}>
      <Show when={data()}>
        {data => (
          <>
            <span>{data().count}</span>
            <span>counted</span>
          </>
        )}
      </Show>
    </div>
  );

  test("Create show control flow", () => {
    createRoot(dispose => {
      disposer = dispose;
      <Component />;
    });

    expect(div.innerHTML).toBe("");
  });

  test("Toggle show control flow", () => {
    setData({ count: 7 });
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("7");
    setData({ count: 5 });
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("5");
    setData({ count: 2 });
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("2");
  });

  test("dispose", () => disposer());
});

describe("Testing an only child show control flow with DOM children and fallback", () => {
  let div!: HTMLDivElement, disposer: () => void;
  const [count, setCount] = createSignal(0);
  const Component = () => (
    <div ref={div}>
      <Show when={count() >= 5} fallback={<span>Too Low</span>}>
        <span>{count()}</span>
      </Show>
    </div>
  );

  test("Create when control flow", () => {
    createRoot(dispose => {
      disposer = dispose;
      <Component />;
    });

    expect(div.innerHTML).toBe("<span>Too Low</span>");
  });

  test("Toggle show control flow", () => {
    setCount(7);
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("7");
    setCount(5);
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("5");
    setCount(2);
    expect((div.firstChild as HTMLSpanElement).innerHTML).toBe("Too Low");
  });

  test("dispose", () => disposer());
});
