import { baseUrl } from '../common/pageUrls.js';

export function Head() {
  return (
    <>
      <meta charSet="UTF-8" />
      <link rel="icon" type="image/png" href={baseUrl + 'favicon-96x96.png'} sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href={baseUrl + 'favicon.svg'} />
      <link rel="shortcut icon" href={baseUrl + 'favicon.ico'} />
      <link rel="apple-touch-icon" sizes="180x180" href={baseUrl + 'apple-touch-icon.png'} />
      <link rel="manifest" href={baseUrl + 'site.webmanifest'} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400..700;1,14..32,400..700&display=swap"
        rel="stylesheet"
      />
    </>
  );
}
