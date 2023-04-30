mod print;
mod vars;

fn main() {
    println!("mod print::run()");
    print::run();
    println!("\n\nmod vars::run()");
    vars::run();
}
