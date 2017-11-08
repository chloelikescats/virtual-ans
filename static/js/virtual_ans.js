
//AJAX on page load to get frequencies
//Create array of synth objects, one for each freq
let allSynths;
$.get("/frequencies.json", generateSynths);

function generateSynths(result) {
    let synths = [];
    // console.log(result);
    frequencyArray = result['frequency']

     for (let freq_hz in frequencyArray) {
        // console.log(frequencyArray[freq_hz]);
        // console.log(label)
        let sin_osc = {
            synthDef: {
                ugen: "flock.ugen.sinOsc",
                freq: frequencyArray[freq_hz],
                phase: 0.1,
                mul: 0.005
                }
            };

            synths.push(sin_osc)
        }

    allSynths = synths;
};



fluid.registerNamespace("octave_1");
fluid.registerNamespace("octave_2");
fluid.registerNamespace("octave_3");
fluid.registerNamespace("octave_4");
fluid.registerNamespace("octave_5");
fluid.registerNamespace("octave_6");
fluid.registerNamespace("octave_7");
fluid.registerNamespace("octave_8");
fluid.registerNamespace("octave_9");
fluid.registerNamespace("octave_10");

    octave_1.play = function () {
        let counter = 0
        while (counter < 72){
            flock.synth(allSynths[counter]);
            counter+=1;
        };
    };

    octave_2.play = function () {
        let counter = 72
        while (counter < 144){
            flock.synth(allSynths[counter]);
            counter+=1;
        };
    };

    octave_3.play = function () {
        let counter = 144
        while (counter < 216){
            flock.synth(allSynths[counter]);
            counter+=1;
        };
    };

    octave_4.play = function () {
        let counter = 216
        while (counter < 288){
            flock.synth(allSynths[counter]);
            counter+=1;
        };
    };

    octave_5.play = function () {
        let counter = 288
        while (counter < 360){
            flock.synth(allSynths[counter]);
            counter+=1;
        };
    };

    octave_6.play = function () {
        let counter = 360
        while (counter < 432){
            flock.synth(allSynths[counter]);
            counter+=1;
        };
    };

    octave_7.play = function () {
        let counter = 432
        while (counter < 504){
            flock.synth(allSynths[counter]);
            counter+=1;
        };
    };

    octave_8.play = function () {
        let counter = 504
        while (counter < 576){
            flock.synth(allSynths[counter]);
            counter+=1;
        };
    };

    octave_9.play = function () {
        let counter = 576
        while (counter < 648){
            flock.synth(allSynths[counter]);
            counter+=1;
        };
    };

    octave_10.play = function () {
        let counter = 648
        while (counter < 720){
            flock.synth(allSynths[counter]);
            counter+=1;
        };
    };








