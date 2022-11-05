<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <div class="channel">
    <div class="header">
      <div class="title">
        <div v-if="editing">
          <input v-model="titleInput" placeholder="title" />
        </div>
        <div v-else>
          <router-link class="a-channel" :to="`/channel/${channel._id}`">{{
            channel.title
          }}</router-link>
        </div>
      </div>

      <div v-if="channelLoaded">
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
      <div v-else>Loading...</div>
    </div>
    <div class="description">
      <div v-if="editing">
        <input v-model="descriptionInput" placeholder="description" />
      </div>
      <div v-else>
        {{ channel.description }}
        <br />
        <i>Number of Connected Freets: {{ connections.length }}</i>
        <br />by
        <router-link :to="`/user/${this.channel.author}`"
          >@{{ channel.author }}</router-link
        >
      </div>
    </div>
    <div class="freets">
      <div class="freet-preview" v-for="connection in this.connections">
        <!-- @{{ connection.freet.author }} said
        <br />
        <br /> -->
        {{ connection.freet.content }}
      </div>
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
  </div>
</template>

<script>
import FollowComponent from "@/components/Follow/FollowComponent.vue";

export default {
  name: "ChannelComponent",
  components: { FollowComponent },
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
      connections: [], // connections for a freet - init as empty list
      connectionsLoaded: false,
      channelLoaded: false,
      titleInput: "",
      descriptionInput: "",
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  async created() {
    // get connections for the freet once created
    if (!this.connectionsLoaded) {
      const options = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      const r = await fetch(
        `/api/connections?channelId=${this.channel._id}`,
        options
      );
      const res = await r.json();
      this.connectionsLoaded = true;
      this.connections = res;
    }

    // get author if not there
    if (!this.channel.author) {
      console.log("looking for", this.channel._id);
      const options = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      const r = await fetch(
        `/api/channels?channelId=${this.channel._id}`,
        options
      );
      const res = await r.json();
      console.log(res.author);
      this.channel = res;
      this.channelLoaded = true;
    } else {
      if (this.$store.state.userFollows) {
        this.channelLoaded = true;
      }
    }
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      //   this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      //   this.draft = this.freet.content;
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
        this.$store.commit("refreshChannels");

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
.channel {
  position: relative;
  margin: auto;
  margin-top: 50px;
  width: 600px;
  font-size: 16px;
  border: 1px solid black;
}

.title {
  font-size: xx-large;
  font-weight: 600px;
}
.freets {
  display: flex;
  overflow-x: scroll;
  width: 600px;
  padding: 20px;
  padding-top: 0px;
  flex-shrink: 1;
}
.freet-preview {
  height: 300px;
  width: 300px;
  min-width: 300px;
  padding: 10px;
  border: 1px solid black;
  overflow: scroll;
  margin-right: 20px;
}
.info {
  display: flex;
  justify-content: space-between;
  background-color: lightcyan;
  border: 1px solid black;
  padding: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
}
.freet-container {
  width: 100%;
  display: flex;
}
.content {
  border: 1px solid black;
  width: 50%;
  height: 400px;
  margin: 0px;
}
.header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
}
.description {
  padding: 20px;
  padding-top: 0px;
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
textarea {
  width: 100%;
  height: 338px;
  resize: none;
}
textarea:focus {
  outline: none;
}
.actions {
  display: flex;
  position: relative;
}
.freet-content {
  padding: 20px;
  height: 316px;
  position: relative;
}
.date {
  position: absolute;
  bottom: -0px;
  color: grey;
}
.connections {
  border: 1px solid black;
  border-left: 0px solid black;
  width: 50%;
  height: 400px;
  position: relative;
}

a {
  color: black;
  text-decoration: none;
}
a:hover {
  color: rgb(0, 184, 70);
}
</style>
