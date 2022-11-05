<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <NewFreetProcess />

      <section>
        <div class="menu">
          <p
            @click="freetsSelected()"
            @mouseover="freetsHovered = true"
            @mouseleave="freetsHovered = false"
            :class="{ selected: freetSelected }"
          >
            Freets
          </p>
          <p
            @click="connectionsSelected()"
            @mouseover="connectionsHovered = true"
            @mouseleave="connectionsHovered = false"
            :class="{ selected: !freetSelected }"
          >
            Connections
          </p>
          <div v-if="connectionsHovered">
            Connections in your feed are from Channels you Follow.
          </div>
          <div v-if="freetsHovered">
            Freets in your feed are from Users you Subscribe To.
          </div>
        </div>

        <div v-if="freetSelected">
          <section v-if="$store.state.subscribedFreets.length">
            <FreetComponent
              v-for="freet in $store.state.subscribedFreets"
              :key="freet.id"
              :freet="freet"
            />
          </section>
          <article class="no-freets welcome" v-else>
            <br />
            <div>
              Users must Subscribe to other Users to see their Freets in their
              Feed. <br />
              For now, check out all the Freet activity on the app...
            </div>
            <section>
              <FreetComponent
                v-for="freet in $store.state.freets"
                :key="freet.id"
                :freet="freet"
              />
            </section>
          </article>
        </div>
        <div v-else>
          <section v-if="$store.state.followedConnections.length">
            <ContainerComponent
              v-for="connection in $store.state.followedConnections"
              :key="connection.id"
              :connection="connection"
            />
          </section>
          <article class="no-freets welcome" v-else>
            <div>
              No connections found. Try following some channels.
              <br />
              For now, check out all the Connection activity on the app...
            </div>
            <section>
              <ContainerComponent
                v-for="connection in $store.state.connections"
                :key="connection.id"
                :connection="connection"
              />
            </section>
          </article>
        </div>
      </section>
    </section>
    <section class="welcome" v-else>
      <article>
        <div>
          <br />
          <router-link to="/login"> Sign in</router-link>
          to create, edit, and delete freets.
        </div>
      </article>
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
      connectionsHovered: false,
      freetsHovered: false,
    };
  },
  components: {
    FreetComponent,
    GetFreetsForm,
    CreateFreetForm,
    ContainerComponent,
    NewFreetProcess,
  },
  methods: {
    connectionsSelected() {
      this.freetSelected = false;
    },
    freetsSelected() {
      this.freetSelected = true;
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

h2 {
  font-weight: 900px;
  font-size: 48px;
}

@keyframes animated_text {
  0% {
    background-position: 0px 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0px 50%;
  }
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

.menu div {
  background-color: white;
  color: gray;
  width: 180px;
  padding: 0px;
  font-style: italic;
  font-size: 14px;
  margin-top: 10px;
}

.no-freets {
  text-align: center;
}
</style>
