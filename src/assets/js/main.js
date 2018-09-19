/**
 * Created by sanchez 
 */
'use strict';

//check the environment
// if (process.env.NODE_ENV !== 'production') {
//     console.log('Looks like we are in development mode!');
// }

// import CSS
// import animate_css from 'animate.css/animate.min.css';
import scss from '../css/sass.scss';


// import Js Plugins/Entities

//ES6 Module
import _ from 'lodash';
import Lot from './lot';
import Nomination from './nomination';
import Suffrage from './suffrage';

window.h5 = {
    isPc: function() {
        var userAgentInfo = navigator.userAgent;
        var Agents = Array('Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod');
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
    },
    rootResize: function() {
        //orientation portrait width=750px height=1334px / WeChat width=750px height=1206px 
        var wFsize;
        //screen.width screen.height  bug !!!
        // var wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width :
        //     window.innerWidth : window.innerWidth;
        // var wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ?
        //     screen.height : window.innerHeight : window.innerHeight;
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;
        if (wWidth > wHeight) {
            wFsize = wHeight / 750 * 100;
        } else {
            wFsize = wWidth / 750 * 100;
        }
        document.getElementsByTagName('html')[0].style.fontSize = wFsize + 'px';
    },
    eventInit: function() {
        var that = this;
        document.addEventListener('touchstart', function(e) {}, { passive: false });
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
        return that;
    },
    cssInit: function() {
        var that = this;
        var noChangeCountToEnd = 100,
            noEndTimeout = 1000;
        that.rootResize();
        window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', function() {
            var interval,
                timeout,
                end,
                lastInnerWidth,
                lastInnerHeight,
                noChangeCount;
            end = function() {
                // "orientationchangeend"
                clearInterval(interval);
                clearTimeout(timeout);
                interval = null;
                timeout = null;
                that.rootResize();
            };
            interval = setInterval(function() {
                if (window.innerWidth === lastInnerWidth && window.innerHeight === lastInnerHeight) {
                    noChangeCount++;
                    if (noChangeCount === noChangeCountToEnd) {
                        // The interval resolved the issue first.
                        end();
                    }
                } else {
                    lastInnerWidth = window.innerWidth;
                    lastInnerHeight = window.innerHeight;
                    noChangeCount = 0;
                }
            });
            timeout = setTimeout(function() {
                // The timeout happened first.
                end();
            }, noEndTimeout);
        });

        return that;
    },
    init: function() {
        var that = this;
        that.cssInit().eventInit();
    }
};
window.onload = function() {
    window.h5.init();

    let offices = ['Strategus', 'Orator', '3rd commissioner of the Seal', '3rd commissioner of the Treasury', '1st Censor', '2nd Censor'],
        senators = [];

    for(let i=0; i<200; i++){
        senators.push('Senator ' + i);
    }

    let electors = Lot(offices, senators);

    let nominations = Nomination(offices, _.chunk(_.shuffle(electors), offices.length));

    let result = Suffrage(nominations, senators);
};