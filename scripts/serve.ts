import { createCorsServer } from './cors-anywhere';
// import { createServer as createCorsServer } from 'cors-anywhere';

const port = 5678;
const host = '127.0.0.1';

// https://cors-anywhere.herokuapp.com/https://dataride.uci.ch/iframe/IndividualEventRankings/
createCorsServer({
  corsMaxAge: 1,
}).listen(port, host, function () {
  console.log(`Running CORS Anywhere on http://${host}:${port}`);
});
