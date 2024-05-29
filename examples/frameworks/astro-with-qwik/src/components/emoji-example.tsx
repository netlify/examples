import { component$, useStore, $ } from '@builder.io/qwik';

const EmojiExample = component$(() => {
  const store = useStore<{
    astronaut: string;
    rockets: string[];
  }>({
    astronaut: '',
    rockets: [],
  });

  const handleAstronaut = $((_: Event, currentTarget: HTMLSelectElement) => {
    store.astronaut = currentTarget.value;
  });

  const handleRocket = $(() => {
    store.rockets.push('🚀');
  });

  return (
    <>
      <p>
        <span role='img' aria-label='Astronaut'>
          {store.astronaut}
        </span>
      </p>
      <label>
        astronaut:
        <select onInput$={handleAstronaut}>
          <option hidden>please select</option>
          <option value='🧑‍🚀'>🧑‍🚀 Astronaut</option>
          <option value='👨‍🚀'>👨‍🚀 Man Astronaut</option>
          <option value='👩‍🚀'>👩‍🚀 Woman Astronaut</option>
        </select>
      </label>
      <hr />

      <button onClick$={handleRocket}>add rocket</button>
      <ol>
        {store.rockets.map((data) => {
          return (
            <li>
              <span role='img' aria-label='Rocket'>
                {data}
              </span>
            </li>
          );
        })}
      </ol>
    </>
  );
});

export default EmojiExample;
