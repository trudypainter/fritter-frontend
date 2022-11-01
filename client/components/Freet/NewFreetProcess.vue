<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article>
    <section
      class="new-freet"
      :class="{ 'cancel-button': editing }"
      v-if="$store.state.username"
    >
      <span v-if="!editing" @click="newSelected()">New</span>
      <span v-else @click="cancelSelected()"
        >Close
        <div class="background"></div>
      </span>
    </section>

    <div v-if="editing" class="freet-container">
      <div class="content">
        <div class="header freet-header">
          <div>Write Freet below</div>
        </div>
        <div>
          <textarea
            :value="draft"
            @input="draft = $event.target.value"
            placeholder="and so I was thinking..."
          >
          </textarea>
        </div>
      </div>
      <div class="connections">
        <ConnectionForNewFreet :draft="this.draft" />
      </div>
    </div>

    <!-- <div class="info">
      <div>from @{{ freet.author }} at {{ freet.dateModified }}</div>
    </div> -->
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import ConnectionForNewFreet from "@/components/Freet/ConnectionForNewFreet.vue";

export default {
  name: "NewFreetProcess",
  components: { ConnectionForNewFreet },

  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      connections: [], // connections for a freet - init as empty list
      draft: "",
      connectionsLoaded: false,
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },

  methods: {
    newSelected() {
      this.editing = true; // Keeps track of if a freet is being edited
    },
    cancelSelected() {
      this.editing = false;
      this.draft = "";
    },

    submitFreet() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error =
          "Error: Edited freet content should be different than current freet content.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: "PATCH",
        message: "Successfully edited freet!",
        body: JSON.stringify({ content: this.draft }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.editing = false;
        this.$store.commit("refreshFreets");

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
.new-freet {
  position: fixed;
  right: 20px;
  bottom: 20px;
  border: 1px solid black;
  border-radius: 400px;
  height: 140px;
  width: 140px;
  line-height: 140px;
  text-align: center;
  font-size: 32px;
  background-color: black;
  color: white;
}
.new-freet:hover {
  cursor: pointer;
  background-color: blue;
}
.cancel-button:hover {
  background-color: lightgray;
  color: black;
}

.freet {
  position: relative;
  margin: auto;
  margin-top: 164px;
  width: 800px;
  font-size: 16px;
}
.info {
  display: flex;
  justify-content: space-between;
  background-color: lightcyan;
  border: 1px solid black;
  padding: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
}
.freet-container {
  position: fixed;
  bottom: 180px;
  right: 20px;
  width: 800px;
  display: flex;
  z-index: 9999;

  box-shadow: 10px 7px 5px -2px rgba(189, 189, 189, 0.39);
  -webkit-box-shadow: 10px 7px 5px -2px rgba(189, 189, 189, 0.39);
  -moz-box-shadow: 10px 7px 5px -2px rgba(189, 189, 189, 0.39);
}
.content {
  border: 1px solid black;
  width: 50%;
  height: 400px;
  margin: 0px;
}
.header {
  padding: 20px;
  border-bottom: 1px solid black;
  background-color: lightgrey;
  display: flex;
  justify-content: space-between;
  line-height: 20px;
  font-size: 16px;
}
.freet-header {
  background-color: white;
}
.button {
  margin-left: 13px;
}
.button:hover {
  cursor: pointer;
  text-decoration: underline;
}
textarea {
  width: 100%;
  height: 338px;
  resize: none;
  padding: 20px;
  font-family: Arial, Helvetica, sans-serif;
  border: 0px solid black;
  border-bottom: 1px solid black;
}
textarea:focus {
  outline: none;
  border: 0px solid black;
  border-bottom: 1px solid black;
}
.actions {
  display: flex;
}
.freet-content {
  padding: 20px;
  height: 316px;
  position: relative;
}
.date {
  position: absolute;
  bottom: -0px;
  color: grey;
}
.connections {
  border: 1px solid black;
  border-left: 0px solid black;
  width: 50%;
  height: 400px;
  position: relative;
  font-size: 16px;
}
</style>
