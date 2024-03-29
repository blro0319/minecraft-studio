<script setup lang="ts">
import { RouteLocationRaw, NavigationFailure } from "vue-router";
import AppButton from "~/components/atoms/AppButton.vue";

type AppButtonInstance = InstanceType<typeof AppButton>;
type RouterNavigate = (e?: MouseEvent) => Promise<void | NavigationFailure>;

interface Emits {
  (event: "navigate", next: RouterNavigate): void;
}
interface Props {
  to: RouteLocationRaw;
  icon: string;
  label: string;
  exact?: boolean;
  focusable: boolean;
}

const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  exact: false,
});

const { to, icon, label, exact, focusable } = toRefs(props);
const focusElement = ref<AppButtonInstance>(null);

const linkClasses = computed(() => ({
  "no-exact": exact.value,
}));

async function customNavigate(isActive: boolean, navigate: RouterNavigate) {
  if (isActive) return;
  emit("navigate", navigate);
}

function focus() {
  focusElement.value.focus();
}

defineExpose({
  focus,
});
</script>

<template>
  <li class="the-app-menu-link">
    <div class="the-app-menu-link__wrapper" role="listitem">
      <RouterLink
        :to="to"
        custom
        v-slot="{ href, isActive, isExactActive, navigate }"
      >
        <a
          :href="href"
          ref="focusElement"
          :tabindex="focusable ? 0 : -1"
          class="the-app-menu-link__link"
          :class="[
            linkClasses,
            {
              'router-link-active': isActive,
              'router-link-exact-active': isExactActive,
            },
          ]"
          @contextmenu.prevent
          @click.prevent="customNavigate(isExactActive, navigate)"
          @keyup.space="customNavigate(isExactActive, navigate)"
        >
          <span class="the-app-menu-link__link__icon" aria-hidden>
            {{ icon }}
          </span>
          <span class="the-app-menu-link__link__label">{{ label }}</span>
        </a>
      </RouterLink>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.the-app-menu-link {
  list-style: none;
  line-height: 0;

  &__link {
    --background-opacity: 0;

    display: flex;
    align-items: center;
    padding: 8px;

    border-radius: 4px;
    background-color: rgba(45 50 57 / var(--background-opacity));

    text-decoration: none;

    transition: background-color 0.1s;

    &.no-exact.router-link-active,
    &.router-link-exact-active {
      --background-opacity: 1;
      color: $color-font-strong;
    }
    &:hover:hover:hover,
    &:focus-visible:focus-visible:focus-visible {
      --background-opacity: 0.75;
    }
    &:active:active:active {
      --background-opacity: 0.5;
    }

    &__icon {
      display: block;
      width: 24px;
      height: 24px;
      margin-right: 12px;

      border-radius: 12px;
      background-color: rgba(255 255 255 / 0.1);
      font-size: 0;
    }
  }
}
</style>
