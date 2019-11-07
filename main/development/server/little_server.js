//Load HTTP module
const http = require("http");
const hostname = '127.0.0.1';
const port = 3000;

html = `
<!DOCTYPE html>
<meta charset="utf-8">
<head>
	<script src="../node_modules/d3/dist/d3.min.js"></script>
</head>
<body>
	<script src="../saD3.js" type="text/JavaScript"></script>
</body>
`

//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {

  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  //res.setHeader('Content-Type', 'text/plain');
  //res.render('index', { title: 'development' });
  //res.end();

  res.writeHeader(200, {"Content-Type": "text/html"});
  res.write(html);
  res.end();
});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
