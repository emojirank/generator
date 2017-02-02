var jsdom = require("jsdom");
var fs = require('fs');

jsdom.env({
    file: 'full-emoji-list.html',
    done: function (err, window) {
        global.window = window;
        global.document = window.document;
        parseTable();
    }
});
function parseTable() {
    var tables = document.querySelectorAll('table');
    console.log("there are ", tables.length, " tables");
    var rows = tables[0].querySelectorAll('tr');
    console.log("there are ", rows.length, " rows");

    // parse each row
    for(i = 0; i < 10; i++) {
      var cells = rows[i].querySelectorAll('td');
      if (cells.length > 0) {
        var img = cells[4].querySelector('img');
        var imgsrc = img.getAttribute('src');
        imgsrc = imgsrc.replace('data:image/png;base64,', '');
        var buf = Buffer.from(imgsrc, 'base64');
        fs.writeFile(i + ".png", buf, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
      }
      console.log(cells.length);
    }
}
