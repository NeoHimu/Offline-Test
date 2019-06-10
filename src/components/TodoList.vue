<template>
<div>
  <h1 id="title">Questions</h1>
  <todo-form @submit="addTodo" />
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import TodoForm from './TodoForm.vue'

export default {
  name: 'TodoList',
  components: {
    TodoForm,
  },
  computed: {
    ...mapState([
      'todos',
      'completed'
    ])
  },
  mounted () {
    this.checkStorage()
  },
  methods: {
    ...mapActions([
      'checkStorage',
    ])
  }
}
</script>

<style scoped>
#title {
  text-align: center;
  margin: 40px 0;
}

#todo-list {
  margin: 0;
  padding: 0;
}
</style>
