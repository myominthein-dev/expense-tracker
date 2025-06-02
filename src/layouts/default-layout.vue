<template>

    
<main class="flex flex-col min-h-screen relative ">
        <Header />

        <section class="mx-auto w-full h-full flex-grow  px-2 sm:p-0">
            <SignInForm />
            <SignUpForm/>
            <slot />
        </section>

        <Footer />
    </main>

</template>

<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';


import SignInForm from '@/components/SignInForm.vue';
import SignUpForm from '@/components/SignUpForm.vue';
</script>