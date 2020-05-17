<template lang="pug">
    .sacrificeWrapper
        vue-p5(@setup='setup' @draw='draw')
        .colorBars
            .colorBarWrapper(v-for='(item) in imageData' :key='item.color')
                .colorBar(v-bind:style="{ background: item.color, width: item.percent + '%'}")
                    p
                        | {{item.val}}({{item.percent}}%)
                        br
                        | {{item.color}}
</template>

<script>
import VueP5 from 'vue-p5';
let capture;
    export default {
        name: "sacrifice",
        components: {VueP5},
        mounted() {
            setTimeout(this.veryHackyCanvasScaler, 1000)
        },
        methods: {
            setup: function (sk) {
                sk.createCanvas(this.width, this.height);
                sk.pixelDensity(1)
                capture = sk.createCapture(sk.VIDEO);
                capture.size(this.width, this.height);
                capture.hide();
            },
            draw: function (sk) {
                if (capture) {
                    sk.image(capture, 0, 0, sk.width, sk.height);
                }
            },
            turnWebcamOff: function () {
                let stream = capture.elt.srcObject
                stream.getTracks()[0].stop()
                capture.stop()
            },
            veryHackyCanvasScaler: function () {
                const theP5Canvases = document.getElementsByClassName("p5Canvas")
                for (let canvas of theP5Canvases) {
                    canvas.style.width = this.width * 2 + "px"
                    canvas.style.height = this.height * 2 + "px"
                }
            },
        },
        computed: {
            width () {
                return this.$store.state.width
            },
            height () {
                return this.$store.state.height
            }
        }
    }
</script>

<style scoped lang="stylus">
    sacrificeWrapper
        display flex
</style>