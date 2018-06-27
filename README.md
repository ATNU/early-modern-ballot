# Early Modern Ballot
Interactive animation of an early modern ballot described by James Harrington in The Commonwealth of Oceana (1656)

## Engraving key

### Characters


#### Not taking part
A - Strategus
B - Orator
C - Commissioners of the Great Seal (x3)
D - Commissioners of the Treasury (x3)
E - Acting Censor (one of D)
K - Censors (x 2)
M - Clerks or Secretaries of the House (x8)
P - Tribunes of the Horse (x2)
Q - Tribunes of the Foot (x2)
R - Judges (x12)
f - Pages (x8)
#### Taking part
S - Senators (x300)

#### Furnishings
F - Middle urn
G - 1st seat benches (2x2)
H - 2nd seat benches (2x2)
I - Chair of the censor (x2)
L - Side urn (x2)
M - Tables of the secretaries (x2)
N - Bowls (x2)
O - Short seats (x2)


## Overview
The ballot is basically divided into three parts: the first is the LOT, that decides the people who will nominate the competitors; the second is the NOMINATION; the third is the SUFFRAGE (i.e., voting) that elects the winner. The list of offices to be elected can vary. The example in the text has the following:

1. Strategus
2. Orator
3. 3rd commissioner of the Seal
4. 3rd commissioner of the Treasury
5. 1st Censor
6. 2nd Censor
        
The actual offices don't really matter for the pilot, but if we can use the example of the text it might make it easier to verify everything is working right.
          
### Lot
The Lot decides the electors. Each office needs four candidates, so the Lot needs to come up with `4n` Offices. Using the example, LOT returns 24 electors.

The two side urns give access to the centre urn. The centre urn decides the electors. So:

* The number of Gold balls at the centre is equal to `n` Electors;
* The number of Silver balls at the centre is equal to `50-n` GoldBallsCentre;
* The number of Gold balls at either side is equal to `n` GoldBallsCentre;
* The number of Silver balls at either side is equal to `n` Senators / `2-n` GoldBallsSide
            
A small lot decides the order of approach to the side urns

    2 outermost benches from the top OR
    2 outermost benches from the bottom OR
    2 innermost benches from the top OR
    2 innermost benches from the bottom

Senators approach the side urns 2 by 2, on both sides of the house.

1. If they draw a silver ball, they go back to their seat.
2. If they draw a gold ball, they go to the centre urn.
3. If at the centre urn they draw a silver ball, they return to their seat.
4. If at the centre urn they draw a gold ball, they become an ELECTOR.

This is repeated until all Senators have gone to the side urn and all Electors have been found.
          
### Nomination
The total number of electors is divided into 4, the number of candidates needed. This is the orderOfElectors. This is also ordered, so the first 6 electors found will become the first orderOfElectors, the second group of 6 will become the second orderOfElectors, etc.

Each orderOfElectors needs to nominate one candidate for each office. The electors in each order are also numbered, so the elector1 of orderOfElectors1 will nominate name for office1 (in this case that would be Strategus). The orderOfElectors1 will vote whether or not to accept the nomination. If not, elector1 proposes another name.

This will cycle first by elector[j] then by orderOfElectors[i], at the end of which each orderOfElectors will have a list of candidates, each with one candidade for each office.

### Suffrage
For each office, by orderOfElectors Eight pages visit every bench, carrying a box with two compartments (yes/no). Each senator drops a pellet in one of the compartments.

Pages return and drop pellets for yes on the right and for no on the left and the votes are counted. If majority yes, name is written down.

At the end of the voting for each office (4 rounds), the name with larger majority is elected. So, essentially, a lot decides the people who will nominate 4 candidates for each office, who then will go to a vote.

## Pseudocode.
       
This section protects against fraud, i.e., so that someone does not take a gold ball from its pocket, but doesn't really affect the rest of the algorithm.
    
    Secretary goes to A and B
    
    Secretary presents urn to A
    A takes random ball [A-Z]
    ballA marks all gold balls in centreUrn with same letter
    
    Secretary presents urn to B
    B takes random ball [A-Z]
    ballB marks all gold balls in sideUrn with same letter
    
    Secretary returns to M.
    
### Preparing the urns

    Secretary goes to centreUrn
    
    Censor[0] goes to sideUrnLeft
    Censor[1] goes to sideUrnRight
    
    officesToElect = ['Strategus', 'Orator', '3rd Commissioner of the Seal', '3rd Commissioner of the Treasury', '1st Censor', '2nd Censor']
    
    nElectors = officesToElect.length
    nGoldBallsCentre = nElectors
    
    // At the centre Urn there is nearly 50% chance of Gold ball
    nSilverBallsCentre = 50 - nGoldBallsCentre 
    
    FOR each sideUrn
        // Twice as many people will take a gold ball at the side than needed
        nGoldBallsSide = nElectors    
        // number of senators divided by urn, minus number of prizes
        nSilverBallsSide = nSenators / 2 - nGoldBallsSide 

