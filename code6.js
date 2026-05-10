
let marks=100;
console.log(marks);



{
    let age=100;
}
console.log(age);


{
    var height=180;
}
console.log(height);



function sayHello() {
    var name="earth";
    console.log("hello dunia",name);
}
sayHello();





//global scope
var age=15;
console.log(age);
{
    console.log(age);
}
if(true){
    console.log(age)
}
for(let i=0; i<2;i++) {
    console.log(age);
}

function sayHello() {
    console.log("hi,age");
}
sayHello();