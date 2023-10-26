const { ipcRenderer } = require('electron');
function sendTestPrint() {
    ipcRenderer.send('test-print', {});
}

const printButton = document.getElementById('print-button');
printButton.addEventListener('click', (event) => {
    sendTestPrint()
});

  // Kiểm tra xem trình duyệt có hỗ trợ USB hay không
  if ('usb' in navigator) {
    // Lấy danh sách các thiết bị USB được kết nối
    navigator.usb.getDevices()
      .then(devices => {
        // Kiểm tra xem có thiết bị nào được tìm thấy hay không
        if (devices.length > 0) {
          // Lặp qua danh sách các thiết bị và lấy thông tin của chúng
          devices.forEach(device => {
            console.log('Device: ', device);
            console.log('Device product name: ', device.productName);
            console.log('Device vendor ID: ', device.vendorId);
            console.log('Device product ID: ', device.productId);
            // ...thêm các thuộc tính và phương thức khác của đối tượng device
          });
        } else {
          console.log('Không tìm thấy thiết bị USB');
        }
      })
      .catch(error => {
        console.log('Lỗi khi lấy thông tin thiết bị USB: ', error);
      });
  } else {
    console.log('Trình duyệt không hỗ trợ USB');
  }
  ///////////////////////////////////////////////
  // Kiểm tra xem trình duyệt có hỗ trợ API WebUSB hay không
if ('usb' in navigator) {
    // Lắng nghe sự kiện khi người dùng chọn một thiết bị USB
    navigator.usb.addEventListener('connect', (event) => {
      // Xử lý sự kiện connect ở đây
      console.log('Thiết bị USB được chọn:', event.device);
    });
  } else {
    console.log('Trình duyệt không hỗ trợ API WebUSB');
  }