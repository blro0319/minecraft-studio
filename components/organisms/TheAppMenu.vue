<script setup lang="ts">
import { createFocusTrap, FocusTrap } from "focus-trap";

interface Link {
  to: string;
  icon: string;
  label: string;
  exact?: boolean;
}

const emit = defineEmits<{
  (event: "activate"): void;
  (event: "deactivate"): void;
}>();

const links: Link[] = [
  {
    icon: "Test",
    label: "Home",
    to: "/",
    exact: true,
  },
  {
    icon: "Test",
    label: "Test",
    to: "/test",
  },
];
const rootElement = ref<HTMLElement>(null);
let focusTrap: FocusTrap = null;
const isActive = ref(false);

function activate() {
  if (!isActive.value) {
    isActive.value = true;
    activateFocusTrap();
    emit("activate");
  }
}
function activateFocusTrap() {
  if (!focusTrap) {
    focusTrap = createFocusTrap(rootElement.value, {
      allowOutsideClick: true,
      escapeDeactivates: false,
    });
  }
  focusTrap.activate();
}
function deactivate() {
  if (isActive.value) {
    isActive.value = false;
    focusTrap.deactivate();
    emit("deactivate");
  }
}

defineExpose({
  activate,
  deactivate,
});
</script>

<template>
  <nav ref="rootElement" class="the-app-menu" aria-label="App Menu">
    <header class="the-app-menu__header">Menu</header>
    <div class="the-app-menu__list-wrapper">
      <TheAppMenuLinkList :links="links" />
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.the-app-menu {
  height: 100%;
  color: $color-font-strong;

  &__header {
    display: flex;
    align-items: center;

    height: 56px;
    padding: 12px 24px;
    background-color: $color-background-dark;

    font-size: x-large;
    font-weight: bold;
  }
  &__list-wrapper {
    min-height: calc(100% - 56px);
    padding: 8px;
    background-color: $color-background-normal;
  }
}
</style>