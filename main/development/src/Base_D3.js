/**
 *  @fileOverview saD3 is a javascript library extending the d3
 * functionality of common graphs matching the conventions perscribed
 * by Sangwa Solutions
 *
 *  @author       Jamie Sgro
 *
 *  @requires     {@link https://d3js.org/d3.v5.min.js d3.v5}
 *
 *  @license
 *     Copyright 2019 Sangwa / Sangwa Libraries
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License
 */


/**
 * Base class of all d3 all super classes
 */

class Base_D3 {
  /** @constructor */
  constructor(width, height, margin, colour) {
    this.margin = margin;
    this.width = width - this.margin.left - this.margin.right;
    this.height = height - this.margin.top - this.margin.bottom;

    this.colourBottom = colour.bottom;
    this.colourTop = colour.top;

    /**
    * Formats the size of the element based on parameters set in construction
    *
    * Note that the 'this.' element is overwritten by d3 regardless of the class
    * The (path, obj) is a convention to denote this
    *
    * @param {obj} path - reference to the d3 object calling the function
    * @param {obj} obj - the class element typically evoked though 'this.'
    *
    */
    this.getSvgSize = function(path, obj) {
      path
        .attr("width", obj.width + obj.margin.left + obj.margin.right)
        .attr("height", obj.height + obj.margin.top + obj.margin.bottom);
    };

    this.svg = d3.select("body")
      .append("svg")
        .attr("class", "graph svg")
        .call(this.getSvgSize, this);

    this.canvas = this.svg
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  };



  /**
   * getDomain - take data parsed to match cuper class datatype (date, int, etc)
   * return array of min and max values in the data
   *
   * @param  {array} data array of a unidimensional data structure (i.e. only)
   *    the x axis
   * @return {array}      min and max values in the form: [min, max]
   */
  getDomain(data) {
    var min = d3.min(data);
    var max = d3.max(data);
    return([min, max]);
  };

  /** Polymorphism */
  prePlot() {};



  /**
  * Constructor for reused attributes for d3 elements. All updates to common
  * atrributes are stored in this single function for rapid updating
  *
  * Loop through every attribute and call the function associated this this
  *   keyword. i.e. passing attribute = ["x", "width"] would call the following
  *   functions:
  *   - this._getAttr_x
  *   - this._getAttr_width
  *
  * @param {obj} path - reference to the d3 object calling the function
  * @param {obj} obj - the class element typically evoked though 'this.'
  * @param {array} attributes - array of strings that match d3 attributes
  *
  */
  getAttr(path, obj, attributes) {
    for (var key in attributes) {
      obj["_getAttr_" + attributes[key]](path, obj);
    };
  };



  /**
  * getXAxis - create an x axis on left within the g element
  *
  * @param   {obj} path - reference to the d3 object calling the function
  * @param   {obj} obj - the class element typically evoked though 'this.'
  * @param   {obj} data - reference to the data from d3 object calling the function
  */
  getXAxis(path, obj) {
    path
      .attr("transform", "translate(0," + obj.height + ")")
      .call(d3.axisBottom(obj.getWidthScale(obj.domain)));
  };



  /**
  * getYAxis - create a y axis on the top of svg within the g element
  *
  * @param   {obj} path - reference to the d3 object calling the function
  * @param   {obj} obj - the class element typically evoked though 'this.'
  * @param   {obj} data - reference to the data from d3 object calling the function
  */
  getYAxis(path, obj, data) {
    path
      .call(d3.axisLeft(obj.getHeightScale(data)));
  };



  /**
   * plot - Instantiate the visualization based on the data provided
   *
   * @param  {array} rawData an array of json objects with a common key
   */
  plot(rawData) {

    var data = this.prePlot(rawData);

    this.canvas.selectAll("rect.bar")
      .data(data)
      .enter()
      .append("rect")
        .attr("class", "bar")
        .call(this.getAttr, this, ["x", "y", "width", "height", "fill"]);

    // add the x Axis
    this.canvas
      .append("g")
        .attr("class", "x axis")
        .call(this.getXAxis, this);

    // add the y Axis
    this.canvas
      .append("g")
        .attr("class", "y axis")
        .call(this.getYAxis, this, data);

    this.postPlot();
  };



  /**
   * attrTween - Create a shell of the d3 object conducting a linear
   *  interpolation before conducting said interpolation.
   * i.e. .call(attrTween, 800, "stroke", "white"); changed colour outline to
   * white over the course of 800 miliseconds.
   *
   * Note: Concurrent linear interpolations must be conducted thorugh d3 shells
   *  (indicated as 'var dummy' in this function), otherwise, the Concurrent
   *  interpolation that ends last will overwrite non-shelled interpolations.
   *  This is especially important for objects that move while chagning colour
   *  for example.
   *
   * @param  {obj} path identifier of the d3 object (like self in python
   *  functions)
   * @param  {int} duration number of miliseconds to conduct interpolation
   * @param  {string} attr the attr element to be modified i.e. "x" or
   *  "width"
   * @param  {obj/string} endRes Final result for the interpolation.
   *  - can be complex and call d3 functions/variables that use functions like
   *    d3.scaleLinear() i.e. widthScale(d.value)
   * - can be primitive like a string or int. i.e. "white" or 2
   */
  attrTween(path, duration, attr, endRes) {
    var dummy = {};
    var colour = barplot.getColour();

    d3.select(dummy)
      .transition()
      .duration(duration)
      .tween(attr, function() {
        var lerp = d3.interpolate(path.attr(attr), endRes);
        return function(t) {
          path.attr(attr, lerp(t));
        };
      })
  }
}; // End Class
