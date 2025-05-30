<template>
    <div>
        <h2>History</h2>
    </div>
</template>

<script setup>
    import { useAuthStore } from '@/stores/auth';
    import { computed, onBeforeMount } from 'vue';
    import { useRouter } from 'vue-router';

    const store = useAuthStore();
    const router = useRouter();
    const userInfo = computed(() => store.getAuthenticatedUserInfo);

    onBeforeMount(() => {
        if (!userInfo.value) {
        router.push('/guest');
    }
    })
    
</script>