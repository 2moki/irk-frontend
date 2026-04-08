export interface LoginForm {
    email: string;
    password: string;
}

export interface User {
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
}
