// Toggle class active
const navbarNav = document.querySelector(".navbar-nav");
// Ketika hamburger menu di klik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

// Klik di luar sidebar untuk menghilangkan nav
const hamburger = document.querySelector("#hamburger-menu");

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

newFunction(exports);

function newFunction(exports) {
  (function (global, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
      define(factory);
    } else {
      global.AOS = factory();
    }
  })(this, function () {
    "use strict";

    var root =
      typeof window !== "undefined"
        ? window
        : typeof global !== "undefined"
        ? global
        : typeof self !== "undefined"
        ? self
        : {};
    var FUNC_ERROR_TEXT = "Expected a function";
    var NAN = NaN;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    var freeGlobal =
      typeof root === "object" && root && root.Object === Object && root;
    var freeSelf =
      typeof self === "object" && self && self.Object === Object && self;
    var thisGlobal = freeGlobal || freeSelf || Function("return this")();
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var nativeMax = Math.max;
    var nativeMin = Math.min;
    var now = function () {
      return thisGlobal.Date.now();
    };

    function debounce(func, wait, options) {
      var lastArgs,
        lastThis,
        maxWait,
        result,
        timerId,
        lastCallTime,
        lastInvokeTime = 0,
        leading = false,
        maxing = false,
        trailing = true;

      if (typeof func !== "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }

      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = "maxWait" in options;
        maxWait = maxing
          ? nativeMax(toNumber(options.maxWait) || 0, wait)
          : maxWait;
        trailing = "trailing" in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
          thisArg = lastThis;
        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        lastInvokeTime = time;
        timerId = setTimeout(timerExpired, wait);
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime;
        var timeSinceLastInvoke = time - lastInvokeTime;
        var timeWaiting = wait - timeSinceLastCall;
        return maxing
          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
          : timeWaiting;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime;
        var timeSinceLastInvoke = time - lastInvokeTime;
        return (
          lastCallTime === undefined ||
          timeSinceLastCall >= wait ||
          timeSinceLastCall < 0 ||
          (maxing && timeSinceLastInvoke >= maxWait)
        );
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
          isInvoking = shouldInvoke(time);
        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;
        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }

      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    function isObject(value) {
      var type = typeof value;
      return !!value && (type === "object" || type === "function");
    }

    function toNumber(value) {
      if (typeof value === "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other =
          typeof value.valueOf === "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
      }
      if (typeof value !== "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value)
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : reIsBadHex.test(value)
        ? NAN
        : +value;
    }

    function isSymbol(value) {
      return (
        typeof value === "symbol" ||
        (isObject(value) && objectToString.call(value) === symbolTag)
      );
    }

    var throttle = function (func, wait, options) {
      var leading = true,
        trailing = true;

      if (typeof func !== "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }

      if (isObject(options)) {
        leading = "leading" in options ? !!options.leading : leading;
        trailing = "trailing" in options ? !!options.trailing : trailing;
      }

      return debounce(func, wait, {
        leading: leading,
        maxWait: wait,
        trailing: trailing,
      });
    };

    var MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;

    var observer = {
      isSupported: function () {
        return !!MutationObserver;
      },
      ready: function (callback, options) {
        var doc = window.document;
        var observer = new MutationObserver(callback);
        observer.observe(doc.documentElement, {
          childList: true,
          subtree: true,
          removedNodes: true,
        });
      },
    };

    var AOS = function () {
      var instance = this;
      var elements = [];
      var initialized = false;
      var options = {
        offset: 120,
        delay: 0,
        easing: "ease",
        duration: 400,
        disable: false,
        once: false,
        mirror: false,
        anchorPlacement: "top-bottom",
        startEvent: "DOMContentLoaded",
        animatedClassName: "aos-animate",
        initClassName: "aos-init",
        useClassNames: false,
        disableMutationObserver: false,
        throttleDelay: 99,
        debounceDelay: 50,
      };

      function init(userOptions) {
        options = Object.assign(options, userOptions);
        elements = getElements();
        if (options.disableMutationObserver || !observer.isSupported()) {
          console.info(
            '\n      aos: MutationObserver is not supported on this browser,\n      code mutations observing has been disabled.\n      You may have to call "refreshHard()" by yourself.\n    '
          );
          options.disableMutationObserver = true;
        }
        if (!options.disableMutationObserver) {
          observer.ready("[data-aos]", refresh);
        }
        if (shouldDisable() || isIE11()) {
          disable();
        } else {
          document
            .querySelector("body")
            .setAttribute("data-aos-easing", options.easing);
          document
            .querySelector("body")
            .setAttribute("data-aos-duration", options.duration);
          document
            .querySelector("body")
            .setAttribute("data-aos-delay", options.delay);
          if (["DOMContentLoaded", "load"].indexOf(options.startEvent) === -1) {
            document.addEventListener(options.startEvent, function () {
              refresh(true);
            });
          } else {
            window.addEventListener("load", function () {
              refresh(true);
            });
          }
          if (
            options.startEvent === "DOMContentLoaded" &&
            ["complete", "interactive"].indexOf(document.readyState) > -1
          ) {
            refresh(true);
          }
          window.addEventListener(
            "resize",
            debounce(refresh, options.debounceDelay, true)
          );
          window.addEventListener(
            "orientationchange",
            debounce(refresh, options.debounceDelay, true)
          );
          elements = getElements();
        }
      }

      function refresh(hard) {
        if (hard) {
          initialized = true;
        }
        if (initialized) {
          elements = prepare(elements, options);
          handleScroll(elements);
          window.addEventListener(
            "scroll",
            throttle(function () {
              handleScroll(elements, options.once);
            }, options.throttleDelay)
          );
        }
      }

      function refreshHard() {
        elements = getElements();
        if (shouldDisable() || isIE11()) {
          disable();
        } else {
          refresh(true);
        }
      }

      function disable() {
        elements.forEach(function (element) {
          element.node.removeAttribute("data-aos");
          element.node.removeAttribute("data-aos-easing");
          element.node.removeAttribute("data-aos-duration");
          element.node.removeAttribute("data-aos-delay");
          if (options.initClassName) {
            element.node.classList.remove(options.initClassName);
          }
          if (options.animatedClassName) {
            element.node.classList.remove(options.animatedClassName);
          }
        });
      }

      function shouldDisable() {
        return (
          options.disable === true ||
          (options.disable === "mobile" && isMobile()) ||
          (options.disable === "phone" && isPhone()) ||
          (options.disable === "tablet" && isTablet()) ||
          (typeof options.disable === "function" && options.disable() === true)
        );
      }

      function isIE11() {
        return (
          "-ms-scroll-limit" in document.documentElement.style &&
          "-ms-ime-align" in document.documentElement.style
        );
      }

      function isMobile() {
        var userAgent =
          navigator.userAgent || navigator.vendor || window.opera || "";
        return (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            userAgent
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            userAgent
          )
        );
      }

      function isTablet() {
        return isMobile() && !isPhone();
      }

      function getElements() {
        var elements = document.querySelectorAll("[data-aos]");
        return Array.prototype.map.call(elements, function (element) {
          return { node: element };
        });
      }

      function prepare(elements, options) {
        return elements.forEach(function (element) {
          var mirror = getAttribute(element.node, "mirror", options.mirror);
          var once = getAttribute(element.node, "once", options.once);
          var id = getAttribute(element.node, "id");
          var classNames =
            options.useClassNames && element.node.getAttribute("data-aos");
          var animatedClassNames = [options.animatedClassName]
            .concat(classNames ? classNames.split(" ") : [])
            .filter(function (className) {
              return typeof className === "string";
            });
          if (options.initClassName) {
            element.node.classList.add(options.initClassName);
          }
          element.position = {
            in: getPositionIn(
              element.node,
              options.offset,
              options.anchorPlacement
            ),
            out: mirror && getPositionOut(element.node, options.offset),
          };
          element.options = {
            once: once,
            mirror: mirror,
            animatedClassNames: animatedClassNames,
            id: id,
          };
        });
      }

      function getPositionIn(element, offset, anchorPlacement) {
        var windowHeight = window.innerHeight;
        var anchor = getAttribute(element, "anchor");
        var anchorPlacement = getAttribute(element, "anchor-placement");
        var offset = Number(
          getAttribute(element, "offset", anchorPlacement ? 0 : offset)
        );
        var placement = anchorPlacement || anchorPlacement;
        var target = element;
        if (anchor && document.querySelectorAll(anchor)) {
          target = document.querySelectorAll(anchor)[0];
        }
        var position = getOffset(target).top - windowHeight;
        switch (placement) {
          case "top-bottom":
            break;
          case "center-bottom":
            position += target.offsetHeight / 2;
            break;
          case "bottom-bottom":
            position += target.offsetHeight;
            break;
          case "top-center":
            position += windowHeight / 2;
            break;
          case "center-center":
            position += windowHeight / 2 + target.offsetHeight / 2;
            break;
          case "bottom-center":
            position += windowHeight / 2 + target.offsetHeight;
            break;
          case "top-top":
            position += windowHeight;
            break;
          case "bottom-top":
            position += windowHeight + target.offsetHeight;
            break;
          case "center-top":
            position += windowHeight + target.offsetHeight / 2;
            break;
        }
        return position + offset;
      }

      function getPositionOut(element, offset) {
        var windowHeight = window.innerHeight;
        var anchor = get;
      }
    };
  });
}