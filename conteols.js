let isControlCenterOpen = false;

function toggleControlCenter() {
  const existing = document.getElementById("control-center");
  if (existing) {
    existing.remove();
    document.getElementById("brightness-overlay")?.remove();
    isControlCenterOpen = false;
    return;
  }

  isControlCenterOpen = true;

  // Brightness overlay
  const overlay = document.createElement("div");
  overlay.id = "brightness-overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "black",
    opacity: "0",
    pointerEvents: "none",
    transition: "opacity 0.3s ease",
    zIndex: "999"
  });
  document.body.appendChild(overlay);

  // Control Center
  const wrapper = document.createElement("div");
  wrapper.id = "control-center";
  wrapper.style = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 360px;
    z-index: 1000;
    background: rgba(25, 25, 25, 0.7);
    color: white;
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    backdrop-filter: blur(18px);
    padding: 1rem;
    font-family: sans-serif;
    transition: all 0.3s ease;
  `;

  wrapper.innerHTML = `
    <!-- Media Info -->
    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 14px;">Raabta (Kehte Hain Khuda)</div>
          <div style="font-size: 12px; color: #aaa;">T-Series</div>
        </div>
        <img src="https://i.ytimg.com/vi/k4yXQkG2s1E/hqdefault.jpg" style="width: 48px; height: 48px; border-radius: 0.5rem;" />
      </div>
      <div style="margin-top: 8px; display: flex; justify-content: space-around; font-size: 18px;">
        <button>⏮️</button>
        <button>⏯️</button>
        <button>⏭️</button>
      </div>
    </div>

    <!-- Toggle Buttons -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-top: 1rem;">
      ${[
        { id: "wifi", icon: "📶", label: "Wi-Fi" },
        { id: "bluetooth", icon: "🔷", label: "Bluetooth" },
        { id: "airplane", icon: "✈️", label: "Airplane" },
        { id: "battery", icon: "🔋", label: "Battery" },
        { id: "night", icon: "🌙", label: "Night" },
        { id: "hotspot", icon: "📡", label: "Hotspot" }
      ]
        .map(
          (btn) => `
        <button id="${btn.id}Btn" data-label="${btn.label}" data-active="false" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px;
          font-size: 12px;
          background: rgba(255, 255, 255, 0.06);
          border: none;
          border-radius: 0.5rem;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          <span class="icon" style="font-size: 20px;">${btn.icon}</span>
          <span class="label">${btn.label}</span>
        </button>
      `
        )
        .join("")}
    </div>

    <!-- Brightness -->
    <div style="margin-top: 1rem;">
      <label style="font-size: 12px;">Brightness</label>
      <input id="brightness" type="range" min="0" max="100" value="100" style="width: 100%;" />
    </div>

    <!-- Volume -->
    <div style="margin-top: 1rem;">
      <label style="font-size: 12px;">Volume</label>
      <input id="volume" type="range" min="0" max="100" value="60" style="width: 100%;" />
    </div>

    <!-- Footer -->
    <div style="margin-top: 1rem; display: flex; justify-content: space-between; font-size: 12px; color: #ccc;">
      <span>🔋 100%</span>
      <span>⚙️</span>
    </div>
  `;

  document.body.appendChild(wrapper);

  // Toggle logic for icons
  ["wifi", "bluetooth", "airplane", "battery", "night", "hotspot"].forEach((id) => {
    const btn = document.getElementById(`${id}Btn`);
    const icon = btn.querySelector(".icon");
    const label = btn.querySelector(".label");

    btn.addEventListener("click", () => {
      const isActive = btn.dataset.active === "true";
      btn.dataset.active = (!isActive).toString();
      btn.style.background = isActive ? "rgba(255, 255, 255, 0.06)" : "#3b82f6";
      icon.style.color = label.style.color = "white";
    });
  });

  // Brightness effect
  const brightness = document.getElementById("brightness");
  brightness.addEventListener("input", (e) => {
    const overlay = document.getElementById("brightness-overlay");
    const val = parseInt(e.target.value);
    overlay.style.opacity = `${(100 - val) / 100 * 0.5}`;
  });

  document.getElementById("volume").addEventListener("input", (e) => {
    console.log("Volume set to:", e.target.value);
  });
}
