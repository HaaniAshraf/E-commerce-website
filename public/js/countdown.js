// Target Date
var countDownDate = new Date("Apr 15, 2024 00:00:00").getTime();

var x = setInterval(function () {

// Today Date
var now = new Date().getTime();
// Date Difference
var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
  document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
  document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
  document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');

    if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "EXPIRED";
    }

}, 1000);