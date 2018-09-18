'use strict';

import _ from 'lodash';

export default function Nomination(offices, orders) {

    let nominations = {};

    //create empty object to hold nominations
    offices.forEach(function(office){
        nominations[office] = [];
    });

    //loop over each order of electors
    orders.forEach(function(electors){
        //loop over each elector in the order

        //list of senators already nominated in this order
        let nominated = [];

        electors.forEach(function(elector, index){

            let nominationComplete = false;

            //remove current elector from pool of potential nominees
            let potentialNominees = electors.slice(0);
            _.pull(potentialNominees, elector);

            //remove previously nominated electors from pool of potential nominees
            let nominees = _.difference(potentialNominees, nominated);

            do {
                //nominate a senator
                let nominee = nominees.pop();

                //Randomly choose to accept nomination or not
                if(nominees.length === 0 || _.sample([true, false])){
                    nominations[offices[index]].push(nominee);
                    nominated.push(nominee);

                    nominationComplete = true;
                }
            }
            while(!nominationComplete)
        });
    });

    //return all nominations
    return nominations;
}