use rand::{Rng, SeedableRng};
use rand::rngs::StdRng;

fn generate_page(seed: u64, len: usize) -> String {
    let mut rng = StdRng::seed_from_u64(seed);
    let mut page = String::new();

    for _ in 0..len {
        let c: char = rng.gen();
        page.push(c);
    }

    page
}

fn search_page(page: &str, query: &str) -> bool {
    page.contains(query)
}

fn main() {
    let seed = 12345;
    let page = generate_page(seed, 100);
    let query = "hello";

    if search_page(&page, &query) {
        println!("Found '{}' in page.", query);
    } else {
        println!("'{}' not found in page.", query);
    }
}
