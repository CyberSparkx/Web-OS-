function openFakeChromeWindow() {
    const wrapper = document.createElement("div");
    wrapper.className = `
      absolute left-10 top-10 w-[1000px] h-[650px]
      rounded-xl shadow-2xl border border-gray-500
      flex flex-col z-[999] bg-[#0c3b44] text-white
      overflow-hidden resize
      min-w-[500px] min-h-[300px] max-w-[100vw] max-h-[100vh]
    `;
  
    wrapper.innerHTML = `
      <div id="chrome-header" class="
        bg-[#00b7f0] flex items-center justify-between px-4 py-2
        font-bold rounded-t-xl cursor-move
      ">
        <div class="flex items-center gap-3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/1024px-Google_Chrome_icon_%28February_2022%29.svg.png" alt="Chrome" class="w-5 h-5" />
          <span>New Tab</span>
          <span class="text-xl cursor-pointer">+</span>
        </div>
        <button id="closeBtn" class="text-white text-lg">❌</button>
      </div>
  
      <div class="bg-[#092e34] p-3 flex items-center gap-2">
        <button id="backBtn" class="text-white">◀</button>
        <button id="forwardBtn" class="text-white">▶</button>
        <input id="urlBar" type="text" placeholder="Search Wikipedia..."
          class="flex-1 px-4 py-2 text-black rounded-md text-sm focus:outline-none"
        />
        <button id="goBtn" class="bg-[#00b7f0] text-white px-4 py-2 rounded-md">Search</button>
      </div>
  
      <iframe id="wikiIframe" src="https://en.wikipedia.org" class="flex-1 border-none"></iframe>
    `;
  
    document.body.appendChild(wrapper);
  
    const iframe = wrapper.querySelector("#wikiIframe");
    const urlBar = wrapper.querySelector("#urlBar");
    const goBtn = wrapper.querySelector("#goBtn");
    const closeBtn = wrapper.querySelector("#closeBtn");
    const backBtn = wrapper.querySelector("#backBtn");
    const forwardBtn = wrapper.querySelector("#forwardBtn");
  
    function navigate() {
      const search = urlBar.value.trim();
      if (!search) return;
  
      const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(search.replace(/\s+/g, "_"))}`;
      iframe.src = wikiUrl;
    }
  
    goBtn.onclick = navigate;
    urlBar.onkeydown = (e) => {
      if (e.key === "Enter") navigate();
    };
    closeBtn.onclick = () => wrapper.remove();
  
    // Limited iframe history navigation
    backBtn.onclick = () => {
      try { iframe.contentWindow.history.back(); } catch {}
    };
    forwardBtn.onclick = () => {
      try { iframe.contentWindow.history.forward(); } catch {}
    };
  
    // Draggable logic
    const header = wrapper.querySelector("#chrome-header");
    let isDragging = false, offsetX = 0, offsetY = 0;
  
    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - wrapper.offsetLeft;
      offsetY = e.clientY - wrapper.offsetTop;
    });
  
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      wrapper.style.left = `${e.clientX - offsetX}px`;
      wrapper.style.top = `${e.clientY - offsetY}px`;
    });
  
    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }
  