<template>
  <div class="app">
    <Toolbox @start-drag="onStartDrag" />
    <div class="canvas-wrap">
      <Floorplan ref="floorRef" :initialItems="items" @update:items="items = $event" />
      <div class="controls">
        <button @click="onSave">Simpan</button>
        <button @click="onClear">Hapus</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Toolbox from './components/Toolbox.vue'
import Floorplan from './components/Floorplan.vue'
import { fetchLayout, saveLayout } from './api'

const items = ref([])
const floorRef = ref(null)

onMounted(async ()=>{ items.value = await fetchLayout() || [] })
const onStartDrag = (tool) => { floorRef.value.startToolDrag(tool) }
const onSave = async () => { await saveLayout(items.value); alert('saved') }
const onClear = ()=> { items.value = [] }
</script>

<style>
.app { display:flex; height:100vh }
.canvas-wrap { flex:1; position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center }
.controls { position:absolute; right:12px; top:12px }
</style>
