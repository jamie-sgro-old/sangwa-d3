/**
 *  @fileOverview saD3 is a javascript library extending the d3
 * functionality of common graphs matching the conventions perscribed
 * by Sangwa Solutions
 *
 *  @author       Jamie Sgro
 *
 *  @requires     {@link https://d3js.org/d3.v5.min.js d3.v5}
 */


/**
 * Base class of all d3 all super classes
 */

class Base_D3 {
  /** @constructor */
  constructor(width, height, margin, colour) {
    this.margin = margin;
    this.width = width - this.margin.left - this.margin.right;
    this.height = height - this.margin.top - this.margin.bottom;

    this.colourBottom = colour.bottom;
    this.colourTop = colour.top;

    /**
    * Formats the size of the element based on parameters set in construction
    *
    * Note that the 'this.' element is overwritten by d3 regardless of the class
    * The (path, obj) is a convention to denote this
    *
    * @param {obj} path - reference to the d3 object calling the function
    * @param {obj} obj - the class element typically evoked though 'this.'
    *
    */
    this.getSvgSize = function(path, obj) {
      path
        .attr("width", obj.width + obj.margin.left + obj.margin.right)
        .attr("height", obj.height + obj.margin.top + obj.margin.bottom)
    };

    this.svg = d3.select("body")
      .append("svg")
        .attr("class", "graph svg")
        .call(this.getSvgSize, this);

    this.canvas = this.svg
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  };
}; // End Class



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
  getBins(data) {
    var widthScale = this.getWidthScale(data);
    var binNum = this.binNum

    return d3.histogram()
      .domain(widthScale.domain())
      .thresholds(widthScale.ticks(binNum))
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
    var map = this.getMap(rawData);

    var data = this.getBins(map);
    console.log(data);

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
    return d3.scaleLinear()
      .domain([0, d3.max(data)])
      .rangeRound([0, this.width]);
  };


  /**
   * getMap - pre clean raw data in the form of an integer to float messy integers
   *
   * @param  {array} rawData an array of json objects
   * @return {array}         an array of parsed json objects according to
   *  parseFloat()
   */
  getMap(rawData) {
    var yLabel = this.yLabel
    return rawData.map(function(d, i) {
      return parseFloat(d[yLabel]);
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
    return d3.scaleTime()
      .domain(d3.extent(data, function(d) {
        return new Date(d);
      }))
      .rangeRound([0, this.width]);
  };



  /**
   * getMap - pre clean raw data in the form of a string that matches the date
   * string provided
   *
   * @param  {array} rawData an array of json objects
   * @return {array}         an array of parsed json objects according to
   *  d3.timeParse
   */
  getMap(rawData) {
    var yLabel = this.yLabel
    var parseTime = d3.timeParse("%Y-%m-%d");
    return rawData.map(function(d, i) {
      return parseTime(d[yLabel]);
    });
  };
}; // End Class



/** BAR GRAPH ***/


/**
 * BarGraph - creates a series of bars (rectangles) based on x and y data
 * @DEPRECATED
 */
class BarGraph extends Base_D3 {
  /** @constructor */
  constructor(width, height, margin, colour) {
    super(width, height, margin, colour);

    this.xLabel = "start_date";
  };



  /**
   * getColour - map integer value along a range between two or more colours
   *
   * @param  {array} data value in question to be mapped
   * @return {obj}      a linear scale as a hexidecimal or rgb
   */
  getColour(data) {
    return d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {
        return d.value;
      })])
      .range([this.colourBottom, this.colourTop]);
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
        return d.value;
      })])
      .range([0, this.height]);
  };



  // TODO: add switch to include non-date data
  /* DEPRECATED
  getHeightScale() {
    return d3.scaleBand()
      .domain(dataArray.map(function(d) {
        return d.name;
      }))
    .range([this.height, 0])
    .padding(0.1)
  };
  */



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
    var xLabel = this.xLabel;
    return d3.scaleTime()
      .domain(d3.extent(data, function(d) {
        return new Date(d[xLabel]);
      }))
      .range([0, this.width]);
  };



  // TODO: add switch to include non-date data
  /* DEPRECATED
  getWidthScale() {
    return d3.scaleLinear()
      .domain([0, this.max])
      .range([0, this.width]);
  };
  */



  /**
  * getXAxis - create an x axis on left within the g element
  *
  * @param   {obj} path - reference to the d3 object calling the function
  * @param   {obj} obj - the class element typically evoked though 'this.'
  * @param   {obj} data - reference to the data from d3 object calling the function
  */
  getXAxis(path, obj, data) {
    path
      //.attr("transform", "translate(0," + obj.height + ")")
      .call(d3.axisTop(obj.getWidthScale(data)));
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
    var parseTime = d3.timeParse("%Y-%m-%d");

    var widthScale = obj.getWidthScale(path.data());
    var heightScale = obj.getHeightScale(path.data());
    var colour = obj.getColour(path.data());

    for (key in attributes) {
      switch (attributes[key]) {
        case "x":
          path.attr("x", function(d) {
            return widthScale(parseTime(d[obj.xLabel]));
          });
          break;
        case "height":
          path.attr("height", function(d) {
            return heightScale(d.value);
          })
          break;
        case "fill":
          path.attr("fill", function(d) {
            return colour(d.value)
          })
          break;
        case "fillTransparent":
          path.attr("fill", function(d) {
            rtn = colour(d.value);
            return setAlpha(rtn, 0);
          })
          break;
        case "y":
          path.attr("y", function(d) {
            return heightScale(d.name);
          })
          break;
        case "cx":
          path.attr("cx", function(d) {
            return widthScale(d.value);
          });
          break;
        case "cy":
          path.attr("cy", function(d) {
            return heightScale(d.name);
          })
          break;
        case "r":
          path.attr("r", heightScale.bandwidth()/2)
          break;
      };
    };
  };



  /**
   * plot - Instantiate the visualization based on the data provided
   *
   * @param  {array} rawData an array of json objects with a common key
   */
  plot(data) {
    this.canvas.selectAll("rect.bar")
      .data(data)
      .enter()
      .append("rect")
          .attr("class", "bar")
          .attr("width", 60)
          .attr("width", 3)
          .call(this.getAttr, this, ["x", "height", "fill"])
          .attr("y", 0)

    // add the x Axis
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
}










//
