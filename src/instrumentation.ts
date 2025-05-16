export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../instrumentation-server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../instrumentation-edge.config');
  }
}
