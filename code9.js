let src={
    age:12,
    wt:68,
    ht:180
};

let dest = {};

for(let key in src) {
    let newKey = key;
    let newValue=src[key];
    dest[newkey] = newvalue;
}
src.age=90;
console.log("src:",src);
console.log("dest:",dest);

let src2 = {
    value:101,
    name="gauranshi agarwal"
}

let dest = Object.assign({},src);
src.age=90;
console.log("src:",src);
console.log("dest:",dest);


let dest={...src};
src.age=90;
console.log("src:",src);
console.log("dest:",dest);


console.log(obj)
obj.color="white";
console.log(obj)