// Used to generate static pages for each URL (required by github pages)
export function onBeforePrerenderStart() {
  return ['/men/2024', '/women/2024'];
}
