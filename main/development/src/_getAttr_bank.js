_getAttr_cx(path, obj) {
  path.attr("cx", function(d) {
    return obj.widthScale(d[yLabel]);
  });
};
_getAttr_cy(path, obj) {
  path.attr("cy", function(d) {
    return obj.heightScale(d.name);
  });
};
_getAttr_r(path, obj) {
  path.attr("r", obj.heightScale.bandwidth()/2);
};
