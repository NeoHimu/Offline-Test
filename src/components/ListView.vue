<template>
<div>
  <h1 id="title">Offline Quiz</h1>
  <todo-form @loading_courses="loadCourses" @loading_questions="loadQuestions"/>
  
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import TodoForm from './FormView.vue'

export default {
  name: 'TodoList',
  components: {
    TodoForm,
  },
  computed: {
    ...mapState([
      'courses_data',
      'questions_paper'
    ])
  },
  mounted () {
    this.checkStorage()
  },
  methods: {
    ...mapActions([
      'checkStorage',
      'loadCourses',
      'loadQuestions'
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
