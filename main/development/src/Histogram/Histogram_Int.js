/**
 * Extention of Histogram for data that is of type: Int
 * @class
 *
 *
 */
class Histogram_Int extends Histogram {
  /** @constructor */
  constructor(id, width, height, margin, colour, binNum, yLabel) {
    super(id, width, height, margin, colour, binNum, yLabel);

    this._int = new _Int;

    this.getWidthScale = this._int.getWidthScale;
    this.parseRawData = this._int.parseRawData_one;
  };
}; // End Class
