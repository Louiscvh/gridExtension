// content.js

function applyGridInPage(columns, gutter, margins, color, mobileColumns) {
    const gridElement = document.createElement('div');
    gridElement.id = 'customGrid';
    gridElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - ${margins}px * 2);
        margin-left: auto; /* Centrer avec le margin */
        margin-right: auto; /* Centrer avec le margin */
        height: 100%;
        display: grid;
        gap: ${gutter}px;
        pointer-events: none;
        z-index: 9999;
    `;

    function createCells(numCells) {
        gridElement.innerHTML = '';
        for (let i = 0; i < numCells; i++) {
            const cell = document.createElement('div');
            cell.style.backgroundColor = color;
            cell.style.opacity = 0.2;
            gridElement.appendChild(cell);
        }
    }

    const mediaQuery = window.matchMedia('(max-width: 600px)');

    function handleMediaQueryChange() {
        if (mediaQuery.matches) {
            createCells(mobileColumns);
            gridElement.style.gridTemplateColumns = `repeat(${mobileColumns}, minmax(0, 1fr))`;
        } else {
            createCells(columns);
            gridElement.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
        }
    }

    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange();
    document.body.appendChild(gridElement);
}

function removeGridFromPage() {
    const existingGrid = document.getElementById('customGrid');
    if (existingGrid) {
        existingGrid.remove();
    }
}

function updateGrid(request) {
    const { columns, gutter, displayGrid, margins, color, mobileColumns } = request;
    removeGridFromPage();
    if (displayGrid) {
        applyGridInPage(columns, gutter, margins, color, mobileColumns);
    }
}

let currentColumns;

function updateGridOnResize() {
    const updateDelay = 200;

    let resizeTimer;

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newColumns = window.innerWidth <= 600 ? mobileColumns : columns;

            if (newColumns !== currentColumns) {
                currentColumns = newColumns;
                updateGrid({
                    columns: currentColumns,
                    gutter,
                    displayGrid: true,
                    margins,
                    color,
                    mobileColumns,
                });
            }
        }, updateDelay);
    });
}

updateGridOnResize();

chrome.runtime.onMessage.addListener(updateGrid);
