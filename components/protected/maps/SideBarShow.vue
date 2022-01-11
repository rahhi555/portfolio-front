<template>
  <TodosItems
    :cols="cols"
    :max-height="maxHeight"
    :bgColor="bgColor"
    >
  ></TodosItems>
</template>

<script setup lang="ts">
const cols = {
  cols: 12,
  sm: 12,
  md: 12,
  lg: 12,
}

const bgColor = 'rgba(255,255,255, .8)'

const maxHeight = '100vh'
</script>
