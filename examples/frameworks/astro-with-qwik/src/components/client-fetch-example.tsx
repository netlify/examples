import { component$, useVisibleTask$, useStore } from '@builder.io/qwik';

const ClientFetchExample = component$(() => {
  const store = useStore<{
    full_name: string;
    title: string;
    html_url: string;
  }>({
    full_name: null,
    title: null,
    html_url: null,
  });

  useVisibleTask$(async () => {
    try {
      const response = await fetch('https://api.github.com/repos/BuilderIO/qwik/pulls/1', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error();
      }

      const json = await response.json();

      const {
        html_url,
        title,
        head: {
          repo: { full_name },
        },
      } = json;
      store.html_url = html_url;
      store.title = title;
      store.full_name = full_name;
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div>
      {store.html_url ? (
        <div>
          <h2>{store.full_name}</h2>
          <p>{store.full_name}</p>
          <a href={store.html_url}>{store.html_url}</a>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
});

export default ClientFetchExample;
