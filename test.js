var ary = ['Hello', 'Apple', 'Portland'];
let myFunction = function(){
    for(let i = 1; i <= ary.length; i++){
        setTimeout(function(){
            console.log(ary[i - 1]);
        }, 5000 * i); 
    }
}
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
let myQuizz = ()=>{

    for(let i = 1; i <= ary.length; i++){
        setTimeout(function(){
            let myWord = ary[i - 1].trim();
            let myLetter = myWord.split("");
            for (let i = myLetter.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = myLetter[i];
                myLetter[i] = myLetter[j];
                myLetter[j] = temp;
            }
            console.log(myLetter);
            //let myShuffle = shuffleArray(myLetter);
            //console.log(myShuffle)
        }, 3000 * i); 
    }
}
//myFunction();
myQuizz();