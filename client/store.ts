import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    userChannels: [], // All channels for signed in user
    userFollows: [], // All follows for the signed in user
    userSubscribesTo: [], // All subscribes to other users from signed in user
    connections: [], // Connections for the feed
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateChannels(state, channels) {
      /**
       * Update the stored channels to the provided channels.
       * @param userChannels - channels to store
       */
      state.userChannels = channels;
    },
    updateConnections(state, connections) {
      /**
       * Update the stored connections to the provided connections.
       * @param userChannels - connections to store
       */
      state.connections = connections;
    },
    updateFollows(state, follows) {
      /**
       * Update the stored follows for a signed in user.
       * @param follows
       */
      state.userFollows = follows;
    },
    updateSubscribes(state, subscribes) {
      /**
       * Update the subsrcibingTo for the signed in user
       * @param subscribes
       */
      state.userSubscribesTo = subscribes;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter
        ? `/api/users/${state.filter}/freets`
        : "/api/freets";
      const res = await fetch(url).then(async (r) => r.json());
      state.freets = res;
    },
    async refreshUserChannels(state) {
      /**
       *  Request the server for the currently available channels.
       */
      const url = `/api/channels?author=${state.username}`;
      const res = await fetch(url).then(async (r) => r.json());
      state.userChannels = res;
    },
    async refreshUserFollows(state) {
      /**
       *  Request the server for the user's follows.
       */
      const url = `/api/follows?author=${state.username}`;
      const res = await fetch(url).then(async (r) => r.json());
      console.log("updated follows...", res, state.username);
      state.userFollows = res;
    },
    async refreshUserSubscribes(state) {
      /**
       *  Request the server for the user's subscribes.
       */
      const url = `/api/subscribes?author=${state.username}`;
      const res = await fetch(url).then(async (r) => r.json());
      state.userSubscribesTo = res;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()],
});

export default store;
