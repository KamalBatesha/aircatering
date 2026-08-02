const CaptureFullImage = async () => {
  try {
    // Ask user to share screen
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const track = stream.getVideoTracks()[0];

    // Create video element to play the stream
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    // Wait for video to be ready
    await new Promise((res) => {
      video.onloadedmetadata = () => {
        video.width = video.videoWidth;
        video.height = video.videoHeight;
        res();
      };
    });

    // Draw to canvas
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    await new Promise((res) => setTimeout(res, 500)); // wait for popup to disappear
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const dataUrl = canvas.toDataURL("image/png");

    // Stop sharing
    track.stop();

    return dataUrl;
  } catch (err) {
    console.error("Error capturing screen:", err);
    return null;
  }
};

export default CaptureFullImage;
