import { $, Resource, component$, useResource$, useSignal } from '@builder.io/qwik';
import styles from './cors-demo.module.css';

type CorsRequestOptions = { url: string; body: string; method: 'GET' | 'POST' };

const apiUrl = 'http://127.0.0.1:5678/';

async function doCORSRequest(options: CorsRequestOptions): Promise<string> {
  const { url, body, method } = options;
  if (!url) {
    return 'URL is required.';
  }

  try {
    const requestOptions: RequestInit = { method };
    if (body && method === 'GET') {
      requestOptions.body = body;
      requestOptions.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    }
    const res = await fetch(apiUrl + options.url, requestOptions);
    let text: string;
    if (res.headers.get('content-type')?.includes('application/json')) {
      text = JSON.stringify(await res.json(), null, 2);
    } else {
      text = await res.text();
    }
    return `${options.method} ${options.url}\n${res.status} ${res.statusText}\n\n${text}`;
  } catch (e) {
    return (e as Error).message || String(e);
  }
}

export default component$(() => {
  const urlRef = useSignal<HTMLInputElement>();
  const bodyRef = useSignal<HTMLInputElement>();
  const options = useSignal<CorsRequestOptions>();

  const updateOptions = $((method: 'GET' | 'POST') => {
    options.value = {
      url: urlRef.value?.value || '',
      body: bodyRef.value?.value || '',
      method,
    };
  });

  const data = useResource$<string | undefined>(({ track }) => {
    // this runs both on mount (server), and whenever options change (client)
    track(() => options.value);
    return options.value ? doCORSRequest(options.value) : undefined;
  });

  return (
    <div class={styles.container}>
      <label>
        URL to be fetched (example: <code>http://robwu.nl/dump.php</code>)
        <br />
        <input type="url" id="url" ref={urlRef} />
      </label>
      <label>
        If using POST, enter the data:
        <br />
        <input type="text" id="data" ref={bodyRef} />
      </label>
      <div class={styles.buttonsRow}>
        <button id="get" onClick$={() => updateOptions('GET')}>
          GET
        </button>
        <button id="post" onClick$={() => updateOptions('POST')}>
          POST
        </button>
      </div>
      <div class={styles.result}>
        <Resource
          value={data}
          onPending={() => <p>Loading...</p>}
          onResolved={(data) => <pre>{data}</pre>}
        />
      </div>
    </div>
  );
});
