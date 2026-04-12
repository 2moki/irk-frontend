export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
    phone_prefix: string;
    phone_number: string;
    no_pesel: boolean;
    pesel: string | null;
    document_number: string | null;
    date_of_birth: string | null;
    gender: string;
    password: string;
    password_confirmation: string;
    country_id: number | null;
    voivodeship_id: number | null;
    state: string | null;
    post_code: string;
    city: string;
    street: string;
    house_number: string;
    apartment_number: string | null;
    post_office: string;
    different_mailing_address: boolean;
    m_country_id: number | null;
    m_voivodeship_id: number | null;
    m_state: string | null;
    m_post_code: string | null;
    m_city: string | null;
    m_street: string | null;
    m_house_number: string | null;
    m_apartment_number: string | null;
    m_post_office: string | null;
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
