const http = require('http');
const port = process.env.PORT || 8080;

const requestHandler = (request, response) => {
  console.log(request.url);
  response.end("Hello Kubernetes World 4!");
}

http.createServer(requestHandler).listen(port, err => {
  if (err) {
    return console.log(err);
  }

  console.log(`server is listening on ${port}`);
})
