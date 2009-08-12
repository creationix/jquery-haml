var Haml = require("../../lib/haml.js");

function haml_to_html(haml) {

}

function onLoad() {

  p(Haml.parse(":foobar{param: false} stuff\n  that\n  needs\n   to\n    go"));
  p(Haml.parse("#head{id:'one'} Content\n  more\n  content"));
  p(Haml.parse(".button Content"));
  p(Haml.parse(".button#id{other: true} Content"));
  p(Haml.parse(".button.more.stuff Content"));
  p(Haml.parse("%div Content"));
  p(Haml.parse("%div{id: 'foo', rel: 'sample'} More Content"));

  node.fs.cat("haml/ui.haml").addCallback(function (text) {
    var haml = Haml.parse(text);
    p(haml_to_html(haml));
//    print(haml_to_html(haml));
  });
}

