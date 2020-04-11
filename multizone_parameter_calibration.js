// This script shows how to implement multi-zone calibration of a semi-empirical/empirical (mathematical) model

const zones = [{
        name: 'Zone1',
        id: 'Zone1',
        topdepth: 2100,
        bottomdepth: 3200,
        unit: 'ft',
        color: '#1f77b4',
        parameters: [{
                paramName: 'FIT TYPE',
                value: 'APPLY',
                Default: 'APPLY'
            },
            {
                paramName: 'ZONE FIT',
                value: 'Zone2',
                Default: 'Zone1'
            },
            {
                paramName: 'DEN_MA',
                value: 0.23,
                Default: 2.3,
                data: [2.3, 2.4, 2.67, 2.75, 2.86, 3.15]
            }
        ]
    },
    {
        name: 'Zone2',
        id: 'Zone2',
        topdepth: 3200,
        bottomdepth: 5800,
        unit: 'ft',
        color: '#aec7e8',
        parameters: [{
                paramName: 'FIT TYPE',
                value: 'TRAIN',
                Default: 'APPLY'
            },
            {
                paramName: 'ZONE FIT',
                value: 'Zone2',
                Default: 'Zone1'
            },
            {
                paramName: 'DEN_MA',
                value: 0.23,
                Default: 2.3,
                data: [2.3, 2.4, 2.67, 2.75]
            }
        ]
    },
    {
        name: 'Zone3',
        id: 'Zone3',
        topdepth: 5800,
        bottomdepth: 9700,
        unit: 'ft',
        color: '#ff7f0e',
        parameters: [{
                paramName: 'FIT TYPE',
                value: 'TRAIN',
                Default: 'APPLY'
            },
            {
                paramName: 'ZONE FIT',
                value: 'Zone3',
                Default: 'Zone1'
            },
            {
                paramName: 'DEN_MA',
                value: 0.23,
                Default: 2.3,
                data: [2.3, 2.4]
            }
        ]
    }
]

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=

const NT = zones.length; // length of the universal set of zones
const trainZones = [];
const applyZones = [];
const fit_type = [];
const DEN_MAS = [];
for (let j = 0; j < NT; j++) {
    fit_type[j] = zones[j].parameters[0].value
    if (fit_type[j] == 'TRAIN') {
        trainZones.push(zones[j])
        DEN_MAS.push(zones[j].parameters[2].value);
    } else if (fit_type[j] == 'APPLY') {
        applyZones.push(zones[j])
    }
}

console.log("DEN_MAS", DEN_MAS);

const MD = [200, 250, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, NaN, 7500, 8000, NaN, NaN, 9500];
const RHOB = [2.2, 2.28, NaN, 2.35, 2.289, 2.34, 2.33, 2.38, NaN, NaN, 2.365, 2.456, 2.657, 2.73, 2.75, NaN, 2.567, 2.76, 2.56, 2.67, 2.47];
const DT = [120, 120, 119, 118, 117, 116, 115, 114, 113, 112, 111, 110, 109, 108, 107, 106, 105, 104, NaN, NaN, NaN];
const Z0 = [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3];

//Precleaning of Input Dataset
const TVDclean = [];
const RHOBclean = [];
const DTclean = [];
RHOB.forEach((val, i) => {
    if (!isNaN(val) && !isNaN(DT[i]) && !isNaN(MD[i])) {
        RHOBclean.push(val*2);
        TVDclean.push(MD[i]);
        DTclean.push(DT[i]);
    }
});

console.log("TVDclean", TVDclean);
console.log("RHOBclean", RHOBclean);
console.log("DTclean", DTclean);

const N = trainZones.length;
console.log('trainzones', trainZones);

//console.log(o.zones);
// find the closest MD value to top and bottom of the zone
// array.slice(first_index, last_index)
// Define Function for Finding the index of closest MD value for top and bottom
function findIndexClosestNumber(arrayToSearch, compareNumber) {
    'use strict';
    let closest = compareNumber;
    let indexClosest = 0;
    arrayToSearch.forEach((currentNumber, index) => {
        let currentDistance =
            Math.abs(compareNumber - currentNumber);
        if (currentDistance < closest) {
            indexClosest = index;
            closest = currentDistance;
        }
    });

    return indexClosest;
}
//Get the relevant attributes of the array zones
var topdepths = trainZones.map(zone => zone.topdepth);
var botdepths = trainZones.map(zone => zone.bottomdepth);

