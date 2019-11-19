/**
 * Extention of Data_D3 for data that is of type: Int
 * @class
 *
 *
 */
class _Int {
  /** @constructor */
  constructor() {

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
  parseRawData_one(obj, rawData) {
    return rawData.map(function(d, i) {
      return parseFloat(d[obj.yLabel]);
    });
  };



  /**
   * parseRawData - pre clean raw data in the form of a string that matches the
   *  date string inherited from class
   *
   * @param  {array} rawData an array of json objects
   * @return {array}         an array of parsed json objects according to
   *  d3.timeParse
   */
  parseRawData_two(obj, rawData) {
    return rawData.map(function(d, i) {
      return {
        [obj.xLabel]: parseFloat(d[obj.xLabel]),
        [obj.yLabel]: parseFloat(d[obj.yLabel])
      };
    });
  };
}; // End Class
