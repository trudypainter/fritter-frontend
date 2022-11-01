<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section>
      <div class="headers">
        <h2>New to Fritter?</h2>
      </div>
      <RegisterForm />
    </section>
    <section>
      <div class="headers">
        <h2>Have an account?</h2>
      </div>
      <LoginForm />
    </section>
  </main>
</template>

<style scoped>
main {
  margin-top: 150px;
  display: flex;
  justify-content: space-evenly;
}

section {
  width: 400px;
}
</style>

<script>
import RegisterForm from "@/components/Login/RegisterForm.vue";
import LoginForm from "@/components/Login/LoginForm.vue";

export default {
  name: "LoginPage",
  components: {
    RegisterForm,
    LoginForm,
  },
};
</script>
