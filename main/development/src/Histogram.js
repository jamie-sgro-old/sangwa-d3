/**
 * Create a histogram defined by the use of a bin to aggregate similar data
 */
class Histogram extends Base_D3 {
  /** @constructor */
  constructor(width, height, margin, colour, binNum) {
    super(width, height, margin, colour);

    this.binNum = binNum
    this.yLabel = "value"
  }


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
    var widthScale = obj.getWidthScale(data);

    return d3.histogram()
      .domain(widthScale.domain())
      .thresholds(widthScale.ticks(obj.binNum))
      (data);
  };



  /**
  * getXAxis - create an x axis on left within the g element
  *
  * @param   {obj} path - reference to the d3 object calling the function
  * @param   {obj} obj - the class element typically evoked though 'this.'
  * @param   {obj} data - reference to the data from d3 object calling the function
  */
  getXAxis(path, obj, data) {
    path
      .attr("transform", "translate(0," + obj.height + ")")
      .call(d3.axisBottom(obj.getWidthScale(data)));
  }



  /**
  * getYAxis - create a y axis on the top of svg within the g element
  *
  * @param   {obj} path - reference to the d3 object calling the function
  * @param   {obj} obj - the class element typically evoked though 'this.'
  * @param   {obj} data - reference to the data from d3 object calling the function
  */
  getYAxis(path, obj, data) {
    path
      .call(d3.axisLeft(obj.getHeightScale(data)));
  }



  /**
  * Constructor for reused attributes for d3 elements. All updates to common
  * atrributes are stored in this single function for rapid updating
  *
  * @param {obj} path - reference to the d3 object calling the function
  * @param {obj} obj - the class element typically evoked though 'this.'
  * @param {array} attributes - array of strings that match d3 attributes
  *
  */
  getAttr(path, obj, attributes) {
    var key;

    //flatten data with d3.merge
    var widthScale = obj.getWidthScale(path.data());
    var heightScale = obj.getHeightScale(path.data());

    for (key in attributes) {
      switch (attributes[key]) {
        case "x":
          path.attr("x", function(d) {
            return widthScale(d.x0);
          });
          break;
        case "y":
          path.attr("y", function(d) {
            return heightScale(d.length)
          });
          break;
        case "width":
          path.attr("width", function(d) {
            var db = path.data()
            return widthScale(db[0].x1) - widthScale(db[0].x0) - 1;
          });
          break;
        case "height":
          path.attr("height", function(d) {
            return obj.height - heightScale(d.length);
          })
          break;
        case "xText":
          path.attr("x", function(d) {
            var db = path.data()
            return (widthScale(db[0].x1) - widthScale(db[0].x0)) / 2;
          });
          break;
      };
    };
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

    var data = this.getBins(this, map);

    this.canvas.selectAll("rect.bar")
      .data(data)
      .enter()
      .append("rect")
        .attr("class", "bar")
        .call(this.getAttr, this, ["x", "y", "width", "height"])
        .attr("transform", "translate(" + 1 + "," + 0 + ")")
        .attr("fill", "steelblue")

    this.canvas.selectAll("rect.bar")
      .append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .call(this.getAttr, this, ["xText"])
        .attr("text-anchor", "middle")
        .text(function(d) {
          var formatCount = d3.format(",.0f");
          return formatCount(d.length);
        });

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
  }


  /**
  * Map Integers of any range to a particular pixel point on an svg element
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
    return d3.scaleLinear()
      .domain([0, max])
      .rangeRound([0, this.width])
      .nice();
  };


  /**
   * getMap - pre clean raw data in the form of an integer to float messy integers
   *
   * i.e. turns [{value: "5"},{value: "1"},{value: "35"}] into [5,1,35]
   *
   * @param  {array} rawData an array of json objects
   * @return {array}         an array of parsed json objects according to
   *  parseFloat()
   */
  getMap(obj, rawData) {
    return rawData.map(function(d, i) {
      return parseFloat(d[obj.yLabel]);
    });
  };
}; // End Class



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
  }


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
