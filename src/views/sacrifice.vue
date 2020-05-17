<template lang="pug">
    .sacrificeWrapper
        vue-p5(@setup='setup' @draw='draw' @mousepressed="startStop")
        .colorBars
            .colorBarWrapper(v-for='(item) in imageData' :key='item.color')
                .colorBar(v-bind:style="{ background: item.color, width: item.percent + '%'}")
                    p
                        | {{item.val}}({{item.percent}}%)
                        br
                        | {{item.color}}
        div(@click="commitPixels") commit Pixel
</template>

<script>
import VueP5 from 'vue-p5';
let capture;
let pixelSoll;
    export default {
        name: "sacrifice",
        components: {VueP5},
        data: function () {
            return {
                imageData: [{ "color": "rgb(0,128,0)", "val": 259188 }],
                isRunning: true,
            }
        },
        mounted() {
            setTimeout(this.veryHackyCanvasScaler, 1000)
        },
        methods: {
            startStop: function() {
                if (this.isRunning) {
                    capture.pause()
                    this.isRunning = false
                } else {
                    capture.loop()
                    this.isRunning = true
                }
            },
            commitPixels: function () {
                this.$store.commit('updatePixels', pixelSoll)
            },
            setup: function (sk) {
                sk.createCanvas(this.width, this.height);
                sk.pixelDensity(1)
                sk.frameRate(15)
                capture = sk.createCapture(sk.VIDEO);
                capture.size(this.width, this.height);
                capture.hide();
            },
            draw: function (sk) {
                if (capture) {
                    sk.image(capture, 0, 0, sk.width, sk.height);
                }
                this.getPixelArray(sk)
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
            getPixelArray: function (sk) {
                sk.loadPixels();
                let pixeldata = []
                for (let y = 0; y < sk.height; y++) {
                    for (let x = 0; x < sk.width; x++) {
                        let index = (x + y * sk.width) * 4;
                        sk.pixels[index+0] = this.roundColor(sk.pixels[index+0])
                        sk.pixels[index+1] = this.roundColor(sk.pixels[index+1])
                        sk.pixels[index+2] = this.roundColor(sk.pixels[index+2])
                        pixeldata.push(`${sk.pixels[index]}-${sk.pixels[index + 1]}-${sk.pixels[index + 2]}`)
                    }
                }
                pixelSoll = this.sortedPixels(pixeldata)
                let entries = Object.entries(pixelSoll)
                let sorted = entries.sort((a, b) => b[1] - a[1])
                this.imageData = sorted.map(pixelVal => {
                    let color = pixelVal[0].split("-")
                    return {
                        color: `rgb(${color.join(",")})`,
                        colorVal: color,
                        val: pixelVal[1],
                        percent: Math.round(((pixelVal[1] / (this.width * this.height)) * 100) * 100) / 100
                    }
                })
            },
            sortedPixels: function (array) {
                let result = {}
                for (let i = 0; i < array.length; ++i) { // loop over array
                    if (!result[array[i]]) {  // if no key for that number yet
                        result[array[i]] = 0;  // then make one
                    }
                    ++result[array[i]];     // increment the property for that number
                }
                return result
            },
            roundColor: function (color) {
                return Math.floor(color / 10) * 10
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
    .sacrificeWrapper
        display flex
        cursor wait
    .colorBars
        margin-left 0
        margin-right 0
        outline 1px solid black
        background darkgray
        padding 1rem
        width 20vw
        height 650px
        overflow scroll
    .colorBar
        text-align left
        color white
        padding 0.1rem
</style>