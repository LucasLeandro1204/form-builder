import {onMounted, onUnmounted} from 'vue';

export function useHashChange(onHashChange: any) {
    onMounted(() => {
        window.addEventListener('hashchange', onHashChange);
    });
    onUnmounted(() => {
        window.removeEventListener('hashchange', onHashChange);
    });
}
