'use strict';

import _ from 'lodash';
import $ from 'jquery';

function getGetOrdinal(n) {
    var s=['th','st','nd','rd'],
        v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
}

export default function Suffrage(nominations, senators) {

    let results = {},
        speed = 10;

    let chain = Promise.resolve();

    chain = chain.then(function(){
        $('#feedback').html('<p>Suffrage</p>');
        return new Promise(resolve => {
            setTimeout(resolve, speed*2);
        });
    });

    Object.keys(nominations).forEach(function(office){

        chain = chain.then(function(){

            return new Promise(resolve => {

                let officeResults = [];

                nominations[office].forEach(function(candidate){
                    //console.log(candidate + ' to be ' + office + ' in the ' + getGetOrdinal(index+1) + ' order.');
        
                    let pages = [];
                    let votes = {
                        name: candidate,
                        yes: 0,
                        no: 0
                    };
        
                    for(let i=0; i<8; i++){
                        pages[i] = {
                            name: candidate,
                            yes: 0,
                            no: 0
                        };
                    }
        
                    //page 1 ballots A & B
                    pages[0] = ballot(pages[0], ['A', 'B']);
        
                    //pages ballot each of the 8 benches of senators
                    let benches = _.chunk(senators, (senators.length/8));
        
                    benches.forEach(function(bench, index){
                        pages[index] = ballot(pages[index], bench);
                    });
        
                    pages.forEach(function(page){
                        votes = counting(page, votes);
                    });
        
                    //Add the votes for each candidate to the results for this office
                    officeResults.push(votes);
                });
        
                //for each office add the name of the senator who won the vote
                results[office] = _.orderBy(officeResults, 'yes', 'desc')[0].name;

                $('#feedback').html('<p>' + _.orderBy(officeResults, 'yes', 'desc')[0].name + ' nominated for ' + office + '</p>');
                        
                setTimeout(function(){  
                    resolve();
                }, speed*2);
            });
        });
    });

    chain = chain.then(function(){
        return new Promise(resolve => {
            resolve(results);
        });
    });

    return chain;
}

function ballot(page, electorate){

    //for every member of the electorate randomly vote yes or no
    electorate.forEach(function(){
        if(_.sample([true, false])){
            page.yes++;
        }
        else {
            page.no++;
        }
    });

    return page;
}

function counting(page, votes){

    //add votes from page to existing vote count
    votes.yes += page.yes;
    votes.no += page.no;

    //return new vote count
    return votes;
}