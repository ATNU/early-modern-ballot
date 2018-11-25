'use strict';

import _ from 'lodash';
import $ from 'jquery';

let centerUrn,
    leftUrn,
    rightUrn,
    electors = [],
    speed = 10;

export default function Lot(offices, senators) {

    centerUrn = {
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

    mixBalls(urns);

    let chain = Promise.resolve();
    
    for (let i = 0; i < senators.length; i++) {
        chain = chain.then(function(){
            return outerDraw(senators[i]);
        });
    }

    chain = chain.then(function(){
        return new Promise(resolve => {
            resolve(electors);
        });
    });

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
                        resolve(innerDraw(senator));
                    }
                    else {
                        resolve(disgard(senator));
                    }
                });
            });
        }
        else {
            draw = drawBall('right');
            $('.senators-drawing-right').fadeIn(speed, function(){
                $('.senators-drawing-right').fadeOut(speed, function(){
                    if(draw === 'gold'){
                        resolve(innerDraw(senator));
                    }
                    else {
                        resolve(disgard(senator));
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
                    resolve(elected(senator));
                });
            }
            else {
                $('.senator-drawing').fadeOut(speed, function(){
                    resolve(disgard(senator));
                });
            }
        });
    });
}

function elected(senator) {
    return new Promise(resolve => {
        $('.senator-elected').fadeIn(speed, function(){
            $('.senator-elected').fadeOut(speed, function(){
                electors.push(senator);
                resolve();
            });
        });
    });
}

function disgard(senator) {
    return new Promise(resolve => {
        $('.senator-discarding').fadeIn(speed, function(){
            $('#' + senator.replace(' ', '-').toLowerCase()).fadeIn(speed, function(){
                $('.senator-discarding').fadeOut(speed, resolve());
            });
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