<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="navbar">
      <div class="container">
      <a class="navbar-brand" href="">
        <img src="./assets/logo.svg" alt="" style="height: 45px;">
      </a>
      <!---
        <div class="ml-auto">
          <b-link>
            En
              <fa icon="caret-down"/>
            </b-link>
          </div>
          --->
      </div>
    </nav>
  </header>

  <RouterView class="main" />

  <footer>
    <div class="container">
      <b-row class="mb-4">
        <b-col sm="auto" class="text-center text-sm-start">
          <img class="mb-3" src="./assets/logo.svg" alt="" style="height: 45px;">
        </b-col>
        <b-col sm class="text-center text-lg-end" style="font-size: 1.5em;">
          <b-link>
            <fa icon="medium" fab />
          </b-link>
          <b-link>
            <fa icon="twitter" fab />
          </b-link>
          <b-link>
            <fa icon="discord" fab />
          </b-link>
          <b-link>
            <fa icon="telegram" fab />
          </b-link>
          <b-link>
            <fa icon="linkedin" fab />
          </b-link>
          <b-link>
            <fa icon="youtube" fab />
          </b-link>
        </b-col>
      </b-row>
      <div class="text-center text-sm-start">© 2022 EOS Network Foundation all rights reserved.</div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
header {
  .navbar {
    color: #fff;
  }

  a {
    color: inherit;
  }
}

footer {
  font-size: 14px;
  color: #fff;
  padding: 2rem 0;

  a {
    color: inherit;
    margin-left: 1em;
  }
}
</style>
