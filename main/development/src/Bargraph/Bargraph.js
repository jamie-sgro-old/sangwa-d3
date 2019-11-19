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

    this.colour_D3 = new Colour_D3;

    this.getColour = this.colour_D3.getColour;
    this._getAttr_fill = this.colour_D3._getAttr_fill;
    this._getAttr_fillTransparent = this.colour_D3._getAttr_fillTransparent;
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



  /** Polymorphism */
  getWidthScale() {};



  // TODO: add switch to include non-date data
  /* DEPRECATED
  getWidthScale() {
    return d3.scaleLinear()
      .domain([0, this.max])
      .range([0, this.width]);
  };
  */


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
    var motion = new Motion_D3;

    this.canvas.selectAll("rect.bar")
      .call(motion.attrTween, 800, "fill", "blue");

    this.update(data, this);
  };
};
