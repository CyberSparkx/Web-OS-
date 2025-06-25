function openVSCodeWindow() {
  const wrapper = document.createElement("div");
  wrapper.className =
    "absolute bg-[#1e1e1e] text-white border border-gray-700 rounded-lg shadow-lg w-[960px] h-[600px] flex flex-col";
  wrapper.style.left = "100px";
  wrapper.style.top = "100px";
  wrapper.style.zIndex = zIndexCounter++;

  const header = document.createElement("div");
  header.className = "bg-[#333333] px-3 py-2 flex justify-between items-center cursor-move";
  header.innerHTML = `
    <span>Fake VS Code</span>
    <div class="flex gap-2">
      <button class="minimize">🗕</button>
      <button class="maximize">🗖</button>
      <button class="close">❌</button>
    </div>
  `;

  const content = document.createElement("div");
  content.className = "flex-1 flex overflow-hidden";
  content.innerHTML = `
    <div class="w-1/5 bg-[#252526] p-2">
      <div class="text-xs text-gray-400">EXPLORER</div>
      <div class="text-white mt-2">index.html</div>
      <div class="text-white">style.css</div>
      <div class="text-white">main.js</div>
    </div>
    <div class="flex-1 bg-[#1e1e1e] p-4">
      <pre contenteditable="true" class="w-full h-full outline-none text-sm">/* Fake VS Code Editor */</pre>
    </div>
  `;

  wrapper.appendChild(header);
  wrapper.appendChild(content);
  desktop.appendChild(wrapper);

  makeDraggable(wrapper, header);

  header.querySelector(".close").onclick = () => wrapper.remove();
  header.querySelector(".minimize").onclick = () => {
    wrapper.style.display = "none";
    const icon = document.createElement("button");
    icon.textContent = "VS Code";
    icon.className = "bg-gray-700 text-xs px-3 py-1 rounded hover:bg-gray-600";
    icon.onclick = () => {
      wrapper.style.display = "block";
      wrapper.style.zIndex = zIndexCounter++;
      icon.remove();
    };
    dock.appendChild(icon);
  };

  let isMaximized = false;
  const originalSize = { width: "", height: "", left: "", top: "" };
  header.querySelector(".maximize").onclick = () => {
    const topNavHeight = document.getElementById("top-nav")?.offsetHeight || 50;
    const dockHeight = dock?.offsetHeight || 50;
    if (!isMaximized) {
      originalSize.width = wrapper.style.width;
      originalSize.height = wrapper.style.height;
      originalSize.left = wrapper.style.left;
      originalSize.top = wrapper.style.top;
      wrapper.style.left = "0";
      wrapper.style.top = `${topNavHeight}px`;
      wrapper.style.width = "100vw";
      wrapper.style.height = `calc(100vh - ${topNavHeight + dockHeight}px)`;
      wrapper.classList.add("rounded-none");
    } else {
      wrapper.style.width = originalSize.width;
      wrapper.style.height = originalSize.height;
      wrapper.style.left = originalSize.left;
      wrapper.style.top = originalSize.top;
      wrapper.classList.remove("rounded-none");
    }
    isMaximized = !isMaximized;
  };
}
