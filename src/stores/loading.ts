import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', () => {
    const isLoading = ref<boolean>(false);

    const startLoading = () => {
        isLoading.value = true;
    };

    const stopLoading = () => {
        isLoading.value = false;
    };

    const withLoading = <T extends (...params: never[]) => Promise<void>>(handler: T) => {
        return async (...params: Parameters<T>) => {
            if (isLoading.value) {
                throw new Error();
            }

            startLoading();

            try {
                await handler(...params);
            } finally {
                stopLoading();
            }
        };
    };

    return {
        isLoading,
        startLoading,
        stopLoading,
        withLoading,
    };
});
