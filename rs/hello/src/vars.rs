// variables hold primitive data or references to data
// variables are immutable by default
// rust is a block-scoped language

pub fn run() {
    let name = "Brad";
    let mut age = 37;
    println!("My name is {0} and I am {1}", name, age);
    age = 38;
    println!("My name is {0} and I am {1}", name, age);

    // define constant
    const ID: i32 = 001;
    println!("ID: {}", ID);

    // assign multiple vars
    let (my_name, my_age) = ("Brad", 37);
    println!("{} is {}", my_name, my_age);
}