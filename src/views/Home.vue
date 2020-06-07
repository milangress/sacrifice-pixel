<template lang="pug">
    .start.page
        h1 ⛓️ Sacrifice Pixel (2020)
        //a(href="https://en.wikipedia.org/wiki/Ship_of_Theseus") Ship of theseus (TODO!)
        p
            | Every 👏 Pixel 👏 is 👏 Sacred! In the physical world, death and decay can always give rise to new life. Can new life arise from a digital image if we "compost" it?
        p
            | This website is a a place where you can sacrifice an image from your webcam, let it be divided in its atoms (= pixels) and allows you to create a new image with just the same pixels.
        p
            | Remember to not lose your face when &nbsp;
            a(href="https://en.wikipedia.org/wiki/Ship_of_Theseus") Theseus
            | &nbsp; repairs his ship!
        router-link(to="/sacrifice").button.hop GO composte Your Face
</template>

<script>
    export default {
        name: "Home",
        mounted() {
            this.$store.commit('newName')
        },
    }
</script>

<style scoped lang="stylus">


</style>