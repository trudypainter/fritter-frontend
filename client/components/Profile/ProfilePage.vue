<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <div class="profile-bar">
        <h2>@{{ $store.state.username }}</h2>
        <router-link to="/account"> Account Settings</router-link>
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
</style>

<script>
import ChangeUsernameForm from "@/components/Account/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Account/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/Account/DeleteAccountForm.vue";
import LogoutForm from "@/components/Account/LogoutForm.vue";

export default {
  name: "ProfilePage",
  components: {},
};
</script>