const cents = [];
for (let j = 0; j < N; j++) {
    cents[j] = topdepths[j] + 0.5;
}
console.log("topdepths", topdepths);
console.log("cents", cents);
console.log("subset zone number", N);
//var j;
//Determine the closest indexes of the top depths
const top = [];
for (let j = 0; j < N; j++) {
    top.push(findIndexClosestNumber(TVDclean, topdepths[j]));
}
console.log("top", top);
//Determine the closest indexes of the bottom depths
const bot = [];
for (let j = 0; j < N; j++) {
    bot.push(findIndexClosestNumber(TVDclean, botdepths[j]));
}
console.log("bot", bot);
//Slicing the data for automatic zonal optimization
//Density
const RHOB_GL = [];
const ZONES = [];
for (let k = 0; k < N; k++) {
    RHOB_GL.push(RHOBclean.slice(top[k], bot[k] + 1));
    ZONES[k] = "Yes"
}
console.log("RHOB_GL", RHOB_GL);
console.log("ZONES", ZONES);
//console.log("RHOB_GL[1]", RHOB_GL[1]);
//console.log("RHOB_GL[2]", RHOB_GL[2]);

//Acoustic Slowness
const DT_GL = [];
const DT_GLlength = [];
for (let k = 0; k < N; k++) {
    DT_GL.push(DTclean.slice(top[k], bot[k] + 1));
    DT_GLlength.push(DT_GL[k].length);
}
console.log("DT_GL", DT_GL);
console.log("DT_GLlength", DT_GLlength);
const DT_GLF = [];
for (let k = 0; k < N; k++) {
    DT_GLF[k] = DT_GL[k][0];
}

//console.log("DT_GLF", DT_GLF);
//Measured Depth
const TVD_GL = [];
for (let k = 0; k < N; k++) {
    TVD_GL.push(TVDclean.slice(top[k], bot[k] + 1));
}

const DTCSLF = [];
for (let j = 0; j < N; j++) {
    DTCSLF[j] = DT_GL[j][0];
}
// console.log("RHOB_GL", RHOB_GL);
// console.log("TVD_GL", TVD_GL);
// console.log("DT_GL", DT_GL);
// console.log("DTCSLF", DTCSLF);
//++++++++++++++++++++++++++++++++++++++
//Get Indexes of NaNs Function
function findNaNs(arr) {
    return arr.map(function (itm, i) {
        if (isNaN(itm)) return i;
        return false;
    }).filter(function (itm) {
        return itm;
    });
}

// Data Cleaning
//const RHOB_GLclean = [];
//const TVD_GLclean = [];
//for (let k=0; k<N; k++){
//TVD_GLclean[k] = TVD_GL[k].filter(x => !isNaN(x));
//RHOB_GLclean[k] = RHOB_GL[k].filter(x => !isNaN(x));
//}

const indexMap = [];

function verifyval(x, i) {
    if (isNaN(x)) {
        indexMap.push([i]);
        return false;
    }
    return true;
}


//++++++++++++++++++++++++++++++++++++++++++
//START OF OPTIMIZATION

const LM = require("ml-levenberg-marquardt");
// Function to optimize   
const results = [];
const AM = [];
const BM = [];
const CM = [];
for (let i = 0; i < N; i++) {
    function AMOCOPolyFunction([a0, b0, c0]) {
        return (t) => (a0 + Math.pow(((t) / c0), b0)) / 8.345;
    }
    const datapointsAMOCO_Global = {
        x: TVD_GL[i],
        y: RHOB_GL[i]
    }

    console.log('datapoints', datapointsAMOCO_Global);
    console.log("DEN_MAS", DEN_MAS);

    // Array of initial parameter values
    const initialValuesAMOCO = [16.3, 0.6, 3125];
    const optionsAMOCO = {
        damping: 1.5,
        initialValues: initialValuesAMOCO,
        gradientDifference: 10e-2,
        maxIterations: 100,
        errorTolerance: 10e-3
    };
    results.push(LM(datapointsAMOCO_Global, AMOCOPolyFunction, optionsAMOCO));
    //parameters
    AM[i] = results[i].parameterValues[0];
    BM[i] = results[i].parameterValues[1];
    CM[i] = results[i].parameterValues[2];
}

console.log("results", results);
console.log("AM", AM);
console.log("BM", BM);
console.log("CM", CM);

//Expand the estimated parameters from top of first zone to bottom of last zone in the universal set

//First: Determine the indexes of the tops and bottoms of the zones in the universal set
//Get the relevant attributes of the array zones
var startdepths = zones.map(zone => zone.topdepth);
var enddepths = zones.map(zone => zone.bottomdepth);
//Determine the closest indexes of the start depths
const start_zone = [];
for (let j = 0; j < NT; j++) {
    start_zone.push(findIndexClosestNumber(MD, startdepths[j]));
}
//Determine the closest indexes of the end depths
const end_zone = [];
for (let j = 0; j < NT; j++) {
    end_zone.push(findIndexClosestNumber(MD, enddepths[j]));
}
// console.log("start depth index", start_zone);
// console.log("end depth index", end_zone);

