export interface Application { 
    id: number; 
    course: string; 
    level: string; 
    faculty: string; 
    status: 'OCZEKIWANIE' | 'BRAK_OPLATY' | 'ZAKONCZONE'; 
} 
export interface Deadline { 
    id: number; 
    label: string; 
    title: string; 
    date: string; 
    progress: number; 
    color: string; 
}