<template>
  <div class="overflow-auto" style="height: calc(100vh - 3.5rem)">
    <LoadingBar v-if="loading" />
    <table
      class="w-full text-sm text-left rtl:text-right text-zinc-500 dark:text-zinc-400 max-w-full mb-[4.5rem]"
    >
      <thead
        class="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-400"
      >
        <tr>
          <th scope="col" class="px-4 py-3 flex items-center">
            <input
              id="selectAll"
              type="checkbox"
              v-model="selectAll"
              value="true"
              class="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-sm border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10 me-2"
              v-if="route.query.root && !loading"
            />
            <label class="w-full cursor-pointer">Name</label>
          </th>
          <th scope="col" class="px-6 py-3 text-end cursor-pointer">Modfied On</th>
        </tr>
      </thead>
      <tbody>
        <!-- Folders -->
        <tr
          v-for="(folder, f) in folders"
          :key="f"
          class="bg-white border-b dark:bg-zinc-800 dark:border-zinc-700 hover:dark:bg-blue-400 cursor-pointer dark:text-white hover:text-zinc-800"
          @dblclick="goToFolder(folder)"
          @click="selectItem(f, folder)"
        >
          <th
            scope="row"
            class="px-4 py-2 font-medium text-zinc-900 dark:text-white hover:text-zinc-800 whitespace-nowrap flex items-center"
          >
            <input
              :id="'item-' + f"
              type="checkbox"
              :checked="selectedItems.filter((i) => i.object == folder)[0]"
              class="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-sm border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10 me-2"
              v-if="route.query.root && !loading"
            />
            <i class="material-icons text-md me-1">folder</i
            ><span class="text-md">{{ folder.name }}</span>
          </th>
          <td
            class="px-4 py-2 text-end"
            v-text="formatDate(folder.modifiedOn)"
          ></td>
        </tr>
        <!-- Folders -->

        <!-- Files -->
        <tr
          v-for="(file, f) in files"
          :key="f"
          class="bg-white border-b dark:bg-zinc-800 dark:border-zinc-700 hover:dark:bg-blue-400 cursor-pointer dark:text-white hover:text-zinc-800"
          @click="selectItem(f, file)"
        >
          <th
            scope="row"
            class="px-4 py-2 font-medium text-zinc-900 dark:text-white hover:text-zinc-800 whitespace-nowrap flex items-center"
          >
            <input
              :id="'item-' + f"
              type="checkbox"
              :checked="selectedItems.filter((i) => i.object == file)[0]"
              class="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-sm border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10 me-2"
            />
            <i class="material-icons text-md me-1">description</i
            ><span class="text-md">{{ file.name }}</span>
          </th>
          <td
            class="px-4 py-2 text-end"
            v-text="formatDate(file.modifiedOn)"
          ></td>
        </tr>
        <!-- Files -->
      </tbody>
    </table>

    <!-- Operations -->
    <div
      id="options"
      class="flex items-center justify-center dark:bg-zinc-700 rounded-md absolute bottom-0 left-0 right-0 p-3 h-[4rem]"
    >
      <button
        type="button"
        class="text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 flex items-center me-2"
        @click="openNewContainerModal"
        v-if="!route.query.root && !loading"
      >
        <i class="material-icons text-md me-1">widgets</i>New Container
      </button>
      <button
        type="button"
        class="text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 flex items-center me-2"
        @click="openNewContainerModal"
        v-if="route.query.root && !loading"
      >
        <i class="material-icons text-md me-1">create_new_folder</i>New Folder
      </button>
      <button
        type="button"
        class="text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 flex items-center me-2"
        v-if="route.query.root && !loading"
      >
        <i class="material-icons text-md me-1">upload_file</i>Upload File
      </button>
      <button
        type="button"
        class="text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 flex items-center me-2"
        v-if="route.query.root && !loading"
      >
        <i class="material-icons text-md me-1">drive_folder_upload</i>Upload
        Folder
      </button>
      <button
        type="button"
        class="text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 flex items-center me-2"
        v-if="route.query.root && !loading && selectedItems.length > 0"
      >
        <i class="material-icons text-md me-1">download</i>Download
      </button>
      <button
        type="button"
        class="text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 flex items-center me-2"
        v-if="route.query.root && !loading && selectedItems.length > 1"
      >
        <i class="material-icons text-md me-1">content_copy</i>Copy
      </button>
      <button
        type="button"
        class="text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 flex items-center me-2"
        v-if="route.query.root && !loading && selectedItems.length > 1"
      >
        <i class="material-icons text-md me-1">content_paste</i>Paste
      </button>
      <button
        type="button"
        class="text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 flex items-center me-2"
        v-if="route.query.root && !loading && selectedItems.length > 1"
      >
        <i class="material-icons text-md me-1">content_paste</i>Delete
      </button>
    </div>
    <!-- Operations -->

    <Modal
      :modalId="modal.modalId"
      :modalTitle="modal.modalTitle"
      :operation="modal.operation"
      :modalProcess="modal.modalProcess"
      :actionName="modal.actionName"
      :showCancel="modal.showCancel"
      :width="modal.width"
      :actionEnabled="modal.actionEnabled"
      :busy="modal.busy"
    >
      <div class="w-full px-3 mb-6">
        <label
          for="name"
          class="block mb-3 text-xs font-medium text-neutral-700 dark:text-white"
          ><span>Container Name</span><span class="text-danger"> *</span></label
        >
        <input
          type="text"
          id="containerName"
          v-model="containerName"
          class="bg-neutral-50 border border-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500"
          placeholder="Example: testcontainer OR test-container"
          @input="validateContainerName"
          @keyup.enter="createNewContainer"
          required
        />
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { run, showModal, hideModal } from "../utils";
import dayjs from "dayjs";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
import $ from "jquery";