//Next: Gather the index of the zones fitting zone-parameters
var zoneIndex = zones.map(element => {
    var nameToCheck = element.parameters[1].value;
    for (let i = 0; i < zones.length; i++) {
        if (zones[i].name == nameToCheck) {
            return i;
        }
    }
})

// console.log("zonesIndex", zoneIndex);

//Next: Create an array of the sorted parameters for the zones
//filter array to zones with TRAIN fit type
const TrainArray = zones.filter(x => (x.parameters[0].value == 'TRAIN'));
//console.log("TrainArray", TrainArray);

parameters_AM = AM;
parameters_BM = BM;
//console.log("parameters_AM", parameters_AM);

const zonesTrainArray = TrainArray.map(a => a.parameters[1].value);
//console.log("zonesTrainArray", zonesTrainArray);

//The filtered array of TRAIN zones now to be matched with calibrated parameters and create lookup object
const lookup_AM = {};
zonesTrainArray.forEach((value, index) => {
    lookup_AM[value] = parameters_AM[index]
})

const lookup_BM = {};
zonesTrainArray.forEach((value, index) => {
    lookup_BM[value] = parameters_BM[index]
})

//console.log("lookup", lookup);
//assign the parameters computed from the TRAIN zones to the specfied zones in the universal set
const zoned_AM = zones.map(z => {
    return lookup_AM[z.parameters[1].value]
})
//console.log("zoned_AM", zoned_AM);

const zoned_BM = zones.map(z => {
    return lookup_BM[z.parameters[1].value]
})

//Finally: Distribute the zone-parameters over the entire lengths of the intervals using array.fill function
const params = [{
    index: zoneIndex,
    start: start_zone,
    end: end_zone
}];
const param_AM = zoned_AM;
const param_BM = zoned_BM;
const A = [];
const B = [];
for (let j = 0; j < NT; j++) {
    params.forEach(({
        index,
        start,
        end
    }) => {
        if (A.length < end[j] + 1) {
            A.length = end[j] + 1;
            B.length = end[j] + 1;
        }
        A.fill(param_AM[index[j]], start[j], end[j] + 1)
        B.fill(param_BM[index[j]], start[j], end[j] + 1)
    });
}

//console.log("B array", B, "; B length", B.length);
//console.log("A array", A, "; B length", A.length);
//console.log("Length of MD", MD.length);
console.log("NT", NT);

const b = [10, 20];
const b_index = [1, 2];
const AB = [NaN, NaN, NaN, NaN, NaN];
let j = 0;
while (j < b.length) {
    AB[b_index[j]] = b[j];
    j += 1;
}

console.log("AB", AB);

//+++++++++++++++++++++++++++++++
//Test npm matrix operations module
var matrixJs = require("matrix-js")
var am = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
var Amt = matrixJs(am);
//console.log("A-Matrix", Amt(0));
//console.log("A-Matrix", Amt.size());
//to test allocating index values to another array
const Rhos = [];
for (let k = 0; k < top.length; k++) {
    Rhos.push(MD[top[k]]);
}
//console.log("Rhos", Rhos)
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const OB = [10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000];
const PP = [5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000];
const PN = [3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500];
const DTC = [91, 95, 98, 100, 105, 108, 98, 96, 105];
const DTN = [88, 87, 86, 84.5, 82.3, 79, 78, 77.4, 73.2];
const ydata = [];
const xdata = [];
for (let j = 0; j < OB.length; j++) {
    const OB2 = OB[j];
    if (OB2 > 10000) {
        ydata[j] = (OB2 - 1.2 * PP[j]) / (OB[j] - PN[j]);
        xdata[j] = (DTN[j] / DTC[j]);
    } else {
        ydata[j] = NaN;
        xdata[j] = NaN;
    }
}

//console.log("ydata", ydata);
//Pore Pressure
// Function to optimize   

function Pressure([b]) {
    return (t) => (Math.pow(t, b));
}
const data = {
    x: xdata,
    y: ydata
}

// Array of initial parameter values
const initialValues = [6];
const options = {
    damping: 1.5,
    initialValues: initialValues,
    gradientDifference: 10e-2,
    maxIterations: 100,
    errorTolerance: 10e-3
};
const levenberg_results = LM(data, Pressure, options);
//parameters
const b0 = levenberg_results.parameterValues[0];

//console.log("b0", b0 / 1e-1)
