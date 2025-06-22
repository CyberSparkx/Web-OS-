let isMenuOpen = false;

function toggleStartMenu() {
  const existing = document.getElementById("start-menu");
  if (existing) {
    existing.classList.remove("scale-100");
    existing.classList.add("scale-0");
    setTimeout(() => existing.remove(), 200);
    isMenuOpen = false;
    return;
  }

  isMenuOpen = true;

  const menu = document.createElement("div");
  menu.id = "start-menu";
  menu.style = `
    position: fixed;
    left: 20px;
    bottom: 20px;
    width: 500px;
    height: 600px;
    background: rgba(20, 20, 20, 0.7);
    backdrop-filter: blur(14px);
    border-radius: 20px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    color: white;
    z-index: 1000;
    padding: 20px;
    transform-origin: bottom left;
    transition: transform 0.2s ease;
  `;
  menu.classList.add("scale-100");

  menu.innerHTML = `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      .scale-100 { animation: fadeIn 0.2s ease forwards; }
      .scale-0 { transform: scale(0); opacity: 0; }
      #start-menu input::placeholder {
        color: #ccc;
      }
      .app-icon {
        width: 64px;
        height: 64px;
        border-radius: 10px;
        padding: 10px;
        background: rgba(255,255,255,0.05);
        transition: transform 0.2s ease, background 0.3s;
        cursor: pointer;
      }
      .app-icon:hover {
        transform: scale(1.1);
        background: rgba(255,255,255,0.1);
      }
      .app-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        margin-top: 20px;
      }
    </style>

    <input type="text" placeholder="Search..." style="
      width: 100%;
      padding: 10px 15px;
      font-size: 16px;
      border: none;
      border-radius: 12px;
      margin-bottom: 20px;
      background: rgba(255,255,255,0.08);
      color: white;
      outline: none;
    " />

    <div class="app-grid">
      ${[
        { name: "Chrome", icon: "https://img.icons8.com/color/48/chrome--v1.png" },
        { name: "VS Code", icon: "https://img.icons8.com/color/48/visual-studio-code-2019.png" },
        { name: "Terminal", icon: "https://cdn-icons-png.flaticon.com/512/9796/9796882.png" },
        { name: "Spotify", icon: "https://img.icons8.com/color/48/spotify--v1.png" },
        { name: "Files", icon: "https://img.icons8.com/color/48/folder-invoices--v1.png" },
        { name: "YouTube", icon: "https://img.icons8.com/color/48/youtube-play.png" },
        { name: "Discord", icon: "https://img.icons8.com/color/48/discord--v1.png" },
        { name: "Notepad", icon: "https://img.icons8.com/fluency/48/notepad.png" },
        { name: "Calculator", icon: "https://img.icons8.com/fluency/48/calculator.png" },
        { name: "Camera", icon: "https://img.icons8.com/color/48/camera--v1.png" },
        { name: "Photoshop", icon: "https://img.icons8.com/color/48/adobe-photoshop--v1.png" },
        { name: "Settings", icon: "https://img.icons8.com/ios-filled/50/settings--v1.png" }
      ]
        .map(
          (app) => `
        <div class="app-icon" title="${app.name}">
          <img src="${app.icon}" alt="${app.name}" style="width: 100%; height: 100%;" />
        </div>`
        )
        .join("")}
    </div>
  `;

  document.body.appendChild(menu);
}

// Toggle menu with Windows key (Meta)
window.addEventListener("keydown", (e) => {
    if (e.metaKey && e.shiftKey) {
      toggleStartMenu();
    }
  });
  
