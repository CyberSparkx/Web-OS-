function openVSCodeWindow() {
  // Create main wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "vscode-window";
  wrapper.style.cssText = `
    position: absolute;
    left: 100px;
    top: 100px;
    width: 1200px;
    height: 700px;
    background: #1e1e1e;
    border: 1px solid #464647;
    border-radius: 8px;
    overflow: hidden;
    font-family: 'Segoe UI', Consolas, monospace;
    font-size: 13px;
    color: #cccccc;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    z-index: ${window.zIndexCounter || 1000};
    display: flex;
    flex-direction: column;
  `;

  // Title bar
  const titleBar = document.createElement("div");
  titleBar.style.cssText = `
    height: 30px;
    background: #3c3c3c;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    cursor: move;
    user-select: none;
    border-bottom: 1px solid #2d2d30;
  `;
  
  titleBar.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 16px; height: 16px; background: #007acc; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">VS</div>
      <span style="font-size: 13px;">Visual Studio Code</span>
    </div>
    <div style="display: flex; gap: 1px;">
      <button class="win-btn minimize" style="background: none; border: none; color: #cccccc; padding: 8px 12px; cursor: pointer; font-size: 12px;">−</button>
      <button class="win-btn maximize" style="background: none; border: none; color: #cccccc; padding: 8px 12px; cursor: pointer; font-size: 12px;">□</button>
      <button class="win-btn close" style="background: none; border: none; color: #cccccc; padding: 8px 12px; cursor: pointer; font-size: 12px;">×</button>
    </div>
  `;

  // Menu bar
  const menuBar = document.createElement("div");
  menuBar.style.cssText = `
    height: 30px;
    background: #2d2d30;
    display: flex;
    align-items: center;
    padding: 0 15px;
    border-bottom: 1px solid #1e1e1e;
    gap: 20px;
  `;
  
  const menus = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];
  menuBar.innerHTML = menus.map(menu => 
    `<span style="padding: 5px 8px; cursor: pointer; border-radius: 3px;" onmouseover="this.style.background='#505050'" onmouseout="this.style.background='transparent'">${menu}</span>`
  ).join('');

  // Main content area
  const mainContent = document.createElement("div");
  mainContent.style.cssText = `
    flex: 1;
    display: flex;
    overflow: hidden;
  `;

  // Activity bar (left sidebar)
  const activityBar = document.createElement("div");
  activityBar.style.cssText = `
    width: 50px;
    background: #333333;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0;
    gap: 15px;
    border-right: 1px solid #2d2d30;
  `;

  const activities = [
    { icon: '📁', name: 'Explorer', active: true },
    { icon: '🔍', name: 'Search', active: false },
    { icon: '🌿', name: 'Source Control', active: false },
    { icon: '🐛', name: 'Run and Debug', active: false },
    { icon: '📦', name: 'Extensions', active: false }
  ];

  activities.forEach(activity => {
    const btn = document.createElement("div");
    btn.style.cssText = `
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 5px;
      font-size: 16px;
      ${activity.active ? 'background: #37373d; border-left: 2px solid #007acc;' : ''}
    `;
    btn.innerHTML = activity.icon;
    btn.title = activity.name;
    btn.onmouseover = () => !activity.active && (btn.style.background = '#2a2d2e');
    btn.onmouseout = () => !activity.active && (btn.style.background = 'transparent');
    activityBar.appendChild(btn);
  });

  // Sidebar (file explorer)
  const sidebar = document.createElement("div");
  sidebar.style.cssText = `
    width: 250px;
    background: #252526;
    border-right: 1px solid #2d2d30;
    display: flex;
    flex-direction: column;
  `;

  const sidebarHeader = document.createElement("div");
  sidebarHeader.style.cssText = `
    padding: 10px 15px;
    background: #2d2d30;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #1e1e1e;
  `;
  sidebarHeader.textContent = 'EXPLORER';

  const fileTree = document.createElement("div");
  fileTree.style.cssText = `
    flex: 1;
    padding: 10px;
    overflow-y: auto;
  `;

  // Sample file structure
  const files = [
    { name: '📁 src', type: 'folder', level: 0, expanded: true },
    { name: '📄 index.html', type: 'file', level: 1, ext: 'html' },
    { name: '📄 style.css', type: 'file', level: 1, ext: 'css' },
    { name: '📄 main.js', type: 'file', level: 1, ext: 'js' },
    { name: '📁 components', type: 'folder', level: 1, expanded: false },
    { name: '📄 App.jsx', type: 'file', level: 2, ext: 'jsx' },
    { name: '📄 package.json', type: 'file', level: 0, ext: 'json' },
    { name: '📄 README.md', type: 'file', level: 0, ext: 'md' }
  ];

  files.forEach(file => {
    const fileEl = document.createElement("div");
    fileEl.style.cssText = `
      padding: 3px 0 3px ${file.level * 20}px;
      cursor: pointer;
      border-radius: 3px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 5px;
    `;
    fileEl.innerHTML = file.name;
    fileEl.onmouseover = () => fileEl.style.background = '#2a2d2e';
    fileEl.onmouseout = () => fileEl.style.background = 'transparent';
    
    if (file.type === 'file') {
      fileEl.onclick = () => openFileInEditor(file.name.replace('📄 ', ''), file.ext);
    }
    
    fileTree.appendChild(fileEl);
  });

  sidebar.appendChild(sidebarHeader);
  sidebar.appendChild(fileTree);

  // Editor area
  const editorArea = document.createElement("div");
  editorArea.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #1e1e1e;
  `;

  // Tab bar
  const tabBar = document.createElement("div");
  tabBar.className = "tab-bar";
  tabBar.style.cssText = `
    height: 35px;
    background: #2d2d30;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #1e1e1e;
    overflow-x: auto;
  `;

  // Editor content
  const editorContent = document.createElement("div");
  editorContent.className = "editor-content";
  editorContent.style.cssText = `
    flex: 1;
    background: #1e1e1e;
    position: relative;
    overflow: hidden;
  `;

  // Welcome screen
  const welcomeScreen = document.createElement("div");
  welcomeScreen.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    padding: 40px;
  `;
  
  welcomeScreen.innerHTML = `
    <div style="font-size: 48px; margin-bottom: 20px;">👋</div>
    <h2 style="margin-bottom: 20px; font-weight: 300;">Welcome to VS Code Clone</h2>
    <p style="color: #8c8c8c; margin-bottom: 30px;">Click on a file in the explorer to start editing</p>
    <div style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
      <button onclick="createNewFile()" style="padding: 10px 20px; background: #0e639c; border: none; color: white; border-radius: 3px; cursor: pointer;">New File</button>
      <button onclick="openFolder()" style="padding: 10px 20px; background: #2d2d30; border: 1px solid #464647; color: #cccccc; border-radius: 3px; cursor: pointer;">Open Folder</button>
    </div>
  `;

  editorContent.appendChild(welcomeScreen);
  editorArea.appendChild(tabBar);
  editorArea.appendChild(editorContent);

  // Status bar
  const statusBar = document.createElement("div");
  statusBar.style.cssText = `
    height: 22px;
    background: #007acc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    font-size: 12px;
    color: white;
  `;
  
  statusBar.innerHTML = `
    <div style="display: flex; gap: 15px;">
      <span>🌿 main</span>
      <span>✓ No problems</span>
    </div>
    <div style="display: flex; gap: 15px;">
      <span>Ln 1, Col 1</span>
      <span>UTF-8</span>
      <span>JavaScript</span>
    </div>
  `;

  // Assemble the window
  mainContent.appendChild(activityBar);
  mainContent.appendChild(sidebar);
  mainContent.appendChild(editorArea);

  wrapper.appendChild(titleBar);
  wrapper.appendChild(menuBar);
  wrapper.appendChild(mainContent);
  wrapper.appendChild(statusBar);

  // Add to document
  document.body.appendChild(wrapper);

  // Variables for editor management
  let openTabs = [];
  let activeTab = null;

  // File opening functionality
  function openFileInEditor(fileName, extension, customContent = null) {
    // Check if tab already exists
    const existingTab = openTabs.find(tab => tab.name === fileName);
    if (existingTab) {
      switchToTab(existingTab);
      return;
    }

    // Create new tab
    const tab = {
      name: fileName,
      extension: extension,
      content: customContent || getSampleContent(fileName, extension),
      id: Date.now()
    };

    openTabs.push(tab);
    createTabElement(tab);
    switchToTab(tab);
  }

  function createTabElement(tab) {
    const tabEl = document.createElement("div");
    tabEl.className = "editor-tab";
    tabEl.dataset.tabId = tab.id;
    tabEl.style.cssText = `
      display: flex;
      align-items: center;
      padding: 8px 15px;
      background: #2d2d30;
      border-right: 1px solid #1e1e1e;
      cursor: pointer;
      min-width: 120px;
      gap: 8px;
      font-size: 12px;
    `;
    
    tabEl.innerHTML = `
      <span>${getFileIcon(tab.extension)}</span>
      <span style="flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${tab.name}</span>
      <span class="tab-close" style="padding: 2px 4px; border-radius: 3px; cursor: pointer; font-size: 14px;">×</span>
    `;

    tabEl.onclick = (e) => {
      if (!e.target.classList.contains('tab-close')) {
        switchToTab(tab);
      }
    };

    tabEl.querySelector('.tab-close').onclick = (e) => {
      e.stopPropagation();
      closeTab(tab);
    };

    tabBar.appendChild(tabEl);
  }

  function switchToTab(tab) {
    // Update tab appearances
    document.querySelectorAll('.editor-tab').forEach(el => {
      el.style.background = '#2d2d30';
      el.style.color = '#cccccc';
    });

    const tabEl = document.querySelector(`[data-tab-id="${tab.id}"]`);
    if (tabEl) {
      tabEl.style.background = '#1e1e1e';
      tabEl.style.color = '#ffffff';
    }

    // Update editor content
    editorContent.innerHTML = `
      <div style="height: 100%; padding: 20px; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.5;">
        <pre style="margin: 0; white-space: pre-wrap; color: #d4d4d4;">${syntaxHighlight(tab.content, tab.extension)}</pre>
      </div>
    `;

    activeTab = tab;
  }

  function closeTab(tab) {
    openTabs = openTabs.filter(t => t.id !== tab.id);
    const tabEl = document.querySelector(`[data-tab-id="${tab.id}"]`);
    if (tabEl) tabEl.remove();

    if (activeTab && activeTab.id === tab.id) {
      if (openTabs.length > 0) {
        switchToTab(openTabs[openTabs.length - 1]);
      } else {
        editorContent.innerHTML = welcomeScreen.outerHTML;
        activeTab = null;
      }
    }
  }

  function getSampleContent(fileName, extension) {
    const samples = {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <h1>Hello, World!</h1>
        <p>Welcome to my web application.</p>
        <button onclick="sayHello()">Click me!</button>
    </div>
    <script src="main.js"></script>
</body>
</html>`,
      'style.css': `/* Modern CSS Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

#app {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
}

h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

button {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 1.1rem;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}`,
      'main.js': `// Modern JavaScript with ES6+ features
const app = {
    init() {
        console.log('🚀 App initialized!');
        this.setupEventListeners();
        this.loadData();
    },

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded');
        });
    },

    async loadData() {
        try {
            // Simulate API call
            const data = await this.fetchData();
            console.log('Data loaded:', data);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    },

    fetchData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    message: 'Hello from the API!',
                    timestamp: new Date().toISOString(),
                    users: ['Alice', 'Bob', 'Charlie']
                });
            }, 1000);
        });
    }
};

function sayHello() {
    const messages = [
        '👋 Hello there!',
        '🎉 Awesome!',
        '✨ Great job!',
        '🚀 Keep going!',
        '💫 Fantastic!'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    alert(randomMessage);
}

// Initialize app
app.init();`,
      'package.json': `{
  "name": "my-web-app",
  "version": "1.0.0",
  "description": "A modern web application",
  "main": "index.html",
  "scripts": {
    "start": "live-server",
    "build": "webpack --mode production",
    "dev": "webpack serve --mode development",
    "test": "jest"
  },
  "keywords": [
    "javascript",
    "web",
    "frontend"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.22.0",
    "webpack": "^5.88.0",
    "jest": "^29.5.0"
  }
}`,
      'README.md': `# My Web Application

A modern, responsive web application built with vanilla JavaScript, HTML5, and CSS3.

## Features

- 🎨 Modern UI with gradient backgrounds
- 📱 Fully responsive design
- ⚡ Fast and lightweight
- 🔧 Easy to customize
- 🚀 Production ready

## Getting Started

### Prerequisites

- A modern web browser
- Basic knowledge of HTML, CSS, and JavaScript

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/my-web-app.git
   \`\`\`

2. Open \`index.html\` in your browser

3. Start coding!

## Project Structure

\`\`\`
my-web-app/
├── index.html      # Main HTML file
├── style.css       # Styles and animations
├── main.js         # JavaScript functionality
├── package.json    # Project dependencies
└── README.md       # This file
\`\`\`

## Contributing

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Happy coding! 🎉`
    };

    return samples[fileName] || `// ${fileName}\n\n// Start coding here...`;
  }

  function getFileIcon(extension) {
    const icons = {
      'html': '🌐',
      'css': '🎨',
      'js': '⚡',
      'jsx': '⚛️',
      'json': '📋',
      'md': '📝',
      'py': '🐍',
      'java': '☕',
      'cpp': '⚙️',
      'php': '🐘'
    };
    return icons[extension] || '📄';
  }

  function syntaxHighlight(code, extension) {
    // Simple syntax highlighting for demonstration
    let highlighted = code;
    
    if (extension === 'js' || extension === 'jsx') {
      highlighted = highlighted
        .replace(/(const|let|var|function|class|if|else|for|while|return|import|export|async|await)/g, '<span style="color: #569cd6;">$1</span>')
        .replace(/(true|false|null|undefined)/g, '<span style="color: #569cd6;">$1</span>')
        .replace(/('.*?'|".*?")/g, '<span style="color: #ce9178;">$1</span>')
        .replace(/(\/\/.*$)/gm, '<span style="color: #6a9955;">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6a9955;">$1</span>');
    } else if (extension === 'css') {
      highlighted = highlighted
        .replace(/([.#]?[a-zA-Z-]+)(\s*{)/g, '<span style="color: #d7ba7d;">$1</span>$2')
        .replace(/(color|background|margin|padding|font-size|display|position|width|height|border|flex|grid):/g, '<span style="color: #92c5f8;">$1</span>:')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6a9955;">$1</span>');
    } else if (extension === 'html') {
      highlighted = highlighted
        .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)/g, '$1<span style="color: #569cd6;">$2</span>')
        .replace(/(=")([^"]*?)(")/g, '=<span style="color: #ce9178;">"$2"</span>')
        .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color: #6a9955;">$1</span>');
    }
    
    return highlighted;
  }

  // Window controls functionality
  let isMaximized = false;
  const originalBounds = {};

  titleBar.querySelector('.minimize').onclick = () => {
    wrapper.style.display = 'none';
    // Add to taskbar if available
    if (window.dock) {
      const dockItem = document.createElement('button');
      dockItem.textContent = 'VS Code';
      dockItem.onclick = () => {
        wrapper.style.display = 'block';
        dockItem.remove();
      };
      window.dock.appendChild(dockItem);
    }
  };

  titleBar.querySelector('.maximize').onclick = () => {
    if (!isMaximized) {
      originalBounds.left = wrapper.style.left;
      originalBounds.top = wrapper.style.top;
      originalBounds.width = wrapper.style.width;
      originalBounds.height = wrapper.style.height;
      
      wrapper.style.left = '0px';
      wrapper.style.top = '0px';
      wrapper.style.width = '100vw';
      wrapper.style.height = '100vh';
      wrapper.style.borderRadius = '0';
    } else {
      wrapper.style.left = originalBounds.left;
      wrapper.style.top = originalBounds.top;
      wrapper.style.width = originalBounds.width;
      wrapper.style.height = originalBounds.height;
      wrapper.style.borderRadius = '8px';
    }
    isMaximized = !isMaximized;
  };

  titleBar.querySelector('.close').onclick = () => {
    wrapper.remove();
  };

  // Make draggable
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  titleBar.onmousedown = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(wrapper.style.left, 10);
    startTop = parseInt(wrapper.style.top, 10);
    
    document.onmousemove = (e) => {
      if (!isDragging) return;
      wrapper.style.left = (startLeft + e.clientX - startX) + 'px';
      wrapper.style.top = (startTop + e.clientY - startY) + 'px';
    };
    
    document.onmouseup = () => {
      isDragging = false;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  // File management functionality
  function createNewFile() {
    showNewFileDialog();
  }

  function openFile() {
    showOpenFileDialog();
  }

  function showNewFileDialog() {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: 'Segoe UI', sans-serif;
    `;

    dialog.innerHTML = `
      <div style="background: #2d2d30; border: 1px solid #464647; border-radius: 8px; padding: 30px; min-width: 400px; color: #cccccc;">
        <h3 style="margin: 0 0 20px 0; color: #ffffff;">Create New File</h3>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-size: 13px;">File Name:</label>
          <input type="text" id="newFileName" placeholder="example.js" style="width: 100%; padding: 8px; background: #1e1e1e; border: 1px solid #464647; color: #cccccc; border-radius: 4px; font-size: 14px;" />
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 5px; font-size: 13px;">File Type:</label>
          <select id="fileType" style="width: 100%; padding: 8px; background: #1e1e1e; border: 1px solid #464647; color: #cccccc; border-radius: 4px; font-size: 14px;">
            <option value="js">JavaScript (.js)</option>
            <option value="html">HTML (.html)</option>
            <option value="css">CSS (.css)</option>
            <option value="jsx">React JSX (.jsx)</option>
            <option value="ts">TypeScript (.ts)</option>
            <option value="py">Python (.py)</option>
            <option value="java">Java (.java)</option>
            <option value="cpp">C++ (.cpp)</option>
            <option value="json">JSON (.json)</option>
            <option value="md">Markdown (.md)</option>
            <option value="txt">Text (.txt)</option>
            <option value="xml">XML (.xml)</option>
            <option value="php">PHP (.php)</option>
            <option value="sql">SQL (.sql)</option>
          </select>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button id="cancelNew" style="padding: 8px 16px; background: #2d2d30; border: 1px solid #464647; color: #cccccc; border-radius: 4px; cursor: pointer;">Cancel</button>
          <button id="createNew" style="padding: 8px 16px; background: #0e639c; border: none; color: white; border-radius: 4px; cursor: pointer;">Create</button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    const fileNameInput = dialog.querySelector('#newFileName');
    const fileTypeSelect = dialog.querySelector('#fileType');
    
    fileNameInput.focus();

    // Auto-update filename when file type changes
    fileTypeSelect.onchange = () => {
      const currentName = fileNameInput.value;
      const nameWithoutExt = currentName.replace(/\.[^/.]+$/, "");
      const baseName = nameWithoutExt || 'untitled';
      fileNameInput.value = `${baseName}.${fileTypeSelect.value}`;
    };

    dialog.querySelector('#createNew').onclick = () => {
      const fileName = fileNameInput.value.trim();
      const fileType = fileTypeSelect.value;
      
      if (!fileName) {
        alert('Please enter a file name');
        return;
      }

      const extension = fileName.split('.').pop() || fileType;
      const finalFileName = fileName.includes('.') ? fileName : `${fileName}.${fileType}`;
      
      openFileInEditor(finalFileName, extension, getNewFileTemplate(extension));
      addFileToExplorer(finalFileName, extension);
      dialog.remove();
    };

    dialog.querySelector('#cancelNew').onclick = () => dialog.remove();
    
    // Close on escape or outside click
    dialog.onclick = (e) => e.target === dialog && dialog.remove();
    document.addEventListener('keydown', function escListener(e) {
      if (e.key === 'Escape') {
        dialog.remove();
        document.removeEventListener('keydown', escListener);
      }
    });
  }

  function showOpenFileDialog() {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: 'Segoe UI', sans-serif;
    `;

    dialog.innerHTML = `
      <div style="background: #2d2d30; border: 1px solid #464647; border-radius: 8px; padding: 30px; min-width: 500px; max-width: 80%; max-height: 80%; color: #cccccc; display: flex; flex-direction: column;">
        <h3 style="margin: 0 0 20px 0; color: #ffffff;">Open File</h3>
        <div style="margin-bottom: 15px;">
          <input type="file" id="fileInput" multiple accept=".js,.html,.css,.jsx,.ts,.py,.java,.cpp,.json,.md,.txt,.xml,.php,.sql" style="width: 100%; padding: 8px; background: #1e1e1e; border: 1px solid #464647; color: #cccccc; border-radius: 4px; font-size: 14px;" />
        </div>
        <div style="margin-bottom: 15px; font-size: 13px; color: #8c8c8c;">
          Or paste content directly:
        </div>
        <div style="margin-bottom: 15px; display: flex; gap: 10px;">
          <input type="text" id="pasteFileName" placeholder="filename.js" style="flex: 1; padding: 8px; background: #1e1e1e; border: 1px solid #464647; color: #cccccc; border-radius: 4px; font-size: 14px;" />
        </div>
        <textarea id="pasteContent" placeholder="Paste your code here..." style="flex: 1; min-height: 200px; padding: 12px; background: #1e1e1e; border: 1px solid #464647; color: #cccccc; border-radius: 4px; font-size: 14px; font-family: 'Consolas', monospace; resize: vertical;"></textarea>
        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
          <button id="cancelOpen" style="padding: 8px 16px; background: #2d2d30; border: 1px solid #464647; color: #cccccc; border-radius: 4px; cursor: pointer;">Cancel</button>
          <button id="openFiles" style="padding: 8px 16px; background: #0e639c; border: none; color: white; border-radius: 4px; cursor: pointer;">Open</button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    const fileInput = dialog.querySelector('#fileInput');
    const pasteFileName = dialog.querySelector('#pasteFileName');
    const pasteContent = dialog.querySelector('#pasteContent');

    dialog.querySelector('#openFiles').onclick = async () => {
      // Handle file input
      if (fileInput.files.length > 0) {
        for (const file of fileInput.files) {
          try {
            const content = await readFileContent(file);
            const extension = file.name.split('.').pop() || 'txt';
            openFileInEditor(file.name, extension, content);
            addFileToExplorer(file.name, extension);
          } catch (error) {
            console.error('Error reading file:', error);
            alert(`Error reading file: ${file.name}`);
          }
        }
      }

      // Handle pasted content
      if (pasteContent.value.trim() && pasteFileName.value.trim()) {
        const fileName = pasteFileName.value.trim();
        const extension = fileName.split('.').pop() || 'txt';
        openFileInEditor(fileName, extension, pasteContent.value);
        addFileToExplorer(fileName, extension);
      }

      dialog.remove();
    };

    dialog.querySelector('#cancelOpen').onclick = () => dialog.remove();
    
    dialog.onclick = (e) => e.target === dialog && dialog.remove();
    document.addEventListener('keydown', function escListener(e) {
      if (e.key === 'Escape') {
        dialog.remove();
        document.removeEventListener('keydown', escListener);
      }
    });
  }

  function readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  function getNewFileTemplate(extension) {
    const templates = {
      'js': `// ${new Date().toLocaleDateString()} - New JavaScript file
console.log('Hello, JavaScript!');

// Your code here...
`,
      'html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`,
      'css': `/* New CSS file - ${new Date().toLocaleDateString()} */

body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

/* Your styles here... */
`,
      'jsx': `import React from 'react';

const NewComponent = () => {
    return (
        <div>
            <h1>Hello, React!</h1>
        </div>
    );
};

export default NewComponent;
`,
      'ts': `// TypeScript file - ${new Date().toLocaleDateString()}

interface User {
    name: string;
    age: number;
}

const user: User = {
    name: 'John Doe',
    age: 30
};

console.log(user);
`,
      'py': `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
New Python file - ${new Date().toLocaleDateString()}
"""

def main():
    print("Hello, Python!")

if __name__ == "__main__":
    main()
`,
      'java': `public class NewClass {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
`,
      'cpp': `#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
}
`,
      'json': `{
    "name": "new-file",
    "version": "1.0.0",
    "description": "A new JSON file"
}
`,
      'md': `# New Markdown File

Created on ${new Date().toLocaleDateString()}

## Getting Started

Write your markdown content here...

### Features

- **Bold text**
- *Italic text*
- \`Code snippets\`
- [Links](https://example.com)

### Code Block

\`\`\`javascript
console.log('Hello, Markdown!');
\`\`\`
`,
      'txt': `New text file created on ${new Date().toLocaleDateString()}

Write your content here...
`,
      'xml': `<?xml version="1.0" encoding="UTF-8"?>
<root>
    <item>
        <name>Example</name>
        <value>Hello, XML!</value>
    </item>
</root>
`,
      'php': `<?php
// New PHP file - ${new Date().toLocaleDateString()}

echo "Hello, PHP!";

// Your code here...
?>
`,
      'sql': `-- New SQL file - ${new Date().toLocaleDateString()}

SELECT 'Hello, SQL!' as greeting;

-- Your queries here...
`
    };

    return templates[extension] || `// New ${extension} file\n// Created on ${new Date().toLocaleDateString()}\n\n// Your code here...\n`;
  }

  function addFileToExplorer(fileName, extension) {
    const newFileEl = document.createElement("div");
    newFileEl.style.cssText = `
      padding: 3px 0 3px 20px;
      cursor: pointer;
      border-radius: 3px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 5px;
    `;
    newFileEl.innerHTML = `${getFileIcon(extension)} ${fileName}`;
    newFileEl.onmouseover = () => newFileEl.style.background = '#2a2d2e';
    newFileEl.onmouseout = () => newFileEl.style.background = 'transparent';
    newFileEl.onclick = () => openFileInEditor(fileName, extension);
    
    fileTree.appendChild(newFileEl);
  }

  // Add context menu to file explorer
  fileTree.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY);
  });

  function showContextMenu(x, y) {
    const menu = document.createElement('div');
    menu.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      background: #2d2d30;
      border: 1px solid #464647;
      border-radius: 4px;
      padding: 5px 0;
      z-index: 10001;
      min-width: 150px;
      font-size: 12px;
      color: #cccccc;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;

    const menuItems = [
      { text: '📄 New File', action: createNewFile },
      { text: '📁 New Folder', action: () => alert('New Folder feature coming soon!') },
      { text: '───────────', action: null },
      { text: '📂 Open File', action: openFile },
      { text: '🔄 Refresh', action: () => location.reload() }
    ];

    menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      if (item.text.includes('─')) {
        menuItem.style.cssText = 'height: 1px; background: #464647; margin: 3px 0;';
      } else {
        menuItem.style.cssText = `
          padding: 8px 15px;
          cursor: pointer;
          transition: background 0.1s;
        `;
        menuItem.textContent = item.text;
        menuItem.onmouseover = () => menuItem.style.background = '#505050';
        menuItem.onmouseout = () => menuItem.style.background = 'transparent';
        if (item.action) {
          menuItem.onclick = () => {
            item.action();
            menu.remove();
          };
        }
      }
      menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);

    const closeMenu = () => menu.remove();
    setTimeout(() => document.addEventListener('click', closeMenu, { once: true }), 0);
  }

  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'n':
          e.preventDefault();
          createNewFile();
          break;
        case 'o':
          e.preventDefault();
          openFile();
          break;
        case 's':
          e.preventDefault();
          saveCurrentFile();
          break;
      }
    }
  });

  function saveCurrentFile() {
    if (!activeTab) {
      alert('No file is currently open');
      return;
    }
    
    // In a real implementation, this would save to the file system
    alert(`File "${activeTab.name}" saved successfully!`);
  }

  // Update menu bar File menu functionality
  const fileMenu = menuBar.children[0];
  fileMenu.onclick = (e) => {
    e.stopPropagation();
    showFileMenu(e.target);
  };

  function showFileMenu(target) {
    const rect = target.getBoundingClientRect();
    const menu = document.createElement('div');
    menu.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.bottom}px;
      background: #2d2d30;
      border: 1px solid #464647;
      border-radius: 4px;
      padding: 5px 0;
      z-index: 10001;
      min-width: 200px;
      font-size: 12px;
      color: #cccccc;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;

    const fileMenuItems = [
      { text: 'New File', shortcut: 'Ctrl+N', action: createNewFile },
      { text: 'Open File...', shortcut: 'Ctrl+O', action: openFile },
      { text: '───────────', shortcut: '', action: null },
      { text: 'Save', shortcut: 'Ctrl+S', action: saveCurrentFile },
      { text: 'Save As...', shortcut: 'Ctrl+Shift+S', action: () => alert('Save As coming soon!') }
    ];

    fileMenuItems.forEach(item => {
      const menuItem = document.createElement('div');
      if (item.text.includes('─')) {
        menuItem.style.cssText = 'height: 1px; background: #464647; margin: 3px 0;';
      } else {
        menuItem.style.cssText = `
          padding: 8px 15px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        `;
        menuItem.innerHTML = `
          <span>${item.text}</span>
          <span style="color: #8c8c8c; font-size: 11px;">${item.shortcut}</span>
        `;
        menuItem.onmouseover = () => menuItem.style.background = '#505050';
        menuItem.onmouseout = () => menuItem.style.background = 'transparent';
        if (item.action) {
          menuItem.onclick = () => {
            item.action();
            menu.remove();
          };
        }
      }
      menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);
    const closeMenu = () => menu.remove();
    setTimeout(() => document.addEventListener('click', closeMenu, { once: true }), 0);
  }

  // Global functions for welcome screen
  window.createNewFile = createNewFile;
  window.openFolder = openFile;

  // Add hover effects to window controls
  wrapper.querySelectorAll('.win-btn').forEach(btn => {
    btn.onmouseover = () => btn.style.background = '#505050';
    btn.onmouseout = () => btn.style.background = 'none';
  });

  // Focus the window
  wrapper.onclick = () => {
    wrapper.style.zIndex = (window.zIndexCounter = (window.zIndexCounter || 1000) + 1);
  };

  return wrapper;
}