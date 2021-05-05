"use strict";

var convertImage = function convertImage(query, callback) {
  var images = document.querySelectorAll(query);
  images.forEach(function (image) {
    fetch(image.src).then(function (res) {
      return res.text();
    }).then(function (data) {
      var parser = new DOMParser();
      var svg = parser.parseFromString(data, "image/svg+xml").querySelector("svg");
      if (image.id) svg.id = image.id;
      if (image.className) svg.classList = image.classList;
      image.parentNode.replaceChild(svg, image);
    }).then(callback)["catch"](function (error) {
      return console.error(error);
    });
  });
};

convertImage("img");