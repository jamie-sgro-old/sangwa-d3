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



  postPlot(data) {
    var motion = new Motion_D3;

    this.canvas.selectAll("rect.bar")
      .call(motion.attrTween, 800, "fill", "blue");
  };
};
