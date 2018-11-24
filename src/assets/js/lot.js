'use strict';

import _ from 'lodash';
import $ from 'jquery';

let centerUrn,
    leftUrn,
    rightUrn,
    electors = [],
    speed = 3000;

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

    let chain = Promise.resolve();
    
    //for (let i = 0; i < senators.length; i++) {
    for (let i = 0; i < 1; i++) {
        //chain = chain.then(()=>animateSenator(senators[i]));
        chain = chain.then(()=>outerDraw(senators[i]));
    }

    return chain;
}

function outerDraw(senator) {
    
    return new Promise(resolve => {

        let draw = null,
        sequence = senator.split(' ')[1];

        $('#' + senator.replace(' ', '-').toLowerCase()).fadeOut(500);

        if(sequence % 2 === 0){
            draw = drawBall('left');
            $('.senators-drawing-left').fadeIn(speed, function(){
                $('.senators-drawing-left').fadeOut(speed, function(){
                    if(draw === 'gold'){
                        return innerDraw(senator);
                    }
                    else {
                        return disgard(senator);
                    }
                });
            });
        }
        else {
            draw = drawBall('right');
            $('.senators-drawing-right').fadeIn(speed, function(){
                $('.senators-drawing-right').fadeOut(speed, function(){
                    if(draw === 'gold'){
                        return innerDraw(senator);
                    }
                    else {
                        return disgard(senator);
                    }
                });
            });
        }
    });
}

function innerDraw(senator) {
    return new Promise(resolve => {
        $('.senator-drawing').fadeIn(speed, function(){
            if(drawBall('center') === 'gold'){
                $('.senator-drawing').fadeOut(speed, function(){
                    return elected(senator);
                });
            }
            else {
                $('.senator-drawing').fadeOut(speed, function(){
                    return disgard(senator);
                });
            }
        });
    });
}

function elected(senator) {
    return new Promise(resolve => {
        $('.senator-elected').fadeIn(speed, function(){
            $('.senator-elected').fadeOut(speed);
            electors.push(senator);
            resolve();
        });
    });
}

function disgard(senator) {
    return new Promise(resolve => {
        $('.senator-discarding').fadeIn(speed, function(){
            $('#' + senator.replace(' ', '-').toLowerCase()).fadeIn(speed);
            $('.senator-discarding').fadeOut(speed, resolve());
        });
    });
}

function Wait() {
    return new Promise(resolve => setTimeout(resolve, 1000));
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