'use strict';

import _ from 'lodash';

let centerUrn,
    leftUrn,
    rightUrn;

export default function Lot(offices, senators) {

    let urns = {
            center: {
                goldBalls: 4 * offices.length,
                silverBalls: 50 - (4 * offices.length),
            },
            left: {
                goldBalls: 4 * offices.length,
                silverBalls: (senators / 2 ) - (4 * offices.length)
            },
            right: {
                goldBalls: 4 * offices.length,
                silverBalls: ( senators / 2 ) - (4 * offices.length)
            }
        };

    let smallLot = ['inner-top', 'inner-bottom', 'outer-top', 'outer-bottom'];

    let electors = [];

    mixBalls(urns);

    for (let i = 0; i < senators; i++) {

        let firstDraw = null;

        if(i % 2 === 0){
            firstDraw = drawBall('left');
        }
        else {
            firstDraw = drawBall('right');
        }

        if(firstDraw === 'gold' && drawBall('center') === 'gold'){
            electors.push('Senator ' + (i + 1));
        }
        else {
            //Return to seat
        }
    }

    return electors;
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