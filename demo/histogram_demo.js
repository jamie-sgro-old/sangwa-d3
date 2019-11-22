var running = true;

if (running) {
  h = new Histogram_Int(
		"histogramInt.svg",
    800,
    300,
    {top: 10, right: 30, bottom: 30, left: 30},
    {top: "rgb(237, 85, 101)", bottom: "rgb(255, 255, 255)"},
    binNum = 10
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


  h.plot(dataInt);


  h = new Histogram_Date(
		"histogramDate.svg",
    800,
    300,
    {top: 10, right: 30, bottom: 30, left: 30},
    {top: "rgb(237, 85, 101)", bottom: "rgb(255, 255, 255)"},
    binNum = 10
  );

  h.plot(dataDate);
}
