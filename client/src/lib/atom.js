import { atom } from "recoil";

const User = atom({
  key: "user",
  default: null,
});

const Limit = atom({
  key: "limig",
  default: 10,
});

export { User, Limit };
