import styles from './styles.module.scss';
import io from 'socket.io-client';

import logoImg from '../../../assets/logo.svg'
import { api } from '../../services/api';
import { useEffect, useState } from 'react';

type User = {
  name: string;
  avatar_url: string;
}

type Message = {
  id: string;
  text: string;
  user: User;
}

let messageQueue: Message[] = []

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
  messageQueue.push(newMessage);
})

export function MessageList() {

  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    setInterval(() => {
      if(messageQueue.length > 0){
        setMessages(prevState => [
          messageQueue[0],
          prevState[0],
          prevState[1],
        ].filter(Boolean))

        messageQueue.shift()
      }
    }, 3000)
  }, [])

  useEffect(() => {
    api.get<Message[]>('messages/last3').then(response => {
      setMessages(response.data)
    })
  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="Dowhile" />

      <ul className={styles.messageList}>
      {messages.map(message => (
        <li key={message.id} className={styles.message} >
          <p className={styles.messageContent}>
            {message.text}
          </p>
          <div className={styles.messageUser}>
            <div className={styles.userImage}>
              <img src="http://github.com/diego3g.png" alt="Natanael" />
            </div>
            <span>{message.user.name}</span>
          </div>
        </li>
      ))}

        {/* <li className={styles.message}>
          <p className={styles.messageContent}>
            Não vejo a hora de começar esse evento, com certeza vai ser o melhor de todos os tempos, vamooo pra cima! 🔥🔥
          </p>
          <div className={styles.messageUser}>
            <div className={styles.userImage}>
              <img src="http://github.com/diego3g.png" alt="Natanael" />
            </div>
            <span>Natanael</span>
          </div>
        </li> */}
      </ul>
    </div>
  )
}