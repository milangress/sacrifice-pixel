<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Sacrifice Your Pixels</router-link> |
      <router-link to="/v1">(Old Version)</router-link> |
      <router-link to="/manual">Manual</router-link> |
      <router-link to="/changelog">Changes</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
  body {
    background: #e0e0e0;
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
  font-family: "Arial Narrow", Arial;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  padding: 30px;
}

#nav {
  padding-bottom: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
