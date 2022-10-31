<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->
<template>
  <div class="connections-container">
    <!-- STATE 0 -->
    <div v-if="this.state == 0">
      <div class="connections-header">
        {{ this.connections.length }} Connections
      </div>
      <div class="connections-list" v-for="connection in this.connections">
        <div class="channel-row">
          <div>{{ connection.channel.title }}</div>
          <div>@{{ connection.author }}</div>
        </div>
      </div>
      <div @click="handleConnect" class="new-connections-button">Connect →</div>
    </div>
    <!-- STATE 1 -->
    <div v-if="this.state == 1">
      <div @click="state = 0" class="connections-header cancel">Cancel</div>
      <div class="channel-row to-pick">
        <i>+ New Channel</i>
      </div>
      <div
        class="connections-list"
        v-for="channel in this.$store.state.userChannels"
      >
        <div
          @click="existingChannelSelected(channel._id)"
          class="channel-row to-pick"
        >
          <div>{{ channel.title }}</div>
        </div>
      </div>
      <div class="pick-channel">Pick Channel</div>
    </div>
    <!-- STATE 2 -->
    <div v-if="this.state == 2">
      <div @click="state = 0" class="connections-header cancel">Cancel</div>
      <div class="connections-list" v-for="connection in this.connections">
        <div class="channel-row">
          <div>{{ connection.channel.title }}</div>
          <div>@{{ connection.author }}</div>
        </div>
      </div>
      <div class="new-connections-button cancel">Create Connection +</div>
    </div>
    <!-- STATE 3 -->
    <div @click="state = 0" v-if="this.state == 3">
      <div class="connections-header cancel">Cancel</div>
      <div class="channel-row">
        <i>+ New Channel</i>
      </div>
      <div
        class="connections-list"
        v-for="channel in this.$store.state.userChannels"
      >
        <div v-if="channel._id == channelSelectedId" class="selected-channel">
          <div class="channel-row">
            <div>{{ channel.title }}</div>
            <div>✔</div>
          </div>
        </div>
        <div v-else>
          <div class="channel-row">
            <div>{{ channel.title }}</div>
          </div>
        </div>
      </div>
      <div
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
export default {
  name: "ConnectionsComponent",
  props: {
    // Data from the stored freet
    freet: { type: Object, required: true },
    connections: { required: true },
  },
  data() {
    return {
      alerts: {},
      state: 0,
      channelSelectedId: undefined,
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
    existingChannelSelected(channelId) {
      this.state = 3;
      this.channelSelectedId = channelId;
    },
    async submitConnectionCreation(channelId) {
      console.log(this.channelSelectedId);

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freetId: this.freet._id,
          channelId: this.channelSelectedId,
        }),
      };
      try {
        // post new connection
        const r = await fetch(`/api/connections/`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();

        // refresh the connections
        const req = await fetch(`/api/connections?freetId=${this.freet._id}`, {
          method: "GET",
        });
        const resp = await req.json();
        this.connections = resp;
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
.cancel:hover {
  cursor: pointer;
  text-decoration: underline;
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
