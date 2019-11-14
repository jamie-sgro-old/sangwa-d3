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
    var heightScale = obj.getHeightScale(path.data());

    path.attr("y", function(d) {
      return heightScale(d.length);
    });
  };
  _getAttr_width(path, obj) {
    path.attr("width", function(d) {
      var db = path.data();
      return obj.widthScale(db[0].x1) - obj.widthScale(db[0].x0) - 1;
    });
  };
  _getAttr_height(path, obj) {
    var heightScale = obj.getHeightScale(path.data());

    path.attr("height", function(d) {
      return obj.height - heightScale(d.length);
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

    return(data);
  };



  postPlot() {
    this.canvas.selectAll("rect.bar")
      .attr("transform", "translate(" + 1 + "," + 0 + ")");
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
        .call(this.getAttr, this, ["x", "y", "width", "height", "fill"])


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
