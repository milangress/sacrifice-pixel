<template lang="pug">
    div.button(
        v-bind:style="{ background: colorString, color: contrastColor}"
        v-bind:class="{ active: isActive, hop: isSelectable }"
        @click="$emit('change-color')"
        )
        slot
</template>

<script>
    export default {
        name: "colorButton",
        props: {
            color: {
                type: Array,
                default: function () {
                    return [1, 1, 250]
                }
            },
            selectedColor: {
                type: Array,
                default: function () {
                    return [300, 300, 300]
                }
            }
        },
        computed: {
            contrastColor: function () {
                const grayscale = this.color[0]*0.2126 + this.color[1]*0.7152 + this.color[2]*0.0722
                return grayscale > 150 ? 'rgb(0,0,0)' : 'rgb(250,250,250)'
            },
            colorString: function () {
                return `rgb(${this.color.join(',')})`
            },
            isActive: function () {
                return this.color.join() === this.selectedColor.join()
            },
            isSelectable: function () {
                return this.selectedColor.join() !== '300,300,300'
            }
        }
    }
</script>

<style scoped lang="stylus">
    .active
        box-shadow 0px 0px 10px 8px rgba(255,255,255,0.9)
    .active:after {
        content: '';
        top: -10px;
        width: 30px;
        height: 30px;
        position: absolute;
        background: url('https://media.giphy.com/media/3ohhwBfx3ik9jIVTOM/giphy.gif') no-repeat center center;
        background-size: contain;
    }
</style>