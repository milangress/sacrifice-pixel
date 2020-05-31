<template lang="pug">
    .home.page.drawingWrapper
        .controll.tools
            span Tools: &nbsp;
            //.button(@click='tool.color = [255,255,255]') 😤 Eraser
            tool-button(
                tool="SinglePixel"
                v-bind:selectedTool = "tool.currentTool"
                @change-tool = "tool.currentTool = 'SinglePixel'") ▪︎ 1 Pixel
            //.button(@click="tool.currentTool = 'PixelBrush'") ◼︎ Square
            //.sliderContainer
                input(type='range' value='3' v-model='tool.pixelBrushSize' style='width: 200px')
            tool-button(
                tool="PixelFill"
                v-bind:selectedTool = "tool.currentTool"
                @change-tool = "tool.currentTool = 'PixelFill'") ◼︎ Fill Brush
            .sliderContainer
                input(type='range' value='8' max="60" v-model='tool.pixelFillSize' style='width: 200px')
            //br
            //.sliderContainer {{tool.currentTool}}
            //.button(@click='nextCleanupPixel = true') 🧙‍♂️✨🔮 Cleanup
            .button.hop(@click = 'nextDownload = true') Save 💦
            br

            color-button(v-bind:color = "tool.color") {{colorRemaining.val}} &nbsp;
                span(v-if="colorRemaining.color") {{currentColorName}} &nbsp;
                span Pixel remaining
            color-button(v-bind:color = "tool.color") ≈{{colorRemaining.percent}}%
            color-button(v-bind:color = '[255,255,255]'
                v-bind:selectedColor ="tool.color"
                @change-color='tool.color = [255,255,255]') 😤 Empty Pixel: {{emptyPixels}}
        .canvasWrapper
            vue-p5(@setup='setup'
                @draw='draw'
                @mousedragged='mousedragged'
                @mousereleased="mouseReleased")
            //.colorBars.window
                .colorBar(v-bind:style="{ background: colorRemaining.color, width: colorRemaining.percent + '%'}")
                p
                    | {{colorRemaining.val}} ({{colorRemaining.percent}}%)
                    br
                    | {{colorRemaining.color}}
                hr
                .colorBarWrapper(v-for='(item) in imageData' :key='item.color' @click='tool.color = item.colorVal')
                    .colorBar(v-bind:style="{ background: item.color, width: item.percent + '%'}")
                    p
                        | {{item.val}}
                        span.info ({{item.percent}}%) {{item.color}}
        .controll.pixelStats(v-if='imageData.length >= 1') Choose you Pixel: &nbsp;
            color-button(v-for='(item) in imageData' :key='item.color'
                @change-color='tool.color = item.colorVal'
                v-bind:color = 'item.colorVal'
                v-bind:selectedColor ="tool.color"
                ) {{item.val}} Pixel
            //color-button(v-bind:color = '[255,255,255]'
                v-bind:selectedColor ="tool.color"
                @change-color='tool.color = [255,255,255]') Empty Pixel: {{emptyPixels}}
        .controll.pixelStats(v-else) You used all your Pixel!
            br
            .button.hop(@click = 'nextDownload = true') Download
</template>

