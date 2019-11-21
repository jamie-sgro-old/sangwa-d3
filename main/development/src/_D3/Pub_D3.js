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
   * @return {type}  returns nothing
   */
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
        .style("cursor", "pointer")
        .on("mouseover", function() {
          d3.select(this).attr("fill", "rgba(0,0,0,1)")
        })
        .on("mouseout", function() {
          d3.select(this).attr("fill", "rgba(0,0,0," + alpha + ")")
        })
        .on("click", function() {
          d3.select(this).attr("fill", "rgba(0,0,0,0)")

          saveSvgAsPng(
            document.getElementById(obj.id),
            obj.id + ".png",
            {scale: 2, backgroundColor: "#FFFFFF"}
          );
        })
  };
};
