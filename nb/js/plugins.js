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

/*!
 * jquery.okayNav.js 2.0.4 (https://github.com/VPenkov/okayNav)
 * Author: Vergil Penkov (http://vergilpenkov.com/)
 * MIT license: https://opensource.org/licenses/MIT
 */

;
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory); // AMD
    } else if (typeof module === 'object' && module.exports) {
        module.exports = function(root, jQuery) { // Node/CommonJS
            if (jQuery === undefined) {
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        factory(jQuery); // Browser globals
    }
}(function($) {
    // Defaults

    var okayNav = 'okayNav',
        defaults = {
            parent: '', // will call nav's parent() by default
            toggle_icon_class: 'okayNav__menu-toggle',
            toggle_icon_content: '<span /><span /><span />',
            align_right: true, // If false, the menu and the kebab icon will be on the left
            swipe_enabled: true, // If true, you'll be able to swipe left/right to open the navigation
            threshold: 50, // Nav will auto open/close if swiped >= this many percent
            resize_delay: 10, // When resizing the window, okayNav can throttle its recalculations if enabled. Setting this to 50-250 will improve performance but make okayNav less accurate.
            beforeOpen: function() {}, // Will trigger before the nav gets opened
            afterOpen: function() {}, // Will trigger after the nav gets opened
            beforeClose: function() {}, // Will trigger before the nav gets closed
            afterClose: function() {}, // Will trigger after the nav gets closed
            itemHidden: function() {},
            itemDisplayed: function() {}
        };

    // Begin
    function Plugin(element, options) {
        var self = this;
        this.options = $.extend({}, defaults, options);

        self.navigation = $(element);
        self.document = $(document);
        self.window = $(window);

        this.options.parent == '' ? this.options.parent = self.navigation.parent() : '';

        self.nav_open = false; // Store the state of the hidden nav
        self.parent_full_width = 0;

        // Swipe stuff
        self.radCoef = 180 / Math.PI;
        self.sTouch = {
            x: 0,
            y: 0
        };
        self.cTouch = {
            x: 0,
            y: 0
        };
        self.sTime = 0;
        self.nav_position = 0;
        self.percent_open = 0;
        self.nav_moving = false;


        self.init();
    }

    $.extend(Plugin.prototype, {

        init: function() {
            var self = this;

            $('body').addClass('okayNav-loaded');

            // Add classes
            self.navigation
                .addClass('okayNav loaded')
                .children('ul').addClass('okayNav__nav--visible');

            // Append elements
            if (self.options.align_right) {
                self.navigation
                    .append('<ul class="okayNav__nav--invisible transition-enabled nav-right" />')
                    .append('<a href="#" class="' + self.options.toggle_icon_class + ' okay-invisible">' + self.options.toggle_icon_content + '</a>')
            } else {
                self.navigation
                    .prepend('<ul class="okayNav__nav--invisible transition-enabled nav-left" />')
                    .prepend('<a href="#" class="' + self.options.toggle_icon_class + ' okay-invisible">' + self.options.toggle_icon_content + '</a>')
            }

            // Cache new elements for further use
            self.nav_visible = self.navigation.children('.okayNav__nav--visible');
            self.nav_invisible = self.navigation.children('.okayNav__nav--invisible');
            self.toggle_icon = self.navigation.children('.' + self.options.toggle_icon_class);

            self.toggle_icon_width = self.toggle_icon.outerWidth(true);
            self.default_width = self.getChildrenWidth(self.navigation);
            self.parent_full_width = $(self.options.parent).outerWidth(true);
            self.last_visible_child_width = 0; // We'll define this later

            // Events are up once everything is set
            self.initEvents();

            // Trim white spaces between visible nav elements
            self.nav_visible.contents().filter(function() {
                return this.nodeType = Node.TEXT_NODE && /\S/.test(this.nodeValue) === false;
            }).remove();

            if (self.options.swipe_enabled == true) self.initSwipeEvents();
        },

        initEvents: function() {
            var self = this;
            // Toggle hidden nav when hamburger icon is clicked and
            // Collapse hidden nav on click outside the header
            self.document.on('click.okayNav', function(e) {
                var _target = $(e.target);

                if (self.nav_open === true && _target.closest('.okayNav').length == 0)
                    self.closeInvisibleNav();

                if (e.target === self.toggle_icon.get(0)) {
                    e.preventDefault();
                    self.toggleInvisibleNav();
                }
            });

            var optimizeResize = self._debounce(function() {
                self.recalcNav()
            }, self.options.resize_delay);
            self.window.on('load.okayNav resize.okayNav', optimizeResize);
        },

        initSwipeEvents: function() {
            var self = this;
            self.document
                .on('touchstart.okayNav', function(e) {
                    self.nav_invisible.removeClass('transition-enabled');

                    //Trigger only on touch with one finger
                    if (e.originalEvent.touches.length == 1) {
                        var touch = e.originalEvent.touches[0];
                        if (
                            ((touch.pageX < 25 && self.options.align_right == false) ||
                                (touch.pageX > ($(self.options.parent).outerWidth(true) - 25) &&
                                    self.options.align_right == true)) ||
                            self.nav_open === true) {

                            self.sTouch.x = self.cTouch.x = touch.pageX;
                            self.sTouch.y = self.cTouch.y = touch.pageY;
                            self.sTime = Date.now();
                        }

                    }
                })
                .on('touchmove.okayNav', function(e) {
                    var touch = e.originalEvent.touches[0];
                    self._triggerMove(touch.pageX, touch.pageY);
                    self.nav_moving = true;
                })
                .on('touchend.okayNav', function(e) {
                    self.sTouch = {
                        x: 0,
                        y: 0
                    };
                    self.cTouch = {
                        x: 0,
                        y: 0
                    };
                    self.sTime = 0;

                    //Close menu if not swiped enough
                    if (self.percent_open > (100 - self.options.threshold)) {
                        self.nav_position = 0;
                        self.closeInvisibleNav();

                    } else if (self.nav_moving == true) {
                        self.nav_position = self.nav_invisible.width();
                        self.openInvisibleNav();
                    }

                    self.nav_moving = false;

                    self.nav_invisible.addClass('transition-enabled');
                });
        },

        _getDirection: function(dx) {
            if (this.options.align_right) {
                return (dx > 0) ? -1 : 1;
            } else {
                return (dx < 0) ? -1 : 1;
            }
        },

        _triggerMove: function(x, y) {
            var self = this;

            self.cTouch.x = x;
            self.cTouch.y = y;

            var currentTime = Date.now();
            var dx = (self.cTouch.x - self.sTouch.x);
            var dy = (self.cTouch.y - self.sTouch.y);

            var opposing = dy * dy;
            var distance = Math.sqrt(dx * dx + opposing);
            //Length of the opposing side of the 90deg triagle
            var dOpposing = Math.sqrt(opposing);

            var angle = Math.asin(Math.sin(dOpposing / distance)) * self.radCoef;
            var speed = distance / (currentTime - self.sTime);

            //Set new start position
            self.sTouch.x = x;
            self.sTouch.y = y;

            //Remove false swipes
            if (angle < 20) {
                var dir = self._getDirection(dx);

                var newPos = self.nav_position + dir * distance;
                var menuWidth = self.nav_invisible.width();
                var overflow = 0;


                if (newPos < 0) {
                    overflow = -newPos;
                } else if (newPos > menuWidth) {
                    overflow = menuWidth - newPos;
                }

                var size = menuWidth - (self.nav_position + dir * distance + overflow);
                var threshold = (size / menuWidth) * 100;

                //Set new position and threshold
                self.nav_position += dir * distance + overflow;
                self.percent_open = threshold;

                self.nav_invisible.css('transform', 'translateX(' + (self.options.align_right ? 1 : -1) * threshold + '%)');
            }

        },

        /*
         * A few methods to allow working with elements
         */
        getParent: function() {
            return this.options.parent;
        },

        getVisibleNav: function() { // Visible navigation
            return this.nav_visible;
        },

        getInvisibleNav: function() { // Hidden behind the kebab icon
            return this.nav_invisible;
        },

        getNavToggleIcon: function() { // Kebab icon
            return this.toggle_icon;
        },

        /*
         * Operations
         */
        _debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },

        openInvisibleNav: function() {
            var self = this;

            !self.options.enable_swipe ? self.options.beforeOpen.call() : '';

            self.toggle_icon.addClass('icon--active');
            self.nav_invisible.addClass('nav-open');
            self.nav_open = true;
            self.nav_invisible.css({
                '-webkit-transform': 'translateX(0%)',
                'transform': 'translateX(0%)'
            });

            self.options.afterOpen.call();
        },

        closeInvisibleNav: function() {
            var self = this;
            !self.options.enable_swipe ? self.options.beforeClose.call() : '';

            self.toggle_icon.removeClass('icon--active');
            self.nav_invisible.removeClass('nav-open');

            if (self.options.align_right) {
                self.nav_invisible.css({
                    '-webkit-transform': 'translateX(100%)',
                    'transform': 'translateX(100%)'
                });
            } else {
                self.nav_invisible.css({
                    '-webkit-transform': 'translateX(-100%)',
                    'transform': 'translateX(-100%)'
                });
            }
            self.nav_open = false;

            self.options.afterClose.call();
        },

        toggleInvisibleNav: function() {
            var self = this;
            if (!self.nav_open) {
                self.openInvisibleNav();
            } else {
                self.closeInvisibleNav();
            }
        },


        /*
         * Math stuff
         */
        getChildrenWidth: function(el) {
            var children_width = 0;
            var children = $(el).children();
            for (var i = 0; i < children.length; i++) {
                children_width += $(children[i]).outerWidth(true);
            };

            return children_width;
        },

        getVisibleItemCount: function() {
            return $('li', this.nav_visible).length;
        },
        getHiddenItemCount: function() {
            return $('li', this.nav_invisible).length;
        },

        recalcNav: function() {
            var self = this;
            var wrapper_width = $(self.options.parent).outerWidth(true),
                space_taken = self.getChildrenWidth(self.options.parent),
                nav_full_width = self.navigation.outerWidth(true),
                visible_nav_items = self.getVisibleItemCount(),
                collapse_width = self.nav_visible.outerWidth(true) + self.toggle_icon_width,
                expand_width = space_taken + self.last_visible_child_width + self.toggle_icon_width,
                expandAll_width = space_taken - nav_full_width + self.default_width;

            if (wrapper_width > expandAll_width) {
                self._expandAllItems();
                self.toggle_icon.addClass('okay-invisible');
                return;
            }

            if (visible_nav_items > 0 &&
                nav_full_width <= collapse_width &&
                wrapper_width <= expand_width) {
                self._collapseNavItem();
            }

            if (wrapper_width > expand_width + self.toggle_icon_width + 15) {
                self._expandNavItem();
            }


            // Hide the kebab icon if no items are hidden
            self.getHiddenItemCount() == 0 ?
                self.toggle_icon.addClass('okay-invisible') :
                self.toggle_icon.removeClass('okay-invisible');
        },

        _collapseNavItem: function() {
            var self = this;
            var $last_child = $('li:last-child', self.nav_visible);
            self.last_visible_child_width = $last_child.outerWidth(true);
            self.document.trigger('okayNav:collapseItem', $last_child);
            $last_child.detach().prependTo(self.nav_invisible);
            self.options.itemHidden.call();
            // All nav items are visible by default
            // so we only need recursion when collapsing

            self.recalcNav();
        },

        _expandNavItem: function() {
            var self = this;
            var $first = $('li:first-child', self.nav_invisible);
            self.document.trigger('okayNav:expandItem', $first);
            $first.detach().appendTo(self.nav_visible);
            self.options.itemDisplayed.call();
        },

        _expandAllItems: function() {
            var self = this;
            $('li', self.nav_invisible).detach().appendTo(self.nav_visible);
            self.options.itemDisplayed.call();
        },

        _collapseAllItems: function() {
            var self = this;
            $('li', self.nav_visible).detach().appendTo(self.nav_invisible);
            self.options.itemHidden.call();
        },

        destroy: function() {
            var self = this;
            $('li', self.nav_invisible).appendTo(self.nav_visible);
            self.nav_invisible.remove();
            self.nav_visible.removeClass('okayNav__nav--visible');
            self.toggle_icon.remove();

            self.document.unbind('.okayNav');
            self.window.unbind('.okayNav');
        }

    });

    // Plugin wrapper
    $.fn[okayNav] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            return this.each(function() {
                if (!$.data(this, 'plugin_' + okayNav)) {
                    $.data(this, 'plugin_' + okayNav, new Plugin(this, options));
                }
            });

        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            var returns;
            this.each(function() {
                var instance = $.data(this, 'plugin_' + okayNav);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }

                if (options === 'destroy') {
                    $.data(this, 'plugin_' + okayNav, null);
                }
            });

            return returns !== undefined ? returns : this;
        }
    };
}));