<script>
    //const namer = require('color-namer')
    import VueP5 from 'vue-p5'
    import ColorButton from "../components/colorButton"
    import toolButton from "../components/toolButton"
    export default {
        name: "draw",
        components: {ColorButton, VueP5, toolButton},
        data: function () {
            return {
                nextComputePixel: false,
                nextCleanupPixel: false,
                nextDownload: false,
                emptyPixels: 0,
                tool: {
                    color: [0,120,0],
                    currentTool: 'PixelFill',
                    pixelBrushSize: 3,
                    pixelFillSize: 18,
                },
                colorRemaining: {
                    val: 0,
                    color: '',
                    percent: 0
                },
                imageData: {}
            }
        },
        mounted() {
            setTimeout(() => {
                this.veryHackyCanvasScaler()
                this.tool.color = this.imageData[0].colorVal
            }, 1000)

        },
        methods: {
            setup(sk) {
                sk.createCanvas(this.width, this.height);
                sk.pixelDensity(1)
                sk.background(255, 255, 255)
            },
            draw(sk) {
                if (!this.nextComputePixel) {
                    this.computePixels(sk)
                    this.nextComputePixel = false
                }
                if (this.nextCleanupPixel) {
                    this.killOverflowingPixels(sk)
                    this.nextCleanupPixel = false
                }
                if (this.nextDownload) {
                    sk.saveCanvas(`${this.name}-drawing`, 'png');
                    this.nextDownload = false
                }
            },
            mouseReleased(sk) {
                this.killOverflowingPixels(sk)
            },
            mousedragged(sk) {
                const colorRGBA = [...this.tool.color, 255]
                switch (this.tool.currentTool) {
                    case "Brush":
                        sk.line(sk.pmouseX, sk.pmouseY, sk.mouseX, sk.mouseY)
                        break;
                    case "SinglePixel":
                        sk.set(sk.mouseX, sk.mouseY, colorRGBA)
                        sk.updatePixels()
                        break;
                    case "TwoByTwoPixel":
                        sk.set(sk.mouseX, sk.mouseY, colorRGBA)
                        sk.set(sk.mouseX, sk.mouseY + 1, colorRGBA)
                        sk.set(sk.mouseX + 1, sk.mouseY, colorRGBA)
                        sk.set(sk.mouseX + 1, sk.mouseY + 1, colorRGBA)
                        sk.updatePixels()
                        break;
                    case "PixelBrush":
                        for (let i = 0; i < this.tool.pixelBrushSize; i++) {
                            for (let j = 0; j < this.tool.pixelBrushSize; j++) {
                                sk.set(sk.mouseX + i - (this.tool.pixelBrushSize / 2), sk.mouseY + j - (this.tool.pixelBrushSize / 2), colorRGBA)
                            }
                        }
                        sk.updatePixels()
                        break;
                    case "PixelFill":
                        for (let i = 0; i < this.tool.pixelFillSize; i++) {
                            for (let j = 0; j < this.tool.pixelFillSize; j++) {
                                const color = sk.get(sk.mouseX + i - (this.tool.pixelFillSize / 2), sk.mouseY + j - (this.tool.pixelFillSize / 2))
                                //console.log(color)
                                if (color[0] > 250 && color[1] > 250 && color[2] > 250) {
                                    sk.set(sk.mouseX + i - (this.tool.pixelFillSize / 2), sk.mouseY + j - (this.tool.pixelFillSize / 2), colorRGBA)
                                }
                            }
                        }
                        sk.updatePixels()
                        break;

                }
            },
            computePixels(sk) {
                sk.loadPixels();
                let pixelDiff = Object.assign({}, this.sacrificedPixels)
                let emptyPixels = 0
                for (let y = 0; y < sk.height; y++) {
                    for (let x = 0; x < sk.width; x++) {
                        const index = (x + y * sk.width) * 4
                        const pixelString = `${sk.pixels[index + 0]}-${sk.pixels[index + 1]}-${sk.pixels[index + 2]}`
                        if (pixelDiff[pixelString]) {
                            pixelDiff[pixelString] = pixelDiff[pixelString] - 1
                        } else if (pixelString === '255-255-255') {
                            emptyPixels++
                        }
                        //pixeldata.push(pixelString)
                    }
                }
                this.emptyPixels = emptyPixels
                const currentColorString = this.tool.color.join("-")
                if (pixelDiff[currentColorString] <= 0 && this.imageData.length >= 1) {
                    this.tool.color = this.imageData[0].colorVal
                } else {
                    this.colorRemaining = {
                        color: `rgb(${this.tool.color.join(",")})`,
                        val: pixelDiff[currentColorString],
                        percent: Math.round(((pixelDiff[currentColorString] / (this.width * this.height)) * 100) * 100) / 100
                    }
                }
                //sk.updatePixels();
                //console.log(this.sortedPixels(pixeldata));

                //let pixels = this.sortedPixels(pixelDiff)
                //pixelIst = pixels
                let entries = Object.entries(pixelDiff)
                let sorted = entries.sort((a, b) => b[1] - a[1]).filter(col => col[1] > 0)
                let object = sorted.map(pixelVal => {
                    let color = pixelVal[0].split("-")
                    return {
                        color: `rgb(${color.join(",")})`,
                        colorVal: color,
                        val: pixelVal[1],
                        percent: Math.round(((pixelVal[1] / (this.width * this.height)) * 100) * 100) / 100
                    }
                })
                //let shortend = object.filter(color => color.percent > 0.5)
                this.imageData = object
            },
            killOverflowingPixels(sk) {
                sk.loadPixels();
                let pixelDiff = Object.assign({}, this.sacrificedPixels)
                Object.keys(pixelDiff).forEach(function(key) {
                    pixelDiff[key] = pixelDiff[key] + 1
                });
                for (let y = 0; y < sk.height; y++) {
                    for (let x = 0; x < sk.width; x++) {
                        const index = (x + y * sk.width) * 4
                        const pixelString = `${sk.pixels[index + 0]}-${sk.pixels[index + 1]}-${sk.pixels[index + 2]}`
                        if (pixelDiff[pixelString]) {
                            pixelDiff[pixelString] = pixelDiff[pixelString] - 1
                        }
                        if (pixelDiff[pixelString] <= 0) {
                            sk.pixels[index + 0] = 255
                            sk.pixels[index + 1] = 255
                            sk.pixels[index + 2] = 255
                        }
                        //pixeldata.push(pixelString)
                    }
                }
                sk.updatePixels()
            },
            veryHackyCanvasScaler: function () {
                const theP5Canvases = document.getElementsByClassName("p5Canvas")
                for (let canvas of theP5Canvases) {
                    canvas.style.width = this.width * 2 + "px"
                    canvas.style.height = this.height * 2 + "px"
                }
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
            sacrificedPixels () {
                return this.$store.state.pixels
            },
            colorNameMap () {
                return this.$store.state.colorNameMap
            },
            currentColorName () {
                return this.colorNameMap[this.tool.color.join("-")]
            }
            /*currentColorName () {
                if (this.colorRemaining.color) {
                    const name = namer(this.colorRemaining.color, {
                        pick: ['ntc'],
                        distance: 'deltaE'
                    })
                    return name.ntc[0].name
                } else {
                    return '0'
                }
            }*/
        }
    }
</script>

<style scoped lang="stylus">
    .drawingWrapper
        //display flex
    .pixelStats
        margin-top 2rem
    .colorBars
        margin-left: 0
        margin-right: 0
        padding: 1rem
        width: 20vw
        height: 650px
        overflow: scroll
    .colorBars p
        margin-top 0.1rem
    .colorBars .info
        color lightgray
    .colorBar
        text-align: left
        color: white
        padding: 0.1rem
        min-height 2rem
    .paintControllBar
        min-width 2rem
        margin 0 2rem
        height 650px
        padding 1rem
    .squareButton
        padding: 0.25rem
        margin: 0.25rem
        text-align: center
        outline: white 1px solid
    .squareButton:hover
        color: black
        background: white
    .flip-list-move
        transition: transform 1s
    .tools
        //text-align center
</style>