import { createCorsServer } from './corsServer/createCorsServer';

const port = 5678;
const host = '127.0.0.1';

// A completely unnecessary server for trying out requests in the browser...
createCorsServer().listen(port, host, function () {
  console.log(`Running CORS Anywhere on http://${host}:${port}`);
});
