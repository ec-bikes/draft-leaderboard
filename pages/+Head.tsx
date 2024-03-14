import logoUrl from '../assets/logo.svg';

export function Head() {
  return (
    <>
      <meta charSet="UTF-8" />
      <link rel="icon" href={logoUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:slnt,wght@-1..0,300..700"
        rel="stylesheet"
      />
    </>
  );
}
