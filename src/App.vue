<template lang="pug">
  #app
    //#flowNav
      router-link(to="/")
        | (
        span.serif 1
        | ) &nbsp;
      router-link(to="/sacrifice")
        | (
        span.serif 2
        | ) &nbsp;
      router-link(to="/draw")
        | (
        span.serif 3
        | ) &nbsp;
      router-link(to="/image")
        | (
        span.serif 4
        | ) &nbsp;
    //.fixedBackground
      h1 Sacrifice Pixel (2020)
      p Every 👏 Pixel 👏 is 👏 Sacred! Here comes a text about how in the physical world sacrificing and especially composting are essential… tun on webcam… etc…
      router-link(to="/sacrifice") GO composte Your Face
    //#nav
      router-link(to="/") Start
      router-link(to="/v1") (Old Version)
      router-link(to="/manual") Manual
      router-link(to="/changelog") Changes
    transition(name="slide" mode="out-in")
      router-view
    hr
    #nav
      router-link(to="/v1").button (Old Version)
      router-link(to="/manual").button Manual
      router-link(to="/changelog").button Changes
</template>

<style lang="stylus">
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

  body
      background rgb(150, 150, 150)

  *
      box-sizing border-box

  .p5Canvas
      cursor crosshair
      box-shadow 12px 12px 24px 0 rgba(0, 0, 0, 0.2),
      -12px -12px 24px 0 rgba(255, 255, 255, 0.5)

  .canvasWrapper
      margin 2rem
      font-size 1rem
      display flex
      justify-content space-evenly
      float left

  .page:after
      content: ""
      display: table
      clear: both
  #app
      font-family "ArialNarrow", ArialNarrow, Arial
      font-weight normal
      -webkit-font-smoothing antialiased
      -moz-osx-font-smoothing grayscale
      text-align left
      color #ffffff
      padding 30px
      font-size 2.5rem

  h1, h2, h3, h4
      font-size 3rem
      font-weight normal
      text-transform uppercase

  .fixedBackground
      position fixed
      z-index -50

  #nav
      padding-bottom 30px
      a
          &.router-link-exact-active
              color #ff0000

  a, a:visited
      //color #000

  #flowNav
      margin-bottom 2rem
      a
          text-decoration none
          &.router-link-exact-active
              color #ff0000

  .serif
      display inline-block
      font-family "Times New Roman"
      transform scale(1,1.4)

  .window
      border white 2px solid
      border-radius 0.5rem
      width 16rem
      background black
      box-shadow 0px 0px 14px 0 rgba(255, 255, 255, 0.8)

  .button
      cursor pointer
  .button, .sliderContainer
      display inline-block
      padding 0.2rem 2rem
      margin 0.5rem 0.3rem 0.2rem 0rem
      background black
      color white
      min-width 2rem
      //max-height 1.2em
      line-height 1.2em
      border-radius 10em
      white-space nowrap
      user-select: none
  .button a
    color white
  .button:hover
      background white
      color black

  .controll
    user-select: none

  .sliderContainer
      background darkgray

  .sliderContainer input
      vertical-align: 50%

  .slide-enter-active,
  .slide-leave-active
      transition-duration 0.3s
      transition-property transform
      transition-timing-function ease

  .slide-enter,
  .slide-leave-active
      opacity 0
      transform translateX(100%)
</style>
