<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="freet">
    <div class="freet-container">
      <textarea
        v-if="editing"
        class="content"
        :value="draft"
        @input="draft = $event.target.value"
      >
      </textarea>
      <p v-else class="content">
        {{ freet.content }}
      </p>
      <div class="connections">
        <ConnectionsComponent
          :freet="this.freet"
          :connections="this.connections"
        />
      </div>
    </div>

    <div class="info">
      <div>from @{{ freet.author }} at {{ freet.dateModified }}</div>
      <i v-if="freet.edited">(edited)</i>
      <div v-if="$store.state.username === freet.author" class="actions">
        <button v-if="editing" @click="submitEdit">✅ Save changes</button>
        <button v-if="editing" @click="stopEditing">🚫 Discard changes</button>
        <button v-if="!editing" @click="startEditing">✏️ Edit</button>
        <button @click="deleteFreet">🗑️ Delete</button>
      </div>
    </div>
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
import ConnectionsComponent from "@/components/Freet/ConnectionsComponent.vue";

export default {
  name: "FreetComponent",
  components: { ConnectionsComponent },
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      connections: [], // connections for a freet - init as empty list
      connectionsLoaded: false,
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  async mounted() {
    // get connections for the freet once created
    if (!this.connectionsLoaded) {
      const options = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      const r = await fetch(
        `/api/connections?freetId=${this.freet._id}`,
        options
      );
      const res = await r.json();
      this.connectionsLoaded = true;
      this.connections = res;
    }
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted freet!",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    submitEdit() {
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
.freet {
  position: relative;
  margin: auto;
  margin-top: 24px;
  width: 600px;
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
  width: 100%;
  display: flex;
}
.content {
  padding: 20px;
  border: 1px solid black;
  width: 300px;
  height: 300px;
  margin: 0px;
}
.connections {
  border: 1px solid black;
  border-left: 0px solid black;
  width: 300px;
  height: 300px;
  position: relative;
}
</style>
