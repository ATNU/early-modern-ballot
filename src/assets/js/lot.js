'use strict';

import _ from 'lodash';
import $ from 'jquery';

let centerUrn,
    leftUrn,
    rightUrn;

export default function Lot(offices, senators) {

    let centerUrn = {
        goldBalls: 4 * offices.length,
        silverBalls: 50 - (4 * offices.length)
    };

    let urns = {
            center: {
                goldBalls: centerUrn.goldBalls,
                silverBalls: centerUrn.silverBalls
            },
            left: {
                goldBalls: (centerUrn.goldBalls + centerUrn.silverBalls) / 2,
                silverBalls: (senators.length / 2 ) - (centerUrn.goldBalls + centerUrn.silverBalls) / 2
            },
            right: {
                goldBalls: (centerUrn.goldBalls + centerUrn.silverBalls) / 2,
                silverBalls: ( senators.length / 2 ) - (centerUrn.goldBalls + centerUrn.silverBalls) / 2
            }
        };

    let smallLot = ['inner-top', 'inner-bottom', 'outer-top', 'outer-bottom'];

    let electors = [],
        interval = 0;

    mixBalls(urns);

    for (let i = 0; i < senators.length; i++) {

        setTimeout(function(){
            let firstDraw = null,
                message = '';

            $('#' + senators[i].replace(' ', '-').toLowerCase()).fadeOut(500);

            setTimeout(function(){
                if(i % 2 === 0){
                    firstDraw = drawBall('left');
                    $('.senators-drawing-left').fadeIn(250);
                    message = senators[i] + ' drew a ' + firstDraw + ' ball from the left urn';
                }
                else {
                    firstDraw = drawBall('right');
                    $('.senators-drawing-right').fadeIn(250);
                    message = senators[i] + ' drew a ' + firstDraw + ' ball from the right urn';
                }

                if(firstDraw === 'gold'){
                    $('.senator-drawing').fadeIn(500);
                }
            }, 500);

            setTimeout(function(){
                if(firstDraw === 'gold' && drawBall('center') === 'gold'){
                    $('.senator-elected').fadeIn(250);
                    $('.senator-drawing').fadeOut(250);
                    message += ' and drew a gold ball from the center urn.';
                    electors.push(senators[i]);
                }
                else if(firstDraw === 'gold' && drawBall('center') === 'silver'){
                    $('.senator-discarding').fadeIn(250);
                    $('.senator-drawing').fadeOut(250);
                    message += ' and drew a silver ball from the center urn.';
                    $('#' + senators[i].replace(' ', '-').toLowerCase()).fadeIn(250);
                }
                else {
                    message += '.';
                    $('#' + senators[i].replace(' ', '-').toLowerCase()).fadeIn(250);
                }

                $('#feedback').html('<p>' + message + '</p>');
            }, 1500);

            setTimeout(function(){
                $('.senator-elected').fadeOut(250);
                $('.senator-discarding').fadeOut(250);
                $('.senator-drawing').fadeOut(250);
                $('.senators-drawing-left').fadeOut(250);
                $('.senators-drawing-right').fadeOut(250);
                $('#feedback').html('');
            }, 2500);
        }, i * 3000);
        
        if(i === senators.length-1){
            return electors;
        }
    }
}

function mixBalls(urns){

    //Fill the center urn with the correct number of gold and silver balls
    centerUrn = Array(urns.center.goldBalls + urns.center.silverBalls);
    centerUrn.fill('gold', 0, urns.center.goldBalls);
    centerUrn.fill('silver', urns.center.goldBalls, urns.center.silverBalls + urns.center.goldBalls);

    //Fill the left urn with the correct number of gold and silver balls
    leftUrn = Array(urns.left.goldBalls + urns.left.silverBalls);
    leftUrn.fill('gold', 0, urns.left.goldBalls);
    leftUrn.fill('silver', urns.left.goldBalls, urns.left.silverBalls + urns.left.goldBalls);

    //Fill the right urn with the correct number of gold and silver balls
    rightUrn = Array(urns.right.goldBalls + urns.right.silverBalls);
    rightUrn.fill('gold', 0, urns.right.goldBalls);
    rightUrn.fill('silver', urns.right.goldBalls, urns.right.silverBalls + urns.right.goldBalls);

    //Shuffle the arrays to simulate the random drawing of balls by each senator
    centerUrn = _.shuffle(centerUrn);
    leftUrn = _.shuffle(leftUrn);
    rightUrn = _.shuffle(rightUrn);
}

function drawBall(urn){
    //draw a ball from the named urn
    switch(urn){
        case 'center':
            return centerUrn.pop();
        case 'left':
            return leftUrn.pop();
        case 'right':
            return rightUrn.pop();
        default:
            console.error('Invalid urn name');
    }
}