/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - message
 *         - date
 *       properties:
 *         message:
 *           type: string
 *           description: The message to send
 *         date:
 *           type: string
 *           description: The date in format dd.mm.yyyy hh:mm:ss
 *       example:
 *         message: "hello"
 *         date: "06.11.2023 22:10:32"
 *     Hostname:
 *       type: object
 *       required:
 *         - hostname
 *       properties:
 *         hostname:
 *           type: string
 *           description: the hostnname of the deployed app
 *       example:
 *         "hostname": "hostname.home"
 *     RequestCountByCode:
 *       type: object
 *       required:
 *         - count
 *         - maxDuration
 *         - minDuration
 *       properties:
 *         count:
 *           type: numeric
 *           description: the total request count on this instance
 *         maxDuration: 
 *           type: numeric
 *           description: the max request duration in seconds
 *         minDuration:
 *           type: numeric
 *           description: the in requets duration in seconds 
 *       example:
 *         count: 6
 *         maxDuration: 3.393417
 *         minDuration: 0.58675
 *     RequestCountByMethod:
 *       type: object
 *       required:
 *         - requestCode
 *       properties:
 *         requestCode:
 *           type: RequestCountByCode
 *           description: the HTTP code of the request
 *       example:
 *         200:
 *           count: 6
 *           maxDuration: 3.393417
 *           minDuration: 0.58675
 *     RequestStat:
 *        type: object
 *        required:
 *          - requestMethod
 *        properties:
 *          requestMethod:
 *            type: string
 *            description: the http method of the endpoint
 *        example:
 *          GET:
 *            200:
 *              count: 6
 *              maxDuration: 2 
 *              minDuration: 3
 *     StatsResponse:
 *        type: object
 *        required: 
 *          - apiPath
 *        properties:
 *          apiPath:
 *            type: string
 *            description: the path of the api called
 *        example:
 *          api/path:
 *            GET:
 *              200:
 *                count: 6
 *                maxDuration: 3
 *                minDuration: 2
 * tags:
 *   name: Hostname
 * /api/hostname:
 *   get:
 *     summary: Get the hostname of the deployed application
 *     tags: [Hostname]
 *     responses:
 *       200:
 *         description: The hostname of the the deployed app
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hostname'
 *       500:
 *         description: Some server error 
 * /api/stats:
 *   get:
 *     summary: Get the stats of the http request of the app
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: The hostname of the the deployed app
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatsResponse'
 *       500:
 *         description: Some server errors 
 * /api/message:
 *   get:
 *     summary: List all the messages sended to app
 *     tags: [Message]
 *     responses:
 *       200:
 *         description: the list of the messages
 *         content: 
 *           application/json:
 *           schema: 
 *             $ref: '#/components/schemas/Message'
 *       500:
 *         description: some server errors
 *   post:
 *     summary: post a message
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       201:
 *         description: creation of a message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500: 
 *         description: some server errors
 *           
 * 
*/
const fs = require('fs');
const os = require('os');
const datas = require('./datas-json');
const WELCOME_FILE_PATH = 'index.html'

module.exports = function (app,){
    

    app.get('/',function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.readFile(WELCOME_FILE_PATH, function (err,data) {
            res.end(data);
        });
    });
    
    app.get('/index.js',function(req, res) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        fs.readFile("index.js", function (err,data) {
            res.end(data);
        });
    });
    
    app.get('/api/hostname', function(req,res) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({hostname: os.hostname()}));
    });
    
    app.get('/api/stats/', (req, res) => {
        res.json(datas.readStats())
    })
    
    app.post('/api/message', (req, res) => {
        
        const messages = datas.readMessages();
       
        var msg = { 
            message: `${req.body.message}`,
            date: new Date().toLocaleString("fr-CH")
        }
    
        console.log(msg)
    
        messages.push(msg)
    
        datas.writeMessage(messages)
        res.json(msg);
        
    })
    
    app.get('/api/message', (req, res) => {
        
        res.json(datas.readMessages())    
    })
}