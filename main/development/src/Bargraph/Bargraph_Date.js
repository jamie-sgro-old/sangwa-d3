/**
 * Extention of Bargraph for data that is of type: string
 * @class
 *
 * Currently, date strings are expected to match the d3.timeParse "%Y-%m-%d"
 * i.e. "2004-04-15"
 */
class Bargraph_Date extends Bargraph {
  /** @constructor */
  constructor(id, width, height, margin, colour, yLabel, xLabel) {
    super(id, width, height, margin, colour, yLabel, xLabel);

    this._date = new _Date;

    this.getWidthScale = this._date.getWidthScale;
    this.parseRawData = this._date.parseRawData_two;
  };
};
