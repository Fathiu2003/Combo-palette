// --- script.js ---

const cols = document.querySelectorAll('.color-col');
        
function generateRandomColor() {
    const hexCodes = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += hexCodes[Math.floor(Math.random() * 16)];
    }
    return color;
}

function setTextColor(col, hexColor) {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    
    // Luminance calculation
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

function generateColors() {
    cols.forEach(col => {
        if (col.dataset.locked === 'true') {
            return;
        }

        const hexText = col.querySelector('h2');
        const randomColor = generateRandomColor();

        col.style.background = randomColor;
        hexText.innerText = randomColor;
        
        setTextColor(col, randomColor);
    });
}

// Event listeners (Lock & Copy)
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
