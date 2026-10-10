<script setup lang="ts">
import { ref } from 'vue';
import { UfButton, UfCheckbox, UfCheckboxGroup, UfDialog, UfInput, UfTabs, UfTab, UfTabPanel } from '../../src/index.js';

const email = ref('');
const agree = ref(false);
const some = ref(true);
const toppings = ref<string[]>([]);
const tab = ref('');
const dialog = ref<InstanceType<typeof UfDialog>>();

function open() {
  dialog.value?.el?.dispatchEvent(new Event('noop'));
}
</script>

<template>
  <UfInput v-model="email" type="email" label="Email" required />
  <UfCheckbox v-model="agree">Agree</UfCheckbox>
  <UfCheckboxGroup v-model="toppings" label="Toppings">
    <UfCheckbox v-model:indeterminate="some" select-all>All</UfCheckbox>
  </UfCheckboxGroup>
  <UfButton variant="danger" size="lg" @click="open">Delete</UfButton>
  <UfTabs @uf-tab-change="(e) => (tab = e.detail.name)">
    <UfTab panel="a">A</UfTab>
    <UfTabPanel name="a">A</UfTabPanel>
  </UfTabs>
  <UfDialog ref="dialog" label="Hi" light-dismiss @uf-request-close="(e) => e.detail.source === 'escape'" />

  <!-- @vue-expect-error: not a valid variant -->
  <UfButton variant="nope">x</UfButton>
  <!-- @vue-expect-error: v-model on a checkbox is a boolean -->
  <UfCheckbox v-model="email">x</UfCheckbox>
</template>
