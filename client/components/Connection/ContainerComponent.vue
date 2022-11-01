<!-- Reusable component representing a container of a conneciton and its freet, connections, and its actions -->

<template>
  <article class="connection">
    <FreetComponent :freet="this.freet" />
    <div class="info">
      <div>
        @{{ connection.author }} connected this to
        <i>{{ connection.channel.title }}</i>
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
      freet: {}, // freet for the connection
    };
  },
  async created() {
    // delete connection if null freet
    if (this.connection.freet === null) {
      console.log("NULL FREET*****");
    } else {
      // proper formatting for connection
      this.freet = this.connection.freet;
      this.freet.author = this.connection.author;
    }
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
