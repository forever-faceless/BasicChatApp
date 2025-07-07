import { useEffect, useRef, useState } from 'react'
import './index.css'

function App() {
  const [messages, setMessages] = useState(["hi there"]);
  //@ts-ignore
  const wsRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data])
    }
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }
  }, []);

  return (
    <div className='h-screen bg-black'>
      <br /><br /><br />
      <div className='h-[85vh] text-white'>
        {messages.map(message => <div className='m-8'><span className='bg-white text-black rounded p-4'>{message}</span></div>)}
      </div>
      <div className='flex'>
        <input type="text" id="message" className='w-full p-3 bg-white' />
        <button onClick={() => {
          //@ts-ignore
          const message = document.getElementById("message")?.value;
          //@ts-ignore
          wsRef.current.send(JSON.stringify({
            type: "chat",
            payload: {
              message: message
            }
          }))
        }} className='bg-purple-600 text-white p-3'>Send message</button>
      </div>
    </div>
  )
}

export default App
