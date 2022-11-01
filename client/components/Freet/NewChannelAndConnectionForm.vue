<!-- Form for registering an account (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "NewChannelAndConnectionForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/channels",
      method: "POST",
      hasBody: true,
      setUsername: true,
      fields: [
        { id: "title", label: "Title", value: "" },
        { id: "description", label: "Description", value: "" },
      ],
      title: "Create Channel",
      callback: () => {
        const message = "Successfully created a channel!";
        this.$router.push({ name: "Home" });
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>
