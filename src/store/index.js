import Vue from 'vue'
import Vuex from 'vuex'
import { ADD_ACTIVITY, FETCH_ACTIVITIES } from '../graphql';
import { apolloClient } from '../vue-apollo';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activities: [],
    currentMonth: null,
    currentYear: null,
    currentDateInterval: null,
  },
  mutations: {
    SET_ACTIVITIES(state, activities) {
      state.activities = [...activities];
    },
    ADD_ACTIVITY(state, activity) {
      state.activities.push(activity);
    },
    SET_CURRENT_MONTH(state, currentMonth) {
      state.currentMonth = currentMonth;
    },
    SET_CURRENT_YEAR(state, currentYear) {
      state.currentYear = currentYear;
    },
    SET_CURRENT_DATE_INTERVAL(state, currentDateInterval) {
      state.currentDateInterval = currentDateInterval;
    },
  },
  actions: {
    fetchActivities({ commit }, interval) {
      return new Promise((resolve, reject) => {
        apolloClient.query({
          query: FETCH_ACTIVITIES,
          variables: { interval },
        }).then(response => {
          commit('SET_ACTIVITIES', response.data.activities);
          resolve();
        }).catch(err => {
          console.log(err)
          reject();
        });
      });
    },
    async addActivity({ state, dispatch }, newActivity) {
      return new Promise((resolve, reject) => {
        apolloClient.mutate({
          mutation: ADD_ACTIVITY,
          variables: newActivity
        }).then(async () => {
          apolloClient.cache.reset();
          await dispatch('fetchActivities', state.currentDateInterval)
          resolve();
        }).catch(err => {
          console.log(err)
          reject();
        });
      })
    }
  },
  getters: {
    getActivities: state => state.activities,
    getCurrentMonth: state => state.currentMonth,
    getCurrentYear: state => state.currentYear,
  },
  modules: {
  }
})
