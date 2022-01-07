<template>
  <div class="p-16">
    <div class="flex items-center" odin-id="d0d5c472_d1ad">
      <img class="h-10" src="/logo.svg" alt="" odin-id="c1b4737c_d5c6" />
      <h1 class="font-sans mx-2 text-4xl font-bold" odin-id="3f101cf3_6ada">
        ODIN BUILDER
      </h1>
    </div>
    <p class="font-sans my-4 p-1 text-lg" odin-id="5bb87622_0f12">
      Double click on text to edit
    </p>
    <div class="flex h-96" odin-id="73cc999f_61f9">
      <div
        class="relative border-dotted w-64 border-2 rounded-xl"
        odin-id="f6c9b6a3_0fe1"
      >
        <span
          class="text-gray-400 absolute right-10 top-36 w-40 text-center block"
          odin-id="6ae8dc6c_cbeb"
        >
          Drag and drop boxes here
        </span>
      </div>
      <div class="mx-4 flex flex-col justify-around" odin-id="7e9a3adb_1405">
        <div
          class="h-44 w-40 rounded-xl bg-orange-500 border"
          odin-id="8b1b125c_f9d7"
        ></div>
        <div
          class="h-44 w-40 rounded-xl bg-green-500 border"
          odin-id="63fc3c40_1ddc"
        ></div>
      </div>
      <div class="flex-grow" odin-id="a59d0f5c_77e0">
        <Helloworld odin-id="48ff18d5_f09d"></Helloworld>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
              import Helloworld from "./components/HelloWorld.vue";
  import { defineComponent } from "vue";
  export default defineComponent({
      components: { Helloworld },
  });
</script>

<style scoped>
              #app {
  	font-family: Avenir, Helvetica, Arial, sans-serif;
  	-webkit-font-smoothing: antialiased;
  	-moz-osx-font-smoothing: grayscale;
  	margin-top: 60px;
  } /*---------  ODIN RESPONSIVE QUERIES   ---------*/

  @media screen and (max-width: 1200px) {

  }

  @media screen and (max-width: 825px) {

  }

  @media screen and (max-width: 768px) {

  }

  @media screen and (max-width: 425px) {

  }
</style>
