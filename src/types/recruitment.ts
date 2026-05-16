export interface Timestamp {
    human: string;
    string: string;
    local: string;
    timestamp: number;
}

export interface Major {
    id: number;
    name: string;
    semesters: number;
    study_level: string;
    study_mode: string;
    degree_title: string;
    languages_limit: number;
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface AcademicYear {
    id: number;
    start_year: number;
    billing_type: string;
}

export interface Recruitment {
    id: number;
    start_date: Timestamp;
    end_date: Timestamp;
    slots: number;
    max_points: string;
    major_id: number;
    academic_year_id: number;
    cost_id: number;
    status: string;
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface ApplicationData {
    id: number;
    user_id: number;
    money_balance: string;
    required_balance: string;
    documents_delivered: boolean;
    exam_type: string;
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface RecruitmentApplication {
    id: number;
    application_id: number;
    recruitment_id: number;
    got_points: string;
    priority: number;
    is_paid: boolean;
    payment_date: Timestamp | null;
    application_status: string;
    created_at: Timestamp;
    updated_at: Timestamp;
    recruitment?: ApiRecruitment;
    application?: ApplicationData;
    major?: Major;
}

export interface ApiRecruitment extends Recruitment {
    price?: string;
    major?: Major;
    academic_year?: AcademicYear;
}

export interface SelectedMajor {
    recruitment: ApiRecruitment;
    priority: number;
}
