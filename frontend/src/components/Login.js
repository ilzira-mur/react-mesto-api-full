import React, { useState } from 'react';

function Login({ handleLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

  const handleChangeEmail = (e) => {
      setEmail(e.target.value)
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  }
  function handleSubmit(e) {
    e.preventDefault();
    handleLogin(email, password);
  }

  
    

    return(
        <section className="login">
            <h2 className="login__title">Вход</h2>
            <form onSubmit={handleSubmit} className="login__form">
                <input className="login__input" id="username" required name="username" type="text" value={email} onChange={handleChangeEmail} placeholder="Email"/>
                <input className="login__input" id="password" required name="password" type="password" value={password} onChange={handleChangePassword} placeholder="Пароль"/>
                <button type="submit" className="button login__button">Войти</button>
            </form>
        </section>
    );
}

export default Login;