// import { createStore, action } from 'easy-peasy';

// const store = createStore({
//   authId: "124",
//   setAuthId: action((state, payload) => {
//     state.authId = payload;
//   })
// });

// export default store;




import { action, createStore, persist } from "easy-peasy";

// Import the events into the store

export const store = createStore(persist({
  authId: "guest",
  setAuthId: action((state, payload) => {
    state.authId = payload.authId;
  })
}
));
