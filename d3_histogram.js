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
  }

  getWidthScale(map) {
    return d3.scaleLinear()
      .domain([0, d3.max(map)])
      .rangeRound([0, this.width])
  }

  plot(data) {
    var width = this.width,
      height = this.height

    var map = data.map(function(d,i) {
      return parseFloat(d.age);
    })

    var formatCount = d3.format(",.0f");

    var widthScale = this.getWidthScale(map);

    var bins = d3.histogram()
      .domain(widthScale.domain())
      .thresholds(widthScale.ticks(10))
      (map);

    var heightScale = this.getHeightScale(bins);

    var bar = this.canvas.selectAll(".bar")
      .data(bins)
      .enter()
      .append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + widthScale(d.x0) + "," + heightScale(d.length) + ")"; })
        .append("rect")
          .attr("x", 1)
          .attr("width", widthScale(bins[0].x1) - widthScale(bins[0].x0) - 1)
          .attr("height", function(d) { return height - heightScale(d.length); });

    bar.append("text")
      .attr("dy", ".75em")
      .attr("y", 6)
      .attr("x", (widthScale(bins[0].x1) - widthScale(bins[0].x0)) / 2)
      .attr("text-anchor", "middle")
      .text(function(d) { return formatCount(d.length); });

    this.canvas.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(widthScale));
  };
};



h = new Histogram(
  960,
  500,
  {top: 10, right: 30, bottom: 30, left: 30},
  {top: "rgb(237, 85, 101)", bottom: "rgb(255, 255, 255)"}
);

data = [{"name":"Mark","age":"5"},{"name":"Mark","age":"1"},{"name":"Mark","age":"35"},{"name":"Mark","age":"55"},{"name":"Mark","age":"6"},{"name":"Mark","age":"3"},{"name":"Mark","age":"34"},{"name":"Mark","age":"76"},{"name":"Mark","age":"23"},{"name":"Mark","age":"64"},{"name":"Mark","age":"23"},{"name":"Mark","age":"1"},{"name":"Mark","age":"3"},{"name":"Mark","age":"6"},{"name":"Mark","age":"14"},{"name":"Mark","age":"13"},{"name":"Mark","age":"11"},{"name":"Mark","age":"25"},{"name":"Mark","age":"35"},{"name":"Mark","age":"45"},{"name":"Mark","age":"55"},{"name":"Mark","age":"25"},{"name":"Mark","age":"34"},{"name":"Mark","age":"54"},{"name":"Mark","age":"53"},{"name":"Mark","age":"52"},{"name":"Mark","age":"51"},{"name":"Mark","age":"45"},{"name":"Mark","age":"47"},{"name":"Mark","age":"36"},{"name":"Mark","age":"39"},{"name":"Mark","age":"8"},{"name":"Mark","age":"19"},{"name":"Mark","age":"56"},{"name":"Mark","age":"87"},{"name":"Mark","age":"76"},{"name":"Mark","age":"74"},{"name":"Mark","age":"73"},{"name":"Mark","age":"26"},{"name":"Mark","age":"45"}]

h.plot(data)





//
