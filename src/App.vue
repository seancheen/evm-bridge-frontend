<script setup>
import { provide, reactive } from 'vue'
import { RouterView } from 'vue-router'

const wallet = reactive({
  connected: false,
  connecting: false,
  connect: null
})
provide('wallet', wallet)
</script>

<template>
  <header>
    <nav class="navbar navbar-dark">
      <div class="container">
        <a class="navbar-brand" href="">
          <img src="./assets/logo.svg" alt="" style="height: 45px;">
        </a>
        <div class="ml-auto">
          <b-navbar-nav v-if="wallet.connect" class="header-connect">
            <b-nav-item class="connect-btn" @click="wallet.connect()">
              <span class="address" v-if="wallet.address">
                {{ wallet.address.slice(0, 6) + '...' + wallet.address.slice(-4) }}
              </span>
              <span v-else-if="wallet.connected">Connected</span>
              <span class="connect-btn" @click="wallet.connect()" v-else>
                <span v-if="wallet.connecting">Connecting</span>
                <span v-else>Connect Wallet</span>
              </span>
            </b-nav-item>
          </b-navbar-nav>
        </div>
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
          <b-link href="https://twitter.com/EosNFoundation">
            <fa icon="twitter" fab />
          </b-link>
          <b-link href="https://discord.gg/eos-network">
            <fa icon="discord" fab />
          </b-link>
          <b-link href="https://t.me/EOSNetworkFoundation">
            <fa icon="telegram" fab />
          </b-link>
          <b-link href="https://www.youtube.com/@EOSNetworkFoundation">
            <fa icon="youtube" fab />
          </b-link>
        </b-col>
      </b-row>
      <div class="text-center text-sm-start">© 2022 EOS Network Foundation all rights reserved.</div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.header-connect {
  border: 1px solid #fff;
  border-radius: 10px;
  width: 150px;
  height: 40px;
  text-align: center;
}

header {
  .navbar {
    color: #fff;
  }

  .address[data-select] {
    display: inline-block;
    position: relative;

    span {
      opacity: 0;
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      content: attr(data-select);
      pointer-events: none;
      user-select: none;
    }
  }

  :deep(a) {
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
