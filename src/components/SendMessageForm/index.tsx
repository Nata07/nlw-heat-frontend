import { FormEvent, useContext, useState } from 'react'
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc'
import { AuthContext } from '../../context'
import { api } from '../../services/api';
import styles from './styles.module.scss'

export function SendMEssageForm() {
  const {user, signOut} = useContext(AuthContext);
  const [message, setMessage] = useState('')

  async function handleSendMessagge(event: FormEvent) {
    event.preventDefault();
    if(!message.trim()){
      return;
    }

    await api.post('messages', {message})

    setMessage('')
  }

  return (
    <div className={styles.messageFormWrapper}>
      <button onClick={signOut} className={styles.buttonSignOut}>
        <VscSignOut size="32" />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}>
          {user?.name}
        </strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size="16" />
          {user?.login}
        </span>
      </header>
      <form onSubmit={handleSendMessagge} className={styles.sendMesssageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea 
          onChange={event => setMessage(event.target.value)}
          name="message" 
          id="message" 
          placeholder="Mensagem"
          value={message}
        />

        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  )
}