import React from 'react';
import styles from './CorsDemo.module.css';

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

export function CorsDemo() {
  const urlRef = React.createRef<HTMLInputElement>();
  const bodyRef = React.createRef<HTMLInputElement>();
  const [options, setOptions] = React.useState<CorsRequestOptions>();
  const [data, setData] = React.useState<string>('');

  const updateOptions = (method: 'GET' | 'POST') => {
    setOptions({
      url: urlRef.current?.value || '',
      body: bodyRef.current?.value || '',
      method,
    });
  };

  React.useEffect(() => {
    if (options) {
      setData('');
      doCORSRequest(options).then(setData);
    }
  }, [options]);

  return (
    <div className={styles.container}>
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
      <div className={styles.buttonsRow}>
        <button id="get" onClick={() => updateOptions('GET')}>
          GET
        </button>
        <button id="post" onClick={() => updateOptions('POST')}>
          POST
        </button>
      </div>
      <div className={styles.result}>{data ? <pre>{data}</pre> : <p>Loading...</p>}</div>
    </div>
  );
}
