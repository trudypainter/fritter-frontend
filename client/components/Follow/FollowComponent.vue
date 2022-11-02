<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="follow-button">
    <div>
      <div class="unfollow" @click="unfollowClicked()" v-if="isFollowing">
        Unfollow
      </div>
      <div class="follow" @click="followClicked()" v-else>Follow +</div>
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
  name: "FollowComponent",
  props: {
    channelId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isFollowing: false,
      loaded: false,
      alerts: {},
      follow: {},
    };
  },
  computed: {
    userFollows: function () {
      return this.$store.state.userFollows;
    },
  },
  async created() {
    console.log("USER FOLLOWS computed", this.userFollows);

    for (const userFollow of this.$store.state.userFollows) {
      if (userFollow.channel._id === this.channelId) {
        this.follow = userFollow;
        this.isFollowing = true;
      }
    }

    // check if a follow object already exists
    if (this.$store.userFollows) {
    }
  },
  methods: {
    async unfollowClicked() {
      /**
       * Deletes the follow
       */
      console.log("trying to delete follow...", this.follow._id);

      let options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      console.log("trying to delete follow...", this.follow._id.toString());
      let r = await fetch(
        `/api/follows/${this.follow._id.toString()}`,
        options
      );
      if (!r.ok) {
        let res = await r.json();
        throw new Error(res.error);
      }
      let res = await r.json();
      this.$set(this.alerts, "Unfollowed channel", "success");
      setTimeout(() => this.$delete(this.alerts, "Unfollowed channel"), 3000);
      this.isFollowing = false;
      console.log("DELETED follow", res);
      this.$store.commit("refreshUserFollows");
    },
    async followClicked() {
      /**
       * Create follow between user
       */

      if (!this.$store.state.username) {
        const error = "Log in to follow channels.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      console.log("making req", this.channelId.toString());

      // post new follow
      let options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: this.channelId,
        }),
      };
      let r = await fetch(`/api/follows`, options);
      if (!r.ok) {
        // let res = await r.json();
        this.$set(this.alerts, res.error, "error");
        setTimeout(() => this.$delete(this.alerts, res.error), 3000);
        return;
      }
      let res = await r.json();
      console.log(res, res);
      this.$set(this.alerts, "Followed channel!", "success");
      setTimeout(() => this.$delete(this.alerts, "Followed channel!"), 3000);
      this.isFollowing = true;
      this.$store.commit("refreshUserFollows");
      return;
    },
  },
};
</script>

<style scoped>
.follow {
  padding: 6px 20px;
  border: 1px solid black;
  background-color: black;
  color: white;
}
.follow:hover {
  background-color: blueviolet;
  color: white;
  cursor: pointer;
}
.unfollow {
  padding: 6px 20px;
  /* border: 1px solid black; */
  color: black;
  /* background-color: white; */
}
.unfollow:hover {
  /* background-color: white;
  color: black; */
  cursor: pointer;
  font-style: italic;
}
</style>
