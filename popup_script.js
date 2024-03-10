document.addEventListener('DOMContentLoaded', function() {
    loadConfigAndApplyGrid(); // Charge la configuration sauvegardée et applique la grille
    document.getElementById('columns').addEventListener('change', applyGrid);
    document.getElementById('gutter').addEventListener('change', applyGrid);
    document.getElementById('margins').addEventListener('change', applyGrid);
    document.getElementById('displayGrid').addEventListener('change', applyGrid);
    document.getElementById('color').addEventListener('input', applyGrid);
    document.getElementById('mobileColumns').addEventListener('change', applyGrid);
});

function applyGrid() {
    const columns = document.getElementById('columns').value;
    const gutter = document.getElementById('gutter').value;
    const displayGrid = document.getElementById('displayGrid').checked;
    const margins = document.getElementById('margins').value;
    const color = document.getElementById('color').value;
    const mobileColumns = document.getElementById('mobileColumns').value;

    chrome.storage.sync.set({
        columns,
        gutter,
        margins,
        color,
        mobileColumns,
        displayGrid,
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "applyGrid",
            columns,
            gutter,
            margins,
            color,
            mobileColumns,
            displayGrid,
        });
    });
}

function loadConfigAndApplyGrid() {
    chrome.storage.sync.get(
        {
            columns: 12,
            gutter: 10,
            margins: 10,
            color: '#F2F2F2',
            mobileColumns: 4,
            displayGrid: true,
        },
        function(data) {
            document.getElementById('columns').value = data.columns;
            document.getElementById('gutter').value = data.gutter;
            document.getElementById('margins').value = data.margins;
            document.getElementById('color').value = data.color;
            document.getElementById('mobileColumns').value = data.mobileColumns;
            document.getElementById('displayGrid').checked = data.displayGrid;

            applyGrid();
        }
    );
}
