<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="channel">
    <div class="header">
      <div class="title">
        {{ this.channel.title }}
      </div>
      <div class="actions">
        <div v-if="$store.state.username === channel.author" class="actions">
          <div class="button update" v-if="editing" @click="submitEdit">
            Update
          </div>
          <div class="button back" v-if="editing" @click="stopEditing">
            Back
          </div>
          <div class="button edit" v-if="!editing" @click="startEditing">
            Edit
          </div>
          <div class="button delete" @click="deleteFreet">Delete</div>
        </div>
        <div v-else>
          <FollowComponent :channelId="`${this.channel._id}`" />
        </div>
      </div>
    </div>
    <div class="description">
      {{ this.channel.description }}
      <br />
      <i>Number of Connected Freets: {{ this.connections.length }}</i>
      <br />
      by
      <router-link :to="`/user/${this.channel.author}`"
        >@{{ this.channel.author }}</router-link
      >
    </div>

    <div v-if="connectionsLoaded" class="connections">
      <ContainerComponent
        :key="connection.id"
        :connection="connection"
        v-for="connection in this.connections"
      />
    </div>

    <!-- <div class="info">
        <div>from @{{ freet.author }} at {{ freet.dateModified }}</div>
      </div> -->
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import ContainerComponent from "@/components/Connection/ContainerComponent.vue";
import FollowComponent from "@/components/Follow/FollowComponent.vue";

export default {
  name: "ChannelPage",
  components: { ContainerComponent, FollowComponent },
  props: {
    // Data from the stored freet
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      connections: ["tests"], // connections for a freet - init as empty list
      connectionsLoaded: false,
      channel: {},
      titleInput: "",
      descriptionInput: "",
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  async beforeCreate() {
    // get channel info
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const r = await fetch(
      `/api/channels?channelId=${this.$route.params.channelId}`,
      options
    );
    const res = await r.json();
    this.channel = res;
    console.log("CHANNEL RESPONSE, ", res);

    // get connections info
    const connectionsOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const rConnections = await fetch(
      `/api/connections?channelId=${this.$route.params.channelId}`,
      connectionsOptions
    );
    const resConenctions = await rConnections.json();
    this.connections = resConenctions;
    console.log(resConenctions);
    this.connectionsLoaded = true;
  },
  methods: {},
};
</script>

<style scoped>
.channel {
  width: 800px;
  margin: auto;
  margin-top: 150px;
}

.header {
  display: flex;
  justify-content: space-between;
}

.title {
  font-size: xx-large;
}
.description {
  margin-top: 10px;
}

.connections {
  margin-top: 0px;
  margin-bottom: 80px;
}

a {
  color: black;
  text-decoration: none;
}
a:hover {
  color: blueviolet;
}
.actions {
  display: flex;
  position: relative;
}
</style>
