<template lang="pug">
    .start
        h1 introduction text
        p some text about the project and a warning that the webcam has to be turned on
        router-link(to="/sacrifice") GO composte Your Face
</template>

<script>
    export default {
        name: "Home"
    }
</script>

<style scoped lang="stylus">

</style>