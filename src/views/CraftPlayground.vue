<script setup lang="ts">
import MainPlayground from '@/components/PageCraft/MainPlayground/index.vue'
</script>

<template>
  <MainPlayground style="height: 100%; overflow: auto" />

  <div style="position: sticky; bottom: 0; left: 0; display: flex">
    <portal-target name="indicatorBarTeleportDest">
      <!--
      This component can be located anywhere in your App.
      The slot content of the above portal component will be rendered here.
      -->
    </portal-target>
  </div>
</template>
