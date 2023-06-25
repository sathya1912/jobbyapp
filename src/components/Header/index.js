import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const websiteLogo = 'https://assets.ccbp.in/frontend/react-js/logo-img.png'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">
            <img src={websiteLogo} alt="website logo" />
          </Link>
        </li>
        <li>
          <Link to="/">
            <h1>Home</h1>
          </Link>
          <Link to="/jobs">
            <h1>Jobs</h1>
          </Link>
        </li>
        <li>
          <button type="button" onClick={onClickLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
