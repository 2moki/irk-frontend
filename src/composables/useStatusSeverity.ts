export const useStatusSeverity = () => {
    const getStatusSeverity = (status: string | undefined) => {
        switch (status) {
            case 'qualified':
                return 'success';
            case 'unqualified':
                return 'danger';
            case 'reserve':
                return 'warn';
            case 'pending':
                return 'info';
            default:
                return 'secondary';
        }
    };

    return {
        getStatusSeverity,
    };
};
