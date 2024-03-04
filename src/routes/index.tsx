import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import CorsDemo from '../components/cors-demo/cors-demo';

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};

export default component$(() => {
  return (
    <div class="container">
      <CorsDemo />
    </div>
  );
});
