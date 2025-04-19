import { action, createStore, persist } from "easy-peasy";

export const store = createStore(
  persist({
    authId: "guest",
    setAuthId: action((state, payload) => {
      // console.log("this is authId", payload.authId);
      state.authId = payload.authId;
    }),
    setUserName: action((state, payload) => {
      state.userName = payload.userName;
    }),
    setPhotoURL: action((state, payload) => {
      state.photoURL = payload.photoURL;
    }),
    reset: action((state) => {
      state.authId = "guest";
      state.userName = null;
      state.photoURL = null;
    }),
  })
);
