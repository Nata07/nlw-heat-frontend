import styles from './styles.module.scss'
import {VscGithubInverted} from 'react-icons/vsc'
import { useContext } from 'react'
import { AuthContext } from '../../context'

export function LoginBox() {
  const { signInUrl } = useContext(AuthContext)

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>
      <a className={styles.buttonLogin} href={signInUrl}>
        <VscGithubInverted size="24"/>
        Login with github
      </a>
    </div>
  )
}