/**
 * @name VainillaNodeAPI
 * @author Juan Castillo <Juanpablodlcc@gmail.com>
 */

//Dependecies
const http = require('http');
const url = require('url')
const { StringDecoder } = require('string_decoder');

const server = http.createServer((req, res) => {

    // GET url and parse it
    const parsedUrl = url.parse(req.url, true);

    // GET the path
    const path = parsedUrl.pathname || "/";
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')

    // GET query string as JSON
    const queryStringObject = parsedUrl.query;

    // GET HTTP method
    const method = req.method.toLowerCase();

    // GET headers as JSON
    const headers = req.headers;

    // GET payload
    const decoder = new StringDecoder('utf-8');
    const buffer = [];

    req.on('data', (data) => {
        const decoded = decoder.write(data)
        buffer.push(decoded)
    });

    req.on('end', () => {
        decoder.end()
        const payload = buffer.pop() || ""

        const handler = router[trimmedPath] || handlers.notFound
        
        const data = {
            method,
            headers,
            payload,
            trimmedPath,
            queryStringObject
        }

        handler(data, (statusCode = 200, payload = {}) => {

            const isObject = typeof (payload) === "object"
            const payloadString = isObject ? JSON.stringify(payload) : payload
            
            res.setHeader("Content-Type", "application/json")
            res.writeHead(statusCode)
            res.end(payloadString)
        })


        // Log the requests
        payload.length && console.log("payload", payload)
    });
});

server.listen(3000, () => {
    console.log("the server is online at 3000")
});

//Handlers
const handlers = {}

handlers.sample = (data, callback) => {

    callback(406, { name: "sample handler" })
}

handlers.notFound = (data, callback) => {
    callback(404)
}

//Router
const router = {
    "sample": handlers.sample
}