



let op1 ='english ';
let op2 ='hindi';


console.log(op2.length);
let finalAns = `${op1}${op2}`;
console.log(finalAns)
let ans=op1+op2;
console.log(ans);
console.log(op1.toUpperCase());
console.log(op2.toLowerCase());

let str="gauranshi";
console.log(str.substring(2,4));

let sentence="hello\\what\\happen";
let words=sentence.split('\\');
console.log(words);

console.log(words.join(`-`));

//function defination
function sayMyName(){
    console.log("gauranshi garwal")
}
// function use-function call
//sayMyName