const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// navigator.mediaDevices.getUserMedia grabs user's camera source & asks permission to use it
// returns promise; call .then
// set video source to be mediaStream
// video.play captures continously to play it
// .catch is if user denies webcam access
function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(mediaStream => {
      video.srcObject = mediaStream;
      video.play();
    })
    .catch(err => {
      console.error(`Error`, err);
    });
}

// get width & height of video
// make canvas same width & height of video
// run function every 16ms (can make it anything) interval to take image from video
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    // gets data of pixels of image from webcam
      // returns array inside pixels.data
    let pixels = ctx.getImageData(0, 0, width, height);
    // Effects 
      // pixels = redEffect(pixels);
      // pixels = rgbSplit(pixels);
        // enables ghost-like filter
      // ctx.globalAlpha = 0.1; 
      pixels = greenScreen(pixels);

    // puts pixels back after taking their data from webcam iamge
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // plays sound
  snap.currentTime = 0;
  snap.play();

  // take data out of canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  // allows picture to be downloaded after its taken
  link.setAttribute('download', 'mypic');
  // creates snippit of pic taken at bottom
  link.innerHTML = `<img src="${data}" alt="pic of me" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  // loop over every pixel
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i] = pixels.data[i] + 100; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i]; // red
    pixels.data[i + 100] = pixels.data[i + 1]; // green
    pixels.data[i - 150] = pixels.data[i + 2]; // blue
  }
  return pixels;
}

function greenScreen(pixels) {
  // holds min/max green
  const levels = {};

  // select all rgb input sliders
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  // loop over every pixels
  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    // if level is anywhere between mix/max of values found in loop, remove alpha
    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
        // takes out alpha
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
  
}

getVideo();

video.addEventListener('canplay', paintToCanvas);