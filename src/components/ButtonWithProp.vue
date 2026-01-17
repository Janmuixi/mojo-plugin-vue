<template>
    <button>{{ textFromProps }}</button>
</template>
<script setup lang="ts">
defineProps({
    textFromProps: String
})
</script>