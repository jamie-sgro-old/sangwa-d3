/**
 * Extention of Data_D3 for data that is of type: string
 * @class
 *
 * Currently, date strings are expected to match the d3.timeParse "%Y-%m-%d"
 * i.e. "2004-04-15"
 */
class _Date {
  /** @constructor */
  constructor() {
    this.parseTime = d3.timeParse("%Y-%m-%d");
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
  getWidthScale(domain) {
    return d3.scaleTime()
      .domain(domain)
      .rangeRound([0, this.width])
      .nice();
  };



  /**
   * parseRawData - pre clean raw data in the form of a string that matches the date
   * string provided
   *
   * @param  {array} rawData an array of json objects
   * @return {array}         an array of parsed json objects according to
   *  d3.timeParse
   */
  parseRawData_one(obj, rawData) {
    return rawData.map(function(d, i) {
      return obj._date.parseTime(d[obj.yLabel]);
    });
  };



  /**
   * parseRawData - pre clean raw data in the form of a string that matches the date
   * string provided
   *
   * @param  {array} rawData an array of json objects
   * @return {array}         an array of parsed json objects according to
   *  d3.timeParse
   */
  parseRawData_two(obj, rawData) {
    return rawData.map(function(d, i) {
      return {
        [obj.xLabel]: obj._date.parseTime(d[obj.xLabel]),
        [obj.yLabel]: d[obj.yLabel]
      };
    });
  };
}; // End Class
