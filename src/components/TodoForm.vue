<template>
<div>
  <b-container class="xyz">
    <b-row>
    <form @submit.prevent="onSubmit">
          <button type="submit">
              Submit
          </button>
    </form>
    </b-row>

    <b-row>
    <form @submit.prevent="onSubmit_1">
          <button type="submit">
              Submit again
          </button>
    </form>
    </b-row>

    <b-row>
    <form @submit.prevent="onSubmit_2">
          <button type="submit">
              Submit again and again
          </button>
    </form>
    </b-row>
  </b-container> 

<!--<div v-if="this.isSelected===true"> {{this.selectedQuizData}} </div>-->
</div>

</template>

<script>

/**

  <b-row>
    <b-col>
            <ul v-for="(quiz, index) in this.quizzes" :key="index" @click="selectedQuiz(quiz, quiz.id)">
            <li class="todo-item"> {{index+1}} &nbsp;&nbsp;&nbsp; {{quiz.description}} </li> 
            </ul>
    </b-col>

     <b-col v-if="this.isSelectedQuiz===true">
            <ul v-for="(q, index) in this.questions" :key="index" @click="selectedQuestion(q)">
            <li class="todo-item"> {{index+1}} &nbsp;&nbsp;&nbsp; {{q}} </li> 
            </ul>
     </b-col>

     <b-col>
        <form @submit.prevent="submit">         
          <div v-if="this.isSelectedQuestion===true"> {{this.selectedQuestionData.summary}} </div>
          <div v-if="this.isSelectedQuestion===true" v-html="this.selectedQuestionData.description"> </div>
          <div v-if="this.isSelectedQuestion===true">Language : {{this.selectedQuestionData.language}} 
          <textarea v-model="answer" placeholder="write code here.." rows="10"></textarea>
          <button type="submit">
              Submit
          </button>
          </div>
        </form>
     </b-col>
  </b-row>

**/

import axios from 'axios'
let base64 = require('base-64');
let username = 'hello';
let password = 'hello';
let url_quizzes = "http://127.0.0.1:8000/api/quizzes/"
let url_post = "http://127.0.0.1:8000/api/answerpapers/"
let url_validate = "http://127.0.0.1:8000/api/validate/"
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
      postData: [],
      selectedQuestionData: null,
      selectedQuizData:null,
      isSelectedQuestion: false,
      isSelectedQuiz:false,
      answer: "",
      testdata:"",
      quizzes: []
    }
  },

  computed: {

  },

  methods: {
  selectedQuestion(selectedQuestionData){
    this.selectedQuestionData = selectedQuestionData; 
    this.isSelectedQuestion = true;
    },

  selectedQuiz(selectedQuizData, quiz_id){
    this.selectedQuizData = selectedQuizData; 
    this.isSelectedQuiz = true;

    fetch(url_quizzes.concat(quiz_id), {
      method: 'get',
      headers: headers,
    },)
    .then((response) => {
      console.log(response)
      return response.json()
    })
    .then((jsonData) => {
      this.questions = jsonData 
      console.log(jsonData)
      this.$emit('submit', this.questions)
    })
  },

  onSubmitQuestion()
  {

  },

onSubmit_2(){
    fetch(url_validate.concat("21").concat("/"), {
      method: "get",
      headers: headers,
    })
    .then(res => {
              console.log(res)
              return res.json()
    })
    .then(jsonResponse => {
              console.log(jsonResponse)
    })
    .catch(err => {err});
    },

    onSubmit_1(){
    fetch(url_validate.concat("5").concat("/").concat("5").concat("/"), {
      method: "post",
      headers: headers,
      body: JSON.stringify({"answer":"hello world!"})
    })
    .then(res => {
              console.log(res)
              return res.json()
    })
    .then(jsonResponse => {
              console.log(jsonResponse)
    })
    .catch(err => {err});
    },

    onSubmit(){

    fetch(url_post, {
      method: "post",
      headers: headers,
      //make sure to serialize your JSON body
      body: JSON.stringify({"question_paper":1, "attempt_number":17, "course":1})
    })
    .then(res => {
              console.log(res)
              return res.json()
    })
    .then(jsonResponse => {
              console.log(jsonResponse)
    })
    .catch(err => {err});

/**
        axios.post(url_post, {"question_paper":1, "attempt_number":11, "course":1}, 
         headers
         ).then(res => {
              console.log(res)
          }).catch(err => {});
    **/
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

/**
          this.selectedQuestionData.solution = this.answer
          //replace the answer for this question and let other questions unchanged
          for(que in this.postData)
          {
              if(que.summary === this.selectedQuestionData.summary)
              {
                  que.solution = this.answer
              }
         }
        url, data=dict(uid=uid, json_data=json_data, user_dir=user_dir)
        this.testdata = {
            'metadata': {
                'user_answer': this.answer,
                'language': 'python',
                'partial_grading': ""
            },
            'test_case_data': [
                {'test_case': 'assert 1==2',
                 'test_case_type': 'standardtestcase',
                 'weight': 0.0}
            ]
        }
  **/      
      }



  },
  
  created () {
    if(this.isSelected===true)
    {
      this.currentQuestion = this.selectedQuestionData
    }
  },

  mounted: function(){
    fetch(url_quizzes, {
      method: 'get',
      headers: headers,
    },)
    .then((response) => {
      console.log(response)
      return response.json()
    })
    .then((jsonData) => {
      this.quizzes = jsonData 
      console.log(jsonData)
      //this.$emit('submit', this.quizzes)
    })
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
.form-label {
  margin-right: 16px;
}


.form-input {
  display: block;
  margin: 8px 0;
  padding: 8px;
  border-radius: 3px;
  border: 0.5px solid rgba(0, 0, 0, 0.15);
}

.form-input:focus {
  border: 0.5px solid #42b983;
  outline: 0;
  box-shadow: none;
}

.todo-form-btn {
  /* clear button styling */
  background: none;
  outline: none;
  border: none;
  padding: 0;

  /* custom styling */
  background-color: white;
  border: 1px solid #42b983;
  margin-left: 8px;
  margin-bottom: 8px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: #42b983;
  font-size: 1.2em;
  /* font-weight: bold; */
  align-self: flex-end;
}

.cancel-button {
  font-size: 0.83em;
}

todo-form-btn:active {
  background-color: #42b983;
  color: white;
}
</style>
