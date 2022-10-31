<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Account settings for @{{ $store.state.username }}</h2>
      </header>
      <div class="settings-box">
        <div class="form"><ChangeUsernameForm /></div>
        <div class="form"><ChangePasswordForm /></div>
      </div>
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <div class="settings-box">
        <div class="form"><LogoutForm /></div>
        <div class="form"><DeleteAccountForm /></div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.settings-box {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.form {
  width: 48%;
}

button {
  background-color: green;
}
</style>

<script>
import ChangeUsernameForm from "@/components/Account/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Account/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/Account/DeleteAccountForm.vue";
import LogoutForm from "@/components/Account/LogoutForm.vue";

export default {
  name: "AccountPage",
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
  },
};
</script>
