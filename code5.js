

const greet =function() {
    console.log("namaste dunia");
}
console.log(greet);


let obj = {
    age:25,
    wt:36,
    ht:180,
    greet:()=> {
        console.log("hello dunia");
    }
}
console.log(obj.age);
obj.greet();


const arr=[
    function(a,b) {
        return a+b;
    },
    function(a,b) {
        returna-b;
    },
    function(a,b) {
        return a*b;
    }
];
let first=arr[2];
let ans=first(5,10);
console.log(ans);



function solve(number){
    return function(number){
        return number*number;
    }
}


let finalAns = ans(10);
console.log(finalAns);

function greetMe(greet,fullName) {
    console.log("hello",fullName);
    greet();
}








class human{
     object1 = new human()
}
const object1 = new human();




let age=25;
console.log(age);









sayMyName("gauranshi");

function sayMyName(finalName){
    console.log(finalName);
}
