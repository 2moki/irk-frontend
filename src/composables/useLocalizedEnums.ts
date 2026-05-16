import { useI18n } from 'vue-i18n';

export const useLocalizedEnums = () => {
    const { t, te } = useI18n();

    const getLocalizedStatus = (status: string | undefined) => {
        if (!status) return '';

        const key = `enums.statuses.${status}`;
        return te(key) ? t(key) : status;
    };

    const getLocalizedMajorField = (field: 'studyLevel' | 'studyMode' | string, value: string | undefined) => {
        if (!value) return '';

        const key = `enums.${field}.${value}`;
        return te(key) ? t(key) : value;
    };

    return {
        getLocalizedStatus,
        getLocalizedMajorField,
    };
};
