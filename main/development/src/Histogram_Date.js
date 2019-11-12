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
  getWidthScale(data) {
    // TODO: these need a constant for max which means there doesn't need to be
    // a parameter which in turn means in can be transformed into a variable
    var max = this.max;
    var min = this.min;
    return d3.scaleTime()
      .domain([min, max])
      /*
      .domain(d3.extent(data, function(d) {
        return new Date(d);
      }))
      */
      .rangeRound([0, this.width])
      .nice();
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
      return parseTime(d[obj.yLabel]);
    });
  };
}; // End Class
