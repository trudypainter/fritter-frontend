<!-- Reusable component representing a container of a conneciton and its freet, connections, and its actions -->

<template>
  <article class="connection">
    <FreetComponent v-if="gotAuthor" :freet="this.connection.freet" />
    <div class="info">
      <div class="more">
        @{{ this.connection.author }} connected this to
        <i>{{ this.connection.channel.title }}</i>
      </div>
      <div class="date more">on {{ connection.dateCreated }}</div>
      <div v-if="$store.state.username === this.connection.author">
        <div class="delete-button" @click="deleteConnection">
          Delete Connection
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";

export default {
  name: "ContainerComponent",
  components: { FreetComponent },
  props: {
    // Data from the stored freet
    connection: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      author: "", // freet for the connection
      gotAuthor: false,
    };
  },
  async mounted() {
    // get extra info for freet from connection
    this.freet = this.connection.freet;
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const r = await fetch(
      `/api/freets?freetId=${this.connection.freet._id}`,
      options
    );
    const res = await r.json();
    this.author = res.author;
    this.freet.author = res.author;
    this.gotAuthor = true;
  },
  methods: {
    async deleteConnection() {
      /**
       * Deletes this connection.
       */

      let options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      console.log("trying to delete connection...", this.connection._id);
      let r = await fetch(`/api/connections/${this.connection._id}`, options);
      if (!r.ok) {
        let res = await r.json();
        throw new Error(res.error);
        this.$set(this.alerts, "Error deleting freet", "error");
        setTimeout(
          () => this.$delete(this.alerts, "Error deleting freet"),
          3000
        );
      }
      let res = await r.json();
      this.$set(this.alerts, "Deleted Connection", "success");
      setTimeout(() => this.$delete(this.alerts, "Deleted Connection"), 3000);

      // pull user created freets
      this.$store.commit("refreshUserFreets");

      // pull user created connections
      this.$store.commit("refreshUserConnections");
    },
  },
};
</script>

<style scoped>
.info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: yellow;
  border: 1px solid black;
  padding: 20px;
  padding-bottom: 10px;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 800px;
  text-align: center;
}

.more {
  width: 100%;
}
.date {
  font-size: 16px;
  margin-top: 10px;
}

.delete-button {
  width: 160px;
  font-size: 16px;
  font-style: italic;
  padding: 10px;
}

.delete-button:hover {
  background-color: red;
  cursor: pointer;
}
</style>
