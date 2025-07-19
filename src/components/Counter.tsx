import { Button } from "@pathscale/ui";
import { type Component, createSignal } from "solid-js";

export const Counter: Component = () => {
  const [count, setCount] = createSignal(0);
  return <Button onClick={() => setCount(count() + 1)}>Count: {count()}</Button>;
};

export default Counter;
