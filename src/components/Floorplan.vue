<template>
  <svg ref="svg" width="800" height="600" class="floor-svg"
       @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp" @click="onSvgClick">
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0 L0 0 0 20" fill="none" stroke="#eee" stroke-width="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />

    <g v-for="it in localItems" :key="it.id" :transform="`translate(${it.x},${it.y}) rotate(${it.rot}, ${it.w/2}, ${it.h/2})`"
       @mousedown.stop="onItemDown($event,it)">
      <rect :width="it.w" :height="it.h" :fill="shapeColor(it.type)" stroke="#333" />
      <title>{{`${it.type} x:${Math.round(it.x)} y:${Math.round(it.y)} w:${Math.round(it.w)} h:${Math.round(it.h)}`}}</title>
      <rect v-if="selected===it.id" x="-4" y="-4" :width="it.w+8" :height="it.h+8" stroke="#007bff" fill="none" stroke-dasharray="4" />
    </g>
  </svg>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ initialItems: Array })
const emit = defineEmits(['update:items'])

const svg = ref(null)
const localItems = ref(props.initialItems ? JSON.parse(JSON.stringify(props.initialItems)) : [])
const selected = ref(null)
let dragState = null
let currentTool = null

watch(localItems, (v)=> emit('update:items', v), { deep:true })

function startToolDrag(tool) { currentTool = tool }
function startToolDrop(e) {
  if (!currentTool) return
  const pt = svg.value.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY
  const loc = pt.matrixTransform(svg.value.getScreenCTM().inverse())
  const item = {
    id: Math.random().toString(36).slice(2,9),
    type:currentTool.type, x:loc.x-currentTool.w/2, y:loc.y-currentTool.h/2,
    w:currentTool.w, h:currentTool.h, rot:0
  }
  localItems.value.push(item)
  currentTool = null
}
function onSvgClick(e) { startToolDrop(e); selected.value = null }
function onItemDown(e, it) {
  const pt = svg.value.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY
  const loc = pt.matrixTransform(svg.value.getScreenCTM().inverse())
  dragState = { id: it.id, startX: loc.x, startY: loc.y, origX: it.x, origY: it.y }
  selected.value = it.id
}
function onMouseMove(e) {
  if (!dragState) return
  const pt = svg.value.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY
  const loc = pt.matrixTransform(svg.value.getScreenCTM().inverse())
  const dx = loc.x - dragState.startX
  const dy = loc.y - dragState.startY
  const idx = localItems.value.findIndex(i=>i.id===dragState.id)
  if (idx>=0) {
    localItems.value[idx].x = dragState.origX + dx
    localItems.value[idx].y = dragState.origY + dy
  }
}
function onMouseUp(){ dragState = null }
function shapeColor(type){
  if(type==='meja') return '#f5f5f5'
  if(type==='kursi') return '#e6f7ff'
  if(type==='pintu') return '#fff2e6'
  return '#f0fff4'
}
defineExpose({ startToolDrag })
</script>

<style scoped>
.floor-svg { background:#fff; border:1px solid #ccc }
</style>
