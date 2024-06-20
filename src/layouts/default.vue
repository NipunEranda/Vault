<template>
  <main>
    <div class="bg-zinc-300 dark:bg-zinc-800 flex flex-row absolute top-0 left-0 right-0 h-13 z-10">
      <div class="basis-11/12">
        <div class="row w-full h-full p-2">
          <div class="bg-zinc-200 dark:bg-zinc-700 h-full rounded-md">
            <span
              class="inline-flex items-center mt-1.5 ml-1.5 rounded-md bg-blue-50 dark:bg-blue-500 dark:text-white cursor-pointer px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
              >/</span
            >
          </div>
        </div>
      </div>
      <div class="basis-1/12 p-2">
        <button
          class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 align-middle items-center bg-blue-600 hover:bg-blue-700"
          @click="resetConfig"
        >
          Exit
        </button>
      </div>
    </div>
    <div class="h-screen pt-14">
      <slot />
    </div>
  </main>
</template>

<script setup>
import { useRouter } from "vue-router";
import { run } from "../utils";
const router = useRouter();

async function resetConfig() {
  await run("WRITE_CONFIG", JSON.stringify({}, null, 2));
  router.push("/");
}
</script>