// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";
// import axios from "axios";

// const socket = io.connect("http://localhost:5000"); // Backend URL

// const Chat = ({ senderType, senderId, receiverType, receiverId }) => {
//     const [message, setMessage] = useState("");
//     const [messages, setMessages] = useState([]);
//     const room = [senderType + senderId, receiverType + receiverId].sort().join("_"); // Unique chat room

//     useEffect(() => {
//         socket.emit("join_room", room);

//         axios.get(`http://localhost:5000/messages/${room}`)
//             .then((res) => setMessages(res.data))
//             .catch((err) => console.error(err));

//         socket.on("receive_message", (data) => {
//             setMessages((prev) => [...prev, data]);
//         });

//         return () => {
//             socket.off("receive_message");
//         };
//     }, [room]);

//     const sendMessage = () => {
//         if (message.trim()) {
//             const msgData = { senderType, senderId, receiverType, receiverId, message, room };
//             socket.emit("send_message", msgData);
//             setMessages((prev) => [...prev, msgData]);
//             setMessage("");

//             axios.post("http://localhost:5000/messages", msgData).catch((err) => console.error(err));
//         }
//     };

//     return (
//         <div>
//             <h3>Chat</h3>
//             <div>
//                 {messages.map((msg, index) => (
//                     <p key={index}>
//                         <strong>{msg.senderType} ({msg.senderId}):</strong> {msg.message}
//                     </p>
//                 ))}
//             </div>
//             <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
//             <button onClick={sendMessage}>Send</button>
//         </div>
//     );
// };

// export default Chat;
