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
};



class Histogram extends D3Skeleton {
  /** @constructor */
  constructor(width, height, margin, colour) {
    super(width, height, margin, colour);
  }

  getHeightScale(bins) {
    return d3.scaleLinear()
      .domain([0, d3.max(bins, function(d) {
        return d.length;
      })])
      .range([this.height, 0]);
  };

  getWidthScale(map) {
    return d3.scaleLinear()
      .domain([0, d3.max(map)])
      .rangeRound([0, this.width]);
  };

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
            return widthScale(path.data()[0].x1) - widthScale(path.data()[0].x0) - 1;
          });
          break;
        case "height":
          path.attr("height", function(d) {
            return obj.height - heightScale(d.length);
          })
          break;
      };
    };
  };

  plot(data) {
    var map = data.map(function(d,i) {
      return parseFloat(d.value);
    })

    var formatCount = d3.format(",.0f");

    var widthScale = this.getWidthScale(map);

    var bins = d3.histogram()
      .domain(widthScale.domain())
      .thresholds(widthScale.ticks(10))
      (map);

    var heightScale = this.getHeightScale(bins);

    var bar = this.canvas.selectAll("rect.bar")
      .data(bins)
      .enter()
      .append("rect")
        .attr("class", "bar")
        .call(this.getAttr, this, ["x", "y", "width", "height"])
        .attr("transform", "translate(" + 1 + "," + 0 + ")")
        .attr("fill", "steelblue")

    bar.append("text")
      .attr("dy", ".75em")
      .attr("y", 6)
      .attr("x", (widthScale(bins[0].x1) - widthScale(bins[0].x0)) / 2)
      .attr("text-anchor", "middle")
      .text(function(d) { return formatCount(d.length); });

    this.canvas
      .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(widthScale));
  };
};



h = new Histogram(
  960,
  500,
  {top: 10, right: 30, bottom: 30, left: 30},
  {top: "rgb(237, 85, 101)", bottom: "rgb(255, 255, 255)"}
);

data = [{"name":"Mark","value":"5"},{"name":"Mark","value":"1"},{"name":"Mark","value":"35"},{"name":"Mark","value":"55"},{"name":"Mark","value":"6"},{"name":"Mark","value":"3"},{"name":"Mark","value":"34"},{"name":"Mark","value":"76"},{"name":"Mark","value":"23"},{"name":"Mark","value":"64"},{"name":"Mark","value":"23"},{"name":"Mark","value":"1"},{"name":"Mark","value":"3"},{"name":"Mark","value":"6"},{"name":"Mark","value":"14"},{"name":"Mark","value":"13"},{"name":"Mark","value":"11"},{"name":"Mark","value":"25"},{"name":"Mark","value":"35"},{"name":"Mark","value":"45"},{"name":"Mark","value":"55"},{"name":"Mark","value":"25"},{"name":"Mark","value":"34"},{"name":"Mark","value":"54"},{"name":"Mark","value":"53"},{"name":"Mark","value":"52"},{"name":"Mark","value":"51"},{"name":"Mark","value":"45"},{"name":"Mark","value":"47"},{"name":"Mark","value":"36"},{"name":"Mark","value":"39"},{"name":"Mark","value":"8"},{"name":"Mark","value":"19"},{"name":"Mark","value":"56"},{"name":"Mark","value":"87"},{"name":"Mark","value":"76"},{"name":"Mark","value":"74"},{"name":"Mark","value":"73"},{"name":"Mark","value":"26"},{"name":"Mark","value":"45"}]

h.plot(data)





//
