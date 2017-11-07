// Wrap everything in a function to keep your stuff private.
(function () {
console.log("Words!");
    // JavaScript strict mode is a good thing.
    "use strict";

    // Define a unique global namespace for your stuff.
    // You should change this to a namespace that is appropriate for your project.
    fluid.registerNamespace("virtual_ans");

    // var environment = flock.init();

    virtual_ans.play = function () {

        let sin_osc1 = flock.synth({
            synthDef: {
                ugen: "flock.ugen.sinOsc",
                freq: 220,
                mul: 0.25
                }
            });
        let sin_osc2 = flock.synth({
            synthDef: {
                ugen: "flock.ugen.sinOsc",
                freq: 440,
                mul: 0.25
                }
            });

        // environment.start();
    };

}());
//AJAX on page load to get frequencies
//Create array of synth objects, one for each freq