/**
 *  @fileOverview saD3 is a javascript library extending the d3
 * functionality of common graphs matching the conventions perscribed
 * by the author
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
/**
 * Base class of all d3 motion related functions
 */

class Motion_D3 {
  /** @constructor */
  constructor() {

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

    d3.select(dummy)
      .transition()
      .duration(duration)
      .tween(attr, function() {
        var lerp = d3.interpolate(path.attr(attr), endRes);
        return function(t) {
          path.attr(attr, lerp(t));
        };
      });
  };



  /**
   * resetTween - same as attrTween, only it conducts two tweens synchronously,
   * one after the other.
   *
   * The duration for the second tween is set to be 3 times longer than the first
   * usefull for dynamic highlighting and so on.
   */
  resetTween(path, duration, attr, endRes, peakRes) {
    var dummy = {};

    d3.select(dummy)
      .transition()
      .duration(duration)
      .tween(attr, function() {
        var lerp = d3.interpolate(path.attr(attr), peakRes);
        return function(t) {
          path.attr(attr, lerp(t));
        };
      })
      .transition()
      .duration(duration*3)
      .tween(attr, function() {
        var lerp = d3.interpolate(peakRes, endRes);
        return function(t) {
          path.attr(attr, lerp(t));
        };
      })
  }
}; // End Class
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
}; // End Class
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
/**
 * Extention of Data_D3 for data that is of type: Int
 * @class
 *
 *
 */
class _Int {
  /** @constructor */
  constructor() {

  };



  /**
  * Map Integers of any range to a particular pixel point on an svg element
  *
  * path.data() indicates all the data in an array of JSON objects
  * d in the function indicates a single datapoint in path.data()
  *
  * @param {obj} data - reference to the data from d3 object calling the function
  *
  */
  getWidthScale(domain) {
    return d3.scaleLinear()
      .domain([0, domain[1]])
      .rangeRound([0, this.width])
      .nice();
  };



  /**
   * parseRawData - pre clean raw data in the form of an integer to float messy integers
   *
   * i.e. turns [{value: "5"},{value: "1"},{value: "35"}] into [5,1,35]
   *
   * @param  {array} rawData an array of json objects
   * @return {array}         an array of parsed json objects according to
   *  parseFloat()
   */
  parseRawData_one(obj, rawData) {
    return rawData.map(function(d, i) {
      return parseFloat(d[obj.yLabel]);
    });
  };



  /**
   * parseRawData - pre clean raw data in the form of a string that matches the
   *  date string inherited from class
   *
   * @param  {array} rawData an array of json objects
   * @return {array}         an array of parsed json objects according to
   *  d3.timeParse
   */
  parseRawData_two(obj, rawData) {
    return rawData.map(function(d, i) {
      return {
        [obj.xLabel]: parseFloat(d[obj.xLabel]),
        [obj.yLabel]: parseFloat(d[obj.yLabel])
      };
    });
  };
}; // End Class
/**
 * Extention of Data_D3 for data that is of type: string
 * @class
 *
 * Currently, date strings are expected to match the d3.timeParse "%Y-%m-%d"
 * i.e. "2004-04-15"
 */
class _Date {
  /** @constructor */
  constructor() {
    this.parseTime = d3.timeParse("%Y-%m-%d");
  };


  /**
  * Map dates of any range to a particular pixel point on an svg element
  *
  * path.data() indicates all the data in an array of JSON objects
  * d in the function indicates a single datapoint in path.data()
  *
  * @param {obj} data - reference to the data from d3 object calling the function
  *
  */
  getWidthScale(domain) {
    return d3.scaleTime()
      .domain(domain)
      .rangeRound([0, this.width])
      .nice();
  };



  /**
   * parseRawData - pre clean raw data in the form of a string that matches the
   *  date string inherited from class
   *
   * @param  {array} rawData an array of json objects
   * @return {array}         an array of parsed json objects according to
   *  d3.timeParse
   */
  parseRawData_one(obj, rawData) {
    return rawData.map(function(d, i) {
      return obj._date.parseTime(d[obj.yLabel]);
    });
  };



  /**
   * parseRawData - pre clean raw data in the form of a string that matches the
   *  date string inherited from class
   *
   * @param  {array} rawData an array of json objects
   * @return {array}         an array of parsed json objects according to
   *  d3.timeParse
   */
  parseRawData_two(obj, rawData) {
    return rawData.map(function(d, i) {
      return {
        [obj.xLabel]: obj._date.parseTime(d[obj.xLabel]),
        [obj.yLabel]: d[obj.yLabel]
      };
    });
  };
}; // End Class
/**
 * Create a histogram defined by the use of a bin to aggregate similar data
 */
class Histogram extends Base_D3 {
  /** @constructor */
  constructor(id, width, height, margin, colour, binNum, yLabel = "value") {
    super(id, width, height, margin, colour);

    this.binNum = binNum;
    this.yLabel = yLabel;
  };



