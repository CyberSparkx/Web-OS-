// main.js
const desktop = document.getElementById("desktop");
const contextMenu = document.getElementById("context-menu");
const dock = document.getElementById("dock");

let fileCounter = 1;
let folderCounter = 1;
let zIndexCounter = 10;

const defaultApps = [
  { type: "folder", title: "Documents" },
  { type: "folder", title: "Projects" },
  { type: "file", title: "Notes.txt" },
  { type: "app", title: "Window", icon: "https://img.icons8.com/?size=512&id=TuXN3JNUBGOT&format=png" },
  { type: "app", title: "Chrome", icon: "https://img.icons8.com/color/48/chrome--v1.png" },
  { type: "app", title: "Brave", icon: "https://img.icons8.com/color/48/brave-web-browser.png" },
  { type: "app", title: "VS Code", icon: "https://img.icons8.com/color/48/visual-studio-code-2019.png" },
  { type: "app", title: "Camera", icon: "https://img.icons8.com/color/48/camera.png" } // ✅ Camera app
];


window.addEventListener("DOMContentLoaded", () => {
  defaultApps.forEach((app, i) => {
    const topOffset = 80 + i * 80;
    createIcon(app.type, app.title, app.icon, 20, topOffset);
    if (app.type === "app") addDockShortcut(app.title, app.icon);
  });

  contextMenu.style.resize = "both";
  contextMenu.style.overflow = "auto";
  contextMenu.style.minWidth = "120px";
  contextMenu.style.minHeight = "80px";
});

function addDockShortcut(title, iconURL) {
  const button = document.createElement("button");
  button.className = "hover:scale-110 transition-transform";
  button.innerHTML = `<img src="${iconURL}" alt="${title}" title="${title}" class="w-10 h-10" />`;
  
  button.onclick = () => {
    if (title === "Chrome") {
      openFakeChromeWindow();
    }else if (title === "VS Code") {
      openVSCodeWindow();
    }else if (title === "Brave") {
      openFakeBraveWindow();
    }else if (title === "Camera") {
      openCameraApp();
    }else if (title === "Window") {
      toggleStartMenu();
    } else {
      alert(`${title} launched (demo)`);
    }
  };

  dock.appendChild(button);
}


desktop.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  contextMenu.style.left = `${e.pageX}px`;
  contextMenu.style.top = `${e.pageY}px`;
  contextMenu.classList.remove("hidden");
});

window.addEventListener("click", () => contextMenu.classList.add("hidden")); 

contextMenu.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  if (action === "create-folder") createIcon("folder");
  if (action === "create-file") createIcon("file");
});

// 

function createIcon(type, customTitle = null, customIcon = null, x = null, y = null) {
  const icon = document.createElement("div");
  icon.className = "absolute flex flex-col items-center text-xs text-white cursor-pointer";
  icon.style.left = x ? `${x}px` : `${100 + Math.random() * 300}px`;
  icon.style.top = y ? `${y}px` : `${100 + Math.random() * 300}px`;

  const title = customTitle || (type === "folder" ? `Folder ${folderCounter++}` : `File ${fileCounter++}`);
  const img = document.createElement("img");
  img.src = customIcon || (type === "folder"
    ? "https://img.icons8.com/ios-filled/50/ffffff/folder-invoices--v1.png"
    : "https://img.icons8.com/ios-glyphs/30/ffffff/edit--v1.png");
  img.className = "w-10 h-10";

  const label = document.createElement("span");
  label.textContent = title;

  icon.appendChild(img);
  icon.appendChild(label);
  desktop.appendChild(icon);

  makeDraggable(icon, icon);

  icon.ondblclick = () => {
    if (type === "file") openFileWindow(title);
    else if (type === "folder") openFolderWindow(title);
    else alert(`${title} launched (demo)`);
  };
}

function openFileWindow(title) {
  createWindow(title, "file");
}

function openFolderWindow(title) {
  createWindow(title, "folder");
}

