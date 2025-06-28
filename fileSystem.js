// Enhanced File Manager
function openFileManager() {
  const wrapper = document.createElement("div");
  wrapper.className =
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#1a1b26] text-white border border-gray-700 rounded-lg shadow-lg w-[64rem] h-[36rem] flex flex-col overflow-hidden font-sans backdrop-blur";

  const header = document.createElement("div");
  header.className =
    "flex justify-between items-center px-4 py-2 bg-[#2d3148] border-b border-gray-700 text-sm font-medium cursor-move";
  header.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="ml-2 font-semibold">File Manager</span>
    </div>
    <div class="flex items-center gap-2">
      <button id="minimize-btn" class="w-3 h-3 rounded-full bg-yellow-400 hover:opacity-75"></button>
      <button id="maximize-btn" class="w-3 h-3 rounded-full bg-green-400 hover:opacity-75"></button>
      <button id="close-btn" class="w-3 h-3 rounded-full bg-red-500 hover:opacity-75"></button>
    </div>
  `;

  const content = document.createElement("div");
  content.className = "flex-1 flex bg-[#1a1b26] overflow-hidden";

  const sidebar = document.createElement("div");
  sidebar.className =
    "w-48 border-r border-gray-700 bg-[#222431] text-sm overflow-auto flex flex-col py-2";

  const main = document.createElement("div");
  main.className = "flex-1 overflow-auto relative";

  const toolbar = document.createElement("div");
  toolbar.className = "p-2 bg-[#2d3148] flex justify-end border-b border-gray-700";
  const addBtn = document.createElement("button");
  addBtn.textContent = "+ New Folder";
  addBtn.className = "text-xs px-2 py-1 bg-blue-600 rounded hover:bg-blue-700";
  toolbar.appendChild(addBtn);
  main.appendChild(toolbar);

  const grid = document.createElement("div");
  grid.className =
    "grid grid-cols-6 gap-4 p-6 overflow-auto items-start justify-start text-center text-sm text-white select-none";
  main.appendChild(grid);

  const folderContents = {
    Home: ["Android", "Applications", "Desktop", "Documents"],
    Desktop: ["Shortcut.lnk", "Readme.txt"],
    Documents: ["Resume.docx", "Project.pdf"],
    Downloads: ["setup.exe", "image.png"],
    Music: ["track1.mp3", "track2.mp3"],
    Pictures: ["photo1.jpg", "photo2.jpg"],
    Videos: ["clip1.mp4", "movie.mkv"],
    Trash: ["old.txt"],
  };

  let currentFolder = "Home";

  function loadFolder(folderName) {
    currentFolder = folderName;
    const items = folderContents[folderName] || [];
    grid.innerHTML = "";

    items.forEach((item) => {
      const isFolder = !item.includes(".");
      const div = document.createElement("div");
      div.className = "flex flex-col items-center hover:scale-105 transition-transform cursor-pointer";
      div.innerHTML = `
        <img src="https://img.icons8.com/fluency/48/${isFolder ? "folder-invoices" : "document"}.png" class="w-12 h-12" />
        <span class="mt-1">${item}</span>
      `;
      div.ondblclick = () => {
        if (isFolder) {
          loadFolder(item);
        } else {
          openFile(item);
        }
      };
      grid.appendChild(div);
    });
  }

  function openFile(fileName) {
    const viewer = document.createElement("div");
    viewer.className = "absolute inset-0 bg-black bg-opacity-80 text-white flex flex-col items-center justify-center z-50";
    viewer.innerHTML = `
      <div class="bg-[#1a1b26] p-6 rounded shadow-xl max-w-xl text-center">
        <h2 class="text-xl font-bold mb-4">Opening: ${fileName}</h2>
        <p class="mb-4">Pretend this is a preview of the file contents...</p>
        <button class="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded" id="close-preview">Close</button>
      </div>
    `;
    viewer.querySelector("#close-preview").onclick = () => viewer.remove();
    main.appendChild(viewer);
  }

  addBtn.onclick = () => {
    const folderName = prompt("Enter new folder name:");
    if (!folderName) return;
    if (!folderContents[currentFolder]) folderContents[currentFolder] = [];
    folderContents[currentFolder].push(folderName);
    loadFolder(currentFolder);
  };

  const sidebarItems = [
    "Home",
    "Desktop",
    "Documents",
    "Downloads",
    "Music",
    "Pictures",
    "Videos",
    "Trash",
  ];

  sidebarItems.forEach((item) => {
    const el = document.createElement("div");
    el.textContent = item;
    el.className =
      "px-4 py-1.5 hover:bg-[#3a3f5c] cursor-pointer text-gray-200" +
      (item === "Home" ? " bg-pink-700 text-white" : "");
    el.onclick = () => loadFolder(item);
    sidebar.appendChild(el);
  });

  content.appendChild(sidebar);
  content.appendChild(main);
  wrapper.appendChild(header);
  wrapper.appendChild(content);
  desktop.appendChild(wrapper);

  makeDraggable(wrapper, header);
  makeResizable(wrapper);

  const minimize = header.querySelector("#minimize-btn");
  const maximize = header.querySelector("#maximize-btn");
  const close = header.querySelector("#close-btn");

  let isMaximized = false;
  const originalSize = {
    width: wrapper.style.width,
    height: wrapper.style.height,
    top: wrapper.style.top,
    left: wrapper.style.left,
  };

  minimize.onclick = () => {
    wrapper.style.display = "none";
    const icon = document.createElement("button");
    icon.textContent = "File Manager";
    icon.className = "bg-gray-700 text-xs px-3 py-1 rounded hover:bg-gray-600";
    icon.onclick = () => {
      wrapper.style.display = "block";
      wrapper.style.zIndex = zIndexCounter++;
      icon.remove();
    };
    dock.appendChild(icon);
  };

  maximize.onclick = () => {
    const topNavHeight = document.getElementById("top-nav")?.offsetHeight || 50;
    const dockHeight = dock?.offsetHeight || 50;

    if (!isMaximized) {
      originalSize.width = wrapper.style.width;
      originalSize.height = wrapper.style.height;
      originalSize.top = wrapper.style.top;
      originalSize.left = wrapper.style.left;
      wrapper.style.top = `${topNavHeight}px`;
      wrapper.style.left = "0px";
      wrapper.style.width = "100vw";
      wrapper.style.height = `calc(100vh - ${topNavHeight + dockHeight}px)`;
      wrapper.classList.add("rounded-none");
    } else {
      wrapper.style.width = originalSize.width;
      wrapper.style.height = originalSize.height;
      wrapper.style.top = originalSize.top;
      wrapper.style.left = originalSize.left;
      wrapper.classList.remove("rounded-none");
    }
    isMaximized = !isMaximized;
  };

  close.onclick = () => wrapper.remove();

  loadFolder("Home");
}
