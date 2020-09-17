//object that contains the logic of the game
let logic={
    boardSize:10,
    ships:[
            {name: "battleship", length: 5, location:["00","01","02","03","04"], hits:["","","","",""]},
            {name: "destroyer1", length: 3, location:["10","20","30"], hits:["","",""]},
            {name: "destroyer2", length: 3, location:["22","32","42"], hits:["","",""]}
    ],
    numShips: 3,
    shipsSunk:0,

    generateShip: function(shipLen){
        let orientation = Math.floor(Math.random() * 2);
        let row, col;
        let newLocation=[];
        let shipLength=shipLen;
       
        if(orientation===0){
            //start row location of vertical ship
            row=Math.floor(Math.random() * (this.boardSize-shipLength));
            //start col location of vertical ship
            col=Math.floor(Math.random() * this.boardSize);
        } else {
            //start row location of horizontal ship
            row=Math.floor(Math.random() * this.boardSize);
            //start col location of horizontal ship
            col=Math.floor(Math.random() * (this.boardSize-shipLength));
        }
        
        for(let i=0; i<shipLength; i++){
            if(orientation===0){
                newLocation.push((row+i) + "" + col);
            } else {
                newLocation.push(row + "" + (col+i));
            }
        }
        return newLocation;       
    },
    overlaps: function(location){
        for(let i=0; i<this.numShips;i++){
            let ship=this.ships[i];
            for(let j=0; j<location.length;j++){
                //if we have location index 0 or greater, we have overlap
                if(ship.location.indexOf(location[j])>=0){
                    return true;
                }
            }
        }
        return false;
    },
    generateRandomShipLocation:function(){
        let locations;
        // generate locations for each ship
        for(let i=0; i<this.numShips ;i++){
           do{
                locations=this.generateShip(this.ships[i].length);
            } while(this.overlaps(locations));
            this.ships[i].location=locations;
        }
    },
    playerMove: function(move){
        for(let i=0; i<this.numShips; i++){
            //passing through all ships, take the location index which is equal to the user's value
            let ship=this.ships[i];
            let index=ship.location.indexOf(move);
            if(ship.hits[index]==="hit"){
                display.displayMsg("You already hit this location!");
                return true;
            }
            //if index value is 0 or bigger => we have hit
            if(index>=0){
                ship.hits[index]="hit";
                display.displayHit(move);
                display.displayMsg("Ship was hit!");
                //check if the ship is sunk
                if(this.isSunk(ship)){
                    display.displayMsg("Ship was sunk!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        display.displayMiss(move);
        display.displayMsg("You miss!");
        return false;
    },
    isSunk: function(ship){
            for(let i=0; i<ship.length; i++){
                if(ship.hits[i]!=="hit"){
                    return false;
                }
            }   
        
        return true; 
    } 
};

let controller={
    moves:0,
    sentMoves: function(move){
        let location = convertMove(move);
        //if player entered a valid move, we increase the move and 
        if(location){
            this.moves++;
            let hit=logic.playerMove(location); //return true if we have hit
             //if we have hit and the sunk number is equal to the number of ships => you win
            if(hit && logic.shipsSunk===logic.numShips){
                display.displayMsg("Well done! You completed the game in " + this.moves + "shots");
            }
        }
    }
};

// object that contains methods for displying messages, hits and miss
let display={
    displayMsg:function(msg){
        let msgInput= document.getElementById("msg");
        msgInput.innerHTML = msg;
    },
    displayHit: function(location){
        let cell=document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss:function(location){
        let cell=document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
}

//handle the button send was clicked
function handleSendMove(){
    //take the user move value and convert it 
    let userInput=document.getElementById("playerMove");
    let move=userInput.value;
    controller.sentMoves(move);
    //reset the input value after we take it
    userInput.value="";
}

//handle whan enter is pressed
function handleKeyPress(event){
    let sendMoveButton=document.getElementById("sendMove");
    if(event.keyCode===13){
        sendMoveButton.click();
        return false; //return false to the form because i don't want it to be submited
    }
}

//TODO
function showShips(){
    for(let i=0; i<logic.ships.length; i++){
        console.log("Ship #" + parseInt(i+1) + ", name " + logic.ships[i].name + ", length: " + logic.ships[i].length);
        console.log("Coordinates:" + logic.ships[i].location);
    }
}

//funcion that convert the user move to number and check if his/her choice is correct
function convertMove(move){
    let alphabet=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    if(move===null || move.length!==2){
        display.displayMsg("Please enter a letter and a number on the board!");
    } else {
        //take the index of the letter and the second number so we have 2 numbers
        let moveFirstLetter = move.charAt(0);
        let row = alphabet.indexOf(moveFirstLetter);
        let col=move.charAt(1);
        //if row and col ar numbers and in the board return their value
        if(isNaN(row) || isNaN(col)){
            display.displayMsg("Please enter a letter and a number on the board!");
        } else if(row<0 || row>=logic.boardSize || col<0 || col>=logic.boardSize){
            display.displayMsg("Your move is out of the board!");
        } else {
            return row + col;
        }
    }
}

function init(){
    let sendButton=document.getElementById("sendMove");
    sendButton.onclick=handleSendMove;
    let userInput=document.getElementById("playerMove");
    userInput.onkeypress=handleKeyPress;
    logic.generateRandomShipLocation();
    let hintButton=document.getElementById("hint");
    hintButton.onclick=showShips;
}
window.onload=init;


