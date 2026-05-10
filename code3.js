//function defination
function sayMyName(){
    console.log("gauranshi garwal")
}
// function use-function call
sayMyName ();

// function print counting() 

for(let i=2;i<=100;i++){
    console.log(i);
}

// printCounting();
function printNumber(num) {
    console.log("printing number:",num);
}
printNumber(5);

function getAverage(num1, num2){
    let avg = (num1+num2)/2;
    console.log("Average:",avg);
}
getAverage(3,70);

//return functions
function getSum(a,b,c){
    let sum=a+b+c;
    return sum;

}
let ans =getSum(1,2,3);
console.log("printing sum:",ans);

function getMyName(firstName,lastName) {
    let fullName = fullName +" "+ lastName;
    return fullName;
    //unreachable statements
    let a=10;
    let b=15;
    let sum=a+b;
    console.timeLog(sum);

}

let fullName= getMyName(7,7);
console.log("fullname:",fullName);
const getmultiplication=function(a,b){
    returna*b;
}

let ans= getmultiplication(2,20);
console.log(ans);

let squareNumber = function(num){
    let ans = num**2;
    return ans;
}
let ans =squareNumber(5);
console.log(ans);


let getExp = (x,y) => {
    let ans = x**y;
    return ans;
}
console.log(getExp(2,10));