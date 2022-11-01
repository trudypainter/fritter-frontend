<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <div class="profile-bar">
        <h2>@{{ $store.state.username }}</h2>
        <router-link to="/account"> Account Settings</router-link>
      </div>
      <div class="channels" v-for="channel in channels">
        <div class="channel-container">
          <h3>
            {{ channel.title }}
          </h3>
          <p>
            {{ channel.description }}
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.profile-bar {
  width: 80vw;
  max-width: 600px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

export default {
  name: "ProfilePage",
  components: {},
  data() {
    return {
      channels: [],
    };
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
