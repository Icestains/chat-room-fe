<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  border: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  outline: none;
  -webkit-text-size-adjust: none;
  vertical-align: baseline;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-width: 700px;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

#nav {
  padding: 30px;
  text-align: center;
  background-color: lightcyan;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

/* .container {
  padding: auto;
} */
</style>
