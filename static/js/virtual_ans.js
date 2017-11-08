
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
                id: "sine",
                freq: frequencyArray[freq_hz],
                mul: {
                    ugen: "flock.ugen.line",
                    start: 0,
                    end: 0.05,
                    duration: 5
                    }
                }
            };

            synths.push(sin_osc)
        }

    allSynths = synths;
};



fluid.registerNamespace("virtual_ans");

    virtual_ans.play = function () {
        let counter = 100;
        while (counter < 300){
            flock.synth(allSynths[counter]);
            counter+=1;
        };
    // Fade out after 10 seconds.


    };

    // scheduler.once(10, function () {
    //     synth.set({
    //         "sine.mul.start": 0.25,
    //         "sine.mul.end": 0.0,
    //         "sine.mul.duration": 1.0
    //     });
    // });