### Lot Ceremony

    Secretary reads officesToElect   
    // i.e., perhaps text could appear next to engraving
    
    While Senators hold up hand Secretary reads Oath
    
    //Order of approaching the urns
    Secretary2 goes to A and B
    Secretary2 presents urn to A
    
    set orderOfLot['1st seat upper end',                // 2 outermost seats from the top
                    '2nd seat upper end',               // 2 innermost seats from the top
                    '1st seat lower end',               // 2 outermost seats from the bottom
                    '2nd seat lower end']               // 2 innermost seats from the bottom
    
    FOR orderOfLot                                      // After 2 iterations, all senators should have taken a turn
        A takes random ball for orderOfLot
        
        IF 1st seat
            remove other 1st seat order                     // 1st seat can only go from the top or from the bottom
            seatDrawsLot()                                  // seat goes to side urn, see function below for more detail
        ELSE if 2nd seat
            remove other 2nd seat order                     // 2nd seat can only go from the top or from the bottom
            seatDrawsLot()

### Nomination

    // Group electors by Order of Electors
    // There should always be 4 Orders of Electors, and as many electors in each order as there are Offices to elect
    
    FOR i=0 until i=3
        orderOfElectors[i] = first nOffices from electorsArray // first x electors will form the first order of electors
        remove first nOffices from the start of electorsArray // continue until there are no electors left
    
    FOR orderOfElectors                                     // Each order of electors is taken out of the house in turn
        Secretary leads group out of the house
        secretary gives them an Oath
        secretary gives them officesToElect
        secretary 2 stands guard at the door
      
    FOR officesToElect
        elector[officesToElect] suggests name               // i.e., 1st elector suggests name for first office, 2nd elector for 2nd office, etc.
        name is balloted by orderOfElectors                 // i.e., approved or disapproved randomly
        
        IF name is approved
            secretary writes name
            listOfCandidates[officesToElect][orderOfElectors] = name
        ELSE
            elector suggests another name
  
At this point there should be a matrix of 4 candidates for each of the 6 offices, total 24 candidates

### Voting
The voting method is a simple random boolean of true/false

    vote()
        senator helds up pellet
        senator drops pellet in box // random yes/no

### Suffrage

    all officials return to starting position except electors
    Urns are taken away from the House
    Each Secretary reads listOfCandidates for each orderOfElectors
    
    FOR listOfCandidates[officesToElect][orderOfElectors]   // i.e., cycle should be all candidates for first office, then all candidates to second office, and so on
        each page takes one box                               // 8 pages, 8 boxes, one for each bench. box has two compartments, white for yes, green for no
        each page calls name + 'to be' + office + 'in the' order // for ex.: 'Johnny Goodpuritan to be Strategus of the first order'
        
        IF name was nominated for more than one office and/or by more than one order
            add other nominations to the call                   // i.e., if johnny was nominated for strategus in the first order and 1st Censor in the second order
      
        page1 goes to A                                       // The first to vote are A and B, after which all senators
        vote()
        page1 goes to B
        vote()
        
        each page goes to one bench
      
        FOR each senator
            vote()
            
        pages return to centre
        
        // counting of votes
        FOR each page
            page goes to N on the right
            page drops yes pellets
            page goes to N on the left
            page drops no pellets
            
        Secretary on the right counts votes for yes
        Secretary on the left counts votes for no
        
        IF votes for yes > votes for no
            Secretary writes down name + number of majority // i.e., votes for yes - votes for no
        
After all candidates for all offices have been voted on, suffrage ends

### Result

    FOR each officesToElect
        name with bigger majority is elected
        
    seatDrawsLot()
        //Benches on the right go to sideUrnRight, Benches on the left go to sideUrnLeft
        Senators go to sideUrn L in pairs 
        Senator Draws Ball
        
        IF Gold
            senator goes to middle Urn F
            senatorDrawsMiddleUrn()
        ELSE IF Silver
            senator throws ball in bowl Y
            senator goes back to seat
        
    senatorDrawsMiddleUrn()
        senator draws ball
      
        IF silver
            throw ball in bowl b
            go back to seat
        ELSE IF Gold
            senator goes to C
            Commissioner checks ball
            Senator goes to bench d
            Senator becomes elector
            added to the end of electorsArray
