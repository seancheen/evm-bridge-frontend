<template>
  <div class="home container">
    <b-tabs class="no-fade" nav-class="nav-tabs-card">
      <b-tab title="Withdraw">
        <div class="withdraw" id="withdraw">
          <b-card>
            <b-row align-v="center">
              <b-col class="text-center text-sm-start" sm="auto" style="min-width: 4em;"><b>From</b></b-col>
              <b-col>
                <div class="mb-3">
                  <div class="row align-items-end">
                    <div class="col">
                      <label for="from">Address</label>
                      <input type="search" id="from" class="form-control" v-model="address" maxlength="42" disabled>
                    </div>
                    <div class="col col-auto">
                      <b-button class="connect-btn" variant="primary" @click="connectWallet()"
                        :disabled="wallet.connecting">
                        <span v-if="wallet.connected">Connected</span>
                        <span v-else-if="wallet.connecting">Connecting</span>
                        <span v-else>Connect Wallet</span>
                      </b-button>
                    </div>
                  </div>
                </div>

                <div class="row align-items-center">
                  <div class="col">
                    <label for="amount">Amount</label>
                    <input type="number" id="amount" class="form-control" min="0" :max="balance"
                           :disabled="!wallet.connected"
                      v-model="amount">
                    <div class="form-text">
                      My balance: <span id="balance" v-if="balance">{{ balance }}</span>
                    </div>
                    <div class="text-danger" v-if="exceeded">You don't have enough balance</div>
                  </div>
                  <div class="col-auto">
                    <img src="../assets/eos.png" alt="EOS" style="height: 38px;" draggable="false">
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-card>

          <div class="text-center text-white py-3">
            <fa icon="arrow-down" size="2x" />
          </div>

          <b-card>
            <b-row align-v="center">
              <b-col class="text-center text-sm-start" sm="auto" style="min-width: 4em;">
                <b>To</b>
              </b-col>
              <b-col>
                <div class="mb-3">
                  <label for="address">Destination Account</label>
                  <div class="form-text mb-2">Please paste the EOS Address below</div>
                  <input type="text" id="address" class="form-control select" @change="calcFee" v-model="targetAddress"
                    maxlength="13" list="addresses">
                  <datalist id="addresses">
                    <option value="coinbase.it"></option>
                    <option value="binancecleos"></option>
                  </datalist>
                  <div class="form-text font-monospace" v-if="addressEvm">
                    <span v-if="addressEvm.message">{{ addressEvm.message }}</span>
                    <span v-else>{{ addressEvm }}</span>
                  </div>
                </div>
                <div>
                  <label class="mb-1" for="memo" id="memoTooltip">
                    Memo (optional)
                    <span class="text-success">
                      <fa icon="info-circle" />
                    </span>
                  </label>
                  <b-popover target="memoTooltip" triggers="hover focus">
                    Please confirm if the receiving address requires a MEMO / Tag.
                    If it is not filled or filled incorrectly, the asset will be lost.
                  </b-popover>
                  <input type="text" id="memo" class="form-control" v-model="memo">
                </div>
              </b-col>
            </b-row>
          </b-card>

          <div class="d-grid mt-4">
            <b-button variant="primary" @click="transfer" class="transfer-btn"
              :disabled="!addressEvm || submitting || finished || exceeded || !transferValue">
              <span v-if="submitting">Transfer ongoing...</span>
              <span v-else-if="finished">Success!</span>
              <span v-else>Transfer</span>
            </b-button>
          </div>

          <div class="mt-2 text-center small" v-if="transferFee">
            Gas Fee: ~{{ transferFee }}ETH
            <br>
            Time to transfer: ~5 minutes
          </div>

          <div class="transaction-hash" v-if="transactionHash">
            Last transaction: {{ transactionHash }}
          </div>
          <div class="error" v-if="transactionError">{{ transactionError }}</div>
        </div>
      </b-tab>
      <b-tab title="Deposit">
        <b-card>
          <b-row align-v="center">
            <b-col class="text-center text-sm-start" sm="auto" style="min-width: 4em;">
              <b>From</b>
            </b-col>
            <div class="col">
              Please use a wallet that supports the EOS network, such as Anchor, Wombat, Tokenpocket or a centralized
              exchange such as Binance, Coinbase, etc.
              <br>
              To transfer funds to the following EOS contract address, please fill in the EVM destination address in the
              Memo to complete the deposit to EVM.
            </div>
          </b-row>
        </b-card>
        <div class="text-center text-white mt-3">
          <fa icon="arrow-down" size="2x" />
        </div>
        <b-card class="mt-3">
          <b-row align-v="center">
            <b-col class="text-center text-sm-start" sm="auto" style="min-width: 4em;">
              <b>To</b>
            </b-col>
            <div class="col">
              <div class="mb-3">
                <label>Destination Account</label>
                <div class="form-text">Please copy the EOS Address below</div>
                <div class="row align-items-end">
                  <div class="col">
                    <div class="input-group">
                      <input type="search" class="form-control" disabled value="eosio.evm" id="addr">
                      <button class="btn btn-secondary" @click="copyText('eosio.evm')">Copy</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label>Transfer Memo / Memo / Tag</label>
                <div class="input-group">
                  <input type="text" class="form-control" disabled :value="address" id="memo">
                  <button class="btn btn-secondary" :disabled="!address" @click="copyText(address)">Copy
                  </button>
                </div>
                <div class="mt-2" v-if="!address">
                  Please
                  <b-link @click="connectWallet" :disabled="wallet.connecting">
                    <fa icon="spinner" spin v-if="wallet.connecting" />
                    connect wallet
                  </b-link>
                  first
                </div>
              </div>
            </div>
          </b-row>
        </b-card>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Web3 from 'web3'
