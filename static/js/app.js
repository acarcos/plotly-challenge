// INIT PLOT

function init() {

    // FIRST SUBJECT
    var subject = '940';

    // CALL JSON TO FILL SELECTION BOX WITH ALL IDs
    d3.json("./data/samples.json").then((data) => {
        // SELECTION BOX
        var nameSubject = data.names;
        select = document.getElementById('selDataset');
        
        // FILL WITH ALL VALUES
        for (var i = 0; i < nameSubject.length; i++) {
            var opt = document.createElement('option');
            opt.value = nameSubject[i];
            opt.innerHTML = nameSubject[i];
            select.append(opt);
        }

        // SEND INFO TO PLOT
        barChart(subject, data);
        bubbleChart(subject, data);
        tableChart(subject, data);
    });
}

// HANDLER WHEN SELECTION ID CHANGE
d3.select("#selDataset").on("change", updatePlotly);

// FUNCTION WHEN DOM IS CALLED
function updatePlotly() {

    // GET DATA
    d3.json("./data/samples.json").then((data) => {
        var dropdownMenu = d3.select("#selDataset");
        var subject = dropdownMenu.node().value;

        // CALL PLOTS
        barChart(subject, data);
        bubbleChart(subject, data);
        tableChart(subject, data);
    })
}

// BAR PLOT
function barChart(numSubject, data) {

    // CHECK NUMBER ID IN DATASET TO EXTRACT THE INFORMATION
    for (var ii=0; ii<data.samples.length; ii++) {
        var valueId = data.samples[ii].id ;

        // COMPARE EACH ID WITH THE ONE SELECTED
        if (valueId == numSubject) {

            // GET 10 MOST VALUES
            var slicedDataValues = data.samples[ii].sample_values.slice(0, 10).reverse();
            var sliceDataId = data.samples[ii].otu_ids.slice(0,10).reverse();

            // GET OUT NAMES
            var otuIdSt = [];
            for (var i = 0; i < sliceDataId.length; i++) {
                otuIdSt.push(`OTU_${sliceDataId[i]}`);
            }
            var nameOtu = data.samples[ii].otu_labels.slice(0,10).reverse();

            // BAR PLOT
            var trace1 = {
                x: slicedDataValues,
                y: otuIdSt,
                text: nameOtu,
                type: "bar",
                orientation: "h",
                marker: {
                color: 'RebeccaPurple'
                }
            };

            var layout = {
                title: 'Top 10 OTU Biodiversity',
                xaxis: { title: 'Number of counts'},
            };
    
            var data1 = [trace1];
            Plotly.newPlot("bar", data1, layout);

        } else {
            continue;
        }
    }
}

// BUBBLE CHART
function bubbleChart(numSubject, data) {  
    for (var ii=0; ii<data.samples.length; ii++) {
        var valueId = data.samples[ii].id ;

        // COMPARE DATASET ID WITH THE ONE SELECTED
        if (valueId == numSubject) {

            // GET ALL THE INFORMATION OF ID
            var bubbleDataId = data.samples[ii].otu_ids.reverse();
            var bubbleDataValues = data.samples[ii].sample_values.reverse();
            var bubbleOtu = data.samples[ii].otu_labels.reverse();

            // BUBBLE CHART
            var trace2 = {
                x: bubbleDataId,
                y: bubbleDataValues,
                text: bubbleOtu,
                mode: 'markers',
                marker: {
                    size: bubbleDataValues,
                    color: 'RebeccaPurple',
                    line: {
                        width: 1.5,
                        color: 'rgb(142,124,195)'
                    }
                }
            };

            var layout2 = {
                title: 'All Biodiversity found',
                xaxis: { title: 'OTU Id'},
                yaxis: { title: 'Number of counts'}
            };

            var data2 = [trace2];
            Plotly.newPlot("bubble", data2, layout2);

        } else {
            continue;
        }
    }
}

// DEMOGRAPHIC INFORMATION
function tableChart(numSubject, data) {

    for (var ii=0; ii<data.samples.length; ii++) {
        var valueId = data.samples[ii].id ;

        if (valueId == numSubject) {

            // EXTRACT ALL THE SUBJECT DATA
            var wfreq = data.metadata[ii].wfreq;
            var age = data.metadata[ii].age;
            var bbtype = data.metadata[ii].bbtype;
            var ethinicity = data.metadata[ii].ethnicity;
            var gender = data.metadata[ii].gender;
            var location = data.metadata[ii].location;

            // FILL TABLE
            var geoData = [
                ['<b>id</b>', '<b>age</b>', '<b>bbtype</b>', '<b>ethinicity</b>', '<b>gender</b>', '<b>location</b>', '<b>wfreq</b>'],
                [valueId, age, bbtype, ethinicity, gender, location, wfreq]
            ]

            var demoTable = [{
                type: 'table',
                header: { values: [["<b>Demographic</b>"], ["<b>info</b>"]],
                fill: { color: ['rgb(228, 222, 249, 0.65)'] },
                line: { width: 0.1 },
                align: 'left'
                },
                
                cells: {
                    values: geoData,
                    fill: { color: ['white', 'white'] },
                    font: { size: 11 }
                    },
            }]
            
            // GAUGE PARAMETER
            var dataGauge = [
                {
                    type: "indicator",
                    mode: "gauge+number",
                    value: wfreq,
                    title: { text: "Weekly Washing Frequency" },
                    gauge: {
                        axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
                        bar: { color: "darkblue" },
                        bgcolor: "lavender",
                        borderwidth: 2,
                        bordercolor: "gray",
                    }
                }
            ];

            var layoutGauge = {
                width: 350,
                height: 350
            };

            Plotly.newPlot("gauge", demoTable, {responsive: true});
            Plotly.newPlot('plottables', dataGauge, layoutGauge);

            break;
        } else {
            continue;
        }
    }
}

init();
    
    