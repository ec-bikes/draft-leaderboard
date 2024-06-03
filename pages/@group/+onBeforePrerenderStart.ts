// Used to generate static pages for each URL (required by github pages)
export function onBeforePrerenderStart() {
  return ['/men', '/women'];
}
