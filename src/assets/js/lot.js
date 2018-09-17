'use strict';

export default function Lot(offices, senators) {

    let centreUrn = {
            goldBalls: offices,
            silverBalls: 50 - offices,
        },
        leftUrn = {
            goldBalls: centreUrn.goldBalls,
            silverBalls: senators / 2 - centreUrn.goldBalls
        },
        rightUrn = {
            goldBalls: centreUrn.goldBalls,
            silverBalls: senators / 2 - centreUrn.goldBalls
        };

    let smallLot = ['inner-top', 'inner-bottom', 'outer-top', 'outer-bottom'];


}