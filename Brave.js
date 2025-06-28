let fakeChromeWindowInstance = null;
let originalWindowStyles = {}; 

function openFakeBraveWindow() {
    if (fakeChromeWindowInstance && document.body.contains(fakeChromeWindowInstance)) {
        console.log("Fake Chrome Window is already open.");
        fakeChromeWindowInstance.style.zIndex = parseInt(fakeChromeWindowInstance.style.zIndex || 1000) + 1;
        return;
    }

    // Create the main window container
    const windowDiv = document.createElement('div');
    windowDiv.className = 'fake-chrome-window bg-gray-50 rounded-xl shadow-2xl overflow-hidden flex flex-col';
    windowDiv.style.width = '800px';
    windowDiv.style.height = '500px';
    windowDiv.style.top = `${window.innerHeight / 2 - 250}px`;
    windowDiv.style.left = `${window.innerWidth / 2 - 400}px`;
    windowDiv.style.position = 'absolute'; // Ensure positioning context

    // Create the title bar
    const titleBar = document.createElement('div');
    titleBar.className = 'flex items-center justify-between bg-gray-200 p-2 border-b border-gray-300 cursor-grab active:cursor-grabbing select-none';
    titleBar.style.borderTopLeftRadius = '0.75rem';
    titleBar.style.borderTopRightRadius = '0.75rem';

    // Title text
    const titleText = document.createElement('span');
    titleText.className = 'text-sm font-semibold text-gray-700 px-2 flex-grow';
    titleText.textContent = 'Google Search';

    // Control buttons container
    const controls = document.createElement('div');
    controls.className = 'flex space-x-1';

    // Minimize button
    const minimizeBtn = document.createElement('button');
    minimizeBtn.className = 'w-4 h-4 rounded-full bg-yellow-500 hover:bg-yellow-600 focus:outline-none';
    minimizeBtn.title = 'Minimize';

    // Maximize/Restore button
    const maximizeBtn = document.createElement('button');
    maximizeBtn.className = 'w-4 h-4 rounded-full bg-green-500 hover:bg-green-600 focus:outline-none';
    maximizeBtn.title = 'Maximize';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none';
    closeBtn.title = 'Close';

    // Append buttons to controls
    controls.appendChild(minimizeBtn);
    controls.appendChild(maximizeBtn);
    controls.appendChild(closeBtn);

    // Append title and controls to title bar
    titleBar.appendChild(titleText);
    titleBar.appendChild(controls);

    // Create content area
    const contentArea = document.createElement('div');
    contentArea.className = 'flex-grow text-black bg-white p-2 overflow-auto relative gcse-search-container';
    // The gcse-search div provided by Google's Programmable Search Engine
    // inherently places the search input/bar *before* the search results.
    // The 'gcse-search-container' with 'flex-direction: column' ensures
    // this vertical flow within the custom window.
    contentArea.innerHTML = '<div class="gcse-search"></div>';

    // Append title bar and content to window
    windowDiv.appendChild(titleBar);
    windowDiv.appendChild(contentArea);

    // Append window to body
    document.body.appendChild(windowDiv);
    fakeChromeWindowInstance = windowDiv; // Store the instance

    // --- Drag Functionality ---
    let isDragging = false;
    let offsetX, offsetY;

    titleBar.addEventListener('mousedown', (e) => {
        if (windowDiv.classList.contains('maximized')) return; // Prevent dragging when maximized
        isDragging = true;
        offsetX = e.clientX - windowDiv.getBoundingClientRect().left;
        offsetY = e.clientY - windowDiv.getBoundingClientRect().top;
        titleBar.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        // Update position based on mouse position and initial offset
        windowDiv.style.left = `${e.clientX - offsetX}px`;
        windowDiv.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'grab';
    });

    // --- Minimize Functionality ---
    let isMinimized = false;
    minimizeBtn.addEventListener('click', () => {
        if (!isMinimized) {
            // Save current styles before minimizing
            originalWindowStyles = {
                top: windowDiv.style.top,
                left: windowDiv.style.left,
                width: windowDiv.style.width,
                height: windowDiv.style.height,
                transform: windowDiv.style.transform // In case of manual resize transform
            };
            windowDiv.classList.add('minimized');
            titleText.textContent = 'Google Search (Minimized)';
            isMinimized = true;
        } else {
            // Restore original styles
            windowDiv.classList.remove('minimized');
            windowDiv.style.top = originalWindowStyles.top;
            windowDiv.style.left = originalWindowStyles.left;
            windowDiv.style.width = originalWindowStyles.width;
            windowDiv.style.height = originalWindowStyles.height;
            windowDiv.style.transform = originalWindowStyles.transform;
            titleText.textContent = 'Google Search';
            isMinimized = false;
        }
    });

    // --- Maximize/Restore Functionality ---
    let isMaximized = false;
    maximizeBtn.addEventListener('click', () => {
        if (!isMaximized) {
            // Save current styles before maximizing
            originalWindowStyles = {
                top: windowDiv.style.top,
                left: windowDiv.style.left,
                width: windowDiv.style.width,
                height: windowDiv.style.height,
                transform: windowDiv.style.transform // In case of manual resize transform
            };
            windowDiv.classList.add('maximized');
            titleText.textContent = 'Google Search (Maximized)';
            isMaximized = true;
        } else {
            // Restore original styles
            windowDiv.classList.remove('maximized');
            windowDiv.style.top = originalWindowStyles.top;
            windowDiv.style.left = originalWindowStyles.left;
            windowDiv.style.width = originalWindowStyles.width;
            windowDiv.style.height = originalWindowStyles.height;
            windowDiv.style.transform = originalWindowStyles.transform;
            titleText.textContent = 'Google Search';
            isMaximized = false;
        }
    });

    // --- Close Functionality ---
    closeBtn.addEventListener('click', () => {
        windowDiv.remove();
        fakeChromeWindowInstance = null; // Clear reference
    });

    // --- Google Programmable Search Engine Injection ---
    const loadGoogleCSE = () => {
        // Check if the script already exists to prevent multiple loads
        if (document.getElementById('google-cse-script')) {
            // If script exists, ensure the search element is rendered/refreshed
            // This is important if the window is closed and reopened without a full page reload.
            if (window.gsc && typeof window.gsc.init === 'function') {
                window.gsc.init();
            }
            return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = "https://cse.google.com/cse.js?cx=24677c0b0560a44f7";
        script.id = 'google-cse-script';
        script.onload = () => {
            // Once the script is loaded, ensure the gcse-search div is present and refreshed
            if (window.gsc && typeof window.gsc.init === 'function') {
                window.gsc.init();
            }
        };
        document.head.appendChild(script);
    };

    loadGoogleCSE(); // Load the CSE script when the window is created
}

// Add event listener to the button to open the window
document.getElementById('open-window-btn').addEventListener('click', openFakeBraveWindow);