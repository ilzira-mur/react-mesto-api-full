import React from 'react';
import logo from '../images/logo.svg';
import { Route, Link, Switch } from 'react-router-dom';

function Header(props) {
    
    
    return (
        <header className="header">
            <Link to="/" className="link"><img className="header__logo" src={logo} alt="Логотип"/></Link>
            <div className="header__login">
                <Switch>
                    <Route path="/signup">
                        <Link to="/signin" className="header__status header__status_type_link">Войти</Link>
                    </Route>
                    <Route path="/signin">
                        <Link to="/signup" className="header__status header__status_type_link">Регистрация</Link>
                    </Route>
                    <Route path="/">
                        <p className="header__status">{props.email}</p>
                        <p className="header__status header__status_type_link" onClick={props.onSignOut}>Выйти</p>
                    </Route>
                </Switch>
            </div>
        </header>
    );
}

export default Header;