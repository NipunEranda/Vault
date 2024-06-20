<template>
  <main>
    <component :is="$route.meta.layout || 'div'">
      <router-view class="px-2"></router-view>
    </component>
  </main>
</template>