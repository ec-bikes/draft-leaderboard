import logoUrl from '../assets/logo.svg';

export function Head() {
  return (
    <>
      <meta charSet="UTF-8" />
      <link rel="icon" href={logoUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </>
  );
}
