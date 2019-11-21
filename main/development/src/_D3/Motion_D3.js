/**
 * Base class of all d3 motion related functions
 */

class Motion_D3 {
  /** @constructor */
  constructor() {

  };



  /**
   * attrTween - Create a shell of the d3 object conducting a linear
   *  interpolation before conducting said interpolation.
   * i.e. .call(attrTween, 800, "stroke", "white"); changed colour outline to
   * white over the course of 800 miliseconds.
   *
   * Note: Concurrent linear interpolations must be conducted thorugh d3 shells
   *  (indicated as 'var dummy' in this function), otherwise, the Concurrent
   *  interpolation that ends last will overwrite non-shelled interpolations.
   *  This is especially important for objects that move while chagning colour
   *  for example.
   *
   * @param  {obj} path identifier of the d3 object (like self in python
   *  functions)
   * @param  {int} duration number of miliseconds to conduct interpolation
   * @param  {string} attr the attr element to be modified i.e. "x" or
   *  "width"
   * @param  {obj/string} endRes Final result for the interpolation.
   *  - can be complex and call d3 functions/variables that use functions like
   *    d3.scaleLinear() i.e. widthScale(d.value)
   * - can be primitive like a string or int. i.e. "white" or 2
   */
  attrTween(path, duration, attr, endRes) {
    var dummy = {};

    d3.select(dummy)
      .transition()
      .duration(duration)
      .tween(attr, function() {
        var lerp = d3.interpolate(path.attr(attr), endRes);
        return function(t) {
          path.attr(attr, lerp(t));
        };
      });
  };



  /**
   * resetTween - same as attrTween, only it conducts two tweens synchronously,
   * one after the other.
   *
   * The duration for the second tween is set to be 3 times longer than the first
   * usefull for dynamic highlighting and so on.
   */
  resetTween(path, duration, attr, endRes, peakRes) {
    var dummy = {};

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
}; // End Class
