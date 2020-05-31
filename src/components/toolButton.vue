<template lang="pug">
    div.button(
        v-bind:class="{ active: isActive }"
        @click="$emit('change-tool')"
        )
        slot
</template>

<script>
    export default {
        name: "toolButton",
        props: {
            tool: {
                type: String,
                default: 'SinglePixel'
            },
            selectedTool: {
                type: String,
                default: 'SinglePixel'
            }
        },
        computed: {
            isActive: function () {
                return this.tool === this.selectedTool
            }
        }
    }
</script>

<style scoped lang="stylus">
    .active
        box-shadow 0px 0px 10px 8px rgba(255,255,255,0.9)
</style>