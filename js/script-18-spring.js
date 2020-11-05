!function(root, factory) {
    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
    /*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
    function embed(parent, svg, target) {
        // if the target exists
        if (target) {
            // create a document fragment to hold the contents of the target
            var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
            // conditionally set the viewBox on the svg
            viewBox && svg.setAttribute("viewBox", viewBox);
            // copy the contents of the clone into the fragment
            for (// clone the target
            var clone = target.cloneNode(!0); clone.childNodes.length; ) {
                fragment.appendChild(clone.firstChild);
            }
            // append the fragment into the svg
            parent.appendChild(fragment);
        }
    }
    function loadreadystatechange(xhr) {
        // listen to changes in the request
        xhr.onreadystatechange = function() {
            // if the request is ready
            if (4 === xhr.readyState) {
                // get the cached html document
                var cachedDocument = xhr._cachedDocument;
                // ensure the cached html document based on the xhr response
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""), 
                cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
                xhr._embeds.splice(0).map(function(item) {
                    // get the cached target
                    var target = xhr._cachedTarget[item.id];
                    // ensure the cached target
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)), 
                    // embed the target into the svg
                    embed(item.parent, item.svg, target);
                });
            }
        }, // test the ready state change immediately
        xhr.onreadystatechange();
    }
    function svg4everybody(rawopts) {
        function oninterval() {
            // while the index exists in the live <use> collection
            for (// get the cached <use> index
            var index = 0; index < uses.length; ) {
                // get the current <use>
                var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent), src = use.getAttribute("xlink:href") || use.getAttribute("href");
                if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)), 
                svg && src) {
                    if (polyfill) {
                        if (!opts.validate || opts.validate(src, svg, use)) {
                            // remove the <use> element
                            parent.removeChild(use);
                            // parse the src and get the url and id
                            var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
                            // if the link is external
                            if (url.length) {
                                // get the cached xhr request
                                var xhr = requests[url];
                                // ensure the xhr request exists
                                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(), 
                                xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                                xhr._embeds.push({
                                    parent: parent,
                                    svg: svg,
                                    id: id
                                }), // prepare the xhr ready state change event
                                loadreadystatechange(xhr);
                            } else {
                                // embed the local id into the svg
                                embed(parent, svg, document.getElementById(id));
                            }
                        } else {
                            // increase the index when the previous value was not "valid"
                            ++index, ++numberOfSvgUseElementsToBypass;
                        }
                    }
                } else {
                    // increase the index when the previous value was not "valid"
                    ++index;
                }
            }
            // continue the interval
            (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame(oninterval, 67);
        }
        var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
        // create xhr requests object
        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
        // conditionally start the interval if the polyfill is active
        polyfill && oninterval();
    }
    function getSVGAncestor(node) {
        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {}
        return svg;
    }
    return svg4everybody;
});
/*! npm.im/object-fit-images 3.2.4 */
var objectFitImages = (function () {
'use strict';

var OFI = 'bfred-it:object-fit-images';
var propRegex = /(object-fit|object-position)\s*:\s*([-.\w\s%]+)/g;
var testImg = typeof Image === 'undefined' ? {style: {'object-position': 1}} : new Image();
var supportsObjectFit = 'object-fit' in testImg.style;
var supportsObjectPosition = 'object-position' in testImg.style;
var supportsOFI = 'background-size' in testImg.style;
var supportsCurrentSrc = typeof testImg.currentSrc === 'string';
var nativeGetAttribute = testImg.getAttribute;
var nativeSetAttribute = testImg.setAttribute;
var autoModeEnabled = false;

function createPlaceholder(w, h) {
	return ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'%3E%3C/svg%3E");
}

function polyfillCurrentSrc(el) {
	if (el.srcset && !supportsCurrentSrc && window.picturefill) {
		var pf = window.picturefill._;
		// parse srcset with picturefill where currentSrc isn't available
		if (!el[pf.ns] || !el[pf.ns].evaled) {
			// force synchronous srcset parsing
			pf.fillImg(el, {reselect: true});
		}

		if (!el[pf.ns].curSrc) {
			// force picturefill to parse srcset
			el[pf.ns].supported = false;
			pf.fillImg(el, {reselect: true});
		}

		// retrieve parsed currentSrc, if any
		el.currentSrc = el[pf.ns].curSrc || el.src;
	}
}

function getStyle(el) {
	var style = getComputedStyle(el).fontFamily;
	var parsed;
	var props = {};
	while ((parsed = propRegex.exec(style)) !== null) {
		props[parsed[1]] = parsed[2];
	}
	return props;
}

function setPlaceholder(img, width, height) {
	// Default: fill width, no height
	var placeholder = createPlaceholder(width || 1, height || 0);

	// Only set placeholder if it's different
	if (nativeGetAttribute.call(img, 'src') !== placeholder) {
		nativeSetAttribute.call(img, 'src', placeholder);
	}
}

function onImageReady(img, callback) {
	// naturalWidth is only available when the image headers are loaded,
	// this loop will poll it every 100ms.
	if (img.naturalWidth) {
		callback(img);
	} else {
		setTimeout(onImageReady, 100, img, callback);
	}
}

function fixOne(el) {
	var style = getStyle(el);
	var ofi = el[OFI];
	style['object-fit'] = style['object-fit'] || 'fill'; // default value

	// Avoid running where unnecessary, unless OFI had already done its deed
	if (!ofi.img) {
		// fill is the default behavior so no action is necessary
		if (style['object-fit'] === 'fill') {
			return;
		}

		// Where object-fit is supported and object-position isn't (Safari < 10)
		if (
			!ofi.skipTest && // unless user wants to apply regardless of browser support
			supportsObjectFit && // if browser already supports object-fit
			!style['object-position'] // unless object-position is used
		) {
			return;
		}
	}

	// keep a clone in memory while resetting the original to a blank
	if (!ofi.img) {
		ofi.img = new Image(el.width, el.height);
		ofi.img.srcset = nativeGetAttribute.call(el, "data-ofi-srcset") || el.srcset;
		ofi.img.src = nativeGetAttribute.call(el, "data-ofi-src") || el.src;

		// preserve for any future cloneNode calls
		// https://github.com/bfred-it/object-fit-images/issues/53
		nativeSetAttribute.call(el, "data-ofi-src", el.src);
		if (el.srcset) {
			nativeSetAttribute.call(el, "data-ofi-srcset", el.srcset);
		}

		setPlaceholder(el, el.naturalWidth || el.width, el.naturalHeight || el.height);

		// remove srcset because it overrides src
		if (el.srcset) {
			el.srcset = '';
		}
		try {
			keepSrcUsable(el);
		} catch (err) {
			if (window.console) {
				console.warn('https://bit.ly/ofi-old-browser');
			}
		}
	}

	polyfillCurrentSrc(ofi.img);

	el.style.backgroundImage = "url(\"" + ((ofi.img.currentSrc || ofi.img.src).replace(/"/g, '\\"')) + "\")";
	el.style.backgroundPosition = style['object-position'] || 'center';
	el.style.backgroundRepeat = 'no-repeat';
	el.style.backgroundOrigin = 'content-box';

	if (/scale-down/.test(style['object-fit'])) {
		onImageReady(ofi.img, function () {
			if (ofi.img.naturalWidth > el.width || ofi.img.naturalHeight > el.height) {
				el.style.backgroundSize = 'contain';
			} else {
				el.style.backgroundSize = 'auto';
			}
		});
	} else {
		el.style.backgroundSize = style['object-fit'].replace('none', 'auto').replace('fill', '100% 100%');
	}

	onImageReady(ofi.img, function (img) {
		setPlaceholder(el, img.naturalWidth, img.naturalHeight);
	});
}

function keepSrcUsable(el) {
	var descriptors = {
		get: function get(prop) {
			return el[OFI].img[prop ? prop : 'src'];
		},
		set: function set(value, prop) {
			el[OFI].img[prop ? prop : 'src'] = value;
			nativeSetAttribute.call(el, ("data-ofi-" + prop), value); // preserve for any future cloneNode
			fixOne(el);
			return value;
		}
	};
	Object.defineProperty(el, 'src', descriptors);
	Object.defineProperty(el, 'currentSrc', {
		get: function () { return descriptors.get('currentSrc'); }
	});
	Object.defineProperty(el, 'srcset', {
		get: function () { return descriptors.get('srcset'); },
		set: function (ss) { return descriptors.set(ss, 'srcset'); }
	});
}

function hijackAttributes() {
	function getOfiImageMaybe(el, name) {
		return el[OFI] && el[OFI].img && (name === 'src' || name === 'srcset') ? el[OFI].img : el;
	}
	if (!supportsObjectPosition) {
		HTMLImageElement.prototype.getAttribute = function (name) {
			return nativeGetAttribute.call(getOfiImageMaybe(this, name), name);
		};

		HTMLImageElement.prototype.setAttribute = function (name, value) {
			return nativeSetAttribute.call(getOfiImageMaybe(this, name), name, String(value));
		};
	}
}

function fix(imgs, opts) {
	var startAutoMode = !autoModeEnabled && !imgs;
	opts = opts || {};
	imgs = imgs || 'img';

	if ((supportsObjectPosition && !opts.skipTest) || !supportsOFI) {
		return false;
	}

	// use imgs as a selector or just select all images
	if (imgs === 'img') {
		imgs = document.getElementsByTagName('img');
	} else if (typeof imgs === 'string') {
		imgs = document.querySelectorAll(imgs);
	} else if (!('length' in imgs)) {
		imgs = [imgs];
	}

	// apply fix to all
	for (var i = 0; i < imgs.length; i++) {
		imgs[i][OFI] = imgs[i][OFI] || {
			skipTest: opts.skipTest
		};
		fixOne(imgs[i]);
	}

	if (startAutoMode) {
		document.body.addEventListener('load', function (e) {
			if (e.target.tagName === 'IMG') {
				fix(e.target, {
					skipTest: opts.skipTest
				});
			}
		}, true);
		autoModeEnabled = true;
		imgs = 'img'; // reset to a generic selector for watchMQ
	}

	// if requested, watch media queries for object-fit change
	if (opts.watchMQ) {
		window.addEventListener('resize', fix.bind(null, imgs, {
			skipTest: opts.skipTest
		}));
	}
}

fix.supportsObjectFit = supportsObjectFit;
fix.supportsObjectPosition = supportsObjectPosition;

hijackAttributes();

return fix;

}());

/*!
 * Cropper.js v1.5.9
 * https://fengyuanchen.github.io/cropperjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2020-09-10T13:16:26.743Z
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).Cropper=e()}(this,function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function n(t,e){for(var i=0;i<e.length;i++){var a=e[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function i(e,t){var i,a=Object.keys(e);return Object.getOwnPropertySymbols&&(i=Object.getOwnPropertySymbols(e),t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,i)),a}function k(n){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?i(Object(o),!0).forEach(function(t){var e,i,a;e=n,a=o[i=t],i in e?Object.defineProperty(e,i,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[i]=a}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(o)):i(Object(o)).forEach(function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(o,t))})}return n}function yt(t){return function(t){if(Array.isArray(t))return a(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return a(t,e);var i=Object.prototype.toString.call(t).slice(8,-1);"Object"===i&&t.constructor&&(i=t.constructor.name);if("Map"===i||"Set"===i)return Array.from(t);if("Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i))return a(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,a=new Array(e);i<e;i++)a[i]=t[i];return a}var t="undefined"!=typeof window&&void 0!==window.document,r=t?window:{},o=!(!t||!r.document.documentElement)&&"ontouchstart"in r.document.documentElement,h=t&&"PointerEvent"in r,d="cropper",O="all",T="crop",E="move",W="zoom",H="e",N="w",L="s",z="n",Y="ne",X="nw",R="se",S="sw",s="".concat(d,"-crop"),c="".concat(d,"-disabled"),A="".concat(d,"-hidden"),l="".concat(d,"-hide"),p="".concat(d,"-invisible"),m="".concat(d,"-modal"),u="".concat(d,"-move"),g="".concat(d,"Action"),f="".concat(d,"Preview"),v="crop",w="move",b="none",y="crop",x="cropend",M="cropmove",C="cropstart",D="dblclick",B=h?"pointerdown":o?"touchstart":"mousedown",j=h?"pointermove":o?"touchmove":"mousemove",I=h?"pointerup pointercancel":o?"touchend touchcancel":"mouseup",P="zoom",U="image/jpeg",q=/^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/,$=/^data:/,Q=/^data:image\/jpeg;base64,/,K=/^img|canvas$/i,Z={viewMode:0,dragMode:v,initialAspectRatio:NaN,aspectRatio:NaN,data:null,preview:"",responsive:!0,restore:!0,checkCrossOrigin:!0,checkOrientation:!0,modal:!0,guides:!0,center:!0,highlight:!0,background:!0,autoCrop:!0,autoCropArea:.8,movable:!0,rotatable:!0,scalable:!0,zoomable:!0,zoomOnTouch:!0,zoomOnWheel:!0,wheelZoomRatio:.1,cropBoxMovable:!0,cropBoxResizable:!0,toggleDragModeOnDblclick:!0,minCanvasWidth:0,minCanvasHeight:0,minCropBoxWidth:0,minCropBoxHeight:0,minContainerWidth:200,minContainerHeight:100,ready:null,cropstart:null,cropmove:null,cropend:null,crop:null,zoom:null},G=Number.isNaN||r.isNaN;function V(t){return"number"==typeof t&&!G(t)}var F=function(t){return 0<t&&t<1/0};function J(t){return void 0===t}function _(t){return"object"===e(t)&&null!==t}var tt=Object.prototype.hasOwnProperty;function et(t){if(!_(t))return!1;try{var e=t.constructor,i=e.prototype;return e&&i&&tt.call(i,"isPrototypeOf")}catch(t){return!1}}function it(t){return"function"==typeof t}var at=Array.prototype.slice;function nt(t){return Array.from?Array.from(t):at.call(t)}function ot(i,a){return i&&it(a)&&(Array.isArray(i)||V(i.length)?nt(i).forEach(function(t,e){a.call(i,t,e,i)}):_(i)&&Object.keys(i).forEach(function(t){a.call(i,i[t],t,i)})),i}var rt=Object.assign||function(i){for(var t=arguments.length,e=new Array(1<t?t-1:0),a=1;a<t;a++)e[a-1]=arguments[a];return _(i)&&0<e.length&&e.forEach(function(e){_(e)&&Object.keys(e).forEach(function(t){i[t]=e[t]})}),i},ht=/\.\d*(?:0|9){12}\d*$/;function xt(t,e){var i=1<arguments.length&&void 0!==e?e:1e11;return ht.test(t)?Math.round(t*i)/i:t}var st=/^width|height|left|top|marginLeft|marginTop$/;function ct(t,e){var i=t.style;ot(e,function(t,e){st.test(e)&&V(t)&&(t="".concat(t,"px")),i[e]=t})}function dt(t,e){var i;e&&(V(t.length)?ot(t,function(t){dt(t,e)}):t.classList?t.classList.add(e):(i=t.className.trim())?i.indexOf(e)<0&&(t.className="".concat(i," ").concat(e)):t.className=e)}function lt(t,e){e&&(V(t.length)?ot(t,function(t){lt(t,e)}):t.classList?t.classList.remove(e):0<=t.className.indexOf(e)&&(t.className=t.className.replace(e,"")))}function pt(t,e,i){e&&(V(t.length)?ot(t,function(t){pt(t,e,i)}):(i?dt:lt)(t,e))}var mt=/([a-z\d])([A-Z])/g;function ut(t){return t.replace(mt,"$1-$2").toLowerCase()}function gt(t,e){return _(t[e])?t[e]:t.dataset?t.dataset[e]:t.getAttribute("data-".concat(ut(e)))}function ft(t,e,i){_(i)?t[e]=i:t.dataset?t.dataset[e]=i:t.setAttribute("data-".concat(ut(e)),i)}var vt,wt,bt,Mt,Ct=/\s\s*/,Dt=(Mt=!1,t&&(vt=!1,wt=function(){},bt=Object.defineProperty({},"once",{get:function(){return Mt=!0,vt},set:function(t){vt=t}}),r.addEventListener("test",wt,bt),r.removeEventListener("test",wt,bt)),Mt);function Bt(i,t,a,e){var n=3<arguments.length&&void 0!==e?e:{},o=a;t.trim().split(Ct).forEach(function(t){var e;Dt||(e=i.listeners)&&e[t]&&e[t][a]&&(o=e[t][a],delete e[t][a],0===Object.keys(e[t]).length&&delete e[t],0===Object.keys(e).length&&delete i.listeners),i.removeEventListener(t,o,n)})}function kt(o,t,r,e){var h=3<arguments.length&&void 0!==e?e:{},s=r;t.trim().split(Ct).forEach(function(a){var t,n;h.once&&!Dt&&(t=o.listeners,s=function(){delete n[a][r],o.removeEventListener(a,s,h);for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];r.apply(o,e)},(n=void 0===t?{}:t)[a]||(n[a]={}),n[a][r]&&o.removeEventListener(a,n[a][r],h),n[a][r]=s,o.listeners=n),o.addEventListener(a,s,h)})}function Ot(t,e,i){var a;return it(Event)&&it(CustomEvent)?a=new CustomEvent(e,{detail:i,bubbles:!0,cancelable:!0}):(a=document.createEvent("CustomEvent")).initCustomEvent(e,!0,!0,i),t.dispatchEvent(a)}function Tt(t){var e=t.getBoundingClientRect();return{left:e.left+(window.pageXOffset-document.documentElement.clientLeft),top:e.top+(window.pageYOffset-document.documentElement.clientTop)}}var Et=r.location,Wt=/^(\w+:)\/\/([^:/?#]*):?(\d*)/i;function Ht(t){var e=t.match(Wt);return null!==e&&(e[1]!==Et.protocol||e[2]!==Et.hostname||e[3]!==Et.port)}function Nt(t){var e="timestamp=".concat((new Date).getTime());return t+(-1===t.indexOf("?")?"?":"&")+e}function Lt(t){var e=t.rotate,i=t.scaleX,a=t.scaleY,n=t.translateX,o=t.translateY,r=[];V(n)&&0!==n&&r.push("translateX(".concat(n,"px)")),V(o)&&0!==o&&r.push("translateY(".concat(o,"px)")),V(e)&&0!==e&&r.push("rotate(".concat(e,"deg)")),V(i)&&1!==i&&r.push("scaleX(".concat(i,")")),V(a)&&1!==a&&r.push("scaleY(".concat(a,")"));var h=r.length?r.join(" "):"none";return{WebkitTransform:h,msTransform:h,transform:h}}function zt(t,e){var i=t.pageX,a=t.pageY,n={endX:i,endY:a};return e?n:k({startX:i,startY:a},n)}function Yt(t,e){var i,a=t.aspectRatio,n=t.height,o=t.width,r=1<arguments.length&&void 0!==e?e:"contain",h=F(o),s=F(n);return h&&s?(i=n*a,"contain"===r&&o<i||"cover"===r&&i<o?n=o/a:o=n*a):h?n=o/a:s&&(o=n*a),{width:o,height:n}}var Xt=String.fromCharCode;var Rt=/^data:.*,/;function St(t){var e,i,a,n,o,r,h,s=new DataView(t);try{if(255===s.getUint8(0)&&216===s.getUint8(1))for(var c=s.byteLength,d=2;d+1<c;){if(255===s.getUint8(d)&&225===s.getUint8(d+1)){i=d;break}d+=1}if(i&&(n=i+10,"Exif"===function(t,e,i){var a="";i+=e;for(var n=e;n<i;n+=1)a+=Xt(t.getUint8(n));return a}(s,i+4,4)&&(!(h=18761===(o=s.getUint16(n)))&&19789!==o||42!==s.getUint16(n+2,h)||8<=(r=s.getUint32(n+4,h))&&(a=n+r))),a)for(var l,p=s.getUint16(a,h),m=0;m<p;m+=1)if(l=a+12*m+2,274===s.getUint16(l,h)){l+=8,e=s.getUint16(l,h),s.setUint16(l,1,h);break}}catch(t){e=1}return e}var At={render:function(){this.initContainer(),this.initCanvas(),this.initCropBox(),this.renderCanvas(),this.cropped&&this.renderCropBox()},initContainer:function(){var t=this.element,e=this.options,i=this.container,a=this.cropper,n=Number(e.minContainerWidth),o=Number(e.minContainerHeight);dt(a,A),lt(t,A);var r={width:Math.max(i.offsetWidth,0<=n?n:200),height:Math.max(i.offsetHeight,0<=o?o:100)};ct(a,{width:(this.containerData=r).width,height:r.height}),dt(t,A),lt(a,A)},initCanvas:function(){var t=this.containerData,e=this.imageData,i=this.options.viewMode,a=Math.abs(e.rotate)%180==90,n=a?e.naturalHeight:e.naturalWidth,o=a?e.naturalWidth:e.naturalHeight,r=n/o,h=t.width,s=t.height;t.height*r>t.width?3===i?h=t.height*r:s=t.width/r:3===i?s=t.width/r:h=t.height*r;var c={aspectRatio:r,naturalWidth:n,naturalHeight:o,width:h,height:s};this.canvasData=c,this.limited=1===i||2===i,this.limitCanvas(!0,!0),c.width=Math.min(Math.max(c.width,c.minWidth),c.maxWidth),c.height=Math.min(Math.max(c.height,c.minHeight),c.maxHeight),c.left=(t.width-c.width)/2,c.top=(t.height-c.height)/2,c.oldLeft=c.left,c.oldTop=c.top,this.initialCanvasData=rt({},c)},limitCanvas:function(t,e){var i,a,n,o,r,h=this.options,s=this.containerData,c=this.canvasData,d=this.cropBoxData,l=h.viewMode,p=c.aspectRatio,m=this.cropped&&d;t&&(a=Number(h.minCanvasWidth)||0,n=Number(h.minCanvasHeight)||0,1<l?(a=Math.max(a,s.width),n=Math.max(n,s.height),3===l&&(a<n*p?a=n*p:n=a/p)):0<l&&(a?a=Math.max(a,m?d.width:0):n?n=Math.max(n,m?d.height:0):m&&((a=d.width)<(n=d.height)*p?a=n*p:n=a/p)),a=(i=Yt({aspectRatio:p,width:a,height:n})).width,n=i.height,c.minWidth=a,c.minHeight=n,c.maxWidth=1/0,c.maxHeight=1/0),e&&((m?0:1)<l?(o=s.width-c.width,r=s.height-c.height,c.minLeft=Math.min(0,o),c.minTop=Math.min(0,r),c.maxLeft=Math.max(0,o),c.maxTop=Math.max(0,r),m&&this.limited&&(c.minLeft=Math.min(d.left,d.left+(d.width-c.width)),c.minTop=Math.min(d.top,d.top+(d.height-c.height)),c.maxLeft=d.left,c.maxTop=d.top,2===l&&(c.width>=s.width&&(c.minLeft=Math.min(0,o),c.maxLeft=Math.max(0,o)),c.height>=s.height&&(c.minTop=Math.min(0,r),c.maxTop=Math.max(0,r))))):(c.minLeft=-c.width,c.minTop=-c.height,c.maxLeft=s.width,c.maxTop=s.height))},renderCanvas:function(t,e){var i,a,n,o,r,h=this.canvasData,s=this.imageData;e&&(a=(i=function(t){var e=t.width,i=t.height,a=t.degree;if(90==(a=Math.abs(a)%180))return{width:i,height:e};var n=a%90*Math.PI/180,o=Math.sin(n),r=Math.cos(n),h=e*r+i*o,s=e*o+i*r;return 90<a?{width:s,height:h}:{width:h,height:s}}({width:s.naturalWidth*Math.abs(s.scaleX||1),height:s.naturalHeight*Math.abs(s.scaleY||1),degree:s.rotate||0})).width,n=i.height,o=h.width*(a/h.naturalWidth),r=h.height*(n/h.naturalHeight),h.left-=(o-h.width)/2,h.top-=(r-h.height)/2,h.width=o,h.height=r,h.aspectRatio=a/n,h.naturalWidth=a,h.naturalHeight=n,this.limitCanvas(!0,!1)),(h.width>h.maxWidth||h.width<h.minWidth)&&(h.left=h.oldLeft),(h.height>h.maxHeight||h.height<h.minHeight)&&(h.top=h.oldTop),h.width=Math.min(Math.max(h.width,h.minWidth),h.maxWidth),h.height=Math.min(Math.max(h.height,h.minHeight),h.maxHeight),this.limitCanvas(!1,!0),h.left=Math.min(Math.max(h.left,h.minLeft),h.maxLeft),h.top=Math.min(Math.max(h.top,h.minTop),h.maxTop),h.oldLeft=h.left,h.oldTop=h.top,ct(this.canvas,rt({width:h.width,height:h.height},Lt({translateX:h.left,translateY:h.top}))),this.renderImage(t),this.cropped&&this.limited&&this.limitCropBox(!0,!0)},renderImage:function(t){var e=this.canvasData,i=this.imageData,a=i.naturalWidth*(e.width/e.naturalWidth),n=i.naturalHeight*(e.height/e.naturalHeight);rt(i,{width:a,height:n,left:(e.width-a)/2,top:(e.height-n)/2}),ct(this.image,rt({width:i.width,height:i.height},Lt(rt({translateX:i.left,translateY:i.top},i)))),t&&this.output()},initCropBox:function(){var t=this.options,e=this.canvasData,i=t.aspectRatio||t.initialAspectRatio,a=Number(t.autoCropArea)||.8,n={width:e.width,height:e.height};i&&(e.height*i>e.width?n.height=n.width/i:n.width=n.height*i),this.cropBoxData=n,this.limitCropBox(!0,!0),n.width=Math.min(Math.max(n.width,n.minWidth),n.maxWidth),n.height=Math.min(Math.max(n.height,n.minHeight),n.maxHeight),n.width=Math.max(n.minWidth,n.width*a),n.height=Math.max(n.minHeight,n.height*a),n.left=e.left+(e.width-n.width)/2,n.top=e.top+(e.height-n.height)/2,n.oldLeft=n.left,n.oldTop=n.top,this.initialCropBoxData=rt({},n)},limitCropBox:function(t,e){var i,a,n,o,r=this.options,h=this.containerData,s=this.canvasData,c=this.cropBoxData,d=this.limited,l=r.aspectRatio;t&&(n=Number(r.minCropBoxWidth)||0,o=Number(r.minCropBoxHeight)||0,i=d?Math.min(h.width,s.width,s.width+s.left,h.width-s.left):h.width,a=d?Math.min(h.height,s.height,s.height+s.top,h.height-s.top):h.height,n=Math.min(n,h.width),o=Math.min(o,h.height),l&&(n&&o?n<o*l?o=n/l:n=o*l:n?o=n/l:o&&(n=o*l),i<a*l?a=i/l:i=a*l),c.minWidth=Math.min(n,i),c.minHeight=Math.min(o,a),c.maxWidth=i,c.maxHeight=a),e&&(d?(c.minLeft=Math.max(0,s.left),c.minTop=Math.max(0,s.top),c.maxLeft=Math.min(h.width,s.left+s.width)-c.width,c.maxTop=Math.min(h.height,s.top+s.height)-c.height):(c.minLeft=0,c.minTop=0,c.maxLeft=h.width-c.width,c.maxTop=h.height-c.height))},renderCropBox:function(){var t=this.options,e=this.containerData,i=this.cropBoxData;(i.width>i.maxWidth||i.width<i.minWidth)&&(i.left=i.oldLeft),(i.height>i.maxHeight||i.height<i.minHeight)&&(i.top=i.oldTop),i.width=Math.min(Math.max(i.width,i.minWidth),i.maxWidth),i.height=Math.min(Math.max(i.height,i.minHeight),i.maxHeight),this.limitCropBox(!1,!0),i.left=Math.min(Math.max(i.left,i.minLeft),i.maxLeft),i.top=Math.min(Math.max(i.top,i.minTop),i.maxTop),i.oldLeft=i.left,i.oldTop=i.top,t.movable&&t.cropBoxMovable&&ft(this.face,g,i.width>=e.width&&i.height>=e.height?E:O),ct(this.cropBox,rt({width:i.width,height:i.height},Lt({translateX:i.left,translateY:i.top}))),this.cropped&&this.limited&&this.limitCanvas(!0,!0),this.disabled||this.output()},output:function(){this.preview(),Ot(this.element,y,this.getData())}},jt={initPreview:function(){var t,e=this.element,i=this.crossOrigin,a=this.options.preview,n=i?this.crossOriginUrl:this.url,o=e.alt||"The image to preview",r=document.createElement("img");i&&(r.crossOrigin=i),r.src=n,r.alt=o,this.viewBox.appendChild(r),this.viewBoxImage=r,a&&("string"==typeof(t=a)?t=e.ownerDocument.querySelectorAll(a):a.querySelector&&(t=[a]),ot(this.previews=t,function(t){var e=document.createElement("img");ft(t,f,{width:t.offsetWidth,height:t.offsetHeight,html:t.innerHTML}),i&&(e.crossOrigin=i),e.src=n,e.alt=o,e.style.cssText='display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;"',t.innerHTML="",t.appendChild(e)}))},resetPreview:function(){ot(this.previews,function(t){var e=gt(t,f);ct(t,{width:e.width,height:e.height}),t.innerHTML=e.html,function(e,i){if(_(e[i]))try{delete e[i]}catch(t){e[i]=void 0}else if(e.dataset)try{delete e.dataset[i]}catch(t){e.dataset[i]=void 0}else e.removeAttribute("data-".concat(ut(i)))}(t,f)})},preview:function(){var h=this.imageData,t=this.canvasData,e=this.cropBoxData,s=e.width,c=e.height,d=h.width,l=h.height,p=e.left-t.left-h.left,m=e.top-t.top-h.top;this.cropped&&!this.disabled&&(ct(this.viewBoxImage,rt({width:d,height:l},Lt(rt({translateX:-p,translateY:-m},h)))),ot(this.previews,function(t){var e=gt(t,f),i=e.width,a=e.height,n=i,o=a,r=1;s&&(o=c*(r=i/s)),c&&a<o&&(n=s*(r=a/c),o=a),ct(t,{width:n,height:o}),ct(t.getElementsByTagName("img")[0],rt({width:d*r,height:l*r},Lt(rt({translateX:-p*r,translateY:-m*r},h))))}))}},It={bind:function(){var t=this.element,e=this.options,i=this.cropper;it(e.cropstart)&&kt(t,C,e.cropstart),it(e.cropmove)&&kt(t,M,e.cropmove),it(e.cropend)&&kt(t,x,e.cropend),it(e.crop)&&kt(t,y,e.crop),it(e.zoom)&&kt(t,P,e.zoom),kt(i,B,this.onCropStart=this.cropStart.bind(this)),e.zoomable&&e.zoomOnWheel&&kt(i,"wheel",this.onWheel=this.wheel.bind(this),{passive:!1,capture:!0}),e.toggleDragModeOnDblclick&&kt(i,D,this.onDblclick=this.dblclick.bind(this)),kt(t.ownerDocument,j,this.onCropMove=this.cropMove.bind(this)),kt(t.ownerDocument,I,this.onCropEnd=this.cropEnd.bind(this)),e.responsive&&kt(window,"resize",this.onResize=this.resize.bind(this))},unbind:function(){var t=this.element,e=this.options,i=this.cropper;it(e.cropstart)&&Bt(t,C,e.cropstart),it(e.cropmove)&&Bt(t,M,e.cropmove),it(e.cropend)&&Bt(t,x,e.cropend),it(e.crop)&&Bt(t,y,e.crop),it(e.zoom)&&Bt(t,P,e.zoom),Bt(i,B,this.onCropStart),e.zoomable&&e.zoomOnWheel&&Bt(i,"wheel",this.onWheel,{passive:!1,capture:!0}),e.toggleDragModeOnDblclick&&Bt(i,D,this.onDblclick),Bt(t.ownerDocument,j,this.onCropMove),Bt(t.ownerDocument,I,this.onCropEnd),e.responsive&&Bt(window,"resize",this.onResize)}},Pt={resize:function(){var t,e,i,a,n,o;this.disabled||(t=this.options,e=this.container,i=this.containerData,1==(a=e.offsetWidth/i.width)&&e.offsetHeight===i.height||(t.restore&&(n=this.getCanvasData(),o=this.getCropBoxData()),this.render(),t.restore&&(this.setCanvasData(ot(n,function(t,e){n[e]=t*a})),this.setCropBoxData(ot(o,function(t,e){o[e]=t*a})))))},dblclick:function(){var t,e;this.disabled||this.options.dragMode===b||this.setDragMode((t=this.dragBox,e=s,(t.classList?t.classList.contains(e):-1<t.className.indexOf(e))?w:v))},wheel:function(t){var e=this,i=Number(this.options.wheelZoomRatio)||.1,a=1;this.disabled||(t.preventDefault(),this.wheeling||(this.wheeling=!0,setTimeout(function(){e.wheeling=!1},50),t.deltaY?a=0<t.deltaY?1:-1:t.wheelDelta?a=-t.wheelDelta/120:t.detail&&(a=0<t.detail?1:-1),this.zoom(-a*i,t)))},cropStart:function(t){var e,i,a,n=t.buttons,o=t.button;this.disabled||("mousedown"===t.type||"pointerdown"===t.type&&"mouse"===t.pointerType)&&(V(n)&&1!==n||V(o)&&0!==o||t.ctrlKey)||(e=this.options,i=this.pointers,t.changedTouches?ot(t.changedTouches,function(t){i[t.identifier]=zt(t)}):i[t.pointerId||0]=zt(t),a=1<Object.keys(i).length&&e.zoomable&&e.zoomOnTouch?W:gt(t.target,g),q.test(a)&&!1!==Ot(this.element,C,{originalEvent:t,action:a})&&(t.preventDefault(),this.action=a,this.cropping=!1,a===T&&(this.cropping=!0,dt(this.dragBox,m))))},cropMove:function(t){var e,i=this.action;!this.disabled&&i&&(e=this.pointers,t.preventDefault(),!1!==Ot(this.element,M,{originalEvent:t,action:i})&&(t.changedTouches?ot(t.changedTouches,function(t){rt(e[t.identifier]||{},zt(t,!0))}):rt(e[t.pointerId||0]||{},zt(t,!0)),this.change(t)))},cropEnd:function(t){var e,i;this.disabled||(e=this.action,i=this.pointers,t.changedTouches?ot(t.changedTouches,function(t){delete i[t.identifier]}):delete i[t.pointerId||0],e&&(t.preventDefault(),Object.keys(i).length||(this.action=""),this.cropping&&(this.cropping=!1,pt(this.dragBox,m,this.cropped&&this.options.modal)),Ot(this.element,x,{originalEvent:t,action:e})))}},Ut={change:function(t){var e,i=this.options,a=this.canvasData,n=this.containerData,o=this.cropBoxData,r=this.pointers,h=this.action,s=i.aspectRatio,c=o.left,d=o.top,l=o.width,p=o.height,m=c+l,u=d+p,g=0,f=0,v=n.width,w=n.height,b=!0;!s&&t.shiftKey&&(s=l&&p?l/p:1),this.limited&&(g=o.minLeft,f=o.minTop,v=g+Math.min(n.width,a.width,a.left+a.width),w=f+Math.min(n.height,a.height,a.top+a.height));function y(t){switch(t){case H:m+B.x>v&&(B.x=v-m);break;case N:c+B.x<g&&(B.x=g-c);break;case z:d+B.y<f&&(B.y=f-d);break;case L:u+B.y>w&&(B.y=w-u)}}var x,M,C,D=r[Object.keys(r)[0]],B={x:D.endX-D.startX,y:D.endY-D.startY};switch(h){case O:c+=B.x,d+=B.y;break;case H:if(0<=B.x&&(v<=m||s&&(d<=f||w<=u))){b=!1;break}y(H),(l+=B.x)<0&&(h=N,c-=l=-l),s&&(p=l/s,d+=(o.height-p)/2);break;case z:if(B.y<=0&&(d<=f||s&&(c<=g||v<=m))){b=!1;break}y(z),p-=B.y,d+=B.y,p<0&&(h=L,d-=p=-p),s&&(l=p*s,c+=(o.width-l)/2);break;case N:if(B.x<=0&&(c<=g||s&&(d<=f||w<=u))){b=!1;break}y(N),l-=B.x,c+=B.x,l<0&&(h=H,c-=l=-l),s&&(p=l/s,d+=(o.height-p)/2);break;case L:if(0<=B.y&&(w<=u||s&&(c<=g||v<=m))){b=!1;break}y(L),(p+=B.y)<0&&(h=z,d-=p=-p),s&&(l=p*s,c+=(o.width-l)/2);break;case Y:if(s){if(B.y<=0&&(d<=f||v<=m)){b=!1;break}y(z),p-=B.y,d+=B.y,l=p*s}else y(z),y(H),!(0<=B.x)||m<v?l+=B.x:B.y<=0&&d<=f&&(b=!1),B.y<=0&&!(f<d)||(p-=B.y,d+=B.y);l<0&&p<0?(h=S,d-=p=-p,c-=l=-l):l<0?(h=X,c-=l=-l):p<0&&(h=R,d-=p=-p);break;case X:if(s){if(B.y<=0&&(d<=f||c<=g)){b=!1;break}y(z),p-=B.y,d+=B.y,l=p*s,c+=o.width-l}else y(z),y(N),!(B.x<=0)||g<c?(l-=B.x,c+=B.x):B.y<=0&&d<=f&&(b=!1),B.y<=0&&!(f<d)||(p-=B.y,d+=B.y);l<0&&p<0?(h=R,d-=p=-p,c-=l=-l):l<0?(h=Y,c-=l=-l):p<0&&(h=S,d-=p=-p);break;case S:if(s){if(B.x<=0&&(c<=g||w<=u)){b=!1;break}y(N),l-=B.x,c+=B.x,p=l/s}else y(L),y(N),!(B.x<=0)||g<c?(l-=B.x,c+=B.x):0<=B.y&&w<=u&&(b=!1),0<=B.y&&!(u<w)||(p+=B.y);l<0&&p<0?(h=Y,d-=p=-p,c-=l=-l):l<0?(h=R,c-=l=-l):p<0&&(h=X,d-=p=-p);break;case R:if(s){if(0<=B.x&&(v<=m||w<=u)){b=!1;break}y(H),p=(l+=B.x)/s}else y(L),y(H),!(0<=B.x)||m<v?l+=B.x:0<=B.y&&w<=u&&(b=!1),0<=B.y&&!(u<w)||(p+=B.y);l<0&&p<0?(h=X,d-=p=-p,c-=l=-l):l<0?(h=S,c-=l=-l):p<0&&(h=Y,d-=p=-p);break;case E:this.move(B.x,B.y),b=!1;break;case W:this.zoom((M=k({},x=r),C=0,ot(x,function(h,t){delete M[t],ot(M,function(t){var e=Math.abs(h.startX-t.startX),i=Math.abs(h.startY-t.startY),a=Math.abs(h.endX-t.endX),n=Math.abs(h.endY-t.endY),o=Math.sqrt(e*e+i*i),r=(Math.sqrt(a*a+n*n)-o)/o;Math.abs(r)>Math.abs(C)&&(C=r)})}),C),t),b=!1;break;case T:if(!B.x||!B.y){b=!1;break}e=Tt(this.cropper),c=D.startX-e.left,d=D.startY-e.top,l=o.minWidth,p=o.minHeight,0<B.x?h=0<B.y?R:Y:B.x<0&&(c-=l,h=0<B.y?S:X),B.y<0&&(d-=p),this.cropped||(lt(this.cropBox,A),this.cropped=!0,this.limited&&this.limitCropBox(!0,!0))}b&&(o.width=l,o.height=p,o.left=c,o.top=d,this.action=h,this.renderCropBox()),ot(r,function(t){t.startX=t.endX,t.startY=t.endY})}},qt={crop:function(){return!this.ready||this.cropped||this.disabled||(this.cropped=!0,this.limitCropBox(!0,!0),this.options.modal&&dt(this.dragBox,m),lt(this.cropBox,A),this.setCropBoxData(this.initialCropBoxData)),this},reset:function(){return this.ready&&!this.disabled&&(this.imageData=rt({},this.initialImageData),this.canvasData=rt({},this.initialCanvasData),this.cropBoxData=rt({},this.initialCropBoxData),this.renderCanvas(),this.cropped&&this.renderCropBox()),this},clear:function(){return this.cropped&&!this.disabled&&(rt(this.cropBoxData,{left:0,top:0,width:0,height:0}),this.cropped=!1,this.renderCropBox(),this.limitCanvas(!0,!0),this.renderCanvas(),lt(this.dragBox,m),dt(this.cropBox,A)),this},replace:function(e,t){var i=1<arguments.length&&void 0!==t&&t;return!this.disabled&&e&&(this.isImg&&(this.element.src=e),i?(this.url=e,this.image.src=e,this.ready&&(this.viewBoxImage.src=e,ot(this.previews,function(t){t.getElementsByTagName("img")[0].src=e}))):(this.isImg&&(this.replaced=!0),this.options.data=null,this.uncreate(),this.load(e))),this},enable:function(){return this.ready&&this.disabled&&(this.disabled=!1,lt(this.cropper,c)),this},disable:function(){return this.ready&&!this.disabled&&(this.disabled=!0,dt(this.cropper,c)),this},destroy:function(){var t=this.element;return t[d]&&(t[d]=void 0,this.isImg&&this.replaced&&(t.src=this.originalUrl),this.uncreate()),this},move:function(t,e){var i=1<arguments.length&&void 0!==e?e:t,a=this.canvasData,n=a.left,o=a.top;return this.moveTo(J(t)?t:n+Number(t),J(i)?i:o+Number(i))},moveTo:function(t,e){var i=1<arguments.length&&void 0!==e?e:t,a=this.canvasData,n=!1;return t=Number(t),i=Number(i),this.ready&&!this.disabled&&this.options.movable&&(V(t)&&(a.left=t,n=!0),V(i)&&(a.top=i,n=!0),n&&this.renderCanvas(!0)),this},zoom:function(t,e){var i=this.canvasData;return t=(t=Number(t))<0?1/(1-t):1+t,this.zoomTo(i.width*t/i.naturalWidth,null,e)},zoomTo:function(t,e,i){var a,n,o,r=this.options,h=this.canvasData,s=h.width,c=h.height,d=h.naturalWidth,l=h.naturalHeight;if(0<=(t=Number(t))&&this.ready&&!this.disabled&&r.zoomable){var p,m,u,g=d*t,f=l*t;if(!1===Ot(this.element,P,{ratio:t,oldRatio:s/d,originalEvent:i}))return this;i?(p=this.pointers,m=Tt(this.cropper),u=p&&Object.keys(p).length?(o=n=a=0,ot(p,function(t){var e=t.startX,i=t.startY;a+=e,n+=i,o+=1}),{pageX:a/=o,pageY:n/=o}):{pageX:i.pageX,pageY:i.pageY},h.left-=(g-s)*((u.pageX-m.left-h.left)/s),h.top-=(f-c)*((u.pageY-m.top-h.top)/c)):et(e)&&V(e.x)&&V(e.y)?(h.left-=(g-s)*((e.x-h.left)/s),h.top-=(f-c)*((e.y-h.top)/c)):(h.left-=(g-s)/2,h.top-=(f-c)/2),h.width=g,h.height=f,this.renderCanvas(!0)}return this},rotate:function(t){return this.rotateTo((this.imageData.rotate||0)+Number(t))},rotateTo:function(t){return V(t=Number(t))&&this.ready&&!this.disabled&&this.options.rotatable&&(this.imageData.rotate=t%360,this.renderCanvas(!0,!0)),this},scaleX:function(t){var e=this.imageData.scaleY;return this.scale(t,V(e)?e:1)},scaleY:function(t){var e=this.imageData.scaleX;return this.scale(V(e)?e:1,t)},scale:function(t,e){var i=1<arguments.length&&void 0!==e?e:t,a=this.imageData,n=!1;return t=Number(t),i=Number(i),this.ready&&!this.disabled&&this.options.scalable&&(V(t)&&(a.scaleX=t,n=!0),V(i)&&(a.scaleY=i,n=!0),n&&this.renderCanvas(!0,!0)),this},getData:function(t){var i,a,e,n,o=0<arguments.length&&void 0!==t&&t,r=this.options,h=this.imageData,s=this.canvasData,c=this.cropBoxData;return this.ready&&this.cropped?(i={x:c.left-s.left,y:c.top-s.top,width:c.width,height:c.height},a=h.width/h.naturalWidth,ot(i,function(t,e){i[e]=t/a}),o&&(e=Math.round(i.y+i.height),n=Math.round(i.x+i.width),i.x=Math.round(i.x),i.y=Math.round(i.y),i.width=n-i.x,i.height=e-i.y)):i={x:0,y:0,width:0,height:0},r.rotatable&&(i.rotate=h.rotate||0),r.scalable&&(i.scaleX=h.scaleX||1,i.scaleY=h.scaleY||1),i},setData:function(t){var e,i,a=this.options,n=this.imageData,o=this.canvasData,r={};return this.ready&&!this.disabled&&et(t)&&(e=!1,a.rotatable&&V(t.rotate)&&t.rotate!==n.rotate&&(n.rotate=t.rotate,e=!0),a.scalable&&(V(t.scaleX)&&t.scaleX!==n.scaleX&&(n.scaleX=t.scaleX,e=!0),V(t.scaleY)&&t.scaleY!==n.scaleY&&(n.scaleY=t.scaleY,e=!0)),e&&this.renderCanvas(!0,!0),i=n.width/n.naturalWidth,V(t.x)&&(r.left=t.x*i+o.left),V(t.y)&&(r.top=t.y*i+o.top),V(t.width)&&(r.width=t.width*i),V(t.height)&&(r.height=t.height*i),this.setCropBoxData(r)),this},getContainerData:function(){return this.ready?rt({},this.containerData):{}},getImageData:function(){return this.sized?rt({},this.imageData):{}},getCanvasData:function(){var e=this.canvasData,i={};return this.ready&&ot(["left","top","width","height","naturalWidth","naturalHeight"],function(t){i[t]=e[t]}),i},setCanvasData:function(t){var e=this.canvasData,i=e.aspectRatio;return this.ready&&!this.disabled&&et(t)&&(V(t.left)&&(e.left=t.left),V(t.top)&&(e.top=t.top),V(t.width)?(e.width=t.width,e.height=t.width/i):V(t.height)&&(e.height=t.height,e.width=t.height*i),this.renderCanvas(!0)),this},getCropBoxData:function(){var t,e=this.cropBoxData;return this.ready&&this.cropped&&(t={left:e.left,top:e.top,width:e.width,height:e.height}),t||{}},setCropBoxData:function(t){var e,i,a=this.cropBoxData,n=this.options.aspectRatio;return this.ready&&this.cropped&&!this.disabled&&et(t)&&(V(t.left)&&(a.left=t.left),V(t.top)&&(a.top=t.top),V(t.width)&&t.width!==a.width&&(e=!0,a.width=t.width),V(t.height)&&t.height!==a.height&&(i=!0,a.height=t.height),n&&(e?a.height=a.width/n:i&&(a.width=a.height*n)),this.renderCropBox()),this},getCroppedCanvas:function(t){var e=0<arguments.length&&void 0!==t?t:{};if(!this.ready||!window.HTMLCanvasElement)return null;var i,a,n,o,r,h,s,c,d,l,p,m,u,g,f,v,w,b,y,x,M,C,D,B,k,O,T,E,W,H,N,L,z,Y,X,R,S,A,j,I,P,U=this.canvasData,q=(i=this.image,a=this.imageData,n=U,o=e,r=a.aspectRatio,h=a.naturalWidth,s=a.naturalHeight,c=a.rotate,d=void 0===c?0:c,l=a.scaleX,p=void 0===l?1:l,m=a.scaleY,u=void 0===m?1:m,g=n.aspectRatio,f=n.naturalWidth,v=n.naturalHeight,w=o.fillColor,b=void 0===w?"transparent":w,y=o.imageSmoothingEnabled,x=void 0===y||y,M=o.imageSmoothingQuality,C=void 0===M?"low":M,D=o.maxWidth,B=void 0===D?1/0:D,k=o.maxHeight,O=void 0===k?1/0:k,T=o.minWidth,E=void 0===T?0:T,W=o.minHeight,H=void 0===W?0:W,N=document.createElement("canvas"),L=N.getContext("2d"),z=Yt({aspectRatio:g,width:B,height:O}),Y=Yt({aspectRatio:g,width:E,height:H},"cover"),X=Math.min(z.width,Math.max(Y.width,f)),R=Math.min(z.height,Math.max(Y.height,v)),S=Yt({aspectRatio:r,width:B,height:O}),A=Yt({aspectRatio:r,width:E,height:H},"cover"),j=Math.min(S.width,Math.max(A.width,h)),I=Math.min(S.height,Math.max(A.height,s)),P=[-j/2,-I/2,j,I],N.width=xt(X),N.height=xt(R),L.fillStyle=b,L.fillRect(0,0,X,R),L.save(),L.translate(X/2,R/2),L.rotate(d*Math.PI/180),L.scale(p,u),L.imageSmoothingEnabled=x,L.imageSmoothingQuality=C,L.drawImage.apply(L,[i].concat(yt(P.map(function(t){return Math.floor(xt(t))})))),L.restore(),N);if(!this.cropped)return q;var $=this.getData(),Q=$.x,K=$.y,Z=$.width,G=$.height,V=q.width/Math.floor(U.naturalWidth);1!=V&&(Q*=V,K*=V,Z*=V,G*=V);var F=Z/G,J=Yt({aspectRatio:F,width:e.maxWidth||1/0,height:e.maxHeight||1/0}),_=Yt({aspectRatio:F,width:e.minWidth||0,height:e.minHeight||0},"cover"),tt=Yt({aspectRatio:F,width:e.width||(1!=V?q.width:Z),height:e.height||(1!=V?q.height:G)}),et=tt.width,it=tt.height,et=Math.min(J.width,Math.max(_.width,et)),it=Math.min(J.height,Math.max(_.height,it)),at=document.createElement("canvas"),nt=at.getContext("2d");at.width=xt(et),at.height=xt(it),nt.fillStyle=e.fillColor||"transparent",nt.fillRect(0,0,et,it);var ot=e.imageSmoothingEnabled,rt=void 0===ot||ot,ht=e.imageSmoothingQuality;nt.imageSmoothingEnabled=rt,ht&&(nt.imageSmoothingQuality=ht);var st,ct,dt,lt,pt,mt,ut=q.width,gt=q.height,ft=Q,vt=K;ft<=-Z||ut<ft?pt=dt=st=ft=0:ft<=0?(dt=-ft,ft=0,pt=st=Math.min(ut,Z+ft)):ft<=ut&&(dt=0,pt=st=Math.min(Z,ut-ft)),st<=0||vt<=-G||gt<vt?mt=lt=ct=vt=0:vt<=0?(lt=-vt,vt=0,mt=ct=Math.min(gt,G+vt)):vt<=gt&&(lt=0,mt=ct=Math.min(G,gt-vt));var wt,bt=[ft,vt,st,ct];return 0<pt&&0<mt&&(wt=et/Z,bt.push(dt*wt,lt*wt,pt*wt,mt*wt)),nt.drawImage.apply(nt,[q].concat(yt(bt.map(function(t){return Math.floor(xt(t))})))),at},setAspectRatio:function(t){var e=this.options;return this.disabled||J(t)||(e.aspectRatio=Math.max(0,t)||NaN,this.ready&&(this.initCropBox(),this.cropped&&this.renderCropBox())),this},setDragMode:function(t){var e,i,a=this.options,n=this.dragBox,o=this.face;return this.ready&&!this.disabled&&(e=t===v,i=a.movable&&t===w,t=e||i?t:b,a.dragMode=t,ft(n,g,t),pt(n,s,e),pt(n,u,i),a.cropBoxMovable||(ft(o,g,t),pt(o,s,e),pt(o,u,i))),this}},$t=r.Cropper,Qt=function(){function i(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};if(!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),!t||!K.test(t.tagName))throw new Error("The first argument is required and must be an <img> or <canvas> element.");this.element=t,this.options=rt({},Z,et(e)&&e),this.cropped=!1,this.disabled=!1,this.pointers={},this.ready=!1,this.reloading=!1,this.replaced=!1,this.sized=!1,this.sizing=!1,this.init()}var t,e,a;return t=i,a=[{key:"noConflict",value:function(){return window.Cropper=$t,i}},{key:"setDefaults",value:function(t){rt(Z,et(t)&&t)}}],(e=[{key:"init",value:function(){var t,e=this.element,i=e.tagName.toLowerCase();if(!e[d]){if(e[d]=this,"img"===i){if(this.isImg=!0,t=e.getAttribute("src")||"",!(this.originalUrl=t))return;t=e.src}else"canvas"===i&&window.HTMLCanvasElement&&(t=e.toDataURL());this.load(t)}}},{key:"load",value:function(t){var e,i,a,n,o,r,h,s,c=this;t&&(this.url=t,this.imageData={},e=this.element,(i=this.options).rotatable||i.scalable||(i.checkOrientation=!1),i.checkOrientation&&window.ArrayBuffer?$.test(t)?Q.test(t)?this.read((a=t.replace(Rt,""),n=atob(a),o=new ArrayBuffer(n.length),ot(r=new Uint8Array(o),function(t,e){r[e]=n.charCodeAt(e)}),o)):this.clone():(h=new XMLHttpRequest,s=this.clone.bind(this),this.reloading=!0,(this.xhr=h).onabort=s,h.onerror=s,h.ontimeout=s,h.onprogress=function(){h.getResponseHeader("content-type")!==U&&h.abort()},h.onload=function(){c.read(h.response)},h.onloadend=function(){c.reloading=!1,c.xhr=null},i.checkCrossOrigin&&Ht(t)&&e.crossOrigin&&(t=Nt(t)),h.open("GET",t),h.responseType="arraybuffer",h.withCredentials="use-credentials"===e.crossOrigin,h.send()):this.clone())}},{key:"read",value:function(t){var e,i=this.options,a=this.imageData,n=St(t),o=0,r=1,h=1;1<n&&(this.url=function(t,e){for(var i=[],a=new Uint8Array(t);0<a.length;)i.push(Xt.apply(null,nt(a.subarray(0,8192)))),a=a.subarray(8192);return"data:".concat(e,";base64,").concat(btoa(i.join("")))}(t,U),o=(e=function(t){var e=0,i=1,a=1;switch(t){case 2:i=-1;break;case 3:e=-180;break;case 4:a=-1;break;case 5:e=90,a=-1;break;case 6:e=90;break;case 7:e=90,i=-1;break;case 8:e=-90}return{rotate:e,scaleX:i,scaleY:a}}(n)).rotate,r=e.scaleX,h=e.scaleY),i.rotatable&&(a.rotate=o),i.scalable&&(a.scaleX=r,a.scaleY=h),this.clone()}},{key:"clone",value:function(){var t=this.element,e=this.url,i=t.crossOrigin,a=e;this.options.checkCrossOrigin&&Ht(e)&&(i=i||"anonymous",a=Nt(e)),this.crossOrigin=i,this.crossOriginUrl=a;var n=document.createElement("img");i&&(n.crossOrigin=i),n.src=a||e,n.alt=t.alt||"The image to crop",(this.image=n).onload=this.start.bind(this),n.onerror=this.stop.bind(this),dt(n,l),t.parentNode.insertBefore(n,t.nextSibling)}},{key:"start",value:function(){var i=this,t=this.image;t.onload=null,t.onerror=null,this.sizing=!0;function e(t,e){rt(i.imageData,{naturalWidth:t,naturalHeight:e,aspectRatio:t/e}),i.initialImageData=rt({},i.imageData),i.sizing=!1,i.sized=!0,i.build()}var a,n,o=r.navigator&&/(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(r.navigator.userAgent);!t.naturalWidth||o?(a=document.createElement("img"),n=document.body||document.documentElement,(this.sizingImage=a).onload=function(){e(a.width,a.height),o||n.removeChild(a)},a.src=t.src,o||(a.style.cssText="left:0;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:0;position:absolute;top:0;z-index:-1;",n.appendChild(a))):e(t.naturalWidth,t.naturalHeight)}},{key:"stop",value:function(){var t=this.image;t.onload=null,t.onerror=null,t.parentNode.removeChild(t),this.image=null}},{key:"build",value:function(){var t,e,i,a,n,o,r,h,s,c;this.sized&&!this.ready&&(t=this.element,e=this.options,i=this.image,a=t.parentNode,(n=document.createElement("div")).innerHTML='<div class="cropper-container" touch-action="none"><div class="cropper-wrap-box"><div class="cropper-canvas"></div></div><div class="cropper-drag-box"></div><div class="cropper-crop-box"><span class="cropper-view-box"></span><span class="cropper-dashed dashed-h"></span><span class="cropper-dashed dashed-v"></span><span class="cropper-center"></span><span class="cropper-face"></span><span class="cropper-line line-e" data-cropper-action="e"></span><span class="cropper-line line-n" data-cropper-action="n"></span><span class="cropper-line line-w" data-cropper-action="w"></span><span class="cropper-line line-s" data-cropper-action="s"></span><span class="cropper-point point-e" data-cropper-action="e"></span><span class="cropper-point point-n" data-cropper-action="n"></span><span class="cropper-point point-w" data-cropper-action="w"></span><span class="cropper-point point-s" data-cropper-action="s"></span><span class="cropper-point point-ne" data-cropper-action="ne"></span><span class="cropper-point point-nw" data-cropper-action="nw"></span><span class="cropper-point point-sw" data-cropper-action="sw"></span><span class="cropper-point point-se" data-cropper-action="se"></span></div></div>',r=(o=n.querySelector(".".concat(d,"-container"))).querySelector(".".concat(d,"-canvas")),h=o.querySelector(".".concat(d,"-drag-box")),c=(s=o.querySelector(".".concat(d,"-crop-box"))).querySelector(".".concat(d,"-face")),this.container=a,this.cropper=o,this.canvas=r,this.dragBox=h,this.cropBox=s,this.viewBox=o.querySelector(".".concat(d,"-view-box")),this.face=c,r.appendChild(i),dt(t,A),a.insertBefore(o,t.nextSibling),this.isImg||lt(i,l),this.initPreview(),this.bind(),e.initialAspectRatio=Math.max(0,e.initialAspectRatio)||NaN,e.aspectRatio=Math.max(0,e.aspectRatio)||NaN,e.viewMode=Math.max(0,Math.min(3,Math.round(e.viewMode)))||0,dt(s,A),e.guides||dt(s.getElementsByClassName("".concat(d,"-dashed")),A),e.center||dt(s.getElementsByClassName("".concat(d,"-center")),A),e.background&&dt(o,"".concat(d,"-bg")),e.highlight||dt(c,p),e.cropBoxMovable&&(dt(c,u),ft(c,g,O)),e.cropBoxResizable||(dt(s.getElementsByClassName("".concat(d,"-line")),A),dt(s.getElementsByClassName("".concat(d,"-point")),A)),this.render(),this.ready=!0,this.setDragMode(e.dragMode),e.autoCrop&&this.crop(),this.setData(e.data),it(e.ready)&&kt(t,"ready",e.ready,{once:!0}),Ot(t,"ready"))}},{key:"unbuild",value:function(){this.ready&&(this.ready=!1,this.unbind(),this.resetPreview(),this.cropper.parentNode.removeChild(this.cropper),lt(this.element,A))}},{key:"uncreate",value:function(){this.ready?(this.unbuild(),this.ready=!1,this.cropped=!1):this.sizing?(this.sizingImage.onload=null,this.sizing=!1,this.sized=!1):this.reloading?(this.xhr.onabort=null,this.xhr.abort()):this.image&&this.stop()}}])&&n(t.prototype,e),a&&n(t,a),i}();return rt(Qt.prototype,At,jt,It,Pt,Ut,qt),Qt});
/*
 * jQuery selectBox - A cosmetic, styleable replacement for SELECT elements
 *
 * Licensed under the MIT license: http://opensource.org/licenses/MIT
 *
 * v1.2.0
 *
 * https://github.com/marcj/jquery-selectBox
 */


;(function ($) {

    /**
     * SelectBox class.
     *
     * @param {HTMLElement|jQuery} select If it's a jQuery object, we use the first element.
     * @param {Object}             options
     * @constructor
     */
    var SelectBox = window.SelectBox = function (select, options) {
        if (select instanceof jQuery) {
            if (select.length > 0) {
                select = select[0];
            } else {
                return;
            }
        }

        this.typeTimer     = null;
        this.typeSearch    = '';
        this.isMac         = navigator.platform.match(/mac/i);
        options            = 'object' === typeof options ? options :  {};
        this.selectElement = select;

        // Disable for iOS devices (their native controls are more suitable for a touch device)
        if (!options.mobile && navigator.userAgent.match(/iPad|iPhone|Android|IEMobile|BlackBerry/i)) {
            return false;
        }

        // Element must be a select control
        if ('select' !== select.tagName.toLowerCase()) {
            return false;
        }

        this.init(options);
    };

    /**
     * @type {String}
     */
    SelectBox.prototype.version = '1.2.0';

    /**
     * @param {Object} options
     *
     * @returns {Boolean}
     */
    SelectBox.prototype.init = function (options) {
        var select = $(this.selectElement);
        if (select.data('selectBox-control')) {
            return false;
        }

        var control    = $('<a class="selectBox" />')
            , inline   = select.attr('multiple') || parseInt(select.attr('size')) > 1
            , settings = options || {}
            , tabIndex = parseInt(select.prop('tabindex')) || 0
            , self     = this;

        control
            .width(select.outerWidth())
            .addClass(select.attr('class'))
            .attr('title', select.attr('title') || '')
            .attr('tabindex', tabIndex)
            .css('display', 'inline-block')
            .bind('focus.selectBox', function () {
                if (this !== document.activeElement && document.body !== document.activeElement) {
                    $(document.activeElement).blur();
                }
                if (control.hasClass('selectBox-active')) {
                    return;
                }
                control.addClass('selectBox-active');
                select.trigger('focus');
            })
            .bind('blur.selectBox', function () {
                if (!control.hasClass('selectBox-active')) {
                    return;
                }
                control.removeClass('selectBox-active');
                select.trigger('blur');
            });

        if (!$(window).data('selectBox-bindings')) {
            $(window)
                .data('selectBox-bindings', true)
                .bind('scroll.selectBox', (settings.hideOnWindowScroll) ? this.hideMenus : $.noop)
                .bind('resize.selectBox', this.hideMenus);
        }

        if (select.attr('disabled')) {
            control.addClass('selectBox-disabled');
        }

        // Focus on control when label is clicked
        select.bind('click.selectBox', function (event) {
            control.focus();
            event.preventDefault();
        });

        // Generate control
        if (inline) {
            // Inline controls
            options = this.getOptions('inline');

            control
                .append(options)
                .data('selectBox-options', options).addClass('selectBox-inline selectBox-menuShowing')
                .bind('keydown.selectBox', function (event) {
                    self.handleKeyDown(event);
                })
                .bind('keypress.selectBox',function (event) {
                    self.handleKeyPress(event);
                })
                .bind('mousedown.selectBox',function (event) {
                    if (1 !== event.which) {
                        return;
                    }
                    if ($(event.target).is('A.selectBox-inline')) {
                        event.preventDefault();
                    }
                    if (!control.hasClass('selectBox-focus')) {
                        control.focus();
                    }
                })
                .insertAfter(select);

            // Auto-height based on size attribute
            if (!select[0].style.height) {
                var size = select.attr('size') ? parseInt(select.attr('size')) : 5;
                // Draw a dummy control off-screen, measure, and remove it
                var tmp = control
                    .clone()
                    .removeAttr('id')
                    .css({
                        position: 'absolute',
                        top: '-9999em'
                    })
                    .show()
                    .appendTo('body');
                tmp.find('.selectBox-options').html('<li><a>\u00A0</a></li>');
                var optionHeight = parseInt(tmp.find('.selectBox-options A:first').html('&nbsp;').outerHeight());
                tmp.remove();
                control.height(optionHeight * size);
            }
            this.disableSelection(control);
        } else {
            // Dropdown controls
            var label = $('<span class="selectBox-label" />'),
                arrow = $('<span class="selectBox-arrow" />');

            // Update label
            label.attr('class', this.getLabelClass()).html(this.getLabelHtml());
            options = this.getOptions('dropdown');
            options.appendTo('BODY');

            control
                .data('selectBox-options', options)
                .addClass('selectBox-dropdown')
                .append(label)
                .append(arrow)
                .bind('mousedown.selectBox', function (event) {
                    if (1 === event.which) {
                        if (control.hasClass('selectBox-menuShowing')) {
                            self.hideMenus();
                        } else {
                            event.stopPropagation();
                            // Webkit fix to prevent premature selection of options
                            options
                                .data('selectBox-down-at-x', event.screenX)
                                .data('selectBox-down-at-y', event.screenY);
                            self.showMenu();
                        }
                    }
                })
                .bind('keydown.selectBox', function (event) {
                    self.handleKeyDown(event);
                })
                .bind('keypress.selectBox', function (event) {
                    self.handleKeyPress(event);
                })
                .bind('open.selectBox',function (event, triggerData) {
                    if (triggerData && triggerData._selectBox === true) {
                        return;
                    }
                    self.showMenu();
                })
                .bind('close.selectBox', function (event, triggerData) {
                    if (triggerData && triggerData._selectBox === true) {
                        return;
                    }
                    self.hideMenus();
                })
                .insertAfter(select);

            // Set label width
            var labelWidth =
                    control.width()
                  - arrow.outerWidth()
                  - (parseInt(label.css('paddingLeft')) || 0)
                  - (parseInt(label.css('paddingRight')) || 0);

            label.width(labelWidth);
            this.disableSelection(control);
        }
        // Store data for later use and show the control
        select
            .addClass('selectBox')
            .data('selectBox-control', control)
            .data('selectBox-settings', settings)
            .hide();
    };

    /**
     * @param {String} type 'inline'|'dropdown'
     * @returns {jQuery}
     */
    SelectBox.prototype.getOptions = function (type) {
        var options;
        var select = $(this.selectElement);
        var self   = this;
        // Private function to handle recursion in the getOptions function.
        var _getOptions = function (select, options) {
            // Loop through the set in order of element children.
            select.children('OPTION, OPTGROUP').each(function () {
                // If the element is an option, add it to the list.
                if ($(this).is('OPTION')) {
                    // Check for a value in the option found.
                    if ($(this).length > 0) {
                        // Create an option form the found element.
                        self.generateOptions($(this), options);
                    } else {
                        // No option information found, so add an empty.
                        options.append('<li>\u00A0</li>');
                    }
                } else {
                    // If the element is an option group, add the group and call this function on it.
                    var optgroup = $('<li class="selectBox-optgroup" />');
                    optgroup.text($(this).attr('label'));
                    options.append(optgroup);
                    options = _getOptions($(this), options);
                }
            });
            // Return the built strin
            return options;
        };

        switch (type) {
            case 'inline':
                options = $('<ul class="selectBox-options" />');
                options = _getOptions(select, options);
                options
                    .find('A')
                    .bind('mouseover.selectBox', function (event) {
                        self.addHover($(this).parent());
                    })
                    .bind('mouseout.selectBox',function (event) {
                        self.removeHover($(this).parent());
                    })
                    .bind('mousedown.selectBox',function (event) {
                        if (1 !== event.which) {
                            return
                        }
                        event.preventDefault(); // Prevent options from being "dragged"
                        if (!select.selectBox('control').hasClass('selectBox-active')) {
                            select.selectBox('control').focus();
                        }
                    })
                    .bind('mouseup.selectBox', function (event) {
                        if (1 !== event.which) {
                            return;
                        }
                        self.hideMenus();
                        self.selectOption($(this).parent(), event);
                    });

                this.disableSelection(options);
                return options;
            case 'dropdown':
                options = $('<ul class="selectBox-dropdown-menu selectBox-options" />');
                options = _getOptions(select, options);

                options
                    .data('selectBox-select', select)
                    .css('display', 'none')
                    .appendTo('BODY')
                    .find('A')
                    .bind('mousedown.selectBox', function (event) {
                        if (event.which === 1) {
                            event.preventDefault(); // Prevent options from being "dragged"
                            if (event.screenX === options.data('selectBox-down-at-x') &&
                                event.screenY === options.data('selectBox-down-at-y')) {
                                options.removeData('selectBox-down-at-x').removeData('selectBox-down-at-y');
                                if (/android/i.test(navigator.userAgent.toLowerCase()) &&
                                    /chrome/i.test(navigator.userAgent.toLowerCase())) {
                                    self.selectOption($(this).parent());
                                }
                                self.hideMenus();
                            }
                        }
                    })
                    .bind('mouseup.selectBox', function (event) {
                        if (1 !== event.which) {
                            return;
                        }
                        if (event.screenX === options.data('selectBox-down-at-x') &&
                            event.screenY === options.data('selectBox-down-at-y')) {
                            return;
                        } else {
                            options.removeData('selectBox-down-at-x').removeData('selectBox-down-at-y');
                        }
                        self.selectOption($(this).parent());
                        self.hideMenus();
                    })
                    .bind('mouseover.selectBox', function (event) {
                        self.addHover($(this).parent());
                    })
                    .bind('mouseout.selectBox', function (event) {
                        self.removeHover($(this).parent());
                    });

                // Inherit classes for dropdown menu
                var classes = select.attr('class') || '';
                if ('' !== classes) {
                    classes = classes.split(' ');
                    for (var i = 0; i < classes.length; i++) {
                        options.addClass(classes[i] + '-selectBox-dropdown-menu');
                    }

                }
                this.disableSelection(options);
                return options;
        }
    };

    /**
     * Returns the current class of the selected option.
     *
     * @returns {String}
     */
    SelectBox.prototype.getLabelClass = function () {
        var selected = $(this.selectElement).find('OPTION:selected');
        return ('selectBox-label ' + (selected.attr('class') || '')).replace(/\s+$/, '');
    };

    /**
     * Returns the current label of the selected option.
     *
     * @returns {String}
     */
    SelectBox.prototype.getLabelHtml = function () {
        var selected = $(this.selectElement).find('OPTION:selected');
        var labelHtml;
        if (selected.data('icon')) {
            labelHtml = '<i class="fa fa-'+selected.data('icon')+' fa-fw fa-lg"></i> '+selected.text();
        } else {
            labelHtml = selected.text();
        }
        return labelHtml || '\u00A0';
    };

    /**
     * Sets the label.
     * This method uses the getLabelClass() and getLabelHtml() methods.
     */
    SelectBox.prototype.setLabel = function () {
        var select = $(this.selectElement);
        var control = select.data('selectBox-control');
        if (!control) {
            return;
        }

        control
            .find('.selectBox-label')
            .attr('class', this.getLabelClass())
            .html(this.getLabelHtml());
    };

    /**
     * Destroys the SelectBox instance and shows the origin select element.
     *
     */
    SelectBox.prototype.destroy = function () {
        var select = $(this.selectElement);
        var control = select.data('selectBox-control');
        if (!control) {
            return;
        }

        var options = control.data('selectBox-options');
        options.remove();
        control.remove();
        select
            .removeClass('selectBox')
            .removeData('selectBox-control')
            .data('selectBox-control', null)
            .removeData('selectBox-settings')
            .data('selectBox-settings', null)
            .show();
    };

    /**
     * Refreshes the option elements.
     */
    SelectBox.prototype.refresh = function () {
        var select = $(this.selectElement)
            , control = select.data('selectBox-control')
            , type = control.hasClass('selectBox-dropdown') ? 'dropdown' : 'inline'
            , options;

        // Remove old options
        control.data('selectBox-options').remove();

        // Generate new options
        options  = this.getOptions(type);
        control.data('selectBox-options', options);

        switch (type) {
            case 'inline':
                control.append(options);
                break;
            case 'dropdown':
                // Update label
                this.setLabel();
                $("BODY").append(options);
                break;
        }

        // Restore opened dropdown state (original menu was trashed)
        if ('dropdown' === type && control.hasClass('selectBox-menuShowing')) {
            this.showMenu();
        }
    };

    /**
     * Shows the dropdown menu.
     */
    SelectBox.prototype.showMenu = function () {
        var self = this
            , select   = $(this.selectElement)
            , control  = select.data('selectBox-control')
            , settings = select.data('selectBox-settings')
            , options  = control.data('selectBox-options');

        if (control.hasClass('selectBox-disabled')) {
            return false;
        }

        this.hideMenus();

        // Get top and bottom width of selectBox
        var borderBottomWidth = parseInt(control.css('borderBottomWidth')) || 0;
        var borderTopWidth = parseInt(control.css('borderTopWidth')) || 0;

        // Get proper variables for keeping options in viewport
        var pos = control.offset()
            , topPositionCorrelation = (settings.topPositionCorrelation) ? settings.topPositionCorrelation : 0
            , bottomPositionCorrelation = (settings.bottomPositionCorrelation) ? settings.bottomPositionCorrelation : 0
            , optionsHeight = options.outerHeight()
            , controlHeight = control.outerHeight()
            , maxHeight = parseInt(options.css('max-height'))
            , scrollPos = $(window).scrollTop()
            , heightToTop = pos.top - scrollPos
            , heightToBottom = $(window).height() - ( heightToTop + controlHeight )
            , posTop = (heightToTop > heightToBottom) && (settings.keepInViewport == null ? true : settings.keepInViewport)
            , width = control.innerWidth() >= options.innerWidth() ? control.innerWidth() + 'px' : 'auto'
            , top = posTop
                  ? pos.top - optionsHeight + borderTopWidth + topPositionCorrelation
                  : pos.top + controlHeight - borderBottomWidth - bottomPositionCorrelation;


        // If the height to top and height to bottom are less than the max-height
        if(heightToTop < maxHeight&& heightToBottom < maxHeight){

            // Set max-height and top
            if(posTop){
                var maxHeightDiff = maxHeight - ( heightToTop - 5 );
                options.css({'max-height': maxHeight - maxHeightDiff + 'px'});
                top = top + maxHeightDiff;
            }else{
                var maxHeightDiff = maxHeight - ( heightToBottom - 5 );
                options.css({'max-height': maxHeight - maxHeightDiff + 'px'});
            }

        }

        // Save if position is top to options data
        options.data('posTop',posTop);


        // Menu position
        options
            .width(width)
            .css({
                top: top,
                left: control.offset().left
            })
            // Add Top and Bottom class based on position
            .addClass('selectBox-options selectBox-options-'+(posTop?'top':'bottom'));

		if (settings.styleClass) {
			options.addClass(settings.styleClass);
		}
		
        if (select.triggerHandler('beforeopen')) {
            return false;
        }

        var dispatchOpenEvent = function () {
            select.triggerHandler('open', {
                _selectBox: true
            });
        };

        // Show menu
        switch (settings.menuTransition) {
            case 'fade':
                options.fadeIn(settings.menuSpeed, dispatchOpenEvent);
                break;
            case 'slide':
                options.slideDown(settings.menuSpeed, dispatchOpenEvent);
                break;
            default:
                options.show(settings.menuSpeed, dispatchOpenEvent);
                break;
        }

        if (!settings.menuSpeed) {
            dispatchOpenEvent();
        }

        // Center on selected option
        var li = options.find('.selectBox-selected:first');
        this.keepOptionInView(li, true);
        this.addHover(li);
        control.addClass('selectBox-menuShowing selectBox-menuShowing-'+(posTop?'top':'bottom'));

        $(document).bind('mousedown.selectBox', function (event) {
            if (1 === event.which) {
                if ($(event.target).parents().andSelf().hasClass('selectBox-options')) {
                    return;
                }
                self.hideMenus();
            }
        });
    };

    /**
     * Hides the menu of all instances.
     */
    SelectBox.prototype.hideMenus = function () {
        if ($(".selectBox-dropdown-menu:visible").length === 0) {
            return;
        }

        $(document).unbind('mousedown.selectBox');
        $(".selectBox-dropdown-menu").each(function () {
            var options = $(this)
                , select = options.data('selectBox-select')
                , control = select.data('selectBox-control')
                , settings = select.data('selectBox-settings')
                , posTop = options.data('posTop');

            if (select.triggerHandler('beforeclose')) {
                return false;
            }

            var dispatchCloseEvent = function () {
                select.triggerHandler('close', {
                    _selectBox: true
                });
            };
            if (settings) {
                switch (settings.menuTransition) {
                    case 'fade':
                        options.fadeOut(settings.menuSpeed, dispatchCloseEvent);
                        break;
                    case 'slide':
                        options.slideUp(settings.menuSpeed, dispatchCloseEvent);
                        break;
                    default:
                        options.hide(settings.menuSpeed, dispatchCloseEvent);
                        break;
                }
                if (!settings.menuSpeed) {
                    dispatchCloseEvent();
                }
                control.removeClass('selectBox-menuShowing selectBox-menuShowing-'+(posTop?'top':'bottom'));
            } else {
                $(this).hide();
                $(this).triggerHandler('close', {
                    _selectBox: true
                });
                $(this).removeClass('selectBox-menuShowing selectBox-menuShowing-'+(posTop?'top':'bottom'));
            }

            options.css('max-height','');
            //Remove Top or Bottom class based on position
            options.removeClass('selectBox-options-'+(posTop?'top':'bottom'));
            options.data('posTop' , false);
        });
    };

    /**
     * Selects an option.
     *
     * @param {HTMLElement} li
     * @param {DOMEvent}    event
     * @returns {Boolean}
     */
    SelectBox.prototype.selectOption = function (li, event) {
        var select = $(this.selectElement);
        li         = $(li);

        var control    = select.data('selectBox-control')
            , settings = select.data('selectBox-settings');

        if (control.hasClass('selectBox-disabled')) {
            return false;
        }

        if (0 === li.length || li.hasClass('selectBox-disabled')) {
            return false;
        }

        if (select.attr('multiple')) {
            // If event.shiftKey is true, this will select all options between li and the last li selected
            if (event.shiftKey && control.data('selectBox-last-selected')) {
                li.toggleClass('selectBox-selected');
                var affectedOptions;
                if (li.index() > control.data('selectBox-last-selected').index()) {
                    affectedOptions = li
                        .siblings()
                        .slice(control.data('selectBox-last-selected').index(), li.index());
                } else {
                    affectedOptions = li
                        .siblings()
                        .slice(li.index(), control.data('selectBox-last-selected').index());
                }
                affectedOptions = affectedOptions.not('.selectBox-optgroup, .selectBox-disabled');
                if (li.hasClass('selectBox-selected')) {
                    affectedOptions.addClass('selectBox-selected');
                } else {
                    affectedOptions.removeClass('selectBox-selected');
                }
            } else if ((this.isMac && event.metaKey) || (!this.isMac && event.ctrlKey)) {
                li.toggleClass('selectBox-selected');
            } else {
                li.siblings().removeClass('selectBox-selected');
                li.addClass('selectBox-selected');
            }
        } else {
            li.siblings().removeClass('selectBox-selected');
            li.addClass('selectBox-selected');
        }

        if (control.hasClass('selectBox-dropdown')) {
            control.find('.selectBox-label').html(li.html());
        }

        // Update original control's value
        var i = 0, selection = [];
        if (select.attr('multiple')) {
            control.find('.selectBox-selected A').each(function () {
                selection[i++] = $(this).attr('rel');
            });
        } else {
            selection = li.find('A').attr('rel');
        }

        // Remember most recently selected item
        control.data('selectBox-last-selected', li);

        // Change callback
        if (select.val() !== selection) {
            select.val(selection);
            this.setLabel();
            select.trigger('change');
        }

        return true;
    };

    /**
     * Adds the hover class.
     *
     * @param {HTMLElement} li
     */
    SelectBox.prototype.addHover = function (li) {
        li = $(li);
        var select = $(this.selectElement)
            , control   = select.data('selectBox-control')
            , options = control.data('selectBox-options');

        options.find('.selectBox-hover').removeClass('selectBox-hover');
        li.addClass('selectBox-hover');
    };

    /**
     * Returns the original HTML select element.
     *
     * @returns {HTMLElement}
     */
    SelectBox.prototype.getSelectElement = function () {
        return this.selectElement;
    };

    /**
     * Remove the hover class.
     *
     * @param {HTMLElement} li
     */
    SelectBox.prototype.removeHover = function (li) {
        li = $(li);
        var select = $(this.selectElement)
            , control = select.data('selectBox-control')
            , options = control.data('selectBox-options');

        options.find('.selectBox-hover').removeClass('selectBox-hover');
    };

    /**
     * Checks if the widget is in the view.
     *
     * @param {jQuery}      li
     * @param {Boolean}     center
     */
    SelectBox.prototype.keepOptionInView = function (li, center) {
        if (!li || li.length === 0) {
            return;
        }

        var select = $(this.selectElement)
            , control     = select.data('selectBox-control')
            , options   = control.data('selectBox-options')
            , scrollBox = control.hasClass('selectBox-dropdown') ? options : options.parent()
            , top       = parseInt(li.offset().top -scrollBox.position().top)
            , bottom    = parseInt(top + li.outerHeight());

        if (center) {
            scrollBox.scrollTop(li.offset().top - scrollBox.offset().top + scrollBox.scrollTop() -
                (scrollBox.height() / 2));
        } else {
            if (top < 0) {
                scrollBox.scrollTop(li.offset().top - scrollBox.offset().top + scrollBox.scrollTop());
            }
            if (bottom > scrollBox.height()) {
                scrollBox.scrollTop((li.offset().top + li.outerHeight()) - scrollBox.offset().top +
                    scrollBox.scrollTop() - scrollBox.height());
            }
        }
    };

    /**
     * Handles the keyDown event.
     * Handles open/close and arrow key functionality
     *
     * @param {DOMEvent}    event
     */
    SelectBox.prototype.handleKeyDown = function (event) {
        var select = $(this.selectElement)
            , control        = select.data('selectBox-control')
            , options      = control.data('selectBox-options')
            , settings     = select.data('selectBox-settings')
            , totalOptions = 0, i = 0;

        if (control.hasClass('selectBox-disabled')) {
            return;
        }

        switch (event.keyCode) {
            case 8:
                // backspace
                event.preventDefault();
                this.typeSearch = '';
                break;
            case 9:
            // tab
            case 27:
                // esc
                this.hideMenus();
                this.removeHover();
                break;
            case 13:
                // enter
                if (control.hasClass('selectBox-menuShowing')) {
                    this.selectOption(options.find('LI.selectBox-hover:first'), event);
                    if (control.hasClass('selectBox-dropdown')) {
                        this.hideMenus();
                    }
                } else {
                    this.showMenu();
                }
                break;
            case 38:
            // up
            case 37:
                // left
                event.preventDefault();
                if (control.hasClass('selectBox-menuShowing')) {
                    var prev = options.find('.selectBox-hover').prev('LI');
                    totalOptions = options.find('LI:not(.selectBox-optgroup)').length;
                    i = 0;
                    while (prev.length === 0 || prev.hasClass('selectBox-disabled') ||
                        prev.hasClass('selectBox-optgroup')) {
                        prev = prev.prev('LI');
                        if (prev.length === 0) {
                            if (settings.loopOptions) {
                                prev = options.find('LI:last');
                            } else {
                                prev = options.find('LI:first');
                            }
                        }
                        if (++i >= totalOptions) {
                            break;
                        }
                    }
                    this.addHover(prev);
                    this.selectOption(prev, event);
                    this.keepOptionInView(prev);
                } else {
                    this.showMenu();
                }
                break;
            case 40:
            // down
            case 39:
                // right
                event.preventDefault();
                if (control.hasClass('selectBox-menuShowing')) {
                    var next = options.find('.selectBox-hover').next('LI');
                    totalOptions = options.find('LI:not(.selectBox-optgroup)').length;
                    i = 0;
                    while (0 === next.length || next.hasClass('selectBox-disabled') ||
                        next.hasClass('selectBox-optgroup')) {
                        next = next.next('LI');
                        if (next.length === 0) {
                            if (settings.loopOptions) {
                                next = options.find('LI:first');
                            } else {
                                next = options.find('LI:last');
                            }
                        }
                        if (++i >= totalOptions) {
                            break;
                        }
                    }
                    this.addHover(next);
                    this.selectOption(next, event);
                    this.keepOptionInView(next);
                } else {
                    this.showMenu();
                }
                break;
        }
    };

    /**
     * Handles the keyPress event.
     * Handles type-to-find functionality
     *
     * @param {DOMEvent}    event
     */
    SelectBox.prototype.handleKeyPress = function (event) {
        var select = $(this.selectElement)
            , control = select.data('selectBox-control')
            , options = control.data('selectBox-options')
            , self    = this;

        if (control.hasClass('selectBox-disabled')) {
            return;
        }

        switch (event.keyCode) {
            case 9:
            // tab
            case 27:
            // esc
            case 13:
            // enter
            case 38:
            // up
            case 37:
            // left
            case 40:
            // down
            case 39:
                // right
                // Don't interfere with the keydown event!
                break;
            default:
                // Type to find
                if (!control.hasClass('selectBox-menuShowing')) {
                    this.showMenu();
                }
                event.preventDefault();
                clearTimeout(this.typeTimer);
                this.typeSearch += String.fromCharCode(event.charCode || event.keyCode);
                options.find('A').each(function () {
                    if ($(this).text().substr(0, self.typeSearch.length).toLowerCase() === self.typeSearch.toLowerCase()) {
                        self.addHover($(this).parent());
                        self.selectOption($(this).parent(), event);
                        self.keepOptionInView($(this).parent());
                        return false;
                    }
                });
                // Clear after a brief pause
                this.typeTimer = setTimeout(function () {
                    self.typeSearch = '';
                }, 1000);
                break;
        }
    };

    /**
     * Enables the selectBox.
     */
    SelectBox.prototype.enable = function () {
        var select = $(this.selectElement);
        select.prop('disabled', false);
        var control = select.data('selectBox-control');
        if (!control) {
            return;
        }
        control.removeClass('selectBox-disabled');
    };

    /**
     * Disables the selectBox.
     */
    SelectBox.prototype.disable = function () {
        var select = $(this.selectElement);
        select.prop('disabled', true);
        var control = select.data('selectBox-control');
        if (!control) {
            return;
        }
        control.addClass('selectBox-disabled');
    };

    /**
     * Sets the current value.
     *
     * @param {String}      value
     */
    SelectBox.prototype.setValue = function (value) {
        var select = $(this.selectElement);
        select.val(value);
        value = select.val(); // IE9's select would be null if it was set with a non-exist options value

        if (null === value) { // So check it here and set it with the first option's value if possible
            value = select.children().first().val();
            select.val(value);
        }

        var control = select.data('selectBox-control');
        if (!control) {
            return;
        }

        var settings = select.data('selectBox-settings')
            , options = control.data('selectBox-options');

        // Update label
        this.setLabel();

        // Update control values
        options.find('.selectBox-selected').removeClass('selectBox-selected');
        options.find('A').each(function () {
            if (typeof(value) === 'object') {
                for (var i = 0; i < value.length; i++) {
                    if ($(this).attr('rel') == value[i]) {
                        $(this).parent().addClass('selectBox-selected');
                    }
                }
            } else {
                if ($(this).attr('rel') == value) {
                    $(this).parent().addClass('selectBox-selected');
                }
            }
        });

        if (settings.change) {
            settings.change.call(select);
        }
    };



    /**
     * Disables the selection.
     *
     * @param {*} selector
     */
    SelectBox.prototype.disableSelection = function (selector) {
        $(selector).css('MozUserSelect', 'none').bind('selectstart', function (event) {
            event.preventDefault();
        });
    };

    /**
     * Generates the options.
     *
     * @param {jQuery} self
     * @param {jQuery} options
     */
    SelectBox.prototype.generateOptions = function (self, options) {
        var li = $('<li />'), a = $('<a />');
        li.addClass(self.attr('class'));
        li.data(self.data());
        if (self.data('icon')) {
            a.attr('rel', self.val()).html('<i class="fa fa-'+self.data('icon')+' fa-fw fa-lg"></i> '+self.text());
        } else {
            a.attr('rel', self.val()).text(self.text());
        }
        li.append(a);
        if (self.attr('disabled')) {
            li.addClass('selectBox-disabled');
        }
        if (self.attr('selected')) {
            li.addClass('selectBox-selected');
        }
        options.append(li);
    };

    /**
     * Extends the jQuery.fn object.
     */
    $.extend($.fn, {

          /**
     * Sets the option elements.
     *
     * @param {String|Object} options
     */
    setOptions : function (options) {
        var select = $(this)
            , control = select.data('selectBox-control');
         
      
        switch (typeof(options)) {
            case 'string':
                select.html(options);
                break;
            case 'object':
                select.html('');
                for (var i in options) {
                    if (options[i] === null) {
                        continue;
                    }
                    if (typeof(options[i]) === 'object') {
                        var optgroup = $('<optgroup label="' + i + '" />');
                        for (var j in options[i]) {
                            optgroup.append('<option value="' + j + '">' + options[i][j] + '</option>');
                        }
                        select.append(optgroup);
                    } else {
                        var option = $('<option value="' + i + '">' + options[i] + '</option>');
                        select.append(option);
                    }
                }
                break;
        }

        if (control) {
            // Refresh the control
            $(this).selectBox('refresh');
            // Remove old options
  
        }
      },
      
      
      
      selectBox: function (method, options) {
            var selectBox;

            switch (method) {
                case 'control':
                    return $(this).data('selectBox-control');
                case 'settings':
                    if (!options) {
                        return $(this).data('selectBox-settings');
                    }
                    $(this).each(function () {
                        $(this).data('selectBox-settings', $.extend(true, $(this).data('selectBox-settings'), options));
                    });
                    break;
                case 'options':
                    // Getter
                   
                    if (undefined === options) {
                        return $(this).data('selectBox-control').data('selectBox-options');
                    }
                   
                    // Setter
                    $(this).each(function () {
                        $(this).setOptions(options);
                    });
                    break;
                case 'value':
                    // Empty string is a valid value
                    if (undefined === options) {
                        return $(this).val();
                    }
                    $(this).each(function () {
                        if (selectBox = $(this).data('selectBox')) {
                            selectBox.setValue(options);
                        }
                    });
                    break;
                case 'refresh':
                    $(this).each(function () {
                        if (selectBox = $(this).data('selectBox')) {
                            selectBox.refresh();
                        }
                    });
                    break;
                case 'enable':
                    $(this).each(function () {
                        if (selectBox = $(this).data('selectBox')) {
                            selectBox.enable(this);
                        }
                    });
                    break;
                case 'disable':
                    $(this).each(function () {
                        if (selectBox = $(this).data('selectBox')) {
                            selectBox.disable();
                        }
                    });
                    break;
                case 'destroy':
                    $(this).each(function () {
                        if (selectBox = $(this).data('selectBox')) {
                            selectBox.destroy();
                            $(this).data('selectBox', null);
                        }
                    });
                    break;
                case 'instance':
                    return $(this).data('selectBox');
                default:
                    $(this).each(function (idx, select) {
                        if (!$(select).data('selectBox')) {
                            $(select).data('selectBox', new SelectBox(select, method));
                        }
                    });
                    break;
            }
            return $(this);
        }
    });
})(jQuery);

svg4everybody();

document.addEventListener('DOMContentLoaded', function(){
  objectFitImages();
});

document.addEventListener('DOMContentLoaded', function(){

  function $$(selector, context) {
    context = context || document;
    var elements = context.querySelectorAll(selector);
    return Array.prototype.slice.call(elements);
  }

  var burgers = $$('.b-burger');

  for (var i = 0; i < burgers.length; i++) {
    var burger = burgers[i];
    burger.addEventListener('click', showBurgerTarget);
    function showBurgerTarget() {
      // document.body.classList.toggle('modal-open');
      var targetId = this.getAttribute('data-target-id');
      var targetClassToggle = this.getAttribute('data-target-class-toggle');
      if (targetId && targetClassToggle) {
        this.classList.toggle('b-burger--close');
        document.getElementById(targetId).classList.toggle(targetClassToggle);
      }
    }
  }

});

document.addEventListener('DOMContentLoaded', function(){

  document.querySelector('#nav-backdrop').addEventListener('click', function(){
    var click = new Event('click');
    document.querySelector('[data-target-id="nav"]').dispatchEvent(click);
  });

});

$( document ).ready(function() {

  // Меню юзера: мегадизайнер мегадизайнерит меню юзера
  $('#b-user-drop').on('show.bs.dropdown', function(){
    $(this).after('<div class="b-user__backdrop" id="b-user-backdrop" />');
  });
  $('#b-user-drop').on('hide.bs.dropdown', function(){
    $('#b-user-backdrop').remove();
  });

  // Мини-карточки объектов: включение/выключение видимости статистики
  $(document).on('click', '[data-b-card-stats-toggle]', function(){
    $(this).toggleClass('b-card-mini__footer-part--active').closest('[data-b-card]').find('[data-b-card-stats]').slideToggle();
  });

  // Сокрытие нижнего инфоблока (прибит к нижнему краю вьюпорта)
  $('[data-b-info-bottom] .close').on('click', function(){
    $(this).closest('[data-b-info-bottom]').fadeOut();
  });

  // Включение кастомных селектов для новых форм (заменяют обычные select-ы)
  if($('.b-select select').length) {
    $('.b-select select').selectBox({
      mobile: true,
      keepInViewport: false,
    });
  }


  // Работы выбора страны проживания
  if($('#country').length) {
    $('#country').countrySelect({
      defaultCountry: 'ru',
      preferredCountries: ['ru', 'ua'],
    });
  }

  // Включение селектора телефонного кода
  if($('#b-phone').length) {
    $('#b-phone').intlTelInput({
      autoHideDialCode: false,
      initialCountry: 'ru',
      preferredCountries: ['ru', 'ua'],
    });
  }

  // Включение селектора языков
  if($('#b-langs').length) {
    $('#b-langs').tagsInput({
      'height':'auto',
      'width':'100%',
      'interactive': false,
    });
  }
  if($('#b-lang-select').length) {
    $('#b-lang-select').selectBox({
      mobile: true,
      keepInViewport: false,
    }).change(function() {
      console.log( $(this).val() );
      $('#b-langs').addTag( $(this).val() );
    });
  }

  // Показ/сокрытие чекбоксов при выделении объектов в списке расшаривания
  $(document).on('change', '[data-b-object-list-checkbox]', function(){
    if($(this).is(':checked')) {
      $(this).closest('.b-object-list__item').addClass('b-object-list__item--pseudohover');
    }
    else {
      $(this).closest('.b-object-list__item').removeClass('b-object-list__item--pseudohover');
    }
  });

  // Выделение обертки блока с email в списке адресатов
  $(document).on('change', '[data-b-mail-checkbox]', function(){
    if($(this).is(':checked')) {
      $(this).closest('.b-field-checkbox').addClass('b-field-checkbox--mail-check');
    }
    else {
      $(this).closest('.b-field-checkbox').removeClass('b-field-checkbox--mail-check');
    }
  });

});


$( document ).ready(function() {

  // Детектор направления скролла и связанные эффекты
  var lastScrollTop = 0;
  window.addEventListener("scroll", function () {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    // Посетитель скроллит вниз
    if (st > lastScrollTop) {
      $('.b-save-btn').addClass('b-save-btn--animate');
      setTimeout(function(){
        $('.b-save-btn').removeClass('b-save-btn--animate');
      }, 2000);
      // Если скролл уже больше высоты шапки на мобилке, добавим класс сокрытия поиска шапки
      if(st > 96) {
        $('body').addClass('hide-header-search-xs');
      }
      // Скролл меньше высоты шапки - уберем класс сокрытия поиска
      else {
        $('body').removeClass('hide-header-search-xs');
      }
    }
    // Посетитель скроллит вверх
    else {
      // $('body').removeClass('scroll-to-down').addClass('scroll-to-up');
      // Убираем класс сокрытия поиска в шапке
      $('body').removeClass('hide-header-search-xs');
    }
    lastScrollTop = st <= 0 ? 0 : st;
  }, false);



  // Локация: Переключение «вкладок» фото/карта/улицы/
  $('.choose_show a').on('click', function (e) {
    e.preventDefault();
    $('.sw_show').hide();
    $($(this).attr('href')).show();
  })



  // Метод, определяющий видиомость чего-либо во вьюпорте
  $.fn.showInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  };



  // Локация: Показ/сокрытие кнопки добавления в избранное
  if ($('#hide-favorite-btn').length) {
    $(window).on('resize scroll', function () {
      if ($('#hide-favorite-btn').showInViewport()) {
        $('#temp-id1').addClass('b-save-btn--hidden');
      } else {
        $('#temp-id1').removeClass('b-save-btn--hidden');
      }
    });
  }



  // Показ и сокрытие блочков слайд-эффектом
  $('[data-slide-toggler]').on('click', function(e) {
    e.preventDefault();
    var that = $(this);
    that.toggleClass('js-open');
    var thatOpenText = that.data('slide-shown');
    var thatHiddenText = that.data('slide-hidden');
    $(that.data('slide-toggler')).slideToggle(200, function() {
      if( thatHiddenText && thatOpenText) {
        if ($(this).is(':visible')) {
          that.find('.js-text').text(thatOpenText);
        } else {
          that.find('.js-text').text(thatHiddenText);
        }
      }
    });
  });



  // Включение popover
  $('[data-toggle="popover"]').popover();
  // Закрытие popover при клике вне его
  $(document).on('click', function (e) {
    $('[data-toggle="popover"],[data-original-title]').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false  // fix for BS 3.3.6
      }
    });
  });



  // Допишем на html размеры скролла
  const outer = document.createElement('div');
  const inner = document.createElement('div');
  outer.style.overflow = 'scroll';
  outer.classList.add('b-scroll');
  document.body.appendChild(outer);
  outer.appendChild(inner);
  const scrollbarSize = outer.offsetWidth - inner.offsetWidth;
  document.body.removeChild(outer);
  document.documentElement.style.setProperty('--css-custom-scroll-size', `${scrollbarSize}px`);

  // Цена и кнопки плюс/минус (поле формы с выбором цены)
  var fieldsNum = document.querySelectorAll('.b-field-num');
  if (fieldsNum.length) {
    Array.prototype.forEach.call(fieldsNum, function (field) {
      const input = field.querySelector('.b-field-num__input');
      const text = field.querySelector('.b-field-num__text-num');
      const valueMin = input.getAttribute('min') ? +input.getAttribute('min') : -Infinity;
      const valueMax = input.getAttribute('max') ? +input.getAttribute('max') : Infinity;
      const valueStep = input.getAttribute('step') ? +input.getAttribute('step') : 1;
      field.addEventListener('click', function (event) {
        if (event.target.classList.contains('b-field-num__btn') && !input.getAttribute('disabled')) {
          var num = parseInt(input.value);
          if (isNaN(num)) num = 0;
          if (event.target.classList.contains('b-field-num__btn--plus')) {
            if (num < valueMax) input.value = num + valueStep;
          }
          if (event.target.classList.contains('b-field-num__btn--minus')) {
            if (num > valueMin) input.value = num - valueStep;
          }
          if (text) {
            text.innerText = new Intl.NumberFormat('en-US').format(input.value);
          }
        }
      });
    });
  }
  // Клик по кнопкам +/- выбоар цены: убираем с кнопки offer класс вторичности
  var itemAuction = document.querySelector('.b-info__item--auction');
  if (itemAuction) {
    itemAuction.addEventListener('click', function(e){
      if(e.target.classList.contains('b-field-num__btn')) {
        itemAuction.querySelector('.b-info__btn-offer-wrap .b-btn-2').classList.remove('b-btn-2--secondary');
      }
    });
  }



  // Модалки, которые на мобильном вьюпорте модалки, а на большом — сообщения в нижнем правом углу (имитация бутстраповских)
  $('[data-toggle="modal2"]').on('click', function(e){
    e.preventDefault();
    $('.b-modal-2--messages').hide().removeClass('in');
    var target = $(this).attr('href') || $(this).data('target');
    $(target).toggle();
    setTimeout(function(){
      $(target).toggleClass('in');
    }, 100)
  });
  $('[data-dismiss="modal2"], .b-modal-2--messages').on('click', function(e){
    e.preventDefault();
    var target = $(this).closest('.modal');
    $(target).toggleClass('in');
    setTimeout(function(){
      $(target).toggle();
    }, 300)
  });
  $('.b-modal-2--messages .modal-dialog').on('click', function (e) {
    e.stopPropagation();
  });



  // Аукцион: сортировка пунктов-предложений
  $('[data-sorter]').on('click', function(e){
    e.preventDefault();
    var triggerParent = $(this).closest('[data-sorter-active-class]');
    var activeClass = $(triggerParent).data('sorter-active-class');
    var sorterAttr = $(this).data('sorter');
    var targetList = $(this).data('sorter-list-id');
    var list = $.makeArray($('#' + targetList + ' li'));
    list.sort(function(a, b){
      return a.dataset[sorterAttr] - b.dataset[sorterAttr];
    });
    $('#' + targetList).html(list);
    $(triggerParent).find('.' + activeClass).removeClass(activeClass);
    $(this).addClass(activeClass);
  });



  // Сообщения: переключение видимости чатов
  $('a[data-chat-id]').on('click', function(e){
    e.preventDefault();
    var targetTab = $('.b-messages__chats-item#' + $(this).data('chat-id'));
    $('body').addClass('b-chat-visible');
    $('.b-chat-item').removeClass('b-chat-item--active');
    $(this).addClass('b-chat-item--active');
    $('.b-messages__chats-item').removeClass('b-messages__chats-item--mobile-active b-messages__chats-item--desktop-active');
    targetTab.addClass('b-messages__chats-item--mobile-active b-messages__chats-item--desktop-active');
    var content = targetTab.find('.b-chat__content')[0];
    var inner = targetTab.find('.b-chat__inner')[0];
    // крутанем скролл вниз
    content.scrollTop = content.scrollHeight;
    // если у внетренней обертки высота меньше внешней, добавим отступ, чтоб сообщения были ниже
    if (inner.offsetHeight < content.offsetHeight) {
      $(inner).css({marginTop: content.offsetHeight - inner.offsetHeight + 'px'});
    }
  });
  // Сокрытие чата кликом по кнопке «назад» для мобилок
  $('.b-chat__back-btn').on('click', function (e) {
    e.preventDefault();
    $('body').removeClass('b-chat-visible');
    $('.b-messages__chats-item').removeClass('b-messages__chats-item--mobile-active');
  });



  // Сообщения: закрытие сообщения, выводимого вверху страницы
  $('[data-dismiss="b-alert"]').on('click', function(e){
    e.preventDefault();
    $(this).closest('.b-alert').fadeOut();
  });



  // Настройки: переключение между картой оплаты и новой картой в модальном окне
  $('#cardSelector').selectBox().change(function () {
    if ($(this).val() == 'addNewCard') {
      $('#cardSelectorFooterDefault').hide();
      $('#cardSelectorFooterNewCard').show();
      $('#cardSelectorNewCard').slideDown();
    }
    else {
      $('#cardSelectorFooterDefault').show();
      $('#cardSelectorFooterNewCard').hide();
      $('#cardSelectorNewCard').slideUp();
    }
  });



  // Редактирование профиля: работа псевдоинпута с телефоном
  const phoneNumberInputWrap = document.querySelector('#countryPhoneCodeWrap');
  if(phoneNumberInputWrap) {
    const phoneNumberInput = document.querySelector('#phoneNumber');
    phoneNumberInput.addEventListener('focus', (e) => {phoneNumberInputWrap.classList.add('b-form-group__phone-wrap--focus');});
    phoneNumberInput.addEventListener('blur', (e) => { phoneNumberInputWrap.classList.remove('b-form-group__phone-wrap--focus');});
    document.querySelector('#countryCodeSelect').addEventListener('change', (event) => {
      document.querySelector('#countryPhoneCode').innerHTML = event.target.value;
    });
  }



  // Сообщения, модальное окно покупки контакта: клик по кнопке покупки меняет содержимое окна
  var payButtonsParent = document.getElementById('unlock-1');
  if (payButtonsParent) {
    payButtonsParent.addEventListener('click', function(e){
      if (e.target.dataset.payFormSum) {
        document.getElementById('tariffs-pay').style.display = 'none';
        document.getElementById('tariffs-pay-form').style.display = 'block';
        var sum = e.target.dataset.payFormSum;
        document.getElementById('tariffs-pay-form-sum-input').value = sum;
        document.querySelectorAll('[data-tariff-sum]').forEach(function(item){
          item.innerHTML = sum;
        });
      }
    });
  }



  // ВРЕМЕННОЕ ДЕМО! ТОЛЬКО НЕ В ПРОД! Локация: Визуализация работы кнопки Save
  $('#temp-id1').on('click', function () {
    var saveTextNode = $(this).find('.b-save-btn__text-save');
    var inactiveText = $(saveTextNode).data('inactive-text');
    var activeText = $(saveTextNode).data('active-text');
    $(this).toggleClass('b-save-btn--active');
    if ($(this).is('.b-save-btn--active')) {
      $(saveTextNode).text(activeText);
    }
    else {
      $(saveTextNode).text(inactiveText);
    }
  });

});

