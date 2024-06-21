<template>
  <div class="w-full">
    <div class="h-1.5 w-full bg-blue-100 dark:bg-zinc-800 overflow-hidden">
      <div class="progress w-full h-full bg-blue-500 left-right"></div>
    </div>
  </div>
</template>

<style scoped>
.progress {
  animation: progress 1s infinite linear;
}

.left-right {
  transform-origin: 0% 50%;
}
@keyframes progress {
  0% {
    transform: translateX(0) scaleX(0);
  }
  40% {
    transform: translateX(0) scaleX(0.4);
  }
  100% {
    transform: translateX(100%) scaleX(0.5);
  }
}
</style>