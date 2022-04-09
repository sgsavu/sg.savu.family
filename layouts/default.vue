<template>
    <div>
        <div role="presentation" class="scroller">
            <Nuxt />
        </div>
        <V-Pointer />
        <V-Loader />
    </div>
</template>

<script>
export default {
    name: 'DefaultLayout',
    mounted() {
        this.clear();
        this.setViewHeight();
        window.addEventListener('resize', this.setViewHeight);
    },
    methods: {
        setViewHeight() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        },
        clear() {
            console.clear();
        }
    }
};
</script>

<style></style>
