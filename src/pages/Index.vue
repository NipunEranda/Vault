<template>
  <div class="flex h-screen justify-center items-center">
    <div class="container px-10 xl:px-72 mx-auto">
      <input
        class="bg-zinc-200 dark:bg-zinc-800 appearance-none border-2 border-blue-400 rounded w-full py-2 px-4 text-zinc-700 dark:text-zinc-200 leading-tight focus:outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-blue-500 dark:focus:border-blue-300 cursor-pointer"
        id="inline-full-name"
        type="text"
        v-model="url"
        placeholder="ConnectionURL"
      />
      <div class="flex md:items-center">
        <button
          class="shadow bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-9 rounded mt-4 mx-auto"
          :class="{
            'cursor-not-allowed': disableSave,
            'hover:bg-blue-600': !disableSave,
          }"
          type="button"
          @click="saveURL"
          :disabled="disableSave"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { run } from "../utils";

const router = useRouter();

const url = ref("");
let disableSave = ref(true);

watch(url, async (newQuestion, oldQuestion) => {
  validateURL();
});

const validateURL = () => {
  const defaultEndpointsProtocol = url.value.includes(
    "DefaultEndpointsProtocol"
  );
  const accountName = url.value.includes("AccountName");
  const accountKey = url.value.includes("AccountKey");
  const endpointSuffix = url.value.includes("EndpointSuffix");

  disableSave = ref(
    !(defaultEndpointsProtocol && accountName && accountKey && endpointSuffix)
  );
};

async function saveURL() {
  let config = JSON.parse(await run("READ_CONFIG"));
  config["connectionURL"] = url.value;
  await run("WRITE_CONFIG", JSON.stringify(config, null, 2));
  router.go();
}
</script>