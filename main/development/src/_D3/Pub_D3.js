/**
 * Base class of all d3 publication related functions
 */

class Pub_D3 {
  /** @constructor */
  constructor() {

  };

  makePubBtn() {
    console.log(this.canvas);

    this.canvas
      .append("g")
        .attr("class", "pub")
        .append("rect")
        .attr("x", 50)
        .attr("y", 50)
        .attr("width", 50)
        .attr("height", 50)
  };
};
