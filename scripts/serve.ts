import { CorsProxyServer } from './corsServer/CorsProxyServer';

const port = 5678;
const host = '127.0.0.1';

// A completely unnecessary server for trying out requests in the browser...
new CorsProxyServer()
  .listen(port, host, function () {
    console.log(`Running CORS Anywhere on http://${host}:${port}`);
  })
  .on('error', ({ err, req, res }) => {
    const message = `Unhandled server error requesting ${req.url}: ${(err as Error).stack || err}`;
    console.error(message);
    console.error('Request headers:', req.headers);
    console.error('Response headers:', res.getHeaders());
    console.error(`Response status: ${res.statusCode} ${res.statusMessage}`);

    // not sure if this is the right condition
    if (!res.writableEnded) {
      res.writeHead(500);
      res.end(message);
    }
  });
