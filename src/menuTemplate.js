const electron = require('electron');

//const {app, shell, ipcMain} = electron;

let menuTemplate = function ()
{
  return [
    // {
    //     label: 'Reload', accelerator: 'CmdOrCtrl+R',
    //     click: function (item, focusedWindow) {
    //       focusedWindow.reload();
    //     }
    //   }
  ]
}

module.exports = menuTemplate