<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <!-- <div v-if="$router.params.username"><NewFreetProcess /></div> -->
      <div class="profile-bar">
        <h2>@{{ $route.params.author }}</h2>
      </div>
      <div class="channels create-new" v-if="this.channels < 1">
        No Channels created yet.
      </div>
      <div class="channels" v-for="channel in this.channels">
        <ChannelComponent :channel="channel" />
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  margin-top: 150px;
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
  name: "UserPage",
  components: { ChannelComponent, NewFreetProcess },
  data() {
    return {
      channels: [],
    };
  },
  beforeCreate() {
    fetch(`/api/channels?author=${this.$route.params.author}`, {
      credentials: "same-origin", // Sends express-session credentials with request
    })
      .then((res) => res.json())
      .then((res) => {
        this.channels = res;
      });
  },
};
</script>