  /**
  * Map integers of any range to a particular pixel point on an svg element
  *
  * path.data() indicates all the data in an array of JSON objects
  * d in the function indicates a single datapoint in path.data()
  *
  * @param {obj} data - reference to the data from d3 object calling the function
  *
  */
  getHeightScale(data) {
    return d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {
        return d.length;
      })])
      .range([this.height, 0]);
  };


  /** Polymorphism */
  getWidthScale() {};




  /**
   * getBins - convert data into a 'binned' version of itself based on the
   * predefined number of bins intended.
   * i.e. a bin of two would aggregate a bottom and top half of the univariate
   * data
   *
   * @param  {array} data the raw data used to be aggregated into 'bins'
   * @return {obj}      returns d3.histogram datastructure
   */
  getBins(obj, data) {
    return d3.histogram()
      .domain(obj.widthScale.domain())
      .thresholds(obj.widthScale.ticks(obj.binNum))
      (data);
  };


  _x(d, obj) {
    return obj.widthScale(d.x0);
  };
  _y(d, obj) {
    return obj.heightScale(d[obj.yLabel]);
  };
  _width(path, obj) {
    var db = path.data();
    return obj.widthScale(db[0].x1) - obj.widthScale(db[0].x0) - 1;
  };
  _height(d, obj) {
    return obj.height - obj.heightScale(d[obj.yLabel]);
  };



  /** Polymorphism */
  parseRawData(rawData) {};



  prePlot(rawData) {
    var map = this.parseRawData(this, rawData);

    this.domain = this.getDomain(map);

    this.widthScale = this.getWidthScale(this.domain);

    var data = this.getBins(this, map);
    this.heightScale = this.getHeightScale(data);

    this.yLabel = "length"

    return(data);
  };



  postPlot(data) {
    this.canvas.selectAll("rect.bar")
      .attr("transform", "translate(" + 1 + "," + 0 + ")");

    this.update(data, this);
  };
}; // End Class
/**
 * Extention of Histogram for data that is of type: Int
 * @class
 *
 *
 */
class Histogram_Int extends Histogram {
  /** @constructor */
  constructor(id, width, height, margin, colour, binNum, yLabel) {
    super(id, width, height, margin, colour, binNum, yLabel);

    this._int = new _Int;

    this.getWidthScale = this._int.getWidthScale;
    this.parseRawData = this._int.parseRawData_one;
  };
}; // End Class
/**
 * Extention of Histogram for data that is of type: string
 * @class
 *
 * Currently, date strings are expected to match the d3.timeParse "%Y-%m-%d"
 * i.e. "2004-04-15"
 */
class Histogram_Date extends Histogram {
  /** @constructor */
  constructor(id, width, height, margin, colour, binNum, yLabel) {
    super(id, width, height, margin, colour, binNum, yLabel);

    this._date = new _Date;

    this.getWidthScale = this._date.getWidthScale;
    this.parseRawData = this._date.parseRawData_one;
  };
}; // End Class
/**
 * BarGraph - creates a series of bars (rectangles) based on x and y data
 */
class Bargraph extends Base_D3 {
  /** @constructor */
  constructor(id, width, height, margin, colour, yLabel = "value", xLabel = "start_date") {
    super(id, width, height, margin, colour);

    this.xLabel = xLabel;
    this.yLabel = yLabel;
  };



  /**
  * Map integers of any range to a particular pixel point on an svg element
  *
  * path.data() indicates all the data in an array of JSON objects
  * d in the function indicates a single datapoint in path.data()
  *
  * @param {obj} data - reference to the data from d3 object calling the function
  *
  */
  getHeightScale(data) {
    var yLabel = this.yLabel;
    return d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {
        return d[yLabel];
      })])
      .range([this.height, 0]);
  };



  /** Polymorphism */
  getWidthScale() {};



  _x(d, obj) {
    return obj.widthScale(d[obj.xLabel]);
  };
  _y(d, obj) {
    return obj.heightScale(d[obj.yLabel]);
  };
  _width(path, obj) {
    var flattenX = path.data().map(function(x) {
        return x[obj.xLabel];
    });

    var range = d3.extent(flattenX);
    var numDays = d3.timeDay.count(range[0], range[1]) + 1;

    return obj.width / numDays;
  };
  _height(d, obj) {
    return obj.height - obj.heightScale(d[obj.yLabel]);
  };



  prePlot(rawData) {
    var data = this.parseRawData(this, rawData);

    var xLabel = this.xLabel;

    var flattenX = data.map(function(x) {
        return x[xLabel];
    });

    this.domain = this.getDomain(flattenX);

    // add a single day since x axis ends at begining of max day
    this.domain[1] = d3.timeDay.offset(this.domain[1], 1);

    this.widthScale = this.getWidthScale(this.domain);
    this.heightScale = this.getHeightScale(data);

    return(data);
  };



  postPlot(data) {
    this.update(data, this);
  };
};
/**
 * Extention of Bargraph for data that is of type: string
 * @class
 *
 * Currently, date strings are expected to match the d3.timeParse "%Y-%m-%d"
 * i.e. "2004-04-15"
 */
class Bargraph_Date extends Bargraph {
  /** @constructor */
  constructor(id, width, height, margin, colour, yLabel, xLabel) {
    super(id, width, height, margin, colour, yLabel, xLabel);

    this._date = new _Date;

    this.getWidthScale = this._date.getWidthScale;
    this.parseRawData = this._date.parseRawData_two;
  };
};
