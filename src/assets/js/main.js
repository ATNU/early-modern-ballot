/**
 * Created by sanchez 
 */
'use strict';

//check the environment
// if (process.env.NODE_ENV !== 'production') {
//     console.log('Looks like we are in development mode!');
// }

// import CSS
import bootstrap from 'bootstrap/scss/bootstrap.scss';
import * as slide from 'bootstrap-slider/dist/css/bootstrap-slider.min.css';
import scss from '../css/sass.scss';

// import Js Plugins/Entities

//ES6 Module
import $ from 'jquery';
import modal from 'jquery-modal';
import slider from 'bootstrap-slider';
import _ from 'lodash';
import Lot from './lot';
import Nomination from './nomination';
import Suffrage from './suffrage';


let offices,
    senators,
    side,
    row,
    seat;

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

    $('.slider').on('mouseup', function(){
        window.ballot.setSpeed((11 - $('#speed-slider').val()) * 100);
    });

    window.ballot.init();
};

window.ballot = {
    isPaused: false,
    speed: 500,
    results: {},
    nominations: {},
    electors: {},
    setSpeed: function(speed){
        this.speed = speed;
    },
    getSpeed: function(){
        return this.speed;
    },
    run: function(){

        $('#play-button').removeClass('d-block');
        $('#play-button').addClass('d-none');
        $('#stop-button').removeClass('d-none');
        $('#stop-button').addClass('d-block');

        if(this.isPaused){
            this.isPaused = false;
            this.setSpeed((11 - $('#speed-slider').val()) * 100);
        }
        else {
            Lot(offices, senators).then(function(electors){
                window.ballot.electors = electors;
                Nomination(offices, _.chunk(_.shuffle(electors), offices.length)).then(function(nominations){
                    window.ballot.nominations = nominations;
                    Suffrage(nominations, senators).then(function(results){
                        window.ballot.results = results;

                        console.group('Results');
                        console.info(window.ballot.electors);
                        console.info(window.ballot.nominations);
                        console.info(window.ballot.results);
                        console.groupEnd();

                        let html = '';

                        Object.keys(window.ballot.nominations).forEach(function(office){
                            html += '<tr><th scope="row">' + office + '</th>';

                            window.ballot.nominations[office].forEach(function(nominee){
                                if(nominee === window.ballot.results[office]){
                                    html += '<td><strong>' + nominee +  '</strong></td>';
                                }
                                else {
                                    html += '<td>' + nominee +  '</td>';
                                }
                                
                            });

                            html += '</tr>';
                        });

                        $('#results-grid').html(html);

                        $('#results-modal').modal('show');
                    });
                });
        
            });
        }
    },
    stop: function(){
        window.location.reload();
    },
    init: function(){
        offices = ['Strategus', 'Orator', '3rd commissioner of the Seal', '3rd commissioner of the Treasury', '1st Censor', '2nd Censor'];
        senators = [];
        side = 'right';
        row = 'row-4';
        seat = 312;

        for(let i=0; i<200; i++){

            if(i % 2 === 0){
                side = 'left';
            }
            else {
                seat = seat + 16;
                side = 'right';
            }

            if(i === 50){
                row = 'row-3';
                seat = 308;
            }

            if(i === 100){
                row = 'row-2';
                seat = 302;
            }

            if(i === 150 ){
                row = 'row-1';
                seat = 308;
            } 

            senators.push('Senator ' + i);

            let senatorDiv = '<div id="senator-' + i + '" class="benched-senator ' + row + ' ' + side + '" style="top: ' + seat + 'px"></div>';

            $('#benches').append(senatorDiv);
        }
    }
};