mod print;
mod vars;
mod types;

fn main() {
    println!("mod print::run()");
    print::run();
    println!("\n\nmod vars::run()");
    vars::run();
    println!("\n\nmod types::run()");
    types::run();
}
