function getparam(key, d) {
  var value = window.location.href.match(new RegExp("[?&]" + key + "=([^&#]*)"));
  return value ? value[1] : d;
}
$(function () {
  $('head').append($('<link type="text/css" href="css/' + getparam("skin", "ui-darkness") + '/jquery-ui-1.7.2.custom.css" rel="stylesheet" /><script type="text/javascript" src="pages/' + getparam("page", "index") + '.js"></script>'));
});

