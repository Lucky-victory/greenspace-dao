import { useEffect, useReducer, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

// INSTALL npm install -D @tailwindcss/typography to properly display tables and such in md

import ChatBubble from "src/components/ChatBubble";
import MessageButton from "src/components/MessageButton";
import SamplePromptsCard from "src/components/SamplePromptsCard";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import isEmpty from "just-is-empty";
import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/messages/messages.mjs";
// import { useAccount } from "wagmi";
import DashBoardLayout from "src/components/MemberDashboardLayout";
import { Box, Textarea } from "@chakra-ui/react";
import { useWallet } from "src/context/WalletProvider";

const samplePrompts = [
  "What nutrition is best for a female BMI of 20?",
  "Any exercises I can do, without hurting my back?",
];

interface ChatState {
  loading: boolean;
  thread_new: boolean;
  thread_currentId: string;
  thread_threadIds: string;
  thread_messages: OpenAI.Beta.Threads.Messages.Message[];
  active_question: string;
  active_question_disabled: boolean;
}

const AiCoachPage = () => {
  const { address } = useWallet();
  const [state, updateState] = useReducer(
    (current: ChatState, update: Partial<ChatState>): ChatState => ({
      ...current,
      ...update,
    }),
    {
      loading: false,
      thread_new: true,
      thread_currentId: "",
      thread_threadIds: "",
      thread_messages: [],
      active_question: "",
      active_question_disabled: false,
    }
  );

  const [activeResponse, setActiveResponse] = useState("");

  // Ref for the socket instance
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  // Ref to store the latest state
  const stateRef = useRef(state);
  const activeResponseRef = useRef(activeResponse);

  // Update stateRef on each state change
  useEffect(() => {
    activeResponseRef.current = activeResponse;
  }, [activeResponse]);

  // Update stateRef on each state change
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    (async () => await socketInitializer())();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit("message", {
      type: "LIST_THREAD_IDS",
      payload: {
        addressOrUsername: address,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef.current, address]);

  // const container = useRef<HTMLDivElement>(null);

  // const Scroll = () => {
  //   const { offsetHeight, scrollHeight, scrollTop } =
  //     container.current as HTMLDivElement;
  //   if (scrollHeight <= scrollTop + offsetHeight + 100) {
  //     container.current?.scrollTo(0, scrollHeight);
  //   }
  // };

  // useEffect(() => {
  //   Scroll();
  // }, [state.thread_messages]);

  const socketInitializer = async () => {
    await fetch("/api/assistant");
    socketRef.current = io();

    console.log(socketRef.current);

    socketRef.current.on("connect", () => {
      console.log("Connected to the server");
    });

    socketRef.current.on("thread-ids", (data) => {
      updateState({
        thread_threadIds: data,
      });
      console.log("thread-ids: ", data);
    });

    socketRef.current.on("thread-messages", (data) => {
      updateState({
        thread_messages: data,
        loading: false,
      });
      console.log("thread-messages: ", data);
    });

    socketRef.current.on("thread-created", (data) => {
      updateState({
        thread_currentId: data,
        thread_new: false,
      });
      console.log("thread-created: ", data);
    });

    socketRef.current.on("stream-response", (data) => {
      setActiveResponse((active) => {
        return active + data;
      });
    });

    socketRef.current.on("stream-finished", (data) => {
      setActiveResponse("");
      updateState({
        active_question_disabled: false,
        thread_messages: [
          ...stateRef.current.thread_messages,
          {
            object: "thread.message",
            created_at: Date.now(),
            role: "assistant",
            content: [
              // TODO: Could be image in future
              {
                type: "text",
                text: {
                  value: activeResponseRef.current,
                  annotations: [],
                },
              },
            ],
          } as any,
        ],
      });
      console.log("stream-finished: ", data);
    });

    socketRef.current.on("thread-deleted", (data) => {
      updateState({});
      console.log("thread-deleted: ", data);
    });
  };

  const handleGetThread = (threadId: string) => {
    updateState({
      thread_new: false,
      thread_currentId: threadId,
      loading: true,
    });

    socketRef.current?.emit("message", {
      type: "GET_THREAD",
      payload: {
        threadId,
      },
    });
  };

  const handleAskQuestion = () => {
    if (!state.active_question) {
      return;
    }

    state.thread_new
      ? socketRef.current?.emit("message", {
          type: "CREATE_THREAD_WITH_QUESTION",
          payload: {
            content: state.active_question,
            addressOrUsername: address,
          },
        })
      : socketRef.current?.emit("message", {
          type: "ASK_QUESTION",
          payload: {
            threadId: state.thread_currentId,
            content: state.active_question,
            addressOrUsername: address,
          },
        });

    updateState({
      active_question_disabled: true,
      thread_messages: [
        ...state.thread_messages,
        // Optimistically add the question
        {
          object: "thread.message",
          created_at: Date.now(),
          role: "user",
          content: [
            {
              type: "text",
              text: {
                value: state.active_question,
                annotations: [],
              },
            },
          ],
        } as any,
      ],
      active_question: "",
    });
  };

  return (
    <DashBoardLayout>
      <div className="flex flex-col gap-8 w-full shrink-0">
        <div /* ref={container} */ className="flex">
          <div className="flex-1 flex flex-col gap-4 items-center px-8 pb-60">
            {isEmpty(state.thread_messages) ? (
              <div className="flex flex-col gap-48 items-center">
                <div className="flex flex-col gap-8 items-center">
                  <p className="max-w-prose text-balance text-center font-bellota text-2xl font-bold ">
                    I&apos;m here to help you live healthy and better!
                  </p>
                  <div className="flex gap-4">
                    {samplePrompts.map((body, index) => (
                      <SamplePromptsCard key={index} title={"Chat"} body={body} />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-8 items-center">
                  {state.thread_threadIds?.split(" ").map((threadIdWithDate: string) => {
                    const [threadId, date] = threadIdWithDate.split("::");
                    return (
                      <div key={threadId} onClick={() => handleGetThread(threadId)}>
                        {threadId} {date}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              state.thread_messages.map((chat, index) => {
                return (
                  <ChatBubble
                    key={index + "chat"}
                    name={chat.role === "assistant" ? "GreenspaceAI" : "Me"}
                    // TODO: Check it could be image too.
                    message={(chat.content[0] as TextContentBlock).text.value}
                    isUser={chat.role === "user"}
                  />
                );
              })
            )}

            {activeResponse && (
              <ChatBubble
                name="GreenspaceAI"
                // TODO: Check it could be image too.
                message={activeResponse}
              />
            )}

            <div className=" flex flex-col justify-end gap-4 bg-white p-4 fixed bottom-4 max-w-[48.5rem] w-full h-min rounded-[20px] shadow-[0_0_50px_7px_rgba(0,0,0,0.08)]">
              <div className="w-full bg-white p-4 rounded shadow-[0_0_50px_7px_rgba(0,0,0,0.08)]">
                {/* This enables the textarea to auto grow! */}
                <div className="relative">
                  <div className="whitespace-pre-line bg-white invisible min-h-[4rem] w-full">
                    {state.active_question}
                  </div>
                  <textarea
                    className="absolute inset-0 w-full overflow-y-hidden border-none focus:outline-none text-[#fff] h-[4.5rem] resize-none h-[initial]"
                    placeholder="Ask me anything..."
                    onChange={(e) => {
                      updateState({
                        active_question: e.target.value,
                      });
                    }}
                    value={state.active_question}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <MessageButton
                  onClick={() => {
                    handleAskQuestion();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default AiCoachPage;
