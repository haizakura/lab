<template>
  <div class="project-card-group">
    <div class="project-card" v-for="item in itemConfig">
      <ItemsProjectCard
        :key="item.name"
        :icon="item.icon"
        :title="item.title"
        :name="item.name"
        :path="item.path"
        :desc="item.desc"
        :aria-label="item.name" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const appConfig = useAppConfig();

const itemConfig = appConfig.itemConfig;
</script>

<style scoped>
.project-card-group {
  margin: calc(-0.5rem);
  display: flex;
  flex-wrap: wrap;
  -webkit-box-pack: start;
  justify-content: flex-start;
  -webkit-box-align: stretch;
  align-items: stretch;
}

.project-card {
  flex: 0 0 100%;
  padding: calc(0.5rem);
  max-width: 100%;

  @media (min-width: 40em) {
    flex-shrink: 0;
  }

  @media (min-width: 48em) {
    flex: 0 0 50%;
    max-width: 50%;
    -webkit-box-flex: 0;
  }

  @media (min-width: 64em) {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
    -webkit-box-flex: 0;
  }

  @media (min-width: 80em) {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
    -webkit-box-flex: 0;
  }

  @media (min-width: 96em) {
    flex: 0 0 25%;
    max-width: 25%;
    -webkit-box-flex: 0;
  }
}
</style>
