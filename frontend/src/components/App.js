import React, { useState, useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/api';
import { Route, Switch, useHistory } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth';
import InfoTooltip from './InfoTooltip';


function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false); 
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isDeleteCardPopupOpen, setDeleteCardPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = React.useState(false);
  const [isAuthSuccess, setAuthSuccess] = React.useState(false);
  const history = useHistory();



useEffect(()=>{
  if (loggedIn) {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([userInfo, cards]) => {
        setCards(cards.reverse());
        setCurrentUser(userInfo)
      }).catch(err => console.log(`${err}`))
    }
  }, [loggedIn])


useEffect(() => {
    tokenCheck();
    // eslint-disable-next-line
  }, []);


  const tokenCheck = () => {
    const token = localStorage.getItem('token');
    if (token){
      auth.getContent(token)
      .then((res) => {
        if (res) {
          setUserData({
            email: res.email
          });
          setLoggedIn(true);
          history.push('/');
        }
      })
      .catch((err) => {
        if (err === 401) {
          console.log(`401 ??? ???????????????????? ?????????? ??????????????????????`);
        }
        if (err === 400) {
          console.log(`400 ??? ?????????? ???? ?????????????? ?????? ?????????????? ???? ?? ?????? ??????????????`);
        }
        else {
          console.log(`${err}`)
        }
      })
    }
  }
  
  const handleRegister = (email, password) => {
    auth.register(email, password)
      .then(data => {
        if (data) {
          setUserData({
            email: data.email,
            password: data.password
          });
          setInfoTooltipPopupOpen(true);
          setAuthSuccess(true)
          history.push('/signin');
        }
      })
      .catch((err) => {
        if (err === 400) {
          console.log(`400 - ?????????????????????? ?????????????????? ???????? ???? ??????????`);
          setInfoTooltipPopupOpen(true);
          setAuthSuccess(false)
        }
      });
  }

  const handleLogin = (email, password) => {
    auth.authorize(email, password)
      .then(data => {
        if (data.token) {
          setUserData({
            email: email,
            password: password
          });
          setLoggedIn(true);
          localStorage.setItem('token', data.token)
          history.push('/');
        }
      })
      .catch((err) => {
        if (err === 401) {
          console.log(`401 - ???????????????? ???????????????????????? ????????????`);
        }
        if (err === 400) {
          console.log(`400 - ?????????????????????? ?????????????????? ???????? ???? ??????????`);
        }
        setInfoTooltipPopupOpen(true);
        setAuthSuccess(false)
      });
  }


  const onSignOut = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    history.push('/signin');
  }


function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
        .then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    }).catch(err => console.log(`${err}`))
}

function handleCardDelete(card) {
    api.deleteCard(card._id)
        .then(() => {
            const deleteCards = cards.filter((c) => c._id !== card._id);
            setCards(deleteCards)
        }).catch(err => console.log(`${err}`))
}

function handleAddPlaceSubmit(card) {
    api.addNewCard(card)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    }).catch(err => console.log(`${err}`))
}

  const handleUpdateUser = (userInfo) => {
    api.setUserInfo(userInfo)
    .then((newUser) => {
        setCurrentUser(newUser);
        closeAllPopups();
    })
    .catch(err => console.log(`${err}`))
  }

  const handleUpdateAvatar = (userInfo) => {
    api.changeUserAvatar(userInfo)
    .then((avatar) => {
      setCurrentUser(avatar);
      closeAllPopups();
    })
    .catch(err => console.log(`${err}`))
  }

  const handleEditProfileClick = () => {
      setEditProfilePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
      setEditAvatarPopupOpen(true);
  };

  const handleAddPlaceClick = () => {
      setAddPlacePopupOpen(true);
  };  

  const closeAllPopups = () => {
      setEditAvatarPopupOpen(false);
      setEditProfilePopupOpen(false);
      setAddPlacePopupOpen(false);
      setDeleteCardPopupOpen(false);
      setInfoTooltipPopupOpen(false);
      setSelectedCard({});
  };


  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
      <Header onSignOut={onSignOut} email={userData.email} />
      <Switch>
        <ProtectedRoute exact path="/"
              component={Main}
              loggedIn={loggedIn}
              onEditProfile={handleEditProfileClick} 
              onEditAvatar={handleEditAvatarClick} 
              onAddPlace={handleAddPlaceClick}  
              onCardClick={setSelectedCard}
              handleCardDelete={handleCardDelete}
              handleCardLike={handleCardLike}
              cards={cards}
        />
        <Route path="/signup">
            <Register handleRegister={handleRegister} />
          </Route>
        <Route path="/signin">
            <Login handleLogin={handleLogin} />
        </Route>
      </Switch>
      {loggedIn && <Footer />}
      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
      <PopupWithForm title={'???? ???????????????'} name={'delete-card'} isOpen={isDeleteCardPopupOpen} onClose={closeAllPopups}>
            <button type="submit" className="popup__button popup__button_type_save popup__button_type_small">????</button>
      </PopupWithForm>
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      <InfoTooltip isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups} isAuthSuccess={isAuthSuccess} />
      </CurrentUserContext.Provider>
    </div>      
  );
}

export default App;