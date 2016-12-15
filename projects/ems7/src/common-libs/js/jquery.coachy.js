/*
 Copyright 2011 Javier Alejandro Figueroa

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

(function ($) {
    if (typeof (Raphael) == 'undefined') {
        console.log("jQuery Coachy: I need Raphael JS in order to work. http://raphaeljs.com");
        return;
    }

    // RaphaelJS Extension:
    // show arrow from [origin]:(point) to [$elm]:(jQuery wrapped DOM Element), with arrow head [size] and line [stoke] width
    Raphael.fn.arrowForElement = function (origin, $elm, size, stroke) {
        var cx1 = 0, cy1 = 0, cx2 = 0, cy2 = 0;
        var curve = 200;
        var perfectPos = $.fn.getPointingSpotForBox($elm, origin.x, origin.y, 15);
        var x1 = perfectPos.x, y1 = perfectPos.y;
        var boxMaxX = $elm.offset().left + $elm.outerWidth(),
            boxMaxY = $elm.offset().top + $elm.outerHeight();
        if (origin.x > x1 && origin.y > y1) { //arrow diag from bottom right to top left
            cx1 = origin.x - curve; cy1 = origin.y; cx2 = x1;
            if (boxMaxY > origin.y) cy2 = y1 - curve;
            else cy2 = y1 + curve;
        } else if (origin.x < x1 && origin.y < y1) { //arrow diag from top left to bottom right
            cx1 = origin.x + curve; cy1 = origin.y; cx2 = x1; cy2 = y1 - curve;
        } else if (origin.x > x1 && origin.y < y1) { //arrow diag from top right to bottom left
            cx1 = origin.x - curve; cy1 = origin.y; cx2 = x1; cy2 = y1 - curve;
        } else if (origin.x < x1 && origin.y > y1) { //arrow diag from bottom left to top right
            cx1 = origin.x + curve; cy1 = origin.y; cx2 = x1;
            if (boxMaxY > origin.y) cy2 = y1 - curve;
            else cy2 = y1 + curve;
        } else if (origin.y == y1 && origin.x != x1) { //straight horizontal line
            cx1 = origin.x; cy1 = origin.y - 100; cx2 = x1; cy2 = y1 - 100;
        } else if (origin.y != y1 && origin.x == x1) { //straight vertical line
            cx1 = origin.x + 100; cy1 = origin.y; cx2 = x1 + 100; cy2 = y1;
        } else if (origin.y == y1 && origin.x == x1) { //dot
            cx1 = origin.x; cy1 = origin.y; cx2 = x1; cy2 = y1;
        }

        var linePath = this.path("M" + origin.x + " " + origin.y + " C" + cx1 + " " + cy1 + " " + cx2 + " " + cy2 + " " + x1 + " " + y1).attr({ "stroke-width": "1px", stroke: stroke });
        var point = linePath.getPointAtLength(linePath.getTotalLength() - 10);
        var angle = Raphael.angle(point.x, point.y, x1, y1);
        var arrowPath = this.path(
                        "M" + x1 + " " + y1 +
                        " L" + ((x1 - 10) - (size * 2)) + " " + (y1 - (size * 2)) +
                        " L" + ((x1 - 10) - (size * 2)) + " " + (y1 + (size * 2)) +
                        " L" + x1 + " " + y1
                        )
                        .rotate((angle + 180), x1, y1)
                        .attr({ "fill": stroke, "stroke": stroke, "stroke-width": "1px" });
        return { finalX: x1, finalY: y1, linePath: linePath, arrowPath: arrowPath };
    };

    // where to point the arrow if the object is a box?
    $.fn.getPointingSpotForBox = function ($elem, arrowOriginX, arrowOriginY, customOffset) {
        // measuring element
        var elmOffset = $elem.offset();
        var elmWidth = $elem.outerWidth();
        var elmHeight = $elem.outerHeight();
        // corners
        var elmX0 = elmOffset.left;
        var elmX1 = elmOffset.left + elmWidth;
        var elmY0 = elmOffset.top;
        var elmY1 = elmOffset.top + elmHeight;
        // variables to return
        var xRet, yRet;
        // offseting arrow in relation to element
        if (!customOffset) customOffset = 10;
        //
        // now where should it point to? (without invading element area)
        // _____
        // -> X:
        // arrowOrigin is at left of the element? lets point to it's right border
        //// ALWAYS PONTING TO MIDDLE OF WIDTH:
        xRet = elmX0 + ((elmX1 - elmX0) / 2);
        ////if (elmX1 < arrowOriginX) {
        ////    xRet = elmX0 + ((elmX1 - elmX0) / 2);// - customOffset;
        ////}
        ////    // arrowOrigin is about the same x ? lets point to it's middle width
        ////else if (elmX0 <= arrowOriginX && elmX1 >= arrowOriginX) {
        ////    xRet = elmX0 + ((elmX1 - elmX0) / 2);
        ////}
        ////    // arrowOrigin is at right of the element ! lets point to it's left border
        ////else {
        ////    xRet = elmX0 + ((elmX1 - elmX0) / 2);// - customOffset;
        ////}
        // _____
        // -> Y:
        // arrowOrigin is below element? lets point to it's bottom border
        if (elmY1 < arrowOriginY) {
            yRet = elmY1 + customOffset;
        }
            // arrowOrigin is about the same Y ? lets point to it's middle height
            //else if (elmY0 <= arrowOriginY && elmY1 >= arrowOriginY) {
            //    yRet = elmY0;// + ((elmY1 - elmY0) / 2);
            //}
            // arrowOrigin is above the element ! lets point to it's top border
        else {
            yRet = elmY0 - customOffset;
        }
        return { x: xRet, y: yRet };
    };


    // BEGIN jQuery Coachy Plugin
    $.fn.coachy = function (options) {
            //=============================================================
            // DEFINITIONS:
            //__________
            // defaults:
            var defaults = {
                on: "showCoachy",
                off: "hideCoachy",
                arrow: {
                    x1: $(window).width() / 2,
                    y1: $(window).height() / 2
                },
                zindex: 999,
                opacity: 0.4,
                modal: true,
                theme: "white",
                arrowHeadSize: 4,
                tailDotSize: 2,
                message: "Welcome to jQuery Coachy",
                bringToFront: true, // bring element to front with z-index
                autoOpen: false,
                life: 0, // 0(ms) => stays forever
                onlyOnce: false, // handler runs once then removes itself
                selector: '' // extra selector, elements matched here will have and arrow pointing to them too
            };
            //options extend defaults
            options = $.extend(defaults, options);

            // ______
            // return
            return this.each(function () {
                // UID for each jQueryCoachy
                var id = "__jquerycoachy__" + parseInt((new Date()).getTime() + (Math.random() * 10));
                //___________________
                // attaching handlers
                $(this).on(options.on, function () {
                        showCoachy.call(this, id, options);
                    });
                $(this).on(options.off, function () {
                        hideCoachy.call(this, id, options);
                    });

                //__________
                // autoOpen?
                if (options.autoOpen) {
                    showCoachy.call(this, id, options);
                }
            });
        };


    //=============================================================
    // METHODS
    //____________
    // show method
    function showCoachy(id,options,raphaelPaper) {
        var x1 = options.arrow.x1,
            y1 = options.arrow.y1;
        var windowX = $(window).width();
        var windowY = $(window).height() - 5;
        // element
        var $elm = $(this);
        // bring element to Front
        if (options.bringToFront) {
            $elm.attr('data-z-index', $elm.css('z-index'));
            $elm.css('z-index', options.zindex + 10);
            $elm.css('background-color', "white");
        }

        // Create coachy div
        // if a raphaelJSPaper is passed, it doesnt need to be created
        var paper;
        if (raphaelPaper === undefined) {
            $('#' + id).remove();
            var div = $("<div />").attr("id", id).attr('class','jQueryCoachy');
            div.css({
                "position": "absolute",
                "top": 0,
                "left": 0,
                "z-index": options.zindex,
                "background": options.modal ? (options.theme == "white" ? "black" : "white") : "none",
                "opacity": 0,
                "pointer-events": " none"
            });
            //injected
            $("body").append(div);

            console.info(options);
            //fadeIn
            div.data('initialopacity', div.css('opacity')).stop().animate({ opacity: options.opacity }, 500);

            // to close Coachy on ESC Key
            $(document).on("keydown", coachyEscHandler);

            // raphaelJS canvas
            paper = Raphael(document.getElementById(id), windowX, windowY);
            // circle on center
            paper.circle(x1, y1, options.tailDotSize).attr({ "fill": options.theme, "stroke": options.theme, "stroke-width": "1px" });
        } else {
            paper = raphaelPaper;
        }

        //draw arrow
        var finalArrow = paper.arrowForElement(
            /*arrow*/{ x: x1, y: y1 },
            /*elementBox*/$elm,
            options.arrowHeadSize, options.theme);

        // text optimal offset
        var offsetText = 30; // offsets text this ammount of pixels up or down depending on arrow final position
        var offsetX = (x1 < finalArrow.finalX) ? offsetX = -offsetText : offsetX = offsetText;
        var offsetY = (y1 < finalArrow.finalY) ? offsetY = -offsetText : offsetY = offsetText;

        // show main text
        paper.text(x1 + offsetX, y1 + offsetY, options.message).attr({
            font: "Helvetica",
            "font-size": "25px",
            stroke: options.theme,
            fill: options.theme
        });

        // unbind on event
        if (options.onlyOnce)
            $(this).off(options.on);

        // mouse events on svg is set to none, on interaction with svgs
        $("#" + id + " > svg").css("pointer-events", " none");

        // has extra selector?
        if (options.selector !== '')
            $(options.selector).each(function () {
                showCoachy.call(this, id,
                     $.extend(options,
                        // overriding params because those ate extra coachmarks
                        { modal: false, message: '', selector: '',autoOpen:true, opacity: 0 }
                        ),
                        paper // flag that it's a secondary arrow
                    );
            });

        // has limited lifetime?
        if (options.life > 0) {
            var element = this;
            // autoHide clear function: cleartimeout so that it doesnt conflict with other dispatches of the "off" event
            var clearAutoHide = function () {
                clearTimeout(autoHideTO);
                hideCoachy.call(element, id,options);
                $(element).off(options.off, clearAutoHide);
            };
            // set method to clear the timeout to autoHide when the "off" event is dispatched
            $(element).on(options.off, clearAutoHide);
            // setTimeout to hide when lifetime runs out
            var autoHideTO = setTimeout(function () {
                // z-index reset
                $elm.attr('data-z-index', '');
                $elm.css('z-index', 1);
                $elm.css('background-color', "");

                hideCoachy.call(element, id,options);
            }, options.life);
        }
    }
    //____________
    // hide method
    function hideCoachy(id,options) {
        var element = this;
        $("#" + id).stop().animate({ opacity: $("#" + id).data('initialopacity') }, 500, function () {
            if (options.bringToFront) {
                $(element).css('z-index', $(element).attr('data-z-index'));
            }
            $(this).remove();
        });
        // clear close Coachy on ESC Key
        $(document).off("keypress", coachyEscHandler);
    }

    function coachyEscHandler(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 27) {
            $(".jQueryCoachy").remove();
        }
    }

})(jQuery);
