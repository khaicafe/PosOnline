const { ipcRenderer } = require('electron');
function sendTestPrint() {
    ipcRenderer.send('test-print', {});
}

const printButton = document.getElementById('print-button');
printButton.addEventListener('click', (event) => {
    sendTestPrint()
});