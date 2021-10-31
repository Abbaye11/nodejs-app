//retourne un nombre aléatoire de 0 à 255
var getRandom255 = function () {
    console.log(Math.floor(Math.random() * 255))
    return Math.floor(Math.random() * 255);
};

//Returne une couleur format rg sous forme de string aléatoire
var getRandomColour = function (){
    var color = 'rgba(255,147,51, 1)'
    console.log(color)
    return color
};

var getColorForMethod = function(method){

    console.log(method)
    switch(method){

        case 'GET' : return "rgba(51,255,162, 1)"
        
        case 'POST' : return "rgba(255,67,51, 1)"
    }
}

var getColorForMethodMinMax = function(method){

    console.log(method)
    switch(method){

        case 'GET - min' : return "rgba(51,255,162, 1)"
        
        case 'POST - min' : return "rgba(255,67,51, 1)"

        case 'GET - max' : return "rgba(51,127,162, 1)"
        
        case 'POST - max' : return "rgba(255,127,51, 1)"
    }
}


var renderPathCountGraph = function () {
    var ctx = document.getElementById('pathCountGraph');
    var delayed;
    
    var countByPathChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            
            plugins: {
                title: {
                    display: true,
                    text: `[]`
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    });

    return countByPathChart;
}

var updateData = function (countByPathChart,timeMeasureChart) {
    
    $.getJSON('/api/stats')
        .done(function(data) {

            //map : key[path] --> map : key[method] --> count  
            var countByPath = new Map()
            var timeByPath = new Map()
            var labels= []
            //path iteration
            for (var path in data){
                console.log(path)
                labels.push(path)

                //method iteration
                for (var method in data[path]){
                    var pathCount = 0
                    var minDuration = 0
                    
                    if(!countByPath.has(path)){
                        countByPath.set(path,new Map())
                        timeByPath.set(path, new Map())
                    }

                    //statusCode iteration sur code de status
                    for(var statusCode in data[path][method]){
                        
                        var pathByMethodCount = 0;
                        //nombre d'appel au path par méthode
                        pathCount += data[path][method][statusCode].count

                        var duration = {}
                        //TODO voir plusieurs sttaus code 
                        duration.minDuration = data[path][method][statusCode].minDuration
                        duration.maxDuration = data[path][method][statusCode].maxDuration
                        //var methodCount = countByMethod.has(method) ? countByMethod.get(method) + pathCount : pathCount
                        //countByMethod.set(method,methodCount);
                        
                        pathByMethodCount += pathCount
                        countByPath.set(path,countByPath.get(path).set(method,pathByMethodCount))
                        timeByPath.set(path,timeByPath.get(path).set(method,duration))
                    }
                    //countByPath.push(pathCount)
                    //countByPath.set(path,pathCount)
                }
            }

            //console.log(countByMethod)
            console.log(countByPath)

            var totalRequestCount = 0;
            [...countByPath.values()].forEach(element => {
                totalRequestCount += [...element.values()].reduce((a,b) => a + b)
            });
            //var totalRequestCount =[...[...countByPath.values()].values()].reduce((a,b) => a + b)
            
            
            var pathCountDataset = new Map();
            var timeMeasureDataset = new Map();
            
            //parcours des valeurs méthodes
            fillpathCountDataset(countByPath, pathCountDataset);
            fillTimeMeasureDataset(timeByPath, timeMeasureDataset)

            countByPathChart.data.labels = [...countByPath.keys()];
            countByPathChart.data.datasets = [...pathCountDataset.values()];
            countByPathChart.options.plugins.title.text = `#${totalRequestCount} requests`

            timeMeasureChart.data.labels = [...timeByPath.keys()];
            timeMeasureChart.data.datasets = [...timeMeasureDataset.values()];
            
            timeMeasureChart.update('none');
            countByPathChart.update('none')

           // renderTimeMeasureGraph(timeByPath, timeMeasureDataset, totalRequestCount);
        });
}

$(function () {
    
    $('#jumbo').hide();
    $('#loader').show();
    
    //Construction initiale du graph
    var countByPathChart = renderPathCountGraph();
    var timeMeasureChart = renderTimeMeasureGraph();


    setInterval(function(){ 
        updateData(countByPathChart,timeMeasureChart)
    }, 10000);


    
    $.getJSON('/api/hostname')
        .done(function(data) {
            $('#hostname').html(data.hostname);
            $('#update_date').html(new Date());

            $('#jumbo').show();
            $('#loader').hide();


    });

    updateData(countByPathChart,timeMeasureChart);

    


    
})

