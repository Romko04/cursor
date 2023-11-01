/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/modules/sparks/cnc_lotto/js/vendor/smil.check.js. */
(function(){var svgns="http://www.w3.org/2000/svg";try{if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Animation","1.1")){var smilTags=["animate","animateTransform","animateMotion","animateColor","set"],currTag,objName;for(var i=0;i<smilTags.length;++i){currTag=smilTags[i];objName=currTag.charAt(0).toUpperCase();objName+=currTag.substring(1,currTag.length);if((""+document.createElementNS(svgns,currTag)).indexOf(objName,11)!==11)if(document.getElementsByTagNameNS(svgns,currTag).length)throw"FakeSmile required due to: "+currTag}};var timesheetns="http://www.w3.org/2007/07/SMIL30/Timesheets",smil3ns="http://www.w3.org/ns/SMIL30";if(!document.implementation.hasFeature(timesheetns,"1.0")){var linkElems=document.getElementsByTagName("link"),linkEle;for(var i=0;i<linkElems.length;++i){linkEle=linkElems.item(i);if((linkEle.getAttribute("rel")==="timesheet")&&(linkEle.getAttribute("type")==="application/smil+xml"))throw"FakeSmile required due to: link"};if(document.getElementsByTagNameNS(smil3ns,"timesheet").length||document.getElementsByTagNameNS(timesheetns,"timesheet").length)throw"FakeSmile required due to: timesheet"};var supported=!!document.createElementNS&&/SVGAnimate/.test(({}.toString).call(document.createElementNS('http://www.w3.org/2000/svg','animate')));if(!supported)throw"FakeSmile required due to: animate"}catch(exp){var xlinkns="http://www.w3.org/1999/xlink",useHref=true,scriptList=document.getElementsByTagName("script"),currScript=scriptList.item(scriptList.length-1),scriptPath=currScript.getAttributeNS(xlinkns,"href");if(!scriptPath||!scriptPath.length){scriptPath=currScript.getAttribute("src");useHref=false};var slashPos=scriptPath.lastIndexOf("/");if(slashPos!=-1){var relPath=scriptPath.substring(0,slashPos+1)}else var relPath="";if(useHref){var scriptEle=document.createElementNS(svgns,"script");scriptEle.setAttributeNS(xlinkns,"xlink:href",relPath+"smil.user.js")}else{var scriptEle=document.createElement("script");scriptEle.setAttribute("src",relPath+"smil.user.js")};scriptEle.setAttribute("type",currScript.getAttribute("type"));document.documentElement.appendChild(scriptEle)}})();;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/modules/sparks/cnc_lotto/js/vendor/smil.check.js. */
;/*})'"*/
/*
@id {7eeff186-cfb4-f7c3-21f2-a15f210dca49}
@name FakeSmile
@version 0.3.0
@description SMIL implementation in ECMAScript
@creator David Leunen (leunen.d@gmail.com)
@homepageURL http://leunen.me/fakesmile/
@ff_min_version 2.0
@ff_max_version 3.*
*/
// ==UserScript==
// @name smil
// @namespace svg.smil
// ==/UserScript==

/* MIT or GPLv3 Licenses */

/*
Copyright 2008 David Leunen
Copyright 2012 Helder Magalhaes
*/

/**
 * Milliseconds Per Frame - relation between animation smoothness and resources usage:
 * 83 for ~12fps (standard quality web animation; low CPU usage; slightly jumpy; recommended for discrete or slow-motion animations);
 * 67 for ~15fps (high quality web animation; reasonable resources usage; recommended for most use-cases);
 * 40 for  25fps ("cine"-look; recommended for good quality animations on television systems);
 * 33 for ~30fps (half LCD refresh rate; recommended for high quality animations on desktop systems);
 * 25 for  40fps (very smooth animation; recommended for high quality animations on dedicated desktop systems);
 * 17 for ~60fps (LCD refresh rate; high CPU and system overhead; only recommended for very high quality animations running on high-end systems).
 * Lower values are *not* recommended - may cause an overall negative impact on the Operating System and a relevant energy consumption increase!
 * References:
 * http://animation.about.com/od/faqs/f/faq_fpsnumber.htm
 * http://en.wikipedia.org/wiki/Frame_rate#Frame_rates_in_film_and_television
 * https://www.nczonline.net/blog/2011/12/14/timer-resolution-in-browsers/
 */
var mpf = 67;
var splinePrecision = 25;

var svgns="http://www.w3.org/2000/svg";
var smilanimns="http://www.w3.org/2001/smil-animation";
var smil2ns="http://www.w3.org/2001/SMIL20";
var smil21ns="http://www.w3.org/2005/SMIL21";
var smil3ns="http://www.w3.org/ns/SMIL30";
var timesheetns="http://www.w3.org/2007/07/SMIL30/Timesheets";
var xlinkns="http://www.w3.org/1999/xlink";

var animators = new Array(); // all animators
var id2anim = new Object(); // id -> animation elements (workaround a Gecko bug)
var animations = new Array(); // running animators
var timeZero; // timeline start-up timestamp
var prevTime; // previous render timestamp
var animTimer; // render loop timer id, when active

/**
 * If declarative animations are not supported,
 * the document animations are fetched and registered.
 */
function initSMIL() {
	if (document.documentElement.getAttribute("smiling")=="fake")
		return;
	document.documentElement.setAttribute("smiling", "fake");
	smile(document);

	timeZero = new Date();
	prevTime = new Date(0); // not yet rendered

	// I schedule them (after having instantiating them, for sync-based events)
	// (it doesn't work either: first 0s animation don't trigger begin event to the following -> make it asynchronous)
	for (var i=0, j=animators.length; i<j; ++i)
		animators[i].register();
}

function getURLCallback(data) {
	if (data.success)
		smile(parseXML(data.content, document));
}

function xhrCallback() {
	if (this.readyState==4 && this.status==200 && this.responseXML!=null)
		smile(this.responseXML);
}

function smile(animating) {
	var request = null;
	var src = null;

	var impl = document.implementation;
	// namespace-to-process cache
	// ("process" in the sense of "feature check states that support by script is needed")
	// (map is initialized this way to avoid variables names being picked up as key instead of their value)
	var ns2proc = {};
	// NOTE: feature strings are broken in ASV - apparently only declarative switch declarations work
	// (we have already filter this implementation, though, during the loading phase)
	// http://tech.groups.yahoo.com/group/svg-developers/message/61236
	ns2proc[svgns] = !impl.hasFeature("http://www.w3.org/TR/SVG11/feature#Animation", "1.1"); //&& !impl.hasFeature("org.w3c.svg.animation", "1.0");
	ns2proc[smilanimns] = !impl.hasFeature(smilanimns, "1.1");
	ns2proc[smil2ns] = !impl.hasFeature(smil2ns, "2.0");
	ns2proc[smil21ns] = !impl.hasFeature(smil21ns, "2.1");
	ns2proc[smil3ns] = !impl.hasFeature(smil3ns, "3.0");
	ns2proc[timesheetns] = !impl.hasFeature(timesheetns, "1.0");
	
	
	var animates = animating.getElementsByTagName("*");
	for (var i=0, j=animates.length; i<j; ++i) {
		var anim = animates.item(i);
		var nodeName = anim.localName;
		var namespaceURI = anim.namespaceURI;

		switch (nodeName.length) {
			case 4: // "link".length
				if ((nodeName=="link" || nodeName=="LINK") && anim.getAttribute("rel")=="timesheet" && anim.getAttribute("type")=="application/smil+xml") {
					src = anim.getAttribute("src");
					if (src)
						break;
				}
				continue;
			case 9: // "timesheet".length
				if (nodeName=="timesheet" && ns2proc[anim.namespaceURI]) {
					src = anim.getAttribute("href");
					if (src)
						break;
				}
				continue;
			case 3: // "set".length
				if (nodeName=="set") {
					break;
				}
				continue;
			case 7: // "animate".length
				if (nodeName=="animate") {
					break;
				}
				continue;
			case 12: // "animateColor".length
				if (nodeName=="animateColor") {
					break;
				}
				continue;
			case 13: // "animateMotion".length
				if (nodeName=="animateMotion") {
					break;
				}
				continue;
			case 16: // "animateTransform".length
				if (nodeName=="animateTransform") {
					break;
				}
				continue;
			default:
				continue;
		}

		// deal with external timesheets
		if (src && src.length > 0) {
			if (!request){
				// lazy initialization of XHR
				request = window.XMLHttpRequest ? new XMLHttpRequest() : window.ActiveXObject ? new ActiveXObject("MSXML2.XMLHTTP.3.0") : null;
				if (request) {
					if (request.overrideMimeType)
						request.overrideMimeType('text/xml');
					request.onreadystatechange = xhrCallback;
				}
			}
			if (request) {
				request.open("GET", src, false);
				request.send(null);
			} else if (window.getURL && window.parseXML) {
				getURL(src, getURLCallback);
			}
			// reset variable
			src = null;
			continue;
		}

		// deal with animations
		if (ns2proc[anim.namespaceURI]) {
			var targets = getTargets(anim);
			var elAnimators = new Array();
			for (var k=0; k<targets.length; ++k) {
				var target = targets[k];
				var animator = new Animator(anim, target, k);
				animators.push(animator);
				elAnimators[k] = animator;
			}
			anim.animators = elAnimators;
			var id = anim.getAttribute("id");
			if (id)
				id2anim[id] = anim;
		}
	}
}

function getTargets(anim) {
	if (anim.hasAttribute("select"))
		return select(anim);
	var href = anim.getAttributeNS(xlinkns, "href");
	if (href!=null && href!="")
		return [document.getElementById(href.substring(1))];
	else {
		var target = anim.parentNode;
		if (target.localName=="item" && (target.namespaceURI==timesheetns || target.namespaceURI==smil3ns))
			return select(target);
		return [target];
	}
}

function select(element) {
	var selector = element.getAttribute("select");
	var parent = element.parentNode;
	while(parent && parent.nodeType==1) {
		if (parent.localName=="item" && (parent.namespaceURI==timesheetns || parent.namespaceURI==smil3ns))
			selector = parent.getAttribute("select")+" "+selector;
		parent = parent.parentNode;
	}
	return document.querySelectorAll(selector);
}

function getEventTargetsById(id, ref) {
	var element = null;
	if (id=="prev") {
		element = ref.previousSibling;
		while(element && element.nodeType!=1)
			element = element.previousSibling;
	}
	if (element==null)
		element = document.getElementById(id);
	if (element==null)
		element = id2anim[id]; // because getElementById doesn't returns SMIL elements in Gecko
	if (element==null)
		return null;
	if (element.animators)
		return element.animators;
	return [element];
}


/**
 * Corresponds to one <animate>, <set>, <animateTransform>, ...
 * (there can be more than one Animator for each element)
 */
Animator.prototype = {

	/**
	 * Registers the animation.
	 * It schedules the beginnings and endings.
	 */
	register : function() {
		var begin = this.anim.getAttribute("begin");
		if (begin)
			this.schedule(begin, this.begin);
		else
			this.begin(0);
		var end = this.anim.getAttribute("end");
		if (end)
			this.schedule(end, this.finish);
	},

	/**
	 * Schedules the starts or ends of the animation.
	 */
	schedule : function(timeValueList, func) {
		var me = this; // I do that because if I use "this", the addEventListener understands the event source
		var timeValues = timeValueList.split(";");
		for (var i=0; i<timeValues.length; ++i) {
			var time = timeValues[i].trim();
			if (time.length>11 && time.substring(0,10)=="wallclock(") {
				var wallclock = new Date();
				wallclock.setISO8601(time.substring(10,time.length-1));
				if (!isNaN(wallclock.getTime())) {
					var now = new Date();
					var diff = wallclock-now;
					func.call(me, diff);
				}
			} else if (isNaN(parseInt(time))) {
				var offset = 0;
				var io = time.indexOf("+");
				if (io==-1)
					io = time.indexOf("-");
				if (io!=-1) {
					offset = toMillis(time.substring(io).replace(/ /g, ""));
					time = time.substring(0, io).trim();
				}
				io = time.indexOf(".");
				var elements;
				if (io==-1) {
					elements = [this.target];
				} else {
					var id = time.substring(0, io);
					if (id.indexOf("index(")==0)
						id = id.substring(6,id.length-1)+this.index;
					elements = getEventTargetsById(id, this.anim);
				}
				var event = time.substring(io+1);
				var call = funk(func, me, offset);
				for (var j=0; j<elements.length; ++j) {
					var element = elements[j];
					if (element==null)
						continue;
					element.addEventListener(event, call, false);
				}
			} else {
				time = toMillis(time);
				func.call(me, time);
			}
		}
	},

	/**
	 * Remembers the initial value of the animated attribute.
	 * This function is overridden.
	 */
	getCurVal : function() {
		if (this.attributeType=="CSS") {
			// should use this.target.getPresentationAttribute instead
			return this.target.style.getPropertyValue(this.attributeName);
		} else {
			//var animAtt = this.target[this.attributeName];
			//if (animAtt && animAtt.animVal)
			//	return animAtt.animVal.value;
			//else
				return this.target.getAttributeNS(this.namespace, this.attributeName);
		}
	},

	/**
	 * Starts the animation.
	 * I mean the very beginning of it.
	 * Not called when repeating.
	 */
	begin : function(offset) {
		if (this.restart=="never" || (this.running && this.restart=="whenNotActive"))
			return;
		if (this.running)
			this.finish();
		if (offset && offset>0) {
			var me = this;
			var myself = this.begin;
			var call = function() {myself.call(me)};
			window.setTimeout(call, offset);
			return;
		}
		this.startTime = new Date();
		if (offset && offset<0) {
			this.startTime.setTime(this.startTime.getTime()+offset);
			if (this.startTime<timeZero)
				return;
		}
		this.stop();
		this.running = true;
		var initVal = this.getCurVal();
		this.realInitVal = initVal;
		// TODO
		// I should get the inherited value here (getPresentationAttribute is not supported)
		if (!initVal && propDefaults[this.attributeName] )
			initVal = propDefaults[this.attributeName];
		if (this.anim.nodeName=="set")
			this.step(this.to);
		this.iteration = 0;

		if (this.values) {
			this.animVals = this.values.split(";");
			for (var i=0; i<this.animVals.length; ++i)
				this.animVals[i] = this.animVals[i].trim();
		} else {
			this.animVals = new Array();
			if (this.from)
				this.animVals[0] = this.from;
			else
				this.animVals[0] = initVal;
			if (this.by && this.animVals[0])
				this.animVals[1] = this.add(this.normalize(this.animVals[0]), this.normalize(this.by));
			else
				this.animVals[1] = this.to;
		}
		if (this.animVals[this.animVals.length-1]) {
			this.freezed = this.animVals[this.animVals.length-1];

			if (this.animVals[0]) {
				if ( (this.animVals[0][0]=="#" || colors[this.animVals[0]] || (this.animVals[0].length>5 && this.animVals[0].trim().substring(0,4)=="rgb(")) &&
					 (this.freezed[0]=="#" || colors[this.freezed] || (this.freezed.length>5 && this.freezed.trim().substring(0,4)=="rgb(")) )
					this.color();
				else {
					var cp = new Array();
					var oneVal = this.animVals[0];
					var qualified = getUnit(oneVal);
					cp[0] = qualified[0];
					this.unit = qualified[1];
					for (var i=1; i<this.animVals.length; ++i) {
						var oneVal = this.animVals[i];
						var qualified = getUnit(oneVal);
						if (qualified[1]==this.unit)
							cp[i] = qualified[0];
						else {
							cp = this.animVals;
							break;
						}
					}
					this.animVals = cp;
				}
			}
		}

		this.iterBegin = this.startTime;
		animations.push(this);
		// if this is the first running animator, start the rendering loop
		if (!animTimer) {
			// asynchronous to render all animators, listeners, etc. starting at this frame
			window.setTimeout(animate, 0);
			// schedules the rendering loop
			animTimer = window.setInterval(animate, mpf);
		}
		for (var i=0; i<this.beginListeners.length; ++i)
			this.beginListeners[i].call();
		var onbegin = this.anim.getAttribute("onbegin");
		if (onbegin)
			eval(onbegin);
	},

	/**
	 * This function is overridden for multiple values attributes (scale, rotate, translate).
	 */
	normalize : function(value) {
		return value;
	},

	/**
	 * Sums up two normalized values.
	 */
	add : function(a, b) {
		return ""+(parseFloat(a)+parseFloat(b));
	},

	/**
	 * Computes and applies the animated value for a given time.
	 * Returns false if this animation has been stopped (removed from the running array).
	 */
	f : function(curTime) {
		var dur = this.computedDur;
		if (isNaN(dur))
			return true;

		var beginTime = this.iterBegin;
		var diff = curTime-beginTime;
		var percent = diff/dur;
		if (percent>=1)
			return this.end(curTime);

		var iteration = this.iteration;
		if (this.repeatCount && this.repeatCount!="indefinite" && (iteration+percent)>=this.repeatCount) {
			if (this.fill=="freeze")
				this.freezed = this.valueAt(this.repeatCount-iteration);
			return this.end(curTime);
		}
		if (this.repeatDur && this.repeatDur!="indefinite" && (curTime-this.startTime)>=toMillis(this.repeatDur)) {
			if (this.fill=="freeze") {
				var div = toMillis(this.repeatDur)/dur;
				this.freezed = this.valueAt(div-Math.floor(div));
			}
			return this.end(curTime);
		}

		var anim = this.anim;
		if (anim.localName=="set")
			return true;

		var curVal = this.valueAt(percent);
		this.step(curVal);
		return true;
	},

	isInterpolable : function(from, to) {
		var areN = (!isNaN(from) && !isNaN(to));
		if (!areN && from.trim().indexOf(" ")!=-1 && to.trim().indexOf(" ")!=-1) {
			var tfrom = from.trim().split(" ");
			var tto = to.trim().split(" ");
			areN = true;
			if (tfrom.length==tto.length)
				for (var i=0; i<tto.length; ++i)
					if (!this.isInterpolable(tfrom[i], tto[i]))
						return false;
		}
		return areN;
	},

	valueAt : function(percent) {
		var tValues = this.animVals;
		if (percent==1)
			return tValues[tValues.length-1];
		if (this.calcMode=="discrete" || !this.isInterpolable(tValues[0],tValues[1])) {
			if (this.keyTimes) {
				for (var i=1; i<this.keyTimes.length; ++i)
					if (this.keyTimes[i]>percent)
						return tValues[i-1];
				return tValues[tValues.length-1];
			}
			var parts = tValues.length;
			var div = Math.floor(percent*parts);
			return tValues[div];
		} else {
			var index;
			if (this.keyTimes) {
				for (var i=1; i<this.keyTimes.length; ++i)
					if (this.keyTimes[i]>percent) {
						index = i-1;
						var t1 = this.keyTimes[index];
						percent = (percent-t1)/(this.keyTimes[i]-t1);
						break;
					}
				if (i>=this.keyTimes.length)
					index = i-2;
			} else {
				var parts = tValues.length-1;
				index = Math.floor(percent*parts);
				percent = (percent%(1/parts))*parts;
			}
			if (this.calcMode=="spline")
				percent = this.spline(percent, index);
			return this.interpolate(this.normalize(tValues[index]), this.normalize(tValues[index+1]), percent);
		}
	},

	spline : function(percent, index) {
		var path = this.keySplines[index];
		var tot = path.getTotalLength();
		var step = tot/splinePrecision;
		for (var i=0; i<=tot; i+=step) {
			var pt = path.getPointAtLength(i);
			if (pt.x>percent) {
				var pt1 = path.getPointAtLength(i-step);
				percent -= pt1.x;
				percent /= pt.x-pt1.x;
				return pt1.y+((pt.y-pt1.y)*percent);
			}
		}
		var pt = path.getPointAtLength(tot);
		var pt1 = path.getPointAtLength(tot-step);
		percent -= pt1.x;
		percent /= pt.x-pt1.x;
		return pt1.y+((pt.y-pt1.y)*percent);
	},

	/**
	 * Performs the interpolation.
	 * This function is overridden.
	 */
	interpolate : function(from, to, percent) {
		if (!this.isInterpolable(from, to)) {
			if (percent<.5)
				return from;
			else
				return to;
		}
		if (from.trim().indexOf(" ")!=-1) {
			var tfrom = from.split(" ");
			var tto = to.split(" ");
			var ret = new Array();
			for (var i=0; i<tto.length; ++i)
				ret[i] = parseFloat(tfrom[i])+((tto[i]-tfrom[i])*percent);
			return ret.join(" ");
		}
		return parseFloat(from)+((to-from)*percent);
	},

	/**
	 * Apply a value to the attribute the animator is linked to.
	 * This function is overridden.
	 */
	step : function(value) {
		var attributeName = this.attributeName;
		var attributeType = this.attributeType;
		if (attributeType=="CSS") {
			// workaround a Gecko and WebKit bug
			if (attributeName=="font-size" && !isNaN(value))
				value += "px";
			else if (this.unit)
				value += this.unit;
			this.target.style.setProperty(attributeName, value, "");
		} else {
			if (this.unit)
				value += this.unit;
			//var animAtt = this.target[attributeName];
			//if (animAtt && animAtt.animVal)
			//	animAtt.animVal.value = value;
			//else
				this.target.setAttributeNS(this.namespace, attributeName, value);
		}
	},

	/**
	 * Normal end of the animation:
	 * it restarts if repeatCount.
	 */
	end : function(now) {
		if (!this.repeatCount && !this.repeatDur)
			return this.finish();
		else {
			++this.iteration;
			if (this.repeatCount && this.repeatCount!="indefinite" && this.iteration>=this.repeatCount)
				return this.finish();
			else if (this.repeatDur && this.repeatDur!="indefinite" && (now-this.startTime)>=toMillis(this.repeatDur))
				return this.finish();
			else {
				if (this.accumulate=="sum") {
					var curVal = this.getCurVal();
					if (!curVal && propDefaults[this.attributeName] )
						curVal = propDefaults[this.attributeName];

					if (this.by && !this.from) {
						this.animVals[0] = curVal;
						this.animVals[1] = this.add(this.normalize(curVal), this.normalize(this.by));
					} else {
						for (var i=0; i<this.animVals.length; ++i)
							this.animVals[i] = this.add(this.normalize(curVal), this.normalize(this.animVals[i]));
					}
					this.freezed = this.animVals[this.animVals.length-1];
				}
				this.iterBegin = now;
				for (var i=0; i<this.repeatIterations.length; ++i) {
					if (this.repeatIterations[i]==this.iteration)
						this.repeatListeners[i].call();
				}
				var onrepeat = this.anim.getAttribute("onrepeat");
				if (onrepeat)
					eval(onrepeat);
			}
		}
		return true;
	},

	/**
	 * Really stop of the animation (it doesn't repeat).
	 * Freezes or removes the animated value.
	 */
	finish : function(offset) {
		if (this.min && this.min!="indefinite") {
			var now = new Date();
			if ((now-this.startTime)>=this.computedMin)
				return true;
		}
		if (offset && offset>0) {
			var me = this;
			var myself = this.finish;
			var call = function() {myself.call(me)};
			window.setTimeout(call, offset);
			return true;
		}
		if (offset && offset<0) {
			var now = new Date();
			now.setTime(now.getTime()+offset);
			if (now<this.startTime)
				return true;
		}

		var fill = this.fill;
		var kept = true;
		if (fill=="freeze") {
			this.freeze();
		} else {
			this.stop();
			this.step(this.realInitVal);
			kept = false;
		}
		if (this.running) {
			for (var i=0; i<this.endListeners.length; ++i)
				this.endListeners[i].call();
			var onend = this.anim.getAttribute("onend");
			if (onend)
				eval(onend);
			this.running = false;
		}
		return kept;
	},

	/**
	 * Removes this animation from the running array.
	 */
	stop : function() {
		for (var i=0, j=animations.length; i<j; ++i)
			if (animations[i]==this) {
				animations.splice(i, 1);
				// if this is the last running animator, stop the rendering loop
				if (!animations.length && animTimer) {
					window.clearInterval(animTimer);
					animTimer = null;
				}
				break;
			}
	},

	/**
	 * Freezes the attribute value to the ending value.
	 */
	freeze : function() {
		this.step(this.freezed);
	},

	/**
	 * Adds a listener to this animation beginning or ending.
	 */
	addEventListener : function(event, func, b) {
		if (event=="begin")
			this.beginListeners.push(func);
		else if (event=="end")
			this.endListeners.push(func);
		else if (event.length>7 && event.substring(0,6)=="repeat") {
			var iteration = event.substring(7,event.length-1);
			this.repeatListeners.push(func);
			this.repeatIterations.push(iteration);
		}
	},

	/**
	 * Returns the path linked to this animateMotion.
	 */
	getPath : function() {
		var mpath = this.anim.getElementsByTagNameNS(svgns,"mpath")[0];
		if (mpath) {
			var pathHref = mpath.getAttributeNS(xlinkns, "href");
			return document.getElementById(pathHref.substring(1));
		} else {
			var d = this.anim.getAttribute("path");
			if (d) {
				var pathEl = createPath(d);
				//pathEl.setAttribute("display", "none");
				//this.anim.parentNode.appendChild(pathEl);
				return pathEl;
			}
		}
		return null;
	},

	/**
	 * Initializes this animator as a translation (x,y):
	 * <animateTransform type="translate"> or
	 * <animateMotion> without a path.
	 */
	translation : function() {
		if (this.by && this.by.indexOf(",")==-1)
			this.by = this.by+",0";
		this.normalize = function(value) {
			var coords = value.replace(/,/g," ").replace(/ +/," ").split(/ /);
			coords[0] = parseFloat(coords[0]);
			if (coords.length==1)
				coords[1] = 0;
				//coords[1] = this.initVal.split(",")[1];
			else
				coords[1] = parseFloat(coords[1]);
			return coords;
		};
		this.add = function(a, b) {
			var x = a[0]+b[0];
			var y = a[1]+b[1];
			return x+","+y;
		};
		this.isInterpolable = function(from, to) { return true; };
		this.interpolate = function(from, to, percent) {
			var x = from[0]+((to[0]-from[0])*percent);
			var y = from[1]+((to[1]-from[1])*percent);
			return x+","+y;
		};
	},

	/**
	 * Initializes this animator as a color animation:
	 * <animateColor> or
	 * <animate> on a color attribute.
	 */
	color : function() {
		this.isInterpolable = function(from, to) { return true; };
		this.interpolate = function(from, to, percent) {
			var r = Math.round(from[0]+((to[0]-from[0])*percent));
			var g = Math.round(from[1]+((to[1]-from[1])*percent));
			var b = Math.round(from[2]+((to[2]-from[2])*percent));
			var val = "rgb("+r+","+g+","+b+")";
			return val;
		};
		this.normalize = function(value) {
			var rgb = toRGB(value);
			if (rgb==null)
				return toRGB(propDefaults[this.attributeName]);
			return rgb;
		};
		this.add = function(a, b) {
			var ret = new Array();
			for (var i=0; i<a.length; ++i)
				ret.push(Math.min(a[i],255)+Math.min(b[i],255));
			return ret.join(",");
		};
	},

	d : function() {
		this.isInterpolable = function(from, to) { return true; };
		this.interpolate = function(from, to, percent) {
			var path = "";
			var listFrom = from.myNormalizedPathSegList;
			var listTo = to.myNormalizedPathSegList;
			var segFrom, segTo, typeFrom, typeTo;
			for (var i=0, j=Math.min(listFrom.numberOfItems, listTo.numberOfItems); i<j; ++i) {
				segFrom = listFrom.getItem(i);
				segTo = listTo.getItem(i);
				typeFrom = segFrom.pathSegType;
				typeTo = segTo.pathSegType;
				// NOTE: in 'normalizedPathSegList', only 'M', 'L', 'C' and 'z' path data commands are expected
				if (typeFrom==1 || typeTo==1) // PATHSEG_CLOSEPATH
					path += " z ";
				else {
					var x = segFrom.x+((segTo.x-segFrom.x)*percent);
					var y = segFrom.y+((segTo.y-segFrom.y)*percent);
					if (typeFrom==2 || typeTo==2) // PATHSEG_MOVETO_ABS
						path += " M ";
					else if (typeFrom==4 || typeTo==4) // PATHSEG_LINETO_ABS
						path += " L ";
					// NOTE: need to be more strict here, as interpolating a 'C' command with an 'M' or an 'L' isn't yet supported
					// (additional trickery is required for dealing with different DOM interfaces and interpolating them)
					else if (typeFrom==6 && typeTo==6) { // PATHSEG_CURVETO_CUBIC_ABS
						var x1 = segFrom.x1+((segTo.x1-segFrom.x1)*percent);
						var y1 = segFrom.y1+((segTo.y1-segFrom.y1)*percent);
						var x2 = segFrom.x2+((segTo.x2-segFrom.x2)*percent);
						var y2 = segFrom.y2+((segTo.y2-segFrom.y2)*percent);
						path += " C "+x1+","+y1+" "+x2+","+y2+" ";
					} else
						// "unexpected" type found, which means that 'pathSegList' is being used
						// (incomplete support for segment interpolation therefore switch to a discrete approach)
						return (percent<.5? from: to).getAttribute("d");
					path += x+","+y;
				}
			}
			return path;
		};
		this.normalize = function(value) {
			var path = createPath(value);
			return path;
		};
	}

};

/**
 * Constructor:
 * - initializes
 * - gets the attributes
 * - corrects and precomputes some values
 * - specializes some functions
 */
function Animator(anim, target, index) {
	this.anim = anim;
	this.target = target;
	this.index = index;
	anim.targetElement = target;
	this.attributeType = anim.getAttribute("attributeType");
	this.attributeName = anim.getAttribute("attributeName");
	if (this.attributeType!="CSS" && this.attributeType!="XML") {
		// attributeType not specified, default stands for "auto"
		// "The implementation must first search through the list of CSS properties for a matching property name"
		// http://www.w3.org/TR/SVG11/animate.html#AttributeTypeAttribute
		if (propDefaults[this.attributeName] && this.target.style.getPropertyValue(this.attributeName))
			this.attributeType = "CSS";
		else
			this.attributeType = "XML";
	}
	if (this.attributeType=="XML" && this.attributeName) {
		this.namespace = null;
		var chColon = this.attributeName.indexOf(":");
		if (chColon != -1) {
			var prefix = this.attributeName.substring(0,chColon);
			this.attributeName = this.attributeName.substring(chColon+1);
			var node = target;
			while(node && node.nodeType==1) {
				var ns = node.getAttributeNS("http://www.w3.org/2000/xmlns/", prefix);
				if (ns) {
					this.namespace = ns;
					break;
				}
				node = node.parentNode;
			}
		}
	}

	if (this.attributeName=="d")
		this.d();
	else if (this.attributeName=="points") {
		this.isInterpolable = function(from, to) { return true; };
		this.interpolate = function(from, to, percent) {
			var ret = new Array();
			var xyFrom, xyTo, x, y;
			for (var i=0, j=Math.min(from.length, to.length); i<j; ++i) {
				xyFrom = from[i].split(",");
				xyTo = to[i].split(",");
				x = parseFloat(xyFrom[0])+((parseFloat(xyTo[0])-xyFrom[0])*percent);
				y = parseFloat(xyFrom[1])+((parseFloat(xyTo[1])-xyFrom[1])*percent);
				ret.push(x+","+y);
			}
			return ret.join(" ");
		};
		this.normalize = function(value) {
			var ar = value.split(" ");
			for (var i=ar.length-1; i>=0; --i)
				if (ar[i]=="")
					ar.splice(i,1);
			return ar;
		};
	}
	this.from = anim.getAttribute("from");
	this.to = anim.getAttribute("to");
	this.by = anim.getAttribute("by");
	this.values = anim.getAttribute("values");
	if (this.values) {
		this.values = this.values.trim();
		if (this.values[this.values.length-1]==";")
			this.values = this.values.substring(0, this.values.length-1);
	}
	this.calcMode = anim.getAttribute("calcMode");
	this.keyTimes = anim.getAttribute("keyTimes");
	if (this.keyTimes) {
		this.keyTimes = this.keyTimes.split(";");
		for (var i=0; i<this.keyTimes.length; ++i)
			this.keyTimes[i] = parseFloat(this.keyTimes[i]);
		this.keyPoints = anim.getAttribute("keyPoints");
		if (this.keyPoints) {
			this.keyPoints = this.keyPoints.split(";");
			for (var i=0; i<this.keyPoints.length; ++i)
				this.keyPoints[i] = parseFloat(this.keyPoints[i]);
		}
	}
	this.keySplines = anim.getAttribute("keySplines");
	if (this.keySplines) {
		this.keySplines = this.keySplines.split(";");
		for (var i=0; i<this.keySplines.length; ++i)
			this.keySplines[i] = createPath("M 0 0 C "+this.keySplines[i]+" 1 1");
	}
	this.dur = anim.getAttribute("dur");
	if (this.dur && this.dur!="indefinite")
		this.computedDur = toMillis(this.dur);
	this.max = anim.getAttribute("max");
	if (this.max && this.max!="indefinite") {
		this.computedMax = toMillis(this.max);
		if (!isNaN(this.computedMax) && this.computedMax>0 && (!this.computedDur || this.computedDur>this.computedMax))
			this.computedDur = this.computedMax;
	}
	this.min = anim.getAttribute("min");
	if (this.min) {
		this.computedMin = toMillis(this.min);
		if (!this.computedDur || this.computedDur<this.computedMin)
			this.computedDur = this.computedMin;
	}

	this.fill = anim.getAttribute("fill");
	this.type = anim.getAttribute("type");
	this.repeatCount = anim.getAttribute("repeatCount");
	this.repeatDur = anim.getAttribute("repeatDur");
	this.accumulate = anim.getAttribute("accumulate");
	this.additive = anim.getAttribute("additive");
	this.restart = anim.getAttribute("restart");
	if (!this.restart)
		this.restart = "always";

	this.beginListeners = new Array();
	this.endListeners = new Array();
	this.repeatListeners = new Array();
	this.repeatIterations = new Array();

	var nodeName = anim.localName;

	if (nodeName=="animateColor") {

		this.color();

	} else if (nodeName=="animateMotion") {

		this.isInterpolable = function(from, to) { return true; };
		this.getCurVal = function() {
			var curTrans = this.target.transform;
			if (curTrans && curTrans.animVal.numberOfItems>0) {
				var transList = curTrans.animVal;
				return decompose(transList.getItem(0).matrix, "translate");
			} else
				return "0,0";
		};
		this.path = this.getPath();
		if (this.path) {
			this.valueAt = function(percent) {
				var length = this.path.getTotalLength();
				var point = this.path.getPointAtLength(percent*length);
				return point.x+","+point.y;
			};
		} else {
			this.translation();
		}
		this.freeze = function() {
			var val = this.valueAt(1);
			this.step(val);
		};
		if (this.keyPoints && this.keyTimes) {
			this.pathKeyTimes = this.keyTimes;
			this.keyTimes = null;
			this.superValueAt = this.valueAt;
			this.valueAt = function(percent) {
				for (var i=1; i<this.keyPoints.length; ++i) {
					var fakePC = this.keyPoints[this.keyPoints.length-1]
					if (this.pathKeyTimes[i]>percent) {
						var pt = this.keyPoints[i-1];
						if (this.calcMode=="discrete")
							fakePC = pt;
						else {
							var t1 = this.pathKeyTimes[i-1];
							percent = (percent-t1)/(this.pathKeyTimes[i]-t1);
							fakePC = pt+((this.keyPoints[i]-pt)*percent)
						}
						break;
					}
				}
				return this.superValueAt(fakePC);
			};
		}
		this.step = function(value) {
			value = "translate("+value+")";
			this.target.setAttribute("transform", value);
		};

	} else if (nodeName=="animateTransform") {

		this.isInterpolable = function(from, to) { return true; };
		this.getCurVal = function() {
			var type = this.type;
			var curTrans = this.target.transform;
			if (curTrans && curTrans.animVal.numberOfItems>0) {
				var transList = curTrans.animVal;
				return decompose(transList.getItem(0).matrix, type);
			} else {
				if (type=="scale")
					return "1,1";
				else if (type=="translate")
					return "0,0";
				else if (type=="rotate")
					return "0,0,0";
				else
					return 0;
			}
		};

		if (this.type=="scale") {
			this.normalize = function(value) {
				value = value.replace(/,/g," ");
				var coords = value.split(" ");
				coords[0] = parseFloat(coords[0]);
				if (coords.length==1)
					coords[1] = coords[0];
				else
					coords[1] = parseFloat(coords[1]);
				return coords;
			};
			this.add = function(a, b) {
				var ret = new Array();
				for (var i=0; i<a.length; ++i)
					ret.push(a[i]*b[i]);
				return ret.join(",");
			};
		} else if (this.type=="translate") {
			this.translation();
		} else if (this.type=="rotate") {
			this.normalize = function(value) {
				value = value.replace(/,/g," ");
				var coords = value.split(" ");
				coords[0] = parseFloat(coords[0]);
				if (coords.length<3) {
					coords[1] = 0;
					coords[2] = 0;
				} else {
					coords[1] = parseFloat(coords[1]);
					coords[2] = parseFloat(coords[2]);
				}
				return coords;
			};
			this.add = function(a, b) {
				var ret = new Array();
				for (var i=0; i<a.length; ++i)
					ret.push(a[i]+b[i]);
				return ret.join(",");
			};
		}

		if (this.type=="scale" || this.type=="rotate") {
			if (this.from)
				this.from = this.normalize(this.from).join(",");
			if (this.to)
				this.to = this.normalize(this.to).join(",");
			if (this.by)
				this.by = this.normalize(this.by).join(",");
			if (this.values) {
				var tvals = this.values.split(";");
				for (var i=0; i<tvals.length; ++i)
					tvals[i] = this.normalize(tvals[i]).join(",");
				this.values = tvals.join(";");
			}
			this.interpolate = function(from, to, percent) {
				var ret = new Array();
				for (var i=0; i<from.length; ++i)
					ret.push(from[i]+((to[i]-from[i])*percent));
				return ret.join(",");
			};
		}

		this.step = function(value) {
			var attributeName = this.attributeName;
			value = this.type+"("+value+")";
			this.target.setAttribute(attributeName, value);
		};
	}

	var me = this;
	this.anim.beginElement = function() { me.begin(); return true; };
	this.anim.beginElementAt = function(offset) { me.begin(offset*1000); return true; };
	this.anim.endElement = function() { me.finish(); return true; };
	this.anim.endElementAt = function(offset) { me.finish(offset*1000); return true; };

	this.anim.getStartTime = function() { return (me.iterBegin-timeZero)/1000; };
	this.anim.getCurrentTime = function() {
		var now = new Date();
		return (now-me.iterBegin)/1000;
	};
}


/**
 * Can be called at any time.
 * It's the main loop.
 */
function animate() {
	var curTime = new Date();
	if (curTime<=prevTime)
		return;
	for (var i=0, j=animations.length; i<j; ++i) {
		try {
			if (!animations[i].f(curTime)) {
				// animation was removed therefore we need to adjust both the iterator and the auxiliary variable
				--i; --j;
			}
		} catch(exc) {
			if (exc.message!=="Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIDOMSVGPathElement.getTotalLength]") {
				// NOTE: in IE, console object is only available when Developer tools are open
				if (window.console && console.log) {
					console.log(exc);
				// uncomment to force error display
				//} else {
				//	alert(exc);
				}
			}
		}
	}
	prevTime = curTime;
	// it would be cool if the attributes would be computed only, in the previous loop
	// and then the last values applied after the loop
	// for that, f(t) must return the value, and we must have a map for object(?).attributeType.attributeName -> value
	// then f(t) cannot return false when autostopping -> we must find another mechanism
}


/**
 * Converts a clock-value to milliseconds.
 * Supported: "s" | "ms" | "min" | "h" | no-units
 */
function toMillis(time) {
	time = time.trim();
	var len = time.length;
	var io = time.indexOf(":");

	if (io!=-1) {
		var clockVal = time.split(":");
		len = clockVal.length;
		time = 0;
		if (len==3)
			time += parseInt(clockVal[0])*3600000;
		time += parseInt(clockVal[len-2])*60000;
		time += parseFloat(clockVal[len-1])*1000;
	} else if (len>2 && time.substring(len-2)=="ms") {
		time = parseInt(time.substring(0, time.length-2));
	} else if (len>1 && time[len-1]=="s") {
		time = time.substring(0, time.length-1);
		time *= 1000;
	} else if (len>3 && time.substring(len-3)=="min") {
		time = time.substring(0, time.length-3);
		time *= 60000;
	} else if (len>1 && time[len-1]=="h") {
		time = time.substring(0, time.length-1);
		time *= 3600000;
	} else {
		time *= 1000;
	}
	return time;
}


/**
 * Decompose a matrix into its scale, translate, rotate or skew.
 */
function decompose(matrix, type) {
	if (type=="translate")
		return matrix.e+","+matrix.f;

	var a = matrix.a;
	var b = matrix.b;
	var c = matrix.c;
	var d = matrix.d;

	if (type=="rotate")
		return Math.atan2(c,a)+",0,0";

	var ModA = Math.sqrt(a*a+c*c);
	var ModB = Math.sqrt(b*b+d*d);

	if (type=="scale") {
		var AxB = a*d-b*c;
		var scaleX = AxB==0?0:(AxB/ModA);
		var scaleY = ModB;
		return scaleX+","+scaleY;
	}
	var AdotB = a*b+c*d;
	if (AdotB==0)
		return 0;
	var shear = Math.PI/2-Math.acos(AdotB/(ModB*ModA));
	return (shear*180)/Math.PI;
}


/**
 * Convert an rgb(), #XXX, #XXXXXX or named color
 * into an [r,g,b] array.
 */
function toRGB(color) {
	if (color.substring(0, 3)=="rgb") {
		color = color.replace(/ /g, "");
		color = color.replace("rgb(", "");
		color = color.replace(")", "");
		var rgb = color.split(",");
		for (var i=0; i<rgb.length; ++i) {
			var len = rgb[i].length-1;
			if (rgb[i][len]=="%")
				rgb[i] = Math.round((rgb[i].substring(0,len))*2.55);
			else
				rgb[i] = parseInt(rgb[i]);
		}
		return rgb;
	} else if (color.charAt(0)=="#") {
		color = color.trim();
		var rgb = new Array();
		if (color.length==7) {
			rgb[0] = parseInt(color.substring(1,3),16);
			rgb[1] = parseInt(color.substring(3,5),16);
			rgb[2] = parseInt(color.substring(5,7),16);
		} else {
			rgb[0] = color.substring(1,2);
			rgb[1] = color.substring(2,3);
			rgb[2] = color.substring(3,4);
			rgb[0] = parseInt(rgb[0]+rgb[0],16);
			rgb[1] = parseInt(rgb[1]+rgb[1],16);
			rgb[2] = parseInt(rgb[2]+rgb[2],16);
		}
		return rgb;
	} else {
		return colors[color];
	}
}


function createPath(d) {
	var path = document.createElementNS(svgns, "path");
	path.setAttribute("d", d);
	try {
		if (path.normalizedPathSegList)
			path.myNormalizedPathSegList = path.normalizedPathSegList;
	} catch(exc) {}
	if (!path.myNormalizedPathSegList) {
		// TODO : normalize the path
		path.myNormalizedPathSegList = path.pathSegList;
	}
	return path;
}


// NOTE: units which aren't valid variable names are enclosed in quotes
var units = {grad: 1, deg: 1, rad: 1, kHz: 1, Hz: 1, em: 1, ex: 1, px: 1, pt: 1, pc: 1, mm: 1, cm: 1, in: 1, ms: 1, s: 1, "%": 1};
function getUnit(str) {
	if (str && str.substring && str.length > 1) {
		for (var i=1; i<4; ++i) { // loop through units string length
			var vlen = str.length-i;
			if (vlen>0) {
				var unit = str.substring(vlen);
				if (units[unit]) {
					var val = str.substring(0, vlen);
					if (!isNaN(val))
						return [val,unit];
				}
			}
		}
	}
	return [str,null];
}

var colors = {
	aliceblue : [240, 248, 255],
	antiquewhite : [250, 235, 215],
	aqua : [0, 255, 255],
	aquamarine : [127, 255, 212],
	azure : [240, 255, 255],
	beige : [245, 245, 220],
	bisque : [255, 228, 196],
	black : [0, 0, 0],
	blanchedalmond : [255, 235, 205],
	blue : [0, 0, 255],
	blueviolet : [138, 43, 226],
	brown : [165, 42, 42],
	burlywood : [222, 184, 135],
	cadetblue : [95, 158, 160],
	chartreuse : [127, 255, 0],
	chocolate : [210, 105, 30],
	coral : [255, 127, 80],
	cornflowerblue : [100, 149, 237],
	cornsilk : [255, 248, 220],
	crimson : [220, 20, 60],
	cyan : [0, 255, 255],
	darkblue : [0, 0, 139],
	darkcyan : [0, 139, 139],
	darkgoldenrod : [184, 134, 11],
	darkgray : [169, 169, 169],
	darkgreen : [0, 100, 0],
	darkgrey : [169, 169, 169],
	darkkhaki : [189, 183, 107],
	darkmagenta : [139, 0, 139],
	darkolivegreen : [85, 107, 47],
	darkorange : [255, 140, 0],
	darkorchid : [153, 50, 204],
	darkred : [139, 0, 0],
	darksalmon : [233, 150, 122],
	darkseagreen : [143, 188, 143],
	darkslateblue : [72, 61, 139],
	darkslategray : [47, 79, 79],
	darkslategrey : [47, 79, 79],
	darkturquoise : [0, 206, 209],
	darkviolet : [148, 0, 211],
	deeppink : [255, 20, 147],
	deepskyblue : [0, 191, 255],
	dimgray : [105, 105, 105],
	dimgrey : [105, 105, 105],
	dodgerblue : [30, 144, 255],
	firebrick : [178, 34, 34],
	floralwhite : [255, 250, 240],
	forestgreen : [34, 139, 34],
	fuchsia : [255, 0, 255],
	gainsboro : [220, 220, 220],
	ghostwhite : [248, 248, 255],
	gold : [255, 215, 0],
	goldenrod : [218, 165, 32],
	gray : [128, 128, 128],
	grey : [128, 128, 128],
	green : [0, 128, 0],
	greenyellow : [173, 255, 47],
	honeydew : [240, 255, 240],
	hotpink : [255, 105, 180],
	indianred : [205, 92, 92],
	indigo : [75, 0, 130],
	ivory : [255, 255, 240],
	khaki : [240, 230, 140],
	lavender : [230, 230, 250],
	lavenderblush : [255, 240, 245],
	lawngreen : [124, 252, 0],
	lemonchiffon : [255, 250, 205],
	lightblue : [173, 216, 230],
	lightcoral : [240, 128, 128],
	lightcyan : [224, 255, 255],
	lightgoldenrodyellow : [250, 250, 210],
	lightgray : [211, 211, 211],
	lightgreen : [144, 238, 144],
	lightgrey : [211, 211, 211],
	lightpink : [255, 182, 193],
	lightsalmon : [255, 160, 122],
	lightseagreen : [32, 178, 170],
	lightskyblue : [135, 206, 250],
	lightslategray : [119, 136, 153],
	lightslategrey : [119, 136, 153],
	lightsteelblue : [176, 196, 222],
	lightyellow : [255, 255, 224],
	lime : [0, 255, 0],
	limegreen : [50, 205, 50],
	linen : [250, 240, 230],
	magenta : [255, 0, 255],
	maroon : [128, 0, 0],
	mediumaquamarine : [102, 205, 170],
	mediumblue : [0, 0, 205],
	mediumorchid : [186, 85, 211],
	mediumpurple : [147, 112, 219],
	mediumseagreen : [60, 179, 113],
	mediumslateblue : [123, 104, 238],
	mediumspringgreen : [0, 250, 154],
	mediumturquoise : [72, 209, 204],
	mediumvioletred : [199, 21, 133],
	midnightblue : [25, 25, 112],
	mintcream : [245, 255, 250],
	mistyrose : [255, 228, 225],
	moccasin : [255, 228, 181],
	navajowhite : [255, 222, 173],
	navy : [0, 0, 128],
	oldlace : [253, 245, 230],
	olive : [128, 128, 0],
	olivedrab : [107, 142, 35],
	orange : [255, 165, 0],
	orangered : [255, 69, 0],
	orchid : [218, 112, 214],
	palegoldenrod : [238, 232, 170],
	palegreen : [152, 251, 152],
	paleturquoise : [175, 238, 238],
	palevioletred : [219, 112, 147],
	papayawhip : [255, 239, 213],
	peachpuff : [255, 218, 185],
	peru : [205, 133, 63],
	pink : [255, 192, 203],
	plum : [221, 160, 221],
	powderblue : [176, 224, 230],
	purple : [128, 0, 128],
	red : [255, 0, 0],
	rosybrown : [188, 143, 143],
	royalblue : [65, 105, 225],
	saddlebrown : [139, 69, 19],
	salmon : [250, 128, 114],
	sandybrown : [244, 164, 96],
	seagreen : [46, 139, 87],
	seashell : [255, 245, 238],
	sienna : [160, 82, 45],
	silver : [192, 192, 192],
	skyblue : [135, 206, 235],
	slateblue : [106, 90, 205],
	slategray : [112, 128, 144],
	slategrey : [112, 128, 144],
	snow : [255, 250, 250],
	springgreen : [0, 255, 127],
	steelblue : [70, 130, 180],
	tan : [210, 180, 140],
	teal : [0, 128, 128],
	thistle : [216, 191, 216],
	tomato : [255, 99, 71],
	turquoise : [64, 224, 208],
	violet : [238, 130, 238],
	wheat : [245, 222, 179],
	white : [255, 255, 255],
	whitesmoke : [245, 245, 245],
	yellow : [255, 255, 0],
	yellowgreen : [154, 205, 50]
};

// NOTE: variables cannot contain dashes, as they are seen as a subtraction expression
// (therefore, in those cases, enclosing in quotes is required)
var propDefaults = {
	font : "see individual properties",
	"font-family" : "Arial",
	"font-size" : "medium",
	"font-size-adjust" : "none",
	"font-stretch" : "normal",
	"font-style" : "normal",
	"font-variant" : "normal",
	"font-weight" : "normal",
	direction : "ltr",
	"letter-spacing" : "normal",
	"text-decoration" : "none",
	"unicode-bidi" : "normal",
	"word-spacing" : "normal",
	clip : "auto",
	color : "depends on user agent",
	cursor : "auto",
	display : "inline",
	overflow : "hidden",
	visibility : "visible",
	"clip-path" : "none",
	"clip-rule" : "nonzero",
	mask : "none",
	opacity: 1,
	"enable-background" : "accumulate",
	filter : "none",
	"flood-color" : "black",
	"flood-opacity" : 1,
	"lighting-color" : "white",
	"stop-color" : "black",
	"stop-opacity" : 1,
	"pointer-events" : "visiblePainted",
	"color-interpolation" : "sRGB",
	"color-interpolation-filters" : "linearRGB",
	"color-profile" : "auto",
	"color-rendering" : "auto",
	fill : "black",
	"fill-opacity" : 1,
	"fill-rule" : "nonzero",
	"image-rendering" : "auto",
	"marker-end" : "none",
	"marker-mid" : "none",
	"marker-start" : "none",
	"shape-rendering" : "auto",
	stroke : "none",
	"stroke-dasharray" : "none",
	"stroke-dashoffset" : 0,
	"stroke-linecap" : "butt",
	"stroke-linejoin" : "miter",
	"stroke-miterlimit" : 4,
	"stroke-opacity" : 1,
	"stroke-width" : 1,
	"text-rendering" : "auto",
	"alignment-baseline" : 0,
	"baseline-shift" : "baseline",
	"dominant-baseline" : "auto",
	"glyph-orientation-horizontal" : 0,
	"glyph-orientation-vertical" : "auto",
	kerning : "auto",
	"text-anchor" : "start",
	"writing-mode" : "lr-tb"
};

function funk(func, obj, arg) {
	return function() {func.call(obj, arg);};
}

/**
 * Removes the leading and trailing spaces chars from the string.
 * NOTE: part of ES5, so use feature detection
 * http://stackoverflow.com/questions/2308134/trim-in-javascript-not-working-in-ie/#2308157
 * NOTE: the regular expression used in fallback is placed in global namespace for performance
 * (as it's far better having a "singleton" than bloating every string instance)
 */
if (typeof String.prototype.trim !== "function") {
	window._trimRegExp = new RegExp("^\\s+|\\s+$", "g");
	String.prototype.trim = function() {
		return this.replace(window._trimRegExp, "");
	};
}

/**
 * Set an ISO 8601 timestamp to a Date object.
 * NOTE: as ES5 doesn't define precisely what "parse" should do, we run a sample to test for feasibility
 * http://stackoverflow.com/questions/2479714/does-javascript-ecmascript3-support-iso8601-date-parsing/#2481375
 * NOTE: the regular expression used in fallback is placed in global namespace for performance
 * (as it's far better having a "singleton" than bloating every date instance)
 */
if (!isNaN(Date.parse("2012-04-22T19:53:32Z"))){
	// parse did well, use the native implementation
	Date.prototype.setISO8601 = function (string) {
		this.setTime(Date.parse(string));
	};
}else{
	window._setISO8601RegExp = new RegExp(
		"([0-9]{4})(?:-([0-9]{2})(?:-([0-9]{2})" +
		"(?:T([0-9]{2}):([0-9]{2})(?::([0-9]{2})(?:\.([0-9]+))?)?" +
		"(?:Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?"
	);
	Date.prototype.setISO8601 = function (string) {
		var d = window._setISO8601RegExp.exec(string);

		// check that RegExp was applied successfully and that at least year is present
		if (d && d.length>1) {
			var date = new Date(d[1], 0, 1);
			if (d[2]) { date.setMonth(d[2] - 1); }
			if (d[3]) { date.setDate(d[3]); }
			if (d[4]) { date.setHours(d[4]); }
			if (d[5]) { date.setMinutes(d[5]); }
			if (d[6]) { date.setSeconds(d[6]); }
			// NOTE: ISO 8601 "decimal fraction of a second" needs to be converted to milliseconds
			if (d[7]) { date.setMilliseconds(parseFloat("0." + d[7]) * 1000); }
			if (d[8]) {
				var offset = (parseInt(d[10]) * 60) + parseInt(d[11]);
				if (d[9]!='-') { offset = -offset; }
			} else
				var offset = 0;
			offset -= date.getTimezoneOffset();
			this.setTime(date.getTime() + (offset * 60 * 1000));
		} else
			this.setTime(NaN);
	};
}

try {
	// NOTE: ASV skips triggering the library here, as 'addEventListener' is not supported
	// (but that's not an issue as most popular versions, ASV3 and ASV6 beta, both support SMIL)
	window.addEventListener("load", initSMIL, false);
} catch(exc) {}

;/*})'"*/
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/modules/contrib/imce_prettyfiles/imce_prettyfiles.js. */
(function($){Drupal.behaviors.imce_prettyfiles={attach:function(context,settings){if(window.imce)imce.hooks.load.push(function(){imce.conf.furl='/files/'})}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/modules/contrib/imce_prettyfiles/imce_prettyfiles.js. */
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/modules/contrib/better_exposed_filters/better_exposed_filters.js. */
(function($){Drupal.behaviors.betterExposedFilters={attach:function(context){$('.bef-tree input[type=checkbox], .bef-checkboxes input[type=checkbox]').change(function(){_bef_highlight(this,context)}).filter(':checked').closest('.form-item',context).addClass('highlight')}};Drupal.behaviors.betterExposedFiltersSelectAllNone={attach:function(context){var selected=$('.form-checkboxes.bef-select-all-none:not(.bef-processed)');if(selected.length){var selAll=Drupal.t('Select All'),selNone=Drupal.t('Select None'),link=$('<a class="bef-toggle" href="#">'+selAll+'</a>');link.click(function(event){event.preventDefault();event.stopPropagation();if(selAll==$(this).text()){$(this).html(selNone).siblings('.bef-checkboxes, .bef-tree').find('.form-item input:checkbox').each(function(){$(this).attr('checked',true);_bef_highlight(this,context)}).end().find('input[type=checkbox]:first').change()}else $(this).html(selAll).siblings('.bef-checkboxes, .bef-tree').find('.form-item input:checkbox').each(function(){$(this).attr('checked',false);_bef_highlight(this,context)}).end().find('input[type=checkbox]:first').change()});selected.addClass('bef-processed').each(function(index){var newLink=link.clone(true);newLink.insertBefore($('.bef-checkboxes, .bef-tree',this));if($('input:checkbox:checked',this).length==$('input:checkbox',this).length)newLink.click()})};var befSettings=Drupal.settings.better_exposed_filters;if(befSettings&&befSettings.datepicker&&befSettings.datepicker_options&&$.fn.datepicker){var opt=[];$.each(befSettings.datepicker_options,function(key,val){if(key&&val)opt[key]=JSON.parse(val)});$('.bef-datepicker').datepicker(opt)}}};Drupal.behaviors.betterExposedFiltersAllNoneNested={attach:function(context,settings){$('.form-checkboxes.bef-select-all-none-nested li').has('ul').once('bef-all-none-nested',function(){$(this).find('input.form-checkboxes:first').click(function(){var checkedParent=$(this).attr('checked');if(!checkedParent){$(this).parents('li:first').find('ul input.form-checkboxes').removeAttr('checked')}else $(this).parents('li:first').find('ul input.form-checkboxes').attr('checked',$(this).attr('checked'))}).end().find('ul input.form-checkboxes').click(function(){var checked=$(this).attr('checked'),ct=$(this).parents('ul:first').find('input.form-checkboxes:not(:checked)').size();if(!checked)$(this).parents('li:first').parents('li:first').find('input.form-checkboxes:first').removeAttr('checked');if(!ct)$(this).parents('li:first').parents('li:first').find('input.form-checkboxes:first').attr('checked',checked)})})}};Drupal.behaviors.better_exposed_filters_slider={attach:function(context,settings){var befSettings=settings.better_exposed_filters;if(befSettings&&befSettings.slider&&befSettings.slider_options)$.each(befSettings.slider_options,function(i,sliderOptions){var containing_parent="#"+sliderOptions.viewId+" #edit-"+sliderOptions.id+"-wrapper .views-widget",$filter=$(containing_parent);if(!$filter.length){containing_parent="#"+sliderOptions.viewId+" .bef-slider-wrapper";$filter=$(containing_parent)};$filter.once('slider-filter',function(){var $input=$(this).find('input[type=text]');if($input.length==2){var $min=$input.parent().find('input#edit-'+sliderOptions.id+'-min'),$max=$input.parent().find('input#edit-'+sliderOptions.id+'-max'),default_min,default_max;if(!$min.length||!$max.length)return;default_min=parseFloat(($min.val()=='')?sliderOptions.min:$min.val(),10);default_max=parseFloat(($max.val()=='')?sliderOptions.max:$max.val(),10);$min.val(default_min);$max.val(default_max);$min.parents(containing_parent).after($('<div class="bef-slider"></div>').slider({range:true,min:parseFloat(sliderOptions.min,10),max:parseFloat(sliderOptions.max,10),step:parseFloat(sliderOptions.step,10),animate:sliderOptions.animate?sliderOptions.animate:false,orientation:sliderOptions.orientation,values:[default_min,default_max],slide:function(event,ui){$min.val(ui.values[0]);$max.val(ui.values[1])},change:function(event,ui){$min.val(ui.values[0]);$max.val(ui.values[1])},stop:function(event,ui){$(this).parents('form').find('.ctools-auto-submit-click').click()}}));$min.blur(function(){befUpdateSlider($(this),0,sliderOptions)});$max.blur(function(){befUpdateSlider($(this),1,sliderOptions)})}else if($input.length==1){if($input.attr('id')!='edit-'+sliderOptions.id)return;var default_value=parseFloat(($input.val()=='')?sliderOptions.min:$input.val(),10);$input.val(default_value);$input.parents(containing_parent).after($('<div class="bef-slider"></div>').slider({min:parseFloat(sliderOptions.min,10),max:parseFloat(sliderOptions.max,10),step:parseFloat(sliderOptions.step,10),animate:sliderOptions.animate?sliderOptions.animate:false,orientation:sliderOptions.orientation,value:default_value,slide:function(event,ui){$input.val(ui.value)},change:function(event,ui){$input.val(ui.value)},stop:function(event,ui){$(this).parents('form').find('.ctools-auto-submit-click').click()}}));$input.blur(function(){befUpdateSlider($(this),null,sliderOptions)})}else return})})}};Drupal.behaviors.better_exposed_filters_select_as_links={attach:function(context,settings){$('.bef-select-as-links',context).once(function(){var $element=$(this);if(typeof settings.views=='undefined'||typeof settings.views.ajaxViews=='undefined')return;var $uses_ajax=false;$.each(settings.views.ajaxViews,function(i,item){var $view_name=item.view_name.replace(/_/g,'-'),$view_display_id=item.view_display_id.replace(/_/g,'-'),$id='views-exposed-form-'+$view_name+'-'+$view_display_id,$form_id=$element.parents('form').attr('id');if($form_id==$id){$uses_ajax=true;return}});if(!$uses_ajax)return;$(this).find('a').click(function(event){var $wrapper=$(this).parents('.bef-select-as-links'),$options=$wrapper.find('select option');event.preventDefault();event.stopPropagation();var link_text=$(this).text();removed='';$($options).each(function(i){if($(this).attr('selected'))if(link_text==$(this).text()){removed=$(this).text();$(this).removeAttr('selected')}});$selected=$options.filter(function(){return $(this).text()==link_text&&removed!=link_text});$selected.attr('selected','selected');$wrapper.find('.bef-new-value').val($selected.val());$wrapper.find('.bef-new-value[value=""]').attr("disabled","disabled");$(this).addClass('active');$wrapper.parents('form').find('.views-submit-button *[type=submit]').click()});$('.bef-select-as-link').ready(function(){$('.bef-select-as-link').find('a').removeClass('active');$('.bef-new-value').each(function(i,val){id=$(this).parent().find('select').attr('id')+'-'+$(this).val();$('#'+id).find('a').addClass('active')})})})}};Drupal.behaviors.betterExposedFiltersRequiredFilter={attach:function(context,settings){$('.bef-select-as-checkboxes',context).once('bef-required-filter').ajaxComplete(function(e,xhr,s){var $element=$(this);if(typeof settings.views=='undefined'||typeof settings.views.ajaxViews=='undefined')return;var $view_name,$view_display_id,$uses_ajax=false;$.each(settings.views.ajaxViews,function(i,item){$view_name=item.view_name;$view_display_id=item.view_display_id;var $id='views-exposed-form-'+$view_name.replace(/_/g,'-')+'-'+$view_display_id.replace(/_/g,'-'),$form_id=$element.parents('form').attr('id');if($form_id==$id){$uses_ajax=true;return false}});if($('input',this).length>0){var $filter_name=$('input',this).attr('name').slice(0,-2);if(Drupal.settings.better_exposed_filters.views[$view_name].displays[$view_display_id].filters[$filter_name].required&&$('input:checked',this).length==0)$('input',this).prop('checked',true)}})}}
function _bef_highlight(elem,context){$elem=$(elem,context);$elem.attr('checked')?$elem.closest('.form-item',context).addClass('highlight'):$elem.closest('.form-item',context).removeClass('highlight')}
function befUpdateSlider($el,valIndex,sliderOptions){var val=parseFloat($el.val(),10),currentMin=$el.parents('div.views-widget').next('.bef-slider').slider('values',0),currentMax=$el.parents('div.views-widget').next('.bef-slider').slider('values',1);if(valIndex!=null){if(valIndex==0&&val>currentMax)val=currentMax;if(valIndex==1&&val<currentMin)val=currentMin;if(isNaN(val))val=$el.parents('div.views-widget').next('.bef-slider').slider('values',valIndex)}else if(isNaN(val))val=$el.parents('div.views-widget').next('.bef-slider').slider('value');val=parseFloat(val,10);if(valIndex!=null){$el.parents('div.views-widget').next('.bef-slider').slider('values',valIndex,val)}else $el.parents('div.views-widget').next('.bef-slider').slider('value',val)}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/modules/contrib/better_exposed_filters/better_exposed_filters.js. */
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/modules/contrib/ctools/js/auto-submit.js. */
(function($){Drupal.behaviors.CToolsAutoSubmit={attach:function(context){function triggerSubmit(e){if($.contains(document.body,this)){var $this=$(this);if(!$this.hasClass('ctools-ajaxing'))$this.find('.ctools-auto-submit-click').click()}};$('form.ctools-auto-submit-full-form',context).add('.ctools-auto-submit',context).filter('form, select, input:not(:text, :submit)').once('ctools-auto-submit').change(function(e){if($(e.target).is(':not(:text, :submit, .ctools-auto-submit-exclude)'))triggerSubmit.call(e.target.form)});var discardKeyCode=[16,17,18,20,33,34,35,36,37,38,39,40,9,13,27];$('.ctools-auto-submit-full-form input:text, input:text.ctools-auto-submit',context).filter(':not(.ctools-auto-submit-exclude)').once('ctools-auto-submit',function(){var timeoutID=0;$(this).bind('keydown keyup',function(e){if($.inArray(e.keyCode,discardKeyCode)===-1)timeoutID&&clearTimeout(timeoutID)}).keyup(function(e){if($.inArray(e.keyCode,discardKeyCode)===-1)timeoutID=setTimeout($.proxy(triggerSubmit,this.form),500)}).bind('change',function(e){if($.inArray(e.keyCode,discardKeyCode)===-1)timeoutID=setTimeout($.proxy(triggerSubmit,this.form),500)})})}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/modules/contrib/ctools/js/auto-submit.js. */
;/*})'"*/
/*!
 * Masonry PACKAGED v4.0.0
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

!function(t,e){"use strict";"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(i){e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function i(i,r,a){function h(t,e,n){var o,r="$()."+i+'("'+e+'")';return t.each(function(t,h){var u=a.data(h,i);if(!u)return void s(i+" not initialized. Cannot call methods, i.e. "+r);var d=u[e];if(!d||"_"==e.charAt(0))return void s(r+" is not a valid method");var c=d.apply(u,n);o=void 0===o?c:o}),void 0!==o?o:t}function u(t,e){t.each(function(t,n){var o=a.data(n,i);o?(o.option(e),o._init()):(o=new r(n,e),a.data(n,i,o))})}a=a||e||t.jQuery,a&&(r.prototype.option||(r.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){if("string"==typeof t){var e=o.call(arguments,1);return h(this,t,e)}return u(this,t),this},n(a))}function n(t){!t||t&&t.bridget||(t.bridget=i)}var o=Array.prototype.slice,r=t.console,s="undefined"==typeof r?function(){}:function(t){r.error(t)};return n(e||t.jQuery),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}(this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||[];return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=0,o=i[n];e=e||[];for(var r=this._onceEvents&&this._onceEvents[t];o;){var s=r&&r[o];s&&(this.off(t,o),delete r[o]),o.apply(this,e),n+=s?0:1,o=i[n]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("get-size/get-size",[],function(){return e()}):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t),i=-1==t.indexOf("%")&&!isNaN(e);return i&&e}function e(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;u>e;e++){var i=h[e];t[i]=0}return t}function n(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),e}function o(){if(!d){d=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var i=document.body||document.documentElement;i.appendChild(e);var o=n(e);r.isBoxSizeOuter=s=200==t(o.width),i.removeChild(e)}}function r(e){if(o(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var r=n(e);if("none"==r.display)return i();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var d=a.isBorderBox="border-box"==r.boxSizing,c=0;u>c;c++){var l=h[c],f=r[l],m=parseFloat(f);a[l]=isNaN(m)?0:m}var p=a.paddingLeft+a.paddingRight,g=a.paddingTop+a.paddingBottom,y=a.marginLeft+a.marginRight,v=a.marginTop+a.marginBottom,_=a.borderLeftWidth+a.borderRightWidth,E=a.borderTopWidth+a.borderBottomWidth,z=d&&s,b=t(r.width);b!==!1&&(a.width=b+(z?0:p+_));var x=t(r.height);return x!==!1&&(a.height=x+(z?0:g+E)),a.innerWidth=a.width-(p+_),a.innerHeight=a.height-(g+E),a.outerWidth=a.width+y,a.outerHeight=a.height+v,a}}var s,a="undefined"==typeof console?e:function(t){console.error(t)},h=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],u=h.length,d=!1;return r}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var n=e[i],o=n+"MatchesSelector";if(t[o])return o}}();return function(e,i){return e[t](i)}}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={};i.extend=function(t,e){for(var i in e)t[i]=e[i];return t},i.modulo=function(t,e){return(t%e+e)%e},i.makeArray=function(t){var e=[];if(Array.isArray(t))e=t;else if(t&&"number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e},i.removeFrom=function(t,e){var i=t.indexOf(e);-1!=i&&t.splice(i,1)},i.getParent=function(t,i){for(;t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,n){t=i.makeArray(t);var o=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!n)return void o.push(t);e(t,n)&&o.push(t);for(var i=t.querySelectorAll(n),r=0;r<i.length;r++)o.push(i[r])}}),o},i.debounceMethod=function(t,e,i){var n=t.prototype[e],o=e+"Timeout";t.prototype[e]=function(){var t=this[o];t&&clearTimeout(t);var e=arguments,r=this;this[o]=setTimeout(function(){n.apply(r,e),delete r[o]},i||100)}},i.docReady=function(t){"complete"==document.readyState?t():document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var n=t.console;return i.htmlInit=function(e,o){i.docReady(function(){var r=i.toDashed(o),s="data-"+r,a=document.querySelectorAll("["+s+"]"),h=document.querySelectorAll(".js-"+r),u=i.makeArray(a).concat(i.makeArray(h)),d=s+"-options",c=t.jQuery;u.forEach(function(t){var i,r=t.getAttribute(s)||t.getAttribute(d);try{i=r&&JSON.parse(r)}catch(a){return void(n&&n.error("Error parsing "+s+" on "+t.className+": "+a))}var h=new e(t,i);c&&c.data(t,o,h)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],function(i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t,t.EvEmitter,t.getSize))}(window,function(t,e,i){"use strict";function n(t){for(var e in t)return!1;return e=null,!0}function o(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}function r(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var s=document.documentElement.style,a="string"==typeof s.transition?"transition":"WebkitTransition",h="string"==typeof s.transform?"transform":"WebkitTransform",u={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[a],d=[h,a,a+"Duration",a+"Property"],c=o.prototype=Object.create(e.prototype);c.constructor=o,c._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},c.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},c.getSize=function(){this.size=i(this.element)},c.css=function(t){var e=this.element.style;for(var i in t){var n=d[i]||i;e[n]=t[i]}},c.getPosition=function(){var t=getComputedStyle(this.element),e=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop"),n=t[e?"left":"right"],o=t[i?"top":"bottom"],r=this.layout.size,s=-1!=n.indexOf("%")?parseFloat(n)/100*r.width:parseInt(n,10),a=-1!=o.indexOf("%")?parseFloat(o)/100*r.height:parseInt(o,10);s=isNaN(s)?0:s,a=isNaN(a)?0:a,s-=e?r.paddingLeft:r.paddingRight,a-=i?r.paddingTop:r.paddingBottom,this.position.x=s,this.position.y=a},c.layoutPosition=function(){var t=this.layout.size,e={},i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop"),o=i?"paddingLeft":"paddingRight",r=i?"left":"right",s=i?"right":"left",a=this.position.x+t[o];e[r]=this.getXValue(a),e[s]="";var h=n?"paddingTop":"paddingBottom",u=n?"top":"bottom",d=n?"bottom":"top",c=this.position.y+t[h];e[u]=this.getYValue(c),e[d]="",this.css(e),this.emitEvent("layout",[this])},c.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},c.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},c._transitionTo=function(t,e){this.getPosition();var i=this.position.x,n=this.position.y,o=parseInt(t,10),r=parseInt(e,10),s=o===this.position.x&&r===this.position.y;if(this.setPosition(t,e),s&&!this.isTransitioning)return void this.layoutPosition();var a=t-i,h=e-n,u={};u.transform=this.getTranslate(a,h),this.transition({to:u,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},c.getTranslate=function(t,e){var i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop");return t=i?t:-t,e=n?e:-e,"translate3d("+t+"px, "+e+"px, 0)"},c.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},c.moveTo=c._transitionTo,c.setPosition=function(t,e){this.position.x=parseInt(t,10),this.position.y=parseInt(e,10)},c._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},c._transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(t);var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var n=this.element.offsetHeight;n=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var l="opacity,"+r(d.transform||"transform");c.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:l,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(u,this,!1))},c.transition=o.prototype[a?"_transition":"_nonTransition"],c.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},c.onotransitionend=function(t){this.ontransitionend(t)};var f={"-webkit-transform":"transform"};c.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,i=f[t.propertyName]||t.propertyName;if(delete e.ingProperties[i],n(e.ingProperties)&&this.disableTransition(),i in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[i]),i in e.onEnd){var o=e.onEnd[i];o.call(this),delete e.onEnd[i]}this.emitEvent("transitionEnd",[this])}},c.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(u,this,!1),this.isTransitioning=!1},c._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var m={transitionProperty:"",transitionDuration:""};return c.removeTransitionStyles=function(){this.css(m)},c.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},c.remove=function(){return a&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},c.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("visibleStyle");e[i]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},c.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},c.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},c.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("hiddenStyle");e[i]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},c.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},c.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},o}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,n,o,r){return e(t,i,n,o,r)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,n,o){"use strict";function r(t,e){var i=n.getQueryElement(t);if(!i)return void(a&&a.error("Bad element for "+this.constructor.namespace+": "+(i||t)));this.element=i,h&&(this.$element=h(this.element)),this.options=n.extend({},this.constructor.defaults),this.option(e);var o=++d;this.element.outlayerGUID=o,c[o]=this,this._create();var r=this._getOption("initLayout");r&&this.layout()}function s(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}var a=t.console,h=t.jQuery,u=function(){},d=0,c={};r.namespace="outlayer",r.Item=o,r.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var l=r.prototype;return n.extend(l,e.prototype),l.option=function(t){n.extend(this.options,t)},l._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},r.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},l._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),n.extend(this.element.style,this.options.containerStyle);var t=this._getOption("resize");t&&this.bindResize()},l.reloadItems=function(){this.items=this._itemize(this.element.children)},l._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,n=[],o=0;o<e.length;o++){var r=e[o],s=new i(r,this);n.push(s)}return n},l._filterFindItemElements=function(t){return n.filterFindElements(t,this.options.itemSelector)},l.getItemElements=function(){return this.items.map(function(t){return t.element})},l.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},l._init=l.layout,l._resetLayout=function(){this.getSize()},l.getSize=function(){this.size=i(this.element)},l._getMeasurement=function(t,e){var n,o=this.options[t];o?("string"==typeof o?n=this.element.querySelector(o):o instanceof HTMLElement&&(n=o),this[t]=n?i(n)[e]:o):this[t]=0},l.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},l._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},l._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var i=[];t.forEach(function(t){var n=this._getItemLayoutPosition(t);n.item=t,n.isInstant=e||t.isLayoutInstant,i.push(n)},this),this._processLayoutQueue(i)}},l._getItemLayoutPosition=function(){return{x:0,y:0}},l._processLayoutQueue=function(t){t.forEach(function(t){this._positionItem(t.item,t.x,t.y,t.isInstant)},this)},l._positionItem=function(t,e,i,n){n?t.goTo(e,i):t.moveTo(e,i)},l._postLayout=function(){this.resizeContainer()},l.resizeContainer=function(){var t=this._getOption("resizeContainer");if(t){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},l._getContainerSize=u,l._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},l._emitCompleteOnItems=function(t,e){function i(){o.dispatchEvent(t+"Complete",null,[e])}function n(){s++,s==r&&i()}var o=this,r=e.length;if(!e||!r)return void i();var s=0;e.forEach(function(e){e.once(t,n)})},l.dispatchEvent=function(t,e,i){var n=e?[e].concat(i):i;if(this.emitEvent(t,n),h)if(this.$element=this.$element||h(this.element),e){var o=h.Event(e);o.type=t,this.$element.trigger(o,i)}else this.$element.trigger(t,i)},l.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},l.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},l.stamp=function(t){t=this._find(t),t&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},l.unstamp=function(t){t=this._find(t),t&&t.forEach(function(t){n.removeFrom(this.stamps,t),this.unignore(t)},this)},l._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=n.makeArray(t)):void 0},l._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},l._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},l._manageStamp=u,l._getElementOffset=function(t){var e=t.getBoundingClientRect(),n=this._boundingRect,o=i(t),r={left:e.left-n.left-o.marginLeft,top:e.top-n.top-o.marginTop,right:n.right-e.right-o.marginRight,bottom:n.bottom-e.bottom-o.marginBottom};return r},l.handleEvent=n.handleEvent,l.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},l.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},l.onresize=function(){this.resize()},n.debounceMethod(r,"onresize",100),l.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},l.needsResizeLayout=function(){var t=i(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},l.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},l.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},l.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},l.reveal=function(t){this._emitCompleteOnItems("reveal",t),t&&t.length&&t.forEach(function(t){t.reveal()})},l.hide=function(t){this._emitCompleteOnItems("hide",t),t&&t.length&&t.forEach(function(t){t.hide()})},l.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},l.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},l.getItem=function(t){for(var e=0;e<this.items.length;e++){var i=this.items[e];if(i.element==t)return i}},l.getItems=function(t){t=n.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getItem(t);i&&e.push(i)},this),e},l.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),n.removeFrom(this.items,t)},this)},l.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete c[e],delete this.element.outlayerGUID,h&&h.removeData(this.element,this.constructor.namespace)},r.data=function(t){t=n.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&c[e]},r.create=function(t,e){var i=s(r);return i.defaults=n.extend({},r.defaults),n.extend(i.defaults,e),i.compatOptions=n.extend({},r.compatOptions),i.namespace=t,i.data=r.data,i.Item=s(o),n.htmlInit(i,t),h&&h.bridget&&h.bridget(t,i),i},r.Item=o,r}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,e){var i=t.create("masonry");return i.compatOptions.fitWidth="isFitWidth",i.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0},i.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}var n=this.columnWidth+=this.gutter,o=this.containerWidth+this.gutter,r=o/n,s=n-o%n,a=s&&1>s?"round":"floor";r=Math[a](r),this.cols=Math.max(r,1)},i.prototype.getContainerWidth=function(){var t=this._getOption("fitWidth"),i=t?this.element.parentNode:this.element,n=e(i);this.containerWidth=n&&n.innerWidth},i.prototype._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i=e&&1>e?"round":"ceil",n=Math[i](t.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var o=this._getColGroup(n),r=Math.min.apply(Math,o),s=o.indexOf(r),a={x:this.columnWidth*s,y:r},h=r+t.size.outerHeight,u=this.cols+1-o.length,d=0;u>d;d++)this.colYs[s+d]=h;return a},i.prototype._getColGroup=function(t){if(2>t)return this.colYs;for(var e=[],i=this.cols+1-t,n=0;i>n;n++){var o=this.colYs.slice(n,n+t);e[n]=Math.max.apply(Math,o)}return e},i.prototype._manageStamp=function(t){var i=e(t),n=this._getElementOffset(t),o=this._getOption("originLeft"),r=o?n.left:n.right,s=r+i.outerWidth,a=Math.floor(r/this.columnWidth);a=Math.max(0,a);var h=Math.floor(s/this.columnWidth);h-=s%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var u=this._getOption("originTop"),d=(u?n.top:n.bottom)+i.outerHeight,c=a;h>=c;c++)this.colYs[c]=Math.max(d,this.colYs[c])},i.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},i.prototype._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},i.prototype.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},i});
;/*})'"*/
;/*})'"*/
/*!
 * imagesLoaded PACKAGED v4.1.0
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

!function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}(this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||[];return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=0,o=i[n];e=e||[];for(var r=this._onceEvents&&this._onceEvents[t];o;){var s=r&&r[o];s&&(this.off(t,o),delete r[o]),o.apply(this,e),n+=s?0:1,o=i[n]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define(["ev-emitter/ev-emitter"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.imagesLoaded=e(t,t.EvEmitter)}(window,function(t,e){function i(t,e){for(var i in e)t[i]=e[i];return t}function n(t){var e=[];if(Array.isArray(t))e=t;else if("number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e}function o(t,e,r){return this instanceof o?("string"==typeof t&&(t=document.querySelectorAll(t)),this.elements=n(t),this.options=i({},this.options),"function"==typeof e?r=e:i(this.options,e),r&&this.on("always",r),this.getImages(),h&&(this.jqDeferred=new h.Deferred),void setTimeout(function(){this.check()}.bind(this))):new o(t,e,r)}function r(t){this.img=t}function s(t,e){this.url=t,this.element=e,this.img=new Image}var h=t.jQuery,a=t.console;o.prototype=Object.create(e.prototype),o.prototype.options={},o.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},o.prototype.addElementImages=function(t){"IMG"==t.nodeName&&this.addImage(t),this.options.background===!0&&this.addElementBackgroundImages(t);var e=t.nodeType;if(e&&d[e]){for(var i=t.querySelectorAll("img"),n=0;n<i.length;n++){var o=i[n];this.addImage(o)}if("string"==typeof this.options.background){var r=t.querySelectorAll(this.options.background);for(n=0;n<r.length;n++){var s=r[n];this.addElementBackgroundImages(s)}}}};var d={1:!0,9:!0,11:!0};return o.prototype.addElementBackgroundImages=function(t){var e=getComputedStyle(t);if(e)for(var i=/url\((['"])?(.*?)\1\)/gi,n=i.exec(e.backgroundImage);null!==n;){var o=n&&n[2];o&&this.addBackground(o,t),n=i.exec(e.backgroundImage)}},o.prototype.addImage=function(t){var e=new r(t);this.images.push(e)},o.prototype.addBackground=function(t,e){var i=new s(t,e);this.images.push(i)},o.prototype.check=function(){function t(t,i,n){setTimeout(function(){e.progress(t,i,n)})}var e=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(e){e.once("progress",t),e.check()}):void this.complete()},o.prototype.progress=function(t,e,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&a&&a.log("progress: "+i,t,e)},o.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){var e=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[e](this)}},r.prototype=Object.create(e.prototype),r.prototype.check=function(){var t=this.getIsImageComplete();return t?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},r.prototype.getIsImageComplete=function(){return this.img.complete&&void 0!==this.img.naturalWidth},r.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.img,e])},r.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},r.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},r.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},r.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype=Object.create(r.prototype),s.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url;var t=this.getIsImageComplete();t&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},s.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},o.makeJQueryPlugin=function(e){e=e||t.jQuery,e&&(h=e,h.fn.imagesLoaded=function(t,e){var i=new o(this,t,e);return i.jqDeferred.promise(h(this))})},o.makeJQueryPlugin(),o});
;/*})'"*/
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/modules/contrib/masonry/masonry.js. */
(function($){Drupal.behaviors.masonry={attach:function(context,settings){$.each(Drupal.settings.masonry,function(container,settings){var $container=$(container),$options=new Object();if(settings.item_selector)$options.itemSelector=settings.item_selector;if(settings.column_width)if(settings.column_width_units=='px'){$options.columnWidth=parseInt(settings.column_width)}else if(settings.column_width_units=='%'){$options.columnWidth=($container.width()*(settings.column_width/100))-settings.gutter_width}else $options.columnWidth=settings.column_width;if(settings.stamp)$options.stamp=settings.stamp;$options.gutter=settings.gutter_width;$options.isResizeBound=settings.resizable;$options.isFitWidth=settings.fit_width;if(settings.rtl)$options.isOriginLeft=false;if(settings.animated){$options.transitionDuration=settings.animation_duration+'ms'}else $options.transitionDuration=0;if(settings.images_first){$container.imagesLoaded(function(){if($container.hasClass('masonry-processed')){$container.masonry('reloadItems').masonry('layout')}else $container.once('masonry').masonry($options)})}else if($container.hasClass('masonry-processed')){$container.masonry('reloadItems').masonry('layout')}else $container.once('masonry').masonry($options)})}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/modules/contrib/masonry/masonry.js. */
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/cnc.activities.js. */
(function($){Drupal.behaviors.cncActivities={attach:function(context,settings){var activities_view=$('.view-activities',context),overlay=null;if(activities_view.length){var _nodes=$('.views-row',activities_view);overlay=$("<div />",{id:'activities-overlay','class':'hidden'}).appendTo(activities_view);overlay.on('click',function(){$(this).addClass('hidden');_nodes.removeClass('highlighted')});_nodes.on('click',function(e){if(!$(this).hasClass('highlighted'))e.stopPropagation();overlay.css('height',activities_view.height());overlay.removeClass('hidden');$(this).addClass('highlighted')})}}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/cnc.activities.js. */
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/modules/contrib/chosen/chosen.js. */
(function($){Drupal.behaviors.chosen={attach:function(context,settings){settings.chosen=settings.chosen||Drupal.settings.chosen;var selector=settings.chosen.selector,getElementOptions=function(element){var options=$.extend({},settings.chosen.options);if(settings.chosen.minimum_width>0)if($(element).width()<settings.chosen.minimum_width){options.width=settings.chosen.minimum_width+'px'}else options.width=$(element).width()+'px';if($(element).attr('multiple')&&$(element).data('cardinality'))options.max_selected_options=$(element).data('cardinality');return options};$('select.chosen-enable, select.chosen-widget',context).once('chosen',function(){options=getElementOptions(this);$(this).chosen(options)});$(selector,context).not('#field-ui-field-overview-form select, #field-ui-display-overview-form select, .wysiwyg, .draggable select[name$="[weight]"], .draggable select[name$="[position]"], .chosen-disable, .chosen-processed').filter(function(){var minOptions=$(this).attr('multiple')?settings.chosen.minimum_multiple:settings.chosen.minimum_single;if(!minOptions){return true}else return $(this).find('option').length>=minOptions}).once('chosen',function(){options=getElementOptions(this);$(this).chosen(options)})}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/modules/contrib/chosen/chosen.js. */
;/*})'"*/
/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-mq-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function D(a){j.cssText=a}function E(a,b){return D(n.join(a+";")+(b||""))}function F(a,b){return typeof a===b}function G(a,b){return!!~(""+a).indexOf(b)}function H(a,b){for(var d in a){var e=a[d];if(!G(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function I(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:F(f,"function")?f.bind(d||b):f}return!1}function J(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return F(b,"string")||F(b,"undefined")?H(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),I(e,b,c))}function K(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.8.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},z=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b)&&c(b).matches||!1;var d;return y("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},A=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=F(e[d],"function"),F(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),B={}.hasOwnProperty,C;!F(B,"undefined")&&!F(B.call,"undefined")?C=function(a,b){return B.call(a,b)}:C=function(a,b){return b in a&&F(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e}),s.flexbox=function(){return J("flexWrap")},s.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},s.canvastext=function(){return!!e.canvas&&!!F(b.createElement("canvas").getContext("2d").fillText,"function")},s.webgl=function(){return!!a.WebGLRenderingContext},s.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:y(["@media (",n.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},s.geolocation=function(){return"geolocation"in navigator},s.postmessage=function(){return!!a.postMessage},s.websqldatabase=function(){return!!a.openDatabase},s.indexedDB=function(){return!!J("indexedDB",a)},s.hashchange=function(){return A("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},s.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},s.rgba=function(){return D("background-color:rgba(150,255,150,.5)"),G(j.backgroundColor,"rgba")},s.hsla=function(){return D("background-color:hsla(120,40%,100%,.5)"),G(j.backgroundColor,"rgba")||G(j.backgroundColor,"hsla")},s.multiplebgs=function(){return D("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return J("backgroundSize")},s.borderimage=function(){return J("borderImage")},s.borderradius=function(){return J("borderRadius")},s.boxshadow=function(){return J("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.opacity=function(){return E("opacity:.55"),/^0.55$/.test(j.opacity)},s.cssanimations=function(){return J("animationName")},s.csscolumns=function(){return J("columnCount")},s.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return D((a+"-webkit- ".split(" ").join(b+a)+n.join(c+a)).slice(0,-a.length)),G(j.backgroundImage,"gradient")},s.cssreflections=function(){return J("boxReflect")},s.csstransforms=function(){return!!J("transform")},s.csstransforms3d=function(){var a=!!J("perspective");return a&&"webkitPerspective"in g.style&&y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},s.csstransitions=function(){return J("transition")},s.fontface=function(){var a;return y('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&g.indexOf(d.split(" ")[0])===0}),a},s.generatedcontent=function(){var a;return y(["#",h,"{font:0/0 a}#",h,':after{content:"',l,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},s.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},s.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.webworkers=function(){return!!a.Worker},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==r.svg},s.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(m.call(b.createElementNS(r.svg,"animate")))},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var L in s)C(s,L)&&(x=L.toLowerCase(),e[x]=s[L](),v.push((e[x]?"":"no-")+x));return e.input||K(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)C(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},D(""),i=k=null,function(a,b){function l(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a=="string"?a.split(" "):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&&!e.test(a)&&!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function q(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?o(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function r(a){a||(a=b);var c=n(a);return s.shivCSS&&!g&&!c.hasCSS&&(c.hasCSS=!!l(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||q(a,c),a}var c="3.7.0",d=a.html5||{},e=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h="_html5shiv",i=0,j={},k;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",g="hidden"in a,k=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.mq=z,e.hasEvent=A,e.testProp=function(a){return H([a])},e.testAllProps=J,e.testStyles=y,e.prefixed=function(a,b,c){return b?J(a,b,c):J(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};

;/*})'"*/
;/*})'"*/
(function($){$.fn.hint=function(blurClass){if(!blurClass){blurClass='blur'}return this.each(function(){var $input=$(this),title=$input.attr('title'),$form=$(this.form),$win=$(window);function remove(){if($input.val()===title&&$input.hasClass(blurClass)){$input.val('').removeClass(blurClass)}}if(title){$input.blur(function(){if(this.value===''){$input.val(title).addClass(blurClass)}}).focus(remove).blur();$form.submit(remove);$win.unload(remove)}})}})(jQuery);
;/*})'"*/
;/*})'"*/
/*
 * jQuery Selectbox plugin 0.2
 *
 * Copyright 2011-2012, Dimitar Ivanov (http://www.bulgaria-web-developers.com/projects/javascript/selectbox/)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Date: Tue Jul 17 19:58:36 2012 +0300
 */
(function($,undefined){var PROP_NAME="selectbox",FALSE=false,TRUE=true;function Selectbox(){this._state=[];this._defaults={classHolder:"sbHolder",classHolderDisabled:"sbHolderDisabled",classSelector:"sbSelector",classOptions:"sbOptions",classGroup:"sbGroup",classSub:"sbSub",classDisabled:"sbDisabled",classToggleOpen:"sbToggleOpen",classToggle:"sbToggle",classFocus:"sbFocus",speed:200,effect:"slide",onChange:null,onOpen:null,onClose:null}}$.extend(Selectbox.prototype,{_isOpenSelectbox:function(target){if(!target){return FALSE}var inst=this._getInst(target);return inst.isOpen},_isDisabledSelectbox:function(target){if(!target){return FALSE}var inst=this._getInst(target);return inst.isDisabled},_attachSelectbox:function(target,settings){if(this._getInst(target)){return FALSE}var $target=$(target),self=this,inst=self._newInst($target),sbHolder,sbSelector,sbToggle,sbOptions,s=FALSE,optGroup=$target.find("optgroup"),opts=$target.find("option"),olen=opts.length;$target.attr("sb",inst.uid);$.extend(inst.settings,self._defaults,settings);self._state[inst.uid]=FALSE;$target.hide();function closeOthers(){var key,sel,uid=this.attr("id").split("_")[1];for(key in self._state){if(key!==uid){if(self._state.hasOwnProperty(key)){sel=$("select[sb='"+key+"']")[0];if(sel){self._closeSelectbox(sel)}}}}}sbHolder=$("<div>",{id:"sbHolder_"+inst.uid,"class":inst.settings.classHolder,tabindex:$target.attr("tabindex")});sbSelector=$("<a>",{id:"sbSelector_"+inst.uid,href:"#","class":inst.settings.classSelector,click:function(e){e.preventDefault();closeOthers.apply($(this),[]);var uid=$(this).attr("id").split("_")[1];if(self._state[uid]){self._closeSelectbox(target)}else{self._openSelectbox(target)}}});sbToggle=$("<a>",{id:"sbToggle_"+inst.uid,href:"#","class":inst.settings.classToggle,click:function(e){e.preventDefault();closeOthers.apply($(this),[]);var uid=$(this).attr("id").split("_")[1];if(self._state[uid]){self._closeSelectbox(target)}else{self._openSelectbox(target)}}});sbToggle.appendTo(sbHolder);sbOptions=$("<ul>",{id:"sbOptions_"+inst.uid,"class":inst.settings.classOptions,css:{display:"none"}});$target.children().each(function(i){var that=$(this),li,config={};if(that.is("option")){getOptions(that)}else{if(that.is("optgroup")){li=$("<li>");$("<span>",{text:that.attr("label")}).addClass(inst.settings.classGroup).appendTo(li);li.appendTo(sbOptions);if(that.is(":disabled")){config.disabled=true}config.sub=true;getOptions(that.find("option"),config)}}});function getOptions(){var sub=arguments[1]&&arguments[1].sub?true:false,disabled=arguments[1]&&arguments[1].disabled?true:false;arguments[0].each(function(i){var that=$(this),li=$("<li>"),child;if(that.is(":selected")){sbSelector.text(that.text());s=TRUE}if(i===olen-1){li.addClass("last")}if(!that.is(":disabled")&&!disabled){child=$("<a>",{href:"#"+that.val(),rel:that.val()}).text(that.text()).bind("click.sb",function(e){if(e&&e.preventDefault){e.preventDefault()}var t=sbToggle,$this=$(this),uid=t.attr("id").split("_")[1];self._changeSelectbox(target,$this.attr("rel"),$this.text());self._closeSelectbox(target)}).bind("mouseover.sb",function(){var $this=$(this);$this.parent().siblings().find("a").removeClass(inst.settings.classFocus);$this.addClass(inst.settings.classFocus)}).bind("mouseout.sb",function(){$(this).removeClass(inst.settings.classFocus)});if(sub){child.addClass(inst.settings.classSub)}if(that.is(":selected")){child.addClass(inst.settings.classFocus)}child.appendTo(li)}else{child=$("<span>",{text:that.text()}).addClass(inst.settings.classDisabled);if(sub){child.addClass(inst.settings.classSub)}child.appendTo(li)}li.appendTo(sbOptions)})}if(!s){sbSelector.text(opts.first().text())}$.data(target,PROP_NAME,inst);sbHolder.data("uid",inst.uid).bind("keydown.sb",function(e){var key=e.charCode?e.charCode:e.keyCode?e.keyCode:0,$this=$(this),uid=$this.data("uid"),inst=$this.siblings("select[sb='"+uid+"']").data(PROP_NAME),trgt=$this.siblings(["select[sb='",uid,"']"].join("")).get(0),$f=$this.find("ul").find("a."+inst.settings.classFocus);switch(key){case 37:case 38:if($f.length>0){var $next;$("a",$this).removeClass(inst.settings.classFocus);$next=$f.parent().prevAll("li:has(a)").eq(0).find("a");if($next.length>0){$next.addClass(inst.settings.classFocus).focus();$("#sbSelector_"+uid).text($next.text())}}break;case 39:case 40:var $next;$("a",$this).removeClass(inst.settings.classFocus);if($f.length>0){$next=$f.parent().nextAll("li:has(a)").eq(0).find("a")}else{$next=$this.find("ul").find("a").eq(0)}if($next.length>0){$next.addClass(inst.settings.classFocus).focus();$("#sbSelector_"+uid).text($next.text())}break;case 13:if($f.length>0){self._changeSelectbox(trgt,$f.attr("rel"),$f.text())}self._closeSelectbox(trgt);break;case 9:if(trgt){var inst=self._getInst(trgt);if(inst){if($f.length>0){self._changeSelectbox(trgt,$f.attr("rel"),$f.text())}self._closeSelectbox(trgt)}}var i=parseInt($this.attr("tabindex"),10);if(!e.shiftKey){i++}else{i--}$("*[tabindex='"+i+"']").focus();break;case 27:self._closeSelectbox(trgt);break}e.stopPropagation();return false}).delegate("a","mouseover",function(e){$(this).addClass(inst.settings.classFocus)}).delegate("a","mouseout",function(e){$(this).removeClass(inst.settings.classFocus)});sbSelector.appendTo(sbHolder);sbOptions.appendTo(sbHolder);sbHolder.insertAfter($target);$("html").live("mousedown",function(e){e.stopPropagation();$("select").selectbox("close")});$([".",inst.settings.classHolder,", .",inst.settings.classSelector].join("")).mousedown(function(e){e.stopPropagation()})},_detachSelectbox:function(target){var inst=this._getInst(target);if(!inst){return FALSE}$("#sbHolder_"+inst.uid).remove();$.data(target,PROP_NAME,null);$(target).show()},_changeSelectbox:function(target,value,text){var onChange,inst=this._getInst(target);if(inst){onChange=this._get(inst,"onChange");$("#sbSelector_"+inst.uid).text(text)}value=value.replace(/\'/g,"\\'");$(target).find("option[value='"+value+"']").attr("selected",TRUE);if(inst&&onChange){onChange.apply((inst.input?inst.input[0]:null),[value,inst])}else{if(inst&&inst.input){inst.input.trigger("change")}}},_enableSelectbox:function(target){var inst=this._getInst(target);if(!inst||!inst.isDisabled){return FALSE}$("#sbHolder_"+inst.uid).removeClass(inst.settings.classHolderDisabled);inst.isDisabled=FALSE;$.data(target,PROP_NAME,inst)},_disableSelectbox:function(target){var inst=this._getInst(target);if(!inst||inst.isDisabled){return FALSE}$("#sbHolder_"+inst.uid).addClass(inst.settings.classHolderDisabled);inst.isDisabled=TRUE;$.data(target,PROP_NAME,inst)},_optionSelectbox:function(target,name,value){var inst=this._getInst(target);if(!inst){return FALSE}inst[name]=value;$.data(target,PROP_NAME,inst)},_openSelectbox:function(target){var inst=this._getInst(target);if(!inst||inst.isOpen||inst.isDisabled){return }var el=$("#sbOptions_"+inst.uid),viewportHeight=parseInt($(window).height(),10),offset=$("#sbHolder_"+inst.uid).offset(),scrollTop=$(window).scrollTop(),height=el.prev().height(),diff=viewportHeight-(offset.top-scrollTop)-height/2,onOpen=this._get(inst,"onOpen");el.css({top:height+"px",maxHeight:(diff-height)+"px"});inst.settings.effect==="fade"?el.fadeIn(inst.settings.speed):el.slideDown(inst.settings.speed);$("#sbToggle_"+inst.uid).addClass(inst.settings.classToggleOpen);this._state[inst.uid]=TRUE;inst.isOpen=TRUE;if(onOpen){onOpen.apply((inst.input?inst.input[0]:null),[inst])}$.data(target,PROP_NAME,inst)},_closeSelectbox:function(target){var inst=this._getInst(target);if(!inst||!inst.isOpen){return }var onClose=this._get(inst,"onClose");inst.settings.effect==="fade"?$("#sbOptions_"+inst.uid).fadeOut(inst.settings.speed):$("#sbOptions_"+inst.uid).slideUp(inst.settings.speed);$("#sbToggle_"+inst.uid).removeClass(inst.settings.classToggleOpen);this._state[inst.uid]=FALSE;inst.isOpen=FALSE;if(onClose){onClose.apply((inst.input?inst.input[0]:null),[inst])}$.data(target,PROP_NAME,inst)},_newInst:function(target){var id=target[0].id.replace(/([^A-Za-z0-9_-])/g,"\\\\$1");return{id:id,input:target,uid:Math.floor(Math.random()*99999999),isOpen:FALSE,isDisabled:FALSE,settings:{}}},_getInst:function(target){try{return $.data(target,PROP_NAME)}catch(err){throw"Missing instance data for this selectbox"}},_get:function(inst,name){return inst.settings[name]!==undefined?inst.settings[name]:this._defaults[name]}});$.fn.selectbox=function(options){var otherArgs=Array.prototype.slice.call(arguments,1);if(typeof options=="string"&&options=="isDisabled"){return $.selectbox["_"+options+"Selectbox"].apply($.selectbox,[this[0]].concat(otherArgs))}if(options=="option"&&arguments.length==2&&typeof arguments[1]=="string"){return $.selectbox["_"+options+"Selectbox"].apply($.selectbox,[this[0]].concat(otherArgs))}return this.each(function(){typeof options=="string"?$.selectbox["_"+options+"Selectbox"].apply($.selectbox,[this].concat(otherArgs)):$.selectbox._attachSelectbox(this,options)})};$.selectbox=new Selectbox();$.selectbox.version="0.2"})(jQuery);
;/*})'"*/
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/lib/jquery.sparkscheckbox.js. */
(function($){$.fn.sparkscheckbox=function(options){var settings=$.extend({className:'checkbox',checkedOnload:false,onClick:null},options);return this.each(function(){var btn=$('<a href="#" class="'+settings.className+'" data-match="'+$(this).attr('id')+'">&#10003;</a>');btn.click(function(){var id=$(this).attr("data-match"),state=$(this).hasClass('checked'),checkbox=$("#"+id);if(checkbox.attr("type")=="radio"){var other_radios=$("input[name*='"+checkbox.attr("name")+"']");if(other_radios)other_radios.each(function(){$("a[data-match*="+$(this).attr('id')+"]").removeClass("checked");$(this).removeAttr("checked");$(this).trigger('change')})};if(state){$(this).removeClass('checked');checkbox.removeAttr('checked')}else{$(this).addClass('checked');checkbox.attr('checked','checked')};if($.isFunction(settings.onClick))settings.onClick.call();checkbox.trigger('change');return false});if($(this).attr('checked'))btn.addClass('checked');$(this).after(btn).hide()})}}(jQuery));;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/lib/jquery.sparkscheckbox.js. */
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/lib/jquery.appear.js. */
(function($){var selectors=[],check_binded=false,check_lock=false,defaults={interval:250,force_process:false},$window=$(window),$prior_appeared
function process(){check_lock=false;for(var index=0;index<selectors.length;index++){var $appeared=$(selectors[index]).filter(function(){return $(this).is(':appeared')});$appeared.trigger('appear',[$appeared]);if($prior_appeared){var $disappeared=$prior_appeared.not($appeared);$disappeared.trigger('disappear',[$disappeared])};$prior_appeared=$appeared}};$.expr[':']['appeared']=function(element){var $element=$(element);if(!$element.is(':visible'))return false;var window_left=$window.scrollLeft(),window_top=$window.scrollTop(),offset=$element.offset(),left=offset.left,top=offset.top;if(top+$element.height()>=window_top&&top-($element.data('appear-top-offset')||0)<=window_top+$window.height()&&left+$element.width()>=window_left&&left-($element.data('appear-left-offset')||0)<=window_left+$window.width()){return true}else return false};$.fn.extend({appear:function(options){var opts=$.extend({},defaults,options||{}),selector=this.selector||this;if(!check_binded){var on_check=function(){if(check_lock)return;check_lock=true;setTimeout(process,opts.interval)};$(window).scroll(on_check).resize(on_check);check_binded=true};if(opts.force_process)setTimeout(process,opts.interval);selectors.push(selector);return $(selector)}});$.extend({force_appear:function(){if(check_binded){process();return true};return false}})})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/lib/jquery.appear.js. */
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/lib/bootstrap.slider.js. */
(function($){var ErrorMsgs={formatInvalidInputErrorMsg:function(input){return"Invalid input value '"+input+"' passed in"},callingContextNotSliderInstance:"Calling context element does not have instance of Slider bound to it. Check your code to make sure the JQuery object returned from the call to the slider() initializer is calling the method"},Slider=function(element,options){var el=this.element=$(element).hide(),origWidth=$(element).length?$(element)[0].style.width:0,updateSlider=false,parent=this.element.parent();if(parent.hasClass('slider')===true){updateSlider=true;this.picker=parent}else this.picker=$('<div class="slider"><div class="slider-track"><div class="slider-selection"></div><div class="slider-handle"></div><div class="slider-handle"></div></div><div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div></div>').insertBefore(this.element).append(this.element);this.id=this.element.data('slider-id')||options.id;if(this.id)this.picker[0].id=this.id;if(typeof Modernizr!=='undefined'&&Modernizr.touch)this.touchCapable=true;var tooltip=this.element.data('slider-tooltip')||options.tooltip;this.tooltip=this.picker.find('.tooltip');this.tooltipInner=this.tooltip.find('div.tooltip-inner');this.orientation=this.element.data('slider-orientation')||options.orientation;switch(this.orientation){case'vertical':this.picker.addClass('slider-vertical');this.stylePos='top';this.mousePos='pageY';this.sizePos='offsetHeight';this.tooltip.addClass('right')[0].style.left='100%';break;default:this.picker.addClass('slider-horizontal').css('width',origWidth);this.orientation='horizontal';this.stylePos='left';this.mousePos='pageX';this.sizePos='offsetWidth';this.tooltip.addClass('top')[0].style.top=-this.tooltip.outerHeight()-14+'px';break};['min','max','step','value'].forEach(function(attr){if(typeof el.data('slider-'+attr)!=='undefined'){this[attr]=el.data('slider-'+attr)}else if(typeof options[attr]!=='undefined'){this[attr]=options[attr]}else if(typeof el.prop(attr)!=='undefined'){this[attr]=el.prop(attr)}else this[attr]=0},this);if(this.value instanceof Array)this.range=true;this.selection=this.element.data('slider-selection')||options.selection;this.selectionEl=this.picker.find('.slider-selection');if(this.selection==='none')this.selectionEl.addClass('hide');this.selectionElStyle=this.selectionEl[0].style;this.handle1=this.picker.find('.slider-handle:first');this.handle1Stype=this.handle1[0].style;this.handle1.attr("tabindex",0);this.handle2=this.picker.find('.slider-handle:last');this.handle2Stype=this.handle2[0].style;this.handle2.attr("tabindex",0);var handle=this.element.data('slider-handle')||options.handle;switch(handle){case'round':this.handle1.addClass('round');this.handle2.addClass('round');break;case'triangle':this.handle1.addClass('triangle');this.handle2.addClass('triangle');break};if(this.range){this.value[0]=Math.max(this.min,Math.min(this.max,this.value[0]));this.value[1]=Math.max(this.min,Math.min(this.max,this.value[1]))}else{this.value=[Math.max(this.min,Math.min(this.max,this.value))];this.handle2.addClass('hide');if(this.selection==='after'){this.value[1]=this.max}else this.value[1]=this.min};this.diff=this.max-this.min;this.percentage=[(this.value[0]-this.min)*100/this.diff,(this.value[1]-this.min)*100/this.diff,this.step*100/this.diff];this.offset=this.picker.offset();this.size=this.picker[0][this.sizePos];this.formater=options.formater;this.reversed=this.element.data('slider-reversed')||options.reversed;this.layout();console.log(Modernizr);if(this.touchCapable){this.picker.on({touchstart:$.proxy(this.mousedown,this)})}else this.picker.on({mousedown:$.proxy(this.mousedown,this)});if(tooltip==='hide'){this.tooltip.addClass('hide')}else if(tooltip==='always'){this.showTooltip();this.alwaysShowTooltip=true}else this.picker.on({mouseenter:$.proxy(this.showTooltip,this),mouseleave:$.proxy(this.hideTooltip,this)});if(updateSlider===true){var old=this.getValue(),val=this.calculateValue();this.element.trigger({type:'slide',value:val}).data('value',val).prop('value',val);if(old!==val)this.element.trigger({type:'slideChange','new':val,old:old}).data('value',val).prop('value',val)};this.enabled=options.enabled&&(this.element.data('slider-enabled')===undefined||this.element.data('slider-enabled')===true);if(!this.enabled)this.disable()};Slider.prototype={constructor:Slider,over:false,inDrag:false,showTooltip:function(){this.tooltip.addClass('in');this.over=true},hideTooltip:function(){if(this.inDrag===false&&this.alwaysShowTooltip!==true)this.tooltip.removeClass('in');this.over=false},layout:function(){var positionPercentages;if(this.reversed){positionPercentages=[100-this.percentage[0],this.percentage[1]]}else positionPercentages=[this.percentage[0],this.percentage[1]];this.handle1Stype[this.stylePos]=positionPercentages[0]+'%';this.handle2Stype[this.stylePos]=positionPercentages[1]+'%';if(this.orientation==='vertical'){this.selectionElStyle.top=Math.min(positionPercentages[0],positionPercentages[1])+'%';this.selectionElStyle.height=Math.abs(positionPercentages[0]-positionPercentages[1])+'%'}else{this.selectionElStyle.left=Math.min(positionPercentages[0],positionPercentages[1])+'%';this.selectionElStyle.width=Math.abs(positionPercentages[0]-positionPercentages[1])+'%'};if(this.range){this.tooltipInner.text(this.formater(this.value[0])+' : '+this.formater(this.value[1]));this.tooltip[0].style[this.stylePos]=this.size*(positionPercentages[0]+(positionPercentages[1]-positionPercentages[0])/2)/100-(this.orientation==='vertical'?this.tooltip.outerHeight()/2:this.tooltip.outerWidth()/2)+'px'}else{this.tooltipInner.html(this.formater(this.value[0]));this.tooltip[0].style[this.stylePos]=this.size*positionPercentages[0]/100-(this.orientation==='vertical'?this.tooltip.outerHeight()/2:this.tooltip.outerWidth()/2)+'px'}},mousedown:function(ev){if(!this.isEnabled())return false;if(this.touchCapable&&ev.type==='touchstart')ev=ev.originalEvent;this.offset=this.picker.offset();this.size=this.picker[0][this.sizePos];var percentage=this.getPercentage(ev);if(this.range){var diff1=Math.abs(this.percentage[0]-percentage),diff2=Math.abs(this.percentage[1]-percentage);this.dragged=(diff1<diff2)?0:1}else this.dragged=0;this.percentage[this.dragged]=this.reversed?100-percentage:percentage;this.layout();if(this.touchCapable){$(document).on({touchmove:$.proxy(this.mousemove,this),touchend:$.proxy(this.mouseup,this)})}else $(document).on({mousemove:$.proxy(this.mousemove,this),mouseup:$.proxy(this.mouseup,this)});this.inDrag=true;var val=this.calculateValue();this.setValue(val);this.element.trigger({type:'slideStart',value:val}).trigger({type:'slide',value:val});return false},mousemove:function(ev){if(!this.isEnabled())return false;if(this.touchCapable&&ev.type==='touchmove')ev=ev.originalEvent;var percentage=this.getPercentage(ev);if(this.range)if(this.dragged===0&&this.percentage[1]<percentage){this.percentage[0]=this.percentage[1];this.dragged=1}else if(this.dragged===1&&this.percentage[0]>percentage){this.percentage[1]=this.percentage[0];this.dragged=0};this.percentage[this.dragged]=this.reversed?100-percentage:percentage;this.layout();var val=this.calculateValue();this.setValue(val);this.element.trigger({type:'slide',value:val}).data('value',val).prop('value',val);return false},mouseup:function(){if(!this.isEnabled())return false;if(this.touchCapable){$(document).off({touchmove:this.mousemove,touchend:this.mouseup})}else $(document).off({mousemove:this.mousemove,mouseup:this.mouseup});this.inDrag=false;if(this.over===false)this.hideTooltip();var val=this.calculateValue();this.layout();this.element.data('value',val).prop('value',val).trigger({type:'slideStop',value:val});return false},calculateValue:function(){var val;if(this.range){val=[this.min,this.max];if(this.percentage[0]!==0)val[0]=(Math.max(this.min,this.min+Math.round((this.diff*this.percentage[0]/100)/this.step)*this.step));if(this.percentage[1]!==100)val[1]=(Math.min(this.max,this.min+Math.round((this.diff*this.percentage[1]/100)/this.step)*this.step));this.value=val}else{val=(this.min+Math.round((this.diff*this.percentage[0]/100)/this.step)*this.step);if(val<this.min){val=this.min}else if(val>this.max)val=this.max;val=parseFloat(val);this.value=[val,this.value[1]]};return val},getPercentage:function(ev){if(this.touchCapable)ev=ev.touches[0];var percentage=(ev[this.mousePos]-this.offset[this.stylePos])*100/this.size;percentage=Math.round(percentage/this.percentage[2])*this.percentage[2];return Math.max(0,Math.min(100,percentage))},getValue:function(){if(this.range)return this.value;return this.value[0]},setValue:function(val){this.value=this.validateInputValue(val);if(this.range){this.value[0]=Math.max(this.min,Math.min(this.max,this.value[0]));this.value[1]=Math.max(this.min,Math.min(this.max,this.value[1]))}else{this.value=[Math.max(this.min,Math.min(this.max,this.value))];this.handle2.addClass('hide');if(this.selection==='after'){this.value[1]=this.max}else this.value[1]=this.min};this.diff=this.max-this.min;this.percentage=[(this.value[0]-this.min)*100/this.diff,(this.value[1]-this.min)*100/this.diff,this.step*100/this.diff];this.layout()},validateInputValue:function(val){if(typeof val==='number'){return val}else if(val instanceof Array){val.forEach(function(input){if(typeof input!=='number')throw new Error(ErrorMsgs.formatInvalidInputErrorMsg(input))});return val}else throw new Error(ErrorMsgs.formatInvalidInputErrorMsg(val))},destroy:function(){this.element.show().insertBefore(this.picker);this.picker.remove();$(this.element).removeData('slider');$(this.element).off()},disable:function(){this.enabled=false;this.picker.addClass('slider-disabled');this.element.trigger('slideDisabled')},enable:function(){this.enabled=true;this.picker.removeClass('slider-disabled');this.element.trigger('slideEnabled')},toggle:function(){if(this.enabled){this.disable()}else this.enable()},isEnabled:function(){return this.enabled}};var publicMethods={getValue:Slider.prototype.getValue,setValue:Slider.prototype.setValue,destroy:Slider.prototype.destroy,disable:Slider.prototype.disable,enable:Slider.prototype.enable,toggle:Slider.prototype.toggle,isEnabled:Slider.prototype.isEnabled};$.fn.slider=function(option){if(typeof option==='string'){var args=Array.prototype.slice.call(arguments,1);return invokePublicMethod.call(this,option,args)}else return createNewSliderInstance.call(this,option)}
function invokePublicMethod(methodName,args){if(publicMethods[methodName]){var sliderObject=retrieveSliderObjectFromElement(this);return publicMethods[methodName].apply(sliderObject,args)}else throw new Error("method '"+methodName+"()' does not exist for slider.")}
function retrieveSliderObjectFromElement(element){var sliderObject=$(element).data('slider');if(sliderObject&&sliderObject instanceof Slider){return sliderObject}else throw new Error(ErrorMsgs.callingContextNotSliderInstance)}
function createNewSliderInstance(opts){var $this=$(this),data=$this.data('slider'),options=typeof opts==='object'&&opts;if(!data)$this.data('slider',(data=new Slider(this,$.extend({},$.fn.slider.defaults,options))));return $this};$.fn.slider.defaults={min:0,max:10,step:1,orientation:'horizontal',value:5,selection:'before',tooltip:'show',handle:'round',reversed:false,enabled:true,formater:function(value){return value}};$.fn.slider.Constructor=Slider})(window.jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/lib/bootstrap.slider.js. */
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/cnc.app.js. */
(function($){Drupal.behaviors.cncApp={attach:function(context,settings){$('a.chat-button',context).once('chat-button',function(){$('a.chat-button').on("click",function(){dataLayer.push({event:'VirtualPageviewChat',virtualPageURLChat:'/VirtualPageChat/start'})})});$("> *",".guide-user-down-page").on('click',function(evt){var next_block=$(this).parents('.block + .block');if(next_block)$('html,body').animate({scrollTop:next_block.offset().top},'slow');evt.preventDefault()});if(Function('/*@cc_on return document.documentMode===10@*/')())$("html").addClass("ie10");if($('.page-node-31').length>0)if($('.views-row-2 .field--name-title h2 a').text()=='Keeping busy'){$('.views-row-2 .field--name-title h2 a').attr('href','/activities-overview');$('.views-row-2 .field--name-field-teaser-image a').attr('href','/activities-overview')};$(".form-select",".webform-client-form").selectbox();var block_search=$(".global-search");$("button",".search-trigger").on('click',function(){$(this).toggleClass("active");block_search.toggleClass("opened");$(".form-text",block_search).focus();$(this).hasClass("active")?$(".form-text",block_search).focus():$(".form-text",block_search).blur()});$("button",".mobile-nav-trigger").on('click',function(){$(this).toggleClass("active");$(this).hasClass("active")?$(".mobile-nav .menu").slideDown('fast'):$(".mobile-nav .menu").slideUp('fast')});$("li.has-children > a,li.expanded > a",".mobile-nav").each(function(){var span=$('<span class="expand">+</span>');if($(this).hasClass("active-trail")){span.addClass("active");$(this).parent().addClass('expand')};$(this).append(span)});$("span.expand",".mobile-nav").on('click',function(e){$(this).toggleClass('active');$(this).parent().parent().toggleClass('expand').removeClass("active-trail");e.preventDefault()});var landing_page_teaser_view=$(".view-landing-page-teaser-list"),quotes=$(".group-quote",landing_page_teaser_view)
function verticalAlign(quote){quotes.each(function(){var h=$(this).outerHeight();$(this).css("margin-top",(h/2)*-1+'px')})};var desktop_breakpoint=945,tablet_breakpoint=760,isMobile=$(window).width()>=desktop_breakpoint?false:true,animated_divs=[$('.figure strong',context),$('.infographic-left',context),$('.infographic-right',context)],page_contains_animations=false;$.each(animated_divs,function(e){$(this).appear();page_contains_animations=true});if(page_contains_animations)$("html,body").trigger("scroll");animated_divs[0].on('appear',function(event,$all_appeared_elements){$all_appeared_elements.addClass('animated fadeInDown')});animated_divs[1].on('appear',function(event,$all_appeared_elements){$all_appeared_elements.addClass('fadeInLeft animated')});animated_divs[2].on('appear',function(event,$all_appeared_elements){$all_appeared_elements.addClass('fadeInRight animated')});$("li",".interactive-banner .block__content").hover(function(){$("li:not(this)",".interactive-banner .block__content").removeClass('opened').addClass('closed');$(this).addClass('opened').removeClass('closed')},function(){$(this).addClass('closed').removeClass('opened');$("li:not(this)",".interactive-banner .block__content").removeClass('closed')});if(Modernizr.mq('only screen and (min-width: 700px)')){var homepage_banner_panels=$("li",".interactive-banner .block__content");homepage_banner_panels.hide();window.setTimeout(function(){homepage_banner_panels.fadeIn('slow')},500)};$(".node__banner > img",context).one('load',function(){$(this).addClass('js-loaded')}).each(function(){if(this.complete)$(this).load()})}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/cnc.app.js. */
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/cnc.ga.js. */
(function($){Drupal.behaviors.cncGA={attach:function(context,settings){if($('#webform-client-form-241').length>0){$('#edit-submitted-your-name').focus(function(){triggerGoogleVirtualPage('name')});$('#edit-submitted-your-email-address').focus(function(){triggerGoogleVirtualPage('mail')});$('#edit-submitted-your-question-or-comment').focus(function(){triggerGoogleVirtualPage('comment')});$('#edit-submit').click(function(){triggerGoogleVirtualPage('sendContactUs')})}
function triggerGoogleVirtualPage(field){ga('send','pageview','/virtualPageContactUs/'+field)}}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/cnc.ga.js. */
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/cnc.slider.js. */
(function($){Drupal.behaviors.cncSlider={attach:function(context,settings){if($(".flexslider",".view-questionnaire,.view-quiz").length)$('.flexslider',".view-questionnaire,.view-quiz").flexslider({slideshow:false,after:function(slider){slider.resize()}});var breakpoints=[200,150,100,50,25],common={min:25,max:205,step:1,value:25};if(Modernizr.borderradius&&$("#slider_a").length){var x=$("#slider_a input").slider({min:common.min,max:common.max,step:common.step,value:common.value,selection:'after',orientation:'horizontal',formater:function(value){return'$'+value+'<em>per week</em>'},touchCapable:true}).on('slide',function(ev){revealOptions(ev.value)}),y=$("#slider_b input").slider({min:common.min,max:common.max,step:common.step,value:common.value,selection:'after',orientation:'vertical',reversed:false,formater:function(value){return'$'+value+'<em>per week</em>'}}).on('slide',function(ev){revealOptions(ev.value)})}
function revealOptions(val){$("li").removeClass("active");for(i in breakpoints)if(val>=breakpoints[i]){$('li[data-cost="'+breakpoints[i]+'"]').addClass('active');break}};$("button","#slider_fallback").click(function(){var amount=$(this).data("value");$("li",".rewards").hide();$("li[data-cost="+amount+"]",".rewards").show();$("button","#slider_fallback").removeClass("active");$(this).addClass("active")})}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/cnc.slider.js. */
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/cnc.youtube-modal.js. */
(function($){Drupal.behaviors.cncYoutube={attach:function(context,settings){var $_triggers=$(".js-youtube-modal",context);if($_triggers.length){var $_modal=$('<div />',{'class':'c-modal js-modal'}).appendTo('body');$("<button />",{'class':'js-close',text:'Close'}).appendTo($_modal).on('click',function(evt){$('body').removeClass('js-show-modal');$_iframe.attr('src',null)});var $_wrapper=$('<div />',{'class':'c-modal__iframe'}).appendTo($_modal),$_iframe=$('<iframe />',{frameborder:0,allowfullscreen:true,src:null}).appendTo($_wrapper)};$_triggers.on('click',function(evt){var yid=$(this).attr("href").split('/').length>=4?$(this).attr("href").split('/')[3]:null;$_iframe.attr('src','https://www.youtube.com/embed/'+yid);$('body').toggleClass('js-show-modal');evt.preventDefault()})}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/cnc.youtube-modal.js. */
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/cnc.references.js. */
(function($){Drupal.behaviors.cncReferences={attach:function(context,settings){var References=$(".node__references > ol",context);if(References.length)$("li",References).each(function(){var i=$(this).index()+1;$(".node",context).find('sup:contains("'+i+'")').attr('data-link','node-reference--'+i);$(this).attr('id','node-reference--'+i)});$("sup[data-link]",context).on('click',function(evt){var ref=$(this).attr('data-link'),id=$("#"+ref,References);if(id.length){var url=window.location.href.split('#');window.location=url[0]+"#"+ref}})}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/themes/cnc/js/cnc.references.js. */
;/*})'"*/
