import Vue from 'vue'
import Vuex from 'vuex'

import ls from './api/localStorageService'
import idbs from './api/indexedDBService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    courses_data: [],
    questions_paper: [],
    dataFields: ['courses_data', 'questions_paper']
  },
  mutations: {
    setState (state, { field, data }) {
      Vue.set(state, field, data)
    },
    loadCourses (state, newData) {
      // if local storage is empty or new data arrived
      if(state.courses_data===[] || JSON.stringify(state.courses_data[0]) !== JSON.stringify(newData) )
      {
        state.courses_data = [] // this is done to avoid the case if wrong uid and pwd response is stored in the indexeddb storage
        state.courses_data.push(newData)
      }
    },
    loadQuestions (state, newData) {
      // if local storage is empty or new data arrived
      if(state.questions_paper===[] || JSON.stringify(state.questions_paper[0]) !== JSON.stringify(newData) )
      {
        state.questions_paper = [] // this is done to avoid the case if wrong uid and pwd response is stored in the indexeddb storage
        state.questions_paper.push(newData)
      }
    },
  },
  actions: {
    loadCourses ({ commit, dispatch }, newData) {
      if(this.state.courses_data===[] || JSON.stringify(this.state.courses_data[0]) !== JSON.stringify(newData) )
      {
        commit('loadCourses', newData)
        dispatch('saveData')
      }
    },

    loadQuestions ({ commit, dispatch }, newData) {
      if(this.state.questions_paper===[] || JSON.stringify(this.state.questions_paper[0]) !== JSON.stringify(newData) )
      {
        commit('loadQuestions', newData)
        dispatch('saveData')
      }
    },
    
    checkStorage ({ state, commit }) {
      state.dataFields.forEach(async field => {
        try {
          let data = await idbs.checkStorage(field)

          // IndexedDB did not find the data, try localStorage
          if (data === undefined) data = ls.checkStorage(field)

          // LocalStorage did not find the data, reset it
          if (data === null) data = []

          commit('setState', { field, data })
        } catch (e) {
          // The value in storage was invalid or corrupt so just set it to blank
          commit('setState', { field, data: [] })
        }
      })
    },
    async saveData ({ state }) {
      try {
        await Promise.all(state.dataFields.map(field => idbs.saveToStorage(field, state[field])))
      } catch (e) {
        state.dataFields.forEach(field => ls.saveToStorage(field, state[field]))
      }
    }
  }
})
