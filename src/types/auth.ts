export interface LoginForm {
    email: string;
    password: string;
}

export interface ForgotPasswordForm {
    email: string;
}

export interface ResetPasswordForm {
    password: string;
    password_confirmation: string;
}

export interface ResetPasswordPayload {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
}

export interface User {
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
}
