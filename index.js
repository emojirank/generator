var jsdom = require("jsdom");
var fs = require('graceful-fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('emojirank.db');

var vendors = [];
vendors["Apple"] = 3;
vendors["Google"] = 4;
vendors["Facebook"] = 5;
vendors["Windows"] = 6;
vendors["Twitter"] = 7;
vendors["JoyPixels"] = 8;
vendors["Samsung"] = 9;
vendors["GMail"] = 10;
vendors["SB"] = 11;
vendors["DCM"] = 12;
vendors["KDDI"] = 13;

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
  for(i = 0; i < rows.length; i++) {
    var cells = rows[i].querySelectorAll('td');
    if (cells.length == 15) {
      var unicode_value = cells[1].querySelector('a').getAttribute('name');

      // for each vendor
      for (vendor_name in vendors) {
        var img = cells[vendors[vendor_name]].querySelector('img');

        if (img) {
          var imgsrc = img.getAttribute('src');
          //writeImgSrcToFile(unicode_value + "_" + vendor_name, imgsrc);
          insertToDB(
            cells[0].innerHTML,
            unicode_value,
            vendor_name,
            cells[14].innerHTML);
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

function insertToDB(unicode_line,
  unicode_value,
  vendor_name,
  emoji_name) {
    let sql = `INSERT INTO glyphs (unicode_line, unicode_value, vendor_name, emoji_name) 
      VALUES (
        ${unicode_line}, '${unicode_value}', 
        '${vendor_name}', '${emoji_name}'
        )`;
    db.run(sql, err => {
      if (err) {
          console.log(err);
          console.log(sql);
      }
  })
}

function writeMongoInsertStatementToFile(
  unicode_line,
  unicode_value,
  vendor_name,
  emoji_name) {
    var statement = "db." + mongo_settings.collection_name + ".insert({"
    statement += " unicode_line:\"" + unicode_line + "\", ";
    statement += " unicode_value:\"" + unicode_value + "\", ";
    statement += " vendor_name:\"" + vendor_name + "\", ";
    statement += " emoji_name:\"" + emoji_name + "\"";
    statement += "});\n"
    console.log(statement);
    fs.appendFile('mongoinsert.js', statement, function (err) {
      if(err) {
          return console.log(err);
      }
    });
  }
