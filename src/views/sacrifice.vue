<template lang="pug">
    .page
        .controll
            div.sliderContainer Posterize:
                input(type='range' value='5' min="2" max="12" v-model='posterizeVal' style='width: 150px')
            div.button(@click="startStop") ⏸
            div.button(@click="nextDownload = true") Compost 🙌 Pixel ➡︎
        .canvasWrapper
            vue-p5(@setup='setup' @draw='draw')
            .colorBars.window
                .colorBarWrapper(v-for='(item) in imageData' :key='item.color')
                    .colorBar(v-bind:style="{ background: item.color, width: item.percent + '%'}")
                    p
                        | {{item.val}}
                        span.info ({{item.percent}}%) {{item.color}}
</template>

<script>
import VueP5 from 'vue-p5';
import router from "../router"
let capture;
let pixelSoll;
    export default {
        name: "sacrifice",
        components: {VueP5},
        data: function () {
            return {
                imageData: [{ "color": "rgb(0,128,0)", "val": 259188 }],
                isRunning: true,
                posterizeVal: 5,
                nextDownload: false,
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
                this.turnWebcamOff()
                router.push({ path: 'draw' })
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
                sk.filter(sk.POSTERIZE, this.posterizeVal)
                this.getPixelArray(sk)
                if (this.nextDownload) {
                    sk.saveCanvas(`${this.name}-webcam`, 'png');
                    this.nextDownload = false
                    this.commitPixels()
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
            },
            name () {
                return this.$store.state.name
            },
        }
    }
</script>

<style scoped lang="stylus">
    .canvasWrapper>*
        box-shadow 12px 12px 24px 0 rgba(0, 0, 0, 0.2),
                -12px -12px 24px 0 rgba(255, 255, 255, 0.5)
    .colorBars
        margin-left 0
        margin-right 0
        //outline 1px solid black
        padding 1rem
        width 20vw
        height 650px
        overflow scroll
    .colorBars p
        margin-top 0.1rem
    .colorBars .info
        color lightgray
    .colorBar
        text-align left
        color white
        padding 0.1rem
        min-height 2rem
</style>