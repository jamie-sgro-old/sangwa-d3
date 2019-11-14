/**
 *  @fileOverview saD3 is a javascript library extending the d3
 * functionality of common graphs matching the conventions perscribed
 * by Sangwa Solutions
 *
 *  @author       Jamie Sgro
 *
 *  @requires     {@link https://d3js.org/d3.v5.min.js d3.v5}
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
}; // End Class



/**
 * Create a histogram defined by the use of a bin to aggregate similar data
 */
class Histogram extends Base_D3 {
  /** @constructor */
  constructor(width, height, margin, colour, binNum) {
    super(width, height, margin, colour);

    this.binNum = binNum;
    this.yLabel = "value";

    //init as empty to be modified when data is provided
    this.max = 0;
    this.min = 0;
    this.widthScale = function() {};
    this.heightScale = function() {};
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
        return d.length;
      })])
      .range([this.colourBottom, this.colourTop]);
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



  _getAttr_x(path, obj) {
    path.attr("x", function(d) {
      return obj.widthScale(d.x0);
    });
  };
  _getAttr_y(path, obj) {
    path.attr("y", function(d) {
      return obj.heightScale(d.length);
    });
  };
  _getAttr_width(path, obj) {
    path.attr("width", function(d) {
      var db = path.data();
      return obj.widthScale(db[0].x1) - obj.widthScale(db[0].x0) - 1;
    });
  };
  _getAttr_height(path, obj) {
    path.attr("height", function(d) {
      return obj.height - obj.heightScale(d.length);
    });
  };
  _getAttr_fill(path, obj) {
    var yLabel = obj.yLabel;

    var colour = obj.getColour(path.data());

    path.attr("fill", function(d) {
      return colour(d.length);
    });
  };



  /** Polymorphism */
  parseRawData(rawData) {};



  prePlot(rawData) {
    var map = this.parseRawData(this, rawData);

    this.domain = this.getDomain(map);

    this.widthScale = this.getWidthScale(this.domain);

    var data = this.getBins(this, map);
    this.heightScale = this.getHeightScale(data);

    return(data);
  };



  postPlot() {
    this.canvas.selectAll("rect.bar")
      .attr("transform", "translate(" + 1 + "," + 0 + ")");
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
  constructor(width, height, margin, colour, binNum) {
    super(width, height, margin, colour, binNum);
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
  parseRawData(obj, rawData) {
    return rawData.map(function(d, i) {
      return parseFloat(d[obj.yLabel]);
    });
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
  constructor(width, height, margin, colour, binNum) {
    super(width, height, margin, colour, binNum);
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
   * parseRawData - pre clean raw data in the form of a string that matches the date
   * string provided
   *
   * @param  {array} rawData an array of json objects
   * @return {array}         an array of parsed json objects according to
   *  d3.timeParse
   */
  parseRawData(obj, rawData) {
    var parseTime = d3.timeParse("%Y-%m-%d");
    return rawData.map(function(d, i) {
      return parseTime(d[obj.yLabel]);
    });
  };
}; // End Class



/**
 * BarGraph - creates a series of bars (rectangles) based on x and y data
 */
class Bargraph extends Base_D3 {
  /** @constructor */
  constructor(width, height, margin, colour) {
    super(width, height, margin, colour);

    this.xLabel = "start_date";
    this.yLabel = "value";

    //init as empty to be modified when data is provided
    this.max = 0;
    this.min = 0;
    this.widthScale = function() {};
    this.heightScale = function() {};
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



  // TODO: add switch to include non-date data
  /* DEPRECATED
  getHeightScale() {
    return d3.scaleBand()
      .domain(dataArray.map(function(d) {
        return d.name;
      }))
    .range([this.height, 0])
    .padding(0.1)
  };
  */



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
      .range([0, this.width])
      .nice();
  };



  // TODO: add switch to include non-date data
  /* DEPRECATED
  getWidthScale() {
    return d3.scaleLinear()
      .domain([0, this.max])
      .range([0, this.width]);
  };
  */



  _getAttr_x(path, obj) {
    path.attr("x", function(d) {
      return obj.widthScale(d[obj.xLabel]);
    });
  };
  _getAttr_y(path, obj) {
    path.attr("y", function(d) {
      var yLabel = obj.yLabel;

      return obj.heightScale(d[yLabel]);
    });
  };
  _getAttr_width(path, obj) {
    var flattenX = path.data().map(function(x) {
        return x[obj.xLabel];
    });

    var range = d3.extent(flattenX);
    var numDays = d3.timeDay.count(range[0], range[1]) + 1;

    path.attr("width", obj.width / numDays);
  };
  _getAttr_height(path, obj) {
    var yLabel = obj.yLabel;

    path.attr("height", function(d) {
      return obj.height - obj.heightScale(d[yLabel]);
    })
  };
  _getAttr_fill(path, obj) {
    var yLabel = obj.yLabel;

    var colour = obj.getColour(path.data());

    path.attr("fill", function(d) {
      return colour(d[yLabel]);
    });
  };
  _getAttr_fillTransparent(path, obj) {
    var colour = obj.getColour(path.data());

    path.attr("fill", function(d) {
      rtn = colour(d[yLabel]);
      return setAlpha(rtn, 0);
    });
  };
  _getAttr_cx(path, obj) {
    path.attr("cx", function(d) {
      return obj.widthScale(d[yLabel]);
    });
  };
  _getAttr_cy(path, obj) {
    path.attr("cy", function(d) {
      return obj.heightScale(d.name);
    });
  };
  _getAttr_r(path, obj) {
    path.attr("r", obj.heightScale.bandwidth()/2);
  };



  /**
   * parseRawData - pre clean raw data in the form of a string that matches the date
   * string provided
   *
   * @param  {array} rawData an array of json objects
   * @return {array}         an array of parsed json objects according to
   *  d3.timeParse
   */
  parseRawData(obj, rawData) {
    var parseTime = d3.timeParse("%Y-%m-%d");
    return rawData.map(function(d, i) {
      return {
        [obj.xLabel]: parseTime(d[obj.xLabel]),
        [obj.yLabel]: d[obj.yLabel]
      };
    });
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



  postPlot() {

  };
};
