<!-- Reusable component representing a container of a conneciton and its freet, connections, and its actions -->

<template>
  <article class="connection">
    <FreetComponent v-if="gotAuthor" :freet="this.connection.freet" />
    <div class="info">
      <div>
        @{{ this.connection.author }} connected this to
        <i>{{ this.connection.channel.title }}</i>
      </div>
      <div class="date">on {{ connection.dateCreated }}</div>
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
  methods: {},
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
  margin: auto;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 800px;
  text-align: center;
}

.info div {
  width: 100%;
}
.date {
  font-size: 16px;
  margin-top: 10px;
}
</style>
