// --- script.js (Contextual Color Logic) ---

const cols = document.querySelectorAll('.color-col');
const websiteTypeInput = document.getElementById('websiteType');

// 1. Lookup Table for Contextual Themes (The "AI" part)
// Maps common user input keywords to specific starter colors.
const colorThemes = {
    // Keywords for professional/trustworthy/finance themes
    'finance': ['#1E3A8A', '#065F46', '#10B981'], // Deep Blue, Dark Green, Emerald
    'tech': ['#3B82F6', '#6366F1', '#14B8A6'], // Blue, Indigo, Teal
    'startup': ['#3B82F6', '#6366F1', '#14B8A6'],
    'ecommerce': ['#FBBF24', '#EF4444', '#9333EA'], // Amber, Red, Violet
    'retail': ['#FBBF24', '#EF4444', '#9333EA'],
    // Keywords for active/health/nature themes
    'fitness': ['#EF4444', '#10B981', '#F59E0B'], // Red, Emerald, Amber
    'health': ['#065F46', '#10B981', '#34D399'], // Dark Green, Emerald, Light Green
    'nature': ['#065F46', '#10B981', '#34D399'],
    // Keywords for creative/fun themes
    'gaming': ['#8B5CF6', '#F43F5E', '#14B8A6'], // Violet, Rose, Teal
    'art': ['#EC4899', '#F97316', '#6D28D9'], // Pink, Orange, Deep Violet
};


// 2. Core Generation Functions

function generateRandomColor() {
    const hexCodes = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += hexCodes[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getThemeStarterColor(websiteType) {
    const type = websiteType.toLowerCase().trim();
    
    // Check if the input contains any of our defined keywords
    for (const keyword in colorThemes) {
        if (type.includes(keyword)) {
            // Pick a random color from the matched theme's list
            const themeList = colorThemes[keyword];
            return themeList[Math.floor(Math.random() * themeList.length)];
        }
    }
    
    // If no match is found, return null
    return null;
}


// 3. Main Update Function

function generateColors() {
    const websiteType = websiteTypeInput.value;
    const starterColor = getThemeStarterColor(websiteType);
    
    cols.forEach((col, index) => {
        
        // Skip locked columns
        if (col.dataset.locked === 'true') {
            return;
        }

        let newColor;

        // Apply theme color to the first or second slot for impact
        if (index === 0 && starterColor) {
            newColor = starterColor;
        } else {
            // Generate a random color for the rest of the palette (or if no theme match)
            newColor = generateRandomColor();
        }

        const hexText = col.querySelector('h2');

        col.style.background = newColor;
        hexText.innerText = newColor;
        
        // Ensure readability
        setTextColor(col, newColor);
    });
}

// 4. Auxiliary Functions (Contrast & UX)

function setTextColor(col, hexColor) {
    // Luminance calculation
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    
    const text = col.querySelector('h2');
    const lockBtn = col.querySelector('.lock-btn');

    if (luminance < 0.5) {
        text.style.color = 'white';
        lockBtn.style.color = 'white';
    } else {
        text.style.color = 'black';
        lockBtn.style.color = 'black';
    }
}

function copyColor(element) {
    const hex = element.querySelector('h2').innerText;
    navigator.clipboard.writeText(hex)
        .then(() => {
            const popup = document.querySelector('.copy-popup');
            popup.classList.add('active');
            popup.innerText = `Copied ${hex} 📋`;
            setTimeout(() => {
                popup.classList.remove('active');
            }, 1500);
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
        });
}

// 5. Event Listeners (Must be run after the DOM is loaded)

// Event listeners for Lock & Copy
cols.forEach(col => {
    const lockBtn = col.querySelector('.lock-btn');
    
    lockBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        const isLocked = col.dataset.locked === 'true';
        
        col.dataset.locked = isLocked ? 'false' : 'true';
        lockBtn.innerText = isLocked ? '🔓' : '🔒';
        
        col.style.border = isLocked ? 'none' : `3px dashed ${col.querySelector('h2').style.color}`;
    });
    
    col.addEventListener('click', (event) => {
        if (event.target.classList.contains('lock-btn')) return;
        copyColor(col.querySelector('.content'));
    });
});

// Spacebar generation
document.addEventListener('keydown', (event) => {
    if(event.code.toLowerCase() === 'space') {
        event.preventDefault(); 
        generateColors();
    }
})

// Initial run
generateColors();
