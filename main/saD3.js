class D3Skeleton {
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



class Histogram extends D3Skeleton {
  /** @constructor */
  constructor(width, height, margin, colour, binNum) {
    super(width, height, margin, colour);

    this.binNum = binNum
    this.yLabel = "value"
  }



  getHeightScale(data) {
    return d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {
        return d.length;
      })])
      .range([this.height, 0]);
  };



  getWidthScale(map) {};



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



  getMap(rawData) {};



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



class Histogram_Int extends Histogram {
  /** @constructor */
  constructor(width, height, margin, colour, binNum) {
    super(width, height, margin, colour, binNum);
  }



  getWidthScale(map) {
    return d3.scaleLinear()
      .domain([0, d3.max(map)])
      .rangeRound([0, this.width]);
  };



  getMap(rawData) {
    var yLabel = this.yLabel
    return rawData.map(function(d, i) {
      return parseFloat(d[yLabel]);
    });
  };
}; // End Class



class Histogram_Date extends Histogram {
  /** @constructor */
  constructor(width, height, margin, colour, binNum) {
    super(width, height, margin, colour, binNum);
  }



  getWidthScale(map) {
    return d3.scaleTime()
      .domain(d3.extent(map, function(d) {
        return new Date(d);
      }))
      .rangeRound([0, this.width]);
  };



  getMap(rawData) {
    var yLabel = this.yLabel
    var parseTime = d3.timeParse("%Y-%m-%d");
    return rawData.map(function(d, i) {
      return parseTime(d[yLabel]);
    });
  };
}; // End Class










//
