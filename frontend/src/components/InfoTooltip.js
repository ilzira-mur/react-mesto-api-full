import React from 'react';
import declineSign from '../images/decline_sign.svg';
import successSign from '../images/success_sign.svg';

function InfoTooltip(props) {
    return (
    <article className={`${props.isOpen ? `popup popup_type_${props.name} popup_type_opened` : `popup popup_type_${props.name}`}`}>
        <div className="popup__container">
            <button type="button" className="popup__button popup__button_type_warning popup__button_type_close" aria-label="close" onClick={props.onClose} />
            <img className="popup__img" src={ `${props.isAuthSuccess ? `${successSign}` : `${declineSign}`}`} alt=""/>
            <p className="popup__paragraph">{ `${props.isAuthSuccess ? `Вы успешно зарегистрировались!` : `Что-то пошло не так! Попробуйте ещё раз.`}`}</p>
        </div>
    </article>

    )
}

export default InfoTooltip;