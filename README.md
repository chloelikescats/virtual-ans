Welcome to Virtual ANS, a virtual model of the ANS Synthesizer, a Soviet era visual synthesizer which translates images into sound. 

[![See a screencast of the Virtual ANS in action!](http://fluoglacial.com/wp-content/uploads/elektro-moskva-6.jpg)](https://youtu.be/2rjNuHptAco "Virtual ANS demo")

I learned about the ANS Synthesizer during my MFA at Mills College and was immediately fascinated by its sonic possibilities. Since there is only one and it’s in Moscow behind velvet rope, I decided to create a virtual simulation that is accessible to anyone, as well as expanded in functionality. I’ve created a visual to represent the actual physical interface.

The Virtual ANS works on the same principle as the original ANS instrument, translating image to sound. On the vertical axis, there are 120 distinct sine tones that can be triggered simultaneously. On the horizontal axis, each pixel column is played over a set duration. When users upload an image or draw and save an image, it is converted to grayscale and analyzed by pixel column with Pillow. I am scaling the amplitude based on pixel value, with white pixels being the loudest, and black pixels being silent. CSS3 animation is used to simulate the action of the physical interface.

Users can select images from an existing library, upload images, or draw, save, and play an image using a provided canvas. By registering, users gain access to uploading private images,  and have the ability to favorite images for easy access. I’ve used form type validation and bcrpyt for secure password encryption and storage. Uploaded images are moderated using the SightEngine API, which scans for and rejects images containing weapons, drugs, alcohol, and nudity, making the app accessible for users of all ages. 


