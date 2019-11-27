/**
 * Base class of all d3 motion related functions
 */

class Colour_D3 {
  /** @constructor */
  constructor() {

  };



  /**
   * getColour - map integer value along a range between two or more colours
   *
   * @param  {array} data value in question to be mapped
   * @return {obj}      a linear scale as a hexidecimal or rgb
   */
  getColour(data) {
    var yLabel = this.yLabel;
    return d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {
        return d[yLabel];
      })])
      .range([this.colourBottom, this.colourTop]);
  };



  _getAttr_fill(path, obj) {
    var colour = obj.getColour(path.data());

    path.attr("fill", function(d) {
      return colour(d[obj.yLabel]);
    });
  };
  _getAttr_fillTransparent(path, obj) {
    var colour = obj.getColour(path.data());

    path.attr("fill", function(d) {
      rtn = colour(d[obj.yLabel]);
      return setAlpha(rtn, 0);
    });
  };



  /**
   * setAlpha - input a d3-compatible rgb() or rgba() string, outputs same
   * colour with a new opacity level
   *
   * @param  {string} c rgb or rgba string
   *  i.e. "rgb(20, 183, 239)" or "rgba(20, 183, 239, 0.5)". for rgba strings
   *  the alpha-level will be overwritten
   * @param  {int} v value of opactiy/alpha to be returned
   *  i.e. 0.2
   * @return {string} rgba string with the new alpha level
   *  i.e. "rgba(20, 183, 239, 0.2)"
   */
  setAlpha(c, v) {
    var c = d3.rgb(c);
    c.opacity = v;

    return c;
  }
}; // End Class
