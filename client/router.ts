import Vue from "vue";
import VueRouter from "vue-router";
import FreetsPage from "./components/Freet/FreetsPage.vue";
import AccountPage from "./components/Account/AccountPage.vue";
import LoginPage from "./components/Login/LoginPage.vue";
import NotFound from "./NotFound.vue";
import ProfilePage from "./components/Profile/ProfilePage.vue";
import UserPage from "./components/Profile/UserPage.vue";
import ChannelPage from "./components/Channel/ChannelPage.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "Home", component: FreetsPage },
  { path: "/account", name: "Account", component: AccountPage },
  { path: "/profile", name: "Profile", component: ProfilePage },
  { path: "/user/:author", name: "User", component: UserPage },
  { path: "/channel/:channelId", name: "Channel", component: ChannelPage },

  { path: "/login", name: "Login", component: LoginPage },
  { path: "*", name: "Not Found", component: NotFound },
];

const router = new VueRouter({ routes });

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === "Login" && router.app.$store.state.username) {
      next({ name: "Account" }); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === "Account" && !router.app.$store.state.username) {
      next({ name: "Login" }); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
  }

  next();
});

export default router;
