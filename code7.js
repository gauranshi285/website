

function getAge() {
    return 190;
}
function utility(name,age){
    console.log(name," ",age);
}
utility();


function solve(value) {
    console.log("hello JII",value)
}


function sayName(fName = "gauranshi",lName="agarwal") {
    console.log("My Name is:",fName," ",lName);
}
sayName();



class Human{
    //properties
    age=13;//public
    #wt=80;//private
    ht=180;

    constructor(newAge, newHeight , newWeight){
        this.age=newAge;
        this.ht=newHeight;
        this.#wt=newWeight;

    }
    //behaviour
    walking() {
        console.log("i am walking",this.#wt)
    }
    running() {
        console.log("I am running")
    }
    get fetchWeight() {
        return this.#wt;
    }
    set modifyWeight(val) {
        this.#wt=val;
    }

}
let obj = new Human(50,190);
console.log(Object.#wt);
obj.walking();