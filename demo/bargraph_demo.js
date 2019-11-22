var running = true;

if (running) {
  b = new Bargraph_Date(
		"bargraphDate.svg",
    960,
    500,
    {top: 30, right: 30, bottom: 30, left: 30},
    {top: "rgb(237, 85, 101)", bottom: "rgb(255, 255, 255)"},
  );

  dataDate = [
    {start_date: "2004-04-10", value: 2},
    {start_date: "2004-04-11", value: 2},
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
}
