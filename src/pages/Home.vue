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
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3 text-end">Modfied On</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(folder, f) in folders"
          :key="f"
          class="bg-white border-b dark:bg-zinc-800 dark:border-zinc-700 hover:dark:bg-zinc-700 cursor-pointer dark:text-white hover:text-blue-400"
        >
          <th
            scope="row"
            class="px-4 py-2 font-medium text-zinc-900 dark:text-white hover:text-blue-400 whitespace-nowrap flex items-center"
          >
            <i class="material-icons text-md me-1">folder</i
            ><span class="text-md">{{ folder.name }}</span>
          </th>
          <td
            class="px-4 py-2 text-end"
            v-text="formatDate(folder.modifiedOn)"
          ></td>
        </tr>
      </tbody>
    </table>

    <!-- Operations -->
    <div
      id="options"
      class="flex items-center justify-center dark:bg-zinc-700 rounded-md absolute bottom-0 left-0 right-0 p-3 h-[4rem]"
    >
      <button
        type="button"
        class="text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500"
        @click="openNewContainerModal"
      >
        New Container
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
import { ref, onMounted, computed } from "vue";
import { run, showModal, hideModal } from "../utils";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
const router = useRouter();
import $ from "jquery";

let folders = ref([]);
let loading = ref(true);
const root = ref(
  computed(() => {
    return router.currentRoute.value.query.root;
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

function formatDate(date) {
  return dayjs(date).format("YYYY-MM-DD HH:MM:DD");
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

onMounted(async () => {
  const list = await run("LOAD_BLOB_CONTAINERS");
  folders.value = JSON.parse(list);
  loading.value = false;
});
</script>