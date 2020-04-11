//DESPIKE
//1. This functions removes outliers from a 1D dataset
//2. The cut-offs are: low outliers => beneath first quartile and high outliers => above third quartile
//3. Replaces outliers with linear interpolation of neighboring non-outliers

//Required Dependency
const outliers = require("outliers");

function despike(array) {
    //Clean dirty array
    const array_clean = [];
    array.forEach((val) => {
        if (!isNaN(val)) {
            array_clean.push(val);
        }
    });
    console.log("array_clean", array_clean)
    //Remove Outliers from cleaned array
    const array_filtered = array_clean.filter(outliers());
    console.log("array_filtered", array_filtered, array_filtered.length)
    //Next: linearly interpolate between neighboring elements to fill in the space of outliers
    //Get outliers
    const outlier = outliers(array_clean);
    console.log("outliers", outlier)
    //Get indices of outliers in array_clean
    const Index_outliers = [];
    for (let j = 0; j < outlier.length; j++) {
        Index_outliers.push(array_clean.indexOf(outlier[j]));
    }
    console.log("Index_Outliers", Index_outliers)
    //Splice into array_clean_filtered the interpolated values of neighbors to outliers
    //Caveat: if one of the neighbors is undefined/especially at edges/ends, then pick a non-NaN neighbor
    const interp = [];
    for (let j = 0; j < Index_outliers.length; j++) {
        if (Index_outliers[j] == 0) {
            interp[j] = array_clean[1];
        } else if (Index_outliers[j] == array_clean.length - 1) {
            interp[j] = array_clean[array_clean.length - 2];
        } else {
            interp[j] = (array_clean[Index_outliers[j] - 1] + array_clean[Index_outliers[j] + 1]) / 2
        }
        array_filtered.splice(Index_outliers[j], 0, interp[j]);
    }
    console.log("interp", interp)
    console.log("array_filtered 2", array_filtered)

    //Get Indices of all NaN elements in dirty array
    const Index_NaN = [];
    array.filter(function (arr, indx) {
        if (isNaN(arr)) {
            Index_NaN.push(indx)
        }
    });
    console.log("Index_NaN", Index_NaN)
    //With the known Index substitute/splice the NaNs into array filtered
    for (let j = 0; j < Index_NaN.length; j++) {
        array_filtered.splice(Index_NaN[j], 0, NaN);
    }
    const despiked_array = array_filtered;
    return (despiked_array)
}

//Testing Only
const A = [NaN, -120, 14, 12.5, NaN, 50, 13, 1400, 16, 18.6, -600, 65, 66, 1200, NaN, NaN]
const desp = despike(A);
console.log("desp", desp);
//console.log("outliers", outliers(A))
