## HTML5 heart rate monitor

An html5+js code that detects heart-rate of a person using a common webcam. 
Tested on Chromium 45.0.2454.101 Ubuntu 15.04 (64-bit).
Might run slow on some browsers/operating systems because it requires some computations. 
Inspired by [Eulerian Video Magnification](http://people.csail.mit.edu/mrub/vidmag/) and one of its implementations [webcam-pulse-detector](https://github.com/thearn/webcam-pulse-detector).

## How it works:

The application uses the differences in the skin color of the user throughout the time to try and guess his heart rate.
User has to place his head so that his forehead will be in the marked area. Some javascript code calculates the average of the green component of that marked area and stores a number of such samples coupled with their capture times in milliseconds. Then dft is performed on that data and frequencies between 30 bpm and 150 bpm are isolated and displayed as heart rate.

For security reasons browsers don't give webcam access to local files, so I used a simple nodejs server.

## Running:

### Local:
### Basic requirements:
- Nodejs 
- A modern web browser

Run 
```
npm install connect serve-static
node server.js
```

This will install the necessary dependencies and run a local server.
Open [localhost:8080](localhost:8080) on your browser to start the application.


### On a server:
if you have a server, just copy the files there and open index.html

## TODO

1. Change dft to fft.
2. Add some sort of image color stabilization 
3. Implement web worker support
