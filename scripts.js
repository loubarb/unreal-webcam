const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// navigator.mediaDevices.getUserMedia grabs user's camera source & asks permission to use it
// returns promise; call .then with localMediaStream
// set video source to be localMediaStream
  // window.URL.createObjectURL converts mediaStream into format to work with video player
// video.play captures continously to play it
// .catch is if user denies webcam access
function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      // console.log(localMediaStream);
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error(err);
    })
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
  }, 16);
}

getVideo();
paintToCanvas();