const state = {
  videos: [],
};

const mutations = {
  ADD_VIDEO (state, payload) {
    state.videos.push(payload.video_id);
    state.videos[payload.video_id] = payload;
  },
};

const actions = {
  addVideo ({ commit },payload) {
    commit('ADD_VIDEO',payload);
  },
};

export default {
  state,
  mutations,
  actions,
};
