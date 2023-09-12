(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function _assertThisInitialized(self) {
        if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    }
    function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        subClass.__proto__ = superClass;
    }
    /*!
 * GSAP 3.12.1
 * https://greensock.com
 *
 * @license Copyright 2008-2023, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/    var _suppressOverwrites, _reverting, _context, _globalTimeline, _win, _coreInitted, _doc, _coreReady, _lastRenderedFrame, _quickTween, _tickerActive, _config = {
        autoSleep: 120,
        force3D: "auto",
        nullTargetWarn: 1,
        units: {
            lineHeight: ""
        }
    }, _defaults = {
        duration: .5,
        overwrite: false,
        delay: 0
    }, _bigNum = 1e8, _tinyNum = 1 / _bigNum, _2PI = Math.PI * 2, _HALF_PI = _2PI / 4, _gsID = 0, _sqrt = Math.sqrt, _cos = Math.cos, _sin = Math.sin, _isString = function _isString(value) {
        return typeof value === "string";
    }, _isFunction = function _isFunction(value) {
        return typeof value === "function";
    }, _isNumber = function _isNumber(value) {
        return typeof value === "number";
    }, _isUndefined = function _isUndefined(value) {
        return typeof value === "undefined";
    }, _isObject = function _isObject(value) {
        return typeof value === "object";
    }, _isNotFalse = function _isNotFalse(value) {
        return value !== false;
    }, _windowExists = function _windowExists() {
        return typeof window !== "undefined";
    }, _isFuncOrString = function _isFuncOrString(value) {
        return _isFunction(value) || _isString(value);
    }, _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function() {}, _isArray = Array.isArray, _strictNumExp = /(?:-?\.?\d|\.)+/gi, _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, _relExp = /[+-]=-?[.\d]+/, _delimitedValueExp = /[^,'"\[\]\s]+/gi, _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, _globals = {}, _installScope = {}, _install = function _install(scope) {
        return (_installScope = _merge(scope, _globals)) && gsap;
    }, _missingPlugin = function _missingPlugin(property, value) {
        return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
    }, _warn = function _warn(message, suppress) {
        return !suppress && console.warn(message);
    }, _addGlobal = function _addGlobal(name, obj) {
        return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
    }, _emptyFunc = function _emptyFunc() {
        return 0;
    }, _startAtRevertConfig = {
        suppressEvents: true,
        isStart: true,
        kill: false
    }, _revertConfigNoKill = {
        suppressEvents: true,
        kill: false
    }, _revertConfig = {
        suppressEvents: true
    }, _reservedProps = {}, _lazyTweens = [], _lazyLookup = {}, _plugins = {}, _effects = {}, _nextGCFrame = 30, _harnessPlugins = [], _callbackNames = "", _harness = function _harness(targets) {
        var harnessPlugin, i, target = targets[0];
        _isObject(target) || _isFunction(target) || (targets = [ targets ]);
        if (!(harnessPlugin = (target._gsap || {}).harness)) {
            i = _harnessPlugins.length;
            while (i-- && !_harnessPlugins[i].targetTest(target)) ;
            harnessPlugin = _harnessPlugins[i];
        }
        i = targets.length;
        while (i--) targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
        return targets;
    }, _getCache = function _getCache(target) {
        return target._gsap || _harness(toArray(target))[0]._gsap;
    }, _getProperty = function _getProperty(target, property, v) {
        return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
    }, _forEachName = function _forEachName(names, func) {
        return (names = names.split(",")).forEach(func) || names;
    }, _round = function _round(value) {
        return Math.round(value * 1e5) / 1e5 || 0;
    }, _roundPrecise = function _roundPrecise(value) {
        return Math.round(value * 1e7) / 1e7 || 0;
    }, _parseRelative = function _parseRelative(start, value) {
        var operator = value.charAt(0), end = parseFloat(value.substr(2));
        start = parseFloat(start);
        return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
    }, _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
        var l = toFind.length, i = 0;
        for (;toSearch.indexOf(toFind[i]) < 0 && ++i < l; ) ;
        return i < l;
    }, _lazyRender = function _lazyRender() {
        var i, tween, l = _lazyTweens.length, a = _lazyTweens.slice(0);
        _lazyLookup = {};
        _lazyTweens.length = 0;
        for (i = 0; i < l; i++) {
            tween = a[i];
            tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
        }
    }, _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
        _lazyTweens.length && !_reverting && _lazyRender();
        animation.render(time, suppressEvents, force || _reverting && time < 0 && (animation._initted || animation._startAt));
        _lazyTweens.length && !_reverting && _lazyRender();
    }, _numericIfPossible = function _numericIfPossible(value) {
        var n = parseFloat(value);
        return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
    }, _passThrough = function _passThrough(p) {
        return p;
    }, _setDefaults = function _setDefaults(obj, defaults) {
        for (var p in defaults) p in obj || (obj[p] = defaults[p]);
        return obj;
    }, _setKeyframeDefaults = function _setKeyframeDefaults(excludeDuration) {
        return function(obj, defaults) {
            for (var p in defaults) p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults[p]);
        };
    }, _merge = function _merge(base, toMerge) {
        for (var p in toMerge) base[p] = toMerge[p];
        return base;
    }, _mergeDeep = function _mergeDeep(base, toMerge) {
        for (var p in toMerge) p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
        return base;
    }, _copyExcluding = function _copyExcluding(obj, excluding) {
        var p, copy = {};
        for (p in obj) p in excluding || (copy[p] = obj[p]);
        return copy;
    }, _inheritDefaults = function _inheritDefaults(vars) {
        var parent = vars.parent || _globalTimeline, func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults;
        if (_isNotFalse(vars.inherit)) while (parent) {
            func(vars, parent.vars.defaults);
            parent = parent.parent || parent._dp;
        }
        return vars;
    }, _arraysMatch = function _arraysMatch(a1, a2) {
        var i = a1.length, match = i === a2.length;
        while (match && i-- && a1[i] === a2[i]) ;
        return i < 0;
    }, _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
        if (firstProp === void 0) firstProp = "_first";
        if (lastProp === void 0) lastProp = "_last";
        var t, prev = parent[lastProp];
        if (sortBy) {
            t = child[sortBy];
            while (prev && prev[sortBy] > t) prev = prev._prev;
        }
        if (prev) {
            child._next = prev._next;
            prev._next = child;
        } else {
            child._next = parent[firstProp];
            parent[firstProp] = child;
        }
        if (child._next) child._next._prev = child; else parent[lastProp] = child;
        child._prev = prev;
        child.parent = child._dp = parent;
        return child;
    }, _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
        if (firstProp === void 0) firstProp = "_first";
        if (lastProp === void 0) lastProp = "_last";
        var prev = child._prev, next = child._next;
        if (prev) prev._next = next; else if (parent[firstProp] === child) parent[firstProp] = next;
        if (next) next._prev = prev; else if (parent[lastProp] === child) parent[lastProp] = prev;
        child._next = child._prev = child.parent = null;
    }, _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
        child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove && child.parent.remove(child);
        child._act = 0;
    }, _uncache = function _uncache(animation, child) {
        if (animation && (!child || child._end > animation._dur || child._start < 0)) {
            var a = animation;
            while (a) {
                a._dirty = 1;
                a = a.parent;
            }
        }
        return animation;
    }, _recacheAncestors = function _recacheAncestors(animation) {
        var parent = animation.parent;
        while (parent && parent.parent) {
            parent._dirty = 1;
            parent.totalDuration();
            parent = parent.parent;
        }
        return animation;
    }, _rewindStartAt = function _rewindStartAt(tween, totalTime, suppressEvents, force) {
        return tween._startAt && (_reverting ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
    }, _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
        return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
    }, _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
        return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
    }, _animationCycle = function _animationCycle(tTime, cycleDuration) {
        var whole = Math.floor(tTime /= cycleDuration);
        return tTime && whole === tTime ? whole - 1 : whole;
    }, _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
        return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
    }, _setEnd = function _setEnd(animation) {
        return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
    }, _alignPlayhead = function _alignPlayhead(animation, totalTime) {
        var parent = animation._dp;
        if (parent && parent.smoothChildTiming && animation._ts) {
            animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
            _setEnd(animation);
            parent._dirty || _uncache(parent, animation);
        }
        return animation;
    }, _postAddChecks = function _postAddChecks(timeline, child) {
        var t;
        if (child._time || child._initted && !child._dur) {
            t = _parentToChildTotalTime(timeline.rawTime(), child);
            if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) child.render(t, true);
        }
        if (_uncache(timeline, child)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
            if (timeline._dur < timeline.duration()) {
                t = timeline;
                while (t._dp) {
                    t.rawTime() >= 0 && t.totalTime(t._tTime);
                    t = t._dp;
                }
            }
            timeline._zTime = -_tinyNum;
        }
    }, _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
        child.parent && _removeFromParent(child);
        child._start = _roundPrecise((_isNumber(position) ? position : position || timeline !== _globalTimeline ? _parsePosition(timeline, position, child) : timeline._time) + child._delay);
        child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
        _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);
        _isFromOrFromStart(child) || (timeline._recent = child);
        skipChecks || _postAddChecks(timeline, child);
        timeline._ts < 0 && _alignPlayhead(timeline, timeline._tTime);
        return timeline;
    }, _scrollTrigger = function _scrollTrigger(animation, trigger) {
        return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
    }, _attemptInitTween = function _attemptInitTween(tween, time, force, suppressEvents, tTime) {
        _initTween(tween, time, tTime);
        if (!tween._initted) return 1;
        if (!force && tween._pt && !_reverting && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
            _lazyTweens.push(tween);
            tween._lazy = [ tTime, suppressEvents ];
            return 1;
        }
    }, _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart(_ref) {
        var parent = _ref.parent;
        return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart(parent));
    }, _isFromOrFromStart = function _isFromOrFromStart(_ref2) {
        var data = _ref2.data;
        return data === "isFromStart" || data === "isStart";
    }, _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
        var pt, iteration, prevIteration, prevRatio = tween.ratio, ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1, repeatDelay = tween._rDelay, tTime = 0;
        if (repeatDelay && tween._repeat) {
            tTime = _clamp(0, tween._tDur, totalTime);
            iteration = _animationCycle(tTime, repeatDelay);
            tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
            if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
                prevRatio = 1 - ratio;
                tween.vars.repeatRefresh && tween._initted && tween.invalidate();
            }
        }
        if (ratio !== prevRatio || _reverting || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
            if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) return;
            prevIteration = tween._zTime;
            tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
            suppressEvents || (suppressEvents = totalTime && !prevIteration);
            tween.ratio = ratio;
            tween._from && (ratio = 1 - ratio);
            tween._time = 0;
            tween._tTime = tTime;
            pt = tween._pt;
            while (pt) {
                pt.r(ratio, pt.d);
                pt = pt._next;
            }
            totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
            tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
            tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");
            if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
                ratio && _removeFromParent(tween, 1);
                if (!suppressEvents && !_reverting) {
                    _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);
                    tween._prom && tween._prom();
                }
            }
        } else if (!tween._zTime) tween._zTime = totalTime;
    }, _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
        var child;
        if (time > prevTime) {
            child = animation._first;
            while (child && child._start <= time) {
                if (child.data === "isPause" && child._start > prevTime) return child;
                child = child._next;
            }
        } else {
            child = animation._last;
            while (child && child._start >= time) {
                if (child.data === "isPause" && child._start < prevTime) return child;
                child = child._prev;
            }
        }
    }, _setDuration = function _setDuration(animation, duration, skipUncache, leavePlayhead) {
        var repeat = animation._repeat, dur = _roundPrecise(duration) || 0, totalProgress = animation._tTime / animation._tDur;
        totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
        animation._dur = dur;
        animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
        totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
        animation.parent && _setEnd(animation);
        skipUncache || _uncache(animation.parent, animation);
        return animation;
    }, _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
        return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
    }, _zeroPosition = {
        _start: 0,
        endTime: _emptyFunc,
        totalDuration: _emptyFunc
    }, _parsePosition = function _parsePosition(animation, position, percentAnimation) {
        var i, offset, isPercent, labels = animation.labels, recent = animation._recent || _zeroPosition, clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur;
        if (_isString(position) && (isNaN(position) || position in labels)) {
            offset = position.charAt(0);
            isPercent = position.substr(-1) === "%";
            i = position.indexOf("=");
            if (offset === "<" || offset === ">") {
                i >= 0 && (position = position.replace(/=/, ""));
                return (offset === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
            }
            if (i < 0) {
                position in labels || (labels[position] = clippedDuration);
                return labels[position];
            }
            offset = parseFloat(position.charAt(i - 1) + position.substr(i + 1));
            if (isPercent && percentAnimation) offset = offset / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
            return i > 1 ? _parsePosition(animation, position.substr(0, i - 1), percentAnimation) + offset : clippedDuration + offset;
        }
        return position == null ? clippedDuration : +position;
    }, _createTweenType = function _createTweenType(type, params, timeline) {
        var irVars, parent, isLegacy = _isNumber(params[1]), varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1), vars = params[varsIndex];
        isLegacy && (vars.duration = params[1]);
        vars.parent = timeline;
        if (type) {
            irVars = vars;
            parent = timeline;
            while (parent && !("immediateRender" in irVars)) {
                irVars = parent.vars.defaults || {};
                parent = _isNotFalse(parent.vars.inherit) && parent.parent;
            }
            vars.immediateRender = _isNotFalse(irVars.immediateRender);
            type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1];
        }
        return new Tween(params[0], vars, params[varsIndex + 1]);
    }, _conditionalReturn = function _conditionalReturn(value, func) {
        return value || value === 0 ? func(value) : func;
    }, _clamp = function _clamp(min, max, value) {
        return value < min ? min : value > max ? max : value;
    }, getUnit = function getUnit(value, v) {
        return !_isString(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
    }, clamp = function clamp(min, max, value) {
        return _conditionalReturn(value, (function(v) {
            return _clamp(min, max, v);
        }));
    }, _slice = [].slice, _isArrayLike = function _isArrayLike(value, nonEmpty) {
        return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
    }, _flatten = function _flatten(ar, leaveStrings, accumulator) {
        if (accumulator === void 0) accumulator = [];
        return ar.forEach((function(value) {
            var _accumulator;
            return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
        })) || accumulator;
    }, toArray = function toArray(value, scope, leaveStrings) {
        return _context && !scope && _context.selector ? _context.selector(value) : _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call((scope || _doc).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [ value ] : [];
    }, selector = function selector(value) {
        value = toArray(value)[0] || _warn("Invalid scope") || {};
        return function(v) {
            var el = value.current || value.nativeElement || value;
            return toArray(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc.createElement("div") : value);
        };
    }, shuffle = function shuffle(a) {
        return a.sort((function() {
            return .5 - Math.random();
        }));
    }, distribute = function distribute(v) {
        if (_isFunction(v)) return v;
        var vars = _isObject(v) ? v : {
            each: v
        }, ease = _parseEase(vars.ease), from = vars.from || 0, base = parseFloat(vars.base) || 0, cache = {}, isDecimal = from > 0 && from < 1, ratios = isNaN(from) || isDecimal, axis = vars.axis, ratioX = from, ratioY = from;
        if (_isString(from)) ratioX = ratioY = {
            center: .5,
            edges: .5,
            end: 1
        }[from] || 0; else if (!isDecimal && ratios) {
            ratioX = from[0];
            ratioY = from[1];
        }
        return function(i, target, a) {
            var originX, originY, x, y, d, j, max, min, wrapAt, l = (a || vars).length, distances = cache[l];
            if (!distances) {
                wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [ 1, _bigNum ])[1];
                if (!wrapAt) {
                    max = -_bigNum;
                    while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) ;
                    wrapAt--;
                }
                distances = cache[l] = [];
                originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
                originY = wrapAt === _bigNum ? 0 : ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
                max = 0;
                min = _bigNum;
                for (j = 0; j < l; j++) {
                    x = j % wrapAt - originX;
                    y = originY - (j / wrapAt | 0);
                    distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
                    d > max && (max = d);
                    d < min && (min = d);
                }
                from === "random" && shuffle(distances);
                distances.max = max - min;
                distances.min = min;
                distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
                distances.b = l < 0 ? base - l : base;
                distances.u = getUnit(vars.amount || vars.each) || 0;
                ease = ease && l < 0 ? _invertEase(ease) : ease;
            }
            l = (distances[i] - distances.min) / distances.max || 0;
            return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u;
        };
    }, _roundModifier = function _roundModifier(v) {
        var p = Math.pow(10, ((v + "").split(".")[1] || "").length);
        return function(raw) {
            var n = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);
            return (n - n % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw));
        };
    }, snap = function snap(snapTo, value) {
        var radius, is2D, isArray = _isArray(snapTo);
        if (!isArray && _isObject(snapTo)) {
            radius = isArray = snapTo.radius || _bigNum;
            if (snapTo.values) {
                snapTo = toArray(snapTo.values);
                if (is2D = !_isNumber(snapTo[0])) radius *= radius;
            } else snapTo = _roundModifier(snapTo.increment);
        }
        return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function(raw) {
            is2D = snapTo(raw);
            return Math.abs(is2D - raw) <= radius ? is2D : raw;
        } : function(raw) {
            var dx, dy, x = parseFloat(is2D ? raw.x : raw), y = parseFloat(is2D ? raw.y : 0), min = _bigNum, closest = 0, i = snapTo.length;
            while (i--) {
                if (is2D) {
                    dx = snapTo[i].x - x;
                    dy = snapTo[i].y - y;
                    dx = dx * dx + dy * dy;
                } else dx = Math.abs(snapTo[i] - x);
                if (dx < min) {
                    min = dx;
                    closest = i;
                }
            }
            closest = !radius || min <= radius ? snapTo[closest] : raw;
            return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
        });
    }, random = function random(min, max, roundingIncrement, returnFunction) {
        return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, (function() {
            return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * .99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
        }));
    }, pipe = function pipe() {
        for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) functions[_key] = arguments[_key];
        return function(value) {
            return functions.reduce((function(v, f) {
                return f(v);
            }), value);
        };
    }, unitize = function unitize(func, unit) {
        return function(value) {
            return func(parseFloat(value)) + (unit || getUnit(value));
        };
    }, normalize = function normalize(min, max, value) {
        return mapRange(min, max, 0, 1, value);
    }, _wrapArray = function _wrapArray(a, wrapper, value) {
        return _conditionalReturn(value, (function(index) {
            return a[~~wrapper(index)];
        }));
    }, wrap = function wrap(min, max, value) {
        var range = max - min;
        return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, (function(value) {
            return (range + (value - min) % range) % range + min;
        }));
    }, wrapYoyo = function wrapYoyo(min, max, value) {
        var range = max - min, total = range * 2;
        return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, (function(value) {
            value = (total + (value - min) % total) % total || 0;
            return min + (value > range ? total - value : value);
        }));
    }, _replaceRandom = function _replaceRandom(value) {
        var i, nums, end, isArray, prev = 0, s = "";
        while (~(i = value.indexOf("random(", prev))) {
            end = value.indexOf(")", i);
            isArray = value.charAt(i + 7) === "[";
            nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
            s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], isArray ? 0 : +nums[1], +nums[2] || 1e-5);
            prev = end + 1;
        }
        return s + value.substr(prev, value.length - prev);
    }, mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
        var inRange = inMax - inMin, outRange = outMax - outMin;
        return _conditionalReturn(value, (function(value) {
            return outMin + ((value - inMin) / inRange * outRange || 0);
        }));
    }, interpolate = function interpolate(start, end, progress, mutate) {
        var func = isNaN(start + end) ? 0 : function(p) {
            return (1 - p) * start + p * end;
        };
        if (!func) {
            var p, i, interpolators, l, il, isString = _isString(start), master = {};
            progress === true && (mutate = 1) && (progress = null);
            if (isString) {
                start = {
                    p: start
                };
                end = {
                    p: end
                };
            } else if (_isArray(start) && !_isArray(end)) {
                interpolators = [];
                l = start.length;
                il = l - 2;
                for (i = 1; i < l; i++) interpolators.push(interpolate(start[i - 1], start[i]));
                l--;
                func = function func(p) {
                    p *= l;
                    var i = Math.min(il, ~~p);
                    return interpolators[i](p - i);
                };
                progress = end;
            } else if (!mutate) start = _merge(_isArray(start) ? [] : {}, start);
            if (!interpolators) {
                for (p in end) _addPropTween.call(master, start, p, "get", end[p]);
                func = function func(p) {
                    return _renderPropTweens(p, master) || (isString ? start.p : start);
                };
            }
        }
        return _conditionalReturn(progress, func);
    }, _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
        var p, distance, label, labels = timeline.labels, min = _bigNum;
        for (p in labels) {
            distance = labels[p] - fromTime;
            if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
                label = p;
                min = distance;
            }
        }
        return label;
    }, _callback = function _callback(animation, type, executeLazyFirst) {
        var params, scope, result, v = animation.vars, callback = v[type], prevContext = _context, context = animation._ctx;
        if (!callback) return;
        params = v[type + "Params"];
        scope = v.callbackScope || animation;
        executeLazyFirst && _lazyTweens.length && _lazyRender();
        context && (_context = context);
        result = params ? callback.apply(scope, params) : callback.call(scope);
        _context = prevContext;
        return result;
    }, _interrupt = function _interrupt(animation) {
        _removeFromParent(animation);
        animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting);
        animation.progress() < 1 && _callback(animation, "onInterrupt");
        return animation;
    }, _registerPluginQueue = [], _createPlugin = function _createPlugin(config) {
        if (_windowExists() && config) {
            config = !config.name && config["default"] || config;
            var name = config.name, isFunc = _isFunction(config), Plugin = name && !isFunc && config.init ? function() {
                this._props = [];
            } : config, instanceDefaults = {
                init: _emptyFunc,
                render: _renderPropTweens,
                add: _addPropTween,
                kill: _killPropTweensOf,
                modifier: _addPluginModifier,
                rawVars: 0
            }, statics = {
                targetTest: 0,
                get: 0,
                getSetter: _getSetter,
                aliases: {},
                register: 0
            };
            _wake();
            if (config !== Plugin) {
                if (_plugins[name]) return;
                _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics));
                _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics)));
                _plugins[Plugin.prop = name] = Plugin;
                if (config.targetTest) {
                    _harnessPlugins.push(Plugin);
                    _reservedProps[name] = 1;
                }
                name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
            }
            _addGlobal(name, Plugin);
            config.register && config.register(gsap, Plugin, PropTween);
        } else config && _registerPluginQueue.push(config);
    }, _255 = 255, _colorLookup = {
        aqua: [ 0, _255, _255 ],
        lime: [ 0, _255, 0 ],
        silver: [ 192, 192, 192 ],
        black: [ 0, 0, 0 ],
        maroon: [ 128, 0, 0 ],
        teal: [ 0, 128, 128 ],
        blue: [ 0, 0, _255 ],
        navy: [ 0, 0, 128 ],
        white: [ _255, _255, _255 ],
        olive: [ 128, 128, 0 ],
        yellow: [ _255, _255, 0 ],
        orange: [ _255, 165, 0 ],
        gray: [ 128, 128, 128 ],
        purple: [ 128, 0, 128 ],
        green: [ 0, 128, 0 ],
        red: [ _255, 0, 0 ],
        pink: [ _255, 192, 203 ],
        cyan: [ 0, _255, _255 ],
        transparent: [ _255, _255, _255, 0 ]
    }, _hue = function _hue(h, m1, m2) {
        h += h < 0 ? 1 : h > 1 ? -1 : 0;
        return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
    }, splitColor = function splitColor(v, toHSL, forceAlpha) {
        var r, g, b, h, s, l, max, min, d, wasHSL, a = !v ? _colorLookup.black : _isNumber(v) ? [ v >> 16, v >> 8 & _255, v & _255 ] : 0;
        if (!a) {
            if (v.substr(-1) === ",") v = v.substr(0, v.length - 1);
            if (_colorLookup[v]) a = _colorLookup[v]; else if (v.charAt(0) === "#") {
                if (v.length < 6) {
                    r = v.charAt(1);
                    g = v.charAt(2);
                    b = v.charAt(3);
                    v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
                }
                if (v.length === 9) {
                    a = parseInt(v.substr(1, 6), 16);
                    return [ a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255 ];
                }
                v = parseInt(v.substr(1), 16);
                a = [ v >> 16, v >> 8 & _255, v & _255 ];
            } else if (v.substr(0, 3) === "hsl") {
                a = wasHSL = v.match(_strictNumExp);
                if (!toHSL) {
                    h = +a[0] % 360 / 360;
                    s = +a[1] / 100;
                    l = +a[2] / 100;
                    g = l <= .5 ? l * (s + 1) : l + s - l * s;
                    r = l * 2 - g;
                    a.length > 3 && (a[3] *= 1);
                    a[0] = _hue(h + 1 / 3, r, g);
                    a[1] = _hue(h, r, g);
                    a[2] = _hue(h - 1 / 3, r, g);
                } else if (~v.indexOf("=")) {
                    a = v.match(_numExp);
                    forceAlpha && a.length < 4 && (a[3] = 1);
                    return a;
                }
            } else a = v.match(_strictNumExp) || _colorLookup.transparent;
            a = a.map(Number);
        }
        if (toHSL && !wasHSL) {
            r = a[0] / _255;
            g = a[1] / _255;
            b = a[2] / _255;
            max = Math.max(r, g, b);
            min = Math.min(r, g, b);
            l = (max + min) / 2;
            if (max === min) h = s = 0; else {
                d = max - min;
                s = l > .5 ? d / (2 - max - min) : d / (max + min);
                h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
                h *= 60;
            }
            a[0] = ~~(h + .5);
            a[1] = ~~(s * 100 + .5);
            a[2] = ~~(l * 100 + .5);
        }
        forceAlpha && a.length < 4 && (a[3] = 1);
        return a;
    }, _colorOrderData = function _colorOrderData(v) {
        var values = [], c = [], i = -1;
        v.split(_colorExp).forEach((function(v) {
            var a = v.match(_numWithUnitExp) || [];
            values.push.apply(values, a);
            c.push(i += a.length + 1);
        }));
        values.c = c;
        return values;
    }, _formatColors = function _formatColors(s, toHSL, orderMatchData) {
        var c, shell, d, l, result = "", colors = (s + result).match(_colorExp), type = toHSL ? "hsla(" : "rgba(", i = 0;
        if (!colors) return s;
        colors = colors.map((function(color) {
            return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
        }));
        if (orderMatchData) {
            d = _colorOrderData(s);
            c = orderMatchData.c;
            if (c.join(result) !== d.c.join(result)) {
                shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
                l = shell.length - 1;
                for (;i < l; i++) result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
            }
        }
        if (!shell) {
            shell = s.split(_colorExp);
            l = shell.length - 1;
            for (;i < l; i++) result += shell[i] + colors[i];
        }
        return result + shell[l];
    }, _colorExp = function() {
        var p, s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b";
        for (p in _colorLookup) s += "|" + p + "\\b";
        return new RegExp(s + ")", "gi");
    }(), _hslExp = /hsl[a]?\(/, _colorStringFilter = function _colorStringFilter(a) {
        var toHSL, combined = a.join(" ");
        _colorExp.lastIndex = 0;
        if (_colorExp.test(combined)) {
            toHSL = _hslExp.test(combined);
            a[1] = _formatColors(a[1], toHSL);
            a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
            return true;
        }
    }, _ticker = function() {
        var _id, _req, _raf, _self, _delta, _i, _getTime = Date.now, _lagThreshold = 500, _adjustedLag = 33, _startTime = _getTime(), _lastUpdate = _startTime, _gap = 1e3 / 240, _nextTime = _gap, _listeners = [], _tick = function _tick(v) {
            var overlap, dispatch, time, frame, elapsed = _getTime() - _lastUpdate, manual = v === true;
            elapsed > _lagThreshold && (_startTime += elapsed - _adjustedLag);
            _lastUpdate += elapsed;
            time = _lastUpdate - _startTime;
            overlap = time - _nextTime;
            if (overlap > 0 || manual) {
                frame = ++_self.frame;
                _delta = time - _self.time * 1e3;
                _self.time = time /= 1e3;
                _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
                dispatch = 1;
            }
            manual || (_id = _req(_tick));
            if (dispatch) for (_i = 0; _i < _listeners.length; _i++) _listeners[_i](time, _delta, frame, v);
        };
        _self = {
            time: 0,
            frame: 0,
            tick: function tick() {
                _tick(true);
            },
            deltaRatio: function deltaRatio(fps) {
                return _delta / (1e3 / (fps || 60));
            },
            wake: function wake() {
                if (_coreReady) {
                    if (!_coreInitted && _windowExists()) {
                        _win = _coreInitted = window;
                        _doc = _win.document || {};
                        _globals.gsap = gsap;
                        (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);
                        _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});
                        _raf = _win.requestAnimationFrame;
                        _registerPluginQueue.forEach(_createPlugin);
                    }
                    _id && _self.sleep();
                    _req = _raf || function(f) {
                        return setTimeout(f, _nextTime - _self.time * 1e3 + 1 | 0);
                    };
                    _tickerActive = 1;
                    _tick(2);
                }
            },
            sleep: function sleep() {
                (_raf ? _win.cancelAnimationFrame : clearTimeout)(_id);
                _tickerActive = 0;
                _req = _emptyFunc;
            },
            lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
                _lagThreshold = threshold || 1 / 0;
                _adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
            },
            fps: function fps(_fps) {
                _gap = 1e3 / (_fps || 240);
                _nextTime = _self.time * 1e3 + _gap;
            },
            add: function add(callback, once, prioritize) {
                var func = once ? function(t, d, f, v) {
                    callback(t, d, f, v);
                    _self.remove(func);
                } : callback;
                _self.remove(callback);
                _listeners[prioritize ? "unshift" : "push"](func);
                _wake();
                return func;
            },
            remove: function remove(callback, i) {
                ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1) && _i >= i && _i--;
            },
            _listeners
        };
        return _self;
    }(), _wake = function _wake() {
        return !_tickerActive && _ticker.wake();
    }, _easeMap = {}, _customEaseExp = /^[\d.\-M][\d.\-,\s]/, _quotesExp = /["']/g, _parseObjectInString = function _parseObjectInString(value) {
        var index, val, parsedVal, obj = {}, split = value.substr(1, value.length - 3).split(":"), key = split[0], i = 1, l = split.length;
        for (;i < l; i++) {
            val = split[i];
            index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
            parsedVal = val.substr(0, index);
            obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
            key = val.substr(index + 1).trim();
        }
        return obj;
    }, _valueInParentheses = function _valueInParentheses(value) {
        var open = value.indexOf("(") + 1, close = value.indexOf(")"), nested = value.indexOf("(", open);
        return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
    }, _configEaseFromString = function _configEaseFromString(name) {
        var split = (name + "").split("("), ease = _easeMap[split[0]];
        return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [ _parseObjectInString(split[1]) ] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
    }, _invertEase = function _invertEase(ease) {
        return function(p) {
            return 1 - ease(1 - p);
        };
    }, _propagateYoyoEase = function _propagateYoyoEase(timeline, isYoyo) {
        var ease, child = timeline._first;
        while (child) {
            if (child instanceof Timeline) _propagateYoyoEase(child, isYoyo); else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) if (child.timeline) _propagateYoyoEase(child.timeline, isYoyo); else {
                ease = child._ease;
                child._ease = child._yEase;
                child._yEase = ease;
                child._yoyo = isYoyo;
            }
            child = child._next;
        }
    }, _parseEase = function _parseEase(ease, defaultEase) {
        return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
    }, _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
        if (easeOut === void 0) easeOut = function easeOut(p) {
            return 1 - easeIn(1 - p);
        };
        if (easeInOut === void 0) easeInOut = function easeInOut(p) {
            return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
        };
        var lowercaseName, ease = {
            easeIn,
            easeOut,
            easeInOut
        };
        _forEachName(names, (function(name) {
            _easeMap[name] = _globals[name] = ease;
            _easeMap[lowercaseName = name.toLowerCase()] = easeOut;
            for (var p in ease) _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
        }));
        return ease;
    }, _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
        return function(p) {
            return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
        };
    }, _configElastic = function _configElastic(type, amplitude, period) {
        var p1 = amplitude >= 1 ? amplitude : 1, p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1), p3 = p2 / _2PI * (Math.asin(1 / p1) || 0), easeOut = function easeOut(p) {
            return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
        }, ease = type === "out" ? easeOut : type === "in" ? function(p) {
            return 1 - easeOut(1 - p);
        } : _easeInOutFromOut(easeOut);
        p2 = _2PI / p2;
        ease.config = function(amplitude, period) {
            return _configElastic(type, amplitude, period);
        };
        return ease;
    }, _configBack = function _configBack(type, overshoot) {
        if (overshoot === void 0) overshoot = 1.70158;
        var easeOut = function easeOut(p) {
            return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
        }, ease = type === "out" ? easeOut : type === "in" ? function(p) {
            return 1 - easeOut(1 - p);
        } : _easeInOutFromOut(easeOut);
        ease.config = function(overshoot) {
            return _configBack(type, overshoot);
        };
        return ease;
    };
    _forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", (function(name, i) {
        var power = i < 5 ? i + 1 : i;
        _insertEase(name + ",Power" + (power - 1), i ? function(p) {
            return Math.pow(p, power);
        } : function(p) {
            return p;
        }, (function(p) {
            return 1 - Math.pow(1 - p, power);
        }), (function(p) {
            return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
        }));
    }));
    _easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
    _insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
    (function(n, c) {
        var n1 = 1 / c, n2 = 2 * n1, n3 = 2.5 * n1, easeOut = function easeOut(p) {
            return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
        };
        _insertEase("Bounce", (function(p) {
            return 1 - easeOut(1 - p);
        }), easeOut);
    })(7.5625, 2.75);
    _insertEase("Expo", (function(p) {
        return p ? Math.pow(2, 10 * (p - 1)) : 0;
    }));
    _insertEase("Circ", (function(p) {
        return -(_sqrt(1 - p * p) - 1);
    }));
    _insertEase("Sine", (function(p) {
        return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
    }));
    _insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
    _easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
        config: function config(steps, immediateStart) {
            if (steps === void 0) steps = 1;
            var p1 = 1 / steps, p2 = steps + (immediateStart ? 0 : 1), p3 = immediateStart ? 1 : 0, max = 1 - _tinyNum;
            return function(p) {
                return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
            };
        }
    };
    _defaults.ease = _easeMap["quad.out"];
    _forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", (function(name) {
        return _callbackNames += name + "," + name + "Params,";
    }));
    var GSCache = function GSCache(target, harness) {
        this.id = _gsID++;
        target._gsap = this;
        this.target = target;
        this.harness = harness;
        this.get = harness ? harness.get : _getProperty;
        this.set = harness ? harness.getSetter : _getSetter;
    };
    var Animation = function() {
        function Animation(vars) {
            this.vars = vars;
            this._delay = +vars.delay || 0;
            if (this._repeat = vars.repeat === 1 / 0 ? -2 : vars.repeat || 0) {
                this._rDelay = vars.repeatDelay || 0;
                this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
            }
            this._ts = 1;
            _setDuration(this, +vars.duration, 1, 1);
            this.data = vars.data;
            if (_context) {
                this._ctx = _context;
                _context.data.push(this);
            }
            _tickerActive || _ticker.wake();
        }
        var _proto = Animation.prototype;
        _proto.delay = function delay(value) {
            if (value || value === 0) {
                this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
                this._delay = value;
                return this;
            }
            return this._delay;
        };
        _proto.duration = function duration(value) {
            return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
        };
        _proto.totalDuration = function totalDuration(value) {
            if (!arguments.length) return this._tDur;
            this._dirty = 0;
            return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
        };
        _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
            _wake();
            if (!arguments.length) return this._tTime;
            var parent = this._dp;
            if (parent && parent.smoothChildTiming && this._ts) {
                _alignPlayhead(this, _totalTime);
                !parent._dp || parent.parent || _postAddChecks(parent, this);
                while (parent && parent.parent) {
                    if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) parent.totalTime(parent._tTime, true);
                    parent = parent.parent;
                }
                if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) _addToTimeline(this._dp, this, this._start - this._delay);
            }
            if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
                this._ts || (this._pTime = _totalTime);
                _lazySafeRender(this, _totalTime, suppressEvents);
            }
            return this;
        };
        _proto.time = function time(value, suppressEvents) {
            return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time;
        };
        _proto.totalProgress = function totalProgress(value, suppressEvents) {
            return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio;
        };
        _proto.progress = function progress(value, suppressEvents) {
            return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio;
        };
        _proto.iteration = function iteration(value, suppressEvents) {
            var cycleDuration = this.duration() + this._rDelay;
            return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
        };
        _proto.timeScale = function timeScale(value) {
            if (!arguments.length) return this._rts === -_tinyNum ? 0 : this._rts;
            if (this._rts === value) return this;
            var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
            this._rts = +value || 0;
            this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
            this.totalTime(_clamp(-Math.abs(this._delay), this._tDur, tTime), true);
            _setEnd(this);
            return _recacheAncestors(this);
        };
        _proto.paused = function paused(value) {
            if (!arguments.length) return this._ps;
            if (this._ps !== value) {
                this._ps = value;
                if (value) {
                    this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
                    this._ts = this._act = 0;
                } else {
                    _wake();
                    this._ts = this._rts;
                    this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum));
                }
            }
            return this;
        };
        _proto.startTime = function startTime(value) {
            if (arguments.length) {
                this._start = value;
                var parent = this.parent || this._dp;
                parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
                return this;
            }
            return this._start;
        };
        _proto.endTime = function endTime(includeRepeats) {
            return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
        };
        _proto.rawTime = function rawTime(wrapRepeats) {
            var parent = this.parent || this._dp;
            return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
        };
        _proto.revert = function revert(config) {
            if (config === void 0) config = _revertConfig;
            var prevIsReverting = _reverting;
            _reverting = config;
            if (this._initted || this._startAt) {
                this.timeline && this.timeline.revert(config);
                this.totalTime(-.01, config.suppressEvents);
            }
            this.data !== "nested" && config.kill !== false && this.kill();
            _reverting = prevIsReverting;
            return this;
        };
        _proto.globalTime = function globalTime(rawTime) {
            var animation = this, time = arguments.length ? rawTime : animation.rawTime();
            while (animation) {
                time = animation._start + time / (animation._ts || 1);
                animation = animation._dp;
            }
            return !this.parent && this._sat ? this._sat.vars.immediateRender ? -1 : this._sat.globalTime(rawTime) : time;
        };
        _proto.repeat = function repeat(value) {
            if (arguments.length) {
                this._repeat = value === 1 / 0 ? -2 : value;
                return _onUpdateTotalDuration(this);
            }
            return this._repeat === -2 ? 1 / 0 : this._repeat;
        };
        _proto.repeatDelay = function repeatDelay(value) {
            if (arguments.length) {
                var time = this._time;
                this._rDelay = value;
                _onUpdateTotalDuration(this);
                return time ? this.time(time) : this;
            }
            return this._rDelay;
        };
        _proto.yoyo = function yoyo(value) {
            if (arguments.length) {
                this._yoyo = value;
                return this;
            }
            return this._yoyo;
        };
        _proto.seek = function seek(position, suppressEvents) {
            return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
        };
        _proto.restart = function restart(includeDelay, suppressEvents) {
            return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
        };
        _proto.play = function play(from, suppressEvents) {
            from != null && this.seek(from, suppressEvents);
            return this.reversed(false).paused(false);
        };
        _proto.reverse = function reverse(from, suppressEvents) {
            from != null && this.seek(from || this.totalDuration(), suppressEvents);
            return this.reversed(true).paused(false);
        };
        _proto.pause = function pause(atTime, suppressEvents) {
            atTime != null && this.seek(atTime, suppressEvents);
            return this.paused(true);
        };
        _proto.resume = function resume() {
            return this.paused(false);
        };
        _proto.reversed = function reversed(value) {
            if (arguments.length) {
                !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0));
                return this;
            }
            return this._rts < 0;
        };
        _proto.invalidate = function invalidate() {
            this._initted = this._act = 0;
            this._zTime = -_tinyNum;
            return this;
        };
        _proto.isActive = function isActive() {
            var rawTime, parent = this.parent || this._dp, start = this._start;
            return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
        };
        _proto.eventCallback = function eventCallback(type, callback, params) {
            var vars = this.vars;
            if (arguments.length > 1) {
                if (!callback) delete vars[type]; else {
                    vars[type] = callback;
                    params && (vars[type + "Params"] = params);
                    type === "onUpdate" && (this._onUpdate = callback);
                }
                return this;
            }
            return vars[type];
        };
        _proto.then = function then(onFulfilled) {
            var self = this;
            return new Promise((function(resolve) {
                var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough, _resolve = function _resolve() {
                    var _then = self.then;
                    self.then = null;
                    _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
                    resolve(f);
                    self.then = _then;
                };
                if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) _resolve(); else self._prom = _resolve;
            }));
        };
        _proto.kill = function kill() {
            _interrupt(this);
        };
        return Animation;
    }();
    _setDefaults(Animation.prototype, {
        _time: 0,
        _start: 0,
        _end: 0,
        _tTime: 0,
        _tDur: 0,
        _dirty: 0,
        _repeat: 0,
        _yoyo: false,
        parent: null,
        _initted: false,
        _rDelay: 0,
        _ts: 1,
        _dp: 0,
        ratio: 0,
        _zTime: -_tinyNum,
        _prom: 0,
        _ps: false,
        _rts: 1
    });
    var Timeline = function(_Animation) {
        _inheritsLoose(Timeline, _Animation);
        function Timeline(vars, position) {
            var _this;
            if (vars === void 0) vars = {};
            _this = _Animation.call(this, vars) || this;
            _this.labels = {};
            _this.smoothChildTiming = !!vars.smoothChildTiming;
            _this.autoRemoveChildren = !!vars.autoRemoveChildren;
            _this._sort = _isNotFalse(vars.sortChildren);
            _globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
            vars.reversed && _this.reverse();
            vars.paused && _this.paused(true);
            vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
            return _this;
        }
        var _proto2 = Timeline.prototype;
        _proto2.to = function to(targets, vars, position) {
            _createTweenType(0, arguments, this);
            return this;
        };
        _proto2.from = function from(targets, vars, position) {
            _createTweenType(1, arguments, this);
            return this;
        };
        _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
            _createTweenType(2, arguments, this);
            return this;
        };
        _proto2.set = function set(targets, vars, position) {
            vars.duration = 0;
            vars.parent = this;
            _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
            vars.immediateRender = !!vars.immediateRender;
            new Tween(targets, vars, _parsePosition(this, position), 1);
            return this;
        };
        _proto2.call = function call(callback, params, position) {
            return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
        };
        _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
            vars.duration = duration;
            vars.stagger = vars.stagger || stagger;
            vars.onComplete = onCompleteAll;
            vars.onCompleteParams = onCompleteAllParams;
            vars.parent = this;
            new Tween(targets, vars, _parsePosition(this, position));
            return this;
        };
        _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
            vars.runBackwards = 1;
            _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
            return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
        };
        _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
            toVars.startAt = fromVars;
            _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
            return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
        };
        _proto2.render = function render(totalTime, suppressEvents, force) {
            var time, child, next, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo, prevTime = this._time, tDur = this._dirty ? this.totalDuration() : this._tDur, dur = this._dur, tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime), crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur);
            this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);
            if (tTime !== this._tTime || force || crossingStart) {
                if (prevTime !== this._time && dur) {
                    tTime += this._time - prevTime;
                    totalTime += this._time - prevTime;
                }
                time = tTime;
                prevStart = this._start;
                timeScale = this._ts;
                prevPaused = !timeScale;
                if (crossingStart) {
                    dur || (prevTime = this._zTime);
                    (totalTime || !suppressEvents) && (this._zTime = totalTime);
                }
                if (this._repeat) {
                    yoyo = this._yoyo;
                    cycleDuration = dur + this._rDelay;
                    if (this._repeat < -1 && totalTime < 0) return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
                    time = _roundPrecise(tTime % cycleDuration);
                    if (tTime === tDur) {
                        iteration = this._repeat;
                        time = dur;
                    } else {
                        iteration = ~~(tTime / cycleDuration);
                        if (iteration && iteration === tTime / cycleDuration) {
                            time = dur;
                            iteration--;
                        }
                        time > dur && (time = dur);
                    }
                    prevIteration = _animationCycle(this._tTime, cycleDuration);
                    !prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration);
                    if (yoyo && iteration & 1) {
                        time = dur - time;
                        isYoyo = 1;
                    }
                    if (iteration !== prevIteration && !this._lock) {
                        var rewinding = yoyo && prevIteration & 1, doesWrap = rewinding === (yoyo && iteration & 1);
                        iteration < prevIteration && (rewinding = !rewinding);
                        prevTime = rewinding ? 0 : dur;
                        this._lock = 1;
                        this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
                        this._tTime = tTime;
                        !suppressEvents && this.parent && _callback(this, "onRepeat");
                        this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);
                        if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) return this;
                        dur = this._dur;
                        tDur = this._tDur;
                        if (doesWrap) {
                            this._lock = 2;
                            prevTime = rewinding ? dur : -1e-4;
                            this.render(prevTime, true);
                            this.vars.repeatRefresh && !isYoyo && this.invalidate();
                        }
                        this._lock = 0;
                        if (!this._ts && !prevPaused) return this;
                        _propagateYoyoEase(this, isYoyo);
                    }
                }
                if (this._hasPause && !this._forcing && this._lock < 2) {
                    pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));
                    if (pauseTween) tTime -= time - (time = pauseTween._start);
                }
                this._tTime = tTime;
                this._time = time;
                this._act = !timeScale;
                if (!this._initted) {
                    this._onUpdate = this.vars.onUpdate;
                    this._initted = 1;
                    this._zTime = totalTime;
                    prevTime = 0;
                }
                if (!prevTime && time && !suppressEvents && !iteration) {
                    _callback(this, "onStart");
                    if (this._tTime !== tTime) return this;
                }
                if (time >= prevTime && totalTime >= 0) {
                    child = this._first;
                    while (child) {
                        next = child._next;
                        if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
                            if (child.parent !== this) return this.render(totalTime, suppressEvents, force);
                            child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
                            if (time !== this._time || !this._ts && !prevPaused) {
                                pauseTween = 0;
                                next && (tTime += this._zTime = -_tinyNum);
                                break;
                            }
                        }
                        child = next;
                    }
                } else {
                    child = this._last;
                    var adjustedTime = totalTime < 0 ? totalTime : time;
                    while (child) {
                        next = child._prev;
                        if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
                            if (child.parent !== this) return this.render(totalTime, suppressEvents, force);
                            child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting && (child._initted || child._startAt));
                            if (time !== this._time || !this._ts && !prevPaused) {
                                pauseTween = 0;
                                next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
                                break;
                            }
                        }
                        child = next;
                    }
                }
                if (pauseTween && !suppressEvents) {
                    this.pause();
                    pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
                    if (this._ts) {
                        this._start = prevStart;
                        _setEnd(this);
                        return this.render(totalTime, suppressEvents, force);
                    }
                }
                this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
                if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!this._lock) {
                    (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
                    if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
                        _callback(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);
                        this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
                    }
                }
            }
            return this;
        };
        _proto2.add = function add(child, position) {
            var _this2 = this;
            _isNumber(position) || (position = _parsePosition(this, position, child));
            if (!(child instanceof Animation)) {
                if (_isArray(child)) {
                    child.forEach((function(obj) {
                        return _this2.add(obj, position);
                    }));
                    return this;
                }
                if (_isString(child)) return this.addLabel(child, position);
                if (_isFunction(child)) child = Tween.delayedCall(0, child); else return this;
            }
            return this !== child ? _addToTimeline(this, child, position) : this;
        };
        _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
            if (nested === void 0) nested = true;
            if (tweens === void 0) tweens = true;
            if (timelines === void 0) timelines = true;
            if (ignoreBeforeTime === void 0) ignoreBeforeTime = -_bigNum;
            var a = [], child = this._first;
            while (child) {
                if (child._start >= ignoreBeforeTime) if (child instanceof Tween) tweens && a.push(child); else {
                    timelines && a.push(child);
                    nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
                }
                child = child._next;
            }
            return a;
        };
        _proto2.getById = function getById(id) {
            var animations = this.getChildren(1, 1, 1), i = animations.length;
            while (i--) if (animations[i].vars.id === id) return animations[i];
        };
        _proto2.remove = function remove(child) {
            if (_isString(child)) return this.removeLabel(child);
            if (_isFunction(child)) return this.killTweensOf(child);
            _removeLinkedListItem(this, child);
            if (child === this._recent) this._recent = this._last;
            return _uncache(this);
        };
        _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
            if (!arguments.length) return this._tTime;
            this._forcing = 1;
            if (!this._dp && this._ts) this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
            _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
            this._forcing = 0;
            return this;
        };
        _proto2.addLabel = function addLabel(label, position) {
            this.labels[label] = _parsePosition(this, position);
            return this;
        };
        _proto2.removeLabel = function removeLabel(label) {
            delete this.labels[label];
            return this;
        };
        _proto2.addPause = function addPause(position, callback, params) {
            var t = Tween.delayedCall(0, callback || _emptyFunc, params);
            t.data = "isPause";
            this._hasPause = 1;
            return _addToTimeline(this, t, _parsePosition(this, position));
        };
        _proto2.removePause = function removePause(position) {
            var child = this._first;
            position = _parsePosition(this, position);
            while (child) {
                if (child._start === position && child.data === "isPause") _removeFromParent(child);
                child = child._next;
            }
        };
        _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
            var tweens = this.getTweensOf(targets, onlyActive), i = tweens.length;
            while (i--) _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
            return this;
        };
        _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
            var children, a = [], parsedTargets = toArray(targets), child = this._first, isGlobalTime = _isNumber(onlyActive);
            while (child) {
                if (child instanceof Tween) {
                    if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) a.push(child);
                } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) a.push.apply(a, children);
                child = child._next;
            }
            return a;
        };
        _proto2.tweenTo = function tweenTo(position, vars) {
            vars = vars || {};
            var initted, tl = this, endTime = _parsePosition(tl, position), _vars = vars, startAt = _vars.startAt, _onStart = _vars.onStart, onStartParams = _vars.onStartParams, immediateRender = _vars.immediateRender, tween = Tween.to(tl, _setDefaults({
                ease: vars.ease || "none",
                lazy: false,
                immediateRender: false,
                time: endTime,
                overwrite: "auto",
                duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
                onStart: function onStart() {
                    tl.pause();
                    if (!initted) {
                        var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
                        tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
                        initted = 1;
                    }
                    _onStart && _onStart.apply(tween, onStartParams || []);
                }
            }, vars));
            return immediateRender ? tween.render(0) : tween;
        };
        _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
            return this.tweenTo(toPosition, _setDefaults({
                startAt: {
                    time: _parsePosition(this, fromPosition)
                }
            }, vars));
        };
        _proto2.recent = function recent() {
            return this._recent;
        };
        _proto2.nextLabel = function nextLabel(afterTime) {
            if (afterTime === void 0) afterTime = this._time;
            return _getLabelInDirection(this, _parsePosition(this, afterTime));
        };
        _proto2.previousLabel = function previousLabel(beforeTime) {
            if (beforeTime === void 0) beforeTime = this._time;
            return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
        };
        _proto2.currentLabel = function currentLabel(value) {
            return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
        };
        _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
            if (ignoreBeforeTime === void 0) ignoreBeforeTime = 0;
            var p, child = this._first, labels = this.labels;
            while (child) {
                if (child._start >= ignoreBeforeTime) {
                    child._start += amount;
                    child._end += amount;
                }
                child = child._next;
            }
            if (adjustLabels) for (p in labels) if (labels[p] >= ignoreBeforeTime) labels[p] += amount;
            return _uncache(this);
        };
        _proto2.invalidate = function invalidate(soft) {
            var child = this._first;
            this._lock = 0;
            while (child) {
                child.invalidate(soft);
                child = child._next;
            }
            return _Animation.prototype.invalidate.call(this, soft);
        };
        _proto2.clear = function clear(includeLabels) {
            if (includeLabels === void 0) includeLabels = true;
            var next, child = this._first;
            while (child) {
                next = child._next;
                this.remove(child);
                child = next;
            }
            this._dp && (this._time = this._tTime = this._pTime = 0);
            includeLabels && (this.labels = {});
            return _uncache(this);
        };
        _proto2.totalDuration = function totalDuration(value) {
            var prev, start, parent, max = 0, self = this, child = self._last, prevStart = _bigNum;
            if (arguments.length) return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
            if (self._dirty) {
                parent = self.parent;
                while (child) {
                    prev = child._prev;
                    child._dirty && child.totalDuration();
                    start = child._start;
                    if (start > prevStart && self._sort && child._ts && !self._lock) {
                        self._lock = 1;
                        _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
                    } else prevStart = start;
                    if (start < 0 && child._ts) {
                        max -= start;
                        if (!parent && !self._dp || parent && parent.smoothChildTiming) {
                            self._start += start / self._ts;
                            self._time -= start;
                            self._tTime -= start;
                        }
                        self.shiftChildren(-start, false, -Infinity);
                        prevStart = 0;
                    }
                    child._end > max && child._ts && (max = child._end);
                    child = prev;
                }
                _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);
                self._dirty = 0;
            }
            return self._tDur;
        };
        Timeline.updateRoot = function updateRoot(time) {
            if (_globalTimeline._ts) {
                _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
                _lastRenderedFrame = _ticker.frame;
            }
            if (_ticker.frame >= _nextGCFrame) {
                _nextGCFrame += _config.autoSleep || 120;
                var child = _globalTimeline._first;
                if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
                    while (child && !child._ts) child = child._next;
                    child || _ticker.sleep();
                }
            }
        };
        return Timeline;
    }(Animation);
    _setDefaults(Timeline.prototype, {
        _lock: 0,
        _hasPause: 0,
        _forcing: 0
    });
    var _overwritingTween, _forceAllPropTweens, _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
        var result, startNums, color, endNum, chunk, startNum, hasRandom, a, pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter), index = 0, matchIndex = 0;
        pt.b = start;
        pt.e = end;
        start += "";
        end += "";
        if (hasRandom = ~end.indexOf("random(")) end = _replaceRandom(end);
        if (stringFilter) {
            a = [ start, end ];
            stringFilter(a, target, prop);
            start = a[0];
            end = a[1];
        }
        startNums = start.match(_complexStringNumExp) || [];
        while (result = _complexStringNumExp.exec(end)) {
            endNum = result[0];
            chunk = end.substring(index, result.index);
            if (color) color = (color + 1) % 5; else if (chunk.substr(-5) === "rgba(") color = 1;
            if (endNum !== startNums[matchIndex++]) {
                startNum = parseFloat(startNums[matchIndex - 1]) || 0;
                pt._pt = {
                    _next: pt._pt,
                    p: chunk || matchIndex === 1 ? chunk : ",",
                    s: startNum,
                    c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
                    m: color && color < 4 ? Math.round : 0
                };
                index = _complexStringNumExp.lastIndex;
            }
        }
        pt.c = index < end.length ? end.substring(index, end.length) : "";
        pt.fp = funcParam;
        if (_relExp.test(end) || hasRandom) pt.e = 0;
        this._pt = pt;
        return pt;
    }, _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam, optional) {
        _isFunction(end) && (end = end(index || 0, target, targets));
        var pt, currentValue = target[prop], parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](), setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc;
        if (_isString(end)) {
            if (~end.indexOf("random(")) end = _replaceRandom(end);
            if (end.charAt(1) === "=") {
                pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
                if (pt || pt === 0) end = pt;
            }
        }
        if (!optional || parsedStart !== end || _forceAllPropTweens) {
            if (!isNaN(parsedStart * end) && end !== "") {
                pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
                funcParam && (pt.fp = funcParam);
                modifier && pt.modifier(modifier, this, target);
                return this._pt = pt;
            }
            !currentValue && !(prop in target) && _missingPlugin(prop, end);
            return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
        }
    }, _processVars = function _processVars(vars, index, target, targets, tween) {
        _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));
        if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
        var p, copy = {};
        for (p in vars) copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
        return copy;
    }, _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
        var plugin, pt, ptLookup, i;
        if (_plugins[property] && (plugin = new _plugins[property]).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
            tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
            if (tween !== _quickTween) {
                ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
                i = plugin._props.length;
                while (i--) ptLookup[plugin._props[i]] = pt;
            }
        }
        return plugin;
    }, _initTween = function _initTween(tween, time, tTime) {
        var cleanVars, i, p, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index, harnessVars, overwritten, vars = tween.vars, ease = vars.ease, startAt = vars.startAt, immediateRender = vars.immediateRender, lazy = vars.lazy, onUpdate = vars.onUpdate, onUpdateParams = vars.onUpdateParams, callbackScope = vars.callbackScope, runBackwards = vars.runBackwards, yoyoEase = vars.yoyoEase, keyframes = vars.keyframes, autoRevert = vars.autoRevert, dur = tween._dur, prevStartAt = tween._startAt, targets = tween._targets, parent = tween.parent, fullTargets = parent && parent.data === "nested" ? parent.vars.targets : targets, autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites, tl = tween.timeline;
        tl && (!keyframes || !ease) && (ease = "none");
        tween._ease = _parseEase(ease, _defaults.ease);
        tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;
        if (yoyoEase && tween._yoyo && !tween._repeat) {
            yoyoEase = tween._yEase;
            tween._yEase = tween._ease;
            tween._ease = yoyoEase;
        }
        tween._from = !tl && !!vars.runBackwards;
        if (!tl || keyframes && !vars.stagger) {
            harness = targets[0] ? _getCache(targets[0]).harness : 0;
            harnessVars = harness && vars[harness.prop];
            cleanVars = _copyExcluding(vars, _reservedProps);
            if (prevStartAt) {
                prevStartAt._zTime < 0 && prevStartAt.progress(1);
                time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig);
                prevStartAt._lazy = 0;
            }
            if (startAt) {
                _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
                    data: "isStart",
                    overwrite: false,
                    parent,
                    immediateRender: true,
                    lazy: !prevStartAt && _isNotFalse(lazy),
                    startAt: null,
                    delay: 0,
                    onUpdate,
                    onUpdateParams,
                    callbackScope,
                    stagger: 0
                }, startAt)));
                tween._startAt._dp = 0;
                tween._startAt._sat = tween;
                time < 0 && (_reverting || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill);
                if (immediateRender) if (dur && time <= 0 && tTime <= 0) {
                    time && (tween._zTime = time);
                    return;
                }
            } else if (runBackwards && dur) if (!prevStartAt) {
                time && (immediateRender = false);
                p = _setDefaults({
                    overwrite: false,
                    data: "isFromStart",
                    lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
                    immediateRender,
                    stagger: 0,
                    parent
                }, cleanVars);
                harnessVars && (p[harness.prop] = harnessVars);
                _removeFromParent(tween._startAt = Tween.set(targets, p));
                tween._startAt._dp = 0;
                tween._startAt._sat = tween;
                time < 0 && (_reverting ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
                tween._zTime = time;
                if (!immediateRender) _initTween(tween._startAt, _tinyNum, _tinyNum); else if (!time) return;
            }
            tween._pt = tween._ptCache = 0;
            lazy = dur && _isNotFalse(lazy) || lazy && !dur;
            for (i = 0; i < targets.length; i++) {
                target = targets[i];
                gsData = target._gsap || _harness(targets)[i]._gsap;
                tween._ptLookup[i] = ptLookup = {};
                _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
                index = fullTargets === targets ? i : fullTargets.indexOf(target);
                if (harness && (plugin = new harness).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
                    tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
                    plugin._props.forEach((function(name) {
                        ptLookup[name] = pt;
                    }));
                    plugin.priority && (hasPriority = 1);
                }
                if (!harness || harnessVars) for (p in cleanVars) if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) plugin.priority && (hasPriority = 1); else ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
                tween._op && tween._op[i] && tween.kill(target, tween._op[i]);
                if (autoOverwrite && tween._pt) {
                    _overwritingTween = tween;
                    _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time));
                    overwritten = !tween.parent;
                    _overwritingTween = 0;
                }
                tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
            }
            hasPriority && _sortPropTweensByPriority(tween);
            tween._onInit && tween._onInit(tween);
        }
        tween._onUpdate = onUpdate;
        tween._initted = (!tween._op || tween._pt) && !overwritten;
        keyframes && time <= 0 && tl.render(_bigNum, true, true);
    }, _updatePropTweens = function _updatePropTweens(tween, property, value, start, startIsRelative, ratio, time) {
        var pt, rootPT, lookup, i, ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property];
        if (!ptCache) {
            ptCache = tween._ptCache[property] = [];
            lookup = tween._ptLookup;
            i = tween._targets.length;
            while (i--) {
                pt = lookup[i][property];
                if (pt && pt.d && pt.d._pt) {
                    pt = pt.d._pt;
                    while (pt && pt.p !== property && pt.fp !== property) pt = pt._next;
                }
                if (!pt) {
                    _forceAllPropTweens = 1;
                    tween.vars[property] = "+=0";
                    _initTween(tween, time);
                    _forceAllPropTweens = 0;
                    return 1;
                }
                ptCache.push(pt);
            }
        }
        i = ptCache.length;
        while (i--) {
            rootPT = ptCache[i];
            pt = rootPT._pt || rootPT;
            pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
            pt.c = value - pt.s;
            rootPT.e && (rootPT.e = _round(value) + getUnit(rootPT.e));
            rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b));
        }
    }, _addAliasesToVars = function _addAliasesToVars(targets, vars) {
        var copy, p, i, aliases, harness = targets[0] ? _getCache(targets[0]).harness : 0, propertyAliases = harness && harness.aliases;
        if (!propertyAliases) return vars;
        copy = _merge({}, vars);
        for (p in propertyAliases) if (p in copy) {
            aliases = propertyAliases[p].split(",");
            i = aliases.length;
            while (i--) copy[aliases[i]] = copy[p];
        }
        return copy;
    }, _parseKeyframe = function _parseKeyframe(prop, obj, allProps, easeEach) {
        var p, a, ease = obj.ease || easeEach || "power1.inOut";
        if (_isArray(obj)) {
            a = allProps[prop] || (allProps[prop] = []);
            obj.forEach((function(value, i) {
                return a.push({
                    t: i / (obj.length - 1) * 100,
                    v: value,
                    e: ease
                });
            }));
        } else for (p in obj) {
            a = allProps[p] || (allProps[p] = []);
            p === "ease" || a.push({
                t: parseFloat(prop),
                v: obj[p],
                e: ease
            });
        }
    }, _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
        return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
    }, _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", _staggerPropsToSkip = {};
    _forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", (function(name) {
        return _staggerPropsToSkip[name] = 1;
    }));
    var Tween = function(_Animation2) {
        _inheritsLoose(Tween, _Animation2);
        function Tween(targets, vars, position, skipInherit) {
            var _this3;
            if (typeof vars === "number") {
                position.duration = vars;
                vars = position;
                position = null;
            }
            _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
            var tl, i, copy, l, p, curTarget, staggerFunc, staggerVarsToMerge, _this3$vars = _this3.vars, duration = _this3$vars.duration, delay = _this3$vars.delay, immediateRender = _this3$vars.immediateRender, stagger = _this3$vars.stagger, overwrite = _this3$vars.overwrite, keyframes = _this3$vars.keyframes, defaults = _this3$vars.defaults, scrollTrigger = _this3$vars.scrollTrigger, yoyoEase = _this3$vars.yoyoEase, parent = vars.parent || _globalTimeline, parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [ targets ] : toArray(targets);
            _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [];
            _this3._ptLookup = [];
            _this3._overwrite = overwrite;
            if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
                vars = _this3.vars;
                tl = _this3.timeline = new Timeline({
                    data: "nested",
                    defaults: defaults || {},
                    targets: parent && parent.data === "nested" ? parent.vars.targets : parsedTargets
                });
                tl.kill();
                tl.parent = tl._dp = _assertThisInitialized(_this3);
                tl._start = 0;
                if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
                    l = parsedTargets.length;
                    staggerFunc = stagger && distribute(stagger);
                    if (_isObject(stagger)) for (p in stagger) if (~_staggerTweenProps.indexOf(p)) {
                        staggerVarsToMerge || (staggerVarsToMerge = {});
                        staggerVarsToMerge[p] = stagger[p];
                    }
                    for (i = 0; i < l; i++) {
                        copy = _copyExcluding(vars, _staggerPropsToSkip);
                        copy.stagger = 0;
                        yoyoEase && (copy.yoyoEase = yoyoEase);
                        staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
                        curTarget = parsedTargets[i];
                        copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
                        copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;
                        if (!stagger && l === 1 && copy.delay) {
                            _this3._delay = delay = copy.delay;
                            _this3._start += delay;
                            copy.delay = 0;
                        }
                        tl.to(curTarget, copy, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
                        tl._ease = _easeMap.none;
                    }
                    tl.duration() ? duration = delay = 0 : _this3.timeline = 0;
                } else if (keyframes) {
                    _inheritDefaults(_setDefaults(tl.vars.defaults, {
                        ease: "none"
                    }));
                    tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
                    var a, kf, v, time = 0;
                    if (_isArray(keyframes)) {
                        keyframes.forEach((function(frame) {
                            return tl.to(parsedTargets, frame, ">");
                        }));
                        tl.duration();
                    } else {
                        copy = {};
                        for (p in keyframes) p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
                        for (p in copy) {
                            a = copy[p].sort((function(a, b) {
                                return a.t - b.t;
                            }));
                            time = 0;
                            for (i = 0; i < a.length; i++) {
                                kf = a[i];
                                v = {
                                    ease: kf.e,
                                    duration: (kf.t - (i ? a[i - 1].t : 0)) / 100 * duration
                                };
                                v[p] = kf.v;
                                tl.to(parsedTargets, v, time);
                                time += v.duration;
                            }
                        }
                        tl.duration() < duration && tl.to({}, {
                            duration: duration - tl.duration()
                        });
                    }
                }
                duration || _this3.duration(duration = tl.duration());
            } else _this3.timeline = 0;
            if (overwrite === true && !_suppressOverwrites) {
                _overwritingTween = _assertThisInitialized(_this3);
                _globalTimeline.killTweensOf(parsedTargets);
                _overwritingTween = 0;
            }
            _addToTimeline(parent, _assertThisInitialized(_this3), position);
            vars.reversed && _this3.reverse();
            vars.paused && _this3.paused(true);
            if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
                _this3._tTime = -_tinyNum;
                _this3.render(Math.max(0, -delay) || 0);
            }
            scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
            return _this3;
        }
        var _proto3 = Tween.prototype;
        _proto3.render = function render(totalTime, suppressEvents, force) {
            var time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline, yoyoEase, prevTime = this._time, tDur = this._tDur, dur = this._dur, isNegative = totalTime < 0, tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime;
            if (!dur) _renderZeroDurationTween(this, totalTime, suppressEvents, force); else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative) {
                time = tTime;
                timeline = this.timeline;
                if (this._repeat) {
                    cycleDuration = dur + this._rDelay;
                    if (this._repeat < -1 && isNegative) return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
                    time = _roundPrecise(tTime % cycleDuration);
                    if (tTime === tDur) {
                        iteration = this._repeat;
                        time = dur;
                    } else {
                        iteration = ~~(tTime / cycleDuration);
                        if (iteration && iteration === tTime / cycleDuration) {
                            time = dur;
                            iteration--;
                        }
                        time > dur && (time = dur);
                    }
                    isYoyo = this._yoyo && iteration & 1;
                    if (isYoyo) {
                        yoyoEase = this._yEase;
                        time = dur - time;
                    }
                    prevIteration = _animationCycle(this._tTime, cycleDuration);
                    if (time === prevTime && !force && this._initted) {
                        this._tTime = tTime;
                        return this;
                    }
                    if (iteration !== prevIteration) {
                        timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo);
                        if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
                            this._lock = force = 1;
                            this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
                        }
                    }
                }
                if (!this._initted) {
                    if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
                        this._tTime = 0;
                        return this;
                    }
                    if (prevTime !== this._time) return this;
                    if (dur !== this._dur) return this.render(totalTime, suppressEvents, force);
                }
                this._tTime = tTime;
                this._time = time;
                if (!this._act && this._ts) {
                    this._act = 1;
                    this._lazy = 0;
                }
                this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
                if (this._from) this.ratio = ratio = 1 - ratio;
                if (time && !prevTime && !suppressEvents && !iteration) {
                    _callback(this, "onStart");
                    if (this._tTime !== tTime) return this;
                }
                pt = this._pt;
                while (pt) {
                    pt.r(ratio, pt.d);
                    pt = pt._next;
                }
                timeline && timeline.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline._dur * timeline._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);
                if (this._onUpdate && !suppressEvents) {
                    isNegative && _rewindStartAt(this, totalTime, suppressEvents, force);
                    _callback(this, "onUpdate");
                }
                this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");
                if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
                    isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
                    (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
                    if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
                        _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
                        this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
                    }
                }
            }
            return this;
        };
        _proto3.targets = function targets() {
            return this._targets;
        };
        _proto3.invalidate = function invalidate(soft) {
            (!soft || !this.vars.runBackwards) && (this._startAt = 0);
            this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
            this._ptLookup = [];
            this.timeline && this.timeline.invalidate(soft);
            return _Animation2.prototype.invalidate.call(this, soft);
        };
        _proto3.resetTo = function resetTo(property, value, start, startIsRelative) {
            _tickerActive || _ticker.wake();
            this._ts || this.play();
            var ratio, time = Math.min(this._dur, (this._dp._time - this._start) * this._ts);
            this._initted || _initTween(this, time);
            ratio = this._ease(time / this._dur);
            if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time)) return this.resetTo(property, value, start, startIsRelative);
            _alignPlayhead(this, 0);
            this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
            return this.render(0);
        };
        _proto3.kill = function kill(targets, vars) {
            if (vars === void 0) vars = "all";
            if (!targets && (!vars || vars === "all")) {
                this._lazy = this._pt = 0;
                return this.parent ? _interrupt(this) : this;
            }
            if (this.timeline) {
                var tDur = this.timeline.totalDuration();
                this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
                this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1);
                return this;
            }
            var overwrittenProps, curLookup, curOverwriteProps, props, p, pt, i, parsedTargets = this._targets, killingTargets = targets ? toArray(targets) : parsedTargets, propTweenLookup = this._ptLookup, firstPT = this._pt;
            if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
                vars === "all" && (this._pt = 0);
                return _interrupt(this);
            }
            overwrittenProps = this._op = this._op || [];
            if (vars !== "all") {
                if (_isString(vars)) {
                    p = {};
                    _forEachName(vars, (function(name) {
                        return p[name] = 1;
                    }));
                    vars = p;
                }
                vars = _addAliasesToVars(parsedTargets, vars);
            }
            i = parsedTargets.length;
            while (i--) if (~killingTargets.indexOf(parsedTargets[i])) {
                curLookup = propTweenLookup[i];
                if (vars === "all") {
                    overwrittenProps[i] = vars;
                    props = curLookup;
                    curOverwriteProps = {};
                } else {
                    curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
                    props = vars;
                }
                for (p in props) {
                    pt = curLookup && curLookup[p];
                    if (pt) {
                        if (!("kill" in pt.d) || pt.d.kill(p) === true) _removeLinkedListItem(this, pt, "_pt");
                        delete curLookup[p];
                    }
                    if (curOverwriteProps !== "all") curOverwriteProps[p] = 1;
                }
            }
            this._initted && !this._pt && firstPT && _interrupt(this);
            return this;
        };
        Tween.to = function to(targets, vars) {
            return new Tween(targets, vars, arguments[2]);
        };
        Tween.from = function from(targets, vars) {
            return _createTweenType(1, arguments);
        };
        Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
            return new Tween(callback, 0, {
                immediateRender: false,
                lazy: false,
                overwrite: false,
                delay,
                onComplete: callback,
                onReverseComplete: callback,
                onCompleteParams: params,
                onReverseCompleteParams: params,
                callbackScope: scope
            });
        };
        Tween.fromTo = function fromTo(targets, fromVars, toVars) {
            return _createTweenType(2, arguments);
        };
        Tween.set = function set(targets, vars) {
            vars.duration = 0;
            vars.repeatDelay || (vars.repeat = 0);
            return new Tween(targets, vars);
        };
        Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
            return _globalTimeline.killTweensOf(targets, props, onlyActive);
        };
        return Tween;
    }(Animation);
    _setDefaults(Tween.prototype, {
        _targets: [],
        _lazy: 0,
        _startAt: 0,
        _op: 0,
        _onInit: 0
    });
    _forEachName("staggerTo,staggerFrom,staggerFromTo", (function(name) {
        Tween[name] = function() {
            var tl = new Timeline, params = _slice.call(arguments, 0);
            params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
            return tl[name].apply(tl, params);
        };
    }));
    var _setterPlain = function _setterPlain(target, property, value) {
        return target[property] = value;
    }, _setterFunc = function _setterFunc(target, property, value) {
        return target[property](value);
    }, _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
        return target[property](data.fp, value);
    }, _setterAttribute = function _setterAttribute(target, property, value) {
        return target.setAttribute(property, value);
    }, _getSetter = function _getSetter(target, property) {
        return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
    }, _renderPlain = function _renderPlain(ratio, data) {
        return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e6) / 1e6, data);
    }, _renderBoolean = function _renderBoolean(ratio, data) {
        return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
    }, _renderComplexString = function _renderComplexString(ratio, data) {
        var pt = data._pt, s = "";
        if (!ratio && data.b) s = data.b; else if (ratio === 1 && data.e) s = data.e; else {
            while (pt) {
                s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 1e4) / 1e4) + s;
                pt = pt._next;
            }
            s += data.c;
        }
        data.set(data.t, data.p, s, data);
    }, _renderPropTweens = function _renderPropTweens(ratio, data) {
        var pt = data._pt;
        while (pt) {
            pt.r(ratio, pt.d);
            pt = pt._next;
        }
    }, _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
        var next, pt = this._pt;
        while (pt) {
            next = pt._next;
            pt.p === property && pt.modifier(modifier, tween, target);
            pt = next;
        }
    }, _killPropTweensOf = function _killPropTweensOf(property) {
        var hasNonDependentRemaining, next, pt = this._pt;
        while (pt) {
            next = pt._next;
            if (pt.p === property && !pt.op || pt.op === property) _removeLinkedListItem(this, pt, "_pt"); else if (!pt.dep) hasNonDependentRemaining = 1;
            pt = next;
        }
        return !hasNonDependentRemaining;
    }, _setterWithModifier = function _setterWithModifier(target, property, value, data) {
        data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
    }, _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
        var next, pt2, first, last, pt = parent._pt;
        while (pt) {
            next = pt._next;
            pt2 = first;
            while (pt2 && pt2.pr > pt.pr) pt2 = pt2._next;
            if (pt._prev = pt2 ? pt2._prev : last) pt._prev._next = pt; else first = pt;
            if (pt._next = pt2) pt2._prev = pt; else last = pt;
            pt = next;
        }
        parent._pt = first;
    };
    var PropTween = function() {
        function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
            this.t = target;
            this.s = start;
            this.c = change;
            this.p = prop;
            this.r = renderer || _renderPlain;
            this.d = data || this;
            this.set = setter || _setterPlain;
            this.pr = priority || 0;
            this._next = next;
            if (next) next._prev = this;
        }
        var _proto4 = PropTween.prototype;
        _proto4.modifier = function modifier(func, tween, target) {
            this.mSet = this.mSet || this.set;
            this.set = _setterWithModifier;
            this.m = func;
            this.mt = target;
            this.tween = tween;
        };
        return PropTween;
    }();
    _forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", (function(name) {
        return _reservedProps[name] = 1;
    }));
    _globals.TweenMax = _globals.TweenLite = Tween;
    _globals.TimelineLite = _globals.TimelineMax = Timeline;
    _globalTimeline = new Timeline({
        sortChildren: false,
        defaults: _defaults,
        autoRemoveChildren: true,
        id: "root",
        smoothChildTiming: true
    });
    _config.stringFilter = _colorStringFilter;
    var _media = [], _listeners = {}, _emptyArray = [], _lastMediaTime = 0, _contextID = 0, _dispatch = function _dispatch(type) {
        return (_listeners[type] || _emptyArray).map((function(f) {
            return f();
        }));
    }, _onMediaChange = function _onMediaChange() {
        var time = Date.now(), matches = [];
        if (time - _lastMediaTime > 2) {
            _dispatch("matchMediaInit");
            _media.forEach((function(c) {
                var match, p, anyMatch, toggled, queries = c.queries, conditions = c.conditions;
                for (p in queries) {
                    match = _win.matchMedia(queries[p]).matches;
                    match && (anyMatch = 1);
                    if (match !== conditions[p]) {
                        conditions[p] = match;
                        toggled = 1;
                    }
                }
                if (toggled) {
                    c.revert();
                    anyMatch && matches.push(c);
                }
            }));
            _dispatch("matchMediaRevert");
            matches.forEach((function(c) {
                return c.onMatch(c);
            }));
            _lastMediaTime = time;
            _dispatch("matchMedia");
        }
    };
    var Context = function() {
        function Context(func, scope) {
            this.selector = scope && selector(scope);
            this.data = [];
            this._r = [];
            this.isReverted = false;
            this.id = _contextID++;
            func && this.add(func);
        }
        var _proto5 = Context.prototype;
        _proto5.add = function add(name, func, scope) {
            if (_isFunction(name)) {
                scope = func;
                func = name;
                name = _isFunction;
            }
            var self = this, f = function f() {
                var result, prev = _context, prevSelector = self.selector;
                prev && prev !== self && prev.data.push(self);
                scope && (self.selector = selector(scope));
                _context = self;
                result = func.apply(self, arguments);
                _isFunction(result) && self._r.push(result);
                _context = prev;
                self.selector = prevSelector;
                self.isReverted = false;
                return result;
            };
            self.last = f;
            return name === _isFunction ? f(self) : name ? self[name] = f : f;
        };
        _proto5.ignore = function ignore(func) {
            var prev = _context;
            _context = null;
            func(this);
            _context = prev;
        };
        _proto5.getTweens = function getTweens() {
            var a = [];
            this.data.forEach((function(e) {
                return e instanceof Context ? a.push.apply(a, e.getTweens()) : e instanceof Tween && !(e.parent && e.parent.data === "nested") && a.push(e);
            }));
            return a;
        };
        _proto5.clear = function clear() {
            this._r.length = this.data.length = 0;
        };
        _proto5.kill = function kill(revert, matchMedia) {
            var _this4 = this;
            if (revert) {
                var tweens = this.getTweens();
                this.data.forEach((function(t) {
                    if (t.data === "isFlip") {
                        t.revert();
                        t.getChildren(true, true, false).forEach((function(tween) {
                            return tweens.splice(tweens.indexOf(tween), 1);
                        }));
                    }
                }));
                tweens.map((function(t) {
                    return {
                        g: t.globalTime(0),
                        t
                    };
                })).sort((function(a, b) {
                    return b.g - a.g || -1;
                })).forEach((function(o) {
                    return o.t.revert(revert);
                }));
                this.data.forEach((function(e) {
                    return e instanceof Timeline ? e.data !== "nested" && e.kill() : !(e instanceof Tween) && e.revert && e.revert(revert);
                }));
                this._r.forEach((function(f) {
                    return f(revert, _this4);
                }));
                this.isReverted = true;
            } else this.data.forEach((function(e) {
                return e.kill && e.kill();
            }));
            this.clear();
            if (matchMedia) {
                var i = _media.length;
                while (i--) _media[i].id === this.id && _media.splice(i, 1);
            }
        };
        _proto5.revert = function revert(config) {
            this.kill(config || {});
        };
        return Context;
    }();
    var MatchMedia = function() {
        function MatchMedia(scope) {
            this.contexts = [];
            this.scope = scope;
        }
        var _proto6 = MatchMedia.prototype;
        _proto6.add = function add(conditions, func, scope) {
            _isObject(conditions) || (conditions = {
                matches: conditions
            });
            var mq, p, active, context = new Context(0, scope || this.scope), cond = context.conditions = {};
            _context && !context.selector && (context.selector = _context.selector);
            this.contexts.push(context);
            func = context.add("onMatch", func);
            context.queries = conditions;
            for (p in conditions) if (p === "all") active = 1; else {
                mq = _win.matchMedia(conditions[p]);
                if (mq) {
                    _media.indexOf(context) < 0 && _media.push(context);
                    (cond[p] = mq.matches) && (active = 1);
                    mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
                }
            }
            active && func(context);
            return this;
        };
        _proto6.revert = function revert(config) {
            this.kill(config || {});
        };
        _proto6.kill = function kill(revert) {
            this.contexts.forEach((function(c) {
                return c.kill(revert, true);
            }));
        };
        return MatchMedia;
    }();
    var _gsap = {
        registerPlugin: function registerPlugin() {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
            args.forEach((function(config) {
                return _createPlugin(config);
            }));
        },
        timeline: function timeline(vars) {
            return new Timeline(vars);
        },
        getTweensOf: function getTweensOf(targets, onlyActive) {
            return _globalTimeline.getTweensOf(targets, onlyActive);
        },
        getProperty: function getProperty(target, property, unit, uncache) {
            _isString(target) && (target = toArray(target)[0]);
            var getter = _getCache(target || {}).get, format = unit ? _passThrough : _numericIfPossible;
            unit === "native" && (unit = "");
            return !target ? target : !property ? function(property, unit, uncache) {
                return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
            } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
        },
        quickSetter: function quickSetter(target, property, unit) {
            target = toArray(target);
            if (target.length > 1) {
                var setters = target.map((function(t) {
                    return gsap.quickSetter(t, property, unit);
                })), l = setters.length;
                return function(value) {
                    var i = l;
                    while (i--) setters[i](value);
                };
            }
            target = target[0] || {};
            var Plugin = _plugins[property], cache = _getCache(target), p = cache.harness && (cache.harness.aliases || {})[property] || property, setter = Plugin ? function(value) {
                var p = new Plugin;
                _quickTween._pt = 0;
                p.init(target, unit ? value + unit : value, _quickTween, 0, [ target ]);
                p.render(1, p);
                _quickTween._pt && _renderPropTweens(1, _quickTween);
            } : cache.set(target, p);
            return Plugin ? setter : function(value) {
                return setter(target, p, unit ? value + unit : value, cache, 1);
            };
        },
        quickTo: function quickTo(target, property, vars) {
            var _merge2;
            var tween = gsap.to(target, _merge((_merge2 = {}, _merge2[property] = "+=0.1", _merge2.paused = true, 
            _merge2), vars || {})), func = function func(value, start, startIsRelative) {
                return tween.resetTo(property, value, start, startIsRelative);
            };
            func.tween = tween;
            return func;
        },
        isTweening: function isTweening(targets) {
            return _globalTimeline.getTweensOf(targets, true).length > 0;
        },
        defaults: function defaults(value) {
            value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
            return _mergeDeep(_defaults, value || {});
        },
        config: function config(value) {
            return _mergeDeep(_config, value || {});
        },
        registerEffect: function registerEffect(_ref3) {
            var name = _ref3.name, effect = _ref3.effect, plugins = _ref3.plugins, defaults = _ref3.defaults, extendTimeline = _ref3.extendTimeline;
            (plugins || "").split(",").forEach((function(pluginName) {
                return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
            }));
            _effects[name] = function(targets, vars, tl) {
                return effect(toArray(targets), _setDefaults(vars || {}, defaults), tl);
            };
            if (extendTimeline) Timeline.prototype[name] = function(targets, vars, position) {
                return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
            };
        },
        registerEase: function registerEase(name, ease) {
            _easeMap[name] = _parseEase(ease);
        },
        parseEase: function parseEase(ease, defaultEase) {
            return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
        },
        getById: function getById(id) {
            return _globalTimeline.getById(id);
        },
        exportRoot: function exportRoot(vars, includeDelayedCalls) {
            if (vars === void 0) vars = {};
            var child, next, tl = new Timeline(vars);
            tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
            _globalTimeline.remove(tl);
            tl._dp = 0;
            tl._time = tl._tTime = _globalTimeline._time;
            child = _globalTimeline._first;
            while (child) {
                next = child._next;
                if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) _addToTimeline(tl, child, child._start - child._delay);
                child = next;
            }
            _addToTimeline(_globalTimeline, tl, 0);
            return tl;
        },
        context: function context(func, scope) {
            return func ? new Context(func, scope) : _context;
        },
        matchMedia: function matchMedia(scope) {
            return new MatchMedia(scope);
        },
        matchMediaRefresh: function matchMediaRefresh() {
            return _media.forEach((function(c) {
                var found, p, cond = c.conditions;
                for (p in cond) if (cond[p]) {
                    cond[p] = false;
                    found = 1;
                }
                found && c.revert();
            })) || _onMediaChange();
        },
        addEventListener: function addEventListener(type, callback) {
            var a = _listeners[type] || (_listeners[type] = []);
            ~a.indexOf(callback) || a.push(callback);
        },
        removeEventListener: function removeEventListener(type, callback) {
            var a = _listeners[type], i = a && a.indexOf(callback);
            i >= 0 && a.splice(i, 1);
        },
        utils: {
            wrap,
            wrapYoyo,
            distribute,
            random,
            snap,
            normalize,
            getUnit,
            clamp,
            splitColor,
            toArray,
            selector,
            mapRange,
            pipe,
            unitize,
            interpolate,
            shuffle
        },
        install: _install,
        effects: _effects,
        ticker: _ticker,
        updateRoot: Timeline.updateRoot,
        plugins: _plugins,
        globalTimeline: _globalTimeline,
        core: {
            PropTween,
            globals: _addGlobal,
            Tween,
            Timeline,
            Animation,
            getCache: _getCache,
            _removeLinkedListItem,
            reverting: function reverting() {
                return _reverting;
            },
            context: function context(toAdd) {
                if (toAdd && _context) {
                    _context.data.push(toAdd);
                    toAdd._ctx = _context;
                }
                return _context;
            },
            suppressOverwrites: function suppressOverwrites(value) {
                return _suppressOverwrites = value;
            }
        }
    };
    _forEachName("to,from,fromTo,delayedCall,set,killTweensOf", (function(name) {
        return _gsap[name] = Tween[name];
    }));
    _ticker.add(Timeline.updateRoot);
    _quickTween = _gsap.to({}, {
        duration: 0
    });
    var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
        var pt = plugin._pt;
        while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) pt = pt._next;
        return pt;
    }, _addModifiers = function _addModifiers(tween, modifiers) {
        var p, i, pt, targets = tween._targets;
        for (p in modifiers) {
            i = targets.length;
            while (i--) {
                pt = tween._ptLookup[i][p];
                if (pt && (pt = pt.d)) {
                    if (pt._pt) pt = _getPluginPropTween(pt, p);
                    pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
                }
            }
        }
    }, _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
        return {
            name,
            rawVars: 1,
            init: function init(target, vars, tween) {
                tween._onInit = function(tween) {
                    var temp, p;
                    if (_isString(vars)) {
                        temp = {};
                        _forEachName(vars, (function(name) {
                            return temp[name] = 1;
                        }));
                        vars = temp;
                    }
                    if (modifier) {
                        temp = {};
                        for (p in vars) temp[p] = modifier(vars[p]);
                        vars = temp;
                    }
                    _addModifiers(tween, vars);
                };
            }
        };
    };
    var gsap = _gsap.registerPlugin({
        name: "attr",
        init: function init(target, vars, tween, index, targets) {
            var p, pt, v;
            this.tween = tween;
            for (p in vars) {
                v = target.getAttribute(p) || "";
                pt = this.add(target, "setAttribute", (v || 0) + "", vars[p], index, targets, 0, 0, p);
                pt.op = p;
                pt.b = v;
                this._props.push(p);
            }
        },
        render: function render(ratio, data) {
            var pt = data._pt;
            while (pt) {
                _reverting ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d);
                pt = pt._next;
            }
        }
    }, {
        name: "endArray",
        init: function init(target, value) {
            var i = value.length;
            while (i--) this.add(target, i, target[i] || 0, value[i], 0, 0, 0, 0, 0, 1);
        }
    }, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
    Tween.version = Timeline.version = gsap.version = "3.12.1";
    _coreReady = 1;
    _windowExists() && _wake();
    _easeMap.Power0, _easeMap.Power1, _easeMap.Power2, _easeMap.Power3, _easeMap.Power4, 
    _easeMap.Linear, _easeMap.Quad, _easeMap.Cubic, _easeMap.Quart, _easeMap.Quint, 
    _easeMap.Strong, _easeMap.Elastic, _easeMap.Back, _easeMap.SteppedEase, _easeMap.Bounce, 
    _easeMap.Sine, _easeMap.Expo, _easeMap.Circ;
    /*!
 * CSSPlugin 3.12.1
 * https://greensock.com
 *
 * Copyright 2008-2023, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
    var CSSPlugin_win, CSSPlugin_doc, _docElement, _pluginInitted, _tempDiv, _recentSetterPlugin, CSSPlugin_reverting, _supports3D, CSSPlugin_windowExists = function _windowExists() {
        return typeof window !== "undefined";
    }, _transformProps = {}, _RAD2DEG = 180 / Math.PI, _DEG2RAD = Math.PI / 180, _atan2 = Math.atan2, CSSPlugin_bigNum = 1e8, _capsExp = /([A-Z])/g, _horizontalExp = /(left|right|width|margin|padding|x)/i, _complexExp = /[\s,\(]\S/, _propertyAliases = {
        autoAlpha: "opacity,visibility",
        scale: "scaleX,scaleY",
        alpha: "opacity"
    }, _renderCSSProp = function _renderCSSProp(ratio, data) {
        return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
    }, _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
        return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
    }, _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
        return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
    }, _renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
        var value = data.s + data.c * ratio;
        data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
    }, _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
        return data.set(data.t, data.p, ratio ? data.e : data.b, data);
    }, _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
        return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
    }, _setterCSSStyle = function _setterCSSStyle(target, property, value) {
        return target.style[property] = value;
    }, _setterCSSProp = function _setterCSSProp(target, property, value) {
        return target.style.setProperty(property, value);
    }, _setterTransform = function _setterTransform(target, property, value) {
        return target._gsap[property] = value;
    }, _setterScale = function _setterScale(target, property, value) {
        return target._gsap.scaleX = target._gsap.scaleY = value;
    }, _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
        var cache = target._gsap;
        cache.scaleX = cache.scaleY = value;
        cache.renderTransform(ratio, cache);
    }, _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
        var cache = target._gsap;
        cache[property] = value;
        cache.renderTransform(ratio, cache);
    }, _transformProp = "transform", _transformOriginProp = _transformProp + "Origin", _saveStyle = function _saveStyle(property, isNotCSS) {
        var _this = this;
        var target = this.target, style = target.style;
        if (property in _transformProps && style) {
            this.tfm = this.tfm || {};
            if (property !== "transform") {
                property = _propertyAliases[property] || property;
                ~property.indexOf(",") ? property.split(",").forEach((function(a) {
                    return _this.tfm[a] = _get(target, a);
                })) : this.tfm[property] = target._gsap.x ? target._gsap[property] : _get(target, property);
            } else return _propertyAliases.transform.split(",").forEach((function(p) {
                return _saveStyle.call(_this, p, isNotCSS);
            }));
            if (this.props.indexOf(_transformProp) >= 0) return;
            if (target._gsap.svg) {
                this.svgo = target.getAttribute("data-svg-origin");
                this.props.push(_transformOriginProp, isNotCSS, "");
            }
            property = _transformProp;
        }
        (style || isNotCSS) && this.props.push(property, isNotCSS, style[property]);
    }, _removeIndependentTransforms = function _removeIndependentTransforms(style) {
        if (style.translate) {
            style.removeProperty("translate");
            style.removeProperty("scale");
            style.removeProperty("rotate");
        }
    }, _revertStyle = function _revertStyle() {
        var i, p, props = this.props, target = this.target, style = target.style, cache = target._gsap;
        for (i = 0; i < props.length; i += 3) props[i + 1] ? target[props[i]] = props[i + 2] : props[i + 2] ? style[props[i]] = props[i + 2] : style.removeProperty(props[i].substr(0, 2) === "--" ? props[i] : props[i].replace(_capsExp, "-$1").toLowerCase());
        if (this.tfm) {
            for (p in this.tfm) cache[p] = this.tfm[p];
            if (cache.svg) {
                cache.renderTransform();
                target.setAttribute("data-svg-origin", this.svgo || "");
            }
            i = CSSPlugin_reverting();
            if ((!i || !i.isStart) && !style[_transformProp]) {
                _removeIndependentTransforms(style);
                cache.uncache = 1;
            }
        }
    }, _getStyleSaver = function _getStyleSaver(target, properties) {
        var saver = {
            target,
            props: [],
            revert: _revertStyle,
            save: _saveStyle
        };
        target._gsap || gsap.core.getCache(target);
        properties && properties.split(",").forEach((function(p) {
            return saver.save(p);
        }));
        return saver;
    }, _createElement = function _createElement(type, ns) {
        var e = CSSPlugin_doc.createElementNS ? CSSPlugin_doc.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : CSSPlugin_doc.createElement(type);
        return e.style ? e : CSSPlugin_doc.createElement(type);
    }, _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
        var cs = getComputedStyle(target);
        return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || "";
    }, _prefixes = "O,Moz,ms,Ms,Webkit".split(","), _checkPropPrefix = function _checkPropPrefix(property, element, preferPrefix) {
        var e = element || _tempDiv, s = e.style, i = 5;
        if (property in s && !preferPrefix) return property;
        property = property.charAt(0).toUpperCase() + property.substr(1);
        while (i-- && !(_prefixes[i] + property in s)) ;
        return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
    }, _initCore = function _initCore() {
        if (CSSPlugin_windowExists() && window.document) {
            CSSPlugin_win = window;
            CSSPlugin_doc = CSSPlugin_win.document;
            _docElement = CSSPlugin_doc.documentElement;
            _tempDiv = _createElement("div") || {
                style: {}
            };
            _createElement("div");
            _transformProp = _checkPropPrefix(_transformProp);
            _transformOriginProp = _transformProp + "Origin";
            _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
            _supports3D = !!_checkPropPrefix("perspective");
            CSSPlugin_reverting = gsap.core.reverting;
            _pluginInitted = 1;
        }
    }, _getBBoxHack = function _getBBoxHack(swapIfPossible) {
        var bbox, svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), oldParent = this.parentNode, oldSibling = this.nextSibling, oldCSS = this.style.cssText;
        _docElement.appendChild(svg);
        svg.appendChild(this);
        this.style.display = "block";
        if (swapIfPossible) try {
            bbox = this.getBBox();
            this._gsapBBox = this.getBBox;
            this.getBBox = _getBBoxHack;
        } catch (e) {} else if (this._gsapBBox) bbox = this._gsapBBox();
        if (oldParent) if (oldSibling) oldParent.insertBefore(this, oldSibling); else oldParent.appendChild(this);
        _docElement.removeChild(svg);
        this.style.cssText = oldCSS;
        return bbox;
    }, _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
        var i = attributesArray.length;
        while (i--) if (target.hasAttribute(attributesArray[i])) return target.getAttribute(attributesArray[i]);
    }, _getBBox = function _getBBox(target) {
        var bounds;
        try {
            bounds = target.getBBox();
        } catch (error) {
            bounds = _getBBoxHack.call(target, true);
        }
        bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true));
        return bounds && !bounds.width && !bounds.x && !bounds.y ? {
            x: +_getAttributeFallbacks(target, [ "x", "cx", "x1" ]) || 0,
            y: +_getAttributeFallbacks(target, [ "y", "cy", "y1" ]) || 0,
            width: 0,
            height: 0
        } : bounds;
    }, _isSVG = function _isSVG(e) {
        return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
    }, _removeProperty = function _removeProperty(target, property) {
        if (property) {
            var style = target.style;
            if (property in _transformProps && property !== _transformOriginProp) property = _transformProp;
            if (style.removeProperty) {
                if (property.substr(0, 2) === "ms" || property.substr(0, 6) === "webkit") property = "-" + property;
                style.removeProperty(property.replace(_capsExp, "-$1").toLowerCase());
            } else style.removeAttribute(property);
        }
    }, _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
        var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
        plugin._pt = pt;
        pt.b = beginning;
        pt.e = end;
        plugin._props.push(property);
        return pt;
    }, _nonConvertibleUnits = {
        deg: 1,
        rad: 1,
        turn: 1
    }, _nonStandardLayouts = {
        grid: 1,
        flex: 1
    }, _convertToUnit = function _convertToUnit(target, property, value, unit) {
        var px, parent, cache, isSVG, curValue = parseFloat(value) || 0, curUnit = (value + "").trim().substr((curValue + "").length) || "px", style = _tempDiv.style, horizontal = _horizontalExp.test(property), isRootSVG = target.tagName.toLowerCase() === "svg", measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"), amount = 100, toPixels = unit === "px", toPercent = unit === "%";
        if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) return curValue;
        curUnit !== "px" && !toPixels && (curValue = _convertToUnit(target, property, value, "px"));
        isSVG = target.getCTM && _isSVG(target);
        if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
            px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
            return _round(toPercent ? curValue / px * amount : curValue / 100 * px);
        }
        style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
        parent = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
        if (isSVG) parent = (target.ownerSVGElement || {}).parentNode;
        if (!parent || parent === CSSPlugin_doc || !parent.appendChild) parent = CSSPlugin_doc.body;
        cache = parent._gsap;
        if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time && !cache.uncache) return _round(curValue / cache.width * amount); else {
            (toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent, "display")] && (style.position = _getComputedProperty(target, "position"));
            parent === target && (style.position = "static");
            parent.appendChild(_tempDiv);
            px = _tempDiv[measureProperty];
            parent.removeChild(_tempDiv);
            style.position = "absolute";
            if (horizontal && toPercent) {
                cache = _getCache(parent);
                cache.time = _ticker.time;
                cache.width = parent[measureProperty];
            }
        }
        return _round(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
    }, _get = function _get(target, property, unit, uncache) {
        var value;
        _pluginInitted || _initCore();
        if (property in _propertyAliases && property !== "transform") {
            property = _propertyAliases[property];
            if (~property.indexOf(",")) property = property.split(",")[0];
        }
        if (_transformProps[property] && property !== "transform") {
            value = _parseTransform(target, uncache);
            value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
        } else {
            value = target.style[property];
            if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
        }
        return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
    }, _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
        if (!start || start === "none") {
            var p = _checkPropPrefix(prop, target, 1), s = p && _getComputedProperty(target, p, 1);
            if (s && s !== start) {
                prop = p;
                start = s;
            } else if (prop === "borderColor") start = _getComputedProperty(target, "borderTopColor");
        }
        var a, result, startValues, startNum, color, startValue, endValue, endNum, chunk, endUnit, startUnit, endValues, pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString), index = 0, matchIndex = 0;
        pt.b = start;
        pt.e = end;
        start += "";
        end += "";
        if (end === "auto") {
            target.style[prop] = end;
            end = _getComputedProperty(target, prop) || end;
            target.style[prop] = start;
        }
        a = [ start, end ];
        _colorStringFilter(a);
        start = a[0];
        end = a[1];
        startValues = start.match(_numWithUnitExp) || [];
        endValues = end.match(_numWithUnitExp) || [];
        if (endValues.length) {
            while (result = _numWithUnitExp.exec(end)) {
                endValue = result[0];
                chunk = end.substring(index, result.index);
                if (color) color = (color + 1) % 5; else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") color = 1;
                if (endValue !== (startValue = startValues[matchIndex++] || "")) {
                    startNum = parseFloat(startValue) || 0;
                    startUnit = startValue.substr((startNum + "").length);
                    endValue.charAt(1) === "=" && (endValue = _parseRelative(startNum, endValue) + startUnit);
                    endNum = parseFloat(endValue);
                    endUnit = endValue.substr((endNum + "").length);
                    index = _numWithUnitExp.lastIndex - endUnit.length;
                    if (!endUnit) {
                        endUnit = endUnit || _config.units[prop] || startUnit;
                        if (index === end.length) {
                            end += endUnit;
                            pt.e += endUnit;
                        }
                    }
                    if (startUnit !== endUnit) startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
                    pt._pt = {
                        _next: pt._pt,
                        p: chunk || matchIndex === 1 ? chunk : ",",
                        s: startNum,
                        c: endNum - startNum,
                        m: color && color < 4 || prop === "zIndex" ? Math.round : 0
                    };
                }
            }
            pt.c = index < end.length ? end.substring(index, end.length) : "";
        } else pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
        _relExp.test(end) && (pt.e = 0);
        this._pt = pt;
        return pt;
    }, _keywordToPercent = {
        top: "0%",
        bottom: "100%",
        left: "0%",
        right: "100%",
        center: "50%"
    }, _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
        var split = value.split(" "), x = split[0], y = split[1] || "50%";
        if (x === "top" || x === "bottom" || y === "left" || y === "right") {
            value = x;
            x = y;
            y = value;
        }
        split[0] = _keywordToPercent[x] || x;
        split[1] = _keywordToPercent[y] || y;
        return split.join(" ");
    }, _renderClearProps = function _renderClearProps(ratio, data) {
        if (data.tween && data.tween._time === data.tween._dur) {
            var prop, clearTransforms, i, target = data.t, style = target.style, props = data.u, cache = target._gsap;
            if (props === "all" || props === true) {
                style.cssText = "";
                clearTransforms = 1;
            } else {
                props = props.split(",");
                i = props.length;
                while (--i > -1) {
                    prop = props[i];
                    if (_transformProps[prop]) {
                        clearTransforms = 1;
                        prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
                    }
                    _removeProperty(target, prop);
                }
            }
            if (clearTransforms) {
                _removeProperty(target, _transformProp);
                if (cache) {
                    cache.svg && target.removeAttribute("transform");
                    _parseTransform(target, 1);
                    cache.uncache = 1;
                    _removeIndependentTransforms(style);
                }
            }
        }
    }, _specialProps = {
        clearProps: function clearProps(plugin, target, property, endValue, tween) {
            if (tween.data !== "isFromStart") {
                var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
                pt.u = endValue;
                pt.pr = -10;
                pt.tween = tween;
                plugin._props.push(property);
                return 1;
            }
        }
    }, _identity2DMatrix = [ 1, 0, 0, 1, 0, 0 ], _rotationalProperties = {}, _isNullTransform = function _isNullTransform(value) {
        return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
    }, _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
        var matrixString = _getComputedProperty(target, _transformProp);
        return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round);
    }, _getMatrix = function _getMatrix(target, force2D) {
        var parent, nextSibling, temp, addedToDOM, cache = target._gsap || _getCache(target), style = target.style, matrix = _getComputedTransformMatrixAsArray(target);
        if (cache.svg && target.getAttribute("transform")) {
            temp = target.transform.baseVal.consolidate().matrix;
            matrix = [ temp.a, temp.b, temp.c, temp.d, temp.e, temp.f ];
            return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
        } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
            temp = style.display;
            style.display = "block";
            parent = target.parentNode;
            if (!parent || !target.offsetParent) {
                addedToDOM = 1;
                nextSibling = target.nextElementSibling;
                _docElement.appendChild(target);
            }
            matrix = _getComputedTransformMatrixAsArray(target);
            temp ? style.display = temp : _removeProperty(target, "display");
            if (addedToDOM) nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
        }
        return force2D && matrix.length > 6 ? [ matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13] ] : matrix;
    }, _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
        var bounds, determinant, x, y, cache = target._gsap, matrix = matrixArray || _getMatrix(target, true), xOriginOld = cache.xOrigin || 0, yOriginOld = cache.yOrigin || 0, xOffsetOld = cache.xOffset || 0, yOffsetOld = cache.yOffset || 0, a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3], tx = matrix[4], ty = matrix[5], originSplit = origin.split(" "), xOrigin = parseFloat(originSplit[0]) || 0, yOrigin = parseFloat(originSplit[1]) || 0;
        if (!originIsAbsolute) {
            bounds = _getBBox(target);
            xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
            yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
        } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
            x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
            y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
            xOrigin = x;
            yOrigin = y;
        }
        if (smooth || smooth !== false && cache.smooth) {
            tx = xOrigin - xOriginOld;
            ty = yOrigin - yOriginOld;
            cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
            cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
        } else cache.xOffset = cache.yOffset = 0;
        cache.xOrigin = xOrigin;
        cache.yOrigin = yOrigin;
        cache.smooth = !!smooth;
        cache.origin = origin;
        cache.originIsAbsolute = !!originIsAbsolute;
        target.style[_transformOriginProp] = "0px 0px";
        if (pluginToAddPropTweensTo) {
            _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);
            _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);
            _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);
            _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
        }
        target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
    }, _parseTransform = function _parseTransform(target, uncache) {
        var cache = target._gsap || new GSCache(target);
        if ("x" in cache && !uncache && !cache.uncache) return cache;
        var x, y, z, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY, perspective, xOrigin, yOrigin, matrix, angle, cos, sin, a, b, c, d, a12, a22, t1, t2, t3, a13, a23, a33, a42, a43, a32, style = target.style, invertedScaleX = cache.scaleX < 0, px = "px", deg = "deg", cs = getComputedStyle(target), origin = _getComputedProperty(target, _transformOriginProp) || "0";
        x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
        scaleX = scaleY = 1;
        cache.svg = !!(target.getCTM && _isSVG(target));
        if (cs.translate) {
            if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") style[_transformProp] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp] !== "none" ? cs[_transformProp] : "");
            style.scale = style.rotate = style.translate = "none";
        }
        matrix = _getMatrix(target, cache.svg);
        if (cache.svg) {
            if (cache.uncache) {
                t2 = target.getBBox();
                origin = cache.xOrigin - t2.x + "px " + (cache.yOrigin - t2.y) + "px";
                t1 = "";
            } else t1 = !uncache && target.getAttribute("data-svg-origin");
            _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
        }
        xOrigin = cache.xOrigin || 0;
        yOrigin = cache.yOrigin || 0;
        if (matrix !== _identity2DMatrix) {
            a = matrix[0];
            b = matrix[1];
            c = matrix[2];
            d = matrix[3];
            x = a12 = matrix[4];
            y = a22 = matrix[5];
            if (matrix.length === 6) {
                scaleX = Math.sqrt(a * a + b * b);
                scaleY = Math.sqrt(d * d + c * c);
                rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0;
                skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
                skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));
                if (cache.svg) {
                    x -= xOrigin - (xOrigin * a + yOrigin * c);
                    y -= yOrigin - (xOrigin * b + yOrigin * d);
                }
            } else {
                a32 = matrix[6];
                a42 = matrix[7];
                a13 = matrix[8];
                a23 = matrix[9];
                a33 = matrix[10];
                a43 = matrix[11];
                x = matrix[12];
                y = matrix[13];
                z = matrix[14];
                angle = _atan2(a32, a33);
                rotationX = angle * _RAD2DEG;
                if (angle) {
                    cos = Math.cos(-angle);
                    sin = Math.sin(-angle);
                    t1 = a12 * cos + a13 * sin;
                    t2 = a22 * cos + a23 * sin;
                    t3 = a32 * cos + a33 * sin;
                    a13 = a12 * -sin + a13 * cos;
                    a23 = a22 * -sin + a23 * cos;
                    a33 = a32 * -sin + a33 * cos;
                    a43 = a42 * -sin + a43 * cos;
                    a12 = t1;
                    a22 = t2;
                    a32 = t3;
                }
                angle = _atan2(-c, a33);
                rotationY = angle * _RAD2DEG;
                if (angle) {
                    cos = Math.cos(-angle);
                    sin = Math.sin(-angle);
                    t1 = a * cos - a13 * sin;
                    t2 = b * cos - a23 * sin;
                    t3 = c * cos - a33 * sin;
                    a43 = d * sin + a43 * cos;
                    a = t1;
                    b = t2;
                    c = t3;
                }
                angle = _atan2(b, a);
                rotation = angle * _RAD2DEG;
                if (angle) {
                    cos = Math.cos(angle);
                    sin = Math.sin(angle);
                    t1 = a * cos + b * sin;
                    t2 = a12 * cos + a22 * sin;
                    b = b * cos - a * sin;
                    a22 = a22 * cos - a12 * sin;
                    a = t1;
                    a12 = t2;
                }
                if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
                    rotationX = rotation = 0;
                    rotationY = 180 - rotationY;
                }
                scaleX = _round(Math.sqrt(a * a + b * b + c * c));
                scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
                angle = _atan2(a12, a22);
                skewX = Math.abs(angle) > 2e-4 ? angle * _RAD2DEG : 0;
                perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
            }
            if (cache.svg) {
                t1 = target.getAttribute("transform");
                cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
                t1 && target.setAttribute("transform", t1);
            }
        }
        if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) if (invertedScaleX) {
            scaleX *= -1;
            skewX += rotation <= 0 ? 180 : -180;
            rotation += rotation <= 0 ? 180 : -180;
        } else {
            scaleY *= -1;
            skewX += skewX <= 0 ? 180 : -180;
        }
        uncache = uncache || cache.uncache;
        cache.x = x - ((cache.xPercent = x && (!uncache && cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
        cache.y = y - ((cache.yPercent = y && (!uncache && cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
        cache.z = z + px;
        cache.scaleX = _round(scaleX);
        cache.scaleY = _round(scaleY);
        cache.rotation = _round(rotation) + deg;
        cache.rotationX = _round(rotationX) + deg;
        cache.rotationY = _round(rotationY) + deg;
        cache.skewX = skewX + deg;
        cache.skewY = skewY + deg;
        cache.transformPerspective = perspective + px;
        if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || 0) style[_transformOriginProp] = _firstTwoOnly(origin);
        cache.xOffset = cache.yOffset = 0;
        cache.force3D = _config.force3D;
        cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
        cache.uncache = 0;
        return cache;
    }, _firstTwoOnly = function _firstTwoOnly(value) {
        return (value = value.split(" "))[0] + " " + value[1];
    }, _addPxTranslate = function _addPxTranslate(target, start, value) {
        var unit = getUnit(start);
        return _round(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
    }, _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
        cache.z = "0px";
        cache.rotationY = cache.rotationX = "0deg";
        cache.force3D = 0;
        _renderCSSTransforms(ratio, cache);
    }, _zeroDeg = "0deg", _zeroPx = "0px", _endParenthesis = ") ", _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
        var _ref = cache || this, xPercent = _ref.xPercent, yPercent = _ref.yPercent, x = _ref.x, y = _ref.y, z = _ref.z, rotation = _ref.rotation, rotationY = _ref.rotationY, rotationX = _ref.rotationX, skewX = _ref.skewX, skewY = _ref.skewY, scaleX = _ref.scaleX, scaleY = _ref.scaleY, transformPerspective = _ref.transformPerspective, force3D = _ref.force3D, target = _ref.target, zOrigin = _ref.zOrigin, transforms = "", use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;
        if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
            var cos, angle = parseFloat(rotationY) * _DEG2RAD, a13 = Math.sin(angle), a33 = Math.cos(angle);
            angle = parseFloat(rotationX) * _DEG2RAD;
            cos = Math.cos(angle);
            x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
            y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
            z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
        }
        if (transformPerspective !== _zeroPx) transforms += "perspective(" + transformPerspective + _endParenthesis;
        if (xPercent || yPercent) transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
        if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
        if (rotation !== _zeroDeg) transforms += "rotate(" + rotation + _endParenthesis;
        if (rotationY !== _zeroDeg) transforms += "rotateY(" + rotationY + _endParenthesis;
        if (rotationX !== _zeroDeg) transforms += "rotateX(" + rotationX + _endParenthesis;
        if (skewX !== _zeroDeg || skewY !== _zeroDeg) transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
        if (scaleX !== 1 || scaleY !== 1) transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
        target.style[_transformProp] = transforms || "translate(0, 0)";
    }, _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
        var a11, a21, a12, a22, temp, _ref2 = cache || this, xPercent = _ref2.xPercent, yPercent = _ref2.yPercent, x = _ref2.x, y = _ref2.y, rotation = _ref2.rotation, skewX = _ref2.skewX, skewY = _ref2.skewY, scaleX = _ref2.scaleX, scaleY = _ref2.scaleY, target = _ref2.target, xOrigin = _ref2.xOrigin, yOrigin = _ref2.yOrigin, xOffset = _ref2.xOffset, yOffset = _ref2.yOffset, forceCSS = _ref2.forceCSS, tx = parseFloat(x), ty = parseFloat(y);
        rotation = parseFloat(rotation);
        skewX = parseFloat(skewX);
        skewY = parseFloat(skewY);
        if (skewY) {
            skewY = parseFloat(skewY);
            skewX += skewY;
            rotation += skewY;
        }
        if (rotation || skewX) {
            rotation *= _DEG2RAD;
            skewX *= _DEG2RAD;
            a11 = Math.cos(rotation) * scaleX;
            a21 = Math.sin(rotation) * scaleX;
            a12 = Math.sin(rotation - skewX) * -scaleY;
            a22 = Math.cos(rotation - skewX) * scaleY;
            if (skewX) {
                skewY *= _DEG2RAD;
                temp = Math.tan(skewX - skewY);
                temp = Math.sqrt(1 + temp * temp);
                a12 *= temp;
                a22 *= temp;
                if (skewY) {
                    temp = Math.tan(skewY);
                    temp = Math.sqrt(1 + temp * temp);
                    a11 *= temp;
                    a21 *= temp;
                }
            }
            a11 = _round(a11);
            a21 = _round(a21);
            a12 = _round(a12);
            a22 = _round(a22);
        } else {
            a11 = scaleX;
            a22 = scaleY;
            a21 = a12 = 0;
        }
        if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
            tx = _convertToUnit(target, "x", x, "px");
            ty = _convertToUnit(target, "y", y, "px");
        }
        if (xOrigin || yOrigin || xOffset || yOffset) {
            tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
            ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
        }
        if (xPercent || yPercent) {
            temp = target.getBBox();
            tx = _round(tx + xPercent / 100 * temp.width);
            ty = _round(ty + yPercent / 100 * temp.height);
        }
        temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
        target.setAttribute("transform", temp);
        forceCSS && (target.style[_transformProp] = temp);
    }, _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue) {
        var direction, pt, cap = 360, isString = _isString(endValue), endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1), change = endNum - startNum, finalValue = startNum + change + "deg";
        if (isString) {
            direction = endValue.split("_")[1];
            if (direction === "short") {
                change %= cap;
                if (change !== change % (cap / 2)) change += change < 0 ? cap : -cap;
            }
            if (direction === "cw" && change < 0) change = (change + cap * CSSPlugin_bigNum) % cap - ~~(change / cap) * cap; else if (direction === "ccw" && change > 0) change = (change - cap * CSSPlugin_bigNum) % cap - ~~(change / cap) * cap;
        }
        plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
        pt.e = finalValue;
        pt.u = "deg";
        plugin._props.push(property);
        return pt;
    }, _assign = function _assign(target, source) {
        for (var p in source) target[p] = source[p];
        return target;
    }, _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
        var endCache, p, startValue, endValue, startNum, endNum, startUnit, endUnit, startCache = _assign({}, target._gsap), exclude = "perspective,force3D,transformOrigin,svgOrigin", style = target.style;
        if (startCache.svg) {
            startValue = target.getAttribute("transform");
            target.setAttribute("transform", "");
            style[_transformProp] = transforms;
            endCache = _parseTransform(target, 1);
            _removeProperty(target, _transformProp);
            target.setAttribute("transform", startValue);
        } else {
            startValue = getComputedStyle(target)[_transformProp];
            style[_transformProp] = transforms;
            endCache = _parseTransform(target, 1);
            style[_transformProp] = startValue;
        }
        for (p in _transformProps) {
            startValue = startCache[p];
            endValue = endCache[p];
            if (startValue !== endValue && exclude.indexOf(p) < 0) {
                startUnit = getUnit(startValue);
                endUnit = getUnit(endValue);
                startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
                endNum = parseFloat(endValue);
                plugin._pt = new PropTween(plugin._pt, endCache, p, startNum, endNum - startNum, _renderCSSProp);
                plugin._pt.u = endUnit || 0;
                plugin._props.push(p);
            }
        }
        _assign(endCache, startCache);
    };
    _forEachName("padding,margin,Width,Radius", (function(name, index) {
        var t = "Top", r = "Right", b = "Bottom", l = "Left", props = (index < 3 ? [ t, r, b, l ] : [ t + l, t + r, b + r, b + l ]).map((function(side) {
            return index < 2 ? name + side : "border" + side + name;
        }));
        _specialProps[index > 1 ? "border" + name : name] = function(plugin, target, property, endValue, tween) {
            var a, vars;
            if (arguments.length < 4) {
                a = props.map((function(prop) {
                    return _get(plugin, prop, property);
                }));
                vars = a.join(" ");
                return vars.split(a[0]).length === 5 ? a[0] : vars;
            }
            a = (endValue + "").split(" ");
            vars = {};
            props.forEach((function(prop, i) {
                return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
            }));
            plugin.init(target, vars, tween);
        };
    }));
    var CSSPlugin = {
        name: "css",
        register: _initCore,
        targetTest: function targetTest(target) {
            return target.style && target.nodeType;
        },
        init: function init(target, vars, tween, index, targets) {
            var startValue, endValue, endNum, startNum, type, specialProp, p, startUnit, endUnit, relative, isTransformRelated, transformPropTween, cache, smooth, hasPriority, inlineProps, props = this._props, style = target.style, startAt = tween.vars.startAt;
            _pluginInitted || _initCore();
            this.styles = this.styles || _getStyleSaver(target);
            inlineProps = this.styles.props;
            this.tween = tween;
            for (p in vars) {
                if (p === "autoRound") continue;
                endValue = vars[p];
                if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) continue;
                type = typeof endValue;
                specialProp = _specialProps[p];
                if (type === "function") {
                    endValue = endValue.call(tween, index, target, targets);
                    type = typeof endValue;
                }
                if (type === "string" && ~endValue.indexOf("random(")) endValue = _replaceRandom(endValue);
                if (specialProp) specialProp(this, target, p, endValue, tween) && (hasPriority = 1); else if (p.substr(0, 2) === "--") {
                    startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
                    endValue += "";
                    _colorExp.lastIndex = 0;
                    if (!_colorExp.test(startValue)) {
                        startUnit = getUnit(startValue);
                        endUnit = getUnit(endValue);
                    }
                    endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
                    this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
                    props.push(p);
                    inlineProps.push(p, 0, style[p]);
                } else if (type !== "undefined") {
                    if (startAt && p in startAt) {
                        startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
                        _isString(startValue) && ~startValue.indexOf("random(") && (startValue = _replaceRandom(startValue));
                        getUnit(startValue + "") || (startValue += _config.units[p] || getUnit(_get(target, p)) || "");
                        (startValue + "").charAt(1) === "=" && (startValue = _get(target, p));
                    } else startValue = _get(target, p);
                    startNum = parseFloat(startValue);
                    relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
                    relative && (endValue = endValue.substr(2));
                    endNum = parseFloat(endValue);
                    if (p in _propertyAliases) {
                        if (p === "autoAlpha") {
                            if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) startNum = 0;
                            inlineProps.push("visibility", 0, style.visibility);
                            _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
                        }
                        if (p !== "scale" && p !== "transform") {
                            p = _propertyAliases[p];
                            ~p.indexOf(",") && (p = p.split(",")[0]);
                        }
                    }
                    isTransformRelated = p in _transformProps;
                    if (isTransformRelated) {
                        this.styles.save(p);
                        if (!transformPropTween) {
                            cache = target._gsap;
                            cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform);
                            smooth = vars.smoothOrigin !== false && cache.smooth;
                            transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1);
                            transformPropTween.dep = 1;
                        }
                        if (p === "scale") {
                            this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, (relative ? _parseRelative(cache.scaleY, relative + endNum) : endNum) - cache.scaleY || 0, _renderCSSProp);
                            this._pt.u = 0;
                            props.push("scaleY", p);
                            p += "X";
                        } else if (p === "transformOrigin") {
                            inlineProps.push(_transformOriginProp, 0, style[_transformOriginProp]);
                            endValue = _convertKeywordsToPercentages(endValue);
                            if (cache.svg) _applySVGOrigin(target, endValue, 0, smooth, 0, this); else {
                                endUnit = parseFloat(endValue.split(" ")[2]) || 0;
                                endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
                                _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
                            }
                            continue;
                        } else if (p === "svgOrigin") {
                            _applySVGOrigin(target, endValue, 1, smooth, 0, this);
                            continue;
                        } else if (p in _rotationalProperties) {
                            _addRotationalPropTween(this, cache, p, startNum, relative ? _parseRelative(startNum, relative + endValue) : endValue);
                            continue;
                        } else if (p === "smoothOrigin") {
                            _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
                            continue;
                        } else if (p === "force3D") {
                            cache[p] = endValue;
                            continue;
                        } else if (p === "transform") {
                            _addRawTransformPTs(this, endValue, target);
                            continue;
                        }
                    } else if (!(p in style)) p = _checkPropPrefix(p) || p;
                    if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
                        startUnit = (startValue + "").substr((startNum + "").length);
                        endNum || (endNum = 0);
                        endUnit = getUnit(endValue) || (p in _config.units ? _config.units[p] : startUnit);
                        startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
                        this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, (relative ? _parseRelative(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
                        this._pt.u = endUnit || 0;
                        if (startUnit !== endUnit && endUnit !== "%") {
                            this._pt.b = startValue;
                            this._pt.r = _renderCSSPropWithBeginning;
                        }
                    } else if (!(p in style)) {
                        if (p in target) this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index, targets); else if (p !== "parseTransform") {
                            _missingPlugin(p, endValue);
                            continue;
                        }
                    } else _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
                    isTransformRelated || (p in style ? inlineProps.push(p, 0, style[p]) : inlineProps.push(p, 1, startValue || target[p]));
                    props.push(p);
                }
            }
            hasPriority && _sortPropTweensByPriority(this);
        },
        render: function render(ratio, data) {
            if (data.tween._time || !CSSPlugin_reverting()) {
                var pt = data._pt;
                while (pt) {
                    pt.r(ratio, pt.d);
                    pt = pt._next;
                }
            } else data.styles.revert();
        },
        get: _get,
        aliases: _propertyAliases,
        getSetter: function getSetter(target, property, plugin) {
            var p = _propertyAliases[property];
            p && p.indexOf(",") < 0 && (property = p);
            return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
        },
        core: {
            _removeProperty,
            _getMatrix
        }
    };
    gsap.utils.checkPrefix = _checkPropPrefix;
    gsap.core.getStyleSaver = _getStyleSaver;
    (function(positionAndScale, rotation, others, aliases) {
        var all = _forEachName(positionAndScale + "," + rotation + "," + others, (function(name) {
            _transformProps[name] = 1;
        }));
        _forEachName(rotation, (function(name) {
            _config.units[name] = "deg";
            _rotationalProperties[name] = 1;
        }));
        _propertyAliases[all[13]] = positionAndScale + "," + rotation;
        _forEachName(aliases, (function(name) {
            var split = name.split(":");
            _propertyAliases[split[1]] = all[split[0]];
        }));
    })("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
    _forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", (function(name) {
        _config.units[name] = "px";
    }));
    gsap.registerPlugin(CSSPlugin);
    var gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap;
    gsapWithCSS.core.Tween;
    /*!
 * ScrollTrigger 3.12.1
 * https://greensock.com
 * 
 * @license Copyright 2023, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */
    let e, t, r, i, s, o, a, n, l, c, d, p, h, g, u = () => e || "undefined" != typeof window && (e = window.gsap) && e.registerPlugin && e, f = 1, m = [], v = [], y = [], x = Date.now, b = (e, t) => t, w = (e, t) => ~y.indexOf(e) && y[y.indexOf(e) + 1][t], _ = e => !!~d.indexOf(e), T = (e, t, r, i, s) => e.addEventListener(t, r, {
        passive: !i,
        capture: !!s
    }), S = (e, t, r, i) => e.removeEventListener(t, r, !!i), k = () => p && p.isPressed || v.cache++, C = (e, t) => {
        let r = s => {
            if (s || 0 === s) {
                f && (i.history.scrollRestoration = "manual");
                let t = p && p.isPressed;
                s = r.v = Math.round(s) || (p && p.iOS ? 1 : 0), e(s), r.cacheID = v.cache, t && b("ss", s);
            } else (t || v.cache !== r.cacheID || b("ref")) && (r.cacheID = v.cache, r.v = e());
            return r.v + r.offset;
        };
        return r.offset = 0, e && r;
    }, E = {
        s: "scrollLeft",
        p: "left",
        p2: "Left",
        os: "right",
        os2: "Right",
        d: "width",
        d2: "Width",
        a: "x",
        sc: C((function(e) {
            return arguments.length ? i.scrollTo(e, P.sc()) : i.pageXOffset || s.scrollLeft || o.scrollLeft || a.scrollLeft || 0;
        }))
    }, P = {
        s: "scrollTop",
        p: "top",
        p2: "Top",
        os: "bottom",
        os2: "Bottom",
        d: "height",
        d2: "Height",
        a: "y",
        op: E,
        sc: C((function(e) {
            return arguments.length ? i.scrollTo(E.sc(), e) : i.pageYOffset || s.scrollTop || o.scrollTop || a.scrollTop || 0;
        }))
    }, M = (t, r) => (r && r._ctx && r._ctx.selector || e.utils.toArray)(t)[0] || ("string" == typeof t && !1 !== e.config().nullTargetWarn ? console.warn("Element not found:", t) : null), O = (t, {s: r, sc: i}) => {
        _(t) && (t = s.scrollingElement || o);
        let a = v.indexOf(t), n = i === P.sc ? 1 : 2;
        !~a && (a = v.push(t) - 1), v[a + n] || t.addEventListener("scroll", k);
        let l = v[a + n], c = l || (v[a + n] = C(w(t, r), !0) || (_(t) ? i : C((function(e) {
            return arguments.length ? t[r] = e : t[r];
        }))));
        return c.target = t, l || (c.smooth = "smooth" === e.getProperty(t, "scrollBehavior")), 
        c;
    }, A = (e, t, r) => {
        let i = e, s = e, o = x(), a = o, n = t || 50, l = Math.max(500, 3 * n), c = (e, t) => {
            let l = x();
            t || l - o > n ? (s = i, i = e, a = o, o = l) : r ? i += e : i = s + (e - s) / (l - a) * (o - a);
        };
        return {
            update: c,
            reset: () => {
                s = i = r ? 0 : i, a = o = 0;
            },
            getVelocity: e => {
                let t = a, n = s, d = x();
                return (e || 0 === e) && e !== i && c(e), o === a || d - a > l ? 0 : (i + (r ? n : -n)) / ((r ? d : o) - t) * 1e3;
            }
        };
    }, R = (e, t) => (t && !e._gsapAllow && e.preventDefault(), e.changedTouches ? e.changedTouches[0] : e), D = e => {
        let t = Math.max(...e), r = Math.min(...e);
        return Math.abs(t) >= Math.abs(r) ? t : r;
    }, Y = () => {
        c = e.core.globals().ScrollTrigger, c && c.core && (() => {
            let e = c.core, t = e.bridge || {}, r = e._scrollers, i = e._proxies;
            r.push(...v), i.push(...y), v = r, y = i, b = (e, r) => t[e](r);
        })();
    }, I = c => (e = c || u(), e && "undefined" != typeof document && document.body && (i = window, 
    s = document, o = s.documentElement, a = s.body, d = [ i, s, o, a ], r = e.utils.clamp, 
    g = e.core.context || function() {}, l = "onpointerenter" in a ? "pointer" : "mouse", 
    n = L.isTouch = i.matchMedia && i.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in i || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0, 
    h = L.eventTypes = ("ontouchstart" in o ? "touchstart,touchmove,touchcancel,touchend" : "onpointerdown" in o ? "pointerdown,pointermove,pointercancel,pointerup" : "mousedown,mousemove,mouseup,mouseup").split(","), 
    setTimeout((() => f = 0), 500), Y(), t = 1), t);
    E.op = P, v.cache = 0;
    class L {
        constructor(e) {
            this.init(e);
        }
        init(r) {
            t || I(e) || console.warn("Please gsap.registerPlugin(Observer)"), c || Y();
            let {tolerance: d, dragMinimum: u, type: f, target: v, lineHeight: y, debounce: b, preventDefault: w, onStop: C, onStopDelay: L, ignore: X, wheelSpeed: z, event: B, onDragStart: N, onDragEnd: F, onDrag: W, onPress: H, onRelease: q, onRight: U, onLeft: V, onUp: G, onDown: j, onChangeX: K, onChangeY: Z, onChange: $, onToggleX: J, onToggleY: Q, onHover: ee, onHoverEnd: te, onMove: re, ignoreCheck: ie, isNormalizer: se, onGestureStart: oe, onGestureEnd: ae, onWheel: ne, onEnable: le, onDisable: ce, onClick: de, scrollSpeed: pe, capture: he, allowClicks: ge, lockAxis: ue, onLockAxis: fe} = r;
            this.target = v = M(v) || o, this.vars = r, X && (X = e.utils.toArray(X)), d = d || 1e-9, 
            u = u || 0, z = z || 1, pe = pe || 1, f = f || "wheel,touch,pointer", b = !1 !== b, 
            y || (y = parseFloat(i.getComputedStyle(a).lineHeight) || 22);
            let me, ve, ye, xe, be, we, _e, Te = this, Se = 0, ke = 0, Ce = O(v, E), Ee = O(v, P), Pe = Ce(), Me = Ee(), Oe = ~f.indexOf("touch") && !~f.indexOf("pointer") && "pointerdown" === h[0], Ae = _(v), Re = v.ownerDocument || s, De = [ 0, 0, 0 ], Ye = [ 0, 0, 0 ], Ie = 0, Le = () => Ie = x(), Xe = (e, t) => (Te.event = e) && X && ~X.indexOf(e.target) || t && Oe && "touch" !== e.pointerType || ie && ie(e, t), ze = () => {
                let e = Te.deltaX = D(De), t = Te.deltaY = D(Ye), r = Math.abs(e) >= d, i = Math.abs(t) >= d;
                $ && (r || i) && $(Te, e, t, De, Ye), r && (U && Te.deltaX > 0 && U(Te), V && Te.deltaX < 0 && V(Te), 
                K && K(Te), J && Te.deltaX < 0 != Se < 0 && J(Te), Se = Te.deltaX, De[0] = De[1] = De[2] = 0), 
                i && (j && Te.deltaY > 0 && j(Te), G && Te.deltaY < 0 && G(Te), Z && Z(Te), Q && Te.deltaY < 0 != ke < 0 && Q(Te), 
                ke = Te.deltaY, Ye[0] = Ye[1] = Ye[2] = 0), (xe || ye) && (re && re(Te), ye && (W(Te), 
                ye = !1), xe = !1), we && !(we = !1) && fe && fe(Te), be && (ne(Te), be = !1), me = 0;
            }, Be = (e, t, r) => {
                De[r] += e, Ye[r] += t, Te._vx.update(e), Te._vy.update(t), b ? me || (me = requestAnimationFrame(ze)) : ze();
            }, Ne = (e, t) => {
                ue && !_e && (Te.axis = _e = Math.abs(e) > Math.abs(t) ? "x" : "y", we = !0), "y" !== _e && (De[2] += e, 
                Te._vx.update(e, !0)), "x" !== _e && (Ye[2] += t, Te._vy.update(t, !0)), b ? me || (me = requestAnimationFrame(ze)) : ze();
            }, Fe = e => {
                if (Xe(e, 1)) return;
                let t = (e = R(e, w)).clientX, r = e.clientY, i = t - Te.x, s = r - Te.y, o = Te.isDragging;
                Te.x = t, Te.y = r, (o || Math.abs(Te.startX - t) >= u || Math.abs(Te.startY - r) >= u) && (W && (ye = !0), 
                o || (Te.isDragging = !0), Ne(i, s), o || N && N(Te));
            }, We = Te.onPress = e => {
                Xe(e, 1) || e && e.button || (Te.axis = _e = null, ve.pause(), Te.isPressed = !0, 
                e = R(e), Se = ke = 0, Te.startX = Te.x = e.clientX, Te.startY = Te.y = e.clientY, 
                Te._vx.reset(), Te._vy.reset(), T(se ? v : Re, h[1], Fe, w, !0), Te.deltaX = Te.deltaY = 0, 
                H && H(Te));
            }, He = Te.onRelease = t => {
                if (Xe(t, 1)) return;
                S(se ? v : Re, h[1], Fe, !0);
                let r = !isNaN(Te.y - Te.startY), s = Te.isDragging && (Math.abs(Te.x - Te.startX) > 3 || Math.abs(Te.y - Te.startY) > 3), o = R(t);
                !s && r && (Te._vx.reset(), Te._vy.reset(), w && ge && e.delayedCall(.08, (() => {
                    if (x() - Ie > 300 && !t.defaultPrevented) if (t.target.click) t.target.click(); else if (Re.createEvent) {
                        let e = Re.createEvent("MouseEvents");
                        e.initMouseEvent("click", !0, !0, i, 1, o.screenX, o.screenY, o.clientX, o.clientY, !1, !1, !1, !1, 0, null), 
                        t.target.dispatchEvent(e);
                    }
                }))), Te.isDragging = Te.isGesturing = Te.isPressed = !1, C && !se && ve.restart(!0), 
                F && s && F(Te), q && q(Te, s);
            }, qe = e => e.touches && e.touches.length > 1 && (Te.isGesturing = !0) && oe(e, Te.isDragging), Ue = () => (Te.isGesturing = !1) || ae(Te), Ve = e => {
                if (Xe(e)) return;
                let t = Ce(), r = Ee();
                Be((t - Pe) * pe, (r - Me) * pe, 1), Pe = t, Me = r, C && ve.restart(!0);
            }, Ge = e => {
                if (Xe(e)) return;
                e = R(e, w), ne && (be = !0);
                let t = (1 === e.deltaMode ? y : 2 === e.deltaMode ? i.innerHeight : 1) * z;
                Be(e.deltaX * t, e.deltaY * t, 0), C && !se && ve.restart(!0);
            }, je = e => {
                if (Xe(e)) return;
                let t = e.clientX, r = e.clientY, i = t - Te.x, s = r - Te.y;
                Te.x = t, Te.y = r, xe = !0, (i || s) && Ne(i, s);
            }, Ke = e => {
                Te.event = e, ee(Te);
            }, Ze = e => {
                Te.event = e, te(Te);
            }, $e = e => Xe(e) || R(e, w) && de(Te);
            ve = Te._dc = e.delayedCall(L || .25, (() => {
                Te._vx.reset(), Te._vy.reset(), ve.pause(), C && C(Te);
            })).pause(), Te.deltaX = Te.deltaY = 0, Te._vx = A(0, 50, !0), Te._vy = A(0, 50, !0), 
            Te.scrollX = Ce, Te.scrollY = Ee, Te.isDragging = Te.isGesturing = Te.isPressed = !1, 
            g(this), Te.enable = e => (Te.isEnabled || (T(Ae ? Re : v, "scroll", k), f.indexOf("scroll") >= 0 && T(Ae ? Re : v, "scroll", Ve, w, he), 
            f.indexOf("wheel") >= 0 && T(v, "wheel", Ge, w, he), (f.indexOf("touch") >= 0 && n || f.indexOf("pointer") >= 0) && (T(v, h[0], We, w, he), 
            T(Re, h[2], He), T(Re, h[3], He), ge && T(v, "click", Le, !1, !0), de && T(v, "click", $e), 
            oe && T(Re, "gesturestart", qe), ae && T(Re, "gestureend", Ue), ee && T(v, l + "enter", Ke), 
            te && T(v, l + "leave", Ze), re && T(v, l + "move", je)), Te.isEnabled = !0, e && e.type && We(e), 
            le && le(Te)), Te), Te.disable = () => {
                Te.isEnabled && (m.filter((e => e !== Te && _(e.target))).length || S(Ae ? Re : v, "scroll", k), 
                Te.isPressed && (Te._vx.reset(), Te._vy.reset(), S(se ? v : Re, h[1], Fe, !0)), 
                S(Ae ? Re : v, "scroll", Ve, he), S(v, "wheel", Ge, he), S(v, h[0], We, he), S(Re, h[2], He), 
                S(Re, h[3], He), S(v, "click", Le, !0), S(v, "click", $e), S(Re, "gesturestart", qe), 
                S(Re, "gestureend", Ue), S(v, l + "enter", Ke), S(v, l + "leave", Ze), S(v, l + "move", je), 
                Te.isEnabled = Te.isPressed = Te.isDragging = !1, ce && ce(Te));
            }, Te.kill = Te.revert = () => {
                Te.disable();
                let e = m.indexOf(Te);
                e >= 0 && m.splice(e, 1), p === Te && (p = 0);
            }, m.push(Te), se && _(v) && (p = Te), Te.enable(B);
        }
        get velocityX() {
            return this._vx.getVelocity();
        }
        get velocityY() {
            return this._vy.getVelocity();
        }
    }
    L.version = "3.12.1", L.create = e => new L(e), L.register = I, L.getAll = () => m.slice(), 
    L.getById = e => m.filter((t => t.vars.id === e))[0], u() && e.registerPlugin(L);
    let X, z, B, N, F, W, H, q, U, V, G, j, K, Z, $, J, Q, ee, te, re, ie, se, oe, ae, ne, le, ce, de, pe, he, ge, ue, fe, me, ve = 1, ye = Date.now, xe = ye(), be = 0, we = 0, _e = (e, t, r) => {
        let i = Ie(e) && ("clamp(" === e.substr(0, 6) || e.indexOf("max") > -1);
        return r["_" + t + "Clamp"] = i, i ? e.substr(6, e.length - 7) : e;
    }, Te = (e, t) => !t || Ie(e) && "clamp(" === e.substr(0, 6) ? e : "clamp(" + e + ")", Se = () => we && requestAnimationFrame(Se), ke = () => Z = 1, Ce = () => Z = 0, Ee = e => e, Pe = e => Math.round(1e5 * e) / 1e5 || 0, Me = () => "undefined" != typeof window, Oe = () => X || Me() && (X = window.gsap) && X.registerPlugin && X, Ae = e => !!~H.indexOf(e), Re = e => w(e, "getBoundingClientRect") || (Ae(e) ? () => (At.width = B.innerWidth, 
    At.height = B.innerHeight, At) : () => Ve(e)), De = (e, {s: t, d2: r, d: i, a: s}) => Math.max(0, (t = "scroll" + r) && (s = w(e, t)) ? s() - Re(e)()[i] : Ae(e) ? (F[t] || W[t]) - (B["inner" + r] || F["client" + r] || W["client" + r]) : e[t] - e["offset" + r]), Ye = (e, t) => {
        for (let r = 0; r < te.length; r += 3) (!t || ~t.indexOf(te[r + 1])) && e(te[r], te[r + 1], te[r + 2]);
    }, Ie = e => "string" == typeof e, Le = e => "function" == typeof e, Xe = e => "number" == typeof e, ze = e => "object" == typeof e, Be = (e, t, r) => e && e.progress(t ? 0 : 1) && r && e.pause(), Ne = (e, t) => {
        if (e.enabled) {
            let r = t(e);
            r && r.totalTime && (e.callbackAnimation = r);
        }
    }, Fe = Math.abs, We = "padding", He = "px", qe = e => B.getComputedStyle(e), Ue = (e, t) => {
        for (let r in t) r in e || (e[r] = t[r]);
        return e;
    }, Ve = (e, t) => {
        let r = t && "matrix(1, 0, 0, 1, 0, 0)" !== qe(e)[$] && X.to(e, {
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            skewX: 0,
            skewY: 0
        }).progress(1), i = e.getBoundingClientRect();
        return r && r.progress(0).kill(), i;
    }, Ge = (e, {d2: t}) => e["offset" + t] || e["client" + t] || 0, je = e => {
        let t, r = [], i = e.labels, s = e.duration();
        for (t in i) r.push(i[t] / s);
        return r;
    }, Ke = e => {
        let t = X.utils.snap(e), r = Array.isArray(e) && e.slice(0).sort(((e, t) => e - t));
        return r ? (e, i, s = .001) => {
            let o;
            if (!i) return t(e);
            if (i > 0) {
                for (e -= s, o = 0; o < r.length; o++) if (r[o] >= e) return r[o];
                return r[o - 1];
            }
            for (o = r.length, e += s; o--; ) if (r[o] <= e) return r[o];
            return r[0];
        } : (r, i, s = .001) => {
            let o = t(r);
            return !i || Math.abs(o - r) < s || o - r < 0 == i < 0 ? o : t(i < 0 ? r - e : r + e);
        };
    }, Ze = (e, t, r, i) => r.split(",").forEach((r => e(t, r, i))), $e = (e, t, r, i, s) => e.addEventListener(t, r, {
        passive: !i,
        capture: !!s
    }), Je = (e, t, r, i) => e.removeEventListener(t, r, !!i), Qe = (e, t, r) => {
        (r = r && r.wheelHandler) && (e(t, "wheel", r), e(t, "touchmove", r));
    }, et = {
        startColor: "green",
        endColor: "red",
        indent: 0,
        fontSize: "16px",
        fontWeight: "normal"
    }, tt = {
        toggleActions: "play",
        anticipatePin: 0
    }, rt = {
        top: 0,
        left: 0,
        center: .5,
        bottom: 1,
        right: 1
    }, it = (e, t) => {
        if (Ie(e)) {
            let r = e.indexOf("="), i = ~r ? +(e.charAt(r - 1) + 1) * parseFloat(e.substr(r + 1)) : 0;
            ~r && (e.indexOf("%") > r && (i *= t / 100), e = e.substr(0, r - 1)), e = i + (e in rt ? rt[e] * t : ~e.indexOf("%") ? parseFloat(e) * t / 100 : parseFloat(e) || 0);
        }
        return e;
    }, st = (e, t, r, i, {startColor: s, endColor: o, fontSize: a, indent: n, fontWeight: l}, c, d, p) => {
        let h = N.createElement("div"), g = Ae(r) || "fixed" === w(r, "pinType"), u = -1 !== e.indexOf("scroller"), f = g ? W : r, m = -1 !== e.indexOf("start"), v = m ? s : o, y = "border-color:" + v + ";font-size:" + a + ";color:" + v + ";font-weight:" + l + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
        return y += "position:" + ((u || p) && g ? "fixed;" : "absolute;"), (u || p || !g) && (y += (i === P ? "right" : "bottom") + ":" + (c + parseFloat(n)) + "px;"), 
        d && (y += "box-sizing:border-box;text-align:left;width:" + d.offsetWidth + "px;"), 
        h._isStart = m, h.setAttribute("class", "gsap-marker-" + e + (t ? " marker-" + t : "")), 
        h.style.cssText = y, h.innerText = t || 0 === t ? e + "-" + t : e, f.children[0] ? f.insertBefore(h, f.children[0]) : f.appendChild(h), 
        h._offset = h["offset" + i.op.d2], ot(h, 0, i, m), h;
    }, ot = (e, t, r, i) => {
        let s = {
            display: "block"
        }, o = r[i ? "os2" : "p2"], a = r[i ? "p2" : "os2"];
        e._isFlipped = i, s[r.a + "Percent"] = i ? -100 : 0, s[r.a] = i ? "1px" : 0, s["border" + o + "Width"] = 1, 
        s["border" + a + "Width"] = 0, s[r.p] = t + "px", X.set(e, s);
    }, at = [], nt = {}, lt = () => ye() - be > 34 && (ge || (ge = requestAnimationFrame(St))), ct = () => {
        (!oe || !oe.isPressed || oe.startX > W.clientWidth) && (v.cache++, oe ? ge || (ge = requestAnimationFrame(St)) : St(), 
        be || ft("scrollStart"), be = ye());
    }, dt = () => {
        le = B.innerWidth, ne = B.innerHeight;
    }, pt = () => {
        v.cache++, !K && !se && !N.fullscreenElement && !N.webkitFullscreenElement && (!ae || le !== B.innerWidth || Math.abs(B.innerHeight - ne) > .25 * B.innerHeight) && q.restart(!0);
    }, ht = {}, gt = [], ut = () => Je(zt, "scrollEnd", ut) || wt(!0), ft = e => ht[e] && ht[e].map((e => e())) || gt, mt = [], vt = e => {
        for (let t = 0; t < mt.length; t += 5) (!e || mt[t + 4] && mt[t + 4].query === e) && (mt[t].style.cssText = mt[t + 1], 
        mt[t].getBBox && mt[t].setAttribute("transform", mt[t + 2] || ""), mt[t + 3].uncache = 1);
    }, yt = (e, t) => {
        let r;
        for (J = 0; J < at.length; J++) r = at[J], !r || t && r._ctx !== t || (e ? r.kill(1) : r.revert(!0, !0));
        t && vt(t), t || ft("revert");
    }, xt = (e, t) => {
        v.cache++, (t || !ue) && v.forEach((e => Le(e) && e.cacheID++ && (e.rec = 0))), 
        Ie(e) && (B.history.scrollRestoration = pe = e);
    }, bt = 0, wt = (e, t) => {
        if (be && !e) return void $e(zt, "scrollEnd", ut);
        ue = zt.isRefreshing = !0, v.forEach((e => Le(e) && ++e.cacheID && (e.rec = e())));
        let r = ft("refreshInit");
        re && zt.sort(), t || yt(), v.forEach((e => {
            Le(e) && (e.smooth && (e.target.style.scrollBehavior = "auto"), e(0));
        })), at.slice(0).forEach((e => e.refresh())), at.forEach(((e, t) => {
            if (e._subPinOffset && e.pin) {
                let t = e.vars.horizontal ? "offsetWidth" : "offsetHeight", r = e.pin[t];
                e.revert(!0, 1), e.adjustPinSpacing(e.pin[t] - r), e.refresh();
            }
        })), at.forEach((e => {
            let t = De(e.scroller, e._dir);
            ("max" === e.vars.end || e._endClamp && e.end > t) && e.setPositions(e.start, Math.max(e.start + 1, t), !0);
        })), r.forEach((e => e && e.render && e.render(-1))), v.forEach((e => {
            Le(e) && (e.smooth && requestAnimationFrame((() => e.target.style.scrollBehavior = "smooth")), 
            e.rec && e(e.rec));
        })), xt(pe, 1), q.pause(), bt++, ue = 2, St(2), at.forEach((e => Le(e.vars.onRefresh) && e.vars.onRefresh(e))), 
        ue = zt.isRefreshing = !1, ft("refresh");
    }, _t = 0, Tt = 1, St = e => {
        if (!ue || 2 === e) {
            zt.isUpdating = !0, me && me.update(0);
            let e = at.length, t = ye(), r = t - xe >= 50, i = e && at[0].scroll();
            if (Tt = _t > i ? -1 : 1, ue || (_t = i), r && (be && !Z && t - be > 200 && (be = 0, 
            ft("scrollEnd")), G = xe, xe = t), Tt < 0) {
                for (J = e; J-- > 0; ) at[J] && at[J].update(0, r);
                Tt = 1;
            } else for (J = 0; J < e; J++) at[J] && at[J].update(0, r);
            zt.isUpdating = !1;
        }
        ge = 0;
    }, kt = [ "left", "top", "bottom", "right", "marginBottom", "marginRight", "marginTop", "marginLeft", "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order" ], Ct = kt.concat([ "width", "height", "boxSizing", "maxWidth", "maxHeight", "position", "margin", We, "paddingTop", "paddingRight", "paddingBottom", "paddingLeft" ]), Et = (e, t, r, i) => {
        if (!e._gsap.swappedIn) {
            let s, o = kt.length, a = t.style, n = e.style;
            for (;o--; ) s = kt[o], a[s] = r[s];
            a.position = "absolute" === r.position ? "absolute" : "relative", "inline" === r.display && (a.display = "inline-block"), 
            n.bottom = n.right = "auto", a.flexBasis = r.flexBasis || "auto", a.overflow = "visible", 
            a.boxSizing = "border-box", a.width = Ge(e, E) + He, a.height = Ge(e, P) + He, a.padding = n.margin = n.top = n.left = "0", 
            Mt(i), n.width = n.maxWidth = r.width, n.height = n.maxHeight = r.height, n.padding = r.padding, 
            e.parentNode !== t && (e.parentNode.insertBefore(t, e), t.appendChild(e)), e._gsap.swappedIn = !0;
        }
    }, Pt = /([A-Z])/g, Mt = e => {
        if (e) {
            let t, r, i = e.t.style, s = e.length, o = 0;
            for ((e.t._gsap || X.core.getCache(e.t)).uncache = 1; o < s; o += 2) r = e[o + 1], 
            t = e[o], r ? i[t] = r : i[t] && i.removeProperty(t.replace(Pt, "-$1").toLowerCase());
        }
    }, Ot = e => {
        let t = Ct.length, r = e.style, i = [], s = 0;
        for (;s < t; s++) i.push(Ct[s], r[Ct[s]]);
        return i.t = e, i;
    }, At = {
        left: 0,
        top: 0
    }, Rt = (e, t, r, i, s, o, a, n, l, c, d, p, h, g) => {
        Le(e) && (e = e(n)), Ie(e) && "max" === e.substr(0, 3) && (e = p + ("=" === e.charAt(4) ? it("0" + e.substr(3), r) : 0));
        let u, f, m, v = h ? h.time() : 0;
        if (h && h.seek(0), isNaN(e) || (e = +e), Xe(e)) h && (e = X.utils.mapRange(h.scrollTrigger.start, h.scrollTrigger.end, 0, p, e)), 
        a && ot(a, r, i, !0); else {
            Le(t) && (t = t(n));
            let o, d, p, h, g = (e || "0").split(" ");
            m = M(t, n) || W, o = Ve(m) || {}, o && (o.left || o.top) || "none" !== qe(m).display || (h = m.style.display, 
            m.style.display = "block", o = Ve(m), h ? m.style.display = h : m.style.removeProperty("display")), 
            d = it(g[0], o[i.d]), p = it(g[1] || "0", r), e = o[i.p] - l[i.p] - c + d + s - p, 
            a && ot(a, p, i, r - p < 20 || a._isStart && p > 20), r -= r - p;
        }
        if (g && (n[g] = e || -.001, e < 0 && (e = 0)), o) {
            let t = e + r, s = o._isStart;
            u = "scroll" + i.d2, ot(o, t, i, s && t > 20 || !s && (d ? Math.max(W[u], F[u]) : o.parentNode[u]) <= t + 1), 
            d && (l = Ve(a), d && (o.style[i.op.p] = l[i.op.p] - i.op.m - o._offset + He));
        }
        return h && m && (u = Ve(m), h.seek(p), f = Ve(m), h._caScrollDist = u[i.p] - f[i.p], 
        e = e / h._caScrollDist * p), h && h.seek(v), h ? e : Math.round(e);
    }, Dt = /(webkit|moz|length|cssText|inset)/i, Yt = (e, t, r, i) => {
        if (e.parentNode !== t) {
            let s, o, a = e.style;
            if (t === W) {
                for (s in e._stOrig = a.cssText, o = qe(e), o) +s || Dt.test(s) || !o[s] || "string" != typeof a[s] || "0" === s || (a[s] = o[s]);
                a.top = r, a.left = i;
            } else a.cssText = e._stOrig;
            X.core.getCache(e).uncache = 1, t.appendChild(e);
        }
    }, It = (e, t, r) => {
        let i = t, s = i;
        return t => {
            let o = Math.round(e());
            return o !== i && o !== s && Math.abs(o - i) > 3 && Math.abs(o - s) > 3 && (t = o, 
            r && r()), s = i, i = t, t;
        };
    }, Lt = (e, t, r) => {
        let i = {};
        i[t.p] = "+=" + r, X.set(e, i);
    }, Xt = (e, t) => {
        let r = O(e, t), i = "_scroll" + t.p2, s = (t, o, a, n, l) => {
            let c = s.tween, d = o.onComplete, p = {};
            a = a || r();
            let h = It(r, a, (() => {
                c.kill(), s.tween = 0;
            }));
            return l = n && l || 0, n = n || t - a, c && c.kill(), o[i] = t, o.modifiers = p, 
            p[i] = () => h(a + n * c.ratio + l * c.ratio * c.ratio), o.onUpdate = () => {
                v.cache++, St();
            }, o.onComplete = () => {
                s.tween = 0, d && d.call(c);
            }, c = s.tween = X.to(e, o), c;
        };
        return e[i] = r, r.wheelHandler = () => s.tween && s.tween.kill() && (s.tween = 0), 
        $e(e, "wheel", r.wheelHandler), zt.isTouch && $e(e, "touchmove", r.wheelHandler), 
        s;
    };
    class zt {
        constructor(e, t) {
            z || zt.register(X) || console.warn("Please gsap.registerPlugin(ScrollTrigger)"), 
            de(this), this.init(e, t);
        }
        init(e, t) {
            if (this.progress = this.start = 0, this.vars && this.kill(!0, !0), !we) return void (this.update = this.refresh = this.kill = Ee);
            e = Ue(Ie(e) || Xe(e) || e.nodeType ? {
                trigger: e
            } : e, tt);
            let r, i, s, o, a, n, l, c, d, p, h, g, u, f, m, x, b, _, T, S, k, C, A, R, D, Y, I, L, z, H, q, j, $, Q, ee, te, se, oe, ae, {onUpdate: ne, toggleClass: le, id: ce, onToggle: de, onRefresh: pe, scrub: ge, trigger: xe, pin: Se, pinSpacing: ke, invalidateOnRefresh: Ce, anticipatePin: Me, onScrubComplete: Oe, onSnapComplete: Ye, once: Ze, snap: Qe, pinReparent: rt, pinSpacer: ot, containerAnimation: lt, fastScrollEnd: dt, preventOverlaps: ht} = e, gt = e.horizontal || e.containerAnimation && !1 !== e.horizontal ? E : P, ft = !ge && 0 !== ge, mt = M(e.scroller || B), vt = X.core.getCache(mt), yt = Ae(mt), xt = "fixed" === ("pinType" in e ? e.pinType : w(mt, "pinType") || yt && "fixed"), _t = [ e.onEnter, e.onLeave, e.onEnterBack, e.onLeaveBack ], St = ft && e.toggleActions.split(" "), kt = "markers" in e ? e.markers : tt.markers, Ct = yt ? 0 : parseFloat(qe(mt)["border" + gt.p2 + "Width"]) || 0, Pt = this, Dt = e.onRefreshInit && (() => e.onRefreshInit(Pt)), It = ((e, t, {d: r, d2: i, a: s}) => (s = w(e, "getBoundingClientRect")) ? () => s()[r] : () => (t ? B["inner" + i] : e["client" + i]) || 0)(mt, yt, gt), Bt = ((e, t) => !t || ~y.indexOf(e) ? Re(e) : () => At)(mt, yt), Nt = 0, Ft = 0, Wt = 0, Ht = O(mt, gt);
            var qt;
            if (Pt._startClamp = Pt._endClamp = !1, Pt._dir = gt, Me *= 45, Pt.scroller = mt, 
            Pt.scroll = lt ? lt.time.bind(lt) : Ht, o = Ht(), Pt.vars = e, t = t || e.animation, 
            "refreshPriority" in e && (re = 1, -9999 === e.refreshPriority && (me = Pt)), vt.tweenScroll = vt.tweenScroll || {
                top: Xt(mt, P),
                left: Xt(mt, E)
            }, Pt.tweenTo = r = vt.tweenScroll[gt.p], Pt.scrubDuration = e => {
                $ = Xe(e) && e, $ ? j ? j.duration(e) : j = X.to(t, {
                    ease: "expo",
                    totalProgress: "+=0",
                    duration: $,
                    paused: !0,
                    onComplete: () => Oe && Oe(Pt)
                }) : (j && j.progress(1).kill(), j = 0);
            }, t && (t.vars.lazy = !1, t._initted && !Pt.isReverted || !1 !== t.vars.immediateRender && !1 !== e.immediateRender && t.duration() && t.render(0, !0, !0), 
            Pt.animation = t.pause(), t.scrollTrigger = Pt, Pt.scrubDuration(ge), H = 0, ce || (ce = t.vars.id)), 
            Qe && (ze(Qe) && !Qe.push || (Qe = {
                snapTo: Qe
            }), "scrollBehavior" in W.style && X.set(yt ? [ W, F ] : mt, {
                scrollBehavior: "auto"
            }), v.forEach((e => Le(e) && e.target === (yt ? N.scrollingElement || F : mt) && (e.smooth = !1))), 
            s = Le(Qe.snapTo) ? Qe.snapTo : "labels" === Qe.snapTo ? (e => t => X.utils.snap(je(e), t))(t) : "labelsDirectional" === Qe.snapTo ? (qt = t, 
            (e, t) => Ke(je(qt))(e, t.direction)) : !1 !== Qe.directional ? (e, t) => Ke(Qe.snapTo)(e, ye() - Ft < 500 ? 0 : t.direction) : X.utils.snap(Qe.snapTo), 
            Q = Qe.duration || {
                min: .1,
                max: 2
            }, Q = ze(Q) ? V(Q.min, Q.max) : V(Q, Q), ee = X.delayedCall(Qe.delay || $ / 2 || .1, (() => {
                let e = Ht(), i = ye() - Ft < 500, o = r.tween;
                if (!(i || Math.abs(Pt.getVelocity()) < 10) || o || Z || Nt === e) Pt.isActive && Nt !== e && ee.restart(!0); else {
                    let a = (e - n) / f, c = t && !ft ? t.totalProgress() : a, d = i ? 0 : (c - q) / (ye() - G) * 1e3 || 0, p = X.utils.clamp(-a, 1 - a, Fe(d / 2) * d / .185), h = a + (!1 === Qe.inertia ? 0 : p), g = V(0, 1, s(h, Pt)), u = Math.round(n + g * f), {onStart: m, onInterrupt: v, onComplete: y} = Qe;
                    if (e <= l && e >= n && u !== e) {
                        if (o && !o._initted && o.data <= Fe(u - e)) return;
                        !1 === Qe.inertia && (p = g - a), r(u, {
                            duration: Q(Fe(.185 * Math.max(Fe(h - c), Fe(g - c)) / d / .05 || 0)),
                            ease: Qe.ease || "power3",
                            data: Fe(u - e),
                            onInterrupt: () => ee.restart(!0) && v && v(Pt),
                            onComplete: () => {
                                Pt.update(), Nt = Ht(), H = q = t && !ft ? t.totalProgress() : Pt.progress, Ye && Ye(Pt), 
                                y && y(Pt);
                            }
                        }, e, p * f, u - e - p * f), m && m(Pt, r.tween);
                    }
                }
            })).pause()), ce && (nt[ce] = Pt), xe = Pt.trigger = M(xe || !0 !== Se && Se), ae = xe && xe._gsap && xe._gsap.stRevert, 
            ae && (ae = ae(Pt)), Se = !0 === Se ? xe : M(Se), Ie(le) && (le = {
                targets: xe,
                className: le
            }), Se && (!1 === ke || "margin" === ke || (ke = !(!ke && Se.parentNode && Se.parentNode.style && "flex" === qe(Se.parentNode).display) && We), 
            Pt.pin = Se, i = X.core.getCache(Se), i.spacer ? m = i.pinState : (ot && (ot = M(ot), 
            ot && !ot.nodeType && (ot = ot.current || ot.nativeElement), i.spacerIsNative = !!ot, 
            ot && (i.spacerState = Ot(ot))), i.spacer = _ = ot || N.createElement("div"), _.classList.add("pin-spacer"), 
            ce && _.classList.add("pin-spacer-" + ce), i.pinState = m = Ot(Se)), !1 !== e.force3D && X.set(Se, {
                force3D: !0
            }), Pt.spacer = _ = i.spacer, z = qe(Se), R = z[ke + gt.os2], S = X.getProperty(Se), 
            k = X.quickSetter(Se, gt.a, He), Et(Se, _, z), b = Ot(Se)), kt) {
                g = ze(kt) ? Ue(kt, et) : et, p = st("scroller-start", ce, mt, gt, g, 0), h = st("scroller-end", ce, mt, gt, g, 0, p), 
                T = p["offset" + gt.op.d2];
                let e = M(w(mt, "content") || mt);
                c = this.markerStart = st("start", ce, e, gt, g, T, 0, lt), d = this.markerEnd = st("end", ce, e, gt, g, T, 0, lt), 
                lt && (oe = X.quickSetter([ c, d ], gt.a, He)), xt || y.length && !0 === w(mt, "fixedMarkers") || ((e => {
                    let t = qe(e).position;
                    e.style.position = "absolute" === t || "fixed" === t ? t : "relative";
                })(yt ? W : mt), X.set([ p, h ], {
                    force3D: !0
                }), Y = X.quickSetter(p, gt.a, He), L = X.quickSetter(h, gt.a, He));
            }
            if (lt) {
                let e = lt.vars.onUpdate, t = lt.vars.onUpdateParams;
                lt.eventCallback("onUpdate", (() => {
                    Pt.update(0, 0, 1), e && e.apply(lt, t || []);
                }));
            }
            if (Pt.previous = () => at[at.indexOf(Pt) - 1], Pt.next = () => at[at.indexOf(Pt) + 1], 
            Pt.revert = (e, r) => {
                if (!r) return Pt.kill(!0);
                let i = !1 !== e || !Pt.enabled, s = K;
                i !== Pt.isReverted && (i && (te = Math.max(Ht(), Pt.scroll.rec || 0), Wt = Pt.progress, 
                se = t && t.progress()), c && [ c, d, p, h ].forEach((e => e.style.display = i ? "none" : "block")), 
                i && (K = Pt, Pt.update(i)), !Se || rt && Pt.isActive || (i ? ((e, t, r) => {
                    Mt(r);
                    let i = e._gsap;
                    if (i.spacerIsNative) Mt(i.spacerState); else if (e._gsap.swappedIn) {
                        let r = t.parentNode;
                        r && (r.insertBefore(e, t), r.removeChild(t));
                    }
                    e._gsap.swappedIn = !1;
                })(Se, _, m) : Et(Se, _, qe(Se), D)), i || Pt.update(i), K = s, Pt.isReverted = i);
            }, Pt.refresh = (i, s, g, v) => {
                if ((K || !Pt.enabled) && !s) return;
                if (Se && i && be) return void $e(zt, "scrollEnd", ut);
                !ue && Dt && Dt(Pt), K = Pt, r.tween && (r.tween.kill(), r.tween = 0), j && j.pause(), 
                Ce && t && t.revert({
                    kill: !1
                }).invalidate(), Pt.isReverted || Pt.revert(!0, !0), Pt._subPinOffset = !1;
                let y, w, T, k, R, Y, L, z, B, H, q, U, V, G = It(), Z = Bt(), $ = lt ? lt.duration() : De(mt, gt), J = f <= .01, Q = 0, re = v || 0, oe = ze(g) ? g.end : e.end, ae = e.endTrigger || xe, ne = ze(g) ? g.start : e.start || (0 !== e.start && xe ? Se ? "0 0" : "0 100%" : 0), le = Pt.pinnedContainer = e.pinnedContainer && M(e.pinnedContainer, Pt), ce = xe && Math.max(0, at.indexOf(Pt)) || 0, de = ce;
                for (kt && ze(g) && (U = X.getProperty(p, gt.p), V = X.getProperty(h, gt.p)); de--; ) Y = at[de], 
                Y.end || Y.refresh(0, 1) || (K = Pt), L = Y.pin, !L || L !== xe && L !== Se && L !== le || Y.isReverted || (H || (H = []), 
                H.unshift(Y), Y.revert(!0, !0)), Y !== at[de] && (ce--, de--);
                for (Le(ne) && (ne = ne(Pt)), ne = _e(ne, "start", Pt), n = Rt(ne, xe, G, gt, Ht(), c, p, Pt, Z, Ct, xt, $, lt, Pt._startClamp && "_startClamp") || (Se ? -.001 : 0), 
                Le(oe) && (oe = oe(Pt)), Ie(oe) && !oe.indexOf("+=") && (~oe.indexOf(" ") ? oe = (Ie(ne) ? ne.split(" ")[0] : "") + oe : (Q = it(oe.substr(2), G), 
                oe = Ie(ne) ? ne : (lt ? X.utils.mapRange(0, lt.duration(), lt.scrollTrigger.start, lt.scrollTrigger.end, n) : n) + Q, 
                ae = xe)), oe = _e(oe, "end", Pt), l = Math.max(n, Rt(oe || (ae ? "100% 0" : $), ae, G, gt, Ht() + Q, d, h, Pt, Z, Ct, xt, $, lt, Pt._endClamp && "_endClamp")) || -.001, 
                Q = 0, de = ce; de--; ) Y = at[de], L = Y.pin, L && Y.start - Y._pinPush <= n && !lt && Y.end > 0 && (y = Y.end - (Pt._startClamp ? Math.max(0, Y.start) : Y.start), 
                (L === xe && Y.start - Y._pinPush < n || L === le) && isNaN(ne) && (Q += y * (1 - Y.progress)), 
                L === Se && (re += y));
                if (n += Q, l += Q, Pt._startClamp && (Pt._startClamp += Q), Pt._endClamp && !ue && (Pt._endClamp = l || -.001, 
                l = Math.min(l, De(mt, gt))), f = l - n || (n -= .01) && .001, J && (Wt = X.utils.clamp(0, 1, X.utils.normalize(n, l, te))), 
                Pt._pinPush = re, c && Q && (y = {}, y[gt.a] = "+=" + Q, le && (y[gt.p] = "-=" + Ht()), 
                X.set([ c, d ], y)), Se) y = qe(Se), k = gt === P, T = Ht(), C = parseFloat(S(gt.a)) + re, 
                !$ && l > 1 && (q = (yt ? N.scrollingElement || F : mt).style, q = {
                    style: q,
                    value: q["overflow" + gt.a.toUpperCase()]
                }, yt && "scroll" !== qe(W)["overflow" + gt.a.toUpperCase()] && (q.style["overflow" + gt.a.toUpperCase()] = "scroll")), 
                Et(Se, _, y), b = Ot(Se), w = Ve(Se, !0), z = xt && O(mt, k ? E : P)(), ke && (D = [ ke + gt.os2, f + re + He ], 
                D.t = _, de = ke === We ? Ge(Se, gt) + f + re : 0, de && D.push(gt.d, de + He), 
                Mt(D), le && at.forEach((e => {
                    e.pin === le && !1 !== e.vars.pinSpacing && (e._subPinOffset = !0);
                })), xt && Ht(te)), xt && (R = {
                    top: w.top + (k ? T - n : z) + He,
                    left: w.left + (k ? z : T - n) + He,
                    boxSizing: "border-box",
                    position: "fixed"
                }, R.width = R.maxWidth = Math.ceil(w.width) + He, R.height = R.maxHeight = Math.ceil(w.height) + He, 
                R.margin = R.marginTop = R.marginRight = R.marginBottom = R.marginLeft = "0", R.padding = y.padding, 
                R.paddingTop = y.paddingTop, R.paddingRight = y.paddingRight, R.paddingBottom = y.paddingBottom, 
                R.paddingLeft = y.paddingLeft, x = ((e, t, r) => {
                    let i, s = [], o = e.length, a = r ? 8 : 0;
                    for (;a < o; a += 2) i = e[a], s.push(i, i in t ? t[i] : e[a + 1]);
                    return s.t = e.t, s;
                })(m, R, rt), ue && Ht(0)), t ? (B = t._initted, ie(1), t.render(t.duration(), !0, !0), 
                A = S(gt.a) - C + f + re, I = Math.abs(f - A) > 1, xt && I && x.splice(x.length - 2, 2), 
                t.render(0, !0, !0), B || t.invalidate(!0), t.parent || t.totalTime(t.totalTime()), 
                ie(0)) : A = f, q && (q.value ? q.style["overflow" + gt.a.toUpperCase()] = q.value : q.style.removeProperty("overflow-" + gt.a)); else if (xe && Ht() && !lt) for (w = xe.parentNode; w && w !== W; ) w._pinOffset && (n -= w._pinOffset, 
                l -= w._pinOffset), w = w.parentNode;
                H && H.forEach((e => e.revert(!1, !0))), Pt.start = n, Pt.end = l, o = a = ue ? te : Ht(), 
                lt || ue || (o < te && Ht(te), Pt.scroll.rec = 0), Pt.revert(!1, !0), Ft = ye(), 
                ee && (Nt = -1, Pt.isActive && Ht(n + f * Wt), ee.restart(!0)), K = 0, t && ft && (t._initted || se) && t.progress() !== se && t.progress(se || 0, !0).render(t.time(), !0, !0), 
                (J || Wt !== Pt.progress || lt) && (t && !ft && t.totalProgress(lt && n < -.001 && !Wt ? X.utils.normalize(n, l, 0) : Wt, !0), 
                Pt.progress = J || (o - n) / f === Wt ? 0 : Wt), Se && ke && (_._pinOffset = Math.round(Pt.progress * A)), 
                j && j.invalidate(), isNaN(U) || (U -= X.getProperty(p, gt.p), V -= X.getProperty(h, gt.p), 
                Lt(p, gt, U), Lt(c, gt, U - (v || 0)), Lt(h, gt, V), Lt(d, gt, V - (v || 0))), J && !ue && Pt.update(), 
                !pe || ue || u || (u = !0, pe(Pt), u = !1);
            }, Pt.getVelocity = () => (Ht() - a) / (ye() - G) * 1e3 || 0, Pt.endAnimation = () => {
                Be(Pt.callbackAnimation), t && (j ? j.progress(1) : t.paused() ? ft || Be(t, Pt.direction < 0, 1) : Be(t, t.reversed()));
            }, Pt.labelToScroll = e => t && t.labels && (n || Pt.refresh() || n) + t.labels[e] / t.duration() * f || 0, 
            Pt.getTrailing = e => {
                let t = at.indexOf(Pt), r = Pt.direction > 0 ? at.slice(0, t).reverse() : at.slice(t + 1);
                return (Ie(e) ? r.filter((t => t.vars.preventOverlaps === e)) : r).filter((e => Pt.direction > 0 ? e.end <= n : e.start >= l));
            }, Pt.update = (e, i, s) => {
                if (lt && !s && !e) return;
                let c, d, h, g, u, m, v, y, w = !0 === ue ? te : Pt.scroll(), T = e ? 0 : (w - n) / f, S = T < 0 ? 0 : T > 1 ? 1 : T || 0, E = Pt.progress;
                if (i && (a = o, o = lt ? Ht() : w, Qe && (q = H, H = t && !ft ? t.totalProgress() : S)), 
                Me && !S && Se && !K && !ve && be && n < w + (w - a) / (ye() - G) * Me && (S = 1e-4), 
                S !== E && Pt.enabled) {
                    if (c = Pt.isActive = !!S && S < 1, d = !!E && E < 1, m = c !== d, u = m || !!S != !!E, 
                    Pt.direction = S > E ? 1 : -1, Pt.progress = S, u && !K && (h = S && !E ? 0 : 1 === S ? 1 : 1 === E ? 2 : 3, 
                    ft && (g = !m && "none" !== St[h + 1] && St[h + 1] || St[h], y = t && ("complete" === g || "reset" === g || g in t))), 
                    ht && (m || y) && (y || ge || !t) && (Le(ht) ? ht(Pt) : Pt.getTrailing(ht).forEach((e => e.endAnimation()))), 
                    ft || (!j || K || ve ? t && t.totalProgress(S, !(!K || !Ft && !e)) : (j._dp._time - j._start !== j._time && j.render(j._dp._time - j._start), 
                    j.resetTo ? j.resetTo("totalProgress", S, t._tTime / t._tDur) : (j.vars.totalProgress = S, 
                    j.invalidate().restart()))), Se) if (e && ke && (_.style[ke + gt.os2] = R), xt) {
                        if (u) {
                            if (v = !e && S > E && l + 1 > w && w + 1 >= De(mt, gt), rt) if (e || !c && !v) Yt(Se, _); else {
                                let e = Ve(Se, !0), t = w - n;
                                Yt(Se, W, e.top + (gt === P ? t : 0) + He, e.left + (gt === P ? 0 : t) + He);
                            }
                            Mt(c || v ? x : b), I && S < 1 && c || k(C + (1 !== S || v ? 0 : A));
                        }
                    } else k(Pe(C + A * S));
                    Qe && !r.tween && !K && !ve && ee.restart(!0), le && (m || Ze && S && (S < 1 || !he)) && U(le.targets).forEach((e => e.classList[c || Ze ? "add" : "remove"](le.className))), 
                    ne && !ft && !e && ne(Pt), u && !K ? (ft && (y && ("complete" === g ? t.pause().totalProgress(1) : "reset" === g ? t.restart(!0).pause() : "restart" === g ? t.restart(!0) : t[g]()), 
                    ne && ne(Pt)), !m && he || (de && m && Ne(Pt, de), _t[h] && Ne(Pt, _t[h]), Ze && (1 === S ? Pt.kill(!1, 1) : _t[h] = 0), 
                    m || (h = 1 === S ? 1 : 3, _t[h] && Ne(Pt, _t[h]))), dt && !c && Math.abs(Pt.getVelocity()) > (Xe(dt) ? dt : 2500) && (Be(Pt.callbackAnimation), 
                    j ? j.progress(1) : Be(t, "reverse" === g ? 1 : !S, 1))) : ft && ne && !K && ne(Pt);
                }
                if (L) {
                    let e = lt ? w / lt.duration() * (lt._caScrollDist || 0) : w;
                    Y(e + (p._isFlipped ? 1 : 0)), L(e);
                }
                oe && oe(-w / lt.duration() * (lt._caScrollDist || 0));
            }, Pt.enable = (e, t) => {
                Pt.enabled || (Pt.enabled = !0, $e(mt, "resize", pt), $e(yt ? N : mt, "scroll", ct), 
                Dt && $e(zt, "refreshInit", Dt), !1 !== e && (Pt.progress = Wt = 0, o = a = Nt = Ht()), 
                !1 !== t && Pt.refresh());
            }, Pt.getTween = e => e && r ? r.tween : j, Pt.setPositions = (e, t, r, i) => {
                if (lt) {
                    let r = lt.scrollTrigger, i = lt.duration(), s = r.end - r.start;
                    e = r.start + s * e / i, t = r.start + s * t / i;
                }
                Pt.refresh(!1, !1, {
                    start: Te(e, r && !!Pt._startClamp),
                    end: Te(t, r && !!Pt._endClamp)
                }, i), Pt.update();
            }, Pt.adjustPinSpacing = e => {
                if (D && e) {
                    let t = D.indexOf(gt.d) + 1;
                    D[t] = parseFloat(D[t]) + e + He, D[1] = parseFloat(D[1]) + e + He, Mt(D);
                }
            }, Pt.disable = (e, t) => {
                if (Pt.enabled && (!1 !== e && Pt.revert(!0, !0), Pt.enabled = Pt.isActive = !1, 
                t || j && j.pause(), te = 0, i && (i.uncache = 1), Dt && Je(zt, "refreshInit", Dt), 
                ee && (ee.pause(), r.tween && r.tween.kill() && (r.tween = 0)), !yt)) {
                    let e = at.length;
                    for (;e--; ) if (at[e].scroller === mt && at[e] !== Pt) return;
                    Je(mt, "resize", pt), Je(mt, "scroll", ct);
                }
            }, Pt.kill = (r, s) => {
                Pt.disable(r, s), j && !s && j.kill(), ce && delete nt[ce];
                let o = at.indexOf(Pt);
                o >= 0 && at.splice(o, 1), o === J && Tt > 0 && J--, o = 0, at.forEach((e => e.scroller === Pt.scroller && (o = 1))), 
                o || ue || (Pt.scroll.rec = 0), t && (t.scrollTrigger = null, r && t.revert({
                    kill: !1
                }), s || t.kill()), c && [ c, d, p, h ].forEach((e => e.parentNode && e.parentNode.removeChild(e))), 
                me === Pt && (me = 0), Se && (i && (i.uncache = 1), o = 0, at.forEach((e => e.pin === Se && o++)), 
                o || (i.spacer = 0)), e.onKill && e.onKill(Pt);
            }, at.push(Pt), Pt.enable(!1, !1), ae && ae(Pt), t && t.add && !f) {
                let e = Pt.update;
                Pt.update = () => {
                    Pt.update = e, n || l || Pt.refresh();
                }, X.delayedCall(.01, Pt.update), f = .01, n = l = 0;
            } else Pt.refresh();
            Se && (() => {
                if (fe !== bt) {
                    let e = fe = bt;
                    requestAnimationFrame((() => e === bt && wt(!0)));
                }
            })();
        }
        static register(e) {
            return z || (X = e || Oe(), Me() && window.document && zt.enable(), z = we), z;
        }
        static defaults(e) {
            if (e) for (let t in e) tt[t] = e[t];
            return tt;
        }
        static disable(e, t) {
            we = 0, at.forEach((r => r[t ? "kill" : "disable"](e))), Je(B, "wheel", ct), Je(N, "scroll", ct), 
            clearInterval(j), Je(N, "touchcancel", Ee), Je(W, "touchstart", Ee), Ze(Je, N, "pointerdown,touchstart,mousedown", ke), 
            Ze(Je, N, "pointerup,touchend,mouseup", Ce), q.kill(), Ye(Je);
            for (let e = 0; e < v.length; e += 3) Qe(Je, v[e], v[e + 1]), Qe(Je, v[e], v[e + 2]);
        }
        static enable() {
            if (B = window, N = document, F = N.documentElement, W = N.body, X && (U = X.utils.toArray, 
            V = X.utils.clamp, de = X.core.context || Ee, ie = X.core.suppressOverwrites || Ee, 
            pe = B.history.scrollRestoration || "auto", _t = B.pageYOffset, X.core.globals("ScrollTrigger", zt), 
            W)) {
                we = 1, Se(), L.register(X), zt.isTouch = L.isTouch, ce = L.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent), 
                $e(B, "wheel", ct), H = [ B, N, F, W ], X.matchMedia ? (zt.matchMedia = e => {
                    let t, r = X.matchMedia();
                    for (t in e) r.add(t, e[t]);
                    return r;
                }, X.addEventListener("matchMediaInit", (() => yt())), X.addEventListener("matchMediaRevert", (() => vt())), 
                X.addEventListener("matchMedia", (() => {
                    wt(0, 1), ft("matchMedia");
                })), X.matchMedia("(orientation: portrait)", (() => (dt(), dt)))) : console.warn("Requires GSAP 3.11.0 or later"), 
                dt(), $e(N, "scroll", ct);
                let e, t, r = W.style, i = r.borderTopStyle, s = X.core.Animation.prototype;
                for (s.revert || Object.defineProperty(s, "revert", {
                    value: function() {
                        return this.time(-.01, !0);
                    }
                }), r.borderTopStyle = "solid", e = Ve(W), P.m = Math.round(e.top + P.sc()) || 0, 
                E.m = Math.round(e.left + E.sc()) || 0, i ? r.borderTopStyle = i : r.removeProperty("border-top-style"), 
                j = setInterval(lt, 250), X.delayedCall(.5, (() => ve = 0)), $e(N, "touchcancel", Ee), 
                $e(W, "touchstart", Ee), Ze($e, N, "pointerdown,touchstart,mousedown", ke), Ze($e, N, "pointerup,touchend,mouseup", Ce), 
                $ = X.utils.checkPrefix("transform"), Ct.push($), z = ye(), q = X.delayedCall(.2, wt).pause(), 
                te = [ N, "visibilitychange", () => {
                    let e = B.innerWidth, t = B.innerHeight;
                    N.hidden ? (Q = e, ee = t) : Q === e && ee === t || pt();
                }, N, "DOMContentLoaded", wt, B, "load", wt, B, "resize", pt ], Ye($e), at.forEach((e => e.enable(0, 1))), 
                t = 0; t < v.length; t += 3) Qe(Je, v[t], v[t + 1]), Qe(Je, v[t], v[t + 2]);
            }
        }
        static config(e) {
            "limitCallbacks" in e && (he = !!e.limitCallbacks);
            let t = e.syncInterval;
            t && clearInterval(j) || (j = t) && setInterval(lt, t), "ignoreMobileResize" in e && (ae = 1 === zt.isTouch && e.ignoreMobileResize), 
            "autoRefreshEvents" in e && (Ye(Je) || Ye($e, e.autoRefreshEvents || "none"), se = -1 === (e.autoRefreshEvents + "").indexOf("resize"));
        }
        static scrollerProxy(e, t) {
            let r = M(e), i = v.indexOf(r), s = Ae(r);
            ~i && v.splice(i, s ? 6 : 2), t && (s ? y.unshift(B, t, W, t, F, t) : y.unshift(r, t));
        }
        static clearMatchMedia(e) {
            at.forEach((t => t._ctx && t._ctx.query === e && t._ctx.kill(!0, !0)));
        }
        static isInViewport(e, t, r) {
            let i = (Ie(e) ? M(e) : e).getBoundingClientRect(), s = i[r ? "width" : "height"] * t || 0;
            return r ? i.right - s > 0 && i.left + s < B.innerWidth : i.bottom - s > 0 && i.top + s < B.innerHeight;
        }
        static positionInViewport(e, t, r) {
            Ie(e) && (e = M(e));
            let i = e.getBoundingClientRect(), s = i[r ? "width" : "height"], o = null == t ? s / 2 : t in rt ? rt[t] * s : ~t.indexOf("%") ? parseFloat(t) * s / 100 : parseFloat(t) || 0;
            return r ? (i.left + o) / B.innerWidth : (i.top + o) / B.innerHeight;
        }
        static killAll(e) {
            if (at.slice(0).forEach((e => "ScrollSmoother" !== e.vars.id && e.kill())), !0 !== e) {
                let e = ht.killAll || [];
                ht = {}, e.forEach((e => e()));
            }
        }
    }
    zt.version = "3.12.1", zt.saveStyles = e => e ? U(e).forEach((e => {
        if (e && e.style) {
            let t = mt.indexOf(e);
            t >= 0 && mt.splice(t, 5), mt.push(e, e.style.cssText, e.getBBox && e.getAttribute("transform"), X.core.getCache(e), de());
        }
    })) : mt, zt.revert = (e, t) => yt(!e, t), zt.create = (e, t) => new zt(e, t), zt.refresh = e => e ? pt() : (z || zt.register()) && wt(!0), 
    zt.update = e => ++v.cache && St(!0 === e ? 2 : 0), zt.clearScrollMemory = xt, zt.maxScroll = (e, t) => De(e, t ? E : P), 
    zt.getScrollFunc = (e, t) => O(M(e), t ? E : P), zt.getById = e => nt[e], zt.getAll = () => at.filter((e => "ScrollSmoother" !== e.vars.id)), 
    zt.isScrolling = () => !!be, zt.snapDirectional = Ke, zt.addEventListener = (e, t) => {
        let r = ht[e] || (ht[e] = []);
        ~r.indexOf(t) || r.push(t);
    }, zt.removeEventListener = (e, t) => {
        let r = ht[e], i = r && r.indexOf(t);
        i >= 0 && r.splice(i, 1);
    }, zt.batch = (e, t) => {
        let r, i = [], s = {}, o = t.interval || .016, a = t.batchMax || 1e9, n = (e, t) => {
            let r = [], i = [], s = X.delayedCall(o, (() => {
                t(r, i), r = [], i = [];
            })).pause();
            return e => {
                r.length || s.restart(!0), r.push(e.trigger), i.push(e), a <= r.length && s.progress(1);
            };
        };
        for (r in t) s[r] = "on" === r.substr(0, 2) && Le(t[r]) && "onRefreshInit" !== r ? n(0, t[r]) : t[r];
        return Le(a) && (a = a(), $e(zt, "refresh", (() => a = t.batchMax()))), U(e).forEach((e => {
            let t = {};
            for (r in s) t[r] = s[r];
            t.trigger = e, i.push(zt.create(t));
        })), i;
    };
    let Bt, Nt = (e, t, r, i) => (t > i ? e(i) : t < 0 && e(0), r > i ? (i - t) / (r - t) : r < 0 ? t / (t - r) : 1), Ft = (e, t) => {
        !0 === t ? e.style.removeProperty("touch-action") : e.style.touchAction = !0 === t ? "auto" : t ? "pan-" + t + (L.isTouch ? " pinch-zoom" : "") : "none", 
        e === F && Ft(W, t);
    }, Wt = {
        auto: 1,
        scroll: 1
    }, Ht = ({event: e, target: t, axis: r}) => {
        let i, s = (e.changedTouches ? e.changedTouches[0] : e).target, o = s._gsap || X.core.getCache(s), a = ye();
        if (!o._isScrollT || a - o._isScrollT > 2e3) {
            for (;s && s !== W && (s.scrollHeight <= s.clientHeight && s.scrollWidth <= s.clientWidth || !Wt[(i = qe(s)).overflowY] && !Wt[i.overflowX]); ) s = s.parentNode;
            o._isScroll = s && s !== t && !Ae(s) && (Wt[(i = qe(s)).overflowY] || Wt[i.overflowX]), 
            o._isScrollT = a;
        }
        (o._isScroll || "x" === r) && (e.stopPropagation(), e._gsapAllow = !0);
    }, qt = (e, t, r, i) => L.create({
        target: e,
        capture: !0,
        debounce: !1,
        lockAxis: !0,
        type: t,
        onWheel: i = i && Ht,
        onPress: i,
        onDrag: i,
        onScroll: i,
        onEnable: () => r && $e(N, L.eventTypes[0], Vt, !1, !0),
        onDisable: () => Je(N, L.eventTypes[0], Vt, !0)
    }), Ut = /(input|label|select|textarea)/i, Vt = e => {
        let t = Ut.test(e.target.tagName);
        (t || Bt) && (e._gsapAllow = !0, Bt = t);
    }, Gt = e => {
        ze(e) || (e = {}), e.preventDefault = e.isNormalizer = e.allowClicks = !0, e.type || (e.type = "wheel,touch"), 
        e.debounce = !!e.debounce, e.id = e.id || "normalizer";
        let t, r, i, s, o, a, n, l, {normalizeScrollX: c, momentum: d, allowNestedScroll: p, onRelease: h} = e, g = M(e.target) || F, u = X.core.globals().ScrollSmoother, f = u && u.get(), m = ce && (e.content && M(e.content) || f && !1 !== e.content && !f.smooth() && f.content()), y = O(g, P), x = O(g, E), b = 1, w = (L.isTouch && B.visualViewport ? B.visualViewport.scale * B.visualViewport.width : B.outerWidth) / B.innerWidth, _ = 0, T = Le(d) ? () => d(t) : () => d || 2.8, S = qt(g, e.type, !0, p), k = () => s = !1, C = Ee, A = Ee, R = () => {
            r = De(g, P), A = V(ce ? 1 : 0, r), c && (C = V(0, De(g, E))), i = bt;
        }, D = () => {
            m._gsap.y = Pe(parseFloat(m._gsap.y) + y.offset) + "px", m.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(m._gsap.y) + ", 0, 1)", 
            y.offset = y.cacheID = 0;
        }, Y = () => {
            R(), o.isActive() && o.vars.scrollY > r && (y() > r ? o.progress(1) && y(r) : o.resetTo("scrollY", r));
        };
        return m && X.set(m, {
            y: "+=0"
        }), e.ignoreCheck = e => ce && "touchmove" === e.type && (() => {
            if (s) {
                requestAnimationFrame(k);
                let e = Pe(t.deltaY / 2), r = A(y.v - e);
                if (m && r !== y.v + y.offset) {
                    y.offset = r - y.v;
                    let e = Pe((parseFloat(m && m._gsap.y) || 0) - y.offset);
                    m.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + e + ", 0, 1)", 
                    m._gsap.y = e + "px", y.cacheID = v.cache, St();
                }
                return !0;
            }
            y.offset && D(), s = !0;
        })() || b > 1.05 && "touchstart" !== e.type || t.isGesturing || e.touches && e.touches.length > 1, 
        e.onPress = () => {
            s = !1;
            let e = b;
            b = Pe((B.visualViewport && B.visualViewport.scale || 1) / w), o.pause(), e !== b && Ft(g, b > 1.01 || !c && "x"), 
            a = x(), n = y(), R(), i = bt;
        }, e.onRelease = e.onGestureStart = (e, t) => {
            if (y.offset && D(), t) {
                v.cache++;
                let t, i, s = T();
                c && (t = x(), i = t + .05 * s * -e.velocityX / .227, s *= Nt(x, t, i, De(g, E)), 
                o.vars.scrollX = C(i)), t = y(), i = t + .05 * s * -e.velocityY / .227, s *= Nt(y, t, i, De(g, P)), 
                o.vars.scrollY = A(i), o.invalidate().duration(s).play(.01), (ce && o.vars.scrollY >= r || t >= r - 1) && X.to({}, {
                    onUpdate: Y,
                    duration: s
                });
            } else l.restart(!0);
            h && h(e);
        }, e.onWheel = () => {
            o._ts && o.pause(), ye() - _ > 1e3 && (i = 0, _ = ye());
        }, e.onChange = (e, t, r, s, o) => {
            if (bt !== i && R(), t && c && x(C(s[2] === t ? a + (e.startX - e.x) : x() + t - s[1])), 
            r) {
                y.offset && D();
                let t = o[2] === r, i = t ? n + e.startY - e.y : y() + r - o[1], s = A(i);
                t && i !== s && (n += s - i), y(s);
            }
            (r || t) && St();
        }, e.onEnable = () => {
            Ft(g, !c && "x"), zt.addEventListener("refresh", Y), $e(B, "resize", Y), y.smooth && (y.target.style.scrollBehavior = "auto", 
            y.smooth = x.smooth = !1), S.enable();
        }, e.onDisable = () => {
            Ft(g, !0), Je(B, "resize", Y), zt.removeEventListener("refresh", Y), S.kill();
        }, e.lockAxis = !1 !== e.lockAxis, t = new L(e), t.iOS = ce, ce && !y() && y(1), 
        ce && X.ticker.add(Ee), l = t._dc, o = X.to(t, {
            ease: "power4",
            paused: !0,
            scrollX: c ? "+=0.1" : "+=0",
            scrollY: "+=0.1",
            modifiers: {
                scrollY: It(y, y(), (() => o.pause()))
            },
            onUpdate: St,
            onComplete: l.vars.onComplete
        }), t;
    };
    zt.sort = e => at.sort(e || ((e, t) => -1e6 * (e.vars.refreshPriority || 0) + e.start - (t.start + -1e6 * (t.vars.refreshPriority || 0)))), 
    zt.observe = e => new L(e), zt.normalizeScroll = e => {
        if (void 0 === e) return oe;
        if (!0 === e && oe) return oe.enable();
        if (!1 === e) return oe && oe.kill();
        let t = e instanceof L ? e : Gt(e);
        return oe && oe.target === t.target && oe.kill(), Ae(t.target) && (oe = t), t;
    }, zt.core = {
        _getVelocityProp: A,
        _inputObserver: qt,
        _scrollers: v,
        _proxies: y,
        bridge: {
            ss: () => {
                be || ft("scrollStart"), be = ye();
            },
            ref: () => K
        }
    }, Oe() && X.registerPlugin(zt);
    /*!
 * ScrollSmoother 3.12.1
 * https://greensock.com
 * 
 * @license Copyright 2023, GreenSock. All rights reserved.
 * *** DO NOT DEPLOY THIS FILE ***
 * This is a trial version that only works locally and on domains like codepen.io and codesandbox.io.
 * Loading it on an unauthorized domain violates the license and will cause a redirect.
 * Get the unrestricted file by joining Club GreenSock at https://greensock.com/club
 * @author: Jack Doyle, jack@greensock.com
 */
    let ScrollSmoother_e, ScrollSmoother_t, ScrollSmoother_r, ScrollSmoother_o, ScrollSmoother_s, ScrollSmoother_i, ScrollSmoother_n, ScrollSmoother_a, ScrollSmoother_l, ScrollSmoother_c, ScrollSmoother_d, ScrollSmoother_h, ScrollSmoother_f, ScrollSmoother_g, ScrollSmoother_p, ScrollSmoother_u = () => "undefined" != typeof window, ScrollSmoother_m = () => ScrollSmoother_e || ScrollSmoother_u() && (ScrollSmoother_e = window.gsap) && ScrollSmoother_e.registerPlugin && ScrollSmoother_e, ScrollSmoother_v = function() {
        return String.fromCharCode.apply(null, arguments);
    }, ScrollSmoother_y = ScrollSmoother_v(103, 114, 101, 101, 110, 115, 111, 99, 107, 46, 99, 111, 109), ScrollSmoother_w = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}:?\d*$/, ScrollSmoother_b = (function(t) {
        var r = "undefined" != typeof window, o = 0 === (r ? window.location.href : "").indexOf(ScrollSmoother_v(102, 105, 108, 101, 58, 47, 47)) || -1 !== t.indexOf(ScrollSmoother_v(108, 111, 99, 97, 108, 104, 111, 115, 116)) || ScrollSmoother_w.test(t), s = [ ScrollSmoother_y, ScrollSmoother_v(99, 111, 100, 101, 112, 101, 110, 46, 105, 111), ScrollSmoother_v(99, 111, 100, 101, 112, 101, 110, 46, 112, 108, 117, 109, 98, 105, 110, 103), ScrollSmoother_v(99, 111, 100, 101, 112, 101, 110, 46, 100, 101, 118), ScrollSmoother_v(99, 111, 100, 101, 112, 101, 110, 46, 97, 112, 112), ScrollSmoother_v(99, 111, 100, 101, 112, 101, 110, 46, 119, 101, 98, 115, 105, 116, 101), ScrollSmoother_v(112, 101, 110, 115, 46, 99, 108, 111, 117, 100), ScrollSmoother_v(99, 115, 115, 45, 116, 114, 105, 99, 107, 115, 46, 99, 111, 109), ScrollSmoother_v(99, 100, 112, 110, 46, 105, 111), ScrollSmoother_v(112, 101, 110, 115, 46, 105, 111), ScrollSmoother_v(103, 97, 110, 110, 111, 110, 46, 116, 118), ScrollSmoother_v(99, 111, 100, 101, 99, 97, 110, 121, 111, 110, 46, 110, 101, 116), ScrollSmoother_v(116, 104, 101, 109, 101, 102, 111, 114, 101, 115, 116, 46, 110, 101, 116), ScrollSmoother_v(99, 101, 114, 101, 98, 114, 97, 120, 46, 99, 111, 46, 117, 107), ScrollSmoother_v(116, 121, 109, 112, 97, 110, 117, 115, 46, 110, 101, 116), ScrollSmoother_v(116, 119, 101, 101, 110, 109, 97, 120, 46, 99, 111, 109), ScrollSmoother_v(112, 108, 110, 107, 114, 46, 99, 111), ScrollSmoother_v(104, 111, 116, 106, 97, 114, 46, 99, 111, 109), ScrollSmoother_v(119, 101, 98, 112, 97, 99, 107, 98, 105, 110, 46, 99, 111, 109), ScrollSmoother_v(97, 114, 99, 104, 105, 118, 101, 46, 111, 114, 103), ScrollSmoother_v(99, 111, 100, 101, 115, 97, 110, 100, 98, 111, 120, 46, 105, 111), ScrollSmoother_v(99, 115, 98, 46, 97, 112, 112), ScrollSmoother_v(115, 116, 97, 99, 107, 98, 108, 105, 116, 122, 46, 99, 111, 109), ScrollSmoother_v(115, 116, 97, 99, 107, 98, 108, 105, 116, 122, 46, 105, 111), ScrollSmoother_v(99, 111, 100, 105, 101, 114, 46, 105, 111), ScrollSmoother_v(109, 111, 116, 105, 111, 110, 116, 114, 105, 99, 107, 115, 46, 99, 111, 109), ScrollSmoother_v(115, 116, 97, 99, 107, 111, 118, 101, 114, 102, 108, 111, 119, 46, 99, 111, 109), ScrollSmoother_v(115, 116, 97, 99, 107, 101, 120, 99, 104, 97, 110, 103, 101, 46, 99, 111, 109), ScrollSmoother_v(115, 116, 117, 100, 105, 111, 102, 114, 101, 105, 103, 104, 116, 46, 99, 111, 109), ScrollSmoother_v(119, 101, 98, 99, 111, 110, 116, 97, 105, 110, 101, 114, 46, 105, 111), ScrollSmoother_v(106, 115, 102, 105, 100, 100, 108, 101, 46, 110, 101, 116) ], i = function() {
            if (r) if ("loading" === document.readyState || "interactive" === document.readyState) document.addEventListener("readystatechange", i); else {
                document.removeEventListener("readystatechange", i);
                var t = "object" == typeof ScrollSmoother_e ? ScrollSmoother_e : r && window.gsap;
                r && window.console && !window._gsapWarned && "object" == typeof t && !1 !== t.config().trialWarn && (console.log(ScrollSmoother_v(37, 99, 87, 97, 114, 110, 105, 110, 103), ScrollSmoother_v(102, 111, 110, 116, 45, 115, 105, 122, 101, 58, 51, 48, 112, 120, 59, 99, 111, 108, 111, 114, 58, 114, 101, 100, 59)), 
                console.log(ScrollSmoother_v(65, 32, 116, 114, 105, 97, 108, 32, 118, 101, 114, 115, 105, 111, 110, 32, 111, 102, 32) + "ScrollSmoother" + ScrollSmoother_v(32, 105, 115, 32, 108, 111, 97, 100, 101, 100, 32, 116, 104, 97, 116, 32, 111, 110, 108, 121, 32, 119, 111, 114, 107, 115, 32, 108, 111, 99, 97, 108, 108, 121, 32, 97, 110, 100, 32, 111, 110, 32, 100, 111, 109, 97, 105, 110, 115, 32, 108, 105, 107, 101, 32, 99, 111, 100, 101, 112, 101, 110, 46, 105, 111, 32, 97, 110, 100, 32, 99, 111, 100, 101, 115, 97, 110, 100, 98, 111, 120, 46, 105, 111, 46, 32, 42, 42, 42, 32, 68, 79, 32, 78, 79, 84, 32, 68, 69, 80, 76, 79, 89, 32, 84, 72, 73, 83, 32, 70, 73, 76, 69, 32, 42, 42, 42, 32, 76, 111, 97, 100, 105, 110, 103, 32, 105, 116, 32, 111, 110, 32, 97, 110, 32, 117, 110, 97, 117, 116, 104, 111, 114, 105, 122, 101, 100, 32, 115, 105, 116, 101, 32, 118, 105, 111, 108, 97, 116, 101, 115, 32, 116, 104, 101, 32, 108, 105, 99, 101, 110, 115, 101, 32, 97, 110, 100, 32, 119, 105, 108, 108, 32, 99, 97, 117, 115, 101, 32, 97, 32, 114, 101, 100, 105, 114, 101, 99, 116, 46, 32, 80, 108, 101, 97, 115, 101, 32, 106, 111, 105, 110, 32, 67, 108, 117, 98, 32, 71, 114, 101, 101, 110, 83, 111, 99, 107, 32, 116, 111, 32, 103, 101, 116, 32, 102, 117, 108, 108, 32, 97, 99, 99, 101, 115, 115, 32, 116, 111, 32, 116, 104, 101, 32, 98, 111, 110, 117, 115, 32, 112, 108, 117, 103, 105, 110, 115, 32, 116, 104, 97, 116, 32, 98, 111, 111, 115, 116, 32, 121, 111, 117, 114, 32, 97, 110, 105, 109, 97, 116, 105, 111, 110, 32, 115, 117, 112, 101, 114, 112, 111, 119, 101, 114, 115, 46, 32, 68, 105, 115, 97, 98, 108, 101, 32, 116, 104, 105, 115, 32, 119, 97, 114, 110, 105, 110, 103, 32, 119, 105, 116, 104, 32, 103, 115, 97, 112, 46, 99, 111, 110, 102, 105, 103, 40, 123, 116, 114, 105, 97, 108, 87, 97, 114, 110, 58, 32, 102, 97, 108, 115, 101, 125, 41, 59)), 
                console.log(ScrollSmoother_v(37, 99, 71, 101, 116, 32, 117, 110, 114, 101, 115, 116, 114, 105, 99, 116, 101, 100, 32, 102, 105, 108, 101, 115, 32, 97, 116, 32, 104, 116, 116, 112, 115, 58, 47, 47, 103, 114, 101, 101, 110, 115, 111, 99, 107, 46, 99, 111, 109, 47, 99, 108, 117, 98), ScrollSmoother_v(102, 111, 110, 116, 45, 115, 105, 122, 101, 58, 49, 54, 112, 120, 59, 99, 111, 108, 111, 114, 58, 35, 52, 101, 57, 56, 49, 53)), 
                window._gsapWarned = 1);
            }
        }, n = s.length;
        for (setTimeout(i, 50); --n > -1; ) if (-1 !== t.indexOf(s[n])) return !0;
        o || setTimeout((function() {
            r && (window.location.href = ScrollSmoother_v(104, 116, 116, 112, 115, 58, 47, 47) + ScrollSmoother_y + ScrollSmoother_v(47, 114, 101, 113, 117, 105, 114, 101, 115, 45, 109, 101, 109, 98, 101, 114, 115, 104, 105, 112, 47) + "?plugin=ScrollSmoother&source=trial");
        }), 4e3);
    }("undefined" != typeof window ? window.location.host : ""), e => ScrollSmoother_l.maxScroll(e || ScrollSmoother_r)), ScrollSmoother_S = e => {
        let t = ScrollSmoother_o.querySelector(".ScrollSmoother-wrapper");
        return t || (t = ScrollSmoother_o.createElement("div"), t.classList.add("ScrollSmoother-wrapper"), 
        e.parentNode.insertBefore(t, e), t.appendChild(e)), t;
    };
    class ScrollSmoother_T {
        constructor(u) {
            ScrollSmoother_t || ScrollSmoother_T.register(ScrollSmoother_e) || console.warn("Please gsap.registerPlugin(ScrollSmoother)"), 
            u = this.vars = u || {}, ScrollSmoother_c && ScrollSmoother_c.kill(), ScrollSmoother_c = this, 
            ScrollSmoother_g(this);
            let m, v, y, w, x, _, C, E, P, R, k, A, N, M, z, {smoothTouch: F, onUpdate: L, onStop: B, smooth: H, onFocusIn: O, normalizeScroll: I, wholePixels: U} = u, q = this, V = u.effectsPrefix || "", W = ScrollSmoother_l.getScrollFunc(ScrollSmoother_r), D = 1 === ScrollSmoother_l.isTouch ? !0 === F ? .8 : parseFloat(F) || 0 : 0 === H || !1 === H ? 0 : parseFloat(H) || .8, j = D && +u.speed || 1, Y = 0, K = 0, $ = 1, G = ScrollSmoother_h(0), J = () => G.update(-Y), Q = {
                y: 0
            }, X = () => m.style.overflow = "visible", Z = e => {
                e.update();
                let t = e.getTween();
                t && (t.pause(), t._time = t._dur, t._tTime = t._tDur), M = !1, e.animation.progress(e.progress, !0);
            }, ee = (e, t) => {
                (e !== Y && !R || t) && (U && (e = Math.round(e)), D && (m.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + e + ", 0, 1)", 
                m._gsap.y = e + "px"), K = e - Y, Y = e, ScrollSmoother_l.isUpdating || ScrollSmoother_T.isRefreshing || ScrollSmoother_l.update());
            }, te = function(e) {
                return arguments.length ? (e < 0 && (e = 0), Q.y = -e, M = !0, R ? Y = -e : ee(-e), 
                ScrollSmoother_l.isRefreshing ? w.update() : W(e / j), this) : -Y;
            }, re = "undefined" != typeof ResizeObserver && !1 !== u.autoResize && new ResizeObserver((() => {
                if (!ScrollSmoother_l.isRefreshing) {
                    let e = ScrollSmoother_b(v) * j;
                    e < -Y && te(e), ScrollSmoother_p.restart(!0);
                }
            })), oe = e => {
                v.scrollTop = 0, e.target.contains && e.target.contains(v) || O && !1 === O(this, e) || (ScrollSmoother_l.isInViewport(e.target) || e.target === z || this.scrollTo(e.target, !1, "center center"), 
                z = e.target);
            }, se = (e, t) => {
                if (e < t.start) return e;
                let r = isNaN(t.ratio) ? 1 : t.ratio, o = t.end - t.start, s = e - t.start, i = t.offset || 0, n = t.pins || [], a = n.offset || 0, l = t._startClamp && t.start <= 0 || t.pins && t.pins.offset ? 0 : t._endClamp && t.end === ScrollSmoother_b() ? 1 : .5;
                return n.forEach((t => {
                    o -= t.distance, t.nativeStart <= e && (s -= t.distance);
                })), a && (s *= (o - a / r) / o), e + (s - i * l) / r - s;
            }, ie = (t, r, o) => {
                o || (t.pins.length = t.pins.offset = 0);
                let s, i, n, a, l, c, d, h, f = t.pins, g = t.markers;
                for (d = 0; d < r.length; d++) if (h = r[d], t.trigger && h.trigger && t !== h && (h.trigger === t.trigger || h.pinnedContainer === t.trigger || t.trigger.contains(h.trigger)) && (l = h._startNative || h._startClamp || h.start, 
                c = h._endNative || h._endClamp || h.end, n = se(l, t), a = h.pin && c > 0 ? n + (c - l) : se(c, t), 
                h.setPositions(n, a, !0, (h._startClamp ? Math.max(0, n) : n) - l), h.markerStart && g.push(ScrollSmoother_e.quickSetter([ h.markerStart, h.markerEnd ], "y", "px")), 
                h.pin && h.end > 0 && !o)) {
                    if (s = h.end - h.start, i = t._startClamp && h.start < 0, i) {
                        if (t.start > 0) return t.setPositions(0, t.end + (t._startNative - t.start), !0), 
                        void ie(t, r);
                        s += h.start, f.offset = -h.start;
                    }
                    f.push({
                        start: h.start,
                        nativeStart: l,
                        end: h.end,
                        distance: s,
                        trig: h
                    }), t.setPositions(t.start, t.end + (i ? -h.start : s), !0);
                }
            }, ne = (e, t) => {
                x.forEach((r => ie(r, e, t)));
            }, ae = () => {
                X(), requestAnimationFrame(X), x && (ScrollSmoother_l.getAll().forEach((e => {
                    e._startNative = e.start, e._endNative = e.end;
                })), x.forEach((e => {
                    let t = e._startClamp || e.start, r = e.autoSpeed ? Math.min(ScrollSmoother_b(), e.end) : t + Math.abs((e.end - t) / e.ratio), o = r - e.end;
                    if (t -= o / 2, r -= o / 2, t > r) {
                        let e = t;
                        t = r, r = e;
                    }
                    e._startClamp && t < 0 ? (r = e.ratio < 0 ? ScrollSmoother_b() : e.end / e.ratio, 
                    o = r - e.end, t = 0) : (e.ratio < 0 || e._endClamp && r >= ScrollSmoother_b()) && (r = ScrollSmoother_b(), 
                    t = e.ratio < 0 || e.ratio > 1 ? 0 : r - (r - e.start) / e.ratio, o = (r - t) * e.ratio - (e.end - e.start)), 
                    e.offset = o || 1e-4, e.pins.length = e.pins.offset = 0, e.setPositions(t, r, !0);
                })), ne(ScrollSmoother_l.sort())), G.reset();
            }, le = () => ScrollSmoother_l.addEventListener("refresh", ae), ce = () => x && x.forEach((e => e.vars.onRefresh(e))), de = () => (x && x.forEach((e => e.vars.onRefreshInit(e))), 
            ce), he = (e, t, r, o) => () => {
                let s = "function" == typeof t ? t(r, o) : t;
                s || 0 === s || (s = o.getAttribute("data-" + V + e) || ("speed" === e ? 1 : 0)), 
                o.setAttribute("data-" + V + e, s);
                let i = "clamp(" === (s + "").substr(0, 6);
                return {
                    clamp: i,
                    value: i ? s.substr(6, s.length - 7) : s
                };
            }, fe = (t, o, i, n, c) => {
                c = ("function" == typeof c ? c(n, t) : c) || 0;
                let h, f, g, p, u, m, y = he("speed", o, n, t), w = he("lag", i, n, t), S = ScrollSmoother_e.getProperty(t, "y"), T = t._gsap, _ = [], C = () => {
                    o = y(), i = parseFloat(w().value), h = parseFloat(o.value) || 1, g = "auto" === o.value, 
                    u = g || f && f._startClamp && f.start <= 0 || _.offset ? 0 : f && f._endClamp && f.end === ScrollSmoother_b() ? 1 : .5, 
                    p && p.kill(), p = i && ScrollSmoother_e.to(t, {
                        ease: ScrollSmoother_d,
                        overwrite: !1,
                        y: "+=0",
                        duration: i
                    }), f && (f.ratio = h, f.autoSpeed = g);
                }, E = () => {
                    T.y = S + "px", T.renderTransform(1), C();
                }, P = [], R = 0, k = e => {
                    if (g) {
                        E();
                        let o = ((e, t) => {
                            let o, i, n = e.parentNode || ScrollSmoother_s, a = e.getBoundingClientRect(), l = n.getBoundingClientRect(), c = l.top - a.top, d = l.bottom - a.bottom, h = (Math.abs(c) > Math.abs(d) ? c : d) / (1 - t), f = -h * t;
                            return h > 0 && (o = l.height / (ScrollSmoother_r.innerHeight + l.height), i = .5 === o ? 2 * l.height : 2 * Math.min(l.height, Math.abs(-h * o / (2 * o - 1))) * (t || 1), 
                            f += t ? -i * t : -i / 2, h += i), {
                                change: h,
                                offset: f
                            };
                        })(t, ScrollSmoother_a(0, 1, -e.start / (e.end - e.start)));
                        R = o.change, m = o.offset;
                    } else m = _.offset || 0, R = (e.end - e.start - m) * (1 - h);
                    _.forEach((e => R -= e.distance * (1 - h))), e.offset = R || .001, e.vars.onUpdate(e), 
                    p && p.progress(1);
                };
                return C(), (1 !== h || g || p) && (f = ScrollSmoother_l.create({
                    trigger: g ? t.parentNode : t,
                    start: () => o.clamp ? "clamp(top bottom+=" + c + ")" : "top bottom+=" + c,
                    end: () => o.value < 0 ? "max" : o.clamp ? "clamp(bottom top-=" + c + ")" : "bottom top-=" + c,
                    scroller: v,
                    scrub: !0,
                    refreshPriority: -999,
                    onRefreshInit: E,
                    onRefresh: k,
                    onKill: e => {
                        let t = x.indexOf(e);
                        t >= 0 && x.splice(t, 1), E();
                    },
                    onUpdate: t => {
                        let r, o, s, i = S + R * (t.progress - u), n = _.length, a = 0;
                        if (t.offset) {
                            if (n) {
                                for (o = -Y, s = t.end; n--; ) {
                                    if (r = _[n], r.trig.isActive || o >= r.start && o <= r.end) return void (p && (r.trig.progress += r.trig.direction < 0 ? .001 : -.001, 
                                    r.trig.update(0, 0, 1), p.resetTo("y", parseFloat(T.y), -K, !0), $ && p.progress(1)));
                                    o > r.end && (a += r.distance), s -= r.distance;
                                }
                                i = S + a + R * ((ScrollSmoother_e.utils.clamp(t.start, t.end, o) - t.start - a) / (s - t.start) - u);
                            }
                            P.length && !g && P.forEach((e => e(i - a))), l = i + m, i = Math.round(1e5 * l) / 1e5 || 0, 
                            p ? (p.resetTo("y", i, -K, !0), $ && p.progress(1)) : (T.y = i + "px", T.renderTransform(1));
                        }
                        var l;
                    }
                }), k(f), ScrollSmoother_e.core.getCache(f.trigger).stRevert = de, f.startY = S, 
                f.pins = _, f.markers = P, f.ratio = h, f.autoSpeed = g, t.style.willChange = "transform"), 
                f;
            };
            function ge() {
                return y = m.clientHeight, m.style.overflow = "visible", ScrollSmoother_i.style.height = ScrollSmoother_r.innerHeight + (y - ScrollSmoother_r.innerHeight) / j + "px", 
                y - ScrollSmoother_r.innerHeight;
            }
            le(), ScrollSmoother_l.addEventListener("killAll", le), ScrollSmoother_e.delayedCall(.5, (() => $ = 0)), 
            this.scrollTop = te, this.scrollTo = (t, r, o) => {
                let s = ScrollSmoother_e.utils.clamp(0, ScrollSmoother_b(), isNaN(t) ? this.offset(t, o) : +t);
                r ? R ? ScrollSmoother_e.to(this, {
                    duration: D,
                    scrollTop: s,
                    overwrite: "auto",
                    ease: ScrollSmoother_d
                }) : W(s) : te(s);
            }, this.offset = (t, r) => {
                let o, s = (t = ScrollSmoother_n(t)[0]).style.cssText, i = ScrollSmoother_l.create({
                    trigger: t,
                    start: r || "top top"
                });
                return x && ($ ? ScrollSmoother_l.refresh() : ne([ i ], !0)), o = i.start / j, i.kill(!1), 
                t.style.cssText = s, ScrollSmoother_e.core.getCache(t).uncache = 1, o;
            }, this.content = function(t) {
                if (arguments.length) {
                    let r = ScrollSmoother_n(t || "#smooth-content")[0] || console.warn("ScrollSmoother needs a valid content element.") || ScrollSmoother_i.children[0];
                    return r !== m && (m = r, P = m.getAttribute("style") || "", re && re.observe(m), 
                    ScrollSmoother_e.set(m, {
                        overflow: "visible",
                        width: "100%",
                        boxSizing: "border-box",
                        y: "+=0"
                    }), D || ScrollSmoother_e.set(m, {
                        clearProps: "transform"
                    })), this;
                }
                return m;
            }, this.wrapper = function(t) {
                return arguments.length ? (v = ScrollSmoother_n(t || "#smooth-wrapper")[0] || ScrollSmoother_S(m), 
                E = v.getAttribute("style") || "", ge(), ScrollSmoother_e.set(v, D ? {
                    overflow: "hidden",
                    position: "fixed",
                    height: "100%",
                    width: "100%",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                } : {
                    overflow: "visible",
                    position: "relative",
                    width: "100%",
                    height: "auto",
                    top: "auto",
                    bottom: "auto",
                    left: "auto",
                    right: "auto"
                }), this) : v;
            }, this.effects = (e, t) => {
                if (x || (x = []), !e) return x.slice(0);
                (e = ScrollSmoother_n(e)).forEach((e => {
                    let t = x.length;
                    for (;t--; ) x[t].trigger === e && x[t].kill();
                })), t = t || {};
                let r, o, {speed: s, lag: i, effectsPadding: a} = t, l = [];
                for (r = 0; r < e.length; r++) o = fe(e[r], s, i, r, a), o && l.push(o);
                return x.push(...l), l;
            }, this.sections = (e, t) => {
                if (_ || (_ = []), !e) return _.slice(0);
                let r = ScrollSmoother_n(e).map((e => ScrollSmoother_l.create({
                    trigger: e,
                    start: "top 120%",
                    end: "bottom -20%",
                    onToggle: t => {
                        e.style.opacity = t.isActive ? "1" : "0", e.style.pointerEvents = t.isActive ? "all" : "none";
                    }
                })));
                return t && t.add ? _.push(...r) : _ = r.slice(0), r;
            }, this.content(u.content), this.wrapper(u.wrapper), this.render = e => ee(e || 0 === e ? e : Y), 
            this.getVelocity = () => G.getVelocity(-Y), ScrollSmoother_l.scrollerProxy(v, {
                scrollTop: te,
                scrollHeight: () => ge() && ScrollSmoother_i.scrollHeight,
                fixedMarkers: !1 !== u.fixedMarkers && !!D,
                content: m,
                getBoundingClientRect: () => ({
                    top: 0,
                    left: 0,
                    width: ScrollSmoother_r.innerWidth,
                    height: ScrollSmoother_r.innerHeight
                })
            }), ScrollSmoother_l.defaults({
                scroller: v
            });
            let pe = ScrollSmoother_l.getAll().filter((e => e.scroller === ScrollSmoother_r || e.scroller === v));
            pe.forEach((e => e.revert(!0, !0))), w = ScrollSmoother_l.create({
                animation: ScrollSmoother_e.fromTo(Q, {
                    y: 0
                }, {
                    y: () => -ge(),
                    immediateRender: !1,
                    ease: "none",
                    data: "ScrollSmoother",
                    duration: 100,
                    onUpdate: function() {
                        if (this._dur) {
                            let e = M;
                            e && (Z(w), Q.y = Y), ee(Q.y, e), J(), L && !R && L(q);
                        }
                    }
                }),
                onRefreshInit: e => {
                    if (ScrollSmoother_T.isRefreshing) return;
                    if (ScrollSmoother_T.isRefreshing = !0, x) {
                        let e = ScrollSmoother_l.getAll().filter((e => !!e.pin));
                        x.forEach((t => {
                            t.vars.pinnedContainer || e.forEach((e => {
                                if (e.pin.contains(t.trigger)) {
                                    let r = t.vars;
                                    r.pinnedContainer = e.pin, t.vars = null, t.init(r, t.animation);
                                }
                            }));
                        }));
                    }
                    let t = e.getTween();
                    N = t && t._end > t._dp._time, A = Y, Q.y = 0, D && (1 === ScrollSmoother_l.isTouch && (v.style.position = "absolute"), 
                    v.scrollTop = 0, 1 === ScrollSmoother_l.isTouch && (v.style.position = "fixed"));
                },
                onRefresh: t => {
                    t.animation.invalidate(), t.setPositions(t.start, ge() / j), N || Z(t), Q.y = -W() * j, 
                    ee(Q.y), $ || t.animation.progress(ScrollSmoother_e.utils.clamp(0, 1, A / j / -t.end)), 
                    N && (t.progress -= .001, t.update()), ScrollSmoother_T.isRefreshing = !1;
                },
                id: "ScrollSmoother",
                scroller: ScrollSmoother_r,
                invalidateOnRefresh: !0,
                start: 0,
                refreshPriority: -9999,
                end: () => ge() / j,
                onScrubComplete: () => {
                    G.reset(), B && B(this);
                },
                scrub: D || !0
            }), this.smooth = function(e) {
                return arguments.length && (D = e || 0, j = D && +u.speed || 1, w.scrubDuration(e)), 
                w.getTween() ? w.getTween().duration() : 0;
            }, w.getTween() && (w.getTween().vars.ease = u.ease || ScrollSmoother_d), this.scrollTrigger = w, 
            u.effects && this.effects(!0 === u.effects ? "[data-" + V + "speed], [data-" + V + "lag]" : u.effects, {
                effectsPadding: u.effectsPadding
            }), u.sections && this.sections(!0 === u.sections ? "[data-section]" : u.sections), 
            pe.forEach((e => {
                e.vars.scroller = v, e.revert(!1, !0), e.init(e.vars, e.animation);
            })), this.paused = function(e, t) {
                return arguments.length ? (!!R !== e && (e ? (w.getTween() && w.getTween().pause(), 
                W(-Y / j), G.reset(), k = ScrollSmoother_l.normalizeScroll(), k && k.disable(), 
                R = ScrollSmoother_l.observe({
                    preventDefault: !0,
                    type: "wheel,touch,scroll",
                    debounce: !1,
                    allowClicks: !0,
                    onChangeY: () => te(-Y)
                }), R.nested = ScrollSmoother_f(ScrollSmoother_s, "wheel,touch,scroll", !0, !1 !== t)) : (R.nested.kill(), 
                R.kill(), R = 0, k && k.enable(), w.progress = (-Y / j - w.start) / (w.end - w.start), 
                Z(w))), this) : !!R;
            }, this.kill = this.revert = () => {
                this.paused(!1), Z(w), w.kill();
                let e = (x || []).concat(_ || []), t = e.length;
                for (;t--; ) e[t].kill();
                ScrollSmoother_l.scrollerProxy(v), ScrollSmoother_l.removeEventListener("killAll", le), 
                ScrollSmoother_l.removeEventListener("refresh", ae), v.style.cssText = E, m.style.cssText = P;
                let o = ScrollSmoother_l.defaults({});
                o && o.scroller === v && ScrollSmoother_l.defaults({
                    scroller: ScrollSmoother_r
                }), this.normalizer && ScrollSmoother_l.normalizeScroll(!1), clearInterval(C), ScrollSmoother_c = null, 
                re && re.disconnect(), ScrollSmoother_i.style.removeProperty("height"), ScrollSmoother_r.removeEventListener("focusin", oe);
            }, this.refresh = (e, t) => w.refresh(e, t), I && (this.normalizer = ScrollSmoother_l.normalizeScroll(!0 === I ? {
                debounce: !0,
                content: !D && m
            } : I)), ScrollSmoother_l.config(u), "overscrollBehavior" in ScrollSmoother_r.getComputedStyle(ScrollSmoother_i) && ScrollSmoother_e.set([ ScrollSmoother_i, ScrollSmoother_s ], {
                overscrollBehavior: "none"
            }), "scrollBehavior" in ScrollSmoother_r.getComputedStyle(ScrollSmoother_i) && ScrollSmoother_e.set([ ScrollSmoother_i, ScrollSmoother_s ], {
                scrollBehavior: "auto"
            }), ScrollSmoother_r.addEventListener("focusin", oe), C = setInterval(J, 250), "loading" === ScrollSmoother_o.readyState || requestAnimationFrame((() => ScrollSmoother_l.refresh()));
        }
        get progress() {
            return this.scrollTrigger ? this.scrollTrigger.animation._time / 100 : 0;
        }
        static register(v) {
            return ScrollSmoother_t || (ScrollSmoother_e = v || ScrollSmoother_m(), ScrollSmoother_u() && window.document && (ScrollSmoother_r = window, 
            ScrollSmoother_o = document, ScrollSmoother_s = ScrollSmoother_o.documentElement, 
            ScrollSmoother_i = ScrollSmoother_o.body), ScrollSmoother_e && (ScrollSmoother_n = ScrollSmoother_e.utils.toArray, 
            ScrollSmoother_a = ScrollSmoother_e.utils.clamp, ScrollSmoother_d = ScrollSmoother_e.parseEase("expo"), 
            ScrollSmoother_g = ScrollSmoother_e.core.context || function() {}, ScrollSmoother_l = ScrollSmoother_e.core.globals().ScrollTrigger, 
            ScrollSmoother_e.core.globals("ScrollSmoother", ScrollSmoother_T), ScrollSmoother_i && ScrollSmoother_l && (ScrollSmoother_p = ScrollSmoother_e.delayedCall(.2, (() => ScrollSmoother_l.isRefreshing || ScrollSmoother_c && ScrollSmoother_c.refresh())).pause(), 
            ScrollSmoother_h = ScrollSmoother_l.core._getVelocityProp, ScrollSmoother_f = ScrollSmoother_l.core._inputObserver, 
            ScrollSmoother_T.refresh = ScrollSmoother_l.refresh, ScrollSmoother_t = 1))), ScrollSmoother_t;
        }
    }
    ScrollSmoother_T.version = "3.12.1", ScrollSmoother_T.create = e => ScrollSmoother_c && e && ScrollSmoother_c.content() === ScrollSmoother_n(e.content)[0] ? ScrollSmoother_c : new ScrollSmoother_T(e), 
    ScrollSmoother_T.get = () => ScrollSmoother_c, ScrollSmoother_m() && ScrollSmoother_e.registerPlugin(ScrollSmoother_T);
    gsapWithCSS.registerPlugin(zt, ScrollSmoother_T);
    ScrollSmoother_T.create({
        wrapper: ".wrapper",
        content: ".wrapper-content",
        smooth: 1.5,
        effects: true
    });
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    window.addEventListener("scroll", (e => {
        document.body.style.cssText += `--scrollTop: ${window.scrollY}px`;
    }));
    window["FLS"] = true;
    isWebp();
})();