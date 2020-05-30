<template lang="pug">

</template>

<script>
    export default {
        name: "ColorChart",
        props: {
            color: [0,0,0]
        },
        computed: {
            contrastColor: function () {
                const grayscale = this.color[i]*0.2126 + this.color[i +1]*0.7152 + this.color[i +2]*0.0722
                return grayscale > 0.5 ? [1,1,1] : [0,0,0]
            }
        }
    }
</script>

<style scoped>

</style>