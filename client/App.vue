<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <router-view />
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar.vue";

export default {
  name: "App",
  components: { NavBar },
  beforeCreate() {
    // Sync stored username to current session
    fetch("/api/users/session", {
      credentials: "same-origin", // Sends express-session credentials with request
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("USER SESSION", res);
        const user = res.user;
        this.$store.commit("setUsername", user ? user.username : null);
        this.$store.commit("setUserId", user ? user._id : null);

        if (user) {
          // pull user subscribed freets
          this.$store.commit("refreshSubsribedFreets");

          // pull user channels
          this.$store.commit("refreshUserChannels");

          // pull user created freets
          this.$store.commit("refreshUserFreets");

          // pull user created connections
          this.$store.commit("refreshUserConnections");

          // pull followe channel connections
          this.$store.commit("refreshFollowedConnections");

          // pull user follows
          this.$store.commit("refreshUserFollows");

          // pull user subscribes
          this.$store.commit("refreshUserSubscribes");
        }
      });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};

    // get all connections
    fetch(`/api/connections`, {
      credentials: "same-origin", // Sends express-session credentials with request
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("CONNECTIONS");
        console.log(res);
        this.$store.commit("updateConnections", res);
      });

    // get all freets
    fetch(`/api/freets`, {
      credentials: "same-origin", // Sends express-session credentials with request
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("FREETS");
        console.log(res);
        this.$store.commit("updateFreets", res);
      });
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
  font-family: Arial, Helvetica, sans-serif;
}

header {
  position: fixed;
  width: 100vw;
  top: 0px;
}

main {
  padding: 0 5em 5em;
}

.alerts {
  position: absolute;
  z-index: 99;
  bottom: 0;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 100%;
  text-align: center;
}

.alerts article {
  border-radius: 5px;
  padding: 10px 20px;
  color: #fff;
}

.alerts p {
  margin: 0;
}

.alerts .error {
  background-color: rgb(230, 9, 24);
}

.alerts .success {
  background-color: rgb(0, 184, 70);
}
</style>
