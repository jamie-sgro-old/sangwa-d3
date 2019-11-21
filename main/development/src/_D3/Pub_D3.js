/**
 * Base class of all d3 publication related functions
 */

class Pub_D3 {
  /** @constructor */
  constructor() {

  };

  makePubBtn() {
    var obj = this;
    var unit = 50;
    var alpha = "0.2"

    this.canvas
      .append("g")
        .attr("class", "pub")
        .append("rect")
        .attr("x", obj.width - unit)
        .attr("y", 0)
        .attr("width", unit)
        .attr("height", unit)
        .attr("fill", "rgba(0,0,0," + alpha + ")")
        .on("mouseover", function() {
          d3.select(this).attr("fill", "rgba(0,0,0,1)")
        })
        .on("mouseout", function() {
          d3.select(this).attr("fill", "rgba(0,0,0," + alpha + ")")
        })
        .on("click", function() {
          saveSvgAsPng(
            document.getElementById(obj.id),
            obj.id + ".png",
            {scale: 2, backgroundColor: "#FFFFFF"}
          );
        })
  };
};
