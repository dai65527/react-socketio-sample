import React from "react";

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
  switch (action.type) {
    case "RECEIVE_MESSAGE":
      return {
        ...state,
        [topic]: [
          ...state[topic],
          {
            from: action.payload.from,
            msg: action.payload.msg,
          },
        ],
      };
    default:
      return state;
  }
}

// export const CTX = React.createContext<ChatState>(initialState);
export const CTX = React.createContext(initialState);

export default function Store({ children }: { children: React.ReactNode }) {
  const [chatState, _] = React.useReducer(reducer, initialState);
  return <CTX.Provider value={chatState}>{children}</CTX.Provider>;
}
