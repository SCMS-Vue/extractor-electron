import { createStore } from 'vuex'
import { storageGet, storageSet, rmd } from '../modules/functions';

export default createStore({
  state: {
    localServer: "http://127.0.0.1:8182",
    remote: true,
    queue: [],
    session: null,
    user: null,
    logged: false,
    category: "https://empresite.eleconomista.es/Actividad/INFORMATICA/",
    city: "provincia/BARCELONA/",
    url:
      "https://empresite.eleconomista.es/Actividad/INFORMATICA/provincia/BARCELONA/",
    bussy: false,
  },
  getters: {
    remote(state) {
      return state.remote;
    },
    localServer(state) {
      return state.localServer;
    },

    queue(state) {
      return state.queue;
    },

    user(state) {
      return state.user;
    },

    logged(state) {
      return state.logged;
    },
    bussy(state) {
      return state.bussy;
    },
    category(state) {
      return state.category;
    },
    city(state) {
      return state.city;
    },
    url(state) {
      return state.url;
    },
  },
  mutations: {
    SET_LOCAL_SERVER(state, localServer) {
      state.localServer = localServer;
    },
    SET_QUEUE(state, queue) {
      state.queue = queue;
    },

    SET_REMOTE(state, remote) {
      state.remote = remote;
    },
    SET_BUSSY(state, bussy) {
      state.bussy = bussy;
    },

    SET_CATEGORY(state, category) {
      state.category = category;
    },
    SET_CITY(state, city) {
      state.city = city;
    },
    SET_URL(state) {
      state.url = state.category + state.city;
    },
    SET_SESSION(state, session) {
      if (session !== null) {
        state.user = session.user;
        state.session = session;
        state.logged = true;
      } else {
        state.user = null;
        state.session = null;
        state.logged = false;
      }
    },
  },
  actions: {
    setLocalHostUrl({ commit }, localServer) {
      commit("SET_LOCAL_SERVER", localServer);
    },
    setRemote({ commit }, remote) {
      commit("SET_REMOTE", remote);
    },
    setQueue({ commit }, queue) {
      commit("SET_QUEUE", queue);
    },
    setSession({ commit }, session) {
      commit("SET_SESSION", session);
    },
    init({ commit }) {
      // commit("SET_BUSSY", true);
      // const category = storageGet("category");
      // const city = storageGet("city");
      // console.log(category, city);
      // if (category !== null) {
      //   commit("SET_CATEGORY", category);
      //   commit("SET_URL");
      // }
      // if (city !== null) {
      //   commit("SET_CITY", city);
      //   commit("SET_URL");
      // }
      // commit("SET_BUSSY", false);
    },
    setBussy({ commit }, bussy) {
      commit("SET_BUSSY", bussy);
    },
  },
});
