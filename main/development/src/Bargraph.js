/**
 * BarGraph - creates a series of bars (rectangles) based on x and y data
 */
class Bargraph extends Base_D3 {
  /** @constructor */
  constructor(width, height, margin, colour) {
    super(width, height, margin, colour);

    this.xLabel = "start_date";
    this.yLabel = "value";
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
  getWidthScale(data) {
    var xLabel = this.xLabel;
    return d3.scaleTime()
      .domain(d3.extent(data, function(d) {
        return new Date(d[xLabel]);
      }))
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
    var parseTime = d3.timeParse("%Y-%m-%d");

    var widthScale = obj.getWidthScale(path.data());

    path.attr("x", function(d) {
      return widthScale(parseTime(d[obj.xLabel]));
    });
  };
  _getAttr_y(path, obj) {
    var heightScale = obj.getHeightScale(path.data());

    path.attr("y", function(d) {
      var yLabel = obj.yLabel;

      return heightScale(d[yLabel]);
    });
  };
  _getAttr_width(path, obj) {
    path.attr("width", function(d, i) {
      var range = d3.extent(obj.getMapOld(path.data()));
      var numDays = d3.timeDay.count(range[0], range[1]) + 1;
      return obj.width / numDays;
    });
  };
  _getAttr_height(path, obj) {
    var yLabel = obj.yLabel;

    var heightScale = obj.getHeightScale(path.data());

    path.attr("height", function(d) {
      return obj.height - heightScale(d[yLabel]);
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
    var widthScale = obj.getWidthScale(path.data());

    path.attr("cx", function(d) {
      return widthScale(d[yLabel]);
    });
  };
  _getAttr_cy(path, obj) {
    var heightScale = obj.getHeightScale(path.data());

    path.attr("cy", function(d) {
      return heightScale(d.name);
    });
  };
  _getAttr_r(path, obj) {
    path.attr("r", heightScale.bandwidth()/2);
  };



  getMapOld(rawData) {
    var xLabel = this.xLabel;
    var parseTime = d3.timeParse("%Y-%m-%d");
    return rawData.map(function(d, i) {
      return parseTime(d[xLabel]);
    });
  };



  /**
   * getMap - pre clean raw data in the form of a string that matches the date
   * string provided
   *
   * @param  {array} rawData an array of json objects
   * @return {array}         an array of parsed json objects according to
   *  d3.timeParse
   */
  getMap(obj, rawData) {
    var parseTime = d3.timeParse("%Y-%m-%d");
    return rawData.map(function(d, i) {
      return {
        [obj.xLabel]: parseTime(d[obj.xLabel]),
        [obj.yLabel]: d[obj.yLabel]
      };
    });
  };



  /**
   * plot - Instantiate the visualization based on the data provided
   *
   * @param  {array} rawData an array of json objects with a common key
   */
  plot(data) {
    console.log(data)

    console.log(this.getMap(this, data))

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
        .call(this.getXAxis, this, data);


    // add the y Axis
    this.canvas
      .append("g")
        .attr("class", "y axis")
        .call(this.getYAxis, this, data);
  };
};
