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
  getWidthScale(min, max) {
    return d3.scaleLinear()
      .domain([0, max])
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
