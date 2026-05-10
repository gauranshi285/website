try{
    console.log("try block starts here");
    console.log(x);
    console.log("try block ends here")
}
catch(err) {
    console.log("I am inside catch block")
    console.log("your error is here",err);
}
finally{
    console.log("I will run everytime, as i am finally block")
}


//let crete a custom console.error
try{
    console.log(X);
 }

catch(err) {
    throw new error ("bhai pehle declare print karbana");
}
let errorcode=100;
if(errorcode ==100){
    throw new error("invalid json");
}
