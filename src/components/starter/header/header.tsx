import { component$ } from '@builder.io/qwik';
import styles from './header.module.css';

export default component$(() => {
  return (
    <header class={styles.header}>
      <div class={['container', styles.wrapper]}>
        <div class={styles.logo}>logo</div>
        <ul>
          <li>
            <a href="link" target="_blank">
              Link
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
});
