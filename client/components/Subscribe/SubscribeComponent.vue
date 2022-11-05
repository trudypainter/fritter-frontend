<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="subscribe-button">
    <div v-if="!loaded">Loading...</div>
    <div v-else>
      <div
        class="unsubscribe"
        @click="unsubscribeClicked()"
        v-if="isSubscribeing"
      >
        Unsubsribe
      </div>
      <div class="subscribe" @click="subscribeClicked()" v-else>
        Subscribe +
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
  </article>
</template>

<script>
export default {
  name: "SubscribeComponent",
  props: {
    subscribingTo: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isSubscribeing: false,
      loaded: false,
      alerts: {},
    };
  },
  computed: {
    userSubscribes: function () {
      return this.$store.state.userSubscribes;
    },
  },
  async beforeCreate() {
    // make sure the user isnt already subscribed
    const url = `/api/subscribes?author=${this.$store.state.username}`;
    const userSubscribes = await fetch(url).then(async (r) => r.json());
    console.log("🟢 user subscribes", userSubscribes);

    for (const userSubscribe of userSubscribes) {
      if (userSubscribe.subscribingTo === this.subscribingTo) {
        this.subscribe = userSubscribe;
        this.isSubscribeing = true;
      }
    }
    this.loaded = true;
  },
  methods: {
    async unsubscribeClicked() {
      /**
       * Deletes the subscribe
       */
      console.log("trying to delete subscribe...", this.subscribe._id);

      let options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      console.log(
        "trying to delete subscribe...",
        this.subscribe._id.toString()
      );
      let r = await fetch(
        `/api/subscribes/${this.subscribe._id.toString()}`,
        options
      );
      if (!r.ok) {
        let res = await r.json();
        throw new Error(res.error);
      }
      let res = await r.json();
      this.$set(this.alerts, "Unsubscribeed channel", "success");
      setTimeout(
        () => this.$delete(this.alerts, "Unsubscribeed channel"),
        3000
      );
      this.isSubscribeing = false;
      console.log("DELETED subscribe", res);
      this.$store.commit("refreshUserSubscribes");
      this.$store.commit("refreshSubsribedFreets");
    },
    async subscribeClicked() {
      /**
       * Create subscribe between user
       */

      if (!this.$store.state.username) {
        const error = "Log in to subscribe channels.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      console.log("making req", this.subscribingTo);

      // post new subscribe
      let options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscribingTo: this.subscribingTo,
        }),
      };
      let r = await fetch(`/api/subscribes`, options);
      if (!r.ok) {
        // let res = await r.json();
        this.$set(this.alerts, res.error, "error");
        setTimeout(() => this.$delete(this.alerts, res.error), 3000);
        return;
      }
      let res = await r.json();
      console.log(res, res);
      this.$set(this.alerts, "Subscribed to user!", "success");
      setTimeout(() => this.$delete(this.alerts, "Subscribeed to user!"), 3000);
      this.isSubscribeing = true;
      this.$store.commit("refreshUserSubscribes");
      this.$store.commit("refreshSubsribedFreets");

      return;
    },
  },
};
</script>

<style scoped>
.subscribe {
  padding: 6px 20px;
  border: 1px solid black;
  background-color: black;
  color: white;
}
.subscribe:hover {
  background-color: blueviolet;
  color: white;
  cursor: pointer;
}
.unsubscribe {
  padding: 6px 20px;
  /* border: 1px solid black; */
  color: black;
  /* background-color: white; */
}
.unsubscribe:hover {
  /* background-color: white;
  color: black; */
  cursor: pointer;
  font-style: italic;
}
</style>
