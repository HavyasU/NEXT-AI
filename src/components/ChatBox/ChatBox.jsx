import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "../loader/Loader";
import { useAuth } from "../../context/AuthContext";
import { getUserData, saveUserChat } from "../../firebase/database";
import io from "socket.io-client";
import CodeEditor from "../CodeEditor/CodeEditor";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  darcula,
  dark,
  docco,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
const socket = io("http://127.0.0.1:5000");
const ChatBox = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useAuth();
  const [prompt, setPrompt] = useState("");
  const chatContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false); // Fixed isLoading state
  const [copyIndex, setCopyIndex] = useState(null);
  const [speakIndex, setSpeakIndex] = useState(null);
  const copyRef = useRef(null);
  const speakRef = useRef(null);

  const getAnswer = (e) => {
    e.preventDefault();
    setIsLoading(true); // Set isLoading to true when making the request
    // Add user's message to the chats state
    setChats((prevChats) => [...prevChats, { role: "user", text: prompt }]);
    socket.connect();
    socket.emit("send_prompt", { prompt });
    // Clear the prompt after sending
    setPrompt("");
  };
  useEffect(() => {
    if (prompt !== "") {
      // Check if prompt is not empty
      socket.emit("send_prompt", { prompt });
    }
  }, []);

  useEffect(() => {
    const handleNewMessage = (data) => {
      setChats((prevChats) => {
        const lastMessage = prevChats[prevChats.length - 1];
        if (lastMessage && lastMessage.role === "gpt") {
          // If the last message is from 'gpt', append the new content to it
          return [
            ...prevChats.slice(0, -1),
            { role: "gpt", text: lastMessage.text + data.content },
          ];
        } else {
          // Otherwise, add a new message to the chat list
          return [...prevChats, { role: "gpt", text: data.content }];
        }
      });
      setIsLoading(false); // Set isLoading to false when response is received
    };

    socket.on("response", (data) => {
      handleNewMessage(data);
    });
    // Clean up the effect by removing the event listener
    return () => {
      socket.off("response", (data) => {
        handleNewMessage(data);
      });
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const saveChatToDatabase = async () => {
      try {
        if (currentUser && chats.length > 0) {
          await saveUserChat(currentUser, chats);
        }
      } catch (error) {
        console.log("Error saving chat to database:", error);
      }
    };

    scrollToBottom();
    saveChatToDatabase();
  }, [currentUser, chats]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const data = await getUserData(currentUser);
          if (data) {
            setChats(data);
          } else {
            setChats([
              { role: "gpt", text: "Hello,\n How can I assist you today?" },
            ]);
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, [currentUser]);

  const insertNewLine = (e) => {
    const curPosition = e.target.selectionStart;
    const preText = e.target.value.slice(0, curPosition);
    const postText = e.target.value.slice(curPosition, e.target.value.length);
    e.target.value = preText + "\n" + postText;
    setPrompt("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      insertNewLine(e);
    } else if (e.key === "Enter") {
      if (!isLoading) {
        getAnswer(e);
      }
    }
  };

  const copyToClipboard = (curChatEle = null) => {
    if (curChatEle != null) {
      const text = curChatEle.current.innerText;
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return null;
    }
    if (copyRef && copyRef.current) {
      const text =
        copyRef.current && copyRef?.current?.firstElementChild?.innerText;
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  const speak = () => {
    const text = speakRef.current.innerText;
    let utterance = new SpeechSynthesisUtterance(text);
    // utterance.volume = valumerange.value/10;
    if (text) speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (copyIndex !== null) {
      copyToClipboard();
    }
  }, [copyIndex]);
  useEffect(() => {
    if (speakIndex !== null) {
      speak();
    }
  }, [speakIndex]);

  const handleCopyClick = (ind) => {
    setCopyIndex(ind);
  };
  const handleSpeakClisk = (ind) => {
    setSpeakIndex(ind);
  };
  const renderCodeBlock = (code) => {
    let codeFormat = code.toString().split(" ")[0];
    return (
      <SyntaxHighlighter language={codeFormat} style={vs2015}>
        {code}
      </SyntaxHighlighter>
    );
  };

  return (
    <div>
      <div
        onClick={() => {
          setChats([
            { role: "gpt", text: "Hello, \n How can I assist you today?" },
          ]);
        }}
        className=" bg-gray-600 cursor-pointer ml-5 text-xl max-sm:ml-3 max-sm:w-[30px] max-sm:h-[30px] w-[50px] h-[50px] top-1 mt-1.5  absolute rounded-sm flex justify-center items-center"
      >
        <i className="fas fa-plus"></i>
      </div>

      <form
        className="flex justify-center mt-4"
        onSubmit={(e) => {
          getAnswer(e);
        }}
      >
        <div
          className="pt-16 max-sm:pt-8 flex flex-col  w-[80vw] h-[90vh] overflow-y-scroll pb-32 rounded-lg scroll-smooth scroll-hidden"
          ref={chatContainerRef}
        >
          {chats.map((chat, index) => (
            <div
              className={`  max-sm:text-[13px]   w-[38vw]  max-[500px]:w-[15rem]   bg-[#171712] max-sm:px-1 px-2 py-3 mx-3 text-[16px] my-1 shadow-md shadow-gray-600
              
              
              ${
                chat.role === "gpt"
                  ? "self-start gpt-message"
                  : "self-end user-message"
              } `}
              key={index}
            >
              <div className=" w-full flex justify-end  ">
                <div
                  className="w-fit py-1 px-3 flex justify-end rounded-full "
                  onClick={() => handleCopyClick(index)}
                >
                  <i className="fas fa-copy self-end cursor-pointer  flex justify-center items-center "></i>
                </div>
                <div
                  className="w-fit py-1 px-3 flex justify-end rounded-full "
                  onClick={() => handleSpeakClisk(index)}
                >
                  <i className="fa-solid fa-volume-high self-end cursor-pointer  flex justify-center items-center "></i>
                </div>
              </div>

              <div key={index} ref={copyIndex === index ? copyRef : null}>
                <div ref={speakIndex === index ? speakRef : null}>
                  {chat.text.split("```").map((segment, index) => {
                    if (index % 2 === 0) {
                      // If index is even, it's not a code block, process normally
                      return segment.split("\n").map((line, lineIndex) => (
                        <div key={lineIndex}>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: line
                                .replace(/</g, "&lt;")
                                .replace(/>/g, "&gt;")
                                .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"),
                            }}
                          />
                          <br />
                        </div>
                      ));
                    } else {
                      // If index is odd, it's inside a code block, render as code
                      return (
                        <span key={index}>{renderCodeBlock(segment)}</span>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          ))}
          <CodeEditor />
          <div>{isLoading && <Loader />}</div>
        </div>
        <div className=" w-[100vw] fixed bottom-2 flex justify-center items-center ">
          <div className="max-md:min-w-[85vw] w-[90vw] h-[4rem] max-sm:h-[3rem]  inp-group flex justify-center items-center overflow-hidden rounded-[5px]">
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              draggable="false"
              type="text"
              autoFocus={!isLoading}
              placeholder="Text Here..."
              value={prompt}
              style={{ resize: "none" }}
              className="bg-[#46424f] shadow-lg shadow-black text-white outline-none font-bold max-sm:text-[15px]  text-2xl  px-2 max-sm:w-[100%] w-[70%] max-sm:h-[100%] h-[100%]"
              onKeyDown={handleKeyDown}
            ></textarea>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#382bf0]  text-xl   cursor-pointer w-[60px] h-[100%] rounded-sm flex justify-center items-center"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
