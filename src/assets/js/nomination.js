'use strict';

import _ from 'lodash';
import $ from 'jquery';

export default function Nomination(offices, orders) {

    let nominations = {},
        intervalId,
        speed = 10;

    //create empty object to hold nominations
    offices.forEach(function(office){
        nominations[office] = [];
    });

    let chain = Promise.resolve();

    chain = chain.then(function(){
        $('#feedback').html('<p>Nominations</p>');
        return new Promise(resolve => {
            setTimeout(resolve, speed*2);
        });
    });

    console.log(orders);

    //loop over each order of electors
    for (let i = 0; i < orders.length; i++) {
        //loop over each elector in the order

        chain = chain.then(function(){

            return new Promise(resolve => {

                //list of senators already nominated in this order
                let nominated = [],
                nominationComplete = false,
                electors = orders[i];

                electors.forEach(function(elector, index){

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
                    while(!nominationComplete);

                    let arrayOutput = nominations[offices[index]] + '';

                    $('#feedback').html('<p>' + arrayOutput.replace(',', ', ') + ' nominated for ' + offices[index] + '</p>');
                        
                    setTimeout(function(){  
                        resolve();
                    }, speed*2);
                });
            });
        });
    }

    //return all nominations
    chain = chain.then(function(){
        return new Promise(resolve => {
            $('#feedback').html(null);
            resolve(nominations);
        });
    });

    return chain;
}