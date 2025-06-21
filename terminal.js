// Terminal window creation
function openTerminalWindow() {
    const wrapper = document.createElement("div");
    wrapper.className =
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#121421]/95 text-white border border-gray-600 rounded-lg shadow-lg w-full max-w-3xl h-[32rem] flex flex-col overflow-hidden font-mono backdrop-blur";
  
    const header = document.createElement("div");
    header.className = "flex justify-between items-center px-3 py-2 bg-[#1f2333] text-gray-300 border-b border-gray-600 cursor-move";
    header.innerHTML = `
      <span class="text-pink-500 font-bold">Naren Roy's Terminal</span>
      <div class="flex gap-2">
        <button class="minimize">🗕</button>
        <button class="maximize">🗖</button>
        <button class="close">❌</button>
      </div>
    `;
  
    const terminal = document.createElement("div");
    terminal.id = "terminal";
    terminal.className = "flex-1 p-4 overflow-auto bg-gradient-to-br from-[#121421] to-[#1c1f2e] text-sm";
    terminal.innerHTML = `
      <pre class="text-white">
  <span class="text-green-500">OS:</span> Shery Linux x86_64
  <span class="text-green-500">Host:</span> G5 5590
  <span class="text-green-500">Kernel:</span> 6.6.1-zen1-1-zen
  <span class="text-green-500">Uptime:</span> 1 hour, 1 min
  <span class="text-green-500">Battery:</span> <span class="text-green-400">100%</span> [Full]
  
  <span class="text-green-500">Packages:</span> 1428 (pacman)[stable], 8 (flatpak)
  <span class="text-green-500">Shell:</span> fish 3.6.1
  <span class="text-green-500">Terminal:</span> konsole 23.8.2
  
  <span class="text-green-500">CPU:</span> Intel(R) Core(TM) i7-9750H (12) @ 4.50 GHz
  <span class="text-green-500">GPU:</span> Intel UHD Graphics 630
  <span class="text-green-500">GPU:</span> NVIDIA GeForce RTX 2060 Mobile
  <span class="text-green-500">Memory:</span> <span class="text-pink-400">5.90 GiB / 15.31 GiB (39%)</span>
      </pre>
      <div class="command-line">➜ <span class="text-pink-400">johnny@johnny</span> in ~<br/>λ echo <span class="text-blue-400">$SHELL</span><br/><span class="text-green-300">/usr/bin/fish</span></div>
      <div class="command-line">> <span contenteditable="true" id="terminal-input"></span></div>
    `;
  
    wrapper.appendChild(header);
    wrapper.appendChild(terminal);
    desktop.appendChild(wrapper);
  
    makeDraggable(wrapper, header);
    makeResizable(wrapper);
  
    header.querySelector(".close").onclick = () => wrapper.remove();
  
    header.querySelector(".minimize").onclick = () => {
      wrapper.style.display = "none";
      const icon = document.createElement("button");
      icon.textContent = "Terminal";
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
  
        wrapper.classList.add("left-0", "top-[50px]", "translate-x-0", "translate-y-0");
        wrapper.classList.remove("-translate-x-1/2", "-translate-y-1/2");
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
        wrapper.classList.remove("rounded-none", "left-0", "top-[50px]", "translate-x-0", "translate-y-0");
        wrapper.classList.add("-translate-x-1/2", "-translate-y-1/2");
      }
      isMaximized = !isMaximized;
    };
  
    terminal.addEventListener("keydown", (e) => {
      const input = terminal.querySelector("#terminal-input");
      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = input.textContent.trim();
        const response = document.createElement("div");
        response.innerHTML = `> ${cmd}<br/>${runCommand(cmd)}`;
        terminal.insertBefore(response, input.parentElement);
        input.textContent = "";
        terminal.scrollTop = terminal.scrollHeight;
      }
    });
  
    setTimeout(() => {
      const input = terminal.querySelector("#terminal-input");
      input?.focus();
    }, 100);
  }
  
  function runCommand(cmd) {
    switch (cmd.toLowerCase()) {
      case "help": return "Available commands: help, clear, hello, date, ls";
      case "hello": return "Hi! I'm your Garuda terminal.";
      case "clear": document.getElementById("terminal").innerHTML = ""; return "";
      case "date": return new Date().toString();
      case "ls": return "Documents\nProjects\nNotes.txt";
      default: return "Command not found";
    }
  }
  