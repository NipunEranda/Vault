<template>
    <div>
        {{ folders }}
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { run } from "../utils";

let folders = ref([]);

onMounted(async () => {
    const list = await run("LOAD_BLOB_CONTAINERS");
    folders.value = JSON.parse(list);
});
</script>