// Sticky Plugin v1.0.4 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 02/14/2011
// Date: 07/20/2015
// Website: http://stickyjs.com/
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var slice = Array.prototype.slice; // save ref to original slice()
    var splice = Array.prototype.splice; // save ref to original slice()

  var defaults = {
      topSpacing: 0,
      bottomSpacing: 0,
      className: 'is-sticky',
      wrapperClassName: 'sticky-wrapper',
      center: false,
      getWidthFrom: '',
      widthFromWrapper: true, // works only when .getWidthFrom is empty
      responsiveWidth: false,
      zIndex: 'inherit'
    },
    $window = $(window),
    $document = $(document),
    sticked = [],
    windowHeight = $window.height(),
    scroller = function() {
      var scrollTop = $window.scrollTop(),
        documentHeight = $document.height(),
        dwh = documentHeight - windowHeight,
        extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

      for (var i = 0, l = sticked.length; i < l; i++) {
        var s = sticked[i],
          elementTop = s.stickyWrapper.offset().top,
          etse = elementTop - s.topSpacing - extra;

        //update height in case of dynamic content
        s.stickyWrapper.css('height', s.stickyElement.outerHeight());

        if (scrollTop <= etse) {
          if (s.currentTop !== null) {
            s.stickyElement
              .css({
                'width': '',
                'position': '',
                'top': '',
                'z-index': ''
              });
            s.stickyElement.parent().removeClass(s.className);
            s.stickyElement.trigger('sticky-end', [s]);
            s.currentTop = null;
          }
        }
        else {
          var newTop = documentHeight - s.stickyElement.outerHeight()
            - s.topSpacing - s.bottomSpacing - scrollTop - extra;
          if (newTop < 0) {
            newTop = newTop + s.topSpacing;
          } else {
            newTop = s.topSpacing;
          }
          if (s.currentTop !== newTop) {
            var newWidth;
            if (s.getWidthFrom) {
                padding =  s.stickyElement.innerWidth() - s.stickyElement.width();
                newWidth = $(s.getWidthFrom).width() - padding || null;
            } else if (s.widthFromWrapper) {
                newWidth = s.stickyWrapper.width();
            }
            if (newWidth == null) {
                newWidth = s.stickyElement.width();
            }
            s.stickyElement
              .css('width', newWidth)
              .css('position', 'fixed')
              .css('top', newTop)
              .css('z-index', s.zIndex);

            s.stickyElement.parent().addClass(s.className);

            if (s.currentTop === null) {
              s.stickyElement.trigger('sticky-start', [s]);
            } else {
              // sticky is started but it have to be repositioned
              s.stickyElement.trigger('sticky-update', [s]);
            }

            if (s.currentTop === s.topSpacing && s.currentTop > newTop || s.currentTop === null && newTop < s.topSpacing) {
              // just reached bottom || just started to stick but bottom is already reached
              s.stickyElement.trigger('sticky-bottom-reached', [s]);
            } else if(s.currentTop !== null && newTop === s.topSpacing && s.currentTop < newTop) {
              // sticky is started && sticked at topSpacing && overflowing from top just finished
              s.stickyElement.trigger('sticky-bottom-unreached', [s]);
            }

            s.currentTop = newTop;
          }

          // Check if sticky has reached end of container and stop sticking
          var stickyWrapperContainer = s.stickyWrapper.parent();
          var unstick = (s.stickyElement.offset().top + s.stickyElement.outerHeight() >= stickyWrapperContainer.offset().top + stickyWrapperContainer.outerHeight()) && (s.stickyElement.offset().top <= s.topSpacing);

          if( unstick ) {
            s.stickyElement
              .css('position', 'absolute')
              .css('top', '')
              .css('bottom', 0)
              .css('z-index', '');
          } else {
            s.stickyElement
              .css('position', 'fixed')
              .css('top', newTop)
              .css('bottom', '')
              .css('z-index', s.zIndex);
          }
        }
      }
    },
    resizer = function() {
      windowHeight = $window.height();

      for (var i = 0, l = sticked.length; i < l; i++) {
        var s = sticked[i];
        var newWidth = null;
        if (s.getWidthFrom) {
            if (s.responsiveWidth) {
                newWidth = $(s.getWidthFrom).width();
            }
        } else if(s.widthFromWrapper) {
            newWidth = s.stickyWrapper.width();
        }
        if (newWidth != null) {
            s.stickyElement.css('width', newWidth);
        }
      }
    },
    methods = {
      init: function(options) {
        return this.each(function() {
          var o = $.extend({}, defaults, options);
          var stickyElement = $(this);

          var stickyId = stickyElement.attr('id');
          var wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName;
          var wrapper = $('<div></div>')
            .attr('id', wrapperId)
            .addClass(o.wrapperClassName);

          stickyElement.wrapAll(function() {
            if ($(this).parent("#" + wrapperId).length == 0) {
                    return wrapper;
            }
});

          var stickyWrapper = stickyElement.parent();

          if (o.center) {
            stickyWrapper.css({width:stickyElement.outerWidth(),marginLeft:"auto",marginRight:"auto"});
          }

          if (stickyElement.css("float") === "right") {
            stickyElement.css({"float":"none"}).parent().css({"float":"right"});
          }

          o.stickyElement = stickyElement;
          o.stickyWrapper = stickyWrapper;
          o.currentTop    = null;

          sticked.push(o);

          methods.setWrapperHeight(this);
          methods.setupChangeListeners(this);
        });
      },

      setWrapperHeight: function(stickyElement) {
        var element = $(stickyElement);
        var stickyWrapper = element.parent();
        if (stickyWrapper) {
          stickyWrapper.css('height', element.outerHeight());
        }
      },

      setupChangeListeners: function(stickyElement) {
        if (window.MutationObserver) {
          var mutationObserver = new window.MutationObserver(function(mutations) {
            if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
              methods.setWrapperHeight(stickyElement);
            }
          });
          mutationObserver.observe(stickyElement, {subtree: true, childList: true});
        } else {
          if (window.addEventListener) {
            stickyElement.addEventListener('DOMNodeInserted', function() {
              methods.setWrapperHeight(stickyElement);
            }, false);
            stickyElement.addEventListener('DOMNodeRemoved', function() {
              methods.setWrapperHeight(stickyElement);
            }, false);
          } else if (window.attachEvent) {
            stickyElement.attachEvent('onDOMNodeInserted', function() {
              methods.setWrapperHeight(stickyElement);
            });
            stickyElement.attachEvent('onDOMNodeRemoved', function() {
              methods.setWrapperHeight(stickyElement);
            });
          }
        }
      },
      update: scroller,
      unstick: function(options) {
        return this.each(function() {
          var that = this;
          var unstickyElement = $(that);

          var removeIdx = -1;
          var i = sticked.length;
          while (i-- > 0) {
            if (sticked[i].stickyElement.get(0) === that) {
                splice.call(sticked,i,1);
                removeIdx = i;
            }
          }
          if(removeIdx !== -1) {
            unstickyElement.unwrap();
            unstickyElement
              .css({
                'width': '',
                'position': '',
                'top': '',
                'float': '',
                'z-index': ''
              })
            ;
          }
        });
      }
    };

  // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
  if (window.addEventListener) {
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', resizer, false);
  } else if (window.attachEvent) {
    window.attachEvent('onscroll', scroller);
    window.attachEvent('onresize', resizer);
  }

  $.fn.sticky = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };

  $.fn.unstick = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.unstick.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };
  $(function() {
    setTimeout(scroller, 0);
  });
}));

