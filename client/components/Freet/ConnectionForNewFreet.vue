<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->
<template>
  <div class="connections-container">
    <!-- STATE 1 -->
    <div v-if="this.state == 1">
      <div @click="state = 0" class="connections-header">
        Channel to Connect To
      </div>
      <div class="connections-list">
        <div @click="newChannelSelected()" class="channel-row to-pick">
          <i>+ New Channel</i>
        </div>
        <div
          v-for="channel in this.$store.state.userChannels"
          @click="existingChannelSelected(channel._id)"
          class="channel-row to-pick"
        >
          <div>{{ channel.title }}</div>
        </div>
        <br />
      </div>
      <div class="pick-channel">Pick Channel</div>
    </div>
    <!-- STATE 2 -->
    <div v-if="this.state == 2">
      <div @click="state = 1" class="connections-header cancel">Cancel</div>
      <div>
        <form>
          <input v-model="title" placeholder="title" />
          <br />
          <input v-model="description" placeholder="description" />
        </form>
      </div>
      <div
        class="new-connections-button"
        :class="{ create: title !== '', addtitle: title === '' }"
      >
        <div
          v-if="title !== '' && this.draft !== ''"
          @click="createChannelAndConnection()"
        >
          Create Channel and Connection +
        </div>
        <div v-else-if="this.draft == ''">Enter Freet Content</div>
        <div v-else>Enter Channel Title</div>
      </div>
    </div>
    <!-- STATE 3 -->
    <div v-if="this.state == 3">
      <div class="connections-header">Channel to Connect To</div>

      <div class="connections-list">
        <div @click="newChannelSelected()" class="channel-row to-pick">
          <i>+ New Channel</i>
        </div>
        <div
          v-for="channel in this.$store.state.userChannels"
          v-if="channel._id == channelSelectedId"
          class="selected-channel"
        >
          <div class="channel-row to-pick">
            <div>{{ channel.title }}</div>
            <div>✔</div>
          </div>
        </div>
        <div v-else @click="existingChannelSelected(channel._id)">
          <div class="channel-row to-pick">
            <div>{{ channel.title }}</div>
          </div>
        </div>
      </div>
      <div class="new-connections-button addtitle" v-if="this.draft === ''">
        Enter Freet Content
      </div>
      <div
        v-else
        @click="submitConnectionCreation()"
        class="new-connections-button create"
      >
        Create Connection +
      </div>
    </div>
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
import NewChannelAndConnectionForm from "./NewChannelAndConnectionForm.vue";

export default {
  name: "ConnectionForNewFreet",
  components: { NewChannelAndConnectionForm },
  props: {
    draft: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      alerts: {},
      state: 1,
      channelSelectedId: undefined,
      title: "",
      description: "",
    };
  },
  async created() {},
  methods: {
    handleConnect() {
      if (this.$store.state.username) {
        this.state = 1;
      } else {
        const error = "User must log in to create new connection.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
      }
    },
    newChannelSelected() {
      this.state = 2;
    },
    async createChannelAndConnection() {
      // create channel -> then immediately create connection to new channel

      try {
        // create new freet
        const freetOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: this.draft,
          }),
        };
        const rFreet = await fetch(`/api/freets/`, freetOptions);
        if (!rFreet.ok) {
          const resFreet = await rFreet.json();
          throw new Error(resFreet.error);
        }
        const resFreet = await rFreet.json();
        this.$set(this.alerts, "Freet Created", "success");
        setTimeout(() => this.$delete(this.alerts, "Freet Created"), 3000);

        console.log("⭐️ freet from freet creation", resFreet);
        const createdFreetId = resFreet.freet._id;

        // post new channel
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: this.title,
            description: this.description,
          }),
        };
        const r = await fetch(`/api/channels/`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();
        this.$set(this.alerts, "Channel Created", "success");
        setTimeout(() => this.$delete(this.alerts, "Channel Created"), 3000);

        console.log("⭐️ res from channel creation", res.Channel);
        const createdChannelId = res.Channel._id;

        // create connection
        const conectionOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channelId: createdChannelId,
            freetId: createdFreetId,
          }),
        };
        console.log("options for connection", conectionOptions);
        const connectionResp = await fetch(
          `/api/connections/`,
          conectionOptions
        );
        const connectionRespJson = await connectionResp.json();

        console.log("connection post resp", connectionRespJson);

        this.$set(this.alerts, "Connection to New Channel Created", "success");
        setTimeout(
          () => this.$delete(this.alerts, "Connection to New Channel Created"),
          3000
        );

        // reset state
        this.state = 1;

        // close window
        this.$emit("editing", false);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 5000);
      }
    },
    existingChannelSelected(channelId) {
      this.channelSelectedId = channelId;
      this.state = 3;
    },
    async submitConnectionCreation(channelId) {
      console.log(this.channelSelectedId);

      try {
        // create new freet
        const freetOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: this.draft,
          }),
        };
        const rFreet = await fetch(`/api/freets/`, freetOptions);
        if (!rFreet.ok) {
          const resFreet = await rFreet.json();
          throw new Error(resFreet.error);
        }
        const resFreet = await rFreet.json();
        this.$set(this.alerts, "Freet Created", "success");
        setTimeout(() => this.$delete(this.alerts, "Freet Created"), 3000);

        console.log("⭐️ freet from freet creation", resFreet);
        const createdFreetId = resFreet.freet._id;

        console.log(createdFreetId);
        console.log(this.channelSelectedId);
        // post new connection
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            freetId: createdFreetId,
            channelId: this.channelSelectedId,
          }),
        };
        const r = await fetch(`/api/connections/`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();

        // reset state
        this.state = 1;

        // close window
        this.$emit("editing", false);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>
<style scoped>
.connections-header {
  width: 100%;
  background-color: lightgray;
  padding: 20px;
  line-height: 20px;
  border-bottom: 1px solid black;
}
.new-connections-button {
  position: absolute;
  bottom: 0px;
  padding: 20px;
  width: 100%;
  background-color: black;
  color: white;
  text-align: center;
}
.new-connections-button:hover {
  cursor: pointer;
}

.create {
  background-color: darkgreen;
}
.cancel {
  background-color: lightgray;
  color: black;
}
.cancel:hover {
  text-decoration: underline;
  cursor: pointer;
}

.addtitle {
  background-color: lightgray;
  color: black;
  border-top: 1px solid black;
}
.addtitle:hover {
  cursor: default;
}

.connections-list {
  /* background-color: red; */
  height: 280px;
  overflow: scroll;
  background-color: white;
}

form {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: white;
  height: 300px;
}
input {
  padding: 10px;
  width: 100%;
  border: 1px solid black;
  margin-bottom: 10px;
}
input:focus {
  outline: none;
  /* border: none; */
}

.pick-channel {
  position: absolute;
  bottom: 0px;
  padding: 20px;
  width: 100%;
  background-color: lightgray;
  color: black;
  text-align: center;
  border-top: 1px solid black;
}
.channel-row {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  /* background-color: green; */
}
.selected-channel {
  outline: 1px solid black;
  outline-offset: -10px;
}
.to-pick:hover {
  cursor: pointer;
  outline: 1px dotted black;
  outline-offset: -10px;
}
</style>
