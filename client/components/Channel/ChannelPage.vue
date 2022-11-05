<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="channel">
    <div class="header">
      <div v-if="editing">
        <input v-model="titleInput" placeholder="title" />
      </div>
      <div v-else class="title">
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
          <!-- <div class="button delete" @click="deleteFreet">Delete</div> -->
        </div>
        <div v-else>
          <FollowComponent :channelId="`${this.channel._id}`" />
        </div>
      </div>
    </div>
    <div class="description">
      <div v-if="editing">
        <input v-model="descriptionInput" placeholder="description" />
      </div>
      <div v-else>
        {{ this.channel.description }}
        <br />
        <i>Number of Connected Freets: {{ this.connections.length }}</i>
        <br />
        by
        <router-link :to="`/user/${this.channel.author}`"
          >@{{ this.channel.author }}</router-link
        >
      </div>
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
  // props: {
  //   // Data from the stored freet
  //   channel: {
  //     type: Object,
  //     required: true,
  //   },
  // },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      connections: [], // connections for a freet - init as empty list
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
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      // this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      // this.draft = this.freet.content;
    },
    async deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted channel and all connections.",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.titleInput === "") {
        const error = "Error: Title must be at least one character";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: "PUT",
        message: "Successfully edited channel",
        body: JSON.stringify({
          title: this.titleInput,
          description: this.descriptionInput,
        }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      this.request(params);
      this.channel.title = this.titleInput;
      this.channel.description = this.descriptionInput;
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/channels/${this.channel._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.editing = false;
        this.$store.commit("refreshUserChannels");

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
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

.button {
  margin-left: 13px;
  line-height: 18px;
  height: 18px;
  transform: translateY(12px);
}
.button:hover {
  cursor: pointer;
  /* text-decoration: underline; */
}

input {
  padding: 10px;
  width: 300px;
  border: 1px solid black;
  margin-bottom: 10px;
}
input:focus {
  outline: none;
  /* border: none; */
}
</style>
