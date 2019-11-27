/**
 * Base class of all d3 publication related functions
 */

class Pub_D3 {
  /** @constructor */
  constructor() {

  };


  /**
   * makePubBtn - Create an interactable button in the svg of the graph (canvas)
   * that downloads a .png file to the local machine of the id element of the svg
   *
   * class = menu means it's part of a user interface
   *
   * @return {type}  returns nothing
   */
  makePubBtn() {
    var obj = this;
    var unit = 80;
    var imagePadding = 2;
    var alpha = "0.7";
    var btnCol = this.setAlpha(this.colourTop, alpha);

    this.canvas
      .append("g")
        .attr("class", "menu resizable")
        .append("rect")
          .attr("x", obj.width + obj.margin.right - (unit/2))
          .attr("y", 0 - obj.margin.top - (unit/2))
          .attr("width", unit)
          .attr("height", unit)
          .attr("transform", "rotate(45, " + (obj.width + obj.margin.right) + ", " + (0 - obj.margin.top) + ")")
          .attr("fill", btnCol)
          .style("cursor", "pointer")
          .on("mouseover", function() {
            d3.select(this).attr("fill", obj.setAlpha(btnCol, 1))
          })
          .on("mouseout", function() {
            d3.select(this).attr("fill", btnCol)
          })
          .on("click", function() {
            d3.select(this).attr("fill", obj.setAlpha(btnCol, 0))
            saveSvgAsPng(
              document.getElementById(obj.id),
              obj.id + ".png",
              {scale: 2, backgroundColor: "#FFFFFF"}
            );
          });

  this.div
    .append("img")
      .attr("class", "picture resizable")
      .attr("src", function(d) {
        //this icon is licensed under the Creative Commons
        //Attribution 4.0 International license
        //find out more at https://fontawesome.com/license
        return obj.basePath + "/images/file-image-regular.svg";
      })
      .on("error", function() {
        console.log("error in retrieving image")
      })
      .style("width",  unit/4 + "px")
      .style("position", "absolute")
      .style("left", function() {
        var rtn = document
          .getElementById(obj.id)
            .getBoundingClientRect().right;

        rtn -= unit/4;
        rtn -= imagePadding;

        return rtn.toString() + "px";
      })
      .style("top", function() {
        var rtn = document
          .getElementById(obj.id)
          .getBoundingClientRect().top;

        rtn += imagePadding;

        return rtn.toString() + "px";
      })
      .style("pointer-events", "none");
  };
};
