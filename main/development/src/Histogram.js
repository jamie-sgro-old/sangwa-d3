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
    this.widthScale = this.getWidthScale();
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
  getWidthScale(map) {};




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



  /** Polymorphism */
  getMap(rawData) {};



  /**
   * plot - Instantiate the visualization based on the data provided
   *
   * @param  {array} rawData an array of json objects with a common key
   */
  plot(rawData) {

    var map = this.getMap(this, rawData);

    this.max = d3.max(map);
    this.min = d3.min(map);
    //the widthScale data should be declared here with the data formatted as
    //  map and considered constant
    this.widthScale = this.getWidthScale(map)

    var data = this.getBins(this, map);

    this.canvas.selectAll("rect.bar")
      .data(data)
      .enter()
      .append("rect")
        .attr("class", "bar")
        .call(this.getAttr, this, ["x", "y", "width", "height"])
        .attr("transform", "translate(" + 1 + "," + 0 + ")")
        .attr("fill", "steelblue");

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
}; // End Class
