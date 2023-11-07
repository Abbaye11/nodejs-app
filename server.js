const { FILE } = require('dns');
const express =require('express');
const os = require('os');
const app = express();
const datas = require('./datas-json');

const PORT = process.env.PORT || 8080;

app.use(express.json());

require('./swagger-config')(app,PORT);
require('./stats-filter')(app);
require('./routes')(app);

app.listen(PORT, function () {
    datas.clearJsonDataFiles();
    
    console.log(`Server running at ${os.hostname()}, listening on port ${PORT}`);
});



