/**
 * BarGraph - creates a series of bars (rectangles) based on x and y data
 * @DEPRECATED
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
      .range([0, this.height]);
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
      .range([0, this.width]);
  };



  // TODO: add switch to include non-date data
  /* DEPRECATED
  getWidthScale() {
    return d3.scaleLinear()
      .domain([0, this.max])
      .range([0, this.width]);
  };
  */



  /**
  * getXAxis - create an x axis on left within the g element
  *
  * @param   {obj} path - reference to the d3 object calling the function
  * @param   {obj} obj - the class element typically evoked though 'this.'
  * @param   {obj} data - reference to the data from d3 object calling the function
  */
  getXAxis(path, obj, data) {
    path
      //.attr("transform", "translate(0," + obj.height + ")")
      .call(d3.axisTop(obj.getWidthScale(data)));
  }



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
  }



  /**
  * Constructor for reused attributes for d3 elements. All updates to common
  * atrributes are stored in this single function for rapid updating
  *
  * @param {obj} path - reference to the d3 object calling the function
  * @param {obj} obj - the class element typically evoked though 'this.'
  * @param {array} attributes - array of strings that match d3 attributes
  *
  */
  getAttr(path, obj, attributes) {
    var yLabel = obj.yLabel;

    var key;
    var parseTime = d3.timeParse("%Y-%m-%d");

    var widthScale = obj.getWidthScale(path.data());
    var heightScale = obj.getHeightScale(path.data());
    var colour = obj.getColour(path.data());

    for (key in attributes) {
      switch (attributes[key]) {
        case "x":
          path.attr("x", function(d) {
            return widthScale(parseTime(d[obj.xLabel]));
          });
          break;
        case "height":
          path.attr("height", function(d) {
            return heightScale(d[yLabel]);
          })
          break;
        case "fill":
          path.attr("fill", function(d) {
            return colour(d[yLabel])
          })
          break;
        case "fillTransparent":
          path.attr("fill", function(d) {
            rtn = colour(d[yLabel]);
            return setAlpha(rtn, 0);
          })
          break;
        case "y":
          path.attr("y", function(d) {
            return heightScale(d.name);
          })
          break;
        case "cx":
          path.attr("cx", function(d) {
            return widthScale(d[yLabel]);
          });
          break;
        case "cy":
          path.attr("cy", function(d) {
            return heightScale(d.name);
          })
          break;
        case "r":
          path.attr("r", heightScale.bandwidth()/2)
          break;
      };
    };
  };



  /**
   * plot - Instantiate the visualization based on the data provided
   *
   * @param  {array} rawData an array of json objects with a common key
   */
  plot(data) {
    this.canvas.selectAll("rect.bar")
      .data(data)
      .enter()
      .append("rect")
          .attr("class", "bar")
          .attr("width", 60)
          .attr("width", 3)
          .call(this.getAttr, this, ["x", "height", "fill"])
          .attr("y", 0)

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
}
