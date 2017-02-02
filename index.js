var jsdom = require("jsdom");
var fs = require('fs');

var vendors = [];
vendors["Apple"] = 4;
vendors["Google"] = 5;
vendors["Twitter"] = 6;
vendors["One"] = 7;
vendors["FB"] = 8;
vendors["FBM"] = 9;
vendors["Samsung"] = 10;
vendors["Windows"] = 11;
vendors["GMail"] = 12;
vendors["SB"] = 13;
vendors["DCM"] = 14;
vendors["KDDI"] = 15;

/*
0 num'>№
1 code'>Code
2 browser'>Brow.
3 chart'>Chart

16 name'>Name
17 data'>Date
18 annotations'>Keywords
*/
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
      for (vendor_name in vendors) {
        var img = cells[vendors[vendor_name]].querySelector('img');
        var unicode_value = cells[1].querySelector('a').getAttribute('name');
        if (img) {
          var imgsrc = img.getAttribute('src');
          writeImgSrcToFile(unicode_value + "_" + vendor_name, imgsrc);
        } else {
          console.log("skipping " + unicode_value + " for " + vendor_name);
        }
      }
    }
  }
}

function writeImgSrcToFile(filename, value) {
  value = value.replace('data:image/png;base64,', '');
  filename = filename + ".png";
  var buf = Buffer.from(value, 'base64');
  fs.writeFile("images/" + filename, buf, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("File saved:" + filename);
  });
}
