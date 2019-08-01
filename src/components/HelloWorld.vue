<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2 v-if="getLoading">Loading user ...</h2>
    <h2 v-else>Welcome {{getFullName}}</h2>
    <h3>Root Version: {{getVersion}}</h3>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapActions, mapGetters } from 'vuex';

  export default Vue.extend({
    props: {
      msg: {
        type: String
      }
    },

    mounted() {
      this.loadUser();
    },

    computed: {
      ...mapGetters('user', ['getFullName', 'getLoading']),
      ...mapGetters(['getVersion'])
    },

    methods: {
      loadUser() {
        this.loadCurrentUserData().then(() => {
          console.log(`${this.$store.state.user.currentUser.Username} was loaded.`);
        });
      },
      ...mapActions('user', ['loadCurrentUserData']),  
    }
  })
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
