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

    var _date = new _Date;

    this.getWidthScale = _date.getWidthScale;
    this.parseRawData = _date.parseRawData_one;
  };
}; // End Class
