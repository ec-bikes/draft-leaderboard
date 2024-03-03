import { component$ } from '@builder.io/qwik';
import { useServerTimeLoader } from '../../../routes/layout';
// import styles from "./footer.module.css";

export default component$(() => {
  const serverTime = useServerTimeLoader();

  return (
    <footer>
      <div class="container">Updated at {serverTime.value.date}</div>
    </footer>
  );
});
