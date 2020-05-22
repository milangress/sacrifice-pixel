<template lang="pug">
  #app
    #flowNav
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
    .fixedBackground
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
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
  body {
    background: rgb(150, 150, 150);
  }
  * {
    box-sizing: border-box;
  }
  .p5Canvas {
    cursor: crosshair;
    box-shadow: 12px 12px 24px 0 rgba(0, 0, 0, 0.2),
                -12px -12px 24px 0 rgba(255, 255, 255, 0.5);
  }
#app {
  font-family: "ArialNarrow", ArialNarrow, Arial;
  font-weight: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #ffffff;
  padding: 30px;
  font-size: 3rem;
}
h1, h2, h3, h4 {
  font-size: 3rem;
  font-weight: normal;
  text-transform: uppercase;
}

.fixedBackground {
  position: fixed;
  z-index: -50;
}

#nav {
  padding-bottom: 30px;
}

#nav a {
  color: #000;
}
  a:visited {
    color: #000;
  }

#nav a.router-link-exact-active {
  color: #ff0000;
}
#flowNav a {
  text-decoration: none;
}
  #flowNav a.router-link-exact-active {
    color: #ff0000;
  }

  .serif {
    display: inline-block;
    font-family: "Times New Roman";
    transform: scale(1,1.4);
  }

  .slide-enter-active,
  .slide-leave-active {
    transition-duration: 0.3s;
    transition-property: transform;
    transition-timing-function: ease;
  }

  .slide-enter,
  .slide-leave-active {
    opacity: 0;
    transform: translateX(100%);
  }
</style>
