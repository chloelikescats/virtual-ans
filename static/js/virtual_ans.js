/*PLANNING:
- Get Column Data
- 0-255 (0 is white, 255 is black)
- Scale amplitude based on 0-255 (0 loudest, 255 silent)
- Each value represents pixel in row
- 720 rows, 480 tones
--------------------
13 tones precede 1st octave
35 tone preclude 9th octave

- Base pitch corresponds to 1px
- 1st semitone corresponds to 2px
- 2nd semitone corresponds to 1px
- 3rd semitone corresponds to 2px

example:
C c/1 c/2 c/3 D
1  2   1   2  1

- 48 discrete oscillators per octave.
- 2 "photocells" per octave
- 24 oscillators -> bandpass filter -> amplitude control
- 2 bandpass filters/amplitude controls per octave
*/ 


let allSynths;
//AJAX on page load to get frequencies
$.get("/frequencies.json", generateSynths);

//Create array of synth objects, one for each freq
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


//200 at a time seems to be the functional limit of the environment
fluid.registerNamespace("virtual_ans");

    virtual_ans.play = function () {
        let counter = 100;
        while (counter < 300){
            flock.synth(allSynths[counter]);
            counter+=1;
        };

    };

    virtual_ans.stop = function () {
        let counter = 100;
        while (counter < 300){
            flock.synth(allSynths[counter]);
            counter+=1;
        };
    };
