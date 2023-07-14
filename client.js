const net = require('net');
const client = new net.Socket();
const port = 5001;
// const host = '127.0.0.1';
const host = '34.27.121.244'; // balancer
// const host = '34.132.145.147'; // instance

client.connect(port, host, function() {
  console.log('Connected');
  client.write("Hello From Client " + client.address().address);
});