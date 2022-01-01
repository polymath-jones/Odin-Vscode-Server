<template>
  <div>omo we de here</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "HelloWorld",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup: () => {},
});
</script>

<style scoped>
div {
  width: 200px;
  height: 400px;
  background-color: seagreen;
  margin: auto;
  border-radius: 20px;
}
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
