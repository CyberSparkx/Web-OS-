let cameraMediaLibrary = []; // Array to store photos and videos

function openCameraApp() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Camera not supported in this browser.");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-black text-white border border-gray-600 rounded-lg shadow-lg w-[40rem] h-[32rem] flex flex-col overflow-hidden";
  
  const header = document.createElement("div");
  header.className = "flex justify-between items-center px-3 py-2 bg-gray-800 border-b border-gray-700";
  header.innerHTML = `
    <span class="font-bold">Camera App</span>
    <div class="flex gap-2">
      <button class="bg-red-500 px-2 py-1 rounded close-btn">❌</button>
    </div>
  `;

  const video = document.createElement("video");
  video.className = "flex-1 w-full object-cover";
  video.autoplay = true;

  const controls = document.createElement("div");
  controls.className = "flex justify-around items-center p-3 bg-gray-900 border-t border-gray-700";

  const recordBtn = document.createElement("button");
  recordBtn.textContent = "⏺ Record";
  recordBtn.className = "bg-red-600 px-3 py-1 rounded hover:bg-red-700";

  const photoBtn = document.createElement("button");
  photoBtn.textContent = "📸 Photo";
  photoBtn.className = "bg-blue-600 px-3 py-1 rounded hover:bg-blue-700";

  const galleryBtn = document.createElement("button");
  galleryBtn.textContent = "🖼 Gallery";
  galleryBtn.className = "bg-gray-600 px-3 py-1 rounded hover:bg-gray-700";

  controls.append(recordBtn, photoBtn, galleryBtn);
  wrapper.append(header, video, controls);
  document.body.appendChild(wrapper);

  let mediaStream = null;
  let mediaRecorder = null;
  let chunks = [];

  // Start webcam
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      mediaStream = stream;
      video.srcObject = stream;
    });

  // Record video
  let isRecording = false;
  recordBtn.addEventListener("click", () => {
    if (!isRecording) {
      chunks = [];
      mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        cameraMediaLibrary.push({ type: "video", url });
        alert("Video recorded and saved to gallery!");
      };
      mediaRecorder.start();
      recordBtn.textContent = "⏹ Stop";
    } else {
      mediaRecorder.stop();
      recordBtn.textContent = "⏺ Record";
    }
    isRecording = !isRecording;
  });

  // Take photo
  photoBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const url = canvas.toDataURL("image/png");
    cameraMediaLibrary.push({ type: "photo", url });
    alert("Photo taken and saved to gallery!");
  });

  // Gallery view
  galleryBtn.addEventListener("click", () => {
    const galleryWrapper = document.createElement("div");
    galleryWrapper.className = "absolute inset-0 bg-black/80 text-white p-6 overflow-auto z-50";
    const closeGallery = document.createElement("button");
    closeGallery.textContent = "✖ Close Gallery";
    closeGallery.className = "mb-4 bg-red-600 px-4 py-1 rounded";
    closeGallery.onclick = () => galleryWrapper.remove();

    const grid = document.createElement("div");
    grid.className = "grid grid-cols-3 gap-4";

    if (cameraMediaLibrary.length === 0) {
      grid.innerHTML = "<p class='col-span-3 text-center text-gray-400'>No media yet</p>";
    }

    cameraMediaLibrary.forEach(item => {
      const div = document.createElement("div");
      if (item.type === "photo") {
        div.innerHTML = `<img src="${item.url}" class="w-full rounded" />`;
      } else {
        div.innerHTML = `<video src="${item.url}" controls class="w-full rounded"></video>`;
      }
      grid.appendChild(div);
    });

    galleryWrapper.append(closeGallery, grid);
    document.body.appendChild(galleryWrapper);
  });

  // Close
  header.querySelector(".close-btn").addEventListener("click", () => {
    mediaStream?.getTracks().forEach(t => t.stop());
    wrapper.remove();
  });
}
