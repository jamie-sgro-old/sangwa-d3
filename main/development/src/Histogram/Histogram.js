/**
 * Create a histogram defined by the use of a bin to aggregate similar data
 */
class Histogram extends Base_D3 {
  /** @constructor */
  constructor(width, height, margin, colour, binNum) {
    super(width, height, margin, colour);

    this.binNum = binNum;
    this.yLabel = "value";

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
