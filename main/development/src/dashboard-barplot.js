class Barplot {
  constructor(width, height, margin) {
    this.margin = margin;
    this.width = width;
    this.height = height - this.margin.top - this.margin.bottom;

    /* the (path, obj) convention is used to denote:
        path = d3 element
        obj = the barplot element typically evoked though 'this.'

      - note that the 'this.' element is overwritten by d3 regardless of the
        class
    */
    this.getSvgSize = function(path, obj) {
      path
        .attr("width", obj.width)
        .attr("height", obj.height + obj.margin.top + obj.margin.bottom)

      $(".barplot.svg").css({left: $(window).width()*(1-panelWidth), position:'relative'});
    };

    this.svg = d3.select("body")
      .append("svg")
        .attr("class", "barplot svg")
        .call(this.getSvgSize, this);

    this.canvas = this.svg
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define the div for the tooltip
    this.tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
  };



  getColour() {
    return d3.scaleLinear()
      .domain([0, d3.max(dataArray, function(d){
        return d.value;
      })])
      .range([colourBottom,colourTop]);
  };

  getWidthScale() {
    return d3.scaleLinear()
      .domain([0, this.max])
      .range([0, this.width - this.margin.left - this.margin.right]);
  };

  getHeightScale() {
    return d3.scaleBand()
      .range([this.height, 0])
      .padding(0.1)
      .domain(dataArray.map(function(d) {
        return d.name;
      }));
  };



  /* @getAttr(d3object, oject)
    - constructor for reused attributes for barplot. All updates to common
      atrributes are stored in this single function for rapid updating
    - the attributes object should be an array of strings that match d3
      attributes
  */
  getAttr(path, attributes) {
    var widthScale = barplot.getWidthScale();
    var heightScale = barplot.getHeightScale();
    var colour = barplot.getColour();

    for (key in attributes) {
      switch (attributes[key]) {
        case "width":
          path.attr("width", function(d) {
            return widthScale(d.value);
          });
          break;
        case "height":
          path.attr("height", heightScale.bandwidth())
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



  getXAxis(path, obj) {
    path
      .attr("transform", "translate(0," + obj.height + ")")
      .call(d3.axisBottom(obj.getWidthScale()));
  }

  getYAxis(path, obj) {
    path
      .call(d3.axisLeft(obj.getHeightScale()));
  }


  /* @toggleLeadLag()
    - fired when switch/slider checkbox is triggered (in home.html)
    - swithces leadLag opacity on or off
    - changes rect size to match min and max of the variable it's measuring
  */
  toggleLeadLag() {
    var widthScale = barplot.getWidthScale();

    if (document.getElementById("leadLag").checked) {
      var colour = barplot.getColour();

      // turn leadLag marker visible
      barplot.canvas.selectAll("rect.leadLag")
        .each(function(d,i) {
          d3.select(this).call(attrTween, 800, "fill", colour(d.value));
          d3.select(this).call(attrTween, 800, "stroke", "white");
        })

      barplot.canvas.selectAll("rect.bar")
        .transition()
        .duration(800)
        .attr("transform", function() {
          var rtn = d3.select(this).attr("min");
          rtn = widthScale(rtn);
          return "translate(" + rtn + ", 0)";
        })
        .attr("width", function() {
          var rtn = d3.select(this).attr("max");
          rtn -= d3.select(this).attr("min");
          return widthScale(rtn);
        })
        .attr("fill", function() {
          rtn = Number(d3.select(this).attr("min"));
          rtn += Number(d3.select(this).attr("max"));
          rtn /= 2;
          rtn = colour(rtn)
          rtn = setAlpha(rtn, 0.5)
          return rtn;
        })
        .attr("stroke", "black")
    } else {

      // turn leadLag marker invisible
      barplot.canvas.selectAll("rect.leadLag")
        .each(function() {
          var myCol = d3.select(this).attr("fill");
          d3.select(this).call(attrTween, 800, "fill", setAlpha(myCol, 0));
          d3.select(this).call(attrTween, 800, "stroke", "rgba(0,0,0,0)");
        })


      barplot.canvas.selectAll("rect.bar")
        .transition()
        .duration(800)
        .attr("transform", "translate(0, 0)")
        .attr("stroke", "rgba(0,0,0,0)")

      updateGraph(null)
    };
  };


    /* @plot(jsonArray)
      - ran once on screen load, instantiates every d3 elem in second panel
    */
    plot(dataArray, min, max) {
    var widthScale = barplot.getWidthScale();

    this.canvas.selectAll("rect.bar")
      .data(dataArray)
      .enter()
        .append("rect")
          .attr("class", "bar")
          .attr("name", function(d) {
            return d.name;
          })
          .attr("min", function(d, i) {
            return min[i];
          })
          .attr("max", function(d, i) {
            return max[i];
          })
          .attr("width", function(d) {
            return widthScale(0);
          })
          .call(this.getAttr, ["height", "fill", "y"])
          .attr("stroke", "rgba(0,0,0,0)")
          .style("cursor", "pointer")
          .on("click", this.onClick)
          .on("mouseover", this.onMouseover)
          .on("mouseout", this.onMouseOut)
          .on('mousemove', function() {
            barplot.tooltip
              .style("left", (d3.event.pageX + 10) + "px")
              .style("top", (d3.event.pageY) + "px")

            checkOffScreen();
          })

    // add markers for leadLag plot
    this.canvas.selectAll("rect.leadLag")
      .data(dataArray)
      .enter()
        .append("rect")
          .attr("class", "leadLag")
          .attr("widthFactor", 0.05)
          //invisible until first marker is selected
          .call(this.getAttr, ["x", "y", "height", "fillTransparent"])
          .attr("width", function() {
            var widthFactor = d3.select(this).attr("widthFactor");
            return barplot.width * widthFactor;
          })
          .attr("stroke", "rgba(0,0,0,0)")
          .attr("pointer-events","none")


    // add the x Axis
    this.canvas.append("g")
      .attr("class", "x axis")
      .call(this.getXAxis, this);

    // add the y Axis
    this.canvas.append("g")
      .attr("class", "y axis")
      .call(this.getYAxis, this);
  };



  onClick(data) {
    console.log(d3.select(this).attr("min"))
    console.log(d3.select(this).attr("max"))
    // change marker size based on data value
    var radiusScale = d3.scaleLinear()
      .domain([0, d3.max(dataArray, function(d){
        return d.value;
      })])
      .range([scl/2, scl*2]);

    // update the map marker colour
    g.selectAll("circle")
      .each(function(d,i) {
        d3.select(this).call(attrTween, 500, "r", radiusScale(d[data.name]))
      })


    if (!document.getElementById("leadLag").checked) {
      var myCol = d3.select(this).attr("fill");

      d3.select(this)
        .call(resetTween, 100, "fill", setAlpha(myCol, 1), setAlpha(myCol, .4))
    };


    for (i in mark) {
      var rad = Math.round(scl+radiusScale(d3.select(this).data()[0].value))
      mark[i].setStyle({radius: rad})
    };
  };



  onMouseover(data) {
    //remove old text
    barplot.tooltip
      .html("")

    //remove old img
    barplot.tooltip
      .selectAll("img")
      .remove()

    //try to append now image
    barplot.tooltip
      .append("img")
        .attr("class", "picture")
        .attr("src", function(d) {
          return "public/images/sdg-icons/" + data.name + ".png";
        })
        .on("error", function(d) {
          barplot.tooltip
            .html(data.name)
        })

    barplot.tooltip
      .transition()
      .duration(200)
      .style("opacity", 1)

    //retrieving data from rect obj must be done outside of tooltip functions
    var rectData = d3.select(this).data()[0]

    barplot.tooltip
      .transition()
      .delay(2000)
      .on("end", function() {
        d3.select(this)
          .html(d3.select(this).html() +
          " " + rectData.value)

        checkOffScreen();
      })

    var colour = barplot.getColour();

    g.selectAll("circle")
      .each(function(d,i) {
        //concurrent transitions that overlap the same attribute should have the
        //same duration so that the newest tween overwrites the old one
        d3.select(this).call(attrTween, 300, "fill", setAlpha(colour(d[data.name]), .8))
      })

    var myCol = d3.select(this).attr("fill")

    // highlight barplot if NOT in leadLag mode
    if (!document.getElementById("leadLag").checked) {
      d3.select(this)
        .call(resetTween, 100, "fill", setAlpha(myCol, 1), setAlpha(myCol, .7))
    };
  };



  onMouseOut() {
    barplot.tooltip.transition()
        .duration(200)
        .style("opacity", 0)

    g.selectAll("circle")
      .each(function(d,i) {
        d3.select(this).call(attrTween, 300, "fill", markCol)
      })

    //DEPRECIATED: removing marker variable
    /*for (i in mark) {
      mark[i].setStyle({radius: scl})
    };*/
  }

/*
getWidthScale() {
  return d3.scaleLinear()
    .domain([0, this.max])
    .range([0, this.width - this.margin.left - this.margin.right]);
};
*/


/* @updatePlot(svg, data)
  - run on marker click, resizes rectangle/circle attributes according to data
*/
  updatePlot(canvas, dataArray) {
    var widthScale = barplot.getWidthScale();
    var colour = barplot.getColour();

    if (!document.getElementById("leadLag").checked) {
      canvas.selectAll("rect.bar")
        .data(dataArray)
          .each(function(d, i) {
            d3.select(this).call(attrTween, 800, "width", widthScale(d.value));
            d3.select(this).call(attrTween, 800, "fill", colour(d.value));
          })
    };

    canvas.selectAll("rect.leadLag")
      .data(dataArray)
        .each(function(d, i) {
          var widthFactor = d3.select(this).attr("widthFactor");
          var xPos = widthScale(d.value) * (1 - widthFactor);
          d3.select(this).call(attrTween, 800, "x", xPos);
          if (document.getElementById("leadLag").checked) {
            d3.select(this).call(attrTween, 800, "fill", colour(d.value));
          };
        })
  };



  resize() {
    this.width = ($(window).width()*panelWidth);
    this.height = ($(window).height()-50) - this.margin.top - this.margin.bottom;

    var widthScale = barplot.getWidthScale();

    // update .rect width based on if leadLag mode is toggled
    if (document.getElementById("leadLag").checked) {
      this.canvas.selectAll("rect.bar")
        .attr("width", function() {
          var rtn = d3.select(this).attr("max");
          rtn -= d3.select(this).attr("min");
          return widthScale(rtn);
        })
    } else {
      this.canvas.selectAll("rect.bar")
        .call(this.getAttr, ["width"])
    };

    // update .rect height (same regardless of leadLag toggle)
    this.canvas.selectAll("rect.bar")
      .call(this.getAttr, ["height", "y"])

    this.canvas.selectAll("rect.leadLag")
      .call(this.getAttr, ["y", "height"])
      .attr("width", function() {
        var widthFactor = d3.select(this).attr("widthFactor");
        return barplot.width * widthFactor;
      })
      .attr("x", function(d) {
        var widthFactor = d3.select(this).attr("widthFactor");
        return widthScale(d.value) * (1 - widthFactor);
      });

    this.canvas.selectAll("g.x.axis")
      .call(this.getXAxis, this)

    this.canvas.selectAll("g.y.axis")
      .call(this.getYAxis, this)

    this.svg
      .call(this.getSvgSize, this)
  };
};



function setAlpha(c, v) {
  var c = d3.rgb(c);
  c.opacity = v;

  return c;
}



function attrTween(path, duration, attr, endRes) {
  var dummy = {};
  var colour = barplot.getColour();

  d3.select(dummy)
    .transition()
    .duration(duration)
    .tween(attr, function() {
      var lerp = d3.interpolate(path.attr(attr), endRes);
      return function(t) {
        path.attr(attr, lerp(t));
      };
    })
}



function resetTween(path, duration, attr, endRes, peakRes) {
  var dummy = {};
  var colour = barplot.getColour();

  d3.select(dummy)
    .transition()
    .duration(duration)
    .tween(attr, function() {
      var lerp = d3.interpolate(path.attr(attr), peakRes);
      return function(t) {
        path.attr(attr, lerp(t));
      };
    })
    .transition()
    .duration(duration*3)
    .tween(attr, function() {
      var lerp = d3.interpolate(peakRes, endRes);
      return function(t) {
        path.attr(attr, lerp(t));
      };
    })
}



function checkOffScreen() {
  var tooltipHtml = barplot.tooltip._groups[0][0]
  var svgHtml = d3.select(barplot.canvas)._groups[0][0]._groups[0][0];
  var absBottom = $(svgHtml).offset().top + parseInt(barplot.svg.style("height"));
  var absToolBottom = $(tooltipHtml).offset().top + parseInt(barplot.tooltip.style("height"));

  //check if tooltip offscreen
  try {
    var offScreenDiff = $(window).height() - event.clientY - parseInt(barplot.tooltip.style("height"))
    if (offScreenDiff < 0) {
      barplot.tooltip
        .style("top", parseInt(barplot.tooltip.style("top")) + offScreenDiff + "px");
      return;
    }
  } catch(error) {
	console.log(error);
  }

  //check if tooltip outside barplot svg offscreen
  if (absToolBottom > absBottom) {
    barplot.tooltip
      .style("top", absBottom - parseInt(barplot.tooltip.style("height")) + "px");
    return
  };
};
