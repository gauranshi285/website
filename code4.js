let obj={
       name:"gauranshi",
    age:25,
    weight:85,
    height:"gft 1in",
    greet: function(){
        console.log("hello jee kaise ho app");
    }
};

for(let key in obj){
    console.log(key," ",obj[key]);
}
console.log(obj)
obj.greet();

console.log(typeof(obj))
let obj2=obj;


//creation of array
let arr=[1,2,3,4,5];
//array constructor
let brr=new Array('love',1,true);
brr.push('babbar');
brr.pop();
brr.shift();
brr.unshift('gauranshi');
brr.push(20);
brr.push(40);
brr.push(70);
console.log(brr.slice(0,1));
console.log(brr);
console.log(brr[2]);
console.log(brr);
brr.splice(1,0,'gauranshi');
console.log(brr);




arr.map((number,index)=>{
    console.log(number);
    console.log(index);
})



console.log(ansArry);

let arr=[1,2,'love','kunal',null];
let ans = arr.filter((value)=>{
    if(typeof(value)== 'number') {
        return true;

    }
    else{
        return false;
    }
});
console.log(ans);


let arr=[10,20,30,40];
let ans=arr.reduce((acc,curr) => {
    return acc+ curr;
},0);
console.log(ans);

let arr=[9,1,7,4,2,8];
arr.sort();

console.log(arr);

console.log(arr.indexOf(9));

let arr=[10,20,30];

let length=arr.length;
console.log("length:",length);
//traditional loop 

for(let index=0; index < length; index++){
    console.log(arr[index]);
}


arr.forEach((value,index) => {
    console.log("Number:",value,"Index:",index);
})


let arr=[10,20,30,40];
for(let value of arr){
    console.log(value);
}

let fullName="gauranshi";
for (let val of fullName) {
    console.log(val);

}

let arr=[10,20,30,40,50];


let getSum=(arr) =>{
    let sum=0;
    arr.forEach((value)=>{
        sum=sum+value;
    })
}
function getSum(arr) {
    let len = arr.length;
    let sum=0;
    for(let index=0; index<len; index++){
        sum=sum+arr[index];
    }
    return sum;
}
let totalSum=getSum(arr);
console.log(totalSum);

