import { useEffect, useRef, useState } from 'react';
import './index.css';

function App() {
  const [messages, setMessages] = useState(["Backend Loading..."]);
  const [isReady, setIsReady] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsReady(true);

      ws.send(JSON.stringify({
        type: "join",
        payload: { roomId: "red" }
      }));
    };

    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data]);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsReady(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    const ws = wsRef.current;
    const inputEl = document.getElementById("message") as HTMLInputElement;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not ready");
      return;
    }

    const message = inputEl?.value;
    if (message.trim() === "") return;

    ws.send(JSON.stringify({
      type: "chat",
      payload: { message }
    }));

    inputEl.value = "";
  };

  return (
    <div className="flex flex-col h-screen bg-black">
  {/* Message area */}
  <div className="flex-1 overflow-y-auto p-4 space-y-2">
    {messages.map((message, idx) => (
      <div key={idx} className="flex">
        <div className="bg-white text-black rounded-2xl px-4 py-2 max-w-[75%] break-words">
          {message}
        </div>
      </div>
    ))}
  </div>

  {/* Input area */}
  <div className="flex p-4 gap-2 border-t border-white/10">
    <input
      type="text"
      id="message"
      className="flex-1 p-3 bg-white text-black rounded-xl outline-none"
      placeholder="Type your message..."
    />
    <button
      onClick={sendMessage}
      disabled={!isReady}
      className={`p-3 rounded-xl text-white transition-colors ${
        isReady ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-500 cursor-not-allowed"
      }`}
    >
      Send
    </button>
  </div>
</div>

  );
}

export default App;
