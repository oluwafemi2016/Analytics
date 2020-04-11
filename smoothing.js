// (A) SMOOTH ONLY 
// This function smooths out fluctuations/noise in data, using exponential smoothing method
//Procedure & Important Notification
//a. First, the dataset is cleaned => NaNs are removed
//b. The cleaned dataset is then smoothened; stretch the smoothen array to avoid any potential wrinkle
//c. Then with the known indices of NaNs (if available), intersperse NaNs into the smoothened array
//d. In the provided function, the user loads the array and specifies the period of interest
//Note for user: "array" is dirty array to smooth; "size" is smoothing period

//Required dependency
const ema = require("moving-averages").ema

function smoothing(array, size) {
    const array_clean = [];
    array.forEach((val) => {
        if (!isNaN(val)) {
            array_clean.push(val);
        }
    });
    const arr_length = array.length;
    //smooth cleaned array
    const array_smooth = ema(array_clean, size);
    //Interpolate between smoothed data to fill interspersed NaNs

    //Get Indices of all non-NaN elements and NaNs in dirty array

    // get non nans
    const IndexNNaN = [];
    for (let j = 0; j < arr_length; j++) {
        if (!isNaN(array[j])) {
            IndexNNaN.push(array.indexOf(array[j]));
        }
    }
    //get nans
    const IndexNaN = [];
    array.filter(function (arr, indx) {
        if(isNaN(arr)){
            IndexNaN.push(indx)
        }
    });

    console.log("IndexNaN", IndexNaN);
    console.log("IndexNNaN", IndexNNaN);
    //Get the needed expansion size
    const expand_size = IndexNNaN[IndexNNaN.length - 1] - IndexNNaN[0] + 1;

    //Get the indices from first to last non-NaN interval
    function GenArray(start, end, step) {
        const xlist = [];
        if (isNaN(step)) {
            step = 1;
        }
        if (step > 0) {
            for (let i = start; i <= end; i += step) {
                xlist.push(i);
            }
        } else {
            for (let i = start; i >= end; i += step) {
                xlist.push(i);
            }
        }
        return xlist;
    }
    const Index_Expand = GenArray(IndexNNaN[0], IndexNNaN[IndexNNaN.length - 1], 1);

    //Piecewise linear interpolating function
    function interpolateArray(data, fitCount) {

        const linearInterpolate = function (before, after, atPoint) {
            return before + (after - before) * atPoint;
        };

        const newData = Array();
        const springFactor = ((data.length - 1) / (fitCount - 1));
        newData[0] = data[0]; // for new allocation
        for (let i = 1; i < fitCount - 1; i++) {
            const tmp = i * springFactor;
            const before = (Math.floor(tmp)).toFixed();
            const after = (Math.ceil(tmp)).toFixed();
            const atPoint = tmp - before;
            newData[i] = linearInterpolate(data[before], data[after], atPoint);
        }
        newData[fitCount - 1] = data[data.length - 1]; // for new allocation
        return newData;
    };
    const smooth_interp = interpolateArray(array_smooth, expand_size);

    //Initial population of final array with NaNs;
    const smooth_array = Array(arr_length).fill(NaN);
    //splice smooth-interpolated array into smooth-array
    for (let j = 0; j < Index_Expand.length; j++) {
        smooth_array.splice(Index_Expand[j], 1, smooth_interp[j]);
    }
    //Now intersperse NaN, using IndexNaN, when IndexNaN.length > 0
    for (let j = 0; j < IndexNaN.length; j++) {
        smooth_array.splice(IndexNaN[j], 1, NaN);
    }
    return (smooth_array);
}



// For Testing Only
//const evg = ema([10, 12, 13, 40, 42, 45, 47], 2);
const A = [NaN, 1, 10, 12, 14,15, NaN, NaN, 16, 45, -12, NaN, NaN, 60, 55, 13, 23]
const arras = smoothing(A, 2)
console.log("arras", arras)

////+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(B) SMOOTH AND INTERPOLATE
// This function smoothens the dataset and interpolates for NaNs in-between non-NaNs datapoints
// Not extrapolating to head and tail NaNs...

function smoothAndInterpolate(array, size) {
    //Clean dirty array
    const array_clean = [];
    array.forEach((val) => {
        if (!isNaN(val)) {
            array_clean.push(val);
        }
    });
    const arr_length = array.length;
    //smooth cleaned array
    const array_smooth = ema(array_clean, size);
    //Interpolate between smoothed data to fill interspersed NaNs

    //Get Indices of all non-NaN elements in dirty array
    const Index = [];
    for (let j = 0; j < arr_length; j++) {
        if (!isNaN(array[j])) {
            Index.push(array.indexOf(array[j]));
        }
    }
    //Get the needed expansion size
    const expand_size = Index[Index.length - 1] - Index[0] + 1;

    //Get the indices from first to last non-NaN interval
    function GenArray(start, end, step) {
        const xlist = [];
        if (isNaN(step)) {
            step = 1;
        }
        if (step > 0) {
            for (let i = start; i <= end; i += step) {
                xlist.push(i);
            }
        } else {
            for (let i = start; i >= end; i += step) {
                xlist.push(i);
            }
        }
        return xlist;
    }
    const Index_Expand = GenArray(Index[0], Index[Index.length - 1], 1);

    //Piecewise linear interpolating function
    function interpolateArray(data, fitCount) {

        const linearInterpolate = function (before, after, atPoint) {
            return before + (after - before) * atPoint;
        };

        const newData = Array();
        const springFactor = ((data.length - 1) / (fitCount - 1));
        newData[0] = data[0]; // for new allocation
        for (let i = 1; i < fitCount - 1; i++) {
            const tmp = i * springFactor;
            const before = (Math.floor(tmp)).toFixed();
            const after = (Math.ceil(tmp)).toFixed();
            const atPoint = tmp - before;
            newData[i] = linearInterpolate(data[before], data[after], atPoint);
        }
        newData[fitCount - 1] = data[data.length - 1]; // for new allocation
        return newData;
    };
    const smooth_interp = interpolateArray(array_smooth, expand_size);

    //Initial population of final array with NaNs;
    const smooth_array = Array(arr_length).fill(NaN);
    //splice smooth-interpolated array into smooth-array
    for (let j = 0; j < Index_Expand.length; j++) {
        smooth_array.splice(Index_Expand[j], 1, smooth_interp[j]);
    }
    return (smooth_array);
}

//Test2
const arras2 = smoothAndInterpolate(A, 2);
//console.log("arras2", arras2);
