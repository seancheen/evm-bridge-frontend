<template>
  <i aria-hidden="true" :class="classNames" @click="$emit('click')"></i>
</template>

<script>
export default {
  name: 'fa',
  props: {
    icon: {
      type: String,
      required: true
    },
    color: String,
    size: String,
    fw: Boolean,
    fas: Boolean,
    fab: Boolean,
    fal: Boolean,
    far: Boolean,
    fad: Boolean,
    fso: Boolean,
    spin: Boolean,
    link: Boolean,
    pulse: Boolean
  },
  mounted() {
    if (this.link) {
      const el = this.$el
      const link = document.createElement('a')
      link.href = 'javascript:'
      el.parentNode.insertBefore(link, el)
      link.appendChild(el)
    }
  },
  computed: {
    classNames() {
      let icon = this.icon
      let spin = this.spin
      const isBrand = ['weixin', 'weibo', 'wechat', 'qq'].includes(icon)
      if (icon === 'loading') {
        icon = 'spinner'
        spin = true
      }
      return [
        {fab: this.fab || isBrand},
        {far: this.far},
        {fas: this.fas},
        {fal: this.fal},
        {fad: isBrand ? false : this.fad},
        {far: [this.fab, this.far, this.fas, this.fal, this.fad, isBrand].every(i => !i)},
        'fa-' + icon,
        {'fa-fw': this.fw},
        {'fa-spin': spin},
        {'fa-pulse': this.pulse},
        {'fa-swap-opacity': this.fso},
        [this.size ? 'fa-' + this.size : ''],
        [this.color ? 'text-' + this.color : '']
      ]
    }
  }
}
</script>

<style scoped>

</style>
