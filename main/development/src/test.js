var running = "hist";

if (running == "bar") {
  b = new Bargraph_Date(
    800,
    250,
    {top: 30, right: 30, bottom: 30, left: 30},
    {top: "rgb(20, 183, 239)", bottom: "rgb(255, 255, 255)"},
    yLabel = "value",
    xLabel = "start_date",
  );

  dataDate = [
    {start_date: "2004-04-07", value: 2},
    {start_date: "2004-04-09", value: 2},
    {start_date: "2004-04-12", value: 2},
    {start_date: "2004-04-13", value: 2},
    {start_date: "2004-04-14", value: 2},
    {start_date: "2004-04-15", value: 2},
    {start_date: "2004-04-16", value: 6},
    {start_date: "2004-04-17", value: 2},
    {start_date: "2004-04-18", value: 10},
    {start_date: "2004-04-19", value: 8},
  ]

  b.plot(dataDate);
} else if (running == "hist") {
  h = new Histogram_Int(
    "histogramInt.svg",
    800,
    250,
    {top: 30, right: 30, bottom: 30, left: 30},
    {top: "rgb(20, 183, 239)", bottom: "rgb(255, 255, 255)"},
    binNum = 10,
    yLabel = "value",
  );

  dataInt = [
    {"value":"5"},{"value":"1"},{"value":"35"},{"value":"55"},{"value":"6"},
    {"value":"3"},{"value":"34"},{"value":"76"},{"value":"23"},{"value":"64"},
    {"value":"23"},{"value":"1"},{"value":"3"},{"value":"6"},{"value":"14"},
    {"value":"13"},{"value":"11"},{"value":"25"},{"value":"35"},{"value":"45"},
    {"value":"55"},{"value":"25"},{"value":"34"},{"value":"54"},{"value":"53"},
    {"value":"52"},{"value":"51"},{"value":"45"},{"value":"47"},{"value":"36"},
    {"value":"39"},{"value":"8"},{"value":"19"},{"value":"56"},{"value":"87"},
    {"value":"76"},{"value":"74"},{"value":"73"},{"value":"26"},{"value":"45"}
  ]

  h.plot(dataInt);



  h = new Histogram_Date(
    "histogramDate.svg",
    800,
    250,
    {top: 30, right: 30, bottom: 30, left: 30},
    {top: "rgb(20, 183, 239)", bottom: "rgb(255, 255, 255)"},
    binNum = 10,
    yLabel = "value",
  );

  dataDate = [
    {value: "2004-04-15", null: 2},
    {value: "2004-11-01", null: 2},
    {value: "2005-01-21", null: 2},
    {value: "2005-01-22", null: 2},
    {value: "2005-02-17", null: 2},
    {value: "2005-05-01", null: 2},
    {value: "2005-06-21", null: 6},
    {value: "2005-07-01", null: 2},
    {value: "2005-07-12", null: 10},
    {value: "2005-07-14", null: 8},
  ]

  h.plot(dataDate);
}
