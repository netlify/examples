import { component$, useSignal, $ } from '@builder.io/qwik';

const CounterExample = component$(() => {
  const counter = useSignal<number>(0);

  const handleUpdate = $(() => {
    counter.value++;
  });

  return (
    <>
      <p>{counter.value}</p>
      <button onClick$={handleUpdate}>update counter</button>
    </>
  );
});

export default CounterExample;
