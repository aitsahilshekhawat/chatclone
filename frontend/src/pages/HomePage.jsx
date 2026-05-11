import { useEffect, useState } from "react";

import { axiosInstance } from "../lib/axios";

import { socket } from "../lib/socket";

export default function HomePage() {
  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [typingUser, setTypingUser] = useState(null);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axiosInstance.get("/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH MESSAGES
  const fetchMessages = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axiosInstance.get(`/messages/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // SEND MESSAGE
  const sendMessage = async () => {
    try {
      if (!text.trim()) return;

      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,

        {
          text,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessages((prev) => [...prev, res.data]);

      socket.emit("sendMessage", res.data);

      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchUsers();

    try {
      const token = localStorage.getItem("token");

      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));

        socket.emit("join", payload.userId);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // RECEIVE MESSAGE
  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  // ONLINE USERS
  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  // TYPING
  useEffect(() => {
    socket.on("typing", (senderId) => {
      setTypingUser(senderId);

      setTimeout(() => {
        setTypingUser(null);
      }, 2000);
    });

    return () => {
      socket.off("typing");
    };
  }, []);

  return (
    <div className="h-screen w-full bg-[#0f172a] text-white flex overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-[350px] bg-[#111827] border-r border-gray-800 flex flex-col">
        {/* HEADER */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Telegram Clone</h1>

          <p className="text-sm text-gray-400">Realtime Chat App</p>
        </div>

        {/* SEARCH */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full bg-[#1f2937] px-4 py-3 rounded-xl outline-none"
          />
        </div>

        {/* USERS */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-2">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);

                fetchMessages(user._id);
              }}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#1f2937] cursor-pointer transition"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center font-bold text-lg">
                  {user.fullName?.[0]}
                </div>

                {onlineUsers.includes(user._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111827]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-semibold truncate">{user.fullName}</h2>

                <p className="text-sm text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT SECTION */}
      <div className="flex-1 flex flex-col bg-[#0f172a]">
        {/* CHAT HEADER */}
        <div className="h-[80px] border-b border-gray-800 px-6 flex items-center bg-[#111827]">
          {selectedUser ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center font-bold text-lg">
                  {selectedUser.fullName?.[0]}
                </div>

                {onlineUsers.includes(selectedUser._id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111827]" />
                )}
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  {selectedUser.fullName}
                </h2>

                <p className="text-sm text-green-400">
                  {typingUser === selectedUser._id
                    ? "typing..."
                    : onlineUsers.includes(selectedUser._id)
                      ? "online"
                      : "offline"}
                </p>
              </div>
            </div>
          ) : (
            <h1 className="text-2xl font-bold">Select a chat 💬</h1>
          )}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {selectedUser ? (
            messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.senderId === selectedUser._id ||
                    msg.senderId?._id === selectedUser._id
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[60%] px-4 py-3 rounded-2xl ${
                      msg.senderId === selectedUser._id ||
                      msg.senderId?._id === selectedUser._id
                        ? "bg-[#1f2937]"
                        : "bg-blue-500"
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No messages yet
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-4xl font-bold text-gray-600">
              Select a chat 💬
            </div>
          )}
        </div>

        {/* INPUT */}
        {selectedUser && (
          <div className="p-4 border-t border-gray-800 bg-[#111827]">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Write a message..."
                value={text}
                onChange={(e) => {
                  setText(e.target.value);

                  const token = localStorage.getItem("token");

                  if (token && selectedUser) {
                    const payload = JSON.parse(atob(token.split(".")[1]));

                    socket.emit("typing", {
                      senderId: payload.userId,

                      receiverId: selectedUser._id,
                    });
                  }
                }}
                className="flex-1 bg-[#1f2937] px-5 py-4 rounded-2xl outline-none"
              />

              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 transition px-6 py-4 rounded-2xl font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
