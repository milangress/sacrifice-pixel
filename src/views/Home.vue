<template lang="pug">
  .home
    vue-p5(@setup='imgSetup' @draw='imgDraw')
    .colorBars
      #uploadHolder
      hr
      p Posterize:
        input(type='number' value='3' v-model='posterizeVal' style='width: 35px')
      hr
      .squareButton(@click='didComputePixel = false') ↺ Update Pixels
      hr
      .colorBarWrapper(v-for='(item) in imageDataSoll' :key='item.color')
        .colorBar(@click='currentBrushColor = item.colorVal' v-bind:style="{ background: item.color, width: item.percent + '%'}")
          p
            | {{item.val}}({{item.percent}}%)
            br
            | {{item.color}}
    .paintControllBar
      .squareButton(v-bind:style="{background: 'rgb(' + this.currentBrushColor.join() + ')'}") Color
      .squareButton(v-on:click='setToRandomNewColor()' v-bind:style="{background: 'rgb(' + this.currentBrushColor.join() + ')'}") random color
      hr
      .squareButton(@click='currentBrushColor = [255,255,255]') 😤 Eraser
      hr
      .squareButton(@click="currentTool = 'Brush'") ◉ Brush
      input(type='range' v-model='strokeWidth')
      br
      hr
      .squareButton(@click="currentTool = 'SinglePixel'") ▪︎ Pixel
      hr
      .squareButton(@click="currentTool = 'PixelBrush'") ◼︎ Square
      input(type='range' value='3' v-model='pixelBrushSize' style='width: 100%')
      hr
      .squareButton(@click="currentTool = 'PixelFill'") ◼︎ FILL
      input(type='range' value='8' max="60" v-model='pixelFillSize' style='width: 100%')
      hr
      p Tool: {{currentTool}}
      hr
      .squareButton(@click='nextCleanupPixel = true') 🧙‍♂️✨🔮 Cleanup
    vue-p5(@setup='setup' @draw='draw' @keypressed='keypressed' @mousedragged='mousedragged' @mousereleased='mouseReleased')
    .colorBars
      .colorBarWrapper(v-for='(item) in imageData' :key='item.color')
        .colorBar(@click='currentBrushColor = item.colorVal' v-bind:style="{ background: item.color, width: item.percent + '%'}")
          p
            | {{item.val}}({{item.percent}}%)
            br
            | {{item.color}}
        // {{ val[0].split(";") }}
    img#defaultimg(src='../assets/IMG_7814.jpeg' style='display: none')
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import VueP5 from 'vue-p5'

let input;
let img;
let pixelSoll = {}
let pixelIst = {}
let pixelCounter = {}
let capture;

