// User interface:
// - Represents a user's profile, including personal info, contact details, and streaming platform usage
// - Platform fields indicate subscription status (true/false) for various services

export interface User{
    // User details to be put here 
    user_id: number;
    name: string;
    phone: string;
    email: string;
    age: number;
    gender: string;
    Netflix: boolean;
    AmazonPrime: boolean;
    DisneyPlus: boolean;
    ParamountPlus: boolean;
    Max: boolean;
    Hulu: boolean;
    AppleTV: boolean;
    Peacock: boolean;
    city: string;
    state: string;
    zip: number;
}