/*
 Sticky-kit v1.1.3 | MIT | Leaf Corcoran 2015 | http://leafo.net
*/
(function(){var c,f;c=window.jQuery;f=c(window);c.fn.stick_in_parent=function(b){var A,w,J,n,B,K,p,q,L,k,E,t;null==b&&(b={});t=b.sticky_class;B=b.inner_scrolling;E=b.recalc_every;k=b.parent;q=b.offset_top;p=b.spacer;w=b.bottoming;null==q&&(q=0);null==k&&(k=void 0);null==B&&(B=!0);null==t&&(t="is_stuck");A=c(document);null==w&&(w=!0);L=function(a){var b;return window.getComputedStyle?(a=window.getComputedStyle(a[0]),b=parseFloat(a.getPropertyValue("width"))+parseFloat(a.getPropertyValue("margin-left"))+
parseFloat(a.getPropertyValue("margin-right")),"border-box"!==a.getPropertyValue("box-sizing")&&(b+=parseFloat(a.getPropertyValue("border-left-width"))+parseFloat(a.getPropertyValue("border-right-width"))+parseFloat(a.getPropertyValue("padding-left"))+parseFloat(a.getPropertyValue("padding-right"))),b):a.outerWidth(!0)};J=function(a,b,n,C,F,u,r,G){var v,H,m,D,I,d,g,x,y,z,h,l;if(!a.data("sticky_kit")){a.data("sticky_kit",!0);I=A.height();g=a.parent();null!=k&&(g=g.closest(k));if(!g.length)throw"failed to find stick parent";
v=m=!1;(h=null!=p?p&&a.closest(p):c("<div />"))&&h.css("position",a.css("position"));x=function(){var d,f,e;if(!G&&(I=A.height(),d=parseInt(g.css("border-top-width"),10),f=parseInt(g.css("padding-top"),10),b=parseInt(g.css("padding-bottom"),10),n=g.offset().top+d+f,C=g.height(),m&&(v=m=!1,null==p&&(a.insertAfter(h),h.detach()),a.css({position:"",top:"",width:"",bottom:""}).removeClass(t),e=!0),F=a.offset().top-(parseInt(a.css("margin-top"),10)||0)-q,u=a.outerHeight(!0),r=a.css("float"),h&&h.css({width:L(a),
height:u,display:a.css("display"),"vertical-align":a.css("vertical-align"),"float":r}),e))return l()};x();if(u!==C)return D=void 0,d=q,z=E,l=function(){var c,l,e,k;if(!G&&(e=!1,null!=z&&(--z,0>=z&&(z=E,x(),e=!0)),e||A.height()===I||x(),e=f.scrollTop(),null!=D&&(l=e-D),D=e,m?(w&&(k=e+u+d>C+n,v&&!k&&(v=!1,a.css({position:"fixed",bottom:"",top:d}).trigger("sticky_kit:unbottom"))),e<F&&(m=!1,d=q,null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),h.detach()),c={position:"",width:"",top:""},a.css(c).removeClass(t).trigger("sticky_kit:unstick")),
B&&(c=f.height(),u+q>c&&!v&&(d-=l,d=Math.max(c-u,d),d=Math.min(q,d),m&&a.css({top:d+"px"})))):e>F&&(m=!0,c={position:"fixed",top:d},c.width="border-box"===a.css("box-sizing")?a.outerWidth()+"px":a.width()+"px",a.css(c).addClass(t),null==p&&(a.after(h),"left"!==r&&"right"!==r||h.append(a)),a.trigger("sticky_kit:stick")),m&&w&&(null==k&&(k=e+u+d>C+n),!v&&k)))return v=!0,"static"===g.css("position")&&g.css({position:"relative"}),a.css({position:"absolute",bottom:b,top:"auto"}).trigger("sticky_kit:bottom")},
y=function(){x();return l()},H=function(){G=!0;f.off("touchmove",l);f.off("scroll",l);f.off("resize",y);c(document.body).off("sticky_kit:recalc",y);a.off("sticky_kit:detach",H);a.removeData("sticky_kit");a.css({position:"",bottom:"",top:"",width:""});g.position("position","");if(m)return null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),h.remove()),a.removeClass(t)},f.on("touchmove",l),f.on("scroll",l),f.on("resize",y),c(document.body).on("sticky_kit:recalc",y),a.on("sticky_kit:detach",H),setTimeout(l,
0)}};n=0;for(K=this.length;n<K;n++)b=this[n],J(c(b));return this}}).call(this);