import BN from 'bn.js'
import clipboardCopy from '../utils/copy-text'

export default {
  name: 'home',
  inject: ['wallet'],
  data() {
    return {
      address: '',
      balance: '',
      memo: '',
      amount: '',
      targetAddress: '',
      gas: '',
      gasPrice: '',
      transactionHash: '',
      tab: '',
      submitting: false,
      finished: false,
      transactionError: ''
    }
  },
  created() {
    this.wallet.connect = this.connectWallet

    this.web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider('http://localhost:8545'))

    this.web3.eth.getAccounts().then(results => {
      if (results && results.length) {
        this.address = results[0]
        this.getBalance()
      }
    })
  },
  watch: {
    amount(val) {
      if (val < 0) {
        this.amount = 0
      }
    }
  },
  computed: {
    addressEvm() {
      if (!this.targetAddress) {
        return ''
      }
      return this.convertAddress(this.targetAddress)
    },
    transferValue() {
      if (!this.amount) {
        return null
      }
      try {
        return this.web3.utils.toBN(this.web3.utils.toWei(this.amount.toString(), 'ether'))
      } catch (err) {
        return null
      }
    },
    transferFee() {
      if (this.gas && this.gasPrice) {
        return this.web3.utils.fromWei(this.gasPrice) * this.gas
      }
      return 0
    },
    exceeded() {
      return this.amount > this.balance
    }
  },
  methods: {
    async calcFee() {
      if (!this.addressEvm) {
        return
      }
      this.gasPrice = await this.web3.eth.getGasPrice()
      this.gas = await this.web3.eth.estimateGas({
        from: this.address,
        to: this.addressEvm,
        value: this.transferValue,
        gasPrice: this.gasPrice,
        data: this.bytesToHex(this.stringToUTF8Bytes(this.memo)),
      })
    },
    async connectWallet() {
      try {
        this.wallet.connecting = true
        let results = await this.web3.eth.getAccounts()
        if (!results.length) {
          results = await this.web3.eth.requestAccounts()
        }
        this.address = results[0]
        this.wallet.address = this.address
        this.getBalance()
      } finally {
        this.wallet.connecting = false
      }
    },
    async getBalance() {
      try {
        const address = this.address
        this.wallet.connecting = true
        this.wallet.connected = false
        const wei = await this.web3.eth.getBalance(address)
        this.balance = this.web3.utils.fromWei(wei, 'ether')
        this.wallet.connected = true
      } finally {
        this.wallet.connecting = false
      }
    },

    stringToUTF8Bytes(string) {
      return new TextEncoder().encode(string);
    },

    bytesToHex(bytes) {
      return "0x" + Array.from(
        bytes,
        byte => byte.toString(16).padStart(2, "0")
      ).join("");
    },

    async transfer() {
      try {
        this.submitting = true
        this.transactionHash = ''
        if (!window.confirm(`You are going to transfer ${this.amount} EOS to ${this.targetAddress}`)) {
          return
        }
        this.gas = await this.web3.eth.estimateGas({
          from: this.address,
          to: this.addressEvm,
          value: this.transferValue,
          gasPrice: this.gasPrice,
          data: this.bytesToHex(this.stringToUTF8Bytes(this.memo)),
        });
        const result = await this.web3.eth.sendTransaction({
          from: this.address,
          to: this.addressEvm,
          value: this.transferValue,
          gas: this.gas,
          data: this.bytesToHex(this.stringToUTF8Bytes(this.memo)),
        })
        this.transactionHash = result.transactionHash
        this.getBalance()
        this.targetAddress = ''
        this.amount = ''
        this.gas = ''
        this.finished = true
        setTimeout(() => {
          this.finished = false
        }, 2000)
      } catch (err) {
        console.error(err)
        this.transactionError = err.message
      } finally {
        this.submitting = false
      }
    },
    convertAddress(source) {
      try {
        return uint64ToAddr(strToUint64(source))
      } catch (err) {
        return err
      }

      function charToSymbol(c) {
        const a = 'a'.charCodeAt(0)
        const z = 'z'.charCodeAt(0)
        const one = '1'.charCodeAt(0)
        const five = '5'.charCodeAt(0)
        const charCode = c.charCodeAt(0)
        if (charCode >= a && charCode <= z) {
          return charCode - a + 6
        }
        if (charCode >= one && charCode <= five) {
          return charCode - one + 1
        }
        if (c === '.') {
          return 0
        }
        throw new Error('Address include illegal character')
      }

      function strToUint64(str) {
        var n = new BN()
        var i = str.length
        if (i >= 13) {
          // Only the first 12 characters can be full-range ([.1-5a-z]).
          i = 12

          // The 13th character must be in the range [.1-5a-j] because it needs to be encoded
          // using only four bits (64_bits - 5_bits_per_char * 12_chars).
          n = new BN(charToSymbol(str[12]))
          if (n >= 16) {
            throw new Error('Invalid 13th character')
          }
        }
        // Encode full-range characters.

        while (--i >= 0) {
          n = n.or(new BN(charToSymbol(str[i])).shln((64 - 5 * (i + 1))))
        }
        return n.toString(16, 16)
      }

      function uint64ToAddr(str) {
        return '0xbbbbbbbbbbbbbbbbbbbbbbbb' + str
      }
    },
    copyText(val) {
      return clipboardCopy(val).then(() => {
        this.$alert.success('Address copied')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.transfer-btn {
  margin: auto;
  width: 170px;
  border-radius: 5px;
  opacity: 1;

  background: linear-gradient(270deg, #1E94E6 0%, #75C7FF 100%);

  box-shadow: inset 0px -1px 2px 0px rgba(0, 0, 0, 0.3);
}

.connect-btn {
  width: 142px;
  margin-left: -12px;
}

@media (max-width: 400px) {
  .transfer-btn {
    width: 340px;
  }
}

.home {
  max-width: 640px;
}

.card {
  border-color: transparent;

  &:first-child {
    border-top-left-radius: 0;
  }
}
</style>

<style lang="scss">
.popover {
  background-color: #4F5561 !important;
  color: #fff !important;
  --bs-popover-body-color: #fff !important;
  width: 450px;

}

.nav-tabs-card.nav-tabs {
  border-width: 0;

  .nav-link {
    background-color: #999;
    color: #fff;
    border-width: 0;
    padding-left: 2em;
    padding-right: 2em;
  }
}

.tabs.no-fade {
  .fade {
    transition: none;
  }
}
</style>
