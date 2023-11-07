const datas = require('./datas-json');

module.exports = function (app) {

    app.use((req, res, next) => {

        var start = process.hrtime()
     
        res.on("finish", () => {
            const stats = datas.readStats()
    
            const path = `${getRoute(req)}`
            const method = `${req.method}`
            const statusCode = `${res.statusCode}`
            
            
            console.log ("s" + statusCode)
            //const event = `${req.method} ${getRoute(req)} ${res.statusCode}`
            const countObj = {
                
            }
            
            const durationInMilliseconds = getDurationInMilliseconds (start)
    
            
            if(stats[path]){
    
                if(stats[path][method]){
    
                    if(stats[path][method][statusCode]){
                        countObj.count = stats[path][method][statusCode].count + 1
                
                        const maxDuration = stats[path][method][statusCode].maxDuration ? stats[path][method][statusCode].maxDuration : 0
                        const minDuration = stats[path][method][statusCode].minDuration ? stats[path][method][statusCode].minDuration : 0
    
                        countObj.maxDuration = maxDuration < durationInMilliseconds ? durationInMilliseconds : maxDuration
                        countObj.minDuration = minDuration > durationInMilliseconds ? durationInMilliseconds : minDuration
    
                        console.log("1a " + JSON.stringify(stats))
                        console.log("1b " + JSON.stringify(countObj))
    
                        stats[path][method][statusCode] = countObj
    
                        console.log("1." + JSON.stringify(stats))
                    }else{
                        initCountObject(countObj, method, statusCode, durationInMilliseconds);
                        stats[path][method][statusCode] = countObj
                        console.log("2." + stats)
                    }
                    
                }else{
                    
                    initCountObject(countObj, method, statusCode, durationInMilliseconds);
                    stats[path][method] = {}
                    stats[path][method][statusCode] = countObj
                    console.log("3a." + stats)
                }
    
            }else{
                initCountObject(countObj, method, statusCode, durationInMilliseconds);
                stats[path] = {}
                stats[path][method] = {}
                stats[path][method][statusCode] = countObj
                console.log("3b." + stats)
            } 
            
    
            //stats[path] = countObj
            console.log(stats)
            datas.dumpStats(stats)
            console.log(`${req.method} ${getRoute(req)} ${res.statusCode}`) 
            
            console.log("duration: " +durationInMilliseconds.toLocaleString() + " ms");
        })
        next()
    })


    const getRoute = (req) => {
        const route = req.route ? req.route.path : '' // check if the handler exist
        const baseUrl = req.baseUrl ? req.baseUrl : '' // adding the base url if the handler is child of other handler
    
        return route ? `${baseUrl === '/' ? '' : baseUrl}${route}` : 'unknown route'
    }
    
    const getDurationInMilliseconds = (start) => {
        const NS_PER_SEC = 1e9
        const NS_TO_MS = 1e6
        const diff = process.hrtime(start)
    
        return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
    }
    
    function initCountObject(countObj, method, statusCode,durationInMilliseconds) {
        countObj.count = 1;
        countObj.maxDuration = durationInMilliseconds;
        countObj.minDuration = durationInMilliseconds;
    }

    // read json object from file


}