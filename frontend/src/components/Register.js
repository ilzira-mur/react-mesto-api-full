import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ handleRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    

    
  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(email, password);
  }

    return(
        <section className="login">
            <h2 className="login__title">Регистрация</h2>
            <form onSubmit={handleSubmit} className="login__form">
                <input className="login__input" id="username" required name="username" type="text" value={email} onChange={handleChangeEmail} placeholder="Email"/>
                <input className="login__input" id="password" required name="password" type="password" value={password} onChange={handleChangePassword} placeholder="Пароль"/>
                <button type="submit" className="button login__button">Зарегистрироваться</button>
            </form>
            <div className="login__signin">
                <p className="login__text">Уже зарегистрированы?</p>
                <Link to="/signin" className="login__text login__text_type_link">Войти</Link>
            </div>
        </section>
    );
}

export default Register;