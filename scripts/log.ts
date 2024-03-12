const isGithub = !!process.env.CI;

export function logWarning(...args: unknown[]) {
  console.warn(isGithub ? '::warn::' : '⚠️', ...args);
}

export function logError(...args: unknown[]) {
  console.error(isGithub ? '::error::' : '❌', ...args);
}