function createWindow(title, type) {
  const wrapper = document.createElement("div");
  wrapper.className =
    "absolute bg-gray-800/90 text-white rounded-lg shadow-lg w-96 h-64 flex flex-col overflow-hidden";
  wrapper.style.left = `${100 + Math.random() * 300}px`;
  wrapper.style.top = `${100 + Math.random() * 200}px`;
  wrapper.style.zIndex = zIndexCounter++;

  const header = document.createElement("div");
  header.className = "bg-gray-700 text-sm px-3 py-2 flex justify-between items-center cursor-move";
  header.innerHTML = `
    <span>${title}</span>
    <div class="flex gap-2">
      <button class="minimize">🗕</button>
      <button class="maximize">🗖</button>
      <button class="close">❌</button>
    </div>
  `;

  const content = document.createElement("div");
  content.className = "flex-1 p-2 overflow-auto bg-black/30 ";
  if (type === "file") {
    content.contentEditable = "true";
    content.textContent = localStorage.getItem(`file-${title}`) || "Start typing...";
    content.dataset.title = title;
  } else {
    content.innerHTML = "<p>This is a folder window.</p>";
  }

  wrapper.appendChild(header);
  wrapper.appendChild(content);
  desktop.appendChild(wrapper);

  makeDraggable(wrapper, header);
  makeResizable(wrapper);

  header.querySelector(".close").onclick = () => wrapper.remove();

  header.querySelector(".minimize").onclick = () => {
    wrapper.style.display = "none";
    const icon = document.createElement("button");
    icon.textContent = title;
    icon.className = "bg-gray-700 text-xs px-3 py-1 rounded hover:bg-gray-600";
    icon.onclick = () => {
      wrapper.style.display = "block";
      wrapper.style.zIndex = zIndexCounter++;
      icon.remove();
    };
    dock.appendChild(icon);
  };

  let isMaximized = false;
  const originalSize = { width: "", height: "", top: "", left: "" };

  header.querySelector(".maximize").onclick = () => {
    const topNavHeight = document.getElementById("top-nav")?.offsetHeight || 50;
    const dockHeight = dock?.offsetHeight || 50;

    if (!isMaximized) {
      originalSize.width = wrapper.style.width;
      originalSize.height = wrapper.style.height;
      originalSize.left = wrapper.style.left;
      originalSize.top = wrapper.style.top;

      wrapper.style.left = "0px";
      wrapper.style.top = `${topNavHeight}px`;
      wrapper.style.width = "100%";
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

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "s" && type === "file") {
      e.preventDefault();
      localStorage.setItem(`file-${title}`, content.textContent);
      alert("File content saved!");
    }
  });
}

function makeDraggable(element, handle) {
  let isDragging = false, offsetX = 0, offsetY = 0;

  handle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    element.style.zIndex = zIndexCounter++;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

function makeResizable(element) {
  const directions = ["top", "right", "bottom", "left", "top-left", "top-right", "bottom-left", "bottom-right"];

  directions.forEach((dir) => {
    const resizer = document.createElement("div");
    resizer.className = `resizer resizer-${dir}`;
    resizer.style.position = "absolute";
    resizer.style.zIndex = "1000";

    switch (dir) {
      case "top": resizer.style.top = "0"; resizer.style.left = "0"; resizer.style.right = "0"; resizer.style.height = "5px"; resizer.style.cursor = "n-resize"; break;
      case "right": resizer.style.top = "0"; resizer.style.right = "0"; resizer.style.bottom = "0"; resizer.style.width = "5px"; resizer.style.cursor = "e-resize"; break;
      case "bottom": resizer.style.bottom = "0"; resizer.style.left = "0"; resizer.style.right = "0"; resizer.style.height = "5px"; resizer.style.cursor = "s-resize"; break;
      case "left": resizer.style.top = "0"; resizer.style.left = "0"; resizer.style.bottom = "0"; resizer.style.width = "5px"; resizer.style.cursor = "w-resize"; break;
      case "top-left": resizer.style.top = "0"; resizer.style.left = "0"; resizer.style.width = "10px"; resizer.style.height = "10px"; resizer.style.cursor = "nw-resize"; break;
      case "top-right": resizer.style.top = "0"; resizer.style.right = "0"; resizer.style.width = "10px"; resizer.style.height = "10px"; resizer.style.cursor = "ne-resize"; break;
      case "bottom-left": resizer.style.bottom = "0"; resizer.style.left = "0"; resizer.style.width = "10px"; resizer.style.height = "10px"; resizer.style.cursor = "sw-resize"; break;
      case "bottom-right": resizer.style.bottom = "0"; resizer.style.right = "0"; resizer.style.width = "10px"; resizer.style.height = "10px"; resizer.style.cursor = "se-resize"; break;
    }

    element.appendChild(resizer);

    let isResizing = false;

    resizer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isResizing = true;
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
      const startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
      const startTop = element.offsetTop;
      const startLeft = element.offsetLeft;

      function doDrag(e) {
        if (!isResizing) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (dir.includes("right")) element.style.width = `${Math.max(200, startWidth + dx)}px`;
        if (dir.includes("left")) {
          const newWidth = Math.max(200, startWidth - dx);
          element.style.width = `${newWidth}px`;
          element.style.left = `${startLeft + dx}px`;
        }
        if (dir.includes("bottom")) element.style.height = `${Math.max(100, startHeight + dy)}px`;
        if (dir.includes("top")) {
          const newHeight = Math.max(100, startHeight - dy);
          element.style.height = `${newHeight}px`;
          element.style.top = `${startTop + dy}px`;
        }
      }

      function stopDrag() {
        isResizing = false;
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
      }

      document.addEventListener("mousemove", doDrag);
      document.addEventListener("mouseup", stopDrag);
    });
  });
}
