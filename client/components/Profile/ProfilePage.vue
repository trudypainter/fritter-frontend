<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <div v-if="$store.state.username"><NewFreetProcess /></div>
      <div class="profile-bar">
        <h2>@{{ $store.state.username }}</h2>
        <router-link to="/account"> Account Settings</router-link>
      </div>

      <div class="menu">
        <div
          class="menu-button"
          :class="{ selected: state === 0 }"
          @click="state = 0"
        >
          Channels
        </div>
        <div
          class="menu-button"
          :class="{ selected: state === 1 }"
          @click="state = 1"
        >
          Following
        </div>
        <div
          class="menu-button"
          :class="{ selected: state === 2 }"
          @click="state = 2"
        >
          Subscribing To
        </div>
        <div
          class="menu-button"
          :class="{ selected: state === 3 }"
          @click="state = 3"
        >
          Freets
        </div>
        <div
          class="menu-button"
          :class="{ selected: state === 4 }"
          @click="state = 4"
        >
          Connections
        </div>
      </div>

      <div>
        <div
          class="channels create-new"
          v-if="state === 0 && this.userChannels.length < 1"
        >
          No Channels created yet.
        </div>
        <div
          v-if="state === 0"
          class="channels"
          v-for="channel in this.userChannels"
        >
          <ChannelComponent :channel="channel" />
        </div>
        <div
          v-if="state === 1"
          class="channels"
          v-for="follow in this.userFollows"
        >
          <ChannelComponent :channel="follow.channel" />
        </div>
        <div
          v-if="state === 2"
          class="channels"
          v-for="channel in this.userChannels"
        >
          <ChannelComponent :channel="channel" />
        </div>
        <div
          v-if="state === 3"
          class="channels"
          v-for="channel in this.userChannels"
        >
          <ChannelComponent :channel="channel" />
        </div>
        <div
          v-if="state === 4"
          class="channels"
          v-for="channel in this.userChannels"
        >
          <ChannelComponent :channel="channel" />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  margin-top: 150px;
}

.menu {
  display: flex;
  width: 600px;
  justify-content: space-between;
  font-size: 18px;
  margin: auto;
  margin-top: 20px;
}

.selected {
  text-decoration: underline;
}

.menu-button:hover {
  text-decoration: dotted underline;
  cursor: pointer;
}

.profile-bar {
  width: 80vw;
  max-width: 600px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-new {
  text-align: center;
}

a {
  color: black;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

.channels {
  margin-top: 40px;
}

.channel-container {
  border: 1px solid black;
  width: 600px;
  margin: auto;
  padding: 20px;
  margin-top: 10px;
}
</style>

<script>
import ChangeUsernameForm from "@/components/Account/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Account/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/Account/DeleteAccountForm.vue";
import LogoutForm from "@/components/Account/LogoutForm.vue";
import ChannelComponent from "@/components/Channel/ChannelComponent.vue";
import NewFreetProcess from "@/components/Freet/NewFreetProcess.vue";

export default {
  name: "ProfilePage",
  components: { ChannelComponent, NewFreetProcess },
  data() {
    return {
      channels: [],
      state: 0,
    };
  },
  computed: {
    userChannels: function () {
      return this.$store.state.userChannels;
    },
    userFollows: function () {
      return this.$store.state.userFollows;
    },
  },
  beforeCreate() {
    if (this.$store.state.username) {
      fetch(`/api/channels?author=${this.$store.state.username}`, {
        credentials: "same-origin", // Sends express-session credentials with request
      })
        .then((res) => res.json())
        .then((res) => {
          this.channels = res;
        });
    }
  },
};
</script>
