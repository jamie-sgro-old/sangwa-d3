/**
 * Extention of Histogram for data that is of type: string
 * @class
 *
 * Currently, date strings are expected to match the d3.timeParse "%Y-%m-%d"
 * i.e. "2004-04-15"
 */
class Histogram_Date extends Histogram {
  /** @constructor */
  constructor(width, height, margin, colour, binNum, yLabel) {
    super(width, height, margin, colour, binNum, yLabel);

    this._date = new _Date;

    this.getWidthScale = this._date.getWidthScale;
    this.parseRawData = this._date.parseRawData_one;
  };
}; // End Class
