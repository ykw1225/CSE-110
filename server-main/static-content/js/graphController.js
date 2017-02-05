var xmlhttp;
if (window.XMLHttpRequest) {
xmlhttp = new XMLHttpRequest();
} else {
// code for older browsers
xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.onreadystatechange = function() {
if (this.readyState == 4 && this.status == 200) {
  console.log(this.responseText);
}
};
xmlhttp.open("GET", "http://localhost:3000/api/course/map/cse/100", true);
xmlhttp.send();
