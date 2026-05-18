export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface PaginationEvent {
    page: number;
    first: number;
    rows: number;
}

export interface PaginationState {
    page: number;
    rows: number;
}
