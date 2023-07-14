const http = require('http');
const url = require('url');
global.PORT = 8080;

function getData(req) {
  return new Promise((resolve, reject) => {
    const queryObject = url.parse(req.url, true).query;
    let body = '';
    function res() {
      resolve(Object.assign({}, JSON.parse(body||"{}"), queryObject));
    };
    if (req.method == 'POST') {

      req.on('data', function (data) {
        body += data;
        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) req.connection.destroy();
      });

      req.on('end', () => res());
    } else {
      res();
    };
  });
};


http.globalAgent.maxSockets = Infinity;

http
.createServer(async (req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
  };
  let data = await getData(req);
  data.url = req.url;
  let response = JSON.stringify(data);
  data.format = 'json';
  const pre = data.format === 'json' ? 'application/' : 'text/';
  headers['Content-Type'] = pre+data.format.toLowerCase()
  res.writeHead(200, headers);
  try {
    res.end(response);
  } catch (e) {
    res.end('Error');
  };

})
.listen(global.PORT);

console.log(`app listening on port ${global.PORT}`)
if (global.DEV) console.log('Running in DEV mode')
