import React from "react";
import io, { Socket } from "socket.io-client";

type ChatType = "RECEIVE_MESSAGE";

type ChatMessage = {
  from: string;
  msg: string;
};

type ChatPayload = {
  topic: string;
} & ChatMessage;

type ChatState = {
  [key: string]: ChatMessage[];
};

const initialState: ChatState = {
  general: [
    { from: "nop", msg: "hello" },
    { from: "bunjiro", msg: "hello" },
    { from: "sataharu", msg: "hello" },
  ],
  topic2: [
    { from: "nop", msg: "hello" },
    { from: "dnakano", msg: "bonjour" },
    { from: "dhasegaw", msg: "good night" },
  ],
};

function reducer(
  state: ChatState,
  action: { type: ChatType; payload: ChatPayload }
): ChatState {
  const topic = action.payload.topic;
  const from = action.payload.from;
  const msg = action.payload.msg;
  switch (action.type) {
    case "RECEIVE_MESSAGE":
      const newState = {
        ...state,
        [topic]: [
          ...state[topic],
          {
            from,
            msg,
          },
        ],
      };
      console.log(newState); // log for debug
      return newState;
    default:
      return state;
  }
}

let socket: Socket;

function sendChatAction(value: ChatPayload) {
  socket.emit("chat message", value);
}

export const CTX = React.createContext({
  allChats: initialState,
  sendChatAction,
  user: "",
});

export default function Store({ children }: { children: React.ReactNode }) {
  const [allChats, dispatch] = React.useReducer(reducer, initialState);
  const user = "user" + Math.random().toFixed(2);

  if (!socket) {
    socket = io(":3000");
    socket.on("chat message", function (msg: ChatPayload) {
      dispatch({ type: "RECEIVE_MESSAGE", payload: msg });
    });
  }

  console.log(allChats); // log for debug. sometimes this doesn't change after dispatch

  return (
    <>
      <p>{allChats["general"][allChats["general"].length - 1].from}</p>
      <p>{allChats["general"][allChats["general"].length - 1].msg}</p>
      <CTX.Provider value={{ allChats, sendChatAction, user }}>
        {children}
      </CTX.Provider>
    </>
  );
}
