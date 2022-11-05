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
          @mouseover="hovering0 = true"
          @mouseleave="hovering0 = false"
        >
          Channels
        </div>
        <div
          class="menu-button"
          :class="{ selected: state === 1 }"
          @click="state = 1"
          @mouseover="hovering1 = true"
          @mouseleave="hovering1 = false"
        >
          Following
        </div>
        <div
          class="menu-button"
          :class="{ selected: state === 2 }"
          @click="state = 2"
          @mouseover="hovering2 = true"
          @mouseleave="hovering2 = false"
        >
          Subscribing To
        </div>
        <div
          class="menu-button"
          :class="{ selected: state === 3 }"
          @click="state = 3"
          @mouseover="hovering3 = true"
          @mouseleave="hovering3 = false"
        >
          Freets
        </div>
        <div
          class="menu-button"
          :class="{ selected: state === 4 }"
          @click="state = 4"
          @mouseover="hovering4 = true"
          @mouseleave="hovering4 = false"
        >
          Connections
        </div>
      </div>

      <div class="info">
        <div class="message" v-if="hovering0">
          Channels created by this User
        </div>
        <div class="message" v-if="hovering1">Channels this User Follows</div>
        <div class="message" v-if="hovering2">
          Other Users this User Subscribes to
        </div>
        <div class="message" v-if="hovering3">Freets this User created</div>
        <div class="message" v-if="hovering4">
          Connections this User created
        </div>
      </div>

      <div>
        <!-- user channels -->
        <div v-if="state === 0" class="channels">
          <div class="create-new" v-if="this.userChannels.length < 1">
            No Channels created yet.
          </div>
          <div v-else v-for="channel in this.userChannels">
            <ChannelComponent :channel="channel" />
          </div>
        </div>

        <!-- followed channels -->
        <div v-if="state === 1" class="channels">
          <div class="create-new" v-if="this.userFollows.length < 1">
            You do not follow any channels.
          </div>
          <div v-else v-for="follow in this.userFollows">
            <ChannelComponent :channel="follow.channel" />
          </div>
        </div>

        <!-- subscribed to users -->
        <div v-if="state === 2" class="channels">
          <div class="create-new" v-if="this.userSubscribes.length < 1">
            You do not subscribe to any users.
          </div>
          <div v-else v-for="subscribe in this.userSubscribes">
            <div class="user-container">
              <router-link :to="`/user/${subscribe.subscribingTo}`"
                >@{{ subscribe.subscribingTo }}</router-link
              >
              <SubscribeComponent :subscribingTo="subscribe.subscribingTo" />
            </div>
          </div>
        </div>

        <!-- users freets -->
        <div v-if="state === 3" class="channels">
          <div class="create-new" v-if="this.userFreets.length < 1">
            You have not created any Freets.
          </div>
          <div v-else v-for="freet in this.userFreets">
            <FreetComponent :freet="freet" />
          </div>
        </div>

        <!-- users connections -->
        <div v-if="state === 4" class="channels">
          <div class="create-new" v-if="this.userConnections.length < 1">
            You have not created any Connections.
          </div>
          <div v-else v-for="connection in this.userConnections">
            <ContainerComponent :connection="connection" />
          </div>
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

.user-container {
  padding: 20px;
  border: 1px solid black;
  width: 400px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  margin-bottom: 20px;
}

.info {
  width: 600px;
  color: gray;
  font-style: italic;
  margin: auto;
  height: 0px;
  font-size: 14px;
  position: relative;
}

.message {
  transform: translateY(10px);
}
</style>

<script>
import ChangeUsernameForm from "@/components/Account/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Account/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/Account/DeleteAccountForm.vue";
import LogoutForm from "@/components/Account/LogoutForm.vue";
import ChannelComponent from "@/components/Channel/ChannelComponent.vue";
import NewFreetProcess from "@/components/Freet/NewFreetProcess.vue";
import SubscribeComponent from "@/components/Subscribe/SubscribeComponent.vue";
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import ContainerComponent from "@/components/Connection/ContainerComponent.vue";

export default {
  name: "ProfilePage",
  components: {
    ChannelComponent,
    NewFreetProcess,
    SubscribeComponent,
    ContainerComponent,
    FreetComponent,
  },
  data() {
    return {
      // channels: [],
      freets: [],
      connections: [],
      state: 0,
      hovering0: false,
      hovering1: false,
      hovering2: false,
      hovering3: false,
      hovering4: false,
    };
  },
  computed: {
    userChannels: function () {
      return this.$store.state.userChannels;
    },
    userFollows: function () {
      return this.$store.state.userFollows;
    },
    userSubscribes: function () {
      return this.$store.state.userSubscribes;
    },

    userFreets: function () {
      return this.$store.state.userFreets;
    },
    userConnections: function () {
      return this.$store.state.userConnections;
    },
  },
  beforeCreate() {},
};
</script>
