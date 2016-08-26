(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./partials/_parallax');

require('./partials/_intro');

},{"./partials/_intro":2,"./partials/_parallax":3}],2:[function(require,module,exports){
'use strict';

var _randomcolor = require('randomcolor');

var _randomcolor2 = _interopRequireDefault(_randomcolor);

require('gsap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderIntro() {
  var logotype = document.querySelector('.js-logotype');
  var logomark = document.querySelector('.js-logomark');
  var logoNodes = logomark.childNodes;
  var tl = new TimelineMax();
  var shapes = [];

  for (var i in logoNodes) {
    var n = logoNodes[i];
    if (n.attributes) {
      shapes.push(n);
    };
  };

  var backgrounds = (0, _randomcolor2.default)({
    count: shapes.length,
    luminosity: 'light'
  });

  for (var i in shapes) {
    var shape = shapes[i];
    shape.setAttribute('fill', backgrounds[i]);
  };

  tl.staggerTo(shapes, 1, {
    delay: 0.25,
    opacity: 0.75,
    ease: Elastic.easeOut
  }, 0.05);

  var tween = TweenMax.to(logotype, 1, {
    delay: 0.5,
    opacity: 1,
    y: 0,
    ease: Elastic.easeOut
  }, 0.05);
};

document.addEventListener("DOMContentLoaded", function (event) {
  renderIntro();
});

},{"gsap":4,"randomcolor":5}],3:[function(require,module,exports){
'use strict';

var size = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content');

window.addEventListener('scroll', function (event) {

  if (size) {

    var depth, i, layer, layers, len, movement, topDistance, translate3d;
    topDistance = this.pageYOffset;
    layers = document.querySelectorAll('[data-type=\'parallax\']');

    for (i = 0, len = layers.length; i < len; i++) {
      layer = layers[i];
      depth = layer.getAttribute('data-depth');
      movement = -(topDistance * depth);
      translate3d = 'translate3d(0, ' + movement + 'px, 0)';
      layer.style['-webkit-transform'] = translate3d;
      layer.style['-moz-transform'] = translate3d;
      layer.style['-ms-transform'] = translate3d;
      layer.style['-o-transform'] = translate3d;
      layer.style.transform = translate3d;
    }
  }
});

},{}],4:[function(require,module,exports){
(function (global){
/*!
 * VERSION: 1.19.0
 * DATE: 2016-07-14
 * UPDATES AND DOCS AT: http://greensock.com
 * 
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {

	"use strict";

	_gsScope._gsDefine("TweenMax", ["core.Animation","core.SimpleTimeline","TweenLite"], function(Animation, SimpleTimeline, TweenLite) {

		var _slice = function(a) { //don't use [].slice because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
				var b = [],
					l = a.length,
					i;
				for (i = 0; i !== l; b.push(a[i++]));
				return b;
			},
			_applyCycle = function(vars, targets, i) {
				var alt = vars.cycle,
					p, val;
				for (p in alt) {
					val = alt[p];
					vars[p] = (typeof(val) === "function") ? val(i, targets[i]) : val[i % val.length];
				}
				delete vars.cycle;
			},
			TweenMax = function(target, duration, vars) {
				TweenLite.call(this, target, duration, vars);
				this._cycle = 0;
				this._yoyo = (this.vars.yoyo === true);
				this._repeat = this.vars.repeat || 0;
				this._repeatDelay = this.vars.repeatDelay || 0;
				this._dirty = true; //ensures that if there is any repeat, the totalDuration will get recalculated to accurately report it.
				this.render = TweenMax.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)
			},
			_tinyNum = 0.0000000001,
			TweenLiteInternals = TweenLite._internals,
			_isSelector = TweenLiteInternals.isSelector,
			_isArray = TweenLiteInternals.isArray,
			p = TweenMax.prototype = TweenLite.to({}, 0.1, {}),
			_blankArray = [];

		TweenMax.version = "1.19.0";
		p.constructor = TweenMax;
		p.kill()._gc = false;
		TweenMax.killTweensOf = TweenMax.killDelayedCallsTo = TweenLite.killTweensOf;
		TweenMax.getTweensOf = TweenLite.getTweensOf;
		TweenMax.lagSmoothing = TweenLite.lagSmoothing;
		TweenMax.ticker = TweenLite.ticker;
		TweenMax.render = TweenLite.render;

		p.invalidate = function() {
			this._yoyo = (this.vars.yoyo === true);
			this._repeat = this.vars.repeat || 0;
			this._repeatDelay = this.vars.repeatDelay || 0;
			this._uncache(true);
			return TweenLite.prototype.invalidate.call(this);
		};
		
		p.updateTo = function(vars, resetDuration) {
			var curRatio = this.ratio,
				immediate = this.vars.immediateRender || vars.immediateRender,
				p;
			if (resetDuration && this._startTime < this._timeline._time) {
				this._startTime = this._timeline._time;
				this._uncache(false);
				if (this._gc) {
					this._enabled(true, false);
				} else {
					this._timeline.insert(this, this._startTime - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
				}
			}
			for (p in vars) {
				this.vars[p] = vars[p];
			}
			if (this._initted || immediate) {
				if (resetDuration) {
					this._initted = false;
					if (immediate) {
						this.render(0, true, true);
					}
				} else {
					if (this._gc) {
						this._enabled(true, false);
					}
					if (this._notifyPluginsOfEnabled && this._firstPT) {
						TweenLite._onPluginEvent("_onDisable", this); //in case a plugin like MotionBlur must perform some cleanup tasks
					}
					if (this._time / this._duration > 0.998) { //if the tween has finished (or come extremely close to finishing), we just need to rewind it to 0 and then render it again at the end which forces it to re-initialize (parsing the new vars). We allow tweens that are close to finishing (but haven't quite finished) to work this way too because otherwise, the values are so small when determining where to project the starting values that binary math issues creep in and can make the tween appear to render incorrectly when run backwards. 
						var prevTime = this._totalTime;
						this.render(0, true, false);
						this._initted = false;
						this.render(prevTime, true, false);
					} else {
						this._initted = false;
						this._init();
						if (this._time > 0 || immediate) {
							var inv = 1 / (1 - curRatio),
								pt = this._firstPT, endValue;
							while (pt) {
								endValue = pt.s + pt.c;
								pt.c *= inv;
								pt.s = endValue - pt.c;
								pt = pt._next;
							}
						}
					}
				}
			}
			return this;
		};
				
		p.render = function(time, suppressEvents, force) {
			if (!this._initted) if (this._duration === 0 && this.vars.repeat) { //zero duration tweens that render immediately have render() called from TweenLite's constructor, before TweenMax's constructor has finished setting _repeat, _repeatDelay, and _yoyo which are critical in determining totalDuration() so we need to call invalidate() which is a low-kb way to get those set properly.
				this.invalidate();
			}
			var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
				prevTime = this._time,
				prevTotalTime = this._totalTime, 
				prevCycle = this._cycle,
				duration = this._duration,
				prevRawPrevTime = this._rawPrevTime,
				isComplete, callback, pt, cycleDuration, r, type, pow, rawPrevTime;
			if (time >= totalDur - 0.0000001) { //to work around occasional floating point math artifacts.
				this._totalTime = totalDur;
				this._cycle = this._repeat;
				if (this._yoyo && (this._cycle & 1) !== 0) {
					this._time = 0;
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				} else {
					this._time = duration;
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
				}
				if (!this._reversed) {
					isComplete = true;
					callback = "onComplete";
					force = (force || this._timeline.autoRemoveChildren); //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
				}
				if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
					if (this._startTime === this._timeline._duration) { //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
						time = 0;
					}
					if (prevRawPrevTime < 0 || (time <= 0 && time >= -0.0000001) || (prevRawPrevTime === _tinyNum && this.data !== "isPause")) if (prevRawPrevTime !== time) { //note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
						force = true;
						if (prevRawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
					this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				}
				
			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = this._cycle = 0;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				if (prevTotalTime !== 0 || (duration === 0 && prevRawPrevTime > 0)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (prevRawPrevTime >= 0) {
							force = true;
						}
						this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					}
				}
				if (!this._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
					force = true;
				}
			} else {
				this._totalTime = this._time = time;
				if (this._repeat !== 0) {
					cycleDuration = duration + this._repeatDelay;
					this._cycle = (this._totalTime / cycleDuration) >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)
					if (this._cycle !== 0) if (this._cycle === this._totalTime / cycleDuration && prevTotalTime <= time) {
						this._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
					}
					this._time = this._totalTime - (this._cycle * cycleDuration);
					if (this._yoyo) if ((this._cycle & 1) !== 0) {
						this._time = duration - this._time;
					}
					if (this._time > duration) {
						this._time = duration;
					} else if (this._time < 0) {
						this._time = 0;
					}
				}

				if (this._easeType) {
					r = this._time / duration;
					type = this._easeType;
					pow = this._easePower;
					if (type === 1 || (type === 3 && r >= 0.5)) {
						r = 1 - r;
					}
					if (type === 3) {
						r *= 2;
					}
					if (pow === 1) {
						r *= r;
					} else if (pow === 2) {
						r *= r * r;
					} else if (pow === 3) {
						r *= r * r * r;
					} else if (pow === 4) {
						r *= r * r * r * r;
					}

					if (type === 1) {
						this.ratio = 1 - r;
					} else if (type === 2) {
						this.ratio = r;
					} else if (this._time / duration < 0.5) {
						this.ratio = r / 2;
					} else {
						this.ratio = 1 - (r / 2);
					}

				} else {
					this.ratio = this._ease.getRatio(this._time / duration);
				}
				
			}
				
			if (prevTime === this._time && !force && prevCycle === this._cycle) {
				if (prevTotalTime !== this._totalTime) if (this._onUpdate) if (!suppressEvents) { //so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
					this._callback("onUpdate");
				}
				return;
			} else if (!this._initted) {
				this._init();
				if (!this._initted || this._gc) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
					return;
				} else if (!force && this._firstPT && ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration))) { //we stick it in the queue for rendering at the very end of the tick - this is a performance optimization because browsers invalidate styles and force a recalculation if you read, write, and then read style data (so it's better to read/read/read/write/write/write than read/write/read/write/read/write). The down side, of course, is that usually you WANT things to render immediately because you may have code running right after that which depends on the change. Like imagine running TweenLite.set(...) and then immediately after that, creating a nother tween that animates the same property to another value; the starting values of that 2nd tween wouldn't be accurate if lazy is true.
					this._time = prevTime;
					this._totalTime = prevTotalTime;
					this._rawPrevTime = prevRawPrevTime;
					this._cycle = prevCycle;
					TweenLiteInternals.lazyTweens.push(this);
					this._lazy = [time, suppressEvents];
					return;
				}
				//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
				if (this._time && !isComplete) {
					this.ratio = this._ease.getRatio(this._time / duration);
				} else if (isComplete && this._ease._calcEnd) {
					this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
				}
			}
			if (this._lazy !== false) {
				this._lazy = false;
			}

			if (!this._active) if (!this._paused && this._time !== prevTime && time >= 0) {
				this._active = true; //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
			}
			if (prevTotalTime === 0) {
				if (this._initted === 2 && time > 0) {
					//this.invalidate();
					this._init(); //will just apply overwriting since _initted of (2) means it was a from() tween that had immediateRender:true
				}
				if (this._startAt) {
					if (time >= 0) {
						this._startAt.render(time, suppressEvents, force);
					} else if (!callback) {
						callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
					}
				}
				if (this.vars.onStart) if (this._totalTime !== 0 || duration === 0) if (!suppressEvents) {
					this._callback("onStart");
				}
			}
			
			pt = this._firstPT;
			while (pt) {
				if (pt.f) {
					pt.t[pt.p](pt.c * this.ratio + pt.s);
				} else {
					pt.t[pt.p] = pt.c * this.ratio + pt.s;
				}
				pt = pt._next;
			}
			
			if (this._onUpdate) {
				if (time < 0) if (this._startAt && this._startTime) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
					this._startAt.render(time, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
				}
				if (!suppressEvents) if (this._totalTime !== prevTotalTime || callback) {
					this._callback("onUpdate");
				}
			}
			if (this._cycle !== prevCycle) if (!suppressEvents) if (!this._gc) if (this.vars.onRepeat) {
				this._callback("onRepeat");
			}
			if (callback) if (!this._gc || force) { //check gc because there's a chance that kill() could be called in an onUpdate
				if (time < 0 && this._startAt && !this._onUpdate && this._startTime) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
					this._startAt.render(time, suppressEvents, force);
				}
				if (isComplete) {
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this._callback(callback);
				}
				if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) { //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
					this._rawPrevTime = 0;
				}
			}
		};
		
//---- STATIC FUNCTIONS -----------------------------------------------------------------------------------------------------------
		
		TweenMax.to = function(target, duration, vars) {
			return new TweenMax(target, duration, vars);
		};
		
		TweenMax.from = function(target, duration, vars) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return new TweenMax(target, duration, vars);
		};
		
		TweenMax.fromTo = function(target, duration, fromVars, toVars) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return new TweenMax(target, duration, toVars);
		};
		
		TweenMax.staggerTo = TweenMax.allTo = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			stagger = stagger || 0;
			var delay = 0,
				a = [],
				finalComplete = function() {
					if (vars.onComplete) {
						vars.onComplete.apply(vars.onCompleteScope || this, arguments);
					}
					onCompleteAll.apply(onCompleteAllScope || vars.callbackScope || this, onCompleteAllParams || _blankArray);
				},
				cycle = vars.cycle,
				fromCycle = (vars.startAt && vars.startAt.cycle),
				l, copy, i, p;
			if (!_isArray(targets)) {
				if (typeof(targets) === "string") {
					targets = TweenLite.selector(targets) || targets;
				}
				if (_isSelector(targets)) {
					targets = _slice(targets);
				}
			}
			targets = targets || [];
			if (stagger < 0) {
				targets = _slice(targets);
				targets.reverse();
				stagger *= -1;
			}
			l = targets.length - 1;
			for (i = 0; i <= l; i++) {
				copy = {};
				for (p in vars) {
					copy[p] = vars[p];
				}
				if (cycle) {
					_applyCycle(copy, targets, i);
					if (copy.duration != null) {
						duration = copy.duration;
						delete copy.duration;
					}
				}
				if (fromCycle) {
					fromCycle = copy.startAt = {};
					for (p in vars.startAt) {
						fromCycle[p] = vars.startAt[p];
					}
					_applyCycle(copy.startAt, targets, i);
				}
				copy.delay = delay + (copy.delay || 0);
				if (i === l && onCompleteAll) {
					copy.onComplete = finalComplete;
				}
				a[i] = new TweenMax(targets[i], duration, copy);
				delay += stagger;
			}
			return a;
		};
		
		TweenMax.staggerFrom = TweenMax.allFrom = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return TweenMax.staggerTo(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};
		
		TweenMax.staggerFromTo = TweenMax.allFromTo = function(targets, duration, fromVars, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return TweenMax.staggerTo(targets, duration, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};
				
		TweenMax.delayedCall = function(delay, callback, params, scope, useFrames) {
			return new TweenMax(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, callbackScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, immediateRender:false, useFrames:useFrames, overwrite:0});
		};
		
		TweenMax.set = function(target, vars) {
			return new TweenMax(target, 0, vars);
		};
		
		TweenMax.isTweening = function(target) {
			return (TweenLite.getTweensOf(target, true).length > 0);
		};
		
		var _getChildrenOf = function(timeline, includeTimelines) {
				var a = [],
					cnt = 0,
					tween = timeline._first;
				while (tween) {
					if (tween instanceof TweenLite) {
						a[cnt++] = tween;
					} else {
						if (includeTimelines) {
							a[cnt++] = tween;
						}
						a = a.concat(_getChildrenOf(tween, includeTimelines));
						cnt = a.length;
					}
					tween = tween._next;
				}
				return a;
			}, 
			getAllTweens = TweenMax.getAllTweens = function(includeTimelines) {
				return _getChildrenOf(Animation._rootTimeline, includeTimelines).concat( _getChildrenOf(Animation._rootFramesTimeline, includeTimelines) );
			};
		
		TweenMax.killAll = function(complete, tweens, delayedCalls, timelines) {
			if (tweens == null) {
				tweens = true;
			}
			if (delayedCalls == null) {
				delayedCalls = true;
			}
			var a = getAllTweens((timelines != false)),
				l = a.length,
				allTrue = (tweens && delayedCalls && timelines),
				isDC, tween, i;
			for (i = 0; i < l; i++) {
				tween = a[i];
				if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
					if (complete) {
						tween.totalTime(tween._reversed ? 0 : tween.totalDuration());
					} else {
						tween._enabled(false, false);
					}
				}
			}
		};
		
		TweenMax.killChildTweensOf = function(parent, complete) {
			if (parent == null) {
				return;
			}
			var tl = TweenLiteInternals.tweenLookup,
				a, curParent, p, i, l;
			if (typeof(parent) === "string") {
				parent = TweenLite.selector(parent) || parent;
			}
			if (_isSelector(parent)) {
				parent = _slice(parent);
			}
			if (_isArray(parent)) {
				i = parent.length;
				while (--i > -1) {
					TweenMax.killChildTweensOf(parent[i], complete);
				}
				return;
			}
			a = [];
			for (p in tl) {
				curParent = tl[p].target.parentNode;
				while (curParent) {
					if (curParent === parent) {
						a = a.concat(tl[p].tweens);
					}
					curParent = curParent.parentNode;
				}
			}
			l = a.length;
			for (i = 0; i < l; i++) {
				if (complete) {
					a[i].totalTime(a[i].totalDuration());
				}
				a[i]._enabled(false, false);
			}
		};

		var _changePause = function(pause, tweens, delayedCalls, timelines) {
			tweens = (tweens !== false);
			delayedCalls = (delayedCalls !== false);
			timelines = (timelines !== false);
			var a = getAllTweens(timelines),
				allTrue = (tweens && delayedCalls && timelines),
				i = a.length,
				isDC, tween;
			while (--i > -1) {
				tween = a[i];
				if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
					tween.paused(pause);
				}
			}
		};
		
		TweenMax.pauseAll = function(tweens, delayedCalls, timelines) {
			_changePause(true, tweens, delayedCalls, timelines);
		};
		
		TweenMax.resumeAll = function(tweens, delayedCalls, timelines) {
			_changePause(false, tweens, delayedCalls, timelines);
		};

		TweenMax.globalTimeScale = function(value) {
			var tl = Animation._rootTimeline,
				t = TweenLite.ticker.time;
			if (!arguments.length) {
				return tl._timeScale;
			}
			value = value || _tinyNum; //can't allow zero because it'll throw the math off
			tl._startTime = t - ((t - tl._startTime) * tl._timeScale / value);
			tl = Animation._rootFramesTimeline;
			t = TweenLite.ticker.frame;
			tl._startTime = t - ((t - tl._startTime) * tl._timeScale / value);
			tl._timeScale = Animation._rootTimeline._timeScale = value;
			return value;
		};
		
	
//---- GETTERS / SETTERS ----------------------------------------------------------------------------------------------------------
		
		p.progress = function(value, suppressEvents) {
			return (!arguments.length) ? this._time / this.duration() : this.totalTime( this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), suppressEvents);
		};
		
		p.totalProgress = function(value, suppressEvents) {
			return (!arguments.length) ? this._totalTime / this.totalDuration() : this.totalTime( this.totalDuration() * value, suppressEvents);
		};
		
		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			if (value > this._duration) {
				value = this._duration;
			}
			if (this._yoyo && (this._cycle & 1) !== 0) {
				value = (this._duration - value) + (this._cycle * (this._duration + this._repeatDelay));
			} else if (this._repeat !== 0) {
				value += this._cycle * (this._duration + this._repeatDelay);
			}
			return this.totalTime(value, suppressEvents);
		};

		p.duration = function(value) {
			if (!arguments.length) {
				return this._duration; //don't set _dirty = false because there could be repeats that haven't been factored into the _totalDuration yet. Otherwise, if you create a repeated TweenMax and then immediately check its duration(), it would cache the value and the totalDuration would not be correct, thus repeats wouldn't take effect.
			}
			return Animation.prototype.duration.call(this, value);
		};

		p.totalDuration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					//instead of Infinity, we use 999999999999 so that we can accommodate reverses
					this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
					this._dirty = false;
				}
				return this._totalDuration;
			}
			return (this._repeat === -1) ? this : this.duration( (value - (this._repeat * this._repeatDelay)) / (this._repeat + 1) );
		};
		
		p.repeat = function(value) {
			if (!arguments.length) {
				return this._repeat;
			}
			this._repeat = value;
			return this._uncache(true);
		};
		
		p.repeatDelay = function(value) {
			if (!arguments.length) {
				return this._repeatDelay;
			}
			this._repeatDelay = value;
			return this._uncache(true);
		};
		
		p.yoyo = function(value) {
			if (!arguments.length) {
				return this._yoyo;
			}
			this._yoyo = value;
			return this;
		};
		
		
		return TweenMax;
		
	}, true);








/*
 * ----------------------------------------------------------------
 * TimelineLite
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine("TimelineLite", ["core.Animation","core.SimpleTimeline","TweenLite"], function(Animation, SimpleTimeline, TweenLite) {

		var TimelineLite = function(vars) {
				SimpleTimeline.call(this, vars);
				this._labels = {};
				this.autoRemoveChildren = (this.vars.autoRemoveChildren === true);
				this.smoothChildTiming = (this.vars.smoothChildTiming === true);
				this._sortChildren = true;
				this._onUpdate = this.vars.onUpdate;
				var v = this.vars,
					val, p;
				for (p in v) {
					val = v[p];
					if (_isArray(val)) if (val.join("").indexOf("{self}") !== -1) {
						v[p] = this._swapSelfInParams(val);
					}
				}
				if (_isArray(v.tweens)) {
					this.add(v.tweens, 0, v.align, v.stagger);
				}
			},
			_tinyNum = 0.0000000001,
			TweenLiteInternals = TweenLite._internals,
			_internals = TimelineLite._internals = {},
			_isSelector = TweenLiteInternals.isSelector,
			_isArray = TweenLiteInternals.isArray,
			_lazyTweens = TweenLiteInternals.lazyTweens,
			_lazyRender = TweenLiteInternals.lazyRender,
			_globals = _gsScope._gsDefine.globals,
			_copy = function(vars) {
				var copy = {}, p;
				for (p in vars) {
					copy[p] = vars[p];
				}
				return copy;
			},
			_applyCycle = function(vars, targets, i) {
				var alt = vars.cycle,
					p, val;
				for (p in alt) {
					val = alt[p];
					vars[p] = (typeof(val) === "function") ? val.call(targets[i], i) : val[i % val.length];
				}
				delete vars.cycle;
			},
			_pauseCallback = _internals.pauseCallback = function() {},
			_slice = function(a) { //don't use [].slice because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
				var b = [],
					l = a.length,
					i;
				for (i = 0; i !== l; b.push(a[i++]));
				return b;
			},
			p = TimelineLite.prototype = new SimpleTimeline();

		TimelineLite.version = "1.19.0";
		p.constructor = TimelineLite;
		p.kill()._gc = p._forcingPlayhead = p._hasPause = false;

		/* might use later...
		//translates a local time inside an animation to the corresponding time on the root/global timeline, factoring in all nesting and timeScales.
		function localToGlobal(time, animation) {
			while (animation) {
				time = (time / animation._timeScale) + animation._startTime;
				animation = animation.timeline;
			}
			return time;
		}

		//translates the supplied time on the root/global timeline into the corresponding local time inside a particular animation, factoring in all nesting and timeScales
		function globalToLocal(time, animation) {
			var scale = 1;
			time -= localToGlobal(0, animation);
			while (animation) {
				scale *= animation._timeScale;
				animation = animation.timeline;
			}
			return time * scale;
		}
		*/

		p.to = function(target, duration, vars, position) {
			var Engine = (vars.repeat && _globals.TweenMax) || TweenLite;
			return duration ? this.add( new Engine(target, duration, vars), position) : this.set(target, vars, position);
		};

		p.from = function(target, duration, vars, position) {
			return this.add( ((vars.repeat && _globals.TweenMax) || TweenLite).from(target, duration, vars), position);
		};

		p.fromTo = function(target, duration, fromVars, toVars, position) {
			var Engine = (toVars.repeat && _globals.TweenMax) || TweenLite;
			return duration ? this.add( Engine.fromTo(target, duration, fromVars, toVars), position) : this.set(target, toVars, position);
		};

		p.staggerTo = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			var tl = new TimelineLite({onComplete:onCompleteAll, onCompleteParams:onCompleteAllParams, callbackScope:onCompleteAllScope, smoothChildTiming:this.smoothChildTiming}),
				cycle = vars.cycle,
				copy, i;
			if (typeof(targets) === "string") {
				targets = TweenLite.selector(targets) || targets;
			}
			targets = targets || [];
			if (_isSelector(targets)) { //senses if the targets object is a selector. If it is, we should translate it into an array.
				targets = _slice(targets);
			}
			stagger = stagger || 0;
			if (stagger < 0) {
				targets = _slice(targets);
				targets.reverse();
				stagger *= -1;
			}
			for (i = 0; i < targets.length; i++) {
				copy = _copy(vars);
				if (copy.startAt) {
					copy.startAt = _copy(copy.startAt);
					if (copy.startAt.cycle) {
						_applyCycle(copy.startAt, targets, i);
					}
				}
				if (cycle) {
					_applyCycle(copy, targets, i);
					if (copy.duration != null) {
						duration = copy.duration;
						delete copy.duration;
					}
				}
				tl.to(targets[i], duration, copy, i * stagger);
			}
			return this.add(tl, position);
		};

		p.staggerFrom = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			vars.immediateRender = (vars.immediateRender != false);
			vars.runBackwards = true;
			return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};

		p.staggerFromTo = function(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};

		p.call = function(callback, params, scope, position) {
			return this.add( TweenLite.delayedCall(0, callback, params, scope), position);
		};

		p.set = function(target, vars, position) {
			position = this._parseTimeOrLabel(position, 0, true);
			if (vars.immediateRender == null) {
				vars.immediateRender = (position === this._time && !this._paused);
			}
			return this.add( new TweenLite(target, 0, vars), position);
		};

		TimelineLite.exportRoot = function(vars, ignoreDelayedCalls) {
			vars = vars || {};
			if (vars.smoothChildTiming == null) {
				vars.smoothChildTiming = true;
			}
			var tl = new TimelineLite(vars),
				root = tl._timeline,
				tween, next;
			if (ignoreDelayedCalls == null) {
				ignoreDelayedCalls = true;
			}
			root._remove(tl, true);
			tl._startTime = 0;
			tl._rawPrevTime = tl._time = tl._totalTime = root._time;
			tween = root._first;
			while (tween) {
				next = tween._next;
				if (!ignoreDelayedCalls || !(tween instanceof TweenLite && tween.target === tween.vars.onComplete)) {
					tl.add(tween, tween._startTime - tween._delay);
				}
				tween = next;
			}
			root.add(tl, 0);
			return tl;
		};

		p.add = function(value, position, align, stagger) {
			var curTime, l, i, child, tl, beforeRawTime;
			if (typeof(position) !== "number") {
				position = this._parseTimeOrLabel(position, 0, true, value);
			}
			if (!(value instanceof Animation)) {
				if ((value instanceof Array) || (value && value.push && _isArray(value))) {
					align = align || "normal";
					stagger = stagger || 0;
					curTime = position;
					l = value.length;
					for (i = 0; i < l; i++) {
						if (_isArray(child = value[i])) {
							child = new TimelineLite({tweens:child});
						}
						this.add(child, curTime);
						if (typeof(child) !== "string" && typeof(child) !== "function") {
							if (align === "sequence") {
								curTime = child._startTime + (child.totalDuration() / child._timeScale);
							} else if (align === "start") {
								child._startTime -= child.delay();
							}
						}
						curTime += stagger;
					}
					return this._uncache(true);
				} else if (typeof(value) === "string") {
					return this.addLabel(value, position);
				} else if (typeof(value) === "function") {
					value = TweenLite.delayedCall(0, value);
				} else {
					throw("Cannot add " + value + " into the timeline; it is not a tween, timeline, function, or string.");
				}
			}

			SimpleTimeline.prototype.add.call(this, value, position);

			//if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.
			if (this._gc || this._time === this._duration) if (!this._paused) if (this._duration < this.duration()) {
				//in case any of the ancestors had completed but should now be enabled...
				tl = this;
				beforeRawTime = (tl.rawTime() > value._startTime); //if the tween is placed on the timeline so that it starts BEFORE the current rawTime, we should align the playhead (move the timeline). This is because sometimes users will create a timeline, let it finish, and much later append a tween and expect it to run instead of jumping to its end state. While technically one could argue that it should jump to its end state, that's not what users intuitively expect.
				while (tl._timeline) {
					if (beforeRawTime && tl._timeline.smoothChildTiming) {
						tl.totalTime(tl._totalTime, true); //moves the timeline (shifts its startTime) if necessary, and also enables it.
					} else if (tl._gc) {
						tl._enabled(true, false);
					}
					tl = tl._timeline;
				}
			}

			return this;
		};

		p.remove = function(value) {
			if (value instanceof Animation) {
				this._remove(value, false);
				var tl = value._timeline = value.vars.useFrames ? Animation._rootFramesTimeline : Animation._rootTimeline; //now that it's removed, default it to the root timeline so that if it gets played again, it doesn't jump back into this timeline.
				value._startTime = (value._paused ? value._pauseTime : tl._time) - ((!value._reversed ? value._totalTime : value.totalDuration() - value._totalTime) / value._timeScale); //ensure that if it gets played again, the timing is correct.
				return this;
			} else if (value instanceof Array || (value && value.push && _isArray(value))) {
				var i = value.length;
				while (--i > -1) {
					this.remove(value[i]);
				}
				return this;
			} else if (typeof(value) === "string") {
				return this.removeLabel(value);
			}
			return this.kill(null, value);
		};

		p._remove = function(tween, skipDisable) {
			SimpleTimeline.prototype._remove.call(this, tween, skipDisable);
			var last = this._last;
			if (!last) {
				this._time = this._totalTime = this._duration = this._totalDuration = 0;
			} else if (this._time > last._startTime + last._totalDuration / last._timeScale) {
				this._time = this.duration();
				this._totalTime = this._totalDuration;
			}
			return this;
		};

		p.append = function(value, offsetOrLabel) {
			return this.add(value, this._parseTimeOrLabel(null, offsetOrLabel, true, value));
		};

		p.insert = p.insertMultiple = function(value, position, align, stagger) {
			return this.add(value, position || 0, align, stagger);
		};

		p.appendMultiple = function(tweens, offsetOrLabel, align, stagger) {
			return this.add(tweens, this._parseTimeOrLabel(null, offsetOrLabel, true, tweens), align, stagger);
		};

		p.addLabel = function(label, position) {
			this._labels[label] = this._parseTimeOrLabel(position);
			return this;
		};

		p.addPause = function(position, callback, params, scope) {
			var t = TweenLite.delayedCall(0, _pauseCallback, params, scope || this);
			t.vars.onComplete = t.vars.onReverseComplete = callback;
			t.data = "isPause";
			this._hasPause = true;
			return this.add(t, position);
		};

		p.removeLabel = function(label) {
			delete this._labels[label];
			return this;
		};

		p.getLabelTime = function(label) {
			return (this._labels[label] != null) ? this._labels[label] : -1;
		};

		p._parseTimeOrLabel = function(timeOrLabel, offsetOrLabel, appendIfAbsent, ignore) {
			var i;
			//if we're about to add a tween/timeline (or an array of them) that's already a child of this timeline, we should remove it first so that it doesn't contaminate the duration().
			if (ignore instanceof Animation && ignore.timeline === this) {
				this.remove(ignore);
			} else if (ignore && ((ignore instanceof Array) || (ignore.push && _isArray(ignore)))) {
				i = ignore.length;
				while (--i > -1) {
					if (ignore[i] instanceof Animation && ignore[i].timeline === this) {
						this.remove(ignore[i]);
					}
				}
			}
			if (typeof(offsetOrLabel) === "string") {
				return this._parseTimeOrLabel(offsetOrLabel, (appendIfAbsent && typeof(timeOrLabel) === "number" && this._labels[offsetOrLabel] == null) ? timeOrLabel - this.duration() : 0, appendIfAbsent);
			}
			offsetOrLabel = offsetOrLabel || 0;
			if (typeof(timeOrLabel) === "string" && (isNaN(timeOrLabel) || this._labels[timeOrLabel] != null)) { //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
				i = timeOrLabel.indexOf("=");
				if (i === -1) {
					if (this._labels[timeOrLabel] == null) {
						return appendIfAbsent ? (this._labels[timeOrLabel] = this.duration() + offsetOrLabel) : offsetOrLabel;
					}
					return this._labels[timeOrLabel] + offsetOrLabel;
				}
				offsetOrLabel = parseInt(timeOrLabel.charAt(i-1) + "1", 10) * Number(timeOrLabel.substr(i+1));
				timeOrLabel = (i > 1) ? this._parseTimeOrLabel(timeOrLabel.substr(0, i-1), 0, appendIfAbsent) : this.duration();
			} else if (timeOrLabel == null) {
				timeOrLabel = this.duration();
			}
			return Number(timeOrLabel) + offsetOrLabel;
		};

		p.seek = function(position, suppressEvents) {
			return this.totalTime((typeof(position) === "number") ? position : this._parseTimeOrLabel(position), (suppressEvents !== false));
		};

		p.stop = function() {
			return this.paused(true);
		};

		p.gotoAndPlay = function(position, suppressEvents) {
			return this.play(position, suppressEvents);
		};

		p.gotoAndStop = function(position, suppressEvents) {
			return this.pause(position, suppressEvents);
		};

		p.render = function(time, suppressEvents, force) {
			if (this._gc) {
				this._enabled(true, false);
			}
			var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
				prevTime = this._time,
				prevStart = this._startTime,
				prevTimeScale = this._timeScale,
				prevPaused = this._paused,
				tween, isComplete, next, callback, internalForce, pauseTween, curTime;
			if (time >= totalDur - 0.0000001) { //to work around occasional floating point math artifacts.
				this._totalTime = this._time = totalDur;
				if (!this._reversed) if (!this._hasPausedChild()) {
					isComplete = true;
					callback = "onComplete";
					internalForce = !!this._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
					if (this._duration === 0) if ((time <= 0 && time >= -0.0000001) || this._rawPrevTime < 0 || this._rawPrevTime === _tinyNum) if (this._rawPrevTime !== time && this._first) {
						internalForce = true;
						if (this._rawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
				}
				this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				time = totalDur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7.

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = 0;
				if (prevTime !== 0 || (this._duration === 0 && this._rawPrevTime !== _tinyNum && (this._rawPrevTime > 0 || (time < 0 && this._rawPrevTime >= 0)))) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (this._timeline.autoRemoveChildren && this._reversed) { //ensures proper GC if a timeline is resumed after it's finished reversing.
						internalForce = isComplete = true;
						callback = "onReverseComplete";
					} else if (this._rawPrevTime >= 0 && this._first) { //when going back beyond the start, force a render so that zero-duration tweens that sit at the very beginning render their start values properly. Otherwise, if the parent timeline's playhead lands exactly at this timeline's startTime, and then moves backwards, the zero-duration tweens at the beginning would still be at their end state.
						internalForce = true;
					}
					this._rawPrevTime = time;
				} else {
					this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					if (time === 0 && isComplete) { //if there's a zero-duration tween at the very beginning of a timeline and the playhead lands EXACTLY at time 0, that tween will correctly render its end values, but we need to keep the timeline alive for one more render so that the beginning values render properly as the parent's playhead keeps moving beyond the begining. Imagine obj.x starts at 0 and then we do tl.set(obj, {x:100}).to(obj, 1, {x:200}) and then later we tl.reverse()...the goal is to have obj.x revert to 0. If the playhead happens to land on exactly 0, without this chunk of code, it'd complete the timeline and remove it from the rendering queue (not good).
						tween = this._first;
						while (tween && tween._startTime === 0) {
							if (!tween._duration) {
								isComplete = false;
							}
							tween = tween._next;
						}
					}
					time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
					if (!this._initted) {
						internalForce = true;
					}
				}

			} else {

				if (this._hasPause && !this._forcingPlayhead && !suppressEvents) {
					if (time >= prevTime) {
						tween = this._first;
						while (tween && tween._startTime <= time && !pauseTween) {
							if (!tween._duration) if (tween.data === "isPause" && !tween.ratio && !(tween._startTime === 0 && this._rawPrevTime === 0)) {
								pauseTween = tween;
							}
							tween = tween._next;
						}
					} else {
						tween = this._last;
						while (tween && tween._startTime >= time && !pauseTween) {
							if (!tween._duration) if (tween.data === "isPause" && tween._rawPrevTime > 0) {
								pauseTween = tween;
							}
							tween = tween._prev;
						}
					}
					if (pauseTween) {
						this._time = time = pauseTween._startTime;
						this._totalTime = time + (this._cycle * (this._totalDuration + this._repeatDelay));
					}
				}

				this._totalTime = this._time = this._rawPrevTime = time;
			}
			if ((this._time === prevTime || !this._first) && !force && !internalForce && !pauseTween) {
				return;
			} else if (!this._initted) {
				this._initted = true;
			}

			if (!this._active) if (!this._paused && this._time !== prevTime && time > 0) {
				this._active = true;  //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
			}

			if (prevTime === 0) if (this.vars.onStart) if (this._time !== 0 || !this._duration) if (!suppressEvents) {
				this._callback("onStart");
			}

			curTime = this._time;
			if (curTime >= prevTime) {
				tween = this._first;
				while (tween) {
					next = tween._next; //record it here because the value could change after rendering...
					if (curTime !== this._time || (this._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
						break;
					} else if (tween._active || (tween._startTime <= curTime && !tween._paused && !tween._gc)) {
						if (pauseTween === tween) {
							this.pause();
						}
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}
					}
					tween = next;
				}
			} else {
				tween = this._last;
				while (tween) {
					next = tween._prev; //record it here because the value could change after rendering...
					if (curTime !== this._time || (this._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
						break;
					} else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
						if (pauseTween === tween) {
							pauseTween = tween._prev; //the linked list is organized by _startTime, thus it's possible that a tween could start BEFORE the pause and end after it, in which case it would be positioned before the pause tween in the linked list, but we should render it before we pause() the timeline and cease rendering. This is only a concern when going in reverse.
							while (pauseTween && pauseTween.endTime() > this._time) {
								pauseTween.render( (pauseTween._reversed ? pauseTween.totalDuration() - ((time - pauseTween._startTime) * pauseTween._timeScale) : (time - pauseTween._startTime) * pauseTween._timeScale), suppressEvents, force);
								pauseTween = pauseTween._prev;
							}
							pauseTween = null;
							this.pause();
						}
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}
					}
					tween = next;
				}
			}

			if (this._onUpdate) if (!suppressEvents) {
				if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
					_lazyRender();
				}
				this._callback("onUpdate");
			}

			if (callback) if (!this._gc) if (prevStart === this._startTime || prevTimeScale !== this._timeScale) if (this._time === 0 || totalDur >= this.totalDuration()) { //if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
				if (isComplete) {
					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onComplete on a timeline that reports/checks tweened values.
						_lazyRender();
					}
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this._callback(callback);
				}
			}
		};

		p._hasPausedChild = function() {
			var tween = this._first;
			while (tween) {
				if (tween._paused || ((tween instanceof TimelineLite) && tween._hasPausedChild())) {
					return true;
				}
				tween = tween._next;
			}
			return false;
		};

		p.getChildren = function(nested, tweens, timelines, ignoreBeforeTime) {
			ignoreBeforeTime = ignoreBeforeTime || -9999999999;
			var a = [],
				tween = this._first,
				cnt = 0;
			while (tween) {
				if (tween._startTime < ignoreBeforeTime) {
					//do nothing
				} else if (tween instanceof TweenLite) {
					if (tweens !== false) {
						a[cnt++] = tween;
					}
				} else {
					if (timelines !== false) {
						a[cnt++] = tween;
					}
					if (nested !== false) {
						a = a.concat(tween.getChildren(true, tweens, timelines));
						cnt = a.length;
					}
				}
				tween = tween._next;
			}
			return a;
		};

		p.getTweensOf = function(target, nested) {
			var disabled = this._gc,
				a = [],
				cnt = 0,
				tweens, i;
			if (disabled) {
				this._enabled(true, true); //getTweensOf() filters out disabled tweens, and we have to mark them as _gc = true when the timeline completes in order to allow clean garbage collection, so temporarily re-enable the timeline here.
			}
			tweens = TweenLite.getTweensOf(target);
			i = tweens.length;
			while (--i > -1) {
				if (tweens[i].timeline === this || (nested && this._contains(tweens[i]))) {
					a[cnt++] = tweens[i];
				}
			}
			if (disabled) {
				this._enabled(false, true);
			}
			return a;
		};

		p.recent = function() {
			return this._recent;
		};

		p._contains = function(tween) {
			var tl = tween.timeline;
			while (tl) {
				if (tl === this) {
					return true;
				}
				tl = tl.timeline;
			}
			return false;
		};

		p.shiftChildren = function(amount, adjustLabels, ignoreBeforeTime) {
			ignoreBeforeTime = ignoreBeforeTime || 0;
			var tween = this._first,
				labels = this._labels,
				p;
			while (tween) {
				if (tween._startTime >= ignoreBeforeTime) {
					tween._startTime += amount;
				}
				tween = tween._next;
			}
			if (adjustLabels) {
				for (p in labels) {
					if (labels[p] >= ignoreBeforeTime) {
						labels[p] += amount;
					}
				}
			}
			return this._uncache(true);
		};

		p._kill = function(vars, target) {
			if (!vars && !target) {
				return this._enabled(false, false);
			}
			var tweens = (!target) ? this.getChildren(true, true, false) : this.getTweensOf(target),
				i = tweens.length,
				changed = false;
			while (--i > -1) {
				if (tweens[i]._kill(vars, target)) {
					changed = true;
				}
			}
			return changed;
		};

		p.clear = function(labels) {
			var tweens = this.getChildren(false, true, true),
				i = tweens.length;
			this._time = this._totalTime = 0;
			while (--i > -1) {
				tweens[i]._enabled(false, false);
			}
			if (labels !== false) {
				this._labels = {};
			}
			return this._uncache(true);
		};

		p.invalidate = function() {
			var tween = this._first;
			while (tween) {
				tween.invalidate();
				tween = tween._next;
			}
			return Animation.prototype.invalidate.call(this);;
		};

		p._enabled = function(enabled, ignoreTimeline) {
			if (enabled === this._gc) {
				var tween = this._first;
				while (tween) {
					tween._enabled(enabled, true);
					tween = tween._next;
				}
			}
			return SimpleTimeline.prototype._enabled.call(this, enabled, ignoreTimeline);
		};

		p.totalTime = function(time, suppressEvents, uncapped) {
			this._forcingPlayhead = true;
			var val = Animation.prototype.totalTime.apply(this, arguments);
			this._forcingPlayhead = false;
			return val;
		};

		p.duration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					this.totalDuration(); //just triggers recalculation
				}
				return this._duration;
			}
			if (this.duration() !== 0 && value !== 0) {
				this.timeScale(this._duration / value);
			}
			return this;
		};

		p.totalDuration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					var max = 0,
						tween = this._last,
						prevStart = 999999999999,
						prev, end;
					while (tween) {
						prev = tween._prev; //record it here in case the tween changes position in the sequence...
						if (tween._dirty) {
							tween.totalDuration(); //could change the tween._startTime, so make sure the tween's cache is clean before analyzing it.
						}
						if (tween._startTime > prevStart && this._sortChildren && !tween._paused) { //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
							this.add(tween, tween._startTime - tween._delay);
						} else {
							prevStart = tween._startTime;
						}
						if (tween._startTime < 0 && !tween._paused) { //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
							max -= tween._startTime;
							if (this._timeline.smoothChildTiming) {
								this._startTime += tween._startTime / this._timeScale;
							}
							this.shiftChildren(-tween._startTime, false, -9999999999);
							prevStart = 0;
						}
						end = tween._startTime + (tween._totalDuration / tween._timeScale);
						if (end > max) {
							max = end;
						}
						tween = prev;
					}
					this._duration = this._totalDuration = max;
					this._dirty = false;
				}
				return this._totalDuration;
			}
			return (value && this.totalDuration()) ? this.timeScale(this._totalDuration / value) : this;
		};

		p.paused = function(value) {
			if (!value) { //if there's a pause directly at the spot from where we're unpausing, skip it.
				var tween = this._first,
					time = this._time;
				while (tween) {
					if (tween._startTime === time && tween.data === "isPause") {
						tween._rawPrevTime = 0; //remember, _rawPrevTime is how zero-duration tweens/callbacks sense directionality and determine whether or not to fire. If _rawPrevTime is the same as _startTime on the next render, it won't fire.
					}
					tween = tween._next;
				}
			}
			return Animation.prototype.paused.apply(this, arguments);
		};

		p.usesFrames = function() {
			var tl = this._timeline;
			while (tl._timeline) {
				tl = tl._timeline;
			}
			return (tl === Animation._rootFramesTimeline);
		};

		p.rawTime = function() {
			return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale;
		};

		return TimelineLite;

	}, true);








	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * TimelineMax
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine("TimelineMax", ["TimelineLite","TweenLite","easing.Ease"], function(TimelineLite, TweenLite, Ease) {

		var TimelineMax = function(vars) {
				TimelineLite.call(this, vars);
				this._repeat = this.vars.repeat || 0;
				this._repeatDelay = this.vars.repeatDelay || 0;
				this._cycle = 0;
				this._yoyo = (this.vars.yoyo === true);
				this._dirty = true;
			},
			_tinyNum = 0.0000000001,
			TweenLiteInternals = TweenLite._internals,
			_lazyTweens = TweenLiteInternals.lazyTweens,
			_lazyRender = TweenLiteInternals.lazyRender,
			_globals = _gsScope._gsDefine.globals,
			_easeNone = new Ease(null, null, 1, 0),
			p = TimelineMax.prototype = new TimelineLite();

		p.constructor = TimelineMax;
		p.kill()._gc = false;
		TimelineMax.version = "1.19.0";

		p.invalidate = function() {
			this._yoyo = (this.vars.yoyo === true);
			this._repeat = this.vars.repeat || 0;
			this._repeatDelay = this.vars.repeatDelay || 0;
			this._uncache(true);
			return TimelineLite.prototype.invalidate.call(this);
		};

		p.addCallback = function(callback, position, params, scope) {
			return this.add( TweenLite.delayedCall(0, callback, params, scope), position);
		};

		p.removeCallback = function(callback, position) {
			if (callback) {
				if (position == null) {
					this._kill(null, callback);
				} else {
					var a = this.getTweensOf(callback, false),
						i = a.length,
						time = this._parseTimeOrLabel(position);
					while (--i > -1) {
						if (a[i]._startTime === time) {
							a[i]._enabled(false, false);
						}
					}
				}
			}
			return this;
		};

		p.removePause = function(position) {
			return this.removeCallback(TimelineLite._internals.pauseCallback, position);
		};

		p.tweenTo = function(position, vars) {
			vars = vars || {};
			var copy = {ease:_easeNone, useFrames:this.usesFrames(), immediateRender:false},
				Engine = (vars.repeat && _globals.TweenMax) || TweenLite,
				duration, p, t;
			for (p in vars) {
				copy[p] = vars[p];
			}
			copy.time = this._parseTimeOrLabel(position);
			duration = (Math.abs(Number(copy.time) - this._time) / this._timeScale) || 0.001;
			t = new Engine(this, duration, copy);
			copy.onStart = function() {
				t.target.paused(true);
				if (t.vars.time !== t.target.time() && duration === t.duration()) { //don't make the duration zero - if it's supposed to be zero, don't worry because it's already initting the tween and will complete immediately, effectively making the duration zero anyway. If we make duration zero, the tween won't run at all.
					t.duration( Math.abs( t.vars.time - t.target.time()) / t.target._timeScale );
				}
				if (vars.onStart) { //in case the user had an onStart in the vars - we don't want to overwrite it.
					t._callback("onStart");
				}
			};
			return t;
		};

		p.tweenFromTo = function(fromPosition, toPosition, vars) {
			vars = vars || {};
			fromPosition = this._parseTimeOrLabel(fromPosition);
			vars.startAt = {onComplete:this.seek, onCompleteParams:[fromPosition], callbackScope:this};
			vars.immediateRender = (vars.immediateRender !== false);
			var t = this.tweenTo(toPosition, vars);
			return t.duration((Math.abs( t.vars.time - fromPosition) / this._timeScale) || 0.001);
		};

		p.render = function(time, suppressEvents, force) {
			if (this._gc) {
				this._enabled(true, false);
			}
			var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
				dur = this._duration,
				prevTime = this._time,
				prevTotalTime = this._totalTime,
				prevStart = this._startTime,
				prevTimeScale = this._timeScale,
				prevRawPrevTime = this._rawPrevTime,
				prevPaused = this._paused,
				prevCycle = this._cycle,
				tween, isComplete, next, callback, internalForce, cycleDuration, pauseTween, curTime;
			if (time >= totalDur - 0.0000001) { //to work around occasional floating point math artifacts.
				if (!this._locked) {
					this._totalTime = totalDur;
					this._cycle = this._repeat;
				}
				if (!this._reversed) if (!this._hasPausedChild()) {
					isComplete = true;
					callback = "onComplete";
					internalForce = !!this._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
					if (this._duration === 0) if ((time <= 0 && time >= -0.0000001) || prevRawPrevTime < 0 || prevRawPrevTime === _tinyNum) if (prevRawPrevTime !== time && this._first) {
						internalForce = true;
						if (prevRawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
				}
				this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				if (this._yoyo && (this._cycle & 1) !== 0) {
					this._time = time = 0;
				} else {
					this._time = dur;
					time = dur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7. We cannot do less then 0.0001 because the same issue can occur when the duration is extremely large like 999999999999 in which case adding 0.00000001, for example, causes it to act like nothing was added.
				}

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				if (!this._locked) {
					this._totalTime = this._cycle = 0;
				}
				this._time = 0;
				if (prevTime !== 0 || (dur === 0 && prevRawPrevTime !== _tinyNum && (prevRawPrevTime > 0 || (time < 0 && prevRawPrevTime >= 0)) && !this._locked)) { //edge case for checking time < 0 && prevRawPrevTime >= 0: a zero-duration fromTo() tween inside a zero-duration timeline (yeah, very rare)
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (this._timeline.autoRemoveChildren && this._reversed) {
						internalForce = isComplete = true;
						callback = "onReverseComplete";
					} else if (prevRawPrevTime >= 0 && this._first) { //when going back beyond the start, force a render so that zero-duration tweens that sit at the very beginning render their start values properly. Otherwise, if the parent timeline's playhead lands exactly at this timeline's startTime, and then moves backwards, the zero-duration tweens at the beginning would still be at their end state.
						internalForce = true;
					}
					this._rawPrevTime = time;
				} else {
					this._rawPrevTime = (dur || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					if (time === 0 && isComplete) { //if there's a zero-duration tween at the very beginning of a timeline and the playhead lands EXACTLY at time 0, that tween will correctly render its end values, but we need to keep the timeline alive for one more render so that the beginning values render properly as the parent's playhead keeps moving beyond the begining. Imagine obj.x starts at 0 and then we do tl.set(obj, {x:100}).to(obj, 1, {x:200}) and then later we tl.reverse()...the goal is to have obj.x revert to 0. If the playhead happens to land on exactly 0, without this chunk of code, it'd complete the timeline and remove it from the rendering queue (not good).
						tween = this._first;
						while (tween && tween._startTime === 0) {
							if (!tween._duration) {
								isComplete = false;
							}
							tween = tween._next;
						}
					}
					time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
					if (!this._initted) {
						internalForce = true;
					}
				}

			} else {
				if (dur === 0 && prevRawPrevTime < 0) { //without this, zero-duration repeating timelines (like with a simple callback nested at the very beginning and a repeatDelay) wouldn't render the first time through.
					internalForce = true;
				}
				this._time = this._rawPrevTime = time;
				if (!this._locked) {
					this._totalTime = time;
					if (this._repeat !== 0) {
						cycleDuration = dur + this._repeatDelay;
						this._cycle = (this._totalTime / cycleDuration) >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but it gets reported as 0.79999999!)
						if (this._cycle !== 0) if (this._cycle === this._totalTime / cycleDuration && prevTotalTime <= time) {
							this._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
						}
						this._time = this._totalTime - (this._cycle * cycleDuration);
						if (this._yoyo) if ((this._cycle & 1) !== 0) {
							this._time = dur - this._time;
						}
						if (this._time > dur) {
							this._time = dur;
							time = dur + 0.0001; //to avoid occasional floating point rounding error
						} else if (this._time < 0) {
							this._time = time = 0;
						} else {
							time = this._time;
						}
					}
				}

				if (this._hasPause && !this._forcingPlayhead && !suppressEvents) {
					time = this._time;
					if (time >= prevTime) {
						tween = this._first;
						while (tween && tween._startTime <= time && !pauseTween) {
							if (!tween._duration) if (tween.data === "isPause" && !tween.ratio && !(tween._startTime === 0 && this._rawPrevTime === 0)) {
								pauseTween = tween;
							}
							tween = tween._next;
						}
					} else {
						tween = this._last;
						while (tween && tween._startTime >= time && !pauseTween) {
							if (!tween._duration) if (tween.data === "isPause" && tween._rawPrevTime > 0) {
								pauseTween = tween;
							}
							tween = tween._prev;
						}
					}
					if (pauseTween) {
						this._time = time = pauseTween._startTime;
						this._totalTime = time + (this._cycle * (this._totalDuration + this._repeatDelay));
					}
				}

			}

			if (this._cycle !== prevCycle) if (!this._locked) {
				/*
				make sure children at the end/beginning of the timeline are rendered properly. If, for example,
				a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
				would get transated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
				could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
				we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
				ensure that zero-duration tweens at the very beginning or end of the TimelineMax work.
				*/
				var backwards = (this._yoyo && (prevCycle & 1) !== 0),
					wrap = (backwards === (this._yoyo && (this._cycle & 1) !== 0)),
					recTotalTime = this._totalTime,
					recCycle = this._cycle,
					recRawPrevTime = this._rawPrevTime,
					recTime = this._time;

				this._totalTime = prevCycle * dur;
				if (this._cycle < prevCycle) {
					backwards = !backwards;
				} else {
					this._totalTime += dur;
				}
				this._time = prevTime; //temporarily revert _time so that render() renders the children in the correct order. Without this, tweens won't rewind correctly. We could arhictect things in a "cleaner" way by splitting out the rendering queue into a separate method but for performance reasons, we kept it all inside this method.

				this._rawPrevTime = (dur === 0) ? prevRawPrevTime - 0.0001 : prevRawPrevTime;
				this._cycle = prevCycle;
				this._locked = true; //prevents changes to totalTime and skips repeat/yoyo behavior when we recursively call render()
				prevTime = (backwards) ? 0 : dur;
				this.render(prevTime, suppressEvents, (dur === 0));
				if (!suppressEvents) if (!this._gc) {
					if (this.vars.onRepeat) {
						this._callback("onRepeat");
					}
				}
				if (prevTime !== this._time) { //in case there's a callback like onComplete in a nested tween/timeline that changes the playhead position, like via seek(), we should just abort.
					return;
				}
				if (wrap) {
					prevTime = (backwards) ? dur + 0.0001 : -0.0001;
					this.render(prevTime, true, false);
				}
				this._locked = false;
				if (this._paused && !prevPaused) { //if the render() triggered callback that paused this timeline, we should abort (very rare, but possible)
					return;
				}
				this._time = recTime;
				this._totalTime = recTotalTime;
				this._cycle = recCycle;
				this._rawPrevTime = recRawPrevTime;
			}

			if ((this._time === prevTime || !this._first) && !force && !internalForce && !pauseTween) {
				if (prevTotalTime !== this._totalTime) if (this._onUpdate) if (!suppressEvents) { //so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
					this._callback("onUpdate");
				}
				return;
			} else if (!this._initted) {
				this._initted = true;
			}

			if (!this._active) if (!this._paused && this._totalTime !== prevTotalTime && time > 0) {
				this._active = true;  //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
			}

			if (prevTotalTime === 0) if (this.vars.onStart) if (this._totalTime !== 0 || !this._totalDuration) if (!suppressEvents) {
				this._callback("onStart");
			}

			curTime = this._time;
			if (curTime >= prevTime) {
				tween = this._first;
				while (tween) {
					next = tween._next; //record it here because the value could change after rendering...
					if (curTime !== this._time || (this._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
						break;
					} else if (tween._active || (tween._startTime <= this._time && !tween._paused && !tween._gc)) {
						if (pauseTween === tween) {
							this.pause();
						}
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}
					}
					tween = next;
				}
			} else {
				tween = this._last;
				while (tween) {
					next = tween._prev; //record it here because the value could change after rendering...
					if (curTime !== this._time || (this._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
						break;
					} else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
						if (pauseTween === tween) {
							pauseTween = tween._prev; //the linked list is organized by _startTime, thus it's possible that a tween could start BEFORE the pause and end after it, in which case it would be positioned before the pause tween in the linked list, but we should render it before we pause() the timeline and cease rendering. This is only a concern when going in reverse.
							while (pauseTween && pauseTween.endTime() > this._time) {
								pauseTween.render( (pauseTween._reversed ? pauseTween.totalDuration() - ((time - pauseTween._startTime) * pauseTween._timeScale) : (time - pauseTween._startTime) * pauseTween._timeScale), suppressEvents, force);
								pauseTween = pauseTween._prev;
							}
							pauseTween = null;
							this.pause();
						}
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}
					}
					tween = next;
				}
			}

			if (this._onUpdate) if (!suppressEvents) {
				if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
					_lazyRender();
				}
				this._callback("onUpdate");
			}
			if (callback) if (!this._locked) if (!this._gc) if (prevStart === this._startTime || prevTimeScale !== this._timeScale) if (this._time === 0 || totalDur >= this.totalDuration()) { //if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
				if (isComplete) {
					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onComplete on a timeline that reports/checks tweened values.
						_lazyRender();
					}
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this._callback(callback);
				}
			}
		};

		p.getActive = function(nested, tweens, timelines) {
			if (nested == null) {
				nested = true;
			}
			if (tweens == null) {
				tweens = true;
			}
			if (timelines == null) {
				timelines = false;
			}
			var a = [],
				all = this.getChildren(nested, tweens, timelines),
				cnt = 0,
				l = all.length,
				i, tween;
			for (i = 0; i < l; i++) {
				tween = all[i];
				if (tween.isActive()) {
					a[cnt++] = tween;
				}
			}
			return a;
		};


		p.getLabelAfter = function(time) {
			if (!time) if (time !== 0) { //faster than isNan()
				time = this._time;
			}
			var labels = this.getLabelsArray(),
				l = labels.length,
				i;
			for (i = 0; i < l; i++) {
				if (labels[i].time > time) {
					return labels[i].name;
				}
			}
			return null;
		};

		p.getLabelBefore = function(time) {
			if (time == null) {
				time = this._time;
			}
			var labels = this.getLabelsArray(),
				i = labels.length;
			while (--i > -1) {
				if (labels[i].time < time) {
					return labels[i].name;
				}
			}
			return null;
		};

		p.getLabelsArray = function() {
			var a = [],
				cnt = 0,
				p;
			for (p in this._labels) {
				a[cnt++] = {time:this._labels[p], name:p};
			}
			a.sort(function(a,b) {
				return a.time - b.time;
			});
			return a;
		};


//---- GETTERS / SETTERS -------------------------------------------------------------------------------------------------------

		p.progress = function(value, suppressEvents) {
			return (!arguments.length) ? this._time / this.duration() : this.totalTime( this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), suppressEvents);
		};

		p.totalProgress = function(value, suppressEvents) {
			return (!arguments.length) ? this._totalTime / this.totalDuration() : this.totalTime( this.totalDuration() * value, suppressEvents);
		};

		p.totalDuration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					TimelineLite.prototype.totalDuration.call(this); //just forces refresh
					//Instead of Infinity, we use 999999999999 so that we can accommodate reverses.
					this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
				}
				return this._totalDuration;
			}
			return (this._repeat === -1 || !value) ? this : this.timeScale( this.totalDuration() / value );
		};

		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			if (value > this._duration) {
				value = this._duration;
			}
			if (this._yoyo && (this._cycle & 1) !== 0) {
				value = (this._duration - value) + (this._cycle * (this._duration + this._repeatDelay));
			} else if (this._repeat !== 0) {
				value += this._cycle * (this._duration + this._repeatDelay);
			}
			return this.totalTime(value, suppressEvents);
		};

		p.repeat = function(value) {
			if (!arguments.length) {
				return this._repeat;
			}
			this._repeat = value;
			return this._uncache(true);
		};

		p.repeatDelay = function(value) {
			if (!arguments.length) {
				return this._repeatDelay;
			}
			this._repeatDelay = value;
			return this._uncache(true);
		};

		p.yoyo = function(value) {
			if (!arguments.length) {
				return this._yoyo;
			}
			this._yoyo = value;
			return this;
		};

		p.currentLabel = function(value) {
			if (!arguments.length) {
				return this.getLabelBefore(this._time + 0.00000001);
			}
			return this.seek(value, true);
		};

		return TimelineMax;

	}, true);
	




	
	
	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * BezierPlugin
 * ----------------------------------------------------------------
 */
	(function() {

		var _RAD2DEG = 180 / Math.PI,
			_r1 = [],
			_r2 = [],
			_r3 = [],
			_corProps = {},
			_globals = _gsScope._gsDefine.globals,
			Segment = function(a, b, c, d) {
				if (c === d) { //if c and d match, the final autoRotate value could lock at -90 degrees, so differentiate them slightly.
					c = d - (d - b) / 1000000;
				}
				if (a === b) { //if a and b match, the starting autoRotate value could lock at -90 degrees, so differentiate them slightly.
					b = a + (c - a) / 1000000;
				}
				this.a = a;
				this.b = b;
				this.c = c;
				this.d = d;
				this.da = d - a;
				this.ca = c - a;
				this.ba = b - a;
			},
			_correlate = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
			cubicToQuadratic = function(a, b, c, d) {
				var q1 = {a:a},
					q2 = {},
					q3 = {},
					q4 = {c:d},
					mab = (a + b) / 2,
					mbc = (b + c) / 2,
					mcd = (c + d) / 2,
					mabc = (mab + mbc) / 2,
					mbcd = (mbc + mcd) / 2,
					m8 = (mbcd - mabc) / 8;
				q1.b = mab + (a - mab) / 4;
				q2.b = mabc + m8;
				q1.c = q2.a = (q1.b + q2.b) / 2;
				q2.c = q3.a = (mabc + mbcd) / 2;
				q3.b = mbcd - m8;
				q4.b = mcd + (d - mcd) / 4;
				q3.c = q4.a = (q3.b + q4.b) / 2;
				return [q1, q2, q3, q4];
			},
			_calculateControlPoints = function(a, curviness, quad, basic, correlate) {
				var l = a.length - 1,
					ii = 0,
					cp1 = a[0].a,
					i, p1, p2, p3, seg, m1, m2, mm, cp2, qb, r1, r2, tl;
				for (i = 0; i < l; i++) {
					seg = a[ii];
					p1 = seg.a;
					p2 = seg.d;
					p3 = a[ii+1].d;

					if (correlate) {
						r1 = _r1[i];
						r2 = _r2[i];
						tl = ((r2 + r1) * curviness * 0.25) / (basic ? 0.5 : _r3[i] || 0.5);
						m1 = p2 - (p2 - p1) * (basic ? curviness * 0.5 : (r1 !== 0 ? tl / r1 : 0));
						m2 = p2 + (p3 - p2) * (basic ? curviness * 0.5 : (r2 !== 0 ? tl / r2 : 0));
						mm = p2 - (m1 + (((m2 - m1) * ((r1 * 3 / (r1 + r2)) + 0.5) / 4) || 0));
					} else {
						m1 = p2 - (p2 - p1) * curviness * 0.5;
						m2 = p2 + (p3 - p2) * curviness * 0.5;
						mm = p2 - (m1 + m2) / 2;
					}
					m1 += mm;
					m2 += mm;

					seg.c = cp2 = m1;
					if (i !== 0) {
						seg.b = cp1;
					} else {
						seg.b = cp1 = seg.a + (seg.c - seg.a) * 0.6; //instead of placing b on a exactly, we move it inline with c so that if the user specifies an ease like Back.easeIn or Elastic.easeIn which goes BEYOND the beginning, it will do so smoothly.
					}

					seg.da = p2 - p1;
					seg.ca = cp2 - p1;
					seg.ba = cp1 - p1;

					if (quad) {
						qb = cubicToQuadratic(p1, cp1, cp2, p2);
						a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
						ii += 4;
					} else {
						ii++;
					}

					cp1 = m2;
				}
				seg = a[ii];
				seg.b = cp1;
				seg.c = cp1 + (seg.d - cp1) * 0.4; //instead of placing c on d exactly, we move it inline with b so that if the user specifies an ease like Back.easeOut or Elastic.easeOut which goes BEYOND the end, it will do so smoothly.
				seg.da = seg.d - seg.a;
				seg.ca = seg.c - seg.a;
				seg.ba = cp1 - seg.a;
				if (quad) {
					qb = cubicToQuadratic(seg.a, cp1, seg.c, seg.d);
					a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
				}
			},
			_parseAnchors = function(values, p, correlate, prepend) {
				var a = [],
					l, i, p1, p2, p3, tmp;
				if (prepend) {
					values = [prepend].concat(values);
					i = values.length;
					while (--i > -1) {
						if (typeof( (tmp = values[i][p]) ) === "string") if (tmp.charAt(1) === "=") {
							values[i][p] = prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)); //accommodate relative values. Do it inline instead of breaking it out into a function for speed reasons
						}
					}
				}
				l = values.length - 2;
				if (l < 0) {
					a[0] = new Segment(values[0][p], 0, 0, values[(l < -1) ? 0 : 1][p]);
					return a;
				}
				for (i = 0; i < l; i++) {
					p1 = values[i][p];
					p2 = values[i+1][p];
					a[i] = new Segment(p1, 0, 0, p2);
					if (correlate) {
						p3 = values[i+2][p];
						_r1[i] = (_r1[i] || 0) + (p2 - p1) * (p2 - p1);
						_r2[i] = (_r2[i] || 0) + (p3 - p2) * (p3 - p2);
					}
				}
				a[i] = new Segment(values[i][p], 0, 0, values[i+1][p]);
				return a;
			},
			bezierThrough = function(values, curviness, quadratic, basic, correlate, prepend) {
				var obj = {},
					props = [],
					first = prepend || values[0],
					i, p, a, j, r, l, seamless, last;
				correlate = (typeof(correlate) === "string") ? ","+correlate+"," : _correlate;
				if (curviness == null) {
					curviness = 1;
				}
				for (p in values[0]) {
					props.push(p);
				}
				//check to see if the last and first values are identical (well, within 0.05). If so, make seamless by appending the second element to the very end of the values array and the 2nd-to-last element to the very beginning (we'll remove those segments later)
				if (values.length > 1) {
					last = values[values.length - 1];
					seamless = true;
					i = props.length;
					while (--i > -1) {
						p = props[i];
						if (Math.abs(first[p] - last[p]) > 0.05) { //build in a tolerance of +/-0.05 to accommodate rounding errors.
							seamless = false;
							break;
						}
					}
					if (seamless) {
						values = values.concat(); //duplicate the array to avoid contaminating the original which the user may be reusing for other tweens
						if (prepend) {
							values.unshift(prepend);
						}
						values.push(values[1]);
						prepend = values[values.length - 3];
					}
				}
				_r1.length = _r2.length = _r3.length = 0;
				i = props.length;
				while (--i > -1) {
					p = props[i];
					_corProps[p] = (correlate.indexOf(","+p+",") !== -1);
					obj[p] = _parseAnchors(values, p, _corProps[p], prepend);
				}
				i = _r1.length;
				while (--i > -1) {
					_r1[i] = Math.sqrt(_r1[i]);
					_r2[i] = Math.sqrt(_r2[i]);
				}
				if (!basic) {
					i = props.length;
					while (--i > -1) {
						if (_corProps[p]) {
							a = obj[props[i]];
							l = a.length - 1;
							for (j = 0; j < l; j++) {
								r = (a[j+1].da / _r2[j] + a[j].da / _r1[j]) || 0;
								_r3[j] = (_r3[j] || 0) + r * r;
							}
						}
					}
					i = _r3.length;
					while (--i > -1) {
						_r3[i] = Math.sqrt(_r3[i]);
					}
				}
				i = props.length;
				j = quadratic ? 4 : 1;
				while (--i > -1) {
					p = props[i];
					a = obj[p];
					_calculateControlPoints(a, curviness, quadratic, basic, _corProps[p]); //this method requires that _parseAnchors() and _setSegmentRatios() ran first so that _r1, _r2, and _r3 values are populated for all properties
					if (seamless) {
						a.splice(0, j);
						a.splice(a.length - j, j);
					}
				}
				return obj;
			},
			_parseBezierData = function(values, type, prepend) {
				type = type || "soft";
				var obj = {},
					inc = (type === "cubic") ? 3 : 2,
					soft = (type === "soft"),
					props = [],
					a, b, c, d, cur, i, j, l, p, cnt, tmp;
				if (soft && prepend) {
					values = [prepend].concat(values);
				}
				if (values == null || values.length < inc + 1) { throw "invalid Bezier data"; }
				for (p in values[0]) {
					props.push(p);
				}
				i = props.length;
				while (--i > -1) {
					p = props[i];
					obj[p] = cur = [];
					cnt = 0;
					l = values.length;
					for (j = 0; j < l; j++) {
						a = (prepend == null) ? values[j][p] : (typeof( (tmp = values[j][p]) ) === "string" && tmp.charAt(1) === "=") ? prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)) : Number(tmp);
						if (soft) if (j > 1) if (j < l - 1) {
							cur[cnt++] = (a + cur[cnt-2]) / 2;
						}
						cur[cnt++] = a;
					}
					l = cnt - inc + 1;
					cnt = 0;
					for (j = 0; j < l; j += inc) {
						a = cur[j];
						b = cur[j+1];
						c = cur[j+2];
						d = (inc === 2) ? 0 : cur[j+3];
						cur[cnt++] = tmp = (inc === 3) ? new Segment(a, b, c, d) : new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
					}
					cur.length = cnt;
				}
				return obj;
			},
			_addCubicLengths = function(a, steps, resolution) {
				var inc = 1 / resolution,
					j = a.length,
					d, d1, s, da, ca, ba, p, i, inv, bez, index;
				while (--j > -1) {
					bez = a[j];
					s = bez.a;
					da = bez.d - s;
					ca = bez.c - s;
					ba = bez.b - s;
					d = d1 = 0;
					for (i = 1; i <= resolution; i++) {
						p = inc * i;
						inv = 1 - p;
						d = d1 - (d1 = (p * p * da + 3 * inv * (p * ca + inv * ba)) * p);
						index = j * resolution + i - 1;
						steps[index] = (steps[index] || 0) + d * d;
					}
				}
			},
			_parseLengthData = function(obj, resolution) {
				resolution = resolution >> 0 || 6;
				var a = [],
					lengths = [],
					d = 0,
					total = 0,
					threshold = resolution - 1,
					segments = [],
					curLS = [], //current length segments array
					p, i, l, index;
				for (p in obj) {
					_addCubicLengths(obj[p], a, resolution);
				}
				l = a.length;
				for (i = 0; i < l; i++) {
					d += Math.sqrt(a[i]);
					index = i % resolution;
					curLS[index] = d;
					if (index === threshold) {
						total += d;
						index = (i / resolution) >> 0;
						segments[index] = curLS;
						lengths[index] = total;
						d = 0;
						curLS = [];
					}
				}
				return {length:total, lengths:lengths, segments:segments};
			},



			BezierPlugin = _gsScope._gsDefine.plugin({
					propName: "bezier",
					priority: -1,
					version: "1.3.7",
					API: 2,
					global:true,

					//gets called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
					init: function(target, vars, tween) {
						this._target = target;
						if (vars instanceof Array) {
							vars = {values:vars};
						}
						this._func = {};
						this._mod = {};
						this._props = [];
						this._timeRes = (vars.timeResolution == null) ? 6 : parseInt(vars.timeResolution, 10);
						var values = vars.values || [],
							first = {},
							second = values[0],
							autoRotate = vars.autoRotate || tween.vars.orientToBezier,
							p, isFunc, i, j, prepend;

						this._autoRotate = autoRotate ? (autoRotate instanceof Array) ? autoRotate : [["x","y","rotation",((autoRotate === true) ? 0 : Number(autoRotate) || 0)]] : null;
						for (p in second) {
							this._props.push(p);
						}

						i = this._props.length;
						while (--i > -1) {
							p = this._props[i];

							this._overwriteProps.push(p);
							isFunc = this._func[p] = (typeof(target[p]) === "function");
							first[p] = (!isFunc) ? parseFloat(target[p]) : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]();
							if (!prepend) if (first[p] !== values[0][p]) {
								prepend = first;
							}
						}
						this._beziers = (vars.type !== "cubic" && vars.type !== "quadratic" && vars.type !== "soft") ? bezierThrough(values, isNaN(vars.curviness) ? 1 : vars.curviness, false, (vars.type === "thruBasic"), vars.correlate, prepend) : _parseBezierData(values, vars.type, first);
						this._segCount = this._beziers[p].length;

						if (this._timeRes) {
							var ld = _parseLengthData(this._beziers, this._timeRes);
							this._length = ld.length;
							this._lengths = ld.lengths;
							this._segments = ld.segments;
							this._l1 = this._li = this._s1 = this._si = 0;
							this._l2 = this._lengths[0];
							this._curSeg = this._segments[0];
							this._s2 = this._curSeg[0];
							this._prec = 1 / this._curSeg.length;
						}

						if ((autoRotate = this._autoRotate)) {
							this._initialRotations = [];
							if (!(autoRotate[0] instanceof Array)) {
								this._autoRotate = autoRotate = [autoRotate];
							}
							i = autoRotate.length;
							while (--i > -1) {
								for (j = 0; j < 3; j++) {
									p = autoRotate[i][j];
									this._func[p] = (typeof(target[p]) === "function") ? target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ] : false;
								}
								p = autoRotate[i][2];
								this._initialRotations[i] = (this._func[p] ? this._func[p].call(this._target) : this._target[p]) || 0;
								this._overwriteProps.push(p);
							}
						}
						this._startRatio = tween.vars.runBackwards ? 1 : 0; //we determine the starting ratio when the tween inits which is always 0 unless the tween has runBackwards:true (indicating it's a from() tween) in which case it's 1.
						return true;
					},

					//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
					set: function(v) {
						var segments = this._segCount,
							func = this._func,
							target = this._target,
							notStart = (v !== this._startRatio),
							curIndex, inv, i, p, b, t, val, l, lengths, curSeg;
						if (!this._timeRes) {
							curIndex = (v < 0) ? 0 : (v >= 1) ? segments - 1 : (segments * v) >> 0;
							t = (v - (curIndex * (1 / segments))) * segments;
						} else {
							lengths = this._lengths;
							curSeg = this._curSeg;
							v *= this._length;
							i = this._li;
							//find the appropriate segment (if the currently cached one isn't correct)
							if (v > this._l2 && i < segments - 1) {
								l = segments - 1;
								while (i < l && (this._l2 = lengths[++i]) <= v) {	}
								this._l1 = lengths[i-1];
								this._li = i;
								this._curSeg = curSeg = this._segments[i];
								this._s2 = curSeg[(this._s1 = this._si = 0)];
							} else if (v < this._l1 && i > 0) {
								while (i > 0 && (this._l1 = lengths[--i]) >= v) { }
								if (i === 0 && v < this._l1) {
									this._l1 = 0;
								} else {
									i++;
								}
								this._l2 = lengths[i];
								this._li = i;
								this._curSeg = curSeg = this._segments[i];
								this._s1 = curSeg[(this._si = curSeg.length - 1) - 1] || 0;
								this._s2 = curSeg[this._si];
							}
							curIndex = i;
							//now find the appropriate sub-segment (we split it into the number of pieces that was defined by "precision" and measured each one)
							v -= this._l1;
							i = this._si;
							if (v > this._s2 && i < curSeg.length - 1) {
								l = curSeg.length - 1;
								while (i < l && (this._s2 = curSeg[++i]) <= v) {	}
								this._s1 = curSeg[i-1];
								this._si = i;
							} else if (v < this._s1 && i > 0) {
								while (i > 0 && (this._s1 = curSeg[--i]) >= v) {	}
								if (i === 0 && v < this._s1) {
									this._s1 = 0;
								} else {
									i++;
								}
								this._s2 = curSeg[i];
								this._si = i;
							}
							t = ((i + (v - this._s1) / (this._s2 - this._s1)) * this._prec) || 0;
						}
						inv = 1 - t;

						i = this._props.length;
						while (--i > -1) {
							p = this._props[i];
							b = this._beziers[p][curIndex];
							val = (t * t * b.da + 3 * inv * (t * b.ca + inv * b.ba)) * t + b.a;
							if (this._mod[p]) {
								val = this._mod[p](val, target);
							}
							if (func[p]) {
								target[p](val);
							} else {
								target[p] = val;
							}
						}

						if (this._autoRotate) {
							var ar = this._autoRotate,
								b2, x1, y1, x2, y2, add, conv;
							i = ar.length;
							while (--i > -1) {
								p = ar[i][2];
								add = ar[i][3] || 0;
								conv = (ar[i][4] === true) ? 1 : _RAD2DEG;
								b = this._beziers[ar[i][0]];
								b2 = this._beziers[ar[i][1]];

								if (b && b2) { //in case one of the properties got overwritten.
									b = b[curIndex];
									b2 = b2[curIndex];

									x1 = b.a + (b.b - b.a) * t;
									x2 = b.b + (b.c - b.b) * t;
									x1 += (x2 - x1) * t;
									x2 += ((b.c + (b.d - b.c) * t) - x2) * t;

									y1 = b2.a + (b2.b - b2.a) * t;
									y2 = b2.b + (b2.c - b2.b) * t;
									y1 += (y2 - y1) * t;
									y2 += ((b2.c + (b2.d - b2.c) * t) - y2) * t;

									val = notStart ? Math.atan2(y2 - y1, x2 - x1) * conv + add : this._initialRotations[i];

									if (this._mod[p]) {
										val = this._mod[p](val, target); //for modProps
									}

									if (func[p]) {
										target[p](val);
									} else {
										target[p] = val;
									}
								}
							}
						}
					}
			}),
			p = BezierPlugin.prototype;


		BezierPlugin.bezierThrough = bezierThrough;
		BezierPlugin.cubicToQuadratic = cubicToQuadratic;
		BezierPlugin._autoCSS = true; //indicates that this plugin can be inserted into the "css" object using the autoCSS feature of TweenLite
		BezierPlugin.quadraticToCubic = function(a, b, c) {
			return new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
		};

		BezierPlugin._cssRegister = function() {
			var CSSPlugin = _globals.CSSPlugin;
			if (!CSSPlugin) {
				return;
			}
			var _internals = CSSPlugin._internals,
				_parseToProxy = _internals._parseToProxy,
				_setPluginRatio = _internals._setPluginRatio,
				CSSPropTween = _internals.CSSPropTween;
			_internals._registerComplexSpecialProp("bezier", {parser:function(t, e, prop, cssp, pt, plugin) {
				if (e instanceof Array) {
					e = {values:e};
				}
				plugin = new BezierPlugin();
				var values = e.values,
					l = values.length - 1,
					pluginValues = [],
					v = {},
					i, p, data;
				if (l < 0) {
					return pt;
				}
				for (i = 0; i <= l; i++) {
					data = _parseToProxy(t, values[i], cssp, pt, plugin, (l !== i));
					pluginValues[i] = data.end;
				}
				for (p in e) {
					v[p] = e[p]; //duplicate the vars object because we need to alter some things which would cause problems if the user plans to reuse the same vars object for another tween.
				}
				v.values = pluginValues;
				pt = new CSSPropTween(t, "bezier", 0, 0, data.pt, 2);
				pt.data = data;
				pt.plugin = plugin;
				pt.setRatio = _setPluginRatio;
				if (v.autoRotate === 0) {
					v.autoRotate = true;
				}
				if (v.autoRotate && !(v.autoRotate instanceof Array)) {
					i = (v.autoRotate === true) ? 0 : Number(v.autoRotate);
					v.autoRotate = (data.end.left != null) ? [["left","top","rotation",i,false]] : (data.end.x != null) ? [["x","y","rotation",i,false]] : false;
				}
				if (v.autoRotate) {
					if (!cssp._transform) {
						cssp._enableTransforms(false);
					}
					data.autoRotate = cssp._target._gsTransform;
					data.proxy.rotation = data.autoRotate.rotation || 0;
					cssp._overwriteProps.push("rotation");
				}
				plugin._onInitTween(data.proxy, v, cssp._tween);
				return pt;
			}});
		};

		p._mod = function(lookup) {
			var op = this._overwriteProps,
				i = op.length,
				val;
			while (--i > -1) {
				val = lookup[op[i]];
				if (val && typeof(val) === "function") {
					this._mod[op[i]] = val;
				}
			}
		};

		p._kill = function(lookup) {
			var a = this._props,
				p, i;
			for (p in this._beziers) {
				if (p in lookup) {
					delete this._beziers[p];
					delete this._func[p];
					i = a.length;
					while (--i > -1) {
						if (a[i] === p) {
							a.splice(i, 1);
						}
					}
				}
			}
			a = this._autoRotate;
			if (a) {
				i = a.length;
				while (--i > -1) {
					if (lookup[a[i][2]]) {
						a.splice(i, 1);
					}
				}
			}
			return this._super._kill.call(this, lookup);
		};

	}());






	
	
	
	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * CSSPlugin
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin","TweenLite"], function(TweenPlugin, TweenLite) {

		/** @constructor **/
		var CSSPlugin = function() {
				TweenPlugin.call(this, "css");
				this._overwriteProps.length = 0;
				this.setRatio = CSSPlugin.prototype.setRatio; //speed optimization (avoid prototype lookup on this "hot" method)
			},
			_globals = _gsScope._gsDefine.globals,
			_hasPriority, //turns true whenever a CSSPropTween instance is created that has a priority other than 0. This helps us discern whether or not we should spend the time organizing the linked list or not after a CSSPlugin's _onInitTween() method is called.
			_suffixMap, //we set this in _onInitTween() each time as a way to have a persistent variable we can use in other methods like _parse() without having to pass it around as a parameter and we keep _parse() decoupled from a particular CSSPlugin instance
			_cs, //computed style (we store this in a shared variable to conserve memory and make minification tighter
			_overwriteProps, //alias to the currently instantiating CSSPlugin's _overwriteProps array. We use this closure in order to avoid having to pass a reference around from method to method and aid in minification.
			_specialProps = {},
			p = CSSPlugin.prototype = new TweenPlugin("css");

		p.constructor = CSSPlugin;
		CSSPlugin.version = "1.19.0";
		CSSPlugin.API = 2;
		CSSPlugin.defaultTransformPerspective = 0;
		CSSPlugin.defaultSkewType = "compensated";
		CSSPlugin.defaultSmoothOrigin = true;
		p = "px"; //we'll reuse the "p" variable to keep file size down
		CSSPlugin.suffixMap = {top:p, right:p, bottom:p, left:p, width:p, height:p, fontSize:p, padding:p, margin:p, perspective:p, lineHeight:""};


		var _numExp = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
			_relNumExp = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
			_valuesExp = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi, //finds all the values that begin with numbers or += or -= and then a number. Includes suffixes. We use this to split complex values apart like "1px 5px 20px rgb(255,102,51)"
			_NaNExp = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g, //also allows scientific notation and doesn't kill the leading -/+ in -= and +=
			_suffixExp = /(?:\d|\-|\+|=|#|\.)*/g,
			_opacityExp = /opacity *= *([^)]*)/i,
			_opacityValExp = /opacity:([^;]*)/i,
			_alphaFilterExp = /alpha\(opacity *=.+?\)/i,
			_rgbhslExp = /^(rgb|hsl)/,
			_capsExp = /([A-Z])/g,
			_camelExp = /-([a-z])/gi,
			_urlExp = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, //for pulling out urls from url(...) or url("...") strings (some browsers wrap urls in quotes, some don't when reporting things like backgroundImage)
			_camelFunc = function(s, g) { return g.toUpperCase(); },
			_horizExp = /(?:Left|Right|Width)/i,
			_ieGetMatrixExp = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
			_ieSetMatrixExp = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
			_commasOutsideParenExp = /,(?=[^\)]*(?:\(|$))/gi, //finds any commas that are not within parenthesis
			_complexExp = /[\s,\(]/i, //for testing a string to find if it has a space, comma, or open parenthesis (clues that it's a complex value)
			_DEG2RAD = Math.PI / 180,
			_RAD2DEG = 180 / Math.PI,
			_forcePT = {},
			_doc = document,
			_createElement = function(type) {
				return _doc.createElementNS ? _doc.createElementNS("http://www.w3.org/1999/xhtml", type) : _doc.createElement(type);
			},
			_tempDiv = _createElement("div"),
			_tempImg = _createElement("img"),
			_internals = CSSPlugin._internals = {_specialProps:_specialProps}, //provides a hook to a few internal methods that we need to access from inside other plugins
			_agent = navigator.userAgent,
			_autoRound,
			_reqSafariFix, //we won't apply the Safari transform fix until we actually come across a tween that affects a transform property (to maintain best performance).

			_isSafari,
			_isFirefox, //Firefox has a bug that causes 3D transformed elements to randomly disappear unless a repaint is forced after each update on each element.
			_isSafariLT6, //Safari (and Android 4 which uses a flavor of Safari) has a bug that prevents changes to "top" and "left" properties from rendering properly if changed on the same frame as a transform UNLESS we set the element's WebkitBackfaceVisibility to hidden (weird, I know). Doing this for Android 3 and earlier seems to actually cause other problems, though (fun!)
			_ieVers,
			_supportsOpacity = (function() { //we set _isSafari, _ieVers, _isFirefox, and _supportsOpacity all in one function here to reduce file size slightly, especially in the minified version.
				var i = _agent.indexOf("Android"),
					a = _createElement("a");
				_isSafari = (_agent.indexOf("Safari") !== -1 && _agent.indexOf("Chrome") === -1 && (i === -1 || Number(_agent.substr(i+8, 1)) > 3));
				_isSafariLT6 = (_isSafari && (Number(_agent.substr(_agent.indexOf("Version/")+8, 1)) < 6));
				_isFirefox = (_agent.indexOf("Firefox") !== -1);
				if ((/MSIE ([0-9]{1,}[\.0-9]{0,})/).exec(_agent) || (/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/).exec(_agent)) {
					_ieVers = parseFloat( RegExp.$1 );
				}
				if (!a) {
					return false;
				}
				a.style.cssText = "top:1px;opacity:.55;";
				return /^0.55/.test(a.style.opacity);
			}()),
			_getIEOpacity = function(v) {
				return (_opacityExp.test( ((typeof(v) === "string") ? v : (v.currentStyle ? v.currentStyle.filter : v.style.filter) || "") ) ? ( parseFloat( RegExp.$1 ) / 100 ) : 1);
			},
			_log = function(s) {//for logging messages, but in a way that won't throw errors in old versions of IE.
				if (window.console) {
					console.log(s);
				}
			},
			_target, //when initting a CSSPlugin, we set this variable so that we can access it from within many other functions without having to pass it around as params
			_index, //when initting a CSSPlugin, we set this variable so that we can access it from within many other functions without having to pass it around as params

			_prefixCSS = "", //the non-camelCase vendor prefix like "-o-", "-moz-", "-ms-", or "-webkit-"
			_prefix = "", //camelCase vendor prefix like "O", "ms", "Webkit", or "Moz".

			// @private feed in a camelCase property name like "transform" and it will check to see if it is valid as-is or if it needs a vendor prefix. It returns the corrected camelCase property name (i.e. "WebkitTransform" or "MozTransform" or "transform" or null if no such property is found, like if the browser is IE8 or before, "transform" won't be found at all)
			_checkPropPrefix = function(p, e) {
				e = e || _tempDiv;
				var s = e.style,
					a, i;
				if (s[p] !== undefined) {
					return p;
				}
				p = p.charAt(0).toUpperCase() + p.substr(1);
				a = ["O","Moz","ms","Ms","Webkit"];
				i = 5;
				while (--i > -1 && s[a[i]+p] === undefined) { }
				if (i >= 0) {
					_prefix = (i === 3) ? "ms" : a[i];
					_prefixCSS = "-" + _prefix.toLowerCase() + "-";
					return _prefix + p;
				}
				return null;
			},

			_getComputedStyle = _doc.defaultView ? _doc.defaultView.getComputedStyle : function() {},

			/**
			 * @private Returns the css style for a particular property of an element. For example, to get whatever the current "left" css value for an element with an ID of "myElement", you could do:
			 * var currentLeft = CSSPlugin.getStyle( document.getElementById("myElement"), "left");
			 *
			 * @param {!Object} t Target element whose style property you want to query
			 * @param {!string} p Property name (like "left" or "top" or "marginTop", etc.)
			 * @param {Object=} cs Computed style object. This just provides a way to speed processing if you're going to get several properties on the same element in quick succession - you can reuse the result of the getComputedStyle() call.
			 * @param {boolean=} calc If true, the value will not be read directly from the element's "style" property (if it exists there), but instead the getComputedStyle() result will be used. This can be useful when you want to ensure that the browser itself is interpreting the value.
			 * @param {string=} dflt Default value that should be returned in the place of null, "none", "auto" or "auto auto".
			 * @return {?string} The current property value
			 */
			_getStyle = CSSPlugin.getStyle = function(t, p, cs, calc, dflt) {
				var rv;
				if (!_supportsOpacity) if (p === "opacity") { //several versions of IE don't use the standard "opacity" property - they use things like filter:alpha(opacity=50), so we parse that here.
					return _getIEOpacity(t);
				}
				if (!calc && t.style[p]) {
					rv = t.style[p];
				} else if ((cs = cs || _getComputedStyle(t))) {
					rv = cs[p] || cs.getPropertyValue(p) || cs.getPropertyValue(p.replace(_capsExp, "-$1").toLowerCase());
				} else if (t.currentStyle) {
					rv = t.currentStyle[p];
				}
				return (dflt != null && (!rv || rv === "none" || rv === "auto" || rv === "auto auto")) ? dflt : rv;
			},

			/**
			 * @private Pass the target element, the property name, the numeric value, and the suffix (like "%", "em", "px", etc.) and it will spit back the equivalent pixel number.
			 * @param {!Object} t Target element
			 * @param {!string} p Property name (like "left", "top", "marginLeft", etc.)
			 * @param {!number} v Value
			 * @param {string=} sfx Suffix (like "px" or "%" or "em")
			 * @param {boolean=} recurse If true, the call is a recursive one. In some browsers (like IE7/8), occasionally the value isn't accurately reported initially, but if we run the function again it will take effect.
			 * @return {number} value in pixels
			 */
			_convertToPixels = _internals.convertToPixels = function(t, p, v, sfx, recurse) {
				if (sfx === "px" || !sfx) { return v; }
				if (sfx === "auto" || !v) { return 0; }
				var horiz = _horizExp.test(p),
					node = t,
					style = _tempDiv.style,
					neg = (v < 0),
					precise = (v === 1),
					pix, cache, time;
				if (neg) {
					v = -v;
				}
				if (precise) {
					v *= 100;
				}
				if (sfx === "%" && p.indexOf("border") !== -1) {
					pix = (v / 100) * (horiz ? t.clientWidth : t.clientHeight);
				} else {
					style.cssText = "border:0 solid red;position:" + _getStyle(t, "position") + ";line-height:0;";
					if (sfx === "%" || !node.appendChild || sfx.charAt(0) === "v" || sfx === "rem") {
						node = t.parentNode || _doc.body;
						cache = node._gsCache;
						time = TweenLite.ticker.frame;
						if (cache && horiz && cache.time === time) { //performance optimization: we record the width of elements along with the ticker frame so that we can quickly get it again on the same tick (seems relatively safe to assume it wouldn't change on the same tick)
							return cache.width * v / 100;
						}
						style[(horiz ? "width" : "height")] = v + sfx;
					} else {
						style[(horiz ? "borderLeftWidth" : "borderTopWidth")] = v + sfx;
					}
					node.appendChild(_tempDiv);
					pix = parseFloat(_tempDiv[(horiz ? "offsetWidth" : "offsetHeight")]);
					node.removeChild(_tempDiv);
					if (horiz && sfx === "%" && CSSPlugin.cacheWidths !== false) {
						cache = node._gsCache = node._gsCache || {};
						cache.time = time;
						cache.width = pix / v * 100;
					}
					if (pix === 0 && !recurse) {
						pix = _convertToPixels(t, p, v, sfx, true);
					}
				}
				if (precise) {
					pix /= 100;
				}
				return neg ? -pix : pix;
			},
			_calculateOffset = _internals.calculateOffset = function(t, p, cs) { //for figuring out "top" or "left" in px when it's "auto". We need to factor in margin with the offsetLeft/offsetTop
				if (_getStyle(t, "position", cs) !== "absolute") { return 0; }
				var dim = ((p === "left") ? "Left" : "Top"),
					v = _getStyle(t, "margin" + dim, cs);
				return t["offset" + dim] - (_convertToPixels(t, p, parseFloat(v), v.replace(_suffixExp, "")) || 0);
			},

			// @private returns at object containing ALL of the style properties in camelCase and their associated values.
			_getAllStyles = function(t, cs) {
				var s = {},
					i, tr, p;
				if ((cs = cs || _getComputedStyle(t, null))) {
					if ((i = cs.length)) {
						while (--i > -1) {
							p = cs[i];
							if (p.indexOf("-transform") === -1 || _transformPropCSS === p) { //Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
								s[p.replace(_camelExp, _camelFunc)] = cs.getPropertyValue(p);
							}
						}
					} else { //some browsers behave differently - cs.length is always 0, so we must do a for...in loop.
						for (i in cs) {
							if (i.indexOf("Transform") === -1 || _transformProp === i) { //Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
								s[i] = cs[i];
							}
						}
					}
				} else if ((cs = t.currentStyle || t.style)) {
					for (i in cs) {
						if (typeof(i) === "string" && s[i] === undefined) {
							s[i.replace(_camelExp, _camelFunc)] = cs[i];
						}
					}
				}
				if (!_supportsOpacity) {
					s.opacity = _getIEOpacity(t);
				}
				tr = _getTransform(t, cs, false);
				s.rotation = tr.rotation;
				s.skewX = tr.skewX;
				s.scaleX = tr.scaleX;
				s.scaleY = tr.scaleY;
				s.x = tr.x;
				s.y = tr.y;
				if (_supports3D) {
					s.z = tr.z;
					s.rotationX = tr.rotationX;
					s.rotationY = tr.rotationY;
					s.scaleZ = tr.scaleZ;
				}
				if (s.filters) {
					delete s.filters;
				}
				return s;
			},

			// @private analyzes two style objects (as returned by _getAllStyles()) and only looks for differences between them that contain tweenable values (like a number or color). It returns an object with a "difs" property which refers to an object containing only those isolated properties and values for tweening, and a "firstMPT" property which refers to the first MiniPropTween instance in a linked list that recorded all the starting values of the different properties so that we can revert to them at the end or beginning of the tween - we don't want the cascading to get messed up. The forceLookup parameter is an optional generic object with properties that should be forced into the results - this is necessary for className tweens that are overwriting others because imagine a scenario where a rollover/rollout adds/removes a class and the user swipes the mouse over the target SUPER fast, thus nothing actually changed yet and the subsequent comparison of the properties would indicate they match (especially when px rounding is taken into consideration), thus no tweening is necessary even though it SHOULD tween and remove those properties after the tween (otherwise the inline styles will contaminate things). See the className SpecialProp code for details.
			_cssDif = function(t, s1, s2, vars, forceLookup) {
				var difs = {},
					style = t.style,
					val, p, mpt;
				for (p in s2) {
					if (p !== "cssText") if (p !== "length") if (isNaN(p)) if (s1[p] !== (val = s2[p]) || (forceLookup && forceLookup[p])) if (p.indexOf("Origin") === -1) if (typeof(val) === "number" || typeof(val) === "string") {
						difs[p] = (val === "auto" && (p === "left" || p === "top")) ? _calculateOffset(t, p) : ((val === "" || val === "auto" || val === "none") && typeof(s1[p]) === "string" && s1[p].replace(_NaNExp, "") !== "") ? 0 : val; //if the ending value is defaulting ("" or "auto"), we check the starting value and if it can be parsed into a number (a string which could have a suffix too, like 700px), then we swap in 0 for "" or "auto" so that things actually tween.
						if (style[p] !== undefined) { //for className tweens, we must remember which properties already existed inline - the ones that didn't should be removed when the tween isn't in progress because they were only introduced to facilitate the transition between classes.
							mpt = new MiniPropTween(style, p, style[p], mpt);
						}
					}
				}
				if (vars) {
					for (p in vars) { //copy properties (except className)
						if (p !== "className") {
							difs[p] = vars[p];
						}
					}
				}
				return {difs:difs, firstMPT:mpt};
			},
			_dimensions = {width:["Left","Right"], height:["Top","Bottom"]},
			_margins = ["marginLeft","marginRight","marginTop","marginBottom"],

			/**
			 * @private Gets the width or height of an element
			 * @param {!Object} t Target element
			 * @param {!string} p Property name ("width" or "height")
			 * @param {Object=} cs Computed style object (if one exists). Just a speed optimization.
			 * @return {number} Dimension (in pixels)
			 */
			_getDimension = function(t, p, cs) {
				if ((t.nodeName + "").toLowerCase() === "svg") { //Chrome no longer supports offsetWidth/offsetHeight on SVG elements.
					return (cs || _getComputedStyle(t))[p] || 0;
				} else if (t.getBBox && _isSVG(t)) {
					return t.getBBox()[p] || 0;
				}
				var v = parseFloat((p === "width") ? t.offsetWidth : t.offsetHeight),
					a = _dimensions[p],
					i = a.length;
				cs = cs || _getComputedStyle(t, null);
				while (--i > -1) {
					v -= parseFloat( _getStyle(t, "padding" + a[i], cs, true) ) || 0;
					v -= parseFloat( _getStyle(t, "border" + a[i] + "Width", cs, true) ) || 0;
				}
				return v;
			},

			// @private Parses position-related complex strings like "top left" or "50px 10px" or "70% 20%", etc. which are used for things like transformOrigin or backgroundPosition. Optionally decorates a supplied object (recObj) with the following properties: "ox" (offsetX), "oy" (offsetY), "oxp" (if true, "ox" is a percentage not a pixel value), and "oxy" (if true, "oy" is a percentage not a pixel value)
			_parsePosition = function(v, recObj) {
				if (v === "contain" || v === "auto" || v === "auto auto") { //note: Firefox uses "auto auto" as default whereas Chrome uses "auto".
					return v + " ";
				}
				if (v == null || v === "") {
					v = "0 0";
				}
				var a = v.split(" "),
					x = (v.indexOf("left") !== -1) ? "0%" : (v.indexOf("right") !== -1) ? "100%" : a[0],
					y = (v.indexOf("top") !== -1) ? "0%" : (v.indexOf("bottom") !== -1) ? "100%" : a[1],
					i;
				if (a.length > 3 && !recObj) { //multiple positions
					a = v.split(", ").join(",").split(",");
					v = [];
					for (i = 0; i < a.length; i++) {
						v.push(_parsePosition(a[i]));
					}
					return v.join(",");
				}
				if (y == null) {
					y = (x === "center") ? "50%" : "0";
				} else if (y === "center") {
					y = "50%";
				}
				if (x === "center" || (isNaN(parseFloat(x)) && (x + "").indexOf("=") === -1)) { //remember, the user could flip-flop the values and say "bottom center" or "center bottom", etc. "center" is ambiguous because it could be used to describe horizontal or vertical, hence the isNaN(). If there's an "=" sign in the value, it's relative.
					x = "50%";
				}
				v = x + " " + y + ((a.length > 2) ? " " + a[2] : "");
				if (recObj) {
					recObj.oxp = (x.indexOf("%") !== -1);
					recObj.oyp = (y.indexOf("%") !== -1);
					recObj.oxr = (x.charAt(1) === "=");
					recObj.oyr = (y.charAt(1) === "=");
					recObj.ox = parseFloat(x.replace(_NaNExp, ""));
					recObj.oy = parseFloat(y.replace(_NaNExp, ""));
					recObj.v = v;
				}
				return recObj || v;
			},

			/**
			 * @private Takes an ending value (typically a string, but can be a number) and a starting value and returns the change between the two, looking for relative value indicators like += and -= and it also ignores suffixes (but make sure the ending value starts with a number or +=/-= and that the starting value is a NUMBER!)
			 * @param {(number|string)} e End value which is typically a string, but could be a number
			 * @param {(number|string)} b Beginning value which is typically a string but could be a number
			 * @return {number} Amount of change between the beginning and ending values (relative values that have a "+=" or "-=" are recognized)
			 */
			_parseChange = function(e, b) {
				if (typeof(e) === "function") {
					e = e(_index, _target);
				}
				return (typeof(e) === "string" && e.charAt(1) === "=") ? parseInt(e.charAt(0) + "1", 10) * parseFloat(e.substr(2)) : (parseFloat(e) - parseFloat(b)) || 0;
			},

			/**
			 * @private Takes a value and a default number, checks if the value is relative, null, or numeric and spits back a normalized number accordingly. Primarily used in the _parseTransform() function.
			 * @param {Object} v Value to be parsed
			 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
			 * @return {number} Parsed value
			 */
			_parseVal = function(v, d) {
				if (typeof(v) === "function") {
					v = v(_index, _target);
				}
				return (v == null) ? d : (typeof(v) === "string" && v.charAt(1) === "=") ? parseInt(v.charAt(0) + "1", 10) * parseFloat(v.substr(2)) + d : parseFloat(v) || 0;
			},

			/**
			 * @private Translates strings like "40deg" or "40" or 40rad" or "+=40deg" or "270_short" or "-90_cw" or "+=45_ccw" to a numeric radian angle. Of course a starting/default value must be fed in too so that relative values can be calculated properly.
			 * @param {Object} v Value to be parsed
			 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
			 * @param {string=} p property name for directionalEnd (optional - only used when the parsed value is directional ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation). Property name would be "rotation", "rotationX", or "rotationY"
			 * @param {Object=} directionalEnd An object that will store the raw end values for directional angles ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation.
			 * @return {number} parsed angle in radians
			 */
			_parseAngle = function(v, d, p, directionalEnd) {
				var min = 0.000001,
					cap, split, dif, result, isRelative;
				if (typeof(v) === "function") {
					v = v(_index, _target);
				}
				if (v == null) {
					result = d;
				} else if (typeof(v) === "number") {
					result = v;
				} else {
					cap = 360;
					split = v.split("_");
					isRelative = (v.charAt(1) === "=");
					dif = (isRelative ? parseInt(v.charAt(0) + "1", 10) * parseFloat(split[0].substr(2)) : parseFloat(split[0])) * ((v.indexOf("rad") === -1) ? 1 : _RAD2DEG) - (isRelative ? 0 : d);
					if (split.length) {
						if (directionalEnd) {
							directionalEnd[p] = d + dif;
						}
						if (v.indexOf("short") !== -1) {
							dif = dif % cap;
							if (dif !== dif % (cap / 2)) {
								dif = (dif < 0) ? dif + cap : dif - cap;
							}
						}
						if (v.indexOf("_cw") !== -1 && dif < 0) {
							dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						} else if (v.indexOf("ccw") !== -1 && dif > 0) {
							dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						}
					}
					result = d + dif;
				}
				if (result < min && result > -min) {
					result = 0;
				}
				return result;
			},

			_colorLookup = {aqua:[0,255,255],
				lime:[0,255,0],
				silver:[192,192,192],
				black:[0,0,0],
				maroon:[128,0,0],
				teal:[0,128,128],
				blue:[0,0,255],
				navy:[0,0,128],
				white:[255,255,255],
				fuchsia:[255,0,255],
				olive:[128,128,0],
				yellow:[255,255,0],
				orange:[255,165,0],
				gray:[128,128,128],
				purple:[128,0,128],
				green:[0,128,0],
				red:[255,0,0],
				pink:[255,192,203],
				cyan:[0,255,255],
				transparent:[255,255,255,0]},

			_hue = function(h, m1, m2) {
				h = (h < 0) ? h + 1 : (h > 1) ? h - 1 : h;
				return ((((h * 6 < 1) ? m1 + (m2 - m1) * h * 6 : (h < 0.5) ? m2 : (h * 3 < 2) ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * 255) + 0.5) | 0;
			},

			/**
			 * @private Parses a color (like #9F0, #FF9900, rgb(255,51,153) or hsl(108, 50%, 10%)) into an array with 3 elements for red, green, and blue or if toHSL parameter is true, it will populate the array with hue, saturation, and lightness values. If a relative value is found in an hsl() or hsla() string, it will preserve those relative prefixes and all the values in the array will be strings instead of numbers (in all other cases it will be populated with numbers).
			 * @param {(string|number)} v The value the should be parsed which could be a string like #9F0 or rgb(255,102,51) or rgba(255,0,0,0.5) or it could be a number like 0xFF00CC or even a named color like red, blue, purple, etc.
			 * @param {(boolean)} toHSL If true, an hsl() or hsla() value will be returned instead of rgb() or rgba()
			 * @return {Array.<number>} An array containing red, green, and blue (and optionally alpha) in that order, or if the toHSL parameter was true, the array will contain hue, saturation and lightness (and optionally alpha) in that order. Always numbers unless there's a relative prefix found in an hsl() or hsla() string and toHSL is true.
			 */
			_parseColor = CSSPlugin.parseColor = function(v, toHSL) {
				var a, r, g, b, h, s, l, max, min, d, wasHSL;
				if (!v) {
					a = _colorLookup.black;
				} else if (typeof(v) === "number") {
					a = [v >> 16, (v >> 8) & 255, v & 255];
				} else {
					if (v.charAt(v.length - 1) === ",") { //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
						v = v.substr(0, v.length - 1);
					}
					if (_colorLookup[v]) {
						a = _colorLookup[v];
					} else if (v.charAt(0) === "#") {
						if (v.length === 4) { //for shorthand like #9F0
							r = v.charAt(1);
							g = v.charAt(2);
							b = v.charAt(3);
							v = "#" + r + r + g + g + b + b;
						}
						v = parseInt(v.substr(1), 16);
						a = [v >> 16, (v >> 8) & 255, v & 255];
					} else if (v.substr(0, 3) === "hsl") {
						a = wasHSL = v.match(_numExp);
						if (!toHSL) {
							h = (Number(a[0]) % 360) / 360;
							s = Number(a[1]) / 100;
							l = Number(a[2]) / 100;
							g = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
							r = l * 2 - g;
							if (a.length > 3) {
								a[3] = Number(v[3]);
							}
							a[0] = _hue(h + 1 / 3, r, g);
							a[1] = _hue(h, r, g);
							a[2] = _hue(h - 1 / 3, r, g);
						} else if (v.indexOf("=") !== -1) { //if relative values are found, just return the raw strings with the relative prefixes in place.
							return v.match(_relNumExp);
						}
					} else {
						a = v.match(_numExp) || _colorLookup.transparent;
					}
					a[0] = Number(a[0]);
					a[1] = Number(a[1]);
					a[2] = Number(a[2]);
					if (a.length > 3) {
						a[3] = Number(a[3]);
					}
				}
				if (toHSL && !wasHSL) {
					r = a[0] / 255;
					g = a[1] / 255;
					b = a[2] / 255;
					max = Math.max(r, g, b);
					min = Math.min(r, g, b);
					l = (max + min) / 2;
					if (max === min) {
						h = s = 0;
					} else {
						d = max - min;
						s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
						h = (max === r) ? (g - b) / d + (g < b ? 6 : 0) : (max === g) ? (b - r) / d + 2 : (r - g) / d + 4;
						h *= 60;
					}
					a[0] = (h + 0.5) | 0;
					a[1] = (s * 100 + 0.5) | 0;
					a[2] = (l * 100 + 0.5) | 0;
				}
				return a;
			},
			_formatColors = function(s, toHSL) {
				var colors = s.match(_colorExp) || [],
					charIndex = 0,
					parsed = colors.length ? "" : s,
					i, color, temp;
				for (i = 0; i < colors.length; i++) {
					color = colors[i];
					temp = s.substr(charIndex, s.indexOf(color, charIndex)-charIndex);
					charIndex += temp.length + color.length;
					color = _parseColor(color, toHSL);
					if (color.length === 3) {
						color.push(1);
					}
					parsed += temp + (toHSL ? "hsla(" + color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : "rgba(" + color.join(",")) + ")";
				}
				return parsed + s.substr(charIndex);
			},
			_colorExp = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b"; //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.

		for (p in _colorLookup) {
			_colorExp += "|" + p + "\\b";
		}
		_colorExp = new RegExp(_colorExp+")", "gi");

		CSSPlugin.colorStringFilter = function(a) {
			var combined = a[0] + a[1],
				toHSL;
			if (_colorExp.test(combined)) {
				toHSL = (combined.indexOf("hsl(") !== -1 || combined.indexOf("hsla(") !== -1);
				a[0] = _formatColors(a[0], toHSL);
				a[1] = _formatColors(a[1], toHSL);
			}
			_colorExp.lastIndex = 0;
		};

		if (!TweenLite.defaultStringFilter) {
			TweenLite.defaultStringFilter = CSSPlugin.colorStringFilter;
		}

		/**
		 * @private Returns a formatter function that handles taking a string (or number in some cases) and returning a consistently formatted one in terms of delimiters, quantity of values, etc. For example, we may get boxShadow values defined as "0px red" or "0px 0px 10px rgb(255,0,0)" or "0px 0px 20px 20px #F00" and we need to ensure that what we get back is described with 4 numbers and a color. This allows us to feed it into the _parseComplex() method and split the values up appropriately. The neat thing about this _getFormatter() function is that the dflt defines a pattern as well as a default, so for example, _getFormatter("0px 0px 0px 0px #777", true) not only sets the default as 0px for all distances and #777 for the color, but also sets the pattern such that 4 numbers and a color will always get returned.
		 * @param {!string} dflt The default value and pattern to follow. So "0px 0px 0px 0px #777" will ensure that 4 numbers and a color will always get returned.
		 * @param {boolean=} clr If true, the values should be searched for color-related data. For example, boxShadow values typically contain a color whereas borderRadius don't.
		 * @param {boolean=} collapsible If true, the value is a top/left/right/bottom style one that acts like margin or padding, where if only one value is received, it's used for all 4; if 2 are received, the first is duplicated for 3rd (bottom) and the 2nd is duplicated for the 4th spot (left), etc.
		 * @return {Function} formatter function
		 */
		var _getFormatter = function(dflt, clr, collapsible, multi) {
				if (dflt == null) {
					return function(v) {return v;};
				}
				var dColor = clr ? (dflt.match(_colorExp) || [""])[0] : "",
					dVals = dflt.split(dColor).join("").match(_valuesExp) || [],
					pfx = dflt.substr(0, dflt.indexOf(dVals[0])),
					sfx = (dflt.charAt(dflt.length - 1) === ")") ? ")" : "",
					delim = (dflt.indexOf(" ") !== -1) ? " " : ",",
					numVals = dVals.length,
					dSfx = (numVals > 0) ? dVals[0].replace(_numExp, "") : "",
					formatter;
				if (!numVals) {
					return function(v) {return v;};
				}
				if (clr) {
					formatter = function(v) {
						var color, vals, i, a;
						if (typeof(v) === "number") {
							v += dSfx;
						} else if (multi && _commasOutsideParenExp.test(v)) {
							a = v.replace(_commasOutsideParenExp, "|").split("|");
							for (i = 0; i < a.length; i++) {
								a[i] = formatter(a[i]);
							}
							return a.join(",");
						}
						color = (v.match(_colorExp) || [dColor])[0];
						vals = v.split(color).join("").match(_valuesExp) || [];
						i = vals.length;
						if (numVals > i--) {
							while (++i < numVals) {
								vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
							}
						}
						return pfx + vals.join(delim) + delim + color + sfx + (v.indexOf("inset") !== -1 ? " inset" : "");
					};
					return formatter;

				}
				formatter = function(v) {
					var vals, a, i;
					if (typeof(v) === "number") {
						v += dSfx;
					} else if (multi && _commasOutsideParenExp.test(v)) {
						a = v.replace(_commasOutsideParenExp, "|").split("|");
						for (i = 0; i < a.length; i++) {
							a[i] = formatter(a[i]);
						}
						return a.join(",");
					}
					vals = v.match(_valuesExp) || [];
					i = vals.length;
					if (numVals > i--) {
						while (++i < numVals) {
							vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
						}
					}
					return pfx + vals.join(delim) + sfx;
				};
				return formatter;
			},

			/**
			 * @private returns a formatter function that's used for edge-related values like marginTop, marginLeft, paddingBottom, paddingRight, etc. Just pass a comma-delimited list of property names related to the edges.
			 * @param {!string} props a comma-delimited list of property names in order from top to left, like "marginTop,marginRight,marginBottom,marginLeft"
			 * @return {Function} a formatter function
			 */
			_getEdgeParser = function(props) {
				props = props.split(",");
				return function(t, e, p, cssp, pt, plugin, vars) {
					var a = (e + "").split(" "),
						i;
					vars = {};
					for (i = 0; i < 4; i++) {
						vars[props[i]] = a[i] = a[i] || a[(((i - 1) / 2) >> 0)];
					}
					return cssp.parse(t, vars, pt, plugin);
				};
			},

			// @private used when other plugins must tween values first, like BezierPlugin or ThrowPropsPlugin, etc. That plugin's setRatio() gets called first so that the values are updated, and then we loop through the MiniPropTweens which handle copying the values into their appropriate slots so that they can then be applied correctly in the main CSSPlugin setRatio() method. Remember, we typically create a proxy object that has a bunch of uniquely-named properties that we feed to the sub-plugin and it does its magic normally, and then we must interpret those values and apply them to the css because often numbers must get combined/concatenated, suffixes added, etc. to work with css, like boxShadow could have 4 values plus a color.
			_setPluginRatio = _internals._setPluginRatio = function(v) {
				this.plugin.setRatio(v);
				var d = this.data,
					proxy = d.proxy,
					mpt = d.firstMPT,
					min = 0.000001,
					val, pt, i, str, p;
				while (mpt) {
					val = proxy[mpt.v];
					if (mpt.r) {
						val = Math.round(val);
					} else if (val < min && val > -min) {
						val = 0;
					}
					mpt.t[mpt.p] = val;
					mpt = mpt._next;
				}
				if (d.autoRotate) {
					d.autoRotate.rotation = d.mod ? d.mod(proxy.rotation, this.t) : proxy.rotation; //special case for ModifyPlugin to hook into an auto-rotating bezier
				}
				//at the end, we must set the CSSPropTween's "e" (end) value dynamically here because that's what is used in the final setRatio() method. Same for "b" at the beginning.
				if (v === 1 || v === 0) {
					mpt = d.firstMPT;
					p = (v === 1) ? "e" : "b";
					while (mpt) {
						pt = mpt.t;
						if (!pt.type) {
							pt[p] = pt.s + pt.xs0;
						} else if (pt.type === 1) {
							str = pt.xs0 + pt.s + pt.xs1;
							for (i = 1; i < pt.l; i++) {
								str += pt["xn"+i] + pt["xs"+(i+1)];
							}
							pt[p] = str;
						}
						mpt = mpt._next;
					}
				}
			},

			/**
			 * @private @constructor Used by a few SpecialProps to hold important values for proxies. For example, _parseToProxy() creates a MiniPropTween instance for each property that must get tweened on the proxy, and we record the original property name as well as the unique one we create for the proxy, plus whether or not the value needs to be rounded plus the original value.
			 * @param {!Object} t target object whose property we're tweening (often a CSSPropTween)
			 * @param {!string} p property name
			 * @param {(number|string|object)} v value
			 * @param {MiniPropTween=} next next MiniPropTween in the linked list
			 * @param {boolean=} r if true, the tweened value should be rounded to the nearest integer
			 */
			MiniPropTween = function(t, p, v, next, r) {
				this.t = t;
				this.p = p;
				this.v = v;
				this.r = r;
				if (next) {
					next._prev = this;
					this._next = next;
				}
			},

			/**
			 * @private Most other plugins (like BezierPlugin and ThrowPropsPlugin and others) can only tween numeric values, but CSSPlugin must accommodate special values that have a bunch of extra data (like a suffix or strings between numeric values, etc.). For example, boxShadow has values like "10px 10px 20px 30px rgb(255,0,0)" which would utterly confuse other plugins. This method allows us to split that data apart and grab only the numeric data and attach it to uniquely-named properties of a generic proxy object ({}) so that we can feed that to virtually any plugin to have the numbers tweened. However, we must also keep track of which properties from the proxy go with which CSSPropTween values and instances. So we create a linked list of MiniPropTweens. Each one records a target (the original CSSPropTween), property (like "s" or "xn1" or "xn2") that we're tweening and the unique property name that was used for the proxy (like "boxShadow_xn1" and "boxShadow_xn2") and whether or not they need to be rounded. That way, in the _setPluginRatio() method we can simply copy the values over from the proxy to the CSSPropTween instance(s). Then, when the main CSSPlugin setRatio() method runs and applies the CSSPropTween values accordingly, they're updated nicely. So the external plugin tweens the numbers, _setPluginRatio() copies them over, and setRatio() acts normally, applying css-specific values to the element.
			 * This method returns an object that has the following properties:
			 *  - proxy: a generic object containing the starting values for all the properties that will be tweened by the external plugin.  This is what we feed to the external _onInitTween() as the target
			 *  - end: a generic object containing the ending values for all the properties that will be tweened by the external plugin. This is what we feed to the external plugin's _onInitTween() as the destination values
			 *  - firstMPT: the first MiniPropTween in the linked list
			 *  - pt: the first CSSPropTween in the linked list that was created when parsing. If shallow is true, this linked list will NOT attach to the one passed into the _parseToProxy() as the "pt" (4th) parameter.
			 * @param {!Object} t target object to be tweened
			 * @param {!(Object|string)} vars the object containing the information about the tweening values (typically the end/destination values) that should be parsed
			 * @param {!CSSPlugin} cssp The CSSPlugin instance
			 * @param {CSSPropTween=} pt the next CSSPropTween in the linked list
			 * @param {TweenPlugin=} plugin the external TweenPlugin instance that will be handling tweening the numeric values
			 * @param {boolean=} shallow if true, the resulting linked list from the parse will NOT be attached to the CSSPropTween that was passed in as the "pt" (4th) parameter.
			 * @return An object containing the following properties: proxy, end, firstMPT, and pt (see above for descriptions)
			 */
			_parseToProxy = _internals._parseToProxy = function(t, vars, cssp, pt, plugin, shallow) {
				var bpt = pt,
					start = {},
					end = {},
					transform = cssp._transform,
					oldForce = _forcePT,
					i, p, xp, mpt, firstPT;
				cssp._transform = null;
				_forcePT = vars;
				pt = firstPT = cssp.parse(t, vars, pt, plugin);
				_forcePT = oldForce;
				//break off from the linked list so the new ones are isolated.
				if (shallow) {
					cssp._transform = transform;
					if (bpt) {
						bpt._prev = null;
						if (bpt._prev) {
							bpt._prev._next = null;
						}
					}
				}
				while (pt && pt !== bpt) {
					if (pt.type <= 1) {
						p = pt.p;
						end[p] = pt.s + pt.c;
						start[p] = pt.s;
						if (!shallow) {
							mpt = new MiniPropTween(pt, "s", p, mpt, pt.r);
							pt.c = 0;
						}
						if (pt.type === 1) {
							i = pt.l;
							while (--i > 0) {
								xp = "xn" + i;
								p = pt.p + "_" + xp;
								end[p] = pt.data[xp];
								start[p] = pt[xp];
								if (!shallow) {
									mpt = new MiniPropTween(pt, xp, p, mpt, pt.rxp[xp]);
								}
							}
						}
					}
					pt = pt._next;
				}
				return {proxy:start, end:end, firstMPT:mpt, pt:firstPT};
			},



			/**
			 * @constructor Each property that is tweened has at least one CSSPropTween associated with it. These instances store important information like the target, property, starting value, amount of change, etc. They can also optionally have a number of "extra" strings and numeric values named xs1, xn1, xs2, xn2, xs3, xn3, etc. where "s" indicates string and "n" indicates number. These can be pieced together in a complex-value tween (type:1) that has alternating types of data like a string, number, string, number, etc. For example, boxShadow could be "5px 5px 8px rgb(102, 102, 51)". In that value, there are 6 numbers that may need to tween and then pieced back together into a string again with spaces, suffixes, etc. xs0 is special in that it stores the suffix for standard (type:0) tweens, -OR- the first string (prefix) in a complex-value (type:1) CSSPropTween -OR- it can be the non-tweening value in a type:-1 CSSPropTween. We do this to conserve memory.
			 * CSSPropTweens have the following optional properties as well (not defined through the constructor):
			 *  - l: Length in terms of the number of extra properties that the CSSPropTween has (default: 0). For example, for a boxShadow we may need to tween 5 numbers in which case l would be 5; Keep in mind that the start/end values for the first number that's tweened are always stored in the s and c properties to conserve memory. All additional values thereafter are stored in xn1, xn2, etc.
			 *  - xfirst: The first instance of any sub-CSSPropTweens that are tweening properties of this instance. For example, we may split up a boxShadow tween so that there's a main CSSPropTween of type:1 that has various xs* and xn* values associated with the h-shadow, v-shadow, blur, color, etc. Then we spawn a CSSPropTween for each of those that has a higher priority and runs BEFORE the main CSSPropTween so that the values are all set by the time it needs to re-assemble them. The xfirst gives us an easy way to identify the first one in that chain which typically ends at the main one (because they're all prepende to the linked list)
			 *  - plugin: The TweenPlugin instance that will handle the tweening of any complex values. For example, sometimes we don't want to use normal subtweens (like xfirst refers to) to tween the values - we might want ThrowPropsPlugin or BezierPlugin some other plugin to do the actual tweening, so we create a plugin instance and store a reference here. We need this reference so that if we get a request to round values or disable a tween, we can pass along that request.
			 *  - data: Arbitrary data that needs to be stored with the CSSPropTween. Typically if we're going to have a plugin handle the tweening of a complex-value tween, we create a generic object that stores the END values that we're tweening to and the CSSPropTween's xs1, xs2, etc. have the starting values. We store that object as data. That way, we can simply pass that object to the plugin and use the CSSPropTween as the target.
			 *  - setRatio: Only used for type:2 tweens that require custom functionality. In this case, we call the CSSPropTween's setRatio() method and pass the ratio each time the tween updates. This isn't quite as efficient as doing things directly in the CSSPlugin's setRatio() method, but it's very convenient and flexible.
			 * @param {!Object} t Target object whose property will be tweened. Often a DOM element, but not always. It could be anything.
			 * @param {string} p Property to tween (name). For example, to tween element.width, p would be "width".
			 * @param {number} s Starting numeric value
			 * @param {number} c Change in numeric value over the course of the entire tween. For example, if element.width starts at 5 and should end at 100, c would be 95.
			 * @param {CSSPropTween=} next The next CSSPropTween in the linked list. If one is defined, we will define its _prev as the new instance, and the new instance's _next will be pointed at it.
			 * @param {number=} type The type of CSSPropTween where -1 = a non-tweening value, 0 = a standard simple tween, 1 = a complex value (like one that has multiple numbers in a comma- or space-delimited string like border:"1px solid red"), and 2 = one that uses a custom setRatio function that does all of the work of applying the values on each update.
			 * @param {string=} n Name of the property that should be used for overwriting purposes which is typically the same as p but not always. For example, we may need to create a subtween for the 2nd part of a "clip:rect(...)" tween in which case "p" might be xs1 but "n" is still "clip"
			 * @param {boolean=} r If true, the value(s) should be rounded
			 * @param {number=} pr Priority in the linked list order. Higher priority CSSPropTweens will be updated before lower priority ones. The default priority is 0.
			 * @param {string=} b Beginning value. We store this to ensure that it is EXACTLY what it was when the tween began without any risk of interpretation issues.
			 * @param {string=} e Ending value. We store this to ensure that it is EXACTLY what the user defined at the end of the tween without any risk of interpretation issues.
			 */
			CSSPropTween = _internals.CSSPropTween = function(t, p, s, c, next, type, n, r, pr, b, e) {
				this.t = t; //target
				this.p = p; //property
				this.s = s; //starting value
				this.c = c; //change value
				this.n = n || p; //name that this CSSPropTween should be associated to (usually the same as p, but not always - n is what overwriting looks at)
				if (!(t instanceof CSSPropTween)) {
					_overwriteProps.push(this.n);
				}
				this.r = r; //round (boolean)
				this.type = type || 0; //0 = normal tween, -1 = non-tweening (in which case xs0 will be applied to the target's property, like tp.t[tp.p] = tp.xs0), 1 = complex-value SpecialProp, 2 = custom setRatio() that does all the work
				if (pr) {
					this.pr = pr;
					_hasPriority = true;
				}
				this.b = (b === undefined) ? s : b;
				this.e = (e === undefined) ? s + c : e;
				if (next) {
					this._next = next;
					next._prev = this;
				}
			},

			_addNonTweeningNumericPT = function(target, prop, start, end, next, overwriteProp) { //cleans up some code redundancies and helps minification. Just a fast way to add a NUMERIC non-tweening CSSPropTween
				var pt = new CSSPropTween(target, prop, start, end - start, next, -1, overwriteProp);
				pt.b = start;
				pt.e = pt.xs0 = end;
				return pt;
			},

			/**
			 * Takes a target, the beginning value and ending value (as strings) and parses them into a CSSPropTween (possibly with child CSSPropTweens) that accommodates multiple numbers, colors, comma-delimited values, etc. For example:
			 * sp.parseComplex(element, "boxShadow", "5px 10px 20px rgb(255,102,51)", "0px 0px 0px red", true, "0px 0px 0px rgb(0,0,0,0)", pt);
			 * It will walk through the beginning and ending values (which should be in the same format with the same number and type of values) and figure out which parts are numbers, what strings separate the numeric/tweenable values, and then create the CSSPropTweens accordingly. If a plugin is defined, no child CSSPropTweens will be created. Instead, the ending values will be stored in the "data" property of the returned CSSPropTween like: {s:-5, xn1:-10, xn2:-20, xn3:255, xn4:0, xn5:0} so that it can be fed to any other plugin and it'll be plain numeric tweens but the recomposition of the complex value will be handled inside CSSPlugin's setRatio().
			 * If a setRatio is defined, the type of the CSSPropTween will be set to 2 and recomposition of the values will be the responsibility of that method.
			 *
			 * @param {!Object} t Target whose property will be tweened
			 * @param {!string} p Property that will be tweened (its name, like "left" or "backgroundColor" or "boxShadow")
			 * @param {string} b Beginning value
			 * @param {string} e Ending value
			 * @param {boolean} clrs If true, the value could contain a color value like "rgb(255,0,0)" or "#F00" or "red". The default is false, so no colors will be recognized (a performance optimization)
			 * @param {(string|number|Object)} dflt The default beginning value that should be used if no valid beginning value is defined or if the number of values inside the complex beginning and ending values don't match
			 * @param {?CSSPropTween} pt CSSPropTween instance that is the current head of the linked list (we'll prepend to this).
			 * @param {number=} pr Priority in the linked list order. Higher priority properties will be updated before lower priority ones. The default priority is 0.
			 * @param {TweenPlugin=} plugin If a plugin should handle the tweening of extra properties, pass the plugin instance here. If one is defined, then NO subtweens will be created for any extra properties (the properties will be created - just not additional CSSPropTween instances to tween them) because the plugin is expected to do so. However, the end values WILL be populated in the "data" property, like {s:100, xn1:50, xn2:300}
			 * @param {function(number)=} setRatio If values should be set in a custom function instead of being pieced together in a type:1 (complex-value) CSSPropTween, define that custom function here.
			 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parseComplex() call.
			 */
			_parseComplex = CSSPlugin.parseComplex = function(t, p, b, e, clrs, dflt, pt, pr, plugin, setRatio) {
				//DEBUG: _log("parseComplex: "+p+", b: "+b+", e: "+e);
				b = b || dflt || "";
				if (typeof(e) === "function") {
					e = e(_index, _target);
				}
				pt = new CSSPropTween(t, p, 0, 0, pt, (setRatio ? 2 : 1), null, false, pr, b, e);
				e += ""; //ensures it's a string
				if (clrs && _colorExp.test(e + b)) { //if colors are found, normalize the formatting to rgba() or hsla().
					e = [b, e];
					CSSPlugin.colorStringFilter(e);
					b = e[0];
					e = e[1];
				}
				var ba = b.split(", ").join(",").split(" "), //beginning array
					ea = e.split(", ").join(",").split(" "), //ending array
					l = ba.length,
					autoRound = (_autoRound !== false),
					i, xi, ni, bv, ev, bnums, enums, bn, hasAlpha, temp, cv, str, useHSL;
				if (e.indexOf(",") !== -1 || b.indexOf(",") !== -1) {
					ba = ba.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
					ea = ea.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
					l = ba.length;
				}
				if (l !== ea.length) {
					//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
					ba = (dflt || "").split(" ");
					l = ba.length;
				}
				pt.plugin = plugin;
				pt.setRatio = setRatio;
				_colorExp.lastIndex = 0;
				for (i = 0; i < l; i++) {
					bv = ba[i];
					ev = ea[i];
					bn = parseFloat(bv);
					//if the value begins with a number (most common). It's fine if it has a suffix like px
					if (bn || bn === 0) {
						pt.appendXtra("", bn, _parseChange(ev, bn), ev.replace(_relNumExp, ""), (autoRound && ev.indexOf("px") !== -1), true);

					//if the value is a color
					} else if (clrs && _colorExp.test(bv)) {
						str = ev.indexOf(")") + 1;
						str = ")" + (str ? ev.substr(str) : ""); //if there's a comma or ) at the end, retain it.
						useHSL = (ev.indexOf("hsl") !== -1 && _supportsOpacity);
						bv = _parseColor(bv, useHSL);
						ev = _parseColor(ev, useHSL);
						hasAlpha = (bv.length + ev.length > 6);
						if (hasAlpha && !_supportsOpacity && ev[3] === 0) { //older versions of IE don't support rgba(), so if the destination alpha is 0, just use "transparent" for the end color
							pt["xs" + pt.l] += pt.l ? " transparent" : "transparent";
							pt.e = pt.e.split(ea[i]).join("transparent");
						} else {
							if (!_supportsOpacity) { //old versions of IE don't support rgba().
								hasAlpha = false;
							}
							if (useHSL) {
								pt.appendXtra((hasAlpha ? "hsla(" : "hsl("), bv[0], _parseChange(ev[0], bv[0]), ",", false, true)
									.appendXtra("", bv[1], _parseChange(ev[1], bv[1]), "%,", false)
									.appendXtra("", bv[2], _parseChange(ev[2], bv[2]), (hasAlpha ? "%," : "%" + str), false);
							} else {
								pt.appendXtra((hasAlpha ? "rgba(" : "rgb("), bv[0], ev[0] - bv[0], ",", true, true)
									.appendXtra("", bv[1], ev[1] - bv[1], ",", true)
									.appendXtra("", bv[2], ev[2] - bv[2], (hasAlpha ? "," : str), true);
							}

							if (hasAlpha) {
								bv = (bv.length < 4) ? 1 : bv[3];
								pt.appendXtra("", bv, ((ev.length < 4) ? 1 : ev[3]) - bv, str, false);
							}
						}
						_colorExp.lastIndex = 0; //otherwise the test() on the RegExp could move the lastIndex and taint future results.

					} else {
						bnums = bv.match(_numExp); //gets each group of numbers in the beginning value string and drops them into an array

						//if no number is found, treat it as a non-tweening value and just append the string to the current xs.
						if (!bnums) {
							pt["xs" + pt.l] += (pt.l || pt["xs" + pt.l]) ? " " + ev : ev;

						//loop through all the numbers that are found and construct the extra values on the pt.
						} else {
							enums = ev.match(_relNumExp); //get each group of numbers in the end value string and drop them into an array. We allow relative values too, like +=50 or -=.5
							if (!enums || enums.length !== bnums.length) {
								//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
								return pt;
							}
							ni = 0;
							for (xi = 0; xi < bnums.length; xi++) {
								cv = bnums[xi];
								temp = bv.indexOf(cv, ni);
								pt.appendXtra(bv.substr(ni, temp - ni), Number(cv), _parseChange(enums[xi], cv), "", (autoRound && bv.substr(temp + cv.length, 2) === "px"), (xi === 0));
								ni = temp + cv.length;
							}
							pt["xs" + pt.l] += bv.substr(ni);
						}
					}
				}
				//if there are relative values ("+=" or "-=" prefix), we need to adjust the ending value to eliminate the prefixes and combine the values properly.
				if (e.indexOf("=") !== -1) if (pt.data) {
					str = pt.xs0 + pt.data.s;
					for (i = 1; i < pt.l; i++) {
						str += pt["xs" + i] + pt.data["xn" + i];
					}
					pt.e = str + pt["xs" + i];
				}
				if (!pt.l) {
					pt.type = -1;
					pt.xs0 = pt.e;
				}
				return pt.xfirst || pt;
			},
			i = 9;


		p = CSSPropTween.prototype;
		p.l = p.pr = 0; //length (number of extra properties like xn1, xn2, xn3, etc.
		while (--i > 0) {
			p["xn" + i] = 0;
			p["xs" + i] = "";
		}
		p.xs0 = "";
		p._next = p._prev = p.xfirst = p.data = p.plugin = p.setRatio = p.rxp = null;


		/**
		 * Appends and extra tweening value to a CSSPropTween and automatically manages any prefix and suffix strings. The first extra value is stored in the s and c of the main CSSPropTween instance, but thereafter any extras are stored in the xn1, xn2, xn3, etc. The prefixes and suffixes are stored in the xs0, xs1, xs2, etc. properties. For example, if I walk through a clip value like "rect(10px, 5px, 0px, 20px)", the values would be stored like this:
		 * xs0:"rect(", s:10, xs1:"px, ", xn1:5, xs2:"px, ", xn2:0, xs3:"px, ", xn3:20, xn4:"px)"
		 * And they'd all get joined together when the CSSPlugin renders (in the setRatio() method).
		 * @param {string=} pfx Prefix (if any)
		 * @param {!number} s Starting value
		 * @param {!number} c Change in numeric value over the course of the entire tween. For example, if the start is 5 and the end is 100, the change would be 95.
		 * @param {string=} sfx Suffix (if any)
		 * @param {boolean=} r Round (if true).
		 * @param {boolean=} pad If true, this extra value should be separated by the previous one by a space. If there is no previous extra and pad is true, it will automatically drop the space.
		 * @return {CSSPropTween} returns itself so that multiple methods can be chained together.
		 */
		p.appendXtra = function(pfx, s, c, sfx, r, pad) {
			var pt = this,
				l = pt.l;
			pt["xs" + l] += (pad && (l || pt["xs" + l])) ? " " + pfx : pfx || "";
			if (!c) if (l !== 0 && !pt.plugin) { //typically we'll combine non-changing values right into the xs to optimize performance, but we don't combine them when there's a plugin that will be tweening the values because it may depend on the values being split apart, like for a bezier, if a value doesn't change between the first and second iteration but then it does on the 3rd, we'll run into trouble because there's no xn slot for that value!
				pt["xs" + l] += s + (sfx || "");
				return pt;
			}
			pt.l++;
			pt.type = pt.setRatio ? 2 : 1;
			pt["xs" + pt.l] = sfx || "";
			if (l > 0) {
				pt.data["xn" + l] = s + c;
				pt.rxp["xn" + l] = r; //round extra property (we need to tap into this in the _parseToProxy() method)
				pt["xn" + l] = s;
				if (!pt.plugin) {
					pt.xfirst = new CSSPropTween(pt, "xn" + l, s, c, pt.xfirst || pt, 0, pt.n, r, pt.pr);
					pt.xfirst.xs0 = 0; //just to ensure that the property stays numeric which helps modern browsers speed up processing. Remember, in the setRatio() method, we do pt.t[pt.p] = val + pt.xs0 so if pt.xs0 is "" (the default), it'll cast the end value as a string. When a property is a number sometimes and a string sometimes, it prevents the compiler from locking in the data type, slowing things down slightly.
				}
				return pt;
			}
			pt.data = {s:s + c};
			pt.rxp = {};
			pt.s = s;
			pt.c = c;
			pt.r = r;
			return pt;
		};

		/**
		 * @constructor A SpecialProp is basically a css property that needs to be treated in a non-standard way, like if it may contain a complex value like boxShadow:"5px 10px 15px rgb(255, 102, 51)" or if it is associated with another plugin like ThrowPropsPlugin or BezierPlugin. Every SpecialProp is associated with a particular property name like "boxShadow" or "throwProps" or "bezier" and it will intercept those values in the vars object that's passed to the CSSPlugin and handle them accordingly.
		 * @param {!string} p Property name (like "boxShadow" or "throwProps")
		 * @param {Object=} options An object containing any of the following configuration options:
		 *                      - defaultValue: the default value
		 *                      - parser: A function that should be called when the associated property name is found in the vars. This function should return a CSSPropTween instance and it should ensure that it is properly inserted into the linked list. It will receive 4 paramters: 1) The target, 2) The value defined in the vars, 3) The CSSPlugin instance (whose _firstPT should be used for the linked list), and 4) A computed style object if one was calculated (this is a speed optimization that allows retrieval of starting values quicker)
		 *                      - formatter: a function that formats any value received for this special property (for example, boxShadow could take "5px 5px red" and format it to "5px 5px 0px 0px red" so that both the beginning and ending values have a common order and quantity of values.)
		 *                      - prefix: if true, we'll determine whether or not this property requires a vendor prefix (like Webkit or Moz or ms or O)
		 *                      - color: set this to true if the value for this SpecialProp may contain color-related values like rgb(), rgba(), etc.
		 *                      - priority: priority in the linked list order. Higher priority SpecialProps will be updated before lower priority ones. The default priority is 0.
		 *                      - multi: if true, the formatter should accommodate a comma-delimited list of values, like boxShadow could have multiple boxShadows listed out.
		 *                      - collapsible: if true, the formatter should treat the value like it's a top/right/bottom/left value that could be collapsed, like "5px" would apply to all, "5px, 10px" would use 5px for top/bottom and 10px for right/left, etc.
		 *                      - keyword: a special keyword that can [optionally] be found inside the value (like "inset" for boxShadow). This allows us to validate beginning/ending values to make sure they match (if the keyword is found in one, it'll be added to the other for consistency by default).
		 */
		var SpecialProp = function(p, options) {
				options = options || {};
				this.p = options.prefix ? _checkPropPrefix(p) || p : p;
				_specialProps[p] = _specialProps[this.p] = this;
				this.format = options.formatter || _getFormatter(options.defaultValue, options.color, options.collapsible, options.multi);
				if (options.parser) {
					this.parse = options.parser;
				}
				this.clrs = options.color;
				this.multi = options.multi;
				this.keyword = options.keyword;
				this.dflt = options.defaultValue;
				this.pr = options.priority || 0;
			},

			//shortcut for creating a new SpecialProp that can accept multiple properties as a comma-delimited list (helps minification). dflt can be an array for multiple values (we don't do a comma-delimited list because the default value may contain commas, like rect(0px,0px,0px,0px)). We attach this method to the SpecialProp class/object instead of using a private _createSpecialProp() method so that we can tap into it externally if necessary, like from another plugin.
			_registerComplexSpecialProp = _internals._registerComplexSpecialProp = function(p, options, defaults) {
				if (typeof(options) !== "object") {
					options = {parser:defaults}; //to make backwards compatible with older versions of BezierPlugin and ThrowPropsPlugin
				}
				var a = p.split(","),
					d = options.defaultValue,
					i, temp;
				defaults = defaults || [d];
				for (i = 0; i < a.length; i++) {
					options.prefix = (i === 0 && options.prefix);
					options.defaultValue = defaults[i] || d;
					temp = new SpecialProp(a[i], options);
				}
			},

			//creates a placeholder special prop for a plugin so that the property gets caught the first time a tween of it is attempted, and at that time it makes the plugin register itself, thus taking over for all future tweens of that property. This allows us to not mandate that things load in a particular order and it also allows us to log() an error that informs the user when they attempt to tween an external plugin-related property without loading its .js file.
			_registerPluginProp = _internals._registerPluginProp = function(p) {
				if (!_specialProps[p]) {
					var pluginName = p.charAt(0).toUpperCase() + p.substr(1) + "Plugin";
					_registerComplexSpecialProp(p, {parser:function(t, e, p, cssp, pt, plugin, vars) {
						var pluginClass = _globals.com.greensock.plugins[pluginName];
						if (!pluginClass) {
							_log("Error: " + pluginName + " js file not loaded.");
							return pt;
						}
						pluginClass._cssRegister();
						return _specialProps[p].parse(t, e, p, cssp, pt, plugin, vars);
					}});
				}
			};


		p = SpecialProp.prototype;

		/**
		 * Alias for _parseComplex() that automatically plugs in certain values for this SpecialProp, like its property name, whether or not colors should be sensed, the default value, and priority. It also looks for any keyword that the SpecialProp defines (like "inset" for boxShadow) and ensures that the beginning and ending values have the same number of values for SpecialProps where multi is true (like boxShadow and textShadow can have a comma-delimited list)
		 * @param {!Object} t target element
		 * @param {(string|number|object)} b beginning value
		 * @param {(string|number|object)} e ending (destination) value
		 * @param {CSSPropTween=} pt next CSSPropTween in the linked list
		 * @param {TweenPlugin=} plugin If another plugin will be tweening the complex value, that TweenPlugin instance goes here.
		 * @param {function=} setRatio If a custom setRatio() method should be used to handle this complex value, that goes here.
		 * @return {CSSPropTween=} First CSSPropTween in the linked list
		 */
		p.parseComplex = function(t, b, e, pt, plugin, setRatio) {
			var kwd = this.keyword,
				i, ba, ea, l, bi, ei;
			//if this SpecialProp's value can contain a comma-delimited list of values (like boxShadow or textShadow), we must parse them in a special way, and look for a keyword (like "inset" for boxShadow) and ensure that the beginning and ending BOTH have it if the end defines it as such. We also must ensure that there are an equal number of values specified (we can't tween 1 boxShadow to 3 for example)
			if (this.multi) if (_commasOutsideParenExp.test(e) || _commasOutsideParenExp.test(b)) {
				ba = b.replace(_commasOutsideParenExp, "|").split("|");
				ea = e.replace(_commasOutsideParenExp, "|").split("|");
			} else if (kwd) {
				ba = [b];
				ea = [e];
			}
			if (ea) {
				l = (ea.length > ba.length) ? ea.length : ba.length;
				for (i = 0; i < l; i++) {
					b = ba[i] = ba[i] || this.dflt;
					e = ea[i] = ea[i] || this.dflt;
					if (kwd) {
						bi = b.indexOf(kwd);
						ei = e.indexOf(kwd);
						if (bi !== ei) {
							if (ei === -1) { //if the keyword isn't in the end value, remove it from the beginning one.
								ba[i] = ba[i].split(kwd).join("");
							} else if (bi === -1) { //if the keyword isn't in the beginning, add it.
								ba[i] += " " + kwd;
							}
						}
					}
				}
				b = ba.join(", ");
				e = ea.join(", ");
			}
			return _parseComplex(t, this.p, b, e, this.clrs, this.dflt, pt, this.pr, plugin, setRatio);
		};

		/**
		 * Accepts a target and end value and spits back a CSSPropTween that has been inserted into the CSSPlugin's linked list and conforms with all the conventions we use internally, like type:-1, 0, 1, or 2, setting up any extra property tweens, priority, etc. For example, if we have a boxShadow SpecialProp and call:
		 * this._firstPT = sp.parse(element, "5px 10px 20px rgb(2550,102,51)", "boxShadow", this);
		 * It should figure out the starting value of the element's boxShadow, compare it to the provided end value and create all the necessary CSSPropTweens of the appropriate types to tween the boxShadow. The CSSPropTween that gets spit back should already be inserted into the linked list (the 4th parameter is the current head, so prepend to that).
		 * @param {!Object} t Target object whose property is being tweened
		 * @param {Object} e End value as provided in the vars object (typically a string, but not always - like a throwProps would be an object).
		 * @param {!string} p Property name
		 * @param {!CSSPlugin} cssp The CSSPlugin instance that should be associated with this tween.
		 * @param {?CSSPropTween} pt The CSSPropTween that is the current head of the linked list (we'll prepend to it)
		 * @param {TweenPlugin=} plugin If a plugin will be used to tween the parsed value, this is the plugin instance.
		 * @param {Object=} vars Original vars object that contains the data for parsing.
		 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parse() call.
		 */
		p.parse = function(t, e, p, cssp, pt, plugin, vars) {
			return this.parseComplex(t.style, this.format(_getStyle(t, this.p, _cs, false, this.dflt)), this.format(e), pt, plugin);
		};

		/**
		 * Registers a special property that should be intercepted from any "css" objects defined in tweens. This allows you to handle them however you want without CSSPlugin doing it for you. The 2nd parameter should be a function that accepts 3 parameters:
		 *  1) Target object whose property should be tweened (typically a DOM element)
		 *  2) The end/destination value (could be a string, number, object, or whatever you want)
		 *  3) The tween instance (you probably don't need to worry about this, but it can be useful for looking up information like the duration)
		 *
		 * Then, your function should return a function which will be called each time the tween gets rendered, passing a numeric "ratio" parameter to your function that indicates the change factor (usually between 0 and 1). For example:
		 *
		 * CSSPlugin.registerSpecialProp("myCustomProp", function(target, value, tween) {
		 *      var start = target.style.width;
		 *      return function(ratio) {
		 *              target.style.width = (start + value * ratio) + "px";
		 *              console.log("set width to " + target.style.width);
		 *          }
		 * }, 0);
		 *
		 * Then, when I do this tween, it will trigger my special property:
		 *
		 * TweenLite.to(element, 1, {css:{myCustomProp:100}});
		 *
		 * In the example, of course, we're just changing the width, but you can do anything you want.
		 *
		 * @param {!string} name Property name (or comma-delimited list of property names) that should be intercepted and handled by your function. For example, if I define "myCustomProp", then it would handle that portion of the following tween: TweenLite.to(element, 1, {css:{myCustomProp:100}})
		 * @param {!function(Object, Object, Object, string):function(number)} onInitTween The function that will be called when a tween of this special property is performed. The function will receive 4 parameters: 1) Target object that should be tweened, 2) Value that was passed to the tween, 3) The tween instance itself (rarely used), and 4) The property name that's being tweened. Your function should return a function that should be called on every update of the tween. That function will receive a single parameter that is a "change factor" value (typically between 0 and 1) indicating the amount of change as a ratio. You can use this to determine how to set the values appropriately in your function.
		 * @param {number=} priority Priority that helps the engine determine the order in which to set the properties (default: 0). Higher priority properties will be updated before lower priority ones.
		 */
		CSSPlugin.registerSpecialProp = function(name, onInitTween, priority) {
			_registerComplexSpecialProp(name, {parser:function(t, e, p, cssp, pt, plugin, vars) {
				var rv = new CSSPropTween(t, p, 0, 0, pt, 2, p, false, priority);
				rv.plugin = plugin;
				rv.setRatio = onInitTween(t, e, cssp._tween, p);
				return rv;
			}, priority:priority});
		};






		//transform-related methods and properties
		CSSPlugin.useSVGTransformAttr = _isSafari || _isFirefox; //Safari and Firefox both have some rendering bugs when applying CSS transforms to SVG elements, so default to using the "transform" attribute instead (users can override this).
		var _transformProps = ("scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent").split(","),
			_transformProp = _checkPropPrefix("transform"), //the Javascript (camelCase) transform property, like msTransform, WebkitTransform, MozTransform, or OTransform.
			_transformPropCSS = _prefixCSS + "transform",
			_transformOriginProp = _checkPropPrefix("transformOrigin"),
			_supports3D = (_checkPropPrefix("perspective") !== null),
			Transform = _internals.Transform = function() {
				this.perspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0;
				this.force3D = (CSSPlugin.defaultForce3D === false || !_supports3D) ? false : CSSPlugin.defaultForce3D || "auto";
			},
			_SVGElement = window.SVGElement,
			_useSVGTransformAttr,
			//Some browsers (like Firefox and IE) don't honor transform-origin properly in SVG elements, so we need to manually adjust the matrix accordingly. We feature detect here rather than always doing the conversion for certain browsers because they may fix the problem at some point in the future.

			_createSVG = function(type, container, attributes) {
				var element = _doc.createElementNS("http://www.w3.org/2000/svg", type),
					reg = /([a-z])([A-Z])/g,
					p;
				for (p in attributes) {
					element.setAttributeNS(null, p.replace(reg, "$1-$2").toLowerCase(), attributes[p]);
				}
				container.appendChild(element);
				return element;
			},
			_docElement = _doc.documentElement,
			_forceSVGTransformAttr = (function() {
				//IE and Android stock don't support CSS transforms on SVG elements, so we must write them to the "transform" attribute. We populate this variable in the _parseTransform() method, and only if/when we come across an SVG element
				var force = _ieVers || (/Android/i.test(_agent) && !window.chrome),
					svg, rect, width;
				if (_doc.createElementNS && !force) { //IE8 and earlier doesn't support SVG anyway
					svg = _createSVG("svg", _docElement);
					rect = _createSVG("rect", svg, {width:100, height:50, x:100});
					width = rect.getBoundingClientRect().width;
					rect.style[_transformOriginProp] = "50% 50%";
					rect.style[_transformProp] = "scaleX(0.5)";
					force = (width === rect.getBoundingClientRect().width && !(_isFirefox && _supports3D)); //note: Firefox fails the test even though it does support CSS transforms in 3D. Since we can't push 3D stuff into the transform attribute, we force Firefox to pass the test here (as long as it does truly support 3D).
					_docElement.removeChild(svg);
				}
				return force;
			})(),
			_parseSVGOrigin = function(e, local, decoratee, absolute, smoothOrigin, skipRecord) {
				var tm = e._gsTransform,
					m = _getMatrix(e, true),
					v, x, y, xOrigin, yOrigin, a, b, c, d, tx, ty, determinant, xOriginOld, yOriginOld;
				if (tm) {
					xOriginOld = tm.xOrigin; //record the original values before we alter them.
					yOriginOld = tm.yOrigin;
				}
				if (!absolute || (v = absolute.split(" ")).length < 2) {
					b = e.getBBox();
					local = _parsePosition(local).split(" ");
					v = [(local[0].indexOf("%") !== -1 ? parseFloat(local[0]) / 100 * b.width : parseFloat(local[0])) + b.x,
						 (local[1].indexOf("%") !== -1 ? parseFloat(local[1]) / 100 * b.height : parseFloat(local[1])) + b.y];
				}
				decoratee.xOrigin = xOrigin = parseFloat(v[0]);
				decoratee.yOrigin = yOrigin = parseFloat(v[1]);
				if (absolute && m !== _identity2DMatrix) { //if svgOrigin is being set, we must invert the matrix and determine where the absolute point is, factoring in the current transforms. Otherwise, the svgOrigin would be based on the element's non-transformed position on the canvas.
					a = m[0];
					b = m[1];
					c = m[2];
					d = m[3];
					tx = m[4];
					ty = m[5];
					determinant = (a * d - b * c);
					x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + ((c * ty - d * tx) / determinant);
					y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - ((a * ty - b * tx) / determinant);
					xOrigin = decoratee.xOrigin = v[0] = x;
					yOrigin = decoratee.yOrigin = v[1] = y;
				}
				if (tm) { //avoid jump when transformOrigin is changed - adjust the x/y values accordingly
					if (skipRecord) {
						decoratee.xOffset = tm.xOffset;
						decoratee.yOffset = tm.yOffset;
						tm = decoratee;
					}
					if (smoothOrigin || (smoothOrigin !== false && CSSPlugin.defaultSmoothOrigin !== false)) {
						x = xOrigin - xOriginOld;
						y = yOrigin - yOriginOld;
						//originally, we simply adjusted the x and y values, but that would cause problems if, for example, you created a rotational tween part-way through an x/y tween. Managing the offset in a separate variable gives us ultimate flexibility.
						//tm.x -= x - (x * m[0] + y * m[2]);
						//tm.y -= y - (x * m[1] + y * m[3]);
						tm.xOffset += (x * m[0] + y * m[2]) - x;
						tm.yOffset += (x * m[1] + y * m[3]) - y;
					} else {
						tm.xOffset = tm.yOffset = 0;
					}
				}
				if (!skipRecord) {
					e.setAttribute("data-svg-origin", v.join(" "));
				}
			},
			_canGetBBox = function(e) {
				try {
					return e.getBBox(); //Firefox throws errors if you try calling getBBox() on an SVG element that's not rendered (like in a <symbol> or <defs>). https://bugzilla.mozilla.org/show_bug.cgi?id=612118
				} catch (e) {}
			},
			_isSVG = function(e) { //reports if the element is an SVG on which getBBox() actually works
				return !!(_SVGElement && e.getBBox && e.getCTM && _canGetBBox(e) && (!e.parentNode || (e.parentNode.getBBox && e.parentNode.getCTM)));
			},
			_identity2DMatrix = [1,0,0,1,0,0],
			_getMatrix = function(e, force2D) {
				var tm = e._gsTransform || new Transform(),
					rnd = 100000,
					style = e.style,
					isDefault, s, m, n, dec, none;
				if (_transformProp) {
					s = _getStyle(e, _transformPropCSS, null, true);
				} else if (e.currentStyle) {
					//for older versions of IE, we need to interpret the filter portion that is in the format: progid:DXImageTransform.Microsoft.Matrix(M11=6.123233995736766e-17, M12=-1, M21=1, M22=6.123233995736766e-17, sizingMethod='auto expand') Notice that we need to swap b and c compared to a normal matrix.
					s = e.currentStyle.filter.match(_ieGetMatrixExp);
					s = (s && s.length === 4) ? [s[0].substr(4), Number(s[2].substr(4)), Number(s[1].substr(4)), s[3].substr(4), (tm.x || 0), (tm.y || 0)].join(",") : "";
				}
				isDefault = (!s || s === "none" || s === "matrix(1, 0, 0, 1, 0, 0)");
				if (isDefault && _transformProp && ((none = (_getComputedStyle(e).display === "none")) || !e.parentNode)) {
					if (none) { //browsers don't report transforms accurately unless the element is in the DOM and has a display value that's not "none".
						n = style.display;
						style.display = "block";
					}
					if (!e.parentNode) {
						dec = 1; //flag
						_docElement.appendChild(e);
					}
					s = _getStyle(e, _transformPropCSS, null, true);
					isDefault = (!s || s === "none" || s === "matrix(1, 0, 0, 1, 0, 0)");
					if (n) {
						style.display = n;
					} else if (none) {
						_removeProp(style, "display");
					}
					if (dec) {
						_docElement.removeChild(e);
					}
				}
				if (tm.svg || (e.getBBox && _isSVG(e))) {
					if (isDefault && (style[_transformProp] + "").indexOf("matrix") !== -1) { //some browsers (like Chrome 40) don't correctly report transforms that are applied inline on an SVG element (they don't get included in the computed style), so we double-check here and accept matrix values
						s = style[_transformProp];
						isDefault = 0;
					}
					m = e.getAttribute("transform");
					if (isDefault && m) {
						if (m.indexOf("matrix") !== -1) { //just in case there's a "transform" value specified as an attribute instead of CSS style. Accept either a matrix() or simple translate() value though.
							s = m;
							isDefault = 0;
						} else if (m.indexOf("translate") !== -1) {
							s = "matrix(1,0,0,1," + m.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")";
							isDefault = 0;
						}
					}
				}
				if (isDefault) {
					return _identity2DMatrix;
				}
				//split the matrix values out into an array (m for matrix)
				m = (s || "").match(_numExp) || [];
				i = m.length;
				while (--i > -1) {
					n = Number(m[i]);
					m[i] = (dec = n - (n |= 0)) ? ((dec * rnd + (dec < 0 ? -0.5 : 0.5)) | 0) / rnd + n : n; //convert strings to Numbers and round to 5 decimal places to avoid issues with tiny numbers. Roughly 20x faster than Number.toFixed(). We also must make sure to round before dividing so that values like 0.9999999999 become 1 to avoid glitches in browser rendering and interpretation of flipped/rotated 3D matrices. And don't just multiply the number by rnd, floor it, and then divide by rnd because the bitwise operations max out at a 32-bit signed integer, thus it could get clipped at a relatively low value (like 22,000.00000 for example).
				}
				return (force2D && m.length > 6) ? [m[0], m[1], m[4], m[5], m[12], m[13]] : m;
			},

			/**
			 * Parses the transform values for an element, returning an object with x, y, z, scaleX, scaleY, scaleZ, rotation, rotationX, rotationY, skewX, and skewY properties. Note: by default (for performance reasons), all skewing is combined into skewX and rotation but skewY still has a place in the transform object so that we can record how much of the skew is attributed to skewX vs skewY. Remember, a skewY of 10 looks the same as a rotation of 10 and skewX of -10.
			 * @param {!Object} t target element
			 * @param {Object=} cs computed style object (optional)
			 * @param {boolean=} rec if true, the transform values will be recorded to the target element's _gsTransform object, like target._gsTransform = {x:0, y:0, z:0, scaleX:1...}
			 * @param {boolean=} parse if true, we'll ignore any _gsTransform values that already exist on the element, and force a reparsing of the css (calculated style)
			 * @return {object} object containing all of the transform properties/values like {x:0, y:0, z:0, scaleX:1...}
			 */
			_getTransform = _internals.getTransform = function(t, cs, rec, parse) {
				if (t._gsTransform && rec && !parse) {
					return t._gsTransform; //if the element already has a _gsTransform, use that. Note: some browsers don't accurately return the calculated style for the transform (particularly for SVG), so it's almost always safest to just use the values we've already applied rather than re-parsing things.
				}
				var tm = rec ? t._gsTransform || new Transform() : new Transform(),
					invX = (tm.scaleX < 0), //in order to interpret things properly, we need to know if the user applied a negative scaleX previously so that we can adjust the rotation and skewX accordingly. Otherwise, if we always interpret a flipped matrix as affecting scaleY and the user only wants to tween the scaleX on multiple sequential tweens, it would keep the negative scaleY without that being the user's intent.
					min = 0.00002,
					rnd = 100000,
					zOrigin = _supports3D ? parseFloat(_getStyle(t, _transformOriginProp, cs, false, "0 0 0").split(" ")[2]) || tm.zOrigin  || 0 : 0,
					defaultTransformPerspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0,
					m, i, scaleX, scaleY, rotation, skewX;

				tm.svg = !!(t.getBBox && _isSVG(t));
				if (tm.svg) {
					_parseSVGOrigin(t, _getStyle(t, _transformOriginProp, cs, false, "50% 50%") + "", tm, t.getAttribute("data-svg-origin"));
					_useSVGTransformAttr = CSSPlugin.useSVGTransformAttr || _forceSVGTransformAttr;
				}
				m = _getMatrix(t);
				if (m !== _identity2DMatrix) {

					if (m.length === 16) {
						//we'll only look at these position-related 6 variables first because if x/y/z all match, it's relatively safe to assume we don't need to re-parse everything which risks losing important rotational information (like rotationX:180 plus rotationY:180 would look the same as rotation:180 - there's no way to know for sure which direction was taken based solely on the matrix3d() values)
						var a11 = m[0], a21 = m[1], a31 = m[2], a41 = m[3],
							a12 = m[4], a22 = m[5], a32 = m[6], a42 = m[7],
							a13 = m[8], a23 = m[9], a33 = m[10],
							a14 = m[12], a24 = m[13], a34 = m[14],
							a43 = m[11],
							angle = Math.atan2(a32, a33),
							t1, t2, t3, t4, cos, sin;

						//we manually compensate for non-zero z component of transformOrigin to work around bugs in Safari
						if (tm.zOrigin) {
							a34 = -tm.zOrigin;
							a14 = a13*a34-m[12];
							a24 = a23*a34-m[13];
							a34 = a33*a34+tm.zOrigin-m[14];
						}
						tm.rotationX = angle * _RAD2DEG;
						//rotationX
						if (angle) {
							cos = Math.cos(-angle);
							sin = Math.sin(-angle);
							t1 = a12*cos+a13*sin;
							t2 = a22*cos+a23*sin;
							t3 = a32*cos+a33*sin;
							a13 = a12*-sin+a13*cos;
							a23 = a22*-sin+a23*cos;
							a33 = a32*-sin+a33*cos;
							a43 = a42*-sin+a43*cos;
							a12 = t1;
							a22 = t2;
							a32 = t3;
						}
						//rotationY
						angle = Math.atan2(-a31, a33);
						tm.rotationY = angle * _RAD2DEG;
						if (angle) {
							cos = Math.cos(-angle);
							sin = Math.sin(-angle);
							t1 = a11*cos-a13*sin;
							t2 = a21*cos-a23*sin;
							t3 = a31*cos-a33*sin;
							a23 = a21*sin+a23*cos;
							a33 = a31*sin+a33*cos;
							a43 = a41*sin+a43*cos;
							a11 = t1;
							a21 = t2;
							a31 = t3;
						}
						//rotationZ
						angle = Math.atan2(a21, a11);
						tm.rotation = angle * _RAD2DEG;
						if (angle) {
							cos = Math.cos(-angle);
							sin = Math.sin(-angle);
							a11 = a11*cos+a12*sin;
							t2 = a21*cos+a22*sin;
							a22 = a21*-sin+a22*cos;
							a32 = a31*-sin+a32*cos;
							a21 = t2;
						}

						if (tm.rotationX && Math.abs(tm.rotationX) + Math.abs(tm.rotation) > 359.9) { //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
							tm.rotationX = tm.rotation = 0;
							tm.rotationY = 180 - tm.rotationY;
						}

						tm.scaleX = ((Math.sqrt(a11 * a11 + a21 * a21) * rnd + 0.5) | 0) / rnd;
						tm.scaleY = ((Math.sqrt(a22 * a22 + a23 * a23) * rnd + 0.5) | 0) / rnd;
						tm.scaleZ = ((Math.sqrt(a32 * a32 + a33 * a33) * rnd + 0.5) | 0) / rnd;
						if (tm.rotationX || tm.rotationY) {
							tm.skewX = 0;
						} else {
							tm.skewX = (a12 || a22) ? Math.atan2(a12, a22) * _RAD2DEG + tm.rotation : tm.skewX || 0;
							if (Math.abs(tm.skewX) > 90 && Math.abs(tm.skewX) < 270) {
								if (invX) {
									tm.scaleX *= -1;
									tm.skewX += (tm.rotation <= 0) ? 180 : -180;
									tm.rotation += (tm.rotation <= 0) ? 180 : -180;
								} else {
									tm.scaleY *= -1;
									tm.skewX += (tm.skewX <= 0) ? 180 : -180;
								}
							}
						}
						tm.perspective = a43 ? 1 / ((a43 < 0) ? -a43 : a43) : 0;
						tm.x = a14;
						tm.y = a24;
						tm.z = a34;
						if (tm.svg) {
							tm.x -= tm.xOrigin - (tm.xOrigin * a11 - tm.yOrigin * a12);
							tm.y -= tm.yOrigin - (tm.yOrigin * a21 - tm.xOrigin * a22);
						}

					} else if ((!_supports3D || parse || !m.length || tm.x !== m[4] || tm.y !== m[5] || (!tm.rotationX && !tm.rotationY))) { //sometimes a 6-element matrix is returned even when we performed 3D transforms, like if rotationX and rotationY are 180. In cases like this, we still need to honor the 3D transforms. If we just rely on the 2D info, it could affect how the data is interpreted, like scaleY might get set to -1 or rotation could get offset by 180 degrees. For example, do a TweenLite.to(element, 1, {css:{rotationX:180, rotationY:180}}) and then later, TweenLite.to(element, 1, {css:{rotationX:0}}) and without this conditional logic in place, it'd jump to a state of being unrotated when the 2nd tween starts. Then again, we need to honor the fact that the user COULD alter the transforms outside of CSSPlugin, like by manually applying new css, so we try to sense that by looking at x and y because if those changed, we know the changes were made outside CSSPlugin and we force a reinterpretation of the matrix values. Also, in Webkit browsers, if the element's "display" is "none", its calculated style value will always return empty, so if we've already recorded the values in the _gsTransform object, we'll just rely on those.
						var k = (m.length >= 6),
							a = k ? m[0] : 1,
							b = m[1] || 0,
							c = m[2] || 0,
							d = k ? m[3] : 1;
						tm.x = m[4] || 0;
						tm.y = m[5] || 0;
						scaleX = Math.sqrt(a * a + b * b);
						scaleY = Math.sqrt(d * d + c * c);
						rotation = (a || b) ? Math.atan2(b, a) * _RAD2DEG : tm.rotation || 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).
						skewX = (c || d) ? Math.atan2(c, d) * _RAD2DEG + rotation : tm.skewX || 0;
						if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
							if (invX) {
								scaleX *= -1;
								skewX += (rotation <= 0) ? 180 : -180;
								rotation += (rotation <= 0) ? 180 : -180;
							} else {
								scaleY *= -1;
								skewX += (skewX <= 0) ? 180 : -180;
							}
						}
						tm.scaleX = scaleX;
						tm.scaleY = scaleY;
						tm.rotation = rotation;
						tm.skewX = skewX;
						if (_supports3D) {
							tm.rotationX = tm.rotationY = tm.z = 0;
							tm.perspective = defaultTransformPerspective;
							tm.scaleZ = 1;
						}
						if (tm.svg) {
							tm.x -= tm.xOrigin - (tm.xOrigin * a + tm.yOrigin * c);
							tm.y -= tm.yOrigin - (tm.xOrigin * b + tm.yOrigin * d);
						}
					}
					tm.zOrigin = zOrigin;
					//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 0 in these cases. The conditional logic here is faster than calling Math.abs(). Also, browsers tend to render a SLIGHTLY rotated object in a fuzzy way, so we need to snap to exactly 0 when appropriate.
					for (i in tm) {
						if (tm[i] < min) if (tm[i] > -min) {
							tm[i] = 0;
						}
					}
				}
				//DEBUG: _log("parsed rotation of " + t.getAttribute("id")+": "+(tm.rotationX)+", "+(tm.rotationY)+", "+(tm.rotation)+", scale: "+tm.scaleX+", "+tm.scaleY+", "+tm.scaleZ+", position: "+tm.x+", "+tm.y+", "+tm.z+", perspective: "+tm.perspective+ ", origin: "+ tm.xOrigin+ ","+ tm.yOrigin);
				if (rec) {
					t._gsTransform = tm; //record to the object's _gsTransform which we use so that tweens can control individual properties independently (we need all the properties to accurately recompose the matrix in the setRatio() method)
					if (tm.svg) { //if we're supposed to apply transforms to the SVG element's "transform" attribute, make sure there aren't any CSS transforms applied or they'll override the attribute ones. Also clear the transform attribute if we're using CSS, just to be clean.
						if (_useSVGTransformAttr && t.style[_transformProp]) {
							TweenLite.delayedCall(0.001, function(){ //if we apply this right away (before anything has rendered), we risk there being no transforms for a brief moment and it also interferes with adjusting the transformOrigin in a tween with immediateRender:true (it'd try reading the matrix and it wouldn't have the appropriate data in place because we just removed it).
								_removeProp(t.style, _transformProp);
							});
						} else if (!_useSVGTransformAttr && t.getAttribute("transform")) {
							TweenLite.delayedCall(0.001, function(){
								t.removeAttribute("transform");
							});
						}
					}
				}
				return tm;
			},

			//for setting 2D transforms in IE6, IE7, and IE8 (must use a "filter" to emulate the behavior of modern day browser transforms)
			_setIETransformRatio = function(v) {
				var t = this.data, //refers to the element's _gsTransform object
					ang = -t.rotation * _DEG2RAD,
					skew = ang + t.skewX * _DEG2RAD,
					rnd = 100000,
					a = ((Math.cos(ang) * t.scaleX * rnd) | 0) / rnd,
					b = ((Math.sin(ang) * t.scaleX * rnd) | 0) / rnd,
					c = ((Math.sin(skew) * -t.scaleY * rnd) | 0) / rnd,
					d = ((Math.cos(skew) * t.scaleY * rnd) | 0) / rnd,
					style = this.t.style,
					cs = this.t.currentStyle,
					filters, val;
				if (!cs) {
					return;
				}
				val = b; //just for swapping the variables an inverting them (reused "val" to avoid creating another variable in memory). IE's filter matrix uses a non-standard matrix configuration (angle goes the opposite way, and b and c are reversed and inverted)
				b = -c;
				c = -val;
				filters = cs.filter;
				style.filter = ""; //remove filters so that we can accurately measure offsetWidth/offsetHeight
				var w = this.t.offsetWidth,
					h = this.t.offsetHeight,
					clip = (cs.position !== "absolute"),
					m = "progid:DXImageTransform.Microsoft.Matrix(M11=" + a + ", M12=" + b + ", M21=" + c + ", M22=" + d,
					ox = t.x + (w * t.xPercent / 100),
					oy = t.y + (h * t.yPercent / 100),
					dx, dy;

				//if transformOrigin is being used, adjust the offset x and y
				if (t.ox != null) {
					dx = ((t.oxp) ? w * t.ox * 0.01 : t.ox) - w / 2;
					dy = ((t.oyp) ? h * t.oy * 0.01 : t.oy) - h / 2;
					ox += dx - (dx * a + dy * b);
					oy += dy - (dx * c + dy * d);
				}

				if (!clip) {
					m += ", sizingMethod='auto expand')";
				} else {
					dx = (w / 2);
					dy = (h / 2);
					//translate to ensure that transformations occur around the correct origin (default is center).
					m += ", Dx=" + (dx - (dx * a + dy * b) + ox) + ", Dy=" + (dy - (dx * c + dy * d) + oy) + ")";
				}
				if (filters.indexOf("DXImageTransform.Microsoft.Matrix(") !== -1) {
					style.filter = filters.replace(_ieSetMatrixExp, m);
				} else {
					style.filter = m + " " + filters; //we must always put the transform/matrix FIRST (before alpha(opacity=xx)) to avoid an IE bug that slices part of the object when rotation is applied with alpha.
				}

				//at the end or beginning of the tween, if the matrix is normal (1, 0, 0, 1) and opacity is 100 (or doesn't exist), remove the filter to improve browser performance.
				if (v === 0 || v === 1) if (a === 1) if (b === 0) if (c === 0) if (d === 1) if (!clip || m.indexOf("Dx=0, Dy=0") !== -1) if (!_opacityExp.test(filters) || parseFloat(RegExp.$1) === 100) if (filters.indexOf("gradient(" && filters.indexOf("Alpha")) === -1) {
					style.removeAttribute("filter");
				}

				//we must set the margins AFTER applying the filter in order to avoid some bugs in IE8 that could (in rare scenarios) cause them to be ignored intermittently (vibration).
				if (!clip) {
					var mult = (_ieVers < 8) ? 1 : -1, //in Internet Explorer 7 and before, the box model is broken, causing the browser to treat the width/height of the actual rotated filtered image as the width/height of the box itself, but Microsoft corrected that in IE8. We must use a negative offset in IE8 on the right/bottom
						marg, prop, dif;
					dx = t.ieOffsetX || 0;
					dy = t.ieOffsetY || 0;
					t.ieOffsetX = Math.round((w - ((a < 0 ? -a : a) * w + (b < 0 ? -b : b) * h)) / 2 + ox);
					t.ieOffsetY = Math.round((h - ((d < 0 ? -d : d) * h + (c < 0 ? -c : c) * w)) / 2 + oy);
					for (i = 0; i < 4; i++) {
						prop = _margins[i];
						marg = cs[prop];
						//we need to get the current margin in case it is being tweened separately (we want to respect that tween's changes)
						val = (marg.indexOf("px") !== -1) ? parseFloat(marg) : _convertToPixels(this.t, prop, parseFloat(marg), marg.replace(_suffixExp, "")) || 0;
						if (val !== t[prop]) {
							dif = (i < 2) ? -t.ieOffsetX : -t.ieOffsetY; //if another tween is controlling a margin, we cannot only apply the difference in the ieOffsets, so we essentially zero-out the dx and dy here in that case. We record the margin(s) later so that we can keep comparing them, making this code very flexible.
						} else {
							dif = (i < 2) ? dx - t.ieOffsetX : dy - t.ieOffsetY;
						}
						style[prop] = (t[prop] = Math.round( val - dif * ((i === 0 || i === 2) ? 1 : mult) )) + "px";
					}
				}
			},

			/* translates a super small decimal to a string WITHOUT scientific notation
			_safeDecimal = function(n) {
				var s = (n < 0 ? -n : n) + "",
					a = s.split("e-");
				return (n < 0 ? "-0." : "0.") + new Array(parseInt(a[1], 10) || 0).join("0") + a[0].split(".").join("");
			},
			*/

			_setTransformRatio = _internals.set3DTransformRatio = _internals.setTransformRatio = function(v) {
				var t = this.data, //refers to the element's _gsTransform object
					style = this.t.style,
					angle = t.rotation,
					rotationX = t.rotationX,
					rotationY = t.rotationY,
					sx = t.scaleX,
					sy = t.scaleY,
					sz = t.scaleZ,
					x = t.x,
					y = t.y,
					z = t.z,
					isSVG = t.svg,
					perspective = t.perspective,
					force3D = t.force3D,
					a11, a12, a13, a21, a22, a23, a31, a32, a33, a41, a42, a43,
					zOrigin, min, cos, sin, t1, t2, transform, comma, zero, skew, rnd;
				//check to see if we should render as 2D (and SVGs must use 2D when _useSVGTransformAttr is true)
				if (((((v === 1 || v === 0) && force3D === "auto" && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime)) || !force3D) && !z && !perspective && !rotationY && !rotationX && sz === 1) || (_useSVGTransformAttr && isSVG) || !_supports3D) { //on the final render (which could be 0 for a from tween), if there are no 3D aspects, render in 2D to free up memory and improve performance especially on mobile devices. Check the tween's totalTime/totalDuration too in order to make sure it doesn't happen between repeats if it's a repeating tween.

					//2D
					if (angle || t.skewX || isSVG) {
						angle *= _DEG2RAD;
						skew = t.skewX * _DEG2RAD;
						rnd = 100000;
						a11 = Math.cos(angle) * sx;
						a21 = Math.sin(angle) * sx;
						a12 = Math.sin(angle - skew) * -sy;
						a22 = Math.cos(angle - skew) * sy;
						if (skew && t.skewType === "simple") { //by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
							t1 = Math.tan(skew - t.skewY * _DEG2RAD);
							t1 = Math.sqrt(1 + t1 * t1);
							a12 *= t1;
							a22 *= t1;
							if (t.skewY) {
								t1 = Math.tan(t.skewY * _DEG2RAD);
								t1 = Math.sqrt(1 + t1 * t1);
								a11 *= t1;
								a21 *= t1;
							}
						}
						if (isSVG) {
							x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
							y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
							if (_useSVGTransformAttr && (t.xPercent || t.yPercent)) { //The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the matrix to simulate it.
								min = this.t.getBBox();
								x += t.xPercent * 0.01 * min.width;
								y += t.yPercent * 0.01 * min.height;
							}
							min = 0.000001;
							if (x < min) if (x > -min) {
								x = 0;
							}
							if (y < min) if (y > -min) {
								y = 0;
							}
						}
						transform = (((a11 * rnd) | 0) / rnd) + "," + (((a21 * rnd) | 0) / rnd) + "," + (((a12 * rnd) | 0) / rnd) + "," + (((a22 * rnd) | 0) / rnd) + "," + x + "," + y + ")";
						if (isSVG && _useSVGTransformAttr) {
							this.t.setAttribute("transform", "matrix(" + transform);
						} else {
							//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 5 decimal places.
							style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + transform;
						}
					} else {
						style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + sx + ",0,0," + sy + "," + x + "," + y + ")";
					}
					return;

				}
				if (_isFirefox) { //Firefox has a bug (at least in v25) that causes it to render the transparent part of 32-bit PNG images as black when displayed inside an iframe and the 3D scale is very small and doesn't change sufficiently enough between renders (like if you use a Power4.easeInOut to scale from 0 to 1 where the beginning values only change a tiny amount to begin the tween before accelerating). In this case, we force the scale to be 0.00002 instead which is visually the same but works around the Firefox issue.
					min = 0.0001;
					if (sx < min && sx > -min) {
						sx = sz = 0.00002;
					}
					if (sy < min && sy > -min) {
						sy = sz = 0.00002;
					}
					if (perspective && !t.z && !t.rotationX && !t.rotationY) { //Firefox has a bug that causes elements to have an odd super-thin, broken/dotted black border on elements that have a perspective set but aren't utilizing 3D space (no rotationX, rotationY, or z).
						perspective = 0;
					}
				}
				if (angle || t.skewX) {
					angle *= _DEG2RAD;
					cos = a11 = Math.cos(angle);
					sin = a21 = Math.sin(angle);
					if (t.skewX) {
						angle -= t.skewX * _DEG2RAD;
						cos = Math.cos(angle);
						sin = Math.sin(angle);
						if (t.skewType === "simple") { //by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
							t1 = Math.tan((t.skewX - t.skewY) * _DEG2RAD);
							t1 = Math.sqrt(1 + t1 * t1);
							cos *= t1;
							sin *= t1;
							if (t.skewY) {
								t1 = Math.tan(t.skewY * _DEG2RAD);
								t1 = Math.sqrt(1 + t1 * t1);
								a11 *= t1;
								a21 *= t1;
							}
						}
					}
					a12 = -sin;
					a22 = cos;

				} else if (!rotationY && !rotationX && sz === 1 && !perspective && !isSVG) { //if we're only translating and/or 2D scaling, this is faster...
					style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) translate3d(" : "translate3d(") + x + "px," + y + "px," + z +"px)" + ((sx !== 1 || sy !== 1) ? " scale(" + sx + "," + sy + ")" : "");
					return;
				} else {
					a11 = a22 = 1;
					a12 = a21 = 0;
				}
				// KEY  INDEX   AFFECTS
				// a11  0       rotation, rotationY, scaleX
				// a21  1       rotation, rotationY, scaleX
				// a31  2       rotationY, scaleX
				// a41  3       rotationY, scaleX
				// a12  4       rotation, skewX, rotationX, scaleY
				// a22  5       rotation, skewX, rotationX, scaleY
				// a32  6       rotationX, scaleY
				// a42  7       rotationX, scaleY
				// a13  8       rotationY, rotationX, scaleZ
				// a23  9       rotationY, rotationX, scaleZ
				// a33  10      rotationY, rotationX, scaleZ
				// a43  11      rotationY, rotationX, perspective, scaleZ
				// a14  12      x, zOrigin, svgOrigin
				// a24  13      y, zOrigin, svgOrigin
				// a34  14      z, zOrigin
				// a44  15
				// rotation: Math.atan2(a21, a11)
				// rotationY: Math.atan2(a13, a33) (or Math.atan2(a13, a11))
				// rotationX: Math.atan2(a32, a33)
				a33 = 1;
				a13 = a23 = a31 = a32 = a41 = a42 = 0;
				a43 = (perspective) ? -1 / perspective : 0;
				zOrigin = t.zOrigin;
				min = 0.000001; //threshold below which browsers use scientific notation which won't work.
				comma = ",";
				zero = "0";
				angle = rotationY * _DEG2RAD;
				if (angle) {
					cos = Math.cos(angle);
					sin = Math.sin(angle);
					a31 = -sin;
					a41 = a43*-sin;
					a13 = a11*sin;
					a23 = a21*sin;
					a33 = cos;
					a43 *= cos;
					a11 *= cos;
					a21 *= cos;
				}
				angle = rotationX * _DEG2RAD;
				if (angle) {
					cos = Math.cos(angle);
					sin = Math.sin(angle);
					t1 = a12*cos+a13*sin;
					t2 = a22*cos+a23*sin;
					a32 = a33*sin;
					a42 = a43*sin;
					a13 = a12*-sin+a13*cos;
					a23 = a22*-sin+a23*cos;
					a33 = a33*cos;
					a43 = a43*cos;
					a12 = t1;
					a22 = t2;
				}
				if (sz !== 1) {
					a13*=sz;
					a23*=sz;
					a33*=sz;
					a43*=sz;
				}
				if (sy !== 1) {
					a12*=sy;
					a22*=sy;
					a32*=sy;
					a42*=sy;
				}
				if (sx !== 1) {
					a11*=sx;
					a21*=sx;
					a31*=sx;
					a41*=sx;
				}

				if (zOrigin || isSVG) {
					if (zOrigin) {
						x += a13*-zOrigin;
						y += a23*-zOrigin;
						z += a33*-zOrigin+zOrigin;
					}
					if (isSVG) { //due to bugs in some browsers, we need to manage the transform-origin of SVG manually
						x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
						y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
					}
					if (x < min && x > -min) {
						x = zero;
					}
					if (y < min && y > -min) {
						y = zero;
					}
					if (z < min && z > -min) {
						z = 0; //don't use string because we calculate perspective later and need the number.
					}
				}

				//optimized way of concatenating all the values into a string. If we do it all in one shot, it's slower because of the way browsers have to create temp strings and the way it affects memory. If we do it piece-by-piece with +=, it's a bit slower too. We found that doing it in these sized chunks works best overall:
				transform = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix3d(" : "matrix3d(");
				transform += ((a11 < min && a11 > -min) ? zero : a11) + comma + ((a21 < min && a21 > -min) ? zero : a21) + comma + ((a31 < min && a31 > -min) ? zero : a31);
				transform += comma + ((a41 < min && a41 > -min) ? zero : a41) + comma + ((a12 < min && a12 > -min) ? zero : a12) + comma + ((a22 < min && a22 > -min) ? zero : a22);
				if (rotationX || rotationY || sz !== 1) { //performance optimization (often there's no rotationX or rotationY, so we can skip these calculations)
					transform += comma + ((a32 < min && a32 > -min) ? zero : a32) + comma + ((a42 < min && a42 > -min) ? zero : a42) + comma + ((a13 < min && a13 > -min) ? zero : a13);
					transform += comma + ((a23 < min && a23 > -min) ? zero : a23) + comma + ((a33 < min && a33 > -min) ? zero : a33) + comma + ((a43 < min && a43 > -min) ? zero : a43) + comma;
				} else {
					transform += ",0,0,0,0,1,0,";
				}
				transform += x + comma + y + comma + z + comma + (perspective ? (1 + (-z / perspective)) : 1) + ")";

				style[_transformProp] = transform;
			};

		p = Transform.prototype;
		p.x = p.y = p.z = p.skewX = p.skewY = p.rotation = p.rotationX = p.rotationY = p.zOrigin = p.xPercent = p.yPercent = p.xOffset = p.yOffset = 0;
		p.scaleX = p.scaleY = p.scaleZ = 1;

		_registerComplexSpecialProp("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {parser:function(t, e, parsingProp, cssp, pt, plugin, vars) {
			if (cssp._lastParsedTransform === vars) { return pt; } //only need to parse the transform once, and only if the browser supports it.
			cssp._lastParsedTransform = vars;
			var swapFunc;
			if (typeof(vars[parsingProp]) === "function") { //whatever property triggers the initial parsing might be a function-based value in which case it already got called in parse(), thus we don't want to call it again in here. The most efficient way to avoid this is to temporarily swap the value directly into the vars object, and then after we do all our parsing in this function, we'll swap it back again.
				swapFunc = vars[parsingProp];
				vars[parsingProp] = e;
			}
			var originalGSTransform = t._gsTransform,
				style = t.style,
				min = 0.000001,
				i = _transformProps.length,
				v = vars,
				endRotations = {},
				transformOriginString = "transformOrigin",
				m1 = _getTransform(t, _cs, true, v.parseTransform),
				orig = v.transform && ((typeof(v.transform) === "function") ? v.transform(_index, _target) : v.transform),
				m2, copy, has3D, hasChange, dr, x, y, matrix, p;
			cssp._transform = m1;
			if (orig && typeof(orig) === "string" && _transformProp) { //for values like transform:"rotate(60deg) scale(0.5, 0.8)"
				copy = _tempDiv.style; //don't use the original target because it might be SVG in which case some browsers don't report computed style correctly.
				copy[_transformProp] = orig;
				copy.display = "block"; //if display is "none", the browser often refuses to report the transform properties correctly.
				copy.position = "absolute";
				_doc.body.appendChild(_tempDiv);
				m2 = _getTransform(_tempDiv, null, false);
				if (m1.svg) { //if it's an SVG element, x/y part of the matrix will be affected by whatever we use as the origin and the offsets, so compensate here...
					x = m1.xOrigin;
					y = m1.yOrigin;
					m2.x -= m1.xOffset;
					m2.y -= m1.yOffset;
					if (v.transformOrigin || v.svgOrigin) { //if this tween is altering the origin, we must factor that in here. The actual work of recording the transformOrigin values and setting up the PropTween is done later (still inside this function) so we cannot leave the changes intact here - we only want to update the x/y accordingly.
						orig = {};
						_parseSVGOrigin(t, _parsePosition(v.transformOrigin), orig, v.svgOrigin, v.smoothOrigin, true);
						x = orig.xOrigin;
						y = orig.yOrigin;
						m2.x -= orig.xOffset - m1.xOffset;
						m2.y -= orig.yOffset - m1.yOffset;
					}
					if (x || y) {
						matrix = _getMatrix(_tempDiv, true);
						m2.x -= x - (x * matrix[0] + y * matrix[2]);
						m2.y -= y - (x * matrix[1] + y * matrix[3]);
					}
				}
				_doc.body.removeChild(_tempDiv);
				if (!m2.perspective) {
					m2.perspective = m1.perspective; //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
				}
				if (v.xPercent != null) {
					m2.xPercent = _parseVal(v.xPercent, m1.xPercent);
				}
				if (v.yPercent != null) {
					m2.yPercent = _parseVal(v.yPercent, m1.yPercent);
				}
			} else if (typeof(v) === "object") { //for values like scaleX, scaleY, rotation, x, y, skewX, and skewY or transform:{...} (object)
				m2 = {scaleX:_parseVal((v.scaleX != null) ? v.scaleX : v.scale, m1.scaleX),
					scaleY:_parseVal((v.scaleY != null) ? v.scaleY : v.scale, m1.scaleY),
					scaleZ:_parseVal(v.scaleZ, m1.scaleZ),
					x:_parseVal(v.x, m1.x),
					y:_parseVal(v.y, m1.y),
					z:_parseVal(v.z, m1.z),
					xPercent:_parseVal(v.xPercent, m1.xPercent),
					yPercent:_parseVal(v.yPercent, m1.yPercent),
					perspective:_parseVal(v.transformPerspective, m1.perspective)};
				dr = v.directionalRotation;
				if (dr != null) {
					if (typeof(dr) === "object") {
						for (copy in dr) {
							v[copy] = dr[copy];
						}
					} else {
						v.rotation = dr;
					}
				}
				if (typeof(v.x) === "string" && v.x.indexOf("%") !== -1) {
					m2.x = 0;
					m2.xPercent = _parseVal(v.x, m1.xPercent);
				}
				if (typeof(v.y) === "string" && v.y.indexOf("%") !== -1) {
					m2.y = 0;
					m2.yPercent = _parseVal(v.y, m1.yPercent);
				}

				m2.rotation = _parseAngle(("rotation" in v) ? v.rotation : ("shortRotation" in v) ? v.shortRotation + "_short" : ("rotationZ" in v) ? v.rotationZ : m1.rotation - m1.skewY, m1.rotation - m1.skewY, "rotation", endRotations); //see notes below about skewY for why we subtract it from rotation here
				if (_supports3D) {
					m2.rotationX = _parseAngle(("rotationX" in v) ? v.rotationX : ("shortRotationX" in v) ? v.shortRotationX + "_short" : m1.rotationX || 0, m1.rotationX, "rotationX", endRotations);
					m2.rotationY = _parseAngle(("rotationY" in v) ? v.rotationY : ("shortRotationY" in v) ? v.shortRotationY + "_short" : m1.rotationY || 0, m1.rotationY, "rotationY", endRotations);
				}
				m2.skewX = _parseAngle(v.skewX, m1.skewX - m1.skewY); //see notes below about skewY and why we subtract it from skewX here

				//note: for performance reasons, we combine all skewing into the skewX and rotation values, ignoring skewY but we must still record it so that we can discern how much of the overall skew is attributed to skewX vs. skewY. Otherwise, if the skewY would always act relative (tween skewY to 10deg, for example, multiple times and if we always combine things into skewX, we can't remember that skewY was 10 from last time). Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of -10 degrees.
				if ((m2.skewY = _parseAngle(v.skewY, m1.skewY))) {
					m2.skewX += m2.skewY;
					m2.rotation += m2.skewY;
				}
			}
			if (_supports3D && v.force3D != null) {
				m1.force3D = v.force3D;
				hasChange = true;
			}

			m1.skewType = v.skewType || m1.skewType || CSSPlugin.defaultSkewType;

			has3D = (m1.force3D || m1.z || m1.rotationX || m1.rotationY || m2.z || m2.rotationX || m2.rotationY || m2.perspective);
			if (!has3D && v.scale != null) {
				m2.scaleZ = 1; //no need to tween scaleZ.
			}

			while (--i > -1) {
				p = _transformProps[i];
				orig = m2[p] - m1[p];
				if (orig > min || orig < -min || v[p] != null || _forcePT[p] != null) {
					hasChange = true;
					pt = new CSSPropTween(m1, p, m1[p], orig, pt);
					if (p in endRotations) {
						pt.e = endRotations[p]; //directional rotations typically have compensated values during the tween, but we need to make sure they end at exactly what the user requested
					}
					pt.xs0 = 0; //ensures the value stays numeric in setRatio()
					pt.plugin = plugin;
					cssp._overwriteProps.push(pt.n);
				}
			}

			orig = v.transformOrigin;
			if (m1.svg && (orig || v.svgOrigin)) {
				x = m1.xOffset; //when we change the origin, in order to prevent things from jumping we adjust the x/y so we must record those here so that we can create PropTweens for them and flip them at the same time as the origin
				y = m1.yOffset;
				_parseSVGOrigin(t, _parsePosition(orig), m2, v.svgOrigin, v.smoothOrigin);
				pt = _addNonTweeningNumericPT(m1, "xOrigin", (originalGSTransform ? m1 : m2).xOrigin, m2.xOrigin, pt, transformOriginString); //note: if there wasn't a transformOrigin defined yet, just start with the destination one; it's wasteful otherwise, and it causes problems with fromTo() tweens. For example, TweenLite.to("#wheel", 3, {rotation:180, transformOrigin:"50% 50%", delay:1}); TweenLite.fromTo("#wheel", 3, {scale:0.5, transformOrigin:"50% 50%"}, {scale:1, delay:2}); would cause a jump when the from values revert at the beginning of the 2nd tween.
				pt = _addNonTweeningNumericPT(m1, "yOrigin", (originalGSTransform ? m1 : m2).yOrigin, m2.yOrigin, pt, transformOriginString);
				if (x !== m1.xOffset || y !== m1.yOffset) {
					pt = _addNonTweeningNumericPT(m1, "xOffset", (originalGSTransform ? x : m1.xOffset), m1.xOffset, pt, transformOriginString);
					pt = _addNonTweeningNumericPT(m1, "yOffset", (originalGSTransform ? y : m1.yOffset), m1.yOffset, pt, transformOriginString);
				}
				orig = _useSVGTransformAttr ? null : "0px 0px"; //certain browsers (like firefox) completely botch transform-origin, so we must remove it to prevent it from contaminating transforms. We manage it ourselves with xOrigin and yOrigin
			}
			if (orig || (_supports3D && has3D && m1.zOrigin)) { //if anything 3D is happening and there's a transformOrigin with a z component that's non-zero, we must ensure that the transformOrigin's z-component is set to 0 so that we can manually do those calculations to get around Safari bugs. Even if the user didn't specifically define a "transformOrigin" in this particular tween (maybe they did it via css directly).
				if (_transformProp) {
					hasChange = true;
					p = _transformOriginProp;
					orig = (orig || _getStyle(t, p, _cs, false, "50% 50%")) + ""; //cast as string to avoid errors
					pt = new CSSPropTween(style, p, 0, 0, pt, -1, transformOriginString);
					pt.b = style[p];
					pt.plugin = plugin;
					if (_supports3D) {
						copy = m1.zOrigin;
						orig = orig.split(" ");
						m1.zOrigin = ((orig.length > 2 && !(copy !== 0 && orig[2] === "0px")) ? parseFloat(orig[2]) : copy) || 0; //Safari doesn't handle the z part of transformOrigin correctly, so we'll manually handle it in the _set3DTransformRatio() method.
						pt.xs0 = pt.e = orig[0] + " " + (orig[1] || "50%") + " 0px"; //we must define a z value of 0px specifically otherwise iOS 5 Safari will stick with the old one (if one was defined)!
						pt = new CSSPropTween(m1, "zOrigin", 0, 0, pt, -1, pt.n); //we must create a CSSPropTween for the _gsTransform.zOrigin so that it gets reset properly at the beginning if the tween runs backward (as opposed to just setting m1.zOrigin here)
						pt.b = copy;
						pt.xs0 = pt.e = m1.zOrigin;
					} else {
						pt.xs0 = pt.e = orig;
					}

					//for older versions of IE (6-8), we need to manually calculate things inside the setRatio() function. We record origin x and y (ox and oy) and whether or not the values are percentages (oxp and oyp).
				} else {
					_parsePosition(orig + "", m1);
				}
			}
			if (hasChange) {
				cssp._transformType = (!(m1.svg && _useSVGTransformAttr) && (has3D || this._transformType === 3)) ? 3 : 2; //quicker than calling cssp._enableTransforms();
			}
			if (swapFunc) {
				vars[parsingProp] = swapFunc;
			}
			return pt;
		}, prefix:true});

		_registerComplexSpecialProp("boxShadow", {defaultValue:"0px 0px 0px 0px #999", prefix:true, color:true, multi:true, keyword:"inset"});

		_registerComplexSpecialProp("borderRadius", {defaultValue:"0px", parser:function(t, e, p, cssp, pt, plugin) {
			e = this.format(e);
			var props = ["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],
				style = t.style,
				ea1, i, es2, bs2, bs, es, bn, en, w, h, esfx, bsfx, rel, hn, vn, em;
			w = parseFloat(t.offsetWidth);
			h = parseFloat(t.offsetHeight);
			ea1 = e.split(" ");
			for (i = 0; i < props.length; i++) { //if we're dealing with percentages, we must convert things separately for the horizontal and vertical axis!
				if (this.p.indexOf("border")) { //older browsers used a prefix
					props[i] = _checkPropPrefix(props[i]);
				}
				bs = bs2 = _getStyle(t, props[i], _cs, false, "0px");
				if (bs.indexOf(" ") !== -1) {
					bs2 = bs.split(" ");
					bs = bs2[0];
					bs2 = bs2[1];
				}
				es = es2 = ea1[i];
				bn = parseFloat(bs);
				bsfx = bs.substr((bn + "").length);
				rel = (es.charAt(1) === "=");
				if (rel) {
					en = parseInt(es.charAt(0)+"1", 10);
					es = es.substr(2);
					en *= parseFloat(es);
					esfx = es.substr((en + "").length - (en < 0 ? 1 : 0)) || "";
				} else {
					en = parseFloat(es);
					esfx = es.substr((en + "").length);
				}
				if (esfx === "") {
					esfx = _suffixMap[p] || bsfx;
				}
				if (esfx !== bsfx) {
					hn = _convertToPixels(t, "borderLeft", bn, bsfx); //horizontal number (we use a bogus "borderLeft" property just because the _convertToPixels() method searches for the keywords "Left", "Right", "Top", and "Bottom" to determine of it's a horizontal or vertical property, and we need "border" in the name so that it knows it should measure relative to the element itself, not its parent.
					vn = _convertToPixels(t, "borderTop", bn, bsfx); //vertical number
					if (esfx === "%") {
						bs = (hn / w * 100) + "%";
						bs2 = (vn / h * 100) + "%";
					} else if (esfx === "em") {
						em = _convertToPixels(t, "borderLeft", 1, "em");
						bs = (hn / em) + "em";
						bs2 = (vn / em) + "em";
					} else {
						bs = hn + "px";
						bs2 = vn + "px";
					}
					if (rel) {
						es = (parseFloat(bs) + en) + esfx;
						es2 = (parseFloat(bs2) + en) + esfx;
					}
				}
				pt = _parseComplex(style, props[i], bs + " " + bs2, es + " " + es2, false, "0px", pt);
			}
			return pt;
		}, prefix:true, formatter:_getFormatter("0px 0px 0px 0px", false, true)});
		_registerComplexSpecialProp("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {defaultValue:"0px", parser:function(t, e, p, cssp, pt, plugin) {
			return _parseComplex(t.style, p, this.format(_getStyle(t, p, _cs, false, "0px 0px")), this.format(e), false, "0px", pt);
		}, prefix:true, formatter:_getFormatter("0px 0px", false, true)});
		_registerComplexSpecialProp("backgroundPosition", {defaultValue:"0 0", parser:function(t, e, p, cssp, pt, plugin) {
			var bp = "background-position",
				cs = (_cs || _getComputedStyle(t, null)),
				bs = this.format( ((cs) ? _ieVers ? cs.getPropertyValue(bp + "-x") + " " + cs.getPropertyValue(bp + "-y") : cs.getPropertyValue(bp) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"), //Internet Explorer doesn't report background-position correctly - we must query background-position-x and background-position-y and combine them (even in IE10). Before IE9, we must do the same with the currentStyle object and use camelCase
				es = this.format(e),
				ba, ea, i, pct, overlap, src;
			if ((bs.indexOf("%") !== -1) !== (es.indexOf("%") !== -1) && es.split(",").length < 2) {
				src = _getStyle(t, "backgroundImage").replace(_urlExp, "");
				if (src && src !== "none") {
					ba = bs.split(" ");
					ea = es.split(" ");
					_tempImg.setAttribute("src", src); //set the temp IMG's src to the background-image so that we can measure its width/height
					i = 2;
					while (--i > -1) {
						bs = ba[i];
						pct = (bs.indexOf("%") !== -1);
						if (pct !== (ea[i].indexOf("%") !== -1)) {
							overlap = (i === 0) ? t.offsetWidth - _tempImg.width : t.offsetHeight - _tempImg.height;
							ba[i] = pct ? (parseFloat(bs) / 100 * overlap) + "px" : (parseFloat(bs) / overlap * 100) + "%";
						}
					}
					bs = ba.join(" ");
				}
			}
			return this.parseComplex(t.style, bs, es, pt, plugin);
		}, formatter:_parsePosition});
		_registerComplexSpecialProp("backgroundSize", {defaultValue:"0 0", formatter:function(v) {
			v += ""; //ensure it's a string
			return _parsePosition(v.indexOf(" ") === -1 ? v + " " + v : v); //if set to something like "100% 100%", Safari typically reports the computed style as just "100%" (no 2nd value), but we should ensure that there are two values, so copy the first one. Otherwise, it'd be interpreted as "100% 0" (wrong).
		}});
		_registerComplexSpecialProp("perspective", {defaultValue:"0px", prefix:true});
		_registerComplexSpecialProp("perspectiveOrigin", {defaultValue:"50% 50%", prefix:true});
		_registerComplexSpecialProp("transformStyle", {prefix:true});
		_registerComplexSpecialProp("backfaceVisibility", {prefix:true});
		_registerComplexSpecialProp("userSelect", {prefix:true});
		_registerComplexSpecialProp("margin", {parser:_getEdgeParser("marginTop,marginRight,marginBottom,marginLeft")});
		_registerComplexSpecialProp("padding", {parser:_getEdgeParser("paddingTop,paddingRight,paddingBottom,paddingLeft")});
		_registerComplexSpecialProp("clip", {defaultValue:"rect(0px,0px,0px,0px)", parser:function(t, e, p, cssp, pt, plugin){
			var b, cs, delim;
			if (_ieVers < 9) { //IE8 and earlier don't report a "clip" value in the currentStyle - instead, the values are split apart into clipTop, clipRight, clipBottom, and clipLeft. Also, in IE7 and earlier, the values inside rect() are space-delimited, not comma-delimited.
				cs = t.currentStyle;
				delim = _ieVers < 8 ? " " : ",";
				b = "rect(" + cs.clipTop + delim + cs.clipRight + delim + cs.clipBottom + delim + cs.clipLeft + ")";
				e = this.format(e).split(",").join(delim);
			} else {
				b = this.format(_getStyle(t, this.p, _cs, false, this.dflt));
				e = this.format(e);
			}
			return this.parseComplex(t.style, b, e, pt, plugin);
		}});
		_registerComplexSpecialProp("textShadow", {defaultValue:"0px 0px 0px #999", color:true, multi:true});
		_registerComplexSpecialProp("autoRound,strictUnits", {parser:function(t, e, p, cssp, pt) {return pt;}}); //just so that we can ignore these properties (not tween them)
		_registerComplexSpecialProp("border", {defaultValue:"0px solid #000", parser:function(t, e, p, cssp, pt, plugin) {
			var bw = _getStyle(t, "borderTopWidth", _cs, false, "0px"),
				end = this.format(e).split(" "),
				esfx = end[0].replace(_suffixExp, "");
			if (esfx !== "px") { //if we're animating to a non-px value, we need to convert the beginning width to that unit.
				bw = (parseFloat(bw) / _convertToPixels(t, "borderTopWidth", 1, esfx)) + esfx;
			}
			return this.parseComplex(t.style, this.format(bw + " " + _getStyle(t, "borderTopStyle", _cs, false, "solid") + " " + _getStyle(t, "borderTopColor", _cs, false, "#000")), end.join(" "), pt, plugin);
			}, color:true, formatter:function(v) {
				var a = v.split(" ");
				return a[0] + " " + (a[1] || "solid") + " " + (v.match(_colorExp) || ["#000"])[0];
			}});
		_registerComplexSpecialProp("borderWidth", {parser:_getEdgeParser("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}); //Firefox doesn't pick up on borderWidth set in style sheets (only inline).
		_registerComplexSpecialProp("float,cssFloat,styleFloat", {parser:function(t, e, p, cssp, pt, plugin) {
			var s = t.style,
				prop = ("cssFloat" in s) ? "cssFloat" : "styleFloat";
			return new CSSPropTween(s, prop, 0, 0, pt, -1, p, false, 0, s[prop], e);
		}});

		//opacity-related
		var _setIEOpacityRatio = function(v) {
				var t = this.t, //refers to the element's style property
					filters = t.filter || _getStyle(this.data, "filter") || "",
					val = (this.s + this.c * v) | 0,
					skip;
				if (val === 100) { //for older versions of IE that need to use a filter to apply opacity, we should remove the filter if opacity hits 1 in order to improve performance, but make sure there isn't a transform (matrix) or gradient in the filters.
					if (filters.indexOf("atrix(") === -1 && filters.indexOf("radient(") === -1 && filters.indexOf("oader(") === -1) {
						t.removeAttribute("filter");
						skip = (!_getStyle(this.data, "filter")); //if a class is applied that has an alpha filter, it will take effect (we don't want that), so re-apply our alpha filter in that case. We must first remove it and then check.
					} else {
						t.filter = filters.replace(_alphaFilterExp, "");
						skip = true;
					}
				}
				if (!skip) {
					if (this.xn1) {
						t.filter = filters = filters || ("alpha(opacity=" + val + ")"); //works around bug in IE7/8 that prevents changes to "visibility" from being applied properly if the filter is changed to a different alpha on the same frame.
					}
					if (filters.indexOf("pacity") === -1) { //only used if browser doesn't support the standard opacity style property (IE 7 and 8). We omit the "O" to avoid case-sensitivity issues
						if (val !== 0 || !this.xn1) { //bugs in IE7/8 won't render the filter properly if opacity is ADDED on the same frame/render as "visibility" changes (this.xn1 is 1 if this tween is an "autoAlpha" tween)
							t.filter = filters + " alpha(opacity=" + val + ")"; //we round the value because otherwise, bugs in IE7/8 can prevent "visibility" changes from being applied properly.
						}
					} else {
						t.filter = filters.replace(_opacityExp, "opacity=" + val);
					}
				}
			};
		_registerComplexSpecialProp("opacity,alpha,autoAlpha", {defaultValue:"1", parser:function(t, e, p, cssp, pt, plugin) {
			var b = parseFloat(_getStyle(t, "opacity", _cs, false, "1")),
				style = t.style,
				isAutoAlpha = (p === "autoAlpha");
			if (typeof(e) === "string" && e.charAt(1) === "=") {
				e = ((e.charAt(0) === "-") ? -1 : 1) * parseFloat(e.substr(2)) + b;
			}
			if (isAutoAlpha && b === 1 && _getStyle(t, "visibility", _cs) === "hidden" && e !== 0) { //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
				b = 0;
			}
			if (_supportsOpacity) {
				pt = new CSSPropTween(style, "opacity", b, e - b, pt);
			} else {
				pt = new CSSPropTween(style, "opacity", b * 100, (e - b) * 100, pt);
				pt.xn1 = isAutoAlpha ? 1 : 0; //we need to record whether or not this is an autoAlpha so that in the setRatio(), we know to duplicate the setting of the alpha in order to work around a bug in IE7 and IE8 that prevents changes to "visibility" from taking effect if the filter is changed to a different alpha(opacity) at the same time. Setting it to the SAME value first, then the new value works around the IE7/8 bug.
				style.zoom = 1; //helps correct an IE issue.
				pt.type = 2;
				pt.b = "alpha(opacity=" + pt.s + ")";
				pt.e = "alpha(opacity=" + (pt.s + pt.c) + ")";
				pt.data = t;
				pt.plugin = plugin;
				pt.setRatio = _setIEOpacityRatio;
			}
			if (isAutoAlpha) { //we have to create the "visibility" PropTween after the opacity one in the linked list so that they run in the order that works properly in IE8 and earlier
				pt = new CSSPropTween(style, "visibility", 0, 0, pt, -1, null, false, 0, ((b !== 0) ? "inherit" : "hidden"), ((e === 0) ? "hidden" : "inherit"));
				pt.xs0 = "inherit";
				cssp._overwriteProps.push(pt.n);
				cssp._overwriteProps.push(p);
			}
			return pt;
		}});


		var _removeProp = function(s, p) {
				if (p) {
					if (s.removeProperty) {
						if (p.substr(0,2) === "ms" || p.substr(0,6) === "webkit") { //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
							p = "-" + p;
						}
						s.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
					} else { //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
						s.removeAttribute(p);
					}
				}
			},
			_setClassNameRatio = function(v) {
				this.t._gsClassPT = this;
				if (v === 1 || v === 0) {
					this.t.setAttribute("class", (v === 0) ? this.b : this.e);
					var mpt = this.data, //first MiniPropTween
						s = this.t.style;
					while (mpt) {
						if (!mpt.v) {
							_removeProp(s, mpt.p);
						} else {
							s[mpt.p] = mpt.v;
						}
						mpt = mpt._next;
					}
					if (v === 1 && this.t._gsClassPT === this) {
						this.t._gsClassPT = null;
					}
				} else if (this.t.getAttribute("class") !== this.e) {
					this.t.setAttribute("class", this.e);
				}
			};
		_registerComplexSpecialProp("className", {parser:function(t, e, p, cssp, pt, plugin, vars) {
			var b = t.getAttribute("class") || "", //don't use t.className because it doesn't work consistently on SVG elements; getAttribute("class") and setAttribute("class", value") is more reliable.
				cssText = t.style.cssText,
				difData, bs, cnpt, cnptLookup, mpt;
			pt = cssp._classNamePT = new CSSPropTween(t, p, 0, 0, pt, 2);
			pt.setRatio = _setClassNameRatio;
			pt.pr = -11;
			_hasPriority = true;
			pt.b = b;
			bs = _getAllStyles(t, _cs);
			//if there's a className tween already operating on the target, force it to its end so that the necessary inline styles are removed and the class name is applied before we determine the end state (we don't want inline styles interfering that were there just for class-specific values)
			cnpt = t._gsClassPT;
			if (cnpt) {
				cnptLookup = {};
				mpt = cnpt.data; //first MiniPropTween which stores the inline styles - we need to force these so that the inline styles don't contaminate things. Otherwise, there's a small chance that a tween could start and the inline values match the destination values and they never get cleaned.
				while (mpt) {
					cnptLookup[mpt.p] = 1;
					mpt = mpt._next;
				}
				cnpt.setRatio(1);
			}
			t._gsClassPT = pt;
			pt.e = (e.charAt(1) !== "=") ? e : b.replace(new RegExp("(?:\\s|^)" + e.substr(2) + "(?![\\w-])"), "") + ((e.charAt(0) === "+") ? " " + e.substr(2) : "");
			t.setAttribute("class", pt.e);
			difData = _cssDif(t, bs, _getAllStyles(t), vars, cnptLookup);
			t.setAttribute("class", b);
			pt.data = difData.firstMPT;
			t.style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
			pt = pt.xfirst = cssp.parse(t, difData.difs, pt, plugin); //we record the CSSPropTween as the xfirst so that we can handle overwriting propertly (if "className" gets overwritten, we must kill all the properties associated with the className part of the tween, so we can loop through from xfirst to the pt itself)
			return pt;
		}});


		var _setClearPropsRatio = function(v) {
			if (v === 1 || v === 0) if (this.data._totalTime === this.data._totalDuration && this.data.data !== "isFromStart") { //this.data refers to the tween. Only clear at the END of the tween (remember, from() tweens make the ratio go from 1 to 0, so we can't just check that and if the tween is the zero-duration one that's created internally to render the starting values in a from() tween, ignore that because otherwise, for example, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in).
				var s = this.t.style,
					transformParse = _specialProps.transform.parse,
					a, p, i, clearTransform, transform;
				if (this.e === "all") {
					s.cssText = "";
					clearTransform = true;
				} else {
					a = this.e.split(" ").join("").split(",");
					i = a.length;
					while (--i > -1) {
						p = a[i];
						if (_specialProps[p]) {
							if (_specialProps[p].parse === transformParse) {
								clearTransform = true;
							} else {
								p = (p === "transformOrigin") ? _transformOriginProp : _specialProps[p].p; //ensures that special properties use the proper browser-specific property name, like "scaleX" might be "-webkit-transform" or "boxShadow" might be "-moz-box-shadow"
							}
						}
						_removeProp(s, p);
					}
				}
				if (clearTransform) {
					_removeProp(s, _transformProp);
					transform = this.t._gsTransform;
					if (transform) {
						if (transform.svg) {
							this.t.removeAttribute("data-svg-origin");
							this.t.removeAttribute("transform");
						}
						delete this.t._gsTransform;
					}
				}

			}
		};
		_registerComplexSpecialProp("clearProps", {parser:function(t, e, p, cssp, pt) {
			pt = new CSSPropTween(t, p, 0, 0, pt, 2);
			pt.setRatio = _setClearPropsRatio;
			pt.e = e;
			pt.pr = -10;
			pt.data = cssp._tween;
			_hasPriority = true;
			return pt;
		}});

		p = "bezier,throwProps,physicsProps,physics2D".split(",");
		i = p.length;
		while (i--) {
			_registerPluginProp(p[i]);
		}








		p = CSSPlugin.prototype;
		p._firstPT = p._lastParsedTransform = p._transform = null;

		//gets called when the tween renders for the first time. This kicks everything off, recording start/end values, etc.
		p._onInitTween = function(target, vars, tween, index) {
			if (!target.nodeType) { //css is only for dom elements
				return false;
			}
			this._target = _target = target;
			this._tween = tween;
			this._vars = vars;
			_index = index;
			_autoRound = vars.autoRound;
			_hasPriority = false;
			_suffixMap = vars.suffixMap || CSSPlugin.suffixMap;
			_cs = _getComputedStyle(target, "");
			_overwriteProps = this._overwriteProps;
			var style = target.style,
				v, pt, pt2, first, last, next, zIndex, tpt, threeD;
			if (_reqSafariFix) if (style.zIndex === "") {
				v = _getStyle(target, "zIndex", _cs);
				if (v === "auto" || v === "") {
					//corrects a bug in [non-Android] Safari that prevents it from repainting elements in their new positions if they don't have a zIndex set. We also can't just apply this inside _parseTransform() because anything that's moved in any way (like using "left" or "top" instead of transforms like "x" and "y") can be affected, so it is best to ensure that anything that's tweening has a z-index. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly. Plus zIndex is less memory-intensive.
					this._addLazySet(style, "zIndex", 0);
				}
			}

			if (typeof(vars) === "string") {
				first = style.cssText;
				v = _getAllStyles(target, _cs);
				style.cssText = first + ";" + vars;
				v = _cssDif(target, v, _getAllStyles(target)).difs;
				if (!_supportsOpacity && _opacityValExp.test(vars)) {
					v.opacity = parseFloat( RegExp.$1 );
				}
				vars = v;
				style.cssText = first;
			}

			if (vars.className) { //className tweens will combine any differences they find in the css with the vars that are passed in, so {className:"myClass", scale:0.5, left:20} would work.
				this._firstPT = pt = _specialProps.className.parse(target, vars.className, "className", this, null, null, vars);
			} else {
				this._firstPT = pt = this.parse(target, vars, null);
			}

			if (this._transformType) {
				threeD = (this._transformType === 3);
				if (!_transformProp) {
					style.zoom = 1; //helps correct an IE issue.
				} else if (_isSafari) {
					_reqSafariFix = true;
					//if zIndex isn't set, iOS Safari doesn't repaint things correctly sometimes (seemingly at random).
					if (style.zIndex === "") {
						zIndex = _getStyle(target, "zIndex", _cs);
						if (zIndex === "auto" || zIndex === "") {
							this._addLazySet(style, "zIndex", 0);
						}
					}
					//Setting WebkitBackfaceVisibility corrects 3 bugs:
					// 1) [non-Android] Safari skips rendering changes to "top" and "left" that are made on the same frame/render as a transform update.
					// 2) iOS Safari sometimes neglects to repaint elements in their new positions. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly.
					// 3) Safari sometimes displayed odd artifacts when tweening the transform (or WebkitTransform) property, like ghosts of the edges of the element remained. Definitely a browser bug.
					//Note: we allow the user to override the auto-setting by defining WebkitBackfaceVisibility in the vars of the tween.
					if (_isSafariLT6) {
						this._addLazySet(style, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (threeD ? "visible" : "hidden"));
					}
				}
				pt2 = pt;
				while (pt2 && pt2._next) {
					pt2 = pt2._next;
				}
				tpt = new CSSPropTween(target, "transform", 0, 0, null, 2);
				this._linkCSSP(tpt, null, pt2);
				tpt.setRatio = _transformProp ? _setTransformRatio : _setIETransformRatio;
				tpt.data = this._transform || _getTransform(target, _cs, true);
				tpt.tween = tween;
				tpt.pr = -1; //ensures that the transforms get applied after the components are updated.
				_overwriteProps.pop(); //we don't want to force the overwrite of all "transform" tweens of the target - we only care about individual transform properties like scaleX, rotation, etc. The CSSPropTween constructor automatically adds the property to _overwriteProps which is why we need to pop() here.
			}

			if (_hasPriority) {
				//reorders the linked list in order of pr (priority)
				while (pt) {
					next = pt._next;
					pt2 = first;
					while (pt2 && pt2.pr > pt.pr) {
						pt2 = pt2._next;
					}
					if ((pt._prev = pt2 ? pt2._prev : last)) {
						pt._prev._next = pt;
					} else {
						first = pt;
					}
					if ((pt._next = pt2)) {
						pt2._prev = pt;
					} else {
						last = pt;
					}
					pt = next;
				}
				this._firstPT = first;
			}
			return true;
		};


		p.parse = function(target, vars, pt, plugin) {
			var style = target.style,
				p, sp, bn, en, bs, es, bsfx, esfx, isStr, rel;
			for (p in vars) {
				es = vars[p]; //ending value string
				if (typeof(es) === "function") {
					es = es(_index, _target);
				}
				sp = _specialProps[p]; //SpecialProp lookup.
				if (sp) {
					pt = sp.parse(target, es, p, this, pt, plugin, vars);

				} else {
					bs = _getStyle(target, p, _cs) + "";
					isStr = (typeof(es) === "string");
					if (p === "color" || p === "fill" || p === "stroke" || p.indexOf("Color") !== -1 || (isStr && _rgbhslExp.test(es))) { //Opera uses background: to define color sometimes in addition to backgroundColor:
						if (!isStr) {
							es = _parseColor(es);
							es = ((es.length > 3) ? "rgba(" : "rgb(") + es.join(",") + ")";
						}
						pt = _parseComplex(style, p, bs, es, true, "transparent", pt, 0, plugin);

					} else if (isStr && _complexExp.test(es)) {
						pt = _parseComplex(style, p, bs, es, true, null, pt, 0, plugin);

					} else {
						bn = parseFloat(bs);
						bsfx = (bn || bn === 0) ? bs.substr((bn + "").length) : ""; //remember, bs could be non-numeric like "normal" for fontWeight, so we should default to a blank suffix in that case.

						if (bs === "" || bs === "auto") {
							if (p === "width" || p === "height") {
								bn = _getDimension(target, p, _cs);
								bsfx = "px";
							} else if (p === "left" || p === "top") {
								bn = _calculateOffset(target, p, _cs);
								bsfx = "px";
							} else {
								bn = (p !== "opacity") ? 0 : 1;
								bsfx = "";
							}
						}

						rel = (isStr && es.charAt(1) === "=");
						if (rel) {
							en = parseInt(es.charAt(0) + "1", 10);
							es = es.substr(2);
							en *= parseFloat(es);
							esfx = es.replace(_suffixExp, "");
						} else {
							en = parseFloat(es);
							esfx = isStr ? es.replace(_suffixExp, "") : "";
						}

						if (esfx === "") {
							esfx = (p in _suffixMap) ? _suffixMap[p] : bsfx; //populate the end suffix, prioritizing the map, then if none is found, use the beginning suffix.
						}

						es = (en || en === 0) ? (rel ? en + bn : en) + esfx : vars[p]; //ensures that any += or -= prefixes are taken care of. Record the end value before normalizing the suffix because we always want to end the tween on exactly what they intended even if it doesn't match the beginning value's suffix.

						//if the beginning/ending suffixes don't match, normalize them...
						if (bsfx !== esfx) if (esfx !== "") if (en || en === 0) if (bn) { //note: if the beginning value (bn) is 0, we don't need to convert units!
							bn = _convertToPixels(target, p, bn, bsfx);
							if (esfx === "%") {
								bn /= _convertToPixels(target, p, 100, "%") / 100;
								if (vars.strictUnits !== true) { //some browsers report only "px" values instead of allowing "%" with getComputedStyle(), so we assume that if we're tweening to a %, we should start there too unless strictUnits:true is defined. This approach is particularly useful for responsive designs that use from() tweens.
									bs = bn + "%";
								}

							} else if (esfx === "em" || esfx === "rem" || esfx === "vw" || esfx === "vh") {
								bn /= _convertToPixels(target, p, 1, esfx);

							//otherwise convert to pixels.
							} else if (esfx !== "px") {
								en = _convertToPixels(target, p, en, esfx);
								esfx = "px"; //we don't use bsfx after this, so we don't need to set it to px too.
							}
							if (rel) if (en || en === 0) {
								es = (en + bn) + esfx; //the changes we made affect relative calculations, so adjust the end value here.
							}
						}

						if (rel) {
							en += bn;
						}

						if ((bn || bn === 0) && (en || en === 0)) { //faster than isNaN(). Also, previously we required en !== bn but that doesn't really gain much performance and it prevents _parseToProxy() from working properly if beginning and ending values match but need to get tweened by an external plugin anyway. For example, a bezier tween where the target starts at left:0 and has these points: [{left:50},{left:0}] wouldn't work properly because when parsing the last point, it'd match the first (current) one and a non-tweening CSSPropTween would be recorded when we actually need a normal tween (type:0) so that things get updated during the tween properly.
							pt = new CSSPropTween(style, p, bn, en - bn, pt, 0, p, (_autoRound !== false && (esfx === "px" || p === "zIndex")), 0, bs, es);
							pt.xs0 = esfx;
							//DEBUG: _log("tween "+p+" from "+pt.b+" ("+bn+esfx+") to "+pt.e+" with suffix: "+pt.xs0);
						} else if (style[p] === undefined || !es && (es + "" === "NaN" || es == null)) {
							_log("invalid " + p + " tween value: " + vars[p]);
						} else {
							pt = new CSSPropTween(style, p, en || bn || 0, 0, pt, -1, p, false, 0, bs, es);
							pt.xs0 = (es === "none" && (p === "display" || p.indexOf("Style") !== -1)) ? bs : es; //intermediate value should typically be set immediately (end value) except for "display" or things like borderTopStyle, borderBottomStyle, etc. which should use the beginning value during the tween.
							//DEBUG: _log("non-tweening value "+p+": "+pt.xs0);
						}
					}
				}
				if (plugin) if (pt && !pt.plugin) {
					pt.plugin = plugin;
				}
			}
			return pt;
		};


		//gets called every time the tween updates, passing the new ratio (typically a value between 0 and 1, but not always (for example, if an Elastic.easeOut is used, the value can jump above 1 mid-tween). It will always start and 0 and end at 1.
		p.setRatio = function(v) {
			var pt = this._firstPT,
				min = 0.000001,
				val, str, i;
			//at the end of the tween, we set the values to exactly what we received in order to make sure non-tweening values (like "position" or "float" or whatever) are set and so that if the beginning/ending suffixes (units) didn't match and we normalized to px, the value that the user passed in is used here. We check to see if the tween is at its beginning in case it's a from() tween in which case the ratio will actually go from 1 to 0 over the course of the tween (backwards).
			if (v === 1 && (this._tween._time === this._tween._duration || this._tween._time === 0)) {
				while (pt) {
					if (pt.type !== 2) {
						if (pt.r && pt.type !== -1) {
							val = Math.round(pt.s + pt.c);
							if (!pt.type) {
								pt.t[pt.p] = val + pt.xs0;
							} else if (pt.type === 1) { //complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
								i = pt.l;
								str = pt.xs0 + val + pt.xs1;
								for (i = 1; i < pt.l; i++) {
									str += pt["xn"+i] + pt["xs"+(i+1)];
								}
								pt.t[pt.p] = str;
							}
						} else {
							pt.t[pt.p] = pt.e;
						}
					} else {
						pt.setRatio(v);
					}
					pt = pt._next;
				}

			} else if (v || !(this._tween._time === this._tween._duration || this._tween._time === 0) || this._tween._rawPrevTime === -0.000001) {
				while (pt) {
					val = pt.c * v + pt.s;
					if (pt.r) {
						val = Math.round(val);
					} else if (val < min) if (val > -min) {
						val = 0;
					}
					if (!pt.type) {
						pt.t[pt.p] = val + pt.xs0;
					} else if (pt.type === 1) { //complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
						i = pt.l;
						if (i === 2) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2;
						} else if (i === 3) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3;
						} else if (i === 4) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4;
						} else if (i === 5) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4 + pt.xn4 + pt.xs5;
						} else {
							str = pt.xs0 + val + pt.xs1;
							for (i = 1; i < pt.l; i++) {
								str += pt["xn"+i] + pt["xs"+(i+1)];
							}
							pt.t[pt.p] = str;
						}

					} else if (pt.type === -1) { //non-tweening value
						pt.t[pt.p] = pt.xs0;

					} else if (pt.setRatio) { //custom setRatio() for things like SpecialProps, external plugins, etc.
						pt.setRatio(v);
					}
					pt = pt._next;
				}

			//if the tween is reversed all the way back to the beginning, we need to restore the original values which may have different units (like % instead of px or em or whatever).
			} else {
				while (pt) {
					if (pt.type !== 2) {
						pt.t[pt.p] = pt.b;
					} else {
						pt.setRatio(v);
					}
					pt = pt._next;
				}
			}
		};

		/**
		 * @private
		 * Forces rendering of the target's transforms (rotation, scale, etc.) whenever the CSSPlugin's setRatio() is called.
		 * Basically, this tells the CSSPlugin to create a CSSPropTween (type 2) after instantiation that runs last in the linked
		 * list and calls the appropriate (3D or 2D) rendering function. We separate this into its own method so that we can call
		 * it from other plugins like BezierPlugin if, for example, it needs to apply an autoRotation and this CSSPlugin
		 * doesn't have any transform-related properties of its own. You can call this method as many times as you
		 * want and it won't create duplicate CSSPropTweens.
		 *
		 * @param {boolean} threeD if true, it should apply 3D tweens (otherwise, just 2D ones are fine and typically faster)
		 */
		p._enableTransforms = function(threeD) {
			this._transform = this._transform || _getTransform(this._target, _cs, true); //ensures that the element has a _gsTransform property with the appropriate values.
			this._transformType = (!(this._transform.svg && _useSVGTransformAttr) && (threeD || this._transformType === 3)) ? 3 : 2;
		};

		var lazySet = function(v) {
			this.t[this.p] = this.e;
			this.data._linkCSSP(this, this._next, null, true); //we purposefully keep this._next even though it'd make sense to null it, but this is a performance optimization, as this happens during the while (pt) {} loop in setRatio() at the bottom of which it sets pt = pt._next, so if we null it, the linked list will be broken in that loop.
		};
		/** @private Gives us a way to set a value on the first render (and only the first render). **/
		p._addLazySet = function(t, p, v) {
			var pt = this._firstPT = new CSSPropTween(t, p, 0, 0, this._firstPT, 2);
			pt.e = v;
			pt.setRatio = lazySet;
			pt.data = this;
		};

		/** @private **/
		p._linkCSSP = function(pt, next, prev, remove) {
			if (pt) {
				if (next) {
					next._prev = pt;
				}
				if (pt._next) {
					pt._next._prev = pt._prev;
				}
				if (pt._prev) {
					pt._prev._next = pt._next;
				} else if (this._firstPT === pt) {
					this._firstPT = pt._next;
					remove = true; //just to prevent resetting this._firstPT 5 lines down in case pt._next is null. (optimized for speed)
				}
				if (prev) {
					prev._next = pt;
				} else if (!remove && this._firstPT === null) {
					this._firstPT = pt;
				}
				pt._next = next;
				pt._prev = prev;
			}
			return pt;
		};

		p._mod = function(lookup) {
			var pt = this._firstPT;
			while (pt) {
				if (typeof(lookup[pt.p]) === "function" && lookup[pt.p] === Math.round) { //only gets called by RoundPropsPlugin (ModifyPlugin manages all the rendering internally for CSSPlugin properties that need modification). Remember, we handle rounding a bit differently in this plugin for performance reasons, leveraging "r" as an indicator that the value should be rounded internally..
					pt.r = 1;
				}
				pt = pt._next;
			}
		};

		//we need to make sure that if alpha or autoAlpha is killed, opacity is too. And autoAlpha affects the "visibility" property.
		p._kill = function(lookup) {
			var copy = lookup,
				pt, p, xfirst;
			if (lookup.autoAlpha || lookup.alpha) {
				copy = {};
				for (p in lookup) { //copy the lookup so that we're not changing the original which may be passed elsewhere.
					copy[p] = lookup[p];
				}
				copy.opacity = 1;
				if (copy.autoAlpha) {
					copy.visibility = 1;
				}
			}
			if (lookup.className && (pt = this._classNamePT)) { //for className tweens, we need to kill any associated CSSPropTweens too; a linked list starts at the className's "xfirst".
				xfirst = pt.xfirst;
				if (xfirst && xfirst._prev) {
					this._linkCSSP(xfirst._prev, pt._next, xfirst._prev._prev); //break off the prev
				} else if (xfirst === this._firstPT) {
					this._firstPT = pt._next;
				}
				if (pt._next) {
					this._linkCSSP(pt._next, pt._next._next, xfirst._prev);
				}
				this._classNamePT = null;
			}
			pt = this._firstPT;
			while (pt) {
				if (pt.plugin && pt.plugin !== p && pt.plugin._kill) { //for plugins that are registered with CSSPlugin, we should notify them of the kill.
					pt.plugin._kill(lookup);
					p = pt.plugin;
				}
				pt = pt._next;
			}
			return TweenPlugin.prototype._kill.call(this, copy);
		};



		//used by cascadeTo() for gathering all the style properties of each child element into an array for comparison.
		var _getChildStyles = function(e, props, targets) {
				var children, i, child, type;
				if (e.slice) {
					i = e.length;
					while (--i > -1) {
						_getChildStyles(e[i], props, targets);
					}
					return;
				}
				children = e.childNodes;
				i = children.length;
				while (--i > -1) {
					child = children[i];
					type = child.type;
					if (child.style) {
						props.push(_getAllStyles(child));
						if (targets) {
							targets.push(child);
						}
					}
					if ((type === 1 || type === 9 || type === 11) && child.childNodes.length) {
						_getChildStyles(child, props, targets);
					}
				}
			};

		/**
		 * Typically only useful for className tweens that may affect child elements, this method creates a TweenLite
		 * and then compares the style properties of all the target's child elements at the tween's start and end, and
		 * if any are different, it also creates tweens for those and returns an array containing ALL of the resulting
		 * tweens (so that you can easily add() them to a TimelineLite, for example). The reason this functionality is
		 * wrapped into a separate static method of CSSPlugin instead of being integrated into all regular className tweens
		 * is because it creates entirely new tweens that may have completely different targets than the original tween,
		 * so if they were all lumped into the original tween instance, it would be inconsistent with the rest of the API
		 * and it would create other problems. For example:
		 *  - If I create a tween of elementA, that tween instance may suddenly change its target to include 50 other elements (unintuitive if I specifically defined the target I wanted)
		 *  - We can't just create new independent tweens because otherwise, what happens if the original/parent tween is reversed or pause or dropped into a TimelineLite for tight control? You'd expect that tween's behavior to affect all the others.
		 *  - Analyzing every style property of every child before and after the tween is an expensive operation when there are many children, so this behavior shouldn't be imposed on all className tweens by default, especially since it's probably rare that this extra functionality is needed.
		 *
		 * @param {Object} target object to be tweened
		 * @param {number} Duration in seconds (or frames for frames-based tweens)
		 * @param {Object} Object containing the end values, like {className:"newClass", ease:Linear.easeNone}
		 * @return {Array} An array of TweenLite instances
		 */
		CSSPlugin.cascadeTo = function(target, duration, vars) {
			var tween = TweenLite.to(target, duration, vars),
				results = [tween],
				b = [],
				e = [],
				targets = [],
				_reservedProps = TweenLite._internals.reservedProps,
				i, difs, p, from;
			target = tween._targets || tween.target;
			_getChildStyles(target, b, targets);
			tween.render(duration, true, true);
			_getChildStyles(target, e);
			tween.render(0, true, true);
			tween._enabled(true);
			i = targets.length;
			while (--i > -1) {
				difs = _cssDif(targets[i], b[i], e[i]);
				if (difs.firstMPT) {
					difs = difs.difs;
					for (p in vars) {
						if (_reservedProps[p]) {
							difs[p] = vars[p];
						}
					}
					from = {};
					for (p in difs) {
						from[p] = b[i][p];
					}
					results.push(TweenLite.fromTo(targets[i], duration, from, difs));
				}
			}
			return results;
		};

		TweenPlugin.activate([CSSPlugin]);
		return CSSPlugin;

	}, true);

	
	
	
	
	
	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * RoundPropsPlugin
 * ----------------------------------------------------------------
 */
	(function() {

		var RoundPropsPlugin = _gsScope._gsDefine.plugin({
				propName: "roundProps",
				version: "1.6.0",
				priority: -1,
				API: 2,

				//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
				init: function(target, value, tween) {
					this._tween = tween;
					return true;
				}

			}),
			_roundLinkedList = function(node) {
				while (node) {
					if (!node.f && !node.blob) {
						node.m = Math.round;
					}
					node = node._next;
				}
			},
			p = RoundPropsPlugin.prototype;

		p._onInitAllProps = function() {
			var tween = this._tween,
				rp = (tween.vars.roundProps.join) ? tween.vars.roundProps : tween.vars.roundProps.split(","),
				i = rp.length,
				lookup = {},
				rpt = tween._propLookup.roundProps,
				prop, pt, next;
			while (--i > -1) {
				lookup[rp[i]] = Math.round;
			}
			i = rp.length;
			while (--i > -1) {
				prop = rp[i];
				pt = tween._firstPT;
				while (pt) {
					next = pt._next; //record here, because it may get removed
					if (pt.pg) {
						pt.t._mod(lookup);
					} else if (pt.n === prop) {
						if (pt.f === 2 && pt.t) { //a blob (text containing multiple numeric values)
							_roundLinkedList(pt.t._firstPT);
						} else {
							this._add(pt.t, prop, pt.s, pt.c);
							//remove from linked list
							if (next) {
								next._prev = pt._prev;
							}
							if (pt._prev) {
								pt._prev._next = next;
							} else if (tween._firstPT === pt) {
								tween._firstPT = next;
							}
							pt._next = pt._prev = null;
							tween._propLookup[prop] = rpt;
						}
					}
					pt = next;
				}
			}
			return false;
		};

		p._add = function(target, p, s, c) {
			this._addTween(target, p, s, s + c, p, Math.round);
			this._overwriteProps.push(p);
		};

	}());










/*
 * ----------------------------------------------------------------
 * AttrPlugin
 * ----------------------------------------------------------------
 */

	(function() {

		_gsScope._gsDefine.plugin({
			propName: "attr",
			API: 2,
			version: "0.6.0",

			//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
			init: function(target, value, tween, index) {
				var p, end;
				if (typeof(target.setAttribute) !== "function") {
					return false;
				}
				for (p in value) {
					end = value[p];
					if (typeof(end) === "function") {
						end = end(index, target);
					}
					this._addTween(target, "setAttribute", target.getAttribute(p) + "", end + "", p, false, p);
					this._overwriteProps.push(p);
				}
				return true;
			}

		});

	}());










/*
 * ----------------------------------------------------------------
 * DirectionalRotationPlugin
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine.plugin({
		propName: "directionalRotation",
		version: "0.3.0",
		API: 2,

		//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
		init: function(target, value, tween, index) {
			if (typeof(value) !== "object") {
				value = {rotation:value};
			}
			this.finals = {};
			var cap = (value.useRadians === true) ? Math.PI * 2 : 360,
				min = 0.000001,
				p, v, start, end, dif, split;
			for (p in value) {
				if (p !== "useRadians") {
					end = value[p];
					if (typeof(end) === "function") {
						end = end(index, target);
					}
					split = (end + "").split("_");
					v = split[0];
					start = parseFloat( (typeof(target[p]) !== "function") ? target[p] : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]() );
					end = this.finals[p] = (typeof(v) === "string" && v.charAt(1) === "=") ? start + parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : Number(v) || 0;
					dif = end - start;
					if (split.length) {
						v = split.join("_");
						if (v.indexOf("short") !== -1) {
							dif = dif % cap;
							if (dif !== dif % (cap / 2)) {
								dif = (dif < 0) ? dif + cap : dif - cap;
							}
						}
						if (v.indexOf("_cw") !== -1 && dif < 0) {
							dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						} else if (v.indexOf("ccw") !== -1 && dif > 0) {
							dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						}
					}
					if (dif > min || dif < -min) {
						this._addTween(target, p, start, start + dif, p);
						this._overwriteProps.push(p);
					}
				}
			}
			return true;
		},

		//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
		set: function(ratio) {
			var pt;
			if (ratio !== 1) {
				this._super.setRatio.call(this, ratio);
			} else {
				pt = this._firstPT;
				while (pt) {
					if (pt.f) {
						pt.t[pt.p](this.finals[pt.p]);
					} else {
						pt.t[pt.p] = this.finals[pt.p];
					}
					pt = pt._next;
				}
			}
		}

	})._autoCSS = true;







	
	
	
	
/*
 * ----------------------------------------------------------------
 * EasePack
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine("easing.Back", ["easing.Ease"], function(Ease) {
		
		var w = (_gsScope.GreenSockGlobals || _gsScope),
			gs = w.com.greensock,
			_2PI = Math.PI * 2,
			_HALF_PI = Math.PI / 2,
			_class = gs._class,
			_create = function(n, f) {
				var C = _class("easing." + n, function(){}, true),
					p = C.prototype = new Ease();
				p.constructor = C;
				p.getRatio = f;
				return C;
			},
			_easeReg = Ease.register || function(){}, //put an empty function in place just as a safety measure in case someone loads an OLD version of TweenLite.js where Ease.register doesn't exist.
			_wrap = function(name, EaseOut, EaseIn, EaseInOut, aliases) {
				var C = _class("easing."+name, {
					easeOut:new EaseOut(),
					easeIn:new EaseIn(),
					easeInOut:new EaseInOut()
				}, true);
				_easeReg(C, name);
				return C;
			},
			EasePoint = function(time, value, next) {
				this.t = time;
				this.v = value;
				if (next) {
					this.next = next;
					next.prev = this;
					this.c = next.v - value;
					this.gap = next.t - time;
				}
			},

			//Back
			_createBack = function(n, f) {
				var C = _class("easing." + n, function(overshoot) {
						this._p1 = (overshoot || overshoot === 0) ? overshoot : 1.70158;
						this._p2 = this._p1 * 1.525;
					}, true),
					p = C.prototype = new Ease();
				p.constructor = C;
				p.getRatio = f;
				p.config = function(overshoot) {
					return new C(overshoot);
				};
				return C;
			},

			Back = _wrap("Back",
				_createBack("BackOut", function(p) {
					return ((p = p - 1) * p * ((this._p1 + 1) * p + this._p1) + 1);
				}),
				_createBack("BackIn", function(p) {
					return p * p * ((this._p1 + 1) * p - this._p1);
				}),
				_createBack("BackInOut", function(p) {
					return ((p *= 2) < 1) ? 0.5 * p * p * ((this._p2 + 1) * p - this._p2) : 0.5 * ((p -= 2) * p * ((this._p2 + 1) * p + this._p2) + 2);
				})
			),


			//SlowMo
			SlowMo = _class("easing.SlowMo", function(linearRatio, power, yoyoMode) {
				power = (power || power === 0) ? power : 0.7;
				if (linearRatio == null) {
					linearRatio = 0.7;
				} else if (linearRatio > 1) {
					linearRatio = 1;
				}
				this._p = (linearRatio !== 1) ? power : 0;
				this._p1 = (1 - linearRatio) / 2;
				this._p2 = linearRatio;
				this._p3 = this._p1 + this._p2;
				this._calcEnd = (yoyoMode === true);
			}, true),
			p = SlowMo.prototype = new Ease(),
			SteppedEase, RoughEase, _createElastic;

		p.constructor = SlowMo;
		p.getRatio = function(p) {
			var r = p + (0.5 - p) * this._p;
			if (p < this._p1) {
				return this._calcEnd ? 1 - ((p = 1 - (p / this._p1)) * p) : r - ((p = 1 - (p / this._p1)) * p * p * p * r);
			} else if (p > this._p3) {
				return this._calcEnd ? 1 - (p = (p - this._p3) / this._p1) * p : r + ((p - r) * (p = (p - this._p3) / this._p1) * p * p * p);
			}
			return this._calcEnd ? 1 : r;
		};
		SlowMo.ease = new SlowMo(0.7, 0.7);

		p.config = SlowMo.config = function(linearRatio, power, yoyoMode) {
			return new SlowMo(linearRatio, power, yoyoMode);
		};


		//SteppedEase
		SteppedEase = _class("easing.SteppedEase", function(steps) {
				steps = steps || 1;
				this._p1 = 1 / steps;
				this._p2 = steps + 1;
			}, true);
		p = SteppedEase.prototype = new Ease();
		p.constructor = SteppedEase;
		p.getRatio = function(p) {
			if (p < 0) {
				p = 0;
			} else if (p >= 1) {
				p = 0.999999999;
			}
			return ((this._p2 * p) >> 0) * this._p1;
		};
		p.config = SteppedEase.config = function(steps) {
			return new SteppedEase(steps);
		};


		//RoughEase
		RoughEase = _class("easing.RoughEase", function(vars) {
			vars = vars || {};
			var taper = vars.taper || "none",
				a = [],
				cnt = 0,
				points = (vars.points || 20) | 0,
				i = points,
				randomize = (vars.randomize !== false),
				clamp = (vars.clamp === true),
				template = (vars.template instanceof Ease) ? vars.template : null,
				strength = (typeof(vars.strength) === "number") ? vars.strength * 0.4 : 0.4,
				x, y, bump, invX, obj, pnt;
			while (--i > -1) {
				x = randomize ? Math.random() : (1 / points) * i;
				y = template ? template.getRatio(x) : x;
				if (taper === "none") {
					bump = strength;
				} else if (taper === "out") {
					invX = 1 - x;
					bump = invX * invX * strength;
				} else if (taper === "in") {
					bump = x * x * strength;
				} else if (x < 0.5) {  //"both" (start)
					invX = x * 2;
					bump = invX * invX * 0.5 * strength;
				} else {				//"both" (end)
					invX = (1 - x) * 2;
					bump = invX * invX * 0.5 * strength;
				}
				if (randomize) {
					y += (Math.random() * bump) - (bump * 0.5);
				} else if (i % 2) {
					y += bump * 0.5;
				} else {
					y -= bump * 0.5;
				}
				if (clamp) {
					if (y > 1) {
						y = 1;
					} else if (y < 0) {
						y = 0;
					}
				}
				a[cnt++] = {x:x, y:y};
			}
			a.sort(function(a, b) {
				return a.x - b.x;
			});

			pnt = new EasePoint(1, 1, null);
			i = points;
			while (--i > -1) {
				obj = a[i];
				pnt = new EasePoint(obj.x, obj.y, pnt);
			}

			this._prev = new EasePoint(0, 0, (pnt.t !== 0) ? pnt : pnt.next);
		}, true);
		p = RoughEase.prototype = new Ease();
		p.constructor = RoughEase;
		p.getRatio = function(p) {
			var pnt = this._prev;
			if (p > pnt.t) {
				while (pnt.next && p >= pnt.t) {
					pnt = pnt.next;
				}
				pnt = pnt.prev;
			} else {
				while (pnt.prev && p <= pnt.t) {
					pnt = pnt.prev;
				}
			}
			this._prev = pnt;
			return (pnt.v + ((p - pnt.t) / pnt.gap) * pnt.c);
		};
		p.config = function(vars) {
			return new RoughEase(vars);
		};
		RoughEase.ease = new RoughEase();


		//Bounce
		_wrap("Bounce",
			_create("BounceOut", function(p) {
				if (p < 1 / 2.75) {
					return 7.5625 * p * p;
				} else if (p < 2 / 2.75) {
					return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
				} else if (p < 2.5 / 2.75) {
					return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
				}
				return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
			}),
			_create("BounceIn", function(p) {
				if ((p = 1 - p) < 1 / 2.75) {
					return 1 - (7.5625 * p * p);
				} else if (p < 2 / 2.75) {
					return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
				} else if (p < 2.5 / 2.75) {
					return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
				}
				return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
			}),
			_create("BounceInOut", function(p) {
				var invert = (p < 0.5);
				if (invert) {
					p = 1 - (p * 2);
				} else {
					p = (p * 2) - 1;
				}
				if (p < 1 / 2.75) {
					p = 7.5625 * p * p;
				} else if (p < 2 / 2.75) {
					p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
				} else if (p < 2.5 / 2.75) {
					p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
				} else {
					p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
				}
				return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
			})
		);


		//CIRC
		_wrap("Circ",
			_create("CircOut", function(p) {
				return Math.sqrt(1 - (p = p - 1) * p);
			}),
			_create("CircIn", function(p) {
				return -(Math.sqrt(1 - (p * p)) - 1);
			}),
			_create("CircInOut", function(p) {
				return ((p*=2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
			})
		);


		//Elastic
		_createElastic = function(n, f, def) {
			var C = _class("easing." + n, function(amplitude, period) {
					this._p1 = (amplitude >= 1) ? amplitude : 1; //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
					this._p2 = (period || def) / (amplitude < 1 ? amplitude : 1);
					this._p3 = this._p2 / _2PI * (Math.asin(1 / this._p1) || 0);
					this._p2 = _2PI / this._p2; //precalculate to optimize
				}, true),
				p = C.prototype = new Ease();
			p.constructor = C;
			p.getRatio = f;
			p.config = function(amplitude, period) {
				return new C(amplitude, period);
			};
			return C;
		};
		_wrap("Elastic",
			_createElastic("ElasticOut", function(p) {
				return this._p1 * Math.pow(2, -10 * p) * Math.sin( (p - this._p3) * this._p2 ) + 1;
			}, 0.3),
			_createElastic("ElasticIn", function(p) {
				return -(this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * this._p2 ));
			}, 0.3),
			_createElastic("ElasticInOut", function(p) {
				return ((p *= 2) < 1) ? -0.5 * (this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 *(p -= 1)) * Math.sin( (p - this._p3) * this._p2 ) * 0.5 + 1;
			}, 0.45)
		);


		//Expo
		_wrap("Expo",
			_create("ExpoOut", function(p) {
				return 1 - Math.pow(2, -10 * p);
			}),
			_create("ExpoIn", function(p) {
				return Math.pow(2, 10 * (p - 1)) - 0.001;
			}),
			_create("ExpoInOut", function(p) {
				return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
			})
		);


		//Sine
		_wrap("Sine",
			_create("SineOut", function(p) {
				return Math.sin(p * _HALF_PI);
			}),
			_create("SineIn", function(p) {
				return -Math.cos(p * _HALF_PI) + 1;
			}),
			_create("SineInOut", function(p) {
				return -0.5 * (Math.cos(Math.PI * p) - 1);
			})
		);

		_class("easing.EaseLookup", {
				find:function(s) {
					return Ease.map[s];
				}
			}, true);

		//register the non-standard eases
		_easeReg(w.SlowMo, "SlowMo", "ease,");
		_easeReg(RoughEase, "RoughEase", "ease,");
		_easeReg(SteppedEase, "SteppedEase", "ease,");

		return Back;
		
	}, true);


});

if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); } //necessary in case TweenLite was already loaded separately.











/*
 * ----------------------------------------------------------------
 * Base classes like TweenLite, SimpleTimeline, Ease, Ticker, etc.
 * ----------------------------------------------------------------
 */
(function(window, moduleName) {

		"use strict";
		var _exports = {},
			_globals = window.GreenSockGlobals = window.GreenSockGlobals || window;
		if (_globals.TweenLite) {
			return; //in case the core set of classes is already loaded, don't instantiate twice.
		}
		var _namespace = function(ns) {
				var a = ns.split("."),
					p = _globals, i;
				for (i = 0; i < a.length; i++) {
					p[a[i]] = p = p[a[i]] || {};
				}
				return p;
			},
			gs = _namespace("com.greensock"),
			_tinyNum = 0.0000000001,
			_slice = function(a) { //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
				var b = [],
					l = a.length,
					i;
				for (i = 0; i !== l; b.push(a[i++])) {}
				return b;
			},
			_emptyFunc = function() {},
			_isArray = (function() { //works around issues in iframe environments where the Array global isn't shared, thus if the object originates in a different window/iframe, "(obj instanceof Array)" will evaluate false. We added some speed optimizations to avoid Object.prototype.toString.call() unless it's absolutely necessary because it's VERY slow (like 20x slower)
				var toString = Object.prototype.toString,
					array = toString.call([]);
				return function(obj) {
					return obj != null && (obj instanceof Array || (typeof(obj) === "object" && !!obj.push && toString.call(obj) === array));
				};
			}()),
			a, i, p, _ticker, _tickerActive,
			_defLookup = {},

			/**
			 * @constructor
			 * Defines a GreenSock class, optionally with an array of dependencies that must be instantiated first and passed into the definition.
			 * This allows users to load GreenSock JS files in any order even if they have interdependencies (like CSSPlugin extends TweenPlugin which is
			 * inside TweenLite.js, but if CSSPlugin is loaded first, it should wait to run its code until TweenLite.js loads and instantiates TweenPlugin
			 * and then pass TweenPlugin to CSSPlugin's definition). This is all done automatically and internally.
			 *
			 * Every definition will be added to a "com.greensock" global object (typically window, but if a window.GreenSockGlobals object is found,
			 * it will go there as of v1.7). For example, TweenLite will be found at window.com.greensock.TweenLite and since it's a global class that should be available anywhere,
			 * it is ALSO referenced at window.TweenLite. However some classes aren't considered global, like the base com.greensock.core.Animation class, so
			 * those will only be at the package like window.com.greensock.core.Animation. Again, if you define a GreenSockGlobals object on the window, everything
			 * gets tucked neatly inside there instead of on the window directly. This allows you to do advanced things like load multiple versions of GreenSock
			 * files and put them into distinct objects (imagine a banner ad uses a newer version but the main site uses an older one). In that case, you could
			 * sandbox the banner one like:
			 *
			 * <script>
			 *     var gs = window.GreenSockGlobals = {}; //the newer version we're about to load could now be referenced in a "gs" object, like gs.TweenLite.to(...). Use whatever alias you want as long as it's unique, "gs" or "banner" or whatever.
			 * </script>
			 * <script src="js/greensock/v1.7/TweenMax.js"></script>
			 * <script>
			 *     window.GreenSockGlobals = window._gsQueue = window._gsDefine = null; //reset it back to null (along with the special _gsQueue variable) so that the next load of TweenMax affects the window and we can reference things directly like TweenLite.to(...)
			 * </script>
			 * <script src="js/greensock/v1.6/TweenMax.js"></script>
			 * <script>
			 *     gs.TweenLite.to(...); //would use v1.7
			 *     TweenLite.to(...); //would use v1.6
			 * </script>
			 *
			 * @param {!string} ns The namespace of the class definition, leaving off "com.greensock." as that's assumed. For example, "TweenLite" or "plugins.CSSPlugin" or "easing.Back".
			 * @param {!Array.<string>} dependencies An array of dependencies (described as their namespaces minus "com.greensock." prefix). For example ["TweenLite","plugins.TweenPlugin","core.Animation"]
			 * @param {!function():Object} func The function that should be called and passed the resolved dependencies which will return the actual class for this definition.
			 * @param {boolean=} global If true, the class will be added to the global scope (typically window unless you define a window.GreenSockGlobals object)
			 */
			Definition = function(ns, dependencies, func, global) {
				this.sc = (_defLookup[ns]) ? _defLookup[ns].sc : []; //subclasses
				_defLookup[ns] = this;
				this.gsClass = null;
				this.func = func;
				var _classes = [];
				this.check = function(init) {
					var i = dependencies.length,
						missing = i,
						cur, a, n, cl, hasModule;
					while (--i > -1) {
						if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
							_classes[i] = cur.gsClass;
							missing--;
						} else if (init) {
							cur.sc.push(this);
						}
					}
					if (missing === 0 && func) {
						a = ("com.greensock." + ns).split(".");
						n = a.pop();
						cl = _namespace(a.join("."))[n] = this.gsClass = func.apply(func, _classes);

						//exports to multiple environments
						if (global) {
							_globals[n] = _exports[n] = cl; //provides a way to avoid global namespace pollution. By default, the main classes like TweenLite, Power1, Strong, etc. are added to window unless a GreenSockGlobals is defined. So if you want to have things added to a custom object instead, just do something like window.GreenSockGlobals = {} before loading any GreenSock files. You can even set up an alias like window.GreenSockGlobals = windows.gs = {} so that you can access everything like gs.TweenLite. Also remember that ALL classes are added to the window.com.greensock object (in their respective packages, like com.greensock.easing.Power1, com.greensock.TweenLite, etc.)
							hasModule = (typeof(module) !== "undefined" && module.exports);
							if (!hasModule && typeof(define) === "function" && define.amd){ //AMD
								define((window.GreenSockAMDPath ? window.GreenSockAMDPath + "/" : "") + ns.split(".").pop(), [], function() { return cl; });
							} else if (hasModule){ //node
								if (ns === moduleName) {
									module.exports = _exports[moduleName] = cl;
									for (i in _exports) {
										cl[i] = _exports[i];
									}
								} else if (_exports[moduleName]) {
									_exports[moduleName][n] = cl;
								}
							}
						}
						for (i = 0; i < this.sc.length; i++) {
							this.sc[i].check();
						}
					}
				};
				this.check(true);
			},

			//used to create Definition instances (which basically registers a class that has dependencies).
			_gsDefine = window._gsDefine = function(ns, dependencies, func, global) {
				return new Definition(ns, dependencies, func, global);
			},

			//a quick way to create a class that doesn't have any dependencies. Returns the class, but first registers it in the GreenSock namespace so that other classes can grab it (other classes might be dependent on the class).
			_class = gs._class = function(ns, func, global) {
				func = func || function() {};
				_gsDefine(ns, [], function(){ return func; }, global);
				return func;
			};

		_gsDefine.globals = _globals;



/*
 * ----------------------------------------------------------------
 * Ease
 * ----------------------------------------------------------------
 */
		var _baseParams = [0, 0, 1, 1],
			_blankArray = [],
			Ease = _class("easing.Ease", function(func, extraParams, type, power) {
				this._func = func;
				this._type = type || 0;
				this._power = power || 0;
				this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
			}, true),
			_easeMap = Ease.map = {},
			_easeReg = Ease.register = function(ease, names, types, create) {
				var na = names.split(","),
					i = na.length,
					ta = (types || "easeIn,easeOut,easeInOut").split(","),
					e, name, j, type;
				while (--i > -1) {
					name = na[i];
					e = create ? _class("easing."+name, null, true) : gs.easing[name] || {};
					j = ta.length;
					while (--j > -1) {
						type = ta[j];
						_easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease();
					}
				}
			};

		p = Ease.prototype;
		p._calcEnd = false;
		p.getRatio = function(p) {
			if (this._func) {
				this._params[0] = p;
				return this._func.apply(null, this._params);
			}
			var t = this._type,
				pw = this._power,
				r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;
			if (pw === 1) {
				r *= r;
			} else if (pw === 2) {
				r *= r * r;
			} else if (pw === 3) {
				r *= r * r * r;
			} else if (pw === 4) {
				r *= r * r * r * r;
			}
			return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
		};

		//create all the standard eases like Linear, Quad, Cubic, Quart, Quint, Strong, Power0, Power1, Power2, Power3, and Power4 (each with easeIn, easeOut, and easeInOut)
		a = ["Linear","Quad","Cubic","Quart","Quint,Strong"];
		i = a.length;
		while (--i > -1) {
			p = a[i]+",Power"+i;
			_easeReg(new Ease(null,null,1,i), p, "easeOut", true);
			_easeReg(new Ease(null,null,2,i), p, "easeIn" + ((i === 0) ? ",easeNone" : ""));
			_easeReg(new Ease(null,null,3,i), p, "easeInOut");
		}
		_easeMap.linear = gs.easing.Linear.easeIn;
		_easeMap.swing = gs.easing.Quad.easeInOut; //for jQuery folks


/*
 * ----------------------------------------------------------------
 * EventDispatcher
 * ----------------------------------------------------------------
 */
		var EventDispatcher = _class("events.EventDispatcher", function(target) {
			this._listeners = {};
			this._eventTarget = target || this;
		});
		p = EventDispatcher.prototype;

		p.addEventListener = function(type, callback, scope, useParam, priority) {
			priority = priority || 0;
			var list = this._listeners[type],
				index = 0,
				listener, i;
			if (this === _ticker && !_tickerActive) {
				_ticker.wake();
			}
			if (list == null) {
				this._listeners[type] = list = [];
			}
			i = list.length;
			while (--i > -1) {
				listener = list[i];
				if (listener.c === callback && listener.s === scope) {
					list.splice(i, 1);
				} else if (index === 0 && listener.pr < priority) {
					index = i + 1;
				}
			}
			list.splice(index, 0, {c:callback, s:scope, up:useParam, pr:priority});
		};

		p.removeEventListener = function(type, callback) {
			var list = this._listeners[type], i;
			if (list) {
				i = list.length;
				while (--i > -1) {
					if (list[i].c === callback) {
						list.splice(i, 1);
						return;
					}
				}
			}
		};

		p.dispatchEvent = function(type) {
			var list = this._listeners[type],
				i, t, listener;
			if (list) {
				i = list.length;
				if (i > 1) {
					list = list.slice(0); //in case addEventListener() is called from within a listener/callback (otherwise the index could change, resulting in a skip)
				}
				t = this._eventTarget;
				while (--i > -1) {
					listener = list[i];
					if (listener) {
						if (listener.up) {
							listener.c.call(listener.s || t, {type:type, target:t});
						} else {
							listener.c.call(listener.s || t);
						}
					}
				}
			}
		};


/*
 * ----------------------------------------------------------------
 * Ticker
 * ----------------------------------------------------------------
 */
 		var _reqAnimFrame = window.requestAnimationFrame,
			_cancelAnimFrame = window.cancelAnimationFrame,
			_getTime = Date.now || function() {return new Date().getTime();},
			_lastUpdate = _getTime();

		//now try to determine the requestAnimationFrame and cancelAnimationFrame functions and if none are found, we'll use a setTimeout()/clearTimeout() polyfill.
		a = ["ms","moz","webkit","o"];
		i = a.length;
		while (--i > -1 && !_reqAnimFrame) {
			_reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
			_cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
		}

		_class("Ticker", function(fps, useRAF) {
			var _self = this,
				_startTime = _getTime(),
				_useRAF = (useRAF !== false && _reqAnimFrame) ? "auto" : false,
				_lagThreshold = 500,
				_adjustedLag = 33,
				_tickWord = "tick", //helps reduce gc burden
				_fps, _req, _id, _gap, _nextTime,
				_tick = function(manual) {
					var elapsed = _getTime() - _lastUpdate,
						overlap, dispatch;
					if (elapsed > _lagThreshold) {
						_startTime += elapsed - _adjustedLag;
					}
					_lastUpdate += elapsed;
					_self.time = (_lastUpdate - _startTime) / 1000;
					overlap = _self.time - _nextTime;
					if (!_fps || overlap > 0 || manual === true) {
						_self.frame++;
						_nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
						dispatch = true;
					}
					if (manual !== true) { //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
						_id = _req(_tick);
					}
					if (dispatch) {
						_self.dispatchEvent(_tickWord);
					}
				};

			EventDispatcher.call(_self);
			_self.time = _self.frame = 0;
			_self.tick = function() {
				_tick(true);
			};

			_self.lagSmoothing = function(threshold, adjustedLag) {
				_lagThreshold = threshold || (1 / _tinyNum); //zero should be interpreted as basically unlimited
				_adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
			};

			_self.sleep = function() {
				if (_id == null) {
					return;
				}
				if (!_useRAF || !_cancelAnimFrame) {
					clearTimeout(_id);
				} else {
					_cancelAnimFrame(_id);
				}
				_req = _emptyFunc;
				_id = null;
				if (_self === _ticker) {
					_tickerActive = false;
				}
			};

			_self.wake = function(seamless) {
				if (_id !== null) {
					_self.sleep();
				} else if (seamless) {
					_startTime += -_lastUpdate + (_lastUpdate = _getTime());
				} else if (_self.frame > 10) { //don't trigger lagSmoothing if we're just waking up, and make sure that at least 10 frames have elapsed because of the iOS bug that we work around below with the 1.5-second setTimout().
					_lastUpdate = _getTime() - _lagThreshold + 5;
				}
				_req = (_fps === 0) ? _emptyFunc : (!_useRAF || !_reqAnimFrame) ? function(f) { return setTimeout(f, ((_nextTime - _self.time) * 1000 + 1) | 0); } : _reqAnimFrame;
				if (_self === _ticker) {
					_tickerActive = true;
				}
				_tick(2);
			};

			_self.fps = function(value) {
				if (!arguments.length) {
					return _fps;
				}
				_fps = value;
				_gap = 1 / (_fps || 60);
				_nextTime = this.time + _gap;
				_self.wake();
			};

			_self.useRAF = function(value) {
				if (!arguments.length) {
					return _useRAF;
				}
				_self.sleep();
				_useRAF = value;
				_self.fps(_fps);
			};
			_self.fps(fps);

			//a bug in iOS 6 Safari occasionally prevents the requestAnimationFrame from working initially, so we use a 1.5-second timeout that automatically falls back to setTimeout() if it senses this condition.
			setTimeout(function() {
				if (_useRAF === "auto" && _self.frame < 5 && document.visibilityState !== "hidden") {
					_self.useRAF(false);
				}
			}, 1500);
		});

		p = gs.Ticker.prototype = new gs.events.EventDispatcher();
		p.constructor = gs.Ticker;


/*
 * ----------------------------------------------------------------
 * Animation
 * ----------------------------------------------------------------
 */
		var Animation = _class("core.Animation", function(duration, vars) {
				this.vars = vars = vars || {};
				this._duration = this._totalDuration = duration || 0;
				this._delay = Number(vars.delay) || 0;
				this._timeScale = 1;
				this._active = (vars.immediateRender === true);
				this.data = vars.data;
				this._reversed = (vars.reversed === true);

				if (!_rootTimeline) {
					return;
				}
				if (!_tickerActive) { //some browsers (like iOS 6 Safari) shut down JavaScript execution when the tab is disabled and they [occasionally] neglect to start up requestAnimationFrame again when returning - this code ensures that the engine starts up again properly.
					_ticker.wake();
				}

				var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
				tl.add(this, tl._time);

				if (this.vars.paused) {
					this.paused(true);
				}
			});

		_ticker = Animation.ticker = new gs.Ticker();
		p = Animation.prototype;
		p._dirty = p._gc = p._initted = p._paused = false;
		p._totalTime = p._time = 0;
		p._rawPrevTime = -1;
		p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
		p._paused = false;


		//some browsers (like iOS) occasionally drop the requestAnimationFrame event when the user switches to a different tab and then comes back again, so we use a 2-second setTimeout() to sense if/when that condition occurs and then wake() the ticker.
		var _checkTimeout = function() {
				if (_tickerActive && _getTime() - _lastUpdate > 2000) {
					_ticker.wake();
				}
				setTimeout(_checkTimeout, 2000);
			};
		_checkTimeout();


		p.play = function(from, suppressEvents) {
			if (from != null) {
				this.seek(from, suppressEvents);
			}
			return this.reversed(false).paused(false);
		};

		p.pause = function(atTime, suppressEvents) {
			if (atTime != null) {
				this.seek(atTime, suppressEvents);
			}
			return this.paused(true);
		};

		p.resume = function(from, suppressEvents) {
			if (from != null) {
				this.seek(from, suppressEvents);
			}
			return this.paused(false);
		};

		p.seek = function(time, suppressEvents) {
			return this.totalTime(Number(time), suppressEvents !== false);
		};

		p.restart = function(includeDelay, suppressEvents) {
			return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, (suppressEvents !== false), true);
		};

		p.reverse = function(from, suppressEvents) {
			if (from != null) {
				this.seek((from || this.totalDuration()), suppressEvents);
			}
			return this.reversed(true).paused(false);
		};

		p.render = function(time, suppressEvents, force) {
			//stub - we override this method in subclasses.
		};

		p.invalidate = function() {
			this._time = this._totalTime = 0;
			this._initted = this._gc = false;
			this._rawPrevTime = -1;
			if (this._gc || !this.timeline) {
				this._enabled(true);
			}
			return this;
		};

		p.isActive = function() {
			var tl = this._timeline, //the 2 root timelines won't have a _timeline; they're always active.
				startTime = this._startTime,
				rawTime;
			return (!tl || (!this._gc && !this._paused && tl.isActive() && (rawTime = tl.rawTime()) >= startTime && rawTime < startTime + this.totalDuration() / this._timeScale));
		};

		p._enabled = function (enabled, ignoreTimeline) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			this._gc = !enabled;
			this._active = this.isActive();
			if (ignoreTimeline !== true) {
				if (enabled && !this.timeline) {
					this._timeline.add(this, this._startTime - this._delay);
				} else if (!enabled && this.timeline) {
					this._timeline._remove(this, true);
				}
			}
			return false;
		};


		p._kill = function(vars, target) {
			return this._enabled(false, false);
		};

		p.kill = function(vars, target) {
			this._kill(vars, target);
			return this;
		};

		p._uncache = function(includeSelf) {
			var tween = includeSelf ? this : this.timeline;
			while (tween) {
				tween._dirty = true;
				tween = tween.timeline;
			}
			return this;
		};

		p._swapSelfInParams = function(params) {
			var i = params.length,
				copy = params.concat();
			while (--i > -1) {
				if (params[i] === "{self}") {
					copy[i] = this;
				}
			}
			return copy;
		};

		p._callback = function(type) {
			var v = this.vars,
				callback = v[type],
				params = v[type + "Params"],
				scope = v[type + "Scope"] || v.callbackScope || this,
				l = params ? params.length : 0;
			switch (l) { //speed optimization; call() is faster than apply() so use it when there are only a few parameters (which is by far most common). Previously we simply did var v = this.vars; v[type].apply(v[type + "Scope"] || v.callbackScope || this, v[type + "Params"] || _blankArray);
				case 0: callback.call(scope); break;
				case 1: callback.call(scope, params[0]); break;
				case 2: callback.call(scope, params[0], params[1]); break;
				default: callback.apply(scope, params);
			}
		};

//----Animation getters/setters --------------------------------------------------------

		p.eventCallback = function(type, callback, params, scope) {
			if ((type || "").substr(0,2) === "on") {
				var v = this.vars;
				if (arguments.length === 1) {
					return v[type];
				}
				if (callback == null) {
					delete v[type];
				} else {
					v[type] = callback;
					v[type + "Params"] = (_isArray(params) && params.join("").indexOf("{self}") !== -1) ? this._swapSelfInParams(params) : params;
					v[type + "Scope"] = scope;
				}
				if (type === "onUpdate") {
					this._onUpdate = callback;
				}
			}
			return this;
		};

		p.delay = function(value) {
			if (!arguments.length) {
				return this._delay;
			}
			if (this._timeline.smoothChildTiming) {
				this.startTime( this._startTime + value - this._delay );
			}
			this._delay = value;
			return this;
		};

		p.duration = function(value) {
			if (!arguments.length) {
				this._dirty = false;
				return this._duration;
			}
			this._duration = this._totalDuration = value;
			this._uncache(true); //true in case it's a TweenMax or TimelineMax that has a repeat - we'll need to refresh the totalDuration.
			if (this._timeline.smoothChildTiming) if (this._time > 0) if (this._time < this._duration) if (value !== 0) {
				this.totalTime(this._totalTime * (value / this._duration), true);
			}
			return this;
		};

		p.totalDuration = function(value) {
			this._dirty = false;
			return (!arguments.length) ? this._totalDuration : this.duration(value);
		};

		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			return this.totalTime((value > this._duration) ? this._duration : value, suppressEvents);
		};

		p.totalTime = function(time, suppressEvents, uncapped) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			if (!arguments.length) {
				return this._totalTime;
			}
			if (this._timeline) {
				if (time < 0 && !uncapped) {
					time += this.totalDuration();
				}
				if (this._timeline.smoothChildTiming) {
					if (this._dirty) {
						this.totalDuration();
					}
					var totalDuration = this._totalDuration,
						tl = this._timeline;
					if (time > totalDuration && !uncapped) {
						time = totalDuration;
					}
					this._startTime = (this._paused ? this._pauseTime : tl._time) - ((!this._reversed ? time : totalDuration - time) / this._timeScale);
					if (!tl._dirty) { //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
						this._uncache(false);
					}
					//in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The startTime of that child would get pushed out, but one of the ancestors may have completed.
					if (tl._timeline) {
						while (tl._timeline) {
							if (tl._timeline._time !== (tl._startTime + tl._totalTime) / tl._timeScale) {
								tl.totalTime(tl._totalTime, true);
							}
							tl = tl._timeline;
						}
					}
				}
				if (this._gc) {
					this._enabled(true, false);
				}
				if (this._totalTime !== time || this._duration === 0) {
					if (_lazyTweens.length) {
						_lazyRender();
					}
					this.render(time, suppressEvents, false);
					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
						_lazyRender();
					}
				}
			}
			return this;
		};

		p.progress = p.totalProgress = function(value, suppressEvents) {
			var duration = this.duration();
			return (!arguments.length) ? (duration ? this._time / duration : this.ratio) : this.totalTime(duration * value, suppressEvents);
		};

		p.startTime = function(value) {
			if (!arguments.length) {
				return this._startTime;
			}
			if (value !== this._startTime) {
				this._startTime = value;
				if (this.timeline) if (this.timeline._sortChildren) {
					this.timeline.add(this, value - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
				}
			}
			return this;
		};

		p.endTime = function(includeRepeats) {
			return this._startTime + ((includeRepeats != false) ? this.totalDuration() : this.duration()) / this._timeScale;
		};

		p.timeScale = function(value) {
			if (!arguments.length) {
				return this._timeScale;
			}
			value = value || _tinyNum; //can't allow zero because it'll throw the math off
			if (this._timeline && this._timeline.smoothChildTiming) {
				var pauseTime = this._pauseTime,
					t = (pauseTime || pauseTime === 0) ? pauseTime : this._timeline.totalTime();
				this._startTime = t - ((t - this._startTime) * this._timeScale / value);
			}
			this._timeScale = value;
			return this._uncache(false);
		};

		p.reversed = function(value) {
			if (!arguments.length) {
				return this._reversed;
			}
			if (value != this._reversed) {
				this._reversed = value;
				this.totalTime(((this._timeline && !this._timeline.smoothChildTiming) ? this.totalDuration() - this._totalTime : this._totalTime), true);
			}
			return this;
		};

		p.paused = function(value) {
			if (!arguments.length) {
				return this._paused;
			}
			var tl = this._timeline,
				raw, elapsed;
			if (value != this._paused) if (tl) {
				if (!_tickerActive && !value) {
					_ticker.wake();
				}
				raw = tl.rawTime();
				elapsed = raw - this._pauseTime;
				if (!value && tl.smoothChildTiming) {
					this._startTime += elapsed;
					this._uncache(false);
				}
				this._pauseTime = value ? raw : null;
				this._paused = value;
				this._active = this.isActive();
				if (!value && elapsed !== 0 && this._initted && this.duration()) {
					raw = tl.smoothChildTiming ? this._totalTime : (raw - this._startTime) / this._timeScale;
					this.render(raw, (raw === this._totalTime), true); //in case the target's properties changed via some other tween or manual update by the user, we should force a render.
				}
			}
			if (this._gc && !value) {
				this._enabled(true, false);
			}
			return this;
		};


/*
 * ----------------------------------------------------------------
 * SimpleTimeline
 * ----------------------------------------------------------------
 */
		var SimpleTimeline = _class("core.SimpleTimeline", function(vars) {
			Animation.call(this, 0, vars);
			this.autoRemoveChildren = this.smoothChildTiming = true;
		});

		p = SimpleTimeline.prototype = new Animation();
		p.constructor = SimpleTimeline;
		p.kill()._gc = false;
		p._first = p._last = p._recent = null;
		p._sortChildren = false;

		p.add = p.insert = function(child, position, align, stagger) {
			var prevTween, st;
			child._startTime = Number(position || 0) + child._delay;
			if (child._paused) if (this !== child._timeline) { //we only adjust the _pauseTime if it wasn't in this timeline already. Remember, sometimes a tween will be inserted again into the same timeline when its startTime is changed so that the tweens in the TimelineLite/Max are re-ordered properly in the linked list (so everything renders in the proper order).
				child._pauseTime = child._startTime + ((this.rawTime() - child._startTime) / child._timeScale);
			}
			if (child.timeline) {
				child.timeline._remove(child, true); //removes from existing timeline so that it can be properly added to this one.
			}
			child.timeline = child._timeline = this;
			if (child._gc) {
				child._enabled(true, true);
			}
			prevTween = this._last;
			if (this._sortChildren) {
				st = child._startTime;
				while (prevTween && prevTween._startTime > st) {
					prevTween = prevTween._prev;
				}
			}
			if (prevTween) {
				child._next = prevTween._next;
				prevTween._next = child;
			} else {
				child._next = this._first;
				this._first = child;
			}
			if (child._next) {
				child._next._prev = child;
			} else {
				this._last = child;
			}
			child._prev = prevTween;
			this._recent = child;
			if (this._timeline) {
				this._uncache(true);
			}
			return this;
		};

		p._remove = function(tween, skipDisable) {
			if (tween.timeline === this) {
				if (!skipDisable) {
					tween._enabled(false, true);
				}

				if (tween._prev) {
					tween._prev._next = tween._next;
				} else if (this._first === tween) {
					this._first = tween._next;
				}
				if (tween._next) {
					tween._next._prev = tween._prev;
				} else if (this._last === tween) {
					this._last = tween._prev;
				}
				tween._next = tween._prev = tween.timeline = null;
				if (tween === this._recent) {
					this._recent = this._last;
				}

				if (this._timeline) {
					this._uncache(true);
				}
			}
			return this;
		};

		p.render = function(time, suppressEvents, force) {
			var tween = this._first,
				next;
			this._totalTime = this._time = this._rawPrevTime = time;
			while (tween) {
				next = tween._next; //record it here because the value could change after rendering...
				if (tween._active || (time >= tween._startTime && !tween._paused)) {
					if (!tween._reversed) {
						tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
					} else {
						tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
					}
				}
				tween = next;
			}
		};

		p.rawTime = function() {
			if (!_tickerActive) {
				_ticker.wake();
			}
			return this._totalTime;
		};

/*
 * ----------------------------------------------------------------
 * TweenLite
 * ----------------------------------------------------------------
 */
		var TweenLite = _class("TweenLite", function(target, duration, vars) {
				Animation.call(this, duration, vars);
				this.render = TweenLite.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)

				if (target == null) {
					throw "Cannot tween a null target.";
				}

				this.target = target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;

				var isSelector = (target.jquery || (target.length && target !== window && target[0] && (target[0] === window || (target[0].nodeType && target[0].style && !target.nodeType)))),
					overwrite = this.vars.overwrite,
					i, targ, targets;

				this._overwrite = overwrite = (overwrite == null) ? _overwriteLookup[TweenLite.defaultOverwrite] : (typeof(overwrite) === "number") ? overwrite >> 0 : _overwriteLookup[overwrite];

				if ((isSelector || target instanceof Array || (target.push && _isArray(target))) && typeof(target[0]) !== "number") {
					this._targets = targets = _slice(target);  //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
					this._propLookup = [];
					this._siblings = [];
					for (i = 0; i < targets.length; i++) {
						targ = targets[i];
						if (!targ) {
							targets.splice(i--, 1);
							continue;
						} else if (typeof(targ) === "string") {
							targ = targets[i--] = TweenLite.selector(targ); //in case it's an array of strings
							if (typeof(targ) === "string") {
								targets.splice(i+1, 1); //to avoid an endless loop (can't imagine why the selector would return a string, but just in case)
							}
							continue;
						} else if (targ.length && targ !== window && targ[0] && (targ[0] === window || (targ[0].nodeType && targ[0].style && !targ.nodeType))) { //in case the user is passing in an array of selector objects (like jQuery objects), we need to check one more level and pull things out if necessary. Also note that <select> elements pass all the criteria regarding length and the first child having style, so we must also check to ensure the target isn't an HTML node itself.
							targets.splice(i--, 1);
							this._targets = targets = targets.concat(_slice(targ));
							continue;
						}
						this._siblings[i] = _register(targ, this, false);
						if (overwrite === 1) if (this._siblings[i].length > 1) {
							_applyOverwrite(targ, this, null, 1, this._siblings[i]);
						}
					}

				} else {
					this._propLookup = {};
					this._siblings = _register(target, this, false);
					if (overwrite === 1) if (this._siblings.length > 1) {
						_applyOverwrite(target, this, null, 1, this._siblings);
					}
				}
				if (this.vars.immediateRender || (duration === 0 && this._delay === 0 && this.vars.immediateRender !== false)) {
					this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
					this.render(Math.min(0, -this._delay)); //in case delay is negative
				}
			}, true),
			_isSelector = function(v) {
				return (v && v.length && v !== window && v[0] && (v[0] === window || (v[0].nodeType && v[0].style && !v.nodeType))); //we cannot check "nodeType" if the target is window from within an iframe, otherwise it will trigger a security error in some browsers like Firefox.
			},
			_autoCSS = function(vars, target) {
				var css = {},
					p;
				for (p in vars) {
					if (!_reservedProps[p] && (!(p in target) || p === "transform" || p === "x" || p === "y" || p === "width" || p === "height" || p === "className" || p === "border") && (!_plugins[p] || (_plugins[p] && _plugins[p]._autoCSS))) { //note: <img> elements contain read-only "x" and "y" properties. We should also prioritize editing css width/height rather than the element's properties.
						css[p] = vars[p];
						delete vars[p];
					}
				}
				vars.css = css;
			};

		p = TweenLite.prototype = new Animation();
		p.constructor = TweenLite;
		p.kill()._gc = false;

//----TweenLite defaults, overwrite management, and root updates ----------------------------------------------------

		p.ratio = 0;
		p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
		p._notifyPluginsOfEnabled = p._lazy = false;

		TweenLite.version = "1.19.0";
		TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
		TweenLite.defaultOverwrite = "auto";
		TweenLite.ticker = _ticker;
		TweenLite.autoSleep = 120;
		TweenLite.lagSmoothing = function(threshold, adjustedLag) {
			_ticker.lagSmoothing(threshold, adjustedLag);
		};

		TweenLite.selector = window.$ || window.jQuery || function(e) {
			var selector = window.$ || window.jQuery;
			if (selector) {
				TweenLite.selector = selector;
				return selector(e);
			}
			return (typeof(document) === "undefined") ? e : (document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById((e.charAt(0) === "#") ? e.substr(1) : e));
		};

		var _lazyTweens = [],
			_lazyLookup = {},
			_numbersExp = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
			//_nonNumbersExp = /(?:([\-+](?!(\d|=)))|[^\d\-+=e]|(e(?![\-+][\d])))+/ig,
			_setRatio = function(v) {
				var pt = this._firstPT,
					min = 0.000001,
					val;
				while (pt) {
					val = !pt.blob ? pt.c * v + pt.s : v ? this.join("") : this.start;
					if (pt.m) {
						val = pt.m(val, this._target || pt.t);
					} else if (val < min) if (val > -min) { //prevents issues with converting very small numbers to strings in the browser
						val = 0;
					}
					if (!pt.f) {
						pt.t[pt.p] = val;
					} else if (pt.fp) {
						pt.t[pt.p](pt.fp, val);
					} else {
						pt.t[pt.p](val);
					}
					pt = pt._next;
				}
			},
			//compares two strings (start/end), finds the numbers that are different and spits back an array representing the whole value but with the changing values isolated as elements. For example, "rgb(0,0,0)" and "rgb(100,50,0)" would become ["rgb(", 0, ",", 50, ",0)"]. Notice it merges the parts that are identical (performance optimization). The array also has a linked list of PropTweens attached starting with _firstPT that contain the tweening data (t, p, s, c, f, etc.). It also stores the starting value as a "start" property so that we can revert to it if/when necessary, like when a tween rewinds fully. If the quantity of numbers differs between the start and end, it will always prioritize the end value(s). The pt parameter is optional - it's for a PropTween that will be appended to the end of the linked list and is typically for actually setting the value after all of the elements have been updated (with array.join("")).
			_blobDif = function(start, end, filter, pt) {
				var a = [start, end],
					charIndex = 0,
					s = "",
					color = 0,
					startNums, endNums, num, i, l, nonNumbers, currentNum;
				a.start = start;
				if (filter) {
					filter(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.
					start = a[0];
					end = a[1];
				}
				a.length = 0;
				startNums = start.match(_numbersExp) || [];
				endNums = end.match(_numbersExp) || [];
				if (pt) {
					pt._next = null;
					pt.blob = 1;
					a._firstPT = a._applyPT = pt; //apply last in the linked list (which means inserting it first)
				}
				l = endNums.length;
				for (i = 0; i < l; i++) {
					currentNum = endNums[i];
					nonNumbers = end.substr(charIndex, end.indexOf(currentNum, charIndex)-charIndex);
					s += (nonNumbers || !i) ? nonNumbers : ","; //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
					charIndex += nonNumbers.length;
					if (color) { //sense rgba() values and round them.
						color = (color + 1) % 5;
					} else if (nonNumbers.substr(-5) === "rgba(") {
						color = 1;
					}
					if (currentNum === startNums[i] || startNums.length <= i) {
						s += currentNum;
					} else {
						if (s) {
							a.push(s);
							s = "";
						}
						num = parseFloat(startNums[i]);
						a.push(num);
						a._firstPT = {_next: a._firstPT, t:a, p: a.length-1, s:num, c:((currentNum.charAt(1) === "=") ? parseInt(currentNum.charAt(0) + "1", 10) * parseFloat(currentNum.substr(2)) : (parseFloat(currentNum) - num)) || 0, f:0, m:(color && color < 4) ? Math.round : 0};
						//note: we don't set _prev because we'll never need to remove individual PropTweens from this list.
					}
					charIndex += currentNum.length;
				}
				s += end.substr(charIndex);
				if (s) {
					a.push(s);
				}
				a.setRatio = _setRatio;
				return a;
			},
			//note: "funcParam" is only necessary for function-based getters/setters that require an extra parameter like getAttribute("width") and setAttribute("width", value). In this example, funcParam would be "width". Used by AttrPlugin for example.
			_addPropTween = function(target, prop, start, end, overwriteProp, mod, funcParam, stringFilter, index) {
				if (typeof(end) === "function") {
					end = end(index || 0, target);
				}
				var s = (start === "get") ? target[prop] : start,
					type = typeof(target[prop]),
					isRelative = (typeof(end) === "string" && end.charAt(1) === "="),
					pt = {t:target, p:prop, s:s, f:(type === "function"), pg:0, n:overwriteProp || prop, m:(!mod ? 0 : (typeof(mod) === "function") ? mod : Math.round), pr:0, c:isRelative ? parseInt(end.charAt(0) + "1", 10) * parseFloat(end.substr(2)) : (parseFloat(end) - s) || 0},
					blob, getterName;
				if (type !== "number") {
					if (type === "function" && start === "get") {
						getterName = ((prop.indexOf("set") || typeof(target["get" + prop.substr(3)]) !== "function") ? prop : "get" + prop.substr(3));
						pt.s = s = funcParam ? target[getterName](funcParam) : target[getterName]();
					}
					if (typeof(s) === "string" && (funcParam || isNaN(s))) {
						//a blob (string that has multiple numbers in it)
						pt.fp = funcParam;
						blob = _blobDif(s, end, stringFilter || TweenLite.defaultStringFilter, pt);
						pt = {t:blob, p:"setRatio", s:0, c:1, f:2, pg:0, n:overwriteProp || prop, pr:0, m:0}; //"2" indicates it's a Blob property tween. Needed for RoundPropsPlugin for example.
					} else if (!isRelative) {
						pt.s = parseFloat(s);
						pt.c = (parseFloat(end) - pt.s) || 0;
					}
				}
				if (pt.c) { //only add it to the linked list if there's a change.
					if ((pt._next = this._firstPT)) {
						pt._next._prev = pt;
					}
					this._firstPT = pt;
					return pt;
				}
			},
			_internals = TweenLite._internals = {isArray:_isArray, isSelector:_isSelector, lazyTweens:_lazyTweens, blobDif:_blobDif}, //gives us a way to expose certain private values to other GreenSock classes without contaminating tha main TweenLite object.
			_plugins = TweenLite._plugins = {},
			_tweenLookup = _internals.tweenLookup = {},
			_tweenLookupNum = 0,
			_reservedProps = _internals.reservedProps = {ease:1, delay:1, overwrite:1, onComplete:1, onCompleteParams:1, onCompleteScope:1, useFrames:1, runBackwards:1, startAt:1, onUpdate:1, onUpdateParams:1, onUpdateScope:1, onStart:1, onStartParams:1, onStartScope:1, onReverseComplete:1, onReverseCompleteParams:1, onReverseCompleteScope:1, onRepeat:1, onRepeatParams:1, onRepeatScope:1, easeParams:1, yoyo:1, immediateRender:1, repeat:1, repeatDelay:1, data:1, paused:1, reversed:1, autoCSS:1, lazy:1, onOverwrite:1, callbackScope:1, stringFilter:1, id:1},
			_overwriteLookup = {none:0, all:1, auto:2, concurrent:3, allOnStart:4, preexisting:5, "true":1, "false":0},
			_rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(),
			_rootTimeline = Animation._rootTimeline = new SimpleTimeline(),
			_nextGCFrame = 30,
			_lazyRender = _internals.lazyRender = function() {
				var i = _lazyTweens.length,
					tween;
				_lazyLookup = {};
				while (--i > -1) {
					tween = _lazyTweens[i];
					if (tween && tween._lazy !== false) {
						tween.render(tween._lazy[0], tween._lazy[1], true);
						tween._lazy = false;
					}
				}
				_lazyTweens.length = 0;
			};

		_rootTimeline._startTime = _ticker.time;
		_rootFramesTimeline._startTime = _ticker.frame;
		_rootTimeline._active = _rootFramesTimeline._active = true;
		setTimeout(_lazyRender, 1); //on some mobile devices, there isn't a "tick" before code runs which means any lazy renders wouldn't run before the next official "tick".

		Animation._updateRoot = TweenLite.render = function() {
				var i, a, p;
				if (_lazyTweens.length) { //if code is run outside of the requestAnimationFrame loop, there may be tweens queued AFTER the engine refreshed, so we need to ensure any pending renders occur before we refresh again.
					_lazyRender();
				}
				_rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);
				_rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);
				if (_lazyTweens.length) {
					_lazyRender();
				}
				if (_ticker.frame >= _nextGCFrame) { //dump garbage every 120 frames or whatever the user sets TweenLite.autoSleep to
					_nextGCFrame = _ticker.frame + (parseInt(TweenLite.autoSleep, 10) || 120);
					for (p in _tweenLookup) {
						a = _tweenLookup[p].tweens;
						i = a.length;
						while (--i > -1) {
							if (a[i]._gc) {
								a.splice(i, 1);
							}
						}
						if (a.length === 0) {
							delete _tweenLookup[p];
						}
					}
					//if there are no more tweens in the root timelines, or if they're all paused, make the _timer sleep to reduce load on the CPU slightly
					p = _rootTimeline._first;
					if (!p || p._paused) if (TweenLite.autoSleep && !_rootFramesTimeline._first && _ticker._listeners.tick.length === 1) {
						while (p && p._paused) {
							p = p._next;
						}
						if (!p) {
							_ticker.sleep();
						}
					}
				}
			};

		_ticker.addEventListener("tick", Animation._updateRoot);

		var _register = function(target, tween, scrub) {
				var id = target._gsTweenID, a, i;
				if (!_tweenLookup[id || (target._gsTweenID = id = "t" + (_tweenLookupNum++))]) {
					_tweenLookup[id] = {target:target, tweens:[]};
				}
				if (tween) {
					a = _tweenLookup[id].tweens;
					a[(i = a.length)] = tween;
					if (scrub) {
						while (--i > -1) {
							if (a[i] === tween) {
								a.splice(i, 1);
							}
						}
					}
				}
				return _tweenLookup[id].tweens;
			},
			_onOverwrite = function(overwrittenTween, overwritingTween, target, killedProps) {
				var func = overwrittenTween.vars.onOverwrite, r1, r2;
				if (func) {
					r1 = func(overwrittenTween, overwritingTween, target, killedProps);
				}
				func = TweenLite.onOverwrite;
				if (func) {
					r2 = func(overwrittenTween, overwritingTween, target, killedProps);
				}
				return (r1 !== false && r2 !== false);
			},
			_applyOverwrite = function(target, tween, props, mode, siblings) {
				var i, changed, curTween, l;
				if (mode === 1 || mode >= 4) {
					l = siblings.length;
					for (i = 0; i < l; i++) {
						if ((curTween = siblings[i]) !== tween) {
							if (!curTween._gc) {
								if (curTween._kill(null, target, tween)) {
									changed = true;
								}
							}
						} else if (mode === 5) {
							break;
						}
					}
					return changed;
				}
				//NOTE: Add 0.0000000001 to overcome floating point errors that can cause the startTime to be VERY slightly off (when a tween's time() is set for example)
				var startTime = tween._startTime + _tinyNum,
					overlaps = [],
					oCount = 0,
					zeroDur = (tween._duration === 0),
					globalStart;
				i = siblings.length;
				while (--i > -1) {
					if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) {
						//ignore
					} else if (curTween._timeline !== tween._timeline) {
						globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
						if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
							overlaps[oCount++] = curTween;
						}
					} else if (curTween._startTime <= startTime) if (curTween._startTime + curTween.totalDuration() / curTween._timeScale > startTime) if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= 0.0000000002)) {
						overlaps[oCount++] = curTween;
					}
				}

				i = oCount;
				while (--i > -1) {
					curTween = overlaps[i];
					if (mode === 2) if (curTween._kill(props, target, tween)) {
						changed = true;
					}
					if (mode !== 2 || (!curTween._firstPT && curTween._initted)) {
						if (mode !== 2 && !_onOverwrite(curTween, tween)) {
							continue;
						}
						if (curTween._enabled(false, false)) { //if all property tweens have been overwritten, kill the tween.
							changed = true;
						}
					}
				}
				return changed;
			},
			_checkOverlap = function(tween, reference, zeroDur) {
				var tl = tween._timeline,
					ts = tl._timeScale,
					t = tween._startTime;
				while (tl._timeline) {
					t += tl._startTime;
					ts *= tl._timeScale;
					if (tl._paused) {
						return -100;
					}
					tl = tl._timeline;
				}
				t /= ts;
				return (t > reference) ? t - reference : ((zeroDur && t === reference) || (!tween._initted && t - reference < 2 * _tinyNum)) ? _tinyNum : ((t += tween.totalDuration() / tween._timeScale / ts) > reference + _tinyNum) ? 0 : t - reference - _tinyNum;
			};


//---- TweenLite instance methods -----------------------------------------------------------------------------

		p._init = function() {
			var v = this.vars,
				op = this._overwrittenProps,
				dur = this._duration,
				immediate = !!v.immediateRender,
				ease = v.ease,
				i, initPlugins, pt, p, startVars, l;
			if (v.startAt) {
				if (this._startAt) {
					this._startAt.render(-1, true); //if we've run a startAt previously (when the tween instantiated), we should revert it so that the values re-instantiate correctly particularly for relative tweens. Without this, a TweenLite.fromTo(obj, 1, {x:"+=100"}, {x:"-=100"}), for example, would actually jump to +=200 because the startAt would run twice, doubling the relative change.
					this._startAt.kill();
				}
				startVars = {};
				for (p in v.startAt) { //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, 1, from, to).fromTo(e, 1, to, from);
					startVars[p] = v.startAt[p];
				}
				startVars.overwrite = false;
				startVars.immediateRender = true;
				startVars.lazy = (immediate && v.lazy !== false);
				startVars.startAt = startVars.delay = null; //no nesting of startAt objects allowed (otherwise it could cause an infinite loop).
				this._startAt = TweenLite.to(this.target, 0, startVars);
				if (immediate) {
					if (this._time > 0) {
						this._startAt = null; //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in TimelineLite/Max instances where immediateRender was false (which is the default in the convenience methods like from()).
					} else if (dur !== 0) {
						return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a TimelineLite or TimelineMax, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
					}
				}
			} else if (v.runBackwards && dur !== 0) {
				//from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
				if (this._startAt) {
					this._startAt.render(-1, true);
					this._startAt.kill();
					this._startAt = null;
				} else {
					if (this._time !== 0) { //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0
						immediate = false;
					}
					pt = {};
					for (p in v) { //copy props into a new object and skip any reserved props, otherwise onComplete or onUpdate or onStart could fire. We should, however, permit autoCSS to go through.
						if (!_reservedProps[p] || p === "autoCSS") {
							pt[p] = v[p];
						}
					}
					pt.overwrite = 0;
					pt.data = "isFromStart"; //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
					pt.lazy = (immediate && v.lazy !== false);
					pt.immediateRender = immediate; //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
					this._startAt = TweenLite.to(this.target, 0, pt);
					if (!immediate) {
						this._startAt._init(); //ensures that the initial values are recorded
						this._startAt._enabled(false); //no need to have the tween render on the next cycle. Disable it because we'll always manually control the renders of the _startAt tween.
						if (this.vars.immediateRender) {
							this._startAt = null;
						}
					} else if (this._time === 0) {
						return;
					}
				}
			}
			this._ease = ease = (!ease) ? TweenLite.defaultEase : (ease instanceof Ease) ? ease : (typeof(ease) === "function") ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase;
			if (v.easeParams instanceof Array && ease.config) {
				this._ease = ease.config.apply(ease, v.easeParams);
			}
			this._easeType = this._ease._type;
			this._easePower = this._ease._power;
			this._firstPT = null;

			if (this._targets) {
				l = this._targets.length;
				for (i = 0; i < l; i++) {
					if ( this._initProps( this._targets[i], (this._propLookup[i] = {}), this._siblings[i], (op ? op[i] : null), i) ) {
						initPlugins = true;
					}
				}
			} else {
				initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op, 0);
			}

			if (initPlugins) {
				TweenLite._onPluginEvent("_onInitAllProps", this); //reorders the array in order of priority. Uses a static TweenPlugin method in order to minimize file size in TweenLite
			}
			if (op) if (!this._firstPT) if (typeof(this.target) !== "function") { //if all tweening properties have been overwritten, kill the tween. If the target is a function, it's probably a delayedCall so let it live.
				this._enabled(false, false);
			}
			if (v.runBackwards) {
				pt = this._firstPT;
				while (pt) {
					pt.s += pt.c;
					pt.c = -pt.c;
					pt = pt._next;
				}
			}
			this._onUpdate = v.onUpdate;
			this._initted = true;
		};

		p._initProps = function(target, propLookup, siblings, overwrittenProps, index) {
			var p, i, initPlugins, plugin, pt, v;
			if (target == null) {
				return false;
			}

			if (_lazyLookup[target._gsTweenID]) {
				_lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)
			}

			if (!this.vars.css) if (target.style) if (target !== window && target.nodeType) if (_plugins.css) if (this.vars.autoCSS !== false) { //it's so common to use TweenLite/Max to animate the css of DOM elements, we assume that if the target is a DOM element, that's what is intended (a convenience so that users don't have to wrap things in css:{}, although we still recommend it for a slight performance boost and better specificity). Note: we cannot check "nodeType" on the window inside an iframe.
				_autoCSS(this.vars, target);
			}
			for (p in this.vars) {
				v = this.vars[p];
				if (_reservedProps[p]) {
					if (v) if ((v instanceof Array) || (v.push && _isArray(v))) if (v.join("").indexOf("{self}") !== -1) {
						this.vars[p] = v = this._swapSelfInParams(v, this);
					}

				} else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this, index)) {

					//t - target 		[object]
					//p - property 		[string]
					//s - start			[number]
					//c - change		[number]
					//f - isFunction	[boolean]
					//n - name			[string]
					//pg - isPlugin 	[boolean]
					//pr - priority		[number]
					//m - mod           [function | 0]
					this._firstPT = pt = {_next:this._firstPT, t:plugin, p:"setRatio", s:0, c:1, f:1, n:p, pg:1, pr:plugin._priority, m:0};
					i = plugin._overwriteProps.length;
					while (--i > -1) {
						propLookup[plugin._overwriteProps[i]] = this._firstPT;
					}
					if (plugin._priority || plugin._onInitAllProps) {
						initPlugins = true;
					}
					if (plugin._onDisable || plugin._onEnable) {
						this._notifyPluginsOfEnabled = true;
					}
					if (pt._next) {
						pt._next._prev = pt;
					}

				} else {
					propLookup[p] = _addPropTween.call(this, target, p, "get", v, p, 0, null, this.vars.stringFilter, index);
				}
			}

			if (overwrittenProps) if (this._kill(overwrittenProps, target)) { //another tween may have tried to overwrite properties of this tween before init() was called (like if two tweens start at the same time, the one created second will run first)
				return this._initProps(target, propLookup, siblings, overwrittenProps, index);
			}
			if (this._overwrite > 1) if (this._firstPT) if (siblings.length > 1) if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
				this._kill(propLookup, target);
				return this._initProps(target, propLookup, siblings, overwrittenProps, index);
			}
			if (this._firstPT) if ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration)) { //zero duration tweens don't lazy render by default; everything else does.
				_lazyLookup[target._gsTweenID] = true;
			}
			return initPlugins;
		};

		p.render = function(time, suppressEvents, force) {
			var prevTime = this._time,
				duration = this._duration,
				prevRawPrevTime = this._rawPrevTime,
				isComplete, callback, pt, rawPrevTime;
			if (time >= duration - 0.0000001) { //to work around occasional floating point math artifacts.
				this._totalTime = this._time = duration;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
				if (!this._reversed ) {
					isComplete = true;
					callback = "onComplete";
					force = (force || this._timeline.autoRemoveChildren); //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
				}
				if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
					if (this._startTime === this._timeline._duration) { //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
						time = 0;
					}
					if (prevRawPrevTime < 0 || (time <= 0 && time >= -0.0000001) || (prevRawPrevTime === _tinyNum && this.data !== "isPause")) if (prevRawPrevTime !== time) { //note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
						force = true;
						if (prevRawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
					this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				}

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = 0;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				if (prevTime !== 0 || (duration === 0 && prevRawPrevTime > 0)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (prevRawPrevTime >= 0 && !(prevRawPrevTime === _tinyNum && this.data === "isPause")) {
							force = true;
						}
						this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					}
				}
				if (!this._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
					force = true;
				}
			} else {
				this._totalTime = this._time = time;

				if (this._easeType) {
					var r = time / duration, type = this._easeType, pow = this._easePower;
					if (type === 1 || (type === 3 && r >= 0.5)) {
						r = 1 - r;
					}
					if (type === 3) {
						r *= 2;
					}
					if (pow === 1) {
						r *= r;
					} else if (pow === 2) {
						r *= r * r;
					} else if (pow === 3) {
						r *= r * r * r;
					} else if (pow === 4) {
						r *= r * r * r * r;
					}

					if (type === 1) {
						this.ratio = 1 - r;
					} else if (type === 2) {
						this.ratio = r;
					} else if (time / duration < 0.5) {
						this.ratio = r / 2;
					} else {
						this.ratio = 1 - (r / 2);
					}

				} else {
					this.ratio = this._ease.getRatio(time / duration);
				}
			}

			if (this._time === prevTime && !force) {
				return;
			} else if (!this._initted) {
				this._init();
				if (!this._initted || this._gc) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
					return;
				} else if (!force && this._firstPT && ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration))) {
					this._time = this._totalTime = prevTime;
					this._rawPrevTime = prevRawPrevTime;
					_lazyTweens.push(this);
					this._lazy = [time, suppressEvents];
					return;
				}
				//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
				if (this._time && !isComplete) {
					this.ratio = this._ease.getRatio(this._time / duration);
				} else if (isComplete && this._ease._calcEnd) {
					this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
				}
			}
			if (this._lazy !== false) { //in case a lazy render is pending, we should flush it because the new render is occurring now (imagine a lazy tween instantiating and then immediately the user calls tween.seek(tween.duration()), skipping to the end - the end render would be forced, and then if we didn't flush the lazy render, it'd fire AFTER the seek(), rendering it at the wrong time.
				this._lazy = false;
			}
			if (!this._active) if (!this._paused && this._time !== prevTime && time >= 0) {
				this._active = true;  //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
			}
			if (prevTime === 0) {
				if (this._startAt) {
					if (time >= 0) {
						this._startAt.render(time, suppressEvents, force);
					} else if (!callback) {
						callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
					}
				}
				if (this.vars.onStart) if (this._time !== 0 || duration === 0) if (!suppressEvents) {
					this._callback("onStart");
				}
			}
			pt = this._firstPT;
			while (pt) {
				if (pt.f) {
					pt.t[pt.p](pt.c * this.ratio + pt.s);
				} else {
					pt.t[pt.p] = pt.c * this.ratio + pt.s;
				}
				pt = pt._next;
			}

			if (this._onUpdate) {
				if (time < 0) if (this._startAt && time !== -0.0001) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
					this._startAt.render(time, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
				}
				if (!suppressEvents) if (this._time !== prevTime || isComplete || force) {
					this._callback("onUpdate");
				}
			}
			if (callback) if (!this._gc || force) { //check _gc because there's a chance that kill() could be called in an onUpdate
				if (time < 0 && this._startAt && !this._onUpdate && time !== -0.0001) { //-0.0001 is a special value that we use when looping back to the beginning of a repeated TimelineMax, in which case we shouldn't render the _startAt values.
					this._startAt.render(time, suppressEvents, force);
				}
				if (isComplete) {
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this._callback(callback);
				}
				if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) { //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
					this._rawPrevTime = 0;
				}
			}
		};

		p._kill = function(vars, target, overwritingTween) {
			if (vars === "all") {
				vars = null;
			}
			if (vars == null) if (target == null || target === this.target) {
				this._lazy = false;
				return this._enabled(false, false);
			}
			target = (typeof(target) !== "string") ? (target || this._targets || this.target) : TweenLite.selector(target) || target;
			var simultaneousOverwrite = (overwritingTween && this._time && overwritingTween._startTime === this._startTime && this._timeline === overwritingTween._timeline),
				i, overwrittenProps, p, pt, propLookup, changed, killProps, record, killed;
			if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
				i = target.length;
				while (--i > -1) {
					if (this._kill(vars, target[i], overwritingTween)) {
						changed = true;
					}
				}
			} else {
				if (this._targets) {
					i = this._targets.length;
					while (--i > -1) {
						if (target === this._targets[i]) {
							propLookup = this._propLookup[i] || {};
							this._overwrittenProps = this._overwrittenProps || [];
							overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
							break;
						}
					}
				} else if (target !== this.target) {
					return false;
				} else {
					propLookup = this._propLookup;
					overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
				}

				if (propLookup) {
					killProps = vars || propLookup;
					record = (vars !== overwrittenProps && overwrittenProps !== "all" && vars !== propLookup && (typeof(vars) !== "object" || !vars._tempKill)); //_tempKill is a super-secret way to delete a particular tweening property but NOT have it remembered as an official overwritten property (like in BezierPlugin)
					if (overwritingTween && (TweenLite.onOverwrite || this.vars.onOverwrite)) {
						for (p in killProps) {
							if (propLookup[p]) {
								if (!killed) {
									killed = [];
								}
								killed.push(p);
							}
						}
						if ((killed || !vars) && !_onOverwrite(this, overwritingTween, target, killed)) { //if the onOverwrite returned false, that means the user wants to override the overwriting (cancel it).
							return false;
						}
					}

					for (p in killProps) {
						if ((pt = propLookup[p])) {
							if (simultaneousOverwrite) { //if another tween overwrites this one and they both start at exactly the same time, yet this tween has already rendered once (for example, at 0.001) because it's first in the queue, we should revert the values to where they were at 0 so that the starting values aren't contaminated on the overwriting tween.
								if (pt.f) {
									pt.t[pt.p](pt.s);
								} else {
									pt.t[pt.p] = pt.s;
								}
								changed = true;
							}
							if (pt.pg && pt.t._kill(killProps)) {
								changed = true; //some plugins need to be notified so they can perform cleanup tasks first
							}
							if (!pt.pg || pt.t._overwriteProps.length === 0) {
								if (pt._prev) {
									pt._prev._next = pt._next;
								} else if (pt === this._firstPT) {
									this._firstPT = pt._next;
								}
								if (pt._next) {
									pt._next._prev = pt._prev;
								}
								pt._next = pt._prev = null;
							}
							delete propLookup[p];
						}
						if (record) {
							overwrittenProps[p] = 1;
						}
					}
					if (!this._firstPT && this._initted) { //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
						this._enabled(false, false);
					}
				}
			}
			return changed;
		};

		p.invalidate = function() {
			if (this._notifyPluginsOfEnabled) {
				TweenLite._onPluginEvent("_onDisable", this);
			}
			this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null;
			this._notifyPluginsOfEnabled = this._active = this._lazy = false;
			this._propLookup = (this._targets) ? {} : [];
			Animation.prototype.invalidate.call(this);
			if (this.vars.immediateRender) {
				this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
				this.render(Math.min(0, -this._delay)); //in case delay is negative.
			}
			return this;
		};

		p._enabled = function(enabled, ignoreTimeline) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			if (enabled && this._gc) {
				var targets = this._targets,
					i;
				if (targets) {
					i = targets.length;
					while (--i > -1) {
						this._siblings[i] = _register(targets[i], this, true);
					}
				} else {
					this._siblings = _register(this.target, this, true);
				}
			}
			Animation.prototype._enabled.call(this, enabled, ignoreTimeline);
			if (this._notifyPluginsOfEnabled) if (this._firstPT) {
				return TweenLite._onPluginEvent((enabled ? "_onEnable" : "_onDisable"), this);
			}
			return false;
		};


//----TweenLite static methods -----------------------------------------------------

		TweenLite.to = function(target, duration, vars) {
			return new TweenLite(target, duration, vars);
		};

		TweenLite.from = function(target, duration, vars) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return new TweenLite(target, duration, vars);
		};

		TweenLite.fromTo = function(target, duration, fromVars, toVars) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return new TweenLite(target, duration, toVars);
		};

		TweenLite.delayedCall = function(delay, callback, params, scope, useFrames) {
			return new TweenLite(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, callbackScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, immediateRender:false, lazy:false, useFrames:useFrames, overwrite:0});
		};

		TweenLite.set = function(target, vars) {
			return new TweenLite(target, 0, vars);
		};

		TweenLite.getTweensOf = function(target, onlyActive) {
			if (target == null) { return []; }
			target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;
			var i, a, j, t;
			if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
				i = target.length;
				a = [];
				while (--i > -1) {
					a = a.concat(TweenLite.getTweensOf(target[i], onlyActive));
				}
				i = a.length;
				//now get rid of any duplicates (tweens of arrays of objects could cause duplicates)
				while (--i > -1) {
					t = a[i];
					j = i;
					while (--j > -1) {
						if (t === a[j]) {
							a.splice(i, 1);
						}
					}
				}
			} else {
				a = _register(target).concat();
				i = a.length;
				while (--i > -1) {
					if (a[i]._gc || (onlyActive && !a[i].isActive())) {
						a.splice(i, 1);
					}
				}
			}
			return a;
		};

		TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function(target, onlyActive, vars) {
			if (typeof(onlyActive) === "object") {
				vars = onlyActive; //for backwards compatibility (before "onlyActive" parameter was inserted)
				onlyActive = false;
			}
			var a = TweenLite.getTweensOf(target, onlyActive),
				i = a.length;
			while (--i > -1) {
				a[i]._kill(vars, target);
			}
		};



/*
 * ----------------------------------------------------------------
 * TweenPlugin   (could easily be split out as a separate file/class, but included for ease of use (so that people don't need to include another script call before loading plugins which is easy to forget)
 * ----------------------------------------------------------------
 */
		var TweenPlugin = _class("plugins.TweenPlugin", function(props, priority) {
					this._overwriteProps = (props || "").split(",");
					this._propName = this._overwriteProps[0];
					this._priority = priority || 0;
					this._super = TweenPlugin.prototype;
				}, true);

		p = TweenPlugin.prototype;
		TweenPlugin.version = "1.19.0";
		TweenPlugin.API = 2;
		p._firstPT = null;
		p._addTween = _addPropTween;
		p.setRatio = _setRatio;

		p._kill = function(lookup) {
			var a = this._overwriteProps,
				pt = this._firstPT,
				i;
			if (lookup[this._propName] != null) {
				this._overwriteProps = [];
			} else {
				i = a.length;
				while (--i > -1) {
					if (lookup[a[i]] != null) {
						a.splice(i, 1);
					}
				}
			}
			while (pt) {
				if (lookup[pt.n] != null) {
					if (pt._next) {
						pt._next._prev = pt._prev;
					}
					if (pt._prev) {
						pt._prev._next = pt._next;
						pt._prev = null;
					} else if (this._firstPT === pt) {
						this._firstPT = pt._next;
					}
				}
				pt = pt._next;
			}
			return false;
		};

		p._mod = p._roundProps = function(lookup) {
			var pt = this._firstPT,
				val;
			while (pt) {
				val = lookup[this._propName] || (pt.n != null && lookup[ pt.n.split(this._propName + "_").join("") ]);
				if (val && typeof(val) === "function") { //some properties that are very plugin-specific add a prefix named after the _propName plus an underscore, so we need to ignore that extra stuff here.
					if (pt.f === 2) {
						pt.t._applyPT.m = val;
					} else {
						pt.m = val;
					}
				}
				pt = pt._next;
			}
		};

		TweenLite._onPluginEvent = function(type, tween) {
			var pt = tween._firstPT,
				changed, pt2, first, last, next;
			if (type === "_onInitAllProps") {
				//sorts the PropTween linked list in order of priority because some plugins need to render earlier/later than others, like MotionBlurPlugin applies its effects after all x/y/alpha tweens have rendered on each frame.
				while (pt) {
					next = pt._next;
					pt2 = first;
					while (pt2 && pt2.pr > pt.pr) {
						pt2 = pt2._next;
					}
					if ((pt._prev = pt2 ? pt2._prev : last)) {
						pt._prev._next = pt;
					} else {
						first = pt;
					}
					if ((pt._next = pt2)) {
						pt2._prev = pt;
					} else {
						last = pt;
					}
					pt = next;
				}
				pt = tween._firstPT = first;
			}
			while (pt) {
				if (pt.pg) if (typeof(pt.t[type]) === "function") if (pt.t[type]()) {
					changed = true;
				}
				pt = pt._next;
			}
			return changed;
		};

		TweenPlugin.activate = function(plugins) {
			var i = plugins.length;
			while (--i > -1) {
				if (plugins[i].API === TweenPlugin.API) {
					_plugins[(new plugins[i]())._propName] = plugins[i];
				}
			}
			return true;
		};

		//provides a more concise way to define plugins that have no dependencies besides TweenPlugin and TweenLite, wrapping common boilerplate stuff into one function (added in 1.9.0). You don't NEED to use this to define a plugin - the old way still works and can be useful in certain (rare) situations.
		_gsDefine.plugin = function(config) {
			if (!config || !config.propName || !config.init || !config.API) { throw "illegal plugin definition."; }
			var propName = config.propName,
				priority = config.priority || 0,
				overwriteProps = config.overwriteProps,
				map = {init:"_onInitTween", set:"setRatio", kill:"_kill", round:"_mod", mod:"_mod", initAll:"_onInitAllProps"},
				Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin",
					function() {
						TweenPlugin.call(this, propName, priority);
						this._overwriteProps = overwriteProps || [];
					}, (config.global === true)),
				p = Plugin.prototype = new TweenPlugin(propName),
				prop;
			p.constructor = Plugin;
			Plugin.API = config.API;
			for (prop in map) {
				if (typeof(config[prop]) === "function") {
					p[map[prop]] = config[prop];
				}
			}
			Plugin.version = config.version;
			TweenPlugin.activate([Plugin]);
			return Plugin;
		};


		//now run through all the dependencies discovered and if any are missing, log that to the console as a warning. This is why it's best to have TweenLite load last - it can check all the dependencies for you.
		a = window._gsQueue;
		if (a) {
			for (i = 0; i < a.length; i++) {
				a[i]();
			}
			for (p in _defLookup) {
				if (!_defLookup[p].func) {
					window.console.log("GSAP encountered missing dependency: " + p);
				}
			}
		}

		_tickerActive = false; //ensures that the first official animation forces a ticker.tick() to update the time when it is instantiated

})((typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window, "TweenMax");
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
// randomColor by David Merfield under the CC0 license
// https://github.com/davidmerfield/randomColor/

;(function(root, factory) {

  // Support AMD
  if (typeof define === 'function' && define.amd) {
    define([], factory);

  // Support CommonJS
  } else if (typeof exports === 'object') {
    var randomColor = factory();

    // Support NodeJS & Component, which allow module.exports to be a function
    if (typeof module === 'object' && module && module.exports) {
      exports = module.exports = randomColor;
    }

    // Support CommonJS 1.1.1 spec
    exports.randomColor = randomColor;

  // Support vanilla script loading
  } else {
    root.randomColor = factory();
  }

}(this, function() {

  // Seed to get repeatable colors
  var seed = null;

  // Shared color dictionary
  var colorDictionary = {};

  // Populate the color dictionary
  loadColorBounds();

  var randomColor = function (options) {

    options = options || {};

    // Check if there is a seed and ensure it's an
    // integer. Otherwise, reset the seed value.
    if (options.seed && options.seed === parseInt(options.seed, 10)) {
      seed = options.seed;

    // A string was passed as a seed
    } else if (typeof options.seed === 'string') {
      seed = stringToInteger(options.seed);

    // Something was passed as a seed but it wasn't an integer or string
    } else if (options.seed !== undefined && options.seed !== null) {
      throw new TypeError('The seed value must be an integer or string');

    // No seed, reset the value outside.
    } else {
      seed = null;
    }

    var H,S,B;

    // Check if we need to generate multiple colors
    if (options.count !== null && options.count !== undefined) {

      var totalColors = options.count,
          colors = [];

      options.count = null;

      while (totalColors > colors.length) {

        // Since we're generating multiple colors,
        // incremement the seed. Otherwise we'd just
        // generate the same color each time...
        if (seed && options.seed) options.seed += 1;

        colors.push(randomColor(options));
      }

      options.count = totalColors;

      return colors;
    }

    // First we pick a hue (H)
    H = pickHue(options);

    // Then use H to determine saturation (S)
    S = pickSaturation(H, options);

    // Then use S and H to determine brightness (B).
    B = pickBrightness(H, S, options);

    // Then we return the HSB color in the desired format
    return setFormat([H,S,B], options);
  };

  function pickHue (options) {

    var hueRange = getHueRange(options.hue),
        hue = randomWithin(hueRange);

    // Instead of storing red as two seperate ranges,
    // we group them, using negative numbers
    if (hue < 0) {hue = 360 + hue;}

    return hue;

  }

  function pickSaturation (hue, options) {

    if (options.luminosity === 'random') {
      return randomWithin([0,100]);
    }

    if (options.hue === 'monochrome') {
      return 0;
    }

    var saturationRange = getSaturationRange(hue);

    var sMin = saturationRange[0],
        sMax = saturationRange[1];

    switch (options.luminosity) {

      case 'bright':
        sMin = 55;
        break;

      case 'dark':
        sMin = sMax - 10;
        break;

      case 'light':
        sMax = 55;
        break;
   }

    return randomWithin([sMin, sMax]);

  }

  function pickBrightness (H, S, options) {

    var bMin = getMinimumBrightness(H, S),
        bMax = 100;

    switch (options.luminosity) {

      case 'dark':
        bMax = bMin + 20;
        break;

      case 'light':
        bMin = (bMax + bMin)/2;
        break;

      case 'random':
        bMin = 0;
        bMax = 100;
        break;
    }

    return randomWithin([bMin, bMax]);
  }

  function setFormat (hsv, options) {

    switch (options.format) {

      case 'hsvArray':
        return hsv;

      case 'hslArray':
        return HSVtoHSL(hsv);

      case 'hsl':
        var hsl = HSVtoHSL(hsv);
        return 'hsl('+hsl[0]+', '+hsl[1]+'%, '+hsl[2]+'%)';

      case 'hsla':
        var hslColor = HSVtoHSL(hsv);
        return 'hsla('+hslColor[0]+', '+hslColor[1]+'%, '+hslColor[2]+'%, ' + Math.random() + ')';

      case 'rgbArray':
        return HSVtoRGB(hsv);

      case 'rgb':
        var rgb = HSVtoRGB(hsv);
        return 'rgb(' + rgb.join(', ') + ')';

      case 'rgba':
        var rgbColor = HSVtoRGB(hsv);
        return 'rgba(' + rgbColor.join(', ') + ', ' + Math.random() + ')';

      default:
        return HSVtoHex(hsv);
    }

  }

  function getMinimumBrightness(H, S) {

    var lowerBounds = getColorInfo(H).lowerBounds;

    for (var i = 0; i < lowerBounds.length - 1; i++) {

      var s1 = lowerBounds[i][0],
          v1 = lowerBounds[i][1];

      var s2 = lowerBounds[i+1][0],
          v2 = lowerBounds[i+1][1];

      if (S >= s1 && S <= s2) {

         var m = (v2 - v1)/(s2 - s1),
             b = v1 - m*s1;

         return m*S + b;
      }

    }

    return 0;
  }

  function getHueRange (colorInput) {

    if (typeof parseInt(colorInput) === 'number') {

      var number = parseInt(colorInput);

      if (number < 360 && number > 0) {
        return [number, number];
      }

    }

    if (typeof colorInput === 'string') {

      if (colorDictionary[colorInput]) {
        var color = colorDictionary[colorInput];
        if (color.hueRange) {return color.hueRange;}
      }
    }

    return [0,360];

  }

  function getSaturationRange (hue) {
    return getColorInfo(hue).saturationRange;
  }

  function getColorInfo (hue) {

    // Maps red colors to make picking hue easier
    if (hue >= 334 && hue <= 360) {
      hue-= 360;
    }

    for (var colorName in colorDictionary) {
       var color = colorDictionary[colorName];
       if (color.hueRange &&
           hue >= color.hueRange[0] &&
           hue <= color.hueRange[1]) {
          return colorDictionary[colorName];
       }
    } return 'Color not found';
  }

  function randomWithin (range) {
    if (seed === null) {
      return Math.floor(range[0] + Math.random()*(range[1] + 1 - range[0]));
    } else {
      //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
      var max = range[1] || 1;
      var min = range[0] || 0;
      seed = (seed * 9301 + 49297) % 233280;
      var rnd = seed / 233280.0;
      return Math.floor(min + rnd * (max - min));
    }
  }

  function HSVtoHex (hsv){

    var rgb = HSVtoRGB(hsv);

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    var hex = '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);

    return hex;

  }

  function defineColor (name, hueRange, lowerBounds) {

    var sMin = lowerBounds[0][0],
        sMax = lowerBounds[lowerBounds.length - 1][0],

        bMin = lowerBounds[lowerBounds.length - 1][1],
        bMax = lowerBounds[0][1];

    colorDictionary[name] = {
      hueRange: hueRange,
      lowerBounds: lowerBounds,
      saturationRange: [sMin, sMax],
      brightnessRange: [bMin, bMax]
    };

  }

  function loadColorBounds () {

    defineColor(
      'monochrome',
      null,
      [[0,0],[100,0]]
    );

    defineColor(
      'red',
      [-26,18],
      [[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]]
    );

    defineColor(
      'orange',
      [19,46],
      [[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]]
    );

    defineColor(
      'yellow',
      [47,62],
      [[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]]
    );

    defineColor(
      'green',
      [63,178],
      [[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]]
    );

    defineColor(
      'blue',
      [179, 257],
      [[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]]
    );

    defineColor(
      'purple',
      [258, 282],
      [[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]]
    );

    defineColor(
      'pink',
      [283, 334],
      [[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]]
    );

  }

  function HSVtoRGB (hsv) {

    // this doesn't work for the values of 0 and 360
    // here's the hacky fix
    var h = hsv[0];
    if (h === 0) {h = 1;}
    if (h === 360) {h = 359;}

    // Rebase the h,s,v values
    h = h/360;
    var s = hsv[1]/100,
        v = hsv[2]/100;

    var h_i = Math.floor(h*6),
      f = h * 6 - h_i,
      p = v * (1 - s),
      q = v * (1 - f*s),
      t = v * (1 - (1 - f)*s),
      r = 256,
      g = 256,
      b = 256;

    switch(h_i) {
      case 0: r = v; g = t; b = p;  break;
      case 1: r = q; g = v; b = p;  break;
      case 2: r = p; g = v; b = t;  break;
      case 3: r = p; g = q; b = v;  break;
      case 4: r = t; g = p; b = v;  break;
      case 5: r = v; g = p; b = q;  break;
    }

    var result = [Math.floor(r*255), Math.floor(g*255), Math.floor(b*255)];
    return result;
  }

  function HSVtoHSL (hsv) {
    var h = hsv[0],
      s = hsv[1]/100,
      v = hsv[2]/100,
      k = (2-s)*v;

    return [
      h,
      Math.round(s*v / (k<1 ? k : 2-k) * 10000) / 100,
      k/2 * 100
    ];
  }

  function stringToInteger (string) {
    var total = 0
    for (var i = 0; i !== string.length; i++) {
      if (total >= Number.MAX_SAFE_INTEGER) break;
      total += string.charCodeAt(i)
    }
    return total
  }

  return randomColor;
}));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvbWFpbi5qcyIsImFzc2V0cy9qcy9wYXJ0aWFscy9faW50cm8uanMiLCJhc3NldHMvanMvcGFydGlhbHMvX3BhcmFsbGF4LmpzIiwibm9kZV9tb2R1bGVzL2dzYXAvc3JjL3VuY29tcHJlc3NlZC9Ud2Vlbk1heC5qcyIsIm5vZGVfbW9kdWxlcy9yYW5kb21jb2xvci9yYW5kb21Db2xvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0FBQ0E7Ozs7O0FDREE7Ozs7QUFDQTs7OztBQUVBLFNBQVMsV0FBVCxHQUF1QjtBQUNyQixNQUFJLFdBQVcsU0FBUyxhQUFULENBQXVCLGNBQXZCLENBQWY7QUFDQSxNQUFJLFdBQVcsU0FBUyxhQUFULENBQXVCLGNBQXZCLENBQWY7QUFDQSxNQUFJLFlBQVksU0FBUyxVQUF6QjtBQUNBLE1BQUksS0FBSyxJQUFJLFdBQUosRUFBVDtBQUNBLE1BQUksU0FBUyxFQUFiOztBQUVBLE9BQUssSUFBSSxDQUFULElBQWMsU0FBZCxFQUF5QjtBQUN2QixRQUFJLElBQUksVUFBVSxDQUFWLENBQVI7QUFDQSxRQUFJLEVBQUUsVUFBTixFQUFrQjtBQUNoQixhQUFPLElBQVAsQ0FBWSxDQUFaO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJLGNBQWMsMkJBQVk7QUFDNUIsV0FBTyxPQUFPLE1BRGM7QUFFNUIsZ0JBQVk7QUFGZ0IsR0FBWixDQUFsQjs7QUFLQSxPQUFLLElBQUksQ0FBVCxJQUFjLE1BQWQsRUFBc0I7QUFDcEIsUUFBSSxRQUFRLE9BQU8sQ0FBUCxDQUFaO0FBQ0EsVUFBTSxZQUFOLENBQW1CLE1BQW5CLEVBQTJCLFlBQVksQ0FBWixDQUEzQjtBQUNEOztBQUVELEtBQUcsU0FBSCxDQUNFLE1BREYsRUFDVSxDQURWLEVBQ2E7QUFDVCxXQUFPLElBREU7QUFFVCxhQUFTLElBRkE7QUFHVCxVQUFNLFFBQVE7QUFITCxHQURiLEVBS0ssSUFMTDs7QUFRQSxNQUFJLFFBQVEsU0FBUyxFQUFULENBQ1YsUUFEVSxFQUNBLENBREEsRUFDRztBQUNYLFdBQU8sR0FESTtBQUVYLGFBQVMsQ0FGRTtBQUdYLE9BQUcsQ0FIUTtBQUlYLFVBQU0sUUFBUTtBQUpILEdBREgsRUFNUCxJQU5PLENBQVo7QUFRRDs7QUFFRCxTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxVQUFTLEtBQVQsRUFBZ0I7QUFDNUQ7QUFDRCxDQUZEOzs7OztBQzdDQSxJQUFJLE9BQU8sT0FBTyxnQkFBUCxDQUNULFNBQVMsYUFBVCxDQUF1QixNQUF2QixDQURTLEVBQ3VCLFNBRHZCLEVBRVQsZ0JBRlMsQ0FFUSxTQUZSLENBQVg7O0FBSUEsT0FBTyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxVQUFTLEtBQVQsRUFBZ0I7O0FBRWhELE1BQUksSUFBSixFQUFVOztBQUVSLFFBQUksS0FBSixFQUFXLENBQVgsRUFBYyxLQUFkLEVBQXFCLE1BQXJCLEVBQTZCLEdBQTdCLEVBQWtDLFFBQWxDLEVBQTRDLFdBQTVDLEVBQXlELFdBQXpEO0FBQ0Esa0JBQWMsS0FBSyxXQUFuQjtBQUNBLGFBQVMsU0FBUyxnQkFBVCxDQUEwQiwwQkFBMUIsQ0FBVDs7QUFFQSxTQUFLLElBQUksQ0FBSixFQUFPLE1BQU0sT0FBTyxNQUF6QixFQUFpQyxJQUFJLEdBQXJDLEVBQTBDLEdBQTFDLEVBQStDO0FBQzdDLGNBQVEsT0FBTyxDQUFQLENBQVI7QUFDQSxjQUFRLE1BQU0sWUFBTixDQUFtQixZQUFuQixDQUFSO0FBQ0EsaUJBQVcsRUFBRSxjQUFjLEtBQWhCLENBQVg7QUFDQSxvQkFBYyxvQkFBb0IsUUFBcEIsR0FBK0IsUUFBN0M7QUFDQSxZQUFNLEtBQU4sQ0FBWSxtQkFBWixJQUFtQyxXQUFuQztBQUNBLFlBQU0sS0FBTixDQUFZLGdCQUFaLElBQWdDLFdBQWhDO0FBQ0EsWUFBTSxLQUFOLENBQVksZUFBWixJQUErQixXQUEvQjtBQUNBLFlBQU0sS0FBTixDQUFZLGNBQVosSUFBOEIsV0FBOUI7QUFDQSxZQUFNLEtBQU4sQ0FBWSxTQUFaLEdBQXdCLFdBQXhCO0FBQ0Q7QUFFRjtBQUVGLENBdEJEOzs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdm5QQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgJy4vcGFydGlhbHMvX3BhcmFsbGF4JztcbmltcG9ydCAnLi9wYXJ0aWFscy9faW50cm8nO1xuIiwiaW1wb3J0IHJhbmRvbUNvbG9yIGZyb20gJ3JhbmRvbWNvbG9yJztcbmltcG9ydCAnZ3NhcCc7XG5cbmZ1bmN0aW9uIHJlbmRlckludHJvKCkge1xuICB2YXIgbG9nb3R5cGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbG9nb3R5cGUnKTtcbiAgdmFyIGxvZ29tYXJrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWxvZ29tYXJrJyk7XG4gIHZhciBsb2dvTm9kZXMgPSBsb2dvbWFyay5jaGlsZE5vZGVzO1xuICB2YXIgdGwgPSBuZXcgVGltZWxpbmVNYXgoKTtcbiAgdmFyIHNoYXBlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgaW4gbG9nb05vZGVzKSB7XG4gICAgdmFyIG4gPSBsb2dvTm9kZXNbaV07XG4gICAgaWYgKG4uYXR0cmlidXRlcykge1xuICAgICAgc2hhcGVzLnB1c2gobik7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgYmFja2dyb3VuZHMgPSByYW5kb21Db2xvcih7XG4gICAgY291bnQ6IHNoYXBlcy5sZW5ndGgsXG4gICAgbHVtaW5vc2l0eTogJ2xpZ2h0J1xuICB9KTtcblxuICBmb3IgKHZhciBpIGluIHNoYXBlcykge1xuICAgIHZhciBzaGFwZSA9IHNoYXBlc1tpXTtcbiAgICBzaGFwZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBiYWNrZ3JvdW5kc1tpXSk7XG4gIH07XG5cbiAgdGwuc3RhZ2dlclRvKFxuICAgIHNoYXBlcywgMSwge1xuICAgICAgZGVsYXk6IDAuMjUsXG4gICAgICBvcGFjaXR5OiAwLjc1LFxuICAgICAgZWFzZTogRWxhc3RpYy5lYXNlT3V0XG4gICAgfSwgMC4wNVxuICApO1xuXG4gIHZhciB0d2VlbiA9IFR3ZWVuTWF4LnRvKFxuICAgIGxvZ290eXBlLCAxLCB7XG4gICAgICBkZWxheTogMC41LFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHk6IDAsXG4gICAgICBlYXNlOiBFbGFzdGljLmVhc2VPdXRcbiAgICB9LCAwLjA1XG4gICk7XG59O1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkge1xuICByZW5kZXJJbnRybygpO1xufSk7XG4iLCJ2YXIgc2l6ZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKFxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JyksICc6YmVmb3JlJ1xuKS5nZXRQcm9wZXJ0eVZhbHVlKCdjb250ZW50Jyk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbihldmVudCkge1xuXG4gIGlmIChzaXplKSB7XG5cbiAgICB2YXIgZGVwdGgsIGksIGxheWVyLCBsYXllcnMsIGxlbiwgbW92ZW1lbnQsIHRvcERpc3RhbmNlLCB0cmFuc2xhdGUzZDtcbiAgICB0b3BEaXN0YW5jZSA9IHRoaXMucGFnZVlPZmZzZXQ7XG4gICAgbGF5ZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdHlwZT1cXCdwYXJhbGxheFxcJ10nKTtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IGxheWVycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGF5ZXIgPSBsYXllcnNbaV07XG4gICAgICBkZXB0aCA9IGxheWVyLmdldEF0dHJpYnV0ZSgnZGF0YS1kZXB0aCcpO1xuICAgICAgbW92ZW1lbnQgPSAtKHRvcERpc3RhbmNlICogZGVwdGgpO1xuICAgICAgdHJhbnNsYXRlM2QgPSAndHJhbnNsYXRlM2QoMCwgJyArIG1vdmVtZW50ICsgJ3B4LCAwKSc7XG4gICAgICBsYXllci5zdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0nXSA9IHRyYW5zbGF0ZTNkO1xuICAgICAgbGF5ZXIuc3R5bGVbJy1tb3otdHJhbnNmb3JtJ10gPSB0cmFuc2xhdGUzZDtcbiAgICAgIGxheWVyLnN0eWxlWyctbXMtdHJhbnNmb3JtJ10gPSB0cmFuc2xhdGUzZDtcbiAgICAgIGxheWVyLnN0eWxlWyctby10cmFuc2Zvcm0nXSA9IHRyYW5zbGF0ZTNkO1xuICAgICAgbGF5ZXIuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNsYXRlM2Q7XG4gICAgfVxuXG4gIH1cblxufSk7XG4iLCIvKiFcbiAqIFZFUlNJT046IDEuMTkuMFxuICogREFURTogMjAxNi0wNy0xNFxuICogVVBEQVRFUyBBTkQgRE9DUyBBVDogaHR0cDovL2dyZWVuc29jay5jb21cbiAqIFxuICogSW5jbHVkZXMgYWxsIG9mIHRoZSBmb2xsb3dpbmc6IFR3ZWVuTGl0ZSwgVHdlZW5NYXgsIFRpbWVsaW5lTGl0ZSwgVGltZWxpbmVNYXgsIEVhc2VQYWNrLCBDU1NQbHVnaW4sIFJvdW5kUHJvcHNQbHVnaW4sIEJlemllclBsdWdpbiwgQXR0clBsdWdpbiwgRGlyZWN0aW9uYWxSb3RhdGlvblBsdWdpblxuICpcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwOC0yMDE2LCBHcmVlblNvY2suIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIHdvcmsgaXMgc3ViamVjdCB0byB0aGUgdGVybXMgYXQgaHR0cDovL2dyZWVuc29jay5jb20vc3RhbmRhcmQtbGljZW5zZSBvciBmb3JcbiAqIENsdWIgR3JlZW5Tb2NrIG1lbWJlcnMsIHRoZSBzb2Z0d2FyZSBhZ3JlZW1lbnQgdGhhdCB3YXMgaXNzdWVkIHdpdGggeW91ciBtZW1iZXJzaGlwLlxuICogXG4gKiBAYXV0aG9yOiBKYWNrIERveWxlLCBqYWNrQGdyZWVuc29jay5jb21cbiAqKi9cbnZhciBfZ3NTY29wZSA9ICh0eXBlb2YobW9kdWxlKSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2YoZ2xvYmFsKSAhPT0gXCJ1bmRlZmluZWRcIikgPyBnbG9iYWwgOiB0aGlzIHx8IHdpbmRvdzsgLy9oZWxwcyBlbnN1cmUgY29tcGF0aWJpbGl0eSB3aXRoIEFNRC9SZXF1aXJlSlMgYW5kIENvbW1vbkpTL05vZGVcbihfZ3NTY29wZS5fZ3NRdWV1ZSB8fCAoX2dzU2NvcGUuX2dzUXVldWUgPSBbXSkpLnB1c2goIGZ1bmN0aW9uKCkge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdF9nc1Njb3BlLl9nc0RlZmluZShcIlR3ZWVuTWF4XCIsIFtcImNvcmUuQW5pbWF0aW9uXCIsXCJjb3JlLlNpbXBsZVRpbWVsaW5lXCIsXCJUd2VlbkxpdGVcIl0sIGZ1bmN0aW9uKEFuaW1hdGlvbiwgU2ltcGxlVGltZWxpbmUsIFR3ZWVuTGl0ZSkge1xuXG5cdFx0dmFyIF9zbGljZSA9IGZ1bmN0aW9uKGEpIHsgLy9kb24ndCB1c2UgW10uc2xpY2UgYmVjYXVzZSB0aGF0IGRvZXNuJ3Qgd29yayBpbiBJRTggd2l0aCBhIE5vZGVMaXN0IHRoYXQncyByZXR1cm5lZCBieSBxdWVyeVNlbGVjdG9yQWxsKClcblx0XHRcdFx0dmFyIGIgPSBbXSxcblx0XHRcdFx0XHRsID0gYS5sZW5ndGgsXG5cdFx0XHRcdFx0aTtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSAhPT0gbDsgYi5wdXNoKGFbaSsrXSkpO1xuXHRcdFx0XHRyZXR1cm4gYjtcblx0XHRcdH0sXG5cdFx0XHRfYXBwbHlDeWNsZSA9IGZ1bmN0aW9uKHZhcnMsIHRhcmdldHMsIGkpIHtcblx0XHRcdFx0dmFyIGFsdCA9IHZhcnMuY3ljbGUsXG5cdFx0XHRcdFx0cCwgdmFsO1xuXHRcdFx0XHRmb3IgKHAgaW4gYWx0KSB7XG5cdFx0XHRcdFx0dmFsID0gYWx0W3BdO1xuXHRcdFx0XHRcdHZhcnNbcF0gPSAodHlwZW9mKHZhbCkgPT09IFwiZnVuY3Rpb25cIikgPyB2YWwoaSwgdGFyZ2V0c1tpXSkgOiB2YWxbaSAlIHZhbC5sZW5ndGhdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRlbGV0ZSB2YXJzLmN5Y2xlO1xuXHRcdFx0fSxcblx0XHRcdFR3ZWVuTWF4ID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycykge1xuXHRcdFx0XHRUd2VlbkxpdGUuY2FsbCh0aGlzLCB0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKTtcblx0XHRcdFx0dGhpcy5fY3ljbGUgPSAwO1xuXHRcdFx0XHR0aGlzLl95b3lvID0gKHRoaXMudmFycy55b3lvID09PSB0cnVlKTtcblx0XHRcdFx0dGhpcy5fcmVwZWF0ID0gdGhpcy52YXJzLnJlcGVhdCB8fCAwO1xuXHRcdFx0XHR0aGlzLl9yZXBlYXREZWxheSA9IHRoaXMudmFycy5yZXBlYXREZWxheSB8fCAwO1xuXHRcdFx0XHR0aGlzLl9kaXJ0eSA9IHRydWU7IC8vZW5zdXJlcyB0aGF0IGlmIHRoZXJlIGlzIGFueSByZXBlYXQsIHRoZSB0b3RhbER1cmF0aW9uIHdpbGwgZ2V0IHJlY2FsY3VsYXRlZCB0byBhY2N1cmF0ZWx5IHJlcG9ydCBpdC5cblx0XHRcdFx0dGhpcy5yZW5kZXIgPSBUd2Vlbk1heC5wcm90b3R5cGUucmVuZGVyOyAvL3NwZWVkIG9wdGltaXphdGlvbiAoYXZvaWQgcHJvdG90eXBlIGxvb2t1cCBvbiB0aGlzIFwiaG90XCIgbWV0aG9kKVxuXHRcdFx0fSxcblx0XHRcdF90aW55TnVtID0gMC4wMDAwMDAwMDAxLFxuXHRcdFx0VHdlZW5MaXRlSW50ZXJuYWxzID0gVHdlZW5MaXRlLl9pbnRlcm5hbHMsXG5cdFx0XHRfaXNTZWxlY3RvciA9IFR3ZWVuTGl0ZUludGVybmFscy5pc1NlbGVjdG9yLFxuXHRcdFx0X2lzQXJyYXkgPSBUd2VlbkxpdGVJbnRlcm5hbHMuaXNBcnJheSxcblx0XHRcdHAgPSBUd2Vlbk1heC5wcm90b3R5cGUgPSBUd2VlbkxpdGUudG8oe30sIDAuMSwge30pLFxuXHRcdFx0X2JsYW5rQXJyYXkgPSBbXTtcblxuXHRcdFR3ZWVuTWF4LnZlcnNpb24gPSBcIjEuMTkuMFwiO1xuXHRcdHAuY29uc3RydWN0b3IgPSBUd2Vlbk1heDtcblx0XHRwLmtpbGwoKS5fZ2MgPSBmYWxzZTtcblx0XHRUd2Vlbk1heC5raWxsVHdlZW5zT2YgPSBUd2Vlbk1heC5raWxsRGVsYXllZENhbGxzVG8gPSBUd2VlbkxpdGUua2lsbFR3ZWVuc09mO1xuXHRcdFR3ZWVuTWF4LmdldFR3ZWVuc09mID0gVHdlZW5MaXRlLmdldFR3ZWVuc09mO1xuXHRcdFR3ZWVuTWF4LmxhZ1Ntb290aGluZyA9IFR3ZWVuTGl0ZS5sYWdTbW9vdGhpbmc7XG5cdFx0VHdlZW5NYXgudGlja2VyID0gVHdlZW5MaXRlLnRpY2tlcjtcblx0XHRUd2Vlbk1heC5yZW5kZXIgPSBUd2VlbkxpdGUucmVuZGVyO1xuXG5cdFx0cC5pbnZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLl95b3lvID0gKHRoaXMudmFycy55b3lvID09PSB0cnVlKTtcblx0XHRcdHRoaXMuX3JlcGVhdCA9IHRoaXMudmFycy5yZXBlYXQgfHwgMDtcblx0XHRcdHRoaXMuX3JlcGVhdERlbGF5ID0gdGhpcy52YXJzLnJlcGVhdERlbGF5IHx8IDA7XG5cdFx0XHR0aGlzLl91bmNhY2hlKHRydWUpO1xuXHRcdFx0cmV0dXJuIFR3ZWVuTGl0ZS5wcm90b3R5cGUuaW52YWxpZGF0ZS5jYWxsKHRoaXMpO1xuXHRcdH07XG5cdFx0XG5cdFx0cC51cGRhdGVUbyA9IGZ1bmN0aW9uKHZhcnMsIHJlc2V0RHVyYXRpb24pIHtcblx0XHRcdHZhciBjdXJSYXRpbyA9IHRoaXMucmF0aW8sXG5cdFx0XHRcdGltbWVkaWF0ZSA9IHRoaXMudmFycy5pbW1lZGlhdGVSZW5kZXIgfHwgdmFycy5pbW1lZGlhdGVSZW5kZXIsXG5cdFx0XHRcdHA7XG5cdFx0XHRpZiAocmVzZXREdXJhdGlvbiAmJiB0aGlzLl9zdGFydFRpbWUgPCB0aGlzLl90aW1lbGluZS5fdGltZSkge1xuXHRcdFx0XHR0aGlzLl9zdGFydFRpbWUgPSB0aGlzLl90aW1lbGluZS5fdGltZTtcblx0XHRcdFx0dGhpcy5fdW5jYWNoZShmYWxzZSk7XG5cdFx0XHRcdGlmICh0aGlzLl9nYykge1xuXHRcdFx0XHRcdHRoaXMuX2VuYWJsZWQodHJ1ZSwgZmFsc2UpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWVsaW5lLmluc2VydCh0aGlzLCB0aGlzLl9zdGFydFRpbWUgLSB0aGlzLl9kZWxheSk7IC8vZW5zdXJlcyB0aGF0IGFueSBuZWNlc3NhcnkgcmUtc2VxdWVuY2luZyBvZiBBbmltYXRpb25zIGluIHRoZSB0aW1lbGluZSBvY2N1cnMgdG8gbWFrZSBzdXJlIHRoZSByZW5kZXJpbmcgb3JkZXIgaXMgY29ycmVjdC5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Zm9yIChwIGluIHZhcnMpIHtcblx0XHRcdFx0dGhpcy52YXJzW3BdID0gdmFyc1twXTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9pbml0dGVkIHx8IGltbWVkaWF0ZSkge1xuXHRcdFx0XHRpZiAocmVzZXREdXJhdGlvbikge1xuXHRcdFx0XHRcdHRoaXMuX2luaXR0ZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRpZiAoaW1tZWRpYXRlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnJlbmRlcigwLCB0cnVlLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2djKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9lbmFibGVkKHRydWUsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQgJiYgdGhpcy5fZmlyc3RQVCkge1xuXHRcdFx0XHRcdFx0VHdlZW5MaXRlLl9vblBsdWdpbkV2ZW50KFwiX29uRGlzYWJsZVwiLCB0aGlzKTsgLy9pbiBjYXNlIGEgcGx1Z2luIGxpa2UgTW90aW9uQmx1ciBtdXN0IHBlcmZvcm0gc29tZSBjbGVhbnVwIHRhc2tzXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lIC8gdGhpcy5fZHVyYXRpb24gPiAwLjk5OCkgeyAvL2lmIHRoZSB0d2VlbiBoYXMgZmluaXNoZWQgKG9yIGNvbWUgZXh0cmVtZWx5IGNsb3NlIHRvIGZpbmlzaGluZyksIHdlIGp1c3QgbmVlZCB0byByZXdpbmQgaXQgdG8gMCBhbmQgdGhlbiByZW5kZXIgaXQgYWdhaW4gYXQgdGhlIGVuZCB3aGljaCBmb3JjZXMgaXQgdG8gcmUtaW5pdGlhbGl6ZSAocGFyc2luZyB0aGUgbmV3IHZhcnMpLiBXZSBhbGxvdyB0d2VlbnMgdGhhdCBhcmUgY2xvc2UgdG8gZmluaXNoaW5nIChidXQgaGF2ZW4ndCBxdWl0ZSBmaW5pc2hlZCkgdG8gd29yayB0aGlzIHdheSB0b28gYmVjYXVzZSBvdGhlcndpc2UsIHRoZSB2YWx1ZXMgYXJlIHNvIHNtYWxsIHdoZW4gZGV0ZXJtaW5pbmcgd2hlcmUgdG8gcHJvamVjdCB0aGUgc3RhcnRpbmcgdmFsdWVzIHRoYXQgYmluYXJ5IG1hdGggaXNzdWVzIGNyZWVwIGluIGFuZCBjYW4gbWFrZSB0aGUgdHdlZW4gYXBwZWFyIHRvIHJlbmRlciBpbmNvcnJlY3RseSB3aGVuIHJ1biBiYWNrd2FyZHMuIFxuXHRcdFx0XHRcdFx0dmFyIHByZXZUaW1lID0gdGhpcy5fdG90YWxUaW1lO1xuXHRcdFx0XHRcdFx0dGhpcy5yZW5kZXIoMCwgdHJ1ZSwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0dGhpcy5faW5pdHRlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0dGhpcy5yZW5kZXIocHJldlRpbWUsIHRydWUsIGZhbHNlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5faW5pdHRlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0dGhpcy5faW5pdCgpO1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX3RpbWUgPiAwIHx8IGltbWVkaWF0ZSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgaW52ID0gMSAvICgxIC0gY3VyUmF0aW8pLFxuXHRcdFx0XHRcdFx0XHRcdHB0ID0gdGhpcy5fZmlyc3RQVCwgZW5kVmFsdWU7XG5cdFx0XHRcdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdFx0XHRcdGVuZFZhbHVlID0gcHQucyArIHB0LmM7XG5cdFx0XHRcdFx0XHRcdFx0cHQuYyAqPSBpbnY7XG5cdFx0XHRcdFx0XHRcdFx0cHQucyA9IGVuZFZhbHVlIC0gcHQuYztcblx0XHRcdFx0XHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXHRcdFx0XHRcblx0XHRwLnJlbmRlciA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSkge1xuXHRcdFx0aWYgKCF0aGlzLl9pbml0dGVkKSBpZiAodGhpcy5fZHVyYXRpb24gPT09IDAgJiYgdGhpcy52YXJzLnJlcGVhdCkgeyAvL3plcm8gZHVyYXRpb24gdHdlZW5zIHRoYXQgcmVuZGVyIGltbWVkaWF0ZWx5IGhhdmUgcmVuZGVyKCkgY2FsbGVkIGZyb20gVHdlZW5MaXRlJ3MgY29uc3RydWN0b3IsIGJlZm9yZSBUd2Vlbk1heCdzIGNvbnN0cnVjdG9yIGhhcyBmaW5pc2hlZCBzZXR0aW5nIF9yZXBlYXQsIF9yZXBlYXREZWxheSwgYW5kIF95b3lvIHdoaWNoIGFyZSBjcml0aWNhbCBpbiBkZXRlcm1pbmluZyB0b3RhbER1cmF0aW9uKCkgc28gd2UgbmVlZCB0byBjYWxsIGludmFsaWRhdGUoKSB3aGljaCBpcyBhIGxvdy1rYiB3YXkgdG8gZ2V0IHRob3NlIHNldCBwcm9wZXJseS5cblx0XHRcdFx0dGhpcy5pbnZhbGlkYXRlKCk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgdG90YWxEdXIgPSAoIXRoaXMuX2RpcnR5KSA/IHRoaXMuX3RvdGFsRHVyYXRpb24gOiB0aGlzLnRvdGFsRHVyYXRpb24oKSxcblx0XHRcdFx0cHJldlRpbWUgPSB0aGlzLl90aW1lLFxuXHRcdFx0XHRwcmV2VG90YWxUaW1lID0gdGhpcy5fdG90YWxUaW1lLCBcblx0XHRcdFx0cHJldkN5Y2xlID0gdGhpcy5fY3ljbGUsXG5cdFx0XHRcdGR1cmF0aW9uID0gdGhpcy5fZHVyYXRpb24sXG5cdFx0XHRcdHByZXZSYXdQcmV2VGltZSA9IHRoaXMuX3Jhd1ByZXZUaW1lLFxuXHRcdFx0XHRpc0NvbXBsZXRlLCBjYWxsYmFjaywgcHQsIGN5Y2xlRHVyYXRpb24sIHIsIHR5cGUsIHBvdywgcmF3UHJldlRpbWU7XG5cdFx0XHRpZiAodGltZSA+PSB0b3RhbER1ciAtIDAuMDAwMDAwMSkgeyAvL3RvIHdvcmsgYXJvdW5kIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgbWF0aCBhcnRpZmFjdHMuXG5cdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRvdGFsRHVyO1xuXHRcdFx0XHR0aGlzLl9jeWNsZSA9IHRoaXMuX3JlcGVhdDtcblx0XHRcdFx0aWYgKHRoaXMuX3lveW8gJiYgKHRoaXMuX2N5Y2xlICYgMSkgIT09IDApIHtcblx0XHRcdFx0XHR0aGlzLl90aW1lID0gMDtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5fY2FsY0VuZCA/IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oMCkgOiAwO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWUgPSBkdXJhdGlvbjtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5fY2FsY0VuZCA/IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oMSkgOiAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghdGhpcy5fcmV2ZXJzZWQpIHtcblx0XHRcdFx0XHRpc0NvbXBsZXRlID0gdHJ1ZTtcblx0XHRcdFx0XHRjYWxsYmFjayA9IFwib25Db21wbGV0ZVwiO1xuXHRcdFx0XHRcdGZvcmNlID0gKGZvcmNlIHx8IHRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbik7IC8vb3RoZXJ3aXNlLCBpZiB0aGUgYW5pbWF0aW9uIGlzIHVucGF1c2VkL2FjdGl2YXRlZCBhZnRlciBpdCdzIGFscmVhZHkgZmluaXNoZWQsIGl0IGRvZXNuJ3QgZ2V0IHJlbW92ZWQgZnJvbSB0aGUgcGFyZW50IHRpbWVsaW5lLlxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkdXJhdGlvbiA9PT0gMCkgaWYgKHRoaXMuX2luaXR0ZWQgfHwgIXRoaXMudmFycy5sYXp5IHx8IGZvcmNlKSB7IC8vemVyby1kdXJhdGlvbiB0d2VlbnMgYXJlIHRyaWNreSBiZWNhdXNlIHdlIG11c3QgZGlzY2VybiB0aGUgbW9tZW50dW0vZGlyZWN0aW9uIG9mIHRpbWUgaW4gb3JkZXIgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHN0YXJ0aW5nIHZhbHVlcyBzaG91bGQgYmUgcmVuZGVyZWQgb3IgdGhlIGVuZGluZyB2YWx1ZXMuIElmIHRoZSBcInBsYXloZWFkXCIgb2YgaXRzIHRpbWVsaW5lIGdvZXMgcGFzdCB0aGUgemVyby1kdXJhdGlvbiB0d2VlbiBpbiB0aGUgZm9yd2FyZCBkaXJlY3Rpb24gb3IgbGFuZHMgZGlyZWN0bHkgb24gaXQsIHRoZSBlbmQgdmFsdWVzIHNob3VsZCBiZSByZW5kZXJlZCwgYnV0IGlmIHRoZSB0aW1lbGluZSdzIFwicGxheWhlYWRcIiBtb3ZlcyBwYXN0IGl0IGluIHRoZSBiYWNrd2FyZCBkaXJlY3Rpb24gKGZyb20gYSBwb3N0aXRpdmUgdGltZSB0byBhIG5lZ2F0aXZlIHRpbWUpLCB0aGUgc3RhcnRpbmcgdmFsdWVzIG11c3QgYmUgcmVuZGVyZWQuXG5cdFx0XHRcdFx0aWYgKHRoaXMuX3N0YXJ0VGltZSA9PT0gdGhpcy5fdGltZWxpbmUuX2R1cmF0aW9uKSB7IC8vaWYgYSB6ZXJvLWR1cmF0aW9uIHR3ZWVuIGlzIGF0IHRoZSBWRVJZIGVuZCBvZiBhIHRpbWVsaW5lIGFuZCB0aGF0IHRpbWVsaW5lIHJlbmRlcnMgYXQgaXRzIGVuZCwgaXQgd2lsbCB0eXBpY2FsbHkgYWRkIGEgdGlueSBiaXQgb2YgY3VzaGlvbiB0byB0aGUgcmVuZGVyIHRpbWUgdG8gcHJldmVudCByb3VuZGluZyBlcnJvcnMgZnJvbSBnZXR0aW5nIGluIHRoZSB3YXkgb2YgdHdlZW5zIHJlbmRlcmluZyB0aGVpciBWRVJZIGVuZC4gSWYgd2UgdGhlbiByZXZlcnNlKCkgdGhhdCB0aW1lbGluZSwgdGhlIHplcm8tZHVyYXRpb24gdHdlZW4gd2lsbCB0cmlnZ2VyIGl0cyBvblJldmVyc2VDb21wbGV0ZSBldmVuIHRob3VnaCB0ZWNobmljYWxseSB0aGUgcGxheWhlYWQgZGlkbid0IHBhc3Mgb3ZlciBpdCBhZ2Fpbi4gSXQncyBhIHZlcnkgc3BlY2lmaWMgZWRnZSBjYXNlIHdlIG11c3QgYWNjb21tb2RhdGUuXG5cdFx0XHRcdFx0XHR0aW1lID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHByZXZSYXdQcmV2VGltZSA8IDAgfHwgKHRpbWUgPD0gMCAmJiB0aW1lID49IC0wLjAwMDAwMDEpIHx8IChwcmV2UmF3UHJldlRpbWUgPT09IF90aW55TnVtICYmIHRoaXMuZGF0YSAhPT0gXCJpc1BhdXNlXCIpKSBpZiAocHJldlJhd1ByZXZUaW1lICE9PSB0aW1lKSB7IC8vbm90ZTogd2hlbiB0aGlzLmRhdGEgaXMgXCJpc1BhdXNlXCIsIGl0J3MgYSBjYWxsYmFjayBhZGRlZCBieSBhZGRQYXVzZSgpIG9uIGEgdGltZWxpbmUgdGhhdCB3ZSBzaG91bGQgbm90IGJlIHRyaWdnZXJlZCB3aGVuIExFQVZJTkcgaXRzIGV4YWN0IHN0YXJ0IHRpbWUuIEluIG90aGVyIHdvcmRzLCB0bC5hZGRQYXVzZSgxKS5wbGF5KDEpIHNob3VsZG4ndCBwYXVzZS5cblx0XHRcdFx0XHRcdGZvcmNlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGlmIChwcmV2UmF3UHJldlRpbWUgPiBfdGlueU51bSkge1xuXHRcdFx0XHRcdFx0XHRjYWxsYmFjayA9IFwib25SZXZlcnNlQ29tcGxldGVcIjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSByYXdQcmV2VGltZSA9ICghc3VwcHJlc3NFdmVudHMgfHwgdGltZSB8fCBwcmV2UmF3UHJldlRpbWUgPT09IHRpbWUpID8gdGltZSA6IF90aW55TnVtOyAvL3doZW4gdGhlIHBsYXloZWFkIGFycml2ZXMgYXQgRVhBQ1RMWSB0aW1lIDAgKHJpZ2h0IG9uIHRvcCkgb2YgYSB6ZXJvLWR1cmF0aW9uIHR3ZWVuLCB3ZSBuZWVkIHRvIGRpc2Nlcm4gaWYgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIHNvIHRoYXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgYWdhaW4gKG5leHQgdGltZSksIGl0J2xsIHRyaWdnZXIgdGhlIGNhbGxiYWNrLiBJZiBldmVudHMgYXJlIE5PVCBzdXBwcmVzc2VkLCBvYnZpb3VzbHkgdGhlIGNhbGxiYWNrIHdvdWxkIGJlIHRyaWdnZXJlZCBpbiB0aGlzIHJlbmRlci4gQmFzaWNhbGx5LCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUgZWl0aGVyIHdoZW4gdGhlIHBsYXloZWFkIEFSUklWRVMgb3IgTEVBVkVTIHRoaXMgZXhhY3Qgc3BvdCwgbm90IGJvdGguIEltYWdpbmUgZG9pbmcgYSB0aW1lbGluZS5zZWVrKDApIGFuZCB0aGVyZSdzIGEgY2FsbGJhY2sgdGhhdCBzaXRzIGF0IDAuIFNpbmNlIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBvbiB0aGF0IHNlZWsoKSBieSBkZWZhdWx0LCBub3RoaW5nIHdpbGwgZmlyZSwgYnV0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIG9mZiBvZiB0aGF0IHBvc2l0aW9uLCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUuIFRoaXMgYmVoYXZpb3IgaXMgd2hhdCBwZW9wbGUgaW50dWl0aXZlbHkgZXhwZWN0LiBXZSBzZXQgdGhlIF9yYXdQcmV2VGltZSB0byBiZSBhIHByZWNpc2UgdGlueSBudW1iZXIgdG8gaW5kaWNhdGUgdGhpcyBzY2VuYXJpbyByYXRoZXIgdGhhbiB1c2luZyBhbm90aGVyIHByb3BlcnR5L3ZhcmlhYmxlIHdoaWNoIHdvdWxkIGluY3JlYXNlIG1lbW9yeSB1c2FnZS4gVGhpcyB0ZWNobmlxdWUgaXMgbGVzcyByZWFkYWJsZSwgYnV0IG1vcmUgZWZmaWNpZW50LlxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0fSBlbHNlIGlmICh0aW1lIDwgMC4wMDAwMDAxKSB7IC8vdG8gd29yayBhcm91bmQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCBtYXRoIGFydGlmYWN0cywgcm91bmQgc3VwZXIgc21hbGwgdmFsdWVzIHRvIDAuXG5cdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRoaXMuX3RpbWUgPSB0aGlzLl9jeWNsZSA9IDA7XG5cdFx0XHRcdHRoaXMucmF0aW8gPSB0aGlzLl9lYXNlLl9jYWxjRW5kID8gdGhpcy5fZWFzZS5nZXRSYXRpbygwKSA6IDA7XG5cdFx0XHRcdGlmIChwcmV2VG90YWxUaW1lICE9PSAwIHx8IChkdXJhdGlvbiA9PT0gMCAmJiBwcmV2UmF3UHJldlRpbWUgPiAwKSkge1xuXHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvblJldmVyc2VDb21wbGV0ZVwiO1xuXHRcdFx0XHRcdGlzQ29tcGxldGUgPSB0aGlzLl9yZXZlcnNlZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGltZSA8IDApIHtcblx0XHRcdFx0XHR0aGlzLl9hY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0XHRpZiAoZHVyYXRpb24gPT09IDApIGlmICh0aGlzLl9pbml0dGVkIHx8ICF0aGlzLnZhcnMubGF6eSB8fCBmb3JjZSkgeyAvL3plcm8tZHVyYXRpb24gdHdlZW5zIGFyZSB0cmlja3kgYmVjYXVzZSB3ZSBtdXN0IGRpc2Nlcm4gdGhlIG1vbWVudHVtL2RpcmVjdGlvbiBvZiB0aW1lIGluIG9yZGVyIHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBzdGFydGluZyB2YWx1ZXMgc2hvdWxkIGJlIHJlbmRlcmVkIG9yIHRoZSBlbmRpbmcgdmFsdWVzLiBJZiB0aGUgXCJwbGF5aGVhZFwiIG9mIGl0cyB0aW1lbGluZSBnb2VzIHBhc3QgdGhlIHplcm8tZHVyYXRpb24gdHdlZW4gaW4gdGhlIGZvcndhcmQgZGlyZWN0aW9uIG9yIGxhbmRzIGRpcmVjdGx5IG9uIGl0LCB0aGUgZW5kIHZhbHVlcyBzaG91bGQgYmUgcmVuZGVyZWQsIGJ1dCBpZiB0aGUgdGltZWxpbmUncyBcInBsYXloZWFkXCIgbW92ZXMgcGFzdCBpdCBpbiB0aGUgYmFja3dhcmQgZGlyZWN0aW9uIChmcm9tIGEgcG9zdGl0aXZlIHRpbWUgdG8gYSBuZWdhdGl2ZSB0aW1lKSwgdGhlIHN0YXJ0aW5nIHZhbHVlcyBtdXN0IGJlIHJlbmRlcmVkLlxuXHRcdFx0XHRcdFx0aWYgKHByZXZSYXdQcmV2VGltZSA+PSAwKSB7XG5cdFx0XHRcdFx0XHRcdGZvcmNlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gcmF3UHJldlRpbWUgPSAoIXN1cHByZXNzRXZlbnRzIHx8IHRpbWUgfHwgcHJldlJhd1ByZXZUaW1lID09PSB0aW1lKSA/IHRpbWUgOiBfdGlueU51bTsgLy93aGVuIHRoZSBwbGF5aGVhZCBhcnJpdmVzIGF0IEVYQUNUTFkgdGltZSAwIChyaWdodCBvbiB0b3ApIG9mIGEgemVyby1kdXJhdGlvbiB0d2Vlbiwgd2UgbmVlZCB0byBkaXNjZXJuIGlmIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBzbyB0aGF0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIGFnYWluIChuZXh0IHRpbWUpLCBpdCdsbCB0cmlnZ2VyIHRoZSBjYWxsYmFjay4gSWYgZXZlbnRzIGFyZSBOT1Qgc3VwcHJlc3NlZCwgb2J2aW91c2x5IHRoZSBjYWxsYmFjayB3b3VsZCBiZSB0cmlnZ2VyZWQgaW4gdGhpcyByZW5kZXIuIEJhc2ljYWxseSwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlIGVpdGhlciB3aGVuIHRoZSBwbGF5aGVhZCBBUlJJVkVTIG9yIExFQVZFUyB0aGlzIGV4YWN0IHNwb3QsIG5vdCBib3RoLiBJbWFnaW5lIGRvaW5nIGEgdGltZWxpbmUuc2VlaygwKSBhbmQgdGhlcmUncyBhIGNhbGxiYWNrIHRoYXQgc2l0cyBhdCAwLiBTaW5jZSBldmVudHMgYXJlIHN1cHByZXNzZWQgb24gdGhhdCBzZWVrKCkgYnkgZGVmYXVsdCwgbm90aGluZyB3aWxsIGZpcmUsIGJ1dCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBvZmYgb2YgdGhhdCBwb3NpdGlvbiwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlLiBUaGlzIGJlaGF2aW9yIGlzIHdoYXQgcGVvcGxlIGludHVpdGl2ZWx5IGV4cGVjdC4gV2Ugc2V0IHRoZSBfcmF3UHJldlRpbWUgdG8gYmUgYSBwcmVjaXNlIHRpbnkgbnVtYmVyIHRvIGluZGljYXRlIHRoaXMgc2NlbmFyaW8gcmF0aGVyIHRoYW4gdXNpbmcgYW5vdGhlciBwcm9wZXJ0eS92YXJpYWJsZSB3aGljaCB3b3VsZCBpbmNyZWFzZSBtZW1vcnkgdXNhZ2UuIFRoaXMgdGVjaG5pcXVlIGlzIGxlc3MgcmVhZGFibGUsIGJ1dCBtb3JlIGVmZmljaWVudC5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCF0aGlzLl9pbml0dGVkKSB7IC8vaWYgd2UgcmVuZGVyIHRoZSB2ZXJ5IGJlZ2lubmluZyAodGltZSA9PSAwKSBvZiBhIGZyb21UbygpLCB3ZSBtdXN0IGZvcmNlIHRoZSByZW5kZXIgKG5vcm1hbCB0d2VlbnMgd291bGRuJ3QgbmVlZCB0byByZW5kZXIgYXQgYSB0aW1lIG9mIDAgd2hlbiB0aGUgcHJldlRpbWUgd2FzIGFsc28gMCkuIFRoaXMgaXMgYWxzbyBtYW5kYXRvcnkgdG8gbWFrZSBzdXJlIG92ZXJ3cml0aW5nIGtpY2tzIGluIGltbWVkaWF0ZWx5LlxuXHRcdFx0XHRcdGZvcmNlID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdGltZSA9IHRpbWU7XG5cdFx0XHRcdGlmICh0aGlzLl9yZXBlYXQgIT09IDApIHtcblx0XHRcdFx0XHRjeWNsZUR1cmF0aW9uID0gZHVyYXRpb24gKyB0aGlzLl9yZXBlYXREZWxheTtcblx0XHRcdFx0XHR0aGlzLl9jeWNsZSA9ICh0aGlzLl90b3RhbFRpbWUgLyBjeWNsZUR1cmF0aW9uKSA+PiAwOyAvL29yaWdpbmFsbHkgX3RvdGFsVGltZSAlIGN5Y2xlRHVyYXRpb24gYnV0IGZsb2F0aW5nIHBvaW50IGVycm9ycyBjYXVzZWQgcHJvYmxlbXMsIHNvIEkgbm9ybWFsaXplZCBpdC4gKDQgJSAwLjggc2hvdWxkIGJlIDAgYnV0IHNvbWUgYnJvd3NlcnMgcmVwb3J0IGl0IGFzIDAuNzk5OTk5OTkhKVxuXHRcdFx0XHRcdGlmICh0aGlzLl9jeWNsZSAhPT0gMCkgaWYgKHRoaXMuX2N5Y2xlID09PSB0aGlzLl90b3RhbFRpbWUgLyBjeWNsZUR1cmF0aW9uICYmIHByZXZUb3RhbFRpbWUgPD0gdGltZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fY3ljbGUtLTsgLy9vdGhlcndpc2Ugd2hlbiByZW5kZXJlZCBleGFjdGx5IGF0IHRoZSBlbmQgdGltZSwgaXQgd2lsbCBhY3QgYXMgdGhvdWdoIGl0IGlzIHJlcGVhdGluZyAoYXQgdGhlIGJlZ2lubmluZylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IHRoaXMuX3RvdGFsVGltZSAtICh0aGlzLl9jeWNsZSAqIGN5Y2xlRHVyYXRpb24pO1xuXHRcdFx0XHRcdGlmICh0aGlzLl95b3lvKSBpZiAoKHRoaXMuX2N5Y2xlICYgMSkgIT09IDApIHtcblx0XHRcdFx0XHRcdHRoaXMuX3RpbWUgPSBkdXJhdGlvbiAtIHRoaXMuX3RpbWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lID4gZHVyYXRpb24pIHtcblx0XHRcdFx0XHRcdHRoaXMuX3RpbWUgPSBkdXJhdGlvbjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuX3RpbWUgPCAwKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl90aW1lID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpcy5fZWFzZVR5cGUpIHtcblx0XHRcdFx0XHRyID0gdGhpcy5fdGltZSAvIGR1cmF0aW9uO1xuXHRcdFx0XHRcdHR5cGUgPSB0aGlzLl9lYXNlVHlwZTtcblx0XHRcdFx0XHRwb3cgPSB0aGlzLl9lYXNlUG93ZXI7XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IDEgfHwgKHR5cGUgPT09IDMgJiYgciA+PSAwLjUpKSB7XG5cdFx0XHRcdFx0XHRyID0gMSAtIHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAzKSB7XG5cdFx0XHRcdFx0XHRyICo9IDI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwb3cgPT09IDEpIHtcblx0XHRcdFx0XHRcdHIgKj0gcjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHBvdyA9PT0gMikge1xuXHRcdFx0XHRcdFx0ciAqPSByICogcjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHBvdyA9PT0gMykge1xuXHRcdFx0XHRcdFx0ciAqPSByICogciAqIHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwb3cgPT09IDQpIHtcblx0XHRcdFx0XHRcdHIgKj0gciAqIHIgKiByICogcjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0dGhpcy5yYXRpbyA9IDEgLSByO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gMikge1xuXHRcdFx0XHRcdFx0dGhpcy5yYXRpbyA9IHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl90aW1lIC8gZHVyYXRpb24gPCAwLjUpIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSByIC8gMjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5yYXRpbyA9IDEgLSAociAvIDIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMucmF0aW8gPSB0aGlzLl9lYXNlLmdldFJhdGlvKHRoaXMuX3RpbWUgLyBkdXJhdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0aWYgKHByZXZUaW1lID09PSB0aGlzLl90aW1lICYmICFmb3JjZSAmJiBwcmV2Q3ljbGUgPT09IHRoaXMuX2N5Y2xlKSB7XG5cdFx0XHRcdGlmIChwcmV2VG90YWxUaW1lICE9PSB0aGlzLl90b3RhbFRpbWUpIGlmICh0aGlzLl9vblVwZGF0ZSkgaWYgKCFzdXBwcmVzc0V2ZW50cykgeyAvL3NvIHRoYXQgb25VcGRhdGUgZmlyZXMgZXZlbiBkdXJpbmcgdGhlIHJlcGVhdERlbGF5IC0gYXMgbG9uZyBhcyB0aGUgdG90YWxUaW1lIGNoYW5nZWQsIHdlIHNob3VsZCB0cmlnZ2VyIG9uVXBkYXRlLlxuXHRcdFx0XHRcdHRoaXMuX2NhbGxiYWNrKFwib25VcGRhdGVcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fSBlbHNlIGlmICghdGhpcy5faW5pdHRlZCkge1xuXHRcdFx0XHR0aGlzLl9pbml0KCk7XG5cdFx0XHRcdGlmICghdGhpcy5faW5pdHRlZCB8fCB0aGlzLl9nYykgeyAvL2ltbWVkaWF0ZVJlbmRlciB0d2VlbnMgdHlwaWNhbGx5IHdvbid0IGluaXRpYWxpemUgdW50aWwgdGhlIHBsYXloZWFkIGFkdmFuY2VzIChfdGltZSBpcyBncmVhdGVyIHRoYW4gMCkgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgb3ZlcndyaXRpbmcgb2NjdXJzIHByb3Blcmx5LiBBbHNvLCBpZiBhbGwgb2YgdGhlIHR3ZWVuaW5nIHByb3BlcnRpZXMgaGF2ZSBiZWVuIG92ZXJ3cml0dGVuICh3aGljaCB3b3VsZCBjYXVzZSBfZ2MgdG8gYmUgdHJ1ZSwgYXMgc2V0IGluIF9pbml0KCkpLCB3ZSBzaG91bGRuJ3QgY29udGludWUgb3RoZXJ3aXNlIGFuIG9uU3RhcnQgY2FsbGJhY2sgY291bGQgYmUgY2FsbGVkIGZvciBleGFtcGxlLlxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fSBlbHNlIGlmICghZm9yY2UgJiYgdGhpcy5fZmlyc3RQVCAmJiAoKHRoaXMudmFycy5sYXp5ICE9PSBmYWxzZSAmJiB0aGlzLl9kdXJhdGlvbikgfHwgKHRoaXMudmFycy5sYXp5ICYmICF0aGlzLl9kdXJhdGlvbikpKSB7IC8vd2Ugc3RpY2sgaXQgaW4gdGhlIHF1ZXVlIGZvciByZW5kZXJpbmcgYXQgdGhlIHZlcnkgZW5kIG9mIHRoZSB0aWNrIC0gdGhpcyBpcyBhIHBlcmZvcm1hbmNlIG9wdGltaXphdGlvbiBiZWNhdXNlIGJyb3dzZXJzIGludmFsaWRhdGUgc3R5bGVzIGFuZCBmb3JjZSBhIHJlY2FsY3VsYXRpb24gaWYgeW91IHJlYWQsIHdyaXRlLCBhbmQgdGhlbiByZWFkIHN0eWxlIGRhdGEgKHNvIGl0J3MgYmV0dGVyIHRvIHJlYWQvcmVhZC9yZWFkL3dyaXRlL3dyaXRlL3dyaXRlIHRoYW4gcmVhZC93cml0ZS9yZWFkL3dyaXRlL3JlYWQvd3JpdGUpLiBUaGUgZG93biBzaWRlLCBvZiBjb3Vyc2UsIGlzIHRoYXQgdXN1YWxseSB5b3UgV0FOVCB0aGluZ3MgdG8gcmVuZGVyIGltbWVkaWF0ZWx5IGJlY2F1c2UgeW91IG1heSBoYXZlIGNvZGUgcnVubmluZyByaWdodCBhZnRlciB0aGF0IHdoaWNoIGRlcGVuZHMgb24gdGhlIGNoYW5nZS4gTGlrZSBpbWFnaW5lIHJ1bm5pbmcgVHdlZW5MaXRlLnNldCguLi4pIGFuZCB0aGVuIGltbWVkaWF0ZWx5IGFmdGVyIHRoYXQsIGNyZWF0aW5nIGEgbm90aGVyIHR3ZWVuIHRoYXQgYW5pbWF0ZXMgdGhlIHNhbWUgcHJvcGVydHkgdG8gYW5vdGhlciB2YWx1ZTsgdGhlIHN0YXJ0aW5nIHZhbHVlcyBvZiB0aGF0IDJuZCB0d2VlbiB3b3VsZG4ndCBiZSBhY2N1cmF0ZSBpZiBsYXp5IGlzIHRydWUuXG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IHByZXZUaW1lO1xuXHRcdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHByZXZUb3RhbFRpbWU7XG5cdFx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSBwcmV2UmF3UHJldlRpbWU7XG5cdFx0XHRcdFx0dGhpcy5fY3ljbGUgPSBwcmV2Q3ljbGU7XG5cdFx0XHRcdFx0VHdlZW5MaXRlSW50ZXJuYWxzLmxhenlUd2VlbnMucHVzaCh0aGlzKTtcblx0XHRcdFx0XHR0aGlzLl9sYXp5ID0gW3RpbWUsIHN1cHByZXNzRXZlbnRzXTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9fZWFzZSBpcyBpbml0aWFsbHkgc2V0IHRvIGRlZmF1bHRFYXNlLCBzbyBub3cgdGhhdCBpbml0KCkgaGFzIHJ1biwgX2Vhc2UgaXMgc2V0IHByb3Blcmx5IGFuZCB3ZSBuZWVkIHRvIHJlY2FsY3VsYXRlIHRoZSByYXRpby4gT3ZlcmFsbCB0aGlzIGlzIGZhc3RlciB0aGFuIHVzaW5nIGNvbmRpdGlvbmFsIGxvZ2ljIGVhcmxpZXIgaW4gdGhlIG1ldGhvZCB0byBhdm9pZCBoYXZpbmcgdG8gc2V0IHJhdGlvIHR3aWNlIGJlY2F1c2Ugd2Ugb25seSBpbml0KCkgb25jZSBidXQgcmVuZGVyVGltZSgpIGdldHMgY2FsbGVkIFZFUlkgZnJlcXVlbnRseS5cblx0XHRcdFx0aWYgKHRoaXMuX3RpbWUgJiYgIWlzQ29tcGxldGUpIHtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5nZXRSYXRpbyh0aGlzLl90aW1lIC8gZHVyYXRpb24pO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGlzQ29tcGxldGUgJiYgdGhpcy5fZWFzZS5fY2FsY0VuZCkge1xuXHRcdFx0XHRcdHRoaXMucmF0aW8gPSB0aGlzLl9lYXNlLmdldFJhdGlvKCh0aGlzLl90aW1lID09PSAwKSA/IDAgOiAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuX2xhenkgIT09IGZhbHNlKSB7XG5cdFx0XHRcdHRoaXMuX2xhenkgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF0aGlzLl9hY3RpdmUpIGlmICghdGhpcy5fcGF1c2VkICYmIHRoaXMuX3RpbWUgIT09IHByZXZUaW1lICYmIHRpbWUgPj0gMCkge1xuXHRcdFx0XHR0aGlzLl9hY3RpdmUgPSB0cnVlOyAvL3NvIHRoYXQgaWYgdGhlIHVzZXIgcmVuZGVycyBhIHR3ZWVuIChhcyBvcHBvc2VkIHRvIHRoZSB0aW1lbGluZSByZW5kZXJpbmcgaXQpLCB0aGUgdGltZWxpbmUgaXMgZm9yY2VkIHRvIHJlLXJlbmRlciBhbmQgYWxpZ24gaXQgd2l0aCB0aGUgcHJvcGVyIHRpbWUvZnJhbWUgb24gdGhlIG5leHQgcmVuZGVyaW5nIGN5Y2xlLiBNYXliZSB0aGUgdHdlZW4gYWxyZWFkeSBmaW5pc2hlZCBidXQgdGhlIHVzZXIgbWFudWFsbHkgcmUtcmVuZGVycyBpdCBhcyBoYWxmd2F5IGRvbmUuXG5cdFx0XHR9XG5cdFx0XHRpZiAocHJldlRvdGFsVGltZSA9PT0gMCkge1xuXHRcdFx0XHRpZiAodGhpcy5faW5pdHRlZCA9PT0gMiAmJiB0aW1lID4gMCkge1xuXHRcdFx0XHRcdC8vdGhpcy5pbnZhbGlkYXRlKCk7XG5cdFx0XHRcdFx0dGhpcy5faW5pdCgpOyAvL3dpbGwganVzdCBhcHBseSBvdmVyd3JpdGluZyBzaW5jZSBfaW5pdHRlZCBvZiAoMikgbWVhbnMgaXQgd2FzIGEgZnJvbSgpIHR3ZWVuIHRoYXQgaGFkIGltbWVkaWF0ZVJlbmRlcjp0cnVlXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMuX3N0YXJ0QXQpIHtcblx0XHRcdFx0XHRpZiAodGltZSA+PSAwKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9zdGFydEF0LnJlbmRlcih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIWNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayA9IFwiX2R1bW15R1NcIjsgLy9pZiBubyBjYWxsYmFjayBpcyBkZWZpbmVkLCB1c2UgYSBkdW1teSB2YWx1ZSBqdXN0IHNvIHRoYXQgdGhlIGNvbmRpdGlvbiBhdCB0aGUgZW5kIGV2YWx1YXRlcyBhcyB0cnVlIGJlY2F1c2UgX3N0YXJ0QXQgc2hvdWxkIHJlbmRlciBBRlRFUiB0aGUgbm9ybWFsIHJlbmRlciBsb29wIHdoZW4gdGhlIHRpbWUgaXMgbmVnYXRpdmUuIFdlIGNvdWxkIGhhbmRsZSB0aGlzIGluIGEgbW9yZSBpbnR1aXRpdmUgd2F5LCBvZiBjb3Vyc2UsIGJ1dCB0aGUgcmVuZGVyIGxvb3AgaXMgdGhlIE1PU1QgaW1wb3J0YW50IHRoaW5nIHRvIG9wdGltaXplLCBzbyB0aGlzIHRlY2huaXF1ZSBhbGxvd3MgdXMgdG8gYXZvaWQgYWRkaW5nIGV4dHJhIGNvbmRpdGlvbmFsIGxvZ2ljIGluIGEgaGlnaC1mcmVxdWVuY3kgYXJlYS5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMudmFycy5vblN0YXJ0KSBpZiAodGhpcy5fdG90YWxUaW1lICE9PSAwIHx8IGR1cmF0aW9uID09PSAwKSBpZiAoIXN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblN0YXJ0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHB0ID0gdGhpcy5fZmlyc3RQVDtcblx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRpZiAocHQuZikge1xuXHRcdFx0XHRcdHB0LnRbcHQucF0ocHQuYyAqIHRoaXMucmF0aW8gKyBwdC5zKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQuYyAqIHRoaXMucmF0aW8gKyBwdC5zO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmICh0aGlzLl9vblVwZGF0ZSkge1xuXHRcdFx0XHRpZiAodGltZSA8IDApIGlmICh0aGlzLl9zdGFydEF0ICYmIHRoaXMuX3N0YXJ0VGltZSkgeyAvL2lmIHRoZSB0d2VlbiBpcyBwb3NpdGlvbmVkIGF0IHRoZSBWRVJZIGJlZ2lubmluZyAoX3N0YXJ0VGltZSAwKSBvZiBpdHMgcGFyZW50IHRpbWVsaW5lLCBpdCdzIGlsbGVnYWwgZm9yIHRoZSBwbGF5aGVhZCB0byBnbyBiYWNrIGZ1cnRoZXIsIHNvIHdlIHNob3VsZCBub3QgcmVuZGVyIHRoZSByZWNvcmRlZCBzdGFydEF0IHZhbHVlcy5cblx0XHRcdFx0XHR0aGlzLl9zdGFydEF0LnJlbmRlcih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpOyAvL25vdGU6IGZvciBwZXJmb3JtYW5jZSByZWFzb25zLCB3ZSB0dWNrIHRoaXMgY29uZGl0aW9uYWwgbG9naWMgaW5zaWRlIGxlc3MgdHJhdmVsZWQgYXJlYXMgKG1vc3QgdHdlZW5zIGRvbid0IGhhdmUgYW4gb25VcGRhdGUpLiBXZSdkIGp1c3QgaGF2ZSBpdCBhdCB0aGUgZW5kIGJlZm9yZSB0aGUgb25Db21wbGV0ZSwgYnV0IHRoZSB2YWx1ZXMgc2hvdWxkIGJlIHVwZGF0ZWQgYmVmb3JlIGFueSBvblVwZGF0ZSBpcyBjYWxsZWQsIHNvIHdlIEFMU08gcHV0IGl0IGhlcmUgYW5kIHRoZW4gaWYgaXQncyBub3QgY2FsbGVkLCB3ZSBkbyBzbyBsYXRlciBuZWFyIHRoZSBvbkNvbXBsZXRlLlxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghc3VwcHJlc3NFdmVudHMpIGlmICh0aGlzLl90b3RhbFRpbWUgIT09IHByZXZUb3RhbFRpbWUgfHwgY2FsbGJhY2spIHtcblx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uVXBkYXRlXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fY3ljbGUgIT09IHByZXZDeWNsZSkgaWYgKCFzdXBwcmVzc0V2ZW50cykgaWYgKCF0aGlzLl9nYykgaWYgKHRoaXMudmFycy5vblJlcGVhdCkge1xuXHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uUmVwZWF0XCIpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGNhbGxiYWNrKSBpZiAoIXRoaXMuX2djIHx8IGZvcmNlKSB7IC8vY2hlY2sgZ2MgYmVjYXVzZSB0aGVyZSdzIGEgY2hhbmNlIHRoYXQga2lsbCgpIGNvdWxkIGJlIGNhbGxlZCBpbiBhbiBvblVwZGF0ZVxuXHRcdFx0XHRpZiAodGltZSA8IDAgJiYgdGhpcy5fc3RhcnRBdCAmJiAhdGhpcy5fb25VcGRhdGUgJiYgdGhpcy5fc3RhcnRUaW1lKSB7IC8vaWYgdGhlIHR3ZWVuIGlzIHBvc2l0aW9uZWQgYXQgdGhlIFZFUlkgYmVnaW5uaW5nIChfc3RhcnRUaW1lIDApIG9mIGl0cyBwYXJlbnQgdGltZWxpbmUsIGl0J3MgaWxsZWdhbCBmb3IgdGhlIHBsYXloZWFkIHRvIGdvIGJhY2sgZnVydGhlciwgc28gd2Ugc2hvdWxkIG5vdCByZW5kZXIgdGhlIHJlY29yZGVkIHN0YXJ0QXQgdmFsdWVzLlxuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQucmVuZGVyKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGlzQ29tcGxldGUpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9lbmFibGVkKGZhbHNlLCBmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghc3VwcHJlc3NFdmVudHMgJiYgdGhpcy52YXJzW2NhbGxiYWNrXSkge1xuXHRcdFx0XHRcdHRoaXMuX2NhbGxiYWNrKGNhbGxiYWNrKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZHVyYXRpb24gPT09IDAgJiYgdGhpcy5fcmF3UHJldlRpbWUgPT09IF90aW55TnVtICYmIHJhd1ByZXZUaW1lICE9PSBfdGlueU51bSkgeyAvL3RoZSBvbkNvbXBsZXRlIG9yIG9uUmV2ZXJzZUNvbXBsZXRlIGNvdWxkIHRyaWdnZXIgbW92ZW1lbnQgb2YgdGhlIHBsYXloZWFkIGFuZCBmb3IgemVyby1kdXJhdGlvbiB0d2VlbnMgKHdoaWNoIG11c3QgZGlzY2VybiBkaXJlY3Rpb24pIHRoYXQgbGFuZCBkaXJlY3RseSBiYWNrIG9uIHRoZWlyIHN0YXJ0IHRpbWUsIHdlIGRvbid0IHdhbnQgdG8gZmlyZSBhZ2FpbiBvbiB0aGUgbmV4dCByZW5kZXIuIFRoaW5rIG9mIHNldmVyYWwgYWRkUGF1c2UoKSdzIGluIGEgdGltZWxpbmUgdGhhdCBmb3JjZXMgdGhlIHBsYXloZWFkIHRvIGEgY2VydGFpbiBzcG90LCBidXQgd2hhdCBpZiBpdCdzIGFscmVhZHkgcGF1c2VkIGFuZCBhbm90aGVyIHR3ZWVuIGlzIHR3ZWVuaW5nIHRoZSBcInRpbWVcIiBvZiB0aGUgdGltZWxpbmU/IEVhY2ggdGltZSBpdCBtb3ZlcyBbZm9yd2FyZF0gcGFzdCB0aGF0IHNwb3QsIGl0IHdvdWxkIG1vdmUgYmFjaywgYW5kIHNpbmNlIHN1cHByZXNzRXZlbnRzIGlzIHRydWUsIGl0J2QgcmVzZXQgX3Jhd1ByZXZUaW1lIHRvIF90aW55TnVtIHNvIHRoYXQgd2hlbiBpdCBiZWdpbnMgYWdhaW4sIHRoZSBjYWxsYmFjayB3b3VsZCBmaXJlIChzbyB1bHRpbWF0ZWx5IGl0IGNvdWxkIGJvdW5jZSBiYWNrIGFuZCBmb3J0aCBkdXJpbmcgdGhhdCB0d2VlbikuIEFnYWluLCB0aGlzIGlzIGEgdmVyeSB1bmNvbW1vbiBzY2VuYXJpbywgYnV0IHBvc3NpYmxlIG5vbmV0aGVsZXNzLlxuXHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0XG4vLy0tLS0gU1RBVElDIEZVTkNUSU9OUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFxuXHRcdFR3ZWVuTWF4LnRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycykge1xuXHRcdFx0cmV0dXJuIG5ldyBUd2Vlbk1heCh0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKTtcblx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LmZyb20gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKSB7XG5cdFx0XHR2YXJzLnJ1bkJhY2t3YXJkcyA9IHRydWU7XG5cdFx0XHR2YXJzLmltbWVkaWF0ZVJlbmRlciA9ICh2YXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSk7XG5cdFx0XHRyZXR1cm4gbmV3IFR3ZWVuTWF4KHRhcmdldCwgZHVyYXRpb24sIHZhcnMpO1xuXHRcdH07XG5cdFx0XG5cdFx0VHdlZW5NYXguZnJvbVRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgZnJvbVZhcnMsIHRvVmFycykge1xuXHRcdFx0dG9WYXJzLnN0YXJ0QXQgPSBmcm9tVmFycztcblx0XHRcdHRvVmFycy5pbW1lZGlhdGVSZW5kZXIgPSAodG9WYXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSAmJiBmcm9tVmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UpO1xuXHRcdFx0cmV0dXJuIG5ldyBUd2Vlbk1heCh0YXJnZXQsIGR1cmF0aW9uLCB0b1ZhcnMpO1xuXHRcdH07XG5cdFx0XG5cdFx0VHdlZW5NYXguc3RhZ2dlclRvID0gVHdlZW5NYXguYWxsVG8gPSBmdW5jdGlvbih0YXJnZXRzLCBkdXJhdGlvbiwgdmFycywgc3RhZ2dlciwgb25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZUFsbFBhcmFtcywgb25Db21wbGV0ZUFsbFNjb3BlKSB7XG5cdFx0XHRzdGFnZ2VyID0gc3RhZ2dlciB8fCAwO1xuXHRcdFx0dmFyIGRlbGF5ID0gMCxcblx0XHRcdFx0YSA9IFtdLFxuXHRcdFx0XHRmaW5hbENvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKHZhcnMub25Db21wbGV0ZSkge1xuXHRcdFx0XHRcdFx0dmFycy5vbkNvbXBsZXRlLmFwcGx5KHZhcnMub25Db21wbGV0ZVNjb3BlIHx8IHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9uQ29tcGxldGVBbGwuYXBwbHkob25Db21wbGV0ZUFsbFNjb3BlIHx8IHZhcnMuY2FsbGJhY2tTY29wZSB8fCB0aGlzLCBvbkNvbXBsZXRlQWxsUGFyYW1zIHx8IF9ibGFua0FycmF5KTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Y3ljbGUgPSB2YXJzLmN5Y2xlLFxuXHRcdFx0XHRmcm9tQ3ljbGUgPSAodmFycy5zdGFydEF0ICYmIHZhcnMuc3RhcnRBdC5jeWNsZSksXG5cdFx0XHRcdGwsIGNvcHksIGksIHA7XG5cdFx0XHRpZiAoIV9pc0FycmF5KHRhcmdldHMpKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YodGFyZ2V0cykgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHR0YXJnZXRzID0gVHdlZW5MaXRlLnNlbGVjdG9yKHRhcmdldHMpIHx8IHRhcmdldHM7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKF9pc1NlbGVjdG9yKHRhcmdldHMpKSB7XG5cdFx0XHRcdFx0dGFyZ2V0cyA9IF9zbGljZSh0YXJnZXRzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGFyZ2V0cyA9IHRhcmdldHMgfHwgW107XG5cdFx0XHRpZiAoc3RhZ2dlciA8IDApIHtcblx0XHRcdFx0dGFyZ2V0cyA9IF9zbGljZSh0YXJnZXRzKTtcblx0XHRcdFx0dGFyZ2V0cy5yZXZlcnNlKCk7XG5cdFx0XHRcdHN0YWdnZXIgKj0gLTE7XG5cdFx0XHR9XG5cdFx0XHRsID0gdGFyZ2V0cy5sZW5ndGggLSAxO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8PSBsOyBpKyspIHtcblx0XHRcdFx0Y29weSA9IHt9O1xuXHRcdFx0XHRmb3IgKHAgaW4gdmFycykge1xuXHRcdFx0XHRcdGNvcHlbcF0gPSB2YXJzW3BdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjeWNsZSkge1xuXHRcdFx0XHRcdF9hcHBseUN5Y2xlKGNvcHksIHRhcmdldHMsIGkpO1xuXHRcdFx0XHRcdGlmIChjb3B5LmR1cmF0aW9uICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGR1cmF0aW9uID0gY29weS5kdXJhdGlvbjtcblx0XHRcdFx0XHRcdGRlbGV0ZSBjb3B5LmR1cmF0aW9uO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZnJvbUN5Y2xlKSB7XG5cdFx0XHRcdFx0ZnJvbUN5Y2xlID0gY29weS5zdGFydEF0ID0ge307XG5cdFx0XHRcdFx0Zm9yIChwIGluIHZhcnMuc3RhcnRBdCkge1xuXHRcdFx0XHRcdFx0ZnJvbUN5Y2xlW3BdID0gdmFycy5zdGFydEF0W3BdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRfYXBwbHlDeWNsZShjb3B5LnN0YXJ0QXQsIHRhcmdldHMsIGkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvcHkuZGVsYXkgPSBkZWxheSArIChjb3B5LmRlbGF5IHx8IDApO1xuXHRcdFx0XHRpZiAoaSA9PT0gbCAmJiBvbkNvbXBsZXRlQWxsKSB7XG5cdFx0XHRcdFx0Y29weS5vbkNvbXBsZXRlID0gZmluYWxDb21wbGV0ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhW2ldID0gbmV3IFR3ZWVuTWF4KHRhcmdldHNbaV0sIGR1cmF0aW9uLCBjb3B5KTtcblx0XHRcdFx0ZGVsYXkgKz0gc3RhZ2dlcjtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhO1xuXHRcdH07XG5cdFx0XG5cdFx0VHdlZW5NYXguc3RhZ2dlckZyb20gPSBUd2Vlbk1heC5hbGxGcm9tID0gZnVuY3Rpb24odGFyZ2V0cywgZHVyYXRpb24sIHZhcnMsIHN0YWdnZXIsIG9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVBbGxQYXJhbXMsIG9uQ29tcGxldGVBbGxTY29wZSkge1xuXHRcdFx0dmFycy5ydW5CYWNrd2FyZHMgPSB0cnVlO1xuXHRcdFx0dmFycy5pbW1lZGlhdGVSZW5kZXIgPSAodmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UpO1xuXHRcdFx0cmV0dXJuIFR3ZWVuTWF4LnN0YWdnZXJUbyh0YXJnZXRzLCBkdXJhdGlvbiwgdmFycywgc3RhZ2dlciwgb25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZUFsbFBhcmFtcywgb25Db21wbGV0ZUFsbFNjb3BlKTtcblx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LnN0YWdnZXJGcm9tVG8gPSBUd2Vlbk1heC5hbGxGcm9tVG8gPSBmdW5jdGlvbih0YXJnZXRzLCBkdXJhdGlvbiwgZnJvbVZhcnMsIHRvVmFycywgc3RhZ2dlciwgb25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZUFsbFBhcmFtcywgb25Db21wbGV0ZUFsbFNjb3BlKSB7XG5cdFx0XHR0b1ZhcnMuc3RhcnRBdCA9IGZyb21WYXJzO1xuXHRcdFx0dG9WYXJzLmltbWVkaWF0ZVJlbmRlciA9ICh0b1ZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlICYmIGZyb21WYXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSk7XG5cdFx0XHRyZXR1cm4gVHdlZW5NYXguc3RhZ2dlclRvKHRhcmdldHMsIGR1cmF0aW9uLCB0b1ZhcnMsIHN0YWdnZXIsIG9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVBbGxQYXJhbXMsIG9uQ29tcGxldGVBbGxTY29wZSk7XG5cdFx0fTtcblx0XHRcdFx0XG5cdFx0VHdlZW5NYXguZGVsYXllZENhbGwgPSBmdW5jdGlvbihkZWxheSwgY2FsbGJhY2ssIHBhcmFtcywgc2NvcGUsIHVzZUZyYW1lcykge1xuXHRcdFx0cmV0dXJuIG5ldyBUd2Vlbk1heChjYWxsYmFjaywgMCwge2RlbGF5OmRlbGF5LCBvbkNvbXBsZXRlOmNhbGxiYWNrLCBvbkNvbXBsZXRlUGFyYW1zOnBhcmFtcywgY2FsbGJhY2tTY29wZTpzY29wZSwgb25SZXZlcnNlQ29tcGxldGU6Y2FsbGJhY2ssIG9uUmV2ZXJzZUNvbXBsZXRlUGFyYW1zOnBhcmFtcywgaW1tZWRpYXRlUmVuZGVyOmZhbHNlLCB1c2VGcmFtZXM6dXNlRnJhbWVzLCBvdmVyd3JpdGU6MH0pO1xuXHRcdH07XG5cdFx0XG5cdFx0VHdlZW5NYXguc2V0ID0gZnVuY3Rpb24odGFyZ2V0LCB2YXJzKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFR3ZWVuTWF4KHRhcmdldCwgMCwgdmFycyk7XG5cdFx0fTtcblx0XHRcblx0XHRUd2Vlbk1heC5pc1R3ZWVuaW5nID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm4gKFR3ZWVuTGl0ZS5nZXRUd2VlbnNPZih0YXJnZXQsIHRydWUpLmxlbmd0aCA+IDApO1xuXHRcdH07XG5cdFx0XG5cdFx0dmFyIF9nZXRDaGlsZHJlbk9mID0gZnVuY3Rpb24odGltZWxpbmUsIGluY2x1ZGVUaW1lbGluZXMpIHtcblx0XHRcdFx0dmFyIGEgPSBbXSxcblx0XHRcdFx0XHRjbnQgPSAwLFxuXHRcdFx0XHRcdHR3ZWVuID0gdGltZWxpbmUuX2ZpcnN0O1xuXHRcdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0XHRpZiAodHdlZW4gaW5zdGFuY2VvZiBUd2VlbkxpdGUpIHtcblx0XHRcdFx0XHRcdGFbY250KytdID0gdHdlZW47XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChpbmNsdWRlVGltZWxpbmVzKSB7XG5cdFx0XHRcdFx0XHRcdGFbY250KytdID0gdHdlZW47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRhID0gYS5jb25jYXQoX2dldENoaWxkcmVuT2YodHdlZW4sIGluY2x1ZGVUaW1lbGluZXMpKTtcblx0XHRcdFx0XHRcdGNudCA9IGEubGVuZ3RoO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0d2VlbiA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBhO1xuXHRcdFx0fSwgXG5cdFx0XHRnZXRBbGxUd2VlbnMgPSBUd2Vlbk1heC5nZXRBbGxUd2VlbnMgPSBmdW5jdGlvbihpbmNsdWRlVGltZWxpbmVzKSB7XG5cdFx0XHRcdHJldHVybiBfZ2V0Q2hpbGRyZW5PZihBbmltYXRpb24uX3Jvb3RUaW1lbGluZSwgaW5jbHVkZVRpbWVsaW5lcykuY29uY2F0KCBfZ2V0Q2hpbGRyZW5PZihBbmltYXRpb24uX3Jvb3RGcmFtZXNUaW1lbGluZSwgaW5jbHVkZVRpbWVsaW5lcykgKTtcblx0XHRcdH07XG5cdFx0XG5cdFx0VHdlZW5NYXgua2lsbEFsbCA9IGZ1bmN0aW9uKGNvbXBsZXRlLCB0d2VlbnMsIGRlbGF5ZWRDYWxscywgdGltZWxpbmVzKSB7XG5cdFx0XHRpZiAodHdlZW5zID09IG51bGwpIHtcblx0XHRcdFx0dHdlZW5zID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChkZWxheWVkQ2FsbHMgPT0gbnVsbCkge1xuXHRcdFx0XHRkZWxheWVkQ2FsbHMgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGEgPSBnZXRBbGxUd2VlbnMoKHRpbWVsaW5lcyAhPSBmYWxzZSkpLFxuXHRcdFx0XHRsID0gYS5sZW5ndGgsXG5cdFx0XHRcdGFsbFRydWUgPSAodHdlZW5zICYmIGRlbGF5ZWRDYWxscyAmJiB0aW1lbGluZXMpLFxuXHRcdFx0XHRpc0RDLCB0d2VlbiwgaTtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0dHdlZW4gPSBhW2ldO1xuXHRcdFx0XHRpZiAoYWxsVHJ1ZSB8fCAodHdlZW4gaW5zdGFuY2VvZiBTaW1wbGVUaW1lbGluZSkgfHwgKChpc0RDID0gKHR3ZWVuLnRhcmdldCA9PT0gdHdlZW4udmFycy5vbkNvbXBsZXRlKSkgJiYgZGVsYXllZENhbGxzKSB8fCAodHdlZW5zICYmICFpc0RDKSkge1xuXHRcdFx0XHRcdGlmIChjb21wbGV0ZSkge1xuXHRcdFx0XHRcdFx0dHdlZW4udG90YWxUaW1lKHR3ZWVuLl9yZXZlcnNlZCA/IDAgOiB0d2Vlbi50b3RhbER1cmF0aW9uKCkpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0d2Vlbi5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0XG5cdFx0VHdlZW5NYXgua2lsbENoaWxkVHdlZW5zT2YgPSBmdW5jdGlvbihwYXJlbnQsIGNvbXBsZXRlKSB7XG5cdFx0XHRpZiAocGFyZW50ID09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHRsID0gVHdlZW5MaXRlSW50ZXJuYWxzLnR3ZWVuTG9va3VwLFxuXHRcdFx0XHRhLCBjdXJQYXJlbnQsIHAsIGksIGw7XG5cdFx0XHRpZiAodHlwZW9mKHBhcmVudCkgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0cGFyZW50ID0gVHdlZW5MaXRlLnNlbGVjdG9yKHBhcmVudCkgfHwgcGFyZW50O1xuXHRcdFx0fVxuXHRcdFx0aWYgKF9pc1NlbGVjdG9yKHBhcmVudCkpIHtcblx0XHRcdFx0cGFyZW50ID0gX3NsaWNlKHBhcmVudCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoX2lzQXJyYXkocGFyZW50KSkge1xuXHRcdFx0XHRpID0gcGFyZW50Lmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0VHdlZW5NYXgua2lsbENoaWxkVHdlZW5zT2YocGFyZW50W2ldLCBjb21wbGV0ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0YSA9IFtdO1xuXHRcdFx0Zm9yIChwIGluIHRsKSB7XG5cdFx0XHRcdGN1clBhcmVudCA9IHRsW3BdLnRhcmdldC5wYXJlbnROb2RlO1xuXHRcdFx0XHR3aGlsZSAoY3VyUGFyZW50KSB7XG5cdFx0XHRcdFx0aWYgKGN1clBhcmVudCA9PT0gcGFyZW50KSB7XG5cdFx0XHRcdFx0XHRhID0gYS5jb25jYXQodGxbcF0udHdlZW5zKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y3VyUGFyZW50ID0gY3VyUGFyZW50LnBhcmVudE5vZGU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGwgPSBhLmxlbmd0aDtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0aWYgKGNvbXBsZXRlKSB7XG5cdFx0XHRcdFx0YVtpXS50b3RhbFRpbWUoYVtpXS50b3RhbER1cmF0aW9uKCkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFbaV0uX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dmFyIF9jaGFuZ2VQYXVzZSA9IGZ1bmN0aW9uKHBhdXNlLCB0d2VlbnMsIGRlbGF5ZWRDYWxscywgdGltZWxpbmVzKSB7XG5cdFx0XHR0d2VlbnMgPSAodHdlZW5zICE9PSBmYWxzZSk7XG5cdFx0XHRkZWxheWVkQ2FsbHMgPSAoZGVsYXllZENhbGxzICE9PSBmYWxzZSk7XG5cdFx0XHR0aW1lbGluZXMgPSAodGltZWxpbmVzICE9PSBmYWxzZSk7XG5cdFx0XHR2YXIgYSA9IGdldEFsbFR3ZWVucyh0aW1lbGluZXMpLFxuXHRcdFx0XHRhbGxUcnVlID0gKHR3ZWVucyAmJiBkZWxheWVkQ2FsbHMgJiYgdGltZWxpbmVzKSxcblx0XHRcdFx0aSA9IGEubGVuZ3RoLFxuXHRcdFx0XHRpc0RDLCB0d2Vlbjtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHR0d2VlbiA9IGFbaV07XG5cdFx0XHRcdGlmIChhbGxUcnVlIHx8ICh0d2VlbiBpbnN0YW5jZW9mIFNpbXBsZVRpbWVsaW5lKSB8fCAoKGlzREMgPSAodHdlZW4udGFyZ2V0ID09PSB0d2Vlbi52YXJzLm9uQ29tcGxldGUpKSAmJiBkZWxheWVkQ2FsbHMpIHx8ICh0d2VlbnMgJiYgIWlzREMpKSB7XG5cdFx0XHRcdFx0dHdlZW4ucGF1c2VkKHBhdXNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0XG5cdFx0VHdlZW5NYXgucGF1c2VBbGwgPSBmdW5jdGlvbih0d2VlbnMsIGRlbGF5ZWRDYWxscywgdGltZWxpbmVzKSB7XG5cdFx0XHRfY2hhbmdlUGF1c2UodHJ1ZSwgdHdlZW5zLCBkZWxheWVkQ2FsbHMsIHRpbWVsaW5lcyk7XG5cdFx0fTtcblx0XHRcblx0XHRUd2Vlbk1heC5yZXN1bWVBbGwgPSBmdW5jdGlvbih0d2VlbnMsIGRlbGF5ZWRDYWxscywgdGltZWxpbmVzKSB7XG5cdFx0XHRfY2hhbmdlUGF1c2UoZmFsc2UsIHR3ZWVucywgZGVsYXllZENhbGxzLCB0aW1lbGluZXMpO1xuXHRcdH07XG5cblx0XHRUd2Vlbk1heC5nbG9iYWxUaW1lU2NhbGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dmFyIHRsID0gQW5pbWF0aW9uLl9yb290VGltZWxpbmUsXG5cdFx0XHRcdHQgPSBUd2VlbkxpdGUudGlja2VyLnRpbWU7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRsLl90aW1lU2NhbGU7XG5cdFx0XHR9XG5cdFx0XHR2YWx1ZSA9IHZhbHVlIHx8IF90aW55TnVtOyAvL2Nhbid0IGFsbG93IHplcm8gYmVjYXVzZSBpdCdsbCB0aHJvdyB0aGUgbWF0aCBvZmZcblx0XHRcdHRsLl9zdGFydFRpbWUgPSB0IC0gKCh0IC0gdGwuX3N0YXJ0VGltZSkgKiB0bC5fdGltZVNjYWxlIC8gdmFsdWUpO1xuXHRcdFx0dGwgPSBBbmltYXRpb24uX3Jvb3RGcmFtZXNUaW1lbGluZTtcblx0XHRcdHQgPSBUd2VlbkxpdGUudGlja2VyLmZyYW1lO1xuXHRcdFx0dGwuX3N0YXJ0VGltZSA9IHQgLSAoKHQgLSB0bC5fc3RhcnRUaW1lKSAqIHRsLl90aW1lU2NhbGUgLyB2YWx1ZSk7XG5cdFx0XHR0bC5fdGltZVNjYWxlID0gQW5pbWF0aW9uLl9yb290VGltZWxpbmUuX3RpbWVTY2FsZSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH07XG5cdFx0XG5cdFxuLy8tLS0tIEdFVFRFUlMgLyBTRVRURVJTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcblx0XHRwLnByb2dyZXNzID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IHRoaXMuX3RpbWUgLyB0aGlzLmR1cmF0aW9uKCkgOiB0aGlzLnRvdGFsVGltZSggdGhpcy5kdXJhdGlvbigpICogKCh0aGlzLl95b3lvICYmICh0aGlzLl9jeWNsZSAmIDEpICE9PSAwKSA/IDEgLSB2YWx1ZSA6IHZhbHVlKSArICh0aGlzLl9jeWNsZSAqICh0aGlzLl9kdXJhdGlvbiArIHRoaXMuX3JlcGVhdERlbGF5KSksIHN1cHByZXNzRXZlbnRzKTtcblx0XHR9O1xuXHRcdFxuXHRcdHAudG90YWxQcm9ncmVzcyA9IGZ1bmN0aW9uKHZhbHVlLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0cmV0dXJuICghYXJndW1lbnRzLmxlbmd0aCkgPyB0aGlzLl90b3RhbFRpbWUgLyB0aGlzLnRvdGFsRHVyYXRpb24oKSA6IHRoaXMudG90YWxUaW1lKCB0aGlzLnRvdGFsRHVyYXRpb24oKSAqIHZhbHVlLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0fTtcblx0XHRcblx0XHRwLnRpbWUgPSBmdW5jdGlvbih2YWx1ZSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fdGltZTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9kaXJ0eSkge1xuXHRcdFx0XHR0aGlzLnRvdGFsRHVyYXRpb24oKTtcblx0XHRcdH1cblx0XHRcdGlmICh2YWx1ZSA+IHRoaXMuX2R1cmF0aW9uKSB7XG5cdFx0XHRcdHZhbHVlID0gdGhpcy5fZHVyYXRpb247XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5feW95byAmJiAodGhpcy5fY3ljbGUgJiAxKSAhPT0gMCkge1xuXHRcdFx0XHR2YWx1ZSA9ICh0aGlzLl9kdXJhdGlvbiAtIHZhbHVlKSArICh0aGlzLl9jeWNsZSAqICh0aGlzLl9kdXJhdGlvbiArIHRoaXMuX3JlcGVhdERlbGF5KSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuX3JlcGVhdCAhPT0gMCkge1xuXHRcdFx0XHR2YWx1ZSArPSB0aGlzLl9jeWNsZSAqICh0aGlzLl9kdXJhdGlvbiArIHRoaXMuX3JlcGVhdERlbGF5KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnRvdGFsVGltZSh2YWx1ZSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLmR1cmF0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZHVyYXRpb247IC8vZG9uJ3Qgc2V0IF9kaXJ0eSA9IGZhbHNlIGJlY2F1c2UgdGhlcmUgY291bGQgYmUgcmVwZWF0cyB0aGF0IGhhdmVuJ3QgYmVlbiBmYWN0b3JlZCBpbnRvIHRoZSBfdG90YWxEdXJhdGlvbiB5ZXQuIE90aGVyd2lzZSwgaWYgeW91IGNyZWF0ZSBhIHJlcGVhdGVkIFR3ZWVuTWF4IGFuZCB0aGVuIGltbWVkaWF0ZWx5IGNoZWNrIGl0cyBkdXJhdGlvbigpLCBpdCB3b3VsZCBjYWNoZSB0aGUgdmFsdWUgYW5kIHRoZSB0b3RhbER1cmF0aW9uIHdvdWxkIG5vdCBiZSBjb3JyZWN0LCB0aHVzIHJlcGVhdHMgd291bGRuJ3QgdGFrZSBlZmZlY3QuXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gQW5pbWF0aW9uLnByb3RvdHlwZS5kdXJhdGlvbi5jYWxsKHRoaXMsIHZhbHVlKTtcblx0XHR9O1xuXG5cdFx0cC50b3RhbER1cmF0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRpZiAodGhpcy5fZGlydHkpIHtcblx0XHRcdFx0XHQvL2luc3RlYWQgb2YgSW5maW5pdHksIHdlIHVzZSA5OTk5OTk5OTk5OTkgc28gdGhhdCB3ZSBjYW4gYWNjb21tb2RhdGUgcmV2ZXJzZXNcblx0XHRcdFx0XHR0aGlzLl90b3RhbER1cmF0aW9uID0gKHRoaXMuX3JlcGVhdCA9PT0gLTEpID8gOTk5OTk5OTk5OTk5IDogdGhpcy5fZHVyYXRpb24gKiAodGhpcy5fcmVwZWF0ICsgMSkgKyAodGhpcy5fcmVwZWF0RGVsYXkgKiB0aGlzLl9yZXBlYXQpO1xuXHRcdFx0XHRcdHRoaXMuX2RpcnR5ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RvdGFsRHVyYXRpb247XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKHRoaXMuX3JlcGVhdCA9PT0gLTEpID8gdGhpcyA6IHRoaXMuZHVyYXRpb24oICh2YWx1ZSAtICh0aGlzLl9yZXBlYXQgKiB0aGlzLl9yZXBlYXREZWxheSkpIC8gKHRoaXMuX3JlcGVhdCArIDEpICk7XG5cdFx0fTtcblx0XHRcblx0XHRwLnJlcGVhdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3JlcGVhdDtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3JlcGVhdCA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuY2FjaGUodHJ1ZSk7XG5cdFx0fTtcblx0XHRcblx0XHRwLnJlcGVhdERlbGF5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcmVwZWF0RGVsYXk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9yZXBlYXREZWxheSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuY2FjaGUodHJ1ZSk7XG5cdFx0fTtcblx0XHRcblx0XHRwLnlveW8gPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl95b3lvO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5feW95byA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblx0XHRcblx0XHRcblx0XHRyZXR1cm4gVHdlZW5NYXg7XG5cdFx0XG5cdH0sIHRydWUpO1xuXG5cblxuXG5cblxuXG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBUaW1lbGluZUxpdGVcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHRfZ3NTY29wZS5fZ3NEZWZpbmUoXCJUaW1lbGluZUxpdGVcIiwgW1wiY29yZS5BbmltYXRpb25cIixcImNvcmUuU2ltcGxlVGltZWxpbmVcIixcIlR3ZWVuTGl0ZVwiXSwgZnVuY3Rpb24oQW5pbWF0aW9uLCBTaW1wbGVUaW1lbGluZSwgVHdlZW5MaXRlKSB7XG5cblx0XHR2YXIgVGltZWxpbmVMaXRlID0gZnVuY3Rpb24odmFycykge1xuXHRcdFx0XHRTaW1wbGVUaW1lbGluZS5jYWxsKHRoaXMsIHZhcnMpO1xuXHRcdFx0XHR0aGlzLl9sYWJlbHMgPSB7fTtcblx0XHRcdFx0dGhpcy5hdXRvUmVtb3ZlQ2hpbGRyZW4gPSAodGhpcy52YXJzLmF1dG9SZW1vdmVDaGlsZHJlbiA9PT0gdHJ1ZSk7XG5cdFx0XHRcdHRoaXMuc21vb3RoQ2hpbGRUaW1pbmcgPSAodGhpcy52YXJzLnNtb290aENoaWxkVGltaW5nID09PSB0cnVlKTtcblx0XHRcdFx0dGhpcy5fc29ydENoaWxkcmVuID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5fb25VcGRhdGUgPSB0aGlzLnZhcnMub25VcGRhdGU7XG5cdFx0XHRcdHZhciB2ID0gdGhpcy52YXJzLFxuXHRcdFx0XHRcdHZhbCwgcDtcblx0XHRcdFx0Zm9yIChwIGluIHYpIHtcblx0XHRcdFx0XHR2YWwgPSB2W3BdO1xuXHRcdFx0XHRcdGlmIChfaXNBcnJheSh2YWwpKSBpZiAodmFsLmpvaW4oXCJcIikuaW5kZXhPZihcIntzZWxmfVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdHZbcF0gPSB0aGlzLl9zd2FwU2VsZkluUGFyYW1zKHZhbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChfaXNBcnJheSh2LnR3ZWVucykpIHtcblx0XHRcdFx0XHR0aGlzLmFkZCh2LnR3ZWVucywgMCwgdi5hbGlnbiwgdi5zdGFnZ2VyKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdF90aW55TnVtID0gMC4wMDAwMDAwMDAxLFxuXHRcdFx0VHdlZW5MaXRlSW50ZXJuYWxzID0gVHdlZW5MaXRlLl9pbnRlcm5hbHMsXG5cdFx0XHRfaW50ZXJuYWxzID0gVGltZWxpbmVMaXRlLl9pbnRlcm5hbHMgPSB7fSxcblx0XHRcdF9pc1NlbGVjdG9yID0gVHdlZW5MaXRlSW50ZXJuYWxzLmlzU2VsZWN0b3IsXG5cdFx0XHRfaXNBcnJheSA9IFR3ZWVuTGl0ZUludGVybmFscy5pc0FycmF5LFxuXHRcdFx0X2xhenlUd2VlbnMgPSBUd2VlbkxpdGVJbnRlcm5hbHMubGF6eVR3ZWVucyxcblx0XHRcdF9sYXp5UmVuZGVyID0gVHdlZW5MaXRlSW50ZXJuYWxzLmxhenlSZW5kZXIsXG5cdFx0XHRfZ2xvYmFscyA9IF9nc1Njb3BlLl9nc0RlZmluZS5nbG9iYWxzLFxuXHRcdFx0X2NvcHkgPSBmdW5jdGlvbih2YXJzKSB7XG5cdFx0XHRcdHZhciBjb3B5ID0ge30sIHA7XG5cdFx0XHRcdGZvciAocCBpbiB2YXJzKSB7XG5cdFx0XHRcdFx0Y29weVtwXSA9IHZhcnNbcF07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGNvcHk7XG5cdFx0XHR9LFxuXHRcdFx0X2FwcGx5Q3ljbGUgPSBmdW5jdGlvbih2YXJzLCB0YXJnZXRzLCBpKSB7XG5cdFx0XHRcdHZhciBhbHQgPSB2YXJzLmN5Y2xlLFxuXHRcdFx0XHRcdHAsIHZhbDtcblx0XHRcdFx0Zm9yIChwIGluIGFsdCkge1xuXHRcdFx0XHRcdHZhbCA9IGFsdFtwXTtcblx0XHRcdFx0XHR2YXJzW3BdID0gKHR5cGVvZih2YWwpID09PSBcImZ1bmN0aW9uXCIpID8gdmFsLmNhbGwodGFyZ2V0c1tpXSwgaSkgOiB2YWxbaSAlIHZhbC5sZW5ndGhdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRlbGV0ZSB2YXJzLmN5Y2xlO1xuXHRcdFx0fSxcblx0XHRcdF9wYXVzZUNhbGxiYWNrID0gX2ludGVybmFscy5wYXVzZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7fSxcblx0XHRcdF9zbGljZSA9IGZ1bmN0aW9uKGEpIHsgLy9kb24ndCB1c2UgW10uc2xpY2UgYmVjYXVzZSB0aGF0IGRvZXNuJ3Qgd29yayBpbiBJRTggd2l0aCBhIE5vZGVMaXN0IHRoYXQncyByZXR1cm5lZCBieSBxdWVyeVNlbGVjdG9yQWxsKClcblx0XHRcdFx0dmFyIGIgPSBbXSxcblx0XHRcdFx0XHRsID0gYS5sZW5ndGgsXG5cdFx0XHRcdFx0aTtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSAhPT0gbDsgYi5wdXNoKGFbaSsrXSkpO1xuXHRcdFx0XHRyZXR1cm4gYjtcblx0XHRcdH0sXG5cdFx0XHRwID0gVGltZWxpbmVMaXRlLnByb3RvdHlwZSA9IG5ldyBTaW1wbGVUaW1lbGluZSgpO1xuXG5cdFx0VGltZWxpbmVMaXRlLnZlcnNpb24gPSBcIjEuMTkuMFwiO1xuXHRcdHAuY29uc3RydWN0b3IgPSBUaW1lbGluZUxpdGU7XG5cdFx0cC5raWxsKCkuX2djID0gcC5fZm9yY2luZ1BsYXloZWFkID0gcC5faGFzUGF1c2UgPSBmYWxzZTtcblxuXHRcdC8qIG1pZ2h0IHVzZSBsYXRlci4uLlxuXHRcdC8vdHJhbnNsYXRlcyBhIGxvY2FsIHRpbWUgaW5zaWRlIGFuIGFuaW1hdGlvbiB0byB0aGUgY29ycmVzcG9uZGluZyB0aW1lIG9uIHRoZSByb290L2dsb2JhbCB0aW1lbGluZSwgZmFjdG9yaW5nIGluIGFsbCBuZXN0aW5nIGFuZCB0aW1lU2NhbGVzLlxuXHRcdGZ1bmN0aW9uIGxvY2FsVG9HbG9iYWwodGltZSwgYW5pbWF0aW9uKSB7XG5cdFx0XHR3aGlsZSAoYW5pbWF0aW9uKSB7XG5cdFx0XHRcdHRpbWUgPSAodGltZSAvIGFuaW1hdGlvbi5fdGltZVNjYWxlKSArIGFuaW1hdGlvbi5fc3RhcnRUaW1lO1xuXHRcdFx0XHRhbmltYXRpb24gPSBhbmltYXRpb24udGltZWxpbmU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGltZTtcblx0XHR9XG5cblx0XHQvL3RyYW5zbGF0ZXMgdGhlIHN1cHBsaWVkIHRpbWUgb24gdGhlIHJvb3QvZ2xvYmFsIHRpbWVsaW5lIGludG8gdGhlIGNvcnJlc3BvbmRpbmcgbG9jYWwgdGltZSBpbnNpZGUgYSBwYXJ0aWN1bGFyIGFuaW1hdGlvbiwgZmFjdG9yaW5nIGluIGFsbCBuZXN0aW5nIGFuZCB0aW1lU2NhbGVzXG5cdFx0ZnVuY3Rpb24gZ2xvYmFsVG9Mb2NhbCh0aW1lLCBhbmltYXRpb24pIHtcblx0XHRcdHZhciBzY2FsZSA9IDE7XG5cdFx0XHR0aW1lIC09IGxvY2FsVG9HbG9iYWwoMCwgYW5pbWF0aW9uKTtcblx0XHRcdHdoaWxlIChhbmltYXRpb24pIHtcblx0XHRcdFx0c2NhbGUgKj0gYW5pbWF0aW9uLl90aW1lU2NhbGU7XG5cdFx0XHRcdGFuaW1hdGlvbiA9IGFuaW1hdGlvbi50aW1lbGluZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aW1lICogc2NhbGU7XG5cdFx0fVxuXHRcdCovXG5cblx0XHRwLnRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycywgcG9zaXRpb24pIHtcblx0XHRcdHZhciBFbmdpbmUgPSAodmFycy5yZXBlYXQgJiYgX2dsb2JhbHMuVHdlZW5NYXgpIHx8IFR3ZWVuTGl0ZTtcblx0XHRcdHJldHVybiBkdXJhdGlvbiA/IHRoaXMuYWRkKCBuZXcgRW5naW5lKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpLCBwb3NpdGlvbikgOiB0aGlzLnNldCh0YXJnZXQsIHZhcnMsIHBvc2l0aW9uKTtcblx0XHR9O1xuXG5cdFx0cC5mcm9tID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycywgcG9zaXRpb24pIHtcblx0XHRcdHJldHVybiB0aGlzLmFkZCggKCh2YXJzLnJlcGVhdCAmJiBfZ2xvYmFscy5Ud2Vlbk1heCkgfHwgVHdlZW5MaXRlKS5mcm9tKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpLCBwb3NpdGlvbik7XG5cdFx0fTtcblxuXHRcdHAuZnJvbVRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgZnJvbVZhcnMsIHRvVmFycywgcG9zaXRpb24pIHtcblx0XHRcdHZhciBFbmdpbmUgPSAodG9WYXJzLnJlcGVhdCAmJiBfZ2xvYmFscy5Ud2Vlbk1heCkgfHwgVHdlZW5MaXRlO1xuXHRcdFx0cmV0dXJuIGR1cmF0aW9uID8gdGhpcy5hZGQoIEVuZ2luZS5mcm9tVG8odGFyZ2V0LCBkdXJhdGlvbiwgZnJvbVZhcnMsIHRvVmFycyksIHBvc2l0aW9uKSA6IHRoaXMuc2V0KHRhcmdldCwgdG9WYXJzLCBwb3NpdGlvbik7XG5cdFx0fTtcblxuXHRcdHAuc3RhZ2dlclRvID0gZnVuY3Rpb24odGFyZ2V0cywgZHVyYXRpb24sIHZhcnMsIHN0YWdnZXIsIHBvc2l0aW9uLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zLCBvbkNvbXBsZXRlQWxsU2NvcGUpIHtcblx0XHRcdHZhciB0bCA9IG5ldyBUaW1lbGluZUxpdGUoe29uQ29tcGxldGU6b25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZVBhcmFtczpvbkNvbXBsZXRlQWxsUGFyYW1zLCBjYWxsYmFja1Njb3BlOm9uQ29tcGxldGVBbGxTY29wZSwgc21vb3RoQ2hpbGRUaW1pbmc6dGhpcy5zbW9vdGhDaGlsZFRpbWluZ30pLFxuXHRcdFx0XHRjeWNsZSA9IHZhcnMuY3ljbGUsXG5cdFx0XHRcdGNvcHksIGk7XG5cdFx0XHRpZiAodHlwZW9mKHRhcmdldHMpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdHRhcmdldHMgPSBUd2VlbkxpdGUuc2VsZWN0b3IodGFyZ2V0cykgfHwgdGFyZ2V0cztcblx0XHRcdH1cblx0XHRcdHRhcmdldHMgPSB0YXJnZXRzIHx8IFtdO1xuXHRcdFx0aWYgKF9pc1NlbGVjdG9yKHRhcmdldHMpKSB7IC8vc2Vuc2VzIGlmIHRoZSB0YXJnZXRzIG9iamVjdCBpcyBhIHNlbGVjdG9yLiBJZiBpdCBpcywgd2Ugc2hvdWxkIHRyYW5zbGF0ZSBpdCBpbnRvIGFuIGFycmF5LlxuXHRcdFx0XHR0YXJnZXRzID0gX3NsaWNlKHRhcmdldHMpO1xuXHRcdFx0fVxuXHRcdFx0c3RhZ2dlciA9IHN0YWdnZXIgfHwgMDtcblx0XHRcdGlmIChzdGFnZ2VyIDwgMCkge1xuXHRcdFx0XHR0YXJnZXRzID0gX3NsaWNlKHRhcmdldHMpO1xuXHRcdFx0XHR0YXJnZXRzLnJldmVyc2UoKTtcblx0XHRcdFx0c3RhZ2dlciAqPSAtMTtcblx0XHRcdH1cblx0XHRcdGZvciAoaSA9IDA7IGkgPCB0YXJnZXRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvcHkgPSBfY29weSh2YXJzKTtcblx0XHRcdFx0aWYgKGNvcHkuc3RhcnRBdCkge1xuXHRcdFx0XHRcdGNvcHkuc3RhcnRBdCA9IF9jb3B5KGNvcHkuc3RhcnRBdCk7XG5cdFx0XHRcdFx0aWYgKGNvcHkuc3RhcnRBdC5jeWNsZSkge1xuXHRcdFx0XHRcdFx0X2FwcGx5Q3ljbGUoY29weS5zdGFydEF0LCB0YXJnZXRzLCBpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGN5Y2xlKSB7XG5cdFx0XHRcdFx0X2FwcGx5Q3ljbGUoY29weSwgdGFyZ2V0cywgaSk7XG5cdFx0XHRcdFx0aWYgKGNvcHkuZHVyYXRpb24gIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0ZHVyYXRpb24gPSBjb3B5LmR1cmF0aW9uO1xuXHRcdFx0XHRcdFx0ZGVsZXRlIGNvcHkuZHVyYXRpb247XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRsLnRvKHRhcmdldHNbaV0sIGR1cmF0aW9uLCBjb3B5LCBpICogc3RhZ2dlcik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5hZGQodGwsIHBvc2l0aW9uKTtcblx0XHR9O1xuXG5cdFx0cC5zdGFnZ2VyRnJvbSA9IGZ1bmN0aW9uKHRhcmdldHMsIGR1cmF0aW9uLCB2YXJzLCBzdGFnZ2VyLCBwb3NpdGlvbiwgb25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZUFsbFBhcmFtcywgb25Db21wbGV0ZUFsbFNjb3BlKSB7XG5cdFx0XHR2YXJzLmltbWVkaWF0ZVJlbmRlciA9ICh2YXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSk7XG5cdFx0XHR2YXJzLnJ1bkJhY2t3YXJkcyA9IHRydWU7XG5cdFx0XHRyZXR1cm4gdGhpcy5zdGFnZ2VyVG8odGFyZ2V0cywgZHVyYXRpb24sIHZhcnMsIHN0YWdnZXIsIHBvc2l0aW9uLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zLCBvbkNvbXBsZXRlQWxsU2NvcGUpO1xuXHRcdH07XG5cblx0XHRwLnN0YWdnZXJGcm9tVG8gPSBmdW5jdGlvbih0YXJnZXRzLCBkdXJhdGlvbiwgZnJvbVZhcnMsIHRvVmFycywgc3RhZ2dlciwgcG9zaXRpb24sIG9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVBbGxQYXJhbXMsIG9uQ29tcGxldGVBbGxTY29wZSkge1xuXHRcdFx0dG9WYXJzLnN0YXJ0QXQgPSBmcm9tVmFycztcblx0XHRcdHRvVmFycy5pbW1lZGlhdGVSZW5kZXIgPSAodG9WYXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSAmJiBmcm9tVmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UpO1xuXHRcdFx0cmV0dXJuIHRoaXMuc3RhZ2dlclRvKHRhcmdldHMsIGR1cmF0aW9uLCB0b1ZhcnMsIHN0YWdnZXIsIHBvc2l0aW9uLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zLCBvbkNvbXBsZXRlQWxsU2NvcGUpO1xuXHRcdH07XG5cblx0XHRwLmNhbGwgPSBmdW5jdGlvbihjYWxsYmFjaywgcGFyYW1zLCBzY29wZSwgcG9zaXRpb24pIHtcblx0XHRcdHJldHVybiB0aGlzLmFkZCggVHdlZW5MaXRlLmRlbGF5ZWRDYWxsKDAsIGNhbGxiYWNrLCBwYXJhbXMsIHNjb3BlKSwgcG9zaXRpb24pO1xuXHRcdH07XG5cblx0XHRwLnNldCA9IGZ1bmN0aW9uKHRhcmdldCwgdmFycywgcG9zaXRpb24pIHtcblx0XHRcdHBvc2l0aW9uID0gdGhpcy5fcGFyc2VUaW1lT3JMYWJlbChwb3NpdGlvbiwgMCwgdHJ1ZSk7XG5cdFx0XHRpZiAodmFycy5pbW1lZGlhdGVSZW5kZXIgPT0gbnVsbCkge1xuXHRcdFx0XHR2YXJzLmltbWVkaWF0ZVJlbmRlciA9IChwb3NpdGlvbiA9PT0gdGhpcy5fdGltZSAmJiAhdGhpcy5fcGF1c2VkKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLmFkZCggbmV3IFR3ZWVuTGl0ZSh0YXJnZXQsIDAsIHZhcnMpLCBwb3NpdGlvbik7XG5cdFx0fTtcblxuXHRcdFRpbWVsaW5lTGl0ZS5leHBvcnRSb290ID0gZnVuY3Rpb24odmFycywgaWdub3JlRGVsYXllZENhbGxzKSB7XG5cdFx0XHR2YXJzID0gdmFycyB8fCB7fTtcblx0XHRcdGlmICh2YXJzLnNtb290aENoaWxkVGltaW5nID09IG51bGwpIHtcblx0XHRcdFx0dmFycy5zbW9vdGhDaGlsZFRpbWluZyA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHR2YXIgdGwgPSBuZXcgVGltZWxpbmVMaXRlKHZhcnMpLFxuXHRcdFx0XHRyb290ID0gdGwuX3RpbWVsaW5lLFxuXHRcdFx0XHR0d2VlbiwgbmV4dDtcblx0XHRcdGlmIChpZ25vcmVEZWxheWVkQ2FsbHMgPT0gbnVsbCkge1xuXHRcdFx0XHRpZ25vcmVEZWxheWVkQ2FsbHMgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cm9vdC5fcmVtb3ZlKHRsLCB0cnVlKTtcblx0XHRcdHRsLl9zdGFydFRpbWUgPSAwO1xuXHRcdFx0dGwuX3Jhd1ByZXZUaW1lID0gdGwuX3RpbWUgPSB0bC5fdG90YWxUaW1lID0gcm9vdC5fdGltZTtcblx0XHRcdHR3ZWVuID0gcm9vdC5fZmlyc3Q7XG5cdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0bmV4dCA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0XHRpZiAoIWlnbm9yZURlbGF5ZWRDYWxscyB8fCAhKHR3ZWVuIGluc3RhbmNlb2YgVHdlZW5MaXRlICYmIHR3ZWVuLnRhcmdldCA9PT0gdHdlZW4udmFycy5vbkNvbXBsZXRlKSkge1xuXHRcdFx0XHRcdHRsLmFkZCh0d2VlbiwgdHdlZW4uX3N0YXJ0VGltZSAtIHR3ZWVuLl9kZWxheSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHdlZW4gPSBuZXh0O1xuXHRcdFx0fVxuXHRcdFx0cm9vdC5hZGQodGwsIDApO1xuXHRcdFx0cmV0dXJuIHRsO1xuXHRcdH07XG5cblx0XHRwLmFkZCA9IGZ1bmN0aW9uKHZhbHVlLCBwb3NpdGlvbiwgYWxpZ24sIHN0YWdnZXIpIHtcblx0XHRcdHZhciBjdXJUaW1lLCBsLCBpLCBjaGlsZCwgdGwsIGJlZm9yZVJhd1RpbWU7XG5cdFx0XHRpZiAodHlwZW9mKHBvc2l0aW9uKSAhPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRwb3NpdGlvbiA9IHRoaXMuX3BhcnNlVGltZU9yTGFiZWwocG9zaXRpb24sIDAsIHRydWUsIHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdGlmICghKHZhbHVlIGluc3RhbmNlb2YgQW5pbWF0aW9uKSkge1xuXHRcdFx0XHRpZiAoKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHx8ICh2YWx1ZSAmJiB2YWx1ZS5wdXNoICYmIF9pc0FycmF5KHZhbHVlKSkpIHtcblx0XHRcdFx0XHRhbGlnbiA9IGFsaWduIHx8IFwibm9ybWFsXCI7XG5cdFx0XHRcdFx0c3RhZ2dlciA9IHN0YWdnZXIgfHwgMDtcblx0XHRcdFx0XHRjdXJUaW1lID0gcG9zaXRpb247XG5cdFx0XHRcdFx0bCA9IHZhbHVlLmxlbmd0aDtcblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRpZiAoX2lzQXJyYXkoY2hpbGQgPSB2YWx1ZVtpXSkpIHtcblx0XHRcdFx0XHRcdFx0Y2hpbGQgPSBuZXcgVGltZWxpbmVMaXRlKHt0d2VlbnM6Y2hpbGR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuYWRkKGNoaWxkLCBjdXJUaW1lKTtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YoY2hpbGQpICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZihjaGlsZCkgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0XHRpZiAoYWxpZ24gPT09IFwic2VxdWVuY2VcIikge1xuXHRcdFx0XHRcdFx0XHRcdGN1clRpbWUgPSBjaGlsZC5fc3RhcnRUaW1lICsgKGNoaWxkLnRvdGFsRHVyYXRpb24oKSAvIGNoaWxkLl90aW1lU2NhbGUpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFsaWduID09PSBcInN0YXJ0XCIpIHtcblx0XHRcdFx0XHRcdFx0XHRjaGlsZC5fc3RhcnRUaW1lIC09IGNoaWxkLmRlbGF5KCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGN1clRpbWUgKz0gc3RhZ2dlcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX3VuY2FjaGUodHJ1ZSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mKHZhbHVlKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmFkZExhYmVsKHZhbHVlLCBwb3NpdGlvbik7XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mKHZhbHVlKSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBUd2VlbkxpdGUuZGVsYXllZENhbGwoMCwgdmFsdWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRocm93KFwiQ2Fubm90IGFkZCBcIiArIHZhbHVlICsgXCIgaW50byB0aGUgdGltZWxpbmU7IGl0IGlzIG5vdCBhIHR3ZWVuLCB0aW1lbGluZSwgZnVuY3Rpb24sIG9yIHN0cmluZy5cIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0U2ltcGxlVGltZWxpbmUucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIHZhbHVlLCBwb3NpdGlvbik7XG5cblx0XHRcdC8vaWYgdGhlIHRpbWVsaW5lIGhhcyBhbHJlYWR5IGVuZGVkIGJ1dCB0aGUgaW5zZXJ0ZWQgdHdlZW4vdGltZWxpbmUgZXh0ZW5kcyB0aGUgZHVyYXRpb24sIHdlIHNob3VsZCBlbmFibGUgdGhpcyB0aW1lbGluZSBhZ2FpbiBzbyB0aGF0IGl0IHJlbmRlcnMgcHJvcGVybHkuIFdlIHNob3VsZCBhbHNvIGFsaWduIHRoZSBwbGF5aGVhZCB3aXRoIHRoZSBwYXJlbnQgdGltZWxpbmUncyB3aGVuIGFwcHJvcHJpYXRlLlxuXHRcdFx0aWYgKHRoaXMuX2djIHx8IHRoaXMuX3RpbWUgPT09IHRoaXMuX2R1cmF0aW9uKSBpZiAoIXRoaXMuX3BhdXNlZCkgaWYgKHRoaXMuX2R1cmF0aW9uIDwgdGhpcy5kdXJhdGlvbigpKSB7XG5cdFx0XHRcdC8vaW4gY2FzZSBhbnkgb2YgdGhlIGFuY2VzdG9ycyBoYWQgY29tcGxldGVkIGJ1dCBzaG91bGQgbm93IGJlIGVuYWJsZWQuLi5cblx0XHRcdFx0dGwgPSB0aGlzO1xuXHRcdFx0XHRiZWZvcmVSYXdUaW1lID0gKHRsLnJhd1RpbWUoKSA+IHZhbHVlLl9zdGFydFRpbWUpOyAvL2lmIHRoZSB0d2VlbiBpcyBwbGFjZWQgb24gdGhlIHRpbWVsaW5lIHNvIHRoYXQgaXQgc3RhcnRzIEJFRk9SRSB0aGUgY3VycmVudCByYXdUaW1lLCB3ZSBzaG91bGQgYWxpZ24gdGhlIHBsYXloZWFkIChtb3ZlIHRoZSB0aW1lbGluZSkuIFRoaXMgaXMgYmVjYXVzZSBzb21ldGltZXMgdXNlcnMgd2lsbCBjcmVhdGUgYSB0aW1lbGluZSwgbGV0IGl0IGZpbmlzaCwgYW5kIG11Y2ggbGF0ZXIgYXBwZW5kIGEgdHdlZW4gYW5kIGV4cGVjdCBpdCB0byBydW4gaW5zdGVhZCBvZiBqdW1waW5nIHRvIGl0cyBlbmQgc3RhdGUuIFdoaWxlIHRlY2huaWNhbGx5IG9uZSBjb3VsZCBhcmd1ZSB0aGF0IGl0IHNob3VsZCBqdW1wIHRvIGl0cyBlbmQgc3RhdGUsIHRoYXQncyBub3Qgd2hhdCB1c2VycyBpbnR1aXRpdmVseSBleHBlY3QuXG5cdFx0XHRcdHdoaWxlICh0bC5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHRpZiAoYmVmb3JlUmF3VGltZSAmJiB0bC5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpIHtcblx0XHRcdFx0XHRcdHRsLnRvdGFsVGltZSh0bC5fdG90YWxUaW1lLCB0cnVlKTsgLy9tb3ZlcyB0aGUgdGltZWxpbmUgKHNoaWZ0cyBpdHMgc3RhcnRUaW1lKSBpZiBuZWNlc3NhcnksIGFuZCBhbHNvIGVuYWJsZXMgaXQuXG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0bC5fZ2MpIHtcblx0XHRcdFx0XHRcdHRsLl9lbmFibGVkKHRydWUsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGwgPSB0bC5fdGltZWxpbmU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAucmVtb3ZlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFuaW1hdGlvbikge1xuXHRcdFx0XHR0aGlzLl9yZW1vdmUodmFsdWUsIGZhbHNlKTtcblx0XHRcdFx0dmFyIHRsID0gdmFsdWUuX3RpbWVsaW5lID0gdmFsdWUudmFycy51c2VGcmFtZXMgPyBBbmltYXRpb24uX3Jvb3RGcmFtZXNUaW1lbGluZSA6IEFuaW1hdGlvbi5fcm9vdFRpbWVsaW5lOyAvL25vdyB0aGF0IGl0J3MgcmVtb3ZlZCwgZGVmYXVsdCBpdCB0byB0aGUgcm9vdCB0aW1lbGluZSBzbyB0aGF0IGlmIGl0IGdldHMgcGxheWVkIGFnYWluLCBpdCBkb2Vzbid0IGp1bXAgYmFjayBpbnRvIHRoaXMgdGltZWxpbmUuXG5cdFx0XHRcdHZhbHVlLl9zdGFydFRpbWUgPSAodmFsdWUuX3BhdXNlZCA/IHZhbHVlLl9wYXVzZVRpbWUgOiB0bC5fdGltZSkgLSAoKCF2YWx1ZS5fcmV2ZXJzZWQgPyB2YWx1ZS5fdG90YWxUaW1lIDogdmFsdWUudG90YWxEdXJhdGlvbigpIC0gdmFsdWUuX3RvdGFsVGltZSkgLyB2YWx1ZS5fdGltZVNjYWxlKTsgLy9lbnN1cmUgdGhhdCBpZiBpdCBnZXRzIHBsYXllZCBhZ2FpbiwgdGhlIHRpbWluZyBpcyBjb3JyZWN0LlxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSB8fCAodmFsdWUgJiYgdmFsdWUucHVzaCAmJiBfaXNBcnJheSh2YWx1ZSkpKSB7XG5cdFx0XHRcdHZhciBpID0gdmFsdWUubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHR0aGlzLnJlbW92ZSh2YWx1ZVtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZih2YWx1ZSkgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVtb3ZlTGFiZWwodmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMua2lsbChudWxsLCB2YWx1ZSk7XG5cdFx0fTtcblxuXHRcdHAuX3JlbW92ZSA9IGZ1bmN0aW9uKHR3ZWVuLCBza2lwRGlzYWJsZSkge1xuXHRcdFx0U2ltcGxlVGltZWxpbmUucHJvdG90eXBlLl9yZW1vdmUuY2FsbCh0aGlzLCB0d2Vlbiwgc2tpcERpc2FibGUpO1xuXHRcdFx0dmFyIGxhc3QgPSB0aGlzLl9sYXN0O1xuXHRcdFx0aWYgKCFsYXN0KSB7XG5cdFx0XHRcdHRoaXMuX3RpbWUgPSB0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX3RvdGFsRHVyYXRpb24gPSAwO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLl90aW1lID4gbGFzdC5fc3RhcnRUaW1lICsgbGFzdC5fdG90YWxEdXJhdGlvbiAvIGxhc3QuX3RpbWVTY2FsZSkge1xuXHRcdFx0XHR0aGlzLl90aW1lID0gdGhpcy5kdXJhdGlvbigpO1xuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl90b3RhbER1cmF0aW9uO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuYXBwZW5kID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldE9yTGFiZWwpIHtcblx0XHRcdHJldHVybiB0aGlzLmFkZCh2YWx1ZSwgdGhpcy5fcGFyc2VUaW1lT3JMYWJlbChudWxsLCBvZmZzZXRPckxhYmVsLCB0cnVlLCB2YWx1ZSkpO1xuXHRcdH07XG5cblx0XHRwLmluc2VydCA9IHAuaW5zZXJ0TXVsdGlwbGUgPSBmdW5jdGlvbih2YWx1ZSwgcG9zaXRpb24sIGFsaWduLCBzdGFnZ2VyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hZGQodmFsdWUsIHBvc2l0aW9uIHx8IDAsIGFsaWduLCBzdGFnZ2VyKTtcblx0XHR9O1xuXG5cdFx0cC5hcHBlbmRNdWx0aXBsZSA9IGZ1bmN0aW9uKHR3ZWVucywgb2Zmc2V0T3JMYWJlbCwgYWxpZ24sIHN0YWdnZXIpIHtcblx0XHRcdHJldHVybiB0aGlzLmFkZCh0d2VlbnMsIHRoaXMuX3BhcnNlVGltZU9yTGFiZWwobnVsbCwgb2Zmc2V0T3JMYWJlbCwgdHJ1ZSwgdHdlZW5zKSwgYWxpZ24sIHN0YWdnZXIpO1xuXHRcdH07XG5cblx0XHRwLmFkZExhYmVsID0gZnVuY3Rpb24obGFiZWwsIHBvc2l0aW9uKSB7XG5cdFx0XHR0aGlzLl9sYWJlbHNbbGFiZWxdID0gdGhpcy5fcGFyc2VUaW1lT3JMYWJlbChwb3NpdGlvbik7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5hZGRQYXVzZSA9IGZ1bmN0aW9uKHBvc2l0aW9uLCBjYWxsYmFjaywgcGFyYW1zLCBzY29wZSkge1xuXHRcdFx0dmFyIHQgPSBUd2VlbkxpdGUuZGVsYXllZENhbGwoMCwgX3BhdXNlQ2FsbGJhY2ssIHBhcmFtcywgc2NvcGUgfHwgdGhpcyk7XG5cdFx0XHR0LnZhcnMub25Db21wbGV0ZSA9IHQudmFycy5vblJldmVyc2VDb21wbGV0ZSA9IGNhbGxiYWNrO1xuXHRcdFx0dC5kYXRhID0gXCJpc1BhdXNlXCI7XG5cdFx0XHR0aGlzLl9oYXNQYXVzZSA9IHRydWU7XG5cdFx0XHRyZXR1cm4gdGhpcy5hZGQodCwgcG9zaXRpb24pO1xuXHRcdH07XG5cblx0XHRwLnJlbW92ZUxhYmVsID0gZnVuY3Rpb24obGFiZWwpIHtcblx0XHRcdGRlbGV0ZSB0aGlzLl9sYWJlbHNbbGFiZWxdO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuZ2V0TGFiZWxUaW1lID0gZnVuY3Rpb24obGFiZWwpIHtcblx0XHRcdHJldHVybiAodGhpcy5fbGFiZWxzW2xhYmVsXSAhPSBudWxsKSA/IHRoaXMuX2xhYmVsc1tsYWJlbF0gOiAtMTtcblx0XHR9O1xuXG5cdFx0cC5fcGFyc2VUaW1lT3JMYWJlbCA9IGZ1bmN0aW9uKHRpbWVPckxhYmVsLCBvZmZzZXRPckxhYmVsLCBhcHBlbmRJZkFic2VudCwgaWdub3JlKSB7XG5cdFx0XHR2YXIgaTtcblx0XHRcdC8vaWYgd2UncmUgYWJvdXQgdG8gYWRkIGEgdHdlZW4vdGltZWxpbmUgKG9yIGFuIGFycmF5IG9mIHRoZW0pIHRoYXQncyBhbHJlYWR5IGEgY2hpbGQgb2YgdGhpcyB0aW1lbGluZSwgd2Ugc2hvdWxkIHJlbW92ZSBpdCBmaXJzdCBzbyB0aGF0IGl0IGRvZXNuJ3QgY29udGFtaW5hdGUgdGhlIGR1cmF0aW9uKCkuXG5cdFx0XHRpZiAoaWdub3JlIGluc3RhbmNlb2YgQW5pbWF0aW9uICYmIGlnbm9yZS50aW1lbGluZSA9PT0gdGhpcykge1xuXHRcdFx0XHR0aGlzLnJlbW92ZShpZ25vcmUpO1xuXHRcdFx0fSBlbHNlIGlmIChpZ25vcmUgJiYgKChpZ25vcmUgaW5zdGFuY2VvZiBBcnJheSkgfHwgKGlnbm9yZS5wdXNoICYmIF9pc0FycmF5KGlnbm9yZSkpKSkge1xuXHRcdFx0XHRpID0gaWdub3JlLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0aWYgKGlnbm9yZVtpXSBpbnN0YW5jZW9mIEFuaW1hdGlvbiAmJiBpZ25vcmVbaV0udGltZWxpbmUgPT09IHRoaXMpIHtcblx0XHRcdFx0XHRcdHRoaXMucmVtb3ZlKGlnbm9yZVtpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mKG9mZnNldE9yTGFiZWwpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9wYXJzZVRpbWVPckxhYmVsKG9mZnNldE9yTGFiZWwsIChhcHBlbmRJZkFic2VudCAmJiB0eXBlb2YodGltZU9yTGFiZWwpID09PSBcIm51bWJlclwiICYmIHRoaXMuX2xhYmVsc1tvZmZzZXRPckxhYmVsXSA9PSBudWxsKSA/IHRpbWVPckxhYmVsIC0gdGhpcy5kdXJhdGlvbigpIDogMCwgYXBwZW5kSWZBYnNlbnQpO1xuXHRcdFx0fVxuXHRcdFx0b2Zmc2V0T3JMYWJlbCA9IG9mZnNldE9yTGFiZWwgfHwgMDtcblx0XHRcdGlmICh0eXBlb2YodGltZU9yTGFiZWwpID09PSBcInN0cmluZ1wiICYmIChpc05hTih0aW1lT3JMYWJlbCkgfHwgdGhpcy5fbGFiZWxzW3RpbWVPckxhYmVsXSAhPSBudWxsKSkgeyAvL2lmIHRoZSBzdHJpbmcgaXMgYSBudW1iZXIgbGlrZSBcIjFcIiwgY2hlY2sgdG8gc2VlIGlmIHRoZXJlJ3MgYSBsYWJlbCB3aXRoIHRoYXQgbmFtZSwgb3RoZXJ3aXNlIGludGVycHJldCBpdCBhcyBhIG51bWJlciAoYWJzb2x1dGUgdmFsdWUpLlxuXHRcdFx0XHRpID0gdGltZU9yTGFiZWwuaW5kZXhPZihcIj1cIik7XG5cdFx0XHRcdGlmIChpID09PSAtMSkge1xuXHRcdFx0XHRcdGlmICh0aGlzLl9sYWJlbHNbdGltZU9yTGFiZWxdID09IG51bGwpIHtcblx0XHRcdFx0XHRcdHJldHVybiBhcHBlbmRJZkFic2VudCA/ICh0aGlzLl9sYWJlbHNbdGltZU9yTGFiZWxdID0gdGhpcy5kdXJhdGlvbigpICsgb2Zmc2V0T3JMYWJlbCkgOiBvZmZzZXRPckxhYmVsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fbGFiZWxzW3RpbWVPckxhYmVsXSArIG9mZnNldE9yTGFiZWw7XG5cdFx0XHRcdH1cblx0XHRcdFx0b2Zmc2V0T3JMYWJlbCA9IHBhcnNlSW50KHRpbWVPckxhYmVsLmNoYXJBdChpLTEpICsgXCIxXCIsIDEwKSAqIE51bWJlcih0aW1lT3JMYWJlbC5zdWJzdHIoaSsxKSk7XG5cdFx0XHRcdHRpbWVPckxhYmVsID0gKGkgPiAxKSA/IHRoaXMuX3BhcnNlVGltZU9yTGFiZWwodGltZU9yTGFiZWwuc3Vic3RyKDAsIGktMSksIDAsIGFwcGVuZElmQWJzZW50KSA6IHRoaXMuZHVyYXRpb24oKTtcblx0XHRcdH0gZWxzZSBpZiAodGltZU9yTGFiZWwgPT0gbnVsbCkge1xuXHRcdFx0XHR0aW1lT3JMYWJlbCA9IHRoaXMuZHVyYXRpb24oKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBOdW1iZXIodGltZU9yTGFiZWwpICsgb2Zmc2V0T3JMYWJlbDtcblx0XHR9O1xuXG5cdFx0cC5zZWVrID0gZnVuY3Rpb24ocG9zaXRpb24sIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy50b3RhbFRpbWUoKHR5cGVvZihwb3NpdGlvbikgPT09IFwibnVtYmVyXCIpID8gcG9zaXRpb24gOiB0aGlzLl9wYXJzZVRpbWVPckxhYmVsKHBvc2l0aW9uKSwgKHN1cHByZXNzRXZlbnRzICE9PSBmYWxzZSkpO1xuXHRcdH07XG5cblx0XHRwLnN0b3AgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLnBhdXNlZCh0cnVlKTtcblx0XHR9O1xuXG5cdFx0cC5nb3RvQW5kUGxheSA9IGZ1bmN0aW9uKHBvc2l0aW9uLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0cmV0dXJuIHRoaXMucGxheShwb3NpdGlvbiwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLmdvdG9BbmRTdG9wID0gZnVuY3Rpb24ocG9zaXRpb24sIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXVzZShwb3NpdGlvbiwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLnJlbmRlciA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSkge1xuXHRcdFx0aWYgKHRoaXMuX2djKSB7XG5cdFx0XHRcdHRoaXMuX2VuYWJsZWQodHJ1ZSwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHRvdGFsRHVyID0gKCF0aGlzLl9kaXJ0eSkgPyB0aGlzLl90b3RhbER1cmF0aW9uIDogdGhpcy50b3RhbER1cmF0aW9uKCksXG5cdFx0XHRcdHByZXZUaW1lID0gdGhpcy5fdGltZSxcblx0XHRcdFx0cHJldlN0YXJ0ID0gdGhpcy5fc3RhcnRUaW1lLFxuXHRcdFx0XHRwcmV2VGltZVNjYWxlID0gdGhpcy5fdGltZVNjYWxlLFxuXHRcdFx0XHRwcmV2UGF1c2VkID0gdGhpcy5fcGF1c2VkLFxuXHRcdFx0XHR0d2VlbiwgaXNDb21wbGV0ZSwgbmV4dCwgY2FsbGJhY2ssIGludGVybmFsRm9yY2UsIHBhdXNlVHdlZW4sIGN1clRpbWU7XG5cdFx0XHRpZiAodGltZSA+PSB0b3RhbER1ciAtIDAuMDAwMDAwMSkgeyAvL3RvIHdvcmsgYXJvdW5kIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgbWF0aCBhcnRpZmFjdHMuXG5cdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRoaXMuX3RpbWUgPSB0b3RhbER1cjtcblx0XHRcdFx0aWYgKCF0aGlzLl9yZXZlcnNlZCkgaWYgKCF0aGlzLl9oYXNQYXVzZWRDaGlsZCgpKSB7XG5cdFx0XHRcdFx0aXNDb21wbGV0ZSA9IHRydWU7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uQ29tcGxldGVcIjtcblx0XHRcdFx0XHRpbnRlcm5hbEZvcmNlID0gISF0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW47IC8vb3RoZXJ3aXNlLCBpZiB0aGUgYW5pbWF0aW9uIGlzIHVucGF1c2VkL2FjdGl2YXRlZCBhZnRlciBpdCdzIGFscmVhZHkgZmluaXNoZWQsIGl0IGRvZXNuJ3QgZ2V0IHJlbW92ZWQgZnJvbSB0aGUgcGFyZW50IHRpbWVsaW5lLlxuXHRcdFx0XHRcdGlmICh0aGlzLl9kdXJhdGlvbiA9PT0gMCkgaWYgKCh0aW1lIDw9IDAgJiYgdGltZSA+PSAtMC4wMDAwMDAxKSB8fCB0aGlzLl9yYXdQcmV2VGltZSA8IDAgfHwgdGhpcy5fcmF3UHJldlRpbWUgPT09IF90aW55TnVtKSBpZiAodGhpcy5fcmF3UHJldlRpbWUgIT09IHRpbWUgJiYgdGhpcy5fZmlyc3QpIHtcblx0XHRcdFx0XHRcdGludGVybmFsRm9yY2UgPSB0cnVlO1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX3Jhd1ByZXZUaW1lID4gX3RpbnlOdW0pIHtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gKHRoaXMuX2R1cmF0aW9uIHx8ICFzdXBwcmVzc0V2ZW50cyB8fCB0aW1lIHx8IHRoaXMuX3Jhd1ByZXZUaW1lID09PSB0aW1lKSA/IHRpbWUgOiBfdGlueU51bTsgLy93aGVuIHRoZSBwbGF5aGVhZCBhcnJpdmVzIGF0IEVYQUNUTFkgdGltZSAwIChyaWdodCBvbiB0b3ApIG9mIGEgemVyby1kdXJhdGlvbiB0aW1lbGluZSBvciB0d2Vlbiwgd2UgbmVlZCB0byBkaXNjZXJuIGlmIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBzbyB0aGF0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIGFnYWluIChuZXh0IHRpbWUpLCBpdCdsbCB0cmlnZ2VyIHRoZSBjYWxsYmFjay4gSWYgZXZlbnRzIGFyZSBOT1Qgc3VwcHJlc3NlZCwgb2J2aW91c2x5IHRoZSBjYWxsYmFjayB3b3VsZCBiZSB0cmlnZ2VyZWQgaW4gdGhpcyByZW5kZXIuIEJhc2ljYWxseSwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlIGVpdGhlciB3aGVuIHRoZSBwbGF5aGVhZCBBUlJJVkVTIG9yIExFQVZFUyB0aGlzIGV4YWN0IHNwb3QsIG5vdCBib3RoLiBJbWFnaW5lIGRvaW5nIGEgdGltZWxpbmUuc2VlaygwKSBhbmQgdGhlcmUncyBhIGNhbGxiYWNrIHRoYXQgc2l0cyBhdCAwLiBTaW5jZSBldmVudHMgYXJlIHN1cHByZXNzZWQgb24gdGhhdCBzZWVrKCkgYnkgZGVmYXVsdCwgbm90aGluZyB3aWxsIGZpcmUsIGJ1dCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBvZmYgb2YgdGhhdCBwb3NpdGlvbiwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlLiBUaGlzIGJlaGF2aW9yIGlzIHdoYXQgcGVvcGxlIGludHVpdGl2ZWx5IGV4cGVjdC4gV2Ugc2V0IHRoZSBfcmF3UHJldlRpbWUgdG8gYmUgYSBwcmVjaXNlIHRpbnkgbnVtYmVyIHRvIGluZGljYXRlIHRoaXMgc2NlbmFyaW8gcmF0aGVyIHRoYW4gdXNpbmcgYW5vdGhlciBwcm9wZXJ0eS92YXJpYWJsZSB3aGljaCB3b3VsZCBpbmNyZWFzZSBtZW1vcnkgdXNhZ2UuIFRoaXMgdGVjaG5pcXVlIGlzIGxlc3MgcmVhZGFibGUsIGJ1dCBtb3JlIGVmZmljaWVudC5cblx0XHRcdFx0dGltZSA9IHRvdGFsRHVyICsgMC4wMDAxOyAvL3RvIGF2b2lkIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgcm91bmRpbmcgZXJyb3JzIC0gc29tZXRpbWVzIGNoaWxkIHR3ZWVucy90aW1lbGluZXMgd2VyZSBub3QgYmVpbmcgZnVsbHkgY29tcGxldGVkICh0aGVpciBwcm9ncmVzcyBtaWdodCBiZSAwLjk5OTk5OTk5OTk5OTk5OCBpbnN0ZWFkIG9mIDEgYmVjYXVzZSB3aGVuIF90aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSBpcyBwZXJmb3JtZWQsIGZsb2F0aW5nIHBvaW50IGVycm9ycyB3b3VsZCByZXR1cm4gYSB2YWx1ZSB0aGF0IHdhcyBTTElHSFRMWSBvZmYpLiBUcnkgKDk5OTk5OTk5OTk5OS43IC0gOTk5OTk5OTk5OTk5KSAqIDEgPSAwLjY5OTk1MTE3MTg3NSBpbnN0ZWFkIG9mIDAuNy5cblxuXHRcdFx0fSBlbHNlIGlmICh0aW1lIDwgMC4wMDAwMDAxKSB7IC8vdG8gd29yayBhcm91bmQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCBtYXRoIGFydGlmYWN0cywgcm91bmQgc3VwZXIgc21hbGwgdmFsdWVzIHRvIDAuXG5cdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRoaXMuX3RpbWUgPSAwO1xuXHRcdFx0XHRpZiAocHJldlRpbWUgIT09IDAgfHwgKHRoaXMuX2R1cmF0aW9uID09PSAwICYmIHRoaXMuX3Jhd1ByZXZUaW1lICE9PSBfdGlueU51bSAmJiAodGhpcy5fcmF3UHJldlRpbWUgPiAwIHx8ICh0aW1lIDwgMCAmJiB0aGlzLl9yYXdQcmV2VGltZSA+PSAwKSkpKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0aXNDb21wbGV0ZSA9IHRoaXMuX3JldmVyc2VkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aW1lIDwgMCkge1xuXHRcdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4gJiYgdGhpcy5fcmV2ZXJzZWQpIHsgLy9lbnN1cmVzIHByb3BlciBHQyBpZiBhIHRpbWVsaW5lIGlzIHJlc3VtZWQgYWZ0ZXIgaXQncyBmaW5pc2hlZCByZXZlcnNpbmcuXG5cdFx0XHRcdFx0XHRpbnRlcm5hbEZvcmNlID0gaXNDb21wbGV0ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayA9IFwib25SZXZlcnNlQ29tcGxldGVcIjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuX3Jhd1ByZXZUaW1lID49IDAgJiYgdGhpcy5fZmlyc3QpIHsgLy93aGVuIGdvaW5nIGJhY2sgYmV5b25kIHRoZSBzdGFydCwgZm9yY2UgYSByZW5kZXIgc28gdGhhdCB6ZXJvLWR1cmF0aW9uIHR3ZWVucyB0aGF0IHNpdCBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgcmVuZGVyIHRoZWlyIHN0YXJ0IHZhbHVlcyBwcm9wZXJseS4gT3RoZXJ3aXNlLCBpZiB0aGUgcGFyZW50IHRpbWVsaW5lJ3MgcGxheWhlYWQgbGFuZHMgZXhhY3RseSBhdCB0aGlzIHRpbWVsaW5lJ3Mgc3RhcnRUaW1lLCBhbmQgdGhlbiBtb3ZlcyBiYWNrd2FyZHMsIHRoZSB6ZXJvLWR1cmF0aW9uIHR3ZWVucyBhdCB0aGUgYmVnaW5uaW5nIHdvdWxkIHN0aWxsIGJlIGF0IHRoZWlyIGVuZCBzdGF0ZS5cblx0XHRcdFx0XHRcdGludGVybmFsRm9yY2UgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IHRpbWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSAodGhpcy5fZHVyYXRpb24gfHwgIXN1cHByZXNzRXZlbnRzIHx8IHRpbWUgfHwgdGhpcy5fcmF3UHJldlRpbWUgPT09IHRpbWUpID8gdGltZSA6IF90aW55TnVtOyAvL3doZW4gdGhlIHBsYXloZWFkIGFycml2ZXMgYXQgRVhBQ1RMWSB0aW1lIDAgKHJpZ2h0IG9uIHRvcCkgb2YgYSB6ZXJvLWR1cmF0aW9uIHRpbWVsaW5lIG9yIHR3ZWVuLCB3ZSBuZWVkIHRvIGRpc2Nlcm4gaWYgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIHNvIHRoYXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgYWdhaW4gKG5leHQgdGltZSksIGl0J2xsIHRyaWdnZXIgdGhlIGNhbGxiYWNrLiBJZiBldmVudHMgYXJlIE5PVCBzdXBwcmVzc2VkLCBvYnZpb3VzbHkgdGhlIGNhbGxiYWNrIHdvdWxkIGJlIHRyaWdnZXJlZCBpbiB0aGlzIHJlbmRlci4gQmFzaWNhbGx5LCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUgZWl0aGVyIHdoZW4gdGhlIHBsYXloZWFkIEFSUklWRVMgb3IgTEVBVkVTIHRoaXMgZXhhY3Qgc3BvdCwgbm90IGJvdGguIEltYWdpbmUgZG9pbmcgYSB0aW1lbGluZS5zZWVrKDApIGFuZCB0aGVyZSdzIGEgY2FsbGJhY2sgdGhhdCBzaXRzIGF0IDAuIFNpbmNlIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBvbiB0aGF0IHNlZWsoKSBieSBkZWZhdWx0LCBub3RoaW5nIHdpbGwgZmlyZSwgYnV0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIG9mZiBvZiB0aGF0IHBvc2l0aW9uLCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUuIFRoaXMgYmVoYXZpb3IgaXMgd2hhdCBwZW9wbGUgaW50dWl0aXZlbHkgZXhwZWN0LiBXZSBzZXQgdGhlIF9yYXdQcmV2VGltZSB0byBiZSBhIHByZWNpc2UgdGlueSBudW1iZXIgdG8gaW5kaWNhdGUgdGhpcyBzY2VuYXJpbyByYXRoZXIgdGhhbiB1c2luZyBhbm90aGVyIHByb3BlcnR5L3ZhcmlhYmxlIHdoaWNoIHdvdWxkIGluY3JlYXNlIG1lbW9yeSB1c2FnZS4gVGhpcyB0ZWNobmlxdWUgaXMgbGVzcyByZWFkYWJsZSwgYnV0IG1vcmUgZWZmaWNpZW50LlxuXHRcdFx0XHRcdGlmICh0aW1lID09PSAwICYmIGlzQ29tcGxldGUpIHsgLy9pZiB0aGVyZSdzIGEgemVyby1kdXJhdGlvbiB0d2VlbiBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgYSB0aW1lbGluZSBhbmQgdGhlIHBsYXloZWFkIGxhbmRzIEVYQUNUTFkgYXQgdGltZSAwLCB0aGF0IHR3ZWVuIHdpbGwgY29ycmVjdGx5IHJlbmRlciBpdHMgZW5kIHZhbHVlcywgYnV0IHdlIG5lZWQgdG8ga2VlcCB0aGUgdGltZWxpbmUgYWxpdmUgZm9yIG9uZSBtb3JlIHJlbmRlciBzbyB0aGF0IHRoZSBiZWdpbm5pbmcgdmFsdWVzIHJlbmRlciBwcm9wZXJseSBhcyB0aGUgcGFyZW50J3MgcGxheWhlYWQga2VlcHMgbW92aW5nIGJleW9uZCB0aGUgYmVnaW5pbmcuIEltYWdpbmUgb2JqLnggc3RhcnRzIGF0IDAgYW5kIHRoZW4gd2UgZG8gdGwuc2V0KG9iaiwge3g6MTAwfSkudG8ob2JqLCAxLCB7eDoyMDB9KSBhbmQgdGhlbiBsYXRlciB3ZSB0bC5yZXZlcnNlKCkuLi50aGUgZ29hbCBpcyB0byBoYXZlIG9iai54IHJldmVydCB0byAwLiBJZiB0aGUgcGxheWhlYWQgaGFwcGVucyB0byBsYW5kIG9uIGV4YWN0bHkgMCwgd2l0aG91dCB0aGlzIGNodW5rIG9mIGNvZGUsIGl0J2QgY29tcGxldGUgdGhlIHRpbWVsaW5lIGFuZCByZW1vdmUgaXQgZnJvbSB0aGUgcmVuZGVyaW5nIHF1ZXVlIChub3QgZ29vZCkuXG5cdFx0XHRcdFx0XHR0d2VlbiA9IHRoaXMuX2ZpcnN0O1xuXHRcdFx0XHRcdFx0d2hpbGUgKHR3ZWVuICYmIHR3ZWVuLl9zdGFydFRpbWUgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCF0d2Vlbi5fZHVyYXRpb24pIHtcblx0XHRcdFx0XHRcdFx0XHRpc0NvbXBsZXRlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGltZSA9IDA7IC8vdG8gYXZvaWQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCByb3VuZGluZyBlcnJvcnMgKGNvdWxkIGNhdXNlIHByb2JsZW1zIGVzcGVjaWFsbHkgd2l0aCB6ZXJvLWR1cmF0aW9uIHR3ZWVucyBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgdGhlIHRpbWVsaW5lKVxuXHRcdFx0XHRcdGlmICghdGhpcy5faW5pdHRlZCkge1xuXHRcdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKHRoaXMuX2hhc1BhdXNlICYmICF0aGlzLl9mb3JjaW5nUGxheWhlYWQgJiYgIXN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRcdFx0aWYgKHRpbWUgPj0gcHJldlRpbWUpIHtcblx0XHRcdFx0XHRcdHR3ZWVuID0gdGhpcy5fZmlyc3Q7XG5cdFx0XHRcdFx0XHR3aGlsZSAodHdlZW4gJiYgdHdlZW4uX3N0YXJ0VGltZSA8PSB0aW1lICYmICFwYXVzZVR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghdHdlZW4uX2R1cmF0aW9uKSBpZiAodHdlZW4uZGF0YSA9PT0gXCJpc1BhdXNlXCIgJiYgIXR3ZWVuLnJhdGlvICYmICEodHdlZW4uX3N0YXJ0VGltZSA9PT0gMCAmJiB0aGlzLl9yYXdQcmV2VGltZSA9PT0gMCkpIHtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZVR3ZWVuID0gdHdlZW47XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dHdlZW4gPSB0aGlzLl9sYXN0O1xuXHRcdFx0XHRcdFx0d2hpbGUgKHR3ZWVuICYmIHR3ZWVuLl9zdGFydFRpbWUgPj0gdGltZSAmJiAhcGF1c2VUd2Vlbikge1xuXHRcdFx0XHRcdFx0XHRpZiAoIXR3ZWVuLl9kdXJhdGlvbikgaWYgKHR3ZWVuLmRhdGEgPT09IFwiaXNQYXVzZVwiICYmIHR3ZWVuLl9yYXdQcmV2VGltZSA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZVR3ZWVuID0gdHdlZW47XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fcHJldjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHBhdXNlVHdlZW4pIHtcblx0XHRcdFx0XHRcdHRoaXMuX3RpbWUgPSB0aW1lID0gcGF1c2VUd2Vlbi5fc3RhcnRUaW1lO1xuXHRcdFx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGltZSArICh0aGlzLl9jeWNsZSAqICh0aGlzLl90b3RhbER1cmF0aW9uICsgdGhpcy5fcmVwZWF0RGVsYXkpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl90aW1lID0gdGhpcy5fcmF3UHJldlRpbWUgPSB0aW1lO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCh0aGlzLl90aW1lID09PSBwcmV2VGltZSB8fCAhdGhpcy5fZmlyc3QpICYmICFmb3JjZSAmJiAhaW50ZXJuYWxGb3JjZSAmJiAhcGF1c2VUd2Vlbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2UgaWYgKCF0aGlzLl9pbml0dGVkKSB7XG5cdFx0XHRcdHRoaXMuX2luaXR0ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXRoaXMuX2FjdGl2ZSkgaWYgKCF0aGlzLl9wYXVzZWQgJiYgdGhpcy5fdGltZSAhPT0gcHJldlRpbWUgJiYgdGltZSA+IDApIHtcblx0XHRcdFx0dGhpcy5fYWN0aXZlID0gdHJ1ZTsgIC8vc28gdGhhdCBpZiB0aGUgdXNlciByZW5kZXJzIHRoZSB0aW1lbGluZSAoYXMgb3Bwb3NlZCB0byB0aGUgcGFyZW50IHRpbWVsaW5lIHJlbmRlcmluZyBpdCksIGl0IGlzIGZvcmNlZCB0byByZS1yZW5kZXIgYW5kIGFsaWduIGl0IHdpdGggdGhlIHByb3BlciB0aW1lL2ZyYW1lIG9uIHRoZSBuZXh0IHJlbmRlcmluZyBjeWNsZS4gTWF5YmUgdGhlIHRpbWVsaW5lIGFscmVhZHkgZmluaXNoZWQgYnV0IHRoZSB1c2VyIG1hbnVhbGx5IHJlLXJlbmRlcnMgaXQgYXMgaGFsZndheSBkb25lLCBmb3IgZXhhbXBsZS5cblx0XHRcdH1cblxuXHRcdFx0aWYgKHByZXZUaW1lID09PSAwKSBpZiAodGhpcy52YXJzLm9uU3RhcnQpIGlmICh0aGlzLl90aW1lICE9PSAwIHx8ICF0aGlzLl9kdXJhdGlvbikgaWYgKCFzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uU3RhcnRcIik7XG5cdFx0XHR9XG5cblx0XHRcdGN1clRpbWUgPSB0aGlzLl90aW1lO1xuXHRcdFx0aWYgKGN1clRpbWUgPj0gcHJldlRpbWUpIHtcblx0XHRcdFx0dHdlZW4gPSB0aGlzLl9maXJzdDtcblx0XHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdFx0bmV4dCA9IHR3ZWVuLl9uZXh0OyAvL3JlY29yZCBpdCBoZXJlIGJlY2F1c2UgdGhlIHZhbHVlIGNvdWxkIGNoYW5nZSBhZnRlciByZW5kZXJpbmcuLi5cblx0XHRcdFx0XHRpZiAoY3VyVGltZSAhPT0gdGhpcy5fdGltZSB8fCAodGhpcy5fcGF1c2VkICYmICFwcmV2UGF1c2VkKSkgeyAvL2luIGNhc2UgYSB0d2VlbiBwYXVzZXMgb3Igc2Vla3MgdGhlIHRpbWVsaW5lIHdoZW4gcmVuZGVyaW5nLCBsaWtlIGluc2lkZSBvZiBhbiBvblVwZGF0ZS9vbkNvbXBsZXRlXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR3ZWVuLl9hY3RpdmUgfHwgKHR3ZWVuLl9zdGFydFRpbWUgPD0gY3VyVGltZSAmJiAhdHdlZW4uX3BhdXNlZCAmJiAhdHdlZW4uX2djKSkge1xuXHRcdFx0XHRcdFx0aWYgKHBhdXNlVHdlZW4gPT09IHR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMucGF1c2UoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICghdHdlZW4uX3JldmVyc2VkKSB7XG5cdFx0XHRcdFx0XHRcdHR3ZWVuLnJlbmRlcigodGltZSAtIHR3ZWVuLl9zdGFydFRpbWUpICogdHdlZW4uX3RpbWVTY2FsZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHR3ZWVuLnJlbmRlcigoKCF0d2Vlbi5fZGlydHkpID8gdHdlZW4uX3RvdGFsRHVyYXRpb24gOiB0d2Vlbi50b3RhbER1cmF0aW9uKCkpIC0gKCh0aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSkgKiB0d2Vlbi5fdGltZVNjYWxlKSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dHdlZW4gPSBuZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0d2VlbiA9IHRoaXMuX2xhc3Q7XG5cdFx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHRcdG5leHQgPSB0d2Vlbi5fcHJldjsgLy9yZWNvcmQgaXQgaGVyZSBiZWNhdXNlIHRoZSB2YWx1ZSBjb3VsZCBjaGFuZ2UgYWZ0ZXIgcmVuZGVyaW5nLi4uXG5cdFx0XHRcdFx0aWYgKGN1clRpbWUgIT09IHRoaXMuX3RpbWUgfHwgKHRoaXMuX3BhdXNlZCAmJiAhcHJldlBhdXNlZCkpIHsgLy9pbiBjYXNlIGEgdHdlZW4gcGF1c2VzIG9yIHNlZWtzIHRoZSB0aW1lbGluZSB3aGVuIHJlbmRlcmluZywgbGlrZSBpbnNpZGUgb2YgYW4gb25VcGRhdGUvb25Db21wbGV0ZVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0d2Vlbi5fYWN0aXZlIHx8ICh0d2Vlbi5fc3RhcnRUaW1lIDw9IHByZXZUaW1lICYmICF0d2Vlbi5fcGF1c2VkICYmICF0d2Vlbi5fZ2MpKSB7XG5cdFx0XHRcdFx0XHRpZiAocGF1c2VUd2VlbiA9PT0gdHdlZW4pIHtcblx0XHRcdFx0XHRcdFx0cGF1c2VUd2VlbiA9IHR3ZWVuLl9wcmV2OyAvL3RoZSBsaW5rZWQgbGlzdCBpcyBvcmdhbml6ZWQgYnkgX3N0YXJ0VGltZSwgdGh1cyBpdCdzIHBvc3NpYmxlIHRoYXQgYSB0d2VlbiBjb3VsZCBzdGFydCBCRUZPUkUgdGhlIHBhdXNlIGFuZCBlbmQgYWZ0ZXIgaXQsIGluIHdoaWNoIGNhc2UgaXQgd291bGQgYmUgcG9zaXRpb25lZCBiZWZvcmUgdGhlIHBhdXNlIHR3ZWVuIGluIHRoZSBsaW5rZWQgbGlzdCwgYnV0IHdlIHNob3VsZCByZW5kZXIgaXQgYmVmb3JlIHdlIHBhdXNlKCkgdGhlIHRpbWVsaW5lIGFuZCBjZWFzZSByZW5kZXJpbmcuIFRoaXMgaXMgb25seSBhIGNvbmNlcm4gd2hlbiBnb2luZyBpbiByZXZlcnNlLlxuXHRcdFx0XHRcdFx0XHR3aGlsZSAocGF1c2VUd2VlbiAmJiBwYXVzZVR3ZWVuLmVuZFRpbWUoKSA+IHRoaXMuX3RpbWUpIHtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZVR3ZWVuLnJlbmRlciggKHBhdXNlVHdlZW4uX3JldmVyc2VkID8gcGF1c2VUd2Vlbi50b3RhbER1cmF0aW9uKCkgLSAoKHRpbWUgLSBwYXVzZVR3ZWVuLl9zdGFydFRpbWUpICogcGF1c2VUd2Vlbi5fdGltZVNjYWxlKSA6ICh0aW1lIC0gcGF1c2VUd2Vlbi5fc3RhcnRUaW1lKSAqIHBhdXNlVHdlZW4uX3RpbWVTY2FsZSksIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0XHRcdFx0cGF1c2VUd2VlbiA9IHBhdXNlVHdlZW4uX3ByZXY7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cGF1c2VUd2VlbiA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdHRoaXMucGF1c2UoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICghdHdlZW4uX3JldmVyc2VkKSB7XG5cdFx0XHRcdFx0XHRcdHR3ZWVuLnJlbmRlcigodGltZSAtIHR3ZWVuLl9zdGFydFRpbWUpICogdHdlZW4uX3RpbWVTY2FsZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHR3ZWVuLnJlbmRlcigoKCF0d2Vlbi5fZGlydHkpID8gdHdlZW4uX3RvdGFsRHVyYXRpb24gOiB0d2Vlbi50b3RhbER1cmF0aW9uKCkpIC0gKCh0aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSkgKiB0d2Vlbi5fdGltZVNjYWxlKSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dHdlZW4gPSBuZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl9vblVwZGF0ZSkgaWYgKCFzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0XHRpZiAoX2xhenlUd2VlbnMubGVuZ3RoKSB7IC8vaW4gY2FzZSByZW5kZXJpbmcgY2F1c2VkIGFueSB0d2VlbnMgdG8gbGF6eS1pbml0LCB3ZSBzaG91bGQgcmVuZGVyIHRoZW0gYmVjYXVzZSB0eXBpY2FsbHkgd2hlbiBhIHRpbWVsaW5lIGZpbmlzaGVzLCB1c2VycyBleHBlY3QgdGhpbmdzIHRvIGhhdmUgcmVuZGVyZWQgZnVsbHkuIEltYWdpbmUgYW4gb25VcGRhdGUgb24gYSB0aW1lbGluZSB0aGF0IHJlcG9ydHMvY2hlY2tzIHR3ZWVuZWQgdmFsdWVzLlxuXHRcdFx0XHRcdF9sYXp5UmVuZGVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblVwZGF0ZVwiKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNhbGxiYWNrKSBpZiAoIXRoaXMuX2djKSBpZiAocHJldlN0YXJ0ID09PSB0aGlzLl9zdGFydFRpbWUgfHwgcHJldlRpbWVTY2FsZSAhPT0gdGhpcy5fdGltZVNjYWxlKSBpZiAodGhpcy5fdGltZSA9PT0gMCB8fCB0b3RhbER1ciA+PSB0aGlzLnRvdGFsRHVyYXRpb24oKSkgeyAvL2lmIG9uZSBvZiB0aGUgdHdlZW5zIHRoYXQgd2FzIHJlbmRlcmVkIGFsdGVyZWQgdGhpcyB0aW1lbGluZSdzIHN0YXJ0VGltZSAobGlrZSBpZiBhbiBvbkNvbXBsZXRlIHJldmVyc2VkIHRoZSB0aW1lbGluZSksIGl0IHByb2JhYmx5IGlzbid0IGNvbXBsZXRlLiBJZiBpdCBpcywgZG9uJ3Qgd29ycnksIGJlY2F1c2Ugd2hhdGV2ZXIgY2FsbCBhbHRlcmVkIHRoZSBzdGFydFRpbWUgd291bGQgY29tcGxldGUgaWYgaXQgd2FzIG5lY2Vzc2FyeSBhdCB0aGUgbmV3IHRpbWUuIFRoZSBvbmx5IGV4Y2VwdGlvbiBpcyB0aGUgdGltZVNjYWxlIHByb3BlcnR5LiBBbHNvIGNoZWNrIF9nYyBiZWNhdXNlIHRoZXJlJ3MgYSBjaGFuY2UgdGhhdCBraWxsKCkgY291bGQgYmUgY2FsbGVkIGluIGFuIG9uVXBkYXRlXG5cdFx0XHRcdGlmIChpc0NvbXBsZXRlKSB7XG5cdFx0XHRcdFx0aWYgKF9sYXp5VHdlZW5zLmxlbmd0aCkgeyAvL2luIGNhc2UgcmVuZGVyaW5nIGNhdXNlZCBhbnkgdHdlZW5zIHRvIGxhenktaW5pdCwgd2Ugc2hvdWxkIHJlbmRlciB0aGVtIGJlY2F1c2UgdHlwaWNhbGx5IHdoZW4gYSB0aW1lbGluZSBmaW5pc2hlcywgdXNlcnMgZXhwZWN0IHRoaW5ncyB0byBoYXZlIHJlbmRlcmVkIGZ1bGx5LiBJbWFnaW5lIGFuIG9uQ29tcGxldGUgb24gYSB0aW1lbGluZSB0aGF0IHJlcG9ydHMvY2hlY2tzIHR3ZWVuZWQgdmFsdWVzLlxuXHRcdFx0XHRcdFx0X2xhenlSZW5kZXIoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0dGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9hY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXN1cHByZXNzRXZlbnRzICYmIHRoaXMudmFyc1tjYWxsYmFja10pIHtcblx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhjYWxsYmFjayk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cC5faGFzUGF1c2VkQ2hpbGQgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0d2VlbiA9IHRoaXMuX2ZpcnN0O1xuXHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdGlmICh0d2Vlbi5fcGF1c2VkIHx8ICgodHdlZW4gaW5zdGFuY2VvZiBUaW1lbGluZUxpdGUpICYmIHR3ZWVuLl9oYXNQYXVzZWRDaGlsZCgpKSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHR3ZWVuID0gdHdlZW4uX25leHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcblxuXHRcdHAuZ2V0Q2hpbGRyZW4gPSBmdW5jdGlvbihuZXN0ZWQsIHR3ZWVucywgdGltZWxpbmVzLCBpZ25vcmVCZWZvcmVUaW1lKSB7XG5cdFx0XHRpZ25vcmVCZWZvcmVUaW1lID0gaWdub3JlQmVmb3JlVGltZSB8fCAtOTk5OTk5OTk5OTtcblx0XHRcdHZhciBhID0gW10sXG5cdFx0XHRcdHR3ZWVuID0gdGhpcy5fZmlyc3QsXG5cdFx0XHRcdGNudCA9IDA7XG5cdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0aWYgKHR3ZWVuLl9zdGFydFRpbWUgPCBpZ25vcmVCZWZvcmVUaW1lKSB7XG5cdFx0XHRcdFx0Ly9kbyBub3RoaW5nXG5cdFx0XHRcdH0gZWxzZSBpZiAodHdlZW4gaW5zdGFuY2VvZiBUd2VlbkxpdGUpIHtcblx0XHRcdFx0XHRpZiAodHdlZW5zICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0YVtjbnQrK10gPSB0d2Vlbjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHRpbWVsaW5lcyAhPT0gZmFsc2UpIHtcblx0XHRcdFx0XHRcdGFbY250KytdID0gdHdlZW47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChuZXN0ZWQgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRhID0gYS5jb25jYXQodHdlZW4uZ2V0Q2hpbGRyZW4odHJ1ZSwgdHdlZW5zLCB0aW1lbGluZXMpKTtcblx0XHRcdFx0XHRcdGNudCA9IGEubGVuZ3RoO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0d2VlbiA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGE7XG5cdFx0fTtcblxuXHRcdHAuZ2V0VHdlZW5zT2YgPSBmdW5jdGlvbih0YXJnZXQsIG5lc3RlZCkge1xuXHRcdFx0dmFyIGRpc2FibGVkID0gdGhpcy5fZ2MsXG5cdFx0XHRcdGEgPSBbXSxcblx0XHRcdFx0Y250ID0gMCxcblx0XHRcdFx0dHdlZW5zLCBpO1xuXHRcdFx0aWYgKGRpc2FibGVkKSB7XG5cdFx0XHRcdHRoaXMuX2VuYWJsZWQodHJ1ZSwgdHJ1ZSk7IC8vZ2V0VHdlZW5zT2YoKSBmaWx0ZXJzIG91dCBkaXNhYmxlZCB0d2VlbnMsIGFuZCB3ZSBoYXZlIHRvIG1hcmsgdGhlbSBhcyBfZ2MgPSB0cnVlIHdoZW4gdGhlIHRpbWVsaW5lIGNvbXBsZXRlcyBpbiBvcmRlciB0byBhbGxvdyBjbGVhbiBnYXJiYWdlIGNvbGxlY3Rpb24sIHNvIHRlbXBvcmFyaWx5IHJlLWVuYWJsZSB0aGUgdGltZWxpbmUgaGVyZS5cblx0XHRcdH1cblx0XHRcdHR3ZWVucyA9IFR3ZWVuTGl0ZS5nZXRUd2VlbnNPZih0YXJnZXQpO1xuXHRcdFx0aSA9IHR3ZWVucy5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0aWYgKHR3ZWVuc1tpXS50aW1lbGluZSA9PT0gdGhpcyB8fCAobmVzdGVkICYmIHRoaXMuX2NvbnRhaW5zKHR3ZWVuc1tpXSkpKSB7XG5cdFx0XHRcdFx0YVtjbnQrK10gPSB0d2VlbnNbaV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChkaXNhYmxlZCkge1xuXHRcdFx0XHR0aGlzLl9lbmFibGVkKGZhbHNlLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhO1xuXHRcdH07XG5cblx0XHRwLnJlY2VudCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3JlY2VudDtcblx0XHR9O1xuXG5cdFx0cC5fY29udGFpbnMgPSBmdW5jdGlvbih0d2Vlbikge1xuXHRcdFx0dmFyIHRsID0gdHdlZW4udGltZWxpbmU7XG5cdFx0XHR3aGlsZSAodGwpIHtcblx0XHRcdFx0aWYgKHRsID09PSB0aGlzKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGwgPSB0bC50aW1lbGluZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdFx0cC5zaGlmdENoaWxkcmVuID0gZnVuY3Rpb24oYW1vdW50LCBhZGp1c3RMYWJlbHMsIGlnbm9yZUJlZm9yZVRpbWUpIHtcblx0XHRcdGlnbm9yZUJlZm9yZVRpbWUgPSBpZ25vcmVCZWZvcmVUaW1lIHx8IDA7XG5cdFx0XHR2YXIgdHdlZW4gPSB0aGlzLl9maXJzdCxcblx0XHRcdFx0bGFiZWxzID0gdGhpcy5fbGFiZWxzLFxuXHRcdFx0XHRwO1xuXHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdGlmICh0d2Vlbi5fc3RhcnRUaW1lID49IGlnbm9yZUJlZm9yZVRpbWUpIHtcblx0XHRcdFx0XHR0d2Vlbi5fc3RhcnRUaW1lICs9IGFtb3VudDtcblx0XHRcdFx0fVxuXHRcdFx0XHR0d2VlbiA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGFkanVzdExhYmVscykge1xuXHRcdFx0XHRmb3IgKHAgaW4gbGFiZWxzKSB7XG5cdFx0XHRcdFx0aWYgKGxhYmVsc1twXSA+PSBpZ25vcmVCZWZvcmVUaW1lKSB7XG5cdFx0XHRcdFx0XHRsYWJlbHNbcF0gKz0gYW1vdW50O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX3VuY2FjaGUodHJ1ZSk7XG5cdFx0fTtcblxuXHRcdHAuX2tpbGwgPSBmdW5jdGlvbih2YXJzLCB0YXJnZXQpIHtcblx0XHRcdGlmICghdmFycyAmJiAhdGFyZ2V0KSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9lbmFibGVkKGZhbHNlLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgdHdlZW5zID0gKCF0YXJnZXQpID8gdGhpcy5nZXRDaGlsZHJlbih0cnVlLCB0cnVlLCBmYWxzZSkgOiB0aGlzLmdldFR3ZWVuc09mKHRhcmdldCksXG5cdFx0XHRcdGkgPSB0d2VlbnMubGVuZ3RoLFxuXHRcdFx0XHRjaGFuZ2VkID0gZmFsc2U7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0aWYgKHR3ZWVuc1tpXS5fa2lsbCh2YXJzLCB0YXJnZXQpKSB7XG5cdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBjaGFuZ2VkO1xuXHRcdH07XG5cblx0XHRwLmNsZWFyID0gZnVuY3Rpb24obGFiZWxzKSB7XG5cdFx0XHR2YXIgdHdlZW5zID0gdGhpcy5nZXRDaGlsZHJlbihmYWxzZSwgdHJ1ZSwgdHJ1ZSksXG5cdFx0XHRcdGkgPSB0d2VlbnMubGVuZ3RoO1xuXHRcdFx0dGhpcy5fdGltZSA9IHRoaXMuX3RvdGFsVGltZSA9IDA7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0dHdlZW5zW2ldLl9lbmFibGVkKGZhbHNlLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAobGFiZWxzICE9PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLl9sYWJlbHMgPSB7fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl91bmNhY2hlKHRydWUpO1xuXHRcdH07XG5cblx0XHRwLmludmFsaWRhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0d2VlbiA9IHRoaXMuX2ZpcnN0O1xuXHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdHR3ZWVuLmludmFsaWRhdGUoKTtcblx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBBbmltYXRpb24ucHJvdG90eXBlLmludmFsaWRhdGUuY2FsbCh0aGlzKTs7XG5cdFx0fTtcblxuXHRcdHAuX2VuYWJsZWQgPSBmdW5jdGlvbihlbmFibGVkLCBpZ25vcmVUaW1lbGluZSkge1xuXHRcdFx0aWYgKGVuYWJsZWQgPT09IHRoaXMuX2djKSB7XG5cdFx0XHRcdHZhciB0d2VlbiA9IHRoaXMuX2ZpcnN0O1xuXHRcdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0XHR0d2Vlbi5fZW5hYmxlZChlbmFibGVkLCB0cnVlKTtcblx0XHRcdFx0XHR0d2VlbiA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gU2ltcGxlVGltZWxpbmUucHJvdG90eXBlLl9lbmFibGVkLmNhbGwodGhpcywgZW5hYmxlZCwgaWdub3JlVGltZWxpbmUpO1xuXHRcdH07XG5cblx0XHRwLnRvdGFsVGltZSA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCB1bmNhcHBlZCkge1xuXHRcdFx0dGhpcy5fZm9yY2luZ1BsYXloZWFkID0gdHJ1ZTtcblx0XHRcdHZhciB2YWwgPSBBbmltYXRpb24ucHJvdG90eXBlLnRvdGFsVGltZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0dGhpcy5fZm9yY2luZ1BsYXloZWFkID0gZmFsc2U7XG5cdFx0XHRyZXR1cm4gdmFsO1xuXHRcdH07XG5cblx0XHRwLmR1cmF0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRpZiAodGhpcy5fZGlydHkpIHtcblx0XHRcdFx0XHR0aGlzLnRvdGFsRHVyYXRpb24oKTsgLy9qdXN0IHRyaWdnZXJzIHJlY2FsY3VsYXRpb25cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZHVyYXRpb247XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5kdXJhdGlvbigpICE9PSAwICYmIHZhbHVlICE9PSAwKSB7XG5cdFx0XHRcdHRoaXMudGltZVNjYWxlKHRoaXMuX2R1cmF0aW9uIC8gdmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAudG90YWxEdXJhdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0aWYgKHRoaXMuX2RpcnR5KSB7XG5cdFx0XHRcdFx0dmFyIG1heCA9IDAsXG5cdFx0XHRcdFx0XHR0d2VlbiA9IHRoaXMuX2xhc3QsXG5cdFx0XHRcdFx0XHRwcmV2U3RhcnQgPSA5OTk5OTk5OTk5OTksXG5cdFx0XHRcdFx0XHRwcmV2LCBlbmQ7XG5cdFx0XHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRwcmV2ID0gdHdlZW4uX3ByZXY7IC8vcmVjb3JkIGl0IGhlcmUgaW4gY2FzZSB0aGUgdHdlZW4gY2hhbmdlcyBwb3NpdGlvbiBpbiB0aGUgc2VxdWVuY2UuLi5cblx0XHRcdFx0XHRcdGlmICh0d2Vlbi5fZGlydHkpIHtcblx0XHRcdFx0XHRcdFx0dHdlZW4udG90YWxEdXJhdGlvbigpOyAvL2NvdWxkIGNoYW5nZSB0aGUgdHdlZW4uX3N0YXJ0VGltZSwgc28gbWFrZSBzdXJlIHRoZSB0d2VlbidzIGNhY2hlIGlzIGNsZWFuIGJlZm9yZSBhbmFseXppbmcgaXQuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAodHdlZW4uX3N0YXJ0VGltZSA+IHByZXZTdGFydCAmJiB0aGlzLl9zb3J0Q2hpbGRyZW4gJiYgIXR3ZWVuLl9wYXVzZWQpIHsgLy9pbiBjYXNlIG9uZSBvZiB0aGUgdHdlZW5zIHNoaWZ0ZWQgb3V0IG9mIG9yZGVyLCBpdCBuZWVkcyB0byBiZSByZS1pbnNlcnRlZCBpbnRvIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGluIHRoZSBzZXF1ZW5jZVxuXHRcdFx0XHRcdFx0XHR0aGlzLmFkZCh0d2VlbiwgdHdlZW4uX3N0YXJ0VGltZSAtIHR3ZWVuLl9kZWxheSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRwcmV2U3RhcnQgPSB0d2Vlbi5fc3RhcnRUaW1lO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHR3ZWVuLl9zdGFydFRpbWUgPCAwICYmICF0d2Vlbi5fcGF1c2VkKSB7IC8vY2hpbGRyZW4gYXJlbid0IGFsbG93ZWQgdG8gaGF2ZSBuZWdhdGl2ZSBzdGFydFRpbWVzIHVubGVzcyBzbW9vdGhDaGlsZFRpbWluZyBpcyB0cnVlLCBzbyBhZGp1c3QgaGVyZSBpZiBvbmUgaXMgZm91bmQuXG5cdFx0XHRcdFx0XHRcdG1heCAtPSB0d2Vlbi5fc3RhcnRUaW1lO1xuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9zdGFydFRpbWUgKz0gdHdlZW4uX3N0YXJ0VGltZSAvIHRoaXMuX3RpbWVTY2FsZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR0aGlzLnNoaWZ0Q2hpbGRyZW4oLXR3ZWVuLl9zdGFydFRpbWUsIGZhbHNlLCAtOTk5OTk5OTk5OSk7XG5cdFx0XHRcdFx0XHRcdHByZXZTdGFydCA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbmQgPSB0d2Vlbi5fc3RhcnRUaW1lICsgKHR3ZWVuLl90b3RhbER1cmF0aW9uIC8gdHdlZW4uX3RpbWVTY2FsZSk7XG5cdFx0XHRcdFx0XHRpZiAoZW5kID4gbWF4KSB7XG5cdFx0XHRcdFx0XHRcdG1heCA9IGVuZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHR3ZWVuID0gcHJldjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fZHVyYXRpb24gPSB0aGlzLl90b3RhbER1cmF0aW9uID0gbWF4O1xuXHRcdFx0XHRcdHRoaXMuX2RpcnR5ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RvdGFsRHVyYXRpb247XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKHZhbHVlICYmIHRoaXMudG90YWxEdXJhdGlvbigpKSA/IHRoaXMudGltZVNjYWxlKHRoaXMuX3RvdGFsRHVyYXRpb24gLyB2YWx1ZSkgOiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnBhdXNlZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIXZhbHVlKSB7IC8vaWYgdGhlcmUncyBhIHBhdXNlIGRpcmVjdGx5IGF0IHRoZSBzcG90IGZyb20gd2hlcmUgd2UncmUgdW5wYXVzaW5nLCBza2lwIGl0LlxuXHRcdFx0XHR2YXIgdHdlZW4gPSB0aGlzLl9maXJzdCxcblx0XHRcdFx0XHR0aW1lID0gdGhpcy5fdGltZTtcblx0XHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdFx0aWYgKHR3ZWVuLl9zdGFydFRpbWUgPT09IHRpbWUgJiYgdHdlZW4uZGF0YSA9PT0gXCJpc1BhdXNlXCIpIHtcblx0XHRcdFx0XHRcdHR3ZWVuLl9yYXdQcmV2VGltZSA9IDA7IC8vcmVtZW1iZXIsIF9yYXdQcmV2VGltZSBpcyBob3cgemVyby1kdXJhdGlvbiB0d2VlbnMvY2FsbGJhY2tzIHNlbnNlIGRpcmVjdGlvbmFsaXR5IGFuZCBkZXRlcm1pbmUgd2hldGhlciBvciBub3QgdG8gZmlyZS4gSWYgX3Jhd1ByZXZUaW1lIGlzIHRoZSBzYW1lIGFzIF9zdGFydFRpbWUgb24gdGhlIG5leHQgcmVuZGVyLCBpdCB3b24ndCBmaXJlLlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0d2VlbiA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gQW5pbWF0aW9uLnByb3RvdHlwZS5wYXVzZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHR9O1xuXG5cdFx0cC51c2VzRnJhbWVzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdGwgPSB0aGlzLl90aW1lbGluZTtcblx0XHRcdHdoaWxlICh0bC5fdGltZWxpbmUpIHtcblx0XHRcdFx0dGwgPSB0bC5fdGltZWxpbmU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKHRsID09PSBBbmltYXRpb24uX3Jvb3RGcmFtZXNUaW1lbGluZSk7XG5cdFx0fTtcblxuXHRcdHAucmF3VGltZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3BhdXNlZCA/IHRoaXMuX3RvdGFsVGltZSA6ICh0aGlzLl90aW1lbGluZS5yYXdUaW1lKCkgLSB0aGlzLl9zdGFydFRpbWUpICogdGhpcy5fdGltZVNjYWxlO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gVGltZWxpbmVMaXRlO1xuXG5cdH0sIHRydWUpO1xuXG5cblxuXG5cblxuXG5cblx0XG5cdFxuXHRcblx0XG5cdFxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFRpbWVsaW5lTWF4XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0X2dzU2NvcGUuX2dzRGVmaW5lKFwiVGltZWxpbmVNYXhcIiwgW1wiVGltZWxpbmVMaXRlXCIsXCJUd2VlbkxpdGVcIixcImVhc2luZy5FYXNlXCJdLCBmdW5jdGlvbihUaW1lbGluZUxpdGUsIFR3ZWVuTGl0ZSwgRWFzZSkge1xuXG5cdFx0dmFyIFRpbWVsaW5lTWF4ID0gZnVuY3Rpb24odmFycykge1xuXHRcdFx0XHRUaW1lbGluZUxpdGUuY2FsbCh0aGlzLCB2YXJzKTtcblx0XHRcdFx0dGhpcy5fcmVwZWF0ID0gdGhpcy52YXJzLnJlcGVhdCB8fCAwO1xuXHRcdFx0XHR0aGlzLl9yZXBlYXREZWxheSA9IHRoaXMudmFycy5yZXBlYXREZWxheSB8fCAwO1xuXHRcdFx0XHR0aGlzLl9jeWNsZSA9IDA7XG5cdFx0XHRcdHRoaXMuX3lveW8gPSAodGhpcy52YXJzLnlveW8gPT09IHRydWUpO1xuXHRcdFx0XHR0aGlzLl9kaXJ0eSA9IHRydWU7XG5cdFx0XHR9LFxuXHRcdFx0X3RpbnlOdW0gPSAwLjAwMDAwMDAwMDEsXG5cdFx0XHRUd2VlbkxpdGVJbnRlcm5hbHMgPSBUd2VlbkxpdGUuX2ludGVybmFscyxcblx0XHRcdF9sYXp5VHdlZW5zID0gVHdlZW5MaXRlSW50ZXJuYWxzLmxhenlUd2VlbnMsXG5cdFx0XHRfbGF6eVJlbmRlciA9IFR3ZWVuTGl0ZUludGVybmFscy5sYXp5UmVuZGVyLFxuXHRcdFx0X2dsb2JhbHMgPSBfZ3NTY29wZS5fZ3NEZWZpbmUuZ2xvYmFscyxcblx0XHRcdF9lYXNlTm9uZSA9IG5ldyBFYXNlKG51bGwsIG51bGwsIDEsIDApLFxuXHRcdFx0cCA9IFRpbWVsaW5lTWF4LnByb3RvdHlwZSA9IG5ldyBUaW1lbGluZUxpdGUoKTtcblxuXHRcdHAuY29uc3RydWN0b3IgPSBUaW1lbGluZU1heDtcblx0XHRwLmtpbGwoKS5fZ2MgPSBmYWxzZTtcblx0XHRUaW1lbGluZU1heC52ZXJzaW9uID0gXCIxLjE5LjBcIjtcblxuXHRcdHAuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5feW95byA9ICh0aGlzLnZhcnMueW95byA9PT0gdHJ1ZSk7XG5cdFx0XHR0aGlzLl9yZXBlYXQgPSB0aGlzLnZhcnMucmVwZWF0IHx8IDA7XG5cdFx0XHR0aGlzLl9yZXBlYXREZWxheSA9IHRoaXMudmFycy5yZXBlYXREZWxheSB8fCAwO1xuXHRcdFx0dGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHRcdHJldHVybiBUaW1lbGluZUxpdGUucHJvdG90eXBlLmludmFsaWRhdGUuY2FsbCh0aGlzKTtcblx0XHR9O1xuXG5cdFx0cC5hZGRDYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBwb3NpdGlvbiwgcGFyYW1zLCBzY29wZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYWRkKCBUd2VlbkxpdGUuZGVsYXllZENhbGwoMCwgY2FsbGJhY2ssIHBhcmFtcywgc2NvcGUpLCBwb3NpdGlvbik7XG5cdFx0fTtcblxuXHRcdHAucmVtb3ZlQ2FsbGJhY2sgPSBmdW5jdGlvbihjYWxsYmFjaywgcG9zaXRpb24pIHtcblx0XHRcdGlmIChjYWxsYmFjaykge1xuXHRcdFx0XHRpZiAocG9zaXRpb24gPT0gbnVsbCkge1xuXHRcdFx0XHRcdHRoaXMuX2tpbGwobnVsbCwgY2FsbGJhY2spO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciBhID0gdGhpcy5nZXRUd2VlbnNPZihjYWxsYmFjaywgZmFsc2UpLFxuXHRcdFx0XHRcdFx0aSA9IGEubGVuZ3RoLFxuXHRcdFx0XHRcdFx0dGltZSA9IHRoaXMuX3BhcnNlVGltZU9yTGFiZWwocG9zaXRpb24pO1xuXHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0aWYgKGFbaV0uX3N0YXJ0VGltZSA9PT0gdGltZSkge1xuXHRcdFx0XHRcdFx0XHRhW2ldLl9lbmFibGVkKGZhbHNlLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5yZW1vdmVQYXVzZSA9IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZW1vdmVDYWxsYmFjayhUaW1lbGluZUxpdGUuX2ludGVybmFscy5wYXVzZUNhbGxiYWNrLCBwb3NpdGlvbik7XG5cdFx0fTtcblxuXHRcdHAudHdlZW5UbyA9IGZ1bmN0aW9uKHBvc2l0aW9uLCB2YXJzKSB7XG5cdFx0XHR2YXJzID0gdmFycyB8fCB7fTtcblx0XHRcdHZhciBjb3B5ID0ge2Vhc2U6X2Vhc2VOb25lLCB1c2VGcmFtZXM6dGhpcy51c2VzRnJhbWVzKCksIGltbWVkaWF0ZVJlbmRlcjpmYWxzZX0sXG5cdFx0XHRcdEVuZ2luZSA9ICh2YXJzLnJlcGVhdCAmJiBfZ2xvYmFscy5Ud2Vlbk1heCkgfHwgVHdlZW5MaXRlLFxuXHRcdFx0XHRkdXJhdGlvbiwgcCwgdDtcblx0XHRcdGZvciAocCBpbiB2YXJzKSB7XG5cdFx0XHRcdGNvcHlbcF0gPSB2YXJzW3BdO1xuXHRcdFx0fVxuXHRcdFx0Y29weS50aW1lID0gdGhpcy5fcGFyc2VUaW1lT3JMYWJlbChwb3NpdGlvbik7XG5cdFx0XHRkdXJhdGlvbiA9IChNYXRoLmFicyhOdW1iZXIoY29weS50aW1lKSAtIHRoaXMuX3RpbWUpIC8gdGhpcy5fdGltZVNjYWxlKSB8fCAwLjAwMTtcblx0XHRcdHQgPSBuZXcgRW5naW5lKHRoaXMsIGR1cmF0aW9uLCBjb3B5KTtcblx0XHRcdGNvcHkub25TdGFydCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0LnRhcmdldC5wYXVzZWQodHJ1ZSk7XG5cdFx0XHRcdGlmICh0LnZhcnMudGltZSAhPT0gdC50YXJnZXQudGltZSgpICYmIGR1cmF0aW9uID09PSB0LmR1cmF0aW9uKCkpIHsgLy9kb24ndCBtYWtlIHRoZSBkdXJhdGlvbiB6ZXJvIC0gaWYgaXQncyBzdXBwb3NlZCB0byBiZSB6ZXJvLCBkb24ndCB3b3JyeSBiZWNhdXNlIGl0J3MgYWxyZWFkeSBpbml0dGluZyB0aGUgdHdlZW4gYW5kIHdpbGwgY29tcGxldGUgaW1tZWRpYXRlbHksIGVmZmVjdGl2ZWx5IG1ha2luZyB0aGUgZHVyYXRpb24gemVybyBhbnl3YXkuIElmIHdlIG1ha2UgZHVyYXRpb24gemVybywgdGhlIHR3ZWVuIHdvbid0IHJ1biBhdCBhbGwuXG5cdFx0XHRcdFx0dC5kdXJhdGlvbiggTWF0aC5hYnMoIHQudmFycy50aW1lIC0gdC50YXJnZXQudGltZSgpKSAvIHQudGFyZ2V0Ll90aW1lU2NhbGUgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodmFycy5vblN0YXJ0KSB7IC8vaW4gY2FzZSB0aGUgdXNlciBoYWQgYW4gb25TdGFydCBpbiB0aGUgdmFycyAtIHdlIGRvbid0IHdhbnQgdG8gb3ZlcndyaXRlIGl0LlxuXHRcdFx0XHRcdHQuX2NhbGxiYWNrKFwib25TdGFydFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiB0O1xuXHRcdH07XG5cblx0XHRwLnR3ZWVuRnJvbVRvID0gZnVuY3Rpb24oZnJvbVBvc2l0aW9uLCB0b1Bvc2l0aW9uLCB2YXJzKSB7XG5cdFx0XHR2YXJzID0gdmFycyB8fCB7fTtcblx0XHRcdGZyb21Qb3NpdGlvbiA9IHRoaXMuX3BhcnNlVGltZU9yTGFiZWwoZnJvbVBvc2l0aW9uKTtcblx0XHRcdHZhcnMuc3RhcnRBdCA9IHtvbkNvbXBsZXRlOnRoaXMuc2Vlaywgb25Db21wbGV0ZVBhcmFtczpbZnJvbVBvc2l0aW9uXSwgY2FsbGJhY2tTY29wZTp0aGlzfTtcblx0XHRcdHZhcnMuaW1tZWRpYXRlUmVuZGVyID0gKHZhcnMuaW1tZWRpYXRlUmVuZGVyICE9PSBmYWxzZSk7XG5cdFx0XHR2YXIgdCA9IHRoaXMudHdlZW5Ubyh0b1Bvc2l0aW9uLCB2YXJzKTtcblx0XHRcdHJldHVybiB0LmR1cmF0aW9uKChNYXRoLmFicyggdC52YXJzLnRpbWUgLSBmcm9tUG9zaXRpb24pIC8gdGhpcy5fdGltZVNjYWxlKSB8fCAwLjAwMSk7XG5cdFx0fTtcblxuXHRcdHAucmVuZGVyID0gZnVuY3Rpb24odGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKSB7XG5cdFx0XHRpZiAodGhpcy5fZ2MpIHtcblx0XHRcdFx0dGhpcy5fZW5hYmxlZCh0cnVlLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgdG90YWxEdXIgPSAoIXRoaXMuX2RpcnR5KSA/IHRoaXMuX3RvdGFsRHVyYXRpb24gOiB0aGlzLnRvdGFsRHVyYXRpb24oKSxcblx0XHRcdFx0ZHVyID0gdGhpcy5fZHVyYXRpb24sXG5cdFx0XHRcdHByZXZUaW1lID0gdGhpcy5fdGltZSxcblx0XHRcdFx0cHJldlRvdGFsVGltZSA9IHRoaXMuX3RvdGFsVGltZSxcblx0XHRcdFx0cHJldlN0YXJ0ID0gdGhpcy5fc3RhcnRUaW1lLFxuXHRcdFx0XHRwcmV2VGltZVNjYWxlID0gdGhpcy5fdGltZVNjYWxlLFxuXHRcdFx0XHRwcmV2UmF3UHJldlRpbWUgPSB0aGlzLl9yYXdQcmV2VGltZSxcblx0XHRcdFx0cHJldlBhdXNlZCA9IHRoaXMuX3BhdXNlZCxcblx0XHRcdFx0cHJldkN5Y2xlID0gdGhpcy5fY3ljbGUsXG5cdFx0XHRcdHR3ZWVuLCBpc0NvbXBsZXRlLCBuZXh0LCBjYWxsYmFjaywgaW50ZXJuYWxGb3JjZSwgY3ljbGVEdXJhdGlvbiwgcGF1c2VUd2VlbiwgY3VyVGltZTtcblx0XHRcdGlmICh0aW1lID49IHRvdGFsRHVyIC0gMC4wMDAwMDAxKSB7IC8vdG8gd29yayBhcm91bmQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCBtYXRoIGFydGlmYWN0cy5cblx0XHRcdFx0aWYgKCF0aGlzLl9sb2NrZWQpIHtcblx0XHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0b3RhbER1cjtcblx0XHRcdFx0XHR0aGlzLl9jeWNsZSA9IHRoaXMuX3JlcGVhdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXRoaXMuX3JldmVyc2VkKSBpZiAoIXRoaXMuX2hhc1BhdXNlZENoaWxkKCkpIHtcblx0XHRcdFx0XHRpc0NvbXBsZXRlID0gdHJ1ZTtcblx0XHRcdFx0XHRjYWxsYmFjayA9IFwib25Db21wbGV0ZVwiO1xuXHRcdFx0XHRcdGludGVybmFsRm9yY2UgPSAhIXRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbjsgLy9vdGhlcndpc2UsIGlmIHRoZSBhbmltYXRpb24gaXMgdW5wYXVzZWQvYWN0aXZhdGVkIGFmdGVyIGl0J3MgYWxyZWFkeSBmaW5pc2hlZCwgaXQgZG9lc24ndCBnZXQgcmVtb3ZlZCBmcm9tIHRoZSBwYXJlbnQgdGltZWxpbmUuXG5cdFx0XHRcdFx0aWYgKHRoaXMuX2R1cmF0aW9uID09PSAwKSBpZiAoKHRpbWUgPD0gMCAmJiB0aW1lID49IC0wLjAwMDAwMDEpIHx8IHByZXZSYXdQcmV2VGltZSA8IDAgfHwgcHJldlJhd1ByZXZUaW1lID09PSBfdGlueU51bSkgaWYgKHByZXZSYXdQcmV2VGltZSAhPT0gdGltZSAmJiB0aGlzLl9maXJzdCkge1xuXHRcdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0XHRpZiAocHJldlJhd1ByZXZUaW1lID4gX3RpbnlOdW0pIHtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gKHRoaXMuX2R1cmF0aW9uIHx8ICFzdXBwcmVzc0V2ZW50cyB8fCB0aW1lIHx8IHRoaXMuX3Jhd1ByZXZUaW1lID09PSB0aW1lKSA/IHRpbWUgOiBfdGlueU51bTsgLy93aGVuIHRoZSBwbGF5aGVhZCBhcnJpdmVzIGF0IEVYQUNUTFkgdGltZSAwIChyaWdodCBvbiB0b3ApIG9mIGEgemVyby1kdXJhdGlvbiB0aW1lbGluZSBvciB0d2Vlbiwgd2UgbmVlZCB0byBkaXNjZXJuIGlmIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBzbyB0aGF0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIGFnYWluIChuZXh0IHRpbWUpLCBpdCdsbCB0cmlnZ2VyIHRoZSBjYWxsYmFjay4gSWYgZXZlbnRzIGFyZSBOT1Qgc3VwcHJlc3NlZCwgb2J2aW91c2x5IHRoZSBjYWxsYmFjayB3b3VsZCBiZSB0cmlnZ2VyZWQgaW4gdGhpcyByZW5kZXIuIEJhc2ljYWxseSwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlIGVpdGhlciB3aGVuIHRoZSBwbGF5aGVhZCBBUlJJVkVTIG9yIExFQVZFUyB0aGlzIGV4YWN0IHNwb3QsIG5vdCBib3RoLiBJbWFnaW5lIGRvaW5nIGEgdGltZWxpbmUuc2VlaygwKSBhbmQgdGhlcmUncyBhIGNhbGxiYWNrIHRoYXQgc2l0cyBhdCAwLiBTaW5jZSBldmVudHMgYXJlIHN1cHByZXNzZWQgb24gdGhhdCBzZWVrKCkgYnkgZGVmYXVsdCwgbm90aGluZyB3aWxsIGZpcmUsIGJ1dCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBvZmYgb2YgdGhhdCBwb3NpdGlvbiwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlLiBUaGlzIGJlaGF2aW9yIGlzIHdoYXQgcGVvcGxlIGludHVpdGl2ZWx5IGV4cGVjdC4gV2Ugc2V0IHRoZSBfcmF3UHJldlRpbWUgdG8gYmUgYSBwcmVjaXNlIHRpbnkgbnVtYmVyIHRvIGluZGljYXRlIHRoaXMgc2NlbmFyaW8gcmF0aGVyIHRoYW4gdXNpbmcgYW5vdGhlciBwcm9wZXJ0eS92YXJpYWJsZSB3aGljaCB3b3VsZCBpbmNyZWFzZSBtZW1vcnkgdXNhZ2UuIFRoaXMgdGVjaG5pcXVlIGlzIGxlc3MgcmVhZGFibGUsIGJ1dCBtb3JlIGVmZmljaWVudC5cblx0XHRcdFx0aWYgKHRoaXMuX3lveW8gJiYgKHRoaXMuX2N5Y2xlICYgMSkgIT09IDApIHtcblx0XHRcdFx0XHR0aGlzLl90aW1lID0gdGltZSA9IDA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IGR1cjtcblx0XHRcdFx0XHR0aW1lID0gZHVyICsgMC4wMDAxOyAvL3RvIGF2b2lkIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgcm91bmRpbmcgZXJyb3JzIC0gc29tZXRpbWVzIGNoaWxkIHR3ZWVucy90aW1lbGluZXMgd2VyZSBub3QgYmVpbmcgZnVsbHkgY29tcGxldGVkICh0aGVpciBwcm9ncmVzcyBtaWdodCBiZSAwLjk5OTk5OTk5OTk5OTk5OCBpbnN0ZWFkIG9mIDEgYmVjYXVzZSB3aGVuIF90aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSBpcyBwZXJmb3JtZWQsIGZsb2F0aW5nIHBvaW50IGVycm9ycyB3b3VsZCByZXR1cm4gYSB2YWx1ZSB0aGF0IHdhcyBTTElHSFRMWSBvZmYpLiBUcnkgKDk5OTk5OTk5OTk5OS43IC0gOTk5OTk5OTk5OTk5KSAqIDEgPSAwLjY5OTk1MTE3MTg3NSBpbnN0ZWFkIG9mIDAuNy4gV2UgY2Fubm90IGRvIGxlc3MgdGhlbiAwLjAwMDEgYmVjYXVzZSB0aGUgc2FtZSBpc3N1ZSBjYW4gb2NjdXIgd2hlbiB0aGUgZHVyYXRpb24gaXMgZXh0cmVtZWx5IGxhcmdlIGxpa2UgOTk5OTk5OTk5OTk5IGluIHdoaWNoIGNhc2UgYWRkaW5nIDAuMDAwMDAwMDEsIGZvciBleGFtcGxlLCBjYXVzZXMgaXQgdG8gYWN0IGxpa2Ugbm90aGluZyB3YXMgYWRkZWQuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIGlmICh0aW1lIDwgMC4wMDAwMDAxKSB7IC8vdG8gd29yayBhcm91bmQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCBtYXRoIGFydGlmYWN0cywgcm91bmQgc3VwZXIgc21hbGwgdmFsdWVzIHRvIDAuXG5cdFx0XHRcdGlmICghdGhpcy5fbG9ja2VkKSB7XG5cdFx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fY3ljbGUgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3RpbWUgPSAwO1xuXHRcdFx0XHRpZiAocHJldlRpbWUgIT09IDAgfHwgKGR1ciA9PT0gMCAmJiBwcmV2UmF3UHJldlRpbWUgIT09IF90aW55TnVtICYmIChwcmV2UmF3UHJldlRpbWUgPiAwIHx8ICh0aW1lIDwgMCAmJiBwcmV2UmF3UHJldlRpbWUgPj0gMCkpICYmICF0aGlzLl9sb2NrZWQpKSB7IC8vZWRnZSBjYXNlIGZvciBjaGVja2luZyB0aW1lIDwgMCAmJiBwcmV2UmF3UHJldlRpbWUgPj0gMDogYSB6ZXJvLWR1cmF0aW9uIGZyb21UbygpIHR3ZWVuIGluc2lkZSBhIHplcm8tZHVyYXRpb24gdGltZWxpbmUgKHllYWgsIHZlcnkgcmFyZSlcblx0XHRcdFx0XHRjYWxsYmFjayA9IFwib25SZXZlcnNlQ29tcGxldGVcIjtcblx0XHRcdFx0XHRpc0NvbXBsZXRlID0gdGhpcy5fcmV2ZXJzZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRpbWUgPCAwKSB7XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbiAmJiB0aGlzLl9yZXZlcnNlZCkge1xuXHRcdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IGlzQ29tcGxldGUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwcmV2UmF3UHJldlRpbWUgPj0gMCAmJiB0aGlzLl9maXJzdCkgeyAvL3doZW4gZ29pbmcgYmFjayBiZXlvbmQgdGhlIHN0YXJ0LCBmb3JjZSBhIHJlbmRlciBzbyB0aGF0IHplcm8tZHVyYXRpb24gdHdlZW5zIHRoYXQgc2l0IGF0IHRoZSB2ZXJ5IGJlZ2lubmluZyByZW5kZXIgdGhlaXIgc3RhcnQgdmFsdWVzIHByb3Blcmx5LiBPdGhlcndpc2UsIGlmIHRoZSBwYXJlbnQgdGltZWxpbmUncyBwbGF5aGVhZCBsYW5kcyBleGFjdGx5IGF0IHRoaXMgdGltZWxpbmUncyBzdGFydFRpbWUsIGFuZCB0aGVuIG1vdmVzIGJhY2t3YXJkcywgdGhlIHplcm8tZHVyYXRpb24gdHdlZW5zIGF0IHRoZSBiZWdpbm5pbmcgd291bGQgc3RpbGwgYmUgYXQgdGhlaXIgZW5kIHN0YXRlLlxuXHRcdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gdGltZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IChkdXIgfHwgIXN1cHByZXNzRXZlbnRzIHx8IHRpbWUgfHwgdGhpcy5fcmF3UHJldlRpbWUgPT09IHRpbWUpID8gdGltZSA6IF90aW55TnVtOyAvL3doZW4gdGhlIHBsYXloZWFkIGFycml2ZXMgYXQgRVhBQ1RMWSB0aW1lIDAgKHJpZ2h0IG9uIHRvcCkgb2YgYSB6ZXJvLWR1cmF0aW9uIHRpbWVsaW5lIG9yIHR3ZWVuLCB3ZSBuZWVkIHRvIGRpc2Nlcm4gaWYgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIHNvIHRoYXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgYWdhaW4gKG5leHQgdGltZSksIGl0J2xsIHRyaWdnZXIgdGhlIGNhbGxiYWNrLiBJZiBldmVudHMgYXJlIE5PVCBzdXBwcmVzc2VkLCBvYnZpb3VzbHkgdGhlIGNhbGxiYWNrIHdvdWxkIGJlIHRyaWdnZXJlZCBpbiB0aGlzIHJlbmRlci4gQmFzaWNhbGx5LCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUgZWl0aGVyIHdoZW4gdGhlIHBsYXloZWFkIEFSUklWRVMgb3IgTEVBVkVTIHRoaXMgZXhhY3Qgc3BvdCwgbm90IGJvdGguIEltYWdpbmUgZG9pbmcgYSB0aW1lbGluZS5zZWVrKDApIGFuZCB0aGVyZSdzIGEgY2FsbGJhY2sgdGhhdCBzaXRzIGF0IDAuIFNpbmNlIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBvbiB0aGF0IHNlZWsoKSBieSBkZWZhdWx0LCBub3RoaW5nIHdpbGwgZmlyZSwgYnV0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIG9mZiBvZiB0aGF0IHBvc2l0aW9uLCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUuIFRoaXMgYmVoYXZpb3IgaXMgd2hhdCBwZW9wbGUgaW50dWl0aXZlbHkgZXhwZWN0LiBXZSBzZXQgdGhlIF9yYXdQcmV2VGltZSB0byBiZSBhIHByZWNpc2UgdGlueSBudW1iZXIgdG8gaW5kaWNhdGUgdGhpcyBzY2VuYXJpbyByYXRoZXIgdGhhbiB1c2luZyBhbm90aGVyIHByb3BlcnR5L3ZhcmlhYmxlIHdoaWNoIHdvdWxkIGluY3JlYXNlIG1lbW9yeSB1c2FnZS4gVGhpcyB0ZWNobmlxdWUgaXMgbGVzcyByZWFkYWJsZSwgYnV0IG1vcmUgZWZmaWNpZW50LlxuXHRcdFx0XHRcdGlmICh0aW1lID09PSAwICYmIGlzQ29tcGxldGUpIHsgLy9pZiB0aGVyZSdzIGEgemVyby1kdXJhdGlvbiB0d2VlbiBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgYSB0aW1lbGluZSBhbmQgdGhlIHBsYXloZWFkIGxhbmRzIEVYQUNUTFkgYXQgdGltZSAwLCB0aGF0IHR3ZWVuIHdpbGwgY29ycmVjdGx5IHJlbmRlciBpdHMgZW5kIHZhbHVlcywgYnV0IHdlIG5lZWQgdG8ga2VlcCB0aGUgdGltZWxpbmUgYWxpdmUgZm9yIG9uZSBtb3JlIHJlbmRlciBzbyB0aGF0IHRoZSBiZWdpbm5pbmcgdmFsdWVzIHJlbmRlciBwcm9wZXJseSBhcyB0aGUgcGFyZW50J3MgcGxheWhlYWQga2VlcHMgbW92aW5nIGJleW9uZCB0aGUgYmVnaW5pbmcuIEltYWdpbmUgb2JqLnggc3RhcnRzIGF0IDAgYW5kIHRoZW4gd2UgZG8gdGwuc2V0KG9iaiwge3g6MTAwfSkudG8ob2JqLCAxLCB7eDoyMDB9KSBhbmQgdGhlbiBsYXRlciB3ZSB0bC5yZXZlcnNlKCkuLi50aGUgZ29hbCBpcyB0byBoYXZlIG9iai54IHJldmVydCB0byAwLiBJZiB0aGUgcGxheWhlYWQgaGFwcGVucyB0byBsYW5kIG9uIGV4YWN0bHkgMCwgd2l0aG91dCB0aGlzIGNodW5rIG9mIGNvZGUsIGl0J2QgY29tcGxldGUgdGhlIHRpbWVsaW5lIGFuZCByZW1vdmUgaXQgZnJvbSB0aGUgcmVuZGVyaW5nIHF1ZXVlIChub3QgZ29vZCkuXG5cdFx0XHRcdFx0XHR0d2VlbiA9IHRoaXMuX2ZpcnN0O1xuXHRcdFx0XHRcdFx0d2hpbGUgKHR3ZWVuICYmIHR3ZWVuLl9zdGFydFRpbWUgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCF0d2Vlbi5fZHVyYXRpb24pIHtcblx0XHRcdFx0XHRcdFx0XHRpc0NvbXBsZXRlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGltZSA9IDA7IC8vdG8gYXZvaWQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCByb3VuZGluZyBlcnJvcnMgKGNvdWxkIGNhdXNlIHByb2JsZW1zIGVzcGVjaWFsbHkgd2l0aCB6ZXJvLWR1cmF0aW9uIHR3ZWVucyBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgdGhlIHRpbWVsaW5lKVxuXHRcdFx0XHRcdGlmICghdGhpcy5faW5pdHRlZCkge1xuXHRcdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChkdXIgPT09IDAgJiYgcHJldlJhd1ByZXZUaW1lIDwgMCkgeyAvL3dpdGhvdXQgdGhpcywgemVyby1kdXJhdGlvbiByZXBlYXRpbmcgdGltZWxpbmVzIChsaWtlIHdpdGggYSBzaW1wbGUgY2FsbGJhY2sgbmVzdGVkIGF0IHRoZSB2ZXJ5IGJlZ2lubmluZyBhbmQgYSByZXBlYXREZWxheSkgd291bGRuJ3QgcmVuZGVyIHRoZSBmaXJzdCB0aW1lIHRocm91Z2guXG5cdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fdGltZSA9IHRoaXMuX3Jhd1ByZXZUaW1lID0gdGltZTtcblx0XHRcdFx0aWYgKCF0aGlzLl9sb2NrZWQpIHtcblx0XHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aW1lO1xuXHRcdFx0XHRcdGlmICh0aGlzLl9yZXBlYXQgIT09IDApIHtcblx0XHRcdFx0XHRcdGN5Y2xlRHVyYXRpb24gPSBkdXIgKyB0aGlzLl9yZXBlYXREZWxheTtcblx0XHRcdFx0XHRcdHRoaXMuX2N5Y2xlID0gKHRoaXMuX3RvdGFsVGltZSAvIGN5Y2xlRHVyYXRpb24pID4+IDA7IC8vb3JpZ2luYWxseSBfdG90YWxUaW1lICUgY3ljbGVEdXJhdGlvbiBidXQgZmxvYXRpbmcgcG9pbnQgZXJyb3JzIGNhdXNlZCBwcm9ibGVtcywgc28gSSBub3JtYWxpemVkIGl0LiAoNCAlIDAuOCBzaG91bGQgYmUgMCBidXQgaXQgZ2V0cyByZXBvcnRlZCBhcyAwLjc5OTk5OTk5ISlcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9jeWNsZSAhPT0gMCkgaWYgKHRoaXMuX2N5Y2xlID09PSB0aGlzLl90b3RhbFRpbWUgLyBjeWNsZUR1cmF0aW9uICYmIHByZXZUb3RhbFRpbWUgPD0gdGltZSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9jeWNsZS0tOyAvL290aGVyd2lzZSB3aGVuIHJlbmRlcmVkIGV4YWN0bHkgYXQgdGhlIGVuZCB0aW1lLCBpdCB3aWxsIGFjdCBhcyB0aG91Z2ggaXQgaXMgcmVwZWF0aW5nIChhdCB0aGUgYmVnaW5uaW5nKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5fdGltZSA9IHRoaXMuX3RvdGFsVGltZSAtICh0aGlzLl9jeWNsZSAqIGN5Y2xlRHVyYXRpb24pO1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX3lveW8pIGlmICgodGhpcy5fY3ljbGUgJiAxKSAhPT0gMCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl90aW1lID0gZHVyIC0gdGhpcy5fdGltZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICh0aGlzLl90aW1lID4gZHVyKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3RpbWUgPSBkdXI7XG5cdFx0XHRcdFx0XHRcdHRpbWUgPSBkdXIgKyAwLjAwMDE7IC8vdG8gYXZvaWQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCByb3VuZGluZyBlcnJvclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl90aW1lIDwgMCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl90aW1lID0gdGltZSA9IDA7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0aW1lID0gdGhpcy5fdGltZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpcy5faGFzUGF1c2UgJiYgIXRoaXMuX2ZvcmNpbmdQbGF5aGVhZCAmJiAhc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdFx0XHR0aW1lID0gdGhpcy5fdGltZTtcblx0XHRcdFx0XHRpZiAodGltZSA+PSBwcmV2VGltZSkge1xuXHRcdFx0XHRcdFx0dHdlZW4gPSB0aGlzLl9maXJzdDtcblx0XHRcdFx0XHRcdHdoaWxlICh0d2VlbiAmJiB0d2Vlbi5fc3RhcnRUaW1lIDw9IHRpbWUgJiYgIXBhdXNlVHdlZW4pIHtcblx0XHRcdFx0XHRcdFx0aWYgKCF0d2Vlbi5fZHVyYXRpb24pIGlmICh0d2Vlbi5kYXRhID09PSBcImlzUGF1c2VcIiAmJiAhdHdlZW4ucmF0aW8gJiYgISh0d2Vlbi5fc3RhcnRUaW1lID09PSAwICYmIHRoaXMuX3Jhd1ByZXZUaW1lID09PSAwKSkge1xuXHRcdFx0XHRcdFx0XHRcdHBhdXNlVHdlZW4gPSB0d2Vlbjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR0d2VlbiA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0d2VlbiA9IHRoaXMuX2xhc3Q7XG5cdFx0XHRcdFx0XHR3aGlsZSAodHdlZW4gJiYgdHdlZW4uX3N0YXJ0VGltZSA+PSB0aW1lICYmICFwYXVzZVR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghdHdlZW4uX2R1cmF0aW9uKSBpZiAodHdlZW4uZGF0YSA9PT0gXCJpc1BhdXNlXCIgJiYgdHdlZW4uX3Jhd1ByZXZUaW1lID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdHBhdXNlVHdlZW4gPSB0d2Vlbjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR0d2VlbiA9IHR3ZWVuLl9wcmV2O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocGF1c2VUd2Vlbikge1xuXHRcdFx0XHRcdFx0dGhpcy5fdGltZSA9IHRpbWUgPSBwYXVzZVR3ZWVuLl9zdGFydFRpbWU7XG5cdFx0XHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aW1lICsgKHRoaXMuX2N5Y2xlICogKHRoaXMuX3RvdGFsRHVyYXRpb24gKyB0aGlzLl9yZXBlYXREZWxheSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl9jeWNsZSAhPT0gcHJldkN5Y2xlKSBpZiAoIXRoaXMuX2xvY2tlZCkge1xuXHRcdFx0XHQvKlxuXHRcdFx0XHRtYWtlIHN1cmUgY2hpbGRyZW4gYXQgdGhlIGVuZC9iZWdpbm5pbmcgb2YgdGhlIHRpbWVsaW5lIGFyZSByZW5kZXJlZCBwcm9wZXJseS4gSWYsIGZvciBleGFtcGxlLFxuXHRcdFx0XHRhIDMtc2Vjb25kIGxvbmcgdGltZWxpbmUgcmVuZGVyZWQgYXQgMi45IHNlY29uZHMgcHJldmlvdXNseSwgYW5kIG5vdyByZW5kZXJzIGF0IDMuMiBzZWNvbmRzICh3aGljaFxuXHRcdFx0XHR3b3VsZCBnZXQgdHJhbnNhdGVkIHRvIDIuOCBzZWNvbmRzIGlmIHRoZSB0aW1lbGluZSB5b3lvcyBvciAwLjIgc2Vjb25kcyBpZiBpdCBqdXN0IHJlcGVhdHMpLCB0aGVyZVxuXHRcdFx0XHRjb3VsZCBiZSBhIGNhbGxiYWNrIG9yIGEgc2hvcnQgdHdlZW4gdGhhdCdzIGF0IDIuOTUgb3IgMyBzZWNvbmRzIGluIHdoaWNoIHdvdWxkbid0IHJlbmRlci4gU29cblx0XHRcdFx0d2UgbmVlZCB0byBwdXNoIHRoZSB0aW1lbGluZSB0byB0aGUgZW5kIChhbmQvb3IgYmVnaW5uaW5nIGRlcGVuZGluZyBvbiBpdHMgeW95byB2YWx1ZSkuIEFsc28gd2UgbXVzdFxuXHRcdFx0XHRlbnN1cmUgdGhhdCB6ZXJvLWR1cmF0aW9uIHR3ZWVucyBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb3IgZW5kIG9mIHRoZSBUaW1lbGluZU1heCB3b3JrLlxuXHRcdFx0XHQqL1xuXHRcdFx0XHR2YXIgYmFja3dhcmRzID0gKHRoaXMuX3lveW8gJiYgKHByZXZDeWNsZSAmIDEpICE9PSAwKSxcblx0XHRcdFx0XHR3cmFwID0gKGJhY2t3YXJkcyA9PT0gKHRoaXMuX3lveW8gJiYgKHRoaXMuX2N5Y2xlICYgMSkgIT09IDApKSxcblx0XHRcdFx0XHRyZWNUb3RhbFRpbWUgPSB0aGlzLl90b3RhbFRpbWUsXG5cdFx0XHRcdFx0cmVjQ3ljbGUgPSB0aGlzLl9jeWNsZSxcblx0XHRcdFx0XHRyZWNSYXdQcmV2VGltZSA9IHRoaXMuX3Jhd1ByZXZUaW1lLFxuXHRcdFx0XHRcdHJlY1RpbWUgPSB0aGlzLl90aW1lO1xuXG5cdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHByZXZDeWNsZSAqIGR1cjtcblx0XHRcdFx0aWYgKHRoaXMuX2N5Y2xlIDwgcHJldkN5Y2xlKSB7XG5cdFx0XHRcdFx0YmFja3dhcmRzID0gIWJhY2t3YXJkcztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgKz0gZHVyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3RpbWUgPSBwcmV2VGltZTsgLy90ZW1wb3JhcmlseSByZXZlcnQgX3RpbWUgc28gdGhhdCByZW5kZXIoKSByZW5kZXJzIHRoZSBjaGlsZHJlbiBpbiB0aGUgY29ycmVjdCBvcmRlci4gV2l0aG91dCB0aGlzLCB0d2VlbnMgd29uJ3QgcmV3aW5kIGNvcnJlY3RseS4gV2UgY291bGQgYXJoaWN0ZWN0IHRoaW5ncyBpbiBhIFwiY2xlYW5lclwiIHdheSBieSBzcGxpdHRpbmcgb3V0IHRoZSByZW5kZXJpbmcgcXVldWUgaW50byBhIHNlcGFyYXRlIG1ldGhvZCBidXQgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIHdlIGtlcHQgaXQgYWxsIGluc2lkZSB0aGlzIG1ldGhvZC5cblxuXHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IChkdXIgPT09IDApID8gcHJldlJhd1ByZXZUaW1lIC0gMC4wMDAxIDogcHJldlJhd1ByZXZUaW1lO1xuXHRcdFx0XHR0aGlzLl9jeWNsZSA9IHByZXZDeWNsZTtcblx0XHRcdFx0dGhpcy5fbG9ja2VkID0gdHJ1ZTsgLy9wcmV2ZW50cyBjaGFuZ2VzIHRvIHRvdGFsVGltZSBhbmQgc2tpcHMgcmVwZWF0L3lveW8gYmVoYXZpb3Igd2hlbiB3ZSByZWN1cnNpdmVseSBjYWxsIHJlbmRlcigpXG5cdFx0XHRcdHByZXZUaW1lID0gKGJhY2t3YXJkcykgPyAwIDogZHVyO1xuXHRcdFx0XHR0aGlzLnJlbmRlcihwcmV2VGltZSwgc3VwcHJlc3NFdmVudHMsIChkdXIgPT09IDApKTtcblx0XHRcdFx0aWYgKCFzdXBwcmVzc0V2ZW50cykgaWYgKCF0aGlzLl9nYykge1xuXHRcdFx0XHRcdGlmICh0aGlzLnZhcnMub25SZXBlYXQpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2NhbGxiYWNrKFwib25SZXBlYXRcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwcmV2VGltZSAhPT0gdGhpcy5fdGltZSkgeyAvL2luIGNhc2UgdGhlcmUncyBhIGNhbGxiYWNrIGxpa2Ugb25Db21wbGV0ZSBpbiBhIG5lc3RlZCB0d2Vlbi90aW1lbGluZSB0aGF0IGNoYW5nZXMgdGhlIHBsYXloZWFkIHBvc2l0aW9uLCBsaWtlIHZpYSBzZWVrKCksIHdlIHNob3VsZCBqdXN0IGFib3J0LlxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAod3JhcCkge1xuXHRcdFx0XHRcdHByZXZUaW1lID0gKGJhY2t3YXJkcykgPyBkdXIgKyAwLjAwMDEgOiAtMC4wMDAxO1xuXHRcdFx0XHRcdHRoaXMucmVuZGVyKHByZXZUaW1lLCB0cnVlLCBmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fbG9ja2VkID0gZmFsc2U7XG5cdFx0XHRcdGlmICh0aGlzLl9wYXVzZWQgJiYgIXByZXZQYXVzZWQpIHsgLy9pZiB0aGUgcmVuZGVyKCkgdHJpZ2dlcmVkIGNhbGxiYWNrIHRoYXQgcGF1c2VkIHRoaXMgdGltZWxpbmUsIHdlIHNob3VsZCBhYm9ydCAodmVyeSByYXJlLCBidXQgcG9zc2libGUpXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3RpbWUgPSByZWNUaW1lO1xuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSByZWNUb3RhbFRpbWU7XG5cdFx0XHRcdHRoaXMuX2N5Y2xlID0gcmVjQ3ljbGU7XG5cdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gcmVjUmF3UHJldlRpbWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgodGhpcy5fdGltZSA9PT0gcHJldlRpbWUgfHwgIXRoaXMuX2ZpcnN0KSAmJiAhZm9yY2UgJiYgIWludGVybmFsRm9yY2UgJiYgIXBhdXNlVHdlZW4pIHtcblx0XHRcdFx0aWYgKHByZXZUb3RhbFRpbWUgIT09IHRoaXMuX3RvdGFsVGltZSkgaWYgKHRoaXMuX29uVXBkYXRlKSBpZiAoIXN1cHByZXNzRXZlbnRzKSB7IC8vc28gdGhhdCBvblVwZGF0ZSBmaXJlcyBldmVuIGR1cmluZyB0aGUgcmVwZWF0RGVsYXkgLSBhcyBsb25nIGFzIHRoZSB0b3RhbFRpbWUgY2hhbmdlZCwgd2Ugc2hvdWxkIHRyaWdnZXIgb25VcGRhdGUuXG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblVwZGF0ZVwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2UgaWYgKCF0aGlzLl9pbml0dGVkKSB7XG5cdFx0XHRcdHRoaXMuX2luaXR0ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXRoaXMuX2FjdGl2ZSkgaWYgKCF0aGlzLl9wYXVzZWQgJiYgdGhpcy5fdG90YWxUaW1lICE9PSBwcmV2VG90YWxUaW1lICYmIHRpbWUgPiAwKSB7XG5cdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IHRydWU7ICAvL3NvIHRoYXQgaWYgdGhlIHVzZXIgcmVuZGVycyB0aGUgdGltZWxpbmUgKGFzIG9wcG9zZWQgdG8gdGhlIHBhcmVudCB0aW1lbGluZSByZW5kZXJpbmcgaXQpLCBpdCBpcyBmb3JjZWQgdG8gcmUtcmVuZGVyIGFuZCBhbGlnbiBpdCB3aXRoIHRoZSBwcm9wZXIgdGltZS9mcmFtZSBvbiB0aGUgbmV4dCByZW5kZXJpbmcgY3ljbGUuIE1heWJlIHRoZSB0aW1lbGluZSBhbHJlYWR5IGZpbmlzaGVkIGJ1dCB0aGUgdXNlciBtYW51YWxseSByZS1yZW5kZXJzIGl0IGFzIGhhbGZ3YXkgZG9uZSwgZm9yIGV4YW1wbGUuXG5cdFx0XHR9XG5cblx0XHRcdGlmIChwcmV2VG90YWxUaW1lID09PSAwKSBpZiAodGhpcy52YXJzLm9uU3RhcnQpIGlmICh0aGlzLl90b3RhbFRpbWUgIT09IDAgfHwgIXRoaXMuX3RvdGFsRHVyYXRpb24pIGlmICghc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblN0YXJ0XCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRjdXJUaW1lID0gdGhpcy5fdGltZTtcblx0XHRcdGlmIChjdXJUaW1lID49IHByZXZUaW1lKSB7XG5cdFx0XHRcdHR3ZWVuID0gdGhpcy5fZmlyc3Q7XG5cdFx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHRcdG5leHQgPSB0d2Vlbi5fbmV4dDsgLy9yZWNvcmQgaXQgaGVyZSBiZWNhdXNlIHRoZSB2YWx1ZSBjb3VsZCBjaGFuZ2UgYWZ0ZXIgcmVuZGVyaW5nLi4uXG5cdFx0XHRcdFx0aWYgKGN1clRpbWUgIT09IHRoaXMuX3RpbWUgfHwgKHRoaXMuX3BhdXNlZCAmJiAhcHJldlBhdXNlZCkpIHsgLy9pbiBjYXNlIGEgdHdlZW4gcGF1c2VzIG9yIHNlZWtzIHRoZSB0aW1lbGluZSB3aGVuIHJlbmRlcmluZywgbGlrZSBpbnNpZGUgb2YgYW4gb25VcGRhdGUvb25Db21wbGV0ZVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0d2Vlbi5fYWN0aXZlIHx8ICh0d2Vlbi5fc3RhcnRUaW1lIDw9IHRoaXMuX3RpbWUgJiYgIXR3ZWVuLl9wYXVzZWQgJiYgIXR3ZWVuLl9nYykpIHtcblx0XHRcdFx0XHRcdGlmIChwYXVzZVR3ZWVuID09PSB0d2Vlbikge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIXR3ZWVuLl9yZXZlcnNlZCkge1xuXHRcdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIoKHRpbWUgLSB0d2Vlbi5fc3RhcnRUaW1lKSAqIHR3ZWVuLl90aW1lU2NhbGUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIoKCghdHdlZW4uX2RpcnR5KSA/IHR3ZWVuLl90b3RhbER1cmF0aW9uIDogdHdlZW4udG90YWxEdXJhdGlvbigpKSAtICgodGltZSAtIHR3ZWVuLl9zdGFydFRpbWUpICogdHdlZW4uX3RpbWVTY2FsZSksIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHR3ZWVuID0gbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dHdlZW4gPSB0aGlzLl9sYXN0O1xuXHRcdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0XHRuZXh0ID0gdHdlZW4uX3ByZXY7IC8vcmVjb3JkIGl0IGhlcmUgYmVjYXVzZSB0aGUgdmFsdWUgY291bGQgY2hhbmdlIGFmdGVyIHJlbmRlcmluZy4uLlxuXHRcdFx0XHRcdGlmIChjdXJUaW1lICE9PSB0aGlzLl90aW1lIHx8ICh0aGlzLl9wYXVzZWQgJiYgIXByZXZQYXVzZWQpKSB7IC8vaW4gY2FzZSBhIHR3ZWVuIHBhdXNlcyBvciBzZWVrcyB0aGUgdGltZWxpbmUgd2hlbiByZW5kZXJpbmcsIGxpa2UgaW5zaWRlIG9mIGFuIG9uVXBkYXRlL29uQ29tcGxldGVcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHdlZW4uX2FjdGl2ZSB8fCAodHdlZW4uX3N0YXJ0VGltZSA8PSBwcmV2VGltZSAmJiAhdHdlZW4uX3BhdXNlZCAmJiAhdHdlZW4uX2djKSkge1xuXHRcdFx0XHRcdFx0aWYgKHBhdXNlVHdlZW4gPT09IHR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRcdHBhdXNlVHdlZW4gPSB0d2Vlbi5fcHJldjsgLy90aGUgbGlua2VkIGxpc3QgaXMgb3JnYW5pemVkIGJ5IF9zdGFydFRpbWUsIHRodXMgaXQncyBwb3NzaWJsZSB0aGF0IGEgdHdlZW4gY291bGQgc3RhcnQgQkVGT1JFIHRoZSBwYXVzZSBhbmQgZW5kIGFmdGVyIGl0LCBpbiB3aGljaCBjYXNlIGl0IHdvdWxkIGJlIHBvc2l0aW9uZWQgYmVmb3JlIHRoZSBwYXVzZSB0d2VlbiBpbiB0aGUgbGlua2VkIGxpc3QsIGJ1dCB3ZSBzaG91bGQgcmVuZGVyIGl0IGJlZm9yZSB3ZSBwYXVzZSgpIHRoZSB0aW1lbGluZSBhbmQgY2Vhc2UgcmVuZGVyaW5nLiBUaGlzIGlzIG9ubHkgYSBjb25jZXJuIHdoZW4gZ29pbmcgaW4gcmV2ZXJzZS5cblx0XHRcdFx0XHRcdFx0d2hpbGUgKHBhdXNlVHdlZW4gJiYgcGF1c2VUd2Vlbi5lbmRUaW1lKCkgPiB0aGlzLl90aW1lKSB7XG5cdFx0XHRcdFx0XHRcdFx0cGF1c2VUd2Vlbi5yZW5kZXIoIChwYXVzZVR3ZWVuLl9yZXZlcnNlZCA/IHBhdXNlVHdlZW4udG90YWxEdXJhdGlvbigpIC0gKCh0aW1lIC0gcGF1c2VUd2Vlbi5fc3RhcnRUaW1lKSAqIHBhdXNlVHdlZW4uX3RpbWVTY2FsZSkgOiAodGltZSAtIHBhdXNlVHdlZW4uX3N0YXJ0VGltZSkgKiBwYXVzZVR3ZWVuLl90aW1lU2NhbGUpLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdFx0XHRcdHBhdXNlVHdlZW4gPSBwYXVzZVR3ZWVuLl9wcmV2O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHBhdXNlVHdlZW4gPSBudWxsO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIXR3ZWVuLl9yZXZlcnNlZCkge1xuXHRcdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIoKHRpbWUgLSB0d2Vlbi5fc3RhcnRUaW1lKSAqIHR3ZWVuLl90aW1lU2NhbGUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIoKCghdHdlZW4uX2RpcnR5KSA/IHR3ZWVuLl90b3RhbER1cmF0aW9uIDogdHdlZW4udG90YWxEdXJhdGlvbigpKSAtICgodGltZSAtIHR3ZWVuLl9zdGFydFRpbWUpICogdHdlZW4uX3RpbWVTY2FsZSksIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHR3ZWVuID0gbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fb25VcGRhdGUpIGlmICghc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdFx0aWYgKF9sYXp5VHdlZW5zLmxlbmd0aCkgeyAvL2luIGNhc2UgcmVuZGVyaW5nIGNhdXNlZCBhbnkgdHdlZW5zIHRvIGxhenktaW5pdCwgd2Ugc2hvdWxkIHJlbmRlciB0aGVtIGJlY2F1c2UgdHlwaWNhbGx5IHdoZW4gYSB0aW1lbGluZSBmaW5pc2hlcywgdXNlcnMgZXhwZWN0IHRoaW5ncyB0byBoYXZlIHJlbmRlcmVkIGZ1bGx5LiBJbWFnaW5lIGFuIG9uVXBkYXRlIG9uIGEgdGltZWxpbmUgdGhhdCByZXBvcnRzL2NoZWNrcyB0d2VlbmVkIHZhbHVlcy5cblx0XHRcdFx0XHRfbGF6eVJlbmRlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2NhbGxiYWNrKFwib25VcGRhdGVcIik7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2FsbGJhY2spIGlmICghdGhpcy5fbG9ja2VkKSBpZiAoIXRoaXMuX2djKSBpZiAocHJldlN0YXJ0ID09PSB0aGlzLl9zdGFydFRpbWUgfHwgcHJldlRpbWVTY2FsZSAhPT0gdGhpcy5fdGltZVNjYWxlKSBpZiAodGhpcy5fdGltZSA9PT0gMCB8fCB0b3RhbER1ciA+PSB0aGlzLnRvdGFsRHVyYXRpb24oKSkgeyAvL2lmIG9uZSBvZiB0aGUgdHdlZW5zIHRoYXQgd2FzIHJlbmRlcmVkIGFsdGVyZWQgdGhpcyB0aW1lbGluZSdzIHN0YXJ0VGltZSAobGlrZSBpZiBhbiBvbkNvbXBsZXRlIHJldmVyc2VkIHRoZSB0aW1lbGluZSksIGl0IHByb2JhYmx5IGlzbid0IGNvbXBsZXRlLiBJZiBpdCBpcywgZG9uJ3Qgd29ycnksIGJlY2F1c2Ugd2hhdGV2ZXIgY2FsbCBhbHRlcmVkIHRoZSBzdGFydFRpbWUgd291bGQgY29tcGxldGUgaWYgaXQgd2FzIG5lY2Vzc2FyeSBhdCB0aGUgbmV3IHRpbWUuIFRoZSBvbmx5IGV4Y2VwdGlvbiBpcyB0aGUgdGltZVNjYWxlIHByb3BlcnR5LiBBbHNvIGNoZWNrIF9nYyBiZWNhdXNlIHRoZXJlJ3MgYSBjaGFuY2UgdGhhdCBraWxsKCkgY291bGQgYmUgY2FsbGVkIGluIGFuIG9uVXBkYXRlXG5cdFx0XHRcdGlmIChpc0NvbXBsZXRlKSB7XG5cdFx0XHRcdFx0aWYgKF9sYXp5VHdlZW5zLmxlbmd0aCkgeyAvL2luIGNhc2UgcmVuZGVyaW5nIGNhdXNlZCBhbnkgdHdlZW5zIHRvIGxhenktaW5pdCwgd2Ugc2hvdWxkIHJlbmRlciB0aGVtIGJlY2F1c2UgdHlwaWNhbGx5IHdoZW4gYSB0aW1lbGluZSBmaW5pc2hlcywgdXNlcnMgZXhwZWN0IHRoaW5ncyB0byBoYXZlIHJlbmRlcmVkIGZ1bGx5LiBJbWFnaW5lIGFuIG9uQ29tcGxldGUgb24gYSB0aW1lbGluZSB0aGF0IHJlcG9ydHMvY2hlY2tzIHR3ZWVuZWQgdmFsdWVzLlxuXHRcdFx0XHRcdFx0X2xhenlSZW5kZXIoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0dGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9hY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXN1cHByZXNzRXZlbnRzICYmIHRoaXMudmFyc1tjYWxsYmFja10pIHtcblx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhjYWxsYmFjayk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cC5nZXRBY3RpdmUgPSBmdW5jdGlvbihuZXN0ZWQsIHR3ZWVucywgdGltZWxpbmVzKSB7XG5cdFx0XHRpZiAobmVzdGVkID09IG51bGwpIHtcblx0XHRcdFx0bmVzdGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmICh0d2VlbnMgPT0gbnVsbCkge1xuXHRcdFx0XHR0d2VlbnMgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRpbWVsaW5lcyA9PSBudWxsKSB7XG5cdFx0XHRcdHRpbWVsaW5lcyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGEgPSBbXSxcblx0XHRcdFx0YWxsID0gdGhpcy5nZXRDaGlsZHJlbihuZXN0ZWQsIHR3ZWVucywgdGltZWxpbmVzKSxcblx0XHRcdFx0Y250ID0gMCxcblx0XHRcdFx0bCA9IGFsbC5sZW5ndGgsXG5cdFx0XHRcdGksIHR3ZWVuO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHR0d2VlbiA9IGFsbFtpXTtcblx0XHRcdFx0aWYgKHR3ZWVuLmlzQWN0aXZlKCkpIHtcblx0XHRcdFx0XHRhW2NudCsrXSA9IHR3ZWVuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYTtcblx0XHR9O1xuXG5cblx0XHRwLmdldExhYmVsQWZ0ZXIgPSBmdW5jdGlvbih0aW1lKSB7XG5cdFx0XHRpZiAoIXRpbWUpIGlmICh0aW1lICE9PSAwKSB7IC8vZmFzdGVyIHRoYW4gaXNOYW4oKVxuXHRcdFx0XHR0aW1lID0gdGhpcy5fdGltZTtcblx0XHRcdH1cblx0XHRcdHZhciBsYWJlbHMgPSB0aGlzLmdldExhYmVsc0FycmF5KCksXG5cdFx0XHRcdGwgPSBsYWJlbHMubGVuZ3RoLFxuXHRcdFx0XHRpO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRpZiAobGFiZWxzW2ldLnRpbWUgPiB0aW1lKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGxhYmVsc1tpXS5uYW1lO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9O1xuXG5cdFx0cC5nZXRMYWJlbEJlZm9yZSA9IGZ1bmN0aW9uKHRpbWUpIHtcblx0XHRcdGlmICh0aW1lID09IG51bGwpIHtcblx0XHRcdFx0dGltZSA9IHRoaXMuX3RpbWU7XG5cdFx0XHR9XG5cdFx0XHR2YXIgbGFiZWxzID0gdGhpcy5nZXRMYWJlbHNBcnJheSgpLFxuXHRcdFx0XHRpID0gbGFiZWxzLmxlbmd0aDtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRpZiAobGFiZWxzW2ldLnRpbWUgPCB0aW1lKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGxhYmVsc1tpXS5uYW1lO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9O1xuXG5cdFx0cC5nZXRMYWJlbHNBcnJheSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGEgPSBbXSxcblx0XHRcdFx0Y250ID0gMCxcblx0XHRcdFx0cDtcblx0XHRcdGZvciAocCBpbiB0aGlzLl9sYWJlbHMpIHtcblx0XHRcdFx0YVtjbnQrK10gPSB7dGltZTp0aGlzLl9sYWJlbHNbcF0sIG5hbWU6cH07XG5cdFx0XHR9XG5cdFx0XHRhLnNvcnQoZnVuY3Rpb24oYSxiKSB7XG5cdFx0XHRcdHJldHVybiBhLnRpbWUgLSBiLnRpbWU7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBhO1xuXHRcdH07XG5cblxuLy8tLS0tIEdFVFRFUlMgLyBTRVRURVJTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdHAucHJvZ3Jlc3MgPSBmdW5jdGlvbih2YWx1ZSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdHJldHVybiAoIWFyZ3VtZW50cy5sZW5ndGgpID8gdGhpcy5fdGltZSAvIHRoaXMuZHVyYXRpb24oKSA6IHRoaXMudG90YWxUaW1lKCB0aGlzLmR1cmF0aW9uKCkgKiAoKHRoaXMuX3lveW8gJiYgKHRoaXMuX2N5Y2xlICYgMSkgIT09IDApID8gMSAtIHZhbHVlIDogdmFsdWUpICsgKHRoaXMuX2N5Y2xlICogKHRoaXMuX2R1cmF0aW9uICsgdGhpcy5fcmVwZWF0RGVsYXkpKSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLnRvdGFsUHJvZ3Jlc3MgPSBmdW5jdGlvbih2YWx1ZSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdHJldHVybiAoIWFyZ3VtZW50cy5sZW5ndGgpID8gdGhpcy5fdG90YWxUaW1lIC8gdGhpcy50b3RhbER1cmF0aW9uKCkgOiB0aGlzLnRvdGFsVGltZSggdGhpcy50b3RhbER1cmF0aW9uKCkgKiB2YWx1ZSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLnRvdGFsRHVyYXRpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9kaXJ0eSkge1xuXHRcdFx0XHRcdFRpbWVsaW5lTGl0ZS5wcm90b3R5cGUudG90YWxEdXJhdGlvbi5jYWxsKHRoaXMpOyAvL2p1c3QgZm9yY2VzIHJlZnJlc2hcblx0XHRcdFx0XHQvL0luc3RlYWQgb2YgSW5maW5pdHksIHdlIHVzZSA5OTk5OTk5OTk5OTkgc28gdGhhdCB3ZSBjYW4gYWNjb21tb2RhdGUgcmV2ZXJzZXMuXG5cdFx0XHRcdFx0dGhpcy5fdG90YWxEdXJhdGlvbiA9ICh0aGlzLl9yZXBlYXQgPT09IC0xKSA/IDk5OTk5OTk5OTk5OSA6IHRoaXMuX2R1cmF0aW9uICogKHRoaXMuX3JlcGVhdCArIDEpICsgKHRoaXMuX3JlcGVhdERlbGF5ICogdGhpcy5fcmVwZWF0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fdG90YWxEdXJhdGlvbjtcblx0XHRcdH1cblx0XHRcdHJldHVybiAodGhpcy5fcmVwZWF0ID09PSAtMSB8fCAhdmFsdWUpID8gdGhpcyA6IHRoaXMudGltZVNjYWxlKCB0aGlzLnRvdGFsRHVyYXRpb24oKSAvIHZhbHVlICk7XG5cdFx0fTtcblxuXHRcdHAudGltZSA9IGZ1bmN0aW9uKHZhbHVlLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl90aW1lO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuX2RpcnR5KSB7XG5cdFx0XHRcdHRoaXMudG90YWxEdXJhdGlvbigpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZhbHVlID4gdGhpcy5fZHVyYXRpb24pIHtcblx0XHRcdFx0dmFsdWUgPSB0aGlzLl9kdXJhdGlvbjtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl95b3lvICYmICh0aGlzLl9jeWNsZSAmIDEpICE9PSAwKSB7XG5cdFx0XHRcdHZhbHVlID0gKHRoaXMuX2R1cmF0aW9uIC0gdmFsdWUpICsgKHRoaXMuX2N5Y2xlICogKHRoaXMuX2R1cmF0aW9uICsgdGhpcy5fcmVwZWF0RGVsYXkpKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5fcmVwZWF0ICE9PSAwKSB7XG5cdFx0XHRcdHZhbHVlICs9IHRoaXMuX2N5Y2xlICogKHRoaXMuX2R1cmF0aW9uICsgdGhpcy5fcmVwZWF0RGVsYXkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMudG90YWxUaW1lKHZhbHVlLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0fTtcblxuXHRcdHAucmVwZWF0ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcmVwZWF0O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcmVwZWF0ID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHR9O1xuXG5cdFx0cC5yZXBlYXREZWxheSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3JlcGVhdERlbGF5O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcmVwZWF0RGVsYXkgPSB2YWx1ZTtcblx0XHRcdHJldHVybiB0aGlzLl91bmNhY2hlKHRydWUpO1xuXHRcdH07XG5cblx0XHRwLnlveW8gPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl95b3lvO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5feW95byA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuY3VycmVudExhYmVsID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRMYWJlbEJlZm9yZSh0aGlzLl90aW1lICsgMC4wMDAwMDAwMSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5zZWVrKHZhbHVlLCB0cnVlKTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIFRpbWVsaW5lTWF4O1xuXG5cdH0sIHRydWUpO1xuXHRcblxuXG5cblxuXHRcblx0XG5cdFxuXHRcblx0XG5cdFxuXHRcbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCZXppZXJQbHVnaW5cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHQoZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgX1JBRDJERUcgPSAxODAgLyBNYXRoLlBJLFxuXHRcdFx0X3IxID0gW10sXG5cdFx0XHRfcjIgPSBbXSxcblx0XHRcdF9yMyA9IFtdLFxuXHRcdFx0X2NvclByb3BzID0ge30sXG5cdFx0XHRfZ2xvYmFscyA9IF9nc1Njb3BlLl9nc0RlZmluZS5nbG9iYWxzLFxuXHRcdFx0U2VnbWVudCA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQpIHtcblx0XHRcdFx0aWYgKGMgPT09IGQpIHsgLy9pZiBjIGFuZCBkIG1hdGNoLCB0aGUgZmluYWwgYXV0b1JvdGF0ZSB2YWx1ZSBjb3VsZCBsb2NrIGF0IC05MCBkZWdyZWVzLCBzbyBkaWZmZXJlbnRpYXRlIHRoZW0gc2xpZ2h0bHkuXG5cdFx0XHRcdFx0YyA9IGQgLSAoZCAtIGIpIC8gMTAwMDAwMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoYSA9PT0gYikgeyAvL2lmIGEgYW5kIGIgbWF0Y2gsIHRoZSBzdGFydGluZyBhdXRvUm90YXRlIHZhbHVlIGNvdWxkIGxvY2sgYXQgLTkwIGRlZ3JlZXMsIHNvIGRpZmZlcmVudGlhdGUgdGhlbSBzbGlnaHRseS5cblx0XHRcdFx0XHRiID0gYSArIChjIC0gYSkgLyAxMDAwMDAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuYSA9IGE7XG5cdFx0XHRcdHRoaXMuYiA9IGI7XG5cdFx0XHRcdHRoaXMuYyA9IGM7XG5cdFx0XHRcdHRoaXMuZCA9IGQ7XG5cdFx0XHRcdHRoaXMuZGEgPSBkIC0gYTtcblx0XHRcdFx0dGhpcy5jYSA9IGMgLSBhO1xuXHRcdFx0XHR0aGlzLmJhID0gYiAtIGE7XG5cdFx0XHR9LFxuXHRcdFx0X2NvcnJlbGF0ZSA9IFwiLHgseSx6LGxlZnQsdG9wLHJpZ2h0LGJvdHRvbSxtYXJnaW5Ub3AsbWFyZ2luTGVmdCxtYXJnaW5SaWdodCxtYXJnaW5Cb3R0b20scGFkZGluZ0xlZnQscGFkZGluZ1RvcCxwYWRkaW5nUmlnaHQscGFkZGluZ0JvdHRvbSxiYWNrZ3JvdW5kUG9zaXRpb24sYmFja2dyb3VuZFBvc2l0aW9uX3ksXCIsXG5cdFx0XHRjdWJpY1RvUXVhZHJhdGljID0gZnVuY3Rpb24oYSwgYiwgYywgZCkge1xuXHRcdFx0XHR2YXIgcTEgPSB7YTphfSxcblx0XHRcdFx0XHRxMiA9IHt9LFxuXHRcdFx0XHRcdHEzID0ge30sXG5cdFx0XHRcdFx0cTQgPSB7YzpkfSxcblx0XHRcdFx0XHRtYWIgPSAoYSArIGIpIC8gMixcblx0XHRcdFx0XHRtYmMgPSAoYiArIGMpIC8gMixcblx0XHRcdFx0XHRtY2QgPSAoYyArIGQpIC8gMixcblx0XHRcdFx0XHRtYWJjID0gKG1hYiArIG1iYykgLyAyLFxuXHRcdFx0XHRcdG1iY2QgPSAobWJjICsgbWNkKSAvIDIsXG5cdFx0XHRcdFx0bTggPSAobWJjZCAtIG1hYmMpIC8gODtcblx0XHRcdFx0cTEuYiA9IG1hYiArIChhIC0gbWFiKSAvIDQ7XG5cdFx0XHRcdHEyLmIgPSBtYWJjICsgbTg7XG5cdFx0XHRcdHExLmMgPSBxMi5hID0gKHExLmIgKyBxMi5iKSAvIDI7XG5cdFx0XHRcdHEyLmMgPSBxMy5hID0gKG1hYmMgKyBtYmNkKSAvIDI7XG5cdFx0XHRcdHEzLmIgPSBtYmNkIC0gbTg7XG5cdFx0XHRcdHE0LmIgPSBtY2QgKyAoZCAtIG1jZCkgLyA0O1xuXHRcdFx0XHRxMy5jID0gcTQuYSA9IChxMy5iICsgcTQuYikgLyAyO1xuXHRcdFx0XHRyZXR1cm4gW3ExLCBxMiwgcTMsIHE0XTtcblx0XHRcdH0sXG5cdFx0XHRfY2FsY3VsYXRlQ29udHJvbFBvaW50cyA9IGZ1bmN0aW9uKGEsIGN1cnZpbmVzcywgcXVhZCwgYmFzaWMsIGNvcnJlbGF0ZSkge1xuXHRcdFx0XHR2YXIgbCA9IGEubGVuZ3RoIC0gMSxcblx0XHRcdFx0XHRpaSA9IDAsXG5cdFx0XHRcdFx0Y3AxID0gYVswXS5hLFxuXHRcdFx0XHRcdGksIHAxLCBwMiwgcDMsIHNlZywgbTEsIG0yLCBtbSwgY3AyLCBxYiwgcjEsIHIyLCB0bDtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdHNlZyA9IGFbaWldO1xuXHRcdFx0XHRcdHAxID0gc2VnLmE7XG5cdFx0XHRcdFx0cDIgPSBzZWcuZDtcblx0XHRcdFx0XHRwMyA9IGFbaWkrMV0uZDtcblxuXHRcdFx0XHRcdGlmIChjb3JyZWxhdGUpIHtcblx0XHRcdFx0XHRcdHIxID0gX3IxW2ldO1xuXHRcdFx0XHRcdFx0cjIgPSBfcjJbaV07XG5cdFx0XHRcdFx0XHR0bCA9ICgocjIgKyByMSkgKiBjdXJ2aW5lc3MgKiAwLjI1KSAvIChiYXNpYyA/IDAuNSA6IF9yM1tpXSB8fCAwLjUpO1xuXHRcdFx0XHRcdFx0bTEgPSBwMiAtIChwMiAtIHAxKSAqIChiYXNpYyA/IGN1cnZpbmVzcyAqIDAuNSA6IChyMSAhPT0gMCA/IHRsIC8gcjEgOiAwKSk7XG5cdFx0XHRcdFx0XHRtMiA9IHAyICsgKHAzIC0gcDIpICogKGJhc2ljID8gY3VydmluZXNzICogMC41IDogKHIyICE9PSAwID8gdGwgLyByMiA6IDApKTtcblx0XHRcdFx0XHRcdG1tID0gcDIgLSAobTEgKyAoKChtMiAtIG0xKSAqICgocjEgKiAzIC8gKHIxICsgcjIpKSArIDAuNSkgLyA0KSB8fCAwKSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG0xID0gcDIgLSAocDIgLSBwMSkgKiBjdXJ2aW5lc3MgKiAwLjU7XG5cdFx0XHRcdFx0XHRtMiA9IHAyICsgKHAzIC0gcDIpICogY3VydmluZXNzICogMC41O1xuXHRcdFx0XHRcdFx0bW0gPSBwMiAtIChtMSArIG0yKSAvIDI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG0xICs9IG1tO1xuXHRcdFx0XHRcdG0yICs9IG1tO1xuXG5cdFx0XHRcdFx0c2VnLmMgPSBjcDIgPSBtMTtcblx0XHRcdFx0XHRpZiAoaSAhPT0gMCkge1xuXHRcdFx0XHRcdFx0c2VnLmIgPSBjcDE7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNlZy5iID0gY3AxID0gc2VnLmEgKyAoc2VnLmMgLSBzZWcuYSkgKiAwLjY7IC8vaW5zdGVhZCBvZiBwbGFjaW5nIGIgb24gYSBleGFjdGx5LCB3ZSBtb3ZlIGl0IGlubGluZSB3aXRoIGMgc28gdGhhdCBpZiB0aGUgdXNlciBzcGVjaWZpZXMgYW4gZWFzZSBsaWtlIEJhY2suZWFzZUluIG9yIEVsYXN0aWMuZWFzZUluIHdoaWNoIGdvZXMgQkVZT05EIHRoZSBiZWdpbm5pbmcsIGl0IHdpbGwgZG8gc28gc21vb3RobHkuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0c2VnLmRhID0gcDIgLSBwMTtcblx0XHRcdFx0XHRzZWcuY2EgPSBjcDIgLSBwMTtcblx0XHRcdFx0XHRzZWcuYmEgPSBjcDEgLSBwMTtcblxuXHRcdFx0XHRcdGlmIChxdWFkKSB7XG5cdFx0XHRcdFx0XHRxYiA9IGN1YmljVG9RdWFkcmF0aWMocDEsIGNwMSwgY3AyLCBwMik7XG5cdFx0XHRcdFx0XHRhLnNwbGljZShpaSwgMSwgcWJbMF0sIHFiWzFdLCBxYlsyXSwgcWJbM10pO1xuXHRcdFx0XHRcdFx0aWkgKz0gNDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWkrKztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjcDEgPSBtMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRzZWcgPSBhW2lpXTtcblx0XHRcdFx0c2VnLmIgPSBjcDE7XG5cdFx0XHRcdHNlZy5jID0gY3AxICsgKHNlZy5kIC0gY3AxKSAqIDAuNDsgLy9pbnN0ZWFkIG9mIHBsYWNpbmcgYyBvbiBkIGV4YWN0bHksIHdlIG1vdmUgaXQgaW5saW5lIHdpdGggYiBzbyB0aGF0IGlmIHRoZSB1c2VyIHNwZWNpZmllcyBhbiBlYXNlIGxpa2UgQmFjay5lYXNlT3V0IG9yIEVsYXN0aWMuZWFzZU91dCB3aGljaCBnb2VzIEJFWU9ORCB0aGUgZW5kLCBpdCB3aWxsIGRvIHNvIHNtb290aGx5LlxuXHRcdFx0XHRzZWcuZGEgPSBzZWcuZCAtIHNlZy5hO1xuXHRcdFx0XHRzZWcuY2EgPSBzZWcuYyAtIHNlZy5hO1xuXHRcdFx0XHRzZWcuYmEgPSBjcDEgLSBzZWcuYTtcblx0XHRcdFx0aWYgKHF1YWQpIHtcblx0XHRcdFx0XHRxYiA9IGN1YmljVG9RdWFkcmF0aWMoc2VnLmEsIGNwMSwgc2VnLmMsIHNlZy5kKTtcblx0XHRcdFx0XHRhLnNwbGljZShpaSwgMSwgcWJbMF0sIHFiWzFdLCBxYlsyXSwgcWJbM10pO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0X3BhcnNlQW5jaG9ycyA9IGZ1bmN0aW9uKHZhbHVlcywgcCwgY29ycmVsYXRlLCBwcmVwZW5kKSB7XG5cdFx0XHRcdHZhciBhID0gW10sXG5cdFx0XHRcdFx0bCwgaSwgcDEsIHAyLCBwMywgdG1wO1xuXHRcdFx0XHRpZiAocHJlcGVuZCkge1xuXHRcdFx0XHRcdHZhbHVlcyA9IFtwcmVwZW5kXS5jb25jYXQodmFsdWVzKTtcblx0XHRcdFx0XHRpID0gdmFsdWVzLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YoICh0bXAgPSB2YWx1ZXNbaV1bcF0pICkgPT09IFwic3RyaW5nXCIpIGlmICh0bXAuY2hhckF0KDEpID09PSBcIj1cIikge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZXNbaV1bcF0gPSBwcmVwZW5kW3BdICsgTnVtYmVyKHRtcC5jaGFyQXQoMCkgKyB0bXAuc3Vic3RyKDIpKTsgLy9hY2NvbW1vZGF0ZSByZWxhdGl2ZSB2YWx1ZXMuIERvIGl0IGlubGluZSBpbnN0ZWFkIG9mIGJyZWFraW5nIGl0IG91dCBpbnRvIGEgZnVuY3Rpb24gZm9yIHNwZWVkIHJlYXNvbnNcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0bCA9IHZhbHVlcy5sZW5ndGggLSAyO1xuXHRcdFx0XHRpZiAobCA8IDApIHtcblx0XHRcdFx0XHRhWzBdID0gbmV3IFNlZ21lbnQodmFsdWVzWzBdW3BdLCAwLCAwLCB2YWx1ZXNbKGwgPCAtMSkgPyAwIDogMV1bcF0pO1xuXHRcdFx0XHRcdHJldHVybiBhO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRwMSA9IHZhbHVlc1tpXVtwXTtcblx0XHRcdFx0XHRwMiA9IHZhbHVlc1tpKzFdW3BdO1xuXHRcdFx0XHRcdGFbaV0gPSBuZXcgU2VnbWVudChwMSwgMCwgMCwgcDIpO1xuXHRcdFx0XHRcdGlmIChjb3JyZWxhdGUpIHtcblx0XHRcdFx0XHRcdHAzID0gdmFsdWVzW2krMl1bcF07XG5cdFx0XHRcdFx0XHRfcjFbaV0gPSAoX3IxW2ldIHx8IDApICsgKHAyIC0gcDEpICogKHAyIC0gcDEpO1xuXHRcdFx0XHRcdFx0X3IyW2ldID0gKF9yMltpXSB8fCAwKSArIChwMyAtIHAyKSAqIChwMyAtIHAyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0YVtpXSA9IG5ldyBTZWdtZW50KHZhbHVlc1tpXVtwXSwgMCwgMCwgdmFsdWVzW2krMV1bcF0pO1xuXHRcdFx0XHRyZXR1cm4gYTtcblx0XHRcdH0sXG5cdFx0XHRiZXppZXJUaHJvdWdoID0gZnVuY3Rpb24odmFsdWVzLCBjdXJ2aW5lc3MsIHF1YWRyYXRpYywgYmFzaWMsIGNvcnJlbGF0ZSwgcHJlcGVuZCkge1xuXHRcdFx0XHR2YXIgb2JqID0ge30sXG5cdFx0XHRcdFx0cHJvcHMgPSBbXSxcblx0XHRcdFx0XHRmaXJzdCA9IHByZXBlbmQgfHwgdmFsdWVzWzBdLFxuXHRcdFx0XHRcdGksIHAsIGEsIGosIHIsIGwsIHNlYW1sZXNzLCBsYXN0O1xuXHRcdFx0XHRjb3JyZWxhdGUgPSAodHlwZW9mKGNvcnJlbGF0ZSkgPT09IFwic3RyaW5nXCIpID8gXCIsXCIrY29ycmVsYXRlK1wiLFwiIDogX2NvcnJlbGF0ZTtcblx0XHRcdFx0aWYgKGN1cnZpbmVzcyA9PSBudWxsKSB7XG5cdFx0XHRcdFx0Y3VydmluZXNzID0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKHAgaW4gdmFsdWVzWzBdKSB7XG5cdFx0XHRcdFx0cHJvcHMucHVzaChwKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL2NoZWNrIHRvIHNlZSBpZiB0aGUgbGFzdCBhbmQgZmlyc3QgdmFsdWVzIGFyZSBpZGVudGljYWwgKHdlbGwsIHdpdGhpbiAwLjA1KS4gSWYgc28sIG1ha2Ugc2VhbWxlc3MgYnkgYXBwZW5kaW5nIHRoZSBzZWNvbmQgZWxlbWVudCB0byB0aGUgdmVyeSBlbmQgb2YgdGhlIHZhbHVlcyBhcnJheSBhbmQgdGhlIDJuZC10by1sYXN0IGVsZW1lbnQgdG8gdGhlIHZlcnkgYmVnaW5uaW5nICh3ZSdsbCByZW1vdmUgdGhvc2Ugc2VnbWVudHMgbGF0ZXIpXG5cdFx0XHRcdGlmICh2YWx1ZXMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdGxhc3QgPSB2YWx1ZXNbdmFsdWVzLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRcdHNlYW1sZXNzID0gdHJ1ZTtcblx0XHRcdFx0XHRpID0gcHJvcHMubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0cCA9IHByb3BzW2ldO1xuXHRcdFx0XHRcdFx0aWYgKE1hdGguYWJzKGZpcnN0W3BdIC0gbGFzdFtwXSkgPiAwLjA1KSB7IC8vYnVpbGQgaW4gYSB0b2xlcmFuY2Ugb2YgKy8tMC4wNSB0byBhY2NvbW1vZGF0ZSByb3VuZGluZyBlcnJvcnMuXG5cdFx0XHRcdFx0XHRcdHNlYW1sZXNzID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoc2VhbWxlc3MpIHtcblx0XHRcdFx0XHRcdHZhbHVlcyA9IHZhbHVlcy5jb25jYXQoKTsgLy9kdXBsaWNhdGUgdGhlIGFycmF5IHRvIGF2b2lkIGNvbnRhbWluYXRpbmcgdGhlIG9yaWdpbmFsIHdoaWNoIHRoZSB1c2VyIG1heSBiZSByZXVzaW5nIGZvciBvdGhlciB0d2VlbnNcblx0XHRcdFx0XHRcdGlmIChwcmVwZW5kKSB7XG5cdFx0XHRcdFx0XHRcdHZhbHVlcy51bnNoaWZ0KHByZXBlbmQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dmFsdWVzLnB1c2godmFsdWVzWzFdKTtcblx0XHRcdFx0XHRcdHByZXBlbmQgPSB2YWx1ZXNbdmFsdWVzLmxlbmd0aCAtIDNdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRfcjEubGVuZ3RoID0gX3IyLmxlbmd0aCA9IF9yMy5sZW5ndGggPSAwO1xuXHRcdFx0XHRpID0gcHJvcHMubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRwID0gcHJvcHNbaV07XG5cdFx0XHRcdFx0X2NvclByb3BzW3BdID0gKGNvcnJlbGF0ZS5pbmRleE9mKFwiLFwiK3ArXCIsXCIpICE9PSAtMSk7XG5cdFx0XHRcdFx0b2JqW3BdID0gX3BhcnNlQW5jaG9ycyh2YWx1ZXMsIHAsIF9jb3JQcm9wc1twXSwgcHJlcGVuZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aSA9IF9yMS5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdF9yMVtpXSA9IE1hdGguc3FydChfcjFbaV0pO1xuXHRcdFx0XHRcdF9yMltpXSA9IE1hdGguc3FydChfcjJbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghYmFzaWMpIHtcblx0XHRcdFx0XHRpID0gcHJvcHMubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0aWYgKF9jb3JQcm9wc1twXSkge1xuXHRcdFx0XHRcdFx0XHRhID0gb2JqW3Byb3BzW2ldXTtcblx0XHRcdFx0XHRcdFx0bCA9IGEubGVuZ3RoIC0gMTtcblx0XHRcdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IGw7IGorKykge1xuXHRcdFx0XHRcdFx0XHRcdHIgPSAoYVtqKzFdLmRhIC8gX3IyW2pdICsgYVtqXS5kYSAvIF9yMVtqXSkgfHwgMDtcblx0XHRcdFx0XHRcdFx0XHRfcjNbal0gPSAoX3IzW2pdIHx8IDApICsgciAqIHI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aSA9IF9yMy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRfcjNbaV0gPSBNYXRoLnNxcnQoX3IzW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aSA9IHByb3BzLmxlbmd0aDtcblx0XHRcdFx0aiA9IHF1YWRyYXRpYyA/IDQgOiAxO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRwID0gcHJvcHNbaV07XG5cdFx0XHRcdFx0YSA9IG9ialtwXTtcblx0XHRcdFx0XHRfY2FsY3VsYXRlQ29udHJvbFBvaW50cyhhLCBjdXJ2aW5lc3MsIHF1YWRyYXRpYywgYmFzaWMsIF9jb3JQcm9wc1twXSk7IC8vdGhpcyBtZXRob2QgcmVxdWlyZXMgdGhhdCBfcGFyc2VBbmNob3JzKCkgYW5kIF9zZXRTZWdtZW50UmF0aW9zKCkgcmFuIGZpcnN0IHNvIHRoYXQgX3IxLCBfcjIsIGFuZCBfcjMgdmFsdWVzIGFyZSBwb3B1bGF0ZWQgZm9yIGFsbCBwcm9wZXJ0aWVzXG5cdFx0XHRcdFx0aWYgKHNlYW1sZXNzKSB7XG5cdFx0XHRcdFx0XHRhLnNwbGljZSgwLCBqKTtcblx0XHRcdFx0XHRcdGEuc3BsaWNlKGEubGVuZ3RoIC0gaiwgaik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBvYmo7XG5cdFx0XHR9LFxuXHRcdFx0X3BhcnNlQmV6aWVyRGF0YSA9IGZ1bmN0aW9uKHZhbHVlcywgdHlwZSwgcHJlcGVuZCkge1xuXHRcdFx0XHR0eXBlID0gdHlwZSB8fCBcInNvZnRcIjtcblx0XHRcdFx0dmFyIG9iaiA9IHt9LFxuXHRcdFx0XHRcdGluYyA9ICh0eXBlID09PSBcImN1YmljXCIpID8gMyA6IDIsXG5cdFx0XHRcdFx0c29mdCA9ICh0eXBlID09PSBcInNvZnRcIiksXG5cdFx0XHRcdFx0cHJvcHMgPSBbXSxcblx0XHRcdFx0XHRhLCBiLCBjLCBkLCBjdXIsIGksIGosIGwsIHAsIGNudCwgdG1wO1xuXHRcdFx0XHRpZiAoc29mdCAmJiBwcmVwZW5kKSB7XG5cdFx0XHRcdFx0dmFsdWVzID0gW3ByZXBlbmRdLmNvbmNhdCh2YWx1ZXMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2YWx1ZXMgPT0gbnVsbCB8fCB2YWx1ZXMubGVuZ3RoIDwgaW5jICsgMSkgeyB0aHJvdyBcImludmFsaWQgQmV6aWVyIGRhdGFcIjsgfVxuXHRcdFx0XHRmb3IgKHAgaW4gdmFsdWVzWzBdKSB7XG5cdFx0XHRcdFx0cHJvcHMucHVzaChwKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpID0gcHJvcHMubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRwID0gcHJvcHNbaV07XG5cdFx0XHRcdFx0b2JqW3BdID0gY3VyID0gW107XG5cdFx0XHRcdFx0Y250ID0gMDtcblx0XHRcdFx0XHRsID0gdmFsdWVzLmxlbmd0aDtcblx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbDsgaisrKSB7XG5cdFx0XHRcdFx0XHRhID0gKHByZXBlbmQgPT0gbnVsbCkgPyB2YWx1ZXNbal1bcF0gOiAodHlwZW9mKCAodG1wID0gdmFsdWVzW2pdW3BdKSApID09PSBcInN0cmluZ1wiICYmIHRtcC5jaGFyQXQoMSkgPT09IFwiPVwiKSA/IHByZXBlbmRbcF0gKyBOdW1iZXIodG1wLmNoYXJBdCgwKSArIHRtcC5zdWJzdHIoMikpIDogTnVtYmVyKHRtcCk7XG5cdFx0XHRcdFx0XHRpZiAoc29mdCkgaWYgKGogPiAxKSBpZiAoaiA8IGwgLSAxKSB7XG5cdFx0XHRcdFx0XHRcdGN1cltjbnQrK10gPSAoYSArIGN1cltjbnQtMl0pIC8gMjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGN1cltjbnQrK10gPSBhO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsID0gY250IC0gaW5jICsgMTtcblx0XHRcdFx0XHRjbnQgPSAwO1xuXHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCBsOyBqICs9IGluYykge1xuXHRcdFx0XHRcdFx0YSA9IGN1cltqXTtcblx0XHRcdFx0XHRcdGIgPSBjdXJbaisxXTtcblx0XHRcdFx0XHRcdGMgPSBjdXJbaisyXTtcblx0XHRcdFx0XHRcdGQgPSAoaW5jID09PSAyKSA/IDAgOiBjdXJbaiszXTtcblx0XHRcdFx0XHRcdGN1cltjbnQrK10gPSB0bXAgPSAoaW5jID09PSAzKSA/IG5ldyBTZWdtZW50KGEsIGIsIGMsIGQpIDogbmV3IFNlZ21lbnQoYSwgKDIgKiBiICsgYSkgLyAzLCAoMiAqIGIgKyBjKSAvIDMsIGMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjdXIubGVuZ3RoID0gY250O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBvYmo7XG5cdFx0XHR9LFxuXHRcdFx0X2FkZEN1YmljTGVuZ3RocyA9IGZ1bmN0aW9uKGEsIHN0ZXBzLCByZXNvbHV0aW9uKSB7XG5cdFx0XHRcdHZhciBpbmMgPSAxIC8gcmVzb2x1dGlvbixcblx0XHRcdFx0XHRqID0gYS5sZW5ndGgsXG5cdFx0XHRcdFx0ZCwgZDEsIHMsIGRhLCBjYSwgYmEsIHAsIGksIGludiwgYmV6LCBpbmRleDtcblx0XHRcdFx0d2hpbGUgKC0taiA+IC0xKSB7XG5cdFx0XHRcdFx0YmV6ID0gYVtqXTtcblx0XHRcdFx0XHRzID0gYmV6LmE7XG5cdFx0XHRcdFx0ZGEgPSBiZXouZCAtIHM7XG5cdFx0XHRcdFx0Y2EgPSBiZXouYyAtIHM7XG5cdFx0XHRcdFx0YmEgPSBiZXouYiAtIHM7XG5cdFx0XHRcdFx0ZCA9IGQxID0gMDtcblx0XHRcdFx0XHRmb3IgKGkgPSAxOyBpIDw9IHJlc29sdXRpb247IGkrKykge1xuXHRcdFx0XHRcdFx0cCA9IGluYyAqIGk7XG5cdFx0XHRcdFx0XHRpbnYgPSAxIC0gcDtcblx0XHRcdFx0XHRcdGQgPSBkMSAtIChkMSA9IChwICogcCAqIGRhICsgMyAqIGludiAqIChwICogY2EgKyBpbnYgKiBiYSkpICogcCk7XG5cdFx0XHRcdFx0XHRpbmRleCA9IGogKiByZXNvbHV0aW9uICsgaSAtIDE7XG5cdFx0XHRcdFx0XHRzdGVwc1tpbmRleF0gPSAoc3RlcHNbaW5kZXhdIHx8IDApICsgZCAqIGQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0X3BhcnNlTGVuZ3RoRGF0YSA9IGZ1bmN0aW9uKG9iaiwgcmVzb2x1dGlvbikge1xuXHRcdFx0XHRyZXNvbHV0aW9uID0gcmVzb2x1dGlvbiA+PiAwIHx8IDY7XG5cdFx0XHRcdHZhciBhID0gW10sXG5cdFx0XHRcdFx0bGVuZ3RocyA9IFtdLFxuXHRcdFx0XHRcdGQgPSAwLFxuXHRcdFx0XHRcdHRvdGFsID0gMCxcblx0XHRcdFx0XHR0aHJlc2hvbGQgPSByZXNvbHV0aW9uIC0gMSxcblx0XHRcdFx0XHRzZWdtZW50cyA9IFtdLFxuXHRcdFx0XHRcdGN1ckxTID0gW10sIC8vY3VycmVudCBsZW5ndGggc2VnbWVudHMgYXJyYXlcblx0XHRcdFx0XHRwLCBpLCBsLCBpbmRleDtcblx0XHRcdFx0Zm9yIChwIGluIG9iaikge1xuXHRcdFx0XHRcdF9hZGRDdWJpY0xlbmd0aHMob2JqW3BdLCBhLCByZXNvbHV0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsID0gYS5sZW5ndGg7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRkICs9IE1hdGguc3FydChhW2ldKTtcblx0XHRcdFx0XHRpbmRleCA9IGkgJSByZXNvbHV0aW9uO1xuXHRcdFx0XHRcdGN1ckxTW2luZGV4XSA9IGQ7XG5cdFx0XHRcdFx0aWYgKGluZGV4ID09PSB0aHJlc2hvbGQpIHtcblx0XHRcdFx0XHRcdHRvdGFsICs9IGQ7XG5cdFx0XHRcdFx0XHRpbmRleCA9IChpIC8gcmVzb2x1dGlvbikgPj4gMDtcblx0XHRcdFx0XHRcdHNlZ21lbnRzW2luZGV4XSA9IGN1ckxTO1xuXHRcdFx0XHRcdFx0bGVuZ3Roc1tpbmRleF0gPSB0b3RhbDtcblx0XHRcdFx0XHRcdGQgPSAwO1xuXHRcdFx0XHRcdFx0Y3VyTFMgPSBbXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHtsZW5ndGg6dG90YWwsIGxlbmd0aHM6bGVuZ3Rocywgc2VnbWVudHM6c2VnbWVudHN9O1xuXHRcdFx0fSxcblxuXG5cblx0XHRcdEJlemllclBsdWdpbiA9IF9nc1Njb3BlLl9nc0RlZmluZS5wbHVnaW4oe1xuXHRcdFx0XHRcdHByb3BOYW1lOiBcImJlemllclwiLFxuXHRcdFx0XHRcdHByaW9yaXR5OiAtMSxcblx0XHRcdFx0XHR2ZXJzaW9uOiBcIjEuMy43XCIsXG5cdFx0XHRcdFx0QVBJOiAyLFxuXHRcdFx0XHRcdGdsb2JhbDp0cnVlLFxuXG5cdFx0XHRcdFx0Ly9nZXRzIGNhbGxlZCB3aGVuIHRoZSB0d2VlbiByZW5kZXJzIGZvciB0aGUgZmlyc3QgdGltZS4gVGhpcyBpcyB3aGVyZSBpbml0aWFsIHZhbHVlcyBzaG91bGQgYmUgcmVjb3JkZWQgYW5kIGFueSBzZXR1cCByb3V0aW5lcyBzaG91bGQgcnVuLlxuXHRcdFx0XHRcdGluaXQ6IGZ1bmN0aW9uKHRhcmdldCwgdmFycywgdHdlZW4pIHtcblx0XHRcdFx0XHRcdHRoaXMuX3RhcmdldCA9IHRhcmdldDtcblx0XHRcdFx0XHRcdGlmICh2YXJzIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdFx0XHRcdFx0dmFycyA9IHt2YWx1ZXM6dmFyc307XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLl9mdW5jID0ge307XG5cdFx0XHRcdFx0XHR0aGlzLl9tb2QgPSB7fTtcblx0XHRcdFx0XHRcdHRoaXMuX3Byb3BzID0gW107XG5cdFx0XHRcdFx0XHR0aGlzLl90aW1lUmVzID0gKHZhcnMudGltZVJlc29sdXRpb24gPT0gbnVsbCkgPyA2IDogcGFyc2VJbnQodmFycy50aW1lUmVzb2x1dGlvbiwgMTApO1xuXHRcdFx0XHRcdFx0dmFyIHZhbHVlcyA9IHZhcnMudmFsdWVzIHx8IFtdLFxuXHRcdFx0XHRcdFx0XHRmaXJzdCA9IHt9LFxuXHRcdFx0XHRcdFx0XHRzZWNvbmQgPSB2YWx1ZXNbMF0sXG5cdFx0XHRcdFx0XHRcdGF1dG9Sb3RhdGUgPSB2YXJzLmF1dG9Sb3RhdGUgfHwgdHdlZW4udmFycy5vcmllbnRUb0Jlemllcixcblx0XHRcdFx0XHRcdFx0cCwgaXNGdW5jLCBpLCBqLCBwcmVwZW5kO1xuXG5cdFx0XHRcdFx0XHR0aGlzLl9hdXRvUm90YXRlID0gYXV0b1JvdGF0ZSA/IChhdXRvUm90YXRlIGluc3RhbmNlb2YgQXJyYXkpID8gYXV0b1JvdGF0ZSA6IFtbXCJ4XCIsXCJ5XCIsXCJyb3RhdGlvblwiLCgoYXV0b1JvdGF0ZSA9PT0gdHJ1ZSkgPyAwIDogTnVtYmVyKGF1dG9Sb3RhdGUpIHx8IDApXV0gOiBudWxsO1xuXHRcdFx0XHRcdFx0Zm9yIChwIGluIHNlY29uZCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9wcm9wcy5wdXNoKHApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpID0gdGhpcy5fcHJvcHMubGVuZ3RoO1xuXHRcdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHAgPSB0aGlzLl9wcm9wc1tpXTtcblxuXHRcdFx0XHRcdFx0XHR0aGlzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKHApO1xuXHRcdFx0XHRcdFx0XHRpc0Z1bmMgPSB0aGlzLl9mdW5jW3BdID0gKHR5cGVvZih0YXJnZXRbcF0pID09PSBcImZ1bmN0aW9uXCIpO1xuXHRcdFx0XHRcdFx0XHRmaXJzdFtwXSA9ICghaXNGdW5jKSA/IHBhcnNlRmxvYXQodGFyZ2V0W3BdKSA6IHRhcmdldFsgKChwLmluZGV4T2YoXCJzZXRcIikgfHwgdHlwZW9mKHRhcmdldFtcImdldFwiICsgcC5zdWJzdHIoMyldKSAhPT0gXCJmdW5jdGlvblwiKSA/IHAgOiBcImdldFwiICsgcC5zdWJzdHIoMykpIF0oKTtcblx0XHRcdFx0XHRcdFx0aWYgKCFwcmVwZW5kKSBpZiAoZmlyc3RbcF0gIT09IHZhbHVlc1swXVtwXSkge1xuXHRcdFx0XHRcdFx0XHRcdHByZXBlbmQgPSBmaXJzdDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5fYmV6aWVycyA9ICh2YXJzLnR5cGUgIT09IFwiY3ViaWNcIiAmJiB2YXJzLnR5cGUgIT09IFwicXVhZHJhdGljXCIgJiYgdmFycy50eXBlICE9PSBcInNvZnRcIikgPyBiZXppZXJUaHJvdWdoKHZhbHVlcywgaXNOYU4odmFycy5jdXJ2aW5lc3MpID8gMSA6IHZhcnMuY3VydmluZXNzLCBmYWxzZSwgKHZhcnMudHlwZSA9PT0gXCJ0aHJ1QmFzaWNcIiksIHZhcnMuY29ycmVsYXRlLCBwcmVwZW5kKSA6IF9wYXJzZUJlemllckRhdGEodmFsdWVzLCB2YXJzLnR5cGUsIGZpcnN0KTtcblx0XHRcdFx0XHRcdHRoaXMuX3NlZ0NvdW50ID0gdGhpcy5fYmV6aWVyc1twXS5sZW5ndGg7XG5cblx0XHRcdFx0XHRcdGlmICh0aGlzLl90aW1lUmVzKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBsZCA9IF9wYXJzZUxlbmd0aERhdGEodGhpcy5fYmV6aWVycywgdGhpcy5fdGltZVJlcyk7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2xlbmd0aCA9IGxkLmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0dGhpcy5fbGVuZ3RocyA9IGxkLmxlbmd0aHM7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3NlZ21lbnRzID0gbGQuc2VnbWVudHM7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2wxID0gdGhpcy5fbGkgPSB0aGlzLl9zMSA9IHRoaXMuX3NpID0gMDtcblx0XHRcdFx0XHRcdFx0dGhpcy5fbDIgPSB0aGlzLl9sZW5ndGhzWzBdO1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9jdXJTZWcgPSB0aGlzLl9zZWdtZW50c1swXTtcblx0XHRcdFx0XHRcdFx0dGhpcy5fczIgPSB0aGlzLl9jdXJTZWdbMF07XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3ByZWMgPSAxIC8gdGhpcy5fY3VyU2VnLmxlbmd0aDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKChhdXRvUm90YXRlID0gdGhpcy5fYXV0b1JvdGF0ZSkpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5faW5pdGlhbFJvdGF0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdFx0XHRpZiAoIShhdXRvUm90YXRlWzBdIGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fYXV0b1JvdGF0ZSA9IGF1dG9Sb3RhdGUgPSBbYXV0b1JvdGF0ZV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aSA9IGF1dG9Sb3RhdGUubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgMzsgaisrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwID0gYXV0b1JvdGF0ZVtpXVtqXTtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2Z1bmNbcF0gPSAodHlwZW9mKHRhcmdldFtwXSkgPT09IFwiZnVuY3Rpb25cIikgPyB0YXJnZXRbICgocC5pbmRleE9mKFwic2V0XCIpIHx8IHR5cGVvZih0YXJnZXRbXCJnZXRcIiArIHAuc3Vic3RyKDMpXSkgIT09IFwiZnVuY3Rpb25cIikgPyBwIDogXCJnZXRcIiArIHAuc3Vic3RyKDMpKSBdIDogZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHAgPSBhdXRvUm90YXRlW2ldWzJdO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2luaXRpYWxSb3RhdGlvbnNbaV0gPSAodGhpcy5fZnVuY1twXSA/IHRoaXMuX2Z1bmNbcF0uY2FsbCh0aGlzLl90YXJnZXQpIDogdGhpcy5fdGFyZ2V0W3BdKSB8fCAwO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzLnB1c2gocCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0UmF0aW8gPSB0d2Vlbi52YXJzLnJ1bkJhY2t3YXJkcyA/IDEgOiAwOyAvL3dlIGRldGVybWluZSB0aGUgc3RhcnRpbmcgcmF0aW8gd2hlbiB0aGUgdHdlZW4gaW5pdHMgd2hpY2ggaXMgYWx3YXlzIDAgdW5sZXNzIHRoZSB0d2VlbiBoYXMgcnVuQmFja3dhcmRzOnRydWUgKGluZGljYXRpbmcgaXQncyBhIGZyb20oKSB0d2VlbikgaW4gd2hpY2ggY2FzZSBpdCdzIDEuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly9jYWxsZWQgZWFjaCB0aW1lIHRoZSB2YWx1ZXMgc2hvdWxkIGJlIHVwZGF0ZWQsIGFuZCB0aGUgcmF0aW8gZ2V0cyBwYXNzZWQgYXMgdGhlIG9ubHkgcGFyYW1ldGVyICh0eXBpY2FsbHkgaXQncyBhIHZhbHVlIGJldHdlZW4gMCBhbmQgMSwgYnV0IGl0IGNhbiBleGNlZWQgdGhvc2Ugd2hlbiB1c2luZyBhbiBlYXNlIGxpa2UgRWxhc3RpYy5lYXNlT3V0IG9yIEJhY2suZWFzZU91dCwgZXRjLilcblx0XHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHRcdHZhciBzZWdtZW50cyA9IHRoaXMuX3NlZ0NvdW50LFxuXHRcdFx0XHRcdFx0XHRmdW5jID0gdGhpcy5fZnVuYyxcblx0XHRcdFx0XHRcdFx0dGFyZ2V0ID0gdGhpcy5fdGFyZ2V0LFxuXHRcdFx0XHRcdFx0XHRub3RTdGFydCA9ICh2ICE9PSB0aGlzLl9zdGFydFJhdGlvKSxcblx0XHRcdFx0XHRcdFx0Y3VySW5kZXgsIGludiwgaSwgcCwgYiwgdCwgdmFsLCBsLCBsZW5ndGhzLCBjdXJTZWc7XG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuX3RpbWVSZXMpIHtcblx0XHRcdFx0XHRcdFx0Y3VySW5kZXggPSAodiA8IDApID8gMCA6ICh2ID49IDEpID8gc2VnbWVudHMgLSAxIDogKHNlZ21lbnRzICogdikgPj4gMDtcblx0XHRcdFx0XHRcdFx0dCA9ICh2IC0gKGN1ckluZGV4ICogKDEgLyBzZWdtZW50cykpKSAqIHNlZ21lbnRzO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0bGVuZ3RocyA9IHRoaXMuX2xlbmd0aHM7XG5cdFx0XHRcdFx0XHRcdGN1clNlZyA9IHRoaXMuX2N1clNlZztcblx0XHRcdFx0XHRcdFx0diAqPSB0aGlzLl9sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdGkgPSB0aGlzLl9saTtcblx0XHRcdFx0XHRcdFx0Ly9maW5kIHRoZSBhcHByb3ByaWF0ZSBzZWdtZW50IChpZiB0aGUgY3VycmVudGx5IGNhY2hlZCBvbmUgaXNuJ3QgY29ycmVjdClcblx0XHRcdFx0XHRcdFx0aWYgKHYgPiB0aGlzLl9sMiAmJiBpIDwgc2VnbWVudHMgLSAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0bCA9IHNlZ21lbnRzIC0gMTtcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoaSA8IGwgJiYgKHRoaXMuX2wyID0gbGVuZ3Roc1srK2ldKSA8PSB2KSB7XHR9XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fbDEgPSBsZW5ndGhzW2ktMV07XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fbGkgPSBpO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2N1clNlZyA9IGN1clNlZyA9IHRoaXMuX3NlZ21lbnRzW2ldO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3MyID0gY3VyU2VnWyh0aGlzLl9zMSA9IHRoaXMuX3NpID0gMCldO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHYgPCB0aGlzLl9sMSAmJiBpID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdHdoaWxlIChpID4gMCAmJiAodGhpcy5fbDEgPSBsZW5ndGhzWy0taV0pID49IHYpIHsgfVxuXHRcdFx0XHRcdFx0XHRcdGlmIChpID09PSAwICYmIHYgPCB0aGlzLl9sMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fbDEgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2wyID0gbGVuZ3Roc1tpXTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9saSA9IGk7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fY3VyU2VnID0gY3VyU2VnID0gdGhpcy5fc2VnbWVudHNbaV07XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fczEgPSBjdXJTZWdbKHRoaXMuX3NpID0gY3VyU2VnLmxlbmd0aCAtIDEpIC0gMV0gfHwgMDtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9zMiA9IGN1clNlZ1t0aGlzLl9zaV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Y3VySW5kZXggPSBpO1xuXHRcdFx0XHRcdFx0XHQvL25vdyBmaW5kIHRoZSBhcHByb3ByaWF0ZSBzdWItc2VnbWVudCAod2Ugc3BsaXQgaXQgaW50byB0aGUgbnVtYmVyIG9mIHBpZWNlcyB0aGF0IHdhcyBkZWZpbmVkIGJ5IFwicHJlY2lzaW9uXCIgYW5kIG1lYXN1cmVkIGVhY2ggb25lKVxuXHRcdFx0XHRcdFx0XHR2IC09IHRoaXMuX2wxO1xuXHRcdFx0XHRcdFx0XHRpID0gdGhpcy5fc2k7XG5cdFx0XHRcdFx0XHRcdGlmICh2ID4gdGhpcy5fczIgJiYgaSA8IGN1clNlZy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0bCA9IGN1clNlZy5sZW5ndGggLSAxO1xuXHRcdFx0XHRcdFx0XHRcdHdoaWxlIChpIDwgbCAmJiAodGhpcy5fczIgPSBjdXJTZWdbKytpXSkgPD0gdikge1x0fVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3MxID0gY3VyU2VnW2ktMV07XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fc2kgPSBpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHYgPCB0aGlzLl9zMSAmJiBpID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdHdoaWxlIChpID4gMCAmJiAodGhpcy5fczEgPSBjdXJTZWdbLS1pXSkgPj0gdikge1x0fVxuXHRcdFx0XHRcdFx0XHRcdGlmIChpID09PSAwICYmIHYgPCB0aGlzLl9zMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fczEgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3MyID0gY3VyU2VnW2ldO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3NpID0gaTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR0ID0gKChpICsgKHYgLSB0aGlzLl9zMSkgLyAodGhpcy5fczIgLSB0aGlzLl9zMSkpICogdGhpcy5fcHJlYykgfHwgMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGludiA9IDEgLSB0O1xuXG5cdFx0XHRcdFx0XHRpID0gdGhpcy5fcHJvcHMubGVuZ3RoO1xuXHRcdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHAgPSB0aGlzLl9wcm9wc1tpXTtcblx0XHRcdFx0XHRcdFx0YiA9IHRoaXMuX2JlemllcnNbcF1bY3VySW5kZXhdO1xuXHRcdFx0XHRcdFx0XHR2YWwgPSAodCAqIHQgKiBiLmRhICsgMyAqIGludiAqICh0ICogYi5jYSArIGludiAqIGIuYmEpKSAqIHQgKyBiLmE7XG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLl9tb2RbcF0pIHtcblx0XHRcdFx0XHRcdFx0XHR2YWwgPSB0aGlzLl9tb2RbcF0odmFsLCB0YXJnZXQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChmdW5jW3BdKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0W3BdKHZhbCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0W3BdID0gdmFsO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICh0aGlzLl9hdXRvUm90YXRlKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBhciA9IHRoaXMuX2F1dG9Sb3RhdGUsXG5cdFx0XHRcdFx0XHRcdFx0YjIsIHgxLCB5MSwgeDIsIHkyLCBhZGQsIGNvbnY7XG5cdFx0XHRcdFx0XHRcdGkgPSBhci5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdHAgPSBhcltpXVsyXTtcblx0XHRcdFx0XHRcdFx0XHRhZGQgPSBhcltpXVszXSB8fCAwO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnYgPSAoYXJbaV1bNF0gPT09IHRydWUpID8gMSA6IF9SQUQyREVHO1xuXHRcdFx0XHRcdFx0XHRcdGIgPSB0aGlzLl9iZXppZXJzW2FyW2ldWzBdXTtcblx0XHRcdFx0XHRcdFx0XHRiMiA9IHRoaXMuX2JlemllcnNbYXJbaV1bMV1dO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGIgJiYgYjIpIHsgLy9pbiBjYXNlIG9uZSBvZiB0aGUgcHJvcGVydGllcyBnb3Qgb3ZlcndyaXR0ZW4uXG5cdFx0XHRcdFx0XHRcdFx0XHRiID0gYltjdXJJbmRleF07XG5cdFx0XHRcdFx0XHRcdFx0XHRiMiA9IGIyW2N1ckluZGV4XTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0eDEgPSBiLmEgKyAoYi5iIC0gYi5hKSAqIHQ7XG5cdFx0XHRcdFx0XHRcdFx0XHR4MiA9IGIuYiArIChiLmMgLSBiLmIpICogdDtcblx0XHRcdFx0XHRcdFx0XHRcdHgxICs9ICh4MiAtIHgxKSAqIHQ7XG5cdFx0XHRcdFx0XHRcdFx0XHR4MiArPSAoKGIuYyArIChiLmQgLSBiLmMpICogdCkgLSB4MikgKiB0O1xuXG5cdFx0XHRcdFx0XHRcdFx0XHR5MSA9IGIyLmEgKyAoYjIuYiAtIGIyLmEpICogdDtcblx0XHRcdFx0XHRcdFx0XHRcdHkyID0gYjIuYiArIChiMi5jIC0gYjIuYikgKiB0O1xuXHRcdFx0XHRcdFx0XHRcdFx0eTEgKz0gKHkyIC0geTEpICogdDtcblx0XHRcdFx0XHRcdFx0XHRcdHkyICs9ICgoYjIuYyArIChiMi5kIC0gYjIuYykgKiB0KSAtIHkyKSAqIHQ7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHZhbCA9IG5vdFN0YXJ0ID8gTWF0aC5hdGFuMih5MiAtIHkxLCB4MiAtIHgxKSAqIGNvbnYgKyBhZGQgOiB0aGlzLl9pbml0aWFsUm90YXRpb25zW2ldO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAodGhpcy5fbW9kW3BdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhbCA9IHRoaXMuX21vZFtwXSh2YWwsIHRhcmdldCk7IC8vZm9yIG1vZFByb3BzXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmIChmdW5jW3BdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhcmdldFtwXSh2YWwpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGFyZ2V0W3BdID0gdmFsO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdH0pLFxuXHRcdFx0cCA9IEJlemllclBsdWdpbi5wcm90b3R5cGU7XG5cblxuXHRcdEJlemllclBsdWdpbi5iZXppZXJUaHJvdWdoID0gYmV6aWVyVGhyb3VnaDtcblx0XHRCZXppZXJQbHVnaW4uY3ViaWNUb1F1YWRyYXRpYyA9IGN1YmljVG9RdWFkcmF0aWM7XG5cdFx0QmV6aWVyUGx1Z2luLl9hdXRvQ1NTID0gdHJ1ZTsgLy9pbmRpY2F0ZXMgdGhhdCB0aGlzIHBsdWdpbiBjYW4gYmUgaW5zZXJ0ZWQgaW50byB0aGUgXCJjc3NcIiBvYmplY3QgdXNpbmcgdGhlIGF1dG9DU1MgZmVhdHVyZSBvZiBUd2VlbkxpdGVcblx0XHRCZXppZXJQbHVnaW4ucXVhZHJhdGljVG9DdWJpYyA9IGZ1bmN0aW9uKGEsIGIsIGMpIHtcblx0XHRcdHJldHVybiBuZXcgU2VnbWVudChhLCAoMiAqIGIgKyBhKSAvIDMsICgyICogYiArIGMpIC8gMywgYyk7XG5cdFx0fTtcblxuXHRcdEJlemllclBsdWdpbi5fY3NzUmVnaXN0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBDU1NQbHVnaW4gPSBfZ2xvYmFscy5DU1NQbHVnaW47XG5cdFx0XHRpZiAoIUNTU1BsdWdpbikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2YXIgX2ludGVybmFscyA9IENTU1BsdWdpbi5faW50ZXJuYWxzLFxuXHRcdFx0XHRfcGFyc2VUb1Byb3h5ID0gX2ludGVybmFscy5fcGFyc2VUb1Byb3h5LFxuXHRcdFx0XHRfc2V0UGx1Z2luUmF0aW8gPSBfaW50ZXJuYWxzLl9zZXRQbHVnaW5SYXRpbyxcblx0XHRcdFx0Q1NTUHJvcFR3ZWVuID0gX2ludGVybmFscy5DU1NQcm9wVHdlZW47XG5cdFx0XHRfaW50ZXJuYWxzLl9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImJlemllclwiLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHByb3AsIGNzc3AsIHB0LCBwbHVnaW4pIHtcblx0XHRcdFx0aWYgKGUgaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdFx0XHRcdGUgPSB7dmFsdWVzOmV9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHBsdWdpbiA9IG5ldyBCZXppZXJQbHVnaW4oKTtcblx0XHRcdFx0dmFyIHZhbHVlcyA9IGUudmFsdWVzLFxuXHRcdFx0XHRcdGwgPSB2YWx1ZXMubGVuZ3RoIC0gMSxcblx0XHRcdFx0XHRwbHVnaW5WYWx1ZXMgPSBbXSxcblx0XHRcdFx0XHR2ID0ge30sXG5cdFx0XHRcdFx0aSwgcCwgZGF0YTtcblx0XHRcdFx0aWYgKGwgPCAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHB0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPD0gbDsgaSsrKSB7XG5cdFx0XHRcdFx0ZGF0YSA9IF9wYXJzZVRvUHJveHkodCwgdmFsdWVzW2ldLCBjc3NwLCBwdCwgcGx1Z2luLCAobCAhPT0gaSkpO1xuXHRcdFx0XHRcdHBsdWdpblZhbHVlc1tpXSA9IGRhdGEuZW5kO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZvciAocCBpbiBlKSB7XG5cdFx0XHRcdFx0dltwXSA9IGVbcF07IC8vZHVwbGljYXRlIHRoZSB2YXJzIG9iamVjdCBiZWNhdXNlIHdlIG5lZWQgdG8gYWx0ZXIgc29tZSB0aGluZ3Mgd2hpY2ggd291bGQgY2F1c2UgcHJvYmxlbXMgaWYgdGhlIHVzZXIgcGxhbnMgdG8gcmV1c2UgdGhlIHNhbWUgdmFycyBvYmplY3QgZm9yIGFub3RoZXIgdHdlZW4uXG5cdFx0XHRcdH1cblx0XHRcdFx0di52YWx1ZXMgPSBwbHVnaW5WYWx1ZXM7XG5cdFx0XHRcdHB0ID0gbmV3IENTU1Byb3BUd2Vlbih0LCBcImJlemllclwiLCAwLCAwLCBkYXRhLnB0LCAyKTtcblx0XHRcdFx0cHQuZGF0YSA9IGRhdGE7XG5cdFx0XHRcdHB0LnBsdWdpbiA9IHBsdWdpbjtcblx0XHRcdFx0cHQuc2V0UmF0aW8gPSBfc2V0UGx1Z2luUmF0aW87XG5cdFx0XHRcdGlmICh2LmF1dG9Sb3RhdGUgPT09IDApIHtcblx0XHRcdFx0XHR2LmF1dG9Sb3RhdGUgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2LmF1dG9Sb3RhdGUgJiYgISh2LmF1dG9Sb3RhdGUgaW5zdGFuY2VvZiBBcnJheSkpIHtcblx0XHRcdFx0XHRpID0gKHYuYXV0b1JvdGF0ZSA9PT0gdHJ1ZSkgPyAwIDogTnVtYmVyKHYuYXV0b1JvdGF0ZSk7XG5cdFx0XHRcdFx0di5hdXRvUm90YXRlID0gKGRhdGEuZW5kLmxlZnQgIT0gbnVsbCkgPyBbW1wibGVmdFwiLFwidG9wXCIsXCJyb3RhdGlvblwiLGksZmFsc2VdXSA6IChkYXRhLmVuZC54ICE9IG51bGwpID8gW1tcInhcIixcInlcIixcInJvdGF0aW9uXCIsaSxmYWxzZV1dIDogZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHYuYXV0b1JvdGF0ZSkge1xuXHRcdFx0XHRcdGlmICghY3NzcC5fdHJhbnNmb3JtKSB7XG5cdFx0XHRcdFx0XHRjc3NwLl9lbmFibGVUcmFuc2Zvcm1zKGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZGF0YS5hdXRvUm90YXRlID0gY3NzcC5fdGFyZ2V0Ll9nc1RyYW5zZm9ybTtcblx0XHRcdFx0XHRkYXRhLnByb3h5LnJvdGF0aW9uID0gZGF0YS5hdXRvUm90YXRlLnJvdGF0aW9uIHx8IDA7XG5cdFx0XHRcdFx0Y3NzcC5fb3ZlcndyaXRlUHJvcHMucHVzaChcInJvdGF0aW9uXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHBsdWdpbi5fb25Jbml0VHdlZW4oZGF0YS5wcm94eSwgdiwgY3NzcC5fdHdlZW4pO1xuXHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHR9fSk7XG5cdFx0fTtcblxuXHRcdHAuX21vZCA9IGZ1bmN0aW9uKGxvb2t1cCkge1xuXHRcdFx0dmFyIG9wID0gdGhpcy5fb3ZlcndyaXRlUHJvcHMsXG5cdFx0XHRcdGkgPSBvcC5sZW5ndGgsXG5cdFx0XHRcdHZhbDtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHR2YWwgPSBsb29rdXBbb3BbaV1dO1xuXHRcdFx0XHRpZiAodmFsICYmIHR5cGVvZih2YWwpID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHR0aGlzLl9tb2Rbb3BbaV1dID0gdmFsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHAuX2tpbGwgPSBmdW5jdGlvbihsb29rdXApIHtcblx0XHRcdHZhciBhID0gdGhpcy5fcHJvcHMsXG5cdFx0XHRcdHAsIGk7XG5cdFx0XHRmb3IgKHAgaW4gdGhpcy5fYmV6aWVycykge1xuXHRcdFx0XHRpZiAocCBpbiBsb29rdXApIHtcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5fYmV6aWVyc1twXTtcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5fZnVuY1twXTtcblx0XHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRpZiAoYVtpXSA9PT0gcCkge1xuXHRcdFx0XHRcdFx0XHRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGEgPSB0aGlzLl9hdXRvUm90YXRlO1xuXHRcdFx0aWYgKGEpIHtcblx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRpZiAobG9va3VwW2FbaV1bMl1dKSB7XG5cdFx0XHRcdFx0XHRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl9zdXBlci5fa2lsbC5jYWxsKHRoaXMsIGxvb2t1cCk7XG5cdFx0fTtcblxuXHR9KCkpO1xuXG5cblxuXG5cblxuXHRcblx0XG5cdFxuXHRcblx0XG5cdFxuXHRcblx0XG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ1NTUGx1Z2luXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0X2dzU2NvcGUuX2dzRGVmaW5lKFwicGx1Z2lucy5DU1NQbHVnaW5cIiwgW1wicGx1Z2lucy5Ud2VlblBsdWdpblwiLFwiVHdlZW5MaXRlXCJdLCBmdW5jdGlvbihUd2VlblBsdWdpbiwgVHdlZW5MaXRlKSB7XG5cblx0XHQvKiogQGNvbnN0cnVjdG9yICoqL1xuXHRcdHZhciBDU1NQbHVnaW4gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0VHdlZW5QbHVnaW4uY2FsbCh0aGlzLCBcImNzc1wiKTtcblx0XHRcdFx0dGhpcy5fb3ZlcndyaXRlUHJvcHMubGVuZ3RoID0gMDtcblx0XHRcdFx0dGhpcy5zZXRSYXRpbyA9IENTU1BsdWdpbi5wcm90b3R5cGUuc2V0UmF0aW87IC8vc3BlZWQgb3B0aW1pemF0aW9uIChhdm9pZCBwcm90b3R5cGUgbG9va3VwIG9uIHRoaXMgXCJob3RcIiBtZXRob2QpXG5cdFx0XHR9LFxuXHRcdFx0X2dsb2JhbHMgPSBfZ3NTY29wZS5fZ3NEZWZpbmUuZ2xvYmFscyxcblx0XHRcdF9oYXNQcmlvcml0eSwgLy90dXJucyB0cnVlIHdoZW5ldmVyIGEgQ1NTUHJvcFR3ZWVuIGluc3RhbmNlIGlzIGNyZWF0ZWQgdGhhdCBoYXMgYSBwcmlvcml0eSBvdGhlciB0aGFuIDAuIFRoaXMgaGVscHMgdXMgZGlzY2VybiB3aGV0aGVyIG9yIG5vdCB3ZSBzaG91bGQgc3BlbmQgdGhlIHRpbWUgb3JnYW5pemluZyB0aGUgbGlua2VkIGxpc3Qgb3Igbm90IGFmdGVyIGEgQ1NTUGx1Z2luJ3MgX29uSW5pdFR3ZWVuKCkgbWV0aG9kIGlzIGNhbGxlZC5cblx0XHRcdF9zdWZmaXhNYXAsIC8vd2Ugc2V0IHRoaXMgaW4gX29uSW5pdFR3ZWVuKCkgZWFjaCB0aW1lIGFzIGEgd2F5IHRvIGhhdmUgYSBwZXJzaXN0ZW50IHZhcmlhYmxlIHdlIGNhbiB1c2UgaW4gb3RoZXIgbWV0aG9kcyBsaWtlIF9wYXJzZSgpIHdpdGhvdXQgaGF2aW5nIHRvIHBhc3MgaXQgYXJvdW5kIGFzIGEgcGFyYW1ldGVyIGFuZCB3ZSBrZWVwIF9wYXJzZSgpIGRlY291cGxlZCBmcm9tIGEgcGFydGljdWxhciBDU1NQbHVnaW4gaW5zdGFuY2Vcblx0XHRcdF9jcywgLy9jb21wdXRlZCBzdHlsZSAod2Ugc3RvcmUgdGhpcyBpbiBhIHNoYXJlZCB2YXJpYWJsZSB0byBjb25zZXJ2ZSBtZW1vcnkgYW5kIG1ha2UgbWluaWZpY2F0aW9uIHRpZ2h0ZXJcblx0XHRcdF9vdmVyd3JpdGVQcm9wcywgLy9hbGlhcyB0byB0aGUgY3VycmVudGx5IGluc3RhbnRpYXRpbmcgQ1NTUGx1Z2luJ3MgX292ZXJ3cml0ZVByb3BzIGFycmF5LiBXZSB1c2UgdGhpcyBjbG9zdXJlIGluIG9yZGVyIHRvIGF2b2lkIGhhdmluZyB0byBwYXNzIGEgcmVmZXJlbmNlIGFyb3VuZCBmcm9tIG1ldGhvZCB0byBtZXRob2QgYW5kIGFpZCBpbiBtaW5pZmljYXRpb24uXG5cdFx0XHRfc3BlY2lhbFByb3BzID0ge30sXG5cdFx0XHRwID0gQ1NTUGx1Z2luLnByb3RvdHlwZSA9IG5ldyBUd2VlblBsdWdpbihcImNzc1wiKTtcblxuXHRcdHAuY29uc3RydWN0b3IgPSBDU1NQbHVnaW47XG5cdFx0Q1NTUGx1Z2luLnZlcnNpb24gPSBcIjEuMTkuMFwiO1xuXHRcdENTU1BsdWdpbi5BUEkgPSAyO1xuXHRcdENTU1BsdWdpbi5kZWZhdWx0VHJhbnNmb3JtUGVyc3BlY3RpdmUgPSAwO1xuXHRcdENTU1BsdWdpbi5kZWZhdWx0U2tld1R5cGUgPSBcImNvbXBlbnNhdGVkXCI7XG5cdFx0Q1NTUGx1Z2luLmRlZmF1bHRTbW9vdGhPcmlnaW4gPSB0cnVlO1xuXHRcdHAgPSBcInB4XCI7IC8vd2UnbGwgcmV1c2UgdGhlIFwicFwiIHZhcmlhYmxlIHRvIGtlZXAgZmlsZSBzaXplIGRvd25cblx0XHRDU1NQbHVnaW4uc3VmZml4TWFwID0ge3RvcDpwLCByaWdodDpwLCBib3R0b206cCwgbGVmdDpwLCB3aWR0aDpwLCBoZWlnaHQ6cCwgZm9udFNpemU6cCwgcGFkZGluZzpwLCBtYXJnaW46cCwgcGVyc3BlY3RpdmU6cCwgbGluZUhlaWdodDpcIlwifTtcblxuXG5cdFx0dmFyIF9udW1FeHAgPSAvKD86XFwtfFxcLnxcXGIpKFxcZHxcXC58ZVxcLSkrL2csXG5cdFx0XHRfcmVsTnVtRXhwID0gLyg/OlxcZHxcXC1cXGR8XFwuXFxkfFxcLVxcLlxcZHxcXCs9XFxkfFxcLT1cXGR8XFwrPS5cXGR8XFwtPVxcLlxcZCkrL2csXG5cdFx0XHRfdmFsdWVzRXhwID0gLyg/OlxcKz18XFwtPXxcXC18XFxiKVtcXGRcXC1cXC5dK1thLXpBLVowLTldKig/OiV8XFxiKS9naSwgLy9maW5kcyBhbGwgdGhlIHZhbHVlcyB0aGF0IGJlZ2luIHdpdGggbnVtYmVycyBvciArPSBvciAtPSBhbmQgdGhlbiBhIG51bWJlci4gSW5jbHVkZXMgc3VmZml4ZXMuIFdlIHVzZSB0aGlzIHRvIHNwbGl0IGNvbXBsZXggdmFsdWVzIGFwYXJ0IGxpa2UgXCIxcHggNXB4IDIwcHggcmdiKDI1NSwxMDIsNTEpXCJcblx0XHRcdF9OYU5FeHAgPSAvKD8hWystXT9cXGQqXFwuP1xcZCt8WystXXxlWystXVxcZCspW14wLTldL2csIC8vYWxzbyBhbGxvd3Mgc2NpZW50aWZpYyBub3RhdGlvbiBhbmQgZG9lc24ndCBraWxsIHRoZSBsZWFkaW5nIC0vKyBpbiAtPSBhbmQgKz1cblx0XHRcdF9zdWZmaXhFeHAgPSAvKD86XFxkfFxcLXxcXCt8PXwjfFxcLikqL2csXG5cdFx0XHRfb3BhY2l0eUV4cCA9IC9vcGFjaXR5ICo9ICooW14pXSopL2ksXG5cdFx0XHRfb3BhY2l0eVZhbEV4cCA9IC9vcGFjaXR5OihbXjtdKikvaSxcblx0XHRcdF9hbHBoYUZpbHRlckV4cCA9IC9hbHBoYVxcKG9wYWNpdHkgKj0uKz9cXCkvaSxcblx0XHRcdF9yZ2Joc2xFeHAgPSAvXihyZ2J8aHNsKS8sXG5cdFx0XHRfY2Fwc0V4cCA9IC8oW0EtWl0pL2csXG5cdFx0XHRfY2FtZWxFeHAgPSAvLShbYS16XSkvZ2ksXG5cdFx0XHRfdXJsRXhwID0gLyheKD86dXJsXFwoXFxcInx1cmxcXCgpKXwoPzooXFxcIlxcKSkkfFxcKSQpL2dpLCAvL2ZvciBwdWxsaW5nIG91dCB1cmxzIGZyb20gdXJsKC4uLikgb3IgdXJsKFwiLi4uXCIpIHN0cmluZ3MgKHNvbWUgYnJvd3NlcnMgd3JhcCB1cmxzIGluIHF1b3Rlcywgc29tZSBkb24ndCB3aGVuIHJlcG9ydGluZyB0aGluZ3MgbGlrZSBiYWNrZ3JvdW5kSW1hZ2UpXG5cdFx0XHRfY2FtZWxGdW5jID0gZnVuY3Rpb24ocywgZykgeyByZXR1cm4gZy50b1VwcGVyQ2FzZSgpOyB9LFxuXHRcdFx0X2hvcml6RXhwID0gLyg/OkxlZnR8UmlnaHR8V2lkdGgpL2ksXG5cdFx0XHRfaWVHZXRNYXRyaXhFeHAgPSAvKE0xMXxNMTJ8TTIxfE0yMik9W1xcZFxcLVxcLmVdKy9naSxcblx0XHRcdF9pZVNldE1hdHJpeEV4cCA9IC9wcm9naWRcXDpEWEltYWdlVHJhbnNmb3JtXFwuTWljcm9zb2Z0XFwuTWF0cml4XFwoLis/XFwpL2ksXG5cdFx0XHRfY29tbWFzT3V0c2lkZVBhcmVuRXhwID0gLywoPz1bXlxcKV0qKD86XFwofCQpKS9naSwgLy9maW5kcyBhbnkgY29tbWFzIHRoYXQgYXJlIG5vdCB3aXRoaW4gcGFyZW50aGVzaXNcblx0XHRcdF9jb21wbGV4RXhwID0gL1tcXHMsXFwoXS9pLCAvL2ZvciB0ZXN0aW5nIGEgc3RyaW5nIHRvIGZpbmQgaWYgaXQgaGFzIGEgc3BhY2UsIGNvbW1hLCBvciBvcGVuIHBhcmVudGhlc2lzIChjbHVlcyB0aGF0IGl0J3MgYSBjb21wbGV4IHZhbHVlKVxuXHRcdFx0X0RFRzJSQUQgPSBNYXRoLlBJIC8gMTgwLFxuXHRcdFx0X1JBRDJERUcgPSAxODAgLyBNYXRoLlBJLFxuXHRcdFx0X2ZvcmNlUFQgPSB7fSxcblx0XHRcdF9kb2MgPSBkb2N1bWVudCxcblx0XHRcdF9jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24odHlwZSkge1xuXHRcdFx0XHRyZXR1cm4gX2RvYy5jcmVhdGVFbGVtZW50TlMgPyBfZG9jLmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIiwgdHlwZSkgOiBfZG9jLmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cdFx0XHR9LFxuXHRcdFx0X3RlbXBEaXYgPSBfY3JlYXRlRWxlbWVudChcImRpdlwiKSxcblx0XHRcdF90ZW1wSW1nID0gX2NyZWF0ZUVsZW1lbnQoXCJpbWdcIiksXG5cdFx0XHRfaW50ZXJuYWxzID0gQ1NTUGx1Z2luLl9pbnRlcm5hbHMgPSB7X3NwZWNpYWxQcm9wczpfc3BlY2lhbFByb3BzfSwgLy9wcm92aWRlcyBhIGhvb2sgdG8gYSBmZXcgaW50ZXJuYWwgbWV0aG9kcyB0aGF0IHdlIG5lZWQgdG8gYWNjZXNzIGZyb20gaW5zaWRlIG90aGVyIHBsdWdpbnNcblx0XHRcdF9hZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQsXG5cdFx0XHRfYXV0b1JvdW5kLFxuXHRcdFx0X3JlcVNhZmFyaUZpeCwgLy93ZSB3b24ndCBhcHBseSB0aGUgU2FmYXJpIHRyYW5zZm9ybSBmaXggdW50aWwgd2UgYWN0dWFsbHkgY29tZSBhY3Jvc3MgYSB0d2VlbiB0aGF0IGFmZmVjdHMgYSB0cmFuc2Zvcm0gcHJvcGVydHkgKHRvIG1haW50YWluIGJlc3QgcGVyZm9ybWFuY2UpLlxuXG5cdFx0XHRfaXNTYWZhcmksXG5cdFx0XHRfaXNGaXJlZm94LCAvL0ZpcmVmb3ggaGFzIGEgYnVnIHRoYXQgY2F1c2VzIDNEIHRyYW5zZm9ybWVkIGVsZW1lbnRzIHRvIHJhbmRvbWx5IGRpc2FwcGVhciB1bmxlc3MgYSByZXBhaW50IGlzIGZvcmNlZCBhZnRlciBlYWNoIHVwZGF0ZSBvbiBlYWNoIGVsZW1lbnQuXG5cdFx0XHRfaXNTYWZhcmlMVDYsIC8vU2FmYXJpIChhbmQgQW5kcm9pZCA0IHdoaWNoIHVzZXMgYSBmbGF2b3Igb2YgU2FmYXJpKSBoYXMgYSBidWcgdGhhdCBwcmV2ZW50cyBjaGFuZ2VzIHRvIFwidG9wXCIgYW5kIFwibGVmdFwiIHByb3BlcnRpZXMgZnJvbSByZW5kZXJpbmcgcHJvcGVybHkgaWYgY2hhbmdlZCBvbiB0aGUgc2FtZSBmcmFtZSBhcyBhIHRyYW5zZm9ybSBVTkxFU1Mgd2Ugc2V0IHRoZSBlbGVtZW50J3MgV2Via2l0QmFja2ZhY2VWaXNpYmlsaXR5IHRvIGhpZGRlbiAod2VpcmQsIEkga25vdykuIERvaW5nIHRoaXMgZm9yIEFuZHJvaWQgMyBhbmQgZWFybGllciBzZWVtcyB0byBhY3R1YWxseSBjYXVzZSBvdGhlciBwcm9ibGVtcywgdGhvdWdoIChmdW4hKVxuXHRcdFx0X2llVmVycyxcblx0XHRcdF9zdXBwb3J0c09wYWNpdHkgPSAoZnVuY3Rpb24oKSB7IC8vd2Ugc2V0IF9pc1NhZmFyaSwgX2llVmVycywgX2lzRmlyZWZveCwgYW5kIF9zdXBwb3J0c09wYWNpdHkgYWxsIGluIG9uZSBmdW5jdGlvbiBoZXJlIHRvIHJlZHVjZSBmaWxlIHNpemUgc2xpZ2h0bHksIGVzcGVjaWFsbHkgaW4gdGhlIG1pbmlmaWVkIHZlcnNpb24uXG5cdFx0XHRcdHZhciBpID0gX2FnZW50LmluZGV4T2YoXCJBbmRyb2lkXCIpLFxuXHRcdFx0XHRcdGEgPSBfY3JlYXRlRWxlbWVudChcImFcIik7XG5cdFx0XHRcdF9pc1NhZmFyaSA9IChfYWdlbnQuaW5kZXhPZihcIlNhZmFyaVwiKSAhPT0gLTEgJiYgX2FnZW50LmluZGV4T2YoXCJDaHJvbWVcIikgPT09IC0xICYmIChpID09PSAtMSB8fCBOdW1iZXIoX2FnZW50LnN1YnN0cihpKzgsIDEpKSA+IDMpKTtcblx0XHRcdFx0X2lzU2FmYXJpTFQ2ID0gKF9pc1NhZmFyaSAmJiAoTnVtYmVyKF9hZ2VudC5zdWJzdHIoX2FnZW50LmluZGV4T2YoXCJWZXJzaW9uL1wiKSs4LCAxKSkgPCA2KSk7XG5cdFx0XHRcdF9pc0ZpcmVmb3ggPSAoX2FnZW50LmluZGV4T2YoXCJGaXJlZm94XCIpICE9PSAtMSk7XG5cdFx0XHRcdGlmICgoL01TSUUgKFswLTldezEsfVtcXC4wLTldezAsfSkvKS5leGVjKF9hZ2VudCkgfHwgKC9UcmlkZW50XFwvLipydjooWzAtOV17MSx9W1xcLjAtOV17MCx9KS8pLmV4ZWMoX2FnZW50KSkge1xuXHRcdFx0XHRcdF9pZVZlcnMgPSBwYXJzZUZsb2F0KCBSZWdFeHAuJDEgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWEpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0YS5zdHlsZS5jc3NUZXh0ID0gXCJ0b3A6MXB4O29wYWNpdHk6LjU1O1wiO1xuXHRcdFx0XHRyZXR1cm4gL14wLjU1Ly50ZXN0KGEuc3R5bGUub3BhY2l0eSk7XG5cdFx0XHR9KCkpLFxuXHRcdFx0X2dldElFT3BhY2l0eSA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0cmV0dXJuIChfb3BhY2l0eUV4cC50ZXN0KCAoKHR5cGVvZih2KSA9PT0gXCJzdHJpbmdcIikgPyB2IDogKHYuY3VycmVudFN0eWxlID8gdi5jdXJyZW50U3R5bGUuZmlsdGVyIDogdi5zdHlsZS5maWx0ZXIpIHx8IFwiXCIpICkgPyAoIHBhcnNlRmxvYXQoIFJlZ0V4cC4kMSApIC8gMTAwICkgOiAxKTtcblx0XHRcdH0sXG5cdFx0XHRfbG9nID0gZnVuY3Rpb24ocykgey8vZm9yIGxvZ2dpbmcgbWVzc2FnZXMsIGJ1dCBpbiBhIHdheSB0aGF0IHdvbid0IHRocm93IGVycm9ycyBpbiBvbGQgdmVyc2lvbnMgb2YgSUUuXG5cdFx0XHRcdGlmICh3aW5kb3cuY29uc29sZSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0X3RhcmdldCwgLy93aGVuIGluaXR0aW5nIGEgQ1NTUGx1Z2luLCB3ZSBzZXQgdGhpcyB2YXJpYWJsZSBzbyB0aGF0IHdlIGNhbiBhY2Nlc3MgaXQgZnJvbSB3aXRoaW4gbWFueSBvdGhlciBmdW5jdGlvbnMgd2l0aG91dCBoYXZpbmcgdG8gcGFzcyBpdCBhcm91bmQgYXMgcGFyYW1zXG5cdFx0XHRfaW5kZXgsIC8vd2hlbiBpbml0dGluZyBhIENTU1BsdWdpbiwgd2Ugc2V0IHRoaXMgdmFyaWFibGUgc28gdGhhdCB3ZSBjYW4gYWNjZXNzIGl0IGZyb20gd2l0aGluIG1hbnkgb3RoZXIgZnVuY3Rpb25zIHdpdGhvdXQgaGF2aW5nIHRvIHBhc3MgaXQgYXJvdW5kIGFzIHBhcmFtc1xuXG5cdFx0XHRfcHJlZml4Q1NTID0gXCJcIiwgLy90aGUgbm9uLWNhbWVsQ2FzZSB2ZW5kb3IgcHJlZml4IGxpa2UgXCItby1cIiwgXCItbW96LVwiLCBcIi1tcy1cIiwgb3IgXCItd2Via2l0LVwiXG5cdFx0XHRfcHJlZml4ID0gXCJcIiwgLy9jYW1lbENhc2UgdmVuZG9yIHByZWZpeCBsaWtlIFwiT1wiLCBcIm1zXCIsIFwiV2Via2l0XCIsIG9yIFwiTW96XCIuXG5cblx0XHRcdC8vIEBwcml2YXRlIGZlZWQgaW4gYSBjYW1lbENhc2UgcHJvcGVydHkgbmFtZSBsaWtlIFwidHJhbnNmb3JtXCIgYW5kIGl0IHdpbGwgY2hlY2sgdG8gc2VlIGlmIGl0IGlzIHZhbGlkIGFzLWlzIG9yIGlmIGl0IG5lZWRzIGEgdmVuZG9yIHByZWZpeC4gSXQgcmV0dXJucyB0aGUgY29ycmVjdGVkIGNhbWVsQ2FzZSBwcm9wZXJ0eSBuYW1lIChpLmUuIFwiV2Via2l0VHJhbnNmb3JtXCIgb3IgXCJNb3pUcmFuc2Zvcm1cIiBvciBcInRyYW5zZm9ybVwiIG9yIG51bGwgaWYgbm8gc3VjaCBwcm9wZXJ0eSBpcyBmb3VuZCwgbGlrZSBpZiB0aGUgYnJvd3NlciBpcyBJRTggb3IgYmVmb3JlLCBcInRyYW5zZm9ybVwiIHdvbid0IGJlIGZvdW5kIGF0IGFsbClcblx0XHRcdF9jaGVja1Byb3BQcmVmaXggPSBmdW5jdGlvbihwLCBlKSB7XG5cdFx0XHRcdGUgPSBlIHx8IF90ZW1wRGl2O1xuXHRcdFx0XHR2YXIgcyA9IGUuc3R5bGUsXG5cdFx0XHRcdFx0YSwgaTtcblx0XHRcdFx0aWYgKHNbcF0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHJldHVybiBwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHAgPSBwLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcC5zdWJzdHIoMSk7XG5cdFx0XHRcdGEgPSBbXCJPXCIsXCJNb3pcIixcIm1zXCIsXCJNc1wiLFwiV2Via2l0XCJdO1xuXHRcdFx0XHRpID0gNTtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xICYmIHNbYVtpXStwXSA9PT0gdW5kZWZpbmVkKSB7IH1cblx0XHRcdFx0aWYgKGkgPj0gMCkge1xuXHRcdFx0XHRcdF9wcmVmaXggPSAoaSA9PT0gMykgPyBcIm1zXCIgOiBhW2ldO1xuXHRcdFx0XHRcdF9wcmVmaXhDU1MgPSBcIi1cIiArIF9wcmVmaXgudG9Mb3dlckNhc2UoKSArIFwiLVwiO1xuXHRcdFx0XHRcdHJldHVybiBfcHJlZml4ICsgcDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH0sXG5cblx0XHRcdF9nZXRDb21wdXRlZFN0eWxlID0gX2RvYy5kZWZhdWx0VmlldyA/IF9kb2MuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSA6IGZ1bmN0aW9uKCkge30sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgUmV0dXJucyB0aGUgY3NzIHN0eWxlIGZvciBhIHBhcnRpY3VsYXIgcHJvcGVydHkgb2YgYW4gZWxlbWVudC4gRm9yIGV4YW1wbGUsIHRvIGdldCB3aGF0ZXZlciB0aGUgY3VycmVudCBcImxlZnRcIiBjc3MgdmFsdWUgZm9yIGFuIGVsZW1lbnQgd2l0aCBhbiBJRCBvZiBcIm15RWxlbWVudFwiLCB5b3UgY291bGQgZG86XG5cdFx0XHQgKiB2YXIgY3VycmVudExlZnQgPSBDU1NQbHVnaW4uZ2V0U3R5bGUoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlFbGVtZW50XCIpLCBcImxlZnRcIik7XG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IFRhcmdldCBlbGVtZW50IHdob3NlIHN0eWxlIHByb3BlcnR5IHlvdSB3YW50IHRvIHF1ZXJ5XG5cdFx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IHAgUHJvcGVydHkgbmFtZSAobGlrZSBcImxlZnRcIiBvciBcInRvcFwiIG9yIFwibWFyZ2luVG9wXCIsIGV0Yy4pXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdD19IGNzIENvbXB1dGVkIHN0eWxlIG9iamVjdC4gVGhpcyBqdXN0IHByb3ZpZGVzIGEgd2F5IHRvIHNwZWVkIHByb2Nlc3NpbmcgaWYgeW91J3JlIGdvaW5nIHRvIGdldCBzZXZlcmFsIHByb3BlcnRpZXMgb24gdGhlIHNhbWUgZWxlbWVudCBpbiBxdWljayBzdWNjZXNzaW9uIC0geW91IGNhbiByZXVzZSB0aGUgcmVzdWx0IG9mIHRoZSBnZXRDb21wdXRlZFN0eWxlKCkgY2FsbC5cblx0XHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IGNhbGMgSWYgdHJ1ZSwgdGhlIHZhbHVlIHdpbGwgbm90IGJlIHJlYWQgZGlyZWN0bHkgZnJvbSB0aGUgZWxlbWVudCdzIFwic3R5bGVcIiBwcm9wZXJ0eSAoaWYgaXQgZXhpc3RzIHRoZXJlKSwgYnV0IGluc3RlYWQgdGhlIGdldENvbXB1dGVkU3R5bGUoKSByZXN1bHQgd2lsbCBiZSB1c2VkLiBUaGlzIGNhbiBiZSB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0byBlbnN1cmUgdGhhdCB0aGUgYnJvd3NlciBpdHNlbGYgaXMgaW50ZXJwcmV0aW5nIHRoZSB2YWx1ZS5cblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nPX0gZGZsdCBEZWZhdWx0IHZhbHVlIHRoYXQgc2hvdWxkIGJlIHJldHVybmVkIGluIHRoZSBwbGFjZSBvZiBudWxsLCBcIm5vbmVcIiwgXCJhdXRvXCIgb3IgXCJhdXRvIGF1dG9cIi5cblx0XHRcdCAqIEByZXR1cm4gez9zdHJpbmd9IFRoZSBjdXJyZW50IHByb3BlcnR5IHZhbHVlXG5cdFx0XHQgKi9cblx0XHRcdF9nZXRTdHlsZSA9IENTU1BsdWdpbi5nZXRTdHlsZSA9IGZ1bmN0aW9uKHQsIHAsIGNzLCBjYWxjLCBkZmx0KSB7XG5cdFx0XHRcdHZhciBydjtcblx0XHRcdFx0aWYgKCFfc3VwcG9ydHNPcGFjaXR5KSBpZiAocCA9PT0gXCJvcGFjaXR5XCIpIHsgLy9zZXZlcmFsIHZlcnNpb25zIG9mIElFIGRvbid0IHVzZSB0aGUgc3RhbmRhcmQgXCJvcGFjaXR5XCIgcHJvcGVydHkgLSB0aGV5IHVzZSB0aGluZ3MgbGlrZSBmaWx0ZXI6YWxwaGEob3BhY2l0eT01MCksIHNvIHdlIHBhcnNlIHRoYXQgaGVyZS5cblx0XHRcdFx0XHRyZXR1cm4gX2dldElFT3BhY2l0eSh0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWNhbGMgJiYgdC5zdHlsZVtwXSkge1xuXHRcdFx0XHRcdHJ2ID0gdC5zdHlsZVtwXTtcblx0XHRcdFx0fSBlbHNlIGlmICgoY3MgPSBjcyB8fCBfZ2V0Q29tcHV0ZWRTdHlsZSh0KSkpIHtcblx0XHRcdFx0XHRydiA9IGNzW3BdIHx8IGNzLmdldFByb3BlcnR5VmFsdWUocCkgfHwgY3MuZ2V0UHJvcGVydHlWYWx1ZShwLnJlcGxhY2UoX2NhcHNFeHAsIFwiLSQxXCIpLnRvTG93ZXJDYXNlKCkpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHQuY3VycmVudFN0eWxlKSB7XG5cdFx0XHRcdFx0cnYgPSB0LmN1cnJlbnRTdHlsZVtwXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gKGRmbHQgIT0gbnVsbCAmJiAoIXJ2IHx8IHJ2ID09PSBcIm5vbmVcIiB8fCBydiA9PT0gXCJhdXRvXCIgfHwgcnYgPT09IFwiYXV0byBhdXRvXCIpKSA/IGRmbHQgOiBydjtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgUGFzcyB0aGUgdGFyZ2V0IGVsZW1lbnQsIHRoZSBwcm9wZXJ0eSBuYW1lLCB0aGUgbnVtZXJpYyB2YWx1ZSwgYW5kIHRoZSBzdWZmaXggKGxpa2UgXCIlXCIsIFwiZW1cIiwgXCJweFwiLCBldGMuKSBhbmQgaXQgd2lsbCBzcGl0IGJhY2sgdGhlIGVxdWl2YWxlbnQgcGl4ZWwgbnVtYmVyLlxuXHRcdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IFRhcmdldCBlbGVtZW50XG5cdFx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IHAgUHJvcGVydHkgbmFtZSAobGlrZSBcImxlZnRcIiwgXCJ0b3BcIiwgXCJtYXJnaW5MZWZ0XCIsIGV0Yy4pXG5cdFx0XHQgKiBAcGFyYW0geyFudW1iZXJ9IHYgVmFsdWVcblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nPX0gc2Z4IFN1ZmZpeCAobGlrZSBcInB4XCIgb3IgXCIlXCIgb3IgXCJlbVwiKVxuXHRcdFx0ICogQHBhcmFtIHtib29sZWFuPX0gcmVjdXJzZSBJZiB0cnVlLCB0aGUgY2FsbCBpcyBhIHJlY3Vyc2l2ZSBvbmUuIEluIHNvbWUgYnJvd3NlcnMgKGxpa2UgSUU3LzgpLCBvY2Nhc2lvbmFsbHkgdGhlIHZhbHVlIGlzbid0IGFjY3VyYXRlbHkgcmVwb3J0ZWQgaW5pdGlhbGx5LCBidXQgaWYgd2UgcnVuIHRoZSBmdW5jdGlvbiBhZ2FpbiBpdCB3aWxsIHRha2UgZWZmZWN0LlxuXHRcdFx0ICogQHJldHVybiB7bnVtYmVyfSB2YWx1ZSBpbiBwaXhlbHNcblx0XHRcdCAqL1xuXHRcdFx0X2NvbnZlcnRUb1BpeGVscyA9IF9pbnRlcm5hbHMuY29udmVydFRvUGl4ZWxzID0gZnVuY3Rpb24odCwgcCwgdiwgc2Z4LCByZWN1cnNlKSB7XG5cdFx0XHRcdGlmIChzZnggPT09IFwicHhcIiB8fCAhc2Z4KSB7IHJldHVybiB2OyB9XG5cdFx0XHRcdGlmIChzZnggPT09IFwiYXV0b1wiIHx8ICF2KSB7IHJldHVybiAwOyB9XG5cdFx0XHRcdHZhciBob3JpeiA9IF9ob3JpekV4cC50ZXN0KHApLFxuXHRcdFx0XHRcdG5vZGUgPSB0LFxuXHRcdFx0XHRcdHN0eWxlID0gX3RlbXBEaXYuc3R5bGUsXG5cdFx0XHRcdFx0bmVnID0gKHYgPCAwKSxcblx0XHRcdFx0XHRwcmVjaXNlID0gKHYgPT09IDEpLFxuXHRcdFx0XHRcdHBpeCwgY2FjaGUsIHRpbWU7XG5cdFx0XHRcdGlmIChuZWcpIHtcblx0XHRcdFx0XHR2ID0gLXY7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHByZWNpc2UpIHtcblx0XHRcdFx0XHR2ICo9IDEwMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc2Z4ID09PSBcIiVcIiAmJiBwLmluZGV4T2YoXCJib3JkZXJcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0cGl4ID0gKHYgLyAxMDApICogKGhvcml6ID8gdC5jbGllbnRXaWR0aCA6IHQuY2xpZW50SGVpZ2h0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdHlsZS5jc3NUZXh0ID0gXCJib3JkZXI6MCBzb2xpZCByZWQ7cG9zaXRpb246XCIgKyBfZ2V0U3R5bGUodCwgXCJwb3NpdGlvblwiKSArIFwiO2xpbmUtaGVpZ2h0OjA7XCI7XG5cdFx0XHRcdFx0aWYgKHNmeCA9PT0gXCIlXCIgfHwgIW5vZGUuYXBwZW5kQ2hpbGQgfHwgc2Z4LmNoYXJBdCgwKSA9PT0gXCJ2XCIgfHwgc2Z4ID09PSBcInJlbVwiKSB7XG5cdFx0XHRcdFx0XHRub2RlID0gdC5wYXJlbnROb2RlIHx8IF9kb2MuYm9keTtcblx0XHRcdFx0XHRcdGNhY2hlID0gbm9kZS5fZ3NDYWNoZTtcblx0XHRcdFx0XHRcdHRpbWUgPSBUd2VlbkxpdGUudGlja2VyLmZyYW1lO1xuXHRcdFx0XHRcdFx0aWYgKGNhY2hlICYmIGhvcml6ICYmIGNhY2hlLnRpbWUgPT09IHRpbWUpIHsgLy9wZXJmb3JtYW5jZSBvcHRpbWl6YXRpb246IHdlIHJlY29yZCB0aGUgd2lkdGggb2YgZWxlbWVudHMgYWxvbmcgd2l0aCB0aGUgdGlja2VyIGZyYW1lIHNvIHRoYXQgd2UgY2FuIHF1aWNrbHkgZ2V0IGl0IGFnYWluIG9uIHRoZSBzYW1lIHRpY2sgKHNlZW1zIHJlbGF0aXZlbHkgc2FmZSB0byBhc3N1bWUgaXQgd291bGRuJ3QgY2hhbmdlIG9uIHRoZSBzYW1lIHRpY2spXG5cdFx0XHRcdFx0XHRcdHJldHVybiBjYWNoZS53aWR0aCAqIHYgLyAxMDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzdHlsZVsoaG9yaXogPyBcIndpZHRoXCIgOiBcImhlaWdodFwiKV0gPSB2ICsgc2Z4O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzdHlsZVsoaG9yaXogPyBcImJvcmRlckxlZnRXaWR0aFwiIDogXCJib3JkZXJUb3BXaWR0aFwiKV0gPSB2ICsgc2Z4O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRub2RlLmFwcGVuZENoaWxkKF90ZW1wRGl2KTtcblx0XHRcdFx0XHRwaXggPSBwYXJzZUZsb2F0KF90ZW1wRGl2Wyhob3JpeiA/IFwib2Zmc2V0V2lkdGhcIiA6IFwib2Zmc2V0SGVpZ2h0XCIpXSk7XG5cdFx0XHRcdFx0bm9kZS5yZW1vdmVDaGlsZChfdGVtcERpdik7XG5cdFx0XHRcdFx0aWYgKGhvcml6ICYmIHNmeCA9PT0gXCIlXCIgJiYgQ1NTUGx1Z2luLmNhY2hlV2lkdGhzICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0Y2FjaGUgPSBub2RlLl9nc0NhY2hlID0gbm9kZS5fZ3NDYWNoZSB8fCB7fTtcblx0XHRcdFx0XHRcdGNhY2hlLnRpbWUgPSB0aW1lO1xuXHRcdFx0XHRcdFx0Y2FjaGUud2lkdGggPSBwaXggLyB2ICogMTAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocGl4ID09PSAwICYmICFyZWN1cnNlKSB7XG5cdFx0XHRcdFx0XHRwaXggPSBfY29udmVydFRvUGl4ZWxzKHQsIHAsIHYsIHNmeCwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwcmVjaXNlKSB7XG5cdFx0XHRcdFx0cGl4IC89IDEwMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbmVnID8gLXBpeCA6IHBpeDtcblx0XHRcdH0sXG5cdFx0XHRfY2FsY3VsYXRlT2Zmc2V0ID0gX2ludGVybmFscy5jYWxjdWxhdGVPZmZzZXQgPSBmdW5jdGlvbih0LCBwLCBjcykgeyAvL2ZvciBmaWd1cmluZyBvdXQgXCJ0b3BcIiBvciBcImxlZnRcIiBpbiBweCB3aGVuIGl0J3MgXCJhdXRvXCIuIFdlIG5lZWQgdG8gZmFjdG9yIGluIG1hcmdpbiB3aXRoIHRoZSBvZmZzZXRMZWZ0L29mZnNldFRvcFxuXHRcdFx0XHRpZiAoX2dldFN0eWxlKHQsIFwicG9zaXRpb25cIiwgY3MpICE9PSBcImFic29sdXRlXCIpIHsgcmV0dXJuIDA7IH1cblx0XHRcdFx0dmFyIGRpbSA9ICgocCA9PT0gXCJsZWZ0XCIpID8gXCJMZWZ0XCIgOiBcIlRvcFwiKSxcblx0XHRcdFx0XHR2ID0gX2dldFN0eWxlKHQsIFwibWFyZ2luXCIgKyBkaW0sIGNzKTtcblx0XHRcdFx0cmV0dXJuIHRbXCJvZmZzZXRcIiArIGRpbV0gLSAoX2NvbnZlcnRUb1BpeGVscyh0LCBwLCBwYXJzZUZsb2F0KHYpLCB2LnJlcGxhY2UoX3N1ZmZpeEV4cCwgXCJcIikpIHx8IDApO1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gQHByaXZhdGUgcmV0dXJucyBhdCBvYmplY3QgY29udGFpbmluZyBBTEwgb2YgdGhlIHN0eWxlIHByb3BlcnRpZXMgaW4gY2FtZWxDYXNlIGFuZCB0aGVpciBhc3NvY2lhdGVkIHZhbHVlcy5cblx0XHRcdF9nZXRBbGxTdHlsZXMgPSBmdW5jdGlvbih0LCBjcykge1xuXHRcdFx0XHR2YXIgcyA9IHt9LFxuXHRcdFx0XHRcdGksIHRyLCBwO1xuXHRcdFx0XHRpZiAoKGNzID0gY3MgfHwgX2dldENvbXB1dGVkU3R5bGUodCwgbnVsbCkpKSB7XG5cdFx0XHRcdFx0aWYgKChpID0gY3MubGVuZ3RoKSkge1xuXHRcdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHAgPSBjc1tpXTtcblx0XHRcdFx0XHRcdFx0aWYgKHAuaW5kZXhPZihcIi10cmFuc2Zvcm1cIikgPT09IC0xIHx8IF90cmFuc2Zvcm1Qcm9wQ1NTID09PSBwKSB7IC8vU29tZSB3ZWJraXQgYnJvd3NlcnMgZHVwbGljYXRlIHRyYW5zZm9ybSB2YWx1ZXMsIG9uZSBub24tcHJlZml4ZWQgYW5kIG9uZSBwcmVmaXhlZCAoXCJ0cmFuc2Zvcm1cIiBhbmQgXCJXZWJraXRUcmFuc2Zvcm1cIiksIHNvIHdlIG11c3Qgd2VlZCBvdXQgdGhlIGV4dHJhIG9uZSBoZXJlLlxuXHRcdFx0XHRcdFx0XHRcdHNbcC5yZXBsYWNlKF9jYW1lbEV4cCwgX2NhbWVsRnVuYyldID0gY3MuZ2V0UHJvcGVydHlWYWx1ZShwKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7IC8vc29tZSBicm93c2VycyBiZWhhdmUgZGlmZmVyZW50bHkgLSBjcy5sZW5ndGggaXMgYWx3YXlzIDAsIHNvIHdlIG11c3QgZG8gYSBmb3IuLi5pbiBsb29wLlxuXHRcdFx0XHRcdFx0Zm9yIChpIGluIGNzKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChpLmluZGV4T2YoXCJUcmFuc2Zvcm1cIikgPT09IC0xIHx8IF90cmFuc2Zvcm1Qcm9wID09PSBpKSB7IC8vU29tZSB3ZWJraXQgYnJvd3NlcnMgZHVwbGljYXRlIHRyYW5zZm9ybSB2YWx1ZXMsIG9uZSBub24tcHJlZml4ZWQgYW5kIG9uZSBwcmVmaXhlZCAoXCJ0cmFuc2Zvcm1cIiBhbmQgXCJXZWJraXRUcmFuc2Zvcm1cIiksIHNvIHdlIG11c3Qgd2VlZCBvdXQgdGhlIGV4dHJhIG9uZSBoZXJlLlxuXHRcdFx0XHRcdFx0XHRcdHNbaV0gPSBjc1tpXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICgoY3MgPSB0LmN1cnJlbnRTdHlsZSB8fCB0LnN0eWxlKSkge1xuXHRcdFx0XHRcdGZvciAoaSBpbiBjcykge1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZihpKSA9PT0gXCJzdHJpbmdcIiAmJiBzW2ldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0c1tpLnJlcGxhY2UoX2NhbWVsRXhwLCBfY2FtZWxGdW5jKV0gPSBjc1tpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFfc3VwcG9ydHNPcGFjaXR5KSB7XG5cdFx0XHRcdFx0cy5vcGFjaXR5ID0gX2dldElFT3BhY2l0eSh0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0ciA9IF9nZXRUcmFuc2Zvcm0odCwgY3MsIGZhbHNlKTtcblx0XHRcdFx0cy5yb3RhdGlvbiA9IHRyLnJvdGF0aW9uO1xuXHRcdFx0XHRzLnNrZXdYID0gdHIuc2tld1g7XG5cdFx0XHRcdHMuc2NhbGVYID0gdHIuc2NhbGVYO1xuXHRcdFx0XHRzLnNjYWxlWSA9IHRyLnNjYWxlWTtcblx0XHRcdFx0cy54ID0gdHIueDtcblx0XHRcdFx0cy55ID0gdHIueTtcblx0XHRcdFx0aWYgKF9zdXBwb3J0czNEKSB7XG5cdFx0XHRcdFx0cy56ID0gdHIuejtcblx0XHRcdFx0XHRzLnJvdGF0aW9uWCA9IHRyLnJvdGF0aW9uWDtcblx0XHRcdFx0XHRzLnJvdGF0aW9uWSA9IHRyLnJvdGF0aW9uWTtcblx0XHRcdFx0XHRzLnNjYWxlWiA9IHRyLnNjYWxlWjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocy5maWx0ZXJzKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHMuZmlsdGVycztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcztcblx0XHRcdH0sXG5cblx0XHRcdC8vIEBwcml2YXRlIGFuYWx5emVzIHR3byBzdHlsZSBvYmplY3RzIChhcyByZXR1cm5lZCBieSBfZ2V0QWxsU3R5bGVzKCkpIGFuZCBvbmx5IGxvb2tzIGZvciBkaWZmZXJlbmNlcyBiZXR3ZWVuIHRoZW0gdGhhdCBjb250YWluIHR3ZWVuYWJsZSB2YWx1ZXMgKGxpa2UgYSBudW1iZXIgb3IgY29sb3IpLiBJdCByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGEgXCJkaWZzXCIgcHJvcGVydHkgd2hpY2ggcmVmZXJzIHRvIGFuIG9iamVjdCBjb250YWluaW5nIG9ubHkgdGhvc2UgaXNvbGF0ZWQgcHJvcGVydGllcyBhbmQgdmFsdWVzIGZvciB0d2VlbmluZywgYW5kIGEgXCJmaXJzdE1QVFwiIHByb3BlcnR5IHdoaWNoIHJlZmVycyB0byB0aGUgZmlyc3QgTWluaVByb3BUd2VlbiBpbnN0YW5jZSBpbiBhIGxpbmtlZCBsaXN0IHRoYXQgcmVjb3JkZWQgYWxsIHRoZSBzdGFydGluZyB2YWx1ZXMgb2YgdGhlIGRpZmZlcmVudCBwcm9wZXJ0aWVzIHNvIHRoYXQgd2UgY2FuIHJldmVydCB0byB0aGVtIGF0IHRoZSBlbmQgb3IgYmVnaW5uaW5nIG9mIHRoZSB0d2VlbiAtIHdlIGRvbid0IHdhbnQgdGhlIGNhc2NhZGluZyB0byBnZXQgbWVzc2VkIHVwLiBUaGUgZm9yY2VMb29rdXAgcGFyYW1ldGVyIGlzIGFuIG9wdGlvbmFsIGdlbmVyaWMgb2JqZWN0IHdpdGggcHJvcGVydGllcyB0aGF0IHNob3VsZCBiZSBmb3JjZWQgaW50byB0aGUgcmVzdWx0cyAtIHRoaXMgaXMgbmVjZXNzYXJ5IGZvciBjbGFzc05hbWUgdHdlZW5zIHRoYXQgYXJlIG92ZXJ3cml0aW5nIG90aGVycyBiZWNhdXNlIGltYWdpbmUgYSBzY2VuYXJpbyB3aGVyZSBhIHJvbGxvdmVyL3JvbGxvdXQgYWRkcy9yZW1vdmVzIGEgY2xhc3MgYW5kIHRoZSB1c2VyIHN3aXBlcyB0aGUgbW91c2Ugb3ZlciB0aGUgdGFyZ2V0IFNVUEVSIGZhc3QsIHRodXMgbm90aGluZyBhY3R1YWxseSBjaGFuZ2VkIHlldCBhbmQgdGhlIHN1YnNlcXVlbnQgY29tcGFyaXNvbiBvZiB0aGUgcHJvcGVydGllcyB3b3VsZCBpbmRpY2F0ZSB0aGV5IG1hdGNoIChlc3BlY2lhbGx5IHdoZW4gcHggcm91bmRpbmcgaXMgdGFrZW4gaW50byBjb25zaWRlcmF0aW9uKSwgdGh1cyBubyB0d2VlbmluZyBpcyBuZWNlc3NhcnkgZXZlbiB0aG91Z2ggaXQgU0hPVUxEIHR3ZWVuIGFuZCByZW1vdmUgdGhvc2UgcHJvcGVydGllcyBhZnRlciB0aGUgdHdlZW4gKG90aGVyd2lzZSB0aGUgaW5saW5lIHN0eWxlcyB3aWxsIGNvbnRhbWluYXRlIHRoaW5ncykuIFNlZSB0aGUgY2xhc3NOYW1lIFNwZWNpYWxQcm9wIGNvZGUgZm9yIGRldGFpbHMuXG5cdFx0XHRfY3NzRGlmID0gZnVuY3Rpb24odCwgczEsIHMyLCB2YXJzLCBmb3JjZUxvb2t1cCkge1xuXHRcdFx0XHR2YXIgZGlmcyA9IHt9LFxuXHRcdFx0XHRcdHN0eWxlID0gdC5zdHlsZSxcblx0XHRcdFx0XHR2YWwsIHAsIG1wdDtcblx0XHRcdFx0Zm9yIChwIGluIHMyKSB7XG5cdFx0XHRcdFx0aWYgKHAgIT09IFwiY3NzVGV4dFwiKSBpZiAocCAhPT0gXCJsZW5ndGhcIikgaWYgKGlzTmFOKHApKSBpZiAoczFbcF0gIT09ICh2YWwgPSBzMltwXSkgfHwgKGZvcmNlTG9va3VwICYmIGZvcmNlTG9va3VwW3BdKSkgaWYgKHAuaW5kZXhPZihcIk9yaWdpblwiKSA9PT0gLTEpIGlmICh0eXBlb2YodmFsKSA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YodmFsKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRcdFx0ZGlmc1twXSA9ICh2YWwgPT09IFwiYXV0b1wiICYmIChwID09PSBcImxlZnRcIiB8fCBwID09PSBcInRvcFwiKSkgPyBfY2FsY3VsYXRlT2Zmc2V0KHQsIHApIDogKCh2YWwgPT09IFwiXCIgfHwgdmFsID09PSBcImF1dG9cIiB8fCB2YWwgPT09IFwibm9uZVwiKSAmJiB0eXBlb2YoczFbcF0pID09PSBcInN0cmluZ1wiICYmIHMxW3BdLnJlcGxhY2UoX05hTkV4cCwgXCJcIikgIT09IFwiXCIpID8gMCA6IHZhbDsgLy9pZiB0aGUgZW5kaW5nIHZhbHVlIGlzIGRlZmF1bHRpbmcgKFwiXCIgb3IgXCJhdXRvXCIpLCB3ZSBjaGVjayB0aGUgc3RhcnRpbmcgdmFsdWUgYW5kIGlmIGl0IGNhbiBiZSBwYXJzZWQgaW50byBhIG51bWJlciAoYSBzdHJpbmcgd2hpY2ggY291bGQgaGF2ZSBhIHN1ZmZpeCB0b28sIGxpa2UgNzAwcHgpLCB0aGVuIHdlIHN3YXAgaW4gMCBmb3IgXCJcIiBvciBcImF1dG9cIiBzbyB0aGF0IHRoaW5ncyBhY3R1YWxseSB0d2Vlbi5cblx0XHRcdFx0XHRcdGlmIChzdHlsZVtwXSAhPT0gdW5kZWZpbmVkKSB7IC8vZm9yIGNsYXNzTmFtZSB0d2VlbnMsIHdlIG11c3QgcmVtZW1iZXIgd2hpY2ggcHJvcGVydGllcyBhbHJlYWR5IGV4aXN0ZWQgaW5saW5lIC0gdGhlIG9uZXMgdGhhdCBkaWRuJ3Qgc2hvdWxkIGJlIHJlbW92ZWQgd2hlbiB0aGUgdHdlZW4gaXNuJ3QgaW4gcHJvZ3Jlc3MgYmVjYXVzZSB0aGV5IHdlcmUgb25seSBpbnRyb2R1Y2VkIHRvIGZhY2lsaXRhdGUgdGhlIHRyYW5zaXRpb24gYmV0d2VlbiBjbGFzc2VzLlxuXHRcdFx0XHRcdFx0XHRtcHQgPSBuZXcgTWluaVByb3BUd2VlbihzdHlsZSwgcCwgc3R5bGVbcF0sIG1wdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2YXJzKSB7XG5cdFx0XHRcdFx0Zm9yIChwIGluIHZhcnMpIHsgLy9jb3B5IHByb3BlcnRpZXMgKGV4Y2VwdCBjbGFzc05hbWUpXG5cdFx0XHRcdFx0XHRpZiAocCAhPT0gXCJjbGFzc05hbWVcIikge1xuXHRcdFx0XHRcdFx0XHRkaWZzW3BdID0gdmFyc1twXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHtkaWZzOmRpZnMsIGZpcnN0TVBUOm1wdH07XG5cdFx0XHR9LFxuXHRcdFx0X2RpbWVuc2lvbnMgPSB7d2lkdGg6W1wiTGVmdFwiLFwiUmlnaHRcIl0sIGhlaWdodDpbXCJUb3BcIixcIkJvdHRvbVwiXX0sXG5cdFx0XHRfbWFyZ2lucyA9IFtcIm1hcmdpbkxlZnRcIixcIm1hcmdpblJpZ2h0XCIsXCJtYXJnaW5Ub3BcIixcIm1hcmdpbkJvdHRvbVwiXSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZSBHZXRzIHRoZSB3aWR0aCBvciBoZWlnaHQgb2YgYW4gZWxlbWVudFxuXHRcdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IFRhcmdldCBlbGVtZW50XG5cdFx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IHAgUHJvcGVydHkgbmFtZSAoXCJ3aWR0aFwiIG9yIFwiaGVpZ2h0XCIpXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdD19IGNzIENvbXB1dGVkIHN0eWxlIG9iamVjdCAoaWYgb25lIGV4aXN0cykuIEp1c3QgYSBzcGVlZCBvcHRpbWl6YXRpb24uXG5cdFx0XHQgKiBAcmV0dXJuIHtudW1iZXJ9IERpbWVuc2lvbiAoaW4gcGl4ZWxzKVxuXHRcdFx0ICovXG5cdFx0XHRfZ2V0RGltZW5zaW9uID0gZnVuY3Rpb24odCwgcCwgY3MpIHtcblx0XHRcdFx0aWYgKCh0Lm5vZGVOYW1lICsgXCJcIikudG9Mb3dlckNhc2UoKSA9PT0gXCJzdmdcIikgeyAvL0Nocm9tZSBubyBsb25nZXIgc3VwcG9ydHMgb2Zmc2V0V2lkdGgvb2Zmc2V0SGVpZ2h0IG9uIFNWRyBlbGVtZW50cy5cblx0XHRcdFx0XHRyZXR1cm4gKGNzIHx8IF9nZXRDb21wdXRlZFN0eWxlKHQpKVtwXSB8fCAwO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHQuZ2V0QkJveCAmJiBfaXNTVkcodCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gdC5nZXRCQm94KClbcF0gfHwgMDtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgdiA9IHBhcnNlRmxvYXQoKHAgPT09IFwid2lkdGhcIikgPyB0Lm9mZnNldFdpZHRoIDogdC5vZmZzZXRIZWlnaHQpLFxuXHRcdFx0XHRcdGEgPSBfZGltZW5zaW9uc1twXSxcblx0XHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdGNzID0gY3MgfHwgX2dldENvbXB1dGVkU3R5bGUodCwgbnVsbCk7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdHYgLT0gcGFyc2VGbG9hdCggX2dldFN0eWxlKHQsIFwicGFkZGluZ1wiICsgYVtpXSwgY3MsIHRydWUpICkgfHwgMDtcblx0XHRcdFx0XHR2IC09IHBhcnNlRmxvYXQoIF9nZXRTdHlsZSh0LCBcImJvcmRlclwiICsgYVtpXSArIFwiV2lkdGhcIiwgY3MsIHRydWUpICkgfHwgMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdjtcblx0XHRcdH0sXG5cblx0XHRcdC8vIEBwcml2YXRlIFBhcnNlcyBwb3NpdGlvbi1yZWxhdGVkIGNvbXBsZXggc3RyaW5ncyBsaWtlIFwidG9wIGxlZnRcIiBvciBcIjUwcHggMTBweFwiIG9yIFwiNzAlIDIwJVwiLCBldGMuIHdoaWNoIGFyZSB1c2VkIGZvciB0aGluZ3MgbGlrZSB0cmFuc2Zvcm1PcmlnaW4gb3IgYmFja2dyb3VuZFBvc2l0aW9uLiBPcHRpb25hbGx5IGRlY29yYXRlcyBhIHN1cHBsaWVkIG9iamVjdCAocmVjT2JqKSB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczogXCJveFwiIChvZmZzZXRYKSwgXCJveVwiIChvZmZzZXRZKSwgXCJveHBcIiAoaWYgdHJ1ZSwgXCJveFwiIGlzIGEgcGVyY2VudGFnZSBub3QgYSBwaXhlbCB2YWx1ZSksIGFuZCBcIm94eVwiIChpZiB0cnVlLCBcIm95XCIgaXMgYSBwZXJjZW50YWdlIG5vdCBhIHBpeGVsIHZhbHVlKVxuXHRcdFx0X3BhcnNlUG9zaXRpb24gPSBmdW5jdGlvbih2LCByZWNPYmopIHtcblx0XHRcdFx0aWYgKHYgPT09IFwiY29udGFpblwiIHx8IHYgPT09IFwiYXV0b1wiIHx8IHYgPT09IFwiYXV0byBhdXRvXCIpIHsgLy9ub3RlOiBGaXJlZm94IHVzZXMgXCJhdXRvIGF1dG9cIiBhcyBkZWZhdWx0IHdoZXJlYXMgQ2hyb21lIHVzZXMgXCJhdXRvXCIuXG5cdFx0XHRcdFx0cmV0dXJuIHYgKyBcIiBcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodiA9PSBudWxsIHx8IHYgPT09IFwiXCIpIHtcblx0XHRcdFx0XHR2ID0gXCIwIDBcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgYSA9IHYuc3BsaXQoXCIgXCIpLFxuXHRcdFx0XHRcdHggPSAodi5pbmRleE9mKFwibGVmdFwiKSAhPT0gLTEpID8gXCIwJVwiIDogKHYuaW5kZXhPZihcInJpZ2h0XCIpICE9PSAtMSkgPyBcIjEwMCVcIiA6IGFbMF0sXG5cdFx0XHRcdFx0eSA9ICh2LmluZGV4T2YoXCJ0b3BcIikgIT09IC0xKSA/IFwiMCVcIiA6ICh2LmluZGV4T2YoXCJib3R0b21cIikgIT09IC0xKSA/IFwiMTAwJVwiIDogYVsxXSxcblx0XHRcdFx0XHRpO1xuXHRcdFx0XHRpZiAoYS5sZW5ndGggPiAzICYmICFyZWNPYmopIHsgLy9tdWx0aXBsZSBwb3NpdGlvbnNcblx0XHRcdFx0XHRhID0gdi5zcGxpdChcIiwgXCIpLmpvaW4oXCIsXCIpLnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0XHR2ID0gW107XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdHYucHVzaChfcGFyc2VQb3NpdGlvbihhW2ldKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB2LmpvaW4oXCIsXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh5ID09IG51bGwpIHtcblx0XHRcdFx0XHR5ID0gKHggPT09IFwiY2VudGVyXCIpID8gXCI1MCVcIiA6IFwiMFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHkgPT09IFwiY2VudGVyXCIpIHtcblx0XHRcdFx0XHR5ID0gXCI1MCVcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoeCA9PT0gXCJjZW50ZXJcIiB8fCAoaXNOYU4ocGFyc2VGbG9hdCh4KSkgJiYgKHggKyBcIlwiKS5pbmRleE9mKFwiPVwiKSA9PT0gLTEpKSB7IC8vcmVtZW1iZXIsIHRoZSB1c2VyIGNvdWxkIGZsaXAtZmxvcCB0aGUgdmFsdWVzIGFuZCBzYXkgXCJib3R0b20gY2VudGVyXCIgb3IgXCJjZW50ZXIgYm90dG9tXCIsIGV0Yy4gXCJjZW50ZXJcIiBpcyBhbWJpZ3VvdXMgYmVjYXVzZSBpdCBjb3VsZCBiZSB1c2VkIHRvIGRlc2NyaWJlIGhvcml6b250YWwgb3IgdmVydGljYWwsIGhlbmNlIHRoZSBpc05hTigpLiBJZiB0aGVyZSdzIGFuIFwiPVwiIHNpZ24gaW4gdGhlIHZhbHVlLCBpdCdzIHJlbGF0aXZlLlxuXHRcdFx0XHRcdHggPSBcIjUwJVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHYgPSB4ICsgXCIgXCIgKyB5ICsgKChhLmxlbmd0aCA+IDIpID8gXCIgXCIgKyBhWzJdIDogXCJcIik7XG5cdFx0XHRcdGlmIChyZWNPYmopIHtcblx0XHRcdFx0XHRyZWNPYmoub3hwID0gKHguaW5kZXhPZihcIiVcIikgIT09IC0xKTtcblx0XHRcdFx0XHRyZWNPYmoub3lwID0gKHkuaW5kZXhPZihcIiVcIikgIT09IC0xKTtcblx0XHRcdFx0XHRyZWNPYmoub3hyID0gKHguY2hhckF0KDEpID09PSBcIj1cIik7XG5cdFx0XHRcdFx0cmVjT2JqLm95ciA9ICh5LmNoYXJBdCgxKSA9PT0gXCI9XCIpO1xuXHRcdFx0XHRcdHJlY09iai5veCA9IHBhcnNlRmxvYXQoeC5yZXBsYWNlKF9OYU5FeHAsIFwiXCIpKTtcblx0XHRcdFx0XHRyZWNPYmoub3kgPSBwYXJzZUZsb2F0KHkucmVwbGFjZShfTmFORXhwLCBcIlwiKSk7XG5cdFx0XHRcdFx0cmVjT2JqLnYgPSB2O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZWNPYmogfHwgdjtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgVGFrZXMgYW4gZW5kaW5nIHZhbHVlICh0eXBpY2FsbHkgYSBzdHJpbmcsIGJ1dCBjYW4gYmUgYSBudW1iZXIpIGFuZCBhIHN0YXJ0aW5nIHZhbHVlIGFuZCByZXR1cm5zIHRoZSBjaGFuZ2UgYmV0d2VlbiB0aGUgdHdvLCBsb29raW5nIGZvciByZWxhdGl2ZSB2YWx1ZSBpbmRpY2F0b3JzIGxpa2UgKz0gYW5kIC09IGFuZCBpdCBhbHNvIGlnbm9yZXMgc3VmZml4ZXMgKGJ1dCBtYWtlIHN1cmUgdGhlIGVuZGluZyB2YWx1ZSBzdGFydHMgd2l0aCBhIG51bWJlciBvciArPS8tPSBhbmQgdGhhdCB0aGUgc3RhcnRpbmcgdmFsdWUgaXMgYSBOVU1CRVIhKVxuXHRcdFx0ICogQHBhcmFtIHsobnVtYmVyfHN0cmluZyl9IGUgRW5kIHZhbHVlIHdoaWNoIGlzIHR5cGljYWxseSBhIHN0cmluZywgYnV0IGNvdWxkIGJlIGEgbnVtYmVyXG5cdFx0XHQgKiBAcGFyYW0geyhudW1iZXJ8c3RyaW5nKX0gYiBCZWdpbm5pbmcgdmFsdWUgd2hpY2ggaXMgdHlwaWNhbGx5IGEgc3RyaW5nIGJ1dCBjb3VsZCBiZSBhIG51bWJlclxuXHRcdFx0ICogQHJldHVybiB7bnVtYmVyfSBBbW91bnQgb2YgY2hhbmdlIGJldHdlZW4gdGhlIGJlZ2lubmluZyBhbmQgZW5kaW5nIHZhbHVlcyAocmVsYXRpdmUgdmFsdWVzIHRoYXQgaGF2ZSBhIFwiKz1cIiBvciBcIi09XCIgYXJlIHJlY29nbml6ZWQpXG5cdFx0XHQgKi9cblx0XHRcdF9wYXJzZUNoYW5nZSA9IGZ1bmN0aW9uKGUsIGIpIHtcblx0XHRcdFx0aWYgKHR5cGVvZihlKSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0ZSA9IGUoX2luZGV4LCBfdGFyZ2V0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gKHR5cGVvZihlKSA9PT0gXCJzdHJpbmdcIiAmJiBlLmNoYXJBdCgxKSA9PT0gXCI9XCIpID8gcGFyc2VJbnQoZS5jaGFyQXQoMCkgKyBcIjFcIiwgMTApICogcGFyc2VGbG9hdChlLnN1YnN0cigyKSkgOiAocGFyc2VGbG9hdChlKSAtIHBhcnNlRmxvYXQoYikpIHx8IDA7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIFRha2VzIGEgdmFsdWUgYW5kIGEgZGVmYXVsdCBudW1iZXIsIGNoZWNrcyBpZiB0aGUgdmFsdWUgaXMgcmVsYXRpdmUsIG51bGwsIG9yIG51bWVyaWMgYW5kIHNwaXRzIGJhY2sgYSBub3JtYWxpemVkIG51bWJlciBhY2NvcmRpbmdseS4gUHJpbWFyaWx5IHVzZWQgaW4gdGhlIF9wYXJzZVRyYW5zZm9ybSgpIGZ1bmN0aW9uLlxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IHYgVmFsdWUgdG8gYmUgcGFyc2VkXG5cdFx0XHQgKiBAcGFyYW0geyFudW1iZXJ9IGQgRGVmYXVsdCB2YWx1ZSAod2hpY2ggaXMgYWxzbyB1c2VkIGZvciByZWxhdGl2ZSBjYWxjdWxhdGlvbnMgaWYgXCIrPVwiIG9yIFwiLT1cIiBpcyBmb3VuZCBpbiB0aGUgZmlyc3QgcGFyYW1ldGVyKVxuXHRcdFx0ICogQHJldHVybiB7bnVtYmVyfSBQYXJzZWQgdmFsdWVcblx0XHRcdCAqL1xuXHRcdFx0X3BhcnNlVmFsID0gZnVuY3Rpb24odiwgZCkge1xuXHRcdFx0XHRpZiAodHlwZW9mKHYpID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHR2ID0gdihfaW5kZXgsIF90YXJnZXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAodiA9PSBudWxsKSA/IGQgOiAodHlwZW9mKHYpID09PSBcInN0cmluZ1wiICYmIHYuY2hhckF0KDEpID09PSBcIj1cIikgPyBwYXJzZUludCh2LmNoYXJBdCgwKSArIFwiMVwiLCAxMCkgKiBwYXJzZUZsb2F0KHYuc3Vic3RyKDIpKSArIGQgOiBwYXJzZUZsb2F0KHYpIHx8IDA7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIFRyYW5zbGF0ZXMgc3RyaW5ncyBsaWtlIFwiNDBkZWdcIiBvciBcIjQwXCIgb3IgNDByYWRcIiBvciBcIis9NDBkZWdcIiBvciBcIjI3MF9zaG9ydFwiIG9yIFwiLTkwX2N3XCIgb3IgXCIrPTQ1X2Njd1wiIHRvIGEgbnVtZXJpYyByYWRpYW4gYW5nbGUuIE9mIGNvdXJzZSBhIHN0YXJ0aW5nL2RlZmF1bHQgdmFsdWUgbXVzdCBiZSBmZWQgaW4gdG9vIHNvIHRoYXQgcmVsYXRpdmUgdmFsdWVzIGNhbiBiZSBjYWxjdWxhdGVkIHByb3Blcmx5LlxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IHYgVmFsdWUgdG8gYmUgcGFyc2VkXG5cdFx0XHQgKiBAcGFyYW0geyFudW1iZXJ9IGQgRGVmYXVsdCB2YWx1ZSAod2hpY2ggaXMgYWxzbyB1c2VkIGZvciByZWxhdGl2ZSBjYWxjdWxhdGlvbnMgaWYgXCIrPVwiIG9yIFwiLT1cIiBpcyBmb3VuZCBpbiB0aGUgZmlyc3QgcGFyYW1ldGVyKVxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBwIHByb3BlcnR5IG5hbWUgZm9yIGRpcmVjdGlvbmFsRW5kIChvcHRpb25hbCAtIG9ubHkgdXNlZCB3aGVuIHRoZSBwYXJzZWQgdmFsdWUgaXMgZGlyZWN0aW9uYWwgKFwiX3Nob3J0XCIsIFwiX2N3XCIsIG9yIFwiX2Njd1wiIHN1ZmZpeCkuIFdlIG5lZWQgYSB3YXkgdG8gc3RvcmUgdGhlIHVuY29tcGVuc2F0ZWQgdmFsdWUgc28gdGhhdCBhdCB0aGUgZW5kIG9mIHRoZSB0d2Vlbiwgd2Ugc2V0IGl0IHRvIGV4YWN0bHkgd2hhdCB3YXMgcmVxdWVzdGVkIHdpdGggbm8gZGlyZWN0aW9uYWwgY29tcGVuc2F0aW9uKS4gUHJvcGVydHkgbmFtZSB3b3VsZCBiZSBcInJvdGF0aW9uXCIsIFwicm90YXRpb25YXCIsIG9yIFwicm90YXRpb25ZXCJcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0PX0gZGlyZWN0aW9uYWxFbmQgQW4gb2JqZWN0IHRoYXQgd2lsbCBzdG9yZSB0aGUgcmF3IGVuZCB2YWx1ZXMgZm9yIGRpcmVjdGlvbmFsIGFuZ2xlcyAoXCJfc2hvcnRcIiwgXCJfY3dcIiwgb3IgXCJfY2N3XCIgc3VmZml4KS4gV2UgbmVlZCBhIHdheSB0byBzdG9yZSB0aGUgdW5jb21wZW5zYXRlZCB2YWx1ZSBzbyB0aGF0IGF0IHRoZSBlbmQgb2YgdGhlIHR3ZWVuLCB3ZSBzZXQgaXQgdG8gZXhhY3RseSB3aGF0IHdhcyByZXF1ZXN0ZWQgd2l0aCBubyBkaXJlY3Rpb25hbCBjb21wZW5zYXRpb24uXG5cdFx0XHQgKiBAcmV0dXJuIHtudW1iZXJ9IHBhcnNlZCBhbmdsZSBpbiByYWRpYW5zXG5cdFx0XHQgKi9cblx0XHRcdF9wYXJzZUFuZ2xlID0gZnVuY3Rpb24odiwgZCwgcCwgZGlyZWN0aW9uYWxFbmQpIHtcblx0XHRcdFx0dmFyIG1pbiA9IDAuMDAwMDAxLFxuXHRcdFx0XHRcdGNhcCwgc3BsaXQsIGRpZiwgcmVzdWx0LCBpc1JlbGF0aXZlO1xuXHRcdFx0XHRpZiAodHlwZW9mKHYpID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHR2ID0gdihfaW5kZXgsIF90YXJnZXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2ID09IG51bGwpIHtcblx0XHRcdFx0XHRyZXN1bHQgPSBkO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZih2KSA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdHJlc3VsdCA9IHY7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2FwID0gMzYwO1xuXHRcdFx0XHRcdHNwbGl0ID0gdi5zcGxpdChcIl9cIik7XG5cdFx0XHRcdFx0aXNSZWxhdGl2ZSA9ICh2LmNoYXJBdCgxKSA9PT0gXCI9XCIpO1xuXHRcdFx0XHRcdGRpZiA9IChpc1JlbGF0aXZlID8gcGFyc2VJbnQodi5jaGFyQXQoMCkgKyBcIjFcIiwgMTApICogcGFyc2VGbG9hdChzcGxpdFswXS5zdWJzdHIoMikpIDogcGFyc2VGbG9hdChzcGxpdFswXSkpICogKCh2LmluZGV4T2YoXCJyYWRcIikgPT09IC0xKSA/IDEgOiBfUkFEMkRFRykgLSAoaXNSZWxhdGl2ZSA/IDAgOiBkKTtcblx0XHRcdFx0XHRpZiAoc3BsaXQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRpZiAoZGlyZWN0aW9uYWxFbmQpIHtcblx0XHRcdFx0XHRcdFx0ZGlyZWN0aW9uYWxFbmRbcF0gPSBkICsgZGlmO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHYuaW5kZXhPZihcInNob3J0XCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRkaWYgPSBkaWYgJSBjYXA7XG5cdFx0XHRcdFx0XHRcdGlmIChkaWYgIT09IGRpZiAlIChjYXAgLyAyKSkge1xuXHRcdFx0XHRcdFx0XHRcdGRpZiA9IChkaWYgPCAwKSA/IGRpZiArIGNhcCA6IGRpZiAtIGNhcDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHYuaW5kZXhPZihcIl9jd1wiKSAhPT0gLTEgJiYgZGlmIDwgMCkge1xuXHRcdFx0XHRcdFx0XHRkaWYgPSAoKGRpZiArIGNhcCAqIDk5OTk5OTk5OTkpICUgY2FwKSAtICgoZGlmIC8gY2FwKSB8IDApICogY2FwO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh2LmluZGV4T2YoXCJjY3dcIikgIT09IC0xICYmIGRpZiA+IDApIHtcblx0XHRcdFx0XHRcdFx0ZGlmID0gKChkaWYgLSBjYXAgKiA5OTk5OTk5OTk5KSAlIGNhcCkgLSAoKGRpZiAvIGNhcCkgfCAwKSAqIGNhcDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzdWx0ID0gZCArIGRpZjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocmVzdWx0IDwgbWluICYmIHJlc3VsdCA+IC1taW4pIHtcblx0XHRcdFx0XHRyZXN1bHQgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9LFxuXG5cdFx0XHRfY29sb3JMb29rdXAgPSB7YXF1YTpbMCwyNTUsMjU1XSxcblx0XHRcdFx0bGltZTpbMCwyNTUsMF0sXG5cdFx0XHRcdHNpbHZlcjpbMTkyLDE5MiwxOTJdLFxuXHRcdFx0XHRibGFjazpbMCwwLDBdLFxuXHRcdFx0XHRtYXJvb246WzEyOCwwLDBdLFxuXHRcdFx0XHR0ZWFsOlswLDEyOCwxMjhdLFxuXHRcdFx0XHRibHVlOlswLDAsMjU1XSxcblx0XHRcdFx0bmF2eTpbMCwwLDEyOF0sXG5cdFx0XHRcdHdoaXRlOlsyNTUsMjU1LDI1NV0sXG5cdFx0XHRcdGZ1Y2hzaWE6WzI1NSwwLDI1NV0sXG5cdFx0XHRcdG9saXZlOlsxMjgsMTI4LDBdLFxuXHRcdFx0XHR5ZWxsb3c6WzI1NSwyNTUsMF0sXG5cdFx0XHRcdG9yYW5nZTpbMjU1LDE2NSwwXSxcblx0XHRcdFx0Z3JheTpbMTI4LDEyOCwxMjhdLFxuXHRcdFx0XHRwdXJwbGU6WzEyOCwwLDEyOF0sXG5cdFx0XHRcdGdyZWVuOlswLDEyOCwwXSxcblx0XHRcdFx0cmVkOlsyNTUsMCwwXSxcblx0XHRcdFx0cGluazpbMjU1LDE5MiwyMDNdLFxuXHRcdFx0XHRjeWFuOlswLDI1NSwyNTVdLFxuXHRcdFx0XHR0cmFuc3BhcmVudDpbMjU1LDI1NSwyNTUsMF19LFxuXG5cdFx0XHRfaHVlID0gZnVuY3Rpb24oaCwgbTEsIG0yKSB7XG5cdFx0XHRcdGggPSAoaCA8IDApID8gaCArIDEgOiAoaCA+IDEpID8gaCAtIDEgOiBoO1xuXHRcdFx0XHRyZXR1cm4gKCgoKGggKiA2IDwgMSkgPyBtMSArIChtMiAtIG0xKSAqIGggKiA2IDogKGggPCAwLjUpID8gbTIgOiAoaCAqIDMgPCAyKSA/IG0xICsgKG0yIC0gbTEpICogKDIgLyAzIC0gaCkgKiA2IDogbTEpICogMjU1KSArIDAuNSkgfCAwO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZSBQYXJzZXMgYSBjb2xvciAobGlrZSAjOUYwLCAjRkY5OTAwLCByZ2IoMjU1LDUxLDE1Mykgb3IgaHNsKDEwOCwgNTAlLCAxMCUpKSBpbnRvIGFuIGFycmF5IHdpdGggMyBlbGVtZW50cyBmb3IgcmVkLCBncmVlbiwgYW5kIGJsdWUgb3IgaWYgdG9IU0wgcGFyYW1ldGVyIGlzIHRydWUsIGl0IHdpbGwgcG9wdWxhdGUgdGhlIGFycmF5IHdpdGggaHVlLCBzYXR1cmF0aW9uLCBhbmQgbGlnaHRuZXNzIHZhbHVlcy4gSWYgYSByZWxhdGl2ZSB2YWx1ZSBpcyBmb3VuZCBpbiBhbiBoc2woKSBvciBoc2xhKCkgc3RyaW5nLCBpdCB3aWxsIHByZXNlcnZlIHRob3NlIHJlbGF0aXZlIHByZWZpeGVzIGFuZCBhbGwgdGhlIHZhbHVlcyBpbiB0aGUgYXJyYXkgd2lsbCBiZSBzdHJpbmdzIGluc3RlYWQgb2YgbnVtYmVycyAoaW4gYWxsIG90aGVyIGNhc2VzIGl0IHdpbGwgYmUgcG9wdWxhdGVkIHdpdGggbnVtYmVycykuXG5cdFx0XHQgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gdiBUaGUgdmFsdWUgdGhlIHNob3VsZCBiZSBwYXJzZWQgd2hpY2ggY291bGQgYmUgYSBzdHJpbmcgbGlrZSAjOUYwIG9yIHJnYigyNTUsMTAyLDUxKSBvciByZ2JhKDI1NSwwLDAsMC41KSBvciBpdCBjb3VsZCBiZSBhIG51bWJlciBsaWtlIDB4RkYwMENDIG9yIGV2ZW4gYSBuYW1lZCBjb2xvciBsaWtlIHJlZCwgYmx1ZSwgcHVycGxlLCBldGMuXG5cdFx0XHQgKiBAcGFyYW0geyhib29sZWFuKX0gdG9IU0wgSWYgdHJ1ZSwgYW4gaHNsKCkgb3IgaHNsYSgpIHZhbHVlIHdpbGwgYmUgcmV0dXJuZWQgaW5zdGVhZCBvZiByZ2IoKSBvciByZ2JhKClcblx0XHRcdCAqIEByZXR1cm4ge0FycmF5LjxudW1iZXI+fSBBbiBhcnJheSBjb250YWluaW5nIHJlZCwgZ3JlZW4sIGFuZCBibHVlIChhbmQgb3B0aW9uYWxseSBhbHBoYSkgaW4gdGhhdCBvcmRlciwgb3IgaWYgdGhlIHRvSFNMIHBhcmFtZXRlciB3YXMgdHJ1ZSwgdGhlIGFycmF5IHdpbGwgY29udGFpbiBodWUsIHNhdHVyYXRpb24gYW5kIGxpZ2h0bmVzcyAoYW5kIG9wdGlvbmFsbHkgYWxwaGEpIGluIHRoYXQgb3JkZXIuIEFsd2F5cyBudW1iZXJzIHVubGVzcyB0aGVyZSdzIGEgcmVsYXRpdmUgcHJlZml4IGZvdW5kIGluIGFuIGhzbCgpIG9yIGhzbGEoKSBzdHJpbmcgYW5kIHRvSFNMIGlzIHRydWUuXG5cdFx0XHQgKi9cblx0XHRcdF9wYXJzZUNvbG9yID0gQ1NTUGx1Z2luLnBhcnNlQ29sb3IgPSBmdW5jdGlvbih2LCB0b0hTTCkge1xuXHRcdFx0XHR2YXIgYSwgciwgZywgYiwgaCwgcywgbCwgbWF4LCBtaW4sIGQsIHdhc0hTTDtcblx0XHRcdFx0aWYgKCF2KSB7XG5cdFx0XHRcdFx0YSA9IF9jb2xvckxvb2t1cC5ibGFjaztcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YodikgPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0XHRhID0gW3YgPj4gMTYsICh2ID4+IDgpICYgMjU1LCB2ICYgMjU1XTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAodi5jaGFyQXQodi5sZW5ndGggLSAxKSA9PT0gXCIsXCIpIHsgLy9zb21ldGltZXMgYSB0cmFpbGluZyBjb21tYSBpcyBpbmNsdWRlZCBhbmQgd2Ugc2hvdWxkIGNob3AgaXQgb2ZmICh0eXBpY2FsbHkgZnJvbSBhIGNvbW1hLWRlbGltaXRlZCBsaXN0IG9mIHZhbHVlcyBsaWtlIGEgdGV4dFNoYWRvdzpcIjJweCAycHggMnB4IGJsdWUsIDVweCA1cHggNXB4IHJnYigyNTUsMCwwKVwiIC0gaW4gdGhpcyBleGFtcGxlIFwiYmx1ZSxcIiBoYXMgYSB0cmFpbGluZyBjb21tYS4gV2UgY291bGQgc3RyaXAgaXQgb3V0IGluc2lkZSBwYXJzZUNvbXBsZXgoKSBidXQgd2UnZCBuZWVkIHRvIGRvIGl0IHRvIHRoZSBiZWdpbm5pbmcgYW5kIGVuZGluZyB2YWx1ZXMgcGx1cyBpdCB3b3VsZG4ndCBwcm92aWRlIHByb3RlY3Rpb24gZnJvbSBvdGhlciBwb3RlbnRpYWwgc2NlbmFyaW9zIGxpa2UgaWYgdGhlIHVzZXIgcGFzc2VzIGluIGEgc2ltaWxhciB2YWx1ZS5cblx0XHRcdFx0XHRcdHYgPSB2LnN1YnN0cigwLCB2Lmxlbmd0aCAtIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoX2NvbG9yTG9va3VwW3ZdKSB7XG5cdFx0XHRcdFx0XHRhID0gX2NvbG9yTG9va3VwW3ZdO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodi5jaGFyQXQoMCkgPT09IFwiI1wiKSB7XG5cdFx0XHRcdFx0XHRpZiAodi5sZW5ndGggPT09IDQpIHsgLy9mb3Igc2hvcnRoYW5kIGxpa2UgIzlGMFxuXHRcdFx0XHRcdFx0XHRyID0gdi5jaGFyQXQoMSk7XG5cdFx0XHRcdFx0XHRcdGcgPSB2LmNoYXJBdCgyKTtcblx0XHRcdFx0XHRcdFx0YiA9IHYuY2hhckF0KDMpO1xuXHRcdFx0XHRcdFx0XHR2ID0gXCIjXCIgKyByICsgciArIGcgKyBnICsgYiArIGI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR2ID0gcGFyc2VJbnQodi5zdWJzdHIoMSksIDE2KTtcblx0XHRcdFx0XHRcdGEgPSBbdiA+PiAxNiwgKHYgPj4gOCkgJiAyNTUsIHYgJiAyNTVdO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodi5zdWJzdHIoMCwgMykgPT09IFwiaHNsXCIpIHtcblx0XHRcdFx0XHRcdGEgPSB3YXNIU0wgPSB2Lm1hdGNoKF9udW1FeHApO1xuXHRcdFx0XHRcdFx0aWYgKCF0b0hTTCkge1xuXHRcdFx0XHRcdFx0XHRoID0gKE51bWJlcihhWzBdKSAlIDM2MCkgLyAzNjA7XG5cdFx0XHRcdFx0XHRcdHMgPSBOdW1iZXIoYVsxXSkgLyAxMDA7XG5cdFx0XHRcdFx0XHRcdGwgPSBOdW1iZXIoYVsyXSkgLyAxMDA7XG5cdFx0XHRcdFx0XHRcdGcgPSAobCA8PSAwLjUpID8gbCAqIChzICsgMSkgOiBsICsgcyAtIGwgKiBzO1xuXHRcdFx0XHRcdFx0XHRyID0gbCAqIDIgLSBnO1xuXHRcdFx0XHRcdFx0XHRpZiAoYS5sZW5ndGggPiAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0YVszXSA9IE51bWJlcih2WzNdKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRhWzBdID0gX2h1ZShoICsgMSAvIDMsIHIsIGcpO1xuXHRcdFx0XHRcdFx0XHRhWzFdID0gX2h1ZShoLCByLCBnKTtcblx0XHRcdFx0XHRcdFx0YVsyXSA9IF9odWUoaCAtIDEgLyAzLCByLCBnKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodi5pbmRleE9mKFwiPVwiKSAhPT0gLTEpIHsgLy9pZiByZWxhdGl2ZSB2YWx1ZXMgYXJlIGZvdW5kLCBqdXN0IHJldHVybiB0aGUgcmF3IHN0cmluZ3Mgd2l0aCB0aGUgcmVsYXRpdmUgcHJlZml4ZXMgaW4gcGxhY2UuXG5cdFx0XHRcdFx0XHRcdHJldHVybiB2Lm1hdGNoKF9yZWxOdW1FeHApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRhID0gdi5tYXRjaChfbnVtRXhwKSB8fCBfY29sb3JMb29rdXAudHJhbnNwYXJlbnQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGFbMF0gPSBOdW1iZXIoYVswXSk7XG5cdFx0XHRcdFx0YVsxXSA9IE51bWJlcihhWzFdKTtcblx0XHRcdFx0XHRhWzJdID0gTnVtYmVyKGFbMl0pO1xuXHRcdFx0XHRcdGlmIChhLmxlbmd0aCA+IDMpIHtcblx0XHRcdFx0XHRcdGFbM10gPSBOdW1iZXIoYVszXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0b0hTTCAmJiAhd2FzSFNMKSB7XG5cdFx0XHRcdFx0ciA9IGFbMF0gLyAyNTU7XG5cdFx0XHRcdFx0ZyA9IGFbMV0gLyAyNTU7XG5cdFx0XHRcdFx0YiA9IGFbMl0gLyAyNTU7XG5cdFx0XHRcdFx0bWF4ID0gTWF0aC5tYXgociwgZywgYik7XG5cdFx0XHRcdFx0bWluID0gTWF0aC5taW4ociwgZywgYik7XG5cdFx0XHRcdFx0bCA9IChtYXggKyBtaW4pIC8gMjtcblx0XHRcdFx0XHRpZiAobWF4ID09PSBtaW4pIHtcblx0XHRcdFx0XHRcdGggPSBzID0gMDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZCA9IG1heCAtIG1pbjtcblx0XHRcdFx0XHRcdHMgPSBsID4gMC41ID8gZCAvICgyIC0gbWF4IC0gbWluKSA6IGQgLyAobWF4ICsgbWluKTtcblx0XHRcdFx0XHRcdGggPSAobWF4ID09PSByKSA/IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApIDogKG1heCA9PT0gZykgPyAoYiAtIHIpIC8gZCArIDIgOiAociAtIGcpIC8gZCArIDQ7XG5cdFx0XHRcdFx0XHRoICo9IDYwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhWzBdID0gKGggKyAwLjUpIHwgMDtcblx0XHRcdFx0XHRhWzFdID0gKHMgKiAxMDAgKyAwLjUpIHwgMDtcblx0XHRcdFx0XHRhWzJdID0gKGwgKiAxMDAgKyAwLjUpIHwgMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gYTtcblx0XHRcdH0sXG5cdFx0XHRfZm9ybWF0Q29sb3JzID0gZnVuY3Rpb24ocywgdG9IU0wpIHtcblx0XHRcdFx0dmFyIGNvbG9ycyA9IHMubWF0Y2goX2NvbG9yRXhwKSB8fCBbXSxcblx0XHRcdFx0XHRjaGFySW5kZXggPSAwLFxuXHRcdFx0XHRcdHBhcnNlZCA9IGNvbG9ycy5sZW5ndGggPyBcIlwiIDogcyxcblx0XHRcdFx0XHRpLCBjb2xvciwgdGVtcDtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGNvbG9ycy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGNvbG9yID0gY29sb3JzW2ldO1xuXHRcdFx0XHRcdHRlbXAgPSBzLnN1YnN0cihjaGFySW5kZXgsIHMuaW5kZXhPZihjb2xvciwgY2hhckluZGV4KS1jaGFySW5kZXgpO1xuXHRcdFx0XHRcdGNoYXJJbmRleCArPSB0ZW1wLmxlbmd0aCArIGNvbG9yLmxlbmd0aDtcblx0XHRcdFx0XHRjb2xvciA9IF9wYXJzZUNvbG9yKGNvbG9yLCB0b0hTTCk7XG5cdFx0XHRcdFx0aWYgKGNvbG9yLmxlbmd0aCA9PT0gMykge1xuXHRcdFx0XHRcdFx0Y29sb3IucHVzaCgxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cGFyc2VkICs9IHRlbXAgKyAodG9IU0wgPyBcImhzbGEoXCIgKyBjb2xvclswXSArIFwiLFwiICsgY29sb3JbMV0gKyBcIiUsXCIgKyBjb2xvclsyXSArIFwiJSxcIiArIGNvbG9yWzNdIDogXCJyZ2JhKFwiICsgY29sb3Iuam9pbihcIixcIikpICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHBhcnNlZCArIHMuc3Vic3RyKGNoYXJJbmRleCk7XG5cdFx0XHR9LFxuXHRcdFx0X2NvbG9yRXhwID0gXCIoPzpcXFxcYig/Oig/OnJnYnxyZ2JhfGhzbHxoc2xhKVxcXFwoLis/XFxcXCkpfFxcXFxCIyg/OlswLTlhLWZdezN9KXsxLDJ9XFxcXGJcIjsgLy93ZSdsbCBkeW5hbWljYWxseSBidWlsZCB0aGlzIFJlZ3VsYXIgRXhwcmVzc2lvbiB0byBjb25zZXJ2ZSBmaWxlIHNpemUuIEFmdGVyIGJ1aWxkaW5nIGl0LCBpdCB3aWxsIGJlIGFibGUgdG8gZmluZCByZ2IoKSwgcmdiYSgpLCAjIChoZXhhZGVjaW1hbCksIGFuZCBuYW1lZCBjb2xvciB2YWx1ZXMgbGlrZSByZWQsIGJsdWUsIHB1cnBsZSwgZXRjLlxuXG5cdFx0Zm9yIChwIGluIF9jb2xvckxvb2t1cCkge1xuXHRcdFx0X2NvbG9yRXhwICs9IFwifFwiICsgcCArIFwiXFxcXGJcIjtcblx0XHR9XG5cdFx0X2NvbG9yRXhwID0gbmV3IFJlZ0V4cChfY29sb3JFeHArXCIpXCIsIFwiZ2lcIik7XG5cblx0XHRDU1NQbHVnaW4uY29sb3JTdHJpbmdGaWx0ZXIgPSBmdW5jdGlvbihhKSB7XG5cdFx0XHR2YXIgY29tYmluZWQgPSBhWzBdICsgYVsxXSxcblx0XHRcdFx0dG9IU0w7XG5cdFx0XHRpZiAoX2NvbG9yRXhwLnRlc3QoY29tYmluZWQpKSB7XG5cdFx0XHRcdHRvSFNMID0gKGNvbWJpbmVkLmluZGV4T2YoXCJoc2woXCIpICE9PSAtMSB8fCBjb21iaW5lZC5pbmRleE9mKFwiaHNsYShcIikgIT09IC0xKTtcblx0XHRcdFx0YVswXSA9IF9mb3JtYXRDb2xvcnMoYVswXSwgdG9IU0wpO1xuXHRcdFx0XHRhWzFdID0gX2Zvcm1hdENvbG9ycyhhWzFdLCB0b0hTTCk7XG5cdFx0XHR9XG5cdFx0XHRfY29sb3JFeHAubGFzdEluZGV4ID0gMDtcblx0XHR9O1xuXG5cdFx0aWYgKCFUd2VlbkxpdGUuZGVmYXVsdFN0cmluZ0ZpbHRlcikge1xuXHRcdFx0VHdlZW5MaXRlLmRlZmF1bHRTdHJpbmdGaWx0ZXIgPSBDU1NQbHVnaW4uY29sb3JTdHJpbmdGaWx0ZXI7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQHByaXZhdGUgUmV0dXJucyBhIGZvcm1hdHRlciBmdW5jdGlvbiB0aGF0IGhhbmRsZXMgdGFraW5nIGEgc3RyaW5nIChvciBudW1iZXIgaW4gc29tZSBjYXNlcykgYW5kIHJldHVybmluZyBhIGNvbnNpc3RlbnRseSBmb3JtYXR0ZWQgb25lIGluIHRlcm1zIG9mIGRlbGltaXRlcnMsIHF1YW50aXR5IG9mIHZhbHVlcywgZXRjLiBGb3IgZXhhbXBsZSwgd2UgbWF5IGdldCBib3hTaGFkb3cgdmFsdWVzIGRlZmluZWQgYXMgXCIwcHggcmVkXCIgb3IgXCIwcHggMHB4IDEwcHggcmdiKDI1NSwwLDApXCIgb3IgXCIwcHggMHB4IDIwcHggMjBweCAjRjAwXCIgYW5kIHdlIG5lZWQgdG8gZW5zdXJlIHRoYXQgd2hhdCB3ZSBnZXQgYmFjayBpcyBkZXNjcmliZWQgd2l0aCA0IG51bWJlcnMgYW5kIGEgY29sb3IuIFRoaXMgYWxsb3dzIHVzIHRvIGZlZWQgaXQgaW50byB0aGUgX3BhcnNlQ29tcGxleCgpIG1ldGhvZCBhbmQgc3BsaXQgdGhlIHZhbHVlcyB1cCBhcHByb3ByaWF0ZWx5LiBUaGUgbmVhdCB0aGluZyBhYm91dCB0aGlzIF9nZXRGb3JtYXR0ZXIoKSBmdW5jdGlvbiBpcyB0aGF0IHRoZSBkZmx0IGRlZmluZXMgYSBwYXR0ZXJuIGFzIHdlbGwgYXMgYSBkZWZhdWx0LCBzbyBmb3IgZXhhbXBsZSwgX2dldEZvcm1hdHRlcihcIjBweCAwcHggMHB4IDBweCAjNzc3XCIsIHRydWUpIG5vdCBvbmx5IHNldHMgdGhlIGRlZmF1bHQgYXMgMHB4IGZvciBhbGwgZGlzdGFuY2VzIGFuZCAjNzc3IGZvciB0aGUgY29sb3IsIGJ1dCBhbHNvIHNldHMgdGhlIHBhdHRlcm4gc3VjaCB0aGF0IDQgbnVtYmVycyBhbmQgYSBjb2xvciB3aWxsIGFsd2F5cyBnZXQgcmV0dXJuZWQuXG5cdFx0ICogQHBhcmFtIHshc3RyaW5nfSBkZmx0IFRoZSBkZWZhdWx0IHZhbHVlIGFuZCBwYXR0ZXJuIHRvIGZvbGxvdy4gU28gXCIwcHggMHB4IDBweCAwcHggIzc3N1wiIHdpbGwgZW5zdXJlIHRoYXQgNCBudW1iZXJzIGFuZCBhIGNvbG9yIHdpbGwgYWx3YXlzIGdldCByZXR1cm5lZC5cblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBjbHIgSWYgdHJ1ZSwgdGhlIHZhbHVlcyBzaG91bGQgYmUgc2VhcmNoZWQgZm9yIGNvbG9yLXJlbGF0ZWQgZGF0YS4gRm9yIGV4YW1wbGUsIGJveFNoYWRvdyB2YWx1ZXMgdHlwaWNhbGx5IGNvbnRhaW4gYSBjb2xvciB3aGVyZWFzIGJvcmRlclJhZGl1cyBkb24ndC5cblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBjb2xsYXBzaWJsZSBJZiB0cnVlLCB0aGUgdmFsdWUgaXMgYSB0b3AvbGVmdC9yaWdodC9ib3R0b20gc3R5bGUgb25lIHRoYXQgYWN0cyBsaWtlIG1hcmdpbiBvciBwYWRkaW5nLCB3aGVyZSBpZiBvbmx5IG9uZSB2YWx1ZSBpcyByZWNlaXZlZCwgaXQncyB1c2VkIGZvciBhbGwgNDsgaWYgMiBhcmUgcmVjZWl2ZWQsIHRoZSBmaXJzdCBpcyBkdXBsaWNhdGVkIGZvciAzcmQgKGJvdHRvbSkgYW5kIHRoZSAybmQgaXMgZHVwbGljYXRlZCBmb3IgdGhlIDR0aCBzcG90IChsZWZ0KSwgZXRjLlxuXHRcdCAqIEByZXR1cm4ge0Z1bmN0aW9ufSBmb3JtYXR0ZXIgZnVuY3Rpb25cblx0XHQgKi9cblx0XHR2YXIgX2dldEZvcm1hdHRlciA9IGZ1bmN0aW9uKGRmbHQsIGNsciwgY29sbGFwc2libGUsIG11bHRpKSB7XG5cdFx0XHRcdGlmIChkZmx0ID09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odikge3JldHVybiB2O307XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGRDb2xvciA9IGNsciA/IChkZmx0Lm1hdGNoKF9jb2xvckV4cCkgfHwgW1wiXCJdKVswXSA6IFwiXCIsXG5cdFx0XHRcdFx0ZFZhbHMgPSBkZmx0LnNwbGl0KGRDb2xvcikuam9pbihcIlwiKS5tYXRjaChfdmFsdWVzRXhwKSB8fCBbXSxcblx0XHRcdFx0XHRwZnggPSBkZmx0LnN1YnN0cigwLCBkZmx0LmluZGV4T2YoZFZhbHNbMF0pKSxcblx0XHRcdFx0XHRzZnggPSAoZGZsdC5jaGFyQXQoZGZsdC5sZW5ndGggLSAxKSA9PT0gXCIpXCIpID8gXCIpXCIgOiBcIlwiLFxuXHRcdFx0XHRcdGRlbGltID0gKGRmbHQuaW5kZXhPZihcIiBcIikgIT09IC0xKSA/IFwiIFwiIDogXCIsXCIsXG5cdFx0XHRcdFx0bnVtVmFscyA9IGRWYWxzLmxlbmd0aCxcblx0XHRcdFx0XHRkU2Z4ID0gKG51bVZhbHMgPiAwKSA/IGRWYWxzWzBdLnJlcGxhY2UoX251bUV4cCwgXCJcIikgOiBcIlwiLFxuXHRcdFx0XHRcdGZvcm1hdHRlcjtcblx0XHRcdFx0aWYgKCFudW1WYWxzKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHYpIHtyZXR1cm4gdjt9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjbHIpIHtcblx0XHRcdFx0XHRmb3JtYXR0ZXIgPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0XHR2YXIgY29sb3IsIHZhbHMsIGksIGE7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mKHYpID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0XHRcdHYgKz0gZFNmeDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobXVsdGkgJiYgX2NvbW1hc091dHNpZGVQYXJlbkV4cC50ZXN0KHYpKSB7XG5cdFx0XHRcdFx0XHRcdGEgPSB2LnJlcGxhY2UoX2NvbW1hc091dHNpZGVQYXJlbkV4cCwgXCJ8XCIpLnNwbGl0KFwifFwiKTtcblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRhW2ldID0gZm9ybWF0dGVyKGFbaV0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhLmpvaW4oXCIsXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y29sb3IgPSAodi5tYXRjaChfY29sb3JFeHApIHx8IFtkQ29sb3JdKVswXTtcblx0XHRcdFx0XHRcdHZhbHMgPSB2LnNwbGl0KGNvbG9yKS5qb2luKFwiXCIpLm1hdGNoKF92YWx1ZXNFeHApIHx8IFtdO1xuXHRcdFx0XHRcdFx0aSA9IHZhbHMubGVuZ3RoO1xuXHRcdFx0XHRcdFx0aWYgKG51bVZhbHMgPiBpLS0pIHtcblx0XHRcdFx0XHRcdFx0d2hpbGUgKCsraSA8IG51bVZhbHMpIHtcblx0XHRcdFx0XHRcdFx0XHR2YWxzW2ldID0gY29sbGFwc2libGUgPyB2YWxzWygoKGkgLSAxKSAvIDIpIHwgMCldIDogZFZhbHNbaV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiBwZnggKyB2YWxzLmpvaW4oZGVsaW0pICsgZGVsaW0gKyBjb2xvciArIHNmeCArICh2LmluZGV4T2YoXCJpbnNldFwiKSAhPT0gLTEgPyBcIiBpbnNldFwiIDogXCJcIik7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVyO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9ybWF0dGVyID0gZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdHZhciB2YWxzLCBhLCBpO1xuXHRcdFx0XHRcdGlmICh0eXBlb2YodikgPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0XHRcdHYgKz0gZFNmeDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG11bHRpICYmIF9jb21tYXNPdXRzaWRlUGFyZW5FeHAudGVzdCh2KSkge1xuXHRcdFx0XHRcdFx0YSA9IHYucmVwbGFjZShfY29tbWFzT3V0c2lkZVBhcmVuRXhwLCBcInxcIikuc3BsaXQoXCJ8XCIpO1xuXHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0YVtpXSA9IGZvcm1hdHRlcihhW2ldKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiBhLmpvaW4oXCIsXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YWxzID0gdi5tYXRjaChfdmFsdWVzRXhwKSB8fCBbXTtcblx0XHRcdFx0XHRpID0gdmFscy5sZW5ndGg7XG5cdFx0XHRcdFx0aWYgKG51bVZhbHMgPiBpLS0pIHtcblx0XHRcdFx0XHRcdHdoaWxlICgrK2kgPCBudW1WYWxzKSB7XG5cdFx0XHRcdFx0XHRcdHZhbHNbaV0gPSBjb2xsYXBzaWJsZSA/IHZhbHNbKCgoaSAtIDEpIC8gMikgfCAwKV0gOiBkVmFsc1tpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHBmeCArIHZhbHMuam9pbihkZWxpbSkgKyBzZng7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXI7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIHJldHVybnMgYSBmb3JtYXR0ZXIgZnVuY3Rpb24gdGhhdCdzIHVzZWQgZm9yIGVkZ2UtcmVsYXRlZCB2YWx1ZXMgbGlrZSBtYXJnaW5Ub3AsIG1hcmdpbkxlZnQsIHBhZGRpbmdCb3R0b20sIHBhZGRpbmdSaWdodCwgZXRjLiBKdXN0IHBhc3MgYSBjb21tYS1kZWxpbWl0ZWQgbGlzdCBvZiBwcm9wZXJ0eSBuYW1lcyByZWxhdGVkIHRvIHRoZSBlZGdlcy5cblx0XHRcdCAqIEBwYXJhbSB7IXN0cmluZ30gcHJvcHMgYSBjb21tYS1kZWxpbWl0ZWQgbGlzdCBvZiBwcm9wZXJ0eSBuYW1lcyBpbiBvcmRlciBmcm9tIHRvcCB0byBsZWZ0LCBsaWtlIFwibWFyZ2luVG9wLG1hcmdpblJpZ2h0LG1hcmdpbkJvdHRvbSxtYXJnaW5MZWZ0XCJcblx0XHRcdCAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIGZvcm1hdHRlciBmdW5jdGlvblxuXHRcdFx0ICovXG5cdFx0XHRfZ2V0RWRnZVBhcnNlciA9IGZ1bmN0aW9uKHByb3BzKSB7XG5cdFx0XHRcdHByb3BzID0gcHJvcHMuc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbiwgdmFycykge1xuXHRcdFx0XHRcdHZhciBhID0gKGUgKyBcIlwiKS5zcGxpdChcIiBcIiksXG5cdFx0XHRcdFx0XHRpO1xuXHRcdFx0XHRcdHZhcnMgPSB7fTtcblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgNDsgaSsrKSB7XG5cdFx0XHRcdFx0XHR2YXJzW3Byb3BzW2ldXSA9IGFbaV0gPSBhW2ldIHx8IGFbKCgoaSAtIDEpIC8gMikgPj4gMCldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gY3NzcC5wYXJzZSh0LCB2YXJzLCBwdCwgcGx1Z2luKTtcblx0XHRcdFx0fTtcblx0XHRcdH0sXG5cblx0XHRcdC8vIEBwcml2YXRlIHVzZWQgd2hlbiBvdGhlciBwbHVnaW5zIG11c3QgdHdlZW4gdmFsdWVzIGZpcnN0LCBsaWtlIEJlemllclBsdWdpbiBvciBUaHJvd1Byb3BzUGx1Z2luLCBldGMuIFRoYXQgcGx1Z2luJ3Mgc2V0UmF0aW8oKSBnZXRzIGNhbGxlZCBmaXJzdCBzbyB0aGF0IHRoZSB2YWx1ZXMgYXJlIHVwZGF0ZWQsIGFuZCB0aGVuIHdlIGxvb3AgdGhyb3VnaCB0aGUgTWluaVByb3BUd2VlbnMgd2hpY2ggaGFuZGxlIGNvcHlpbmcgdGhlIHZhbHVlcyBpbnRvIHRoZWlyIGFwcHJvcHJpYXRlIHNsb3RzIHNvIHRoYXQgdGhleSBjYW4gdGhlbiBiZSBhcHBsaWVkIGNvcnJlY3RseSBpbiB0aGUgbWFpbiBDU1NQbHVnaW4gc2V0UmF0aW8oKSBtZXRob2QuIFJlbWVtYmVyLCB3ZSB0eXBpY2FsbHkgY3JlYXRlIGEgcHJveHkgb2JqZWN0IHRoYXQgaGFzIGEgYnVuY2ggb2YgdW5pcXVlbHktbmFtZWQgcHJvcGVydGllcyB0aGF0IHdlIGZlZWQgdG8gdGhlIHN1Yi1wbHVnaW4gYW5kIGl0IGRvZXMgaXRzIG1hZ2ljIG5vcm1hbGx5LCBhbmQgdGhlbiB3ZSBtdXN0IGludGVycHJldCB0aG9zZSB2YWx1ZXMgYW5kIGFwcGx5IHRoZW0gdG8gdGhlIGNzcyBiZWNhdXNlIG9mdGVuIG51bWJlcnMgbXVzdCBnZXQgY29tYmluZWQvY29uY2F0ZW5hdGVkLCBzdWZmaXhlcyBhZGRlZCwgZXRjLiB0byB3b3JrIHdpdGggY3NzLCBsaWtlIGJveFNoYWRvdyBjb3VsZCBoYXZlIDQgdmFsdWVzIHBsdXMgYSBjb2xvci5cblx0XHRcdF9zZXRQbHVnaW5SYXRpbyA9IF9pbnRlcm5hbHMuX3NldFBsdWdpblJhdGlvID0gZnVuY3Rpb24odikge1xuXHRcdFx0XHR0aGlzLnBsdWdpbi5zZXRSYXRpbyh2KTtcblx0XHRcdFx0dmFyIGQgPSB0aGlzLmRhdGEsXG5cdFx0XHRcdFx0cHJveHkgPSBkLnByb3h5LFxuXHRcdFx0XHRcdG1wdCA9IGQuZmlyc3RNUFQsXG5cdFx0XHRcdFx0bWluID0gMC4wMDAwMDEsXG5cdFx0XHRcdFx0dmFsLCBwdCwgaSwgc3RyLCBwO1xuXHRcdFx0XHR3aGlsZSAobXB0KSB7XG5cdFx0XHRcdFx0dmFsID0gcHJveHlbbXB0LnZdO1xuXHRcdFx0XHRcdGlmIChtcHQucikge1xuXHRcdFx0XHRcdFx0dmFsID0gTWF0aC5yb3VuZCh2YWwpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodmFsIDwgbWluICYmIHZhbCA+IC1taW4pIHtcblx0XHRcdFx0XHRcdHZhbCA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG1wdC50W21wdC5wXSA9IHZhbDtcblx0XHRcdFx0XHRtcHQgPSBtcHQuX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGQuYXV0b1JvdGF0ZSkge1xuXHRcdFx0XHRcdGQuYXV0b1JvdGF0ZS5yb3RhdGlvbiA9IGQubW9kID8gZC5tb2QocHJveHkucm90YXRpb24sIHRoaXMudCkgOiBwcm94eS5yb3RhdGlvbjsgLy9zcGVjaWFsIGNhc2UgZm9yIE1vZGlmeVBsdWdpbiB0byBob29rIGludG8gYW4gYXV0by1yb3RhdGluZyBiZXppZXJcblx0XHRcdFx0fVxuXHRcdFx0XHQvL2F0IHRoZSBlbmQsIHdlIG11c3Qgc2V0IHRoZSBDU1NQcm9wVHdlZW4ncyBcImVcIiAoZW5kKSB2YWx1ZSBkeW5hbWljYWxseSBoZXJlIGJlY2F1c2UgdGhhdCdzIHdoYXQgaXMgdXNlZCBpbiB0aGUgZmluYWwgc2V0UmF0aW8oKSBtZXRob2QuIFNhbWUgZm9yIFwiYlwiIGF0IHRoZSBiZWdpbm5pbmcuXG5cdFx0XHRcdGlmICh2ID09PSAxIHx8IHYgPT09IDApIHtcblx0XHRcdFx0XHRtcHQgPSBkLmZpcnN0TVBUO1xuXHRcdFx0XHRcdHAgPSAodiA9PT0gMSkgPyBcImVcIiA6IFwiYlwiO1xuXHRcdFx0XHRcdHdoaWxlIChtcHQpIHtcblx0XHRcdFx0XHRcdHB0ID0gbXB0LnQ7XG5cdFx0XHRcdFx0XHRpZiAoIXB0LnR5cGUpIHtcblx0XHRcdFx0XHRcdFx0cHRbcF0gPSBwdC5zICsgcHQueHMwO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChwdC50eXBlID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHN0ciA9IHB0LnhzMCArIHB0LnMgKyBwdC54czE7XG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IDE7IGkgPCBwdC5sOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRzdHIgKz0gcHRbXCJ4blwiK2ldICsgcHRbXCJ4c1wiKyhpKzEpXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRwdFtwXSA9IHN0cjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1wdCA9IG1wdC5fbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgQGNvbnN0cnVjdG9yIFVzZWQgYnkgYSBmZXcgU3BlY2lhbFByb3BzIHRvIGhvbGQgaW1wb3J0YW50IHZhbHVlcyBmb3IgcHJveGllcy4gRm9yIGV4YW1wbGUsIF9wYXJzZVRvUHJveHkoKSBjcmVhdGVzIGEgTWluaVByb3BUd2VlbiBpbnN0YW5jZSBmb3IgZWFjaCBwcm9wZXJ0eSB0aGF0IG11c3QgZ2V0IHR3ZWVuZWQgb24gdGhlIHByb3h5LCBhbmQgd2UgcmVjb3JkIHRoZSBvcmlnaW5hbCBwcm9wZXJ0eSBuYW1lIGFzIHdlbGwgYXMgdGhlIHVuaXF1ZSBvbmUgd2UgY3JlYXRlIGZvciB0aGUgcHJveHksIHBsdXMgd2hldGhlciBvciBub3QgdGhlIHZhbHVlIG5lZWRzIHRvIGJlIHJvdW5kZWQgcGx1cyB0aGUgb3JpZ2luYWwgdmFsdWUuXG5cdFx0XHQgKiBAcGFyYW0geyFPYmplY3R9IHQgdGFyZ2V0IG9iamVjdCB3aG9zZSBwcm9wZXJ0eSB3ZSdyZSB0d2VlbmluZyAob2Z0ZW4gYSBDU1NQcm9wVHdlZW4pXG5cdFx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IHAgcHJvcGVydHkgbmFtZVxuXHRcdFx0ICogQHBhcmFtIHsobnVtYmVyfHN0cmluZ3xvYmplY3QpfSB2IHZhbHVlXG5cdFx0XHQgKiBAcGFyYW0ge01pbmlQcm9wVHdlZW49fSBuZXh0IG5leHQgTWluaVByb3BUd2VlbiBpbiB0aGUgbGlua2VkIGxpc3Rcblx0XHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHIgaWYgdHJ1ZSwgdGhlIHR3ZWVuZWQgdmFsdWUgc2hvdWxkIGJlIHJvdW5kZWQgdG8gdGhlIG5lYXJlc3QgaW50ZWdlclxuXHRcdFx0ICovXG5cdFx0XHRNaW5pUHJvcFR3ZWVuID0gZnVuY3Rpb24odCwgcCwgdiwgbmV4dCwgcikge1xuXHRcdFx0XHR0aGlzLnQgPSB0O1xuXHRcdFx0XHR0aGlzLnAgPSBwO1xuXHRcdFx0XHR0aGlzLnYgPSB2O1xuXHRcdFx0XHR0aGlzLnIgPSByO1xuXHRcdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRcdG5leHQuX3ByZXYgPSB0aGlzO1xuXHRcdFx0XHRcdHRoaXMuX25leHQgPSBuZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIE1vc3Qgb3RoZXIgcGx1Z2lucyAobGlrZSBCZXppZXJQbHVnaW4gYW5kIFRocm93UHJvcHNQbHVnaW4gYW5kIG90aGVycykgY2FuIG9ubHkgdHdlZW4gbnVtZXJpYyB2YWx1ZXMsIGJ1dCBDU1NQbHVnaW4gbXVzdCBhY2NvbW1vZGF0ZSBzcGVjaWFsIHZhbHVlcyB0aGF0IGhhdmUgYSBidW5jaCBvZiBleHRyYSBkYXRhIChsaWtlIGEgc3VmZml4IG9yIHN0cmluZ3MgYmV0d2VlbiBudW1lcmljIHZhbHVlcywgZXRjLikuIEZvciBleGFtcGxlLCBib3hTaGFkb3cgaGFzIHZhbHVlcyBsaWtlIFwiMTBweCAxMHB4IDIwcHggMzBweCByZ2IoMjU1LDAsMClcIiB3aGljaCB3b3VsZCB1dHRlcmx5IGNvbmZ1c2Ugb3RoZXIgcGx1Z2lucy4gVGhpcyBtZXRob2QgYWxsb3dzIHVzIHRvIHNwbGl0IHRoYXQgZGF0YSBhcGFydCBhbmQgZ3JhYiBvbmx5IHRoZSBudW1lcmljIGRhdGEgYW5kIGF0dGFjaCBpdCB0byB1bmlxdWVseS1uYW1lZCBwcm9wZXJ0aWVzIG9mIGEgZ2VuZXJpYyBwcm94eSBvYmplY3QgKHt9KSBzbyB0aGF0IHdlIGNhbiBmZWVkIHRoYXQgdG8gdmlydHVhbGx5IGFueSBwbHVnaW4gdG8gaGF2ZSB0aGUgbnVtYmVycyB0d2VlbmVkLiBIb3dldmVyLCB3ZSBtdXN0IGFsc28ga2VlcCB0cmFjayBvZiB3aGljaCBwcm9wZXJ0aWVzIGZyb20gdGhlIHByb3h5IGdvIHdpdGggd2hpY2ggQ1NTUHJvcFR3ZWVuIHZhbHVlcyBhbmQgaW5zdGFuY2VzLiBTbyB3ZSBjcmVhdGUgYSBsaW5rZWQgbGlzdCBvZiBNaW5pUHJvcFR3ZWVucy4gRWFjaCBvbmUgcmVjb3JkcyBhIHRhcmdldCAodGhlIG9yaWdpbmFsIENTU1Byb3BUd2VlbiksIHByb3BlcnR5IChsaWtlIFwic1wiIG9yIFwieG4xXCIgb3IgXCJ4bjJcIikgdGhhdCB3ZSdyZSB0d2VlbmluZyBhbmQgdGhlIHVuaXF1ZSBwcm9wZXJ0eSBuYW1lIHRoYXQgd2FzIHVzZWQgZm9yIHRoZSBwcm94eSAobGlrZSBcImJveFNoYWRvd194bjFcIiBhbmQgXCJib3hTaGFkb3dfeG4yXCIpIGFuZCB3aGV0aGVyIG9yIG5vdCB0aGV5IG5lZWQgdG8gYmUgcm91bmRlZC4gVGhhdCB3YXksIGluIHRoZSBfc2V0UGx1Z2luUmF0aW8oKSBtZXRob2Qgd2UgY2FuIHNpbXBseSBjb3B5IHRoZSB2YWx1ZXMgb3ZlciBmcm9tIHRoZSBwcm94eSB0byB0aGUgQ1NTUHJvcFR3ZWVuIGluc3RhbmNlKHMpLiBUaGVuLCB3aGVuIHRoZSBtYWluIENTU1BsdWdpbiBzZXRSYXRpbygpIG1ldGhvZCBydW5zIGFuZCBhcHBsaWVzIHRoZSBDU1NQcm9wVHdlZW4gdmFsdWVzIGFjY29yZGluZ2x5LCB0aGV5J3JlIHVwZGF0ZWQgbmljZWx5LiBTbyB0aGUgZXh0ZXJuYWwgcGx1Z2luIHR3ZWVucyB0aGUgbnVtYmVycywgX3NldFBsdWdpblJhdGlvKCkgY29waWVzIHRoZW0gb3ZlciwgYW5kIHNldFJhdGlvKCkgYWN0cyBub3JtYWxseSwgYXBwbHlpbmcgY3NzLXNwZWNpZmljIHZhbHVlcyB0byB0aGUgZWxlbWVudC5cblx0XHRcdCAqIFRoaXMgbWV0aG9kIHJldHVybnMgYW4gb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcblx0XHRcdCAqICAtIHByb3h5OiBhIGdlbmVyaWMgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHN0YXJ0aW5nIHZhbHVlcyBmb3IgYWxsIHRoZSBwcm9wZXJ0aWVzIHRoYXQgd2lsbCBiZSB0d2VlbmVkIGJ5IHRoZSBleHRlcm5hbCBwbHVnaW4uICBUaGlzIGlzIHdoYXQgd2UgZmVlZCB0byB0aGUgZXh0ZXJuYWwgX29uSW5pdFR3ZWVuKCkgYXMgdGhlIHRhcmdldFxuXHRcdFx0ICogIC0gZW5kOiBhIGdlbmVyaWMgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGVuZGluZyB2YWx1ZXMgZm9yIGFsbCB0aGUgcHJvcGVydGllcyB0aGF0IHdpbGwgYmUgdHdlZW5lZCBieSB0aGUgZXh0ZXJuYWwgcGx1Z2luLiBUaGlzIGlzIHdoYXQgd2UgZmVlZCB0byB0aGUgZXh0ZXJuYWwgcGx1Z2luJ3MgX29uSW5pdFR3ZWVuKCkgYXMgdGhlIGRlc3RpbmF0aW9uIHZhbHVlc1xuXHRcdFx0ICogIC0gZmlyc3RNUFQ6IHRoZSBmaXJzdCBNaW5pUHJvcFR3ZWVuIGluIHRoZSBsaW5rZWQgbGlzdFxuXHRcdFx0ICogIC0gcHQ6IHRoZSBmaXJzdCBDU1NQcm9wVHdlZW4gaW4gdGhlIGxpbmtlZCBsaXN0IHRoYXQgd2FzIGNyZWF0ZWQgd2hlbiBwYXJzaW5nLiBJZiBzaGFsbG93IGlzIHRydWUsIHRoaXMgbGlua2VkIGxpc3Qgd2lsbCBOT1QgYXR0YWNoIHRvIHRoZSBvbmUgcGFzc2VkIGludG8gdGhlIF9wYXJzZVRvUHJveHkoKSBhcyB0aGUgXCJwdFwiICg0dGgpIHBhcmFtZXRlci5cblx0XHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCB0YXJnZXQgb2JqZWN0IHRvIGJlIHR3ZWVuZWRcblx0XHRcdCAqIEBwYXJhbSB7IShPYmplY3R8c3RyaW5nKX0gdmFycyB0aGUgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSB0d2VlbmluZyB2YWx1ZXMgKHR5cGljYWxseSB0aGUgZW5kL2Rlc3RpbmF0aW9uIHZhbHVlcykgdGhhdCBzaG91bGQgYmUgcGFyc2VkXG5cdFx0XHQgKiBAcGFyYW0geyFDU1NQbHVnaW59IGNzc3AgVGhlIENTU1BsdWdpbiBpbnN0YW5jZVxuXHRcdFx0ICogQHBhcmFtIHtDU1NQcm9wVHdlZW49fSBwdCB0aGUgbmV4dCBDU1NQcm9wVHdlZW4gaW4gdGhlIGxpbmtlZCBsaXN0XG5cdFx0XHQgKiBAcGFyYW0ge1R3ZWVuUGx1Z2luPX0gcGx1Z2luIHRoZSBleHRlcm5hbCBUd2VlblBsdWdpbiBpbnN0YW5jZSB0aGF0IHdpbGwgYmUgaGFuZGxpbmcgdHdlZW5pbmcgdGhlIG51bWVyaWMgdmFsdWVzXG5cdFx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBzaGFsbG93IGlmIHRydWUsIHRoZSByZXN1bHRpbmcgbGlua2VkIGxpc3QgZnJvbSB0aGUgcGFyc2Ugd2lsbCBOT1QgYmUgYXR0YWNoZWQgdG8gdGhlIENTU1Byb3BUd2VlbiB0aGF0IHdhcyBwYXNzZWQgaW4gYXMgdGhlIFwicHRcIiAoNHRoKSBwYXJhbWV0ZXIuXG5cdFx0XHQgKiBAcmV0dXJuIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczogcHJveHksIGVuZCwgZmlyc3RNUFQsIGFuZCBwdCAoc2VlIGFib3ZlIGZvciBkZXNjcmlwdGlvbnMpXG5cdFx0XHQgKi9cblx0XHRcdF9wYXJzZVRvUHJveHkgPSBfaW50ZXJuYWxzLl9wYXJzZVRvUHJveHkgPSBmdW5jdGlvbih0LCB2YXJzLCBjc3NwLCBwdCwgcGx1Z2luLCBzaGFsbG93KSB7XG5cdFx0XHRcdHZhciBicHQgPSBwdCxcblx0XHRcdFx0XHRzdGFydCA9IHt9LFxuXHRcdFx0XHRcdGVuZCA9IHt9LFxuXHRcdFx0XHRcdHRyYW5zZm9ybSA9IGNzc3AuX3RyYW5zZm9ybSxcblx0XHRcdFx0XHRvbGRGb3JjZSA9IF9mb3JjZVBULFxuXHRcdFx0XHRcdGksIHAsIHhwLCBtcHQsIGZpcnN0UFQ7XG5cdFx0XHRcdGNzc3AuX3RyYW5zZm9ybSA9IG51bGw7XG5cdFx0XHRcdF9mb3JjZVBUID0gdmFycztcblx0XHRcdFx0cHQgPSBmaXJzdFBUID0gY3NzcC5wYXJzZSh0LCB2YXJzLCBwdCwgcGx1Z2luKTtcblx0XHRcdFx0X2ZvcmNlUFQgPSBvbGRGb3JjZTtcblx0XHRcdFx0Ly9icmVhayBvZmYgZnJvbSB0aGUgbGlua2VkIGxpc3Qgc28gdGhlIG5ldyBvbmVzIGFyZSBpc29sYXRlZC5cblx0XHRcdFx0aWYgKHNoYWxsb3cpIHtcblx0XHRcdFx0XHRjc3NwLl90cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG5cdFx0XHRcdFx0aWYgKGJwdCkge1xuXHRcdFx0XHRcdFx0YnB0Ll9wcmV2ID0gbnVsbDtcblx0XHRcdFx0XHRcdGlmIChicHQuX3ByZXYpIHtcblx0XHRcdFx0XHRcdFx0YnB0Ll9wcmV2Ll9uZXh0ID0gbnVsbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0d2hpbGUgKHB0ICYmIHB0ICE9PSBicHQpIHtcblx0XHRcdFx0XHRpZiAocHQudHlwZSA8PSAxKSB7XG5cdFx0XHRcdFx0XHRwID0gcHQucDtcblx0XHRcdFx0XHRcdGVuZFtwXSA9IHB0LnMgKyBwdC5jO1xuXHRcdFx0XHRcdFx0c3RhcnRbcF0gPSBwdC5zO1xuXHRcdFx0XHRcdFx0aWYgKCFzaGFsbG93KSB7XG5cdFx0XHRcdFx0XHRcdG1wdCA9IG5ldyBNaW5pUHJvcFR3ZWVuKHB0LCBcInNcIiwgcCwgbXB0LCBwdC5yKTtcblx0XHRcdFx0XHRcdFx0cHQuYyA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAocHQudHlwZSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRpID0gcHQubDtcblx0XHRcdFx0XHRcdFx0d2hpbGUgKC0taSA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHR4cCA9IFwieG5cIiArIGk7XG5cdFx0XHRcdFx0XHRcdFx0cCA9IHB0LnAgKyBcIl9cIiArIHhwO1xuXHRcdFx0XHRcdFx0XHRcdGVuZFtwXSA9IHB0LmRhdGFbeHBdO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXJ0W3BdID0gcHRbeHBdO1xuXHRcdFx0XHRcdFx0XHRcdGlmICghc2hhbGxvdykge1xuXHRcdFx0XHRcdFx0XHRcdFx0bXB0ID0gbmV3IE1pbmlQcm9wVHdlZW4ocHQsIHhwLCBwLCBtcHQsIHB0LnJ4cFt4cF0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB7cHJveHk6c3RhcnQsIGVuZDplbmQsIGZpcnN0TVBUOm1wdCwgcHQ6Zmlyc3RQVH07XG5cdFx0XHR9LFxuXG5cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAY29uc3RydWN0b3IgRWFjaCBwcm9wZXJ0eSB0aGF0IGlzIHR3ZWVuZWQgaGFzIGF0IGxlYXN0IG9uZSBDU1NQcm9wVHdlZW4gYXNzb2NpYXRlZCB3aXRoIGl0LiBUaGVzZSBpbnN0YW5jZXMgc3RvcmUgaW1wb3J0YW50IGluZm9ybWF0aW9uIGxpa2UgdGhlIHRhcmdldCwgcHJvcGVydHksIHN0YXJ0aW5nIHZhbHVlLCBhbW91bnQgb2YgY2hhbmdlLCBldGMuIFRoZXkgY2FuIGFsc28gb3B0aW9uYWxseSBoYXZlIGEgbnVtYmVyIG9mIFwiZXh0cmFcIiBzdHJpbmdzIGFuZCBudW1lcmljIHZhbHVlcyBuYW1lZCB4czEsIHhuMSwgeHMyLCB4bjIsIHhzMywgeG4zLCBldGMuIHdoZXJlIFwic1wiIGluZGljYXRlcyBzdHJpbmcgYW5kIFwiblwiIGluZGljYXRlcyBudW1iZXIuIFRoZXNlIGNhbiBiZSBwaWVjZWQgdG9nZXRoZXIgaW4gYSBjb21wbGV4LXZhbHVlIHR3ZWVuICh0eXBlOjEpIHRoYXQgaGFzIGFsdGVybmF0aW5nIHR5cGVzIG9mIGRhdGEgbGlrZSBhIHN0cmluZywgbnVtYmVyLCBzdHJpbmcsIG51bWJlciwgZXRjLiBGb3IgZXhhbXBsZSwgYm94U2hhZG93IGNvdWxkIGJlIFwiNXB4IDVweCA4cHggcmdiKDEwMiwgMTAyLCA1MSlcIi4gSW4gdGhhdCB2YWx1ZSwgdGhlcmUgYXJlIDYgbnVtYmVycyB0aGF0IG1heSBuZWVkIHRvIHR3ZWVuIGFuZCB0aGVuIHBpZWNlZCBiYWNrIHRvZ2V0aGVyIGludG8gYSBzdHJpbmcgYWdhaW4gd2l0aCBzcGFjZXMsIHN1ZmZpeGVzLCBldGMuIHhzMCBpcyBzcGVjaWFsIGluIHRoYXQgaXQgc3RvcmVzIHRoZSBzdWZmaXggZm9yIHN0YW5kYXJkICh0eXBlOjApIHR3ZWVucywgLU9SLSB0aGUgZmlyc3Qgc3RyaW5nIChwcmVmaXgpIGluIGEgY29tcGxleC12YWx1ZSAodHlwZToxKSBDU1NQcm9wVHdlZW4gLU9SLSBpdCBjYW4gYmUgdGhlIG5vbi10d2VlbmluZyB2YWx1ZSBpbiBhIHR5cGU6LTEgQ1NTUHJvcFR3ZWVuLiBXZSBkbyB0aGlzIHRvIGNvbnNlcnZlIG1lbW9yeS5cblx0XHRcdCAqIENTU1Byb3BUd2VlbnMgaGF2ZSB0aGUgZm9sbG93aW5nIG9wdGlvbmFsIHByb3BlcnRpZXMgYXMgd2VsbCAobm90IGRlZmluZWQgdGhyb3VnaCB0aGUgY29uc3RydWN0b3IpOlxuXHRcdFx0ICogIC0gbDogTGVuZ3RoIGluIHRlcm1zIG9mIHRoZSBudW1iZXIgb2YgZXh0cmEgcHJvcGVydGllcyB0aGF0IHRoZSBDU1NQcm9wVHdlZW4gaGFzIChkZWZhdWx0OiAwKS4gRm9yIGV4YW1wbGUsIGZvciBhIGJveFNoYWRvdyB3ZSBtYXkgbmVlZCB0byB0d2VlbiA1IG51bWJlcnMgaW4gd2hpY2ggY2FzZSBsIHdvdWxkIGJlIDU7IEtlZXAgaW4gbWluZCB0aGF0IHRoZSBzdGFydC9lbmQgdmFsdWVzIGZvciB0aGUgZmlyc3QgbnVtYmVyIHRoYXQncyB0d2VlbmVkIGFyZSBhbHdheXMgc3RvcmVkIGluIHRoZSBzIGFuZCBjIHByb3BlcnRpZXMgdG8gY29uc2VydmUgbWVtb3J5LiBBbGwgYWRkaXRpb25hbCB2YWx1ZXMgdGhlcmVhZnRlciBhcmUgc3RvcmVkIGluIHhuMSwgeG4yLCBldGMuXG5cdFx0XHQgKiAgLSB4Zmlyc3Q6IFRoZSBmaXJzdCBpbnN0YW5jZSBvZiBhbnkgc3ViLUNTU1Byb3BUd2VlbnMgdGhhdCBhcmUgdHdlZW5pbmcgcHJvcGVydGllcyBvZiB0aGlzIGluc3RhbmNlLiBGb3IgZXhhbXBsZSwgd2UgbWF5IHNwbGl0IHVwIGEgYm94U2hhZG93IHR3ZWVuIHNvIHRoYXQgdGhlcmUncyBhIG1haW4gQ1NTUHJvcFR3ZWVuIG9mIHR5cGU6MSB0aGF0IGhhcyB2YXJpb3VzIHhzKiBhbmQgeG4qIHZhbHVlcyBhc3NvY2lhdGVkIHdpdGggdGhlIGgtc2hhZG93LCB2LXNoYWRvdywgYmx1ciwgY29sb3IsIGV0Yy4gVGhlbiB3ZSBzcGF3biBhIENTU1Byb3BUd2VlbiBmb3IgZWFjaCBvZiB0aG9zZSB0aGF0IGhhcyBhIGhpZ2hlciBwcmlvcml0eSBhbmQgcnVucyBCRUZPUkUgdGhlIG1haW4gQ1NTUHJvcFR3ZWVuIHNvIHRoYXQgdGhlIHZhbHVlcyBhcmUgYWxsIHNldCBieSB0aGUgdGltZSBpdCBuZWVkcyB0byByZS1hc3NlbWJsZSB0aGVtLiBUaGUgeGZpcnN0IGdpdmVzIHVzIGFuIGVhc3kgd2F5IHRvIGlkZW50aWZ5IHRoZSBmaXJzdCBvbmUgaW4gdGhhdCBjaGFpbiB3aGljaCB0eXBpY2FsbHkgZW5kcyBhdCB0aGUgbWFpbiBvbmUgKGJlY2F1c2UgdGhleSdyZSBhbGwgcHJlcGVuZGUgdG8gdGhlIGxpbmtlZCBsaXN0KVxuXHRcdFx0ICogIC0gcGx1Z2luOiBUaGUgVHdlZW5QbHVnaW4gaW5zdGFuY2UgdGhhdCB3aWxsIGhhbmRsZSB0aGUgdHdlZW5pbmcgb2YgYW55IGNvbXBsZXggdmFsdWVzLiBGb3IgZXhhbXBsZSwgc29tZXRpbWVzIHdlIGRvbid0IHdhbnQgdG8gdXNlIG5vcm1hbCBzdWJ0d2VlbnMgKGxpa2UgeGZpcnN0IHJlZmVycyB0bykgdG8gdHdlZW4gdGhlIHZhbHVlcyAtIHdlIG1pZ2h0IHdhbnQgVGhyb3dQcm9wc1BsdWdpbiBvciBCZXppZXJQbHVnaW4gc29tZSBvdGhlciBwbHVnaW4gdG8gZG8gdGhlIGFjdHVhbCB0d2VlbmluZywgc28gd2UgY3JlYXRlIGEgcGx1Z2luIGluc3RhbmNlIGFuZCBzdG9yZSBhIHJlZmVyZW5jZSBoZXJlLiBXZSBuZWVkIHRoaXMgcmVmZXJlbmNlIHNvIHRoYXQgaWYgd2UgZ2V0IGEgcmVxdWVzdCB0byByb3VuZCB2YWx1ZXMgb3IgZGlzYWJsZSBhIHR3ZWVuLCB3ZSBjYW4gcGFzcyBhbG9uZyB0aGF0IHJlcXVlc3QuXG5cdFx0XHQgKiAgLSBkYXRhOiBBcmJpdHJhcnkgZGF0YSB0aGF0IG5lZWRzIHRvIGJlIHN0b3JlZCB3aXRoIHRoZSBDU1NQcm9wVHdlZW4uIFR5cGljYWxseSBpZiB3ZSdyZSBnb2luZyB0byBoYXZlIGEgcGx1Z2luIGhhbmRsZSB0aGUgdHdlZW5pbmcgb2YgYSBjb21wbGV4LXZhbHVlIHR3ZWVuLCB3ZSBjcmVhdGUgYSBnZW5lcmljIG9iamVjdCB0aGF0IHN0b3JlcyB0aGUgRU5EIHZhbHVlcyB0aGF0IHdlJ3JlIHR3ZWVuaW5nIHRvIGFuZCB0aGUgQ1NTUHJvcFR3ZWVuJ3MgeHMxLCB4czIsIGV0Yy4gaGF2ZSB0aGUgc3RhcnRpbmcgdmFsdWVzLiBXZSBzdG9yZSB0aGF0IG9iamVjdCBhcyBkYXRhLiBUaGF0IHdheSwgd2UgY2FuIHNpbXBseSBwYXNzIHRoYXQgb2JqZWN0IHRvIHRoZSBwbHVnaW4gYW5kIHVzZSB0aGUgQ1NTUHJvcFR3ZWVuIGFzIHRoZSB0YXJnZXQuXG5cdFx0XHQgKiAgLSBzZXRSYXRpbzogT25seSB1c2VkIGZvciB0eXBlOjIgdHdlZW5zIHRoYXQgcmVxdWlyZSBjdXN0b20gZnVuY3Rpb25hbGl0eS4gSW4gdGhpcyBjYXNlLCB3ZSBjYWxsIHRoZSBDU1NQcm9wVHdlZW4ncyBzZXRSYXRpbygpIG1ldGhvZCBhbmQgcGFzcyB0aGUgcmF0aW8gZWFjaCB0aW1lIHRoZSB0d2VlbiB1cGRhdGVzLiBUaGlzIGlzbid0IHF1aXRlIGFzIGVmZmljaWVudCBhcyBkb2luZyB0aGluZ3MgZGlyZWN0bHkgaW4gdGhlIENTU1BsdWdpbidzIHNldFJhdGlvKCkgbWV0aG9kLCBidXQgaXQncyB2ZXJ5IGNvbnZlbmllbnQgYW5kIGZsZXhpYmxlLlxuXHRcdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IFRhcmdldCBvYmplY3Qgd2hvc2UgcHJvcGVydHkgd2lsbCBiZSB0d2VlbmVkLiBPZnRlbiBhIERPTSBlbGVtZW50LCBidXQgbm90IGFsd2F5cy4gSXQgY291bGQgYmUgYW55dGhpbmcuXG5cdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gcCBQcm9wZXJ0eSB0byB0d2VlbiAobmFtZSkuIEZvciBleGFtcGxlLCB0byB0d2VlbiBlbGVtZW50LndpZHRoLCBwIHdvdWxkIGJlIFwid2lkdGhcIi5cblx0XHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBzIFN0YXJ0aW5nIG51bWVyaWMgdmFsdWVcblx0XHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBjIENoYW5nZSBpbiBudW1lcmljIHZhbHVlIG92ZXIgdGhlIGNvdXJzZSBvZiB0aGUgZW50aXJlIHR3ZWVuLiBGb3IgZXhhbXBsZSwgaWYgZWxlbWVudC53aWR0aCBzdGFydHMgYXQgNSBhbmQgc2hvdWxkIGVuZCBhdCAxMDAsIGMgd291bGQgYmUgOTUuXG5cdFx0XHQgKiBAcGFyYW0ge0NTU1Byb3BUd2Vlbj19IG5leHQgVGhlIG5leHQgQ1NTUHJvcFR3ZWVuIGluIHRoZSBsaW5rZWQgbGlzdC4gSWYgb25lIGlzIGRlZmluZWQsIHdlIHdpbGwgZGVmaW5lIGl0cyBfcHJldiBhcyB0aGUgbmV3IGluc3RhbmNlLCBhbmQgdGhlIG5ldyBpbnN0YW5jZSdzIF9uZXh0IHdpbGwgYmUgcG9pbnRlZCBhdCBpdC5cblx0XHRcdCAqIEBwYXJhbSB7bnVtYmVyPX0gdHlwZSBUaGUgdHlwZSBvZiBDU1NQcm9wVHdlZW4gd2hlcmUgLTEgPSBhIG5vbi10d2VlbmluZyB2YWx1ZSwgMCA9IGEgc3RhbmRhcmQgc2ltcGxlIHR3ZWVuLCAxID0gYSBjb21wbGV4IHZhbHVlIChsaWtlIG9uZSB0aGF0IGhhcyBtdWx0aXBsZSBudW1iZXJzIGluIGEgY29tbWEtIG9yIHNwYWNlLWRlbGltaXRlZCBzdHJpbmcgbGlrZSBib3JkZXI6XCIxcHggc29saWQgcmVkXCIpLCBhbmQgMiA9IG9uZSB0aGF0IHVzZXMgYSBjdXN0b20gc2V0UmF0aW8gZnVuY3Rpb24gdGhhdCBkb2VzIGFsbCBvZiB0aGUgd29yayBvZiBhcHBseWluZyB0aGUgdmFsdWVzIG9uIGVhY2ggdXBkYXRlLlxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBuIE5hbWUgb2YgdGhlIHByb3BlcnR5IHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIG92ZXJ3cml0aW5nIHB1cnBvc2VzIHdoaWNoIGlzIHR5cGljYWxseSB0aGUgc2FtZSBhcyBwIGJ1dCBub3QgYWx3YXlzLiBGb3IgZXhhbXBsZSwgd2UgbWF5IG5lZWQgdG8gY3JlYXRlIGEgc3VidHdlZW4gZm9yIHRoZSAybmQgcGFydCBvZiBhIFwiY2xpcDpyZWN0KC4uLilcIiB0d2VlbiBpbiB3aGljaCBjYXNlIFwicFwiIG1pZ2h0IGJlIHhzMSBidXQgXCJuXCIgaXMgc3RpbGwgXCJjbGlwXCJcblx0XHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHIgSWYgdHJ1ZSwgdGhlIHZhbHVlKHMpIHNob3VsZCBiZSByb3VuZGVkXG5cdFx0XHQgKiBAcGFyYW0ge251bWJlcj19IHByIFByaW9yaXR5IGluIHRoZSBsaW5rZWQgbGlzdCBvcmRlci4gSGlnaGVyIHByaW9yaXR5IENTU1Byb3BUd2VlbnMgd2lsbCBiZSB1cGRhdGVkIGJlZm9yZSBsb3dlciBwcmlvcml0eSBvbmVzLiBUaGUgZGVmYXVsdCBwcmlvcml0eSBpcyAwLlxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBiIEJlZ2lubmluZyB2YWx1ZS4gV2Ugc3RvcmUgdGhpcyB0byBlbnN1cmUgdGhhdCBpdCBpcyBFWEFDVExZIHdoYXQgaXQgd2FzIHdoZW4gdGhlIHR3ZWVuIGJlZ2FuIHdpdGhvdXQgYW55IHJpc2sgb2YgaW50ZXJwcmV0YXRpb24gaXNzdWVzLlxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBlIEVuZGluZyB2YWx1ZS4gV2Ugc3RvcmUgdGhpcyB0byBlbnN1cmUgdGhhdCBpdCBpcyBFWEFDVExZIHdoYXQgdGhlIHVzZXIgZGVmaW5lZCBhdCB0aGUgZW5kIG9mIHRoZSB0d2VlbiB3aXRob3V0IGFueSByaXNrIG9mIGludGVycHJldGF0aW9uIGlzc3Vlcy5cblx0XHRcdCAqL1xuXHRcdFx0Q1NTUHJvcFR3ZWVuID0gX2ludGVybmFscy5DU1NQcm9wVHdlZW4gPSBmdW5jdGlvbih0LCBwLCBzLCBjLCBuZXh0LCB0eXBlLCBuLCByLCBwciwgYiwgZSkge1xuXHRcdFx0XHR0aGlzLnQgPSB0OyAvL3RhcmdldFxuXHRcdFx0XHR0aGlzLnAgPSBwOyAvL3Byb3BlcnR5XG5cdFx0XHRcdHRoaXMucyA9IHM7IC8vc3RhcnRpbmcgdmFsdWVcblx0XHRcdFx0dGhpcy5jID0gYzsgLy9jaGFuZ2UgdmFsdWVcblx0XHRcdFx0dGhpcy5uID0gbiB8fCBwOyAvL25hbWUgdGhhdCB0aGlzIENTU1Byb3BUd2VlbiBzaG91bGQgYmUgYXNzb2NpYXRlZCB0byAodXN1YWxseSB0aGUgc2FtZSBhcyBwLCBidXQgbm90IGFsd2F5cyAtIG4gaXMgd2hhdCBvdmVyd3JpdGluZyBsb29rcyBhdClcblx0XHRcdFx0aWYgKCEodCBpbnN0YW5jZW9mIENTU1Byb3BUd2VlbikpIHtcblx0XHRcdFx0XHRfb3ZlcndyaXRlUHJvcHMucHVzaCh0aGlzLm4pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuciA9IHI7IC8vcm91bmQgKGJvb2xlYW4pXG5cdFx0XHRcdHRoaXMudHlwZSA9IHR5cGUgfHwgMDsgLy8wID0gbm9ybWFsIHR3ZWVuLCAtMSA9IG5vbi10d2VlbmluZyAoaW4gd2hpY2ggY2FzZSB4czAgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSB0YXJnZXQncyBwcm9wZXJ0eSwgbGlrZSB0cC50W3RwLnBdID0gdHAueHMwKSwgMSA9IGNvbXBsZXgtdmFsdWUgU3BlY2lhbFByb3AsIDIgPSBjdXN0b20gc2V0UmF0aW8oKSB0aGF0IGRvZXMgYWxsIHRoZSB3b3JrXG5cdFx0XHRcdGlmIChwcikge1xuXHRcdFx0XHRcdHRoaXMucHIgPSBwcjtcblx0XHRcdFx0XHRfaGFzUHJpb3JpdHkgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuYiA9IChiID09PSB1bmRlZmluZWQpID8gcyA6IGI7XG5cdFx0XHRcdHRoaXMuZSA9IChlID09PSB1bmRlZmluZWQpID8gcyArIGMgOiBlO1xuXHRcdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRcdHRoaXMuX25leHQgPSBuZXh0O1xuXHRcdFx0XHRcdG5leHQuX3ByZXYgPSB0aGlzO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRfYWRkTm9uVHdlZW5pbmdOdW1lcmljUFQgPSBmdW5jdGlvbih0YXJnZXQsIHByb3AsIHN0YXJ0LCBlbmQsIG5leHQsIG92ZXJ3cml0ZVByb3ApIHsgLy9jbGVhbnMgdXAgc29tZSBjb2RlIHJlZHVuZGFuY2llcyBhbmQgaGVscHMgbWluaWZpY2F0aW9uLiBKdXN0IGEgZmFzdCB3YXkgdG8gYWRkIGEgTlVNRVJJQyBub24tdHdlZW5pbmcgQ1NTUHJvcFR3ZWVuXG5cdFx0XHRcdHZhciBwdCA9IG5ldyBDU1NQcm9wVHdlZW4odGFyZ2V0LCBwcm9wLCBzdGFydCwgZW5kIC0gc3RhcnQsIG5leHQsIC0xLCBvdmVyd3JpdGVQcm9wKTtcblx0XHRcdFx0cHQuYiA9IHN0YXJ0O1xuXHRcdFx0XHRwdC5lID0gcHQueHMwID0gZW5kO1xuXHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIFRha2VzIGEgdGFyZ2V0LCB0aGUgYmVnaW5uaW5nIHZhbHVlIGFuZCBlbmRpbmcgdmFsdWUgKGFzIHN0cmluZ3MpIGFuZCBwYXJzZXMgdGhlbSBpbnRvIGEgQ1NTUHJvcFR3ZWVuIChwb3NzaWJseSB3aXRoIGNoaWxkIENTU1Byb3BUd2VlbnMpIHRoYXQgYWNjb21tb2RhdGVzIG11bHRpcGxlIG51bWJlcnMsIGNvbG9ycywgY29tbWEtZGVsaW1pdGVkIHZhbHVlcywgZXRjLiBGb3IgZXhhbXBsZTpcblx0XHRcdCAqIHNwLnBhcnNlQ29tcGxleChlbGVtZW50LCBcImJveFNoYWRvd1wiLCBcIjVweCAxMHB4IDIwcHggcmdiKDI1NSwxMDIsNTEpXCIsIFwiMHB4IDBweCAwcHggcmVkXCIsIHRydWUsIFwiMHB4IDBweCAwcHggcmdiKDAsMCwwLDApXCIsIHB0KTtcblx0XHRcdCAqIEl0IHdpbGwgd2FsayB0aHJvdWdoIHRoZSBiZWdpbm5pbmcgYW5kIGVuZGluZyB2YWx1ZXMgKHdoaWNoIHNob3VsZCBiZSBpbiB0aGUgc2FtZSBmb3JtYXQgd2l0aCB0aGUgc2FtZSBudW1iZXIgYW5kIHR5cGUgb2YgdmFsdWVzKSBhbmQgZmlndXJlIG91dCB3aGljaCBwYXJ0cyBhcmUgbnVtYmVycywgd2hhdCBzdHJpbmdzIHNlcGFyYXRlIHRoZSBudW1lcmljL3R3ZWVuYWJsZSB2YWx1ZXMsIGFuZCB0aGVuIGNyZWF0ZSB0aGUgQ1NTUHJvcFR3ZWVucyBhY2NvcmRpbmdseS4gSWYgYSBwbHVnaW4gaXMgZGVmaW5lZCwgbm8gY2hpbGQgQ1NTUHJvcFR3ZWVucyB3aWxsIGJlIGNyZWF0ZWQuIEluc3RlYWQsIHRoZSBlbmRpbmcgdmFsdWVzIHdpbGwgYmUgc3RvcmVkIGluIHRoZSBcImRhdGFcIiBwcm9wZXJ0eSBvZiB0aGUgcmV0dXJuZWQgQ1NTUHJvcFR3ZWVuIGxpa2U6IHtzOi01LCB4bjE6LTEwLCB4bjI6LTIwLCB4bjM6MjU1LCB4bjQ6MCwgeG41OjB9IHNvIHRoYXQgaXQgY2FuIGJlIGZlZCB0byBhbnkgb3RoZXIgcGx1Z2luIGFuZCBpdCdsbCBiZSBwbGFpbiBudW1lcmljIHR3ZWVucyBidXQgdGhlIHJlY29tcG9zaXRpb24gb2YgdGhlIGNvbXBsZXggdmFsdWUgd2lsbCBiZSBoYW5kbGVkIGluc2lkZSBDU1NQbHVnaW4ncyBzZXRSYXRpbygpLlxuXHRcdFx0ICogSWYgYSBzZXRSYXRpbyBpcyBkZWZpbmVkLCB0aGUgdHlwZSBvZiB0aGUgQ1NTUHJvcFR3ZWVuIHdpbGwgYmUgc2V0IHRvIDIgYW5kIHJlY29tcG9zaXRpb24gb2YgdGhlIHZhbHVlcyB3aWxsIGJlIHRoZSByZXNwb25zaWJpbGl0eSBvZiB0aGF0IG1ldGhvZC5cblx0XHRcdCAqXG5cdFx0XHQgKiBAcGFyYW0geyFPYmplY3R9IHQgVGFyZ2V0IHdob3NlIHByb3BlcnR5IHdpbGwgYmUgdHdlZW5lZFxuXHRcdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIFByb3BlcnR5IHRoYXQgd2lsbCBiZSB0d2VlbmVkIChpdHMgbmFtZSwgbGlrZSBcImxlZnRcIiBvciBcImJhY2tncm91bmRDb2xvclwiIG9yIFwiYm94U2hhZG93XCIpXG5cdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gYiBCZWdpbm5pbmcgdmFsdWVcblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBlIEVuZGluZyB2YWx1ZVxuXHRcdFx0ICogQHBhcmFtIHtib29sZWFufSBjbHJzIElmIHRydWUsIHRoZSB2YWx1ZSBjb3VsZCBjb250YWluIGEgY29sb3IgdmFsdWUgbGlrZSBcInJnYigyNTUsMCwwKVwiIG9yIFwiI0YwMFwiIG9yIFwicmVkXCIuIFRoZSBkZWZhdWx0IGlzIGZhbHNlLCBzbyBubyBjb2xvcnMgd2lsbCBiZSByZWNvZ25pemVkIChhIHBlcmZvcm1hbmNlIG9wdGltaXphdGlvbilcblx0XHRcdCAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXJ8T2JqZWN0KX0gZGZsdCBUaGUgZGVmYXVsdCBiZWdpbm5pbmcgdmFsdWUgdGhhdCBzaG91bGQgYmUgdXNlZCBpZiBubyB2YWxpZCBiZWdpbm5pbmcgdmFsdWUgaXMgZGVmaW5lZCBvciBpZiB0aGUgbnVtYmVyIG9mIHZhbHVlcyBpbnNpZGUgdGhlIGNvbXBsZXggYmVnaW5uaW5nIGFuZCBlbmRpbmcgdmFsdWVzIGRvbid0IG1hdGNoXG5cdFx0XHQgKiBAcGFyYW0gez9DU1NQcm9wVHdlZW59IHB0IENTU1Byb3BUd2VlbiBpbnN0YW5jZSB0aGF0IGlzIHRoZSBjdXJyZW50IGhlYWQgb2YgdGhlIGxpbmtlZCBsaXN0ICh3ZSdsbCBwcmVwZW5kIHRvIHRoaXMpLlxuXHRcdFx0ICogQHBhcmFtIHtudW1iZXI9fSBwciBQcmlvcml0eSBpbiB0aGUgbGlua2VkIGxpc3Qgb3JkZXIuIEhpZ2hlciBwcmlvcml0eSBwcm9wZXJ0aWVzIHdpbGwgYmUgdXBkYXRlZCBiZWZvcmUgbG93ZXIgcHJpb3JpdHkgb25lcy4gVGhlIGRlZmF1bHQgcHJpb3JpdHkgaXMgMC5cblx0XHRcdCAqIEBwYXJhbSB7VHdlZW5QbHVnaW49fSBwbHVnaW4gSWYgYSBwbHVnaW4gc2hvdWxkIGhhbmRsZSB0aGUgdHdlZW5pbmcgb2YgZXh0cmEgcHJvcGVydGllcywgcGFzcyB0aGUgcGx1Z2luIGluc3RhbmNlIGhlcmUuIElmIG9uZSBpcyBkZWZpbmVkLCB0aGVuIE5PIHN1YnR3ZWVucyB3aWxsIGJlIGNyZWF0ZWQgZm9yIGFueSBleHRyYSBwcm9wZXJ0aWVzICh0aGUgcHJvcGVydGllcyB3aWxsIGJlIGNyZWF0ZWQgLSBqdXN0IG5vdCBhZGRpdGlvbmFsIENTU1Byb3BUd2VlbiBpbnN0YW5jZXMgdG8gdHdlZW4gdGhlbSkgYmVjYXVzZSB0aGUgcGx1Z2luIGlzIGV4cGVjdGVkIHRvIGRvIHNvLiBIb3dldmVyLCB0aGUgZW5kIHZhbHVlcyBXSUxMIGJlIHBvcHVsYXRlZCBpbiB0aGUgXCJkYXRhXCIgcHJvcGVydHksIGxpa2Uge3M6MTAwLCB4bjE6NTAsIHhuMjozMDB9XG5cdFx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9uKG51bWJlcik9fSBzZXRSYXRpbyBJZiB2YWx1ZXMgc2hvdWxkIGJlIHNldCBpbiBhIGN1c3RvbSBmdW5jdGlvbiBpbnN0ZWFkIG9mIGJlaW5nIHBpZWNlZCB0b2dldGhlciBpbiBhIHR5cGU6MSAoY29tcGxleC12YWx1ZSkgQ1NTUHJvcFR3ZWVuLCBkZWZpbmUgdGhhdCBjdXN0b20gZnVuY3Rpb24gaGVyZS5cblx0XHRcdCAqIEByZXR1cm4ge0NTU1Byb3BUd2Vlbn0gVGhlIGZpcnN0IENTU1Byb3BUd2VlbiBpbiB0aGUgbGlua2VkIGxpc3Qgd2hpY2ggaW5jbHVkZXMgdGhlIG5ldyBvbmUocykgYWRkZWQgYnkgdGhlIHBhcnNlQ29tcGxleCgpIGNhbGwuXG5cdFx0XHQgKi9cblx0XHRcdF9wYXJzZUNvbXBsZXggPSBDU1NQbHVnaW4ucGFyc2VDb21wbGV4ID0gZnVuY3Rpb24odCwgcCwgYiwgZSwgY2xycywgZGZsdCwgcHQsIHByLCBwbHVnaW4sIHNldFJhdGlvKSB7XG5cdFx0XHRcdC8vREVCVUc6IF9sb2coXCJwYXJzZUNvbXBsZXg6IFwiK3ArXCIsIGI6IFwiK2IrXCIsIGU6IFwiK2UpO1xuXHRcdFx0XHRiID0gYiB8fCBkZmx0IHx8IFwiXCI7XG5cdFx0XHRcdGlmICh0eXBlb2YoZSkgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdGUgPSBlKF9pbmRleCwgX3RhcmdldCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHQsIHAsIDAsIDAsIHB0LCAoc2V0UmF0aW8gPyAyIDogMSksIG51bGwsIGZhbHNlLCBwciwgYiwgZSk7XG5cdFx0XHRcdGUgKz0gXCJcIjsgLy9lbnN1cmVzIGl0J3MgYSBzdHJpbmdcblx0XHRcdFx0aWYgKGNscnMgJiYgX2NvbG9yRXhwLnRlc3QoZSArIGIpKSB7IC8vaWYgY29sb3JzIGFyZSBmb3VuZCwgbm9ybWFsaXplIHRoZSBmb3JtYXR0aW5nIHRvIHJnYmEoKSBvciBoc2xhKCkuXG5cdFx0XHRcdFx0ZSA9IFtiLCBlXTtcblx0XHRcdFx0XHRDU1NQbHVnaW4uY29sb3JTdHJpbmdGaWx0ZXIoZSk7XG5cdFx0XHRcdFx0YiA9IGVbMF07XG5cdFx0XHRcdFx0ZSA9IGVbMV07XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGJhID0gYi5zcGxpdChcIiwgXCIpLmpvaW4oXCIsXCIpLnNwbGl0KFwiIFwiKSwgLy9iZWdpbm5pbmcgYXJyYXlcblx0XHRcdFx0XHRlYSA9IGUuc3BsaXQoXCIsIFwiKS5qb2luKFwiLFwiKS5zcGxpdChcIiBcIiksIC8vZW5kaW5nIGFycmF5XG5cdFx0XHRcdFx0bCA9IGJhLmxlbmd0aCxcblx0XHRcdFx0XHRhdXRvUm91bmQgPSAoX2F1dG9Sb3VuZCAhPT0gZmFsc2UpLFxuXHRcdFx0XHRcdGksIHhpLCBuaSwgYnYsIGV2LCBibnVtcywgZW51bXMsIGJuLCBoYXNBbHBoYSwgdGVtcCwgY3YsIHN0ciwgdXNlSFNMO1xuXHRcdFx0XHRpZiAoZS5pbmRleE9mKFwiLFwiKSAhPT0gLTEgfHwgYi5pbmRleE9mKFwiLFwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRiYSA9IGJhLmpvaW4oXCIgXCIpLnJlcGxhY2UoX2NvbW1hc091dHNpZGVQYXJlbkV4cCwgXCIsIFwiKS5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0ZWEgPSBlYS5qb2luKFwiIFwiKS5yZXBsYWNlKF9jb21tYXNPdXRzaWRlUGFyZW5FeHAsIFwiLCBcIikuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHRcdGwgPSBiYS5sZW5ndGg7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGwgIT09IGVhLmxlbmd0aCkge1xuXHRcdFx0XHRcdC8vREVCVUc6IF9sb2coXCJtaXNtYXRjaGVkIGZvcm1hdHRpbmcgZGV0ZWN0ZWQgb24gXCIgKyBwICsgXCIgKFwiICsgYiArIFwiIHZzIFwiICsgZSArIFwiKVwiKTtcblx0XHRcdFx0XHRiYSA9IChkZmx0IHx8IFwiXCIpLnNwbGl0KFwiIFwiKTtcblx0XHRcdFx0XHRsID0gYmEubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHB0LnBsdWdpbiA9IHBsdWdpbjtcblx0XHRcdFx0cHQuc2V0UmF0aW8gPSBzZXRSYXRpbztcblx0XHRcdFx0X2NvbG9yRXhwLmxhc3RJbmRleCA9IDA7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRidiA9IGJhW2ldO1xuXHRcdFx0XHRcdGV2ID0gZWFbaV07XG5cdFx0XHRcdFx0Ym4gPSBwYXJzZUZsb2F0KGJ2KTtcblx0XHRcdFx0XHQvL2lmIHRoZSB2YWx1ZSBiZWdpbnMgd2l0aCBhIG51bWJlciAobW9zdCBjb21tb24pLiBJdCdzIGZpbmUgaWYgaXQgaGFzIGEgc3VmZml4IGxpa2UgcHhcblx0XHRcdFx0XHRpZiAoYm4gfHwgYm4gPT09IDApIHtcblx0XHRcdFx0XHRcdHB0LmFwcGVuZFh0cmEoXCJcIiwgYm4sIF9wYXJzZUNoYW5nZShldiwgYm4pLCBldi5yZXBsYWNlKF9yZWxOdW1FeHAsIFwiXCIpLCAoYXV0b1JvdW5kICYmIGV2LmluZGV4T2YoXCJweFwiKSAhPT0gLTEpLCB0cnVlKTtcblxuXHRcdFx0XHRcdC8vaWYgdGhlIHZhbHVlIGlzIGEgY29sb3Jcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGNscnMgJiYgX2NvbG9yRXhwLnRlc3QoYnYpKSB7XG5cdFx0XHRcdFx0XHRzdHIgPSBldi5pbmRleE9mKFwiKVwiKSArIDE7XG5cdFx0XHRcdFx0XHRzdHIgPSBcIilcIiArIChzdHIgPyBldi5zdWJzdHIoc3RyKSA6IFwiXCIpOyAvL2lmIHRoZXJlJ3MgYSBjb21tYSBvciApIGF0IHRoZSBlbmQsIHJldGFpbiBpdC5cblx0XHRcdFx0XHRcdHVzZUhTTCA9IChldi5pbmRleE9mKFwiaHNsXCIpICE9PSAtMSAmJiBfc3VwcG9ydHNPcGFjaXR5KTtcblx0XHRcdFx0XHRcdGJ2ID0gX3BhcnNlQ29sb3IoYnYsIHVzZUhTTCk7XG5cdFx0XHRcdFx0XHRldiA9IF9wYXJzZUNvbG9yKGV2LCB1c2VIU0wpO1xuXHRcdFx0XHRcdFx0aGFzQWxwaGEgPSAoYnYubGVuZ3RoICsgZXYubGVuZ3RoID4gNik7XG5cdFx0XHRcdFx0XHRpZiAoaGFzQWxwaGEgJiYgIV9zdXBwb3J0c09wYWNpdHkgJiYgZXZbM10gPT09IDApIHsgLy9vbGRlciB2ZXJzaW9ucyBvZiBJRSBkb24ndCBzdXBwb3J0IHJnYmEoKSwgc28gaWYgdGhlIGRlc3RpbmF0aW9uIGFscGhhIGlzIDAsIGp1c3QgdXNlIFwidHJhbnNwYXJlbnRcIiBmb3IgdGhlIGVuZCBjb2xvclxuXHRcdFx0XHRcdFx0XHRwdFtcInhzXCIgKyBwdC5sXSArPSBwdC5sID8gXCIgdHJhbnNwYXJlbnRcIiA6IFwidHJhbnNwYXJlbnRcIjtcblx0XHRcdFx0XHRcdFx0cHQuZSA9IHB0LmUuc3BsaXQoZWFbaV0pLmpvaW4oXCJ0cmFuc3BhcmVudFwiKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGlmICghX3N1cHBvcnRzT3BhY2l0eSkgeyAvL29sZCB2ZXJzaW9ucyBvZiBJRSBkb24ndCBzdXBwb3J0IHJnYmEoKS5cblx0XHRcdFx0XHRcdFx0XHRoYXNBbHBoYSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICh1c2VIU0wpIHtcblx0XHRcdFx0XHRcdFx0XHRwdC5hcHBlbmRYdHJhKChoYXNBbHBoYSA/IFwiaHNsYShcIiA6IFwiaHNsKFwiKSwgYnZbMF0sIF9wYXJzZUNoYW5nZShldlswXSwgYnZbMF0pLCBcIixcIiwgZmFsc2UsIHRydWUpXG5cdFx0XHRcdFx0XHRcdFx0XHQuYXBwZW5kWHRyYShcIlwiLCBidlsxXSwgX3BhcnNlQ2hhbmdlKGV2WzFdLCBidlsxXSksIFwiJSxcIiwgZmFsc2UpXG5cdFx0XHRcdFx0XHRcdFx0XHQuYXBwZW5kWHRyYShcIlwiLCBidlsyXSwgX3BhcnNlQ2hhbmdlKGV2WzJdLCBidlsyXSksIChoYXNBbHBoYSA/IFwiJSxcIiA6IFwiJVwiICsgc3RyKSwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHB0LmFwcGVuZFh0cmEoKGhhc0FscGhhID8gXCJyZ2JhKFwiIDogXCJyZ2IoXCIpLCBidlswXSwgZXZbMF0gLSBidlswXSwgXCIsXCIsIHRydWUsIHRydWUpXG5cdFx0XHRcdFx0XHRcdFx0XHQuYXBwZW5kWHRyYShcIlwiLCBidlsxXSwgZXZbMV0gLSBidlsxXSwgXCIsXCIsIHRydWUpXG5cdFx0XHRcdFx0XHRcdFx0XHQuYXBwZW5kWHRyYShcIlwiLCBidlsyXSwgZXZbMl0gLSBidlsyXSwgKGhhc0FscGhhID8gXCIsXCIgOiBzdHIpLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmIChoYXNBbHBoYSkge1xuXHRcdFx0XHRcdFx0XHRcdGJ2ID0gKGJ2Lmxlbmd0aCA8IDQpID8gMSA6IGJ2WzNdO1xuXHRcdFx0XHRcdFx0XHRcdHB0LmFwcGVuZFh0cmEoXCJcIiwgYnYsICgoZXYubGVuZ3RoIDwgNCkgPyAxIDogZXZbM10pIC0gYnYsIHN0ciwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRfY29sb3JFeHAubGFzdEluZGV4ID0gMDsgLy9vdGhlcndpc2UgdGhlIHRlc3QoKSBvbiB0aGUgUmVnRXhwIGNvdWxkIG1vdmUgdGhlIGxhc3RJbmRleCBhbmQgdGFpbnQgZnV0dXJlIHJlc3VsdHMuXG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ym51bXMgPSBidi5tYXRjaChfbnVtRXhwKTsgLy9nZXRzIGVhY2ggZ3JvdXAgb2YgbnVtYmVycyBpbiB0aGUgYmVnaW5uaW5nIHZhbHVlIHN0cmluZyBhbmQgZHJvcHMgdGhlbSBpbnRvIGFuIGFycmF5XG5cblx0XHRcdFx0XHRcdC8vaWYgbm8gbnVtYmVyIGlzIGZvdW5kLCB0cmVhdCBpdCBhcyBhIG5vbi10d2VlbmluZyB2YWx1ZSBhbmQganVzdCBhcHBlbmQgdGhlIHN0cmluZyB0byB0aGUgY3VycmVudCB4cy5cblx0XHRcdFx0XHRcdGlmICghYm51bXMpIHtcblx0XHRcdFx0XHRcdFx0cHRbXCJ4c1wiICsgcHQubF0gKz0gKHB0LmwgfHwgcHRbXCJ4c1wiICsgcHQubF0pID8gXCIgXCIgKyBldiA6IGV2O1xuXG5cdFx0XHRcdFx0XHQvL2xvb3AgdGhyb3VnaCBhbGwgdGhlIG51bWJlcnMgdGhhdCBhcmUgZm91bmQgYW5kIGNvbnN0cnVjdCB0aGUgZXh0cmEgdmFsdWVzIG9uIHRoZSBwdC5cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGVudW1zID0gZXYubWF0Y2goX3JlbE51bUV4cCk7IC8vZ2V0IGVhY2ggZ3JvdXAgb2YgbnVtYmVycyBpbiB0aGUgZW5kIHZhbHVlIHN0cmluZyBhbmQgZHJvcCB0aGVtIGludG8gYW4gYXJyYXkuIFdlIGFsbG93IHJlbGF0aXZlIHZhbHVlcyB0b28sIGxpa2UgKz01MCBvciAtPS41XG5cdFx0XHRcdFx0XHRcdGlmICghZW51bXMgfHwgZW51bXMubGVuZ3RoICE9PSBibnVtcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHQvL0RFQlVHOiBfbG9nKFwibWlzbWF0Y2hlZCBmb3JtYXR0aW5nIGRldGVjdGVkIG9uIFwiICsgcCArIFwiIChcIiArIGIgKyBcIiB2cyBcIiArIGUgKyBcIilcIik7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHB0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdG5pID0gMDtcblx0XHRcdFx0XHRcdFx0Zm9yICh4aSA9IDA7IHhpIDwgYm51bXMubGVuZ3RoOyB4aSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y3YgPSBibnVtc1t4aV07XG5cdFx0XHRcdFx0XHRcdFx0dGVtcCA9IGJ2LmluZGV4T2YoY3YsIG5pKTtcblx0XHRcdFx0XHRcdFx0XHRwdC5hcHBlbmRYdHJhKGJ2LnN1YnN0cihuaSwgdGVtcCAtIG5pKSwgTnVtYmVyKGN2KSwgX3BhcnNlQ2hhbmdlKGVudW1zW3hpXSwgY3YpLCBcIlwiLCAoYXV0b1JvdW5kICYmIGJ2LnN1YnN0cih0ZW1wICsgY3YubGVuZ3RoLCAyKSA9PT0gXCJweFwiKSwgKHhpID09PSAwKSk7XG5cdFx0XHRcdFx0XHRcdFx0bmkgPSB0ZW1wICsgY3YubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHB0W1wieHNcIiArIHB0LmxdICs9IGJ2LnN1YnN0cihuaSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vaWYgdGhlcmUgYXJlIHJlbGF0aXZlIHZhbHVlcyAoXCIrPVwiIG9yIFwiLT1cIiBwcmVmaXgpLCB3ZSBuZWVkIHRvIGFkanVzdCB0aGUgZW5kaW5nIHZhbHVlIHRvIGVsaW1pbmF0ZSB0aGUgcHJlZml4ZXMgYW5kIGNvbWJpbmUgdGhlIHZhbHVlcyBwcm9wZXJseS5cblx0XHRcdFx0aWYgKGUuaW5kZXhPZihcIj1cIikgIT09IC0xKSBpZiAocHQuZGF0YSkge1xuXHRcdFx0XHRcdHN0ciA9IHB0LnhzMCArIHB0LmRhdGEucztcblx0XHRcdFx0XHRmb3IgKGkgPSAxOyBpIDwgcHQubDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRzdHIgKz0gcHRbXCJ4c1wiICsgaV0gKyBwdC5kYXRhW1wieG5cIiArIGldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdC5lID0gc3RyICsgcHRbXCJ4c1wiICsgaV07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFwdC5sKSB7XG5cdFx0XHRcdFx0cHQudHlwZSA9IC0xO1xuXHRcdFx0XHRcdHB0LnhzMCA9IHB0LmU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHB0LnhmaXJzdCB8fCBwdDtcblx0XHRcdH0sXG5cdFx0XHRpID0gOTtcblxuXG5cdFx0cCA9IENTU1Byb3BUd2Vlbi5wcm90b3R5cGU7XG5cdFx0cC5sID0gcC5wciA9IDA7IC8vbGVuZ3RoIChudW1iZXIgb2YgZXh0cmEgcHJvcGVydGllcyBsaWtlIHhuMSwgeG4yLCB4bjMsIGV0Yy5cblx0XHR3aGlsZSAoLS1pID4gMCkge1xuXHRcdFx0cFtcInhuXCIgKyBpXSA9IDA7XG5cdFx0XHRwW1wieHNcIiArIGldID0gXCJcIjtcblx0XHR9XG5cdFx0cC54czAgPSBcIlwiO1xuXHRcdHAuX25leHQgPSBwLl9wcmV2ID0gcC54Zmlyc3QgPSBwLmRhdGEgPSBwLnBsdWdpbiA9IHAuc2V0UmF0aW8gPSBwLnJ4cCA9IG51bGw7XG5cblxuXHRcdC8qKlxuXHRcdCAqIEFwcGVuZHMgYW5kIGV4dHJhIHR3ZWVuaW5nIHZhbHVlIHRvIGEgQ1NTUHJvcFR3ZWVuIGFuZCBhdXRvbWF0aWNhbGx5IG1hbmFnZXMgYW55IHByZWZpeCBhbmQgc3VmZml4IHN0cmluZ3MuIFRoZSBmaXJzdCBleHRyYSB2YWx1ZSBpcyBzdG9yZWQgaW4gdGhlIHMgYW5kIGMgb2YgdGhlIG1haW4gQ1NTUHJvcFR3ZWVuIGluc3RhbmNlLCBidXQgdGhlcmVhZnRlciBhbnkgZXh0cmFzIGFyZSBzdG9yZWQgaW4gdGhlIHhuMSwgeG4yLCB4bjMsIGV0Yy4gVGhlIHByZWZpeGVzIGFuZCBzdWZmaXhlcyBhcmUgc3RvcmVkIGluIHRoZSB4czAsIHhzMSwgeHMyLCBldGMuIHByb3BlcnRpZXMuIEZvciBleGFtcGxlLCBpZiBJIHdhbGsgdGhyb3VnaCBhIGNsaXAgdmFsdWUgbGlrZSBcInJlY3QoMTBweCwgNXB4LCAwcHgsIDIwcHgpXCIsIHRoZSB2YWx1ZXMgd291bGQgYmUgc3RvcmVkIGxpa2UgdGhpczpcblx0XHQgKiB4czA6XCJyZWN0KFwiLCBzOjEwLCB4czE6XCJweCwgXCIsIHhuMTo1LCB4czI6XCJweCwgXCIsIHhuMjowLCB4czM6XCJweCwgXCIsIHhuMzoyMCwgeG40OlwicHgpXCJcblx0XHQgKiBBbmQgdGhleSdkIGFsbCBnZXQgam9pbmVkIHRvZ2V0aGVyIHdoZW4gdGhlIENTU1BsdWdpbiByZW5kZXJzIChpbiB0aGUgc2V0UmF0aW8oKSBtZXRob2QpLlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nPX0gcGZ4IFByZWZpeCAoaWYgYW55KVxuXHRcdCAqIEBwYXJhbSB7IW51bWJlcn0gcyBTdGFydGluZyB2YWx1ZVxuXHRcdCAqIEBwYXJhbSB7IW51bWJlcn0gYyBDaGFuZ2UgaW4gbnVtZXJpYyB2YWx1ZSBvdmVyIHRoZSBjb3Vyc2Ugb2YgdGhlIGVudGlyZSB0d2Vlbi4gRm9yIGV4YW1wbGUsIGlmIHRoZSBzdGFydCBpcyA1IGFuZCB0aGUgZW5kIGlzIDEwMCwgdGhlIGNoYW5nZSB3b3VsZCBiZSA5NS5cblx0XHQgKiBAcGFyYW0ge3N0cmluZz19IHNmeCBTdWZmaXggKGlmIGFueSlcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSByIFJvdW5kIChpZiB0cnVlKS5cblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBwYWQgSWYgdHJ1ZSwgdGhpcyBleHRyYSB2YWx1ZSBzaG91bGQgYmUgc2VwYXJhdGVkIGJ5IHRoZSBwcmV2aW91cyBvbmUgYnkgYSBzcGFjZS4gSWYgdGhlcmUgaXMgbm8gcHJldmlvdXMgZXh0cmEgYW5kIHBhZCBpcyB0cnVlLCBpdCB3aWxsIGF1dG9tYXRpY2FsbHkgZHJvcCB0aGUgc3BhY2UuXG5cdFx0ICogQHJldHVybiB7Q1NTUHJvcFR3ZWVufSByZXR1cm5zIGl0c2VsZiBzbyB0aGF0IG11bHRpcGxlIG1ldGhvZHMgY2FuIGJlIGNoYWluZWQgdG9nZXRoZXIuXG5cdFx0ICovXG5cdFx0cC5hcHBlbmRYdHJhID0gZnVuY3Rpb24ocGZ4LCBzLCBjLCBzZngsIHIsIHBhZCkge1xuXHRcdFx0dmFyIHB0ID0gdGhpcyxcblx0XHRcdFx0bCA9IHB0Lmw7XG5cdFx0XHRwdFtcInhzXCIgKyBsXSArPSAocGFkICYmIChsIHx8IHB0W1wieHNcIiArIGxdKSkgPyBcIiBcIiArIHBmeCA6IHBmeCB8fCBcIlwiO1xuXHRcdFx0aWYgKCFjKSBpZiAobCAhPT0gMCAmJiAhcHQucGx1Z2luKSB7IC8vdHlwaWNhbGx5IHdlJ2xsIGNvbWJpbmUgbm9uLWNoYW5naW5nIHZhbHVlcyByaWdodCBpbnRvIHRoZSB4cyB0byBvcHRpbWl6ZSBwZXJmb3JtYW5jZSwgYnV0IHdlIGRvbid0IGNvbWJpbmUgdGhlbSB3aGVuIHRoZXJlJ3MgYSBwbHVnaW4gdGhhdCB3aWxsIGJlIHR3ZWVuaW5nIHRoZSB2YWx1ZXMgYmVjYXVzZSBpdCBtYXkgZGVwZW5kIG9uIHRoZSB2YWx1ZXMgYmVpbmcgc3BsaXQgYXBhcnQsIGxpa2UgZm9yIGEgYmV6aWVyLCBpZiBhIHZhbHVlIGRvZXNuJ3QgY2hhbmdlIGJldHdlZW4gdGhlIGZpcnN0IGFuZCBzZWNvbmQgaXRlcmF0aW9uIGJ1dCB0aGVuIGl0IGRvZXMgb24gdGhlIDNyZCwgd2UnbGwgcnVuIGludG8gdHJvdWJsZSBiZWNhdXNlIHRoZXJlJ3Mgbm8geG4gc2xvdCBmb3IgdGhhdCB2YWx1ZSFcblx0XHRcdFx0cHRbXCJ4c1wiICsgbF0gKz0gcyArIChzZnggfHwgXCJcIik7XG5cdFx0XHRcdHJldHVybiBwdDtcblx0XHRcdH1cblx0XHRcdHB0LmwrKztcblx0XHRcdHB0LnR5cGUgPSBwdC5zZXRSYXRpbyA/IDIgOiAxO1xuXHRcdFx0cHRbXCJ4c1wiICsgcHQubF0gPSBzZnggfHwgXCJcIjtcblx0XHRcdGlmIChsID4gMCkge1xuXHRcdFx0XHRwdC5kYXRhW1wieG5cIiArIGxdID0gcyArIGM7XG5cdFx0XHRcdHB0LnJ4cFtcInhuXCIgKyBsXSA9IHI7IC8vcm91bmQgZXh0cmEgcHJvcGVydHkgKHdlIG5lZWQgdG8gdGFwIGludG8gdGhpcyBpbiB0aGUgX3BhcnNlVG9Qcm94eSgpIG1ldGhvZClcblx0XHRcdFx0cHRbXCJ4blwiICsgbF0gPSBzO1xuXHRcdFx0XHRpZiAoIXB0LnBsdWdpbikge1xuXHRcdFx0XHRcdHB0LnhmaXJzdCA9IG5ldyBDU1NQcm9wVHdlZW4ocHQsIFwieG5cIiArIGwsIHMsIGMsIHB0LnhmaXJzdCB8fCBwdCwgMCwgcHQubiwgciwgcHQucHIpO1xuXHRcdFx0XHRcdHB0LnhmaXJzdC54czAgPSAwOyAvL2p1c3QgdG8gZW5zdXJlIHRoYXQgdGhlIHByb3BlcnR5IHN0YXlzIG51bWVyaWMgd2hpY2ggaGVscHMgbW9kZXJuIGJyb3dzZXJzIHNwZWVkIHVwIHByb2Nlc3NpbmcuIFJlbWVtYmVyLCBpbiB0aGUgc2V0UmF0aW8oKSBtZXRob2QsIHdlIGRvIHB0LnRbcHQucF0gPSB2YWwgKyBwdC54czAgc28gaWYgcHQueHMwIGlzIFwiXCIgKHRoZSBkZWZhdWx0KSwgaXQnbGwgY2FzdCB0aGUgZW5kIHZhbHVlIGFzIGEgc3RyaW5nLiBXaGVuIGEgcHJvcGVydHkgaXMgYSBudW1iZXIgc29tZXRpbWVzIGFuZCBhIHN0cmluZyBzb21ldGltZXMsIGl0IHByZXZlbnRzIHRoZSBjb21waWxlciBmcm9tIGxvY2tpbmcgaW4gdGhlIGRhdGEgdHlwZSwgc2xvd2luZyB0aGluZ3MgZG93biBzbGlnaHRseS5cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHR9XG5cdFx0XHRwdC5kYXRhID0ge3M6cyArIGN9O1xuXHRcdFx0cHQucnhwID0ge307XG5cdFx0XHRwdC5zID0gcztcblx0XHRcdHB0LmMgPSBjO1xuXHRcdFx0cHQuciA9IHI7XG5cdFx0XHRyZXR1cm4gcHQ7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEBjb25zdHJ1Y3RvciBBIFNwZWNpYWxQcm9wIGlzIGJhc2ljYWxseSBhIGNzcyBwcm9wZXJ0eSB0aGF0IG5lZWRzIHRvIGJlIHRyZWF0ZWQgaW4gYSBub24tc3RhbmRhcmQgd2F5LCBsaWtlIGlmIGl0IG1heSBjb250YWluIGEgY29tcGxleCB2YWx1ZSBsaWtlIGJveFNoYWRvdzpcIjVweCAxMHB4IDE1cHggcmdiKDI1NSwgMTAyLCA1MSlcIiBvciBpZiBpdCBpcyBhc3NvY2lhdGVkIHdpdGggYW5vdGhlciBwbHVnaW4gbGlrZSBUaHJvd1Byb3BzUGx1Z2luIG9yIEJlemllclBsdWdpbi4gRXZlcnkgU3BlY2lhbFByb3AgaXMgYXNzb2NpYXRlZCB3aXRoIGEgcGFydGljdWxhciBwcm9wZXJ0eSBuYW1lIGxpa2UgXCJib3hTaGFkb3dcIiBvciBcInRocm93UHJvcHNcIiBvciBcImJlemllclwiIGFuZCBpdCB3aWxsIGludGVyY2VwdCB0aG9zZSB2YWx1ZXMgaW4gdGhlIHZhcnMgb2JqZWN0IHRoYXQncyBwYXNzZWQgdG8gdGhlIENTU1BsdWdpbiBhbmQgaGFuZGxlIHRoZW0gYWNjb3JkaW5nbHkuXG5cdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIFByb3BlcnR5IG5hbWUgKGxpa2UgXCJib3hTaGFkb3dcIiBvciBcInRocm93UHJvcHNcIilcblx0XHQgKiBAcGFyYW0ge09iamVjdD19IG9wdGlvbnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgYW55IG9mIHRoZSBmb2xsb3dpbmcgY29uZmlndXJhdGlvbiBvcHRpb25zOlxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgIC0gZGVmYXVsdFZhbHVlOiB0aGUgZGVmYXVsdCB2YWx1ZVxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgIC0gcGFyc2VyOiBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCB3aGVuIHRoZSBhc3NvY2lhdGVkIHByb3BlcnR5IG5hbWUgaXMgZm91bmQgaW4gdGhlIHZhcnMuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIENTU1Byb3BUd2VlbiBpbnN0YW5jZSBhbmQgaXQgc2hvdWxkIGVuc3VyZSB0aGF0IGl0IGlzIHByb3Blcmx5IGluc2VydGVkIGludG8gdGhlIGxpbmtlZCBsaXN0LiBJdCB3aWxsIHJlY2VpdmUgNCBwYXJhbXRlcnM6IDEpIFRoZSB0YXJnZXQsIDIpIFRoZSB2YWx1ZSBkZWZpbmVkIGluIHRoZSB2YXJzLCAzKSBUaGUgQ1NTUGx1Z2luIGluc3RhbmNlICh3aG9zZSBfZmlyc3RQVCBzaG91bGQgYmUgdXNlZCBmb3IgdGhlIGxpbmtlZCBsaXN0KSwgYW5kIDQpIEEgY29tcHV0ZWQgc3R5bGUgb2JqZWN0IGlmIG9uZSB3YXMgY2FsY3VsYXRlZCAodGhpcyBpcyBhIHNwZWVkIG9wdGltaXphdGlvbiB0aGF0IGFsbG93cyByZXRyaWV2YWwgb2Ygc3RhcnRpbmcgdmFsdWVzIHF1aWNrZXIpXG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgLSBmb3JtYXR0ZXI6IGEgZnVuY3Rpb24gdGhhdCBmb3JtYXRzIGFueSB2YWx1ZSByZWNlaXZlZCBmb3IgdGhpcyBzcGVjaWFsIHByb3BlcnR5IChmb3IgZXhhbXBsZSwgYm94U2hhZG93IGNvdWxkIHRha2UgXCI1cHggNXB4IHJlZFwiIGFuZCBmb3JtYXQgaXQgdG8gXCI1cHggNXB4IDBweCAwcHggcmVkXCIgc28gdGhhdCBib3RoIHRoZSBiZWdpbm5pbmcgYW5kIGVuZGluZyB2YWx1ZXMgaGF2ZSBhIGNvbW1vbiBvcmRlciBhbmQgcXVhbnRpdHkgb2YgdmFsdWVzLilcblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIHByZWZpeDogaWYgdHJ1ZSwgd2UnbGwgZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRoaXMgcHJvcGVydHkgcmVxdWlyZXMgYSB2ZW5kb3IgcHJlZml4IChsaWtlIFdlYmtpdCBvciBNb3ogb3IgbXMgb3IgTylcblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIGNvbG9yOiBzZXQgdGhpcyB0byB0cnVlIGlmIHRoZSB2YWx1ZSBmb3IgdGhpcyBTcGVjaWFsUHJvcCBtYXkgY29udGFpbiBjb2xvci1yZWxhdGVkIHZhbHVlcyBsaWtlIHJnYigpLCByZ2JhKCksIGV0Yy5cblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIHByaW9yaXR5OiBwcmlvcml0eSBpbiB0aGUgbGlua2VkIGxpc3Qgb3JkZXIuIEhpZ2hlciBwcmlvcml0eSBTcGVjaWFsUHJvcHMgd2lsbCBiZSB1cGRhdGVkIGJlZm9yZSBsb3dlciBwcmlvcml0eSBvbmVzLiBUaGUgZGVmYXVsdCBwcmlvcml0eSBpcyAwLlxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgIC0gbXVsdGk6IGlmIHRydWUsIHRoZSBmb3JtYXR0ZXIgc2hvdWxkIGFjY29tbW9kYXRlIGEgY29tbWEtZGVsaW1pdGVkIGxpc3Qgb2YgdmFsdWVzLCBsaWtlIGJveFNoYWRvdyBjb3VsZCBoYXZlIG11bHRpcGxlIGJveFNoYWRvd3MgbGlzdGVkIG91dC5cblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIGNvbGxhcHNpYmxlOiBpZiB0cnVlLCB0aGUgZm9ybWF0dGVyIHNob3VsZCB0cmVhdCB0aGUgdmFsdWUgbGlrZSBpdCdzIGEgdG9wL3JpZ2h0L2JvdHRvbS9sZWZ0IHZhbHVlIHRoYXQgY291bGQgYmUgY29sbGFwc2VkLCBsaWtlIFwiNXB4XCIgd291bGQgYXBwbHkgdG8gYWxsLCBcIjVweCwgMTBweFwiIHdvdWxkIHVzZSA1cHggZm9yIHRvcC9ib3R0b20gYW5kIDEwcHggZm9yIHJpZ2h0L2xlZnQsIGV0Yy5cblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIGtleXdvcmQ6IGEgc3BlY2lhbCBrZXl3b3JkIHRoYXQgY2FuIFtvcHRpb25hbGx5XSBiZSBmb3VuZCBpbnNpZGUgdGhlIHZhbHVlIChsaWtlIFwiaW5zZXRcIiBmb3IgYm94U2hhZG93KS4gVGhpcyBhbGxvd3MgdXMgdG8gdmFsaWRhdGUgYmVnaW5uaW5nL2VuZGluZyB2YWx1ZXMgdG8gbWFrZSBzdXJlIHRoZXkgbWF0Y2ggKGlmIHRoZSBrZXl3b3JkIGlzIGZvdW5kIGluIG9uZSwgaXQnbGwgYmUgYWRkZWQgdG8gdGhlIG90aGVyIGZvciBjb25zaXN0ZW5jeSBieSBkZWZhdWx0KS5cblx0XHQgKi9cblx0XHR2YXIgU3BlY2lhbFByb3AgPSBmdW5jdGlvbihwLCBvcHRpb25zKSB7XG5cdFx0XHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcdFx0XHR0aGlzLnAgPSBvcHRpb25zLnByZWZpeCA/IF9jaGVja1Byb3BQcmVmaXgocCkgfHwgcCA6IHA7XG5cdFx0XHRcdF9zcGVjaWFsUHJvcHNbcF0gPSBfc3BlY2lhbFByb3BzW3RoaXMucF0gPSB0aGlzO1xuXHRcdFx0XHR0aGlzLmZvcm1hdCA9IG9wdGlvbnMuZm9ybWF0dGVyIHx8IF9nZXRGb3JtYXR0ZXIob3B0aW9ucy5kZWZhdWx0VmFsdWUsIG9wdGlvbnMuY29sb3IsIG9wdGlvbnMuY29sbGFwc2libGUsIG9wdGlvbnMubXVsdGkpO1xuXHRcdFx0XHRpZiAob3B0aW9ucy5wYXJzZXIpIHtcblx0XHRcdFx0XHR0aGlzLnBhcnNlID0gb3B0aW9ucy5wYXJzZXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5jbHJzID0gb3B0aW9ucy5jb2xvcjtcblx0XHRcdFx0dGhpcy5tdWx0aSA9IG9wdGlvbnMubXVsdGk7XG5cdFx0XHRcdHRoaXMua2V5d29yZCA9IG9wdGlvbnMua2V5d29yZDtcblx0XHRcdFx0dGhpcy5kZmx0ID0gb3B0aW9ucy5kZWZhdWx0VmFsdWU7XG5cdFx0XHRcdHRoaXMucHIgPSBvcHRpb25zLnByaW9yaXR5IHx8IDA7XG5cdFx0XHR9LFxuXG5cdFx0XHQvL3Nob3J0Y3V0IGZvciBjcmVhdGluZyBhIG5ldyBTcGVjaWFsUHJvcCB0aGF0IGNhbiBhY2NlcHQgbXVsdGlwbGUgcHJvcGVydGllcyBhcyBhIGNvbW1hLWRlbGltaXRlZCBsaXN0IChoZWxwcyBtaW5pZmljYXRpb24pLiBkZmx0IGNhbiBiZSBhbiBhcnJheSBmb3IgbXVsdGlwbGUgdmFsdWVzICh3ZSBkb24ndCBkbyBhIGNvbW1hLWRlbGltaXRlZCBsaXN0IGJlY2F1c2UgdGhlIGRlZmF1bHQgdmFsdWUgbWF5IGNvbnRhaW4gY29tbWFzLCBsaWtlIHJlY3QoMHB4LDBweCwwcHgsMHB4KSkuIFdlIGF0dGFjaCB0aGlzIG1ldGhvZCB0byB0aGUgU3BlY2lhbFByb3AgY2xhc3Mvb2JqZWN0IGluc3RlYWQgb2YgdXNpbmcgYSBwcml2YXRlIF9jcmVhdGVTcGVjaWFsUHJvcCgpIG1ldGhvZCBzbyB0aGF0IHdlIGNhbiB0YXAgaW50byBpdCBleHRlcm5hbGx5IGlmIG5lY2Vzc2FyeSwgbGlrZSBmcm9tIGFub3RoZXIgcGx1Z2luLlxuXHRcdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wID0gX2ludGVybmFscy5fcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AgPSBmdW5jdGlvbihwLCBvcHRpb25zLCBkZWZhdWx0cykge1xuXHRcdFx0XHRpZiAodHlwZW9mKG9wdGlvbnMpICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0b3B0aW9ucyA9IHtwYXJzZXI6ZGVmYXVsdHN9OyAvL3RvIG1ha2UgYmFja3dhcmRzIGNvbXBhdGlibGUgd2l0aCBvbGRlciB2ZXJzaW9ucyBvZiBCZXppZXJQbHVnaW4gYW5kIFRocm93UHJvcHNQbHVnaW5cblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgYSA9IHAuc3BsaXQoXCIsXCIpLFxuXHRcdFx0XHRcdGQgPSBvcHRpb25zLmRlZmF1bHRWYWx1ZSxcblx0XHRcdFx0XHRpLCB0ZW1wO1xuXHRcdFx0XHRkZWZhdWx0cyA9IGRlZmF1bHRzIHx8IFtkXTtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRvcHRpb25zLnByZWZpeCA9IChpID09PSAwICYmIG9wdGlvbnMucHJlZml4KTtcblx0XHRcdFx0XHRvcHRpb25zLmRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRzW2ldIHx8IGQ7XG5cdFx0XHRcdFx0dGVtcCA9IG5ldyBTcGVjaWFsUHJvcChhW2ldLCBvcHRpb25zKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0Ly9jcmVhdGVzIGEgcGxhY2Vob2xkZXIgc3BlY2lhbCBwcm9wIGZvciBhIHBsdWdpbiBzbyB0aGF0IHRoZSBwcm9wZXJ0eSBnZXRzIGNhdWdodCB0aGUgZmlyc3QgdGltZSBhIHR3ZWVuIG9mIGl0IGlzIGF0dGVtcHRlZCwgYW5kIGF0IHRoYXQgdGltZSBpdCBtYWtlcyB0aGUgcGx1Z2luIHJlZ2lzdGVyIGl0c2VsZiwgdGh1cyB0YWtpbmcgb3ZlciBmb3IgYWxsIGZ1dHVyZSB0d2VlbnMgb2YgdGhhdCBwcm9wZXJ0eS4gVGhpcyBhbGxvd3MgdXMgdG8gbm90IG1hbmRhdGUgdGhhdCB0aGluZ3MgbG9hZCBpbiBhIHBhcnRpY3VsYXIgb3JkZXIgYW5kIGl0IGFsc28gYWxsb3dzIHVzIHRvIGxvZygpIGFuIGVycm9yIHRoYXQgaW5mb3JtcyB0aGUgdXNlciB3aGVuIHRoZXkgYXR0ZW1wdCB0byB0d2VlbiBhbiBleHRlcm5hbCBwbHVnaW4tcmVsYXRlZCBwcm9wZXJ0eSB3aXRob3V0IGxvYWRpbmcgaXRzIC5qcyBmaWxlLlxuXHRcdFx0X3JlZ2lzdGVyUGx1Z2luUHJvcCA9IF9pbnRlcm5hbHMuX3JlZ2lzdGVyUGx1Z2luUHJvcCA9IGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0aWYgKCFfc3BlY2lhbFByb3BzW3BdKSB7XG5cdFx0XHRcdFx0dmFyIHBsdWdpbk5hbWUgPSBwLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcC5zdWJzdHIoMSkgKyBcIlBsdWdpblwiO1xuXHRcdFx0XHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChwLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpIHtcblx0XHRcdFx0XHRcdHZhciBwbHVnaW5DbGFzcyA9IF9nbG9iYWxzLmNvbS5ncmVlbnNvY2sucGx1Z2luc1twbHVnaW5OYW1lXTtcblx0XHRcdFx0XHRcdGlmICghcGx1Z2luQ2xhc3MpIHtcblx0XHRcdFx0XHRcdFx0X2xvZyhcIkVycm9yOiBcIiArIHBsdWdpbk5hbWUgKyBcIiBqcyBmaWxlIG5vdCBsb2FkZWQuXCIpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRwbHVnaW5DbGFzcy5fY3NzUmVnaXN0ZXIoKTtcblx0XHRcdFx0XHRcdHJldHVybiBfc3BlY2lhbFByb3BzW3BdLnBhcnNlKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpO1xuXHRcdFx0XHRcdH19KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXG5cdFx0cCA9IFNwZWNpYWxQcm9wLnByb3RvdHlwZTtcblxuXHRcdC8qKlxuXHRcdCAqIEFsaWFzIGZvciBfcGFyc2VDb21wbGV4KCkgdGhhdCBhdXRvbWF0aWNhbGx5IHBsdWdzIGluIGNlcnRhaW4gdmFsdWVzIGZvciB0aGlzIFNwZWNpYWxQcm9wLCBsaWtlIGl0cyBwcm9wZXJ0eSBuYW1lLCB3aGV0aGVyIG9yIG5vdCBjb2xvcnMgc2hvdWxkIGJlIHNlbnNlZCwgdGhlIGRlZmF1bHQgdmFsdWUsIGFuZCBwcmlvcml0eS4gSXQgYWxzbyBsb29rcyBmb3IgYW55IGtleXdvcmQgdGhhdCB0aGUgU3BlY2lhbFByb3AgZGVmaW5lcyAobGlrZSBcImluc2V0XCIgZm9yIGJveFNoYWRvdykgYW5kIGVuc3VyZXMgdGhhdCB0aGUgYmVnaW5uaW5nIGFuZCBlbmRpbmcgdmFsdWVzIGhhdmUgdGhlIHNhbWUgbnVtYmVyIG9mIHZhbHVlcyBmb3IgU3BlY2lhbFByb3BzIHdoZXJlIG11bHRpIGlzIHRydWUgKGxpa2UgYm94U2hhZG93IGFuZCB0ZXh0U2hhZG93IGNhbiBoYXZlIGEgY29tbWEtZGVsaW1pdGVkIGxpc3QpXG5cdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IHRhcmdldCBlbGVtZW50XG5cdFx0ICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcnxvYmplY3QpfSBiIGJlZ2lubmluZyB2YWx1ZVxuXHRcdCAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXJ8b2JqZWN0KX0gZSBlbmRpbmcgKGRlc3RpbmF0aW9uKSB2YWx1ZVxuXHRcdCAqIEBwYXJhbSB7Q1NTUHJvcFR3ZWVuPX0gcHQgbmV4dCBDU1NQcm9wVHdlZW4gaW4gdGhlIGxpbmtlZCBsaXN0XG5cdFx0ICogQHBhcmFtIHtUd2VlblBsdWdpbj19IHBsdWdpbiBJZiBhbm90aGVyIHBsdWdpbiB3aWxsIGJlIHR3ZWVuaW5nIHRoZSBjb21wbGV4IHZhbHVlLCB0aGF0IFR3ZWVuUGx1Z2luIGluc3RhbmNlIGdvZXMgaGVyZS5cblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9uPX0gc2V0UmF0aW8gSWYgYSBjdXN0b20gc2V0UmF0aW8oKSBtZXRob2Qgc2hvdWxkIGJlIHVzZWQgdG8gaGFuZGxlIHRoaXMgY29tcGxleCB2YWx1ZSwgdGhhdCBnb2VzIGhlcmUuXG5cdFx0ICogQHJldHVybiB7Q1NTUHJvcFR3ZWVuPX0gRmlyc3QgQ1NTUHJvcFR3ZWVuIGluIHRoZSBsaW5rZWQgbGlzdFxuXHRcdCAqL1xuXHRcdHAucGFyc2VDb21wbGV4ID0gZnVuY3Rpb24odCwgYiwgZSwgcHQsIHBsdWdpbiwgc2V0UmF0aW8pIHtcblx0XHRcdHZhciBrd2QgPSB0aGlzLmtleXdvcmQsXG5cdFx0XHRcdGksIGJhLCBlYSwgbCwgYmksIGVpO1xuXHRcdFx0Ly9pZiB0aGlzIFNwZWNpYWxQcm9wJ3MgdmFsdWUgY2FuIGNvbnRhaW4gYSBjb21tYS1kZWxpbWl0ZWQgbGlzdCBvZiB2YWx1ZXMgKGxpa2UgYm94U2hhZG93IG9yIHRleHRTaGFkb3cpLCB3ZSBtdXN0IHBhcnNlIHRoZW0gaW4gYSBzcGVjaWFsIHdheSwgYW5kIGxvb2sgZm9yIGEga2V5d29yZCAobGlrZSBcImluc2V0XCIgZm9yIGJveFNoYWRvdykgYW5kIGVuc3VyZSB0aGF0IHRoZSBiZWdpbm5pbmcgYW5kIGVuZGluZyBCT1RIIGhhdmUgaXQgaWYgdGhlIGVuZCBkZWZpbmVzIGl0IGFzIHN1Y2guIFdlIGFsc28gbXVzdCBlbnN1cmUgdGhhdCB0aGVyZSBhcmUgYW4gZXF1YWwgbnVtYmVyIG9mIHZhbHVlcyBzcGVjaWZpZWQgKHdlIGNhbid0IHR3ZWVuIDEgYm94U2hhZG93IHRvIDMgZm9yIGV4YW1wbGUpXG5cdFx0XHRpZiAodGhpcy5tdWx0aSkgaWYgKF9jb21tYXNPdXRzaWRlUGFyZW5FeHAudGVzdChlKSB8fCBfY29tbWFzT3V0c2lkZVBhcmVuRXhwLnRlc3QoYikpIHtcblx0XHRcdFx0YmEgPSBiLnJlcGxhY2UoX2NvbW1hc091dHNpZGVQYXJlbkV4cCwgXCJ8XCIpLnNwbGl0KFwifFwiKTtcblx0XHRcdFx0ZWEgPSBlLnJlcGxhY2UoX2NvbW1hc091dHNpZGVQYXJlbkV4cCwgXCJ8XCIpLnNwbGl0KFwifFwiKTtcblx0XHRcdH0gZWxzZSBpZiAoa3dkKSB7XG5cdFx0XHRcdGJhID0gW2JdO1xuXHRcdFx0XHRlYSA9IFtlXTtcblx0XHRcdH1cblx0XHRcdGlmIChlYSkge1xuXHRcdFx0XHRsID0gKGVhLmxlbmd0aCA+IGJhLmxlbmd0aCkgPyBlYS5sZW5ndGggOiBiYS5sZW5ndGg7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRiID0gYmFbaV0gPSBiYVtpXSB8fCB0aGlzLmRmbHQ7XG5cdFx0XHRcdFx0ZSA9IGVhW2ldID0gZWFbaV0gfHwgdGhpcy5kZmx0O1xuXHRcdFx0XHRcdGlmIChrd2QpIHtcblx0XHRcdFx0XHRcdGJpID0gYi5pbmRleE9mKGt3ZCk7XG5cdFx0XHRcdFx0XHRlaSA9IGUuaW5kZXhPZihrd2QpO1xuXHRcdFx0XHRcdFx0aWYgKGJpICE9PSBlaSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoZWkgPT09IC0xKSB7IC8vaWYgdGhlIGtleXdvcmQgaXNuJ3QgaW4gdGhlIGVuZCB2YWx1ZSwgcmVtb3ZlIGl0IGZyb20gdGhlIGJlZ2lubmluZyBvbmUuXG5cdFx0XHRcdFx0XHRcdFx0YmFbaV0gPSBiYVtpXS5zcGxpdChrd2QpLmpvaW4oXCJcIik7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYmkgPT09IC0xKSB7IC8vaWYgdGhlIGtleXdvcmQgaXNuJ3QgaW4gdGhlIGJlZ2lubmluZywgYWRkIGl0LlxuXHRcdFx0XHRcdFx0XHRcdGJhW2ldICs9IFwiIFwiICsga3dkO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGIgPSBiYS5qb2luKFwiLCBcIik7XG5cdFx0XHRcdGUgPSBlYS5qb2luKFwiLCBcIik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gX3BhcnNlQ29tcGxleCh0LCB0aGlzLnAsIGIsIGUsIHRoaXMuY2xycywgdGhpcy5kZmx0LCBwdCwgdGhpcy5wciwgcGx1Z2luLCBzZXRSYXRpbyk7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEFjY2VwdHMgYSB0YXJnZXQgYW5kIGVuZCB2YWx1ZSBhbmQgc3BpdHMgYmFjayBhIENTU1Byb3BUd2VlbiB0aGF0IGhhcyBiZWVuIGluc2VydGVkIGludG8gdGhlIENTU1BsdWdpbidzIGxpbmtlZCBsaXN0IGFuZCBjb25mb3JtcyB3aXRoIGFsbCB0aGUgY29udmVudGlvbnMgd2UgdXNlIGludGVybmFsbHksIGxpa2UgdHlwZTotMSwgMCwgMSwgb3IgMiwgc2V0dGluZyB1cCBhbnkgZXh0cmEgcHJvcGVydHkgdHdlZW5zLCBwcmlvcml0eSwgZXRjLiBGb3IgZXhhbXBsZSwgaWYgd2UgaGF2ZSBhIGJveFNoYWRvdyBTcGVjaWFsUHJvcCBhbmQgY2FsbDpcblx0XHQgKiB0aGlzLl9maXJzdFBUID0gc3AucGFyc2UoZWxlbWVudCwgXCI1cHggMTBweCAyMHB4IHJnYigyNTUwLDEwMiw1MSlcIiwgXCJib3hTaGFkb3dcIiwgdGhpcyk7XG5cdFx0ICogSXQgc2hvdWxkIGZpZ3VyZSBvdXQgdGhlIHN0YXJ0aW5nIHZhbHVlIG9mIHRoZSBlbGVtZW50J3MgYm94U2hhZG93LCBjb21wYXJlIGl0IHRvIHRoZSBwcm92aWRlZCBlbmQgdmFsdWUgYW5kIGNyZWF0ZSBhbGwgdGhlIG5lY2Vzc2FyeSBDU1NQcm9wVHdlZW5zIG9mIHRoZSBhcHByb3ByaWF0ZSB0eXBlcyB0byB0d2VlbiB0aGUgYm94U2hhZG93LiBUaGUgQ1NTUHJvcFR3ZWVuIHRoYXQgZ2V0cyBzcGl0IGJhY2sgc2hvdWxkIGFscmVhZHkgYmUgaW5zZXJ0ZWQgaW50byB0aGUgbGlua2VkIGxpc3QgKHRoZSA0dGggcGFyYW1ldGVyIGlzIHRoZSBjdXJyZW50IGhlYWQsIHNvIHByZXBlbmQgdG8gdGhhdCkuXG5cdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IFRhcmdldCBvYmplY3Qgd2hvc2UgcHJvcGVydHkgaXMgYmVpbmcgdHdlZW5lZFxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBlIEVuZCB2YWx1ZSBhcyBwcm92aWRlZCBpbiB0aGUgdmFycyBvYmplY3QgKHR5cGljYWxseSBhIHN0cmluZywgYnV0IG5vdCBhbHdheXMgLSBsaWtlIGEgdGhyb3dQcm9wcyB3b3VsZCBiZSBhbiBvYmplY3QpLlxuXHRcdCAqIEBwYXJhbSB7IXN0cmluZ30gcCBQcm9wZXJ0eSBuYW1lXG5cdFx0ICogQHBhcmFtIHshQ1NTUGx1Z2lufSBjc3NwIFRoZSBDU1NQbHVnaW4gaW5zdGFuY2UgdGhhdCBzaG91bGQgYmUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgdHdlZW4uXG5cdFx0ICogQHBhcmFtIHs/Q1NTUHJvcFR3ZWVufSBwdCBUaGUgQ1NTUHJvcFR3ZWVuIHRoYXQgaXMgdGhlIGN1cnJlbnQgaGVhZCBvZiB0aGUgbGlua2VkIGxpc3QgKHdlJ2xsIHByZXBlbmQgdG8gaXQpXG5cdFx0ICogQHBhcmFtIHtUd2VlblBsdWdpbj19IHBsdWdpbiBJZiBhIHBsdWdpbiB3aWxsIGJlIHVzZWQgdG8gdHdlZW4gdGhlIHBhcnNlZCB2YWx1ZSwgdGhpcyBpcyB0aGUgcGx1Z2luIGluc3RhbmNlLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0PX0gdmFycyBPcmlnaW5hbCB2YXJzIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBkYXRhIGZvciBwYXJzaW5nLlxuXHRcdCAqIEByZXR1cm4ge0NTU1Byb3BUd2Vlbn0gVGhlIGZpcnN0IENTU1Byb3BUd2VlbiBpbiB0aGUgbGlua2VkIGxpc3Qgd2hpY2ggaW5jbHVkZXMgdGhlIG5ldyBvbmUocykgYWRkZWQgYnkgdGhlIHBhcnNlKCkgY2FsbC5cblx0XHQgKi9cblx0XHRwLnBhcnNlID0gZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbiwgdmFycykge1xuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VDb21wbGV4KHQuc3R5bGUsIHRoaXMuZm9ybWF0KF9nZXRTdHlsZSh0LCB0aGlzLnAsIF9jcywgZmFsc2UsIHRoaXMuZGZsdCkpLCB0aGlzLmZvcm1hdChlKSwgcHQsIHBsdWdpbik7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFJlZ2lzdGVycyBhIHNwZWNpYWwgcHJvcGVydHkgdGhhdCBzaG91bGQgYmUgaW50ZXJjZXB0ZWQgZnJvbSBhbnkgXCJjc3NcIiBvYmplY3RzIGRlZmluZWQgaW4gdHdlZW5zLiBUaGlzIGFsbG93cyB5b3UgdG8gaGFuZGxlIHRoZW0gaG93ZXZlciB5b3Ugd2FudCB3aXRob3V0IENTU1BsdWdpbiBkb2luZyBpdCBmb3IgeW91LiBUaGUgMm5kIHBhcmFtZXRlciBzaG91bGQgYmUgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgMyBwYXJhbWV0ZXJzOlxuXHRcdCAqICAxKSBUYXJnZXQgb2JqZWN0IHdob3NlIHByb3BlcnR5IHNob3VsZCBiZSB0d2VlbmVkICh0eXBpY2FsbHkgYSBET00gZWxlbWVudClcblx0XHQgKiAgMikgVGhlIGVuZC9kZXN0aW5hdGlvbiB2YWx1ZSAoY291bGQgYmUgYSBzdHJpbmcsIG51bWJlciwgb2JqZWN0LCBvciB3aGF0ZXZlciB5b3Ugd2FudClcblx0XHQgKiAgMykgVGhlIHR3ZWVuIGluc3RhbmNlICh5b3UgcHJvYmFibHkgZG9uJ3QgbmVlZCB0byB3b3JyeSBhYm91dCB0aGlzLCBidXQgaXQgY2FuIGJlIHVzZWZ1bCBmb3IgbG9va2luZyB1cCBpbmZvcm1hdGlvbiBsaWtlIHRoZSBkdXJhdGlvbilcblx0XHQgKlxuXHRcdCAqIFRoZW4sIHlvdXIgZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGVhY2ggdGltZSB0aGUgdHdlZW4gZ2V0cyByZW5kZXJlZCwgcGFzc2luZyBhIG51bWVyaWMgXCJyYXRpb1wiIHBhcmFtZXRlciB0byB5b3VyIGZ1bmN0aW9uIHRoYXQgaW5kaWNhdGVzIHRoZSBjaGFuZ2UgZmFjdG9yICh1c3VhbGx5IGJldHdlZW4gMCBhbmQgMSkuIEZvciBleGFtcGxlOlxuXHRcdCAqXG5cdFx0ICogQ1NTUGx1Z2luLnJlZ2lzdGVyU3BlY2lhbFByb3AoXCJteUN1c3RvbVByb3BcIiwgZnVuY3Rpb24odGFyZ2V0LCB2YWx1ZSwgdHdlZW4pIHtcblx0XHQgKiAgICAgIHZhciBzdGFydCA9IHRhcmdldC5zdHlsZS53aWR0aDtcblx0XHQgKiAgICAgIHJldHVybiBmdW5jdGlvbihyYXRpbykge1xuXHRcdCAqICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUud2lkdGggPSAoc3RhcnQgKyB2YWx1ZSAqIHJhdGlvKSArIFwicHhcIjtcblx0XHQgKiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXQgd2lkdGggdG8gXCIgKyB0YXJnZXQuc3R5bGUud2lkdGgpO1xuXHRcdCAqICAgICAgICAgIH1cblx0XHQgKiB9LCAwKTtcblx0XHQgKlxuXHRcdCAqIFRoZW4sIHdoZW4gSSBkbyB0aGlzIHR3ZWVuLCBpdCB3aWxsIHRyaWdnZXIgbXkgc3BlY2lhbCBwcm9wZXJ0eTpcblx0XHQgKlxuXHRcdCAqIFR3ZWVuTGl0ZS50byhlbGVtZW50LCAxLCB7Y3NzOntteUN1c3RvbVByb3A6MTAwfX0pO1xuXHRcdCAqXG5cdFx0ICogSW4gdGhlIGV4YW1wbGUsIG9mIGNvdXJzZSwgd2UncmUganVzdCBjaGFuZ2luZyB0aGUgd2lkdGgsIGJ1dCB5b3UgY2FuIGRvIGFueXRoaW5nIHlvdSB3YW50LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHshc3RyaW5nfSBuYW1lIFByb3BlcnR5IG5hbWUgKG9yIGNvbW1hLWRlbGltaXRlZCBsaXN0IG9mIHByb3BlcnR5IG5hbWVzKSB0aGF0IHNob3VsZCBiZSBpbnRlcmNlcHRlZCBhbmQgaGFuZGxlZCBieSB5b3VyIGZ1bmN0aW9uLiBGb3IgZXhhbXBsZSwgaWYgSSBkZWZpbmUgXCJteUN1c3RvbVByb3BcIiwgdGhlbiBpdCB3b3VsZCBoYW5kbGUgdGhhdCBwb3J0aW9uIG9mIHRoZSBmb2xsb3dpbmcgdHdlZW46IFR3ZWVuTGl0ZS50byhlbGVtZW50LCAxLCB7Y3NzOntteUN1c3RvbVByb3A6MTAwfX0pXG5cdFx0ICogQHBhcmFtIHshZnVuY3Rpb24oT2JqZWN0LCBPYmplY3QsIE9iamVjdCwgc3RyaW5nKTpmdW5jdGlvbihudW1iZXIpfSBvbkluaXRUd2VlbiBUaGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIGEgdHdlZW4gb2YgdGhpcyBzcGVjaWFsIHByb3BlcnR5IGlzIHBlcmZvcm1lZC4gVGhlIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSA0IHBhcmFtZXRlcnM6IDEpIFRhcmdldCBvYmplY3QgdGhhdCBzaG91bGQgYmUgdHdlZW5lZCwgMikgVmFsdWUgdGhhdCB3YXMgcGFzc2VkIHRvIHRoZSB0d2VlbiwgMykgVGhlIHR3ZWVuIGluc3RhbmNlIGl0c2VsZiAocmFyZWx5IHVzZWQpLCBhbmQgNCkgVGhlIHByb3BlcnR5IG5hbWUgdGhhdCdzIGJlaW5nIHR3ZWVuZWQuIFlvdXIgZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCBvbiBldmVyeSB1cGRhdGUgb2YgdGhlIHR3ZWVuLiBUaGF0IGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSBhIHNpbmdsZSBwYXJhbWV0ZXIgdGhhdCBpcyBhIFwiY2hhbmdlIGZhY3RvclwiIHZhbHVlICh0eXBpY2FsbHkgYmV0d2VlbiAwIGFuZCAxKSBpbmRpY2F0aW5nIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFzIGEgcmF0aW8uIFlvdSBjYW4gdXNlIHRoaXMgdG8gZGV0ZXJtaW5lIGhvdyB0byBzZXQgdGhlIHZhbHVlcyBhcHByb3ByaWF0ZWx5IGluIHlvdXIgZnVuY3Rpb24uXG5cdFx0ICogQHBhcmFtIHtudW1iZXI9fSBwcmlvcml0eSBQcmlvcml0eSB0aGF0IGhlbHBzIHRoZSBlbmdpbmUgZGV0ZXJtaW5lIHRoZSBvcmRlciBpbiB3aGljaCB0byBzZXQgdGhlIHByb3BlcnRpZXMgKGRlZmF1bHQ6IDApLiBIaWdoZXIgcHJpb3JpdHkgcHJvcGVydGllcyB3aWxsIGJlIHVwZGF0ZWQgYmVmb3JlIGxvd2VyIHByaW9yaXR5IG9uZXMuXG5cdFx0ICovXG5cdFx0Q1NTUGx1Z2luLnJlZ2lzdGVyU3BlY2lhbFByb3AgPSBmdW5jdGlvbihuYW1lLCBvbkluaXRUd2VlbiwgcHJpb3JpdHkpIHtcblx0XHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChuYW1lLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpIHtcblx0XHRcdFx0dmFyIHJ2ID0gbmV3IENTU1Byb3BUd2Vlbih0LCBwLCAwLCAwLCBwdCwgMiwgcCwgZmFsc2UsIHByaW9yaXR5KTtcblx0XHRcdFx0cnYucGx1Z2luID0gcGx1Z2luO1xuXHRcdFx0XHRydi5zZXRSYXRpbyA9IG9uSW5pdFR3ZWVuKHQsIGUsIGNzc3AuX3R3ZWVuLCBwKTtcblx0XHRcdFx0cmV0dXJuIHJ2O1xuXHRcdFx0fSwgcHJpb3JpdHk6cHJpb3JpdHl9KTtcblx0XHR9O1xuXG5cblxuXG5cblxuXHRcdC8vdHJhbnNmb3JtLXJlbGF0ZWQgbWV0aG9kcyBhbmQgcHJvcGVydGllc1xuXHRcdENTU1BsdWdpbi51c2VTVkdUcmFuc2Zvcm1BdHRyID0gX2lzU2FmYXJpIHx8IF9pc0ZpcmVmb3g7IC8vU2FmYXJpIGFuZCBGaXJlZm94IGJvdGggaGF2ZSBzb21lIHJlbmRlcmluZyBidWdzIHdoZW4gYXBwbHlpbmcgQ1NTIHRyYW5zZm9ybXMgdG8gU1ZHIGVsZW1lbnRzLCBzbyBkZWZhdWx0IHRvIHVzaW5nIHRoZSBcInRyYW5zZm9ybVwiIGF0dHJpYnV0ZSBpbnN0ZWFkICh1c2VycyBjYW4gb3ZlcnJpZGUgdGhpcykuXG5cdFx0dmFyIF90cmFuc2Zvcm1Qcm9wcyA9IChcInNjYWxlWCxzY2FsZVksc2NhbGVaLHgseSx6LHNrZXdYLHNrZXdZLHJvdGF0aW9uLHJvdGF0aW9uWCxyb3RhdGlvblkscGVyc3BlY3RpdmUseFBlcmNlbnQseVBlcmNlbnRcIikuc3BsaXQoXCIsXCIpLFxuXHRcdFx0X3RyYW5zZm9ybVByb3AgPSBfY2hlY2tQcm9wUHJlZml4KFwidHJhbnNmb3JtXCIpLCAvL3RoZSBKYXZhc2NyaXB0IChjYW1lbENhc2UpIHRyYW5zZm9ybSBwcm9wZXJ0eSwgbGlrZSBtc1RyYW5zZm9ybSwgV2Via2l0VHJhbnNmb3JtLCBNb3pUcmFuc2Zvcm0sIG9yIE9UcmFuc2Zvcm0uXG5cdFx0XHRfdHJhbnNmb3JtUHJvcENTUyA9IF9wcmVmaXhDU1MgKyBcInRyYW5zZm9ybVwiLFxuXHRcdFx0X3RyYW5zZm9ybU9yaWdpblByb3AgPSBfY2hlY2tQcm9wUHJlZml4KFwidHJhbnNmb3JtT3JpZ2luXCIpLFxuXHRcdFx0X3N1cHBvcnRzM0QgPSAoX2NoZWNrUHJvcFByZWZpeChcInBlcnNwZWN0aXZlXCIpICE9PSBudWxsKSxcblx0XHRcdFRyYW5zZm9ybSA9IF9pbnRlcm5hbHMuVHJhbnNmb3JtID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMucGVyc3BlY3RpdmUgPSBwYXJzZUZsb2F0KENTU1BsdWdpbi5kZWZhdWx0VHJhbnNmb3JtUGVyc3BlY3RpdmUpIHx8IDA7XG5cdFx0XHRcdHRoaXMuZm9yY2UzRCA9IChDU1NQbHVnaW4uZGVmYXVsdEZvcmNlM0QgPT09IGZhbHNlIHx8ICFfc3VwcG9ydHMzRCkgPyBmYWxzZSA6IENTU1BsdWdpbi5kZWZhdWx0Rm9yY2UzRCB8fCBcImF1dG9cIjtcblx0XHRcdH0sXG5cdFx0XHRfU1ZHRWxlbWVudCA9IHdpbmRvdy5TVkdFbGVtZW50LFxuXHRcdFx0X3VzZVNWR1RyYW5zZm9ybUF0dHIsXG5cdFx0XHQvL1NvbWUgYnJvd3NlcnMgKGxpa2UgRmlyZWZveCBhbmQgSUUpIGRvbid0IGhvbm9yIHRyYW5zZm9ybS1vcmlnaW4gcHJvcGVybHkgaW4gU1ZHIGVsZW1lbnRzLCBzbyB3ZSBuZWVkIHRvIG1hbnVhbGx5IGFkanVzdCB0aGUgbWF0cml4IGFjY29yZGluZ2x5LiBXZSBmZWF0dXJlIGRldGVjdCBoZXJlIHJhdGhlciB0aGFuIGFsd2F5cyBkb2luZyB0aGUgY29udmVyc2lvbiBmb3IgY2VydGFpbiBicm93c2VycyBiZWNhdXNlIHRoZXkgbWF5IGZpeCB0aGUgcHJvYmxlbSBhdCBzb21lIHBvaW50IGluIHRoZSBmdXR1cmUuXG5cblx0XHRcdF9jcmVhdGVTVkcgPSBmdW5jdGlvbih0eXBlLCBjb250YWluZXIsIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0dmFyIGVsZW1lbnQgPSBfZG9jLmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIHR5cGUpLFxuXHRcdFx0XHRcdHJlZyA9IC8oW2Etel0pKFtBLVpdKS9nLFxuXHRcdFx0XHRcdHA7XG5cdFx0XHRcdGZvciAocCBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCBwLnJlcGxhY2UocmVnLCBcIiQxLSQyXCIpLnRvTG93ZXJDYXNlKCksIGF0dHJpYnV0ZXNbcF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbGVtZW50KTtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdFx0XHR9LFxuXHRcdFx0X2RvY0VsZW1lbnQgPSBfZG9jLmRvY3VtZW50RWxlbWVudCxcblx0XHRcdF9mb3JjZVNWR1RyYW5zZm9ybUF0dHIgPSAoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vSUUgYW5kIEFuZHJvaWQgc3RvY2sgZG9uJ3Qgc3VwcG9ydCBDU1MgdHJhbnNmb3JtcyBvbiBTVkcgZWxlbWVudHMsIHNvIHdlIG11c3Qgd3JpdGUgdGhlbSB0byB0aGUgXCJ0cmFuc2Zvcm1cIiBhdHRyaWJ1dGUuIFdlIHBvcHVsYXRlIHRoaXMgdmFyaWFibGUgaW4gdGhlIF9wYXJzZVRyYW5zZm9ybSgpIG1ldGhvZCwgYW5kIG9ubHkgaWYvd2hlbiB3ZSBjb21lIGFjcm9zcyBhbiBTVkcgZWxlbWVudFxuXHRcdFx0XHR2YXIgZm9yY2UgPSBfaWVWZXJzIHx8ICgvQW5kcm9pZC9pLnRlc3QoX2FnZW50KSAmJiAhd2luZG93LmNocm9tZSksXG5cdFx0XHRcdFx0c3ZnLCByZWN0LCB3aWR0aDtcblx0XHRcdFx0aWYgKF9kb2MuY3JlYXRlRWxlbWVudE5TICYmICFmb3JjZSkgeyAvL0lFOCBhbmQgZWFybGllciBkb2Vzbid0IHN1cHBvcnQgU1ZHIGFueXdheVxuXHRcdFx0XHRcdHN2ZyA9IF9jcmVhdGVTVkcoXCJzdmdcIiwgX2RvY0VsZW1lbnQpO1xuXHRcdFx0XHRcdHJlY3QgPSBfY3JlYXRlU1ZHKFwicmVjdFwiLCBzdmcsIHt3aWR0aDoxMDAsIGhlaWdodDo1MCwgeDoxMDB9KTtcblx0XHRcdFx0XHR3aWR0aCA9IHJlY3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG5cdFx0XHRcdFx0cmVjdC5zdHlsZVtfdHJhbnNmb3JtT3JpZ2luUHJvcF0gPSBcIjUwJSA1MCVcIjtcblx0XHRcdFx0XHRyZWN0LnN0eWxlW190cmFuc2Zvcm1Qcm9wXSA9IFwic2NhbGVYKDAuNSlcIjtcblx0XHRcdFx0XHRmb3JjZSA9ICh3aWR0aCA9PT0gcmVjdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAmJiAhKF9pc0ZpcmVmb3ggJiYgX3N1cHBvcnRzM0QpKTsgLy9ub3RlOiBGaXJlZm94IGZhaWxzIHRoZSB0ZXN0IGV2ZW4gdGhvdWdoIGl0IGRvZXMgc3VwcG9ydCBDU1MgdHJhbnNmb3JtcyBpbiAzRC4gU2luY2Ugd2UgY2FuJ3QgcHVzaCAzRCBzdHVmZiBpbnRvIHRoZSB0cmFuc2Zvcm0gYXR0cmlidXRlLCB3ZSBmb3JjZSBGaXJlZm94IHRvIHBhc3MgdGhlIHRlc3QgaGVyZSAoYXMgbG9uZyBhcyBpdCBkb2VzIHRydWx5IHN1cHBvcnQgM0QpLlxuXHRcdFx0XHRcdF9kb2NFbGVtZW50LnJlbW92ZUNoaWxkKHN2Zyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZvcmNlO1xuXHRcdFx0fSkoKSxcblx0XHRcdF9wYXJzZVNWR09yaWdpbiA9IGZ1bmN0aW9uKGUsIGxvY2FsLCBkZWNvcmF0ZWUsIGFic29sdXRlLCBzbW9vdGhPcmlnaW4sIHNraXBSZWNvcmQpIHtcblx0XHRcdFx0dmFyIHRtID0gZS5fZ3NUcmFuc2Zvcm0sXG5cdFx0XHRcdFx0bSA9IF9nZXRNYXRyaXgoZSwgdHJ1ZSksXG5cdFx0XHRcdFx0diwgeCwgeSwgeE9yaWdpbiwgeU9yaWdpbiwgYSwgYiwgYywgZCwgdHgsIHR5LCBkZXRlcm1pbmFudCwgeE9yaWdpbk9sZCwgeU9yaWdpbk9sZDtcblx0XHRcdFx0aWYgKHRtKSB7XG5cdFx0XHRcdFx0eE9yaWdpbk9sZCA9IHRtLnhPcmlnaW47IC8vcmVjb3JkIHRoZSBvcmlnaW5hbCB2YWx1ZXMgYmVmb3JlIHdlIGFsdGVyIHRoZW0uXG5cdFx0XHRcdFx0eU9yaWdpbk9sZCA9IHRtLnlPcmlnaW47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFhYnNvbHV0ZSB8fCAodiA9IGFic29sdXRlLnNwbGl0KFwiIFwiKSkubGVuZ3RoIDwgMikge1xuXHRcdFx0XHRcdGIgPSBlLmdldEJCb3goKTtcblx0XHRcdFx0XHRsb2NhbCA9IF9wYXJzZVBvc2l0aW9uKGxvY2FsKS5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0diA9IFsobG9jYWxbMF0uaW5kZXhPZihcIiVcIikgIT09IC0xID8gcGFyc2VGbG9hdChsb2NhbFswXSkgLyAxMDAgKiBiLndpZHRoIDogcGFyc2VGbG9hdChsb2NhbFswXSkpICsgYi54LFxuXHRcdFx0XHRcdFx0IChsb2NhbFsxXS5pbmRleE9mKFwiJVwiKSAhPT0gLTEgPyBwYXJzZUZsb2F0KGxvY2FsWzFdKSAvIDEwMCAqIGIuaGVpZ2h0IDogcGFyc2VGbG9hdChsb2NhbFsxXSkpICsgYi55XTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkZWNvcmF0ZWUueE9yaWdpbiA9IHhPcmlnaW4gPSBwYXJzZUZsb2F0KHZbMF0pO1xuXHRcdFx0XHRkZWNvcmF0ZWUueU9yaWdpbiA9IHlPcmlnaW4gPSBwYXJzZUZsb2F0KHZbMV0pO1xuXHRcdFx0XHRpZiAoYWJzb2x1dGUgJiYgbSAhPT0gX2lkZW50aXR5MkRNYXRyaXgpIHsgLy9pZiBzdmdPcmlnaW4gaXMgYmVpbmcgc2V0LCB3ZSBtdXN0IGludmVydCB0aGUgbWF0cml4IGFuZCBkZXRlcm1pbmUgd2hlcmUgdGhlIGFic29sdXRlIHBvaW50IGlzLCBmYWN0b3JpbmcgaW4gdGhlIGN1cnJlbnQgdHJhbnNmb3Jtcy4gT3RoZXJ3aXNlLCB0aGUgc3ZnT3JpZ2luIHdvdWxkIGJlIGJhc2VkIG9uIHRoZSBlbGVtZW50J3Mgbm9uLXRyYW5zZm9ybWVkIHBvc2l0aW9uIG9uIHRoZSBjYW52YXMuXG5cdFx0XHRcdFx0YSA9IG1bMF07XG5cdFx0XHRcdFx0YiA9IG1bMV07XG5cdFx0XHRcdFx0YyA9IG1bMl07XG5cdFx0XHRcdFx0ZCA9IG1bM107XG5cdFx0XHRcdFx0dHggPSBtWzRdO1xuXHRcdFx0XHRcdHR5ID0gbVs1XTtcblx0XHRcdFx0XHRkZXRlcm1pbmFudCA9IChhICogZCAtIGIgKiBjKTtcblx0XHRcdFx0XHR4ID0geE9yaWdpbiAqIChkIC8gZGV0ZXJtaW5hbnQpICsgeU9yaWdpbiAqICgtYyAvIGRldGVybWluYW50KSArICgoYyAqIHR5IC0gZCAqIHR4KSAvIGRldGVybWluYW50KTtcblx0XHRcdFx0XHR5ID0geE9yaWdpbiAqICgtYiAvIGRldGVybWluYW50KSArIHlPcmlnaW4gKiAoYSAvIGRldGVybWluYW50KSAtICgoYSAqIHR5IC0gYiAqIHR4KSAvIGRldGVybWluYW50KTtcblx0XHRcdFx0XHR4T3JpZ2luID0gZGVjb3JhdGVlLnhPcmlnaW4gPSB2WzBdID0geDtcblx0XHRcdFx0XHR5T3JpZ2luID0gZGVjb3JhdGVlLnlPcmlnaW4gPSB2WzFdID0geTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodG0pIHsgLy9hdm9pZCBqdW1wIHdoZW4gdHJhbnNmb3JtT3JpZ2luIGlzIGNoYW5nZWQgLSBhZGp1c3QgdGhlIHgveSB2YWx1ZXMgYWNjb3JkaW5nbHlcblx0XHRcdFx0XHRpZiAoc2tpcFJlY29yZCkge1xuXHRcdFx0XHRcdFx0ZGVjb3JhdGVlLnhPZmZzZXQgPSB0bS54T2Zmc2V0O1xuXHRcdFx0XHRcdFx0ZGVjb3JhdGVlLnlPZmZzZXQgPSB0bS55T2Zmc2V0O1xuXHRcdFx0XHRcdFx0dG0gPSBkZWNvcmF0ZWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChzbW9vdGhPcmlnaW4gfHwgKHNtb290aE9yaWdpbiAhPT0gZmFsc2UgJiYgQ1NTUGx1Z2luLmRlZmF1bHRTbW9vdGhPcmlnaW4gIT09IGZhbHNlKSkge1xuXHRcdFx0XHRcdFx0eCA9IHhPcmlnaW4gLSB4T3JpZ2luT2xkO1xuXHRcdFx0XHRcdFx0eSA9IHlPcmlnaW4gLSB5T3JpZ2luT2xkO1xuXHRcdFx0XHRcdFx0Ly9vcmlnaW5hbGx5LCB3ZSBzaW1wbHkgYWRqdXN0ZWQgdGhlIHggYW5kIHkgdmFsdWVzLCBidXQgdGhhdCB3b3VsZCBjYXVzZSBwcm9ibGVtcyBpZiwgZm9yIGV4YW1wbGUsIHlvdSBjcmVhdGVkIGEgcm90YXRpb25hbCB0d2VlbiBwYXJ0LXdheSB0aHJvdWdoIGFuIHgveSB0d2Vlbi4gTWFuYWdpbmcgdGhlIG9mZnNldCBpbiBhIHNlcGFyYXRlIHZhcmlhYmxlIGdpdmVzIHVzIHVsdGltYXRlIGZsZXhpYmlsaXR5LlxuXHRcdFx0XHRcdFx0Ly90bS54IC09IHggLSAoeCAqIG1bMF0gKyB5ICogbVsyXSk7XG5cdFx0XHRcdFx0XHQvL3RtLnkgLT0geSAtICh4ICogbVsxXSArIHkgKiBtWzNdKTtcblx0XHRcdFx0XHRcdHRtLnhPZmZzZXQgKz0gKHggKiBtWzBdICsgeSAqIG1bMl0pIC0geDtcblx0XHRcdFx0XHRcdHRtLnlPZmZzZXQgKz0gKHggKiBtWzFdICsgeSAqIG1bM10pIC0geTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dG0ueE9mZnNldCA9IHRtLnlPZmZzZXQgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXNraXBSZWNvcmQpIHtcblx0XHRcdFx0XHRlLnNldEF0dHJpYnV0ZShcImRhdGEtc3ZnLW9yaWdpblwiLCB2LmpvaW4oXCIgXCIpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdF9jYW5HZXRCQm94ID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHJldHVybiBlLmdldEJCb3goKTsgLy9GaXJlZm94IHRocm93cyBlcnJvcnMgaWYgeW91IHRyeSBjYWxsaW5nIGdldEJCb3goKSBvbiBhbiBTVkcgZWxlbWVudCB0aGF0J3Mgbm90IHJlbmRlcmVkIChsaWtlIGluIGEgPHN5bWJvbD4gb3IgPGRlZnM+KS4gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NjEyMTE4XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHt9XG5cdFx0XHR9LFxuXHRcdFx0X2lzU1ZHID0gZnVuY3Rpb24oZSkgeyAvL3JlcG9ydHMgaWYgdGhlIGVsZW1lbnQgaXMgYW4gU1ZHIG9uIHdoaWNoIGdldEJCb3goKSBhY3R1YWxseSB3b3Jrc1xuXHRcdFx0XHRyZXR1cm4gISEoX1NWR0VsZW1lbnQgJiYgZS5nZXRCQm94ICYmIGUuZ2V0Q1RNICYmIF9jYW5HZXRCQm94KGUpICYmICghZS5wYXJlbnROb2RlIHx8IChlLnBhcmVudE5vZGUuZ2V0QkJveCAmJiBlLnBhcmVudE5vZGUuZ2V0Q1RNKSkpO1xuXHRcdFx0fSxcblx0XHRcdF9pZGVudGl0eTJETWF0cml4ID0gWzEsMCwwLDEsMCwwXSxcblx0XHRcdF9nZXRNYXRyaXggPSBmdW5jdGlvbihlLCBmb3JjZTJEKSB7XG5cdFx0XHRcdHZhciB0bSA9IGUuX2dzVHJhbnNmb3JtIHx8IG5ldyBUcmFuc2Zvcm0oKSxcblx0XHRcdFx0XHRybmQgPSAxMDAwMDAsXG5cdFx0XHRcdFx0c3R5bGUgPSBlLnN0eWxlLFxuXHRcdFx0XHRcdGlzRGVmYXVsdCwgcywgbSwgbiwgZGVjLCBub25lO1xuXHRcdFx0XHRpZiAoX3RyYW5zZm9ybVByb3ApIHtcblx0XHRcdFx0XHRzID0gX2dldFN0eWxlKGUsIF90cmFuc2Zvcm1Qcm9wQ1NTLCBudWxsLCB0cnVlKTtcblx0XHRcdFx0fSBlbHNlIGlmIChlLmN1cnJlbnRTdHlsZSkge1xuXHRcdFx0XHRcdC8vZm9yIG9sZGVyIHZlcnNpb25zIG9mIElFLCB3ZSBuZWVkIHRvIGludGVycHJldCB0aGUgZmlsdGVyIHBvcnRpb24gdGhhdCBpcyBpbiB0aGUgZm9ybWF0OiBwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuTWF0cml4KE0xMT02LjEyMzIzMzk5NTczNjc2NmUtMTcsIE0xMj0tMSwgTTIxPTEsIE0yMj02LjEyMzIzMzk5NTczNjc2NmUtMTcsIHNpemluZ01ldGhvZD0nYXV0byBleHBhbmQnKSBOb3RpY2UgdGhhdCB3ZSBuZWVkIHRvIHN3YXAgYiBhbmQgYyBjb21wYXJlZCB0byBhIG5vcm1hbCBtYXRyaXguXG5cdFx0XHRcdFx0cyA9IGUuY3VycmVudFN0eWxlLmZpbHRlci5tYXRjaChfaWVHZXRNYXRyaXhFeHApO1xuXHRcdFx0XHRcdHMgPSAocyAmJiBzLmxlbmd0aCA9PT0gNCkgPyBbc1swXS5zdWJzdHIoNCksIE51bWJlcihzWzJdLnN1YnN0cig0KSksIE51bWJlcihzWzFdLnN1YnN0cig0KSksIHNbM10uc3Vic3RyKDQpLCAodG0ueCB8fCAwKSwgKHRtLnkgfHwgMCldLmpvaW4oXCIsXCIpIDogXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpc0RlZmF1bHQgPSAoIXMgfHwgcyA9PT0gXCJub25lXCIgfHwgcyA9PT0gXCJtYXRyaXgoMSwgMCwgMCwgMSwgMCwgMClcIik7XG5cdFx0XHRcdGlmIChpc0RlZmF1bHQgJiYgX3RyYW5zZm9ybVByb3AgJiYgKChub25lID0gKF9nZXRDb21wdXRlZFN0eWxlKGUpLmRpc3BsYXkgPT09IFwibm9uZVwiKSkgfHwgIWUucGFyZW50Tm9kZSkpIHtcblx0XHRcdFx0XHRpZiAobm9uZSkgeyAvL2Jyb3dzZXJzIGRvbid0IHJlcG9ydCB0cmFuc2Zvcm1zIGFjY3VyYXRlbHkgdW5sZXNzIHRoZSBlbGVtZW50IGlzIGluIHRoZSBET00gYW5kIGhhcyBhIGRpc3BsYXkgdmFsdWUgdGhhdCdzIG5vdCBcIm5vbmVcIi5cblx0XHRcdFx0XHRcdG4gPSBzdHlsZS5kaXNwbGF5O1xuXHRcdFx0XHRcdFx0c3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCFlLnBhcmVudE5vZGUpIHtcblx0XHRcdFx0XHRcdGRlYyA9IDE7IC8vZmxhZ1xuXHRcdFx0XHRcdFx0X2RvY0VsZW1lbnQuYXBwZW5kQ2hpbGQoZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHMgPSBfZ2V0U3R5bGUoZSwgX3RyYW5zZm9ybVByb3BDU1MsIG51bGwsIHRydWUpO1xuXHRcdFx0XHRcdGlzRGVmYXVsdCA9ICghcyB8fCBzID09PSBcIm5vbmVcIiB8fCBzID09PSBcIm1hdHJpeCgxLCAwLCAwLCAxLCAwLCAwKVwiKTtcblx0XHRcdFx0XHRpZiAobikge1xuXHRcdFx0XHRcdFx0c3R5bGUuZGlzcGxheSA9IG47XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChub25lKSB7XG5cdFx0XHRcdFx0XHRfcmVtb3ZlUHJvcChzdHlsZSwgXCJkaXNwbGF5XCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoZGVjKSB7XG5cdFx0XHRcdFx0XHRfZG9jRWxlbWVudC5yZW1vdmVDaGlsZChlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRtLnN2ZyB8fCAoZS5nZXRCQm94ICYmIF9pc1NWRyhlKSkpIHtcblx0XHRcdFx0XHRpZiAoaXNEZWZhdWx0ICYmIChzdHlsZVtfdHJhbnNmb3JtUHJvcF0gKyBcIlwiKS5pbmRleE9mKFwibWF0cml4XCIpICE9PSAtMSkgeyAvL3NvbWUgYnJvd3NlcnMgKGxpa2UgQ2hyb21lIDQwKSBkb24ndCBjb3JyZWN0bHkgcmVwb3J0IHRyYW5zZm9ybXMgdGhhdCBhcmUgYXBwbGllZCBpbmxpbmUgb24gYW4gU1ZHIGVsZW1lbnQgKHRoZXkgZG9uJ3QgZ2V0IGluY2x1ZGVkIGluIHRoZSBjb21wdXRlZCBzdHlsZSksIHNvIHdlIGRvdWJsZS1jaGVjayBoZXJlIGFuZCBhY2NlcHQgbWF0cml4IHZhbHVlc1xuXHRcdFx0XHRcdFx0cyA9IHN0eWxlW190cmFuc2Zvcm1Qcm9wXTtcblx0XHRcdFx0XHRcdGlzRGVmYXVsdCA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG0gPSBlLmdldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiKTtcblx0XHRcdFx0XHRpZiAoaXNEZWZhdWx0ICYmIG0pIHtcblx0XHRcdFx0XHRcdGlmIChtLmluZGV4T2YoXCJtYXRyaXhcIikgIT09IC0xKSB7IC8vanVzdCBpbiBjYXNlIHRoZXJlJ3MgYSBcInRyYW5zZm9ybVwiIHZhbHVlIHNwZWNpZmllZCBhcyBhbiBhdHRyaWJ1dGUgaW5zdGVhZCBvZiBDU1Mgc3R5bGUuIEFjY2VwdCBlaXRoZXIgYSBtYXRyaXgoKSBvciBzaW1wbGUgdHJhbnNsYXRlKCkgdmFsdWUgdGhvdWdoLlxuXHRcdFx0XHRcdFx0XHRzID0gbTtcblx0XHRcdFx0XHRcdFx0aXNEZWZhdWx0ID0gMDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobS5pbmRleE9mKFwidHJhbnNsYXRlXCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRzID0gXCJtYXRyaXgoMSwwLDAsMSxcIiArIG0ubWF0Y2goLyg/OlxcLXxcXGIpW1xcZFxcLVxcLmVdK1xcYi9naSkuam9pbihcIixcIikgKyBcIilcIjtcblx0XHRcdFx0XHRcdFx0aXNEZWZhdWx0ID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGlzRGVmYXVsdCkge1xuXHRcdFx0XHRcdHJldHVybiBfaWRlbnRpdHkyRE1hdHJpeDtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL3NwbGl0IHRoZSBtYXRyaXggdmFsdWVzIG91dCBpbnRvIGFuIGFycmF5IChtIGZvciBtYXRyaXgpXG5cdFx0XHRcdG0gPSAocyB8fCBcIlwiKS5tYXRjaChfbnVtRXhwKSB8fCBbXTtcblx0XHRcdFx0aSA9IG0ubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRuID0gTnVtYmVyKG1baV0pO1xuXHRcdFx0XHRcdG1baV0gPSAoZGVjID0gbiAtIChuIHw9IDApKSA/ICgoZGVjICogcm5kICsgKGRlYyA8IDAgPyAtMC41IDogMC41KSkgfCAwKSAvIHJuZCArIG4gOiBuOyAvL2NvbnZlcnQgc3RyaW5ncyB0byBOdW1iZXJzIGFuZCByb3VuZCB0byA1IGRlY2ltYWwgcGxhY2VzIHRvIGF2b2lkIGlzc3VlcyB3aXRoIHRpbnkgbnVtYmVycy4gUm91Z2hseSAyMHggZmFzdGVyIHRoYW4gTnVtYmVyLnRvRml4ZWQoKS4gV2UgYWxzbyBtdXN0IG1ha2Ugc3VyZSB0byByb3VuZCBiZWZvcmUgZGl2aWRpbmcgc28gdGhhdCB2YWx1ZXMgbGlrZSAwLjk5OTk5OTk5OTkgYmVjb21lIDEgdG8gYXZvaWQgZ2xpdGNoZXMgaW4gYnJvd3NlciByZW5kZXJpbmcgYW5kIGludGVycHJldGF0aW9uIG9mIGZsaXBwZWQvcm90YXRlZCAzRCBtYXRyaWNlcy4gQW5kIGRvbid0IGp1c3QgbXVsdGlwbHkgdGhlIG51bWJlciBieSBybmQsIGZsb29yIGl0LCBhbmQgdGhlbiBkaXZpZGUgYnkgcm5kIGJlY2F1c2UgdGhlIGJpdHdpc2Ugb3BlcmF0aW9ucyBtYXggb3V0IGF0IGEgMzItYml0IHNpZ25lZCBpbnRlZ2VyLCB0aHVzIGl0IGNvdWxkIGdldCBjbGlwcGVkIGF0IGEgcmVsYXRpdmVseSBsb3cgdmFsdWUgKGxpa2UgMjIsMDAwLjAwMDAwIGZvciBleGFtcGxlKS5cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gKGZvcmNlMkQgJiYgbS5sZW5ndGggPiA2KSA/IFttWzBdLCBtWzFdLCBtWzRdLCBtWzVdLCBtWzEyXSwgbVsxM11dIDogbTtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogUGFyc2VzIHRoZSB0cmFuc2Zvcm0gdmFsdWVzIGZvciBhbiBlbGVtZW50LCByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggeCwgeSwgeiwgc2NhbGVYLCBzY2FsZVksIHNjYWxlWiwgcm90YXRpb24sIHJvdGF0aW9uWCwgcm90YXRpb25ZLCBza2V3WCwgYW5kIHNrZXdZIHByb3BlcnRpZXMuIE5vdGU6IGJ5IGRlZmF1bHQgKGZvciBwZXJmb3JtYW5jZSByZWFzb25zKSwgYWxsIHNrZXdpbmcgaXMgY29tYmluZWQgaW50byBza2V3WCBhbmQgcm90YXRpb24gYnV0IHNrZXdZIHN0aWxsIGhhcyBhIHBsYWNlIGluIHRoZSB0cmFuc2Zvcm0gb2JqZWN0IHNvIHRoYXQgd2UgY2FuIHJlY29yZCBob3cgbXVjaCBvZiB0aGUgc2tldyBpcyBhdHRyaWJ1dGVkIHRvIHNrZXdYIHZzIHNrZXdZLiBSZW1lbWJlciwgYSBza2V3WSBvZiAxMCBsb29rcyB0aGUgc2FtZSBhcyBhIHJvdGF0aW9uIG9mIDEwIGFuZCBza2V3WCBvZiAtMTAuXG5cdFx0XHQgKiBAcGFyYW0geyFPYmplY3R9IHQgdGFyZ2V0IGVsZW1lbnRcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0PX0gY3MgY29tcHV0ZWQgc3R5bGUgb2JqZWN0IChvcHRpb25hbClcblx0XHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHJlYyBpZiB0cnVlLCB0aGUgdHJhbnNmb3JtIHZhbHVlcyB3aWxsIGJlIHJlY29yZGVkIHRvIHRoZSB0YXJnZXQgZWxlbWVudCdzIF9nc1RyYW5zZm9ybSBvYmplY3QsIGxpa2UgdGFyZ2V0Ll9nc1RyYW5zZm9ybSA9IHt4OjAsIHk6MCwgejowLCBzY2FsZVg6MS4uLn1cblx0XHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHBhcnNlIGlmIHRydWUsIHdlJ2xsIGlnbm9yZSBhbnkgX2dzVHJhbnNmb3JtIHZhbHVlcyB0aGF0IGFscmVhZHkgZXhpc3Qgb24gdGhlIGVsZW1lbnQsIGFuZCBmb3JjZSBhIHJlcGFyc2luZyBvZiB0aGUgY3NzIChjYWxjdWxhdGVkIHN0eWxlKVxuXHRcdFx0ICogQHJldHVybiB7b2JqZWN0fSBvYmplY3QgY29udGFpbmluZyBhbGwgb2YgdGhlIHRyYW5zZm9ybSBwcm9wZXJ0aWVzL3ZhbHVlcyBsaWtlIHt4OjAsIHk6MCwgejowLCBzY2FsZVg6MS4uLn1cblx0XHRcdCAqL1xuXHRcdFx0X2dldFRyYW5zZm9ybSA9IF9pbnRlcm5hbHMuZ2V0VHJhbnNmb3JtID0gZnVuY3Rpb24odCwgY3MsIHJlYywgcGFyc2UpIHtcblx0XHRcdFx0aWYgKHQuX2dzVHJhbnNmb3JtICYmIHJlYyAmJiAhcGFyc2UpIHtcblx0XHRcdFx0XHRyZXR1cm4gdC5fZ3NUcmFuc2Zvcm07IC8vaWYgdGhlIGVsZW1lbnQgYWxyZWFkeSBoYXMgYSBfZ3NUcmFuc2Zvcm0sIHVzZSB0aGF0LiBOb3RlOiBzb21lIGJyb3dzZXJzIGRvbid0IGFjY3VyYXRlbHkgcmV0dXJuIHRoZSBjYWxjdWxhdGVkIHN0eWxlIGZvciB0aGUgdHJhbnNmb3JtIChwYXJ0aWN1bGFybHkgZm9yIFNWRyksIHNvIGl0J3MgYWxtb3N0IGFsd2F5cyBzYWZlc3QgdG8ganVzdCB1c2UgdGhlIHZhbHVlcyB3ZSd2ZSBhbHJlYWR5IGFwcGxpZWQgcmF0aGVyIHRoYW4gcmUtcGFyc2luZyB0aGluZ3MuXG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIHRtID0gcmVjID8gdC5fZ3NUcmFuc2Zvcm0gfHwgbmV3IFRyYW5zZm9ybSgpIDogbmV3IFRyYW5zZm9ybSgpLFxuXHRcdFx0XHRcdGludlggPSAodG0uc2NhbGVYIDwgMCksIC8vaW4gb3JkZXIgdG8gaW50ZXJwcmV0IHRoaW5ncyBwcm9wZXJseSwgd2UgbmVlZCB0byBrbm93IGlmIHRoZSB1c2VyIGFwcGxpZWQgYSBuZWdhdGl2ZSBzY2FsZVggcHJldmlvdXNseSBzbyB0aGF0IHdlIGNhbiBhZGp1c3QgdGhlIHJvdGF0aW9uIGFuZCBza2V3WCBhY2NvcmRpbmdseS4gT3RoZXJ3aXNlLCBpZiB3ZSBhbHdheXMgaW50ZXJwcmV0IGEgZmxpcHBlZCBtYXRyaXggYXMgYWZmZWN0aW5nIHNjYWxlWSBhbmQgdGhlIHVzZXIgb25seSB3YW50cyB0byB0d2VlbiB0aGUgc2NhbGVYIG9uIG11bHRpcGxlIHNlcXVlbnRpYWwgdHdlZW5zLCBpdCB3b3VsZCBrZWVwIHRoZSBuZWdhdGl2ZSBzY2FsZVkgd2l0aG91dCB0aGF0IGJlaW5nIHRoZSB1c2VyJ3MgaW50ZW50LlxuXHRcdFx0XHRcdG1pbiA9IDAuMDAwMDIsXG5cdFx0XHRcdFx0cm5kID0gMTAwMDAwLFxuXHRcdFx0XHRcdHpPcmlnaW4gPSBfc3VwcG9ydHMzRCA/IHBhcnNlRmxvYXQoX2dldFN0eWxlKHQsIF90cmFuc2Zvcm1PcmlnaW5Qcm9wLCBjcywgZmFsc2UsIFwiMCAwIDBcIikuc3BsaXQoXCIgXCIpWzJdKSB8fCB0bS56T3JpZ2luICB8fCAwIDogMCxcblx0XHRcdFx0XHRkZWZhdWx0VHJhbnNmb3JtUGVyc3BlY3RpdmUgPSBwYXJzZUZsb2F0KENTU1BsdWdpbi5kZWZhdWx0VHJhbnNmb3JtUGVyc3BlY3RpdmUpIHx8IDAsXG5cdFx0XHRcdFx0bSwgaSwgc2NhbGVYLCBzY2FsZVksIHJvdGF0aW9uLCBza2V3WDtcblxuXHRcdFx0XHR0bS5zdmcgPSAhISh0LmdldEJCb3ggJiYgX2lzU1ZHKHQpKTtcblx0XHRcdFx0aWYgKHRtLnN2Zykge1xuXHRcdFx0XHRcdF9wYXJzZVNWR09yaWdpbih0LCBfZ2V0U3R5bGUodCwgX3RyYW5zZm9ybU9yaWdpblByb3AsIGNzLCBmYWxzZSwgXCI1MCUgNTAlXCIpICsgXCJcIiwgdG0sIHQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdmctb3JpZ2luXCIpKTtcblx0XHRcdFx0XHRfdXNlU1ZHVHJhbnNmb3JtQXR0ciA9IENTU1BsdWdpbi51c2VTVkdUcmFuc2Zvcm1BdHRyIHx8IF9mb3JjZVNWR1RyYW5zZm9ybUF0dHI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bSA9IF9nZXRNYXRyaXgodCk7XG5cdFx0XHRcdGlmIChtICE9PSBfaWRlbnRpdHkyRE1hdHJpeCkge1xuXG5cdFx0XHRcdFx0aWYgKG0ubGVuZ3RoID09PSAxNikge1xuXHRcdFx0XHRcdFx0Ly93ZSdsbCBvbmx5IGxvb2sgYXQgdGhlc2UgcG9zaXRpb24tcmVsYXRlZCA2IHZhcmlhYmxlcyBmaXJzdCBiZWNhdXNlIGlmIHgveS96IGFsbCBtYXRjaCwgaXQncyByZWxhdGl2ZWx5IHNhZmUgdG8gYXNzdW1lIHdlIGRvbid0IG5lZWQgdG8gcmUtcGFyc2UgZXZlcnl0aGluZyB3aGljaCByaXNrcyBsb3NpbmcgaW1wb3J0YW50IHJvdGF0aW9uYWwgaW5mb3JtYXRpb24gKGxpa2Ugcm90YXRpb25YOjE4MCBwbHVzIHJvdGF0aW9uWToxODAgd291bGQgbG9vayB0aGUgc2FtZSBhcyByb3RhdGlvbjoxODAgLSB0aGVyZSdzIG5vIHdheSB0byBrbm93IGZvciBzdXJlIHdoaWNoIGRpcmVjdGlvbiB3YXMgdGFrZW4gYmFzZWQgc29sZWx5IG9uIHRoZSBtYXRyaXgzZCgpIHZhbHVlcylcblx0XHRcdFx0XHRcdHZhciBhMTEgPSBtWzBdLCBhMjEgPSBtWzFdLCBhMzEgPSBtWzJdLCBhNDEgPSBtWzNdLFxuXHRcdFx0XHRcdFx0XHRhMTIgPSBtWzRdLCBhMjIgPSBtWzVdLCBhMzIgPSBtWzZdLCBhNDIgPSBtWzddLFxuXHRcdFx0XHRcdFx0XHRhMTMgPSBtWzhdLCBhMjMgPSBtWzldLCBhMzMgPSBtWzEwXSxcblx0XHRcdFx0XHRcdFx0YTE0ID0gbVsxMl0sIGEyNCA9IG1bMTNdLCBhMzQgPSBtWzE0XSxcblx0XHRcdFx0XHRcdFx0YTQzID0gbVsxMV0sXG5cdFx0XHRcdFx0XHRcdGFuZ2xlID0gTWF0aC5hdGFuMihhMzIsIGEzMyksXG5cdFx0XHRcdFx0XHRcdHQxLCB0MiwgdDMsIHQ0LCBjb3MsIHNpbjtcblxuXHRcdFx0XHRcdFx0Ly93ZSBtYW51YWxseSBjb21wZW5zYXRlIGZvciBub24temVybyB6IGNvbXBvbmVudCBvZiB0cmFuc2Zvcm1PcmlnaW4gdG8gd29yayBhcm91bmQgYnVncyBpbiBTYWZhcmlcblx0XHRcdFx0XHRcdGlmICh0bS56T3JpZ2luKSB7XG5cdFx0XHRcdFx0XHRcdGEzNCA9IC10bS56T3JpZ2luO1xuXHRcdFx0XHRcdFx0XHRhMTQgPSBhMTMqYTM0LW1bMTJdO1xuXHRcdFx0XHRcdFx0XHRhMjQgPSBhMjMqYTM0LW1bMTNdO1xuXHRcdFx0XHRcdFx0XHRhMzQgPSBhMzMqYTM0K3RtLnpPcmlnaW4tbVsxNF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0bS5yb3RhdGlvblggPSBhbmdsZSAqIF9SQUQyREVHO1xuXHRcdFx0XHRcdFx0Ly9yb3RhdGlvblhcblx0XHRcdFx0XHRcdGlmIChhbmdsZSkge1xuXHRcdFx0XHRcdFx0XHRjb3MgPSBNYXRoLmNvcygtYW5nbGUpO1xuXHRcdFx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbigtYW5nbGUpO1xuXHRcdFx0XHRcdFx0XHR0MSA9IGExMipjb3MrYTEzKnNpbjtcblx0XHRcdFx0XHRcdFx0dDIgPSBhMjIqY29zK2EyMypzaW47XG5cdFx0XHRcdFx0XHRcdHQzID0gYTMyKmNvcythMzMqc2luO1xuXHRcdFx0XHRcdFx0XHRhMTMgPSBhMTIqLXNpbithMTMqY29zO1xuXHRcdFx0XHRcdFx0XHRhMjMgPSBhMjIqLXNpbithMjMqY29zO1xuXHRcdFx0XHRcdFx0XHRhMzMgPSBhMzIqLXNpbithMzMqY29zO1xuXHRcdFx0XHRcdFx0XHRhNDMgPSBhNDIqLXNpbithNDMqY29zO1xuXHRcdFx0XHRcdFx0XHRhMTIgPSB0MTtcblx0XHRcdFx0XHRcdFx0YTIyID0gdDI7XG5cdFx0XHRcdFx0XHRcdGEzMiA9IHQzO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly9yb3RhdGlvbllcblx0XHRcdFx0XHRcdGFuZ2xlID0gTWF0aC5hdGFuMigtYTMxLCBhMzMpO1xuXHRcdFx0XHRcdFx0dG0ucm90YXRpb25ZID0gYW5nbGUgKiBfUkFEMkRFRztcblx0XHRcdFx0XHRcdGlmIChhbmdsZSkge1xuXHRcdFx0XHRcdFx0XHRjb3MgPSBNYXRoLmNvcygtYW5nbGUpO1xuXHRcdFx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbigtYW5nbGUpO1xuXHRcdFx0XHRcdFx0XHR0MSA9IGExMSpjb3MtYTEzKnNpbjtcblx0XHRcdFx0XHRcdFx0dDIgPSBhMjEqY29zLWEyMypzaW47XG5cdFx0XHRcdFx0XHRcdHQzID0gYTMxKmNvcy1hMzMqc2luO1xuXHRcdFx0XHRcdFx0XHRhMjMgPSBhMjEqc2luK2EyMypjb3M7XG5cdFx0XHRcdFx0XHRcdGEzMyA9IGEzMSpzaW4rYTMzKmNvcztcblx0XHRcdFx0XHRcdFx0YTQzID0gYTQxKnNpbithNDMqY29zO1xuXHRcdFx0XHRcdFx0XHRhMTEgPSB0MTtcblx0XHRcdFx0XHRcdFx0YTIxID0gdDI7XG5cdFx0XHRcdFx0XHRcdGEzMSA9IHQzO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly9yb3RhdGlvblpcblx0XHRcdFx0XHRcdGFuZ2xlID0gTWF0aC5hdGFuMihhMjEsIGExMSk7XG5cdFx0XHRcdFx0XHR0bS5yb3RhdGlvbiA9IGFuZ2xlICogX1JBRDJERUc7XG5cdFx0XHRcdFx0XHRpZiAoYW5nbGUpIHtcblx0XHRcdFx0XHRcdFx0Y29zID0gTWF0aC5jb3MoLWFuZ2xlKTtcblx0XHRcdFx0XHRcdFx0c2luID0gTWF0aC5zaW4oLWFuZ2xlKTtcblx0XHRcdFx0XHRcdFx0YTExID0gYTExKmNvcythMTIqc2luO1xuXHRcdFx0XHRcdFx0XHR0MiA9IGEyMSpjb3MrYTIyKnNpbjtcblx0XHRcdFx0XHRcdFx0YTIyID0gYTIxKi1zaW4rYTIyKmNvcztcblx0XHRcdFx0XHRcdFx0YTMyID0gYTMxKi1zaW4rYTMyKmNvcztcblx0XHRcdFx0XHRcdFx0YTIxID0gdDI7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICh0bS5yb3RhdGlvblggJiYgTWF0aC5hYnModG0ucm90YXRpb25YKSArIE1hdGguYWJzKHRtLnJvdGF0aW9uKSA+IDM1OS45KSB7IC8vd2hlbiByb3RhdGlvblkgaXMgc2V0LCBpdCB3aWxsIG9mdGVuIGJlIHBhcnNlZCBhcyAxODAgZGVncmVlcyBkaWZmZXJlbnQgdGhhbiBpdCBzaG91bGQgYmUsIGFuZCByb3RhdGlvblggYW5kIHJvdGF0aW9uIGJvdGggYmVpbmcgMTgwIChpdCBsb29rcyB0aGUgc2FtZSksIHNvIHdlIGFkanVzdCBmb3IgdGhhdCBoZXJlLlxuXHRcdFx0XHRcdFx0XHR0bS5yb3RhdGlvblggPSB0bS5yb3RhdGlvbiA9IDA7XG5cdFx0XHRcdFx0XHRcdHRtLnJvdGF0aW9uWSA9IDE4MCAtIHRtLnJvdGF0aW9uWTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dG0uc2NhbGVYID0gKChNYXRoLnNxcnQoYTExICogYTExICsgYTIxICogYTIxKSAqIHJuZCArIDAuNSkgfCAwKSAvIHJuZDtcblx0XHRcdFx0XHRcdHRtLnNjYWxlWSA9ICgoTWF0aC5zcXJ0KGEyMiAqIGEyMiArIGEyMyAqIGEyMykgKiBybmQgKyAwLjUpIHwgMCkgLyBybmQ7XG5cdFx0XHRcdFx0XHR0bS5zY2FsZVogPSAoKE1hdGguc3FydChhMzIgKiBhMzIgKyBhMzMgKiBhMzMpICogcm5kICsgMC41KSB8IDApIC8gcm5kO1xuXHRcdFx0XHRcdFx0aWYgKHRtLnJvdGF0aW9uWCB8fCB0bS5yb3RhdGlvblkpIHtcblx0XHRcdFx0XHRcdFx0dG0uc2tld1ggPSAwO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dG0uc2tld1ggPSAoYTEyIHx8IGEyMikgPyBNYXRoLmF0YW4yKGExMiwgYTIyKSAqIF9SQUQyREVHICsgdG0ucm90YXRpb24gOiB0bS5za2V3WCB8fCAwO1xuXHRcdFx0XHRcdFx0XHRpZiAoTWF0aC5hYnModG0uc2tld1gpID4gOTAgJiYgTWF0aC5hYnModG0uc2tld1gpIDwgMjcwKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGludlgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRtLnNjYWxlWCAqPSAtMTtcblx0XHRcdFx0XHRcdFx0XHRcdHRtLnNrZXdYICs9ICh0bS5yb3RhdGlvbiA8PSAwKSA/IDE4MCA6IC0xODA7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bS5yb3RhdGlvbiArPSAodG0ucm90YXRpb24gPD0gMCkgPyAxODAgOiAtMTgwO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bS5zY2FsZVkgKj0gLTE7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bS5za2V3WCArPSAodG0uc2tld1ggPD0gMCkgPyAxODAgOiAtMTgwO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dG0ucGVyc3BlY3RpdmUgPSBhNDMgPyAxIC8gKChhNDMgPCAwKSA/IC1hNDMgOiBhNDMpIDogMDtcblx0XHRcdFx0XHRcdHRtLnggPSBhMTQ7XG5cdFx0XHRcdFx0XHR0bS55ID0gYTI0O1xuXHRcdFx0XHRcdFx0dG0ueiA9IGEzNDtcblx0XHRcdFx0XHRcdGlmICh0bS5zdmcpIHtcblx0XHRcdFx0XHRcdFx0dG0ueCAtPSB0bS54T3JpZ2luIC0gKHRtLnhPcmlnaW4gKiBhMTEgLSB0bS55T3JpZ2luICogYTEyKTtcblx0XHRcdFx0XHRcdFx0dG0ueSAtPSB0bS55T3JpZ2luIC0gKHRtLnlPcmlnaW4gKiBhMjEgLSB0bS54T3JpZ2luICogYTIyKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoKCFfc3VwcG9ydHMzRCB8fCBwYXJzZSB8fCAhbS5sZW5ndGggfHwgdG0ueCAhPT0gbVs0XSB8fCB0bS55ICE9PSBtWzVdIHx8ICghdG0ucm90YXRpb25YICYmICF0bS5yb3RhdGlvblkpKSkgeyAvL3NvbWV0aW1lcyBhIDYtZWxlbWVudCBtYXRyaXggaXMgcmV0dXJuZWQgZXZlbiB3aGVuIHdlIHBlcmZvcm1lZCAzRCB0cmFuc2Zvcm1zLCBsaWtlIGlmIHJvdGF0aW9uWCBhbmQgcm90YXRpb25ZIGFyZSAxODAuIEluIGNhc2VzIGxpa2UgdGhpcywgd2Ugc3RpbGwgbmVlZCB0byBob25vciB0aGUgM0QgdHJhbnNmb3Jtcy4gSWYgd2UganVzdCByZWx5IG9uIHRoZSAyRCBpbmZvLCBpdCBjb3VsZCBhZmZlY3QgaG93IHRoZSBkYXRhIGlzIGludGVycHJldGVkLCBsaWtlIHNjYWxlWSBtaWdodCBnZXQgc2V0IHRvIC0xIG9yIHJvdGF0aW9uIGNvdWxkIGdldCBvZmZzZXQgYnkgMTgwIGRlZ3JlZXMuIEZvciBleGFtcGxlLCBkbyBhIFR3ZWVuTGl0ZS50byhlbGVtZW50LCAxLCB7Y3NzOntyb3RhdGlvblg6MTgwLCByb3RhdGlvblk6MTgwfX0pIGFuZCB0aGVuIGxhdGVyLCBUd2VlbkxpdGUudG8oZWxlbWVudCwgMSwge2Nzczp7cm90YXRpb25YOjB9fSkgYW5kIHdpdGhvdXQgdGhpcyBjb25kaXRpb25hbCBsb2dpYyBpbiBwbGFjZSwgaXQnZCBqdW1wIHRvIGEgc3RhdGUgb2YgYmVpbmcgdW5yb3RhdGVkIHdoZW4gdGhlIDJuZCB0d2VlbiBzdGFydHMuIFRoZW4gYWdhaW4sIHdlIG5lZWQgdG8gaG9ub3IgdGhlIGZhY3QgdGhhdCB0aGUgdXNlciBDT1VMRCBhbHRlciB0aGUgdHJhbnNmb3JtcyBvdXRzaWRlIG9mIENTU1BsdWdpbiwgbGlrZSBieSBtYW51YWxseSBhcHBseWluZyBuZXcgY3NzLCBzbyB3ZSB0cnkgdG8gc2Vuc2UgdGhhdCBieSBsb29raW5nIGF0IHggYW5kIHkgYmVjYXVzZSBpZiB0aG9zZSBjaGFuZ2VkLCB3ZSBrbm93IHRoZSBjaGFuZ2VzIHdlcmUgbWFkZSBvdXRzaWRlIENTU1BsdWdpbiBhbmQgd2UgZm9yY2UgYSByZWludGVycHJldGF0aW9uIG9mIHRoZSBtYXRyaXggdmFsdWVzLiBBbHNvLCBpbiBXZWJraXQgYnJvd3NlcnMsIGlmIHRoZSBlbGVtZW50J3MgXCJkaXNwbGF5XCIgaXMgXCJub25lXCIsIGl0cyBjYWxjdWxhdGVkIHN0eWxlIHZhbHVlIHdpbGwgYWx3YXlzIHJldHVybiBlbXB0eSwgc28gaWYgd2UndmUgYWxyZWFkeSByZWNvcmRlZCB0aGUgdmFsdWVzIGluIHRoZSBfZ3NUcmFuc2Zvcm0gb2JqZWN0LCB3ZSdsbCBqdXN0IHJlbHkgb24gdGhvc2UuXG5cdFx0XHRcdFx0XHR2YXIgayA9IChtLmxlbmd0aCA+PSA2KSxcblx0XHRcdFx0XHRcdFx0YSA9IGsgPyBtWzBdIDogMSxcblx0XHRcdFx0XHRcdFx0YiA9IG1bMV0gfHwgMCxcblx0XHRcdFx0XHRcdFx0YyA9IG1bMl0gfHwgMCxcblx0XHRcdFx0XHRcdFx0ZCA9IGsgPyBtWzNdIDogMTtcblx0XHRcdFx0XHRcdHRtLnggPSBtWzRdIHx8IDA7XG5cdFx0XHRcdFx0XHR0bS55ID0gbVs1XSB8fCAwO1xuXHRcdFx0XHRcdFx0c2NhbGVYID0gTWF0aC5zcXJ0KGEgKiBhICsgYiAqIGIpO1xuXHRcdFx0XHRcdFx0c2NhbGVZID0gTWF0aC5zcXJ0KGQgKiBkICsgYyAqIGMpO1xuXHRcdFx0XHRcdFx0cm90YXRpb24gPSAoYSB8fCBiKSA/IE1hdGguYXRhbjIoYiwgYSkgKiBfUkFEMkRFRyA6IHRtLnJvdGF0aW9uIHx8IDA7IC8vbm90ZTogaWYgc2NhbGVYIGlzIDAsIHdlIGNhbm5vdCBhY2N1cmF0ZWx5IG1lYXN1cmUgcm90YXRpb24uIFNhbWUgZm9yIHNrZXdYIHdpdGggYSBzY2FsZVkgb2YgMC4gVGhlcmVmb3JlLCB3ZSBkZWZhdWx0IHRvIHRoZSBwcmV2aW91c2x5IHJlY29yZGVkIHZhbHVlIChvciB6ZXJvIGlmIHRoYXQgZG9lc24ndCBleGlzdCkuXG5cdFx0XHRcdFx0XHRza2V3WCA9IChjIHx8IGQpID8gTWF0aC5hdGFuMihjLCBkKSAqIF9SQUQyREVHICsgcm90YXRpb24gOiB0bS5za2V3WCB8fCAwO1xuXHRcdFx0XHRcdFx0aWYgKE1hdGguYWJzKHNrZXdYKSA+IDkwICYmIE1hdGguYWJzKHNrZXdYKSA8IDI3MCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoaW52WCkge1xuXHRcdFx0XHRcdFx0XHRcdHNjYWxlWCAqPSAtMTtcblx0XHRcdFx0XHRcdFx0XHRza2V3WCArPSAocm90YXRpb24gPD0gMCkgPyAxODAgOiAtMTgwO1xuXHRcdFx0XHRcdFx0XHRcdHJvdGF0aW9uICs9IChyb3RhdGlvbiA8PSAwKSA/IDE4MCA6IC0xODA7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0c2NhbGVZICo9IC0xO1xuXHRcdFx0XHRcdFx0XHRcdHNrZXdYICs9IChza2V3WCA8PSAwKSA/IDE4MCA6IC0xODA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRtLnNjYWxlWCA9IHNjYWxlWDtcblx0XHRcdFx0XHRcdHRtLnNjYWxlWSA9IHNjYWxlWTtcblx0XHRcdFx0XHRcdHRtLnJvdGF0aW9uID0gcm90YXRpb247XG5cdFx0XHRcdFx0XHR0bS5za2V3WCA9IHNrZXdYO1xuXHRcdFx0XHRcdFx0aWYgKF9zdXBwb3J0czNEKSB7XG5cdFx0XHRcdFx0XHRcdHRtLnJvdGF0aW9uWCA9IHRtLnJvdGF0aW9uWSA9IHRtLnogPSAwO1xuXHRcdFx0XHRcdFx0XHR0bS5wZXJzcGVjdGl2ZSA9IGRlZmF1bHRUcmFuc2Zvcm1QZXJzcGVjdGl2ZTtcblx0XHRcdFx0XHRcdFx0dG0uc2NhbGVaID0gMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICh0bS5zdmcpIHtcblx0XHRcdFx0XHRcdFx0dG0ueCAtPSB0bS54T3JpZ2luIC0gKHRtLnhPcmlnaW4gKiBhICsgdG0ueU9yaWdpbiAqIGMpO1xuXHRcdFx0XHRcdFx0XHR0bS55IC09IHRtLnlPcmlnaW4gLSAodG0ueE9yaWdpbiAqIGIgKyB0bS55T3JpZ2luICogZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRtLnpPcmlnaW4gPSB6T3JpZ2luO1xuXHRcdFx0XHRcdC8vc29tZSBicm93c2VycyBoYXZlIGEgaGFyZCB0aW1lIHdpdGggdmVyeSBzbWFsbCB2YWx1ZXMgbGlrZSAyLjQ0OTI5MzU5ODI5NDcwNjRlLTE2IChub3RpY2UgdGhlIFwiZS1cIiB0b3dhcmRzIHRoZSBlbmQpIGFuZCB3b3VsZCByZW5kZXIgdGhlIG9iamVjdCBzbGlnaHRseSBvZmYuIFNvIHdlIHJvdW5kIHRvIDAgaW4gdGhlc2UgY2FzZXMuIFRoZSBjb25kaXRpb25hbCBsb2dpYyBoZXJlIGlzIGZhc3RlciB0aGFuIGNhbGxpbmcgTWF0aC5hYnMoKS4gQWxzbywgYnJvd3NlcnMgdGVuZCB0byByZW5kZXIgYSBTTElHSFRMWSByb3RhdGVkIG9iamVjdCBpbiBhIGZ1enp5IHdheSwgc28gd2UgbmVlZCB0byBzbmFwIHRvIGV4YWN0bHkgMCB3aGVuIGFwcHJvcHJpYXRlLlxuXHRcdFx0XHRcdGZvciAoaSBpbiB0bSkge1xuXHRcdFx0XHRcdFx0aWYgKHRtW2ldIDwgbWluKSBpZiAodG1baV0gPiAtbWluKSB7XG5cdFx0XHRcdFx0XHRcdHRtW2ldID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9ERUJVRzogX2xvZyhcInBhcnNlZCByb3RhdGlvbiBvZiBcIiArIHQuZ2V0QXR0cmlidXRlKFwiaWRcIikrXCI6IFwiKyh0bS5yb3RhdGlvblgpK1wiLCBcIisodG0ucm90YXRpb25ZKStcIiwgXCIrKHRtLnJvdGF0aW9uKStcIiwgc2NhbGU6IFwiK3RtLnNjYWxlWCtcIiwgXCIrdG0uc2NhbGVZK1wiLCBcIit0bS5zY2FsZVorXCIsIHBvc2l0aW9uOiBcIit0bS54K1wiLCBcIit0bS55K1wiLCBcIit0bS56K1wiLCBwZXJzcGVjdGl2ZTogXCIrdG0ucGVyc3BlY3RpdmUrIFwiLCBvcmlnaW46IFwiKyB0bS54T3JpZ2luKyBcIixcIisgdG0ueU9yaWdpbik7XG5cdFx0XHRcdGlmIChyZWMpIHtcblx0XHRcdFx0XHR0Ll9nc1RyYW5zZm9ybSA9IHRtOyAvL3JlY29yZCB0byB0aGUgb2JqZWN0J3MgX2dzVHJhbnNmb3JtIHdoaWNoIHdlIHVzZSBzbyB0aGF0IHR3ZWVucyBjYW4gY29udHJvbCBpbmRpdmlkdWFsIHByb3BlcnRpZXMgaW5kZXBlbmRlbnRseSAod2UgbmVlZCBhbGwgdGhlIHByb3BlcnRpZXMgdG8gYWNjdXJhdGVseSByZWNvbXBvc2UgdGhlIG1hdHJpeCBpbiB0aGUgc2V0UmF0aW8oKSBtZXRob2QpXG5cdFx0XHRcdFx0aWYgKHRtLnN2ZykgeyAvL2lmIHdlJ3JlIHN1cHBvc2VkIHRvIGFwcGx5IHRyYW5zZm9ybXMgdG8gdGhlIFNWRyBlbGVtZW50J3MgXCJ0cmFuc2Zvcm1cIiBhdHRyaWJ1dGUsIG1ha2Ugc3VyZSB0aGVyZSBhcmVuJ3QgYW55IENTUyB0cmFuc2Zvcm1zIGFwcGxpZWQgb3IgdGhleSdsbCBvdmVycmlkZSB0aGUgYXR0cmlidXRlIG9uZXMuIEFsc28gY2xlYXIgdGhlIHRyYW5zZm9ybSBhdHRyaWJ1dGUgaWYgd2UncmUgdXNpbmcgQ1NTLCBqdXN0IHRvIGJlIGNsZWFuLlxuXHRcdFx0XHRcdFx0aWYgKF91c2VTVkdUcmFuc2Zvcm1BdHRyICYmIHQuc3R5bGVbX3RyYW5zZm9ybVByb3BdKSB7XG5cdFx0XHRcdFx0XHRcdFR3ZWVuTGl0ZS5kZWxheWVkQ2FsbCgwLjAwMSwgZnVuY3Rpb24oKXsgLy9pZiB3ZSBhcHBseSB0aGlzIHJpZ2h0IGF3YXkgKGJlZm9yZSBhbnl0aGluZyBoYXMgcmVuZGVyZWQpLCB3ZSByaXNrIHRoZXJlIGJlaW5nIG5vIHRyYW5zZm9ybXMgZm9yIGEgYnJpZWYgbW9tZW50IGFuZCBpdCBhbHNvIGludGVyZmVyZXMgd2l0aCBhZGp1c3RpbmcgdGhlIHRyYW5zZm9ybU9yaWdpbiBpbiBhIHR3ZWVuIHdpdGggaW1tZWRpYXRlUmVuZGVyOnRydWUgKGl0J2QgdHJ5IHJlYWRpbmcgdGhlIG1hdHJpeCBhbmQgaXQgd291bGRuJ3QgaGF2ZSB0aGUgYXBwcm9wcmlhdGUgZGF0YSBpbiBwbGFjZSBiZWNhdXNlIHdlIGp1c3QgcmVtb3ZlZCBpdCkuXG5cdFx0XHRcdFx0XHRcdFx0X3JlbW92ZVByb3AodC5zdHlsZSwgX3RyYW5zZm9ybVByb3ApO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIV91c2VTVkdUcmFuc2Zvcm1BdHRyICYmIHQuZ2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIpKSB7XG5cdFx0XHRcdFx0XHRcdFR3ZWVuTGl0ZS5kZWxheWVkQ2FsbCgwLjAwMSwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHR0LnJlbW92ZUF0dHJpYnV0ZShcInRyYW5zZm9ybVwiKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0bTtcblx0XHRcdH0sXG5cblx0XHRcdC8vZm9yIHNldHRpbmcgMkQgdHJhbnNmb3JtcyBpbiBJRTYsIElFNywgYW5kIElFOCAobXVzdCB1c2UgYSBcImZpbHRlclwiIHRvIGVtdWxhdGUgdGhlIGJlaGF2aW9yIG9mIG1vZGVybiBkYXkgYnJvd3NlciB0cmFuc2Zvcm1zKVxuXHRcdFx0X3NldElFVHJhbnNmb3JtUmF0aW8gPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHZhciB0ID0gdGhpcy5kYXRhLCAvL3JlZmVycyB0byB0aGUgZWxlbWVudCdzIF9nc1RyYW5zZm9ybSBvYmplY3Rcblx0XHRcdFx0XHRhbmcgPSAtdC5yb3RhdGlvbiAqIF9ERUcyUkFELFxuXHRcdFx0XHRcdHNrZXcgPSBhbmcgKyB0LnNrZXdYICogX0RFRzJSQUQsXG5cdFx0XHRcdFx0cm5kID0gMTAwMDAwLFxuXHRcdFx0XHRcdGEgPSAoKE1hdGguY29zKGFuZykgKiB0LnNjYWxlWCAqIHJuZCkgfCAwKSAvIHJuZCxcblx0XHRcdFx0XHRiID0gKChNYXRoLnNpbihhbmcpICogdC5zY2FsZVggKiBybmQpIHwgMCkgLyBybmQsXG5cdFx0XHRcdFx0YyA9ICgoTWF0aC5zaW4oc2tldykgKiAtdC5zY2FsZVkgKiBybmQpIHwgMCkgLyBybmQsXG5cdFx0XHRcdFx0ZCA9ICgoTWF0aC5jb3Moc2tldykgKiB0LnNjYWxlWSAqIHJuZCkgfCAwKSAvIHJuZCxcblx0XHRcdFx0XHRzdHlsZSA9IHRoaXMudC5zdHlsZSxcblx0XHRcdFx0XHRjcyA9IHRoaXMudC5jdXJyZW50U3R5bGUsXG5cdFx0XHRcdFx0ZmlsdGVycywgdmFsO1xuXHRcdFx0XHRpZiAoIWNzKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhbCA9IGI7IC8vanVzdCBmb3Igc3dhcHBpbmcgdGhlIHZhcmlhYmxlcyBhbiBpbnZlcnRpbmcgdGhlbSAocmV1c2VkIFwidmFsXCIgdG8gYXZvaWQgY3JlYXRpbmcgYW5vdGhlciB2YXJpYWJsZSBpbiBtZW1vcnkpLiBJRSdzIGZpbHRlciBtYXRyaXggdXNlcyBhIG5vbi1zdGFuZGFyZCBtYXRyaXggY29uZmlndXJhdGlvbiAoYW5nbGUgZ29lcyB0aGUgb3Bwb3NpdGUgd2F5LCBhbmQgYiBhbmQgYyBhcmUgcmV2ZXJzZWQgYW5kIGludmVydGVkKVxuXHRcdFx0XHRiID0gLWM7XG5cdFx0XHRcdGMgPSAtdmFsO1xuXHRcdFx0XHRmaWx0ZXJzID0gY3MuZmlsdGVyO1xuXHRcdFx0XHRzdHlsZS5maWx0ZXIgPSBcIlwiOyAvL3JlbW92ZSBmaWx0ZXJzIHNvIHRoYXQgd2UgY2FuIGFjY3VyYXRlbHkgbWVhc3VyZSBvZmZzZXRXaWR0aC9vZmZzZXRIZWlnaHRcblx0XHRcdFx0dmFyIHcgPSB0aGlzLnQub2Zmc2V0V2lkdGgsXG5cdFx0XHRcdFx0aCA9IHRoaXMudC5vZmZzZXRIZWlnaHQsXG5cdFx0XHRcdFx0Y2xpcCA9IChjcy5wb3NpdGlvbiAhPT0gXCJhYnNvbHV0ZVwiKSxcblx0XHRcdFx0XHRtID0gXCJwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuTWF0cml4KE0xMT1cIiArIGEgKyBcIiwgTTEyPVwiICsgYiArIFwiLCBNMjE9XCIgKyBjICsgXCIsIE0yMj1cIiArIGQsXG5cdFx0XHRcdFx0b3ggPSB0LnggKyAodyAqIHQueFBlcmNlbnQgLyAxMDApLFxuXHRcdFx0XHRcdG95ID0gdC55ICsgKGggKiB0LnlQZXJjZW50IC8gMTAwKSxcblx0XHRcdFx0XHRkeCwgZHk7XG5cblx0XHRcdFx0Ly9pZiB0cmFuc2Zvcm1PcmlnaW4gaXMgYmVpbmcgdXNlZCwgYWRqdXN0IHRoZSBvZmZzZXQgeCBhbmQgeVxuXHRcdFx0XHRpZiAodC5veCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0ZHggPSAoKHQub3hwKSA/IHcgKiB0Lm94ICogMC4wMSA6IHQub3gpIC0gdyAvIDI7XG5cdFx0XHRcdFx0ZHkgPSAoKHQub3lwKSA/IGggKiB0Lm95ICogMC4wMSA6IHQub3kpIC0gaCAvIDI7XG5cdFx0XHRcdFx0b3ggKz0gZHggLSAoZHggKiBhICsgZHkgKiBiKTtcblx0XHRcdFx0XHRveSArPSBkeSAtIChkeCAqIGMgKyBkeSAqIGQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFjbGlwKSB7XG5cdFx0XHRcdFx0bSArPSBcIiwgc2l6aW5nTWV0aG9kPSdhdXRvIGV4cGFuZCcpXCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZHggPSAodyAvIDIpO1xuXHRcdFx0XHRcdGR5ID0gKGggLyAyKTtcblx0XHRcdFx0XHQvL3RyYW5zbGF0ZSB0byBlbnN1cmUgdGhhdCB0cmFuc2Zvcm1hdGlvbnMgb2NjdXIgYXJvdW5kIHRoZSBjb3JyZWN0IG9yaWdpbiAoZGVmYXVsdCBpcyBjZW50ZXIpLlxuXHRcdFx0XHRcdG0gKz0gXCIsIER4PVwiICsgKGR4IC0gKGR4ICogYSArIGR5ICogYikgKyBveCkgKyBcIiwgRHk9XCIgKyAoZHkgLSAoZHggKiBjICsgZHkgKiBkKSArIG95KSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChmaWx0ZXJzLmluZGV4T2YoXCJEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5NYXRyaXgoXCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdHN0eWxlLmZpbHRlciA9IGZpbHRlcnMucmVwbGFjZShfaWVTZXRNYXRyaXhFeHAsIG0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHN0eWxlLmZpbHRlciA9IG0gKyBcIiBcIiArIGZpbHRlcnM7IC8vd2UgbXVzdCBhbHdheXMgcHV0IHRoZSB0cmFuc2Zvcm0vbWF0cml4IEZJUlNUIChiZWZvcmUgYWxwaGEob3BhY2l0eT14eCkpIHRvIGF2b2lkIGFuIElFIGJ1ZyB0aGF0IHNsaWNlcyBwYXJ0IG9mIHRoZSBvYmplY3Qgd2hlbiByb3RhdGlvbiBpcyBhcHBsaWVkIHdpdGggYWxwaGEuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL2F0IHRoZSBlbmQgb3IgYmVnaW5uaW5nIG9mIHRoZSB0d2VlbiwgaWYgdGhlIG1hdHJpeCBpcyBub3JtYWwgKDEsIDAsIDAsIDEpIGFuZCBvcGFjaXR5IGlzIDEwMCAob3IgZG9lc24ndCBleGlzdCksIHJlbW92ZSB0aGUgZmlsdGVyIHRvIGltcHJvdmUgYnJvd3NlciBwZXJmb3JtYW5jZS5cblx0XHRcdFx0aWYgKHYgPT09IDAgfHwgdiA9PT0gMSkgaWYgKGEgPT09IDEpIGlmIChiID09PSAwKSBpZiAoYyA9PT0gMCkgaWYgKGQgPT09IDEpIGlmICghY2xpcCB8fCBtLmluZGV4T2YoXCJEeD0wLCBEeT0wXCIpICE9PSAtMSkgaWYgKCFfb3BhY2l0eUV4cC50ZXN0KGZpbHRlcnMpIHx8IHBhcnNlRmxvYXQoUmVnRXhwLiQxKSA9PT0gMTAwKSBpZiAoZmlsdGVycy5pbmRleE9mKFwiZ3JhZGllbnQoXCIgJiYgZmlsdGVycy5pbmRleE9mKFwiQWxwaGFcIikpID09PSAtMSkge1xuXHRcdFx0XHRcdHN0eWxlLnJlbW92ZUF0dHJpYnV0ZShcImZpbHRlclwiKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vd2UgbXVzdCBzZXQgdGhlIG1hcmdpbnMgQUZURVIgYXBwbHlpbmcgdGhlIGZpbHRlciBpbiBvcmRlciB0byBhdm9pZCBzb21lIGJ1Z3MgaW4gSUU4IHRoYXQgY291bGQgKGluIHJhcmUgc2NlbmFyaW9zKSBjYXVzZSB0aGVtIHRvIGJlIGlnbm9yZWQgaW50ZXJtaXR0ZW50bHkgKHZpYnJhdGlvbikuXG5cdFx0XHRcdGlmICghY2xpcCkge1xuXHRcdFx0XHRcdHZhciBtdWx0ID0gKF9pZVZlcnMgPCA4KSA/IDEgOiAtMSwgLy9pbiBJbnRlcm5ldCBFeHBsb3JlciA3IGFuZCBiZWZvcmUsIHRoZSBib3ggbW9kZWwgaXMgYnJva2VuLCBjYXVzaW5nIHRoZSBicm93c2VyIHRvIHRyZWF0IHRoZSB3aWR0aC9oZWlnaHQgb2YgdGhlIGFjdHVhbCByb3RhdGVkIGZpbHRlcmVkIGltYWdlIGFzIHRoZSB3aWR0aC9oZWlnaHQgb2YgdGhlIGJveCBpdHNlbGYsIGJ1dCBNaWNyb3NvZnQgY29ycmVjdGVkIHRoYXQgaW4gSUU4LiBXZSBtdXN0IHVzZSBhIG5lZ2F0aXZlIG9mZnNldCBpbiBJRTggb24gdGhlIHJpZ2h0L2JvdHRvbVxuXHRcdFx0XHRcdFx0bWFyZywgcHJvcCwgZGlmO1xuXHRcdFx0XHRcdGR4ID0gdC5pZU9mZnNldFggfHwgMDtcblx0XHRcdFx0XHRkeSA9IHQuaWVPZmZzZXRZIHx8IDA7XG5cdFx0XHRcdFx0dC5pZU9mZnNldFggPSBNYXRoLnJvdW5kKCh3IC0gKChhIDwgMCA/IC1hIDogYSkgKiB3ICsgKGIgPCAwID8gLWIgOiBiKSAqIGgpKSAvIDIgKyBveCk7XG5cdFx0XHRcdFx0dC5pZU9mZnNldFkgPSBNYXRoLnJvdW5kKChoIC0gKChkIDwgMCA/IC1kIDogZCkgKiBoICsgKGMgPCAwID8gLWMgOiBjKSAqIHcpKSAvIDIgKyBveSk7XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IDQ7IGkrKykge1xuXHRcdFx0XHRcdFx0cHJvcCA9IF9tYXJnaW5zW2ldO1xuXHRcdFx0XHRcdFx0bWFyZyA9IGNzW3Byb3BdO1xuXHRcdFx0XHRcdFx0Ly93ZSBuZWVkIHRvIGdldCB0aGUgY3VycmVudCBtYXJnaW4gaW4gY2FzZSBpdCBpcyBiZWluZyB0d2VlbmVkIHNlcGFyYXRlbHkgKHdlIHdhbnQgdG8gcmVzcGVjdCB0aGF0IHR3ZWVuJ3MgY2hhbmdlcylcblx0XHRcdFx0XHRcdHZhbCA9IChtYXJnLmluZGV4T2YoXCJweFwiKSAhPT0gLTEpID8gcGFyc2VGbG9hdChtYXJnKSA6IF9jb252ZXJ0VG9QaXhlbHModGhpcy50LCBwcm9wLCBwYXJzZUZsb2F0KG1hcmcpLCBtYXJnLnJlcGxhY2UoX3N1ZmZpeEV4cCwgXCJcIikpIHx8IDA7XG5cdFx0XHRcdFx0XHRpZiAodmFsICE9PSB0W3Byb3BdKSB7XG5cdFx0XHRcdFx0XHRcdGRpZiA9IChpIDwgMikgPyAtdC5pZU9mZnNldFggOiAtdC5pZU9mZnNldFk7IC8vaWYgYW5vdGhlciB0d2VlbiBpcyBjb250cm9sbGluZyBhIG1hcmdpbiwgd2UgY2Fubm90IG9ubHkgYXBwbHkgdGhlIGRpZmZlcmVuY2UgaW4gdGhlIGllT2Zmc2V0cywgc28gd2UgZXNzZW50aWFsbHkgemVyby1vdXQgdGhlIGR4IGFuZCBkeSBoZXJlIGluIHRoYXQgY2FzZS4gV2UgcmVjb3JkIHRoZSBtYXJnaW4ocykgbGF0ZXIgc28gdGhhdCB3ZSBjYW4ga2VlcCBjb21wYXJpbmcgdGhlbSwgbWFraW5nIHRoaXMgY29kZSB2ZXJ5IGZsZXhpYmxlLlxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0ZGlmID0gKGkgPCAyKSA/IGR4IC0gdC5pZU9mZnNldFggOiBkeSAtIHQuaWVPZmZzZXRZO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0c3R5bGVbcHJvcF0gPSAodFtwcm9wXSA9IE1hdGgucm91bmQoIHZhbCAtIGRpZiAqICgoaSA9PT0gMCB8fCBpID09PSAyKSA/IDEgOiBtdWx0KSApKSArIFwicHhcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8qIHRyYW5zbGF0ZXMgYSBzdXBlciBzbWFsbCBkZWNpbWFsIHRvIGEgc3RyaW5nIFdJVEhPVVQgc2NpZW50aWZpYyBub3RhdGlvblxuXHRcdFx0X3NhZmVEZWNpbWFsID0gZnVuY3Rpb24obikge1xuXHRcdFx0XHR2YXIgcyA9IChuIDwgMCA/IC1uIDogbikgKyBcIlwiLFxuXHRcdFx0XHRcdGEgPSBzLnNwbGl0KFwiZS1cIik7XG5cdFx0XHRcdHJldHVybiAobiA8IDAgPyBcIi0wLlwiIDogXCIwLlwiKSArIG5ldyBBcnJheShwYXJzZUludChhWzFdLCAxMCkgfHwgMCkuam9pbihcIjBcIikgKyBhWzBdLnNwbGl0KFwiLlwiKS5qb2luKFwiXCIpO1xuXHRcdFx0fSxcblx0XHRcdCovXG5cblx0XHRcdF9zZXRUcmFuc2Zvcm1SYXRpbyA9IF9pbnRlcm5hbHMuc2V0M0RUcmFuc2Zvcm1SYXRpbyA9IF9pbnRlcm5hbHMuc2V0VHJhbnNmb3JtUmF0aW8gPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHZhciB0ID0gdGhpcy5kYXRhLCAvL3JlZmVycyB0byB0aGUgZWxlbWVudCdzIF9nc1RyYW5zZm9ybSBvYmplY3Rcblx0XHRcdFx0XHRzdHlsZSA9IHRoaXMudC5zdHlsZSxcblx0XHRcdFx0XHRhbmdsZSA9IHQucm90YXRpb24sXG5cdFx0XHRcdFx0cm90YXRpb25YID0gdC5yb3RhdGlvblgsXG5cdFx0XHRcdFx0cm90YXRpb25ZID0gdC5yb3RhdGlvblksXG5cdFx0XHRcdFx0c3ggPSB0LnNjYWxlWCxcblx0XHRcdFx0XHRzeSA9IHQuc2NhbGVZLFxuXHRcdFx0XHRcdHN6ID0gdC5zY2FsZVosXG5cdFx0XHRcdFx0eCA9IHQueCxcblx0XHRcdFx0XHR5ID0gdC55LFxuXHRcdFx0XHRcdHogPSB0LnosXG5cdFx0XHRcdFx0aXNTVkcgPSB0LnN2Zyxcblx0XHRcdFx0XHRwZXJzcGVjdGl2ZSA9IHQucGVyc3BlY3RpdmUsXG5cdFx0XHRcdFx0Zm9yY2UzRCA9IHQuZm9yY2UzRCxcblx0XHRcdFx0XHRhMTEsIGExMiwgYTEzLCBhMjEsIGEyMiwgYTIzLCBhMzEsIGEzMiwgYTMzLCBhNDEsIGE0MiwgYTQzLFxuXHRcdFx0XHRcdHpPcmlnaW4sIG1pbiwgY29zLCBzaW4sIHQxLCB0MiwgdHJhbnNmb3JtLCBjb21tYSwgemVybywgc2tldywgcm5kO1xuXHRcdFx0XHQvL2NoZWNrIHRvIHNlZSBpZiB3ZSBzaG91bGQgcmVuZGVyIGFzIDJEIChhbmQgU1ZHcyBtdXN0IHVzZSAyRCB3aGVuIF91c2VTVkdUcmFuc2Zvcm1BdHRyIGlzIHRydWUpXG5cdFx0XHRcdGlmICgoKCgodiA9PT0gMSB8fCB2ID09PSAwKSAmJiBmb3JjZTNEID09PSBcImF1dG9cIiAmJiAodGhpcy50d2Vlbi5fdG90YWxUaW1lID09PSB0aGlzLnR3ZWVuLl90b3RhbER1cmF0aW9uIHx8ICF0aGlzLnR3ZWVuLl90b3RhbFRpbWUpKSB8fCAhZm9yY2UzRCkgJiYgIXogJiYgIXBlcnNwZWN0aXZlICYmICFyb3RhdGlvblkgJiYgIXJvdGF0aW9uWCAmJiBzeiA9PT0gMSkgfHwgKF91c2VTVkdUcmFuc2Zvcm1BdHRyICYmIGlzU1ZHKSB8fCAhX3N1cHBvcnRzM0QpIHsgLy9vbiB0aGUgZmluYWwgcmVuZGVyICh3aGljaCBjb3VsZCBiZSAwIGZvciBhIGZyb20gdHdlZW4pLCBpZiB0aGVyZSBhcmUgbm8gM0QgYXNwZWN0cywgcmVuZGVyIGluIDJEIHRvIGZyZWUgdXAgbWVtb3J5IGFuZCBpbXByb3ZlIHBlcmZvcm1hbmNlIGVzcGVjaWFsbHkgb24gbW9iaWxlIGRldmljZXMuIENoZWNrIHRoZSB0d2VlbidzIHRvdGFsVGltZS90b3RhbER1cmF0aW9uIHRvbyBpbiBvcmRlciB0byBtYWtlIHN1cmUgaXQgZG9lc24ndCBoYXBwZW4gYmV0d2VlbiByZXBlYXRzIGlmIGl0J3MgYSByZXBlYXRpbmcgdHdlZW4uXG5cblx0XHRcdFx0XHQvLzJEXG5cdFx0XHRcdFx0aWYgKGFuZ2xlIHx8IHQuc2tld1ggfHwgaXNTVkcpIHtcblx0XHRcdFx0XHRcdGFuZ2xlICo9IF9ERUcyUkFEO1xuXHRcdFx0XHRcdFx0c2tldyA9IHQuc2tld1ggKiBfREVHMlJBRDtcblx0XHRcdFx0XHRcdHJuZCA9IDEwMDAwMDtcblx0XHRcdFx0XHRcdGExMSA9IE1hdGguY29zKGFuZ2xlKSAqIHN4O1xuXHRcdFx0XHRcdFx0YTIxID0gTWF0aC5zaW4oYW5nbGUpICogc3g7XG5cdFx0XHRcdFx0XHRhMTIgPSBNYXRoLnNpbihhbmdsZSAtIHNrZXcpICogLXN5O1xuXHRcdFx0XHRcdFx0YTIyID0gTWF0aC5jb3MoYW5nbGUgLSBza2V3KSAqIHN5O1xuXHRcdFx0XHRcdFx0aWYgKHNrZXcgJiYgdC5za2V3VHlwZSA9PT0gXCJzaW1wbGVcIikgeyAvL2J5IGRlZmF1bHQsIHdlIGNvbXBlbnNhdGUgc2tld2luZyBvbiB0aGUgb3RoZXIgYXhpcyB0byBtYWtlIGl0IGxvb2sgbW9yZSBuYXR1cmFsLCBidXQgeW91IGNhbiBzZXQgdGhlIHNrZXdUeXBlIHRvIFwic2ltcGxlXCIgdG8gdXNlIHRoZSB1bmNvbXBlbnNhdGVkIHNrZXdpbmcgdGhhdCBDU1MgZG9lc1xuXHRcdFx0XHRcdFx0XHR0MSA9IE1hdGgudGFuKHNrZXcgLSB0LnNrZXdZICogX0RFRzJSQUQpO1xuXHRcdFx0XHRcdFx0XHR0MSA9IE1hdGguc3FydCgxICsgdDEgKiB0MSk7XG5cdFx0XHRcdFx0XHRcdGExMiAqPSB0MTtcblx0XHRcdFx0XHRcdFx0YTIyICo9IHQxO1xuXHRcdFx0XHRcdFx0XHRpZiAodC5za2V3WSkge1xuXHRcdFx0XHRcdFx0XHRcdHQxID0gTWF0aC50YW4odC5za2V3WSAqIF9ERUcyUkFEKTtcblx0XHRcdFx0XHRcdFx0XHR0MSA9IE1hdGguc3FydCgxICsgdDEgKiB0MSk7XG5cdFx0XHRcdFx0XHRcdFx0YTExICo9IHQxO1xuXHRcdFx0XHRcdFx0XHRcdGEyMSAqPSB0MTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGlzU1ZHKSB7XG5cdFx0XHRcdFx0XHRcdHggKz0gdC54T3JpZ2luIC0gKHQueE9yaWdpbiAqIGExMSArIHQueU9yaWdpbiAqIGExMikgKyB0LnhPZmZzZXQ7XG5cdFx0XHRcdFx0XHRcdHkgKz0gdC55T3JpZ2luIC0gKHQueE9yaWdpbiAqIGEyMSArIHQueU9yaWdpbiAqIGEyMikgKyB0LnlPZmZzZXQ7XG5cdFx0XHRcdFx0XHRcdGlmIChfdXNlU1ZHVHJhbnNmb3JtQXR0ciAmJiAodC54UGVyY2VudCB8fCB0LnlQZXJjZW50KSkgeyAvL1RoZSBTVkcgc3BlYyBkb2Vzbid0IHN1cHBvcnQgcGVyY2VudGFnZS1iYXNlZCB0cmFuc2xhdGlvbiBpbiB0aGUgXCJ0cmFuc2Zvcm1cIiBhdHRyaWJ1dGUsIHNvIHdlIG1lcmdlIGl0IGludG8gdGhlIG1hdHJpeCB0byBzaW11bGF0ZSBpdC5cblx0XHRcdFx0XHRcdFx0XHRtaW4gPSB0aGlzLnQuZ2V0QkJveCgpO1xuXHRcdFx0XHRcdFx0XHRcdHggKz0gdC54UGVyY2VudCAqIDAuMDEgKiBtaW4ud2lkdGg7XG5cdFx0XHRcdFx0XHRcdFx0eSArPSB0LnlQZXJjZW50ICogMC4wMSAqIG1pbi5oZWlnaHQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0bWluID0gMC4wMDAwMDE7XG5cdFx0XHRcdFx0XHRcdGlmICh4IDwgbWluKSBpZiAoeCA+IC1taW4pIHtcblx0XHRcdFx0XHRcdFx0XHR4ID0gMDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoeSA8IG1pbikgaWYgKHkgPiAtbWluKSB7XG5cdFx0XHRcdFx0XHRcdFx0eSA9IDA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRyYW5zZm9ybSA9ICgoKGExMSAqIHJuZCkgfCAwKSAvIHJuZCkgKyBcIixcIiArICgoKGEyMSAqIHJuZCkgfCAwKSAvIHJuZCkgKyBcIixcIiArICgoKGExMiAqIHJuZCkgfCAwKSAvIHJuZCkgKyBcIixcIiArICgoKGEyMiAqIHJuZCkgfCAwKSAvIHJuZCkgKyBcIixcIiArIHggKyBcIixcIiArIHkgKyBcIilcIjtcblx0XHRcdFx0XHRcdGlmIChpc1NWRyAmJiBfdXNlU1ZHVHJhbnNmb3JtQXR0cikge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwibWF0cml4KFwiICsgdHJhbnNmb3JtKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdC8vc29tZSBicm93c2VycyBoYXZlIGEgaGFyZCB0aW1lIHdpdGggdmVyeSBzbWFsbCB2YWx1ZXMgbGlrZSAyLjQ0OTI5MzU5ODI5NDcwNjRlLTE2IChub3RpY2UgdGhlIFwiZS1cIiB0b3dhcmRzIHRoZSBlbmQpIGFuZCB3b3VsZCByZW5kZXIgdGhlIG9iamVjdCBzbGlnaHRseSBvZmYuIFNvIHdlIHJvdW5kIHRvIDUgZGVjaW1hbCBwbGFjZXMuXG5cdFx0XHRcdFx0XHRcdHN0eWxlW190cmFuc2Zvcm1Qcm9wXSA9ICgodC54UGVyY2VudCB8fCB0LnlQZXJjZW50KSA/IFwidHJhbnNsYXRlKFwiICsgdC54UGVyY2VudCArIFwiJSxcIiArIHQueVBlcmNlbnQgKyBcIiUpIG1hdHJpeChcIiA6IFwibWF0cml4KFwiKSArIHRyYW5zZm9ybTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3R5bGVbX3RyYW5zZm9ybVByb3BdID0gKCh0LnhQZXJjZW50IHx8IHQueVBlcmNlbnQpID8gXCJ0cmFuc2xhdGUoXCIgKyB0LnhQZXJjZW50ICsgXCIlLFwiICsgdC55UGVyY2VudCArIFwiJSkgbWF0cml4KFwiIDogXCJtYXRyaXgoXCIpICsgc3ggKyBcIiwwLDAsXCIgKyBzeSArIFwiLFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoX2lzRmlyZWZveCkgeyAvL0ZpcmVmb3ggaGFzIGEgYnVnIChhdCBsZWFzdCBpbiB2MjUpIHRoYXQgY2F1c2VzIGl0IHRvIHJlbmRlciB0aGUgdHJhbnNwYXJlbnQgcGFydCBvZiAzMi1iaXQgUE5HIGltYWdlcyBhcyBibGFjayB3aGVuIGRpc3BsYXllZCBpbnNpZGUgYW4gaWZyYW1lIGFuZCB0aGUgM0Qgc2NhbGUgaXMgdmVyeSBzbWFsbCBhbmQgZG9lc24ndCBjaGFuZ2Ugc3VmZmljaWVudGx5IGVub3VnaCBiZXR3ZWVuIHJlbmRlcnMgKGxpa2UgaWYgeW91IHVzZSBhIFBvd2VyNC5lYXNlSW5PdXQgdG8gc2NhbGUgZnJvbSAwIHRvIDEgd2hlcmUgdGhlIGJlZ2lubmluZyB2YWx1ZXMgb25seSBjaGFuZ2UgYSB0aW55IGFtb3VudCB0byBiZWdpbiB0aGUgdHdlZW4gYmVmb3JlIGFjY2VsZXJhdGluZykuIEluIHRoaXMgY2FzZSwgd2UgZm9yY2UgdGhlIHNjYWxlIHRvIGJlIDAuMDAwMDIgaW5zdGVhZCB3aGljaCBpcyB2aXN1YWxseSB0aGUgc2FtZSBidXQgd29ya3MgYXJvdW5kIHRoZSBGaXJlZm94IGlzc3VlLlxuXHRcdFx0XHRcdG1pbiA9IDAuMDAwMTtcblx0XHRcdFx0XHRpZiAoc3ggPCBtaW4gJiYgc3ggPiAtbWluKSB7XG5cdFx0XHRcdFx0XHRzeCA9IHN6ID0gMC4wMDAwMjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHN5IDwgbWluICYmIHN5ID4gLW1pbikge1xuXHRcdFx0XHRcdFx0c3kgPSBzeiA9IDAuMDAwMDI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwZXJzcGVjdGl2ZSAmJiAhdC56ICYmICF0LnJvdGF0aW9uWCAmJiAhdC5yb3RhdGlvblkpIHsgLy9GaXJlZm94IGhhcyBhIGJ1ZyB0aGF0IGNhdXNlcyBlbGVtZW50cyB0byBoYXZlIGFuIG9kZCBzdXBlci10aGluLCBicm9rZW4vZG90dGVkIGJsYWNrIGJvcmRlciBvbiBlbGVtZW50cyB0aGF0IGhhdmUgYSBwZXJzcGVjdGl2ZSBzZXQgYnV0IGFyZW4ndCB1dGlsaXppbmcgM0Qgc3BhY2UgKG5vIHJvdGF0aW9uWCwgcm90YXRpb25ZLCBvciB6KS5cblx0XHRcdFx0XHRcdHBlcnNwZWN0aXZlID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGFuZ2xlIHx8IHQuc2tld1gpIHtcblx0XHRcdFx0XHRhbmdsZSAqPSBfREVHMlJBRDtcblx0XHRcdFx0XHRjb3MgPSBhMTEgPSBNYXRoLmNvcyhhbmdsZSk7XG5cdFx0XHRcdFx0c2luID0gYTIxID0gTWF0aC5zaW4oYW5nbGUpO1xuXHRcdFx0XHRcdGlmICh0LnNrZXdYKSB7XG5cdFx0XHRcdFx0XHRhbmdsZSAtPSB0LnNrZXdYICogX0RFRzJSQUQ7XG5cdFx0XHRcdFx0XHRjb3MgPSBNYXRoLmNvcyhhbmdsZSk7XG5cdFx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cdFx0XHRcdFx0XHRpZiAodC5za2V3VHlwZSA9PT0gXCJzaW1wbGVcIikgeyAvL2J5IGRlZmF1bHQsIHdlIGNvbXBlbnNhdGUgc2tld2luZyBvbiB0aGUgb3RoZXIgYXhpcyB0byBtYWtlIGl0IGxvb2sgbW9yZSBuYXR1cmFsLCBidXQgeW91IGNhbiBzZXQgdGhlIHNrZXdUeXBlIHRvIFwic2ltcGxlXCIgdG8gdXNlIHRoZSB1bmNvbXBlbnNhdGVkIHNrZXdpbmcgdGhhdCBDU1MgZG9lc1xuXHRcdFx0XHRcdFx0XHR0MSA9IE1hdGgudGFuKCh0LnNrZXdYIC0gdC5za2V3WSkgKiBfREVHMlJBRCk7XG5cdFx0XHRcdFx0XHRcdHQxID0gTWF0aC5zcXJ0KDEgKyB0MSAqIHQxKTtcblx0XHRcdFx0XHRcdFx0Y29zICo9IHQxO1xuXHRcdFx0XHRcdFx0XHRzaW4gKj0gdDE7XG5cdFx0XHRcdFx0XHRcdGlmICh0LnNrZXdZKSB7XG5cdFx0XHRcdFx0XHRcdFx0dDEgPSBNYXRoLnRhbih0LnNrZXdZICogX0RFRzJSQUQpO1xuXHRcdFx0XHRcdFx0XHRcdHQxID0gTWF0aC5zcXJ0KDEgKyB0MSAqIHQxKTtcblx0XHRcdFx0XHRcdFx0XHRhMTEgKj0gdDE7XG5cdFx0XHRcdFx0XHRcdFx0YTIxICo9IHQxO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGExMiA9IC1zaW47XG5cdFx0XHRcdFx0YTIyID0gY29zO1xuXG5cdFx0XHRcdH0gZWxzZSBpZiAoIXJvdGF0aW9uWSAmJiAhcm90YXRpb25YICYmIHN6ID09PSAxICYmICFwZXJzcGVjdGl2ZSAmJiAhaXNTVkcpIHsgLy9pZiB3ZSdyZSBvbmx5IHRyYW5zbGF0aW5nIGFuZC9vciAyRCBzY2FsaW5nLCB0aGlzIGlzIGZhc3Rlci4uLlxuXHRcdFx0XHRcdHN0eWxlW190cmFuc2Zvcm1Qcm9wXSA9ICgodC54UGVyY2VudCB8fCB0LnlQZXJjZW50KSA/IFwidHJhbnNsYXRlKFwiICsgdC54UGVyY2VudCArIFwiJSxcIiArIHQueVBlcmNlbnQgKyBcIiUpIHRyYW5zbGF0ZTNkKFwiIDogXCJ0cmFuc2xhdGUzZChcIikgKyB4ICsgXCJweCxcIiArIHkgKyBcInB4LFwiICsgeiArXCJweClcIiArICgoc3ggIT09IDEgfHwgc3kgIT09IDEpID8gXCIgc2NhbGUoXCIgKyBzeCArIFwiLFwiICsgc3kgKyBcIilcIiA6IFwiXCIpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhMTEgPSBhMjIgPSAxO1xuXHRcdFx0XHRcdGExMiA9IGEyMSA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gS0VZICBJTkRFWCAgIEFGRkVDVFNcblx0XHRcdFx0Ly8gYTExICAwICAgICAgIHJvdGF0aW9uLCByb3RhdGlvblksIHNjYWxlWFxuXHRcdFx0XHQvLyBhMjEgIDEgICAgICAgcm90YXRpb24sIHJvdGF0aW9uWSwgc2NhbGVYXG5cdFx0XHRcdC8vIGEzMSAgMiAgICAgICByb3RhdGlvblksIHNjYWxlWFxuXHRcdFx0XHQvLyBhNDEgIDMgICAgICAgcm90YXRpb25ZLCBzY2FsZVhcblx0XHRcdFx0Ly8gYTEyICA0ICAgICAgIHJvdGF0aW9uLCBza2V3WCwgcm90YXRpb25YLCBzY2FsZVlcblx0XHRcdFx0Ly8gYTIyICA1ICAgICAgIHJvdGF0aW9uLCBza2V3WCwgcm90YXRpb25YLCBzY2FsZVlcblx0XHRcdFx0Ly8gYTMyICA2ICAgICAgIHJvdGF0aW9uWCwgc2NhbGVZXG5cdFx0XHRcdC8vIGE0MiAgNyAgICAgICByb3RhdGlvblgsIHNjYWxlWVxuXHRcdFx0XHQvLyBhMTMgIDggICAgICAgcm90YXRpb25ZLCByb3RhdGlvblgsIHNjYWxlWlxuXHRcdFx0XHQvLyBhMjMgIDkgICAgICAgcm90YXRpb25ZLCByb3RhdGlvblgsIHNjYWxlWlxuXHRcdFx0XHQvLyBhMzMgIDEwICAgICAgcm90YXRpb25ZLCByb3RhdGlvblgsIHNjYWxlWlxuXHRcdFx0XHQvLyBhNDMgIDExICAgICAgcm90YXRpb25ZLCByb3RhdGlvblgsIHBlcnNwZWN0aXZlLCBzY2FsZVpcblx0XHRcdFx0Ly8gYTE0ICAxMiAgICAgIHgsIHpPcmlnaW4sIHN2Z09yaWdpblxuXHRcdFx0XHQvLyBhMjQgIDEzICAgICAgeSwgek9yaWdpbiwgc3ZnT3JpZ2luXG5cdFx0XHRcdC8vIGEzNCAgMTQgICAgICB6LCB6T3JpZ2luXG5cdFx0XHRcdC8vIGE0NCAgMTVcblx0XHRcdFx0Ly8gcm90YXRpb246IE1hdGguYXRhbjIoYTIxLCBhMTEpXG5cdFx0XHRcdC8vIHJvdGF0aW9uWTogTWF0aC5hdGFuMihhMTMsIGEzMykgKG9yIE1hdGguYXRhbjIoYTEzLCBhMTEpKVxuXHRcdFx0XHQvLyByb3RhdGlvblg6IE1hdGguYXRhbjIoYTMyLCBhMzMpXG5cdFx0XHRcdGEzMyA9IDE7XG5cdFx0XHRcdGExMyA9IGEyMyA9IGEzMSA9IGEzMiA9IGE0MSA9IGE0MiA9IDA7XG5cdFx0XHRcdGE0MyA9IChwZXJzcGVjdGl2ZSkgPyAtMSAvIHBlcnNwZWN0aXZlIDogMDtcblx0XHRcdFx0ek9yaWdpbiA9IHQuek9yaWdpbjtcblx0XHRcdFx0bWluID0gMC4wMDAwMDE7IC8vdGhyZXNob2xkIGJlbG93IHdoaWNoIGJyb3dzZXJzIHVzZSBzY2llbnRpZmljIG5vdGF0aW9uIHdoaWNoIHdvbid0IHdvcmsuXG5cdFx0XHRcdGNvbW1hID0gXCIsXCI7XG5cdFx0XHRcdHplcm8gPSBcIjBcIjtcblx0XHRcdFx0YW5nbGUgPSByb3RhdGlvblkgKiBfREVHMlJBRDtcblx0XHRcdFx0aWYgKGFuZ2xlKSB7XG5cdFx0XHRcdFx0Y29zID0gTWF0aC5jb3MoYW5nbGUpO1xuXHRcdFx0XHRcdHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcblx0XHRcdFx0XHRhMzEgPSAtc2luO1xuXHRcdFx0XHRcdGE0MSA9IGE0Myotc2luO1xuXHRcdFx0XHRcdGExMyA9IGExMSpzaW47XG5cdFx0XHRcdFx0YTIzID0gYTIxKnNpbjtcblx0XHRcdFx0XHRhMzMgPSBjb3M7XG5cdFx0XHRcdFx0YTQzICo9IGNvcztcblx0XHRcdFx0XHRhMTEgKj0gY29zO1xuXHRcdFx0XHRcdGEyMSAqPSBjb3M7XG5cdFx0XHRcdH1cblx0XHRcdFx0YW5nbGUgPSByb3RhdGlvblggKiBfREVHMlJBRDtcblx0XHRcdFx0aWYgKGFuZ2xlKSB7XG5cdFx0XHRcdFx0Y29zID0gTWF0aC5jb3MoYW5nbGUpO1xuXHRcdFx0XHRcdHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcblx0XHRcdFx0XHR0MSA9IGExMipjb3MrYTEzKnNpbjtcblx0XHRcdFx0XHR0MiA9IGEyMipjb3MrYTIzKnNpbjtcblx0XHRcdFx0XHRhMzIgPSBhMzMqc2luO1xuXHRcdFx0XHRcdGE0MiA9IGE0MypzaW47XG5cdFx0XHRcdFx0YTEzID0gYTEyKi1zaW4rYTEzKmNvcztcblx0XHRcdFx0XHRhMjMgPSBhMjIqLXNpbithMjMqY29zO1xuXHRcdFx0XHRcdGEzMyA9IGEzMypjb3M7XG5cdFx0XHRcdFx0YTQzID0gYTQzKmNvcztcblx0XHRcdFx0XHRhMTIgPSB0MTtcblx0XHRcdFx0XHRhMjIgPSB0Mjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc3ogIT09IDEpIHtcblx0XHRcdFx0XHRhMTMqPXN6O1xuXHRcdFx0XHRcdGEyMyo9c3o7XG5cdFx0XHRcdFx0YTMzKj1zejtcblx0XHRcdFx0XHRhNDMqPXN6O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzeSAhPT0gMSkge1xuXHRcdFx0XHRcdGExMio9c3k7XG5cdFx0XHRcdFx0YTIyKj1zeTtcblx0XHRcdFx0XHRhMzIqPXN5O1xuXHRcdFx0XHRcdGE0Mio9c3k7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHN4ICE9PSAxKSB7XG5cdFx0XHRcdFx0YTExKj1zeDtcblx0XHRcdFx0XHRhMjEqPXN4O1xuXHRcdFx0XHRcdGEzMSo9c3g7XG5cdFx0XHRcdFx0YTQxKj1zeDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh6T3JpZ2luIHx8IGlzU1ZHKSB7XG5cdFx0XHRcdFx0aWYgKHpPcmlnaW4pIHtcblx0XHRcdFx0XHRcdHggKz0gYTEzKi16T3JpZ2luO1xuXHRcdFx0XHRcdFx0eSArPSBhMjMqLXpPcmlnaW47XG5cdFx0XHRcdFx0XHR6ICs9IGEzMyotek9yaWdpbit6T3JpZ2luO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoaXNTVkcpIHsgLy9kdWUgdG8gYnVncyBpbiBzb21lIGJyb3dzZXJzLCB3ZSBuZWVkIHRvIG1hbmFnZSB0aGUgdHJhbnNmb3JtLW9yaWdpbiBvZiBTVkcgbWFudWFsbHlcblx0XHRcdFx0XHRcdHggKz0gdC54T3JpZ2luIC0gKHQueE9yaWdpbiAqIGExMSArIHQueU9yaWdpbiAqIGExMikgKyB0LnhPZmZzZXQ7XG5cdFx0XHRcdFx0XHR5ICs9IHQueU9yaWdpbiAtICh0LnhPcmlnaW4gKiBhMjEgKyB0LnlPcmlnaW4gKiBhMjIpICsgdC55T2Zmc2V0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoeCA8IG1pbiAmJiB4ID4gLW1pbikge1xuXHRcdFx0XHRcdFx0eCA9IHplcm87XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh5IDwgbWluICYmIHkgPiAtbWluKSB7XG5cdFx0XHRcdFx0XHR5ID0gemVybztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHogPCBtaW4gJiYgeiA+IC1taW4pIHtcblx0XHRcdFx0XHRcdHogPSAwOyAvL2Rvbid0IHVzZSBzdHJpbmcgYmVjYXVzZSB3ZSBjYWxjdWxhdGUgcGVyc3BlY3RpdmUgbGF0ZXIgYW5kIG5lZWQgdGhlIG51bWJlci5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL29wdGltaXplZCB3YXkgb2YgY29uY2F0ZW5hdGluZyBhbGwgdGhlIHZhbHVlcyBpbnRvIGEgc3RyaW5nLiBJZiB3ZSBkbyBpdCBhbGwgaW4gb25lIHNob3QsIGl0J3Mgc2xvd2VyIGJlY2F1c2Ugb2YgdGhlIHdheSBicm93c2VycyBoYXZlIHRvIGNyZWF0ZSB0ZW1wIHN0cmluZ3MgYW5kIHRoZSB3YXkgaXQgYWZmZWN0cyBtZW1vcnkuIElmIHdlIGRvIGl0IHBpZWNlLWJ5LXBpZWNlIHdpdGggKz0sIGl0J3MgYSBiaXQgc2xvd2VyIHRvby4gV2UgZm91bmQgdGhhdCBkb2luZyBpdCBpbiB0aGVzZSBzaXplZCBjaHVua3Mgd29ya3MgYmVzdCBvdmVyYWxsOlxuXHRcdFx0XHR0cmFuc2Zvcm0gPSAoKHQueFBlcmNlbnQgfHwgdC55UGVyY2VudCkgPyBcInRyYW5zbGF0ZShcIiArIHQueFBlcmNlbnQgKyBcIiUsXCIgKyB0LnlQZXJjZW50ICsgXCIlKSBtYXRyaXgzZChcIiA6IFwibWF0cml4M2QoXCIpO1xuXHRcdFx0XHR0cmFuc2Zvcm0gKz0gKChhMTEgPCBtaW4gJiYgYTExID4gLW1pbikgPyB6ZXJvIDogYTExKSArIGNvbW1hICsgKChhMjEgPCBtaW4gJiYgYTIxID4gLW1pbikgPyB6ZXJvIDogYTIxKSArIGNvbW1hICsgKChhMzEgPCBtaW4gJiYgYTMxID4gLW1pbikgPyB6ZXJvIDogYTMxKTtcblx0XHRcdFx0dHJhbnNmb3JtICs9IGNvbW1hICsgKChhNDEgPCBtaW4gJiYgYTQxID4gLW1pbikgPyB6ZXJvIDogYTQxKSArIGNvbW1hICsgKChhMTIgPCBtaW4gJiYgYTEyID4gLW1pbikgPyB6ZXJvIDogYTEyKSArIGNvbW1hICsgKChhMjIgPCBtaW4gJiYgYTIyID4gLW1pbikgPyB6ZXJvIDogYTIyKTtcblx0XHRcdFx0aWYgKHJvdGF0aW9uWCB8fCByb3RhdGlvblkgfHwgc3ogIT09IDEpIHsgLy9wZXJmb3JtYW5jZSBvcHRpbWl6YXRpb24gKG9mdGVuIHRoZXJlJ3Mgbm8gcm90YXRpb25YIG9yIHJvdGF0aW9uWSwgc28gd2UgY2FuIHNraXAgdGhlc2UgY2FsY3VsYXRpb25zKVxuXHRcdFx0XHRcdHRyYW5zZm9ybSArPSBjb21tYSArICgoYTMyIDwgbWluICYmIGEzMiA+IC1taW4pID8gemVybyA6IGEzMikgKyBjb21tYSArICgoYTQyIDwgbWluICYmIGE0MiA+IC1taW4pID8gemVybyA6IGE0MikgKyBjb21tYSArICgoYTEzIDwgbWluICYmIGExMyA+IC1taW4pID8gemVybyA6IGExMyk7XG5cdFx0XHRcdFx0dHJhbnNmb3JtICs9IGNvbW1hICsgKChhMjMgPCBtaW4gJiYgYTIzID4gLW1pbikgPyB6ZXJvIDogYTIzKSArIGNvbW1hICsgKChhMzMgPCBtaW4gJiYgYTMzID4gLW1pbikgPyB6ZXJvIDogYTMzKSArIGNvbW1hICsgKChhNDMgPCBtaW4gJiYgYTQzID4gLW1pbikgPyB6ZXJvIDogYTQzKSArIGNvbW1hO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRyYW5zZm9ybSArPSBcIiwwLDAsMCwwLDEsMCxcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0cmFuc2Zvcm0gKz0geCArIGNvbW1hICsgeSArIGNvbW1hICsgeiArIGNvbW1hICsgKHBlcnNwZWN0aXZlID8gKDEgKyAoLXogLyBwZXJzcGVjdGl2ZSkpIDogMSkgKyBcIilcIjtcblxuXHRcdFx0XHRzdHlsZVtfdHJhbnNmb3JtUHJvcF0gPSB0cmFuc2Zvcm07XG5cdFx0XHR9O1xuXG5cdFx0cCA9IFRyYW5zZm9ybS5wcm90b3R5cGU7XG5cdFx0cC54ID0gcC55ID0gcC56ID0gcC5za2V3WCA9IHAuc2tld1kgPSBwLnJvdGF0aW9uID0gcC5yb3RhdGlvblggPSBwLnJvdGF0aW9uWSA9IHAuek9yaWdpbiA9IHAueFBlcmNlbnQgPSBwLnlQZXJjZW50ID0gcC54T2Zmc2V0ID0gcC55T2Zmc2V0ID0gMDtcblx0XHRwLnNjYWxlWCA9IHAuc2NhbGVZID0gcC5zY2FsZVogPSAxO1xuXG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwidHJhbnNmb3JtLHNjYWxlLHNjYWxlWCxzY2FsZVksc2NhbGVaLHgseSx6LHJvdGF0aW9uLHJvdGF0aW9uWCxyb3RhdGlvblkscm90YXRpb25aLHNrZXdYLHNrZXdZLHNob3J0Um90YXRpb24sc2hvcnRSb3RhdGlvblgsc2hvcnRSb3RhdGlvblksc2hvcnRSb3RhdGlvblosdHJhbnNmb3JtT3JpZ2luLHN2Z09yaWdpbix0cmFuc2Zvcm1QZXJzcGVjdGl2ZSxkaXJlY3Rpb25hbFJvdGF0aW9uLHBhcnNlVHJhbnNmb3JtLGZvcmNlM0Qsc2tld1R5cGUseFBlcmNlbnQseVBlcmNlbnQsc21vb3RoT3JpZ2luXCIsIHtwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcGFyc2luZ1Byb3AsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpIHtcblx0XHRcdGlmIChjc3NwLl9sYXN0UGFyc2VkVHJhbnNmb3JtID09PSB2YXJzKSB7IHJldHVybiBwdDsgfSAvL29ubHkgbmVlZCB0byBwYXJzZSB0aGUgdHJhbnNmb3JtIG9uY2UsIGFuZCBvbmx5IGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIGl0LlxuXHRcdFx0Y3NzcC5fbGFzdFBhcnNlZFRyYW5zZm9ybSA9IHZhcnM7XG5cdFx0XHR2YXIgc3dhcEZ1bmM7XG5cdFx0XHRpZiAodHlwZW9mKHZhcnNbcGFyc2luZ1Byb3BdKSA9PT0gXCJmdW5jdGlvblwiKSB7IC8vd2hhdGV2ZXIgcHJvcGVydHkgdHJpZ2dlcnMgdGhlIGluaXRpYWwgcGFyc2luZyBtaWdodCBiZSBhIGZ1bmN0aW9uLWJhc2VkIHZhbHVlIGluIHdoaWNoIGNhc2UgaXQgYWxyZWFkeSBnb3QgY2FsbGVkIGluIHBhcnNlKCksIHRodXMgd2UgZG9uJ3Qgd2FudCB0byBjYWxsIGl0IGFnYWluIGluIGhlcmUuIFRoZSBtb3N0IGVmZmljaWVudCB3YXkgdG8gYXZvaWQgdGhpcyBpcyB0byB0ZW1wb3JhcmlseSBzd2FwIHRoZSB2YWx1ZSBkaXJlY3RseSBpbnRvIHRoZSB2YXJzIG9iamVjdCwgYW5kIHRoZW4gYWZ0ZXIgd2UgZG8gYWxsIG91ciBwYXJzaW5nIGluIHRoaXMgZnVuY3Rpb24sIHdlJ2xsIHN3YXAgaXQgYmFjayBhZ2Fpbi5cblx0XHRcdFx0c3dhcEZ1bmMgPSB2YXJzW3BhcnNpbmdQcm9wXTtcblx0XHRcdFx0dmFyc1twYXJzaW5nUHJvcF0gPSBlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIG9yaWdpbmFsR1NUcmFuc2Zvcm0gPSB0Ll9nc1RyYW5zZm9ybSxcblx0XHRcdFx0c3R5bGUgPSB0LnN0eWxlLFxuXHRcdFx0XHRtaW4gPSAwLjAwMDAwMSxcblx0XHRcdFx0aSA9IF90cmFuc2Zvcm1Qcm9wcy5sZW5ndGgsXG5cdFx0XHRcdHYgPSB2YXJzLFxuXHRcdFx0XHRlbmRSb3RhdGlvbnMgPSB7fSxcblx0XHRcdFx0dHJhbnNmb3JtT3JpZ2luU3RyaW5nID0gXCJ0cmFuc2Zvcm1PcmlnaW5cIixcblx0XHRcdFx0bTEgPSBfZ2V0VHJhbnNmb3JtKHQsIF9jcywgdHJ1ZSwgdi5wYXJzZVRyYW5zZm9ybSksXG5cdFx0XHRcdG9yaWcgPSB2LnRyYW5zZm9ybSAmJiAoKHR5cGVvZih2LnRyYW5zZm9ybSkgPT09IFwiZnVuY3Rpb25cIikgPyB2LnRyYW5zZm9ybShfaW5kZXgsIF90YXJnZXQpIDogdi50cmFuc2Zvcm0pLFxuXHRcdFx0XHRtMiwgY29weSwgaGFzM0QsIGhhc0NoYW5nZSwgZHIsIHgsIHksIG1hdHJpeCwgcDtcblx0XHRcdGNzc3AuX3RyYW5zZm9ybSA9IG0xO1xuXHRcdFx0aWYgKG9yaWcgJiYgdHlwZW9mKG9yaWcpID09PSBcInN0cmluZ1wiICYmIF90cmFuc2Zvcm1Qcm9wKSB7IC8vZm9yIHZhbHVlcyBsaWtlIHRyYW5zZm9ybTpcInJvdGF0ZSg2MGRlZykgc2NhbGUoMC41LCAwLjgpXCJcblx0XHRcdFx0Y29weSA9IF90ZW1wRGl2LnN0eWxlOyAvL2Rvbid0IHVzZSB0aGUgb3JpZ2luYWwgdGFyZ2V0IGJlY2F1c2UgaXQgbWlnaHQgYmUgU1ZHIGluIHdoaWNoIGNhc2Ugc29tZSBicm93c2VycyBkb24ndCByZXBvcnQgY29tcHV0ZWQgc3R5bGUgY29ycmVjdGx5LlxuXHRcdFx0XHRjb3B5W190cmFuc2Zvcm1Qcm9wXSA9IG9yaWc7XG5cdFx0XHRcdGNvcHkuZGlzcGxheSA9IFwiYmxvY2tcIjsgLy9pZiBkaXNwbGF5IGlzIFwibm9uZVwiLCB0aGUgYnJvd3NlciBvZnRlbiByZWZ1c2VzIHRvIHJlcG9ydCB0aGUgdHJhbnNmb3JtIHByb3BlcnRpZXMgY29ycmVjdGx5LlxuXHRcdFx0XHRjb3B5LnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHRcdFx0XHRfZG9jLmJvZHkuYXBwZW5kQ2hpbGQoX3RlbXBEaXYpO1xuXHRcdFx0XHRtMiA9IF9nZXRUcmFuc2Zvcm0oX3RlbXBEaXYsIG51bGwsIGZhbHNlKTtcblx0XHRcdFx0aWYgKG0xLnN2ZykgeyAvL2lmIGl0J3MgYW4gU1ZHIGVsZW1lbnQsIHgveSBwYXJ0IG9mIHRoZSBtYXRyaXggd2lsbCBiZSBhZmZlY3RlZCBieSB3aGF0ZXZlciB3ZSB1c2UgYXMgdGhlIG9yaWdpbiBhbmQgdGhlIG9mZnNldHMsIHNvIGNvbXBlbnNhdGUgaGVyZS4uLlxuXHRcdFx0XHRcdHggPSBtMS54T3JpZ2luO1xuXHRcdFx0XHRcdHkgPSBtMS55T3JpZ2luO1xuXHRcdFx0XHRcdG0yLnggLT0gbTEueE9mZnNldDtcblx0XHRcdFx0XHRtMi55IC09IG0xLnlPZmZzZXQ7XG5cdFx0XHRcdFx0aWYgKHYudHJhbnNmb3JtT3JpZ2luIHx8IHYuc3ZnT3JpZ2luKSB7IC8vaWYgdGhpcyB0d2VlbiBpcyBhbHRlcmluZyB0aGUgb3JpZ2luLCB3ZSBtdXN0IGZhY3RvciB0aGF0IGluIGhlcmUuIFRoZSBhY3R1YWwgd29yayBvZiByZWNvcmRpbmcgdGhlIHRyYW5zZm9ybU9yaWdpbiB2YWx1ZXMgYW5kIHNldHRpbmcgdXAgdGhlIFByb3BUd2VlbiBpcyBkb25lIGxhdGVyIChzdGlsbCBpbnNpZGUgdGhpcyBmdW5jdGlvbikgc28gd2UgY2Fubm90IGxlYXZlIHRoZSBjaGFuZ2VzIGludGFjdCBoZXJlIC0gd2Ugb25seSB3YW50IHRvIHVwZGF0ZSB0aGUgeC95IGFjY29yZGluZ2x5LlxuXHRcdFx0XHRcdFx0b3JpZyA9IHt9O1xuXHRcdFx0XHRcdFx0X3BhcnNlU1ZHT3JpZ2luKHQsIF9wYXJzZVBvc2l0aW9uKHYudHJhbnNmb3JtT3JpZ2luKSwgb3JpZywgdi5zdmdPcmlnaW4sIHYuc21vb3RoT3JpZ2luLCB0cnVlKTtcblx0XHRcdFx0XHRcdHggPSBvcmlnLnhPcmlnaW47XG5cdFx0XHRcdFx0XHR5ID0gb3JpZy55T3JpZ2luO1xuXHRcdFx0XHRcdFx0bTIueCAtPSBvcmlnLnhPZmZzZXQgLSBtMS54T2Zmc2V0O1xuXHRcdFx0XHRcdFx0bTIueSAtPSBvcmlnLnlPZmZzZXQgLSBtMS55T2Zmc2V0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoeCB8fCB5KSB7XG5cdFx0XHRcdFx0XHRtYXRyaXggPSBfZ2V0TWF0cml4KF90ZW1wRGl2LCB0cnVlKTtcblx0XHRcdFx0XHRcdG0yLnggLT0geCAtICh4ICogbWF0cml4WzBdICsgeSAqIG1hdHJpeFsyXSk7XG5cdFx0XHRcdFx0XHRtMi55IC09IHkgLSAoeCAqIG1hdHJpeFsxXSArIHkgKiBtYXRyaXhbM10pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRfZG9jLmJvZHkucmVtb3ZlQ2hpbGQoX3RlbXBEaXYpO1xuXHRcdFx0XHRpZiAoIW0yLnBlcnNwZWN0aXZlKSB7XG5cdFx0XHRcdFx0bTIucGVyc3BlY3RpdmUgPSBtMS5wZXJzcGVjdGl2ZTsgLy90d2VlbmluZyB0byBubyBwZXJzcGVjdGl2ZSBnaXZlcyB2ZXJ5IHVuaW50dWl0aXZlIHJlc3VsdHMgLSBqdXN0IGtlZXAgdGhlIHNhbWUgcGVyc3BlY3RpdmUgaW4gdGhhdCBjYXNlLlxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2LnhQZXJjZW50ICE9IG51bGwpIHtcblx0XHRcdFx0XHRtMi54UGVyY2VudCA9IF9wYXJzZVZhbCh2LnhQZXJjZW50LCBtMS54UGVyY2VudCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHYueVBlcmNlbnQgIT0gbnVsbCkge1xuXHRcdFx0XHRcdG0yLnlQZXJjZW50ID0gX3BhcnNlVmFsKHYueVBlcmNlbnQsIG0xLnlQZXJjZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YodikgPT09IFwib2JqZWN0XCIpIHsgLy9mb3IgdmFsdWVzIGxpa2Ugc2NhbGVYLCBzY2FsZVksIHJvdGF0aW9uLCB4LCB5LCBza2V3WCwgYW5kIHNrZXdZIG9yIHRyYW5zZm9ybTp7Li4ufSAob2JqZWN0KVxuXHRcdFx0XHRtMiA9IHtzY2FsZVg6X3BhcnNlVmFsKCh2LnNjYWxlWCAhPSBudWxsKSA/IHYuc2NhbGVYIDogdi5zY2FsZSwgbTEuc2NhbGVYKSxcblx0XHRcdFx0XHRzY2FsZVk6X3BhcnNlVmFsKCh2LnNjYWxlWSAhPSBudWxsKSA/IHYuc2NhbGVZIDogdi5zY2FsZSwgbTEuc2NhbGVZKSxcblx0XHRcdFx0XHRzY2FsZVo6X3BhcnNlVmFsKHYuc2NhbGVaLCBtMS5zY2FsZVopLFxuXHRcdFx0XHRcdHg6X3BhcnNlVmFsKHYueCwgbTEueCksXG5cdFx0XHRcdFx0eTpfcGFyc2VWYWwodi55LCBtMS55KSxcblx0XHRcdFx0XHR6Ol9wYXJzZVZhbCh2LnosIG0xLnopLFxuXHRcdFx0XHRcdHhQZXJjZW50Ol9wYXJzZVZhbCh2LnhQZXJjZW50LCBtMS54UGVyY2VudCksXG5cdFx0XHRcdFx0eVBlcmNlbnQ6X3BhcnNlVmFsKHYueVBlcmNlbnQsIG0xLnlQZXJjZW50KSxcblx0XHRcdFx0XHRwZXJzcGVjdGl2ZTpfcGFyc2VWYWwodi50cmFuc2Zvcm1QZXJzcGVjdGl2ZSwgbTEucGVyc3BlY3RpdmUpfTtcblx0XHRcdFx0ZHIgPSB2LmRpcmVjdGlvbmFsUm90YXRpb247XG5cdFx0XHRcdGlmIChkciAhPSBudWxsKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZihkcikgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHRcdGZvciAoY29weSBpbiBkcikge1xuXHRcdFx0XHRcdFx0XHR2W2NvcHldID0gZHJbY29weV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHYucm90YXRpb24gPSBkcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGVvZih2LngpID09PSBcInN0cmluZ1wiICYmIHYueC5pbmRleE9mKFwiJVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRtMi54ID0gMDtcblx0XHRcdFx0XHRtMi54UGVyY2VudCA9IF9wYXJzZVZhbCh2LngsIG0xLnhQZXJjZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHlwZW9mKHYueSkgPT09IFwic3RyaW5nXCIgJiYgdi55LmluZGV4T2YoXCIlXCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdG0yLnkgPSAwO1xuXHRcdFx0XHRcdG0yLnlQZXJjZW50ID0gX3BhcnNlVmFsKHYueSwgbTEueVBlcmNlbnQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bTIucm90YXRpb24gPSBfcGFyc2VBbmdsZSgoXCJyb3RhdGlvblwiIGluIHYpID8gdi5yb3RhdGlvbiA6IChcInNob3J0Um90YXRpb25cIiBpbiB2KSA/IHYuc2hvcnRSb3RhdGlvbiArIFwiX3Nob3J0XCIgOiAoXCJyb3RhdGlvblpcIiBpbiB2KSA/IHYucm90YXRpb25aIDogbTEucm90YXRpb24gLSBtMS5za2V3WSwgbTEucm90YXRpb24gLSBtMS5za2V3WSwgXCJyb3RhdGlvblwiLCBlbmRSb3RhdGlvbnMpOyAvL3NlZSBub3RlcyBiZWxvdyBhYm91dCBza2V3WSBmb3Igd2h5IHdlIHN1YnRyYWN0IGl0IGZyb20gcm90YXRpb24gaGVyZVxuXHRcdFx0XHRpZiAoX3N1cHBvcnRzM0QpIHtcblx0XHRcdFx0XHRtMi5yb3RhdGlvblggPSBfcGFyc2VBbmdsZSgoXCJyb3RhdGlvblhcIiBpbiB2KSA/IHYucm90YXRpb25YIDogKFwic2hvcnRSb3RhdGlvblhcIiBpbiB2KSA/IHYuc2hvcnRSb3RhdGlvblggKyBcIl9zaG9ydFwiIDogbTEucm90YXRpb25YIHx8IDAsIG0xLnJvdGF0aW9uWCwgXCJyb3RhdGlvblhcIiwgZW5kUm90YXRpb25zKTtcblx0XHRcdFx0XHRtMi5yb3RhdGlvblkgPSBfcGFyc2VBbmdsZSgoXCJyb3RhdGlvbllcIiBpbiB2KSA/IHYucm90YXRpb25ZIDogKFwic2hvcnRSb3RhdGlvbllcIiBpbiB2KSA/IHYuc2hvcnRSb3RhdGlvblkgKyBcIl9zaG9ydFwiIDogbTEucm90YXRpb25ZIHx8IDAsIG0xLnJvdGF0aW9uWSwgXCJyb3RhdGlvbllcIiwgZW5kUm90YXRpb25zKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRtMi5za2V3WCA9IF9wYXJzZUFuZ2xlKHYuc2tld1gsIG0xLnNrZXdYIC0gbTEuc2tld1kpOyAvL3NlZSBub3RlcyBiZWxvdyBhYm91dCBza2V3WSBhbmQgd2h5IHdlIHN1YnRyYWN0IGl0IGZyb20gc2tld1ggaGVyZVxuXG5cdFx0XHRcdC8vbm90ZTogZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIHdlIGNvbWJpbmUgYWxsIHNrZXdpbmcgaW50byB0aGUgc2tld1ggYW5kIHJvdGF0aW9uIHZhbHVlcywgaWdub3Jpbmcgc2tld1kgYnV0IHdlIG11c3Qgc3RpbGwgcmVjb3JkIGl0IHNvIHRoYXQgd2UgY2FuIGRpc2Nlcm4gaG93IG11Y2ggb2YgdGhlIG92ZXJhbGwgc2tldyBpcyBhdHRyaWJ1dGVkIHRvIHNrZXdYIHZzLiBza2V3WS4gT3RoZXJ3aXNlLCBpZiB0aGUgc2tld1kgd291bGQgYWx3YXlzIGFjdCByZWxhdGl2ZSAodHdlZW4gc2tld1kgdG8gMTBkZWcsIGZvciBleGFtcGxlLCBtdWx0aXBsZSB0aW1lcyBhbmQgaWYgd2UgYWx3YXlzIGNvbWJpbmUgdGhpbmdzIGludG8gc2tld1gsIHdlIGNhbid0IHJlbWVtYmVyIHRoYXQgc2tld1kgd2FzIDEwIGZyb20gbGFzdCB0aW1lKS4gUmVtZW1iZXIsIGEgc2tld1kgb2YgMTAgZGVncmVlcyBsb29rcyB0aGUgc2FtZSBhcyBhIHJvdGF0aW9uIG9mIDEwIGRlZ3JlZXMgcGx1cyBhIHNrZXdYIG9mIC0xMCBkZWdyZWVzLlxuXHRcdFx0XHRpZiAoKG0yLnNrZXdZID0gX3BhcnNlQW5nbGUodi5za2V3WSwgbTEuc2tld1kpKSkge1xuXHRcdFx0XHRcdG0yLnNrZXdYICs9IG0yLnNrZXdZO1xuXHRcdFx0XHRcdG0yLnJvdGF0aW9uICs9IG0yLnNrZXdZO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoX3N1cHBvcnRzM0QgJiYgdi5mb3JjZTNEICE9IG51bGwpIHtcblx0XHRcdFx0bTEuZm9yY2UzRCA9IHYuZm9yY2UzRDtcblx0XHRcdFx0aGFzQ2hhbmdlID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0bTEuc2tld1R5cGUgPSB2LnNrZXdUeXBlIHx8IG0xLnNrZXdUeXBlIHx8IENTU1BsdWdpbi5kZWZhdWx0U2tld1R5cGU7XG5cblx0XHRcdGhhczNEID0gKG0xLmZvcmNlM0QgfHwgbTEueiB8fCBtMS5yb3RhdGlvblggfHwgbTEucm90YXRpb25ZIHx8IG0yLnogfHwgbTIucm90YXRpb25YIHx8IG0yLnJvdGF0aW9uWSB8fCBtMi5wZXJzcGVjdGl2ZSk7XG5cdFx0XHRpZiAoIWhhczNEICYmIHYuc2NhbGUgIT0gbnVsbCkge1xuXHRcdFx0XHRtMi5zY2FsZVogPSAxOyAvL25vIG5lZWQgdG8gdHdlZW4gc2NhbGVaLlxuXHRcdFx0fVxuXG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0cCA9IF90cmFuc2Zvcm1Qcm9wc1tpXTtcblx0XHRcdFx0b3JpZyA9IG0yW3BdIC0gbTFbcF07XG5cdFx0XHRcdGlmIChvcmlnID4gbWluIHx8IG9yaWcgPCAtbWluIHx8IHZbcF0gIT0gbnVsbCB8fCBfZm9yY2VQVFtwXSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0aGFzQ2hhbmdlID0gdHJ1ZTtcblx0XHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4obTEsIHAsIG0xW3BdLCBvcmlnLCBwdCk7XG5cdFx0XHRcdFx0aWYgKHAgaW4gZW5kUm90YXRpb25zKSB7XG5cdFx0XHRcdFx0XHRwdC5lID0gZW5kUm90YXRpb25zW3BdOyAvL2RpcmVjdGlvbmFsIHJvdGF0aW9ucyB0eXBpY2FsbHkgaGF2ZSBjb21wZW5zYXRlZCB2YWx1ZXMgZHVyaW5nIHRoZSB0d2VlbiwgYnV0IHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoZXkgZW5kIGF0IGV4YWN0bHkgd2hhdCB0aGUgdXNlciByZXF1ZXN0ZWRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQueHMwID0gMDsgLy9lbnN1cmVzIHRoZSB2YWx1ZSBzdGF5cyBudW1lcmljIGluIHNldFJhdGlvKClcblx0XHRcdFx0XHRwdC5wbHVnaW4gPSBwbHVnaW47XG5cdFx0XHRcdFx0Y3NzcC5fb3ZlcndyaXRlUHJvcHMucHVzaChwdC5uKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRvcmlnID0gdi50cmFuc2Zvcm1PcmlnaW47XG5cdFx0XHRpZiAobTEuc3ZnICYmIChvcmlnIHx8IHYuc3ZnT3JpZ2luKSkge1xuXHRcdFx0XHR4ID0gbTEueE9mZnNldDsgLy93aGVuIHdlIGNoYW5nZSB0aGUgb3JpZ2luLCBpbiBvcmRlciB0byBwcmV2ZW50IHRoaW5ncyBmcm9tIGp1bXBpbmcgd2UgYWRqdXN0IHRoZSB4L3kgc28gd2UgbXVzdCByZWNvcmQgdGhvc2UgaGVyZSBzbyB0aGF0IHdlIGNhbiBjcmVhdGUgUHJvcFR3ZWVucyBmb3IgdGhlbSBhbmQgZmxpcCB0aGVtIGF0IHRoZSBzYW1lIHRpbWUgYXMgdGhlIG9yaWdpblxuXHRcdFx0XHR5ID0gbTEueU9mZnNldDtcblx0XHRcdFx0X3BhcnNlU1ZHT3JpZ2luKHQsIF9wYXJzZVBvc2l0aW9uKG9yaWcpLCBtMiwgdi5zdmdPcmlnaW4sIHYuc21vb3RoT3JpZ2luKTtcblx0XHRcdFx0cHQgPSBfYWRkTm9uVHdlZW5pbmdOdW1lcmljUFQobTEsIFwieE9yaWdpblwiLCAob3JpZ2luYWxHU1RyYW5zZm9ybSA/IG0xIDogbTIpLnhPcmlnaW4sIG0yLnhPcmlnaW4sIHB0LCB0cmFuc2Zvcm1PcmlnaW5TdHJpbmcpOyAvL25vdGU6IGlmIHRoZXJlIHdhc24ndCBhIHRyYW5zZm9ybU9yaWdpbiBkZWZpbmVkIHlldCwganVzdCBzdGFydCB3aXRoIHRoZSBkZXN0aW5hdGlvbiBvbmU7IGl0J3Mgd2FzdGVmdWwgb3RoZXJ3aXNlLCBhbmQgaXQgY2F1c2VzIHByb2JsZW1zIHdpdGggZnJvbVRvKCkgdHdlZW5zLiBGb3IgZXhhbXBsZSwgVHdlZW5MaXRlLnRvKFwiI3doZWVsXCIsIDMsIHtyb3RhdGlvbjoxODAsIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCVcIiwgZGVsYXk6MX0pOyBUd2VlbkxpdGUuZnJvbVRvKFwiI3doZWVsXCIsIDMsIHtzY2FsZTowLjUsIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCVcIn0sIHtzY2FsZToxLCBkZWxheToyfSk7IHdvdWxkIGNhdXNlIGEganVtcCB3aGVuIHRoZSBmcm9tIHZhbHVlcyByZXZlcnQgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgMm5kIHR3ZWVuLlxuXHRcdFx0XHRwdCA9IF9hZGROb25Ud2VlbmluZ051bWVyaWNQVChtMSwgXCJ5T3JpZ2luXCIsIChvcmlnaW5hbEdTVHJhbnNmb3JtID8gbTEgOiBtMikueU9yaWdpbiwgbTIueU9yaWdpbiwgcHQsIHRyYW5zZm9ybU9yaWdpblN0cmluZyk7XG5cdFx0XHRcdGlmICh4ICE9PSBtMS54T2Zmc2V0IHx8IHkgIT09IG0xLnlPZmZzZXQpIHtcblx0XHRcdFx0XHRwdCA9IF9hZGROb25Ud2VlbmluZ051bWVyaWNQVChtMSwgXCJ4T2Zmc2V0XCIsIChvcmlnaW5hbEdTVHJhbnNmb3JtID8geCA6IG0xLnhPZmZzZXQpLCBtMS54T2Zmc2V0LCBwdCwgdHJhbnNmb3JtT3JpZ2luU3RyaW5nKTtcblx0XHRcdFx0XHRwdCA9IF9hZGROb25Ud2VlbmluZ051bWVyaWNQVChtMSwgXCJ5T2Zmc2V0XCIsIChvcmlnaW5hbEdTVHJhbnNmb3JtID8geSA6IG0xLnlPZmZzZXQpLCBtMS55T2Zmc2V0LCBwdCwgdHJhbnNmb3JtT3JpZ2luU3RyaW5nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRvcmlnID0gX3VzZVNWR1RyYW5zZm9ybUF0dHIgPyBudWxsIDogXCIwcHggMHB4XCI7IC8vY2VydGFpbiBicm93c2VycyAobGlrZSBmaXJlZm94KSBjb21wbGV0ZWx5IGJvdGNoIHRyYW5zZm9ybS1vcmlnaW4sIHNvIHdlIG11c3QgcmVtb3ZlIGl0IHRvIHByZXZlbnQgaXQgZnJvbSBjb250YW1pbmF0aW5nIHRyYW5zZm9ybXMuIFdlIG1hbmFnZSBpdCBvdXJzZWx2ZXMgd2l0aCB4T3JpZ2luIGFuZCB5T3JpZ2luXG5cdFx0XHR9XG5cdFx0XHRpZiAob3JpZyB8fCAoX3N1cHBvcnRzM0QgJiYgaGFzM0QgJiYgbTEuek9yaWdpbikpIHsgLy9pZiBhbnl0aGluZyAzRCBpcyBoYXBwZW5pbmcgYW5kIHRoZXJlJ3MgYSB0cmFuc2Zvcm1PcmlnaW4gd2l0aCBhIHogY29tcG9uZW50IHRoYXQncyBub24temVybywgd2UgbXVzdCBlbnN1cmUgdGhhdCB0aGUgdHJhbnNmb3JtT3JpZ2luJ3Mgei1jb21wb25lbnQgaXMgc2V0IHRvIDAgc28gdGhhdCB3ZSBjYW4gbWFudWFsbHkgZG8gdGhvc2UgY2FsY3VsYXRpb25zIHRvIGdldCBhcm91bmQgU2FmYXJpIGJ1Z3MuIEV2ZW4gaWYgdGhlIHVzZXIgZGlkbid0IHNwZWNpZmljYWxseSBkZWZpbmUgYSBcInRyYW5zZm9ybU9yaWdpblwiIGluIHRoaXMgcGFydGljdWxhciB0d2VlbiAobWF5YmUgdGhleSBkaWQgaXQgdmlhIGNzcyBkaXJlY3RseSkuXG5cdFx0XHRcdGlmIChfdHJhbnNmb3JtUHJvcCkge1xuXHRcdFx0XHRcdGhhc0NoYW5nZSA9IHRydWU7XG5cdFx0XHRcdFx0cCA9IF90cmFuc2Zvcm1PcmlnaW5Qcm9wO1xuXHRcdFx0XHRcdG9yaWcgPSAob3JpZyB8fCBfZ2V0U3R5bGUodCwgcCwgX2NzLCBmYWxzZSwgXCI1MCUgNTAlXCIpKSArIFwiXCI7IC8vY2FzdCBhcyBzdHJpbmcgdG8gYXZvaWQgZXJyb3JzXG5cdFx0XHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHN0eWxlLCBwLCAwLCAwLCBwdCwgLTEsIHRyYW5zZm9ybU9yaWdpblN0cmluZyk7XG5cdFx0XHRcdFx0cHQuYiA9IHN0eWxlW3BdO1xuXHRcdFx0XHRcdHB0LnBsdWdpbiA9IHBsdWdpbjtcblx0XHRcdFx0XHRpZiAoX3N1cHBvcnRzM0QpIHtcblx0XHRcdFx0XHRcdGNvcHkgPSBtMS56T3JpZ2luO1xuXHRcdFx0XHRcdFx0b3JpZyA9IG9yaWcuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHRcdFx0bTEuek9yaWdpbiA9ICgob3JpZy5sZW5ndGggPiAyICYmICEoY29weSAhPT0gMCAmJiBvcmlnWzJdID09PSBcIjBweFwiKSkgPyBwYXJzZUZsb2F0KG9yaWdbMl0pIDogY29weSkgfHwgMDsgLy9TYWZhcmkgZG9lc24ndCBoYW5kbGUgdGhlIHogcGFydCBvZiB0cmFuc2Zvcm1PcmlnaW4gY29ycmVjdGx5LCBzbyB3ZSdsbCBtYW51YWxseSBoYW5kbGUgaXQgaW4gdGhlIF9zZXQzRFRyYW5zZm9ybVJhdGlvKCkgbWV0aG9kLlxuXHRcdFx0XHRcdFx0cHQueHMwID0gcHQuZSA9IG9yaWdbMF0gKyBcIiBcIiArIChvcmlnWzFdIHx8IFwiNTAlXCIpICsgXCIgMHB4XCI7IC8vd2UgbXVzdCBkZWZpbmUgYSB6IHZhbHVlIG9mIDBweCBzcGVjaWZpY2FsbHkgb3RoZXJ3aXNlIGlPUyA1IFNhZmFyaSB3aWxsIHN0aWNrIHdpdGggdGhlIG9sZCBvbmUgKGlmIG9uZSB3YXMgZGVmaW5lZCkhXG5cdFx0XHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4obTEsIFwiek9yaWdpblwiLCAwLCAwLCBwdCwgLTEsIHB0Lm4pOyAvL3dlIG11c3QgY3JlYXRlIGEgQ1NTUHJvcFR3ZWVuIGZvciB0aGUgX2dzVHJhbnNmb3JtLnpPcmlnaW4gc28gdGhhdCBpdCBnZXRzIHJlc2V0IHByb3Blcmx5IGF0IHRoZSBiZWdpbm5pbmcgaWYgdGhlIHR3ZWVuIHJ1bnMgYmFja3dhcmQgKGFzIG9wcG9zZWQgdG8ganVzdCBzZXR0aW5nIG0xLnpPcmlnaW4gaGVyZSlcblx0XHRcdFx0XHRcdHB0LmIgPSBjb3B5O1xuXHRcdFx0XHRcdFx0cHQueHMwID0gcHQuZSA9IG0xLnpPcmlnaW47XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHB0LnhzMCA9IHB0LmUgPSBvcmlnO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vZm9yIG9sZGVyIHZlcnNpb25zIG9mIElFICg2LTgpLCB3ZSBuZWVkIHRvIG1hbnVhbGx5IGNhbGN1bGF0ZSB0aGluZ3MgaW5zaWRlIHRoZSBzZXRSYXRpbygpIGZ1bmN0aW9uLiBXZSByZWNvcmQgb3JpZ2luIHggYW5kIHkgKG94IGFuZCBveSkgYW5kIHdoZXRoZXIgb3Igbm90IHRoZSB2YWx1ZXMgYXJlIHBlcmNlbnRhZ2VzIChveHAgYW5kIG95cCkuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0X3BhcnNlUG9zaXRpb24ob3JpZyArIFwiXCIsIG0xKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGhhc0NoYW5nZSkge1xuXHRcdFx0XHRjc3NwLl90cmFuc2Zvcm1UeXBlID0gKCEobTEuc3ZnICYmIF91c2VTVkdUcmFuc2Zvcm1BdHRyKSAmJiAoaGFzM0QgfHwgdGhpcy5fdHJhbnNmb3JtVHlwZSA9PT0gMykpID8gMyA6IDI7IC8vcXVpY2tlciB0aGFuIGNhbGxpbmcgY3NzcC5fZW5hYmxlVHJhbnNmb3JtcygpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHN3YXBGdW5jKSB7XG5cdFx0XHRcdHZhcnNbcGFyc2luZ1Byb3BdID0gc3dhcEZ1bmM7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHQ7XG5cdFx0fSwgcHJlZml4OnRydWV9KTtcblxuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImJveFNoYWRvd1wiLCB7ZGVmYXVsdFZhbHVlOlwiMHB4IDBweCAwcHggMHB4ICM5OTlcIiwgcHJlZml4OnRydWUsIGNvbG9yOnRydWUsIG11bHRpOnRydWUsIGtleXdvcmQ6XCJpbnNldFwifSk7XG5cblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJib3JkZXJSYWRpdXNcIiwge2RlZmF1bHRWYWx1ZTpcIjBweFwiLCBwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbikge1xuXHRcdFx0ZSA9IHRoaXMuZm9ybWF0KGUpO1xuXHRcdFx0dmFyIHByb3BzID0gW1wiYm9yZGVyVG9wTGVmdFJhZGl1c1wiLFwiYm9yZGVyVG9wUmlnaHRSYWRpdXNcIixcImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzXCIsXCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzXCJdLFxuXHRcdFx0XHRzdHlsZSA9IHQuc3R5bGUsXG5cdFx0XHRcdGVhMSwgaSwgZXMyLCBiczIsIGJzLCBlcywgYm4sIGVuLCB3LCBoLCBlc2Z4LCBic2Z4LCByZWwsIGhuLCB2biwgZW07XG5cdFx0XHR3ID0gcGFyc2VGbG9hdCh0Lm9mZnNldFdpZHRoKTtcblx0XHRcdGggPSBwYXJzZUZsb2F0KHQub2Zmc2V0SGVpZ2h0KTtcblx0XHRcdGVhMSA9IGUuc3BsaXQoXCIgXCIpO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IC8vaWYgd2UncmUgZGVhbGluZyB3aXRoIHBlcmNlbnRhZ2VzLCB3ZSBtdXN0IGNvbnZlcnQgdGhpbmdzIHNlcGFyYXRlbHkgZm9yIHRoZSBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBheGlzIVxuXHRcdFx0XHRpZiAodGhpcy5wLmluZGV4T2YoXCJib3JkZXJcIikpIHsgLy9vbGRlciBicm93c2VycyB1c2VkIGEgcHJlZml4XG5cdFx0XHRcdFx0cHJvcHNbaV0gPSBfY2hlY2tQcm9wUHJlZml4KHByb3BzW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicyA9IGJzMiA9IF9nZXRTdHlsZSh0LCBwcm9wc1tpXSwgX2NzLCBmYWxzZSwgXCIwcHhcIik7XG5cdFx0XHRcdGlmIChicy5pbmRleE9mKFwiIFwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRiczIgPSBicy5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0YnMgPSBiczJbMF07XG5cdFx0XHRcdFx0YnMyID0gYnMyWzFdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVzID0gZXMyID0gZWExW2ldO1xuXHRcdFx0XHRibiA9IHBhcnNlRmxvYXQoYnMpO1xuXHRcdFx0XHRic2Z4ID0gYnMuc3Vic3RyKChibiArIFwiXCIpLmxlbmd0aCk7XG5cdFx0XHRcdHJlbCA9IChlcy5jaGFyQXQoMSkgPT09IFwiPVwiKTtcblx0XHRcdFx0aWYgKHJlbCkge1xuXHRcdFx0XHRcdGVuID0gcGFyc2VJbnQoZXMuY2hhckF0KDApK1wiMVwiLCAxMCk7XG5cdFx0XHRcdFx0ZXMgPSBlcy5zdWJzdHIoMik7XG5cdFx0XHRcdFx0ZW4gKj0gcGFyc2VGbG9hdChlcyk7XG5cdFx0XHRcdFx0ZXNmeCA9IGVzLnN1YnN0cigoZW4gKyBcIlwiKS5sZW5ndGggLSAoZW4gPCAwID8gMSA6IDApKSB8fCBcIlwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVuID0gcGFyc2VGbG9hdChlcyk7XG5cdFx0XHRcdFx0ZXNmeCA9IGVzLnN1YnN0cigoZW4gKyBcIlwiKS5sZW5ndGgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChlc2Z4ID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0ZXNmeCA9IF9zdWZmaXhNYXBbcF0gfHwgYnNmeDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZXNmeCAhPT0gYnNmeCkge1xuXHRcdFx0XHRcdGhuID0gX2NvbnZlcnRUb1BpeGVscyh0LCBcImJvcmRlckxlZnRcIiwgYm4sIGJzZngpOyAvL2hvcml6b250YWwgbnVtYmVyICh3ZSB1c2UgYSBib2d1cyBcImJvcmRlckxlZnRcIiBwcm9wZXJ0eSBqdXN0IGJlY2F1c2UgdGhlIF9jb252ZXJ0VG9QaXhlbHMoKSBtZXRob2Qgc2VhcmNoZXMgZm9yIHRoZSBrZXl3b3JkcyBcIkxlZnRcIiwgXCJSaWdodFwiLCBcIlRvcFwiLCBhbmQgXCJCb3R0b21cIiB0byBkZXRlcm1pbmUgb2YgaXQncyBhIGhvcml6b250YWwgb3IgdmVydGljYWwgcHJvcGVydHksIGFuZCB3ZSBuZWVkIFwiYm9yZGVyXCIgaW4gdGhlIG5hbWUgc28gdGhhdCBpdCBrbm93cyBpdCBzaG91bGQgbWVhc3VyZSByZWxhdGl2ZSB0byB0aGUgZWxlbWVudCBpdHNlbGYsIG5vdCBpdHMgcGFyZW50LlxuXHRcdFx0XHRcdHZuID0gX2NvbnZlcnRUb1BpeGVscyh0LCBcImJvcmRlclRvcFwiLCBibiwgYnNmeCk7IC8vdmVydGljYWwgbnVtYmVyXG5cdFx0XHRcdFx0aWYgKGVzZnggPT09IFwiJVwiKSB7XG5cdFx0XHRcdFx0XHRicyA9IChobiAvIHcgKiAxMDApICsgXCIlXCI7XG5cdFx0XHRcdFx0XHRiczIgPSAodm4gLyBoICogMTAwKSArIFwiJVwiO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoZXNmeCA9PT0gXCJlbVwiKSB7XG5cdFx0XHRcdFx0XHRlbSA9IF9jb252ZXJ0VG9QaXhlbHModCwgXCJib3JkZXJMZWZ0XCIsIDEsIFwiZW1cIik7XG5cdFx0XHRcdFx0XHRicyA9IChobiAvIGVtKSArIFwiZW1cIjtcblx0XHRcdFx0XHRcdGJzMiA9ICh2biAvIGVtKSArIFwiZW1cIjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YnMgPSBobiArIFwicHhcIjtcblx0XHRcdFx0XHRcdGJzMiA9IHZuICsgXCJweFwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocmVsKSB7XG5cdFx0XHRcdFx0XHRlcyA9IChwYXJzZUZsb2F0KGJzKSArIGVuKSArIGVzZng7XG5cdFx0XHRcdFx0XHRlczIgPSAocGFyc2VGbG9hdChiczIpICsgZW4pICsgZXNmeDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSBfcGFyc2VDb21wbGV4KHN0eWxlLCBwcm9wc1tpXSwgYnMgKyBcIiBcIiArIGJzMiwgZXMgKyBcIiBcIiArIGVzMiwgZmFsc2UsIFwiMHB4XCIsIHB0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwdDtcblx0XHR9LCBwcmVmaXg6dHJ1ZSwgZm9ybWF0dGVyOl9nZXRGb3JtYXR0ZXIoXCIwcHggMHB4IDBweCAwcHhcIiwgZmFsc2UsIHRydWUpfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiYm9yZGVyQm90dG9tTGVmdFJhZGl1cyxib3JkZXJCb3R0b21SaWdodFJhZGl1cyxib3JkZXJUb3BMZWZ0UmFkaXVzLGJvcmRlclRvcFJpZ2h0UmFkaXVzXCIsIHtkZWZhdWx0VmFsdWU6XCIwcHhcIiwgcGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4pIHtcblx0XHRcdHJldHVybiBfcGFyc2VDb21wbGV4KHQuc3R5bGUsIHAsIHRoaXMuZm9ybWF0KF9nZXRTdHlsZSh0LCBwLCBfY3MsIGZhbHNlLCBcIjBweCAwcHhcIikpLCB0aGlzLmZvcm1hdChlKSwgZmFsc2UsIFwiMHB4XCIsIHB0KTtcblx0XHR9LCBwcmVmaXg6dHJ1ZSwgZm9ybWF0dGVyOl9nZXRGb3JtYXR0ZXIoXCIwcHggMHB4XCIsIGZhbHNlLCB0cnVlKX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImJhY2tncm91bmRQb3NpdGlvblwiLCB7ZGVmYXVsdFZhbHVlOlwiMCAwXCIsIHBhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luKSB7XG5cdFx0XHR2YXIgYnAgPSBcImJhY2tncm91bmQtcG9zaXRpb25cIixcblx0XHRcdFx0Y3MgPSAoX2NzIHx8IF9nZXRDb21wdXRlZFN0eWxlKHQsIG51bGwpKSxcblx0XHRcdFx0YnMgPSB0aGlzLmZvcm1hdCggKChjcykgPyBfaWVWZXJzID8gY3MuZ2V0UHJvcGVydHlWYWx1ZShicCArIFwiLXhcIikgKyBcIiBcIiArIGNzLmdldFByb3BlcnR5VmFsdWUoYnAgKyBcIi15XCIpIDogY3MuZ2V0UHJvcGVydHlWYWx1ZShicCkgOiB0LmN1cnJlbnRTdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb25YICsgXCIgXCIgKyB0LmN1cnJlbnRTdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb25ZKSB8fCBcIjAgMFwiKSwgLy9JbnRlcm5ldCBFeHBsb3JlciBkb2Vzbid0IHJlcG9ydCBiYWNrZ3JvdW5kLXBvc2l0aW9uIGNvcnJlY3RseSAtIHdlIG11c3QgcXVlcnkgYmFja2dyb3VuZC1wb3NpdGlvbi14IGFuZCBiYWNrZ3JvdW5kLXBvc2l0aW9uLXkgYW5kIGNvbWJpbmUgdGhlbSAoZXZlbiBpbiBJRTEwKS4gQmVmb3JlIElFOSwgd2UgbXVzdCBkbyB0aGUgc2FtZSB3aXRoIHRoZSBjdXJyZW50U3R5bGUgb2JqZWN0IGFuZCB1c2UgY2FtZWxDYXNlXG5cdFx0XHRcdGVzID0gdGhpcy5mb3JtYXQoZSksXG5cdFx0XHRcdGJhLCBlYSwgaSwgcGN0LCBvdmVybGFwLCBzcmM7XG5cdFx0XHRpZiAoKGJzLmluZGV4T2YoXCIlXCIpICE9PSAtMSkgIT09IChlcy5pbmRleE9mKFwiJVwiKSAhPT0gLTEpICYmIGVzLnNwbGl0KFwiLFwiKS5sZW5ndGggPCAyKSB7XG5cdFx0XHRcdHNyYyA9IF9nZXRTdHlsZSh0LCBcImJhY2tncm91bmRJbWFnZVwiKS5yZXBsYWNlKF91cmxFeHAsIFwiXCIpO1xuXHRcdFx0XHRpZiAoc3JjICYmIHNyYyAhPT0gXCJub25lXCIpIHtcblx0XHRcdFx0XHRiYSA9IGJzLnNwbGl0KFwiIFwiKTtcblx0XHRcdFx0XHRlYSA9IGVzLnNwbGl0KFwiIFwiKTtcblx0XHRcdFx0XHRfdGVtcEltZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgc3JjKTsgLy9zZXQgdGhlIHRlbXAgSU1HJ3Mgc3JjIHRvIHRoZSBiYWNrZ3JvdW5kLWltYWdlIHNvIHRoYXQgd2UgY2FuIG1lYXN1cmUgaXRzIHdpZHRoL2hlaWdodFxuXHRcdFx0XHRcdGkgPSAyO1xuXHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0YnMgPSBiYVtpXTtcblx0XHRcdFx0XHRcdHBjdCA9IChicy5pbmRleE9mKFwiJVwiKSAhPT0gLTEpO1xuXHRcdFx0XHRcdFx0aWYgKHBjdCAhPT0gKGVhW2ldLmluZGV4T2YoXCIlXCIpICE9PSAtMSkpIHtcblx0XHRcdFx0XHRcdFx0b3ZlcmxhcCA9IChpID09PSAwKSA/IHQub2Zmc2V0V2lkdGggLSBfdGVtcEltZy53aWR0aCA6IHQub2Zmc2V0SGVpZ2h0IC0gX3RlbXBJbWcuaGVpZ2h0O1xuXHRcdFx0XHRcdFx0XHRiYVtpXSA9IHBjdCA/IChwYXJzZUZsb2F0KGJzKSAvIDEwMCAqIG92ZXJsYXApICsgXCJweFwiIDogKHBhcnNlRmxvYXQoYnMpIC8gb3ZlcmxhcCAqIDEwMCkgKyBcIiVcIjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnMgPSBiYS5qb2luKFwiIFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VDb21wbGV4KHQuc3R5bGUsIGJzLCBlcywgcHQsIHBsdWdpbik7XG5cdFx0fSwgZm9ybWF0dGVyOl9wYXJzZVBvc2l0aW9ufSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiYmFja2dyb3VuZFNpemVcIiwge2RlZmF1bHRWYWx1ZTpcIjAgMFwiLCBmb3JtYXR0ZXI6ZnVuY3Rpb24odikge1xuXHRcdFx0diArPSBcIlwiOyAvL2Vuc3VyZSBpdCdzIGEgc3RyaW5nXG5cdFx0XHRyZXR1cm4gX3BhcnNlUG9zaXRpb24odi5pbmRleE9mKFwiIFwiKSA9PT0gLTEgPyB2ICsgXCIgXCIgKyB2IDogdik7IC8vaWYgc2V0IHRvIHNvbWV0aGluZyBsaWtlIFwiMTAwJSAxMDAlXCIsIFNhZmFyaSB0eXBpY2FsbHkgcmVwb3J0cyB0aGUgY29tcHV0ZWQgc3R5bGUgYXMganVzdCBcIjEwMCVcIiAobm8gMm5kIHZhbHVlKSwgYnV0IHdlIHNob3VsZCBlbnN1cmUgdGhhdCB0aGVyZSBhcmUgdHdvIHZhbHVlcywgc28gY29weSB0aGUgZmlyc3Qgb25lLiBPdGhlcndpc2UsIGl0J2QgYmUgaW50ZXJwcmV0ZWQgYXMgXCIxMDAlIDBcIiAod3JvbmcpLlxuXHRcdH19KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJwZXJzcGVjdGl2ZVwiLCB7ZGVmYXVsdFZhbHVlOlwiMHB4XCIsIHByZWZpeDp0cnVlfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwicGVyc3BlY3RpdmVPcmlnaW5cIiwge2RlZmF1bHRWYWx1ZTpcIjUwJSA1MCVcIiwgcHJlZml4OnRydWV9KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJ0cmFuc2Zvcm1TdHlsZVwiLCB7cHJlZml4OnRydWV9KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJiYWNrZmFjZVZpc2liaWxpdHlcIiwge3ByZWZpeDp0cnVlfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwidXNlclNlbGVjdFwiLCB7cHJlZml4OnRydWV9KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJtYXJnaW5cIiwge3BhcnNlcjpfZ2V0RWRnZVBhcnNlcihcIm1hcmdpblRvcCxtYXJnaW5SaWdodCxtYXJnaW5Cb3R0b20sbWFyZ2luTGVmdFwiKX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcInBhZGRpbmdcIiwge3BhcnNlcjpfZ2V0RWRnZVBhcnNlcihcInBhZGRpbmdUb3AscGFkZGluZ1JpZ2h0LHBhZGRpbmdCb3R0b20scGFkZGluZ0xlZnRcIil9KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJjbGlwXCIsIHtkZWZhdWx0VmFsdWU6XCJyZWN0KDBweCwwcHgsMHB4LDBweClcIiwgcGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4pe1xuXHRcdFx0dmFyIGIsIGNzLCBkZWxpbTtcblx0XHRcdGlmIChfaWVWZXJzIDwgOSkgeyAvL0lFOCBhbmQgZWFybGllciBkb24ndCByZXBvcnQgYSBcImNsaXBcIiB2YWx1ZSBpbiB0aGUgY3VycmVudFN0eWxlIC0gaW5zdGVhZCwgdGhlIHZhbHVlcyBhcmUgc3BsaXQgYXBhcnQgaW50byBjbGlwVG9wLCBjbGlwUmlnaHQsIGNsaXBCb3R0b20sIGFuZCBjbGlwTGVmdC4gQWxzbywgaW4gSUU3IGFuZCBlYXJsaWVyLCB0aGUgdmFsdWVzIGluc2lkZSByZWN0KCkgYXJlIHNwYWNlLWRlbGltaXRlZCwgbm90IGNvbW1hLWRlbGltaXRlZC5cblx0XHRcdFx0Y3MgPSB0LmN1cnJlbnRTdHlsZTtcblx0XHRcdFx0ZGVsaW0gPSBfaWVWZXJzIDwgOCA/IFwiIFwiIDogXCIsXCI7XG5cdFx0XHRcdGIgPSBcInJlY3QoXCIgKyBjcy5jbGlwVG9wICsgZGVsaW0gKyBjcy5jbGlwUmlnaHQgKyBkZWxpbSArIGNzLmNsaXBCb3R0b20gKyBkZWxpbSArIGNzLmNsaXBMZWZ0ICsgXCIpXCI7XG5cdFx0XHRcdGUgPSB0aGlzLmZvcm1hdChlKS5zcGxpdChcIixcIikuam9pbihkZWxpbSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRiID0gdGhpcy5mb3JtYXQoX2dldFN0eWxlKHQsIHRoaXMucCwgX2NzLCBmYWxzZSwgdGhpcy5kZmx0KSk7XG5cdFx0XHRcdGUgPSB0aGlzLmZvcm1hdChlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnBhcnNlQ29tcGxleCh0LnN0eWxlLCBiLCBlLCBwdCwgcGx1Z2luKTtcblx0XHR9fSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwidGV4dFNoYWRvd1wiLCB7ZGVmYXVsdFZhbHVlOlwiMHB4IDBweCAwcHggIzk5OVwiLCBjb2xvcjp0cnVlLCBtdWx0aTp0cnVlfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiYXV0b1JvdW5kLHN0cmljdFVuaXRzXCIsIHtwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQpIHtyZXR1cm4gcHQ7fX0pOyAvL2p1c3Qgc28gdGhhdCB3ZSBjYW4gaWdub3JlIHRoZXNlIHByb3BlcnRpZXMgKG5vdCB0d2VlbiB0aGVtKVxuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImJvcmRlclwiLCB7ZGVmYXVsdFZhbHVlOlwiMHB4IHNvbGlkICMwMDBcIiwgcGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4pIHtcblx0XHRcdHZhciBidyA9IF9nZXRTdHlsZSh0LCBcImJvcmRlclRvcFdpZHRoXCIsIF9jcywgZmFsc2UsIFwiMHB4XCIpLFxuXHRcdFx0XHRlbmQgPSB0aGlzLmZvcm1hdChlKS5zcGxpdChcIiBcIiksXG5cdFx0XHRcdGVzZnggPSBlbmRbMF0ucmVwbGFjZShfc3VmZml4RXhwLCBcIlwiKTtcblx0XHRcdGlmIChlc2Z4ICE9PSBcInB4XCIpIHsgLy9pZiB3ZSdyZSBhbmltYXRpbmcgdG8gYSBub24tcHggdmFsdWUsIHdlIG5lZWQgdG8gY29udmVydCB0aGUgYmVnaW5uaW5nIHdpZHRoIHRvIHRoYXQgdW5pdC5cblx0XHRcdFx0YncgPSAocGFyc2VGbG9hdChidykgLyBfY29udmVydFRvUGl4ZWxzKHQsIFwiYm9yZGVyVG9wV2lkdGhcIiwgMSwgZXNmeCkpICsgZXNmeDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnBhcnNlQ29tcGxleCh0LnN0eWxlLCB0aGlzLmZvcm1hdChidyArIFwiIFwiICsgX2dldFN0eWxlKHQsIFwiYm9yZGVyVG9wU3R5bGVcIiwgX2NzLCBmYWxzZSwgXCJzb2xpZFwiKSArIFwiIFwiICsgX2dldFN0eWxlKHQsIFwiYm9yZGVyVG9wQ29sb3JcIiwgX2NzLCBmYWxzZSwgXCIjMDAwXCIpKSwgZW5kLmpvaW4oXCIgXCIpLCBwdCwgcGx1Z2luKTtcblx0XHRcdH0sIGNvbG9yOnRydWUsIGZvcm1hdHRlcjpmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHZhciBhID0gdi5zcGxpdChcIiBcIik7XG5cdFx0XHRcdHJldHVybiBhWzBdICsgXCIgXCIgKyAoYVsxXSB8fCBcInNvbGlkXCIpICsgXCIgXCIgKyAodi5tYXRjaChfY29sb3JFeHApIHx8IFtcIiMwMDBcIl0pWzBdO1xuXHRcdFx0fX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImJvcmRlcldpZHRoXCIsIHtwYXJzZXI6X2dldEVkZ2VQYXJzZXIoXCJib3JkZXJUb3BXaWR0aCxib3JkZXJSaWdodFdpZHRoLGJvcmRlckJvdHRvbVdpZHRoLGJvcmRlckxlZnRXaWR0aFwiKX0pOyAvL0ZpcmVmb3ggZG9lc24ndCBwaWNrIHVwIG9uIGJvcmRlcldpZHRoIHNldCBpbiBzdHlsZSBzaGVldHMgKG9ubHkgaW5saW5lKS5cblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJmbG9hdCxjc3NGbG9hdCxzdHlsZUZsb2F0XCIsIHtwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbikge1xuXHRcdFx0dmFyIHMgPSB0LnN0eWxlLFxuXHRcdFx0XHRwcm9wID0gKFwiY3NzRmxvYXRcIiBpbiBzKSA/IFwiY3NzRmxvYXRcIiA6IFwic3R5bGVGbG9hdFwiO1xuXHRcdFx0cmV0dXJuIG5ldyBDU1NQcm9wVHdlZW4ocywgcHJvcCwgMCwgMCwgcHQsIC0xLCBwLCBmYWxzZSwgMCwgc1twcm9wXSwgZSk7XG5cdFx0fX0pO1xuXG5cdFx0Ly9vcGFjaXR5LXJlbGF0ZWRcblx0XHR2YXIgX3NldElFT3BhY2l0eVJhdGlvID0gZnVuY3Rpb24odikge1xuXHRcdFx0XHR2YXIgdCA9IHRoaXMudCwgLy9yZWZlcnMgdG8gdGhlIGVsZW1lbnQncyBzdHlsZSBwcm9wZXJ0eVxuXHRcdFx0XHRcdGZpbHRlcnMgPSB0LmZpbHRlciB8fCBfZ2V0U3R5bGUodGhpcy5kYXRhLCBcImZpbHRlclwiKSB8fCBcIlwiLFxuXHRcdFx0XHRcdHZhbCA9ICh0aGlzLnMgKyB0aGlzLmMgKiB2KSB8IDAsXG5cdFx0XHRcdFx0c2tpcDtcblx0XHRcdFx0aWYgKHZhbCA9PT0gMTAwKSB7IC8vZm9yIG9sZGVyIHZlcnNpb25zIG9mIElFIHRoYXQgbmVlZCB0byB1c2UgYSBmaWx0ZXIgdG8gYXBwbHkgb3BhY2l0eSwgd2Ugc2hvdWxkIHJlbW92ZSB0aGUgZmlsdGVyIGlmIG9wYWNpdHkgaGl0cyAxIGluIG9yZGVyIHRvIGltcHJvdmUgcGVyZm9ybWFuY2UsIGJ1dCBtYWtlIHN1cmUgdGhlcmUgaXNuJ3QgYSB0cmFuc2Zvcm0gKG1hdHJpeCkgb3IgZ3JhZGllbnQgaW4gdGhlIGZpbHRlcnMuXG5cdFx0XHRcdFx0aWYgKGZpbHRlcnMuaW5kZXhPZihcImF0cml4KFwiKSA9PT0gLTEgJiYgZmlsdGVycy5pbmRleE9mKFwicmFkaWVudChcIikgPT09IC0xICYmIGZpbHRlcnMuaW5kZXhPZihcIm9hZGVyKFwiKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdHQucmVtb3ZlQXR0cmlidXRlKFwiZmlsdGVyXCIpO1xuXHRcdFx0XHRcdFx0c2tpcCA9ICghX2dldFN0eWxlKHRoaXMuZGF0YSwgXCJmaWx0ZXJcIikpOyAvL2lmIGEgY2xhc3MgaXMgYXBwbGllZCB0aGF0IGhhcyBhbiBhbHBoYSBmaWx0ZXIsIGl0IHdpbGwgdGFrZSBlZmZlY3QgKHdlIGRvbid0IHdhbnQgdGhhdCksIHNvIHJlLWFwcGx5IG91ciBhbHBoYSBmaWx0ZXIgaW4gdGhhdCBjYXNlLiBXZSBtdXN0IGZpcnN0IHJlbW92ZSBpdCBhbmQgdGhlbiBjaGVjay5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dC5maWx0ZXIgPSBmaWx0ZXJzLnJlcGxhY2UoX2FscGhhRmlsdGVyRXhwLCBcIlwiKTtcblx0XHRcdFx0XHRcdHNraXAgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXNraXApIHtcblx0XHRcdFx0XHRpZiAodGhpcy54bjEpIHtcblx0XHRcdFx0XHRcdHQuZmlsdGVyID0gZmlsdGVycyA9IGZpbHRlcnMgfHwgKFwiYWxwaGEob3BhY2l0eT1cIiArIHZhbCArIFwiKVwiKTsgLy93b3JrcyBhcm91bmQgYnVnIGluIElFNy84IHRoYXQgcHJldmVudHMgY2hhbmdlcyB0byBcInZpc2liaWxpdHlcIiBmcm9tIGJlaW5nIGFwcGxpZWQgcHJvcGVybHkgaWYgdGhlIGZpbHRlciBpcyBjaGFuZ2VkIHRvIGEgZGlmZmVyZW50IGFscGhhIG9uIHRoZSBzYW1lIGZyYW1lLlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoZmlsdGVycy5pbmRleE9mKFwicGFjaXR5XCIpID09PSAtMSkgeyAvL29ubHkgdXNlZCBpZiBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCB0aGUgc3RhbmRhcmQgb3BhY2l0eSBzdHlsZSBwcm9wZXJ0eSAoSUUgNyBhbmQgOCkuIFdlIG9taXQgdGhlIFwiT1wiIHRvIGF2b2lkIGNhc2Utc2Vuc2l0aXZpdHkgaXNzdWVzXG5cdFx0XHRcdFx0XHRpZiAodmFsICE9PSAwIHx8ICF0aGlzLnhuMSkgeyAvL2J1Z3MgaW4gSUU3Lzggd29uJ3QgcmVuZGVyIHRoZSBmaWx0ZXIgcHJvcGVybHkgaWYgb3BhY2l0eSBpcyBBRERFRCBvbiB0aGUgc2FtZSBmcmFtZS9yZW5kZXIgYXMgXCJ2aXNpYmlsaXR5XCIgY2hhbmdlcyAodGhpcy54bjEgaXMgMSBpZiB0aGlzIHR3ZWVuIGlzIGFuIFwiYXV0b0FscGhhXCIgdHdlZW4pXG5cdFx0XHRcdFx0XHRcdHQuZmlsdGVyID0gZmlsdGVycyArIFwiIGFscGhhKG9wYWNpdHk9XCIgKyB2YWwgKyBcIilcIjsgLy93ZSByb3VuZCB0aGUgdmFsdWUgYmVjYXVzZSBvdGhlcndpc2UsIGJ1Z3MgaW4gSUU3LzggY2FuIHByZXZlbnQgXCJ2aXNpYmlsaXR5XCIgY2hhbmdlcyBmcm9tIGJlaW5nIGFwcGxpZWQgcHJvcGVybHkuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHQuZmlsdGVyID0gZmlsdGVycy5yZXBsYWNlKF9vcGFjaXR5RXhwLCBcIm9wYWNpdHk9XCIgKyB2YWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJvcGFjaXR5LGFscGhhLGF1dG9BbHBoYVwiLCB7ZGVmYXVsdFZhbHVlOlwiMVwiLCBwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbikge1xuXHRcdFx0dmFyIGIgPSBwYXJzZUZsb2F0KF9nZXRTdHlsZSh0LCBcIm9wYWNpdHlcIiwgX2NzLCBmYWxzZSwgXCIxXCIpKSxcblx0XHRcdFx0c3R5bGUgPSB0LnN0eWxlLFxuXHRcdFx0XHRpc0F1dG9BbHBoYSA9IChwID09PSBcImF1dG9BbHBoYVwiKTtcblx0XHRcdGlmICh0eXBlb2YoZSkgPT09IFwic3RyaW5nXCIgJiYgZS5jaGFyQXQoMSkgPT09IFwiPVwiKSB7XG5cdFx0XHRcdGUgPSAoKGUuY2hhckF0KDApID09PSBcIi1cIikgPyAtMSA6IDEpICogcGFyc2VGbG9hdChlLnN1YnN0cigyKSkgKyBiO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGlzQXV0b0FscGhhICYmIGIgPT09IDEgJiYgX2dldFN0eWxlKHQsIFwidmlzaWJpbGl0eVwiLCBfY3MpID09PSBcImhpZGRlblwiICYmIGUgIT09IDApIHsgLy9pZiB2aXNpYmlsaXR5IGlzIGluaXRpYWxseSBzZXQgdG8gXCJoaWRkZW5cIiwgd2Ugc2hvdWxkIGludGVycHJldCB0aGF0IGFzIGludGVudCB0byBtYWtlIG9wYWNpdHkgMCAoYSBjb252ZW5pZW5jZSlcblx0XHRcdFx0YiA9IDA7XG5cdFx0XHR9XG5cdFx0XHRpZiAoX3N1cHBvcnRzT3BhY2l0eSkge1xuXHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4oc3R5bGUsIFwib3BhY2l0eVwiLCBiLCBlIC0gYiwgcHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHN0eWxlLCBcIm9wYWNpdHlcIiwgYiAqIDEwMCwgKGUgLSBiKSAqIDEwMCwgcHQpO1xuXHRcdFx0XHRwdC54bjEgPSBpc0F1dG9BbHBoYSA/IDEgOiAwOyAvL3dlIG5lZWQgdG8gcmVjb3JkIHdoZXRoZXIgb3Igbm90IHRoaXMgaXMgYW4gYXV0b0FscGhhIHNvIHRoYXQgaW4gdGhlIHNldFJhdGlvKCksIHdlIGtub3cgdG8gZHVwbGljYXRlIHRoZSBzZXR0aW5nIG9mIHRoZSBhbHBoYSBpbiBvcmRlciB0byB3b3JrIGFyb3VuZCBhIGJ1ZyBpbiBJRTcgYW5kIElFOCB0aGF0IHByZXZlbnRzIGNoYW5nZXMgdG8gXCJ2aXNpYmlsaXR5XCIgZnJvbSB0YWtpbmcgZWZmZWN0IGlmIHRoZSBmaWx0ZXIgaXMgY2hhbmdlZCB0byBhIGRpZmZlcmVudCBhbHBoYShvcGFjaXR5KSBhdCB0aGUgc2FtZSB0aW1lLiBTZXR0aW5nIGl0IHRvIHRoZSBTQU1FIHZhbHVlIGZpcnN0LCB0aGVuIHRoZSBuZXcgdmFsdWUgd29ya3MgYXJvdW5kIHRoZSBJRTcvOCBidWcuXG5cdFx0XHRcdHN0eWxlLnpvb20gPSAxOyAvL2hlbHBzIGNvcnJlY3QgYW4gSUUgaXNzdWUuXG5cdFx0XHRcdHB0LnR5cGUgPSAyO1xuXHRcdFx0XHRwdC5iID0gXCJhbHBoYShvcGFjaXR5PVwiICsgcHQucyArIFwiKVwiO1xuXHRcdFx0XHRwdC5lID0gXCJhbHBoYShvcGFjaXR5PVwiICsgKHB0LnMgKyBwdC5jKSArIFwiKVwiO1xuXHRcdFx0XHRwdC5kYXRhID0gdDtcblx0XHRcdFx0cHQucGx1Z2luID0gcGx1Z2luO1xuXHRcdFx0XHRwdC5zZXRSYXRpbyA9IF9zZXRJRU9wYWNpdHlSYXRpbztcblx0XHRcdH1cblx0XHRcdGlmIChpc0F1dG9BbHBoYSkgeyAvL3dlIGhhdmUgdG8gY3JlYXRlIHRoZSBcInZpc2liaWxpdHlcIiBQcm9wVHdlZW4gYWZ0ZXIgdGhlIG9wYWNpdHkgb25lIGluIHRoZSBsaW5rZWQgbGlzdCBzbyB0aGF0IHRoZXkgcnVuIGluIHRoZSBvcmRlciB0aGF0IHdvcmtzIHByb3Blcmx5IGluIElFOCBhbmQgZWFybGllclxuXHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4oc3R5bGUsIFwidmlzaWJpbGl0eVwiLCAwLCAwLCBwdCwgLTEsIG51bGwsIGZhbHNlLCAwLCAoKGIgIT09IDApID8gXCJpbmhlcml0XCIgOiBcImhpZGRlblwiKSwgKChlID09PSAwKSA/IFwiaGlkZGVuXCIgOiBcImluaGVyaXRcIikpO1xuXHRcdFx0XHRwdC54czAgPSBcImluaGVyaXRcIjtcblx0XHRcdFx0Y3NzcC5fb3ZlcndyaXRlUHJvcHMucHVzaChwdC5uKTtcblx0XHRcdFx0Y3NzcC5fb3ZlcndyaXRlUHJvcHMucHVzaChwKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwdDtcblx0XHR9fSk7XG5cblxuXHRcdHZhciBfcmVtb3ZlUHJvcCA9IGZ1bmN0aW9uKHMsIHApIHtcblx0XHRcdFx0aWYgKHApIHtcblx0XHRcdFx0XHRpZiAocy5yZW1vdmVQcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0aWYgKHAuc3Vic3RyKDAsMikgPT09IFwibXNcIiB8fCBwLnN1YnN0cigwLDYpID09PSBcIndlYmtpdFwiKSB7IC8vTWljcm9zb2Z0IGFuZCBzb21lIFdlYmtpdCBicm93c2VycyBkb24ndCBjb25mb3JtIHRvIHRoZSBzdGFuZGFyZCBvZiBjYXBpdGFsaXppbmcgdGhlIGZpcnN0IHByZWZpeCBjaGFyYWN0ZXIsIHNvIHdlIGFkanVzdCBzbyB0aGF0IHdoZW4gd2UgcHJlZml4IHRoZSBjYXBzIHdpdGggYSBkYXNoLCBpdCdzIGNvcnJlY3QgKG90aGVyd2lzZSBpdCdkIGJlIFwibXMtdHJhbnNmb3JtXCIgaW5zdGVhZCBvZiBcIi1tcy10cmFuc2Zvcm1cIiBmb3IgSUU5LCBmb3IgZXhhbXBsZSlcblx0XHRcdFx0XHRcdFx0cCA9IFwiLVwiICsgcDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHMucmVtb3ZlUHJvcGVydHkocC5yZXBsYWNlKF9jYXBzRXhwLCBcIi0kMVwiKS50b0xvd2VyQ2FzZSgpKTtcblx0XHRcdFx0XHR9IGVsc2UgeyAvL25vdGU6IG9sZCB2ZXJzaW9ucyBvZiBJRSB1c2UgXCJyZW1vdmVBdHRyaWJ1dGUoKVwiIGluc3RlYWQgb2YgXCJyZW1vdmVQcm9wZXJ0eSgpXCJcblx0XHRcdFx0XHRcdHMucmVtb3ZlQXR0cmlidXRlKHApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdF9zZXRDbGFzc05hbWVSYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0dGhpcy50Ll9nc0NsYXNzUFQgPSB0aGlzO1xuXHRcdFx0XHRpZiAodiA9PT0gMSB8fCB2ID09PSAwKSB7XG5cdFx0XHRcdFx0dGhpcy50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsICh2ID09PSAwKSA/IHRoaXMuYiA6IHRoaXMuZSk7XG5cdFx0XHRcdFx0dmFyIG1wdCA9IHRoaXMuZGF0YSwgLy9maXJzdCBNaW5pUHJvcFR3ZWVuXG5cdFx0XHRcdFx0XHRzID0gdGhpcy50LnN0eWxlO1xuXHRcdFx0XHRcdHdoaWxlIChtcHQpIHtcblx0XHRcdFx0XHRcdGlmICghbXB0LnYpIHtcblx0XHRcdFx0XHRcdFx0X3JlbW92ZVByb3AocywgbXB0LnApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0c1ttcHQucF0gPSBtcHQudjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1wdCA9IG1wdC5fbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHYgPT09IDEgJiYgdGhpcy50Ll9nc0NsYXNzUFQgPT09IHRoaXMpIHtcblx0XHRcdFx0XHRcdHRoaXMudC5fZ3NDbGFzc1BUID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy50LmdldEF0dHJpYnV0ZShcImNsYXNzXCIpICE9PSB0aGlzLmUpIHtcblx0XHRcdFx0XHR0aGlzLnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy5lKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJjbGFzc05hbWVcIiwge3BhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luLCB2YXJzKSB7XG5cdFx0XHR2YXIgYiA9IHQuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIiwgLy9kb24ndCB1c2UgdC5jbGFzc05hbWUgYmVjYXVzZSBpdCBkb2Vzbid0IHdvcmsgY29uc2lzdGVudGx5IG9uIFNWRyBlbGVtZW50czsgZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgYW5kIHNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHZhbHVlXCIpIGlzIG1vcmUgcmVsaWFibGUuXG5cdFx0XHRcdGNzc1RleHQgPSB0LnN0eWxlLmNzc1RleHQsXG5cdFx0XHRcdGRpZkRhdGEsIGJzLCBjbnB0LCBjbnB0TG9va3VwLCBtcHQ7XG5cdFx0XHRwdCA9IGNzc3AuX2NsYXNzTmFtZVBUID0gbmV3IENTU1Byb3BUd2Vlbih0LCBwLCAwLCAwLCBwdCwgMik7XG5cdFx0XHRwdC5zZXRSYXRpbyA9IF9zZXRDbGFzc05hbWVSYXRpbztcblx0XHRcdHB0LnByID0gLTExO1xuXHRcdFx0X2hhc1ByaW9yaXR5ID0gdHJ1ZTtcblx0XHRcdHB0LmIgPSBiO1xuXHRcdFx0YnMgPSBfZ2V0QWxsU3R5bGVzKHQsIF9jcyk7XG5cdFx0XHQvL2lmIHRoZXJlJ3MgYSBjbGFzc05hbWUgdHdlZW4gYWxyZWFkeSBvcGVyYXRpbmcgb24gdGhlIHRhcmdldCwgZm9yY2UgaXQgdG8gaXRzIGVuZCBzbyB0aGF0IHRoZSBuZWNlc3NhcnkgaW5saW5lIHN0eWxlcyBhcmUgcmVtb3ZlZCBhbmQgdGhlIGNsYXNzIG5hbWUgaXMgYXBwbGllZCBiZWZvcmUgd2UgZGV0ZXJtaW5lIHRoZSBlbmQgc3RhdGUgKHdlIGRvbid0IHdhbnQgaW5saW5lIHN0eWxlcyBpbnRlcmZlcmluZyB0aGF0IHdlcmUgdGhlcmUganVzdCBmb3IgY2xhc3Mtc3BlY2lmaWMgdmFsdWVzKVxuXHRcdFx0Y25wdCA9IHQuX2dzQ2xhc3NQVDtcblx0XHRcdGlmIChjbnB0KSB7XG5cdFx0XHRcdGNucHRMb29rdXAgPSB7fTtcblx0XHRcdFx0bXB0ID0gY25wdC5kYXRhOyAvL2ZpcnN0IE1pbmlQcm9wVHdlZW4gd2hpY2ggc3RvcmVzIHRoZSBpbmxpbmUgc3R5bGVzIC0gd2UgbmVlZCB0byBmb3JjZSB0aGVzZSBzbyB0aGF0IHRoZSBpbmxpbmUgc3R5bGVzIGRvbid0IGNvbnRhbWluYXRlIHRoaW5ncy4gT3RoZXJ3aXNlLCB0aGVyZSdzIGEgc21hbGwgY2hhbmNlIHRoYXQgYSB0d2VlbiBjb3VsZCBzdGFydCBhbmQgdGhlIGlubGluZSB2YWx1ZXMgbWF0Y2ggdGhlIGRlc3RpbmF0aW9uIHZhbHVlcyBhbmQgdGhleSBuZXZlciBnZXQgY2xlYW5lZC5cblx0XHRcdFx0d2hpbGUgKG1wdCkge1xuXHRcdFx0XHRcdGNucHRMb29rdXBbbXB0LnBdID0gMTtcblx0XHRcdFx0XHRtcHQgPSBtcHQuX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y25wdC5zZXRSYXRpbygxKTtcblx0XHRcdH1cblx0XHRcdHQuX2dzQ2xhc3NQVCA9IHB0O1xuXHRcdFx0cHQuZSA9IChlLmNoYXJBdCgxKSAhPT0gXCI9XCIpID8gZSA6IGIucmVwbGFjZShuZXcgUmVnRXhwKFwiKD86XFxcXHN8XilcIiArIGUuc3Vic3RyKDIpICsgXCIoPyFbXFxcXHctXSlcIiksIFwiXCIpICsgKChlLmNoYXJBdCgwKSA9PT0gXCIrXCIpID8gXCIgXCIgKyBlLnN1YnN0cigyKSA6IFwiXCIpO1xuXHRcdFx0dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBwdC5lKTtcblx0XHRcdGRpZkRhdGEgPSBfY3NzRGlmKHQsIGJzLCBfZ2V0QWxsU3R5bGVzKHQpLCB2YXJzLCBjbnB0TG9va3VwKTtcblx0XHRcdHQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgYik7XG5cdFx0XHRwdC5kYXRhID0gZGlmRGF0YS5maXJzdE1QVDtcblx0XHRcdHQuc3R5bGUuY3NzVGV4dCA9IGNzc1RleHQ7IC8vd2UgcmVjb3JkZWQgY3NzVGV4dCBiZWZvcmUgd2Ugc3dhcHBlZCBjbGFzc2VzIGFuZCByYW4gX2dldEFsbFN0eWxlcygpIGJlY2F1c2UgaW4gY2FzZXMgd2hlbiBhIGNsYXNzTmFtZSB0d2VlbiBpcyBvdmVyd3JpdHRlbiwgd2UgcmVtb3ZlIGFsbCB0aGUgcmVsYXRlZCB0d2VlbmluZyBwcm9wZXJ0aWVzIGZyb20gdGhhdCBjbGFzcyBjaGFuZ2UgKG90aGVyd2lzZSBjbGFzcy1zcGVjaWZpYyBzdHVmZiBjYW4ndCBvdmVycmlkZSBwcm9wZXJ0aWVzIHdlJ3ZlIGRpcmVjdGx5IHNldCBvbiB0aGUgdGFyZ2V0J3Mgc3R5bGUgb2JqZWN0IGR1ZSB0byBzcGVjaWZpY2l0eSkuXG5cdFx0XHRwdCA9IHB0LnhmaXJzdCA9IGNzc3AucGFyc2UodCwgZGlmRGF0YS5kaWZzLCBwdCwgcGx1Z2luKTsgLy93ZSByZWNvcmQgdGhlIENTU1Byb3BUd2VlbiBhcyB0aGUgeGZpcnN0IHNvIHRoYXQgd2UgY2FuIGhhbmRsZSBvdmVyd3JpdGluZyBwcm9wZXJ0bHkgKGlmIFwiY2xhc3NOYW1lXCIgZ2V0cyBvdmVyd3JpdHRlbiwgd2UgbXVzdCBraWxsIGFsbCB0aGUgcHJvcGVydGllcyBhc3NvY2lhdGVkIHdpdGggdGhlIGNsYXNzTmFtZSBwYXJ0IG9mIHRoZSB0d2Vlbiwgc28gd2UgY2FuIGxvb3AgdGhyb3VnaCBmcm9tIHhmaXJzdCB0byB0aGUgcHQgaXRzZWxmKVxuXHRcdFx0cmV0dXJuIHB0O1xuXHRcdH19KTtcblxuXG5cdFx0dmFyIF9zZXRDbGVhclByb3BzUmF0aW8gPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRpZiAodiA9PT0gMSB8fCB2ID09PSAwKSBpZiAodGhpcy5kYXRhLl90b3RhbFRpbWUgPT09IHRoaXMuZGF0YS5fdG90YWxEdXJhdGlvbiAmJiB0aGlzLmRhdGEuZGF0YSAhPT0gXCJpc0Zyb21TdGFydFwiKSB7IC8vdGhpcy5kYXRhIHJlZmVycyB0byB0aGUgdHdlZW4uIE9ubHkgY2xlYXIgYXQgdGhlIEVORCBvZiB0aGUgdHdlZW4gKHJlbWVtYmVyLCBmcm9tKCkgdHdlZW5zIG1ha2UgdGhlIHJhdGlvIGdvIGZyb20gMSB0byAwLCBzbyB3ZSBjYW4ndCBqdXN0IGNoZWNrIHRoYXQgYW5kIGlmIHRoZSB0d2VlbiBpcyB0aGUgemVyby1kdXJhdGlvbiBvbmUgdGhhdCdzIGNyZWF0ZWQgaW50ZXJuYWxseSB0byByZW5kZXIgdGhlIHN0YXJ0aW5nIHZhbHVlcyBpbiBhIGZyb20oKSB0d2VlbiwgaWdub3JlIHRoYXQgYmVjYXVzZSBvdGhlcndpc2UsIGZvciBleGFtcGxlLCBmcm9tKC4uLntoZWlnaHQ6MTAwLCBjbGVhclByb3BzOlwiaGVpZ2h0XCIsIGRlbGF5OjF9KSB3b3VsZCB3aXBlIHRoZSBoZWlnaHQgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgdHdlZW4gYW5kIGFmdGVyIDEgc2Vjb25kLCBpdCdkIGtpY2sgYmFjayBpbikuXG5cdFx0XHRcdHZhciBzID0gdGhpcy50LnN0eWxlLFxuXHRcdFx0XHRcdHRyYW5zZm9ybVBhcnNlID0gX3NwZWNpYWxQcm9wcy50cmFuc2Zvcm0ucGFyc2UsXG5cdFx0XHRcdFx0YSwgcCwgaSwgY2xlYXJUcmFuc2Zvcm0sIHRyYW5zZm9ybTtcblx0XHRcdFx0aWYgKHRoaXMuZSA9PT0gXCJhbGxcIikge1xuXHRcdFx0XHRcdHMuY3NzVGV4dCA9IFwiXCI7XG5cdFx0XHRcdFx0Y2xlYXJUcmFuc2Zvcm0gPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGEgPSB0aGlzLmUuc3BsaXQoXCIgXCIpLmpvaW4oXCJcIikuc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHRcdGkgPSBhLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdHAgPSBhW2ldO1xuXHRcdFx0XHRcdFx0aWYgKF9zcGVjaWFsUHJvcHNbcF0pIHtcblx0XHRcdFx0XHRcdFx0aWYgKF9zcGVjaWFsUHJvcHNbcF0ucGFyc2UgPT09IHRyYW5zZm9ybVBhcnNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2xlYXJUcmFuc2Zvcm0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHAgPSAocCA9PT0gXCJ0cmFuc2Zvcm1PcmlnaW5cIikgPyBfdHJhbnNmb3JtT3JpZ2luUHJvcCA6IF9zcGVjaWFsUHJvcHNbcF0ucDsgLy9lbnN1cmVzIHRoYXQgc3BlY2lhbCBwcm9wZXJ0aWVzIHVzZSB0aGUgcHJvcGVyIGJyb3dzZXItc3BlY2lmaWMgcHJvcGVydHkgbmFtZSwgbGlrZSBcInNjYWxlWFwiIG1pZ2h0IGJlIFwiLXdlYmtpdC10cmFuc2Zvcm1cIiBvciBcImJveFNoYWRvd1wiIG1pZ2h0IGJlIFwiLW1vei1ib3gtc2hhZG93XCJcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0X3JlbW92ZVByb3AocywgcCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjbGVhclRyYW5zZm9ybSkge1xuXHRcdFx0XHRcdF9yZW1vdmVQcm9wKHMsIF90cmFuc2Zvcm1Qcm9wKTtcblx0XHRcdFx0XHR0cmFuc2Zvcm0gPSB0aGlzLnQuX2dzVHJhbnNmb3JtO1xuXHRcdFx0XHRcdGlmICh0cmFuc2Zvcm0pIHtcblx0XHRcdFx0XHRcdGlmICh0cmFuc2Zvcm0uc3ZnKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMudC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLXN2Zy1vcmlnaW5cIik7XG5cdFx0XHRcdFx0XHRcdHRoaXMudC5yZW1vdmVBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRkZWxldGUgdGhpcy50Ll9nc1RyYW5zZm9ybTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH07XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiY2xlYXJQcm9wc1wiLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0KSB7XG5cdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4odCwgcCwgMCwgMCwgcHQsIDIpO1xuXHRcdFx0cHQuc2V0UmF0aW8gPSBfc2V0Q2xlYXJQcm9wc1JhdGlvO1xuXHRcdFx0cHQuZSA9IGU7XG5cdFx0XHRwdC5wciA9IC0xMDtcblx0XHRcdHB0LmRhdGEgPSBjc3NwLl90d2Vlbjtcblx0XHRcdF9oYXNQcmlvcml0eSA9IHRydWU7XG5cdFx0XHRyZXR1cm4gcHQ7XG5cdFx0fX0pO1xuXG5cdFx0cCA9IFwiYmV6aWVyLHRocm93UHJvcHMscGh5c2ljc1Byb3BzLHBoeXNpY3MyRFwiLnNwbGl0KFwiLFwiKTtcblx0XHRpID0gcC5sZW5ndGg7XG5cdFx0d2hpbGUgKGktLSkge1xuXHRcdFx0X3JlZ2lzdGVyUGx1Z2luUHJvcChwW2ldKTtcblx0XHR9XG5cblxuXG5cblxuXG5cblxuXHRcdHAgPSBDU1NQbHVnaW4ucHJvdG90eXBlO1xuXHRcdHAuX2ZpcnN0UFQgPSBwLl9sYXN0UGFyc2VkVHJhbnNmb3JtID0gcC5fdHJhbnNmb3JtID0gbnVsbDtcblxuXHRcdC8vZ2V0cyBjYWxsZWQgd2hlbiB0aGUgdHdlZW4gcmVuZGVycyBmb3IgdGhlIGZpcnN0IHRpbWUuIFRoaXMga2lja3MgZXZlcnl0aGluZyBvZmYsIHJlY29yZGluZyBzdGFydC9lbmQgdmFsdWVzLCBldGMuXG5cdFx0cC5fb25Jbml0VHdlZW4gPSBmdW5jdGlvbih0YXJnZXQsIHZhcnMsIHR3ZWVuLCBpbmRleCkge1xuXHRcdFx0aWYgKCF0YXJnZXQubm9kZVR5cGUpIHsgLy9jc3MgaXMgb25seSBmb3IgZG9tIGVsZW1lbnRzXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3RhcmdldCA9IF90YXJnZXQgPSB0YXJnZXQ7XG5cdFx0XHR0aGlzLl90d2VlbiA9IHR3ZWVuO1xuXHRcdFx0dGhpcy5fdmFycyA9IHZhcnM7XG5cdFx0XHRfaW5kZXggPSBpbmRleDtcblx0XHRcdF9hdXRvUm91bmQgPSB2YXJzLmF1dG9Sb3VuZDtcblx0XHRcdF9oYXNQcmlvcml0eSA9IGZhbHNlO1xuXHRcdFx0X3N1ZmZpeE1hcCA9IHZhcnMuc3VmZml4TWFwIHx8IENTU1BsdWdpbi5zdWZmaXhNYXA7XG5cdFx0XHRfY3MgPSBfZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXQsIFwiXCIpO1xuXHRcdFx0X292ZXJ3cml0ZVByb3BzID0gdGhpcy5fb3ZlcndyaXRlUHJvcHM7XG5cdFx0XHR2YXIgc3R5bGUgPSB0YXJnZXQuc3R5bGUsXG5cdFx0XHRcdHYsIHB0LCBwdDIsIGZpcnN0LCBsYXN0LCBuZXh0LCB6SW5kZXgsIHRwdCwgdGhyZWVEO1xuXHRcdFx0aWYgKF9yZXFTYWZhcmlGaXgpIGlmIChzdHlsZS56SW5kZXggPT09IFwiXCIpIHtcblx0XHRcdFx0diA9IF9nZXRTdHlsZSh0YXJnZXQsIFwiekluZGV4XCIsIF9jcyk7XG5cdFx0XHRcdGlmICh2ID09PSBcImF1dG9cIiB8fCB2ID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0Ly9jb3JyZWN0cyBhIGJ1ZyBpbiBbbm9uLUFuZHJvaWRdIFNhZmFyaSB0aGF0IHByZXZlbnRzIGl0IGZyb20gcmVwYWludGluZyBlbGVtZW50cyBpbiB0aGVpciBuZXcgcG9zaXRpb25zIGlmIHRoZXkgZG9uJ3QgaGF2ZSBhIHpJbmRleCBzZXQuIFdlIGFsc28gY2FuJ3QganVzdCBhcHBseSB0aGlzIGluc2lkZSBfcGFyc2VUcmFuc2Zvcm0oKSBiZWNhdXNlIGFueXRoaW5nIHRoYXQncyBtb3ZlZCBpbiBhbnkgd2F5IChsaWtlIHVzaW5nIFwibGVmdFwiIG9yIFwidG9wXCIgaW5zdGVhZCBvZiB0cmFuc2Zvcm1zIGxpa2UgXCJ4XCIgYW5kIFwieVwiKSBjYW4gYmUgYWZmZWN0ZWQsIHNvIGl0IGlzIGJlc3QgdG8gZW5zdXJlIHRoYXQgYW55dGhpbmcgdGhhdCdzIHR3ZWVuaW5nIGhhcyBhIHotaW5kZXguIFNldHRpbmcgXCJXZWJraXRQZXJzcGVjdGl2ZVwiIHRvIGEgbm9uLXplcm8gdmFsdWUgd29ya2VkIHRvbyBleGNlcHQgdGhhdCBvbiBpT1MgU2FmYXJpIHRoaW5ncyB3b3VsZCBmbGlja2VyIHJhbmRvbWx5LiBQbHVzIHpJbmRleCBpcyBsZXNzIG1lbW9yeS1pbnRlbnNpdmUuXG5cdFx0XHRcdFx0dGhpcy5fYWRkTGF6eVNldChzdHlsZSwgXCJ6SW5kZXhcIiwgMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGVvZih2YXJzKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRmaXJzdCA9IHN0eWxlLmNzc1RleHQ7XG5cdFx0XHRcdHYgPSBfZ2V0QWxsU3R5bGVzKHRhcmdldCwgX2NzKTtcblx0XHRcdFx0c3R5bGUuY3NzVGV4dCA9IGZpcnN0ICsgXCI7XCIgKyB2YXJzO1xuXHRcdFx0XHR2ID0gX2Nzc0RpZih0YXJnZXQsIHYsIF9nZXRBbGxTdHlsZXModGFyZ2V0KSkuZGlmcztcblx0XHRcdFx0aWYgKCFfc3VwcG9ydHNPcGFjaXR5ICYmIF9vcGFjaXR5VmFsRXhwLnRlc3QodmFycykpIHtcblx0XHRcdFx0XHR2Lm9wYWNpdHkgPSBwYXJzZUZsb2F0KCBSZWdFeHAuJDEgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXJzID0gdjtcblx0XHRcdFx0c3R5bGUuY3NzVGV4dCA9IGZpcnN0O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodmFycy5jbGFzc05hbWUpIHsgLy9jbGFzc05hbWUgdHdlZW5zIHdpbGwgY29tYmluZSBhbnkgZGlmZmVyZW5jZXMgdGhleSBmaW5kIGluIHRoZSBjc3Mgd2l0aCB0aGUgdmFycyB0aGF0IGFyZSBwYXNzZWQgaW4sIHNvIHtjbGFzc05hbWU6XCJteUNsYXNzXCIsIHNjYWxlOjAuNSwgbGVmdDoyMH0gd291bGQgd29yay5cblx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IHB0ID0gX3NwZWNpYWxQcm9wcy5jbGFzc05hbWUucGFyc2UodGFyZ2V0LCB2YXJzLmNsYXNzTmFtZSwgXCJjbGFzc05hbWVcIiwgdGhpcywgbnVsbCwgbnVsbCwgdmFycyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9maXJzdFBUID0gcHQgPSB0aGlzLnBhcnNlKHRhcmdldCwgdmFycywgbnVsbCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl90cmFuc2Zvcm1UeXBlKSB7XG5cdFx0XHRcdHRocmVlRCA9ICh0aGlzLl90cmFuc2Zvcm1UeXBlID09PSAzKTtcblx0XHRcdFx0aWYgKCFfdHJhbnNmb3JtUHJvcCkge1xuXHRcdFx0XHRcdHN0eWxlLnpvb20gPSAxOyAvL2hlbHBzIGNvcnJlY3QgYW4gSUUgaXNzdWUuXG5cdFx0XHRcdH0gZWxzZSBpZiAoX2lzU2FmYXJpKSB7XG5cdFx0XHRcdFx0X3JlcVNhZmFyaUZpeCA9IHRydWU7XG5cdFx0XHRcdFx0Ly9pZiB6SW5kZXggaXNuJ3Qgc2V0LCBpT1MgU2FmYXJpIGRvZXNuJ3QgcmVwYWludCB0aGluZ3MgY29ycmVjdGx5IHNvbWV0aW1lcyAoc2VlbWluZ2x5IGF0IHJhbmRvbSkuXG5cdFx0XHRcdFx0aWYgKHN0eWxlLnpJbmRleCA9PT0gXCJcIikge1xuXHRcdFx0XHRcdFx0ekluZGV4ID0gX2dldFN0eWxlKHRhcmdldCwgXCJ6SW5kZXhcIiwgX2NzKTtcblx0XHRcdFx0XHRcdGlmICh6SW5kZXggPT09IFwiYXV0b1wiIHx8IHpJbmRleCA9PT0gXCJcIikge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9hZGRMYXp5U2V0KHN0eWxlLCBcInpJbmRleFwiLCAwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9TZXR0aW5nIFdlYmtpdEJhY2tmYWNlVmlzaWJpbGl0eSBjb3JyZWN0cyAzIGJ1Z3M6XG5cdFx0XHRcdFx0Ly8gMSkgW25vbi1BbmRyb2lkXSBTYWZhcmkgc2tpcHMgcmVuZGVyaW5nIGNoYW5nZXMgdG8gXCJ0b3BcIiBhbmQgXCJsZWZ0XCIgdGhhdCBhcmUgbWFkZSBvbiB0aGUgc2FtZSBmcmFtZS9yZW5kZXIgYXMgYSB0cmFuc2Zvcm0gdXBkYXRlLlxuXHRcdFx0XHRcdC8vIDIpIGlPUyBTYWZhcmkgc29tZXRpbWVzIG5lZ2xlY3RzIHRvIHJlcGFpbnQgZWxlbWVudHMgaW4gdGhlaXIgbmV3IHBvc2l0aW9ucy4gU2V0dGluZyBcIldlYmtpdFBlcnNwZWN0aXZlXCIgdG8gYSBub24temVybyB2YWx1ZSB3b3JrZWQgdG9vIGV4Y2VwdCB0aGF0IG9uIGlPUyBTYWZhcmkgdGhpbmdzIHdvdWxkIGZsaWNrZXIgcmFuZG9tbHkuXG5cdFx0XHRcdFx0Ly8gMykgU2FmYXJpIHNvbWV0aW1lcyBkaXNwbGF5ZWQgb2RkIGFydGlmYWN0cyB3aGVuIHR3ZWVuaW5nIHRoZSB0cmFuc2Zvcm0gKG9yIFdlYmtpdFRyYW5zZm9ybSkgcHJvcGVydHksIGxpa2UgZ2hvc3RzIG9mIHRoZSBlZGdlcyBvZiB0aGUgZWxlbWVudCByZW1haW5lZC4gRGVmaW5pdGVseSBhIGJyb3dzZXIgYnVnLlxuXHRcdFx0XHRcdC8vTm90ZTogd2UgYWxsb3cgdGhlIHVzZXIgdG8gb3ZlcnJpZGUgdGhlIGF1dG8tc2V0dGluZyBieSBkZWZpbmluZyBXZWJraXRCYWNrZmFjZVZpc2liaWxpdHkgaW4gdGhlIHZhcnMgb2YgdGhlIHR3ZWVuLlxuXHRcdFx0XHRcdGlmIChfaXNTYWZhcmlMVDYpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2FkZExhenlTZXQoc3R5bGUsIFwiV2Via2l0QmFja2ZhY2VWaXNpYmlsaXR5XCIsIHRoaXMuX3ZhcnMuV2Via2l0QmFja2ZhY2VWaXNpYmlsaXR5IHx8ICh0aHJlZUQgPyBcInZpc2libGVcIiA6IFwiaGlkZGVuXCIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQyID0gcHQ7XG5cdFx0XHRcdHdoaWxlIChwdDIgJiYgcHQyLl9uZXh0KSB7XG5cdFx0XHRcdFx0cHQyID0gcHQyLl9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4odGFyZ2V0LCBcInRyYW5zZm9ybVwiLCAwLCAwLCBudWxsLCAyKTtcblx0XHRcdFx0dGhpcy5fbGlua0NTU1AodHB0LCBudWxsLCBwdDIpO1xuXHRcdFx0XHR0cHQuc2V0UmF0aW8gPSBfdHJhbnNmb3JtUHJvcCA/IF9zZXRUcmFuc2Zvcm1SYXRpbyA6IF9zZXRJRVRyYW5zZm9ybVJhdGlvO1xuXHRcdFx0XHR0cHQuZGF0YSA9IHRoaXMuX3RyYW5zZm9ybSB8fCBfZ2V0VHJhbnNmb3JtKHRhcmdldCwgX2NzLCB0cnVlKTtcblx0XHRcdFx0dHB0LnR3ZWVuID0gdHdlZW47XG5cdFx0XHRcdHRwdC5wciA9IC0xOyAvL2Vuc3VyZXMgdGhhdCB0aGUgdHJhbnNmb3JtcyBnZXQgYXBwbGllZCBhZnRlciB0aGUgY29tcG9uZW50cyBhcmUgdXBkYXRlZC5cblx0XHRcdFx0X292ZXJ3cml0ZVByb3BzLnBvcCgpOyAvL3dlIGRvbid0IHdhbnQgdG8gZm9yY2UgdGhlIG92ZXJ3cml0ZSBvZiBhbGwgXCJ0cmFuc2Zvcm1cIiB0d2VlbnMgb2YgdGhlIHRhcmdldCAtIHdlIG9ubHkgY2FyZSBhYm91dCBpbmRpdmlkdWFsIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIGxpa2Ugc2NhbGVYLCByb3RhdGlvbiwgZXRjLiBUaGUgQ1NTUHJvcFR3ZWVuIGNvbnN0cnVjdG9yIGF1dG9tYXRpY2FsbHkgYWRkcyB0aGUgcHJvcGVydHkgdG8gX292ZXJ3cml0ZVByb3BzIHdoaWNoIGlzIHdoeSB3ZSBuZWVkIHRvIHBvcCgpIGhlcmUuXG5cdFx0XHR9XG5cblx0XHRcdGlmIChfaGFzUHJpb3JpdHkpIHtcblx0XHRcdFx0Ly9yZW9yZGVycyB0aGUgbGlua2VkIGxpc3QgaW4gb3JkZXIgb2YgcHIgKHByaW9yaXR5KVxuXHRcdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0XHRuZXh0ID0gcHQuX25leHQ7XG5cdFx0XHRcdFx0cHQyID0gZmlyc3Q7XG5cdFx0XHRcdFx0d2hpbGUgKHB0MiAmJiBwdDIucHIgPiBwdC5wcikge1xuXHRcdFx0XHRcdFx0cHQyID0gcHQyLl9uZXh0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoKHB0Ll9wcmV2ID0gcHQyID8gcHQyLl9wcmV2IDogbGFzdCkpIHtcblx0XHRcdFx0XHRcdHB0Ll9wcmV2Ll9uZXh0ID0gcHQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGZpcnN0ID0gcHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgocHQuX25leHQgPSBwdDIpKSB7XG5cdFx0XHRcdFx0XHRwdDIuX3ByZXYgPSBwdDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGFzdCA9IHB0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IG5leHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IGZpcnN0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fTtcblxuXG5cdFx0cC5wYXJzZSA9IGZ1bmN0aW9uKHRhcmdldCwgdmFycywgcHQsIHBsdWdpbikge1xuXHRcdFx0dmFyIHN0eWxlID0gdGFyZ2V0LnN0eWxlLFxuXHRcdFx0XHRwLCBzcCwgYm4sIGVuLCBicywgZXMsIGJzZngsIGVzZngsIGlzU3RyLCByZWw7XG5cdFx0XHRmb3IgKHAgaW4gdmFycykge1xuXHRcdFx0XHRlcyA9IHZhcnNbcF07IC8vZW5kaW5nIHZhbHVlIHN0cmluZ1xuXHRcdFx0XHRpZiAodHlwZW9mKGVzKSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0ZXMgPSBlcyhfaW5kZXgsIF90YXJnZXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNwID0gX3NwZWNpYWxQcm9wc1twXTsgLy9TcGVjaWFsUHJvcCBsb29rdXAuXG5cdFx0XHRcdGlmIChzcCkge1xuXHRcdFx0XHRcdHB0ID0gc3AucGFyc2UodGFyZ2V0LCBlcywgcCwgdGhpcywgcHQsIHBsdWdpbiwgdmFycyk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRicyA9IF9nZXRTdHlsZSh0YXJnZXQsIHAsIF9jcykgKyBcIlwiO1xuXHRcdFx0XHRcdGlzU3RyID0gKHR5cGVvZihlcykgPT09IFwic3RyaW5nXCIpO1xuXHRcdFx0XHRcdGlmIChwID09PSBcImNvbG9yXCIgfHwgcCA9PT0gXCJmaWxsXCIgfHwgcCA9PT0gXCJzdHJva2VcIiB8fCBwLmluZGV4T2YoXCJDb2xvclwiKSAhPT0gLTEgfHwgKGlzU3RyICYmIF9yZ2Joc2xFeHAudGVzdChlcykpKSB7IC8vT3BlcmEgdXNlcyBiYWNrZ3JvdW5kOiB0byBkZWZpbmUgY29sb3Igc29tZXRpbWVzIGluIGFkZGl0aW9uIHRvIGJhY2tncm91bmRDb2xvcjpcblx0XHRcdFx0XHRcdGlmICghaXNTdHIpIHtcblx0XHRcdFx0XHRcdFx0ZXMgPSBfcGFyc2VDb2xvcihlcyk7XG5cdFx0XHRcdFx0XHRcdGVzID0gKChlcy5sZW5ndGggPiAzKSA/IFwicmdiYShcIiA6IFwicmdiKFwiKSArIGVzLmpvaW4oXCIsXCIpICsgXCIpXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRwdCA9IF9wYXJzZUNvbXBsZXgoc3R5bGUsIHAsIGJzLCBlcywgdHJ1ZSwgXCJ0cmFuc3BhcmVudFwiLCBwdCwgMCwgcGx1Z2luKTtcblxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoaXNTdHIgJiYgX2NvbXBsZXhFeHAudGVzdChlcykpIHtcblx0XHRcdFx0XHRcdHB0ID0gX3BhcnNlQ29tcGxleChzdHlsZSwgcCwgYnMsIGVzLCB0cnVlLCBudWxsLCBwdCwgMCwgcGx1Z2luKTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRibiA9IHBhcnNlRmxvYXQoYnMpO1xuXHRcdFx0XHRcdFx0YnNmeCA9IChibiB8fCBibiA9PT0gMCkgPyBicy5zdWJzdHIoKGJuICsgXCJcIikubGVuZ3RoKSA6IFwiXCI7IC8vcmVtZW1iZXIsIGJzIGNvdWxkIGJlIG5vbi1udW1lcmljIGxpa2UgXCJub3JtYWxcIiBmb3IgZm9udFdlaWdodCwgc28gd2Ugc2hvdWxkIGRlZmF1bHQgdG8gYSBibGFuayBzdWZmaXggaW4gdGhhdCBjYXNlLlxuXG5cdFx0XHRcdFx0XHRpZiAoYnMgPT09IFwiXCIgfHwgYnMgPT09IFwiYXV0b1wiKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChwID09PSBcIndpZHRoXCIgfHwgcCA9PT0gXCJoZWlnaHRcIikge1xuXHRcdFx0XHRcdFx0XHRcdGJuID0gX2dldERpbWVuc2lvbih0YXJnZXQsIHAsIF9jcyk7XG5cdFx0XHRcdFx0XHRcdFx0YnNmeCA9IFwicHhcIjtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChwID09PSBcImxlZnRcIiB8fCBwID09PSBcInRvcFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ym4gPSBfY2FsY3VsYXRlT2Zmc2V0KHRhcmdldCwgcCwgX2NzKTtcblx0XHRcdFx0XHRcdFx0XHRic2Z4ID0gXCJweFwiO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGJuID0gKHAgIT09IFwib3BhY2l0eVwiKSA/IDAgOiAxO1xuXHRcdFx0XHRcdFx0XHRcdGJzZnggPSBcIlwiO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJlbCA9IChpc1N0ciAmJiBlcy5jaGFyQXQoMSkgPT09IFwiPVwiKTtcblx0XHRcdFx0XHRcdGlmIChyZWwpIHtcblx0XHRcdFx0XHRcdFx0ZW4gPSBwYXJzZUludChlcy5jaGFyQXQoMCkgKyBcIjFcIiwgMTApO1xuXHRcdFx0XHRcdFx0XHRlcyA9IGVzLnN1YnN0cigyKTtcblx0XHRcdFx0XHRcdFx0ZW4gKj0gcGFyc2VGbG9hdChlcyk7XG5cdFx0XHRcdFx0XHRcdGVzZnggPSBlcy5yZXBsYWNlKF9zdWZmaXhFeHAsIFwiXCIpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0ZW4gPSBwYXJzZUZsb2F0KGVzKTtcblx0XHRcdFx0XHRcdFx0ZXNmeCA9IGlzU3RyID8gZXMucmVwbGFjZShfc3VmZml4RXhwLCBcIlwiKSA6IFwiXCI7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChlc2Z4ID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRcdGVzZnggPSAocCBpbiBfc3VmZml4TWFwKSA/IF9zdWZmaXhNYXBbcF0gOiBic2Z4OyAvL3BvcHVsYXRlIHRoZSBlbmQgc3VmZml4LCBwcmlvcml0aXppbmcgdGhlIG1hcCwgdGhlbiBpZiBub25lIGlzIGZvdW5kLCB1c2UgdGhlIGJlZ2lubmluZyBzdWZmaXguXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGVzID0gKGVuIHx8IGVuID09PSAwKSA/IChyZWwgPyBlbiArIGJuIDogZW4pICsgZXNmeCA6IHZhcnNbcF07IC8vZW5zdXJlcyB0aGF0IGFueSArPSBvciAtPSBwcmVmaXhlcyBhcmUgdGFrZW4gY2FyZSBvZi4gUmVjb3JkIHRoZSBlbmQgdmFsdWUgYmVmb3JlIG5vcm1hbGl6aW5nIHRoZSBzdWZmaXggYmVjYXVzZSB3ZSBhbHdheXMgd2FudCB0byBlbmQgdGhlIHR3ZWVuIG9uIGV4YWN0bHkgd2hhdCB0aGV5IGludGVuZGVkIGV2ZW4gaWYgaXQgZG9lc24ndCBtYXRjaCB0aGUgYmVnaW5uaW5nIHZhbHVlJ3Mgc3VmZml4LlxuXG5cdFx0XHRcdFx0XHQvL2lmIHRoZSBiZWdpbm5pbmcvZW5kaW5nIHN1ZmZpeGVzIGRvbid0IG1hdGNoLCBub3JtYWxpemUgdGhlbS4uLlxuXHRcdFx0XHRcdFx0aWYgKGJzZnggIT09IGVzZngpIGlmIChlc2Z4ICE9PSBcIlwiKSBpZiAoZW4gfHwgZW4gPT09IDApIGlmIChibikgeyAvL25vdGU6IGlmIHRoZSBiZWdpbm5pbmcgdmFsdWUgKGJuKSBpcyAwLCB3ZSBkb24ndCBuZWVkIHRvIGNvbnZlcnQgdW5pdHMhXG5cdFx0XHRcdFx0XHRcdGJuID0gX2NvbnZlcnRUb1BpeGVscyh0YXJnZXQsIHAsIGJuLCBic2Z4KTtcblx0XHRcdFx0XHRcdFx0aWYgKGVzZnggPT09IFwiJVwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ym4gLz0gX2NvbnZlcnRUb1BpeGVscyh0YXJnZXQsIHAsIDEwMCwgXCIlXCIpIC8gMTAwO1xuXHRcdFx0XHRcdFx0XHRcdGlmICh2YXJzLnN0cmljdFVuaXRzICE9PSB0cnVlKSB7IC8vc29tZSBicm93c2VycyByZXBvcnQgb25seSBcInB4XCIgdmFsdWVzIGluc3RlYWQgb2YgYWxsb3dpbmcgXCIlXCIgd2l0aCBnZXRDb21wdXRlZFN0eWxlKCksIHNvIHdlIGFzc3VtZSB0aGF0IGlmIHdlJ3JlIHR3ZWVuaW5nIHRvIGEgJSwgd2Ugc2hvdWxkIHN0YXJ0IHRoZXJlIHRvbyB1bmxlc3Mgc3RyaWN0VW5pdHM6dHJ1ZSBpcyBkZWZpbmVkLiBUaGlzIGFwcHJvYWNoIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHJlc3BvbnNpdmUgZGVzaWducyB0aGF0IHVzZSBmcm9tKCkgdHdlZW5zLlxuXHRcdFx0XHRcdFx0XHRcdFx0YnMgPSBibiArIFwiJVwiO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGVzZnggPT09IFwiZW1cIiB8fCBlc2Z4ID09PSBcInJlbVwiIHx8IGVzZnggPT09IFwidndcIiB8fCBlc2Z4ID09PSBcInZoXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRibiAvPSBfY29udmVydFRvUGl4ZWxzKHRhcmdldCwgcCwgMSwgZXNmeCk7XG5cblx0XHRcdFx0XHRcdFx0Ly9vdGhlcndpc2UgY29udmVydCB0byBwaXhlbHMuXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZXNmeCAhPT0gXCJweFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZW4gPSBfY29udmVydFRvUGl4ZWxzKHRhcmdldCwgcCwgZW4sIGVzZngpO1xuXHRcdFx0XHRcdFx0XHRcdGVzZnggPSBcInB4XCI7IC8vd2UgZG9uJ3QgdXNlIGJzZnggYWZ0ZXIgdGhpcywgc28gd2UgZG9uJ3QgbmVlZCB0byBzZXQgaXQgdG8gcHggdG9vLlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChyZWwpIGlmIChlbiB8fCBlbiA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdGVzID0gKGVuICsgYm4pICsgZXNmeDsgLy90aGUgY2hhbmdlcyB3ZSBtYWRlIGFmZmVjdCByZWxhdGl2ZSBjYWxjdWxhdGlvbnMsIHNvIGFkanVzdCB0aGUgZW5kIHZhbHVlIGhlcmUuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHJlbCkge1xuXHRcdFx0XHRcdFx0XHRlbiArPSBibjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKChibiB8fCBibiA9PT0gMCkgJiYgKGVuIHx8IGVuID09PSAwKSkgeyAvL2Zhc3RlciB0aGFuIGlzTmFOKCkuIEFsc28sIHByZXZpb3VzbHkgd2UgcmVxdWlyZWQgZW4gIT09IGJuIGJ1dCB0aGF0IGRvZXNuJ3QgcmVhbGx5IGdhaW4gbXVjaCBwZXJmb3JtYW5jZSBhbmQgaXQgcHJldmVudHMgX3BhcnNlVG9Qcm94eSgpIGZyb20gd29ya2luZyBwcm9wZXJseSBpZiBiZWdpbm5pbmcgYW5kIGVuZGluZyB2YWx1ZXMgbWF0Y2ggYnV0IG5lZWQgdG8gZ2V0IHR3ZWVuZWQgYnkgYW4gZXh0ZXJuYWwgcGx1Z2luIGFueXdheS4gRm9yIGV4YW1wbGUsIGEgYmV6aWVyIHR3ZWVuIHdoZXJlIHRoZSB0YXJnZXQgc3RhcnRzIGF0IGxlZnQ6MCBhbmQgaGFzIHRoZXNlIHBvaW50czogW3tsZWZ0OjUwfSx7bGVmdDowfV0gd291bGRuJ3Qgd29yayBwcm9wZXJseSBiZWNhdXNlIHdoZW4gcGFyc2luZyB0aGUgbGFzdCBwb2ludCwgaXQnZCBtYXRjaCB0aGUgZmlyc3QgKGN1cnJlbnQpIG9uZSBhbmQgYSBub24tdHdlZW5pbmcgQ1NTUHJvcFR3ZWVuIHdvdWxkIGJlIHJlY29yZGVkIHdoZW4gd2UgYWN0dWFsbHkgbmVlZCBhIG5vcm1hbCB0d2VlbiAodHlwZTowKSBzbyB0aGF0IHRoaW5ncyBnZXQgdXBkYXRlZCBkdXJpbmcgdGhlIHR3ZWVuIHByb3Blcmx5LlxuXHRcdFx0XHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4oc3R5bGUsIHAsIGJuLCBlbiAtIGJuLCBwdCwgMCwgcCwgKF9hdXRvUm91bmQgIT09IGZhbHNlICYmIChlc2Z4ID09PSBcInB4XCIgfHwgcCA9PT0gXCJ6SW5kZXhcIikpLCAwLCBicywgZXMpO1xuXHRcdFx0XHRcdFx0XHRwdC54czAgPSBlc2Z4O1xuXHRcdFx0XHRcdFx0XHQvL0RFQlVHOiBfbG9nKFwidHdlZW4gXCIrcCtcIiBmcm9tIFwiK3B0LmIrXCIgKFwiK2JuK2VzZngrXCIpIHRvIFwiK3B0LmUrXCIgd2l0aCBzdWZmaXg6IFwiK3B0LnhzMCk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0eWxlW3BdID09PSB1bmRlZmluZWQgfHwgIWVzICYmIChlcyArIFwiXCIgPT09IFwiTmFOXCIgfHwgZXMgPT0gbnVsbCkpIHtcblx0XHRcdFx0XHRcdFx0X2xvZyhcImludmFsaWQgXCIgKyBwICsgXCIgdHdlZW4gdmFsdWU6IFwiICsgdmFyc1twXSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4oc3R5bGUsIHAsIGVuIHx8IGJuIHx8IDAsIDAsIHB0LCAtMSwgcCwgZmFsc2UsIDAsIGJzLCBlcyk7XG5cdFx0XHRcdFx0XHRcdHB0LnhzMCA9IChlcyA9PT0gXCJub25lXCIgJiYgKHAgPT09IFwiZGlzcGxheVwiIHx8IHAuaW5kZXhPZihcIlN0eWxlXCIpICE9PSAtMSkpID8gYnMgOiBlczsgLy9pbnRlcm1lZGlhdGUgdmFsdWUgc2hvdWxkIHR5cGljYWxseSBiZSBzZXQgaW1tZWRpYXRlbHkgKGVuZCB2YWx1ZSkgZXhjZXB0IGZvciBcImRpc3BsYXlcIiBvciB0aGluZ3MgbGlrZSBib3JkZXJUb3BTdHlsZSwgYm9yZGVyQm90dG9tU3R5bGUsIGV0Yy4gd2hpY2ggc2hvdWxkIHVzZSB0aGUgYmVnaW5uaW5nIHZhbHVlIGR1cmluZyB0aGUgdHdlZW4uXG5cdFx0XHRcdFx0XHRcdC8vREVCVUc6IF9sb2coXCJub24tdHdlZW5pbmcgdmFsdWUgXCIrcCtcIjogXCIrcHQueHMwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBsdWdpbikgaWYgKHB0ICYmICFwdC5wbHVnaW4pIHtcblx0XHRcdFx0XHRwdC5wbHVnaW4gPSBwbHVnaW47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBwdDtcblx0XHR9O1xuXG5cblx0XHQvL2dldHMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHR3ZWVuIHVwZGF0ZXMsIHBhc3NpbmcgdGhlIG5ldyByYXRpbyAodHlwaWNhbGx5IGEgdmFsdWUgYmV0d2VlbiAwIGFuZCAxLCBidXQgbm90IGFsd2F5cyAoZm9yIGV4YW1wbGUsIGlmIGFuIEVsYXN0aWMuZWFzZU91dCBpcyB1c2VkLCB0aGUgdmFsdWUgY2FuIGp1bXAgYWJvdmUgMSBtaWQtdHdlZW4pLiBJdCB3aWxsIGFsd2F5cyBzdGFydCBhbmQgMCBhbmQgZW5kIGF0IDEuXG5cdFx0cC5zZXRSYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdHZhciBwdCA9IHRoaXMuX2ZpcnN0UFQsXG5cdFx0XHRcdG1pbiA9IDAuMDAwMDAxLFxuXHRcdFx0XHR2YWwsIHN0ciwgaTtcblx0XHRcdC8vYXQgdGhlIGVuZCBvZiB0aGUgdHdlZW4sIHdlIHNldCB0aGUgdmFsdWVzIHRvIGV4YWN0bHkgd2hhdCB3ZSByZWNlaXZlZCBpbiBvcmRlciB0byBtYWtlIHN1cmUgbm9uLXR3ZWVuaW5nIHZhbHVlcyAobGlrZSBcInBvc2l0aW9uXCIgb3IgXCJmbG9hdFwiIG9yIHdoYXRldmVyKSBhcmUgc2V0IGFuZCBzbyB0aGF0IGlmIHRoZSBiZWdpbm5pbmcvZW5kaW5nIHN1ZmZpeGVzICh1bml0cykgZGlkbid0IG1hdGNoIGFuZCB3ZSBub3JtYWxpemVkIHRvIHB4LCB0aGUgdmFsdWUgdGhhdCB0aGUgdXNlciBwYXNzZWQgaW4gaXMgdXNlZCBoZXJlLiBXZSBjaGVjayB0byBzZWUgaWYgdGhlIHR3ZWVuIGlzIGF0IGl0cyBiZWdpbm5pbmcgaW4gY2FzZSBpdCdzIGEgZnJvbSgpIHR3ZWVuIGluIHdoaWNoIGNhc2UgdGhlIHJhdGlvIHdpbGwgYWN0dWFsbHkgZ28gZnJvbSAxIHRvIDAgb3ZlciB0aGUgY291cnNlIG9mIHRoZSB0d2VlbiAoYmFja3dhcmRzKS5cblx0XHRcdGlmICh2ID09PSAxICYmICh0aGlzLl90d2Vlbi5fdGltZSA9PT0gdGhpcy5fdHdlZW4uX2R1cmF0aW9uIHx8IHRoaXMuX3R3ZWVuLl90aW1lID09PSAwKSkge1xuXHRcdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0XHRpZiAocHQudHlwZSAhPT0gMikge1xuXHRcdFx0XHRcdFx0aWYgKHB0LnIgJiYgcHQudHlwZSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0dmFsID0gTWF0aC5yb3VuZChwdC5zICsgcHQuYyk7XG5cdFx0XHRcdFx0XHRcdGlmICghcHQudHlwZSkge1xuXHRcdFx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSB2YWwgKyBwdC54czA7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAocHQudHlwZSA9PT0gMSkgeyAvL2NvbXBsZXggdmFsdWUgKG9uZSB0aGF0IHR5cGljYWxseSBoYXMgbXVsdGlwbGUgbnVtYmVycyBpbnNpZGUgYSBzdHJpbmcsIGxpa2UgXCJyZWN0KDVweCwxMHB4LDIwcHgsMjVweClcIlxuXHRcdFx0XHRcdFx0XHRcdGkgPSBwdC5sO1xuXHRcdFx0XHRcdFx0XHRcdHN0ciA9IHB0LnhzMCArIHZhbCArIHB0LnhzMTtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAxOyBpIDwgcHQubDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdHIgKz0gcHRbXCJ4blwiK2ldICsgcHRbXCJ4c1wiKyhpKzEpXTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHN0cjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LmU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHB0LnNldFJhdGlvKHYpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSBpZiAodiB8fCAhKHRoaXMuX3R3ZWVuLl90aW1lID09PSB0aGlzLl90d2Vlbi5fZHVyYXRpb24gfHwgdGhpcy5fdHdlZW4uX3RpbWUgPT09IDApIHx8IHRoaXMuX3R3ZWVuLl9yYXdQcmV2VGltZSA9PT0gLTAuMDAwMDAxKSB7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdHZhbCA9IHB0LmMgKiB2ICsgcHQucztcblx0XHRcdFx0XHRpZiAocHQucikge1xuXHRcdFx0XHRcdFx0dmFsID0gTWF0aC5yb3VuZCh2YWwpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodmFsIDwgbWluKSBpZiAodmFsID4gLW1pbikge1xuXHRcdFx0XHRcdFx0dmFsID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCFwdC50eXBlKSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gdmFsICsgcHQueHMwO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHQudHlwZSA9PT0gMSkgeyAvL2NvbXBsZXggdmFsdWUgKG9uZSB0aGF0IHR5cGljYWxseSBoYXMgbXVsdGlwbGUgbnVtYmVycyBpbnNpZGUgYSBzdHJpbmcsIGxpa2UgXCJyZWN0KDVweCwxMHB4LDIwcHgsMjVweClcIlxuXHRcdFx0XHRcdFx0aSA9IHB0Lmw7XG5cdFx0XHRcdFx0XHRpZiAoaSA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQueHMwICsgdmFsICsgcHQueHMxICsgcHQueG4xICsgcHQueHMyO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChpID09PSAzKSB7XG5cdFx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSBwdC54czAgKyB2YWwgKyBwdC54czEgKyBwdC54bjEgKyBwdC54czIgKyBwdC54bjIgKyBwdC54czM7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGkgPT09IDQpIHtcblx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LnhzMCArIHZhbCArIHB0LnhzMSArIHB0LnhuMSArIHB0LnhzMiArIHB0LnhuMiArIHB0LnhzMyArIHB0LnhuMyArIHB0LnhzNDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoaSA9PT0gNSkge1xuXHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQueHMwICsgdmFsICsgcHQueHMxICsgcHQueG4xICsgcHQueHMyICsgcHQueG4yICsgcHQueHMzICsgcHQueG4zICsgcHQueHM0ICsgcHQueG40ICsgcHQueHM1O1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0c3RyID0gcHQueHMwICsgdmFsICsgcHQueHMxO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAxOyBpIDwgcHQubDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0c3RyICs9IHB0W1wieG5cIitpXSArIHB0W1wieHNcIisoaSsxKV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHN0cjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHQudHlwZSA9PT0gLTEpIHsgLy9ub24tdHdlZW5pbmcgdmFsdWVcblx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSBwdC54czA7XG5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKHB0LnNldFJhdGlvKSB7IC8vY3VzdG9tIHNldFJhdGlvKCkgZm9yIHRoaW5ncyBsaWtlIFNwZWNpYWxQcm9wcywgZXh0ZXJuYWwgcGx1Z2lucywgZXRjLlxuXHRcdFx0XHRcdFx0cHQuc2V0UmF0aW8odik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0Ly9pZiB0aGUgdHdlZW4gaXMgcmV2ZXJzZWQgYWxsIHRoZSB3YXkgYmFjayB0byB0aGUgYmVnaW5uaW5nLCB3ZSBuZWVkIHRvIHJlc3RvcmUgdGhlIG9yaWdpbmFsIHZhbHVlcyB3aGljaCBtYXkgaGF2ZSBkaWZmZXJlbnQgdW5pdHMgKGxpa2UgJSBpbnN0ZWFkIG9mIHB4IG9yIGVtIG9yIHdoYXRldmVyKS5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdGlmIChwdC50eXBlICE9PSAyKSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQuYjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cHQuc2V0UmF0aW8odik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBGb3JjZXMgcmVuZGVyaW5nIG9mIHRoZSB0YXJnZXQncyB0cmFuc2Zvcm1zIChyb3RhdGlvbiwgc2NhbGUsIGV0Yy4pIHdoZW5ldmVyIHRoZSBDU1NQbHVnaW4ncyBzZXRSYXRpbygpIGlzIGNhbGxlZC5cblx0XHQgKiBCYXNpY2FsbHksIHRoaXMgdGVsbHMgdGhlIENTU1BsdWdpbiB0byBjcmVhdGUgYSBDU1NQcm9wVHdlZW4gKHR5cGUgMikgYWZ0ZXIgaW5zdGFudGlhdGlvbiB0aGF0IHJ1bnMgbGFzdCBpbiB0aGUgbGlua2VkXG5cdFx0ICogbGlzdCBhbmQgY2FsbHMgdGhlIGFwcHJvcHJpYXRlICgzRCBvciAyRCkgcmVuZGVyaW5nIGZ1bmN0aW9uLiBXZSBzZXBhcmF0ZSB0aGlzIGludG8gaXRzIG93biBtZXRob2Qgc28gdGhhdCB3ZSBjYW4gY2FsbFxuXHRcdCAqIGl0IGZyb20gb3RoZXIgcGx1Z2lucyBsaWtlIEJlemllclBsdWdpbiBpZiwgZm9yIGV4YW1wbGUsIGl0IG5lZWRzIHRvIGFwcGx5IGFuIGF1dG9Sb3RhdGlvbiBhbmQgdGhpcyBDU1NQbHVnaW5cblx0XHQgKiBkb2Vzbid0IGhhdmUgYW55IHRyYW5zZm9ybS1yZWxhdGVkIHByb3BlcnRpZXMgb2YgaXRzIG93bi4gWW91IGNhbiBjYWxsIHRoaXMgbWV0aG9kIGFzIG1hbnkgdGltZXMgYXMgeW91XG5cdFx0ICogd2FudCBhbmQgaXQgd29uJ3QgY3JlYXRlIGR1cGxpY2F0ZSBDU1NQcm9wVHdlZW5zLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSB0aHJlZUQgaWYgdHJ1ZSwgaXQgc2hvdWxkIGFwcGx5IDNEIHR3ZWVucyAob3RoZXJ3aXNlLCBqdXN0IDJEIG9uZXMgYXJlIGZpbmUgYW5kIHR5cGljYWxseSBmYXN0ZXIpXG5cdFx0ICovXG5cdFx0cC5fZW5hYmxlVHJhbnNmb3JtcyA9IGZ1bmN0aW9uKHRocmVlRCkge1xuXHRcdFx0dGhpcy5fdHJhbnNmb3JtID0gdGhpcy5fdHJhbnNmb3JtIHx8IF9nZXRUcmFuc2Zvcm0odGhpcy5fdGFyZ2V0LCBfY3MsIHRydWUpOyAvL2Vuc3VyZXMgdGhhdCB0aGUgZWxlbWVudCBoYXMgYSBfZ3NUcmFuc2Zvcm0gcHJvcGVydHkgd2l0aCB0aGUgYXBwcm9wcmlhdGUgdmFsdWVzLlxuXHRcdFx0dGhpcy5fdHJhbnNmb3JtVHlwZSA9ICghKHRoaXMuX3RyYW5zZm9ybS5zdmcgJiYgX3VzZVNWR1RyYW5zZm9ybUF0dHIpICYmICh0aHJlZUQgfHwgdGhpcy5fdHJhbnNmb3JtVHlwZSA9PT0gMykpID8gMyA6IDI7XG5cdFx0fTtcblxuXHRcdHZhciBsYXp5U2V0ID0gZnVuY3Rpb24odikge1xuXHRcdFx0dGhpcy50W3RoaXMucF0gPSB0aGlzLmU7XG5cdFx0XHR0aGlzLmRhdGEuX2xpbmtDU1NQKHRoaXMsIHRoaXMuX25leHQsIG51bGwsIHRydWUpOyAvL3dlIHB1cnBvc2VmdWxseSBrZWVwIHRoaXMuX25leHQgZXZlbiB0aG91Z2ggaXQnZCBtYWtlIHNlbnNlIHRvIG51bGwgaXQsIGJ1dCB0aGlzIGlzIGEgcGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uLCBhcyB0aGlzIGhhcHBlbnMgZHVyaW5nIHRoZSB3aGlsZSAocHQpIHt9IGxvb3AgaW4gc2V0UmF0aW8oKSBhdCB0aGUgYm90dG9tIG9mIHdoaWNoIGl0IHNldHMgcHQgPSBwdC5fbmV4dCwgc28gaWYgd2UgbnVsbCBpdCwgdGhlIGxpbmtlZCBsaXN0IHdpbGwgYmUgYnJva2VuIGluIHRoYXQgbG9vcC5cblx0XHR9O1xuXHRcdC8qKiBAcHJpdmF0ZSBHaXZlcyB1cyBhIHdheSB0byBzZXQgYSB2YWx1ZSBvbiB0aGUgZmlyc3QgcmVuZGVyIChhbmQgb25seSB0aGUgZmlyc3QgcmVuZGVyKS4gKiovXG5cdFx0cC5fYWRkTGF6eVNldCA9IGZ1bmN0aW9uKHQsIHAsIHYpIHtcblx0XHRcdHZhciBwdCA9IHRoaXMuX2ZpcnN0UFQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHQsIHAsIDAsIDAsIHRoaXMuX2ZpcnN0UFQsIDIpO1xuXHRcdFx0cHQuZSA9IHY7XG5cdFx0XHRwdC5zZXRSYXRpbyA9IGxhenlTZXQ7XG5cdFx0XHRwdC5kYXRhID0gdGhpcztcblx0XHR9O1xuXG5cdFx0LyoqIEBwcml2YXRlICoqL1xuXHRcdHAuX2xpbmtDU1NQID0gZnVuY3Rpb24ocHQsIG5leHQsIHByZXYsIHJlbW92ZSkge1xuXHRcdFx0aWYgKHB0KSB7XG5cdFx0XHRcdGlmIChuZXh0KSB7XG5cdFx0XHRcdFx0bmV4dC5fcHJldiA9IHB0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwdC5fbmV4dCkge1xuXHRcdFx0XHRcdHB0Ll9uZXh0Ll9wcmV2ID0gcHQuX3ByZXY7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHB0Ll9wcmV2KSB7XG5cdFx0XHRcdFx0cHQuX3ByZXYuX25leHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl9maXJzdFBUID09PSBwdCkge1xuXHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdC5fbmV4dDtcblx0XHRcdFx0XHRyZW1vdmUgPSB0cnVlOyAvL2p1c3QgdG8gcHJldmVudCByZXNldHRpbmcgdGhpcy5fZmlyc3RQVCA1IGxpbmVzIGRvd24gaW4gY2FzZSBwdC5fbmV4dCBpcyBudWxsLiAob3B0aW1pemVkIGZvciBzcGVlZClcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHJldikge1xuXHRcdFx0XHRcdHByZXYuX25leHQgPSBwdDtcblx0XHRcdFx0fSBlbHNlIGlmICghcmVtb3ZlICYmIHRoaXMuX2ZpcnN0UFQgPT09IG51bGwpIHtcblx0XHRcdFx0XHR0aGlzLl9maXJzdFBUID0gcHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQuX25leHQgPSBuZXh0O1xuXHRcdFx0XHRwdC5fcHJldiA9IHByZXY7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHQ7XG5cdFx0fTtcblxuXHRcdHAuX21vZCA9IGZ1bmN0aW9uKGxvb2t1cCkge1xuXHRcdFx0dmFyIHB0ID0gdGhpcy5fZmlyc3RQVDtcblx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRpZiAodHlwZW9mKGxvb2t1cFtwdC5wXSkgPT09IFwiZnVuY3Rpb25cIiAmJiBsb29rdXBbcHQucF0gPT09IE1hdGgucm91bmQpIHsgLy9vbmx5IGdldHMgY2FsbGVkIGJ5IFJvdW5kUHJvcHNQbHVnaW4gKE1vZGlmeVBsdWdpbiBtYW5hZ2VzIGFsbCB0aGUgcmVuZGVyaW5nIGludGVybmFsbHkgZm9yIENTU1BsdWdpbiBwcm9wZXJ0aWVzIHRoYXQgbmVlZCBtb2RpZmljYXRpb24pLiBSZW1lbWJlciwgd2UgaGFuZGxlIHJvdW5kaW5nIGEgYml0IGRpZmZlcmVudGx5IGluIHRoaXMgcGx1Z2luIGZvciBwZXJmb3JtYW5jZSByZWFzb25zLCBsZXZlcmFnaW5nIFwiclwiIGFzIGFuIGluZGljYXRvciB0aGF0IHRoZSB2YWx1ZSBzaG91bGQgYmUgcm91bmRlZCBpbnRlcm5hbGx5Li5cblx0XHRcdFx0XHRwdC5yID0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvL3dlIG5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgaWYgYWxwaGEgb3IgYXV0b0FscGhhIGlzIGtpbGxlZCwgb3BhY2l0eSBpcyB0b28uIEFuZCBhdXRvQWxwaGEgYWZmZWN0cyB0aGUgXCJ2aXNpYmlsaXR5XCIgcHJvcGVydHkuXG5cdFx0cC5fa2lsbCA9IGZ1bmN0aW9uKGxvb2t1cCkge1xuXHRcdFx0dmFyIGNvcHkgPSBsb29rdXAsXG5cdFx0XHRcdHB0LCBwLCB4Zmlyc3Q7XG5cdFx0XHRpZiAobG9va3VwLmF1dG9BbHBoYSB8fCBsb29rdXAuYWxwaGEpIHtcblx0XHRcdFx0Y29weSA9IHt9O1xuXHRcdFx0XHRmb3IgKHAgaW4gbG9va3VwKSB7IC8vY29weSB0aGUgbG9va3VwIHNvIHRoYXQgd2UncmUgbm90IGNoYW5naW5nIHRoZSBvcmlnaW5hbCB3aGljaCBtYXkgYmUgcGFzc2VkIGVsc2V3aGVyZS5cblx0XHRcdFx0XHRjb3B5W3BdID0gbG9va3VwW3BdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvcHkub3BhY2l0eSA9IDE7XG5cdFx0XHRcdGlmIChjb3B5LmF1dG9BbHBoYSkge1xuXHRcdFx0XHRcdGNvcHkudmlzaWJpbGl0eSA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChsb29rdXAuY2xhc3NOYW1lICYmIChwdCA9IHRoaXMuX2NsYXNzTmFtZVBUKSkgeyAvL2ZvciBjbGFzc05hbWUgdHdlZW5zLCB3ZSBuZWVkIHRvIGtpbGwgYW55IGFzc29jaWF0ZWQgQ1NTUHJvcFR3ZWVucyB0b287IGEgbGlua2VkIGxpc3Qgc3RhcnRzIGF0IHRoZSBjbGFzc05hbWUncyBcInhmaXJzdFwiLlxuXHRcdFx0XHR4Zmlyc3QgPSBwdC54Zmlyc3Q7XG5cdFx0XHRcdGlmICh4Zmlyc3QgJiYgeGZpcnN0Ll9wcmV2KSB7XG5cdFx0XHRcdFx0dGhpcy5fbGlua0NTU1AoeGZpcnN0Ll9wcmV2LCBwdC5fbmV4dCwgeGZpcnN0Ll9wcmV2Ll9wcmV2KTsgLy9icmVhayBvZmYgdGhlIHByZXZcblx0XHRcdFx0fSBlbHNlIGlmICh4Zmlyc3QgPT09IHRoaXMuX2ZpcnN0UFQpIHtcblx0XHRcdFx0XHR0aGlzLl9maXJzdFBUID0gcHQuX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHB0Ll9uZXh0KSB7XG5cdFx0XHRcdFx0dGhpcy5fbGlua0NTU1AocHQuX25leHQsIHB0Ll9uZXh0Ll9uZXh0LCB4Zmlyc3QuX3ByZXYpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2NsYXNzTmFtZVBUID0gbnVsbDtcblx0XHRcdH1cblx0XHRcdHB0ID0gdGhpcy5fZmlyc3RQVDtcblx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRpZiAocHQucGx1Z2luICYmIHB0LnBsdWdpbiAhPT0gcCAmJiBwdC5wbHVnaW4uX2tpbGwpIHsgLy9mb3IgcGx1Z2lucyB0aGF0IGFyZSByZWdpc3RlcmVkIHdpdGggQ1NTUGx1Z2luLCB3ZSBzaG91bGQgbm90aWZ5IHRoZW0gb2YgdGhlIGtpbGwuXG5cdFx0XHRcdFx0cHQucGx1Z2luLl9raWxsKGxvb2t1cCk7XG5cdFx0XHRcdFx0cCA9IHB0LnBsdWdpbjtcblx0XHRcdFx0fVxuXHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFR3ZWVuUGx1Z2luLnByb3RvdHlwZS5fa2lsbC5jYWxsKHRoaXMsIGNvcHkpO1xuXHRcdH07XG5cblxuXG5cdFx0Ly91c2VkIGJ5IGNhc2NhZGVUbygpIGZvciBnYXRoZXJpbmcgYWxsIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIG9mIGVhY2ggY2hpbGQgZWxlbWVudCBpbnRvIGFuIGFycmF5IGZvciBjb21wYXJpc29uLlxuXHRcdHZhciBfZ2V0Q2hpbGRTdHlsZXMgPSBmdW5jdGlvbihlLCBwcm9wcywgdGFyZ2V0cykge1xuXHRcdFx0XHR2YXIgY2hpbGRyZW4sIGksIGNoaWxkLCB0eXBlO1xuXHRcdFx0XHRpZiAoZS5zbGljZSkge1xuXHRcdFx0XHRcdGkgPSBlLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdF9nZXRDaGlsZFN0eWxlcyhlW2ldLCBwcm9wcywgdGFyZ2V0cyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRjaGlsZHJlbiA9IGUuY2hpbGROb2Rlcztcblx0XHRcdFx0aSA9IGNoaWxkcmVuLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0Y2hpbGQgPSBjaGlsZHJlbltpXTtcblx0XHRcdFx0XHR0eXBlID0gY2hpbGQudHlwZTtcblx0XHRcdFx0XHRpZiAoY2hpbGQuc3R5bGUpIHtcblx0XHRcdFx0XHRcdHByb3BzLnB1c2goX2dldEFsbFN0eWxlcyhjaGlsZCkpO1xuXHRcdFx0XHRcdFx0aWYgKHRhcmdldHMpIHtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0cy5wdXNoKGNoaWxkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCh0eXBlID09PSAxIHx8IHR5cGUgPT09IDkgfHwgdHlwZSA9PT0gMTEpICYmIGNoaWxkLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRfZ2V0Q2hpbGRTdHlsZXMoY2hpbGQsIHByb3BzLCB0YXJnZXRzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBUeXBpY2FsbHkgb25seSB1c2VmdWwgZm9yIGNsYXNzTmFtZSB0d2VlbnMgdGhhdCBtYXkgYWZmZWN0IGNoaWxkIGVsZW1lbnRzLCB0aGlzIG1ldGhvZCBjcmVhdGVzIGEgVHdlZW5MaXRlXG5cdFx0ICogYW5kIHRoZW4gY29tcGFyZXMgdGhlIHN0eWxlIHByb3BlcnRpZXMgb2YgYWxsIHRoZSB0YXJnZXQncyBjaGlsZCBlbGVtZW50cyBhdCB0aGUgdHdlZW4ncyBzdGFydCBhbmQgZW5kLCBhbmRcblx0XHQgKiBpZiBhbnkgYXJlIGRpZmZlcmVudCwgaXQgYWxzbyBjcmVhdGVzIHR3ZWVucyBmb3IgdGhvc2UgYW5kIHJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBBTEwgb2YgdGhlIHJlc3VsdGluZ1xuXHRcdCAqIHR3ZWVucyAoc28gdGhhdCB5b3UgY2FuIGVhc2lseSBhZGQoKSB0aGVtIHRvIGEgVGltZWxpbmVMaXRlLCBmb3IgZXhhbXBsZSkuIFRoZSByZWFzb24gdGhpcyBmdW5jdGlvbmFsaXR5IGlzXG5cdFx0ICogd3JhcHBlZCBpbnRvIGEgc2VwYXJhdGUgc3RhdGljIG1ldGhvZCBvZiBDU1NQbHVnaW4gaW5zdGVhZCBvZiBiZWluZyBpbnRlZ3JhdGVkIGludG8gYWxsIHJlZ3VsYXIgY2xhc3NOYW1lIHR3ZWVuc1xuXHRcdCAqIGlzIGJlY2F1c2UgaXQgY3JlYXRlcyBlbnRpcmVseSBuZXcgdHdlZW5zIHRoYXQgbWF5IGhhdmUgY29tcGxldGVseSBkaWZmZXJlbnQgdGFyZ2V0cyB0aGFuIHRoZSBvcmlnaW5hbCB0d2Vlbixcblx0XHQgKiBzbyBpZiB0aGV5IHdlcmUgYWxsIGx1bXBlZCBpbnRvIHRoZSBvcmlnaW5hbCB0d2VlbiBpbnN0YW5jZSwgaXQgd291bGQgYmUgaW5jb25zaXN0ZW50IHdpdGggdGhlIHJlc3Qgb2YgdGhlIEFQSVxuXHRcdCAqIGFuZCBpdCB3b3VsZCBjcmVhdGUgb3RoZXIgcHJvYmxlbXMuIEZvciBleGFtcGxlOlxuXHRcdCAqICAtIElmIEkgY3JlYXRlIGEgdHdlZW4gb2YgZWxlbWVudEEsIHRoYXQgdHdlZW4gaW5zdGFuY2UgbWF5IHN1ZGRlbmx5IGNoYW5nZSBpdHMgdGFyZ2V0IHRvIGluY2x1ZGUgNTAgb3RoZXIgZWxlbWVudHMgKHVuaW50dWl0aXZlIGlmIEkgc3BlY2lmaWNhbGx5IGRlZmluZWQgdGhlIHRhcmdldCBJIHdhbnRlZClcblx0XHQgKiAgLSBXZSBjYW4ndCBqdXN0IGNyZWF0ZSBuZXcgaW5kZXBlbmRlbnQgdHdlZW5zIGJlY2F1c2Ugb3RoZXJ3aXNlLCB3aGF0IGhhcHBlbnMgaWYgdGhlIG9yaWdpbmFsL3BhcmVudCB0d2VlbiBpcyByZXZlcnNlZCBvciBwYXVzZSBvciBkcm9wcGVkIGludG8gYSBUaW1lbGluZUxpdGUgZm9yIHRpZ2h0IGNvbnRyb2w/IFlvdSdkIGV4cGVjdCB0aGF0IHR3ZWVuJ3MgYmVoYXZpb3IgdG8gYWZmZWN0IGFsbCB0aGUgb3RoZXJzLlxuXHRcdCAqICAtIEFuYWx5emluZyBldmVyeSBzdHlsZSBwcm9wZXJ0eSBvZiBldmVyeSBjaGlsZCBiZWZvcmUgYW5kIGFmdGVyIHRoZSB0d2VlbiBpcyBhbiBleHBlbnNpdmUgb3BlcmF0aW9uIHdoZW4gdGhlcmUgYXJlIG1hbnkgY2hpbGRyZW4sIHNvIHRoaXMgYmVoYXZpb3Igc2hvdWxkbid0IGJlIGltcG9zZWQgb24gYWxsIGNsYXNzTmFtZSB0d2VlbnMgYnkgZGVmYXVsdCwgZXNwZWNpYWxseSBzaW5jZSBpdCdzIHByb2JhYmx5IHJhcmUgdGhhdCB0aGlzIGV4dHJhIGZ1bmN0aW9uYWxpdHkgaXMgbmVlZGVkLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBvYmplY3QgdG8gYmUgdHdlZW5lZFxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBEdXJhdGlvbiBpbiBzZWNvbmRzIChvciBmcmFtZXMgZm9yIGZyYW1lcy1iYXNlZCB0d2VlbnMpXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IE9iamVjdCBjb250YWluaW5nIHRoZSBlbmQgdmFsdWVzLCBsaWtlIHtjbGFzc05hbWU6XCJuZXdDbGFzc1wiLCBlYXNlOkxpbmVhci5lYXNlTm9uZX1cblx0XHQgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgVHdlZW5MaXRlIGluc3RhbmNlc1xuXHRcdCAqL1xuXHRcdENTU1BsdWdpbi5jYXNjYWRlVG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKSB7XG5cdFx0XHR2YXIgdHdlZW4gPSBUd2VlbkxpdGUudG8odGFyZ2V0LCBkdXJhdGlvbiwgdmFycyksXG5cdFx0XHRcdHJlc3VsdHMgPSBbdHdlZW5dLFxuXHRcdFx0XHRiID0gW10sXG5cdFx0XHRcdGUgPSBbXSxcblx0XHRcdFx0dGFyZ2V0cyA9IFtdLFxuXHRcdFx0XHRfcmVzZXJ2ZWRQcm9wcyA9IFR3ZWVuTGl0ZS5faW50ZXJuYWxzLnJlc2VydmVkUHJvcHMsXG5cdFx0XHRcdGksIGRpZnMsIHAsIGZyb207XG5cdFx0XHR0YXJnZXQgPSB0d2Vlbi5fdGFyZ2V0cyB8fCB0d2Vlbi50YXJnZXQ7XG5cdFx0XHRfZ2V0Q2hpbGRTdHlsZXModGFyZ2V0LCBiLCB0YXJnZXRzKTtcblx0XHRcdHR3ZWVuLnJlbmRlcihkdXJhdGlvbiwgdHJ1ZSwgdHJ1ZSk7XG5cdFx0XHRfZ2V0Q2hpbGRTdHlsZXModGFyZ2V0LCBlKTtcblx0XHRcdHR3ZWVuLnJlbmRlcigwLCB0cnVlLCB0cnVlKTtcblx0XHRcdHR3ZWVuLl9lbmFibGVkKHRydWUpO1xuXHRcdFx0aSA9IHRhcmdldHMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGRpZnMgPSBfY3NzRGlmKHRhcmdldHNbaV0sIGJbaV0sIGVbaV0pO1xuXHRcdFx0XHRpZiAoZGlmcy5maXJzdE1QVCkge1xuXHRcdFx0XHRcdGRpZnMgPSBkaWZzLmRpZnM7XG5cdFx0XHRcdFx0Zm9yIChwIGluIHZhcnMpIHtcblx0XHRcdFx0XHRcdGlmIChfcmVzZXJ2ZWRQcm9wc1twXSkge1xuXHRcdFx0XHRcdFx0XHRkaWZzW3BdID0gdmFyc1twXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZnJvbSA9IHt9O1xuXHRcdFx0XHRcdGZvciAocCBpbiBkaWZzKSB7XG5cdFx0XHRcdFx0XHRmcm9tW3BdID0gYltpXVtwXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzdWx0cy5wdXNoKFR3ZWVuTGl0ZS5mcm9tVG8odGFyZ2V0c1tpXSwgZHVyYXRpb24sIGZyb20sIGRpZnMpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0fTtcblxuXHRcdFR3ZWVuUGx1Z2luLmFjdGl2YXRlKFtDU1NQbHVnaW5dKTtcblx0XHRyZXR1cm4gQ1NTUGx1Z2luO1xuXG5cdH0sIHRydWUpO1xuXG5cdFxuXHRcblx0XG5cdFxuXHRcblx0XG5cdFxuXHRcblx0XG5cdFxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFJvdW5kUHJvcHNQbHVnaW5cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHQoZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgUm91bmRQcm9wc1BsdWdpbiA9IF9nc1Njb3BlLl9nc0RlZmluZS5wbHVnaW4oe1xuXHRcdFx0XHRwcm9wTmFtZTogXCJyb3VuZFByb3BzXCIsXG5cdFx0XHRcdHZlcnNpb246IFwiMS42LjBcIixcblx0XHRcdFx0cHJpb3JpdHk6IC0xLFxuXHRcdFx0XHRBUEk6IDIsXG5cblx0XHRcdFx0Ly9jYWxsZWQgd2hlbiB0aGUgdHdlZW4gcmVuZGVycyBmb3IgdGhlIGZpcnN0IHRpbWUuIFRoaXMgaXMgd2hlcmUgaW5pdGlhbCB2YWx1ZXMgc2hvdWxkIGJlIHJlY29yZGVkIGFuZCBhbnkgc2V0dXAgcm91dGluZXMgc2hvdWxkIHJ1bi5cblx0XHRcdFx0aW5pdDogZnVuY3Rpb24odGFyZ2V0LCB2YWx1ZSwgdHdlZW4pIHtcblx0XHRcdFx0XHR0aGlzLl90d2VlbiA9IHR3ZWVuO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0pLFxuXHRcdFx0X3JvdW5kTGlua2VkTGlzdCA9IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHRcdFx0d2hpbGUgKG5vZGUpIHtcblx0XHRcdFx0XHRpZiAoIW5vZGUuZiAmJiAhbm9kZS5ibG9iKSB7XG5cdFx0XHRcdFx0XHRub2RlLm0gPSBNYXRoLnJvdW5kO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRub2RlID0gbm9kZS5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHAgPSBSb3VuZFByb3BzUGx1Z2luLnByb3RvdHlwZTtcblxuXHRcdHAuX29uSW5pdEFsbFByb3BzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdHdlZW4gPSB0aGlzLl90d2Vlbixcblx0XHRcdFx0cnAgPSAodHdlZW4udmFycy5yb3VuZFByb3BzLmpvaW4pID8gdHdlZW4udmFycy5yb3VuZFByb3BzIDogdHdlZW4udmFycy5yb3VuZFByb3BzLnNwbGl0KFwiLFwiKSxcblx0XHRcdFx0aSA9IHJwLmxlbmd0aCxcblx0XHRcdFx0bG9va3VwID0ge30sXG5cdFx0XHRcdHJwdCA9IHR3ZWVuLl9wcm9wTG9va3VwLnJvdW5kUHJvcHMsXG5cdFx0XHRcdHByb3AsIHB0LCBuZXh0O1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGxvb2t1cFtycFtpXV0gPSBNYXRoLnJvdW5kO1xuXHRcdFx0fVxuXHRcdFx0aSA9IHJwLmxlbmd0aDtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRwcm9wID0gcnBbaV07XG5cdFx0XHRcdHB0ID0gdHdlZW4uX2ZpcnN0UFQ7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdG5leHQgPSBwdC5fbmV4dDsgLy9yZWNvcmQgaGVyZSwgYmVjYXVzZSBpdCBtYXkgZ2V0IHJlbW92ZWRcblx0XHRcdFx0XHRpZiAocHQucGcpIHtcblx0XHRcdFx0XHRcdHB0LnQuX21vZChsb29rdXApO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHQubiA9PT0gcHJvcCkge1xuXHRcdFx0XHRcdFx0aWYgKHB0LmYgPT09IDIgJiYgcHQudCkgeyAvL2EgYmxvYiAodGV4dCBjb250YWluaW5nIG11bHRpcGxlIG51bWVyaWMgdmFsdWVzKVxuXHRcdFx0XHRcdFx0XHRfcm91bmRMaW5rZWRMaXN0KHB0LnQuX2ZpcnN0UFQpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fYWRkKHB0LnQsIHByb3AsIHB0LnMsIHB0LmMpO1xuXHRcdFx0XHRcdFx0XHQvL3JlbW92ZSBmcm9tIGxpbmtlZCBsaXN0XG5cdFx0XHRcdFx0XHRcdGlmIChuZXh0KSB7XG5cdFx0XHRcdFx0XHRcdFx0bmV4dC5fcHJldiA9IHB0Ll9wcmV2O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChwdC5fcHJldikge1xuXHRcdFx0XHRcdFx0XHRcdHB0Ll9wcmV2Ll9uZXh0ID0gbmV4dDtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0d2Vlbi5fZmlyc3RQVCA9PT0gcHQpIHtcblx0XHRcdFx0XHRcdFx0XHR0d2Vlbi5fZmlyc3RQVCA9IG5leHQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cHQuX25leHQgPSBwdC5fcHJldiA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdHR3ZWVuLl9wcm9wTG9va3VwW3Byb3BdID0gcnB0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IG5leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdFx0cC5fYWRkID0gZnVuY3Rpb24odGFyZ2V0LCBwLCBzLCBjKSB7XG5cdFx0XHR0aGlzLl9hZGRUd2Vlbih0YXJnZXQsIHAsIHMsIHMgKyBjLCBwLCBNYXRoLnJvdW5kKTtcblx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzLnB1c2gocCk7XG5cdFx0fTtcblxuXHR9KCkpO1xuXG5cblxuXG5cblxuXG5cblxuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQXR0clBsdWdpblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cblx0KGZ1bmN0aW9uKCkge1xuXG5cdFx0X2dzU2NvcGUuX2dzRGVmaW5lLnBsdWdpbih7XG5cdFx0XHRwcm9wTmFtZTogXCJhdHRyXCIsXG5cdFx0XHRBUEk6IDIsXG5cdFx0XHR2ZXJzaW9uOiBcIjAuNi4wXCIsXG5cblx0XHRcdC8vY2FsbGVkIHdoZW4gdGhlIHR3ZWVuIHJlbmRlcnMgZm9yIHRoZSBmaXJzdCB0aW1lLiBUaGlzIGlzIHdoZXJlIGluaXRpYWwgdmFsdWVzIHNob3VsZCBiZSByZWNvcmRlZCBhbmQgYW55IHNldHVwIHJvdXRpbmVzIHNob3VsZCBydW4uXG5cdFx0XHRpbml0OiBmdW5jdGlvbih0YXJnZXQsIHZhbHVlLCB0d2VlbiwgaW5kZXgpIHtcblx0XHRcdFx0dmFyIHAsIGVuZDtcblx0XHRcdFx0aWYgKHR5cGVvZih0YXJnZXQuc2V0QXR0cmlidXRlKSAhPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZvciAocCBpbiB2YWx1ZSkge1xuXHRcdFx0XHRcdGVuZCA9IHZhbHVlW3BdO1xuXHRcdFx0XHRcdGlmICh0eXBlb2YoZW5kKSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRlbmQgPSBlbmQoaW5kZXgsIHRhcmdldCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX2FkZFR3ZWVuKHRhcmdldCwgXCJzZXRBdHRyaWJ1dGVcIiwgdGFyZ2V0LmdldEF0dHJpYnV0ZShwKSArIFwiXCIsIGVuZCArIFwiXCIsIHAsIGZhbHNlLCBwKTtcblx0XHRcdFx0XHR0aGlzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKHApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0fSgpKTtcblxuXG5cblxuXG5cblxuXG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIERpcmVjdGlvbmFsUm90YXRpb25QbHVnaW5cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHRfZ3NTY29wZS5fZ3NEZWZpbmUucGx1Z2luKHtcblx0XHRwcm9wTmFtZTogXCJkaXJlY3Rpb25hbFJvdGF0aW9uXCIsXG5cdFx0dmVyc2lvbjogXCIwLjMuMFwiLFxuXHRcdEFQSTogMixcblxuXHRcdC8vY2FsbGVkIHdoZW4gdGhlIHR3ZWVuIHJlbmRlcnMgZm9yIHRoZSBmaXJzdCB0aW1lLiBUaGlzIGlzIHdoZXJlIGluaXRpYWwgdmFsdWVzIHNob3VsZCBiZSByZWNvcmRlZCBhbmQgYW55IHNldHVwIHJvdXRpbmVzIHNob3VsZCBydW4uXG5cdFx0aW5pdDogZnVuY3Rpb24odGFyZ2V0LCB2YWx1ZSwgdHdlZW4sIGluZGV4KSB7XG5cdFx0XHRpZiAodHlwZW9mKHZhbHVlKSAhPT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHR2YWx1ZSA9IHtyb3RhdGlvbjp2YWx1ZX07XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmZpbmFscyA9IHt9O1xuXHRcdFx0dmFyIGNhcCA9ICh2YWx1ZS51c2VSYWRpYW5zID09PSB0cnVlKSA/IE1hdGguUEkgKiAyIDogMzYwLFxuXHRcdFx0XHRtaW4gPSAwLjAwMDAwMSxcblx0XHRcdFx0cCwgdiwgc3RhcnQsIGVuZCwgZGlmLCBzcGxpdDtcblx0XHRcdGZvciAocCBpbiB2YWx1ZSkge1xuXHRcdFx0XHRpZiAocCAhPT0gXCJ1c2VSYWRpYW5zXCIpIHtcblx0XHRcdFx0XHRlbmQgPSB2YWx1ZVtwXTtcblx0XHRcdFx0XHRpZiAodHlwZW9mKGVuZCkgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0ZW5kID0gZW5kKGluZGV4LCB0YXJnZXQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzcGxpdCA9IChlbmQgKyBcIlwiKS5zcGxpdChcIl9cIik7XG5cdFx0XHRcdFx0diA9IHNwbGl0WzBdO1xuXHRcdFx0XHRcdHN0YXJ0ID0gcGFyc2VGbG9hdCggKHR5cGVvZih0YXJnZXRbcF0pICE9PSBcImZ1bmN0aW9uXCIpID8gdGFyZ2V0W3BdIDogdGFyZ2V0WyAoKHAuaW5kZXhPZihcInNldFwiKSB8fCB0eXBlb2YodGFyZ2V0W1wiZ2V0XCIgKyBwLnN1YnN0cigzKV0pICE9PSBcImZ1bmN0aW9uXCIpID8gcCA6IFwiZ2V0XCIgKyBwLnN1YnN0cigzKSkgXSgpICk7XG5cdFx0XHRcdFx0ZW5kID0gdGhpcy5maW5hbHNbcF0gPSAodHlwZW9mKHYpID09PSBcInN0cmluZ1wiICYmIHYuY2hhckF0KDEpID09PSBcIj1cIikgPyBzdGFydCArIHBhcnNlSW50KHYuY2hhckF0KDApICsgXCIxXCIsIDEwKSAqIE51bWJlcih2LnN1YnN0cigyKSkgOiBOdW1iZXIodikgfHwgMDtcblx0XHRcdFx0XHRkaWYgPSBlbmQgLSBzdGFydDtcblx0XHRcdFx0XHRpZiAoc3BsaXQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHR2ID0gc3BsaXQuam9pbihcIl9cIik7XG5cdFx0XHRcdFx0XHRpZiAodi5pbmRleE9mKFwic2hvcnRcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdGRpZiA9IGRpZiAlIGNhcDtcblx0XHRcdFx0XHRcdFx0aWYgKGRpZiAhPT0gZGlmICUgKGNhcCAvIDIpKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGlmID0gKGRpZiA8IDApID8gZGlmICsgY2FwIDogZGlmIC0gY2FwO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAodi5pbmRleE9mKFwiX2N3XCIpICE9PSAtMSAmJiBkaWYgPCAwKSB7XG5cdFx0XHRcdFx0XHRcdGRpZiA9ICgoZGlmICsgY2FwICogOTk5OTk5OTk5OSkgJSBjYXApIC0gKChkaWYgLyBjYXApIHwgMCkgKiBjYXA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHYuaW5kZXhPZihcImNjd1wiKSAhPT0gLTEgJiYgZGlmID4gMCkge1xuXHRcdFx0XHRcdFx0XHRkaWYgPSAoKGRpZiAtIGNhcCAqIDk5OTk5OTk5OTkpICUgY2FwKSAtICgoZGlmIC8gY2FwKSB8IDApICogY2FwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoZGlmID4gbWluIHx8IGRpZiA8IC1taW4pIHtcblx0XHRcdFx0XHRcdHRoaXMuX2FkZFR3ZWVuKHRhcmdldCwgcCwgc3RhcnQsIHN0YXJ0ICsgZGlmLCBwKTtcblx0XHRcdFx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzLnB1c2gocCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0Ly9jYWxsZWQgZWFjaCB0aW1lIHRoZSB2YWx1ZXMgc2hvdWxkIGJlIHVwZGF0ZWQsIGFuZCB0aGUgcmF0aW8gZ2V0cyBwYXNzZWQgYXMgdGhlIG9ubHkgcGFyYW1ldGVyICh0eXBpY2FsbHkgaXQncyBhIHZhbHVlIGJldHdlZW4gMCBhbmQgMSwgYnV0IGl0IGNhbiBleGNlZWQgdGhvc2Ugd2hlbiB1c2luZyBhbiBlYXNlIGxpa2UgRWxhc3RpYy5lYXNlT3V0IG9yIEJhY2suZWFzZU91dCwgZXRjLilcblx0XHRzZXQ6IGZ1bmN0aW9uKHJhdGlvKSB7XG5cdFx0XHR2YXIgcHQ7XG5cdFx0XHRpZiAocmF0aW8gIT09IDEpIHtcblx0XHRcdFx0dGhpcy5fc3VwZXIuc2V0UmF0aW8uY2FsbCh0aGlzLCByYXRpbyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQ7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdGlmIChwdC5mKSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdKHRoaXMuZmluYWxzW3B0LnBdKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHRoaXMuZmluYWxzW3B0LnBdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH0pLl9hdXRvQ1NTID0gdHJ1ZTtcblxuXG5cblxuXG5cblxuXHRcblx0XG5cdFxuXHRcbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBFYXNlUGFja1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdF9nc1Njb3BlLl9nc0RlZmluZShcImVhc2luZy5CYWNrXCIsIFtcImVhc2luZy5FYXNlXCJdLCBmdW5jdGlvbihFYXNlKSB7XG5cdFx0XG5cdFx0dmFyIHcgPSAoX2dzU2NvcGUuR3JlZW5Tb2NrR2xvYmFscyB8fCBfZ3NTY29wZSksXG5cdFx0XHRncyA9IHcuY29tLmdyZWVuc29jayxcblx0XHRcdF8yUEkgPSBNYXRoLlBJICogMixcblx0XHRcdF9IQUxGX1BJID0gTWF0aC5QSSAvIDIsXG5cdFx0XHRfY2xhc3MgPSBncy5fY2xhc3MsXG5cdFx0XHRfY3JlYXRlID0gZnVuY3Rpb24obiwgZikge1xuXHRcdFx0XHR2YXIgQyA9IF9jbGFzcyhcImVhc2luZy5cIiArIG4sIGZ1bmN0aW9uKCl7fSwgdHJ1ZSksXG5cdFx0XHRcdFx0cCA9IEMucHJvdG90eXBlID0gbmV3IEVhc2UoKTtcblx0XHRcdFx0cC5jb25zdHJ1Y3RvciA9IEM7XG5cdFx0XHRcdHAuZ2V0UmF0aW8gPSBmO1xuXHRcdFx0XHRyZXR1cm4gQztcblx0XHRcdH0sXG5cdFx0XHRfZWFzZVJlZyA9IEVhc2UucmVnaXN0ZXIgfHwgZnVuY3Rpb24oKXt9LCAvL3B1dCBhbiBlbXB0eSBmdW5jdGlvbiBpbiBwbGFjZSBqdXN0IGFzIGEgc2FmZXR5IG1lYXN1cmUgaW4gY2FzZSBzb21lb25lIGxvYWRzIGFuIE9MRCB2ZXJzaW9uIG9mIFR3ZWVuTGl0ZS5qcyB3aGVyZSBFYXNlLnJlZ2lzdGVyIGRvZXNuJ3QgZXhpc3QuXG5cdFx0XHRfd3JhcCA9IGZ1bmN0aW9uKG5hbWUsIEVhc2VPdXQsIEVhc2VJbiwgRWFzZUluT3V0LCBhbGlhc2VzKSB7XG5cdFx0XHRcdHZhciBDID0gX2NsYXNzKFwiZWFzaW5nLlwiK25hbWUsIHtcblx0XHRcdFx0XHRlYXNlT3V0Om5ldyBFYXNlT3V0KCksXG5cdFx0XHRcdFx0ZWFzZUluOm5ldyBFYXNlSW4oKSxcblx0XHRcdFx0XHRlYXNlSW5PdXQ6bmV3IEVhc2VJbk91dCgpXG5cdFx0XHRcdH0sIHRydWUpO1xuXHRcdFx0XHRfZWFzZVJlZyhDLCBuYW1lKTtcblx0XHRcdFx0cmV0dXJuIEM7XG5cdFx0XHR9LFxuXHRcdFx0RWFzZVBvaW50ID0gZnVuY3Rpb24odGltZSwgdmFsdWUsIG5leHQpIHtcblx0XHRcdFx0dGhpcy50ID0gdGltZTtcblx0XHRcdFx0dGhpcy52ID0gdmFsdWU7XG5cdFx0XHRcdGlmIChuZXh0KSB7XG5cdFx0XHRcdFx0dGhpcy5uZXh0ID0gbmV4dDtcblx0XHRcdFx0XHRuZXh0LnByZXYgPSB0aGlzO1xuXHRcdFx0XHRcdHRoaXMuYyA9IG5leHQudiAtIHZhbHVlO1xuXHRcdFx0XHRcdHRoaXMuZ2FwID0gbmV4dC50IC0gdGltZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0Ly9CYWNrXG5cdFx0XHRfY3JlYXRlQmFjayA9IGZ1bmN0aW9uKG4sIGYpIHtcblx0XHRcdFx0dmFyIEMgPSBfY2xhc3MoXCJlYXNpbmcuXCIgKyBuLCBmdW5jdGlvbihvdmVyc2hvb3QpIHtcblx0XHRcdFx0XHRcdHRoaXMuX3AxID0gKG92ZXJzaG9vdCB8fCBvdmVyc2hvb3QgPT09IDApID8gb3ZlcnNob290IDogMS43MDE1ODtcblx0XHRcdFx0XHRcdHRoaXMuX3AyID0gdGhpcy5fcDEgKiAxLjUyNTtcblx0XHRcdFx0XHR9LCB0cnVlKSxcblx0XHRcdFx0XHRwID0gQy5wcm90b3R5cGUgPSBuZXcgRWFzZSgpO1xuXHRcdFx0XHRwLmNvbnN0cnVjdG9yID0gQztcblx0XHRcdFx0cC5nZXRSYXRpbyA9IGY7XG5cdFx0XHRcdHAuY29uZmlnID0gZnVuY3Rpb24ob3ZlcnNob290KSB7XG5cdFx0XHRcdFx0cmV0dXJuIG5ldyBDKG92ZXJzaG9vdCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJldHVybiBDO1xuXHRcdFx0fSxcblxuXHRcdFx0QmFjayA9IF93cmFwKFwiQmFja1wiLFxuXHRcdFx0XHRfY3JlYXRlQmFjayhcIkJhY2tPdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRcdHJldHVybiAoKHAgPSBwIC0gMSkgKiBwICogKCh0aGlzLl9wMSArIDEpICogcCArIHRoaXMuX3AxKSArIDEpO1xuXHRcdFx0XHR9KSxcblx0XHRcdFx0X2NyZWF0ZUJhY2soXCJCYWNrSW5cIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRcdHJldHVybiBwICogcCAqICgodGhpcy5fcDEgKyAxKSAqIHAgLSB0aGlzLl9wMSk7XG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRfY3JlYXRlQmFjayhcIkJhY2tJbk91dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdFx0cmV0dXJuICgocCAqPSAyKSA8IDEpID8gMC41ICogcCAqIHAgKiAoKHRoaXMuX3AyICsgMSkgKiBwIC0gdGhpcy5fcDIpIDogMC41ICogKChwIC09IDIpICogcCAqICgodGhpcy5fcDIgKyAxKSAqIHAgKyB0aGlzLl9wMikgKyAyKTtcblx0XHRcdFx0fSlcblx0XHRcdCksXG5cblxuXHRcdFx0Ly9TbG93TW9cblx0XHRcdFNsb3dNbyA9IF9jbGFzcyhcImVhc2luZy5TbG93TW9cIiwgZnVuY3Rpb24obGluZWFyUmF0aW8sIHBvd2VyLCB5b3lvTW9kZSkge1xuXHRcdFx0XHRwb3dlciA9IChwb3dlciB8fCBwb3dlciA9PT0gMCkgPyBwb3dlciA6IDAuNztcblx0XHRcdFx0aWYgKGxpbmVhclJhdGlvID09IG51bGwpIHtcblx0XHRcdFx0XHRsaW5lYXJSYXRpbyA9IDAuNztcblx0XHRcdFx0fSBlbHNlIGlmIChsaW5lYXJSYXRpbyA+IDEpIHtcblx0XHRcdFx0XHRsaW5lYXJSYXRpbyA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fcCA9IChsaW5lYXJSYXRpbyAhPT0gMSkgPyBwb3dlciA6IDA7XG5cdFx0XHRcdHRoaXMuX3AxID0gKDEgLSBsaW5lYXJSYXRpbykgLyAyO1xuXHRcdFx0XHR0aGlzLl9wMiA9IGxpbmVhclJhdGlvO1xuXHRcdFx0XHR0aGlzLl9wMyA9IHRoaXMuX3AxICsgdGhpcy5fcDI7XG5cdFx0XHRcdHRoaXMuX2NhbGNFbmQgPSAoeW95b01vZGUgPT09IHRydWUpO1xuXHRcdFx0fSwgdHJ1ZSksXG5cdFx0XHRwID0gU2xvd01vLnByb3RvdHlwZSA9IG5ldyBFYXNlKCksXG5cdFx0XHRTdGVwcGVkRWFzZSwgUm91Z2hFYXNlLCBfY3JlYXRlRWxhc3RpYztcblxuXHRcdHAuY29uc3RydWN0b3IgPSBTbG93TW87XG5cdFx0cC5nZXRSYXRpbyA9IGZ1bmN0aW9uKHApIHtcblx0XHRcdHZhciByID0gcCArICgwLjUgLSBwKSAqIHRoaXMuX3A7XG5cdFx0XHRpZiAocCA8IHRoaXMuX3AxKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9jYWxjRW5kID8gMSAtICgocCA9IDEgLSAocCAvIHRoaXMuX3AxKSkgKiBwKSA6IHIgLSAoKHAgPSAxIC0gKHAgLyB0aGlzLl9wMSkpICogcCAqIHAgKiBwICogcik7XG5cdFx0XHR9IGVsc2UgaWYgKHAgPiB0aGlzLl9wMykge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fY2FsY0VuZCA/IDEgLSAocCA9IChwIC0gdGhpcy5fcDMpIC8gdGhpcy5fcDEpICogcCA6IHIgKyAoKHAgLSByKSAqIChwID0gKHAgLSB0aGlzLl9wMykgLyB0aGlzLl9wMSkgKiBwICogcCAqIHApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX2NhbGNFbmQgPyAxIDogcjtcblx0XHR9O1xuXHRcdFNsb3dNby5lYXNlID0gbmV3IFNsb3dNbygwLjcsIDAuNyk7XG5cblx0XHRwLmNvbmZpZyA9IFNsb3dNby5jb25maWcgPSBmdW5jdGlvbihsaW5lYXJSYXRpbywgcG93ZXIsIHlveW9Nb2RlKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFNsb3dNbyhsaW5lYXJSYXRpbywgcG93ZXIsIHlveW9Nb2RlKTtcblx0XHR9O1xuXG5cblx0XHQvL1N0ZXBwZWRFYXNlXG5cdFx0U3RlcHBlZEVhc2UgPSBfY2xhc3MoXCJlYXNpbmcuU3RlcHBlZEVhc2VcIiwgZnVuY3Rpb24oc3RlcHMpIHtcblx0XHRcdFx0c3RlcHMgPSBzdGVwcyB8fCAxO1xuXHRcdFx0XHR0aGlzLl9wMSA9IDEgLyBzdGVwcztcblx0XHRcdFx0dGhpcy5fcDIgPSBzdGVwcyArIDE7XG5cdFx0XHR9LCB0cnVlKTtcblx0XHRwID0gU3RlcHBlZEVhc2UucHJvdG90eXBlID0gbmV3IEVhc2UoKTtcblx0XHRwLmNvbnN0cnVjdG9yID0gU3RlcHBlZEVhc2U7XG5cdFx0cC5nZXRSYXRpbyA9IGZ1bmN0aW9uKHApIHtcblx0XHRcdGlmIChwIDwgMCkge1xuXHRcdFx0XHRwID0gMDtcblx0XHRcdH0gZWxzZSBpZiAocCA+PSAxKSB7XG5cdFx0XHRcdHAgPSAwLjk5OTk5OTk5OTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAoKHRoaXMuX3AyICogcCkgPj4gMCkgKiB0aGlzLl9wMTtcblx0XHR9O1xuXHRcdHAuY29uZmlnID0gU3RlcHBlZEVhc2UuY29uZmlnID0gZnVuY3Rpb24oc3RlcHMpIHtcblx0XHRcdHJldHVybiBuZXcgU3RlcHBlZEVhc2Uoc3RlcHMpO1xuXHRcdH07XG5cblxuXHRcdC8vUm91Z2hFYXNlXG5cdFx0Um91Z2hFYXNlID0gX2NsYXNzKFwiZWFzaW5nLlJvdWdoRWFzZVwiLCBmdW5jdGlvbih2YXJzKSB7XG5cdFx0XHR2YXJzID0gdmFycyB8fCB7fTtcblx0XHRcdHZhciB0YXBlciA9IHZhcnMudGFwZXIgfHwgXCJub25lXCIsXG5cdFx0XHRcdGEgPSBbXSxcblx0XHRcdFx0Y250ID0gMCxcblx0XHRcdFx0cG9pbnRzID0gKHZhcnMucG9pbnRzIHx8IDIwKSB8IDAsXG5cdFx0XHRcdGkgPSBwb2ludHMsXG5cdFx0XHRcdHJhbmRvbWl6ZSA9ICh2YXJzLnJhbmRvbWl6ZSAhPT0gZmFsc2UpLFxuXHRcdFx0XHRjbGFtcCA9ICh2YXJzLmNsYW1wID09PSB0cnVlKSxcblx0XHRcdFx0dGVtcGxhdGUgPSAodmFycy50ZW1wbGF0ZSBpbnN0YW5jZW9mIEVhc2UpID8gdmFycy50ZW1wbGF0ZSA6IG51bGwsXG5cdFx0XHRcdHN0cmVuZ3RoID0gKHR5cGVvZih2YXJzLnN0cmVuZ3RoKSA9PT0gXCJudW1iZXJcIikgPyB2YXJzLnN0cmVuZ3RoICogMC40IDogMC40LFxuXHRcdFx0XHR4LCB5LCBidW1wLCBpbnZYLCBvYmosIHBudDtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHR4ID0gcmFuZG9taXplID8gTWF0aC5yYW5kb20oKSA6ICgxIC8gcG9pbnRzKSAqIGk7XG5cdFx0XHRcdHkgPSB0ZW1wbGF0ZSA/IHRlbXBsYXRlLmdldFJhdGlvKHgpIDogeDtcblx0XHRcdFx0aWYgKHRhcGVyID09PSBcIm5vbmVcIikge1xuXHRcdFx0XHRcdGJ1bXAgPSBzdHJlbmd0aDtcblx0XHRcdFx0fSBlbHNlIGlmICh0YXBlciA9PT0gXCJvdXRcIikge1xuXHRcdFx0XHRcdGludlggPSAxIC0geDtcblx0XHRcdFx0XHRidW1wID0gaW52WCAqIGludlggKiBzdHJlbmd0aDtcblx0XHRcdFx0fSBlbHNlIGlmICh0YXBlciA9PT0gXCJpblwiKSB7XG5cdFx0XHRcdFx0YnVtcCA9IHggKiB4ICogc3RyZW5ndGg7XG5cdFx0XHRcdH0gZWxzZSBpZiAoeCA8IDAuNSkgeyAgLy9cImJvdGhcIiAoc3RhcnQpXG5cdFx0XHRcdFx0aW52WCA9IHggKiAyO1xuXHRcdFx0XHRcdGJ1bXAgPSBpbnZYICogaW52WCAqIDAuNSAqIHN0cmVuZ3RoO1xuXHRcdFx0XHR9IGVsc2Uge1x0XHRcdFx0Ly9cImJvdGhcIiAoZW5kKVxuXHRcdFx0XHRcdGludlggPSAoMSAtIHgpICogMjtcblx0XHRcdFx0XHRidW1wID0gaW52WCAqIGludlggKiAwLjUgKiBzdHJlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocmFuZG9taXplKSB7XG5cdFx0XHRcdFx0eSArPSAoTWF0aC5yYW5kb20oKSAqIGJ1bXApIC0gKGJ1bXAgKiAwLjUpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGkgJSAyKSB7XG5cdFx0XHRcdFx0eSArPSBidW1wICogMC41O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHkgLT0gYnVtcCAqIDAuNTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2xhbXApIHtcblx0XHRcdFx0XHRpZiAoeSA+IDEpIHtcblx0XHRcdFx0XHRcdHkgPSAxO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoeSA8IDApIHtcblx0XHRcdFx0XHRcdHkgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRhW2NudCsrXSA9IHt4OngsIHk6eX07XG5cdFx0XHR9XG5cdFx0XHRhLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0XHRyZXR1cm4gYS54IC0gYi54O1xuXHRcdFx0fSk7XG5cblx0XHRcdHBudCA9IG5ldyBFYXNlUG9pbnQoMSwgMSwgbnVsbCk7XG5cdFx0XHRpID0gcG9pbnRzO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdG9iaiA9IGFbaV07XG5cdFx0XHRcdHBudCA9IG5ldyBFYXNlUG9pbnQob2JqLngsIG9iai55LCBwbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9wcmV2ID0gbmV3IEVhc2VQb2ludCgwLCAwLCAocG50LnQgIT09IDApID8gcG50IDogcG50Lm5leHQpO1xuXHRcdH0sIHRydWUpO1xuXHRcdHAgPSBSb3VnaEVhc2UucHJvdG90eXBlID0gbmV3IEVhc2UoKTtcblx0XHRwLmNvbnN0cnVjdG9yID0gUm91Z2hFYXNlO1xuXHRcdHAuZ2V0UmF0aW8gPSBmdW5jdGlvbihwKSB7XG5cdFx0XHR2YXIgcG50ID0gdGhpcy5fcHJldjtcblx0XHRcdGlmIChwID4gcG50LnQpIHtcblx0XHRcdFx0d2hpbGUgKHBudC5uZXh0ICYmIHAgPj0gcG50LnQpIHtcblx0XHRcdFx0XHRwbnQgPSBwbnQubmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRwbnQgPSBwbnQucHJldjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdoaWxlIChwbnQucHJldiAmJiBwIDw9IHBudC50KSB7XG5cdFx0XHRcdFx0cG50ID0gcG50LnByZXY7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX3ByZXYgPSBwbnQ7XG5cdFx0XHRyZXR1cm4gKHBudC52ICsgKChwIC0gcG50LnQpIC8gcG50LmdhcCkgKiBwbnQuYyk7XG5cdFx0fTtcblx0XHRwLmNvbmZpZyA9IGZ1bmN0aW9uKHZhcnMpIHtcblx0XHRcdHJldHVybiBuZXcgUm91Z2hFYXNlKHZhcnMpO1xuXHRcdH07XG5cdFx0Um91Z2hFYXNlLmVhc2UgPSBuZXcgUm91Z2hFYXNlKCk7XG5cblxuXHRcdC8vQm91bmNlXG5cdFx0X3dyYXAoXCJCb3VuY2VcIixcblx0XHRcdF9jcmVhdGUoXCJCb3VuY2VPdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRpZiAocCA8IDEgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIHAgKiBwO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHAgPCAyIC8gMi43NSkge1xuXHRcdFx0XHRcdHJldHVybiA3LjU2MjUgKiAocCAtPSAxLjUgLyAyLjc1KSAqIHAgKyAwLjc1O1xuXHRcdFx0XHR9IGVsc2UgaWYgKHAgPCAyLjUgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChwIC09IDIuMjUgLyAyLjc1KSAqIHAgKyAwLjkzNzU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChwIC09IDIuNjI1IC8gMi43NSkgKiBwICsgMC45ODQzNzU7XG5cdFx0XHR9KSxcblx0XHRcdF9jcmVhdGUoXCJCb3VuY2VJblwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdGlmICgocCA9IDEgLSBwKSA8IDEgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cmV0dXJuIDEgLSAoNy41NjI1ICogcCAqIHApO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHAgPCAyIC8gMi43NSkge1xuXHRcdFx0XHRcdHJldHVybiAxIC0gKDcuNTYyNSAqIChwIC09IDEuNSAvIDIuNzUpICogcCArIDAuNzUpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHAgPCAyLjUgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cmV0dXJuIDEgLSAoNy41NjI1ICogKHAgLT0gMi4yNSAvIDIuNzUpICogcCArIDAuOTM3NSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIDEgLSAoNy41NjI1ICogKHAgLT0gMi42MjUgLyAyLjc1KSAqIHAgKyAwLjk4NDM3NSk7XG5cdFx0XHR9KSxcblx0XHRcdF9jcmVhdGUoXCJCb3VuY2VJbk91dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHZhciBpbnZlcnQgPSAocCA8IDAuNSk7XG5cdFx0XHRcdGlmIChpbnZlcnQpIHtcblx0XHRcdFx0XHRwID0gMSAtIChwICogMik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cCA9IChwICogMikgLSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwIDwgMSAvIDIuNzUpIHtcblx0XHRcdFx0XHRwID0gNy41NjI1ICogcCAqIHA7XG5cdFx0XHRcdH0gZWxzZSBpZiAocCA8IDIgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cCA9IDcuNTYyNSAqIChwIC09IDEuNSAvIDIuNzUpICogcCArIDAuNzU7XG5cdFx0XHRcdH0gZWxzZSBpZiAocCA8IDIuNSAvIDIuNzUpIHtcblx0XHRcdFx0XHRwID0gNy41NjI1ICogKHAgLT0gMi4yNSAvIDIuNzUpICogcCArIDAuOTM3NTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwID0gNy41NjI1ICogKHAgLT0gMi42MjUgLyAyLjc1KSAqIHAgKyAwLjk4NDM3NTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gaW52ZXJ0ID8gKDEgLSBwKSAqIDAuNSA6IHAgKiAwLjUgKyAwLjU7XG5cdFx0XHR9KVxuXHRcdCk7XG5cblxuXHRcdC8vQ0lSQ1xuXHRcdF93cmFwKFwiQ2lyY1wiLFxuXHRcdFx0X2NyZWF0ZShcIkNpcmNPdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gTWF0aC5zcXJ0KDEgLSAocCA9IHAgLSAxKSAqIHApO1xuXHRcdFx0fSksXG5cdFx0XHRfY3JlYXRlKFwiQ2lyY0luXCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIC0oTWF0aC5zcXJ0KDEgLSAocCAqIHApKSAtIDEpO1xuXHRcdFx0fSksXG5cdFx0XHRfY3JlYXRlKFwiQ2lyY0luT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuICgocCo9MikgPCAxKSA/IC0wLjUgKiAoTWF0aC5zcXJ0KDEgLSBwICogcCkgLSAxKSA6IDAuNSAqIChNYXRoLnNxcnQoMSAtIChwIC09IDIpICogcCkgKyAxKTtcblx0XHRcdH0pXG5cdFx0KTtcblxuXG5cdFx0Ly9FbGFzdGljXG5cdFx0X2NyZWF0ZUVsYXN0aWMgPSBmdW5jdGlvbihuLCBmLCBkZWYpIHtcblx0XHRcdHZhciBDID0gX2NsYXNzKFwiZWFzaW5nLlwiICsgbiwgZnVuY3Rpb24oYW1wbGl0dWRlLCBwZXJpb2QpIHtcblx0XHRcdFx0XHR0aGlzLl9wMSA9IChhbXBsaXR1ZGUgPj0gMSkgPyBhbXBsaXR1ZGUgOiAxOyAvL25vdGU6IGlmIGFtcGxpdHVkZSBpcyA8IDEsIHdlIHNpbXBseSBhZGp1c3QgdGhlIHBlcmlvZCBmb3IgYSBtb3JlIG5hdHVyYWwgZmVlbC4gT3RoZXJ3aXNlIHRoZSBtYXRoIGRvZXNuJ3Qgd29yayByaWdodCBhbmQgdGhlIGN1cnZlIHN0YXJ0cyBhdCAxLlxuXHRcdFx0XHRcdHRoaXMuX3AyID0gKHBlcmlvZCB8fCBkZWYpIC8gKGFtcGxpdHVkZSA8IDEgPyBhbXBsaXR1ZGUgOiAxKTtcblx0XHRcdFx0XHR0aGlzLl9wMyA9IHRoaXMuX3AyIC8gXzJQSSAqIChNYXRoLmFzaW4oMSAvIHRoaXMuX3AxKSB8fCAwKTtcblx0XHRcdFx0XHR0aGlzLl9wMiA9IF8yUEkgLyB0aGlzLl9wMjsgLy9wcmVjYWxjdWxhdGUgdG8gb3B0aW1pemVcblx0XHRcdFx0fSwgdHJ1ZSksXG5cdFx0XHRcdHAgPSBDLnByb3RvdHlwZSA9IG5ldyBFYXNlKCk7XG5cdFx0XHRwLmNvbnN0cnVjdG9yID0gQztcblx0XHRcdHAuZ2V0UmF0aW8gPSBmO1xuXHRcdFx0cC5jb25maWcgPSBmdW5jdGlvbihhbXBsaXR1ZGUsIHBlcmlvZCkge1xuXHRcdFx0XHRyZXR1cm4gbmV3IEMoYW1wbGl0dWRlLCBwZXJpb2QpO1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiBDO1xuXHRcdH07XG5cdFx0X3dyYXAoXCJFbGFzdGljXCIsXG5cdFx0XHRfY3JlYXRlRWxhc3RpYyhcIkVsYXN0aWNPdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcDEgKiBNYXRoLnBvdygyLCAtMTAgKiBwKSAqIE1hdGguc2luKCAocCAtIHRoaXMuX3AzKSAqIHRoaXMuX3AyICkgKyAxO1xuXHRcdFx0fSwgMC4zKSxcblx0XHRcdF9jcmVhdGVFbGFzdGljKFwiRWxhc3RpY0luXCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIC0odGhpcy5fcDEgKiBNYXRoLnBvdygyLCAxMCAqIChwIC09IDEpKSAqIE1hdGguc2luKCAocCAtIHRoaXMuX3AzKSAqIHRoaXMuX3AyICkpO1xuXHRcdFx0fSwgMC4zKSxcblx0XHRcdF9jcmVhdGVFbGFzdGljKFwiRWxhc3RpY0luT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuICgocCAqPSAyKSA8IDEpID8gLTAuNSAqICh0aGlzLl9wMSAqIE1hdGgucG93KDIsIDEwICogKHAgLT0gMSkpICogTWF0aC5zaW4oIChwIC0gdGhpcy5fcDMpICogdGhpcy5fcDIpKSA6IHRoaXMuX3AxICogTWF0aC5wb3coMiwgLTEwICoocCAtPSAxKSkgKiBNYXRoLnNpbiggKHAgLSB0aGlzLl9wMykgKiB0aGlzLl9wMiApICogMC41ICsgMTtcblx0XHRcdH0sIDAuNDUpXG5cdFx0KTtcblxuXG5cdFx0Ly9FeHBvXG5cdFx0X3dyYXAoXCJFeHBvXCIsXG5cdFx0XHRfY3JlYXRlKFwiRXhwb091dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHJldHVybiAxIC0gTWF0aC5wb3coMiwgLTEwICogcCk7XG5cdFx0XHR9KSxcblx0XHRcdF9jcmVhdGUoXCJFeHBvSW5cIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gTWF0aC5wb3coMiwgMTAgKiAocCAtIDEpKSAtIDAuMDAxO1xuXHRcdFx0fSksXG5cdFx0XHRfY3JlYXRlKFwiRXhwb0luT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuICgocCAqPSAyKSA8IDEpID8gMC41ICogTWF0aC5wb3coMiwgMTAgKiAocCAtIDEpKSA6IDAuNSAqICgyIC0gTWF0aC5wb3coMiwgLTEwICogKHAgLSAxKSkpO1xuXHRcdFx0fSlcblx0XHQpO1xuXG5cblx0XHQvL1NpbmVcblx0XHRfd3JhcChcIlNpbmVcIixcblx0XHRcdF9jcmVhdGUoXCJTaW5lT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIE1hdGguc2luKHAgKiBfSEFMRl9QSSk7XG5cdFx0XHR9KSxcblx0XHRcdF9jcmVhdGUoXCJTaW5lSW5cIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gLU1hdGguY29zKHAgKiBfSEFMRl9QSSkgKyAxO1xuXHRcdFx0fSksXG5cdFx0XHRfY3JlYXRlKFwiU2luZUluT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiAoTWF0aC5jb3MoTWF0aC5QSSAqIHApIC0gMSk7XG5cdFx0XHR9KVxuXHRcdCk7XG5cblx0XHRfY2xhc3MoXCJlYXNpbmcuRWFzZUxvb2t1cFwiLCB7XG5cdFx0XHRcdGZpbmQ6ZnVuY3Rpb24ocykge1xuXHRcdFx0XHRcdHJldHVybiBFYXNlLm1hcFtzXTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdHJ1ZSk7XG5cblx0XHQvL3JlZ2lzdGVyIHRoZSBub24tc3RhbmRhcmQgZWFzZXNcblx0XHRfZWFzZVJlZyh3LlNsb3dNbywgXCJTbG93TW9cIiwgXCJlYXNlLFwiKTtcblx0XHRfZWFzZVJlZyhSb3VnaEVhc2UsIFwiUm91Z2hFYXNlXCIsIFwiZWFzZSxcIik7XG5cdFx0X2Vhc2VSZWcoU3RlcHBlZEVhc2UsIFwiU3RlcHBlZEVhc2VcIiwgXCJlYXNlLFwiKTtcblxuXHRcdHJldHVybiBCYWNrO1xuXHRcdFxuXHR9LCB0cnVlKTtcblxuXG59KTtcblxuaWYgKF9nc1Njb3BlLl9nc0RlZmluZSkgeyBfZ3NTY29wZS5fZ3NRdWV1ZS5wb3AoKSgpOyB9IC8vbmVjZXNzYXJ5IGluIGNhc2UgVHdlZW5MaXRlIHdhcyBhbHJlYWR5IGxvYWRlZCBzZXBhcmF0ZWx5LlxuXG5cblxuXG5cblxuXG5cblxuXG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCYXNlIGNsYXNzZXMgbGlrZSBUd2VlbkxpdGUsIFNpbXBsZVRpbWVsaW5lLCBFYXNlLCBUaWNrZXIsIGV0Yy5cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgbW9kdWxlTmFtZSkge1xuXG5cdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFx0dmFyIF9leHBvcnRzID0ge30sXG5cdFx0XHRfZ2xvYmFscyA9IHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzID0gd2luZG93LkdyZWVuU29ja0dsb2JhbHMgfHwgd2luZG93O1xuXHRcdGlmIChfZ2xvYmFscy5Ud2VlbkxpdGUpIHtcblx0XHRcdHJldHVybjsgLy9pbiBjYXNlIHRoZSBjb3JlIHNldCBvZiBjbGFzc2VzIGlzIGFscmVhZHkgbG9hZGVkLCBkb24ndCBpbnN0YW50aWF0ZSB0d2ljZS5cblx0XHR9XG5cdFx0dmFyIF9uYW1lc3BhY2UgPSBmdW5jdGlvbihucykge1xuXHRcdFx0XHR2YXIgYSA9IG5zLnNwbGl0KFwiLlwiKSxcblx0XHRcdFx0XHRwID0gX2dsb2JhbHMsIGk7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0cFthW2ldXSA9IHAgPSBwW2FbaV1dIHx8IHt9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBwO1xuXHRcdFx0fSxcblx0XHRcdGdzID0gX25hbWVzcGFjZShcImNvbS5ncmVlbnNvY2tcIiksXG5cdFx0XHRfdGlueU51bSA9IDAuMDAwMDAwMDAwMSxcblx0XHRcdF9zbGljZSA9IGZ1bmN0aW9uKGEpIHsgLy9kb24ndCB1c2UgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGFyZ2V0LCAwKSBiZWNhdXNlIHRoYXQgZG9lc24ndCB3b3JrIGluIElFOCB3aXRoIGEgTm9kZUxpc3QgdGhhdCdzIHJldHVybmVkIGJ5IHF1ZXJ5U2VsZWN0b3JBbGwoKVxuXHRcdFx0XHR2YXIgYiA9IFtdLFxuXHRcdFx0XHRcdGwgPSBhLmxlbmd0aCxcblx0XHRcdFx0XHRpO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpICE9PSBsOyBiLnB1c2goYVtpKytdKSkge31cblx0XHRcdFx0cmV0dXJuIGI7XG5cdFx0XHR9LFxuXHRcdFx0X2VtcHR5RnVuYyA9IGZ1bmN0aW9uKCkge30sXG5cdFx0XHRfaXNBcnJheSA9IChmdW5jdGlvbigpIHsgLy93b3JrcyBhcm91bmQgaXNzdWVzIGluIGlmcmFtZSBlbnZpcm9ubWVudHMgd2hlcmUgdGhlIEFycmF5IGdsb2JhbCBpc24ndCBzaGFyZWQsIHRodXMgaWYgdGhlIG9iamVjdCBvcmlnaW5hdGVzIGluIGEgZGlmZmVyZW50IHdpbmRvdy9pZnJhbWUsIFwiKG9iaiBpbnN0YW5jZW9mIEFycmF5KVwiIHdpbGwgZXZhbHVhdGUgZmFsc2UuIFdlIGFkZGVkIHNvbWUgc3BlZWQgb3B0aW1pemF0aW9ucyB0byBhdm9pZCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoKSB1bmxlc3MgaXQncyBhYnNvbHV0ZWx5IG5lY2Vzc2FyeSBiZWNhdXNlIGl0J3MgVkVSWSBzbG93IChsaWtlIDIweCBzbG93ZXIpXG5cdFx0XHRcdHZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG5cdFx0XHRcdFx0YXJyYXkgPSB0b1N0cmluZy5jYWxsKFtdKTtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuXHRcdFx0XHRcdHJldHVybiBvYmogIT0gbnVsbCAmJiAob2JqIGluc3RhbmNlb2YgQXJyYXkgfHwgKHR5cGVvZihvYmopID09PSBcIm9iamVjdFwiICYmICEhb2JqLnB1c2ggJiYgdG9TdHJpbmcuY2FsbChvYmopID09PSBhcnJheSkpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSgpKSxcblx0XHRcdGEsIGksIHAsIF90aWNrZXIsIF90aWNrZXJBY3RpdmUsXG5cdFx0XHRfZGVmTG9va3VwID0ge30sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQGNvbnN0cnVjdG9yXG5cdFx0XHQgKiBEZWZpbmVzIGEgR3JlZW5Tb2NrIGNsYXNzLCBvcHRpb25hbGx5IHdpdGggYW4gYXJyYXkgb2YgZGVwZW5kZW5jaWVzIHRoYXQgbXVzdCBiZSBpbnN0YW50aWF0ZWQgZmlyc3QgYW5kIHBhc3NlZCBpbnRvIHRoZSBkZWZpbml0aW9uLlxuXHRcdFx0ICogVGhpcyBhbGxvd3MgdXNlcnMgdG8gbG9hZCBHcmVlblNvY2sgSlMgZmlsZXMgaW4gYW55IG9yZGVyIGV2ZW4gaWYgdGhleSBoYXZlIGludGVyZGVwZW5kZW5jaWVzIChsaWtlIENTU1BsdWdpbiBleHRlbmRzIFR3ZWVuUGx1Z2luIHdoaWNoIGlzXG5cdFx0XHQgKiBpbnNpZGUgVHdlZW5MaXRlLmpzLCBidXQgaWYgQ1NTUGx1Z2luIGlzIGxvYWRlZCBmaXJzdCwgaXQgc2hvdWxkIHdhaXQgdG8gcnVuIGl0cyBjb2RlIHVudGlsIFR3ZWVuTGl0ZS5qcyBsb2FkcyBhbmQgaW5zdGFudGlhdGVzIFR3ZWVuUGx1Z2luXG5cdFx0XHQgKiBhbmQgdGhlbiBwYXNzIFR3ZWVuUGx1Z2luIHRvIENTU1BsdWdpbidzIGRlZmluaXRpb24pLiBUaGlzIGlzIGFsbCBkb25lIGF1dG9tYXRpY2FsbHkgYW5kIGludGVybmFsbHkuXG5cdFx0XHQgKlxuXHRcdFx0ICogRXZlcnkgZGVmaW5pdGlvbiB3aWxsIGJlIGFkZGVkIHRvIGEgXCJjb20uZ3JlZW5zb2NrXCIgZ2xvYmFsIG9iamVjdCAodHlwaWNhbGx5IHdpbmRvdywgYnV0IGlmIGEgd2luZG93LkdyZWVuU29ja0dsb2JhbHMgb2JqZWN0IGlzIGZvdW5kLFxuXHRcdFx0ICogaXQgd2lsbCBnbyB0aGVyZSBhcyBvZiB2MS43KS4gRm9yIGV4YW1wbGUsIFR3ZWVuTGl0ZSB3aWxsIGJlIGZvdW5kIGF0IHdpbmRvdy5jb20uZ3JlZW5zb2NrLlR3ZWVuTGl0ZSBhbmQgc2luY2UgaXQncyBhIGdsb2JhbCBjbGFzcyB0aGF0IHNob3VsZCBiZSBhdmFpbGFibGUgYW55d2hlcmUsXG5cdFx0XHQgKiBpdCBpcyBBTFNPIHJlZmVyZW5jZWQgYXQgd2luZG93LlR3ZWVuTGl0ZS4gSG93ZXZlciBzb21lIGNsYXNzZXMgYXJlbid0IGNvbnNpZGVyZWQgZ2xvYmFsLCBsaWtlIHRoZSBiYXNlIGNvbS5ncmVlbnNvY2suY29yZS5BbmltYXRpb24gY2xhc3MsIHNvXG5cdFx0XHQgKiB0aG9zZSB3aWxsIG9ubHkgYmUgYXQgdGhlIHBhY2thZ2UgbGlrZSB3aW5kb3cuY29tLmdyZWVuc29jay5jb3JlLkFuaW1hdGlvbi4gQWdhaW4sIGlmIHlvdSBkZWZpbmUgYSBHcmVlblNvY2tHbG9iYWxzIG9iamVjdCBvbiB0aGUgd2luZG93LCBldmVyeXRoaW5nXG5cdFx0XHQgKiBnZXRzIHR1Y2tlZCBuZWF0bHkgaW5zaWRlIHRoZXJlIGluc3RlYWQgb2Ygb24gdGhlIHdpbmRvdyBkaXJlY3RseS4gVGhpcyBhbGxvd3MgeW91IHRvIGRvIGFkdmFuY2VkIHRoaW5ncyBsaWtlIGxvYWQgbXVsdGlwbGUgdmVyc2lvbnMgb2YgR3JlZW5Tb2NrXG5cdFx0XHQgKiBmaWxlcyBhbmQgcHV0IHRoZW0gaW50byBkaXN0aW5jdCBvYmplY3RzIChpbWFnaW5lIGEgYmFubmVyIGFkIHVzZXMgYSBuZXdlciB2ZXJzaW9uIGJ1dCB0aGUgbWFpbiBzaXRlIHVzZXMgYW4gb2xkZXIgb25lKS4gSW4gdGhhdCBjYXNlLCB5b3UgY291bGRcblx0XHRcdCAqIHNhbmRib3ggdGhlIGJhbm5lciBvbmUgbGlrZTpcblx0XHRcdCAqXG5cdFx0XHQgKiA8c2NyaXB0PlxuXHRcdFx0ICogICAgIHZhciBncyA9IHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzID0ge307IC8vdGhlIG5ld2VyIHZlcnNpb24gd2UncmUgYWJvdXQgdG8gbG9hZCBjb3VsZCBub3cgYmUgcmVmZXJlbmNlZCBpbiBhIFwiZ3NcIiBvYmplY3QsIGxpa2UgZ3MuVHdlZW5MaXRlLnRvKC4uLikuIFVzZSB3aGF0ZXZlciBhbGlhcyB5b3Ugd2FudCBhcyBsb25nIGFzIGl0J3MgdW5pcXVlLCBcImdzXCIgb3IgXCJiYW5uZXJcIiBvciB3aGF0ZXZlci5cblx0XHRcdCAqIDwvc2NyaXB0PlxuXHRcdFx0ICogPHNjcmlwdCBzcmM9XCJqcy9ncmVlbnNvY2svdjEuNy9Ud2Vlbk1heC5qc1wiPjwvc2NyaXB0PlxuXHRcdFx0ICogPHNjcmlwdD5cblx0XHRcdCAqICAgICB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyA9IHdpbmRvdy5fZ3NRdWV1ZSA9IHdpbmRvdy5fZ3NEZWZpbmUgPSBudWxsOyAvL3Jlc2V0IGl0IGJhY2sgdG8gbnVsbCAoYWxvbmcgd2l0aCB0aGUgc3BlY2lhbCBfZ3NRdWV1ZSB2YXJpYWJsZSkgc28gdGhhdCB0aGUgbmV4dCBsb2FkIG9mIFR3ZWVuTWF4IGFmZmVjdHMgdGhlIHdpbmRvdyBhbmQgd2UgY2FuIHJlZmVyZW5jZSB0aGluZ3MgZGlyZWN0bHkgbGlrZSBUd2VlbkxpdGUudG8oLi4uKVxuXHRcdFx0ICogPC9zY3JpcHQ+XG5cdFx0XHQgKiA8c2NyaXB0IHNyYz1cImpzL2dyZWVuc29jay92MS42L1R3ZWVuTWF4LmpzXCI+PC9zY3JpcHQ+XG5cdFx0XHQgKiA8c2NyaXB0PlxuXHRcdFx0ICogICAgIGdzLlR3ZWVuTGl0ZS50byguLi4pOyAvL3dvdWxkIHVzZSB2MS43XG5cdFx0XHQgKiAgICAgVHdlZW5MaXRlLnRvKC4uLik7IC8vd291bGQgdXNlIHYxLjZcblx0XHRcdCAqIDwvc2NyaXB0PlxuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSB7IXN0cmluZ30gbnMgVGhlIG5hbWVzcGFjZSBvZiB0aGUgY2xhc3MgZGVmaW5pdGlvbiwgbGVhdmluZyBvZmYgXCJjb20uZ3JlZW5zb2NrLlwiIGFzIHRoYXQncyBhc3N1bWVkLiBGb3IgZXhhbXBsZSwgXCJUd2VlbkxpdGVcIiBvciBcInBsdWdpbnMuQ1NTUGx1Z2luXCIgb3IgXCJlYXNpbmcuQmFja1wiLlxuXHRcdFx0ICogQHBhcmFtIHshQXJyYXkuPHN0cmluZz59IGRlcGVuZGVuY2llcyBBbiBhcnJheSBvZiBkZXBlbmRlbmNpZXMgKGRlc2NyaWJlZCBhcyB0aGVpciBuYW1lc3BhY2VzIG1pbnVzIFwiY29tLmdyZWVuc29jay5cIiBwcmVmaXgpLiBGb3IgZXhhbXBsZSBbXCJUd2VlbkxpdGVcIixcInBsdWdpbnMuVHdlZW5QbHVnaW5cIixcImNvcmUuQW5pbWF0aW9uXCJdXG5cdFx0XHQgKiBAcGFyYW0geyFmdW5jdGlvbigpOk9iamVjdH0gZnVuYyBUaGUgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgY2FsbGVkIGFuZCBwYXNzZWQgdGhlIHJlc29sdmVkIGRlcGVuZGVuY2llcyB3aGljaCB3aWxsIHJldHVybiB0aGUgYWN0dWFsIGNsYXNzIGZvciB0aGlzIGRlZmluaXRpb24uXG5cdFx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBnbG9iYWwgSWYgdHJ1ZSwgdGhlIGNsYXNzIHdpbGwgYmUgYWRkZWQgdG8gdGhlIGdsb2JhbCBzY29wZSAodHlwaWNhbGx5IHdpbmRvdyB1bmxlc3MgeW91IGRlZmluZSBhIHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzIG9iamVjdClcblx0XHRcdCAqL1xuXHRcdFx0RGVmaW5pdGlvbiA9IGZ1bmN0aW9uKG5zLCBkZXBlbmRlbmNpZXMsIGZ1bmMsIGdsb2JhbCkge1xuXHRcdFx0XHR0aGlzLnNjID0gKF9kZWZMb29rdXBbbnNdKSA/IF9kZWZMb29rdXBbbnNdLnNjIDogW107IC8vc3ViY2xhc3Nlc1xuXHRcdFx0XHRfZGVmTG9va3VwW25zXSA9IHRoaXM7XG5cdFx0XHRcdHRoaXMuZ3NDbGFzcyA9IG51bGw7XG5cdFx0XHRcdHRoaXMuZnVuYyA9IGZ1bmM7XG5cdFx0XHRcdHZhciBfY2xhc3NlcyA9IFtdO1xuXHRcdFx0XHR0aGlzLmNoZWNrID0gZnVuY3Rpb24oaW5pdCkge1xuXHRcdFx0XHRcdHZhciBpID0gZGVwZW5kZW5jaWVzLmxlbmd0aCxcblx0XHRcdFx0XHRcdG1pc3NpbmcgPSBpLFxuXHRcdFx0XHRcdFx0Y3VyLCBhLCBuLCBjbCwgaGFzTW9kdWxlO1xuXHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0aWYgKChjdXIgPSBfZGVmTG9va3VwW2RlcGVuZGVuY2llc1tpXV0gfHwgbmV3IERlZmluaXRpb24oZGVwZW5kZW5jaWVzW2ldLCBbXSkpLmdzQ2xhc3MpIHtcblx0XHRcdFx0XHRcdFx0X2NsYXNzZXNbaV0gPSBjdXIuZ3NDbGFzcztcblx0XHRcdFx0XHRcdFx0bWlzc2luZy0tO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChpbml0KSB7XG5cdFx0XHRcdFx0XHRcdGN1ci5zYy5wdXNoKHRoaXMpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAobWlzc2luZyA9PT0gMCAmJiBmdW5jKSB7XG5cdFx0XHRcdFx0XHRhID0gKFwiY29tLmdyZWVuc29jay5cIiArIG5zKS5zcGxpdChcIi5cIik7XG5cdFx0XHRcdFx0XHRuID0gYS5wb3AoKTtcblx0XHRcdFx0XHRcdGNsID0gX25hbWVzcGFjZShhLmpvaW4oXCIuXCIpKVtuXSA9IHRoaXMuZ3NDbGFzcyA9IGZ1bmMuYXBwbHkoZnVuYywgX2NsYXNzZXMpO1xuXG5cdFx0XHRcdFx0XHQvL2V4cG9ydHMgdG8gbXVsdGlwbGUgZW52aXJvbm1lbnRzXG5cdFx0XHRcdFx0XHRpZiAoZ2xvYmFsKSB7XG5cdFx0XHRcdFx0XHRcdF9nbG9iYWxzW25dID0gX2V4cG9ydHNbbl0gPSBjbDsgLy9wcm92aWRlcyBhIHdheSB0byBhdm9pZCBnbG9iYWwgbmFtZXNwYWNlIHBvbGx1dGlvbi4gQnkgZGVmYXVsdCwgdGhlIG1haW4gY2xhc3NlcyBsaWtlIFR3ZWVuTGl0ZSwgUG93ZXIxLCBTdHJvbmcsIGV0Yy4gYXJlIGFkZGVkIHRvIHdpbmRvdyB1bmxlc3MgYSBHcmVlblNvY2tHbG9iYWxzIGlzIGRlZmluZWQuIFNvIGlmIHlvdSB3YW50IHRvIGhhdmUgdGhpbmdzIGFkZGVkIHRvIGEgY3VzdG9tIG9iamVjdCBpbnN0ZWFkLCBqdXN0IGRvIHNvbWV0aGluZyBsaWtlIHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzID0ge30gYmVmb3JlIGxvYWRpbmcgYW55IEdyZWVuU29jayBmaWxlcy4gWW91IGNhbiBldmVuIHNldCB1cCBhbiBhbGlhcyBsaWtlIHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzID0gd2luZG93cy5ncyA9IHt9IHNvIHRoYXQgeW91IGNhbiBhY2Nlc3MgZXZlcnl0aGluZyBsaWtlIGdzLlR3ZWVuTGl0ZS4gQWxzbyByZW1lbWJlciB0aGF0IEFMTCBjbGFzc2VzIGFyZSBhZGRlZCB0byB0aGUgd2luZG93LmNvbS5ncmVlbnNvY2sgb2JqZWN0IChpbiB0aGVpciByZXNwZWN0aXZlIHBhY2thZ2VzLCBsaWtlIGNvbS5ncmVlbnNvY2suZWFzaW5nLlBvd2VyMSwgY29tLmdyZWVuc29jay5Ud2VlbkxpdGUsIGV0Yy4pXG5cdFx0XHRcdFx0XHRcdGhhc01vZHVsZSA9ICh0eXBlb2YobW9kdWxlKSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cyk7XG5cdFx0XHRcdFx0XHRcdGlmICghaGFzTW9kdWxlICYmIHR5cGVvZihkZWZpbmUpID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCl7IC8vQU1EXG5cdFx0XHRcdFx0XHRcdFx0ZGVmaW5lKCh3aW5kb3cuR3JlZW5Tb2NrQU1EUGF0aCA/IHdpbmRvdy5HcmVlblNvY2tBTURQYXRoICsgXCIvXCIgOiBcIlwiKSArIG5zLnNwbGl0KFwiLlwiKS5wb3AoKSwgW10sIGZ1bmN0aW9uKCkgeyByZXR1cm4gY2w7IH0pO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGhhc01vZHVsZSl7IC8vbm9kZVxuXHRcdFx0XHRcdFx0XHRcdGlmIChucyA9PT0gbW9kdWxlTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlLmV4cG9ydHMgPSBfZXhwb3J0c1ttb2R1bGVOYW1lXSA9IGNsO1xuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChpIGluIF9leHBvcnRzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNsW2ldID0gX2V4cG9ydHNbaV07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChfZXhwb3J0c1ttb2R1bGVOYW1lXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2V4cG9ydHNbbW9kdWxlTmFtZV1bbl0gPSBjbDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLnNjLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2NbaV0uY2hlY2soKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdHRoaXMuY2hlY2sodHJ1ZSk7XG5cdFx0XHR9LFxuXG5cdFx0XHQvL3VzZWQgdG8gY3JlYXRlIERlZmluaXRpb24gaW5zdGFuY2VzICh3aGljaCBiYXNpY2FsbHkgcmVnaXN0ZXJzIGEgY2xhc3MgdGhhdCBoYXMgZGVwZW5kZW5jaWVzKS5cblx0XHRcdF9nc0RlZmluZSA9IHdpbmRvdy5fZ3NEZWZpbmUgPSBmdW5jdGlvbihucywgZGVwZW5kZW5jaWVzLCBmdW5jLCBnbG9iYWwpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBEZWZpbml0aW9uKG5zLCBkZXBlbmRlbmNpZXMsIGZ1bmMsIGdsb2JhbCk7XG5cdFx0XHR9LFxuXG5cdFx0XHQvL2EgcXVpY2sgd2F5IHRvIGNyZWF0ZSBhIGNsYXNzIHRoYXQgZG9lc24ndCBoYXZlIGFueSBkZXBlbmRlbmNpZXMuIFJldHVybnMgdGhlIGNsYXNzLCBidXQgZmlyc3QgcmVnaXN0ZXJzIGl0IGluIHRoZSBHcmVlblNvY2sgbmFtZXNwYWNlIHNvIHRoYXQgb3RoZXIgY2xhc3NlcyBjYW4gZ3JhYiBpdCAob3RoZXIgY2xhc3NlcyBtaWdodCBiZSBkZXBlbmRlbnQgb24gdGhlIGNsYXNzKS5cblx0XHRcdF9jbGFzcyA9IGdzLl9jbGFzcyA9IGZ1bmN0aW9uKG5zLCBmdW5jLCBnbG9iYWwpIHtcblx0XHRcdFx0ZnVuYyA9IGZ1bmMgfHwgZnVuY3Rpb24oKSB7fTtcblx0XHRcdFx0X2dzRGVmaW5lKG5zLCBbXSwgZnVuY3Rpb24oKXsgcmV0dXJuIGZ1bmM7IH0sIGdsb2JhbCk7XG5cdFx0XHRcdHJldHVybiBmdW5jO1xuXHRcdFx0fTtcblxuXHRcdF9nc0RlZmluZS5nbG9iYWxzID0gX2dsb2JhbHM7XG5cblxuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogRWFzZVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdFx0dmFyIF9iYXNlUGFyYW1zID0gWzAsIDAsIDEsIDFdLFxuXHRcdFx0X2JsYW5rQXJyYXkgPSBbXSxcblx0XHRcdEVhc2UgPSBfY2xhc3MoXCJlYXNpbmcuRWFzZVwiLCBmdW5jdGlvbihmdW5jLCBleHRyYVBhcmFtcywgdHlwZSwgcG93ZXIpIHtcblx0XHRcdFx0dGhpcy5fZnVuYyA9IGZ1bmM7XG5cdFx0XHRcdHRoaXMuX3R5cGUgPSB0eXBlIHx8IDA7XG5cdFx0XHRcdHRoaXMuX3Bvd2VyID0gcG93ZXIgfHwgMDtcblx0XHRcdFx0dGhpcy5fcGFyYW1zID0gZXh0cmFQYXJhbXMgPyBfYmFzZVBhcmFtcy5jb25jYXQoZXh0cmFQYXJhbXMpIDogX2Jhc2VQYXJhbXM7XG5cdFx0XHR9LCB0cnVlKSxcblx0XHRcdF9lYXNlTWFwID0gRWFzZS5tYXAgPSB7fSxcblx0XHRcdF9lYXNlUmVnID0gRWFzZS5yZWdpc3RlciA9IGZ1bmN0aW9uKGVhc2UsIG5hbWVzLCB0eXBlcywgY3JlYXRlKSB7XG5cdFx0XHRcdHZhciBuYSA9IG5hbWVzLnNwbGl0KFwiLFwiKSxcblx0XHRcdFx0XHRpID0gbmEubGVuZ3RoLFxuXHRcdFx0XHRcdHRhID0gKHR5cGVzIHx8IFwiZWFzZUluLGVhc2VPdXQsZWFzZUluT3V0XCIpLnNwbGl0KFwiLFwiKSxcblx0XHRcdFx0XHRlLCBuYW1lLCBqLCB0eXBlO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRuYW1lID0gbmFbaV07XG5cdFx0XHRcdFx0ZSA9IGNyZWF0ZSA/IF9jbGFzcyhcImVhc2luZy5cIituYW1lLCBudWxsLCB0cnVlKSA6IGdzLmVhc2luZ1tuYW1lXSB8fCB7fTtcblx0XHRcdFx0XHRqID0gdGEubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICgtLWogPiAtMSkge1xuXHRcdFx0XHRcdFx0dHlwZSA9IHRhW2pdO1xuXHRcdFx0XHRcdFx0X2Vhc2VNYXBbbmFtZSArIFwiLlwiICsgdHlwZV0gPSBfZWFzZU1hcFt0eXBlICsgbmFtZV0gPSBlW3R5cGVdID0gZWFzZS5nZXRSYXRpbyA/IGVhc2UgOiBlYXNlW3R5cGVdIHx8IG5ldyBlYXNlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0cCA9IEVhc2UucHJvdG90eXBlO1xuXHRcdHAuX2NhbGNFbmQgPSBmYWxzZTtcblx0XHRwLmdldFJhdGlvID0gZnVuY3Rpb24ocCkge1xuXHRcdFx0aWYgKHRoaXMuX2Z1bmMpIHtcblx0XHRcdFx0dGhpcy5fcGFyYW1zWzBdID0gcDtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2Z1bmMuYXBwbHkobnVsbCwgdGhpcy5fcGFyYW1zKTtcblx0XHRcdH1cblx0XHRcdHZhciB0ID0gdGhpcy5fdHlwZSxcblx0XHRcdFx0cHcgPSB0aGlzLl9wb3dlcixcblx0XHRcdFx0ciA9ICh0ID09PSAxKSA/IDEgLSBwIDogKHQgPT09IDIpID8gcCA6IChwIDwgMC41KSA/IHAgKiAyIDogKDEgLSBwKSAqIDI7XG5cdFx0XHRpZiAocHcgPT09IDEpIHtcblx0XHRcdFx0ciAqPSByO1xuXHRcdFx0fSBlbHNlIGlmIChwdyA9PT0gMikge1xuXHRcdFx0XHRyICo9IHIgKiByO1xuXHRcdFx0fSBlbHNlIGlmIChwdyA9PT0gMykge1xuXHRcdFx0XHRyICo9IHIgKiByICogcjtcblx0XHRcdH0gZWxzZSBpZiAocHcgPT09IDQpIHtcblx0XHRcdFx0ciAqPSByICogciAqIHIgKiByO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICh0ID09PSAxKSA/IDEgLSByIDogKHQgPT09IDIpID8gciA6IChwIDwgMC41KSA/IHIgLyAyIDogMSAtIChyIC8gMik7XG5cdFx0fTtcblxuXHRcdC8vY3JlYXRlIGFsbCB0aGUgc3RhbmRhcmQgZWFzZXMgbGlrZSBMaW5lYXIsIFF1YWQsIEN1YmljLCBRdWFydCwgUXVpbnQsIFN0cm9uZywgUG93ZXIwLCBQb3dlcjEsIFBvd2VyMiwgUG93ZXIzLCBhbmQgUG93ZXI0IChlYWNoIHdpdGggZWFzZUluLCBlYXNlT3V0LCBhbmQgZWFzZUluT3V0KVxuXHRcdGEgPSBbXCJMaW5lYXJcIixcIlF1YWRcIixcIkN1YmljXCIsXCJRdWFydFwiLFwiUXVpbnQsU3Ryb25nXCJdO1xuXHRcdGkgPSBhLmxlbmd0aDtcblx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdHAgPSBhW2ldK1wiLFBvd2VyXCIraTtcblx0XHRcdF9lYXNlUmVnKG5ldyBFYXNlKG51bGwsbnVsbCwxLGkpLCBwLCBcImVhc2VPdXRcIiwgdHJ1ZSk7XG5cdFx0XHRfZWFzZVJlZyhuZXcgRWFzZShudWxsLG51bGwsMixpKSwgcCwgXCJlYXNlSW5cIiArICgoaSA9PT0gMCkgPyBcIixlYXNlTm9uZVwiIDogXCJcIikpO1xuXHRcdFx0X2Vhc2VSZWcobmV3IEVhc2UobnVsbCxudWxsLDMsaSksIHAsIFwiZWFzZUluT3V0XCIpO1xuXHRcdH1cblx0XHRfZWFzZU1hcC5saW5lYXIgPSBncy5lYXNpbmcuTGluZWFyLmVhc2VJbjtcblx0XHRfZWFzZU1hcC5zd2luZyA9IGdzLmVhc2luZy5RdWFkLmVhc2VJbk91dDsgLy9mb3IgalF1ZXJ5IGZvbGtzXG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEV2ZW50RGlzcGF0Y2hlclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdFx0dmFyIEV2ZW50RGlzcGF0Y2hlciA9IF9jbGFzcyhcImV2ZW50cy5FdmVudERpc3BhdGNoZXJcIiwgZnVuY3Rpb24odGFyZ2V0KSB7XG5cdFx0XHR0aGlzLl9saXN0ZW5lcnMgPSB7fTtcblx0XHRcdHRoaXMuX2V2ZW50VGFyZ2V0ID0gdGFyZ2V0IHx8IHRoaXM7XG5cdFx0fSk7XG5cdFx0cCA9IEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGU7XG5cblx0XHRwLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaywgc2NvcGUsIHVzZVBhcmFtLCBwcmlvcml0eSkge1xuXHRcdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdFx0dmFyIGxpc3QgPSB0aGlzLl9saXN0ZW5lcnNbdHlwZV0sXG5cdFx0XHRcdGluZGV4ID0gMCxcblx0XHRcdFx0bGlzdGVuZXIsIGk7XG5cdFx0XHRpZiAodGhpcyA9PT0gX3RpY2tlciAmJiAhX3RpY2tlckFjdGl2ZSkge1xuXHRcdFx0XHRfdGlja2VyLndha2UoKTtcblx0XHRcdH1cblx0XHRcdGlmIChsaXN0ID09IG51bGwpIHtcblx0XHRcdFx0dGhpcy5fbGlzdGVuZXJzW3R5cGVdID0gbGlzdCA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0aSA9IGxpc3QubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGxpc3RlbmVyID0gbGlzdFtpXTtcblx0XHRcdFx0aWYgKGxpc3RlbmVyLmMgPT09IGNhbGxiYWNrICYmIGxpc3RlbmVyLnMgPT09IHNjb3BlKSB7XG5cdFx0XHRcdFx0bGlzdC5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoaW5kZXggPT09IDAgJiYgbGlzdGVuZXIucHIgPCBwcmlvcml0eSkge1xuXHRcdFx0XHRcdGluZGV4ID0gaSArIDE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxpc3Quc3BsaWNlKGluZGV4LCAwLCB7YzpjYWxsYmFjaywgczpzY29wZSwgdXA6dXNlUGFyYW0sIHByOnByaW9yaXR5fSk7XG5cdFx0fTtcblxuXHRcdHAucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgbGlzdCA9IHRoaXMuX2xpc3RlbmVyc1t0eXBlXSwgaTtcblx0XHRcdGlmIChsaXN0KSB7XG5cdFx0XHRcdGkgPSBsaXN0Lmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0aWYgKGxpc3RbaV0uYyA9PT0gY2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdGxpc3Quc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRwLmRpc3BhdGNoRXZlbnQgPSBmdW5jdGlvbih0eXBlKSB7XG5cdFx0XHR2YXIgbGlzdCA9IHRoaXMuX2xpc3RlbmVyc1t0eXBlXSxcblx0XHRcdFx0aSwgdCwgbGlzdGVuZXI7XG5cdFx0XHRpZiAobGlzdCkge1xuXHRcdFx0XHRpID0gbGlzdC5sZW5ndGg7XG5cdFx0XHRcdGlmIChpID4gMSkge1xuXHRcdFx0XHRcdGxpc3QgPSBsaXN0LnNsaWNlKDApOyAvL2luIGNhc2UgYWRkRXZlbnRMaXN0ZW5lcigpIGlzIGNhbGxlZCBmcm9tIHdpdGhpbiBhIGxpc3RlbmVyL2NhbGxiYWNrIChvdGhlcndpc2UgdGhlIGluZGV4IGNvdWxkIGNoYW5nZSwgcmVzdWx0aW5nIGluIGEgc2tpcClcblx0XHRcdFx0fVxuXHRcdFx0XHR0ID0gdGhpcy5fZXZlbnRUYXJnZXQ7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGxpc3RlbmVyID0gbGlzdFtpXTtcblx0XHRcdFx0XHRpZiAobGlzdGVuZXIpIHtcblx0XHRcdFx0XHRcdGlmIChsaXN0ZW5lci51cCkge1xuXHRcdFx0XHRcdFx0XHRsaXN0ZW5lci5jLmNhbGwobGlzdGVuZXIucyB8fCB0LCB7dHlwZTp0eXBlLCB0YXJnZXQ6dH0pO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0bGlzdGVuZXIuYy5jYWxsKGxpc3RlbmVyLnMgfHwgdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogVGlja2VyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbiBcdFx0dmFyIF9yZXFBbmltRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lLFxuXHRcdFx0X2NhbmNlbEFuaW1GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSxcblx0XHRcdF9nZXRUaW1lID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKSB7cmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO30sXG5cdFx0XHRfbGFzdFVwZGF0ZSA9IF9nZXRUaW1lKCk7XG5cblx0XHQvL25vdyB0cnkgdG8gZGV0ZXJtaW5lIHRoZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgYW5kIGNhbmNlbEFuaW1hdGlvbkZyYW1lIGZ1bmN0aW9ucyBhbmQgaWYgbm9uZSBhcmUgZm91bmQsIHdlJ2xsIHVzZSBhIHNldFRpbWVvdXQoKS9jbGVhclRpbWVvdXQoKSBwb2x5ZmlsbC5cblx0XHRhID0gW1wibXNcIixcIm1velwiLFwid2Via2l0XCIsXCJvXCJdO1xuXHRcdGkgPSBhLmxlbmd0aDtcblx0XHR3aGlsZSAoLS1pID4gLTEgJiYgIV9yZXFBbmltRnJhbWUpIHtcblx0XHRcdF9yZXFBbmltRnJhbWUgPSB3aW5kb3dbYVtpXSArIFwiUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdO1xuXHRcdFx0X2NhbmNlbEFuaW1GcmFtZSA9IHdpbmRvd1thW2ldICsgXCJDYW5jZWxBbmltYXRpb25GcmFtZVwiXSB8fCB3aW5kb3dbYVtpXSArIFwiQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdO1xuXHRcdH1cblxuXHRcdF9jbGFzcyhcIlRpY2tlclwiLCBmdW5jdGlvbihmcHMsIHVzZVJBRikge1xuXHRcdFx0dmFyIF9zZWxmID0gdGhpcyxcblx0XHRcdFx0X3N0YXJ0VGltZSA9IF9nZXRUaW1lKCksXG5cdFx0XHRcdF91c2VSQUYgPSAodXNlUkFGICE9PSBmYWxzZSAmJiBfcmVxQW5pbUZyYW1lKSA/IFwiYXV0b1wiIDogZmFsc2UsXG5cdFx0XHRcdF9sYWdUaHJlc2hvbGQgPSA1MDAsXG5cdFx0XHRcdF9hZGp1c3RlZExhZyA9IDMzLFxuXHRcdFx0XHRfdGlja1dvcmQgPSBcInRpY2tcIiwgLy9oZWxwcyByZWR1Y2UgZ2MgYnVyZGVuXG5cdFx0XHRcdF9mcHMsIF9yZXEsIF9pZCwgX2dhcCwgX25leHRUaW1lLFxuXHRcdFx0XHRfdGljayA9IGZ1bmN0aW9uKG1hbnVhbCkge1xuXHRcdFx0XHRcdHZhciBlbGFwc2VkID0gX2dldFRpbWUoKSAtIF9sYXN0VXBkYXRlLFxuXHRcdFx0XHRcdFx0b3ZlcmxhcCwgZGlzcGF0Y2g7XG5cdFx0XHRcdFx0aWYgKGVsYXBzZWQgPiBfbGFnVGhyZXNob2xkKSB7XG5cdFx0XHRcdFx0XHRfc3RhcnRUaW1lICs9IGVsYXBzZWQgLSBfYWRqdXN0ZWRMYWc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdF9sYXN0VXBkYXRlICs9IGVsYXBzZWQ7XG5cdFx0XHRcdFx0X3NlbGYudGltZSA9IChfbGFzdFVwZGF0ZSAtIF9zdGFydFRpbWUpIC8gMTAwMDtcblx0XHRcdFx0XHRvdmVybGFwID0gX3NlbGYudGltZSAtIF9uZXh0VGltZTtcblx0XHRcdFx0XHRpZiAoIV9mcHMgfHwgb3ZlcmxhcCA+IDAgfHwgbWFudWFsID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRfc2VsZi5mcmFtZSsrO1xuXHRcdFx0XHRcdFx0X25leHRUaW1lICs9IG92ZXJsYXAgKyAob3ZlcmxhcCA+PSBfZ2FwID8gMC4wMDQgOiBfZ2FwIC0gb3ZlcmxhcCk7XG5cdFx0XHRcdFx0XHRkaXNwYXRjaCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChtYW51YWwgIT09IHRydWUpIHsgLy9tYWtlIHN1cmUgdGhlIHJlcXVlc3QgaXMgbWFkZSBiZWZvcmUgd2UgZGlzcGF0Y2ggdGhlIFwidGlja1wiIGV2ZW50IHNvIHRoYXQgdGltaW5nIGlzIG1haW50YWluZWQuIE90aGVyd2lzZSwgaWYgcHJvY2Vzc2luZyB0aGUgXCJ0aWNrXCIgcmVxdWlyZXMgYSBidW5jaCBvZiB0aW1lIChsaWtlIDE1bXMpIGFuZCB3ZSdyZSB1c2luZyBhIHNldFRpbWVvdXQoKSB0aGF0J3MgYmFzZWQgb24gMTYuN21zLCBpdCdkIHRlY2huaWNhbGx5IHRha2UgMzEuN21zIGJldHdlZW4gZnJhbWVzIG90aGVyd2lzZS5cblx0XHRcdFx0XHRcdF9pZCA9IF9yZXEoX3RpY2spO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoZGlzcGF0Y2gpIHtcblx0XHRcdFx0XHRcdF9zZWxmLmRpc3BhdGNoRXZlbnQoX3RpY2tXb3JkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdEV2ZW50RGlzcGF0Y2hlci5jYWxsKF9zZWxmKTtcblx0XHRcdF9zZWxmLnRpbWUgPSBfc2VsZi5mcmFtZSA9IDA7XG5cdFx0XHRfc2VsZi50aWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdF90aWNrKHRydWUpO1xuXHRcdFx0fTtcblxuXHRcdFx0X3NlbGYubGFnU21vb3RoaW5nID0gZnVuY3Rpb24odGhyZXNob2xkLCBhZGp1c3RlZExhZykge1xuXHRcdFx0XHRfbGFnVGhyZXNob2xkID0gdGhyZXNob2xkIHx8ICgxIC8gX3RpbnlOdW0pOyAvL3plcm8gc2hvdWxkIGJlIGludGVycHJldGVkIGFzIGJhc2ljYWxseSB1bmxpbWl0ZWRcblx0XHRcdFx0X2FkanVzdGVkTGFnID0gTWF0aC5taW4oYWRqdXN0ZWRMYWcsIF9sYWdUaHJlc2hvbGQsIDApO1xuXHRcdFx0fTtcblxuXHRcdFx0X3NlbGYuc2xlZXAgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKF9pZCA9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghX3VzZVJBRiB8fCAhX2NhbmNlbEFuaW1GcmFtZSkge1xuXHRcdFx0XHRcdGNsZWFyVGltZW91dChfaWQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdF9jYW5jZWxBbmltRnJhbWUoX2lkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRfcmVxID0gX2VtcHR5RnVuYztcblx0XHRcdFx0X2lkID0gbnVsbDtcblx0XHRcdFx0aWYgKF9zZWxmID09PSBfdGlja2VyKSB7XG5cdFx0XHRcdFx0X3RpY2tlckFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRfc2VsZi53YWtlID0gZnVuY3Rpb24oc2VhbWxlc3MpIHtcblx0XHRcdFx0aWYgKF9pZCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdF9zZWxmLnNsZWVwKCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoc2VhbWxlc3MpIHtcblx0XHRcdFx0XHRfc3RhcnRUaW1lICs9IC1fbGFzdFVwZGF0ZSArIChfbGFzdFVwZGF0ZSA9IF9nZXRUaW1lKCkpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKF9zZWxmLmZyYW1lID4gMTApIHsgLy9kb24ndCB0cmlnZ2VyIGxhZ1Ntb290aGluZyBpZiB3ZSdyZSBqdXN0IHdha2luZyB1cCwgYW5kIG1ha2Ugc3VyZSB0aGF0IGF0IGxlYXN0IDEwIGZyYW1lcyBoYXZlIGVsYXBzZWQgYmVjYXVzZSBvZiB0aGUgaU9TIGJ1ZyB0aGF0IHdlIHdvcmsgYXJvdW5kIGJlbG93IHdpdGggdGhlIDEuNS1zZWNvbmQgc2V0VGltb3V0KCkuXG5cdFx0XHRcdFx0X2xhc3RVcGRhdGUgPSBfZ2V0VGltZSgpIC0gX2xhZ1RocmVzaG9sZCArIDU7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3JlcSA9IChfZnBzID09PSAwKSA/IF9lbXB0eUZ1bmMgOiAoIV91c2VSQUYgfHwgIV9yZXFBbmltRnJhbWUpID8gZnVuY3Rpb24oZikgeyByZXR1cm4gc2V0VGltZW91dChmLCAoKF9uZXh0VGltZSAtIF9zZWxmLnRpbWUpICogMTAwMCArIDEpIHwgMCk7IH0gOiBfcmVxQW5pbUZyYW1lO1xuXHRcdFx0XHRpZiAoX3NlbGYgPT09IF90aWNrZXIpIHtcblx0XHRcdFx0XHRfdGlja2VyQWN0aXZlID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRfdGljaygyKTtcblx0XHRcdH07XG5cblx0XHRcdF9zZWxmLmZwcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJldHVybiBfZnBzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF9mcHMgPSB2YWx1ZTtcblx0XHRcdFx0X2dhcCA9IDEgLyAoX2ZwcyB8fCA2MCk7XG5cdFx0XHRcdF9uZXh0VGltZSA9IHRoaXMudGltZSArIF9nYXA7XG5cdFx0XHRcdF9zZWxmLndha2UoKTtcblx0XHRcdH07XG5cblx0XHRcdF9zZWxmLnVzZVJBRiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJldHVybiBfdXNlUkFGO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF9zZWxmLnNsZWVwKCk7XG5cdFx0XHRcdF91c2VSQUYgPSB2YWx1ZTtcblx0XHRcdFx0X3NlbGYuZnBzKF9mcHMpO1xuXHRcdFx0fTtcblx0XHRcdF9zZWxmLmZwcyhmcHMpO1xuXG5cdFx0XHQvL2EgYnVnIGluIGlPUyA2IFNhZmFyaSBvY2Nhc2lvbmFsbHkgcHJldmVudHMgdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZSBmcm9tIHdvcmtpbmcgaW5pdGlhbGx5LCBzbyB3ZSB1c2UgYSAxLjUtc2Vjb25kIHRpbWVvdXQgdGhhdCBhdXRvbWF0aWNhbGx5IGZhbGxzIGJhY2sgdG8gc2V0VGltZW91dCgpIGlmIGl0IHNlbnNlcyB0aGlzIGNvbmRpdGlvbi5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChfdXNlUkFGID09PSBcImF1dG9cIiAmJiBfc2VsZi5mcmFtZSA8IDUgJiYgZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlICE9PSBcImhpZGRlblwiKSB7XG5cdFx0XHRcdFx0X3NlbGYudXNlUkFGKGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgMTUwMCk7XG5cdFx0fSk7XG5cblx0XHRwID0gZ3MuVGlja2VyLnByb3RvdHlwZSA9IG5ldyBncy5ldmVudHMuRXZlbnREaXNwYXRjaGVyKCk7XG5cdFx0cC5jb25zdHJ1Y3RvciA9IGdzLlRpY2tlcjtcblxuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQW5pbWF0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0XHR2YXIgQW5pbWF0aW9uID0gX2NsYXNzKFwiY29yZS5BbmltYXRpb25cIiwgZnVuY3Rpb24oZHVyYXRpb24sIHZhcnMpIHtcblx0XHRcdFx0dGhpcy52YXJzID0gdmFycyA9IHZhcnMgfHwge307XG5cdFx0XHRcdHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fdG90YWxEdXJhdGlvbiA9IGR1cmF0aW9uIHx8IDA7XG5cdFx0XHRcdHRoaXMuX2RlbGF5ID0gTnVtYmVyKHZhcnMuZGVsYXkpIHx8IDA7XG5cdFx0XHRcdHRoaXMuX3RpbWVTY2FsZSA9IDE7XG5cdFx0XHRcdHRoaXMuX2FjdGl2ZSA9ICh2YXJzLmltbWVkaWF0ZVJlbmRlciA9PT0gdHJ1ZSk7XG5cdFx0XHRcdHRoaXMuZGF0YSA9IHZhcnMuZGF0YTtcblx0XHRcdFx0dGhpcy5fcmV2ZXJzZWQgPSAodmFycy5yZXZlcnNlZCA9PT0gdHJ1ZSk7XG5cblx0XHRcdFx0aWYgKCFfcm9vdFRpbWVsaW5lKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghX3RpY2tlckFjdGl2ZSkgeyAvL3NvbWUgYnJvd3NlcnMgKGxpa2UgaU9TIDYgU2FmYXJpKSBzaHV0IGRvd24gSmF2YVNjcmlwdCBleGVjdXRpb24gd2hlbiB0aGUgdGFiIGlzIGRpc2FibGVkIGFuZCB0aGV5IFtvY2Nhc2lvbmFsbHldIG5lZ2xlY3QgdG8gc3RhcnQgdXAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGFnYWluIHdoZW4gcmV0dXJuaW5nIC0gdGhpcyBjb2RlIGVuc3VyZXMgdGhhdCB0aGUgZW5naW5lIHN0YXJ0cyB1cCBhZ2FpbiBwcm9wZXJseS5cblx0XHRcdFx0XHRfdGlja2VyLndha2UoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciB0bCA9IHRoaXMudmFycy51c2VGcmFtZXMgPyBfcm9vdEZyYW1lc1RpbWVsaW5lIDogX3Jvb3RUaW1lbGluZTtcblx0XHRcdFx0dGwuYWRkKHRoaXMsIHRsLl90aW1lKTtcblxuXHRcdFx0XHRpZiAodGhpcy52YXJzLnBhdXNlZCkge1xuXHRcdFx0XHRcdHRoaXMucGF1c2VkKHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdF90aWNrZXIgPSBBbmltYXRpb24udGlja2VyID0gbmV3IGdzLlRpY2tlcigpO1xuXHRcdHAgPSBBbmltYXRpb24ucHJvdG90eXBlO1xuXHRcdHAuX2RpcnR5ID0gcC5fZ2MgPSBwLl9pbml0dGVkID0gcC5fcGF1c2VkID0gZmFsc2U7XG5cdFx0cC5fdG90YWxUaW1lID0gcC5fdGltZSA9IDA7XG5cdFx0cC5fcmF3UHJldlRpbWUgPSAtMTtcblx0XHRwLl9uZXh0ID0gcC5fbGFzdCA9IHAuX29uVXBkYXRlID0gcC5fdGltZWxpbmUgPSBwLnRpbWVsaW5lID0gbnVsbDtcblx0XHRwLl9wYXVzZWQgPSBmYWxzZTtcblxuXG5cdFx0Ly9zb21lIGJyb3dzZXJzIChsaWtlIGlPUykgb2NjYXNpb25hbGx5IGRyb3AgdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZSBldmVudCB3aGVuIHRoZSB1c2VyIHN3aXRjaGVzIHRvIGEgZGlmZmVyZW50IHRhYiBhbmQgdGhlbiBjb21lcyBiYWNrIGFnYWluLCBzbyB3ZSB1c2UgYSAyLXNlY29uZCBzZXRUaW1lb3V0KCkgdG8gc2Vuc2UgaWYvd2hlbiB0aGF0IGNvbmRpdGlvbiBvY2N1cnMgYW5kIHRoZW4gd2FrZSgpIHRoZSB0aWNrZXIuXG5cdFx0dmFyIF9jaGVja1RpbWVvdXQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKF90aWNrZXJBY3RpdmUgJiYgX2dldFRpbWUoKSAtIF9sYXN0VXBkYXRlID4gMjAwMCkge1xuXHRcdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNldFRpbWVvdXQoX2NoZWNrVGltZW91dCwgMjAwMCk7XG5cdFx0XHR9O1xuXHRcdF9jaGVja1RpbWVvdXQoKTtcblxuXG5cdFx0cC5wbGF5ID0gZnVuY3Rpb24oZnJvbSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdGlmIChmcm9tICE9IG51bGwpIHtcblx0XHRcdFx0dGhpcy5zZWVrKGZyb20sIHN1cHByZXNzRXZlbnRzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnJldmVyc2VkKGZhbHNlKS5wYXVzZWQoZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLnBhdXNlID0gZnVuY3Rpb24oYXRUaW1lLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0aWYgKGF0VGltZSAhPSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuc2VlayhhdFRpbWUsIHN1cHByZXNzRXZlbnRzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnBhdXNlZCh0cnVlKTtcblx0XHR9O1xuXG5cdFx0cC5yZXN1bWUgPSBmdW5jdGlvbihmcm9tLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0aWYgKGZyb20gIT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLnNlZWsoZnJvbSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMucGF1c2VkKGZhbHNlKTtcblx0XHR9O1xuXG5cdFx0cC5zZWVrID0gZnVuY3Rpb24odGltZSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdHJldHVybiB0aGlzLnRvdGFsVGltZShOdW1iZXIodGltZSksIHN1cHByZXNzRXZlbnRzICE9PSBmYWxzZSk7XG5cdFx0fTtcblxuXHRcdHAucmVzdGFydCA9IGZ1bmN0aW9uKGluY2x1ZGVEZWxheSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdHJldHVybiB0aGlzLnJldmVyc2VkKGZhbHNlKS5wYXVzZWQoZmFsc2UpLnRvdGFsVGltZShpbmNsdWRlRGVsYXkgPyAtdGhpcy5fZGVsYXkgOiAwLCAoc3VwcHJlc3NFdmVudHMgIT09IGZhbHNlKSwgdHJ1ZSk7XG5cdFx0fTtcblxuXHRcdHAucmV2ZXJzZSA9IGZ1bmN0aW9uKGZyb20sIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRpZiAoZnJvbSAhPSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuc2VlaygoZnJvbSB8fCB0aGlzLnRvdGFsRHVyYXRpb24oKSksIHN1cHByZXNzRXZlbnRzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnJldmVyc2VkKHRydWUpLnBhdXNlZChmYWxzZSk7XG5cdFx0fTtcblxuXHRcdHAucmVuZGVyID0gZnVuY3Rpb24odGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKSB7XG5cdFx0XHQvL3N0dWIgLSB3ZSBvdmVycmlkZSB0aGlzIG1ldGhvZCBpbiBzdWJjbGFzc2VzLlxuXHRcdH07XG5cblx0XHRwLmludmFsaWRhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuX3RpbWUgPSB0aGlzLl90b3RhbFRpbWUgPSAwO1xuXHRcdFx0dGhpcy5faW5pdHRlZCA9IHRoaXMuX2djID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IC0xO1xuXHRcdFx0aWYgKHRoaXMuX2djIHx8ICF0aGlzLnRpbWVsaW5lKSB7XG5cdFx0XHRcdHRoaXMuX2VuYWJsZWQodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5pc0FjdGl2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRsID0gdGhpcy5fdGltZWxpbmUsIC8vdGhlIDIgcm9vdCB0aW1lbGluZXMgd29uJ3QgaGF2ZSBhIF90aW1lbGluZTsgdGhleSdyZSBhbHdheXMgYWN0aXZlLlxuXHRcdFx0XHRzdGFydFRpbWUgPSB0aGlzLl9zdGFydFRpbWUsXG5cdFx0XHRcdHJhd1RpbWU7XG5cdFx0XHRyZXR1cm4gKCF0bCB8fCAoIXRoaXMuX2djICYmICF0aGlzLl9wYXVzZWQgJiYgdGwuaXNBY3RpdmUoKSAmJiAocmF3VGltZSA9IHRsLnJhd1RpbWUoKSkgPj0gc3RhcnRUaW1lICYmIHJhd1RpbWUgPCBzdGFydFRpbWUgKyB0aGlzLnRvdGFsRHVyYXRpb24oKSAvIHRoaXMuX3RpbWVTY2FsZSkpO1xuXHRcdH07XG5cblx0XHRwLl9lbmFibGVkID0gZnVuY3Rpb24gKGVuYWJsZWQsIGlnbm9yZVRpbWVsaW5lKSB7XG5cdFx0XHRpZiAoIV90aWNrZXJBY3RpdmUpIHtcblx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9nYyA9ICFlbmFibGVkO1xuXHRcdFx0dGhpcy5fYWN0aXZlID0gdGhpcy5pc0FjdGl2ZSgpO1xuXHRcdFx0aWYgKGlnbm9yZVRpbWVsaW5lICE9PSB0cnVlKSB7XG5cdFx0XHRcdGlmIChlbmFibGVkICYmICF0aGlzLnRpbWVsaW5lKSB7XG5cdFx0XHRcdFx0dGhpcy5fdGltZWxpbmUuYWRkKHRoaXMsIHRoaXMuX3N0YXJ0VGltZSAtIHRoaXMuX2RlbGF5KTtcblx0XHRcdFx0fSBlbHNlIGlmICghZW5hYmxlZCAmJiB0aGlzLnRpbWVsaW5lKSB7XG5cdFx0XHRcdFx0dGhpcy5fdGltZWxpbmUuX3JlbW92ZSh0aGlzLCB0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cblxuXHRcdHAuX2tpbGwgPSBmdW5jdGlvbih2YXJzLCB0YXJnZXQpIHtcblx0XHRcdHJldHVybiB0aGlzLl9lbmFibGVkKGZhbHNlLCBmYWxzZSk7XG5cdFx0fTtcblxuXHRcdHAua2lsbCA9IGZ1bmN0aW9uKHZhcnMsIHRhcmdldCkge1xuXHRcdFx0dGhpcy5fa2lsbCh2YXJzLCB0YXJnZXQpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuX3VuY2FjaGUgPSBmdW5jdGlvbihpbmNsdWRlU2VsZikge1xuXHRcdFx0dmFyIHR3ZWVuID0gaW5jbHVkZVNlbGYgPyB0aGlzIDogdGhpcy50aW1lbGluZTtcblx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHR0d2Vlbi5fZGlydHkgPSB0cnVlO1xuXHRcdFx0XHR0d2VlbiA9IHR3ZWVuLnRpbWVsaW5lO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuX3N3YXBTZWxmSW5QYXJhbXMgPSBmdW5jdGlvbihwYXJhbXMpIHtcblx0XHRcdHZhciBpID0gcGFyYW1zLmxlbmd0aCxcblx0XHRcdFx0Y29weSA9IHBhcmFtcy5jb25jYXQoKTtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRpZiAocGFyYW1zW2ldID09PSBcIntzZWxmfVwiKSB7XG5cdFx0XHRcdFx0Y29weVtpXSA9IHRoaXM7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBjb3B5O1xuXHRcdH07XG5cblx0XHRwLl9jYWxsYmFjayA9IGZ1bmN0aW9uKHR5cGUpIHtcblx0XHRcdHZhciB2ID0gdGhpcy52YXJzLFxuXHRcdFx0XHRjYWxsYmFjayA9IHZbdHlwZV0sXG5cdFx0XHRcdHBhcmFtcyA9IHZbdHlwZSArIFwiUGFyYW1zXCJdLFxuXHRcdFx0XHRzY29wZSA9IHZbdHlwZSArIFwiU2NvcGVcIl0gfHwgdi5jYWxsYmFja1Njb3BlIHx8IHRoaXMsXG5cdFx0XHRcdGwgPSBwYXJhbXMgPyBwYXJhbXMubGVuZ3RoIDogMDtcblx0XHRcdHN3aXRjaCAobCkgeyAvL3NwZWVkIG9wdGltaXphdGlvbjsgY2FsbCgpIGlzIGZhc3RlciB0aGFuIGFwcGx5KCkgc28gdXNlIGl0IHdoZW4gdGhlcmUgYXJlIG9ubHkgYSBmZXcgcGFyYW1ldGVycyAod2hpY2ggaXMgYnkgZmFyIG1vc3QgY29tbW9uKS4gUHJldmlvdXNseSB3ZSBzaW1wbHkgZGlkIHZhciB2ID0gdGhpcy52YXJzOyB2W3R5cGVdLmFwcGx5KHZbdHlwZSArIFwiU2NvcGVcIl0gfHwgdi5jYWxsYmFja1Njb3BlIHx8IHRoaXMsIHZbdHlwZSArIFwiUGFyYW1zXCJdIHx8IF9ibGFua0FycmF5KTtcblx0XHRcdFx0Y2FzZSAwOiBjYWxsYmFjay5jYWxsKHNjb3BlKTsgYnJlYWs7XG5cdFx0XHRcdGNhc2UgMTogY2FsbGJhY2suY2FsbChzY29wZSwgcGFyYW1zWzBdKTsgYnJlYWs7XG5cdFx0XHRcdGNhc2UgMjogY2FsbGJhY2suY2FsbChzY29wZSwgcGFyYW1zWzBdLCBwYXJhbXNbMV0pOyBicmVhaztcblx0XHRcdFx0ZGVmYXVsdDogY2FsbGJhY2suYXBwbHkoc2NvcGUsIHBhcmFtcyk7XG5cdFx0XHR9XG5cdFx0fTtcblxuLy8tLS0tQW5pbWF0aW9uIGdldHRlcnMvc2V0dGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0cC5ldmVudENhbGxiYWNrID0gZnVuY3Rpb24odHlwZSwgY2FsbGJhY2ssIHBhcmFtcywgc2NvcGUpIHtcblx0XHRcdGlmICgodHlwZSB8fCBcIlwiKS5zdWJzdHIoMCwyKSA9PT0gXCJvblwiKSB7XG5cdFx0XHRcdHZhciB2ID0gdGhpcy52YXJzO1xuXHRcdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdHJldHVybiB2W3R5cGVdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjYWxsYmFjayA9PSBudWxsKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHZbdHlwZV07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dlt0eXBlXSA9IGNhbGxiYWNrO1xuXHRcdFx0XHRcdHZbdHlwZSArIFwiUGFyYW1zXCJdID0gKF9pc0FycmF5KHBhcmFtcykgJiYgcGFyYW1zLmpvaW4oXCJcIikuaW5kZXhPZihcIntzZWxmfVwiKSAhPT0gLTEpID8gdGhpcy5fc3dhcFNlbGZJblBhcmFtcyhwYXJhbXMpIDogcGFyYW1zO1xuXHRcdFx0XHRcdHZbdHlwZSArIFwiU2NvcGVcIl0gPSBzY29wZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHlwZSA9PT0gXCJvblVwZGF0ZVwiKSB7XG5cdFx0XHRcdFx0dGhpcy5fb25VcGRhdGUgPSBjYWxsYmFjaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuZGVsYXkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9kZWxheTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZykge1xuXHRcdFx0XHR0aGlzLnN0YXJ0VGltZSggdGhpcy5fc3RhcnRUaW1lICsgdmFsdWUgLSB0aGlzLl9kZWxheSApO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZGVsYXkgPSB2YWx1ZTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLmR1cmF0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHR0aGlzLl9kaXJ0eSA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZHVyYXRpb247XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX3RvdGFsRHVyYXRpb24gPSB2YWx1ZTtcblx0XHRcdHRoaXMuX3VuY2FjaGUodHJ1ZSk7IC8vdHJ1ZSBpbiBjYXNlIGl0J3MgYSBUd2Vlbk1heCBvciBUaW1lbGluZU1heCB0aGF0IGhhcyBhIHJlcGVhdCAtIHdlJ2xsIG5lZWQgdG8gcmVmcmVzaCB0aGUgdG90YWxEdXJhdGlvbi5cblx0XHRcdGlmICh0aGlzLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZykgaWYgKHRoaXMuX3RpbWUgPiAwKSBpZiAodGhpcy5fdGltZSA8IHRoaXMuX2R1cmF0aW9uKSBpZiAodmFsdWUgIT09IDApIHtcblx0XHRcdFx0dGhpcy50b3RhbFRpbWUodGhpcy5fdG90YWxUaW1lICogKHZhbHVlIC8gdGhpcy5fZHVyYXRpb24pLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnRvdGFsRHVyYXRpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dGhpcy5fZGlydHkgPSBmYWxzZTtcblx0XHRcdHJldHVybiAoIWFyZ3VtZW50cy5sZW5ndGgpID8gdGhpcy5fdG90YWxEdXJhdGlvbiA6IHRoaXMuZHVyYXRpb24odmFsdWUpO1xuXHRcdH07XG5cblx0XHRwLnRpbWUgPSBmdW5jdGlvbih2YWx1ZSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fdGltZTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9kaXJ0eSkge1xuXHRcdFx0XHR0aGlzLnRvdGFsRHVyYXRpb24oKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnRvdGFsVGltZSgodmFsdWUgPiB0aGlzLl9kdXJhdGlvbikgPyB0aGlzLl9kdXJhdGlvbiA6IHZhbHVlLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0fTtcblxuXHRcdHAudG90YWxUaW1lID0gZnVuY3Rpb24odGltZSwgc3VwcHJlc3NFdmVudHMsIHVuY2FwcGVkKSB7XG5cdFx0XHRpZiAoIV90aWNrZXJBY3RpdmUpIHtcblx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RvdGFsVGltZTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl90aW1lbGluZSkge1xuXHRcdFx0XHRpZiAodGltZSA8IDAgJiYgIXVuY2FwcGVkKSB7XG5cdFx0XHRcdFx0dGltZSArPSB0aGlzLnRvdGFsRHVyYXRpb24oKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5fZGlydHkpIHtcblx0XHRcdFx0XHRcdHRoaXMudG90YWxEdXJhdGlvbigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgdG90YWxEdXJhdGlvbiA9IHRoaXMuX3RvdGFsRHVyYXRpb24sXG5cdFx0XHRcdFx0XHR0bCA9IHRoaXMuX3RpbWVsaW5lO1xuXHRcdFx0XHRcdGlmICh0aW1lID4gdG90YWxEdXJhdGlvbiAmJiAhdW5jYXBwZWQpIHtcblx0XHRcdFx0XHRcdHRpbWUgPSB0b3RhbER1cmF0aW9uO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9zdGFydFRpbWUgPSAodGhpcy5fcGF1c2VkID8gdGhpcy5fcGF1c2VUaW1lIDogdGwuX3RpbWUpIC0gKCghdGhpcy5fcmV2ZXJzZWQgPyB0aW1lIDogdG90YWxEdXJhdGlvbiAtIHRpbWUpIC8gdGhpcy5fdGltZVNjYWxlKTtcblx0XHRcdFx0XHRpZiAoIXRsLl9kaXJ0eSkgeyAvL2ZvciBwZXJmb3JtYW5jZSBpbXByb3ZlbWVudC4gSWYgdGhlIHBhcmVudCdzIGNhY2hlIGlzIGFscmVhZHkgZGlydHksIGl0IGFscmVhZHkgdG9vayBjYXJlIG9mIG1hcmtpbmcgdGhlIGFuY2VzdG9ycyBhcyBkaXJ0eSB0b28sIHNvIHNraXAgdGhlIGZ1bmN0aW9uIGNhbGwgaGVyZS5cblx0XHRcdFx0XHRcdHRoaXMuX3VuY2FjaGUoZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL2luIGNhc2UgYW55IG9mIHRoZSBhbmNlc3RvciB0aW1lbGluZXMgaGFkIGNvbXBsZXRlZCBidXQgc2hvdWxkIG5vdyBiZSBlbmFibGVkLCB3ZSBzaG91bGQgcmVzZXQgdGhlaXIgdG90YWxUaW1lKCkgd2hpY2ggd2lsbCBhbHNvIGVuc3VyZSB0aGF0IHRoZXkncmUgbGluZWQgdXAgcHJvcGVybHkgYW5kIGVuYWJsZWQuIFNraXAgZm9yIGFuaW1hdGlvbnMgdGhhdCBhcmUgb24gdGhlIHJvb3QgKHdhc3RlZnVsKS4gRXhhbXBsZTogYSBUaW1lbGluZUxpdGUuZXhwb3J0Um9vdCgpIGlzIHBlcmZvcm1lZCB3aGVuIHRoZXJlJ3MgYSBwYXVzZWQgdHdlZW4gb24gdGhlIHJvb3QsIHRoZSBleHBvcnQgd2lsbCBub3QgY29tcGxldGUgdW50aWwgdGhhdCB0d2VlbiBpcyB1bnBhdXNlZCwgYnV0IGltYWdpbmUgYSBjaGlsZCBnZXRzIHJlc3RhcnRlZCBsYXRlciwgYWZ0ZXIgYWxsIFt1bnBhdXNlZF0gdHdlZW5zIGhhdmUgY29tcGxldGVkLiBUaGUgc3RhcnRUaW1lIG9mIHRoYXQgY2hpbGQgd291bGQgZ2V0IHB1c2hlZCBvdXQsIGJ1dCBvbmUgb2YgdGhlIGFuY2VzdG9ycyBtYXkgaGF2ZSBjb21wbGV0ZWQuXG5cdFx0XHRcdFx0aWYgKHRsLl90aW1lbGluZSkge1xuXHRcdFx0XHRcdFx0d2hpbGUgKHRsLl90aW1lbGluZSkge1xuXHRcdFx0XHRcdFx0XHRpZiAodGwuX3RpbWVsaW5lLl90aW1lICE9PSAodGwuX3N0YXJ0VGltZSArIHRsLl90b3RhbFRpbWUpIC8gdGwuX3RpbWVTY2FsZSkge1xuXHRcdFx0XHRcdFx0XHRcdHRsLnRvdGFsVGltZSh0bC5fdG90YWxUaW1lLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR0bCA9IHRsLl90aW1lbGluZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMuX2djKSB7XG5cdFx0XHRcdFx0dGhpcy5fZW5hYmxlZCh0cnVlLCBmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMuX3RvdGFsVGltZSAhPT0gdGltZSB8fCB0aGlzLl9kdXJhdGlvbiA9PT0gMCkge1xuXHRcdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdF9sYXp5UmVuZGVyKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMucmVuZGVyKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmYWxzZSk7XG5cdFx0XHRcdFx0aWYgKF9sYXp5VHdlZW5zLmxlbmd0aCkgeyAvL2luIGNhc2UgcmVuZGVyaW5nIGNhdXNlZCBhbnkgdHdlZW5zIHRvIGxhenktaW5pdCwgd2Ugc2hvdWxkIHJlbmRlciB0aGVtIGJlY2F1c2UgdHlwaWNhbGx5IHdoZW4gc29tZW9uZSBjYWxscyBzZWVrKCkgb3IgdGltZSgpIG9yIHByb2dyZXNzKCksIHRoZXkgZXhwZWN0IGFuIGltbWVkaWF0ZSByZW5kZXIuXG5cdFx0XHRcdFx0XHRfbGF6eVJlbmRlcigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAucHJvZ3Jlc3MgPSBwLnRvdGFsUHJvZ3Jlc3MgPSBmdW5jdGlvbih2YWx1ZSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdHZhciBkdXJhdGlvbiA9IHRoaXMuZHVyYXRpb24oKTtcblx0XHRcdHJldHVybiAoIWFyZ3VtZW50cy5sZW5ndGgpID8gKGR1cmF0aW9uID8gdGhpcy5fdGltZSAvIGR1cmF0aW9uIDogdGhpcy5yYXRpbykgOiB0aGlzLnRvdGFsVGltZShkdXJhdGlvbiAqIHZhbHVlLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0fTtcblxuXHRcdHAuc3RhcnRUaW1lID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fc3RhcnRUaW1lO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZhbHVlICE9PSB0aGlzLl9zdGFydFRpbWUpIHtcblx0XHRcdFx0dGhpcy5fc3RhcnRUaW1lID0gdmFsdWU7XG5cdFx0XHRcdGlmICh0aGlzLnRpbWVsaW5lKSBpZiAodGhpcy50aW1lbGluZS5fc29ydENoaWxkcmVuKSB7XG5cdFx0XHRcdFx0dGhpcy50aW1lbGluZS5hZGQodGhpcywgdmFsdWUgLSB0aGlzLl9kZWxheSk7IC8vZW5zdXJlcyB0aGF0IGFueSBuZWNlc3NhcnkgcmUtc2VxdWVuY2luZyBvZiBBbmltYXRpb25zIGluIHRoZSB0aW1lbGluZSBvY2N1cnMgdG8gbWFrZSBzdXJlIHRoZSByZW5kZXJpbmcgb3JkZXIgaXMgY29ycmVjdC5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuZW5kVGltZSA9IGZ1bmN0aW9uKGluY2x1ZGVSZXBlYXRzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fc3RhcnRUaW1lICsgKChpbmNsdWRlUmVwZWF0cyAhPSBmYWxzZSkgPyB0aGlzLnRvdGFsRHVyYXRpb24oKSA6IHRoaXMuZHVyYXRpb24oKSkgLyB0aGlzLl90aW1lU2NhbGU7XG5cdFx0fTtcblxuXHRcdHAudGltZVNjYWxlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fdGltZVNjYWxlO1xuXHRcdFx0fVxuXHRcdFx0dmFsdWUgPSB2YWx1ZSB8fCBfdGlueU51bTsgLy9jYW4ndCBhbGxvdyB6ZXJvIGJlY2F1c2UgaXQnbGwgdGhyb3cgdGhlIG1hdGggb2ZmXG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUgJiYgdGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpIHtcblx0XHRcdFx0dmFyIHBhdXNlVGltZSA9IHRoaXMuX3BhdXNlVGltZSxcblx0XHRcdFx0XHR0ID0gKHBhdXNlVGltZSB8fCBwYXVzZVRpbWUgPT09IDApID8gcGF1c2VUaW1lIDogdGhpcy5fdGltZWxpbmUudG90YWxUaW1lKCk7XG5cdFx0XHRcdHRoaXMuX3N0YXJ0VGltZSA9IHQgLSAoKHQgLSB0aGlzLl9zdGFydFRpbWUpICogdGhpcy5fdGltZVNjYWxlIC8gdmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fdGltZVNjYWxlID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5jYWNoZShmYWxzZSk7XG5cdFx0fTtcblxuXHRcdHAucmV2ZXJzZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9yZXZlcnNlZDtcblx0XHRcdH1cblx0XHRcdGlmICh2YWx1ZSAhPSB0aGlzLl9yZXZlcnNlZCkge1xuXHRcdFx0XHR0aGlzLl9yZXZlcnNlZCA9IHZhbHVlO1xuXHRcdFx0XHR0aGlzLnRvdGFsVGltZSgoKHRoaXMuX3RpbWVsaW5lICYmICF0aGlzLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZykgPyB0aGlzLnRvdGFsRHVyYXRpb24oKSAtIHRoaXMuX3RvdGFsVGltZSA6IHRoaXMuX3RvdGFsVGltZSksIHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAucGF1c2VkID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcGF1c2VkO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHRsID0gdGhpcy5fdGltZWxpbmUsXG5cdFx0XHRcdHJhdywgZWxhcHNlZDtcblx0XHRcdGlmICh2YWx1ZSAhPSB0aGlzLl9wYXVzZWQpIGlmICh0bCkge1xuXHRcdFx0XHRpZiAoIV90aWNrZXJBY3RpdmUgJiYgIXZhbHVlKSB7XG5cdFx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmF3ID0gdGwucmF3VGltZSgpO1xuXHRcdFx0XHRlbGFwc2VkID0gcmF3IC0gdGhpcy5fcGF1c2VUaW1lO1xuXHRcdFx0XHRpZiAoIXZhbHVlICYmIHRsLnNtb290aENoaWxkVGltaW5nKSB7XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRUaW1lICs9IGVsYXBzZWQ7XG5cdFx0XHRcdFx0dGhpcy5fdW5jYWNoZShmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fcGF1c2VUaW1lID0gdmFsdWUgPyByYXcgOiBudWxsO1xuXHRcdFx0XHR0aGlzLl9wYXVzZWQgPSB2YWx1ZTtcblx0XHRcdFx0dGhpcy5fYWN0aXZlID0gdGhpcy5pc0FjdGl2ZSgpO1xuXHRcdFx0XHRpZiAoIXZhbHVlICYmIGVsYXBzZWQgIT09IDAgJiYgdGhpcy5faW5pdHRlZCAmJiB0aGlzLmR1cmF0aW9uKCkpIHtcblx0XHRcdFx0XHRyYXcgPSB0bC5zbW9vdGhDaGlsZFRpbWluZyA/IHRoaXMuX3RvdGFsVGltZSA6IChyYXcgLSB0aGlzLl9zdGFydFRpbWUpIC8gdGhpcy5fdGltZVNjYWxlO1xuXHRcdFx0XHRcdHRoaXMucmVuZGVyKHJhdywgKHJhdyA9PT0gdGhpcy5fdG90YWxUaW1lKSwgdHJ1ZSk7IC8vaW4gY2FzZSB0aGUgdGFyZ2V0J3MgcHJvcGVydGllcyBjaGFuZ2VkIHZpYSBzb21lIG90aGVyIHR3ZWVuIG9yIG1hbnVhbCB1cGRhdGUgYnkgdGhlIHVzZXIsIHdlIHNob3VsZCBmb3JjZSBhIHJlbmRlci5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuX2djICYmICF2YWx1ZSkge1xuXHRcdFx0XHR0aGlzLl9lbmFibGVkKHRydWUsIGZhbHNlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFNpbXBsZVRpbWVsaW5lXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0XHR2YXIgU2ltcGxlVGltZWxpbmUgPSBfY2xhc3MoXCJjb3JlLlNpbXBsZVRpbWVsaW5lXCIsIGZ1bmN0aW9uKHZhcnMpIHtcblx0XHRcdEFuaW1hdGlvbi5jYWxsKHRoaXMsIDAsIHZhcnMpO1xuXHRcdFx0dGhpcy5hdXRvUmVtb3ZlQ2hpbGRyZW4gPSB0aGlzLnNtb290aENoaWxkVGltaW5nID0gdHJ1ZTtcblx0XHR9KTtcblxuXHRcdHAgPSBTaW1wbGVUaW1lbGluZS5wcm90b3R5cGUgPSBuZXcgQW5pbWF0aW9uKCk7XG5cdFx0cC5jb25zdHJ1Y3RvciA9IFNpbXBsZVRpbWVsaW5lO1xuXHRcdHAua2lsbCgpLl9nYyA9IGZhbHNlO1xuXHRcdHAuX2ZpcnN0ID0gcC5fbGFzdCA9IHAuX3JlY2VudCA9IG51bGw7XG5cdFx0cC5fc29ydENoaWxkcmVuID0gZmFsc2U7XG5cblx0XHRwLmFkZCA9IHAuaW5zZXJ0ID0gZnVuY3Rpb24oY2hpbGQsIHBvc2l0aW9uLCBhbGlnbiwgc3RhZ2dlcikge1xuXHRcdFx0dmFyIHByZXZUd2Vlbiwgc3Q7XG5cdFx0XHRjaGlsZC5fc3RhcnRUaW1lID0gTnVtYmVyKHBvc2l0aW9uIHx8IDApICsgY2hpbGQuX2RlbGF5O1xuXHRcdFx0aWYgKGNoaWxkLl9wYXVzZWQpIGlmICh0aGlzICE9PSBjaGlsZC5fdGltZWxpbmUpIHsgLy93ZSBvbmx5IGFkanVzdCB0aGUgX3BhdXNlVGltZSBpZiBpdCB3YXNuJ3QgaW4gdGhpcyB0aW1lbGluZSBhbHJlYWR5LiBSZW1lbWJlciwgc29tZXRpbWVzIGEgdHdlZW4gd2lsbCBiZSBpbnNlcnRlZCBhZ2FpbiBpbnRvIHRoZSBzYW1lIHRpbWVsaW5lIHdoZW4gaXRzIHN0YXJ0VGltZSBpcyBjaGFuZ2VkIHNvIHRoYXQgdGhlIHR3ZWVucyBpbiB0aGUgVGltZWxpbmVMaXRlL01heCBhcmUgcmUtb3JkZXJlZCBwcm9wZXJseSBpbiB0aGUgbGlua2VkIGxpc3QgKHNvIGV2ZXJ5dGhpbmcgcmVuZGVycyBpbiB0aGUgcHJvcGVyIG9yZGVyKS5cblx0XHRcdFx0Y2hpbGQuX3BhdXNlVGltZSA9IGNoaWxkLl9zdGFydFRpbWUgKyAoKHRoaXMucmF3VGltZSgpIC0gY2hpbGQuX3N0YXJ0VGltZSkgLyBjaGlsZC5fdGltZVNjYWxlKTtcblx0XHRcdH1cblx0XHRcdGlmIChjaGlsZC50aW1lbGluZSkge1xuXHRcdFx0XHRjaGlsZC50aW1lbGluZS5fcmVtb3ZlKGNoaWxkLCB0cnVlKTsgLy9yZW1vdmVzIGZyb20gZXhpc3RpbmcgdGltZWxpbmUgc28gdGhhdCBpdCBjYW4gYmUgcHJvcGVybHkgYWRkZWQgdG8gdGhpcyBvbmUuXG5cdFx0XHR9XG5cdFx0XHRjaGlsZC50aW1lbGluZSA9IGNoaWxkLl90aW1lbGluZSA9IHRoaXM7XG5cdFx0XHRpZiAoY2hpbGQuX2djKSB7XG5cdFx0XHRcdGNoaWxkLl9lbmFibGVkKHRydWUsIHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0cHJldlR3ZWVuID0gdGhpcy5fbGFzdDtcblx0XHRcdGlmICh0aGlzLl9zb3J0Q2hpbGRyZW4pIHtcblx0XHRcdFx0c3QgPSBjaGlsZC5fc3RhcnRUaW1lO1xuXHRcdFx0XHR3aGlsZSAocHJldlR3ZWVuICYmIHByZXZUd2Vlbi5fc3RhcnRUaW1lID4gc3QpIHtcblx0XHRcdFx0XHRwcmV2VHdlZW4gPSBwcmV2VHdlZW4uX3ByZXY7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChwcmV2VHdlZW4pIHtcblx0XHRcdFx0Y2hpbGQuX25leHQgPSBwcmV2VHdlZW4uX25leHQ7XG5cdFx0XHRcdHByZXZUd2Vlbi5fbmV4dCA9IGNoaWxkO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2hpbGQuX25leHQgPSB0aGlzLl9maXJzdDtcblx0XHRcdFx0dGhpcy5fZmlyc3QgPSBjaGlsZDtcblx0XHRcdH1cblx0XHRcdGlmIChjaGlsZC5fbmV4dCkge1xuXHRcdFx0XHRjaGlsZC5fbmV4dC5fcHJldiA9IGNoaWxkO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fbGFzdCA9IGNoaWxkO1xuXHRcdFx0fVxuXHRcdFx0Y2hpbGQuX3ByZXYgPSBwcmV2VHdlZW47XG5cdFx0XHR0aGlzLl9yZWNlbnQgPSBjaGlsZDtcblx0XHRcdGlmICh0aGlzLl90aW1lbGluZSkge1xuXHRcdFx0XHR0aGlzLl91bmNhY2hlKHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuX3JlbW92ZSA9IGZ1bmN0aW9uKHR3ZWVuLCBza2lwRGlzYWJsZSkge1xuXHRcdFx0aWYgKHR3ZWVuLnRpbWVsaW5lID09PSB0aGlzKSB7XG5cdFx0XHRcdGlmICghc2tpcERpc2FibGUpIHtcblx0XHRcdFx0XHR0d2Vlbi5fZW5hYmxlZChmYWxzZSwgdHJ1ZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodHdlZW4uX3ByZXYpIHtcblx0XHRcdFx0XHR0d2Vlbi5fcHJldi5fbmV4dCA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuX2ZpcnN0ID09PSB0d2Vlbikge1xuXHRcdFx0XHRcdHRoaXMuX2ZpcnN0ID0gdHdlZW4uX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR3ZWVuLl9uZXh0KSB7XG5cdFx0XHRcdFx0dHdlZW4uX25leHQuX3ByZXYgPSB0d2Vlbi5fcHJldjtcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl9sYXN0ID09PSB0d2Vlbikge1xuXHRcdFx0XHRcdHRoaXMuX2xhc3QgPSB0d2Vlbi5fcHJldjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0d2Vlbi5fbmV4dCA9IHR3ZWVuLl9wcmV2ID0gdHdlZW4udGltZWxpbmUgPSBudWxsO1xuXHRcdFx0XHRpZiAodHdlZW4gPT09IHRoaXMuX3JlY2VudCkge1xuXHRcdFx0XHRcdHRoaXMuX3JlY2VudCA9IHRoaXMuX2xhc3Q7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpcy5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHR0aGlzLl91bmNhY2hlKHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5yZW5kZXIgPSBmdW5jdGlvbih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpIHtcblx0XHRcdHZhciB0d2VlbiA9IHRoaXMuX2ZpcnN0LFxuXHRcdFx0XHRuZXh0O1xuXHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdGltZSA9IHRoaXMuX3Jhd1ByZXZUaW1lID0gdGltZTtcblx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHRuZXh0ID0gdHdlZW4uX25leHQ7IC8vcmVjb3JkIGl0IGhlcmUgYmVjYXVzZSB0aGUgdmFsdWUgY291bGQgY2hhbmdlIGFmdGVyIHJlbmRlcmluZy4uLlxuXHRcdFx0XHRpZiAodHdlZW4uX2FjdGl2ZSB8fCAodGltZSA+PSB0d2Vlbi5fc3RhcnRUaW1lICYmICF0d2Vlbi5fcGF1c2VkKSkge1xuXHRcdFx0XHRcdGlmICghdHdlZW4uX3JldmVyc2VkKSB7XG5cdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIoKHRpbWUgLSB0d2Vlbi5fc3RhcnRUaW1lKSAqIHR3ZWVuLl90aW1lU2NhbGUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHR3ZWVuLnJlbmRlcigoKCF0d2Vlbi5fZGlydHkpID8gdHdlZW4uX3RvdGFsRHVyYXRpb24gOiB0d2Vlbi50b3RhbER1cmF0aW9uKCkpIC0gKCh0aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSkgKiB0d2Vlbi5fdGltZVNjYWxlKSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dHdlZW4gPSBuZXh0O1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRwLnJhd1RpbWUgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmICghX3RpY2tlckFjdGl2ZSkge1xuXHRcdFx0XHRfdGlja2VyLndha2UoKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl90b3RhbFRpbWU7XG5cdFx0fTtcblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFR3ZWVuTGl0ZVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdFx0dmFyIFR3ZWVuTGl0ZSA9IF9jbGFzcyhcIlR3ZWVuTGl0ZVwiLCBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKSB7XG5cdFx0XHRcdEFuaW1hdGlvbi5jYWxsKHRoaXMsIGR1cmF0aW9uLCB2YXJzKTtcblx0XHRcdFx0dGhpcy5yZW5kZXIgPSBUd2VlbkxpdGUucHJvdG90eXBlLnJlbmRlcjsgLy9zcGVlZCBvcHRpbWl6YXRpb24gKGF2b2lkIHByb3RvdHlwZSBsb29rdXAgb24gdGhpcyBcImhvdFwiIG1ldGhvZClcblxuXHRcdFx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHtcblx0XHRcdFx0XHR0aHJvdyBcIkNhbm5vdCB0d2VlbiBhIG51bGwgdGFyZ2V0LlwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQgPSAodHlwZW9mKHRhcmdldCkgIT09IFwic3RyaW5nXCIpID8gdGFyZ2V0IDogVHdlZW5MaXRlLnNlbGVjdG9yKHRhcmdldCkgfHwgdGFyZ2V0O1xuXG5cdFx0XHRcdHZhciBpc1NlbGVjdG9yID0gKHRhcmdldC5qcXVlcnkgfHwgKHRhcmdldC5sZW5ndGggJiYgdGFyZ2V0ICE9PSB3aW5kb3cgJiYgdGFyZ2V0WzBdICYmICh0YXJnZXRbMF0gPT09IHdpbmRvdyB8fCAodGFyZ2V0WzBdLm5vZGVUeXBlICYmIHRhcmdldFswXS5zdHlsZSAmJiAhdGFyZ2V0Lm5vZGVUeXBlKSkpKSxcblx0XHRcdFx0XHRvdmVyd3JpdGUgPSB0aGlzLnZhcnMub3ZlcndyaXRlLFxuXHRcdFx0XHRcdGksIHRhcmcsIHRhcmdldHM7XG5cblx0XHRcdFx0dGhpcy5fb3ZlcndyaXRlID0gb3ZlcndyaXRlID0gKG92ZXJ3cml0ZSA9PSBudWxsKSA/IF9vdmVyd3JpdGVMb29rdXBbVHdlZW5MaXRlLmRlZmF1bHRPdmVyd3JpdGVdIDogKHR5cGVvZihvdmVyd3JpdGUpID09PSBcIm51bWJlclwiKSA/IG92ZXJ3cml0ZSA+PiAwIDogX292ZXJ3cml0ZUxvb2t1cFtvdmVyd3JpdGVdO1xuXG5cdFx0XHRcdGlmICgoaXNTZWxlY3RvciB8fCB0YXJnZXQgaW5zdGFuY2VvZiBBcnJheSB8fCAodGFyZ2V0LnB1c2ggJiYgX2lzQXJyYXkodGFyZ2V0KSkpICYmIHR5cGVvZih0YXJnZXRbMF0pICE9PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0dGhpcy5fdGFyZ2V0cyA9IHRhcmdldHMgPSBfc2xpY2UodGFyZ2V0KTsgIC8vZG9uJ3QgdXNlIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRhcmdldCwgMCkgYmVjYXVzZSB0aGF0IGRvZXNuJ3Qgd29yayBpbiBJRTggd2l0aCBhIE5vZGVMaXN0IHRoYXQncyByZXR1cm5lZCBieSBxdWVyeVNlbGVjdG9yQWxsKClcblx0XHRcdFx0XHR0aGlzLl9wcm9wTG9va3VwID0gW107XG5cdFx0XHRcdFx0dGhpcy5fc2libGluZ3MgPSBbXTtcblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgdGFyZ2V0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0dGFyZyA9IHRhcmdldHNbaV07XG5cdFx0XHRcdFx0XHRpZiAoIXRhcmcpIHtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0cy5zcGxpY2UoaS0tLCAxKTtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZih0YXJnKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRcdFx0XHR0YXJnID0gdGFyZ2V0c1tpLS1dID0gVHdlZW5MaXRlLnNlbGVjdG9yKHRhcmcpOyAvL2luIGNhc2UgaXQncyBhbiBhcnJheSBvZiBzdHJpbmdzXG5cdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YodGFyZykgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRcdFx0XHR0YXJnZXRzLnNwbGljZShpKzEsIDEpOyAvL3RvIGF2b2lkIGFuIGVuZGxlc3MgbG9vcCAoY2FuJ3QgaW1hZ2luZSB3aHkgdGhlIHNlbGVjdG9yIHdvdWxkIHJldHVybiBhIHN0cmluZywgYnV0IGp1c3QgaW4gY2FzZSlcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodGFyZy5sZW5ndGggJiYgdGFyZyAhPT0gd2luZG93ICYmIHRhcmdbMF0gJiYgKHRhcmdbMF0gPT09IHdpbmRvdyB8fCAodGFyZ1swXS5ub2RlVHlwZSAmJiB0YXJnWzBdLnN0eWxlICYmICF0YXJnLm5vZGVUeXBlKSkpIHsgLy9pbiBjYXNlIHRoZSB1c2VyIGlzIHBhc3NpbmcgaW4gYW4gYXJyYXkgb2Ygc2VsZWN0b3Igb2JqZWN0cyAobGlrZSBqUXVlcnkgb2JqZWN0cyksIHdlIG5lZWQgdG8gY2hlY2sgb25lIG1vcmUgbGV2ZWwgYW5kIHB1bGwgdGhpbmdzIG91dCBpZiBuZWNlc3NhcnkuIEFsc28gbm90ZSB0aGF0IDxzZWxlY3Q+IGVsZW1lbnRzIHBhc3MgYWxsIHRoZSBjcml0ZXJpYSByZWdhcmRpbmcgbGVuZ3RoIGFuZCB0aGUgZmlyc3QgY2hpbGQgaGF2aW5nIHN0eWxlLCBzbyB3ZSBtdXN0IGFsc28gY2hlY2sgdG8gZW5zdXJlIHRoZSB0YXJnZXQgaXNuJ3QgYW4gSFRNTCBub2RlIGl0c2VsZi5cblx0XHRcdFx0XHRcdFx0dGFyZ2V0cy5zcGxpY2UoaS0tLCAxKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5fdGFyZ2V0cyA9IHRhcmdldHMgPSB0YXJnZXRzLmNvbmNhdChfc2xpY2UodGFyZykpO1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuX3NpYmxpbmdzW2ldID0gX3JlZ2lzdGVyKHRhcmcsIHRoaXMsIGZhbHNlKTtcblx0XHRcdFx0XHRcdGlmIChvdmVyd3JpdGUgPT09IDEpIGlmICh0aGlzLl9zaWJsaW5nc1tpXS5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0XHRcdF9hcHBseU92ZXJ3cml0ZSh0YXJnLCB0aGlzLCBudWxsLCAxLCB0aGlzLl9zaWJsaW5nc1tpXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fcHJvcExvb2t1cCA9IHt9O1xuXHRcdFx0XHRcdHRoaXMuX3NpYmxpbmdzID0gX3JlZ2lzdGVyKHRhcmdldCwgdGhpcywgZmFsc2UpO1xuXHRcdFx0XHRcdGlmIChvdmVyd3JpdGUgPT09IDEpIGlmICh0aGlzLl9zaWJsaW5ncy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0XHRfYXBwbHlPdmVyd3JpdGUodGFyZ2V0LCB0aGlzLCBudWxsLCAxLCB0aGlzLl9zaWJsaW5ncyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLnZhcnMuaW1tZWRpYXRlUmVuZGVyIHx8IChkdXJhdGlvbiA9PT0gMCAmJiB0aGlzLl9kZWxheSA9PT0gMCAmJiB0aGlzLnZhcnMuaW1tZWRpYXRlUmVuZGVyICE9PSBmYWxzZSkpIHtcblx0XHRcdFx0XHR0aGlzLl90aW1lID0gLV90aW55TnVtOyAvL2ZvcmNlcyBhIHJlbmRlciB3aXRob3V0IGhhdmluZyB0byBzZXQgdGhlIHJlbmRlcigpIFwiZm9yY2VcIiBwYXJhbWV0ZXIgdG8gdHJ1ZSBiZWNhdXNlIHdlIHdhbnQgdG8gYWxsb3cgbGF6eWluZyBieSBkZWZhdWx0ICh1c2luZyB0aGUgXCJmb3JjZVwiIHBhcmFtZXRlciBhbHdheXMgZm9yY2VzIGFuIGltbWVkaWF0ZSBmdWxsIHJlbmRlcilcblx0XHRcdFx0XHR0aGlzLnJlbmRlcihNYXRoLm1pbigwLCAtdGhpcy5fZGVsYXkpKTsgLy9pbiBjYXNlIGRlbGF5IGlzIG5lZ2F0aXZlXG5cdFx0XHRcdH1cblx0XHRcdH0sIHRydWUpLFxuXHRcdFx0X2lzU2VsZWN0b3IgPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHJldHVybiAodiAmJiB2Lmxlbmd0aCAmJiB2ICE9PSB3aW5kb3cgJiYgdlswXSAmJiAodlswXSA9PT0gd2luZG93IHx8ICh2WzBdLm5vZGVUeXBlICYmIHZbMF0uc3R5bGUgJiYgIXYubm9kZVR5cGUpKSk7IC8vd2UgY2Fubm90IGNoZWNrIFwibm9kZVR5cGVcIiBpZiB0aGUgdGFyZ2V0IGlzIHdpbmRvdyBmcm9tIHdpdGhpbiBhbiBpZnJhbWUsIG90aGVyd2lzZSBpdCB3aWxsIHRyaWdnZXIgYSBzZWN1cml0eSBlcnJvciBpbiBzb21lIGJyb3dzZXJzIGxpa2UgRmlyZWZveC5cblx0XHRcdH0sXG5cdFx0XHRfYXV0b0NTUyA9IGZ1bmN0aW9uKHZhcnMsIHRhcmdldCkge1xuXHRcdFx0XHR2YXIgY3NzID0ge30sXG5cdFx0XHRcdFx0cDtcblx0XHRcdFx0Zm9yIChwIGluIHZhcnMpIHtcblx0XHRcdFx0XHRpZiAoIV9yZXNlcnZlZFByb3BzW3BdICYmICghKHAgaW4gdGFyZ2V0KSB8fCBwID09PSBcInRyYW5zZm9ybVwiIHx8IHAgPT09IFwieFwiIHx8IHAgPT09IFwieVwiIHx8IHAgPT09IFwid2lkdGhcIiB8fCBwID09PSBcImhlaWdodFwiIHx8IHAgPT09IFwiY2xhc3NOYW1lXCIgfHwgcCA9PT0gXCJib3JkZXJcIikgJiYgKCFfcGx1Z2luc1twXSB8fCAoX3BsdWdpbnNbcF0gJiYgX3BsdWdpbnNbcF0uX2F1dG9DU1MpKSkgeyAvL25vdGU6IDxpbWc+IGVsZW1lbnRzIGNvbnRhaW4gcmVhZC1vbmx5IFwieFwiIGFuZCBcInlcIiBwcm9wZXJ0aWVzLiBXZSBzaG91bGQgYWxzbyBwcmlvcml0aXplIGVkaXRpbmcgY3NzIHdpZHRoL2hlaWdodCByYXRoZXIgdGhhbiB0aGUgZWxlbWVudCdzIHByb3BlcnRpZXMuXG5cdFx0XHRcdFx0XHRjc3NbcF0gPSB2YXJzW3BdO1xuXHRcdFx0XHRcdFx0ZGVsZXRlIHZhcnNbcF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHZhcnMuY3NzID0gY3NzO1xuXHRcdFx0fTtcblxuXHRcdHAgPSBUd2VlbkxpdGUucHJvdG90eXBlID0gbmV3IEFuaW1hdGlvbigpO1xuXHRcdHAuY29uc3RydWN0b3IgPSBUd2VlbkxpdGU7XG5cdFx0cC5raWxsKCkuX2djID0gZmFsc2U7XG5cbi8vLS0tLVR3ZWVuTGl0ZSBkZWZhdWx0cywgb3ZlcndyaXRlIG1hbmFnZW1lbnQsIGFuZCByb290IHVwZGF0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0cC5yYXRpbyA9IDA7XG5cdFx0cC5fZmlyc3RQVCA9IHAuX3RhcmdldHMgPSBwLl9vdmVyd3JpdHRlblByb3BzID0gcC5fc3RhcnRBdCA9IG51bGw7XG5cdFx0cC5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZCA9IHAuX2xhenkgPSBmYWxzZTtcblxuXHRcdFR3ZWVuTGl0ZS52ZXJzaW9uID0gXCIxLjE5LjBcIjtcblx0XHRUd2VlbkxpdGUuZGVmYXVsdEVhc2UgPSBwLl9lYXNlID0gbmV3IEVhc2UobnVsbCwgbnVsbCwgMSwgMSk7XG5cdFx0VHdlZW5MaXRlLmRlZmF1bHRPdmVyd3JpdGUgPSBcImF1dG9cIjtcblx0XHRUd2VlbkxpdGUudGlja2VyID0gX3RpY2tlcjtcblx0XHRUd2VlbkxpdGUuYXV0b1NsZWVwID0gMTIwO1xuXHRcdFR3ZWVuTGl0ZS5sYWdTbW9vdGhpbmcgPSBmdW5jdGlvbih0aHJlc2hvbGQsIGFkanVzdGVkTGFnKSB7XG5cdFx0XHRfdGlja2VyLmxhZ1Ntb290aGluZyh0aHJlc2hvbGQsIGFkanVzdGVkTGFnKTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLnNlbGVjdG9yID0gd2luZG93LiQgfHwgd2luZG93LmpRdWVyeSB8fCBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgc2VsZWN0b3IgPSB3aW5kb3cuJCB8fCB3aW5kb3cualF1ZXJ5O1xuXHRcdFx0aWYgKHNlbGVjdG9yKSB7XG5cdFx0XHRcdFR3ZWVuTGl0ZS5zZWxlY3RvciA9IHNlbGVjdG9yO1xuXHRcdFx0XHRyZXR1cm4gc2VsZWN0b3IoZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKHR5cGVvZihkb2N1bWVudCkgPT09IFwidW5kZWZpbmVkXCIpID8gZSA6IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlKSA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKChlLmNoYXJBdCgwKSA9PT0gXCIjXCIpID8gZS5zdWJzdHIoMSkgOiBlKSk7XG5cdFx0fTtcblxuXHRcdHZhciBfbGF6eVR3ZWVucyA9IFtdLFxuXHRcdFx0X2xhenlMb29rdXAgPSB7fSxcblx0XHRcdF9udW1iZXJzRXhwID0gLyg/OigtfC09fFxcKz0pP1xcZCpcXC4/XFxkKig/OmVbXFwtK10/XFxkKyk/KVswLTldL2lnLFxuXHRcdFx0Ly9fbm9uTnVtYmVyc0V4cCA9IC8oPzooW1xcLStdKD8hKFxcZHw9KSkpfFteXFxkXFwtKz1lXXwoZSg/IVtcXC0rXVtcXGRdKSkpKy9pZyxcblx0XHRcdF9zZXRSYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0dmFyIHB0ID0gdGhpcy5fZmlyc3RQVCxcblx0XHRcdFx0XHRtaW4gPSAwLjAwMDAwMSxcblx0XHRcdFx0XHR2YWw7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdHZhbCA9ICFwdC5ibG9iID8gcHQuYyAqIHYgKyBwdC5zIDogdiA/IHRoaXMuam9pbihcIlwiKSA6IHRoaXMuc3RhcnQ7XG5cdFx0XHRcdFx0aWYgKHB0Lm0pIHtcblx0XHRcdFx0XHRcdHZhbCA9IHB0Lm0odmFsLCB0aGlzLl90YXJnZXQgfHwgcHQudCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh2YWwgPCBtaW4pIGlmICh2YWwgPiAtbWluKSB7IC8vcHJldmVudHMgaXNzdWVzIHdpdGggY29udmVydGluZyB2ZXJ5IHNtYWxsIG51bWJlcnMgdG8gc3RyaW5ncyBpbiB0aGUgYnJvd3NlclxuXHRcdFx0XHRcdFx0dmFsID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCFwdC5mKSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gdmFsO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHQuZnApIHtcblx0XHRcdFx0XHRcdHB0LnRbcHQucF0ocHQuZnAsIHZhbCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHB0LnRbcHQucF0odmFsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdC8vY29tcGFyZXMgdHdvIHN0cmluZ3MgKHN0YXJ0L2VuZCksIGZpbmRzIHRoZSBudW1iZXJzIHRoYXQgYXJlIGRpZmZlcmVudCBhbmQgc3BpdHMgYmFjayBhbiBhcnJheSByZXByZXNlbnRpbmcgdGhlIHdob2xlIHZhbHVlIGJ1dCB3aXRoIHRoZSBjaGFuZ2luZyB2YWx1ZXMgaXNvbGF0ZWQgYXMgZWxlbWVudHMuIEZvciBleGFtcGxlLCBcInJnYigwLDAsMClcIiBhbmQgXCJyZ2IoMTAwLDUwLDApXCIgd291bGQgYmVjb21lIFtcInJnYihcIiwgMCwgXCIsXCIsIDUwLCBcIiwwKVwiXS4gTm90aWNlIGl0IG1lcmdlcyB0aGUgcGFydHMgdGhhdCBhcmUgaWRlbnRpY2FsIChwZXJmb3JtYW5jZSBvcHRpbWl6YXRpb24pLiBUaGUgYXJyYXkgYWxzbyBoYXMgYSBsaW5rZWQgbGlzdCBvZiBQcm9wVHdlZW5zIGF0dGFjaGVkIHN0YXJ0aW5nIHdpdGggX2ZpcnN0UFQgdGhhdCBjb250YWluIHRoZSB0d2VlbmluZyBkYXRhICh0LCBwLCBzLCBjLCBmLCBldGMuKS4gSXQgYWxzbyBzdG9yZXMgdGhlIHN0YXJ0aW5nIHZhbHVlIGFzIGEgXCJzdGFydFwiIHByb3BlcnR5IHNvIHRoYXQgd2UgY2FuIHJldmVydCB0byBpdCBpZi93aGVuIG5lY2Vzc2FyeSwgbGlrZSB3aGVuIGEgdHdlZW4gcmV3aW5kcyBmdWxseS4gSWYgdGhlIHF1YW50aXR5IG9mIG51bWJlcnMgZGlmZmVycyBiZXR3ZWVuIHRoZSBzdGFydCBhbmQgZW5kLCBpdCB3aWxsIGFsd2F5cyBwcmlvcml0aXplIHRoZSBlbmQgdmFsdWUocykuIFRoZSBwdCBwYXJhbWV0ZXIgaXMgb3B0aW9uYWwgLSBpdCdzIGZvciBhIFByb3BUd2VlbiB0aGF0IHdpbGwgYmUgYXBwZW5kZWQgdG8gdGhlIGVuZCBvZiB0aGUgbGlua2VkIGxpc3QgYW5kIGlzIHR5cGljYWxseSBmb3IgYWN0dWFsbHkgc2V0dGluZyB0aGUgdmFsdWUgYWZ0ZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBoYXZlIGJlZW4gdXBkYXRlZCAod2l0aCBhcnJheS5qb2luKFwiXCIpKS5cblx0XHRcdF9ibG9iRGlmID0gZnVuY3Rpb24oc3RhcnQsIGVuZCwgZmlsdGVyLCBwdCkge1xuXHRcdFx0XHR2YXIgYSA9IFtzdGFydCwgZW5kXSxcblx0XHRcdFx0XHRjaGFySW5kZXggPSAwLFxuXHRcdFx0XHRcdHMgPSBcIlwiLFxuXHRcdFx0XHRcdGNvbG9yID0gMCxcblx0XHRcdFx0XHRzdGFydE51bXMsIGVuZE51bXMsIG51bSwgaSwgbCwgbm9uTnVtYmVycywgY3VycmVudE51bTtcblx0XHRcdFx0YS5zdGFydCA9IHN0YXJ0O1xuXHRcdFx0XHRpZiAoZmlsdGVyKSB7XG5cdFx0XHRcdFx0ZmlsdGVyKGEpOyAvL3Bhc3MgYW4gYXJyYXkgd2l0aCB0aGUgc3RhcnRpbmcgYW5kIGVuZGluZyB2YWx1ZXMgYW5kIGxldCB0aGUgZmlsdGVyIGRvIHdoYXRldmVyIGl0IG5lZWRzIHRvIHRoZSB2YWx1ZXMuXG5cdFx0XHRcdFx0c3RhcnQgPSBhWzBdO1xuXHRcdFx0XHRcdGVuZCA9IGFbMV07XG5cdFx0XHRcdH1cblx0XHRcdFx0YS5sZW5ndGggPSAwO1xuXHRcdFx0XHRzdGFydE51bXMgPSBzdGFydC5tYXRjaChfbnVtYmVyc0V4cCkgfHwgW107XG5cdFx0XHRcdGVuZE51bXMgPSBlbmQubWF0Y2goX251bWJlcnNFeHApIHx8IFtdO1xuXHRcdFx0XHRpZiAocHQpIHtcblx0XHRcdFx0XHRwdC5fbmV4dCA9IG51bGw7XG5cdFx0XHRcdFx0cHQuYmxvYiA9IDE7XG5cdFx0XHRcdFx0YS5fZmlyc3RQVCA9IGEuX2FwcGx5UFQgPSBwdDsgLy9hcHBseSBsYXN0IGluIHRoZSBsaW5rZWQgbGlzdCAod2hpY2ggbWVhbnMgaW5zZXJ0aW5nIGl0IGZpcnN0KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGwgPSBlbmROdW1zLmxlbmd0aDtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdGN1cnJlbnROdW0gPSBlbmROdW1zW2ldO1xuXHRcdFx0XHRcdG5vbk51bWJlcnMgPSBlbmQuc3Vic3RyKGNoYXJJbmRleCwgZW5kLmluZGV4T2YoY3VycmVudE51bSwgY2hhckluZGV4KS1jaGFySW5kZXgpO1xuXHRcdFx0XHRcdHMgKz0gKG5vbk51bWJlcnMgfHwgIWkpID8gbm9uTnVtYmVycyA6IFwiLFwiOyAvL25vdGU6IFNWRyBzcGVjIGFsbG93cyBvbWlzc2lvbiBvZiBjb21tYS9zcGFjZSB3aGVuIGEgbmVnYXRpdmUgc2lnbiBpcyB3ZWRnZWQgYmV0d2VlbiB0d28gbnVtYmVycywgbGlrZSAyLjUtNS4zIGluc3RlYWQgb2YgMi41LC01LjMgYnV0IHdoZW4gdHdlZW5pbmcsIHRoZSBuZWdhdGl2ZSB2YWx1ZSBtYXkgc3dpdGNoIHRvIHBvc2l0aXZlLCBzbyB3ZSBpbnNlcnQgdGhlIGNvbW1hIGp1c3QgaW4gY2FzZS5cblx0XHRcdFx0XHRjaGFySW5kZXggKz0gbm9uTnVtYmVycy5sZW5ndGg7XG5cdFx0XHRcdFx0aWYgKGNvbG9yKSB7IC8vc2Vuc2UgcmdiYSgpIHZhbHVlcyBhbmQgcm91bmQgdGhlbS5cblx0XHRcdFx0XHRcdGNvbG9yID0gKGNvbG9yICsgMSkgJSA1O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAobm9uTnVtYmVycy5zdWJzdHIoLTUpID09PSBcInJnYmEoXCIpIHtcblx0XHRcdFx0XHRcdGNvbG9yID0gMTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGN1cnJlbnROdW0gPT09IHN0YXJ0TnVtc1tpXSB8fCBzdGFydE51bXMubGVuZ3RoIDw9IGkpIHtcblx0XHRcdFx0XHRcdHMgKz0gY3VycmVudE51bTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKHMpIHtcblx0XHRcdFx0XHRcdFx0YS5wdXNoKHMpO1xuXHRcdFx0XHRcdFx0XHRzID0gXCJcIjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG51bSA9IHBhcnNlRmxvYXQoc3RhcnROdW1zW2ldKTtcblx0XHRcdFx0XHRcdGEucHVzaChudW0pO1xuXHRcdFx0XHRcdFx0YS5fZmlyc3RQVCA9IHtfbmV4dDogYS5fZmlyc3RQVCwgdDphLCBwOiBhLmxlbmd0aC0xLCBzOm51bSwgYzooKGN1cnJlbnROdW0uY2hhckF0KDEpID09PSBcIj1cIikgPyBwYXJzZUludChjdXJyZW50TnVtLmNoYXJBdCgwKSArIFwiMVwiLCAxMCkgKiBwYXJzZUZsb2F0KGN1cnJlbnROdW0uc3Vic3RyKDIpKSA6IChwYXJzZUZsb2F0KGN1cnJlbnROdW0pIC0gbnVtKSkgfHwgMCwgZjowLCBtOihjb2xvciAmJiBjb2xvciA8IDQpID8gTWF0aC5yb3VuZCA6IDB9O1xuXHRcdFx0XHRcdFx0Ly9ub3RlOiB3ZSBkb24ndCBzZXQgX3ByZXYgYmVjYXVzZSB3ZSdsbCBuZXZlciBuZWVkIHRvIHJlbW92ZSBpbmRpdmlkdWFsIFByb3BUd2VlbnMgZnJvbSB0aGlzIGxpc3QuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNoYXJJbmRleCArPSBjdXJyZW50TnVtLmxlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRzICs9IGVuZC5zdWJzdHIoY2hhckluZGV4KTtcblx0XHRcdFx0aWYgKHMpIHtcblx0XHRcdFx0XHRhLnB1c2gocyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YS5zZXRSYXRpbyA9IF9zZXRSYXRpbztcblx0XHRcdFx0cmV0dXJuIGE7XG5cdFx0XHR9LFxuXHRcdFx0Ly9ub3RlOiBcImZ1bmNQYXJhbVwiIGlzIG9ubHkgbmVjZXNzYXJ5IGZvciBmdW5jdGlvbi1iYXNlZCBnZXR0ZXJzL3NldHRlcnMgdGhhdCByZXF1aXJlIGFuIGV4dHJhIHBhcmFtZXRlciBsaWtlIGdldEF0dHJpYnV0ZShcIndpZHRoXCIpIGFuZCBzZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCB2YWx1ZSkuIEluIHRoaXMgZXhhbXBsZSwgZnVuY1BhcmFtIHdvdWxkIGJlIFwid2lkdGhcIi4gVXNlZCBieSBBdHRyUGx1Z2luIGZvciBleGFtcGxlLlxuXHRcdFx0X2FkZFByb3BUd2VlbiA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcCwgc3RhcnQsIGVuZCwgb3ZlcndyaXRlUHJvcCwgbW9kLCBmdW5jUGFyYW0sIHN0cmluZ0ZpbHRlciwgaW5kZXgpIHtcblx0XHRcdFx0aWYgKHR5cGVvZihlbmQpID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRlbmQgPSBlbmQoaW5kZXggfHwgMCwgdGFyZ2V0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgcyA9IChzdGFydCA9PT0gXCJnZXRcIikgPyB0YXJnZXRbcHJvcF0gOiBzdGFydCxcblx0XHRcdFx0XHR0eXBlID0gdHlwZW9mKHRhcmdldFtwcm9wXSksXG5cdFx0XHRcdFx0aXNSZWxhdGl2ZSA9ICh0eXBlb2YoZW5kKSA9PT0gXCJzdHJpbmdcIiAmJiBlbmQuY2hhckF0KDEpID09PSBcIj1cIiksXG5cdFx0XHRcdFx0cHQgPSB7dDp0YXJnZXQsIHA6cHJvcCwgczpzLCBmOih0eXBlID09PSBcImZ1bmN0aW9uXCIpLCBwZzowLCBuOm92ZXJ3cml0ZVByb3AgfHwgcHJvcCwgbTooIW1vZCA/IDAgOiAodHlwZW9mKG1vZCkgPT09IFwiZnVuY3Rpb25cIikgPyBtb2QgOiBNYXRoLnJvdW5kKSwgcHI6MCwgYzppc1JlbGF0aXZlID8gcGFyc2VJbnQoZW5kLmNoYXJBdCgwKSArIFwiMVwiLCAxMCkgKiBwYXJzZUZsb2F0KGVuZC5zdWJzdHIoMikpIDogKHBhcnNlRmxvYXQoZW5kKSAtIHMpIHx8IDB9LFxuXHRcdFx0XHRcdGJsb2IsIGdldHRlck5hbWU7XG5cdFx0XHRcdGlmICh0eXBlICE9PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIiAmJiBzdGFydCA9PT0gXCJnZXRcIikge1xuXHRcdFx0XHRcdFx0Z2V0dGVyTmFtZSA9ICgocHJvcC5pbmRleE9mKFwic2V0XCIpIHx8IHR5cGVvZih0YXJnZXRbXCJnZXRcIiArIHByb3Auc3Vic3RyKDMpXSkgIT09IFwiZnVuY3Rpb25cIikgPyBwcm9wIDogXCJnZXRcIiArIHByb3Auc3Vic3RyKDMpKTtcblx0XHRcdFx0XHRcdHB0LnMgPSBzID0gZnVuY1BhcmFtID8gdGFyZ2V0W2dldHRlck5hbWVdKGZ1bmNQYXJhbSkgOiB0YXJnZXRbZ2V0dGVyTmFtZV0oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHR5cGVvZihzKSA9PT0gXCJzdHJpbmdcIiAmJiAoZnVuY1BhcmFtIHx8IGlzTmFOKHMpKSkge1xuXHRcdFx0XHRcdFx0Ly9hIGJsb2IgKHN0cmluZyB0aGF0IGhhcyBtdWx0aXBsZSBudW1iZXJzIGluIGl0KVxuXHRcdFx0XHRcdFx0cHQuZnAgPSBmdW5jUGFyYW07XG5cdFx0XHRcdFx0XHRibG9iID0gX2Jsb2JEaWYocywgZW5kLCBzdHJpbmdGaWx0ZXIgfHwgVHdlZW5MaXRlLmRlZmF1bHRTdHJpbmdGaWx0ZXIsIHB0KTtcblx0XHRcdFx0XHRcdHB0ID0ge3Q6YmxvYiwgcDpcInNldFJhdGlvXCIsIHM6MCwgYzoxLCBmOjIsIHBnOjAsIG46b3ZlcndyaXRlUHJvcCB8fCBwcm9wLCBwcjowLCBtOjB9OyAvL1wiMlwiIGluZGljYXRlcyBpdCdzIGEgQmxvYiBwcm9wZXJ0eSB0d2Vlbi4gTmVlZGVkIGZvciBSb3VuZFByb3BzUGx1Z2luIGZvciBleGFtcGxlLlxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIWlzUmVsYXRpdmUpIHtcblx0XHRcdFx0XHRcdHB0LnMgPSBwYXJzZUZsb2F0KHMpO1xuXHRcdFx0XHRcdFx0cHQuYyA9IChwYXJzZUZsb2F0KGVuZCkgLSBwdC5zKSB8fCAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHQuYykgeyAvL29ubHkgYWRkIGl0IHRvIHRoZSBsaW5rZWQgbGlzdCBpZiB0aGVyZSdzIGEgY2hhbmdlLlxuXHRcdFx0XHRcdGlmICgocHQuX25leHQgPSB0aGlzLl9maXJzdFBUKSkge1xuXHRcdFx0XHRcdFx0cHQuX25leHQuX3ByZXYgPSBwdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IHB0O1xuXHRcdFx0XHRcdHJldHVybiBwdDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdF9pbnRlcm5hbHMgPSBUd2VlbkxpdGUuX2ludGVybmFscyA9IHtpc0FycmF5Ol9pc0FycmF5LCBpc1NlbGVjdG9yOl9pc1NlbGVjdG9yLCBsYXp5VHdlZW5zOl9sYXp5VHdlZW5zLCBibG9iRGlmOl9ibG9iRGlmfSwgLy9naXZlcyB1cyBhIHdheSB0byBleHBvc2UgY2VydGFpbiBwcml2YXRlIHZhbHVlcyB0byBvdGhlciBHcmVlblNvY2sgY2xhc3NlcyB3aXRob3V0IGNvbnRhbWluYXRpbmcgdGhhIG1haW4gVHdlZW5MaXRlIG9iamVjdC5cblx0XHRcdF9wbHVnaW5zID0gVHdlZW5MaXRlLl9wbHVnaW5zID0ge30sXG5cdFx0XHRfdHdlZW5Mb29rdXAgPSBfaW50ZXJuYWxzLnR3ZWVuTG9va3VwID0ge30sXG5cdFx0XHRfdHdlZW5Mb29rdXBOdW0gPSAwLFxuXHRcdFx0X3Jlc2VydmVkUHJvcHMgPSBfaW50ZXJuYWxzLnJlc2VydmVkUHJvcHMgPSB7ZWFzZToxLCBkZWxheToxLCBvdmVyd3JpdGU6MSwgb25Db21wbGV0ZToxLCBvbkNvbXBsZXRlUGFyYW1zOjEsIG9uQ29tcGxldGVTY29wZToxLCB1c2VGcmFtZXM6MSwgcnVuQmFja3dhcmRzOjEsIHN0YXJ0QXQ6MSwgb25VcGRhdGU6MSwgb25VcGRhdGVQYXJhbXM6MSwgb25VcGRhdGVTY29wZToxLCBvblN0YXJ0OjEsIG9uU3RhcnRQYXJhbXM6MSwgb25TdGFydFNjb3BlOjEsIG9uUmV2ZXJzZUNvbXBsZXRlOjEsIG9uUmV2ZXJzZUNvbXBsZXRlUGFyYW1zOjEsIG9uUmV2ZXJzZUNvbXBsZXRlU2NvcGU6MSwgb25SZXBlYXQ6MSwgb25SZXBlYXRQYXJhbXM6MSwgb25SZXBlYXRTY29wZToxLCBlYXNlUGFyYW1zOjEsIHlveW86MSwgaW1tZWRpYXRlUmVuZGVyOjEsIHJlcGVhdDoxLCByZXBlYXREZWxheToxLCBkYXRhOjEsIHBhdXNlZDoxLCByZXZlcnNlZDoxLCBhdXRvQ1NTOjEsIGxhenk6MSwgb25PdmVyd3JpdGU6MSwgY2FsbGJhY2tTY29wZToxLCBzdHJpbmdGaWx0ZXI6MSwgaWQ6MX0sXG5cdFx0XHRfb3ZlcndyaXRlTG9va3VwID0ge25vbmU6MCwgYWxsOjEsIGF1dG86MiwgY29uY3VycmVudDozLCBhbGxPblN0YXJ0OjQsIHByZWV4aXN0aW5nOjUsIFwidHJ1ZVwiOjEsIFwiZmFsc2VcIjowfSxcblx0XHRcdF9yb290RnJhbWVzVGltZWxpbmUgPSBBbmltYXRpb24uX3Jvb3RGcmFtZXNUaW1lbGluZSA9IG5ldyBTaW1wbGVUaW1lbGluZSgpLFxuXHRcdFx0X3Jvb3RUaW1lbGluZSA9IEFuaW1hdGlvbi5fcm9vdFRpbWVsaW5lID0gbmV3IFNpbXBsZVRpbWVsaW5lKCksXG5cdFx0XHRfbmV4dEdDRnJhbWUgPSAzMCxcblx0XHRcdF9sYXp5UmVuZGVyID0gX2ludGVybmFscy5sYXp5UmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBpID0gX2xhenlUd2VlbnMubGVuZ3RoLFxuXHRcdFx0XHRcdHR3ZWVuO1xuXHRcdFx0XHRfbGF6eUxvb2t1cCA9IHt9O1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHR0d2VlbiA9IF9sYXp5VHdlZW5zW2ldO1xuXHRcdFx0XHRcdGlmICh0d2VlbiAmJiB0d2Vlbi5fbGF6eSAhPT0gZmFsc2UpIHtcblx0XHRcdFx0XHRcdHR3ZWVuLnJlbmRlcih0d2Vlbi5fbGF6eVswXSwgdHdlZW4uX2xhenlbMV0sIHRydWUpO1xuXHRcdFx0XHRcdFx0dHdlZW4uX2xhenkgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0X2xhenlUd2VlbnMubGVuZ3RoID0gMDtcblx0XHRcdH07XG5cblx0XHRfcm9vdFRpbWVsaW5lLl9zdGFydFRpbWUgPSBfdGlja2VyLnRpbWU7XG5cdFx0X3Jvb3RGcmFtZXNUaW1lbGluZS5fc3RhcnRUaW1lID0gX3RpY2tlci5mcmFtZTtcblx0XHRfcm9vdFRpbWVsaW5lLl9hY3RpdmUgPSBfcm9vdEZyYW1lc1RpbWVsaW5lLl9hY3RpdmUgPSB0cnVlO1xuXHRcdHNldFRpbWVvdXQoX2xhenlSZW5kZXIsIDEpOyAvL29uIHNvbWUgbW9iaWxlIGRldmljZXMsIHRoZXJlIGlzbid0IGEgXCJ0aWNrXCIgYmVmb3JlIGNvZGUgcnVucyB3aGljaCBtZWFucyBhbnkgbGF6eSByZW5kZXJzIHdvdWxkbid0IHJ1biBiZWZvcmUgdGhlIG5leHQgb2ZmaWNpYWwgXCJ0aWNrXCIuXG5cblx0XHRBbmltYXRpb24uX3VwZGF0ZVJvb3QgPSBUd2VlbkxpdGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBpLCBhLCBwO1xuXHRcdFx0XHRpZiAoX2xhenlUd2VlbnMubGVuZ3RoKSB7IC8vaWYgY29kZSBpcyBydW4gb3V0c2lkZSBvZiB0aGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGxvb3AsIHRoZXJlIG1heSBiZSB0d2VlbnMgcXVldWVkIEFGVEVSIHRoZSBlbmdpbmUgcmVmcmVzaGVkLCBzbyB3ZSBuZWVkIHRvIGVuc3VyZSBhbnkgcGVuZGluZyByZW5kZXJzIG9jY3VyIGJlZm9yZSB3ZSByZWZyZXNoIGFnYWluLlxuXHRcdFx0XHRcdF9sYXp5UmVuZGVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3Jvb3RUaW1lbGluZS5yZW5kZXIoKF90aWNrZXIudGltZSAtIF9yb290VGltZWxpbmUuX3N0YXJ0VGltZSkgKiBfcm9vdFRpbWVsaW5lLl90aW1lU2NhbGUsIGZhbHNlLCBmYWxzZSk7XG5cdFx0XHRcdF9yb290RnJhbWVzVGltZWxpbmUucmVuZGVyKChfdGlja2VyLmZyYW1lIC0gX3Jvb3RGcmFtZXNUaW1lbGluZS5fc3RhcnRUaW1lKSAqIF9yb290RnJhbWVzVGltZWxpbmUuX3RpbWVTY2FsZSwgZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0aWYgKF9sYXp5VHdlZW5zLmxlbmd0aCkge1xuXHRcdFx0XHRcdF9sYXp5UmVuZGVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKF90aWNrZXIuZnJhbWUgPj0gX25leHRHQ0ZyYW1lKSB7IC8vZHVtcCBnYXJiYWdlIGV2ZXJ5IDEyMCBmcmFtZXMgb3Igd2hhdGV2ZXIgdGhlIHVzZXIgc2V0cyBUd2VlbkxpdGUuYXV0b1NsZWVwIHRvXG5cdFx0XHRcdFx0X25leHRHQ0ZyYW1lID0gX3RpY2tlci5mcmFtZSArIChwYXJzZUludChUd2VlbkxpdGUuYXV0b1NsZWVwLCAxMCkgfHwgMTIwKTtcblx0XHRcdFx0XHRmb3IgKHAgaW4gX3R3ZWVuTG9va3VwKSB7XG5cdFx0XHRcdFx0XHRhID0gX3R3ZWVuTG9va3VwW3BdLnR3ZWVucztcblx0XHRcdFx0XHRcdGkgPSBhLmxlbmd0aDtcblx0XHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoYVtpXS5fZ2MpIHtcblx0XHRcdFx0XHRcdFx0XHRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGEubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBfdHdlZW5Mb29rdXBbcF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vaWYgdGhlcmUgYXJlIG5vIG1vcmUgdHdlZW5zIGluIHRoZSByb290IHRpbWVsaW5lcywgb3IgaWYgdGhleSdyZSBhbGwgcGF1c2VkLCBtYWtlIHRoZSBfdGltZXIgc2xlZXAgdG8gcmVkdWNlIGxvYWQgb24gdGhlIENQVSBzbGlnaHRseVxuXHRcdFx0XHRcdHAgPSBfcm9vdFRpbWVsaW5lLl9maXJzdDtcblx0XHRcdFx0XHRpZiAoIXAgfHwgcC5fcGF1c2VkKSBpZiAoVHdlZW5MaXRlLmF1dG9TbGVlcCAmJiAhX3Jvb3RGcmFtZXNUaW1lbGluZS5fZmlyc3QgJiYgX3RpY2tlci5fbGlzdGVuZXJzLnRpY2subGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdFx0XHR3aGlsZSAocCAmJiBwLl9wYXVzZWQpIHtcblx0XHRcdFx0XHRcdFx0cCA9IHAuX25leHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIXApIHtcblx0XHRcdFx0XHRcdFx0X3RpY2tlci5zbGVlcCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdF90aWNrZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRpY2tcIiwgQW5pbWF0aW9uLl91cGRhdGVSb290KTtcblxuXHRcdHZhciBfcmVnaXN0ZXIgPSBmdW5jdGlvbih0YXJnZXQsIHR3ZWVuLCBzY3J1Yikge1xuXHRcdFx0XHR2YXIgaWQgPSB0YXJnZXQuX2dzVHdlZW5JRCwgYSwgaTtcblx0XHRcdFx0aWYgKCFfdHdlZW5Mb29rdXBbaWQgfHwgKHRhcmdldC5fZ3NUd2VlbklEID0gaWQgPSBcInRcIiArIChfdHdlZW5Mb29rdXBOdW0rKykpXSkge1xuXHRcdFx0XHRcdF90d2Vlbkxvb2t1cFtpZF0gPSB7dGFyZ2V0OnRhcmdldCwgdHdlZW5zOltdfTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHdlZW4pIHtcblx0XHRcdFx0XHRhID0gX3R3ZWVuTG9va3VwW2lkXS50d2VlbnM7XG5cdFx0XHRcdFx0YVsoaSA9IGEubGVuZ3RoKV0gPSB0d2Vlbjtcblx0XHRcdFx0XHRpZiAoc2NydWIpIHtcblx0XHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoYVtpXSA9PT0gdHdlZW4pIHtcblx0XHRcdFx0XHRcdFx0XHRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gX3R3ZWVuTG9va3VwW2lkXS50d2VlbnM7XG5cdFx0XHR9LFxuXHRcdFx0X29uT3ZlcndyaXRlID0gZnVuY3Rpb24ob3ZlcndyaXR0ZW5Ud2Vlbiwgb3ZlcndyaXRpbmdUd2VlbiwgdGFyZ2V0LCBraWxsZWRQcm9wcykge1xuXHRcdFx0XHR2YXIgZnVuYyA9IG92ZXJ3cml0dGVuVHdlZW4udmFycy5vbk92ZXJ3cml0ZSwgcjEsIHIyO1xuXHRcdFx0XHRpZiAoZnVuYykge1xuXHRcdFx0XHRcdHIxID0gZnVuYyhvdmVyd3JpdHRlblR3ZWVuLCBvdmVyd3JpdGluZ1R3ZWVuLCB0YXJnZXQsIGtpbGxlZFByb3BzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmdW5jID0gVHdlZW5MaXRlLm9uT3ZlcndyaXRlO1xuXHRcdFx0XHRpZiAoZnVuYykge1xuXHRcdFx0XHRcdHIyID0gZnVuYyhvdmVyd3JpdHRlblR3ZWVuLCBvdmVyd3JpdGluZ1R3ZWVuLCB0YXJnZXQsIGtpbGxlZFByb3BzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gKHIxICE9PSBmYWxzZSAmJiByMiAhPT0gZmFsc2UpO1xuXHRcdFx0fSxcblx0XHRcdF9hcHBseU92ZXJ3cml0ZSA9IGZ1bmN0aW9uKHRhcmdldCwgdHdlZW4sIHByb3BzLCBtb2RlLCBzaWJsaW5ncykge1xuXHRcdFx0XHR2YXIgaSwgY2hhbmdlZCwgY3VyVHdlZW4sIGw7XG5cdFx0XHRcdGlmIChtb2RlID09PSAxIHx8IG1vZGUgPj0gNCkge1xuXHRcdFx0XHRcdGwgPSBzaWJsaW5ncy5sZW5ndGg7XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYgKChjdXJUd2VlbiA9IHNpYmxpbmdzW2ldKSAhPT0gdHdlZW4pIHtcblx0XHRcdFx0XHRcdFx0aWYgKCFjdXJUd2Vlbi5fZ2MpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoY3VyVHdlZW4uX2tpbGwobnVsbCwgdGFyZ2V0LCB0d2VlbikpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChtb2RlID09PSA1KSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gY2hhbmdlZDtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL05PVEU6IEFkZCAwLjAwMDAwMDAwMDEgdG8gb3ZlcmNvbWUgZmxvYXRpbmcgcG9pbnQgZXJyb3JzIHRoYXQgY2FuIGNhdXNlIHRoZSBzdGFydFRpbWUgdG8gYmUgVkVSWSBzbGlnaHRseSBvZmYgKHdoZW4gYSB0d2VlbidzIHRpbWUoKSBpcyBzZXQgZm9yIGV4YW1wbGUpXG5cdFx0XHRcdHZhciBzdGFydFRpbWUgPSB0d2Vlbi5fc3RhcnRUaW1lICsgX3RpbnlOdW0sXG5cdFx0XHRcdFx0b3ZlcmxhcHMgPSBbXSxcblx0XHRcdFx0XHRvQ291bnQgPSAwLFxuXHRcdFx0XHRcdHplcm9EdXIgPSAodHdlZW4uX2R1cmF0aW9uID09PSAwKSxcblx0XHRcdFx0XHRnbG9iYWxTdGFydDtcblx0XHRcdFx0aSA9IHNpYmxpbmdzLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0aWYgKChjdXJUd2VlbiA9IHNpYmxpbmdzW2ldKSA9PT0gdHdlZW4gfHwgY3VyVHdlZW4uX2djIHx8IGN1clR3ZWVuLl9wYXVzZWQpIHtcblx0XHRcdFx0XHRcdC8vaWdub3JlXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChjdXJUd2Vlbi5fdGltZWxpbmUgIT09IHR3ZWVuLl90aW1lbGluZSkge1xuXHRcdFx0XHRcdFx0Z2xvYmFsU3RhcnQgPSBnbG9iYWxTdGFydCB8fCBfY2hlY2tPdmVybGFwKHR3ZWVuLCAwLCB6ZXJvRHVyKTtcblx0XHRcdFx0XHRcdGlmIChfY2hlY2tPdmVybGFwKGN1clR3ZWVuLCBnbG9iYWxTdGFydCwgemVyb0R1cikgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0b3ZlcmxhcHNbb0NvdW50KytdID0gY3VyVHdlZW47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChjdXJUd2Vlbi5fc3RhcnRUaW1lIDw9IHN0YXJ0VGltZSkgaWYgKGN1clR3ZWVuLl9zdGFydFRpbWUgKyBjdXJUd2Vlbi50b3RhbER1cmF0aW9uKCkgLyBjdXJUd2Vlbi5fdGltZVNjYWxlID4gc3RhcnRUaW1lKSBpZiAoISgoemVyb0R1ciB8fCAhY3VyVHdlZW4uX2luaXR0ZWQpICYmIHN0YXJ0VGltZSAtIGN1clR3ZWVuLl9zdGFydFRpbWUgPD0gMC4wMDAwMDAwMDAyKSkge1xuXHRcdFx0XHRcdFx0b3ZlcmxhcHNbb0NvdW50KytdID0gY3VyVHdlZW47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aSA9IG9Db3VudDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0Y3VyVHdlZW4gPSBvdmVybGFwc1tpXTtcblx0XHRcdFx0XHRpZiAobW9kZSA9PT0gMikgaWYgKGN1clR3ZWVuLl9raWxsKHByb3BzLCB0YXJnZXQsIHR3ZWVuKSkge1xuXHRcdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChtb2RlICE9PSAyIHx8ICghY3VyVHdlZW4uX2ZpcnN0UFQgJiYgY3VyVHdlZW4uX2luaXR0ZWQpKSB7XG5cdFx0XHRcdFx0XHRpZiAobW9kZSAhPT0gMiAmJiAhX29uT3ZlcndyaXRlKGN1clR3ZWVuLCB0d2VlbikpIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoY3VyVHdlZW4uX2VuYWJsZWQoZmFsc2UsIGZhbHNlKSkgeyAvL2lmIGFsbCBwcm9wZXJ0eSB0d2VlbnMgaGF2ZSBiZWVuIG92ZXJ3cml0dGVuLCBraWxsIHRoZSB0d2Vlbi5cblx0XHRcdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBjaGFuZ2VkO1xuXHRcdFx0fSxcblx0XHRcdF9jaGVja092ZXJsYXAgPSBmdW5jdGlvbih0d2VlbiwgcmVmZXJlbmNlLCB6ZXJvRHVyKSB7XG5cdFx0XHRcdHZhciB0bCA9IHR3ZWVuLl90aW1lbGluZSxcblx0XHRcdFx0XHR0cyA9IHRsLl90aW1lU2NhbGUsXG5cdFx0XHRcdFx0dCA9IHR3ZWVuLl9zdGFydFRpbWU7XG5cdFx0XHRcdHdoaWxlICh0bC5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHR0ICs9IHRsLl9zdGFydFRpbWU7XG5cdFx0XHRcdFx0dHMgKj0gdGwuX3RpbWVTY2FsZTtcblx0XHRcdFx0XHRpZiAodGwuX3BhdXNlZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIC0xMDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRsID0gdGwuX3RpbWVsaW5lO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHQgLz0gdHM7XG5cdFx0XHRcdHJldHVybiAodCA+IHJlZmVyZW5jZSkgPyB0IC0gcmVmZXJlbmNlIDogKCh6ZXJvRHVyICYmIHQgPT09IHJlZmVyZW5jZSkgfHwgKCF0d2Vlbi5faW5pdHRlZCAmJiB0IC0gcmVmZXJlbmNlIDwgMiAqIF90aW55TnVtKSkgPyBfdGlueU51bSA6ICgodCArPSB0d2Vlbi50b3RhbER1cmF0aW9uKCkgLyB0d2Vlbi5fdGltZVNjYWxlIC8gdHMpID4gcmVmZXJlbmNlICsgX3RpbnlOdW0pID8gMCA6IHQgLSByZWZlcmVuY2UgLSBfdGlueU51bTtcblx0XHRcdH07XG5cblxuLy8tLS0tIFR3ZWVuTGl0ZSBpbnN0YW5jZSBtZXRob2RzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHRwLl9pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdiA9IHRoaXMudmFycyxcblx0XHRcdFx0b3AgPSB0aGlzLl9vdmVyd3JpdHRlblByb3BzLFxuXHRcdFx0XHRkdXIgPSB0aGlzLl9kdXJhdGlvbixcblx0XHRcdFx0aW1tZWRpYXRlID0gISF2LmltbWVkaWF0ZVJlbmRlcixcblx0XHRcdFx0ZWFzZSA9IHYuZWFzZSxcblx0XHRcdFx0aSwgaW5pdFBsdWdpbnMsIHB0LCBwLCBzdGFydFZhcnMsIGw7XG5cdFx0XHRpZiAodi5zdGFydEF0KSB7XG5cdFx0XHRcdGlmICh0aGlzLl9zdGFydEF0KSB7XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5yZW5kZXIoLTEsIHRydWUpOyAvL2lmIHdlJ3ZlIHJ1biBhIHN0YXJ0QXQgcHJldmlvdXNseSAod2hlbiB0aGUgdHdlZW4gaW5zdGFudGlhdGVkKSwgd2Ugc2hvdWxkIHJldmVydCBpdCBzbyB0aGF0IHRoZSB2YWx1ZXMgcmUtaW5zdGFudGlhdGUgY29ycmVjdGx5IHBhcnRpY3VsYXJseSBmb3IgcmVsYXRpdmUgdHdlZW5zLiBXaXRob3V0IHRoaXMsIGEgVHdlZW5MaXRlLmZyb21UbyhvYmosIDEsIHt4OlwiKz0xMDBcIn0sIHt4OlwiLT0xMDBcIn0pLCBmb3IgZXhhbXBsZSwgd291bGQgYWN0dWFsbHkganVtcCB0byArPTIwMCBiZWNhdXNlIHRoZSBzdGFydEF0IHdvdWxkIHJ1biB0d2ljZSwgZG91YmxpbmcgdGhlIHJlbGF0aXZlIGNoYW5nZS5cblx0XHRcdFx0XHR0aGlzLl9zdGFydEF0LmtpbGwoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzdGFydFZhcnMgPSB7fTtcblx0XHRcdFx0Zm9yIChwIGluIHYuc3RhcnRBdCkgeyAvL2NvcHkgdGhlIHByb3BlcnRpZXMvdmFsdWVzIGludG8gYSBuZXcgb2JqZWN0IHRvIGF2b2lkIGNvbGxpc2lvbnMsIGxpa2UgdmFyIHRvID0ge3g6MH0sIGZyb20gPSB7eDo1MDB9OyB0aW1lbGluZS5mcm9tVG8oZSwgMSwgZnJvbSwgdG8pLmZyb21UbyhlLCAxLCB0bywgZnJvbSk7XG5cdFx0XHRcdFx0c3RhcnRWYXJzW3BdID0gdi5zdGFydEF0W3BdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHN0YXJ0VmFycy5vdmVyd3JpdGUgPSBmYWxzZTtcblx0XHRcdFx0c3RhcnRWYXJzLmltbWVkaWF0ZVJlbmRlciA9IHRydWU7XG5cdFx0XHRcdHN0YXJ0VmFycy5sYXp5ID0gKGltbWVkaWF0ZSAmJiB2LmxhenkgIT09IGZhbHNlKTtcblx0XHRcdFx0c3RhcnRWYXJzLnN0YXJ0QXQgPSBzdGFydFZhcnMuZGVsYXkgPSBudWxsOyAvL25vIG5lc3Rpbmcgb2Ygc3RhcnRBdCBvYmplY3RzIGFsbG93ZWQgKG90aGVyd2lzZSBpdCBjb3VsZCBjYXVzZSBhbiBpbmZpbml0ZSBsb29wKS5cblx0XHRcdFx0dGhpcy5fc3RhcnRBdCA9IFR3ZWVuTGl0ZS50byh0aGlzLnRhcmdldCwgMCwgc3RhcnRWYXJzKTtcblx0XHRcdFx0aWYgKGltbWVkaWF0ZSkge1xuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lID4gMCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fc3RhcnRBdCA9IG51bGw7IC8vdHdlZW5zIHRoYXQgcmVuZGVyIGltbWVkaWF0ZWx5IChsaWtlIG1vc3QgZnJvbSgpIGFuZCBmcm9tVG8oKSB0d2VlbnMpIHNob3VsZG4ndCByZXZlcnQgd2hlbiB0aGVpciBwYXJlbnQgdGltZWxpbmUncyBwbGF5aGVhZCBnb2VzIGJhY2t3YXJkIHBhc3QgdGhlIHN0YXJ0VGltZSBiZWNhdXNlIHRoZSBpbml0aWFsIHJlbmRlciBjb3VsZCBoYXZlIGhhcHBlbmVkIGFueXRpbWUgYW5kIGl0IHNob3VsZG4ndCBiZSBkaXJlY3RseSBjb3JyZWxhdGVkIHRvIHRoaXMgdHdlZW4ncyBzdGFydFRpbWUuIEltYWdpbmUgc2V0dGluZyB1cCBhIGNvbXBsZXggYW5pbWF0aW9uIHdoZXJlIHRoZSBiZWdpbm5pbmcgc3RhdGVzIG9mIHZhcmlvdXMgb2JqZWN0cyBhcmUgcmVuZGVyZWQgaW1tZWRpYXRlbHkgYnV0IHRoZSB0d2VlbiBkb2Vzbid0IGhhcHBlbiBmb3IgcXVpdGUgc29tZSB0aW1lIC0gaWYgd2UgcmV2ZXJ0IHRvIHRoZSBzdGFydGluZyB2YWx1ZXMgYXMgc29vbiBhcyB0aGUgcGxheWhlYWQgZ29lcyBiYWNrd2FyZCBwYXN0IHRoZSB0d2VlbidzIHN0YXJ0VGltZSwgaXQgd2lsbCB0aHJvdyB0aGluZ3Mgb2ZmIHZpc3VhbGx5LiBSZXZlcnNpb24gc2hvdWxkIG9ubHkgaGFwcGVuIGluIFRpbWVsaW5lTGl0ZS9NYXggaW5zdGFuY2VzIHdoZXJlIGltbWVkaWF0ZVJlbmRlciB3YXMgZmFsc2UgKHdoaWNoIGlzIHRoZSBkZWZhdWx0IGluIHRoZSBjb252ZW5pZW5jZSBtZXRob2RzIGxpa2UgZnJvbSgpKS5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGR1ciAhPT0gMCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuOyAvL3dlIHNraXAgaW5pdGlhbGl6YXRpb24gaGVyZSBzbyB0aGF0IG92ZXJ3cml0aW5nIGRvZXNuJ3Qgb2NjdXIgdW50aWwgdGhlIHR3ZWVuIGFjdHVhbGx5IGJlZ2lucy4gT3RoZXJ3aXNlLCBpZiB5b3UgY3JlYXRlIHNldmVyYWwgaW1tZWRpYXRlUmVuZGVyOnRydWUgdHdlZW5zIG9mIHRoZSBzYW1lIHRhcmdldC9wcm9wZXJ0aWVzIHRvIGRyb3AgaW50byBhIFRpbWVsaW5lTGl0ZSBvciBUaW1lbGluZU1heCwgdGhlIGxhc3Qgb25lIGNyZWF0ZWQgd291bGQgb3ZlcndyaXRlIHRoZSBmaXJzdCBvbmVzIGJlY2F1c2UgdGhleSBkaWRuJ3QgZ2V0IHBsYWNlZCBpbnRvIHRoZSB0aW1lbGluZSB5ZXQgYmVmb3JlIHRoZSBmaXJzdCByZW5kZXIgb2NjdXJzIGFuZCBraWNrcyBpbiBvdmVyd3JpdGluZy5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAodi5ydW5CYWNrd2FyZHMgJiYgZHVyICE9PSAwKSB7XG5cdFx0XHRcdC8vZnJvbSgpIHR3ZWVucyBtdXN0IGJlIGhhbmRsZWQgdW5pcXVlbHk6IHRoZWlyIGJlZ2lubmluZyB2YWx1ZXMgbXVzdCBiZSByZW5kZXJlZCBidXQgd2UgZG9uJ3Qgd2FudCBvdmVyd3JpdGluZyB0byBvY2N1ciB5ZXQgKHdoZW4gdGltZSBpcyBzdGlsbCAwKS4gV2FpdCB1bnRpbCB0aGUgdHdlZW4gYWN0dWFsbHkgYmVnaW5zIGJlZm9yZSBkb2luZyBhbGwgdGhlIHJvdXRpbmVzIGxpa2Ugb3ZlcndyaXRpbmcuIEF0IHRoYXQgdGltZSwgd2Ugc2hvdWxkIHJlbmRlciBhdCB0aGUgRU5EIG9mIHRoZSB0d2VlbiB0byBlbnN1cmUgdGhhdCB0aGluZ3MgaW5pdGlhbGl6ZSBjb3JyZWN0bHkgKHJlbWVtYmVyLCBmcm9tKCkgdHdlZW5zIGdvIGJhY2t3YXJkcylcblx0XHRcdFx0aWYgKHRoaXMuX3N0YXJ0QXQpIHtcblx0XHRcdFx0XHR0aGlzLl9zdGFydEF0LnJlbmRlcigtMSwgdHJ1ZSk7XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5raWxsKCk7XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdCA9IG51bGw7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX3RpbWUgIT09IDApIHsgLy9pbiByYXJlIGNhc2VzIChsaWtlIGlmIGEgZnJvbSgpIHR3ZWVuIHJ1bnMgYW5kIHRoZW4gaXMgaW52YWxpZGF0ZSgpLWVkKSwgaW1tZWRpYXRlUmVuZGVyIGNvdWxkIGJlIHRydWUgYnV0IHRoZSBpbml0aWFsIGZvcmNlZC1yZW5kZXIgZ2V0cyBza2lwcGVkLCBzbyB0aGVyZSdzIG5vIG5lZWQgdG8gZm9yY2UgdGhlIHJlbmRlciBpbiB0aGlzIGNvbnRleHQgd2hlbiB0aGUgX3RpbWUgaXMgZ3JlYXRlciB0aGFuIDBcblx0XHRcdFx0XHRcdGltbWVkaWF0ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IHt9O1xuXHRcdFx0XHRcdGZvciAocCBpbiB2KSB7IC8vY29weSBwcm9wcyBpbnRvIGEgbmV3IG9iamVjdCBhbmQgc2tpcCBhbnkgcmVzZXJ2ZWQgcHJvcHMsIG90aGVyd2lzZSBvbkNvbXBsZXRlIG9yIG9uVXBkYXRlIG9yIG9uU3RhcnQgY291bGQgZmlyZS4gV2Ugc2hvdWxkLCBob3dldmVyLCBwZXJtaXQgYXV0b0NTUyB0byBnbyB0aHJvdWdoLlxuXHRcdFx0XHRcdFx0aWYgKCFfcmVzZXJ2ZWRQcm9wc1twXSB8fCBwID09PSBcImF1dG9DU1NcIikge1xuXHRcdFx0XHRcdFx0XHRwdFtwXSA9IHZbcF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0Lm92ZXJ3cml0ZSA9IDA7XG5cdFx0XHRcdFx0cHQuZGF0YSA9IFwiaXNGcm9tU3RhcnRcIjsgLy93ZSB0YWcgdGhlIHR3ZWVuIHdpdGggYXMgXCJpc0Zyb21TdGFydFwiIHNvIHRoYXQgaWYgW2luc2lkZSBhIHBsdWdpbl0gd2UgbmVlZCB0byBvbmx5IGRvIHNvbWV0aGluZyBhdCB0aGUgdmVyeSBFTkQgb2YgYSB0d2Vlbiwgd2UgaGF2ZSBhIHdheSBvZiBpZGVudGlmeWluZyB0aGlzIHR3ZWVuIGFzIG1lcmVseSB0aGUgb25lIHRoYXQncyBzZXR0aW5nIHRoZSBiZWdpbm5pbmcgdmFsdWVzIGZvciBhIFwiZnJvbSgpXCIgdHdlZW4uIEZvciBleGFtcGxlLCBjbGVhclByb3BzIGluIENTU1BsdWdpbiBzaG91bGQgb25seSBnZXQgYXBwbGllZCBhdCB0aGUgdmVyeSBFTkQgb2YgYSB0d2VlbiBhbmQgd2l0aG91dCB0aGlzIHRhZywgZnJvbSguLi57aGVpZ2h0OjEwMCwgY2xlYXJQcm9wczpcImhlaWdodFwiLCBkZWxheToxfSkgd291bGQgd2lwZSB0aGUgaGVpZ2h0IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHR3ZWVuIGFuZCBhZnRlciAxIHNlY29uZCwgaXQnZCBraWNrIGJhY2sgaW4uXG5cdFx0XHRcdFx0cHQubGF6eSA9IChpbW1lZGlhdGUgJiYgdi5sYXp5ICE9PSBmYWxzZSk7XG5cdFx0XHRcdFx0cHQuaW1tZWRpYXRlUmVuZGVyID0gaW1tZWRpYXRlOyAvL3plcm8tZHVyYXRpb24gdHdlZW5zIHJlbmRlciBpbW1lZGlhdGVseSBieSBkZWZhdWx0LCBidXQgaWYgd2UncmUgbm90IHNwZWNpZmljYWxseSBpbnN0cnVjdGVkIHRvIHJlbmRlciB0aGlzIHR3ZWVuIGltbWVkaWF0ZWx5LCB3ZSBzaG91bGQgc2tpcCB0aGlzIGFuZCBtZXJlbHkgX2luaXQoKSB0byByZWNvcmQgdGhlIHN0YXJ0aW5nIHZhbHVlcyAocmVuZGVyaW5nIHRoZW0gaW1tZWRpYXRlbHkgd291bGQgcHVzaCB0aGVtIHRvIGNvbXBsZXRpb24gd2hpY2ggaXMgd2FzdGVmdWwgaW4gdGhhdCBjYXNlIC0gd2UnZCBoYXZlIHRvIHJlbmRlcigtMSkgaW1tZWRpYXRlbHkgYWZ0ZXIpXG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdCA9IFR3ZWVuTGl0ZS50byh0aGlzLnRhcmdldCwgMCwgcHQpO1xuXHRcdFx0XHRcdGlmICghaW1tZWRpYXRlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9zdGFydEF0Ll9pbml0KCk7IC8vZW5zdXJlcyB0aGF0IHRoZSBpbml0aWFsIHZhbHVlcyBhcmUgcmVjb3JkZWRcblx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQuX2VuYWJsZWQoZmFsc2UpOyAvL25vIG5lZWQgdG8gaGF2ZSB0aGUgdHdlZW4gcmVuZGVyIG9uIHRoZSBuZXh0IGN5Y2xlLiBEaXNhYmxlIGl0IGJlY2F1c2Ugd2UnbGwgYWx3YXlzIG1hbnVhbGx5IGNvbnRyb2wgdGhlIHJlbmRlcnMgb2YgdGhlIF9zdGFydEF0IHR3ZWVuLlxuXHRcdFx0XHRcdFx0aWYgKHRoaXMudmFycy5pbW1lZGlhdGVSZW5kZXIpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fc3RhcnRBdCA9IG51bGw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl90aW1lID09PSAwKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9lYXNlID0gZWFzZSA9ICghZWFzZSkgPyBUd2VlbkxpdGUuZGVmYXVsdEVhc2UgOiAoZWFzZSBpbnN0YW5jZW9mIEVhc2UpID8gZWFzZSA6ICh0eXBlb2YoZWFzZSkgPT09IFwiZnVuY3Rpb25cIikgPyBuZXcgRWFzZShlYXNlLCB2LmVhc2VQYXJhbXMpIDogX2Vhc2VNYXBbZWFzZV0gfHwgVHdlZW5MaXRlLmRlZmF1bHRFYXNlO1xuXHRcdFx0aWYgKHYuZWFzZVBhcmFtcyBpbnN0YW5jZW9mIEFycmF5ICYmIGVhc2UuY29uZmlnKSB7XG5cdFx0XHRcdHRoaXMuX2Vhc2UgPSBlYXNlLmNvbmZpZy5hcHBseShlYXNlLCB2LmVhc2VQYXJhbXMpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZWFzZVR5cGUgPSB0aGlzLl9lYXNlLl90eXBlO1xuXHRcdFx0dGhpcy5fZWFzZVBvd2VyID0gdGhpcy5fZWFzZS5fcG93ZXI7XG5cdFx0XHR0aGlzLl9maXJzdFBUID0gbnVsbDtcblxuXHRcdFx0aWYgKHRoaXMuX3RhcmdldHMpIHtcblx0XHRcdFx0bCA9IHRoaXMuX3RhcmdldHMubGVuZ3RoO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKCB0aGlzLl9pbml0UHJvcHMoIHRoaXMuX3RhcmdldHNbaV0sICh0aGlzLl9wcm9wTG9va3VwW2ldID0ge30pLCB0aGlzLl9zaWJsaW5nc1tpXSwgKG9wID8gb3BbaV0gOiBudWxsKSwgaSkgKSB7XG5cdFx0XHRcdFx0XHRpbml0UGx1Z2lucyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpbml0UGx1Z2lucyA9IHRoaXMuX2luaXRQcm9wcyh0aGlzLnRhcmdldCwgdGhpcy5fcHJvcExvb2t1cCwgdGhpcy5fc2libGluZ3MsIG9wLCAwKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGluaXRQbHVnaW5zKSB7XG5cdFx0XHRcdFR3ZWVuTGl0ZS5fb25QbHVnaW5FdmVudChcIl9vbkluaXRBbGxQcm9wc1wiLCB0aGlzKTsgLy9yZW9yZGVycyB0aGUgYXJyYXkgaW4gb3JkZXIgb2YgcHJpb3JpdHkuIFVzZXMgYSBzdGF0aWMgVHdlZW5QbHVnaW4gbWV0aG9kIGluIG9yZGVyIHRvIG1pbmltaXplIGZpbGUgc2l6ZSBpbiBUd2VlbkxpdGVcblx0XHRcdH1cblx0XHRcdGlmIChvcCkgaWYgKCF0aGlzLl9maXJzdFBUKSBpZiAodHlwZW9mKHRoaXMudGFyZ2V0KSAhPT0gXCJmdW5jdGlvblwiKSB7IC8vaWYgYWxsIHR3ZWVuaW5nIHByb3BlcnRpZXMgaGF2ZSBiZWVuIG92ZXJ3cml0dGVuLCBraWxsIHRoZSB0d2Vlbi4gSWYgdGhlIHRhcmdldCBpcyBhIGZ1bmN0aW9uLCBpdCdzIHByb2JhYmx5IGEgZGVsYXllZENhbGwgc28gbGV0IGl0IGxpdmUuXG5cdFx0XHRcdHRoaXMuX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdH1cblx0XHRcdGlmICh2LnJ1bkJhY2t3YXJkcykge1xuXHRcdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQ7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdHB0LnMgKz0gcHQuYztcblx0XHRcdFx0XHRwdC5jID0gLXB0LmM7XG5cdFx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fb25VcGRhdGUgPSB2Lm9uVXBkYXRlO1xuXHRcdFx0dGhpcy5faW5pdHRlZCA9IHRydWU7XG5cdFx0fTtcblxuXHRcdHAuX2luaXRQcm9wcyA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcExvb2t1cCwgc2libGluZ3MsIG92ZXJ3cml0dGVuUHJvcHMsIGluZGV4KSB7XG5cdFx0XHR2YXIgcCwgaSwgaW5pdFBsdWdpbnMsIHBsdWdpbiwgcHQsIHY7XG5cdFx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoX2xhenlMb29rdXBbdGFyZ2V0Ll9nc1R3ZWVuSURdKSB7XG5cdFx0XHRcdF9sYXp5UmVuZGVyKCk7IC8vaWYgb3RoZXIgdHdlZW5zIG9mIHRoZSBzYW1lIHRhcmdldCBoYXZlIHJlY2VudGx5IGluaXR0ZWQgYnV0IGhhdmVuJ3QgcmVuZGVyZWQgeWV0LCB3ZSd2ZSBnb3QgdG8gZm9yY2UgdGhlIHJlbmRlciBzbyB0aGF0IHRoZSBzdGFydGluZyB2YWx1ZXMgYXJlIGNvcnJlY3QgKGltYWdpbmUgcG9wdWxhdGluZyBhIHRpbWVsaW5lIHdpdGggYSBidW5jaCBvZiBzZXF1ZW50aWFsIHR3ZWVucyBhbmQgdGhlbiBqdW1waW5nIHRvIHRoZSBlbmQpXG5cdFx0XHR9XG5cblx0XHRcdGlmICghdGhpcy52YXJzLmNzcykgaWYgKHRhcmdldC5zdHlsZSkgaWYgKHRhcmdldCAhPT0gd2luZG93ICYmIHRhcmdldC5ub2RlVHlwZSkgaWYgKF9wbHVnaW5zLmNzcykgaWYgKHRoaXMudmFycy5hdXRvQ1NTICE9PSBmYWxzZSkgeyAvL2l0J3Mgc28gY29tbW9uIHRvIHVzZSBUd2VlbkxpdGUvTWF4IHRvIGFuaW1hdGUgdGhlIGNzcyBvZiBET00gZWxlbWVudHMsIHdlIGFzc3VtZSB0aGF0IGlmIHRoZSB0YXJnZXQgaXMgYSBET00gZWxlbWVudCwgdGhhdCdzIHdoYXQgaXMgaW50ZW5kZWQgKGEgY29udmVuaWVuY2Ugc28gdGhhdCB1c2VycyBkb24ndCBoYXZlIHRvIHdyYXAgdGhpbmdzIGluIGNzczp7fSwgYWx0aG91Z2ggd2Ugc3RpbGwgcmVjb21tZW5kIGl0IGZvciBhIHNsaWdodCBwZXJmb3JtYW5jZSBib29zdCBhbmQgYmV0dGVyIHNwZWNpZmljaXR5KS4gTm90ZTogd2UgY2Fubm90IGNoZWNrIFwibm9kZVR5cGVcIiBvbiB0aGUgd2luZG93IGluc2lkZSBhbiBpZnJhbWUuXG5cdFx0XHRcdF9hdXRvQ1NTKHRoaXMudmFycywgdGFyZ2V0KTtcblx0XHRcdH1cblx0XHRcdGZvciAocCBpbiB0aGlzLnZhcnMpIHtcblx0XHRcdFx0diA9IHRoaXMudmFyc1twXTtcblx0XHRcdFx0aWYgKF9yZXNlcnZlZFByb3BzW3BdKSB7XG5cdFx0XHRcdFx0aWYgKHYpIGlmICgodiBpbnN0YW5jZW9mIEFycmF5KSB8fCAodi5wdXNoICYmIF9pc0FycmF5KHYpKSkgaWYgKHYuam9pbihcIlwiKS5pbmRleE9mKFwie3NlbGZ9XCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0dGhpcy52YXJzW3BdID0gdiA9IHRoaXMuX3N3YXBTZWxmSW5QYXJhbXModiwgdGhpcyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSBpZiAoX3BsdWdpbnNbcF0gJiYgKHBsdWdpbiA9IG5ldyBfcGx1Z2luc1twXSgpKS5fb25Jbml0VHdlZW4odGFyZ2V0LCB0aGlzLnZhcnNbcF0sIHRoaXMsIGluZGV4KSkge1xuXG5cdFx0XHRcdFx0Ly90IC0gdGFyZ2V0IFx0XHRbb2JqZWN0XVxuXHRcdFx0XHRcdC8vcCAtIHByb3BlcnR5IFx0XHRbc3RyaW5nXVxuXHRcdFx0XHRcdC8vcyAtIHN0YXJ0XHRcdFx0W251bWJlcl1cblx0XHRcdFx0XHQvL2MgLSBjaGFuZ2VcdFx0W251bWJlcl1cblx0XHRcdFx0XHQvL2YgLSBpc0Z1bmN0aW9uXHRbYm9vbGVhbl1cblx0XHRcdFx0XHQvL24gLSBuYW1lXHRcdFx0W3N0cmluZ11cblx0XHRcdFx0XHQvL3BnIC0gaXNQbHVnaW4gXHRbYm9vbGVhbl1cblx0XHRcdFx0XHQvL3ByIC0gcHJpb3JpdHlcdFx0W251bWJlcl1cblx0XHRcdFx0XHQvL20gLSBtb2QgICAgICAgICAgIFtmdW5jdGlvbiB8IDBdXG5cdFx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IHB0ID0ge19uZXh0OnRoaXMuX2ZpcnN0UFQsIHQ6cGx1Z2luLCBwOlwic2V0UmF0aW9cIiwgczowLCBjOjEsIGY6MSwgbjpwLCBwZzoxLCBwcjpwbHVnaW4uX3ByaW9yaXR5LCBtOjB9O1xuXHRcdFx0XHRcdGkgPSBwbHVnaW4uX292ZXJ3cml0ZVByb3BzLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdHByb3BMb29rdXBbcGx1Z2luLl9vdmVyd3JpdGVQcm9wc1tpXV0gPSB0aGlzLl9maXJzdFBUO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocGx1Z2luLl9wcmlvcml0eSB8fCBwbHVnaW4uX29uSW5pdEFsbFByb3BzKSB7XG5cdFx0XHRcdFx0XHRpbml0UGx1Z2lucyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwbHVnaW4uX29uRGlzYWJsZSB8fCBwbHVnaW4uX29uRW5hYmxlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHB0Ll9uZXh0KSB7XG5cdFx0XHRcdFx0XHRwdC5fbmV4dC5fcHJldiA9IHB0O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHByb3BMb29rdXBbcF0gPSBfYWRkUHJvcFR3ZWVuLmNhbGwodGhpcywgdGFyZ2V0LCBwLCBcImdldFwiLCB2LCBwLCAwLCBudWxsLCB0aGlzLnZhcnMuc3RyaW5nRmlsdGVyLCBpbmRleCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG92ZXJ3cml0dGVuUHJvcHMpIGlmICh0aGlzLl9raWxsKG92ZXJ3cml0dGVuUHJvcHMsIHRhcmdldCkpIHsgLy9hbm90aGVyIHR3ZWVuIG1heSBoYXZlIHRyaWVkIHRvIG92ZXJ3cml0ZSBwcm9wZXJ0aWVzIG9mIHRoaXMgdHdlZW4gYmVmb3JlIGluaXQoKSB3YXMgY2FsbGVkIChsaWtlIGlmIHR3byB0d2VlbnMgc3RhcnQgYXQgdGhlIHNhbWUgdGltZSwgdGhlIG9uZSBjcmVhdGVkIHNlY29uZCB3aWxsIHJ1biBmaXJzdClcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2luaXRQcm9wcyh0YXJnZXQsIHByb3BMb29rdXAsIHNpYmxpbmdzLCBvdmVyd3JpdHRlblByb3BzLCBpbmRleCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fb3ZlcndyaXRlID4gMSkgaWYgKHRoaXMuX2ZpcnN0UFQpIGlmIChzaWJsaW5ncy5sZW5ndGggPiAxKSBpZiAoX2FwcGx5T3ZlcndyaXRlKHRhcmdldCwgdGhpcywgcHJvcExvb2t1cCwgdGhpcy5fb3ZlcndyaXRlLCBzaWJsaW5ncykpIHtcblx0XHRcdFx0dGhpcy5fa2lsbChwcm9wTG9va3VwLCB0YXJnZXQpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5faW5pdFByb3BzKHRhcmdldCwgcHJvcExvb2t1cCwgc2libGluZ3MsIG92ZXJ3cml0dGVuUHJvcHMsIGluZGV4KTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9maXJzdFBUKSBpZiAoKHRoaXMudmFycy5sYXp5ICE9PSBmYWxzZSAmJiB0aGlzLl9kdXJhdGlvbikgfHwgKHRoaXMudmFycy5sYXp5ICYmICF0aGlzLl9kdXJhdGlvbikpIHsgLy96ZXJvIGR1cmF0aW9uIHR3ZWVucyBkb24ndCBsYXp5IHJlbmRlciBieSBkZWZhdWx0OyBldmVyeXRoaW5nIGVsc2UgZG9lcy5cblx0XHRcdFx0X2xhenlMb29rdXBbdGFyZ2V0Ll9nc1R3ZWVuSURdID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpbml0UGx1Z2lucztcblx0XHR9O1xuXG5cdFx0cC5yZW5kZXIgPSBmdW5jdGlvbih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpIHtcblx0XHRcdHZhciBwcmV2VGltZSA9IHRoaXMuX3RpbWUsXG5cdFx0XHRcdGR1cmF0aW9uID0gdGhpcy5fZHVyYXRpb24sXG5cdFx0XHRcdHByZXZSYXdQcmV2VGltZSA9IHRoaXMuX3Jhd1ByZXZUaW1lLFxuXHRcdFx0XHRpc0NvbXBsZXRlLCBjYWxsYmFjaywgcHQsIHJhd1ByZXZUaW1lO1xuXHRcdFx0aWYgKHRpbWUgPj0gZHVyYXRpb24gLSAwLjAwMDAwMDEpIHsgLy90byB3b3JrIGFyb3VuZCBvY2Nhc2lvbmFsIGZsb2F0aW5nIHBvaW50IG1hdGggYXJ0aWZhY3RzLlxuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl90aW1lID0gZHVyYXRpb247XG5cdFx0XHRcdHRoaXMucmF0aW8gPSB0aGlzLl9lYXNlLl9jYWxjRW5kID8gdGhpcy5fZWFzZS5nZXRSYXRpbygxKSA6IDE7XG5cdFx0XHRcdGlmICghdGhpcy5fcmV2ZXJzZWQgKSB7XG5cdFx0XHRcdFx0aXNDb21wbGV0ZSA9IHRydWU7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uQ29tcGxldGVcIjtcblx0XHRcdFx0XHRmb3JjZSA9IChmb3JjZSB8fCB0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4pOyAvL290aGVyd2lzZSwgaWYgdGhlIGFuaW1hdGlvbiBpcyB1bnBhdXNlZC9hY3RpdmF0ZWQgYWZ0ZXIgaXQncyBhbHJlYWR5IGZpbmlzaGVkLCBpdCBkb2Vzbid0IGdldCByZW1vdmVkIGZyb20gdGhlIHBhcmVudCB0aW1lbGluZS5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZHVyYXRpb24gPT09IDApIGlmICh0aGlzLl9pbml0dGVkIHx8ICF0aGlzLnZhcnMubGF6eSB8fCBmb3JjZSkgeyAvL3plcm8tZHVyYXRpb24gdHdlZW5zIGFyZSB0cmlja3kgYmVjYXVzZSB3ZSBtdXN0IGRpc2Nlcm4gdGhlIG1vbWVudHVtL2RpcmVjdGlvbiBvZiB0aW1lIGluIG9yZGVyIHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBzdGFydGluZyB2YWx1ZXMgc2hvdWxkIGJlIHJlbmRlcmVkIG9yIHRoZSBlbmRpbmcgdmFsdWVzLiBJZiB0aGUgXCJwbGF5aGVhZFwiIG9mIGl0cyB0aW1lbGluZSBnb2VzIHBhc3QgdGhlIHplcm8tZHVyYXRpb24gdHdlZW4gaW4gdGhlIGZvcndhcmQgZGlyZWN0aW9uIG9yIGxhbmRzIGRpcmVjdGx5IG9uIGl0LCB0aGUgZW5kIHZhbHVlcyBzaG91bGQgYmUgcmVuZGVyZWQsIGJ1dCBpZiB0aGUgdGltZWxpbmUncyBcInBsYXloZWFkXCIgbW92ZXMgcGFzdCBpdCBpbiB0aGUgYmFja3dhcmQgZGlyZWN0aW9uIChmcm9tIGEgcG9zdGl0aXZlIHRpbWUgdG8gYSBuZWdhdGl2ZSB0aW1lKSwgdGhlIHN0YXJ0aW5nIHZhbHVlcyBtdXN0IGJlIHJlbmRlcmVkLlxuXHRcdFx0XHRcdGlmICh0aGlzLl9zdGFydFRpbWUgPT09IHRoaXMuX3RpbWVsaW5lLl9kdXJhdGlvbikgeyAvL2lmIGEgemVyby1kdXJhdGlvbiB0d2VlbiBpcyBhdCB0aGUgVkVSWSBlbmQgb2YgYSB0aW1lbGluZSBhbmQgdGhhdCB0aW1lbGluZSByZW5kZXJzIGF0IGl0cyBlbmQsIGl0IHdpbGwgdHlwaWNhbGx5IGFkZCBhIHRpbnkgYml0IG9mIGN1c2hpb24gdG8gdGhlIHJlbmRlciB0aW1lIHRvIHByZXZlbnQgcm91bmRpbmcgZXJyb3JzIGZyb20gZ2V0dGluZyBpbiB0aGUgd2F5IG9mIHR3ZWVucyByZW5kZXJpbmcgdGhlaXIgVkVSWSBlbmQuIElmIHdlIHRoZW4gcmV2ZXJzZSgpIHRoYXQgdGltZWxpbmUsIHRoZSB6ZXJvLWR1cmF0aW9uIHR3ZWVuIHdpbGwgdHJpZ2dlciBpdHMgb25SZXZlcnNlQ29tcGxldGUgZXZlbiB0aG91Z2ggdGVjaG5pY2FsbHkgdGhlIHBsYXloZWFkIGRpZG4ndCBwYXNzIG92ZXIgaXQgYWdhaW4uIEl0J3MgYSB2ZXJ5IHNwZWNpZmljIGVkZ2UgY2FzZSB3ZSBtdXN0IGFjY29tbW9kYXRlLlxuXHRcdFx0XHRcdFx0dGltZSA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwcmV2UmF3UHJldlRpbWUgPCAwIHx8ICh0aW1lIDw9IDAgJiYgdGltZSA+PSAtMC4wMDAwMDAxKSB8fCAocHJldlJhd1ByZXZUaW1lID09PSBfdGlueU51bSAmJiB0aGlzLmRhdGEgIT09IFwiaXNQYXVzZVwiKSkgaWYgKHByZXZSYXdQcmV2VGltZSAhPT0gdGltZSkgeyAvL25vdGU6IHdoZW4gdGhpcy5kYXRhIGlzIFwiaXNQYXVzZVwiLCBpdCdzIGEgY2FsbGJhY2sgYWRkZWQgYnkgYWRkUGF1c2UoKSBvbiBhIHRpbWVsaW5lIHRoYXQgd2Ugc2hvdWxkIG5vdCBiZSB0cmlnZ2VyZWQgd2hlbiBMRUFWSU5HIGl0cyBleGFjdCBzdGFydCB0aW1lLiBJbiBvdGhlciB3b3JkcywgdGwuYWRkUGF1c2UoMSkucGxheSgxKSBzaG91bGRuJ3QgcGF1c2UuXG5cdFx0XHRcdFx0XHRmb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0XHRpZiAocHJldlJhd1ByZXZUaW1lID4gX3RpbnlOdW0pIHtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gcmF3UHJldlRpbWUgPSAoIXN1cHByZXNzRXZlbnRzIHx8IHRpbWUgfHwgcHJldlJhd1ByZXZUaW1lID09PSB0aW1lKSA/IHRpbWUgOiBfdGlueU51bTsgLy93aGVuIHRoZSBwbGF5aGVhZCBhcnJpdmVzIGF0IEVYQUNUTFkgdGltZSAwIChyaWdodCBvbiB0b3ApIG9mIGEgemVyby1kdXJhdGlvbiB0d2Vlbiwgd2UgbmVlZCB0byBkaXNjZXJuIGlmIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBzbyB0aGF0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIGFnYWluIChuZXh0IHRpbWUpLCBpdCdsbCB0cmlnZ2VyIHRoZSBjYWxsYmFjay4gSWYgZXZlbnRzIGFyZSBOT1Qgc3VwcHJlc3NlZCwgb2J2aW91c2x5IHRoZSBjYWxsYmFjayB3b3VsZCBiZSB0cmlnZ2VyZWQgaW4gdGhpcyByZW5kZXIuIEJhc2ljYWxseSwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlIGVpdGhlciB3aGVuIHRoZSBwbGF5aGVhZCBBUlJJVkVTIG9yIExFQVZFUyB0aGlzIGV4YWN0IHNwb3QsIG5vdCBib3RoLiBJbWFnaW5lIGRvaW5nIGEgdGltZWxpbmUuc2VlaygwKSBhbmQgdGhlcmUncyBhIGNhbGxiYWNrIHRoYXQgc2l0cyBhdCAwLiBTaW5jZSBldmVudHMgYXJlIHN1cHByZXNzZWQgb24gdGhhdCBzZWVrKCkgYnkgZGVmYXVsdCwgbm90aGluZyB3aWxsIGZpcmUsIGJ1dCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBvZmYgb2YgdGhhdCBwb3NpdGlvbiwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlLiBUaGlzIGJlaGF2aW9yIGlzIHdoYXQgcGVvcGxlIGludHVpdGl2ZWx5IGV4cGVjdC4gV2Ugc2V0IHRoZSBfcmF3UHJldlRpbWUgdG8gYmUgYSBwcmVjaXNlIHRpbnkgbnVtYmVyIHRvIGluZGljYXRlIHRoaXMgc2NlbmFyaW8gcmF0aGVyIHRoYW4gdXNpbmcgYW5vdGhlciBwcm9wZXJ0eS92YXJpYWJsZSB3aGljaCB3b3VsZCBpbmNyZWFzZSBtZW1vcnkgdXNhZ2UuIFRoaXMgdGVjaG5pcXVlIGlzIGxlc3MgcmVhZGFibGUsIGJ1dCBtb3JlIGVmZmljaWVudC5cblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2UgaWYgKHRpbWUgPCAwLjAwMDAwMDEpIHsgLy90byB3b3JrIGFyb3VuZCBvY2Nhc2lvbmFsIGZsb2F0aW5nIHBvaW50IG1hdGggYXJ0aWZhY3RzLCByb3VuZCBzdXBlciBzbWFsbCB2YWx1ZXMgdG8gMC5cblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdGltZSA9IDA7XG5cdFx0XHRcdHRoaXMucmF0aW8gPSB0aGlzLl9lYXNlLl9jYWxjRW5kID8gdGhpcy5fZWFzZS5nZXRSYXRpbygwKSA6IDA7XG5cdFx0XHRcdGlmIChwcmV2VGltZSAhPT0gMCB8fCAoZHVyYXRpb24gPT09IDAgJiYgcHJldlJhd1ByZXZUaW1lID4gMCkpIHtcblx0XHRcdFx0XHRjYWxsYmFjayA9IFwib25SZXZlcnNlQ29tcGxldGVcIjtcblx0XHRcdFx0XHRpc0NvbXBsZXRlID0gdGhpcy5fcmV2ZXJzZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRpbWUgPCAwKSB7XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdFx0aWYgKGR1cmF0aW9uID09PSAwKSBpZiAodGhpcy5faW5pdHRlZCB8fCAhdGhpcy52YXJzLmxhenkgfHwgZm9yY2UpIHsgLy96ZXJvLWR1cmF0aW9uIHR3ZWVucyBhcmUgdHJpY2t5IGJlY2F1c2Ugd2UgbXVzdCBkaXNjZXJuIHRoZSBtb21lbnR1bS9kaXJlY3Rpb24gb2YgdGltZSBpbiBvcmRlciB0byBkZXRlcm1pbmUgd2hldGhlciB0aGUgc3RhcnRpbmcgdmFsdWVzIHNob3VsZCBiZSByZW5kZXJlZCBvciB0aGUgZW5kaW5nIHZhbHVlcy4gSWYgdGhlIFwicGxheWhlYWRcIiBvZiBpdHMgdGltZWxpbmUgZ29lcyBwYXN0IHRoZSB6ZXJvLWR1cmF0aW9uIHR3ZWVuIGluIHRoZSBmb3J3YXJkIGRpcmVjdGlvbiBvciBsYW5kcyBkaXJlY3RseSBvbiBpdCwgdGhlIGVuZCB2YWx1ZXMgc2hvdWxkIGJlIHJlbmRlcmVkLCBidXQgaWYgdGhlIHRpbWVsaW5lJ3MgXCJwbGF5aGVhZFwiIG1vdmVzIHBhc3QgaXQgaW4gdGhlIGJhY2t3YXJkIGRpcmVjdGlvbiAoZnJvbSBhIHBvc3RpdGl2ZSB0aW1lIHRvIGEgbmVnYXRpdmUgdGltZSksIHRoZSBzdGFydGluZyB2YWx1ZXMgbXVzdCBiZSByZW5kZXJlZC5cblx0XHRcdFx0XHRcdGlmIChwcmV2UmF3UHJldlRpbWUgPj0gMCAmJiAhKHByZXZSYXdQcmV2VGltZSA9PT0gX3RpbnlOdW0gJiYgdGhpcy5kYXRhID09PSBcImlzUGF1c2VcIikpIHtcblx0XHRcdFx0XHRcdFx0Zm9yY2UgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSByYXdQcmV2VGltZSA9ICghc3VwcHJlc3NFdmVudHMgfHwgdGltZSB8fCBwcmV2UmF3UHJldlRpbWUgPT09IHRpbWUpID8gdGltZSA6IF90aW55TnVtOyAvL3doZW4gdGhlIHBsYXloZWFkIGFycml2ZXMgYXQgRVhBQ1RMWSB0aW1lIDAgKHJpZ2h0IG9uIHRvcCkgb2YgYSB6ZXJvLWR1cmF0aW9uIHR3ZWVuLCB3ZSBuZWVkIHRvIGRpc2Nlcm4gaWYgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIHNvIHRoYXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgYWdhaW4gKG5leHQgdGltZSksIGl0J2xsIHRyaWdnZXIgdGhlIGNhbGxiYWNrLiBJZiBldmVudHMgYXJlIE5PVCBzdXBwcmVzc2VkLCBvYnZpb3VzbHkgdGhlIGNhbGxiYWNrIHdvdWxkIGJlIHRyaWdnZXJlZCBpbiB0aGlzIHJlbmRlci4gQmFzaWNhbGx5LCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUgZWl0aGVyIHdoZW4gdGhlIHBsYXloZWFkIEFSUklWRVMgb3IgTEVBVkVTIHRoaXMgZXhhY3Qgc3BvdCwgbm90IGJvdGguIEltYWdpbmUgZG9pbmcgYSB0aW1lbGluZS5zZWVrKDApIGFuZCB0aGVyZSdzIGEgY2FsbGJhY2sgdGhhdCBzaXRzIGF0IDAuIFNpbmNlIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBvbiB0aGF0IHNlZWsoKSBieSBkZWZhdWx0LCBub3RoaW5nIHdpbGwgZmlyZSwgYnV0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIG9mZiBvZiB0aGF0IHBvc2l0aW9uLCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUuIFRoaXMgYmVoYXZpb3IgaXMgd2hhdCBwZW9wbGUgaW50dWl0aXZlbHkgZXhwZWN0LiBXZSBzZXQgdGhlIF9yYXdQcmV2VGltZSB0byBiZSBhIHByZWNpc2UgdGlueSBudW1iZXIgdG8gaW5kaWNhdGUgdGhpcyBzY2VuYXJpbyByYXRoZXIgdGhhbiB1c2luZyBhbm90aGVyIHByb3BlcnR5L3ZhcmlhYmxlIHdoaWNoIHdvdWxkIGluY3JlYXNlIG1lbW9yeSB1c2FnZS4gVGhpcyB0ZWNobmlxdWUgaXMgbGVzcyByZWFkYWJsZSwgYnV0IG1vcmUgZWZmaWNpZW50LlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXRoaXMuX2luaXR0ZWQpIHsgLy9pZiB3ZSByZW5kZXIgdGhlIHZlcnkgYmVnaW5uaW5nICh0aW1lID09IDApIG9mIGEgZnJvbVRvKCksIHdlIG11c3QgZm9yY2UgdGhlIHJlbmRlciAobm9ybWFsIHR3ZWVucyB3b3VsZG4ndCBuZWVkIHRvIHJlbmRlciBhdCBhIHRpbWUgb2YgMCB3aGVuIHRoZSBwcmV2VGltZSB3YXMgYWxzbyAwKS4gVGhpcyBpcyBhbHNvIG1hbmRhdG9yeSB0byBtYWtlIHN1cmUgb3ZlcndyaXRpbmcga2lja3MgaW4gaW1tZWRpYXRlbHkuXG5cdFx0XHRcdFx0Zm9yY2UgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl90aW1lID0gdGltZTtcblxuXHRcdFx0XHRpZiAodGhpcy5fZWFzZVR5cGUpIHtcblx0XHRcdFx0XHR2YXIgciA9IHRpbWUgLyBkdXJhdGlvbiwgdHlwZSA9IHRoaXMuX2Vhc2VUeXBlLCBwb3cgPSB0aGlzLl9lYXNlUG93ZXI7XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IDEgfHwgKHR5cGUgPT09IDMgJiYgciA+PSAwLjUpKSB7XG5cdFx0XHRcdFx0XHRyID0gMSAtIHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAzKSB7XG5cdFx0XHRcdFx0XHRyICo9IDI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwb3cgPT09IDEpIHtcblx0XHRcdFx0XHRcdHIgKj0gcjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHBvdyA9PT0gMikge1xuXHRcdFx0XHRcdFx0ciAqPSByICogcjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHBvdyA9PT0gMykge1xuXHRcdFx0XHRcdFx0ciAqPSByICogciAqIHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwb3cgPT09IDQpIHtcblx0XHRcdFx0XHRcdHIgKj0gciAqIHIgKiByICogcjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0dGhpcy5yYXRpbyA9IDEgLSByO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gMikge1xuXHRcdFx0XHRcdFx0dGhpcy5yYXRpbyA9IHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0aW1lIC8gZHVyYXRpb24gPCAwLjUpIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSByIC8gMjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5yYXRpbyA9IDEgLSAociAvIDIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMucmF0aW8gPSB0aGlzLl9lYXNlLmdldFJhdGlvKHRpbWUgLyBkdXJhdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX3RpbWUgPT09IHByZXZUaW1lICYmICFmb3JjZSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2UgaWYgKCF0aGlzLl9pbml0dGVkKSB7XG5cdFx0XHRcdHRoaXMuX2luaXQoKTtcblx0XHRcdFx0aWYgKCF0aGlzLl9pbml0dGVkIHx8IHRoaXMuX2djKSB7IC8vaW1tZWRpYXRlUmVuZGVyIHR3ZWVucyB0eXBpY2FsbHkgd29uJ3QgaW5pdGlhbGl6ZSB1bnRpbCB0aGUgcGxheWhlYWQgYWR2YW5jZXMgKF90aW1lIGlzIGdyZWF0ZXIgdGhhbiAwKSBpbiBvcmRlciB0byBlbnN1cmUgdGhhdCBvdmVyd3JpdGluZyBvY2N1cnMgcHJvcGVybHkuIEFsc28sIGlmIGFsbCBvZiB0aGUgdHdlZW5pbmcgcHJvcGVydGllcyBoYXZlIGJlZW4gb3ZlcndyaXR0ZW4gKHdoaWNoIHdvdWxkIGNhdXNlIF9nYyB0byBiZSB0cnVlLCBhcyBzZXQgaW4gX2luaXQoKSksIHdlIHNob3VsZG4ndCBjb250aW51ZSBvdGhlcndpc2UgYW4gb25TdGFydCBjYWxsYmFjayBjb3VsZCBiZSBjYWxsZWQgZm9yIGV4YW1wbGUuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCFmb3JjZSAmJiB0aGlzLl9maXJzdFBUICYmICgodGhpcy52YXJzLmxhenkgIT09IGZhbHNlICYmIHRoaXMuX2R1cmF0aW9uKSB8fCAodGhpcy52YXJzLmxhenkgJiYgIXRoaXMuX2R1cmF0aW9uKSkpIHtcblx0XHRcdFx0XHR0aGlzLl90aW1lID0gdGhpcy5fdG90YWxUaW1lID0gcHJldlRpbWU7XG5cdFx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSBwcmV2UmF3UHJldlRpbWU7XG5cdFx0XHRcdFx0X2xhenlUd2VlbnMucHVzaCh0aGlzKTtcblx0XHRcdFx0XHR0aGlzLl9sYXp5ID0gW3RpbWUsIHN1cHByZXNzRXZlbnRzXTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9fZWFzZSBpcyBpbml0aWFsbHkgc2V0IHRvIGRlZmF1bHRFYXNlLCBzbyBub3cgdGhhdCBpbml0KCkgaGFzIHJ1biwgX2Vhc2UgaXMgc2V0IHByb3Blcmx5IGFuZCB3ZSBuZWVkIHRvIHJlY2FsY3VsYXRlIHRoZSByYXRpby4gT3ZlcmFsbCB0aGlzIGlzIGZhc3RlciB0aGFuIHVzaW5nIGNvbmRpdGlvbmFsIGxvZ2ljIGVhcmxpZXIgaW4gdGhlIG1ldGhvZCB0byBhdm9pZCBoYXZpbmcgdG8gc2V0IHJhdGlvIHR3aWNlIGJlY2F1c2Ugd2Ugb25seSBpbml0KCkgb25jZSBidXQgcmVuZGVyVGltZSgpIGdldHMgY2FsbGVkIFZFUlkgZnJlcXVlbnRseS5cblx0XHRcdFx0aWYgKHRoaXMuX3RpbWUgJiYgIWlzQ29tcGxldGUpIHtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5nZXRSYXRpbyh0aGlzLl90aW1lIC8gZHVyYXRpb24pO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGlzQ29tcGxldGUgJiYgdGhpcy5fZWFzZS5fY2FsY0VuZCkge1xuXHRcdFx0XHRcdHRoaXMucmF0aW8gPSB0aGlzLl9lYXNlLmdldFJhdGlvKCh0aGlzLl90aW1lID09PSAwKSA/IDAgOiAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuX2xhenkgIT09IGZhbHNlKSB7IC8vaW4gY2FzZSBhIGxhenkgcmVuZGVyIGlzIHBlbmRpbmcsIHdlIHNob3VsZCBmbHVzaCBpdCBiZWNhdXNlIHRoZSBuZXcgcmVuZGVyIGlzIG9jY3VycmluZyBub3cgKGltYWdpbmUgYSBsYXp5IHR3ZWVuIGluc3RhbnRpYXRpbmcgYW5kIHRoZW4gaW1tZWRpYXRlbHkgdGhlIHVzZXIgY2FsbHMgdHdlZW4uc2Vlayh0d2Vlbi5kdXJhdGlvbigpKSwgc2tpcHBpbmcgdG8gdGhlIGVuZCAtIHRoZSBlbmQgcmVuZGVyIHdvdWxkIGJlIGZvcmNlZCwgYW5kIHRoZW4gaWYgd2UgZGlkbid0IGZsdXNoIHRoZSBsYXp5IHJlbmRlciwgaXQnZCBmaXJlIEFGVEVSIHRoZSBzZWVrKCksIHJlbmRlcmluZyBpdCBhdCB0aGUgd3JvbmcgdGltZS5cblx0XHRcdFx0dGhpcy5fbGF6eSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF0aGlzLl9hY3RpdmUpIGlmICghdGhpcy5fcGF1c2VkICYmIHRoaXMuX3RpbWUgIT09IHByZXZUaW1lICYmIHRpbWUgPj0gMCkge1xuXHRcdFx0XHR0aGlzLl9hY3RpdmUgPSB0cnVlOyAgLy9zbyB0aGF0IGlmIHRoZSB1c2VyIHJlbmRlcnMgYSB0d2VlbiAoYXMgb3Bwb3NlZCB0byB0aGUgdGltZWxpbmUgcmVuZGVyaW5nIGl0KSwgdGhlIHRpbWVsaW5lIGlzIGZvcmNlZCB0byByZS1yZW5kZXIgYW5kIGFsaWduIGl0IHdpdGggdGhlIHByb3BlciB0aW1lL2ZyYW1lIG9uIHRoZSBuZXh0IHJlbmRlcmluZyBjeWNsZS4gTWF5YmUgdGhlIHR3ZWVuIGFscmVhZHkgZmluaXNoZWQgYnV0IHRoZSB1c2VyIG1hbnVhbGx5IHJlLXJlbmRlcnMgaXQgYXMgaGFsZndheSBkb25lLlxuXHRcdFx0fVxuXHRcdFx0aWYgKHByZXZUaW1lID09PSAwKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9zdGFydEF0KSB7XG5cdFx0XHRcdFx0aWYgKHRpbWUgPj0gMCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5yZW5kZXIodGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCFjYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIl9kdW1teUdTXCI7IC8vaWYgbm8gY2FsbGJhY2sgaXMgZGVmaW5lZCwgdXNlIGEgZHVtbXkgdmFsdWUganVzdCBzbyB0aGF0IHRoZSBjb25kaXRpb24gYXQgdGhlIGVuZCBldmFsdWF0ZXMgYXMgdHJ1ZSBiZWNhdXNlIF9zdGFydEF0IHNob3VsZCByZW5kZXIgQUZURVIgdGhlIG5vcm1hbCByZW5kZXIgbG9vcCB3aGVuIHRoZSB0aW1lIGlzIG5lZ2F0aXZlLiBXZSBjb3VsZCBoYW5kbGUgdGhpcyBpbiBhIG1vcmUgaW50dWl0aXZlIHdheSwgb2YgY291cnNlLCBidXQgdGhlIHJlbmRlciBsb29wIGlzIHRoZSBNT1NUIGltcG9ydGFudCB0aGluZyB0byBvcHRpbWl6ZSwgc28gdGhpcyB0ZWNobmlxdWUgYWxsb3dzIHVzIHRvIGF2b2lkIGFkZGluZyBleHRyYSBjb25kaXRpb25hbCBsb2dpYyBpbiBhIGhpZ2gtZnJlcXVlbmN5IGFyZWEuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLnZhcnMub25TdGFydCkgaWYgKHRoaXMuX3RpbWUgIT09IDAgfHwgZHVyYXRpb24gPT09IDApIGlmICghc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uU3RhcnRcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHB0ID0gdGhpcy5fZmlyc3RQVDtcblx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRpZiAocHQuZikge1xuXHRcdFx0XHRcdHB0LnRbcHQucF0ocHQuYyAqIHRoaXMucmF0aW8gKyBwdC5zKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQuYyAqIHRoaXMucmF0aW8gKyBwdC5zO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl9vblVwZGF0ZSkge1xuXHRcdFx0XHRpZiAodGltZSA8IDApIGlmICh0aGlzLl9zdGFydEF0ICYmIHRpbWUgIT09IC0wLjAwMDEpIHsgLy9pZiB0aGUgdHdlZW4gaXMgcG9zaXRpb25lZCBhdCB0aGUgVkVSWSBiZWdpbm5pbmcgKF9zdGFydFRpbWUgMCkgb2YgaXRzIHBhcmVudCB0aW1lbGluZSwgaXQncyBpbGxlZ2FsIGZvciB0aGUgcGxheWhlYWQgdG8gZ28gYmFjayBmdXJ0aGVyLCBzbyB3ZSBzaG91bGQgbm90IHJlbmRlciB0aGUgcmVjb3JkZWQgc3RhcnRBdCB2YWx1ZXMuXG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5yZW5kZXIodGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTsgLy9ub3RlOiBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucywgd2UgdHVjayB0aGlzIGNvbmRpdGlvbmFsIGxvZ2ljIGluc2lkZSBsZXNzIHRyYXZlbGVkIGFyZWFzIChtb3N0IHR3ZWVucyBkb24ndCBoYXZlIGFuIG9uVXBkYXRlKS4gV2UnZCBqdXN0IGhhdmUgaXQgYXQgdGhlIGVuZCBiZWZvcmUgdGhlIG9uQ29tcGxldGUsIGJ1dCB0aGUgdmFsdWVzIHNob3VsZCBiZSB1cGRhdGVkIGJlZm9yZSBhbnkgb25VcGRhdGUgaXMgY2FsbGVkLCBzbyB3ZSBBTFNPIHB1dCBpdCBoZXJlIGFuZCB0aGVuIGlmIGl0J3Mgbm90IGNhbGxlZCwgd2UgZG8gc28gbGF0ZXIgbmVhciB0aGUgb25Db21wbGV0ZS5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXN1cHByZXNzRXZlbnRzKSBpZiAodGhpcy5fdGltZSAhPT0gcHJldlRpbWUgfHwgaXNDb21wbGV0ZSB8fCBmb3JjZSkge1xuXHRcdFx0XHRcdHRoaXMuX2NhbGxiYWNrKFwib25VcGRhdGVcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChjYWxsYmFjaykgaWYgKCF0aGlzLl9nYyB8fCBmb3JjZSkgeyAvL2NoZWNrIF9nYyBiZWNhdXNlIHRoZXJlJ3MgYSBjaGFuY2UgdGhhdCBraWxsKCkgY291bGQgYmUgY2FsbGVkIGluIGFuIG9uVXBkYXRlXG5cdFx0XHRcdGlmICh0aW1lIDwgMCAmJiB0aGlzLl9zdGFydEF0ICYmICF0aGlzLl9vblVwZGF0ZSAmJiB0aW1lICE9PSAtMC4wMDAxKSB7IC8vLTAuMDAwMSBpcyBhIHNwZWNpYWwgdmFsdWUgdGhhdCB3ZSB1c2Ugd2hlbiBsb29waW5nIGJhY2sgdG8gdGhlIGJlZ2lubmluZyBvZiBhIHJlcGVhdGVkIFRpbWVsaW5lTWF4LCBpbiB3aGljaCBjYXNlIHdlIHNob3VsZG4ndCByZW5kZXIgdGhlIF9zdGFydEF0IHZhbHVlcy5cblx0XHRcdFx0XHR0aGlzLl9zdGFydEF0LnJlbmRlcih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpc0NvbXBsZXRlKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0dGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9hY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXN1cHByZXNzRXZlbnRzICYmIHRoaXMudmFyc1tjYWxsYmFja10pIHtcblx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhjYWxsYmFjayk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGR1cmF0aW9uID09PSAwICYmIHRoaXMuX3Jhd1ByZXZUaW1lID09PSBfdGlueU51bSAmJiByYXdQcmV2VGltZSAhPT0gX3RpbnlOdW0pIHsgLy90aGUgb25Db21wbGV0ZSBvciBvblJldmVyc2VDb21wbGV0ZSBjb3VsZCB0cmlnZ2VyIG1vdmVtZW50IG9mIHRoZSBwbGF5aGVhZCBhbmQgZm9yIHplcm8tZHVyYXRpb24gdHdlZW5zICh3aGljaCBtdXN0IGRpc2Nlcm4gZGlyZWN0aW9uKSB0aGF0IGxhbmQgZGlyZWN0bHkgYmFjayBvbiB0aGVpciBzdGFydCB0aW1lLCB3ZSBkb24ndCB3YW50IHRvIGZpcmUgYWdhaW4gb24gdGhlIG5leHQgcmVuZGVyLiBUaGluayBvZiBzZXZlcmFsIGFkZFBhdXNlKCkncyBpbiBhIHRpbWVsaW5lIHRoYXQgZm9yY2VzIHRoZSBwbGF5aGVhZCB0byBhIGNlcnRhaW4gc3BvdCwgYnV0IHdoYXQgaWYgaXQncyBhbHJlYWR5IHBhdXNlZCBhbmQgYW5vdGhlciB0d2VlbiBpcyB0d2VlbmluZyB0aGUgXCJ0aW1lXCIgb2YgdGhlIHRpbWVsaW5lPyBFYWNoIHRpbWUgaXQgbW92ZXMgW2ZvcndhcmRdIHBhc3QgdGhhdCBzcG90LCBpdCB3b3VsZCBtb3ZlIGJhY2ssIGFuZCBzaW5jZSBzdXBwcmVzc0V2ZW50cyBpcyB0cnVlLCBpdCdkIHJlc2V0IF9yYXdQcmV2VGltZSB0byBfdGlueU51bSBzbyB0aGF0IHdoZW4gaXQgYmVnaW5zIGFnYWluLCB0aGUgY2FsbGJhY2sgd291bGQgZmlyZSAoc28gdWx0aW1hdGVseSBpdCBjb3VsZCBib3VuY2UgYmFjayBhbmQgZm9ydGggZHVyaW5nIHRoYXQgdHdlZW4pLiBBZ2FpbiwgdGhpcyBpcyBhIHZlcnkgdW5jb21tb24gc2NlbmFyaW8sIGJ1dCBwb3NzaWJsZSBub25ldGhlbGVzcy5cblx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cC5fa2lsbCA9IGZ1bmN0aW9uKHZhcnMsIHRhcmdldCwgb3ZlcndyaXRpbmdUd2Vlbikge1xuXHRcdFx0aWYgKHZhcnMgPT09IFwiYWxsXCIpIHtcblx0XHRcdFx0dmFycyA9IG51bGw7XG5cdFx0XHR9XG5cdFx0XHRpZiAodmFycyA9PSBudWxsKSBpZiAodGFyZ2V0ID09IG51bGwgfHwgdGFyZ2V0ID09PSB0aGlzLnRhcmdldCkge1xuXHRcdFx0XHR0aGlzLl9sYXp5ID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9lbmFibGVkKGZhbHNlLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHR0YXJnZXQgPSAodHlwZW9mKHRhcmdldCkgIT09IFwic3RyaW5nXCIpID8gKHRhcmdldCB8fCB0aGlzLl90YXJnZXRzIHx8IHRoaXMudGFyZ2V0KSA6IFR3ZWVuTGl0ZS5zZWxlY3Rvcih0YXJnZXQpIHx8IHRhcmdldDtcblx0XHRcdHZhciBzaW11bHRhbmVvdXNPdmVyd3JpdGUgPSAob3ZlcndyaXRpbmdUd2VlbiAmJiB0aGlzLl90aW1lICYmIG92ZXJ3cml0aW5nVHdlZW4uX3N0YXJ0VGltZSA9PT0gdGhpcy5fc3RhcnRUaW1lICYmIHRoaXMuX3RpbWVsaW5lID09PSBvdmVyd3JpdGluZ1R3ZWVuLl90aW1lbGluZSksXG5cdFx0XHRcdGksIG92ZXJ3cml0dGVuUHJvcHMsIHAsIHB0LCBwcm9wTG9va3VwLCBjaGFuZ2VkLCBraWxsUHJvcHMsIHJlY29yZCwga2lsbGVkO1xuXHRcdFx0aWYgKChfaXNBcnJheSh0YXJnZXQpIHx8IF9pc1NlbGVjdG9yKHRhcmdldCkpICYmIHR5cGVvZih0YXJnZXRbMF0pICE9PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdGkgPSB0YXJnZXQubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5fa2lsbCh2YXJzLCB0YXJnZXRbaV0sIG92ZXJ3cml0aW5nVHdlZW4pKSB7XG5cdFx0XHRcdFx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICh0aGlzLl90YXJnZXRzKSB7XG5cdFx0XHRcdFx0aSA9IHRoaXMuX3RhcmdldHMubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0aWYgKHRhcmdldCA9PT0gdGhpcy5fdGFyZ2V0c1tpXSkge1xuXHRcdFx0XHRcdFx0XHRwcm9wTG9va3VwID0gdGhpcy5fcHJvcExvb2t1cFtpXSB8fCB7fTtcblx0XHRcdFx0XHRcdFx0dGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcyA9IHRoaXMuX292ZXJ3cml0dGVuUHJvcHMgfHwgW107XG5cdFx0XHRcdFx0XHRcdG92ZXJ3cml0dGVuUHJvcHMgPSB0aGlzLl9vdmVyd3JpdHRlblByb3BzW2ldID0gdmFycyA/IHRoaXMuX292ZXJ3cml0dGVuUHJvcHNbaV0gfHwge30gOiBcImFsbFwiO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAodGFyZ2V0ICE9PSB0aGlzLnRhcmdldCkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwcm9wTG9va3VwID0gdGhpcy5fcHJvcExvb2t1cDtcblx0XHRcdFx0XHRvdmVyd3JpdHRlblByb3BzID0gdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcyA9IHZhcnMgPyB0aGlzLl9vdmVyd3JpdHRlblByb3BzIHx8IHt9IDogXCJhbGxcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChwcm9wTG9va3VwKSB7XG5cdFx0XHRcdFx0a2lsbFByb3BzID0gdmFycyB8fCBwcm9wTG9va3VwO1xuXHRcdFx0XHRcdHJlY29yZCA9ICh2YXJzICE9PSBvdmVyd3JpdHRlblByb3BzICYmIG92ZXJ3cml0dGVuUHJvcHMgIT09IFwiYWxsXCIgJiYgdmFycyAhPT0gcHJvcExvb2t1cCAmJiAodHlwZW9mKHZhcnMpICE9PSBcIm9iamVjdFwiIHx8ICF2YXJzLl90ZW1wS2lsbCkpOyAvL190ZW1wS2lsbCBpcyBhIHN1cGVyLXNlY3JldCB3YXkgdG8gZGVsZXRlIGEgcGFydGljdWxhciB0d2VlbmluZyBwcm9wZXJ0eSBidXQgTk9UIGhhdmUgaXQgcmVtZW1iZXJlZCBhcyBhbiBvZmZpY2lhbCBvdmVyd3JpdHRlbiBwcm9wZXJ0eSAobGlrZSBpbiBCZXppZXJQbHVnaW4pXG5cdFx0XHRcdFx0aWYgKG92ZXJ3cml0aW5nVHdlZW4gJiYgKFR3ZWVuTGl0ZS5vbk92ZXJ3cml0ZSB8fCB0aGlzLnZhcnMub25PdmVyd3JpdGUpKSB7XG5cdFx0XHRcdFx0XHRmb3IgKHAgaW4ga2lsbFByb3BzKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChwcm9wTG9va3VwW3BdKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFraWxsZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGtpbGxlZCA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRraWxsZWQucHVzaChwKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKChraWxsZWQgfHwgIXZhcnMpICYmICFfb25PdmVyd3JpdGUodGhpcywgb3ZlcndyaXRpbmdUd2VlbiwgdGFyZ2V0LCBraWxsZWQpKSB7IC8vaWYgdGhlIG9uT3ZlcndyaXRlIHJldHVybmVkIGZhbHNlLCB0aGF0IG1lYW5zIHRoZSB1c2VyIHdhbnRzIHRvIG92ZXJyaWRlIHRoZSBvdmVyd3JpdGluZyAoY2FuY2VsIGl0KS5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGZvciAocCBpbiBraWxsUHJvcHMpIHtcblx0XHRcdFx0XHRcdGlmICgocHQgPSBwcm9wTG9va3VwW3BdKSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoc2ltdWx0YW5lb3VzT3ZlcndyaXRlKSB7IC8vaWYgYW5vdGhlciB0d2VlbiBvdmVyd3JpdGVzIHRoaXMgb25lIGFuZCB0aGV5IGJvdGggc3RhcnQgYXQgZXhhY3RseSB0aGUgc2FtZSB0aW1lLCB5ZXQgdGhpcyB0d2VlbiBoYXMgYWxyZWFkeSByZW5kZXJlZCBvbmNlIChmb3IgZXhhbXBsZSwgYXQgMC4wMDEpIGJlY2F1c2UgaXQncyBmaXJzdCBpbiB0aGUgcXVldWUsIHdlIHNob3VsZCByZXZlcnQgdGhlIHZhbHVlcyB0byB3aGVyZSB0aGV5IHdlcmUgYXQgMCBzbyB0aGF0IHRoZSBzdGFydGluZyB2YWx1ZXMgYXJlbid0IGNvbnRhbWluYXRlZCBvbiB0aGUgb3ZlcndyaXRpbmcgdHdlZW4uXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHB0LmYpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHB0LnRbcHQucF0ocHQucyk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSBwdC5zO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAocHQucGcgJiYgcHQudC5fa2lsbChraWxsUHJvcHMpKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7IC8vc29tZSBwbHVnaW5zIG5lZWQgdG8gYmUgbm90aWZpZWQgc28gdGhleSBjYW4gcGVyZm9ybSBjbGVhbnVwIHRhc2tzIGZpcnN0XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCFwdC5wZyB8fCBwdC50Ll9vdmVyd3JpdGVQcm9wcy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAocHQuX3ByZXYpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHB0Ll9wcmV2Ll9uZXh0ID0gcHQuX25leHQ7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChwdCA9PT0gdGhpcy5fZmlyc3RQVCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZiAocHQuX25leHQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHB0Ll9uZXh0Ll9wcmV2ID0gcHQuX3ByZXY7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHB0Ll9uZXh0ID0gcHQuX3ByZXYgPSBudWxsO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBwcm9wTG9va3VwW3BdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHJlY29yZCkge1xuXHRcdFx0XHRcdFx0XHRvdmVyd3JpdHRlblByb3BzW3BdID0gMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCF0aGlzLl9maXJzdFBUICYmIHRoaXMuX2luaXR0ZWQpIHsgLy9pZiBhbGwgdHdlZW5pbmcgcHJvcGVydGllcyBhcmUga2lsbGVkLCBraWxsIHRoZSB0d2Vlbi4gV2l0aG91dCB0aGlzIGxpbmUsIGlmIHRoZXJlJ3MgYSB0d2VlbiB3aXRoIG11bHRpcGxlIHRhcmdldHMgYW5kIHRoZW4geW91IGtpbGxUd2VlbnNPZigpIGVhY2ggdGFyZ2V0IGluZGl2aWR1YWxseSwgdGhlIHR3ZWVuIHdvdWxkIHRlY2huaWNhbGx5IHN0aWxsIHJlbWFpbiBhY3RpdmUgYW5kIGZpcmUgaXRzIG9uQ29tcGxldGUgZXZlbiB0aG91Z2ggdGhlcmUgYXJlbid0IGFueSBtb3JlIHByb3BlcnRpZXMgdHdlZW5pbmcuXG5cdFx0XHRcdFx0XHR0aGlzLl9lbmFibGVkKGZhbHNlLCBmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY2hhbmdlZDtcblx0XHR9O1xuXG5cdFx0cC5pbnZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAodGhpcy5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZCkge1xuXHRcdFx0XHRUd2VlbkxpdGUuX29uUGx1Z2luRXZlbnQoXCJfb25EaXNhYmxlXCIsIHRoaXMpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZmlyc3RQVCA9IHRoaXMuX292ZXJ3cml0dGVuUHJvcHMgPSB0aGlzLl9zdGFydEF0ID0gdGhpcy5fb25VcGRhdGUgPSBudWxsO1xuXHRcdFx0dGhpcy5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZCA9IHRoaXMuX2FjdGl2ZSA9IHRoaXMuX2xhenkgPSBmYWxzZTtcblx0XHRcdHRoaXMuX3Byb3BMb29rdXAgPSAodGhpcy5fdGFyZ2V0cykgPyB7fSA6IFtdO1xuXHRcdFx0QW5pbWF0aW9uLnByb3RvdHlwZS5pbnZhbGlkYXRlLmNhbGwodGhpcyk7XG5cdFx0XHRpZiAodGhpcy52YXJzLmltbWVkaWF0ZVJlbmRlcikge1xuXHRcdFx0XHR0aGlzLl90aW1lID0gLV90aW55TnVtOyAvL2ZvcmNlcyBhIHJlbmRlciB3aXRob3V0IGhhdmluZyB0byBzZXQgdGhlIHJlbmRlcigpIFwiZm9yY2VcIiBwYXJhbWV0ZXIgdG8gdHJ1ZSBiZWNhdXNlIHdlIHdhbnQgdG8gYWxsb3cgbGF6eWluZyBieSBkZWZhdWx0ICh1c2luZyB0aGUgXCJmb3JjZVwiIHBhcmFtZXRlciBhbHdheXMgZm9yY2VzIGFuIGltbWVkaWF0ZSBmdWxsIHJlbmRlcilcblx0XHRcdFx0dGhpcy5yZW5kZXIoTWF0aC5taW4oMCwgLXRoaXMuX2RlbGF5KSk7IC8vaW4gY2FzZSBkZWxheSBpcyBuZWdhdGl2ZS5cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLl9lbmFibGVkID0gZnVuY3Rpb24oZW5hYmxlZCwgaWdub3JlVGltZWxpbmUpIHtcblx0XHRcdGlmICghX3RpY2tlckFjdGl2ZSkge1xuXHRcdFx0XHRfdGlja2VyLndha2UoKTtcblx0XHRcdH1cblx0XHRcdGlmIChlbmFibGVkICYmIHRoaXMuX2djKSB7XG5cdFx0XHRcdHZhciB0YXJnZXRzID0gdGhpcy5fdGFyZ2V0cyxcblx0XHRcdFx0XHRpO1xuXHRcdFx0XHRpZiAodGFyZ2V0cykge1xuXHRcdFx0XHRcdGkgPSB0YXJnZXRzLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdHRoaXMuX3NpYmxpbmdzW2ldID0gX3JlZ2lzdGVyKHRhcmdldHNbaV0sIHRoaXMsIHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9zaWJsaW5ncyA9IF9yZWdpc3Rlcih0aGlzLnRhcmdldCwgdGhpcywgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdEFuaW1hdGlvbi5wcm90b3R5cGUuX2VuYWJsZWQuY2FsbCh0aGlzLCBlbmFibGVkLCBpZ25vcmVUaW1lbGluZSk7XG5cdFx0XHRpZiAodGhpcy5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZCkgaWYgKHRoaXMuX2ZpcnN0UFQpIHtcblx0XHRcdFx0cmV0dXJuIFR3ZWVuTGl0ZS5fb25QbHVnaW5FdmVudCgoZW5hYmxlZCA/IFwiX29uRW5hYmxlXCIgOiBcIl9vbkRpc2FibGVcIiksIHRoaXMpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cblxuLy8tLS0tVHdlZW5MaXRlIHN0YXRpYyBtZXRob2RzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHRUd2VlbkxpdGUudG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFR3ZWVuTGl0ZSh0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLmZyb20gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKSB7XG5cdFx0XHR2YXJzLnJ1bkJhY2t3YXJkcyA9IHRydWU7XG5cdFx0XHR2YXJzLmltbWVkaWF0ZVJlbmRlciA9ICh2YXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSk7XG5cdFx0XHRyZXR1cm4gbmV3IFR3ZWVuTGl0ZSh0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLmZyb21UbyA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIGZyb21WYXJzLCB0b1ZhcnMpIHtcblx0XHRcdHRvVmFycy5zdGFydEF0ID0gZnJvbVZhcnM7XG5cdFx0XHR0b1ZhcnMuaW1tZWRpYXRlUmVuZGVyID0gKHRvVmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UgJiYgZnJvbVZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlKTtcblx0XHRcdHJldHVybiBuZXcgVHdlZW5MaXRlKHRhcmdldCwgZHVyYXRpb24sIHRvVmFycyk7XG5cdFx0fTtcblxuXHRcdFR3ZWVuTGl0ZS5kZWxheWVkQ2FsbCA9IGZ1bmN0aW9uKGRlbGF5LCBjYWxsYmFjaywgcGFyYW1zLCBzY29wZSwgdXNlRnJhbWVzKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFR3ZWVuTGl0ZShjYWxsYmFjaywgMCwge2RlbGF5OmRlbGF5LCBvbkNvbXBsZXRlOmNhbGxiYWNrLCBvbkNvbXBsZXRlUGFyYW1zOnBhcmFtcywgY2FsbGJhY2tTY29wZTpzY29wZSwgb25SZXZlcnNlQ29tcGxldGU6Y2FsbGJhY2ssIG9uUmV2ZXJzZUNvbXBsZXRlUGFyYW1zOnBhcmFtcywgaW1tZWRpYXRlUmVuZGVyOmZhbHNlLCBsYXp5OmZhbHNlLCB1c2VGcmFtZXM6dXNlRnJhbWVzLCBvdmVyd3JpdGU6MH0pO1xuXHRcdH07XG5cblx0XHRUd2VlbkxpdGUuc2V0ID0gZnVuY3Rpb24odGFyZ2V0LCB2YXJzKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFR3ZWVuTGl0ZSh0YXJnZXQsIDAsIHZhcnMpO1xuXHRcdH07XG5cblx0XHRUd2VlbkxpdGUuZ2V0VHdlZW5zT2YgPSBmdW5jdGlvbih0YXJnZXQsIG9ubHlBY3RpdmUpIHtcblx0XHRcdGlmICh0YXJnZXQgPT0gbnVsbCkgeyByZXR1cm4gW107IH1cblx0XHRcdHRhcmdldCA9ICh0eXBlb2YodGFyZ2V0KSAhPT0gXCJzdHJpbmdcIikgPyB0YXJnZXQgOiBUd2VlbkxpdGUuc2VsZWN0b3IodGFyZ2V0KSB8fCB0YXJnZXQ7XG5cdFx0XHR2YXIgaSwgYSwgaiwgdDtcblx0XHRcdGlmICgoX2lzQXJyYXkodGFyZ2V0KSB8fCBfaXNTZWxlY3Rvcih0YXJnZXQpKSAmJiB0eXBlb2YodGFyZ2V0WzBdKSAhPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRpID0gdGFyZ2V0Lmxlbmd0aDtcblx0XHRcdFx0YSA9IFtdO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRhID0gYS5jb25jYXQoVHdlZW5MaXRlLmdldFR3ZWVuc09mKHRhcmdldFtpXSwgb25seUFjdGl2ZSkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGkgPSBhLmxlbmd0aDtcblx0XHRcdFx0Ly9ub3cgZ2V0IHJpZCBvZiBhbnkgZHVwbGljYXRlcyAodHdlZW5zIG9mIGFycmF5cyBvZiBvYmplY3RzIGNvdWxkIGNhdXNlIGR1cGxpY2F0ZXMpXG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdHQgPSBhW2ldO1xuXHRcdFx0XHRcdGogPSBpO1xuXHRcdFx0XHRcdHdoaWxlICgtLWogPiAtMSkge1xuXHRcdFx0XHRcdFx0aWYgKHQgPT09IGFbal0pIHtcblx0XHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhID0gX3JlZ2lzdGVyKHRhcmdldCkuY29uY2F0KCk7XG5cdFx0XHRcdGkgPSBhLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0aWYgKGFbaV0uX2djIHx8IChvbmx5QWN0aXZlICYmICFhW2ldLmlzQWN0aXZlKCkpKSB7XG5cdFx0XHRcdFx0XHRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBhO1xuXHRcdH07XG5cblx0XHRUd2VlbkxpdGUua2lsbFR3ZWVuc09mID0gVHdlZW5MaXRlLmtpbGxEZWxheWVkQ2FsbHNUbyA9IGZ1bmN0aW9uKHRhcmdldCwgb25seUFjdGl2ZSwgdmFycykge1xuXHRcdFx0aWYgKHR5cGVvZihvbmx5QWN0aXZlKSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHR2YXJzID0gb25seUFjdGl2ZTsgLy9mb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgKGJlZm9yZSBcIm9ubHlBY3RpdmVcIiBwYXJhbWV0ZXIgd2FzIGluc2VydGVkKVxuXHRcdFx0XHRvbmx5QWN0aXZlID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2YXIgYSA9IFR3ZWVuTGl0ZS5nZXRUd2VlbnNPZih0YXJnZXQsIG9ubHlBY3RpdmUpLFxuXHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0YVtpXS5fa2lsbCh2YXJzLCB0YXJnZXQpO1xuXHRcdFx0fVxuXHRcdH07XG5cblxuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogVHdlZW5QbHVnaW4gICAoY291bGQgZWFzaWx5IGJlIHNwbGl0IG91dCBhcyBhIHNlcGFyYXRlIGZpbGUvY2xhc3MsIGJ1dCBpbmNsdWRlZCBmb3IgZWFzZSBvZiB1c2UgKHNvIHRoYXQgcGVvcGxlIGRvbid0IG5lZWQgdG8gaW5jbHVkZSBhbm90aGVyIHNjcmlwdCBjYWxsIGJlZm9yZSBsb2FkaW5nIHBsdWdpbnMgd2hpY2ggaXMgZWFzeSB0byBmb3JnZXQpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0XHR2YXIgVHdlZW5QbHVnaW4gPSBfY2xhc3MoXCJwbHVnaW5zLlR3ZWVuUGx1Z2luXCIsIGZ1bmN0aW9uKHByb3BzLCBwcmlvcml0eSkge1xuXHRcdFx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzID0gKHByb3BzIHx8IFwiXCIpLnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0XHR0aGlzLl9wcm9wTmFtZSA9IHRoaXMuX292ZXJ3cml0ZVByb3BzWzBdO1xuXHRcdFx0XHRcdHRoaXMuX3ByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRcdFx0XHR0aGlzLl9zdXBlciA9IFR3ZWVuUGx1Z2luLnByb3RvdHlwZTtcblx0XHRcdFx0fSwgdHJ1ZSk7XG5cblx0XHRwID0gVHdlZW5QbHVnaW4ucHJvdG90eXBlO1xuXHRcdFR3ZWVuUGx1Z2luLnZlcnNpb24gPSBcIjEuMTkuMFwiO1xuXHRcdFR3ZWVuUGx1Z2luLkFQSSA9IDI7XG5cdFx0cC5fZmlyc3RQVCA9IG51bGw7XG5cdFx0cC5fYWRkVHdlZW4gPSBfYWRkUHJvcFR3ZWVuO1xuXHRcdHAuc2V0UmF0aW8gPSBfc2V0UmF0aW87XG5cblx0XHRwLl9raWxsID0gZnVuY3Rpb24obG9va3VwKSB7XG5cdFx0XHR2YXIgYSA9IHRoaXMuX292ZXJ3cml0ZVByb3BzLFxuXHRcdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQsXG5cdFx0XHRcdGk7XG5cdFx0XHRpZiAobG9va3VwW3RoaXMuX3Byb3BOYW1lXSAhPSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzID0gW107XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGlmIChsb29rdXBbYVtpXV0gIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0aWYgKGxvb2t1cFtwdC5uXSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0aWYgKHB0Ll9uZXh0KSB7XG5cdFx0XHRcdFx0XHRwdC5fbmV4dC5fcHJldiA9IHB0Ll9wcmV2O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocHQuX3ByZXYpIHtcblx0XHRcdFx0XHRcdHB0Ll9wcmV2Ll9uZXh0ID0gcHQuX25leHQ7XG5cdFx0XHRcdFx0XHRwdC5fcHJldiA9IG51bGw7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl9maXJzdFBUID09PSBwdCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cblx0XHRwLl9tb2QgPSBwLl9yb3VuZFByb3BzID0gZnVuY3Rpb24obG9va3VwKSB7XG5cdFx0XHR2YXIgcHQgPSB0aGlzLl9maXJzdFBULFxuXHRcdFx0XHR2YWw7XG5cdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0dmFsID0gbG9va3VwW3RoaXMuX3Byb3BOYW1lXSB8fCAocHQubiAhPSBudWxsICYmIGxvb2t1cFsgcHQubi5zcGxpdCh0aGlzLl9wcm9wTmFtZSArIFwiX1wiKS5qb2luKFwiXCIpIF0pO1xuXHRcdFx0XHRpZiAodmFsICYmIHR5cGVvZih2YWwpID09PSBcImZ1bmN0aW9uXCIpIHsgLy9zb21lIHByb3BlcnRpZXMgdGhhdCBhcmUgdmVyeSBwbHVnaW4tc3BlY2lmaWMgYWRkIGEgcHJlZml4IG5hbWVkIGFmdGVyIHRoZSBfcHJvcE5hbWUgcGx1cyBhbiB1bmRlcnNjb3JlLCBzbyB3ZSBuZWVkIHRvIGlnbm9yZSB0aGF0IGV4dHJhIHN0dWZmIGhlcmUuXG5cdFx0XHRcdFx0aWYgKHB0LmYgPT09IDIpIHtcblx0XHRcdFx0XHRcdHB0LnQuX2FwcGx5UFQubSA9IHZhbDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cHQubSA9IHZhbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLl9vblBsdWdpbkV2ZW50ID0gZnVuY3Rpb24odHlwZSwgdHdlZW4pIHtcblx0XHRcdHZhciBwdCA9IHR3ZWVuLl9maXJzdFBULFxuXHRcdFx0XHRjaGFuZ2VkLCBwdDIsIGZpcnN0LCBsYXN0LCBuZXh0O1xuXHRcdFx0aWYgKHR5cGUgPT09IFwiX29uSW5pdEFsbFByb3BzXCIpIHtcblx0XHRcdFx0Ly9zb3J0cyB0aGUgUHJvcFR3ZWVuIGxpbmtlZCBsaXN0IGluIG9yZGVyIG9mIHByaW9yaXR5IGJlY2F1c2Ugc29tZSBwbHVnaW5zIG5lZWQgdG8gcmVuZGVyIGVhcmxpZXIvbGF0ZXIgdGhhbiBvdGhlcnMsIGxpa2UgTW90aW9uQmx1clBsdWdpbiBhcHBsaWVzIGl0cyBlZmZlY3RzIGFmdGVyIGFsbCB4L3kvYWxwaGEgdHdlZW5zIGhhdmUgcmVuZGVyZWQgb24gZWFjaCBmcmFtZS5cblx0XHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdFx0bmV4dCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdHB0MiA9IGZpcnN0O1xuXHRcdFx0XHRcdHdoaWxlIChwdDIgJiYgcHQyLnByID4gcHQucHIpIHtcblx0XHRcdFx0XHRcdHB0MiA9IHB0Mi5fbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKChwdC5fcHJldiA9IHB0MiA/IHB0Mi5fcHJldiA6IGxhc3QpKSB7XG5cdFx0XHRcdFx0XHRwdC5fcHJldi5fbmV4dCA9IHB0O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRmaXJzdCA9IHB0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoKHB0Ll9uZXh0ID0gcHQyKSkge1xuXHRcdFx0XHRcdFx0cHQyLl9wcmV2ID0gcHQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxhc3QgPSBwdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQgPSBuZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHB0ID0gdHdlZW4uX2ZpcnN0UFQgPSBmaXJzdDtcblx0XHRcdH1cblx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRpZiAocHQucGcpIGlmICh0eXBlb2YocHQudFt0eXBlXSkgPT09IFwiZnVuY3Rpb25cIikgaWYgKHB0LnRbdHlwZV0oKSkge1xuXHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY2hhbmdlZDtcblx0XHR9O1xuXG5cdFx0VHdlZW5QbHVnaW4uYWN0aXZhdGUgPSBmdW5jdGlvbihwbHVnaW5zKSB7XG5cdFx0XHR2YXIgaSA9IHBsdWdpbnMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGlmIChwbHVnaW5zW2ldLkFQSSA9PT0gVHdlZW5QbHVnaW4uQVBJKSB7XG5cdFx0XHRcdFx0X3BsdWdpbnNbKG5ldyBwbHVnaW5zW2ldKCkpLl9wcm9wTmFtZV0gPSBwbHVnaW5zW2ldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9O1xuXG5cdFx0Ly9wcm92aWRlcyBhIG1vcmUgY29uY2lzZSB3YXkgdG8gZGVmaW5lIHBsdWdpbnMgdGhhdCBoYXZlIG5vIGRlcGVuZGVuY2llcyBiZXNpZGVzIFR3ZWVuUGx1Z2luIGFuZCBUd2VlbkxpdGUsIHdyYXBwaW5nIGNvbW1vbiBib2lsZXJwbGF0ZSBzdHVmZiBpbnRvIG9uZSBmdW5jdGlvbiAoYWRkZWQgaW4gMS45LjApLiBZb3UgZG9uJ3QgTkVFRCB0byB1c2UgdGhpcyB0byBkZWZpbmUgYSBwbHVnaW4gLSB0aGUgb2xkIHdheSBzdGlsbCB3b3JrcyBhbmQgY2FuIGJlIHVzZWZ1bCBpbiBjZXJ0YWluIChyYXJlKSBzaXR1YXRpb25zLlxuXHRcdF9nc0RlZmluZS5wbHVnaW4gPSBmdW5jdGlvbihjb25maWcpIHtcblx0XHRcdGlmICghY29uZmlnIHx8ICFjb25maWcucHJvcE5hbWUgfHwgIWNvbmZpZy5pbml0IHx8ICFjb25maWcuQVBJKSB7IHRocm93IFwiaWxsZWdhbCBwbHVnaW4gZGVmaW5pdGlvbi5cIjsgfVxuXHRcdFx0dmFyIHByb3BOYW1lID0gY29uZmlnLnByb3BOYW1lLFxuXHRcdFx0XHRwcmlvcml0eSA9IGNvbmZpZy5wcmlvcml0eSB8fCAwLFxuXHRcdFx0XHRvdmVyd3JpdGVQcm9wcyA9IGNvbmZpZy5vdmVyd3JpdGVQcm9wcyxcblx0XHRcdFx0bWFwID0ge2luaXQ6XCJfb25Jbml0VHdlZW5cIiwgc2V0Olwic2V0UmF0aW9cIiwga2lsbDpcIl9raWxsXCIsIHJvdW5kOlwiX21vZFwiLCBtb2Q6XCJfbW9kXCIsIGluaXRBbGw6XCJfb25Jbml0QWxsUHJvcHNcIn0sXG5cdFx0XHRcdFBsdWdpbiA9IF9jbGFzcyhcInBsdWdpbnMuXCIgKyBwcm9wTmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BOYW1lLnN1YnN0cigxKSArIFwiUGx1Z2luXCIsXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRUd2VlblBsdWdpbi5jYWxsKHRoaXMsIHByb3BOYW1lLCBwcmlvcml0eSk7XG5cdFx0XHRcdFx0XHR0aGlzLl9vdmVyd3JpdGVQcm9wcyA9IG92ZXJ3cml0ZVByb3BzIHx8IFtdO1xuXHRcdFx0XHRcdH0sIChjb25maWcuZ2xvYmFsID09PSB0cnVlKSksXG5cdFx0XHRcdHAgPSBQbHVnaW4ucHJvdG90eXBlID0gbmV3IFR3ZWVuUGx1Z2luKHByb3BOYW1lKSxcblx0XHRcdFx0cHJvcDtcblx0XHRcdHAuY29uc3RydWN0b3IgPSBQbHVnaW47XG5cdFx0XHRQbHVnaW4uQVBJID0gY29uZmlnLkFQSTtcblx0XHRcdGZvciAocHJvcCBpbiBtYXApIHtcblx0XHRcdFx0aWYgKHR5cGVvZihjb25maWdbcHJvcF0pID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRwW21hcFtwcm9wXV0gPSBjb25maWdbcHJvcF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFBsdWdpbi52ZXJzaW9uID0gY29uZmlnLnZlcnNpb247XG5cdFx0XHRUd2VlblBsdWdpbi5hY3RpdmF0ZShbUGx1Z2luXSk7XG5cdFx0XHRyZXR1cm4gUGx1Z2luO1xuXHRcdH07XG5cblxuXHRcdC8vbm93IHJ1biB0aHJvdWdoIGFsbCB0aGUgZGVwZW5kZW5jaWVzIGRpc2NvdmVyZWQgYW5kIGlmIGFueSBhcmUgbWlzc2luZywgbG9nIHRoYXQgdG8gdGhlIGNvbnNvbGUgYXMgYSB3YXJuaW5nLiBUaGlzIGlzIHdoeSBpdCdzIGJlc3QgdG8gaGF2ZSBUd2VlbkxpdGUgbG9hZCBsYXN0IC0gaXQgY2FuIGNoZWNrIGFsbCB0aGUgZGVwZW5kZW5jaWVzIGZvciB5b3UuXG5cdFx0YSA9IHdpbmRvdy5fZ3NRdWV1ZTtcblx0XHRpZiAoYSkge1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0YVtpXSgpO1xuXHRcdFx0fVxuXHRcdFx0Zm9yIChwIGluIF9kZWZMb29rdXApIHtcblx0XHRcdFx0aWYgKCFfZGVmTG9va3VwW3BdLmZ1bmMpIHtcblx0XHRcdFx0XHR3aW5kb3cuY29uc29sZS5sb2coXCJHU0FQIGVuY291bnRlcmVkIG1pc3NpbmcgZGVwZW5kZW5jeTogXCIgKyBwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdF90aWNrZXJBY3RpdmUgPSBmYWxzZTsgLy9lbnN1cmVzIHRoYXQgdGhlIGZpcnN0IG9mZmljaWFsIGFuaW1hdGlvbiBmb3JjZXMgYSB0aWNrZXIudGljaygpIHRvIHVwZGF0ZSB0aGUgdGltZSB3aGVuIGl0IGlzIGluc3RhbnRpYXRlZFxuXG59KSgodHlwZW9mKG1vZHVsZSkgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mKGdsb2JhbCkgIT09IFwidW5kZWZpbmVkXCIpID8gZ2xvYmFsIDogdGhpcyB8fCB3aW5kb3csIFwiVHdlZW5NYXhcIik7IiwiLy8gcmFuZG9tQ29sb3IgYnkgRGF2aWQgTWVyZmllbGQgdW5kZXIgdGhlIENDMCBsaWNlbnNlXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRtZXJmaWVsZC9yYW5kb21Db2xvci9cblxuOyhmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG5cbiAgLy8gU3VwcG9ydCBBTURcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG5cbiAgLy8gU3VwcG9ydCBDb21tb25KU1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIHZhciByYW5kb21Db2xvciA9IGZhY3RvcnkoKTtcblxuICAgIC8vIFN1cHBvcnQgTm9kZUpTICYgQ29tcG9uZW50LCB3aGljaCBhbGxvdyBtb2R1bGUuZXhwb3J0cyB0byBiZSBhIGZ1bmN0aW9uXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmFuZG9tQ29sb3I7XG4gICAgfVxuXG4gICAgLy8gU3VwcG9ydCBDb21tb25KUyAxLjEuMSBzcGVjXG4gICAgZXhwb3J0cy5yYW5kb21Db2xvciA9IHJhbmRvbUNvbG9yO1xuXG4gIC8vIFN1cHBvcnQgdmFuaWxsYSBzY3JpcHQgbG9hZGluZ1xuICB9IGVsc2Uge1xuICAgIHJvb3QucmFuZG9tQ29sb3IgPSBmYWN0b3J5KCk7XG4gIH1cblxufSh0aGlzLCBmdW5jdGlvbigpIHtcblxuICAvLyBTZWVkIHRvIGdldCByZXBlYXRhYmxlIGNvbG9yc1xuICB2YXIgc2VlZCA9IG51bGw7XG5cbiAgLy8gU2hhcmVkIGNvbG9yIGRpY3Rpb25hcnlcbiAgdmFyIGNvbG9yRGljdGlvbmFyeSA9IHt9O1xuXG4gIC8vIFBvcHVsYXRlIHRoZSBjb2xvciBkaWN0aW9uYXJ5XG4gIGxvYWRDb2xvckJvdW5kcygpO1xuXG4gIHZhciByYW5kb21Db2xvciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgc2VlZCBhbmQgZW5zdXJlIGl0J3MgYW5cbiAgICAvLyBpbnRlZ2VyLiBPdGhlcndpc2UsIHJlc2V0IHRoZSBzZWVkIHZhbHVlLlxuICAgIGlmIChvcHRpb25zLnNlZWQgJiYgb3B0aW9ucy5zZWVkID09PSBwYXJzZUludChvcHRpb25zLnNlZWQsIDEwKSkge1xuICAgICAgc2VlZCA9IG9wdGlvbnMuc2VlZDtcblxuICAgIC8vIEEgc3RyaW5nIHdhcyBwYXNzZWQgYXMgYSBzZWVkXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5zZWVkID09PSAnc3RyaW5nJykge1xuICAgICAgc2VlZCA9IHN0cmluZ1RvSW50ZWdlcihvcHRpb25zLnNlZWQpO1xuXG4gICAgLy8gU29tZXRoaW5nIHdhcyBwYXNzZWQgYXMgYSBzZWVkIGJ1dCBpdCB3YXNuJ3QgYW4gaW50ZWdlciBvciBzdHJpbmdcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuc2VlZCAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuc2VlZCAhPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHNlZWQgdmFsdWUgbXVzdCBiZSBhbiBpbnRlZ2VyIG9yIHN0cmluZycpO1xuXG4gICAgLy8gTm8gc2VlZCwgcmVzZXQgdGhlIHZhbHVlIG91dHNpZGUuXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlZWQgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciBILFMsQjtcblxuICAgIC8vIENoZWNrIGlmIHdlIG5lZWQgdG8gZ2VuZXJhdGUgbXVsdGlwbGUgY29sb3JzXG4gICAgaWYgKG9wdGlvbnMuY291bnQgIT09IG51bGwgJiYgb3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIHZhciB0b3RhbENvbG9ycyA9IG9wdGlvbnMuY291bnQsXG4gICAgICAgICAgY29sb3JzID0gW107XG5cbiAgICAgIG9wdGlvbnMuY291bnQgPSBudWxsO1xuXG4gICAgICB3aGlsZSAodG90YWxDb2xvcnMgPiBjb2xvcnMubGVuZ3RoKSB7XG5cbiAgICAgICAgLy8gU2luY2Ugd2UncmUgZ2VuZXJhdGluZyBtdWx0aXBsZSBjb2xvcnMsXG4gICAgICAgIC8vIGluY3JlbWVtZW50IHRoZSBzZWVkLiBPdGhlcndpc2Ugd2UnZCBqdXN0XG4gICAgICAgIC8vIGdlbmVyYXRlIHRoZSBzYW1lIGNvbG9yIGVhY2ggdGltZS4uLlxuICAgICAgICBpZiAoc2VlZCAmJiBvcHRpb25zLnNlZWQpIG9wdGlvbnMuc2VlZCArPSAxO1xuXG4gICAgICAgIGNvbG9ycy5wdXNoKHJhbmRvbUNvbG9yKG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucy5jb3VudCA9IHRvdGFsQ29sb3JzO1xuXG4gICAgICByZXR1cm4gY29sb3JzO1xuICAgIH1cblxuICAgIC8vIEZpcnN0IHdlIHBpY2sgYSBodWUgKEgpXG4gICAgSCA9IHBpY2tIdWUob3B0aW9ucyk7XG5cbiAgICAvLyBUaGVuIHVzZSBIIHRvIGRldGVybWluZSBzYXR1cmF0aW9uIChTKVxuICAgIFMgPSBwaWNrU2F0dXJhdGlvbihILCBvcHRpb25zKTtcblxuICAgIC8vIFRoZW4gdXNlIFMgYW5kIEggdG8gZGV0ZXJtaW5lIGJyaWdodG5lc3MgKEIpLlxuICAgIEIgPSBwaWNrQnJpZ2h0bmVzcyhILCBTLCBvcHRpb25zKTtcblxuICAgIC8vIFRoZW4gd2UgcmV0dXJuIHRoZSBIU0IgY29sb3IgaW4gdGhlIGRlc2lyZWQgZm9ybWF0XG4gICAgcmV0dXJuIHNldEZvcm1hdChbSCxTLEJdLCBvcHRpb25zKTtcbiAgfTtcblxuICBmdW5jdGlvbiBwaWNrSHVlIChvcHRpb25zKSB7XG5cbiAgICB2YXIgaHVlUmFuZ2UgPSBnZXRIdWVSYW5nZShvcHRpb25zLmh1ZSksXG4gICAgICAgIGh1ZSA9IHJhbmRvbVdpdGhpbihodWVSYW5nZSk7XG5cbiAgICAvLyBJbnN0ZWFkIG9mIHN0b3JpbmcgcmVkIGFzIHR3byBzZXBlcmF0ZSByYW5nZXMsXG4gICAgLy8gd2UgZ3JvdXAgdGhlbSwgdXNpbmcgbmVnYXRpdmUgbnVtYmVyc1xuICAgIGlmIChodWUgPCAwKSB7aHVlID0gMzYwICsgaHVlO31cblxuICAgIHJldHVybiBodWU7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHBpY2tTYXR1cmF0aW9uIChodWUsIG9wdGlvbnMpIHtcblxuICAgIGlmIChvcHRpb25zLmx1bWlub3NpdHkgPT09ICdyYW5kb20nKSB7XG4gICAgICByZXR1cm4gcmFuZG9tV2l0aGluKFswLDEwMF0pO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmh1ZSA9PT0gJ21vbm9jaHJvbWUnKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICB2YXIgc2F0dXJhdGlvblJhbmdlID0gZ2V0U2F0dXJhdGlvblJhbmdlKGh1ZSk7XG5cbiAgICB2YXIgc01pbiA9IHNhdHVyYXRpb25SYW5nZVswXSxcbiAgICAgICAgc01heCA9IHNhdHVyYXRpb25SYW5nZVsxXTtcblxuICAgIHN3aXRjaCAob3B0aW9ucy5sdW1pbm9zaXR5KSB7XG5cbiAgICAgIGNhc2UgJ2JyaWdodCc6XG4gICAgICAgIHNNaW4gPSA1NTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2RhcmsnOlxuICAgICAgICBzTWluID0gc01heCAtIDEwO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbGlnaHQnOlxuICAgICAgICBzTWF4ID0gNTU7XG4gICAgICAgIGJyZWFrO1xuICAgfVxuXG4gICAgcmV0dXJuIHJhbmRvbVdpdGhpbihbc01pbiwgc01heF0pO1xuXG4gIH1cblxuICBmdW5jdGlvbiBwaWNrQnJpZ2h0bmVzcyAoSCwgUywgb3B0aW9ucykge1xuXG4gICAgdmFyIGJNaW4gPSBnZXRNaW5pbXVtQnJpZ2h0bmVzcyhILCBTKSxcbiAgICAgICAgYk1heCA9IDEwMDtcblxuICAgIHN3aXRjaCAob3B0aW9ucy5sdW1pbm9zaXR5KSB7XG5cbiAgICAgIGNhc2UgJ2RhcmsnOlxuICAgICAgICBiTWF4ID0gYk1pbiArIDIwO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbGlnaHQnOlxuICAgICAgICBiTWluID0gKGJNYXggKyBiTWluKS8yO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAncmFuZG9tJzpcbiAgICAgICAgYk1pbiA9IDA7XG4gICAgICAgIGJNYXggPSAxMDA7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiByYW5kb21XaXRoaW4oW2JNaW4sIGJNYXhdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEZvcm1hdCAoaHN2LCBvcHRpb25zKSB7XG5cbiAgICBzd2l0Y2ggKG9wdGlvbnMuZm9ybWF0KSB7XG5cbiAgICAgIGNhc2UgJ2hzdkFycmF5JzpcbiAgICAgICAgcmV0dXJuIGhzdjtcblxuICAgICAgY2FzZSAnaHNsQXJyYXknOlxuICAgICAgICByZXR1cm4gSFNWdG9IU0woaHN2KTtcblxuICAgICAgY2FzZSAnaHNsJzpcbiAgICAgICAgdmFyIGhzbCA9IEhTVnRvSFNMKGhzdik7XG4gICAgICAgIHJldHVybiAnaHNsKCcraHNsWzBdKycsICcraHNsWzFdKyclLCAnK2hzbFsyXSsnJSknO1xuXG4gICAgICBjYXNlICdoc2xhJzpcbiAgICAgICAgdmFyIGhzbENvbG9yID0gSFNWdG9IU0woaHN2KTtcbiAgICAgICAgcmV0dXJuICdoc2xhKCcraHNsQ29sb3JbMF0rJywgJytoc2xDb2xvclsxXSsnJSwgJytoc2xDb2xvclsyXSsnJSwgJyArIE1hdGgucmFuZG9tKCkgKyAnKSc7XG5cbiAgICAgIGNhc2UgJ3JnYkFycmF5JzpcbiAgICAgICAgcmV0dXJuIEhTVnRvUkdCKGhzdik7XG5cbiAgICAgIGNhc2UgJ3JnYic6XG4gICAgICAgIHZhciByZ2IgPSBIU1Z0b1JHQihoc3YpO1xuICAgICAgICByZXR1cm4gJ3JnYignICsgcmdiLmpvaW4oJywgJykgKyAnKSc7XG5cbiAgICAgIGNhc2UgJ3JnYmEnOlxuICAgICAgICB2YXIgcmdiQ29sb3IgPSBIU1Z0b1JHQihoc3YpO1xuICAgICAgICByZXR1cm4gJ3JnYmEoJyArIHJnYkNvbG9yLmpvaW4oJywgJykgKyAnLCAnICsgTWF0aC5yYW5kb20oKSArICcpJztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIEhTVnRvSGV4KGhzdik7XG4gICAgfVxuXG4gIH1cblxuICBmdW5jdGlvbiBnZXRNaW5pbXVtQnJpZ2h0bmVzcyhILCBTKSB7XG5cbiAgICB2YXIgbG93ZXJCb3VuZHMgPSBnZXRDb2xvckluZm8oSCkubG93ZXJCb3VuZHM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvd2VyQm91bmRzLmxlbmd0aCAtIDE7IGkrKykge1xuXG4gICAgICB2YXIgczEgPSBsb3dlckJvdW5kc1tpXVswXSxcbiAgICAgICAgICB2MSA9IGxvd2VyQm91bmRzW2ldWzFdO1xuXG4gICAgICB2YXIgczIgPSBsb3dlckJvdW5kc1tpKzFdWzBdLFxuICAgICAgICAgIHYyID0gbG93ZXJCb3VuZHNbaSsxXVsxXTtcblxuICAgICAgaWYgKFMgPj0gczEgJiYgUyA8PSBzMikge1xuXG4gICAgICAgICB2YXIgbSA9ICh2MiAtIHYxKS8oczIgLSBzMSksXG4gICAgICAgICAgICAgYiA9IHYxIC0gbSpzMTtcblxuICAgICAgICAgcmV0dXJuIG0qUyArIGI7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEh1ZVJhbmdlIChjb2xvcklucHV0KSB7XG5cbiAgICBpZiAodHlwZW9mIHBhcnNlSW50KGNvbG9ySW5wdXQpID09PSAnbnVtYmVyJykge1xuXG4gICAgICB2YXIgbnVtYmVyID0gcGFyc2VJbnQoY29sb3JJbnB1dCk7XG5cbiAgICAgIGlmIChudW1iZXIgPCAzNjAgJiYgbnVtYmVyID4gMCkge1xuICAgICAgICByZXR1cm4gW251bWJlciwgbnVtYmVyXTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29sb3JJbnB1dCA9PT0gJ3N0cmluZycpIHtcblxuICAgICAgaWYgKGNvbG9yRGljdGlvbmFyeVtjb2xvcklucHV0XSkge1xuICAgICAgICB2YXIgY29sb3IgPSBjb2xvckRpY3Rpb25hcnlbY29sb3JJbnB1dF07XG4gICAgICAgIGlmIChjb2xvci5odWVSYW5nZSkge3JldHVybiBjb2xvci5odWVSYW5nZTt9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFswLDM2MF07XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNhdHVyYXRpb25SYW5nZSAoaHVlKSB7XG4gICAgcmV0dXJuIGdldENvbG9ySW5mbyhodWUpLnNhdHVyYXRpb25SYW5nZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENvbG9ySW5mbyAoaHVlKSB7XG5cbiAgICAvLyBNYXBzIHJlZCBjb2xvcnMgdG8gbWFrZSBwaWNraW5nIGh1ZSBlYXNpZXJcbiAgICBpZiAoaHVlID49IDMzNCAmJiBodWUgPD0gMzYwKSB7XG4gICAgICBodWUtPSAzNjA7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgY29sb3JOYW1lIGluIGNvbG9yRGljdGlvbmFyeSkge1xuICAgICAgIHZhciBjb2xvciA9IGNvbG9yRGljdGlvbmFyeVtjb2xvck5hbWVdO1xuICAgICAgIGlmIChjb2xvci5odWVSYW5nZSAmJlxuICAgICAgICAgICBodWUgPj0gY29sb3IuaHVlUmFuZ2VbMF0gJiZcbiAgICAgICAgICAgaHVlIDw9IGNvbG9yLmh1ZVJhbmdlWzFdKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbG9yRGljdGlvbmFyeVtjb2xvck5hbWVdO1xuICAgICAgIH1cbiAgICB9IHJldHVybiAnQ29sb3Igbm90IGZvdW5kJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbVdpdGhpbiAocmFuZ2UpIHtcbiAgICBpZiAoc2VlZCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IocmFuZ2VbMF0gKyBNYXRoLnJhbmRvbSgpKihyYW5nZVsxXSArIDEgLSByYW5nZVswXSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL1NlZWRlZCByYW5kb20gYWxnb3JpdGhtIGZyb20gaHR0cDovL2luZGllZ2Ftci5jb20vZ2VuZXJhdGUtcmVwZWF0YWJsZS1yYW5kb20tbnVtYmVycy1pbi1qcy9cbiAgICAgIHZhciBtYXggPSByYW5nZVsxXSB8fCAxO1xuICAgICAgdmFyIG1pbiA9IHJhbmdlWzBdIHx8IDA7XG4gICAgICBzZWVkID0gKHNlZWQgKiA5MzAxICsgNDkyOTcpICUgMjMzMjgwO1xuICAgICAgdmFyIHJuZCA9IHNlZWQgLyAyMzMyODAuMDtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKG1pbiArIHJuZCAqIChtYXggLSBtaW4pKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBIU1Z0b0hleCAoaHN2KXtcblxuICAgIHZhciByZ2IgPSBIU1Z0b1JHQihoc3YpO1xuXG4gICAgZnVuY3Rpb24gY29tcG9uZW50VG9IZXgoYykge1xuICAgICAgICB2YXIgaGV4ID0gYy50b1N0cmluZygxNik7XG4gICAgICAgIHJldHVybiBoZXgubGVuZ3RoID09IDEgPyAnMCcgKyBoZXggOiBoZXg7XG4gICAgfVxuXG4gICAgdmFyIGhleCA9ICcjJyArIGNvbXBvbmVudFRvSGV4KHJnYlswXSkgKyBjb21wb25lbnRUb0hleChyZ2JbMV0pICsgY29tcG9uZW50VG9IZXgocmdiWzJdKTtcblxuICAgIHJldHVybiBoZXg7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZmluZUNvbG9yIChuYW1lLCBodWVSYW5nZSwgbG93ZXJCb3VuZHMpIHtcblxuICAgIHZhciBzTWluID0gbG93ZXJCb3VuZHNbMF1bMF0sXG4gICAgICAgIHNNYXggPSBsb3dlckJvdW5kc1tsb3dlckJvdW5kcy5sZW5ndGggLSAxXVswXSxcblxuICAgICAgICBiTWluID0gbG93ZXJCb3VuZHNbbG93ZXJCb3VuZHMubGVuZ3RoIC0gMV1bMV0sXG4gICAgICAgIGJNYXggPSBsb3dlckJvdW5kc1swXVsxXTtcblxuICAgIGNvbG9yRGljdGlvbmFyeVtuYW1lXSA9IHtcbiAgICAgIGh1ZVJhbmdlOiBodWVSYW5nZSxcbiAgICAgIGxvd2VyQm91bmRzOiBsb3dlckJvdW5kcyxcbiAgICAgIHNhdHVyYXRpb25SYW5nZTogW3NNaW4sIHNNYXhdLFxuICAgICAgYnJpZ2h0bmVzc1JhbmdlOiBbYk1pbiwgYk1heF1cbiAgICB9O1xuXG4gIH1cblxuICBmdW5jdGlvbiBsb2FkQ29sb3JCb3VuZHMgKCkge1xuXG4gICAgZGVmaW5lQ29sb3IoXG4gICAgICAnbW9ub2Nocm9tZScsXG4gICAgICBudWxsLFxuICAgICAgW1swLDBdLFsxMDAsMF1dXG4gICAgKTtcblxuICAgIGRlZmluZUNvbG9yKFxuICAgICAgJ3JlZCcsXG4gICAgICBbLTI2LDE4XSxcbiAgICAgIFtbMjAsMTAwXSxbMzAsOTJdLFs0MCw4OV0sWzUwLDg1XSxbNjAsNzhdLFs3MCw3MF0sWzgwLDYwXSxbOTAsNTVdLFsxMDAsNTBdXVxuICAgICk7XG5cbiAgICBkZWZpbmVDb2xvcihcbiAgICAgICdvcmFuZ2UnLFxuICAgICAgWzE5LDQ2XSxcbiAgICAgIFtbMjAsMTAwXSxbMzAsOTNdLFs0MCw4OF0sWzUwLDg2XSxbNjAsODVdLFs3MCw3MF0sWzEwMCw3MF1dXG4gICAgKTtcblxuICAgIGRlZmluZUNvbG9yKFxuICAgICAgJ3llbGxvdycsXG4gICAgICBbNDcsNjJdLFxuICAgICAgW1syNSwxMDBdLFs0MCw5NF0sWzUwLDg5XSxbNjAsODZdLFs3MCw4NF0sWzgwLDgyXSxbOTAsODBdLFsxMDAsNzVdXVxuICAgICk7XG5cbiAgICBkZWZpbmVDb2xvcihcbiAgICAgICdncmVlbicsXG4gICAgICBbNjMsMTc4XSxcbiAgICAgIFtbMzAsMTAwXSxbNDAsOTBdLFs1MCw4NV0sWzYwLDgxXSxbNzAsNzRdLFs4MCw2NF0sWzkwLDUwXSxbMTAwLDQwXV1cbiAgICApO1xuXG4gICAgZGVmaW5lQ29sb3IoXG4gICAgICAnYmx1ZScsXG4gICAgICBbMTc5LCAyNTddLFxuICAgICAgW1syMCwxMDBdLFszMCw4Nl0sWzQwLDgwXSxbNTAsNzRdLFs2MCw2MF0sWzcwLDUyXSxbODAsNDRdLFs5MCwzOV0sWzEwMCwzNV1dXG4gICAgKTtcblxuICAgIGRlZmluZUNvbG9yKFxuICAgICAgJ3B1cnBsZScsXG4gICAgICBbMjU4LCAyODJdLFxuICAgICAgW1syMCwxMDBdLFszMCw4N10sWzQwLDc5XSxbNTAsNzBdLFs2MCw2NV0sWzcwLDU5XSxbODAsNTJdLFs5MCw0NV0sWzEwMCw0Ml1dXG4gICAgKTtcblxuICAgIGRlZmluZUNvbG9yKFxuICAgICAgJ3BpbmsnLFxuICAgICAgWzI4MywgMzM0XSxcbiAgICAgIFtbMjAsMTAwXSxbMzAsOTBdLFs0MCw4Nl0sWzYwLDg0XSxbODAsODBdLFs5MCw3NV0sWzEwMCw3M11dXG4gICAgKTtcblxuICB9XG5cbiAgZnVuY3Rpb24gSFNWdG9SR0IgKGhzdikge1xuXG4gICAgLy8gdGhpcyBkb2Vzbid0IHdvcmsgZm9yIHRoZSB2YWx1ZXMgb2YgMCBhbmQgMzYwXG4gICAgLy8gaGVyZSdzIHRoZSBoYWNreSBmaXhcbiAgICB2YXIgaCA9IGhzdlswXTtcbiAgICBpZiAoaCA9PT0gMCkge2ggPSAxO31cbiAgICBpZiAoaCA9PT0gMzYwKSB7aCA9IDM1OTt9XG5cbiAgICAvLyBSZWJhc2UgdGhlIGgscyx2IHZhbHVlc1xuICAgIGggPSBoLzM2MDtcbiAgICB2YXIgcyA9IGhzdlsxXS8xMDAsXG4gICAgICAgIHYgPSBoc3ZbMl0vMTAwO1xuXG4gICAgdmFyIGhfaSA9IE1hdGguZmxvb3IoaCo2KSxcbiAgICAgIGYgPSBoICogNiAtIGhfaSxcbiAgICAgIHAgPSB2ICogKDEgLSBzKSxcbiAgICAgIHEgPSB2ICogKDEgLSBmKnMpLFxuICAgICAgdCA9IHYgKiAoMSAtICgxIC0gZikqcyksXG4gICAgICByID0gMjU2LFxuICAgICAgZyA9IDI1NixcbiAgICAgIGIgPSAyNTY7XG5cbiAgICBzd2l0Y2goaF9pKSB7XG4gICAgICBjYXNlIDA6IHIgPSB2OyBnID0gdDsgYiA9IHA7ICBicmVhaztcbiAgICAgIGNhc2UgMTogciA9IHE7IGcgPSB2OyBiID0gcDsgIGJyZWFrO1xuICAgICAgY2FzZSAyOiByID0gcDsgZyA9IHY7IGIgPSB0OyAgYnJlYWs7XG4gICAgICBjYXNlIDM6IHIgPSBwOyBnID0gcTsgYiA9IHY7ICBicmVhaztcbiAgICAgIGNhc2UgNDogciA9IHQ7IGcgPSBwOyBiID0gdjsgIGJyZWFrO1xuICAgICAgY2FzZSA1OiByID0gdjsgZyA9IHA7IGIgPSBxOyAgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IFtNYXRoLmZsb29yKHIqMjU1KSwgTWF0aC5mbG9vcihnKjI1NSksIE1hdGguZmxvb3IoYioyNTUpXTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gSFNWdG9IU0wgKGhzdikge1xuICAgIHZhciBoID0gaHN2WzBdLFxuICAgICAgcyA9IGhzdlsxXS8xMDAsXG4gICAgICB2ID0gaHN2WzJdLzEwMCxcbiAgICAgIGsgPSAoMi1zKSp2O1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIGgsXG4gICAgICBNYXRoLnJvdW5kKHMqdiAvIChrPDEgPyBrIDogMi1rKSAqIDEwMDAwKSAvIDEwMCxcbiAgICAgIGsvMiAqIDEwMFxuICAgIF07XG4gIH1cblxuICBmdW5jdGlvbiBzdHJpbmdUb0ludGVnZXIgKHN0cmluZykge1xuICAgIHZhciB0b3RhbCA9IDBcbiAgICBmb3IgKHZhciBpID0gMDsgaSAhPT0gc3RyaW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodG90YWwgPj0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIGJyZWFrO1xuICAgICAgdG90YWwgKz0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcbiAgICB9XG4gICAgcmV0dXJuIHRvdGFsXG4gIH1cblxuICByZXR1cm4gcmFuZG9tQ29sb3I7XG59KSk7XG4iXX0=
