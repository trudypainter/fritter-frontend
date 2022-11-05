import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    freets: [], // All freets created in the app
    subscribedFreets: [], // all freets from users that logged in person is subscribed to
    connections: [], // Connections for the feed
    followedConnections: [], // all connections from channels that logged in person is following

    userChannels: [], // All channels for signed in user
    userFreets: [], // All freetes for signed in user
    userConnections: [], // All connections for signed in user
    userFollows: [], // All follows for the signed in user
    userSubscribes: [], // All subscribes to other users from signed in user
    username: null, // Username of the logged in user
    userId: null, // user id of logged in user
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
    setUserId(state, userId) {
      /**
       * Update the stored username to the specified one.
       * @param userId - new username to set
       */
      state.userId = userId;
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
      state.userSubscribes = subscribes;
    },
    async refreshSubsribedFreets(state) {
      /**
       * Request the server for the freets from users logged in user subscribes to
       */

      let url = "/api/freets/subscribed";
      let res = await fetch(url).then(async (r) => r.json());

      // sort them by date
      state.subscribedFreets = res;
    },
    async refreshAllFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = "/api/freets";
      const res = await fetch(url).then(async (r) => r.json());
      state.freets = res;
    },
    async refreshFollowedConnections(state) {
      /**
       * Request the server for the freets from users logged in user subscribes to
       */

      let url = "/api/connections/followed";
      let res = await fetch(url).then(async (r) => r.json());

      // sort them by date
      state.followedConnections = res;
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
      state.userFollows = res;
    },
    async refreshUserSubscribes(state) {
      /**
       *  Request the server for the user's subscribes.
       */
      const url = `/api/subscribes?author=${state.username}`;
      const res = await fetch(url).then(async (r) => r.json());
      state.userSubscribes = res;
    },
    async refreshUserFreets(state) {
      /**
       *  Request the server for the user's subscribes.
       */
      const url = `/api/freets?author=${state.username}`;
      const res = await fetch(url).then(async (r) => r.json());
      state.userFreets = res;
    },
    async refreshUserConnections(state) {
      /**
       *  Request the server for the user's subscribes.
       */
      const url = `/api/connections?author=${state.username}`;
      const res = await fetch(url).then(async (r) => r.json());
      state.userConnections = res;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()],
});

export default store;
