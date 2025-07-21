<template>
  <div class="project-card-container">
    <div class="project-card" v-for="item in itemConfig">
      <ProjectCard :key="item.name" :title="item.title" :name="item.name" :path="item.path" :desc="item.desc" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ProjectCard from '@/components/ProjectCard.vue';

const appConfig = useAppConfig();

const itemConfig = appConfig.itemConfig;
</script>

<style lang="css" scoped>
.project-card-container {
  margin: calc(-0.5rem);
  display: flex;
  flex-wrap: wrap;
  -webkit-box-pack: start;
  justify-content: flex-start;
  -webkit-box-align: stretch;
  align-items: stretch;
}

.project-card {
  box-sizing: border-box;
  -webkit-box-flex: 0;
  flex: 0 0 100%;
  padding: calc(0.5rem);
  max-width: 100%;

  @media (min-width: 36em) {
    flex-shrink: 0;
  }

  @media (min-width: 48em) {
    flex: 0 0 50%;
    max-width: 50%;
    -webkit-box-flex: 0;
  }

  @media (min-width: 62em) {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
    -webkit-box-flex: 0;
  }

  @media (min-width: 75em) {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
    -webkit-box-flex: 0;
  }

  @media (min-width: 88em) {
    flex: 0 0 25%;
    max-width: 25%;
    -webkit-box-flex: 0;
  }
}
</style>