export default {
  name: 'Home',
  components: {VueP5},
  data: function() {
    return {
        imageData: [{ "color": "rgb(0,128,0)", "val": 259188 }],
        imageDataSoll: [{ "color": "rgb(0,128,0)", "val": 259188 }],
        width: 200,
        height: 325,
        strokeWidth: 4,
        posterizeVal: 3,
        nextComputePixel: true,
        currentBrushColor: [0,120,0],
        currentTool: 'Brush',
        pixelBrushSize: 3,
        pixelFillSize: 8,
        didComputePixel: false,
        nextCleanupPixel: false,
        autoCleanupPixel: false
      }
    },
  mounted() {
    setInterval(this.update, 250);
    this.setToRandomNewColor();
    setTimeout(this.veryHackyCanvasScaler, 1000)
  },
  methods: {
    imgSetup: function (sk) {
      function handleFile(file) {
        sk.print(file);
        if (file.type === 'image') {
          img = sk.createImg(file.data, '');
          img.hide();
          sk.image(img, 0, 0, sk.width, sk.height);
        } else {
          img = null;
        }
      }
      sk.createCanvas(this.width, this.height);
      sk.pixelDensity(1)
      input = sk.createFileInput(handleFile);
      input.parent('uploadHolder')
      img = sk.createImg('https://i.imgur.com/JL0k7sL.jpg', 'anonymous', '');
      img.hide();
      capture = sk.createCapture(sk.VIDEO);
      capture.size(this.width, this.height);
      capture.hide();
    },
    imgDraw: function (sk) {
      //sk.background(255);
      if (img) {
        sk.image(img, 0, 0, sk.width, sk.height);
      }
      if (capture) {
          sk.image(capture, 0, 0, sk.width, sk.height);
      }
        sk.filter(sk.POSTERIZE, this.posterizeVal)
        if (!this.didComputePixel) {
            this.getPixelArray(sk)
            this.didComputePixel = true;
        }
    },
    update: function () {
      this.nextComputePixel = true
    },
    veryHackyCanvasScaler: function () {
      const theP5Canvases = document.getElementsByClassName("p5Canvas")
      for (let canvas of theP5Canvases) {
        canvas.style.width = this.width * 2 + "px"
        canvas.style.height = this.height * 2 + "px"
      }
    },
    setup(sk) {
      sk.createCanvas(this.width, this.height);
      sk.pixelDensity(1)
      sk.background(255,255,255)
      //sk.text('Hello p5!', 20, 20)
      sk.strokeWeight(4)
    },
    draw(sk) {
      sk.stroke(...this.currentBrushColor)
      sk.strokeWeight(this.strokeWidth)
      if (this.nextComputePixel) {
        this.roundPixels(sk)
        this.computePixels(sk)
        this.nextComputePixel = false
      }
      if (this.nextCleanupPixel) {
        this.killOverflowingPixels(sk)
        this.nextCleanupPixel = false
      }
      //sk.updatePixels();
    },
    mousedragged(sk) {
      switch (this.currentTool) {
        case "Brush":
          sk.line(sk.pmouseX, sk.pmouseY, sk.mouseX, sk.mouseY)
          break;
        case "SinglePixel":
          sk.set(sk.mouseX, sk.mouseY, [...this.currentBrushColor, 255])
          sk.updatePixels()
          break;
        case "TwoByTwoPixel":
          sk.set(sk.mouseX, sk.mouseY, [...this.currentBrushColor, 255])
          sk.set(sk.mouseX, sk.mouseY + 1, [...this.currentBrushColor, 255])
          sk.set(sk.mouseX + 1, sk.mouseY, [...this.currentBrushColor, 255])
          sk.set(sk.mouseX + 1, sk.mouseY + 1, [...this.currentBrushColor, 255])
          sk.updatePixels()
          break;
        case "PixelBrush":
          for (let i = 0; i < this.pixelBrushSize; i++) {
            for (let j = 0; j < this.pixelBrushSize; j++) {
              sk.set(sk.mouseX + i, sk.mouseY + j, [...this.currentBrushColor, 255])
            }
          }
          sk.updatePixels()
          break;
        case "PixelFill":
          for (let i = 0; i < this.pixelFillSize; i++) {
            for (let j = 0; j < this.pixelFillSize; j++) {
              const color = sk.get(sk.mouseX + i, sk.mouseY + j)
              console.log(color)
              if (color[0] >= 250 && color[1] >= 250 && color[2] >= 250) {
                sk.set(sk.mouseX + i, sk.mouseY + j, [...this.currentBrushColor, 255])
              }
            }
          }
          sk.updatePixels()
          break;

      }
    },
    keypressed(sk) {
      sk.filter(sk.POSTERIZE, this.posterizeVal)
    },
    mouseReleased(sk) {
      console.log('mouse')
      this.roundPixels(sk)
    },
    setToRandomNewColor() {
      console.log('newcolor')
      this.currentBrushColor = [255, 255, 255].map(max => Math.floor(Math.random() * max)).map(this.roundColor)
    },
    roundColor(color){
      //return Math.ceil(color / 5) * 5;
      return Math.floor(color / 10) * 10
    },
    computePixels(sk) {
      sk.loadPixels();
      let pixeldata = []
      for (var y = 0; y < sk.height; y++) {
        for (var x = 0; x < sk.width; x++) {
          var index = (x + y * sk.width) * 4;
          sk.pixels[index+0] = this.roundColor(sk.pixels[index+0])
          sk.pixels[index+1] = this.roundColor(sk.pixels[index+1])
          sk.pixels[index+2] = this.roundColor(sk.pixels[index+2])
          // sk.pixels[index+3] = 255;
          pixeldata.push(`${sk.pixels[index + 0]}-${sk.pixels[index + 1]}-${sk.pixels[index + 2]}`)

        }
      }
      sk.updatePixels();
      //console.log(this.sortedPixels(pixeldata));

      let pixels = this.sortedPixels(pixeldata)
      pixelIst = pixels
      let entries = Object.entries(pixels)
      let sorted = entries.sort((a, b) => b[1] - a[1])
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
      this.imageDataSoll = sorted.map(pixelVal => {
        let color = pixelVal[0].split("-")
        return {
          color: `rgb(${color.join(",")})`,
          colorVal: color,
          val: pixelVal[1],
          percent: Math.round(((pixelVal[1] / (this.width * this.height)) * 100) * 100) / 100
        }
      })
      console.log(pixelSoll)
      console.log(pixelIst)
    },
    killOverflowingPixels: function (sk) {
      sk.loadPixels();
      pixelCounter = {}
      for (let y = 0; y < sk.height; y++) {
        for (let x = 0; x < sk.width; x++) {
          let index = (x + y * sk.width) * 4;
          const pixelhash = `${sk.pixels[index]}-${sk.pixels[index + 1]}-${sk.pixels[index + 2]}`
          /*console.log(pixelCounter[pixelhash])
          console.log({counter: pixelCounter[pixelhash], soll: pixelSoll[pixelhash]})
          debugger*/
          if (!pixelCounter[pixelhash]) {
            pixelCounter[pixelhash] = 0
          }
          pixelCounter[pixelhash] += 1
          let sol = pixelSoll[pixelhash]
          debugger
          if (pixelSoll[pixelhash] === undefined || pixelCounter[pixelhash] > pixelSoll[pixelhash]) {
            sk.pixels[index + 0] = 255
            sk.pixels[index + 1] = 255
            sk.pixels[index + 2] = 255
            console.log(sol)
            debugger
          }
        }
      }
      console.log({pixelCounter})
      sk.updatePixels()
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
    roundPixels: function (sk) {
      sk.loadPixels();
      for (var y = 0; y < sk.height; y++) {
        for (var x = 0; x < sk.width; x++) {
          var index = (x + y * sk.width) * 4;
          sk.pixels[index+0] = this.roundColor(sk.pixels[index+0])
          sk.pixels[index+1] = this.roundColor(sk.pixels[index+1])
          sk.pixels[index+2] = this.roundColor(sk.pixels[index+2])
          sk.pixels[index+3] = 255;
        }
      }
      sk.updatePixels();
    },
  }
}
</script>

<style>
  * {
    box-sizing: border-box;
  }
  .home {
    display: flex;
  }
  .colorBars {
    margin-left: 0;
    margin-right: 0;
    outline: 1px solid black;
    background: darkgray;
    padding: 1rem;
    width: 20vw;
    height: 650px;
    overflow: scroll;
  }
  .colorBar {
    text-align: left;
    color: white;
    padding: 0.1rem;
  }
  .paintControllBar {
    min-width: 2rem;
    margin: 0 2rem;
    outline: 1px solid black;
    height: 650px;
    padding: 1rem;
  }
  .p5Canvas {
    outline: 1px solid black;
  }
  input[type=range][orient=vertical] {
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical; /* WebKit */
    width: 8px;
    height: 175px;
    padding: 0 5px;
  }
  input[type=range] {
    width: 100%;
  }
  .squareButton {
    padding: 0.25rem;
    margin: 0.25rem;
    text-align: center;
    outline: black 1px solid;
  }
  .squareButton:hover {
    color: white;
    background: darkgray;
  }
</style>
