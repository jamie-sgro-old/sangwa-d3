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
  constructor(id, width, height, margin, colour) {
    this.id = id;
    this.margin = margin;
    this.width = width - this.margin.left - this.margin.right;
    this.height = height - this.margin.top - this.margin.bottom;

    this.colourBottom = colour.bottom;
    this.colourTop = colour.top;

    //init as empty to be modified when data is provided
    this.max = 0;
    this.min = 0;
    this.widthScale = function() {};
    this.heightScale = function() {};

    //add colour module
    this.colour_D3 = new Colour_D3;
    this.getColour = this.colour_D3.getColour;
    this._getAttr_fill = this.colour_D3._getAttr_fill;
    this._getAttr_fillTransparent = this.colour_D3._getAttr_fillTransparent;

    //add pub module
    this.pub_D3 = new Pub_D3;
    this.makePubBtn = this.pub_D3.makePubBtn
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
        .attr("id", id)
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



  _getAttr_x(path, obj) {
    path.attr("x", function(d) {
      return obj._x(d, obj)
    });
  };
  _getAttr_y(path, obj) {
    path.attr("y", function(d) {
      return obj._y(d, obj);
    });
  };
  _getAttr_width(path, obj) {
    path.attr("width", obj._width(path, obj));
  };
  _getAttr_height(path, obj) {
    path.attr("height", function(d) {
      return obj._height(d, obj);
    });
  };



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
    var obj = this;

    this.canvas.selectAll("rect.bar")
      .data(data)
      .enter()
      .append("rect")
        .attr("class", "bar")
        .attr("height", 0)
        .attr("y", obj.height)
        .call(this.getAttr, this, ["x", "width", "fill"]);

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

    this.makePubBtn();

    this.postPlot(data);
  };



  update(data, obj) {
    var motion = new Motion_D3;

    this.canvas.selectAll("rect.bar")
      .data(data)
        .each(function(d) {
          d3.select(this).call(motion.attrTween, 800, "height", obj._height(d, obj));
          d3.select(this).call(motion.attrTween, 800, "y", obj._y(d, obj));
        })
  };
}; // End Class
