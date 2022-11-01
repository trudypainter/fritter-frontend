<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <NewFreetProcess />
    </section>
    <section class="welcome" v-else>
      <div>
        <h2>Welcome to Fritter!</h2>
      </div>
      <article>
        <h3>
          <router-link to="/login"> Sign in</router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>

    <section>
      <div class="menu">
        <p @click="freetsSelected()" :class="{ selected: freetSelected }">
          Freets
        </p>
        <p @click="connectionsSelected()" :class="{ selected: !freetSelected }">
          Connections
        </p>
      </div>

      <div v-if="freetSelected">
        <section v-if="$store.state.freets.length">
          <FreetComponent
            v-for="freet in $store.state.freets"
            :key="freet.id"
            :freet="freet"
          />
        </section>
        <article class="no-freets" v-else>
          <h3>No freets found.</h3>
        </article>
      </div>
      <div v-else>
        <section v-if="$store.state.connections.length">
          <ContainerComponent
            v-for="connection in $store.state.connections"
            :key="connection.id"
            :connection="connection"
          />
        </section>
        <article class="no-freets" v-else>
          <h3>No freets found.</h3>
        </article>
      </div>
    </section>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";
import GetFreetsForm from "@/components/Freet/GetFreetsForm.vue";
import ContainerComponent from "@/components/Connection/ContainerComponent.vue";
import NewFreetProcess from "@/components/Freet/NewFreetProcess.vue";

export default {
  name: "FreetPage",
  data() {
    return {
      freetSelected: true,
    };
  },
  components: {
    FreetComponent,
    GetFreetsForm,
    CreateFreetForm,
    ContainerComponent,
    NewFreetProcess,
  },
  mounted() {
    this.$refs.getFreetsForm.submit();

    // get all of a users channels
    if (this.$store.state.username) {
      fetch(`/api/channels?author=${this.$store.state.username}`, {
        credentials: "same-origin", // Sends express-session credentials with request
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          this.$store.commit("updateChannels", res);
        });
    }
  },
  methods: {
    connectionsSelected() {
      this.freetSelected = false;
      console.log(this.$store.state.connections);
    },
    freetsSelected() {
      this.freetSelected = true;
      console.log(this.$store.state.freets);
    },
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header,
header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

.menu {
  padding: 14px;
  margin: auto;
  margin-top: 34px;
  font-size: 20px;
  position: fixed;
  top: 30px;
  left: 26px;
}
p {
  padding: 2px 2px;
  width: 140px;
  text-align: left;
  margin: 1px;
  border: 1px solid white;
}
p:hover {
  border: 1px dotted black;
  cursor: pointer;
}
.selected {
  border: 1px solid black;
}
.selected:hover {
  border: 1px solid black;
}

h2 {
  margin: 0px 20px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.welcome {
  margin: auto;
  text-align: center;
  margin-top: 150px;
}

.no-freets {
  text-align: center;
}
</style>
