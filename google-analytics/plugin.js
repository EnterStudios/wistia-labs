// Generated by CoffeeScript 1.6.3
Wistia.plugin("googleAnalytics", function(video, options) {
  var buckets, percentWatched, pushEvent, triggerPercent, _fn, _i, _len, _ref;
  if (options == null) {
    options = {};
  }
  buckets = [];
  percentWatched = function() {
    var bucket, watched, _i, _len;
    watched = 0;
    for (_i = 0, _len = buckets.length; _i < _len; _i++) {
      bucket = buckets[_i];
      if (bucket) {
        watched += 1;
      }
    }
    return watched / buckets.length;
  };
  video.ready(function() {
    var i, _i, _ref, _results;
    _results = [];
    for (i = _i = 0, _ref = Math.floor(video.duration()); 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      _results.push(buckets.push(false));
    }
    return _results;
  });
  video.bind("secondchange", function(s) {
    return buckets[s] = true;
  });
  pushEvent = function(name, val) {
    if (!window._gaq) {
      if (typeof console !== "undefined" && console !== null) {
        console.log("Could not send data to google analytics because _gaq is not defined.");
      }
    } else {
      return _gaq.push(['_trackEvent', 'Video', name, val]);
    }
  };
  _ref = [.25, .5, .75, 1];
  _fn = function(triggerPercent) {
    return video.bind("secondchange", function(s) {
      var percent;
      percent = percentWatched();
      if (buckets.length > 0 && percent >= triggerPercent) {
        pushEvent("" + (Math.round(triggerPercent * 100)) + " Watched", video.name());
        video.trigger("pushedtogoogleanalytics", "percentwatched", triggerPercent);
        return this.unbind;
      }
    });
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    triggerPercent = _ref[_i];
    _fn(triggerPercent);
  }
  video.bind("secondchange", function(s) {
    if (buckets.length > 0) {
      return video.trigger("percentwatched", percentWatched());
    } else {
      return video.trigger("percentwatched", 0);
    }
  });
  video.bind("play", function() {
    pushEvent("Play", video.name());
    video.trigger("pushedtogoogleanalytics", "play");
    return this.unbind;
  });
  video.bind("conversion", function() {
    pushEvent("Conversion", video.name());
    video.trigger("pushedtogoogleanalytics", "conversion");
    return this.unbind;
  });
  return {
    buckets: buckets,
    percentWatched: percentWatched,
    pushEvent: pushEvent
  };
});
