$(function () {
  $("#navbartoggle").blur(function (event) {
    if (window.innerWidth < 768) {
      $("#mytarget").collapse('hide');
    }
   });
  });
