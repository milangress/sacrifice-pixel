<template lang="pug">
    
</template>

<script>
    export default {
        name: "draw",
        computed: {
            width () {
                return this.$store.state.width
            },
            height () {
                return this.$store.state.height
            },
            sacrificedPixels () {
                return this.$store.state.pixels
            }
        }
    }
</script>

<style scoped lang="stylus">

</style>