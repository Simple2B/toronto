window.addEventListener('locationchange', function () {
  console.log('location changed!');
});

if (window.history) {
  var myOldUrl = window.location.href;
  console.log('------------------1--------------------location changed!');
  window.addEventListener('hashchange', function(){
    window.history.pushState({}, null, myOldUrl);
    console.log('------------------------------------location changed!');
  });
}