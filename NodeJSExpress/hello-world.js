const http = require('http')
 
const hostname = '192.168.100.16'
 
const port = 3000;
 
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello world');
});
 
server.listen(port, hostname, () => {
    console.log(`Server running http://${hostname}:${port}/`);
});