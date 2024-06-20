<template>
  <div class="overflow-auto" style="height: calc(100vh - 3.5rem)">
    <table
      class="w-full text-sm text-left rtl:text-right text-zinc-500 dark:text-zinc-400 max-w-full mb-[4.5rem]"
    >
      <thead
        class="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">Modfied On</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(folder, f) in folders"
          :key="f"
          class="bg-white border-b dark:bg-zinc-800 dark:border-zinc-700 hover:dark:bg-zinc-700 cursor-pointer"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-zinc-900 whitespace-nowrap dark:text-white"
            v-text="folder.name"
          ></th>
          <td class="px-6 py-4" v-text="folder.modifiedOn"></td>
        </tr>
      </tbody>
    </table>
    <div
      id="options"
      class="flex items-center justify-center dark:bg-zinc-700 rounded-md absolute bottom-0 left-0 right-0 p-3 h-[4rem]"
    >
      <button
        type="button"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
      >
        New Container
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { run } from "../utils";

let folders = ref([]);
let loading = ref(true);

onMounted(async () => {
  const list = await run("LOAD_BLOB_CONTAINERS");
  folders.value = JSON.parse(list);
  loading.value = false;
});
</script>