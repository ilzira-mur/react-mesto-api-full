import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({card, onCardClick, onDeleteCard, onCardLike}) {
  
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = (`card__button-delete ${isOwn ? 'card__button-delete' : 'card__button-delete_hidden'}`);
  const isLiked = card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = (`card__button-like ${isLiked ? 'card__button-like_active' : 'card__button-like'}`);

    const handleClick = () => {
      onCardClick(card);
    }

    const handleLikeClick = () => {
      onCardLike(card);
    }

    const handleDeleteClick = () => {
      onDeleteCard(card);
    }
     
    return (
        <li className="card">
            <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}/>
            <img className="card__picture" src={card.link} alt={card.name} onClick={handleClick}/>
            <div className="card__info">
              <h2 className="card__name">{card.name}</h2>
              <div className="card__like-container">
                <button type="button" className={cardLikeButtonClassName} aria-label="like" onClick={handleLikeClick}/>
                <span className="card__like-counter">{card.likes.length}</span>
              </div>
            </div>
        </li> 
    );
}

export default Card;