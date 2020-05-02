<template>
  <div class="home">
    <vue-p5 @setup="imgSetup"
            @draw="imgDraw"></vue-p5>
    <div class="paintControllBar">
      <div id="uploadHolder"></div>
      <hr>
      <div @click="didComputePixel = false" class="squareButton">⬅︎ Get Pixels</div>
      <hr>
      <div v-on:click="setToRandomNewColor()"
           v-bind:style="{background: 'rgb(' + this.currentBrushColor.join() + ')'}"
           class="squareButton">new color</div>
      <input type="range"  v-model="strokeWidth"/> <br>
      <hr>
      <input type="number" value="3" v-model="posterizeVal">
      <!--<input type="color" value="#ff0000">-->
    </div>
    <vue-p5 @setup="setup"
            @draw="draw"
            @keypressed="keypressed"
            @mousedragged="mousedragged"
            @mouseReleased="mouseReleased"></vue-p5>
    <div class="colorBars">
      <div v-for="(item) in imageData" :key="item.color" class="colorBarWrapper">
        <div v-bind:style="{ background: item.color, width: item.percent + '%'}" class="colorBar">
          <p>{{item.val}}({{item.percent}}%)<br>{{item.color}}</p>
        </div>
        <!--{{ val[0].split(";") }}-->
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import VueP5 from 'vue-p5'

let input;
let img;

export default {
  name: 'Home',
  components: {VueP5},
  data: function() {
    return {
        imageData: [{ "color": "rgb(0,128,0)", "val": 259188 }],
        width: 200,
        height: 325,
        strokeWidth: 4,
        posterizeVal: 3,
        nextComputePixel: true,
        currentBrushColor: [0,120,0],
        didComputePixel: false
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
        } else {
          img = null;
        }
      }
      input = sk.createFileInput(handleFile);
      input.parent('uploadHolder')
    },
    imgDraw: function (sk) {
      sk.background(255);
      if (img) {
        sk.image(img, 0, 0, sk.width, sk.height);
        if (!this.didComputePixel) {
          this.getPixelArray(sk)
          this.didComputePixel = true;
        }
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
        this.computePixels(sk)
        this.nextComputePixel = false
      }
      //sk.updatePixels();
    },
    mousedragged(sk) {
      sk.line(sk.pmouseX, sk.pmouseY, sk.mouseX, sk.mouseY)
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
          pixeldata.push(`${sk.pixels[index + 0]};${sk.pixels[index + 1]};${sk.pixels[index + 2]}`)

        }
      }
      sk.updatePixels();
      //console.log(this.sortedPixels(pixeldata));

      let pixels = this.sortedPixels(pixeldata)
      let entries = Object.entries(pixels)
      let sorted = entries.sort((a, b) => b[1] - a[1])
      let object = sorted.map(pixelVal => {
        let color = pixelVal[0].split(";")
        return {
          color: `rgb(${color.join(",")})`,
          val: pixelVal[1],
          percent: Math.round(((pixelVal[1] / (this.width * this.height)) * 100) * 100) / 100
        }
      })
      let shortend = object.filter(color => color.percent > 0.5)
      this.imageData = shortend
    },
    getPixelArray: function (sk) {
      sk.loadPixels();
      let pixeldata = []
      for (let y = 0; y < sk.height; y++) {
        for (let x = 0; x < sk.width; x++) {
          let index = (x + y * sk.width) * 4;
          pixeldata.push(`${sk.pixels[index]};${sk.pixels[index + 1]};${sk.pixels[index + 2]}`)
        }
      }
      const pixels = this.sortedPixels(pixeldata)
      console.log(pixels)
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
      const round = function (x) {
        return Math.ceil(x / 5) * 5;
      }
      sk.loadPixels();
      for (var y = 0; y < sk.height; y++) {
        for (var x = 0; x < sk.width; x++) {
          var index = (x + y * sk.width) * 4;
          sk.pixels[index+0] = round(sk.pixels[index+0])
          sk.pixels[index+1] = round(sk.pixels[index+1])
          sk.pixels[index+2] = round(sk.pixels[index+2])
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
    margin: 0 2rem;
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
    padding: 0.2rem;
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
  input[type=range][orient=vertical]
  {
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical; /* WebKit */
    width: 8px;
    height: 175px;
    padding: 0 5px;
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
