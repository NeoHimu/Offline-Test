<template>
<div>
  <b-container class="todo-form">
    <b-col v-if="this.isLearningModuleSelected===false">
            <ul v-for="(course, index) in this.courses" :key="index" @click="get_learning_module_for_this_course(course)">
            <li class="todo-item">{{course.name}} </li> 
            </ul>
    </b-col>

    <b-col v-if="this.isLearningModuleSelected===true && this.isStartQuiz===false">
            Quizzes </br>
            <ul v-for="(quiz, index) in this.quizzes" :key="index" @click="startQuiz(quiz)">
            <li class="todo-item"> {{index+1}} &nbsp;&nbsp;&nbsp;{{quiz.quiz.description}} </li> 
            </ul>
    </b-col>

    <b-col v-if="this.isStartQuiz===true">
            Questions</br>
            <ul v-for="(question, index) in this.questions" :key="index" @click="selectQuestion(question)">
            <li class="todo-item"> {{index+1}} &nbsp;&nbsp;&nbsp;{{question.summary}} </li>  
            </ul>
    </b-col>
    
    <b-col>
      <form @submit.prevent="submit">         
          <div v-if="this.isSelectedQuestion===true"> {{this.selectedQuestionData.summary}} </div>
          <div v-if="this.isSelectedQuestion===true" v-html="this.selectedQuestionData.description"> </div>
          <div v-if="this.isSelectedQuestion===true">Language : {{this.selectedQuestionData.language}} 
          <textarea v-model="answer" placeholder="write code here.." rows="20" cols="20"></textarea>
          <button type="submit">
              Submit
          </button>
          </div>
      </form>
    </b-col>

      <b-col v-if="this.isSubmitted===true">
        <form @submit.prevent="validate">
              <b-row v-if="this.tornadoServerMessage.success===true">
                Successful!!
              </b-row>
              <b-row v-if="this.tornadoServerMessage.success===false">  
                {{this.tornadoServerMessage.error[0].exception}} </br>
                {{this.tornadoServerMessage.error[0].traceback}}
              </b-row>
        </form>
      </b-col>
  </b-container> 

</div>

</template>

<script>


import axios from 'axios'
let base64 = require('base-64');
let username = 'hello';
let password = 'hello';
let url_validate = "http://127.0.0.1:8000/api/validate/"
let url_courses = "http://127.0.0.1:8000/api/get_courses/"
let url_start_quiz = "http://127.0.0.1:8000/api/start_quiz/"
let headers = new Headers();
headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + password));
headers.set('Accept', 'application/json');
headers.set('Content-Type', 'application/json');

export default {
  name: 'TodoForm',
  props: {
      currentQuestion: {
      type: Object
    }
  },

  data () {
    return {
      questions: [],
      courses: [],
      selectedQuestionData: null,
      isSelectedQuestion: false,
      answer: "",
      quizzes: [],
      course_id: "",
      attempt_no: "",
      answer_paper_id: "",
      user_id: "",
      tornadoServerMessage: "",
      isSubmitted: "",
      isLearningModuleSelected:false,
      isStartQuiz: false
    }
  },

  computed: {

  },

  methods: {

  selectQuestion(selectedQuestionData){
    this.selectedQuestionData = selectedQuestionData; 
    this.isSelectedQuestion = true;
    },

  submit(){
      this.tornadoServerMessage = ""
      this.isSubmitted = true
      fetch(url_validate.concat(this.answer_paper_id).concat("/").concat(this.selectedQuestionData.id).concat("/"), {
      method: "post",
      headers: headers,
      body: JSON.stringify({"answer":this.answer})
    })
    .then(res => {
              console.log(res)
              return res.json()
    })
    .then(jsonResponse => {
              console.log(jsonResponse)
              this.user_id = jsonResponse.uid
              console.log(this.user_id)
              this.validate()
    })
    .catch(err => {err});
    },

  get_learning_module_for_this_course(course)
  {
    this.learning_module = course.learning_module
    //console.log(this.learning_module)
    this.isLearningModuleSelected = true
    this.quizzes = course.learning_module[0].learning_unit

    console.log(this.quizzes)
    this.course_id = course.id
  },

  startQuiz(quiz)
  {
    fetch(url_start_quiz.concat(this.course_id).concat("/").concat(quiz.quiz.id).concat("/"), {
        method: "get",
        headers: headers,
      })
      .then(res => {
                console.log(res)
                return res.json()
      })
      .then(jsonResponse => {
                console.log(jsonResponse)
                this.questions = jsonResponse.questions
                console.log("hello")
                console.log(jsonResponse.questions)
                this.isStartQuiz  = true
                this.answer_paper_id = jsonResponse.id
                this.attempt_no = jsonResponse.attempt_number
                this.$emit('loading_questions', this.questions)
      })
      .catch(err => {err});
  },

  validate(){
      fetch(url_validate.concat(this.user_id).concat("/"), {
        method: "get",
        headers: headers,
      })
      .then(res => {
                console.log(res)
                return res.json()
      })
      .then(jsonResponse => {
                console.log(jsonResponse)
                this.tornadoServerMessage = JSON.parse(jsonResponse.result)
      })
      .catch(err => {err});
      },
},

/**
fetch(url_post, {
      method: 'get',
      headers: headers,
    },)
    .then((response) => {
      console.log(response)
      return response.json()
    })
    .then((jsonData) => {
      //this.questions = jsonData 
      console.log(jsonData)
      //this.$emit('submit', this.questions)
    })
**/
  
  created () {
    if(this.isSelected===true)
    {
      this.currentQuestion = this.selectedQuestionData
    }
  },

  mounted: function(){
    fetch(url_courses, {
        method: "get",
        headers: headers,
      })
      .then(res => {
                console.log(res)
                return res.json()
      })
      .then(jsonResponse => {
                console.log(jsonResponse)
                this.courses = jsonResponse
                this.$emit('loading_courses', this.courses)
      })
      .catch(err => {err});
  }
}
</script>

<style scoped>
.todo-form {
  display: flex;
  margin: 24px;
  margin-bottom: 32px;
  justify-content: center;
}
.todo-item {
  margin: 16px 0;
  padding: 8px;
  padding-left: 16px;
  background-color: #42b983;
  border-radius: 8px;
  color: white;
  justify: left;
}

</style>