function renderTimeMeasureGraph() {
    var ctx = document.getElementById('timeChart');
    var delayed;
    var timeMeasureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            animation: {
                onComplete: () => {
                    delayed = true;
                },
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default' && !delayed) {
                        delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    }
                    return delay;
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: `[]`
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    });

    return timeMeasureChart;
}



function fillpathCountDataset(countByPath, pathCountDataset) {
    var valuesIterationCount = 0;

            
    [...countByPath.values()].forEach(element => {

        //pacrours des clés (méthodes http)
        [...element.keys()].forEach(key => {

            if (!pathCountDataset.has(key)) {

                var dataset = {};
                dataset.label = `${key}`;
                dataset.data = [];
                dataset.backgroundColor = [getColorForMethod(key)];
                dataset.borderColor = [getRandomColour()];

                dataset.borderWidth = 1;

                var dataCount = element.has(key) ? element.get(key) : 0;

                dataset.data = new Array(countByPath.size).fill(0);
                dataset.data.splice(valuesIterationCount, 0, dataCount);
                console.log(valuesIterationCount);
                pathCountDataset.set(key, dataset);

            } else {

                var dataset = pathCountDataset.get(key);
                var dataCount = element.has(key) ? element.get(key) : 0;
                pathCountDataset.get(key).data.splice(valuesIterationCount, 0, dataCount);
                console.log(valuesIterationCount);
            }


        });

        valuesIterationCount++;
    });
    
}

function fillTimeMeasureDataset(timeByPath, timeMeasureDataset) {
    var valuesIterationCount = 0;
            
    [...timeByPath.values()].forEach(element => {

        //pacrours des clés (méthodes http)
        [...element.keys()].forEach(key => {

            if (!timeMeasureDataset.has(key + " min")) {

                var minDataset = {};
                minDataset.label = `${key} - min`;
                minDataset.data = [];
                minDataset.backgroundColor = [getColorForMethodMinMax(`${key} - min`)];
                minDataset.borderColor = [getRandomColour()];
                minDataset.stack = `${key}min`
                minDataset.borderWidth = 1;

                //var measureCount = {}
                var min = element.has(key) ? element.get(key).minDuration : 0;
                //measureCount.max = element.has(key) ? element.get(key).maxDuration : 0;
                
                //var dataCount = element.has(key) ? element.get(key) : 0;

                //console.log(measureCount)
                minDataset.data = new Array(timeByPath.size).fill(0);
                minDataset.data.splice(valuesIterationCount, 0, min);
                //minDataset.data.splice(valuesIterationCount+1, 0, measureCount.max);
                //console.log(valuesIterationCount);
                timeMeasureDataset.set(key + " min", minDataset);
            }else{
                var minDataset = timeMeasureDataset.get(key + " min");
                //var measureCount = {}
                var min = element.has(key) ? element.get(key).minDuration : 0;
                //measureCount.max = element.has(key) ? element.get(key).maxDuration : 0;
                minDataset.data.splice(valuesIterationCount, 0, min);
                //minDataset.data.splice(valuesIterationCount+1, 0, measureCount.man);
            }

            if (!timeMeasureDataset.has(key + " max")) {
                var maxDataset = {};
                maxDataset.label = `${key} - max`;
                maxDataset.data = [];
                maxDataset.backgroundColor = [getColorForMethodMinMax(`${key} - max`)];
                maxDataset.borderColor = [getRandomColour()];
                maxDataset.stack = `${key}max`
                maxDataset.borderWidth = 1;

                //var measureCount = {}
                var max = element.has(key) ? element.get(key).maxDuration : 0;
                //measureCount.max = element.has(key) ? element.get(key).maxDuration : 0;
                
                //var dataCount = element.has(key) ? element.get(key) : 0;

                //console.log(measureCount)
                maxDataset.data = new Array(timeByPath.size).fill(0);
                maxDataset.data.splice(valuesIterationCount, 0, max);


                
                timeMeasureDataset.set(key + " max", maxDataset);
            } else {

                
                var maxDataset = timeMeasureDataset.get(key + " max");
                //var measureCount = {}
                var max = element.has(key) ? element.get(key).maxDuration : 0;
                //measureCount.max = element.has(key) ? element.get(key).maxDuration : 0;
                maxDataset.data.splice(valuesIterationCount, 0, max);

                console.log(valuesIterationCount);
            }

            
        });
        valuesIterationCount ++;
        
    });
    
    console.log(timeMeasureDataset)
}
