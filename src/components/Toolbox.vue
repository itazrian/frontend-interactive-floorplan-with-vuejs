<template>
  <aside class="toolbox">
    <h3>Kotak Peralatan</h3>
    <div v-for="t in tools" :key="t.type" class="tool" @mousedown.prevent="start(t)">
      {{ t.type }} ({{t.w}}x{{t.h}})
    </div>
  </aside>
</template>
<script setup>
const emit = defineEmits(['start-drag'])
const tools = [
  {type:'meja',w:120,h:70},
  {type:'kursi',w:30,h:30},
  {type:'pintu',w:60,h:10},
  {type:'kotak',w:100,h:60}
]
function start(t) { emit('start-drag', t) }
</script>
<style>
.toolbox { width:220px; border-right:1px solid #ddd; padding:8px }
.tool { border:1px solid #ccc; padding:8px; margin:6px; cursor:grab }
</style>