let folders = ref([]);
let files = ref([]);
let loading = ref(true);
const root = ref(
  computed(() => {
    return route.query.root;
  })
);
let modal = ref({
  modalId: "mainModal",
  modalTitle: "",
  operation: "",
  modalProcess: () => {},
  actionName: "",
  showCancel: false,
  width: "w-6/12",
  actionEnabled: false,
  busy: false,
});
let containerName = ref("");
let selectedItems = ref([]);
let selectAll = ref(false);

function formatDate(date) {
  return date ? dayjs(date).format("YYYY-MM-DD HH:MM:DD") : "";
}

function openNewContainerModal() {
  containerName.value = "";
  modal.value.modalTitle = "New Container";
  modal.value.operation = "add";
  modal.value.modalProcess = createNewContainer;
  modal.value.actionName = "Create";
  modal.value.showCancel = true;
  showModal(modal.value.modalId);
  $("#containerName").focus();
}

async function createNewContainer() {
  if (validateContainerName()) {
    modal.value.busy = true;
    const list = await run("CREATE_BLOB_CONTAINER", containerName.value);
    folders.value = JSON.parse(list);
    modal.value.busy = true;
    hideModal(modal.value.modalId);
  }
}

function validateContainerName() {
  if (containerName.value != "") {
    if (
      /[ `!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~,\[A-Z\]]/.test(containerName.value)
    )
      modal.value.actionEnabled = false;
    else modal.value.actionEnabled = true;
  } else modal.value.actionEnabled = false;

  return modal.value.actionEnabled;
}

function goToFolder(folder) {
  if (!route.query.root) router.push(`${route.path}?root=${btoa(folder.name)}`);
  else
    router.push(
      `${route.path}?root=${btoa(`${atob(route.query.root)}/${folder.name}`)}`
    );
}

function selectItem(index, obj) {
  if (selectedItems.value.filter((i) => i.object == obj).length == 0)
    selectedItems.value.push({ index: index, object: obj });
  else selectedItems.value = selectedItems.value.filter((i) => i.object != obj);
}

async function loadData() {
  loading.value = true;
  const data = await run("LOAD_BLOBS", route.query.root);
  folders.value = JSON.parse(data).folders;
  files.value = JSON.parse(data).files;
  loading.value = false;
}

watch(
  () => route.fullPath,
  async (newValue, oldValue) => {
    await loadData();
  },
  { deep: true }
);

watch(
  () => selectAll.value,
  (newValue, oldValue) => {
    if (newValue == true) {
      selectedItems.value.push(
        ...(files.value ? files.value.map((file, f) => (f = { index: f, object: file })) : [])
      );
      selectedItems.value.push(
        ...(folders.value ? folders.value.map((folder, f) => (f = { index: f, object: folder })) : [])
      );
    } else selectedItems.value = [];
  }
);

onMounted(async () => {
  await loadData();
});
</script>
