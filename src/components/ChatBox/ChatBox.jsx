import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "../loader/Loader";
import { useAuth } from "../../context/AuthContext";
import { getUserData, saveUserChat } from "../../firebase/database";
const ChatBox = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useAuth();
  const [prompt, setPrompt] = useState("");
  const chatContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copyIndex, setCopyIndex] = useState(null);
  const copyRef = useRef(null);
  const getAnswer = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const API_URL = process.env.REACT_APP_API_URL;

    // Add user's message to the chats state
    setChats([...chats, { role: "user", text: prompt }]);

    const data = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `${prompt}  .` }],
      temperature: 0.7,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(API_URL, data, config);

      // Update chats state with both user's and ChatGPT's messages

      setChats((prevChats) => [
        ...prevChats,
        { role: "gpt", text: response.data.choices[0]?.message?.content },
      ]);
    } catch (error) {
      setChats((prevChats) => [
        ...prevChats,
        { role: "gpt", text: "Sorry! I can't asist you with that..." },
      ]);
    }
    setIsLoading(false);
  };
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
        console.error("Error saving chat to database:", error);
      }
    };

    scrollToBottom();
    saveChatToDatabase();
  }, [currentUser, chats]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (currentUser) {
        try {
          // Assuming getUserData is a function that retrieves user data asynchronously
          const data = await getUserData(currentUser);
          if (data) {
            setChats(data);
          } else {
            setChats([
              { role: "gpt", text: "Hello, \n How can i assist you today?" },
            ]);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setIsLoading(false);
    };

    fetchData(); // Call the fetchData function immediately

    // Include currentUser in the dependency array to re-run the effect whenever it changes
  }, [currentUser]);

  const insertNewLine = (e) => {
    const curPosition = e.target.selectionStart;
    const preText = e.target.value.slice(0, curPosition);
    const postText = e.target.value.slice(curPosition, e.target.value.length);
    e.target.value = preText + "\n" + postText;
    setPrompt("");
  };
  const handleKeyDown = (e) => {
    if (e.key == "Enter" && e.ctrlKey) {
      insertNewLine(e);
    } else if (e.key == "Enter") {
      getAnswer(e);
      setPrompt("");
    }
  };

  const copyToClipboard = () => {
    if (copyRef && copyRef.current) {
      const text = copyRef.current.innerText;
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  useEffect(() => {
    if (copyIndex !== null) {
      copyToClipboard();
    }
  }, [copyIndex]);

  const handleCopyClick = (ind) => {
    setCopyIndex(ind);
  };

  return (
    <div>
      <div
        onClick={(cur) => {
          setChats([
            { role: "gpt", text: "Hello, \n How can i assist you today?" },
          ]);
        }}
        className=" bg-gray-600 cursor-pointer ml-5 text-xl max-sm:ml-3 max-sm:w-[30px] max-sm:h-[30px] w-[50px] h-[50px] top-1 mt-1.5  absolute rounded-sm flex justify-center items-center"
      >
        <i class="fa-solid fa-plus"></i>
      </div>

      <form
        className="flex justify-center mt-4"
        onSubmit={(e) => {
          getAnswer(e);
          setPrompt("");
        }}
      >
        <div
          className="pt-16 max-sm:pt-8 flex flex-col w-[80vw] h-[90vh] overflow-y-scroll pb-32 rounded-lg scroll-smooth scroll-hidden"
          ref={chatContainerRef}
        >
          {chats &&
            chats?.length > 0 &&
            Object.entries(chats)?.map((ele, ind) => {
              return (
                <div
                  className={` max-sm:px-1 max-sm:text-[13px] my-2  w-[38vw] max-[426px]:w-[15rem] ${
                    ele[1]?.role === "gpt"
                      ? "self-start gpt-message"
                      : "self-end user-message"
                  }  bg-[#171712] max-sm:px-1 px-5 py-3 mx-3 text-[16px] my-1 shadow-md shadow-gray-600`}
                  key={ind}
                >
                  <div
                    className="w-[100%] py-1 px-3 flex justify-end rounded-full "
                    onClick={() => handleCopyClick(ind)}
                  >
                    <i className="fa-solid fa-copy self-end cursor-pointer  flex justify-center items-center "></i>
                  </div>

                  <p
                    ref={copyIndex === ind ? copyRef : null}
                    dangerouslySetInnerHTML={{
                      __html: ele[1].text
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/\n/g, "<br />")
                        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                        .replace(/```/g, " ")
                        .replace(/```/g, " "),
                    }}
                  ></p>
                </div>
              );
            })}
          <p>{isLoading && <Loader />}</p>
        </div>
        <div className=" w-[100vw] fixed bottom-2 flex justify-center items-center ">
          <div className="max-sm:w-[85%] h-[3.5rem] max-sm:h-[3rem] bg-gray-600 inp-group flex justify-center items-center overflow-hidden rounded-[5px]">
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              draggable="false"
              type="text"
              autoFocus={!isLoading}
              placeholder="Text Here..."
              value={prompt}
              style={{ resize: "none" }}
              className="bg-[#46424f] shadow-lg shadow-black text-white outline-none font-bold max-sm:text-xl text-2xl  px-2 max-sm:w-[100%] w-[50rem] max-sm:h-[100%] h-[100%]"
              onKeyDown={handleKeyDown}
            ></textarea>
            <button
              type="submit"
              className="bg-[#382bf0]  text-xl   cursor-pointer w-[60px] h-[60px] rounded-sm flex justify-center items-center"
            >
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
