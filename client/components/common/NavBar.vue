<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <router-link to="/"> Fritter </router-link>
    </div>
    <div class="right">
      <router-link v-if="$store.state.username" to="/profile">
        Profile
      </router-link>
      <router-link v-else to="/login"> Login </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
  padding: 32px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

a {
  font-size: 32px;
  text-decoration: none;
  color: black;
  font-weight: 900;
  /* letter-spacing: -0.8px; */
}

.alerts {
  width: 25%;
}
</style>
