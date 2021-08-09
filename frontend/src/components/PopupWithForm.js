import React from 'react';

function PopupWithForm(props) {
    return (
        <article className={`${props.isOpen ? `popup popup_type_${props.name} popup_type_opened` : `popup popup_type_${props.name}`}`}>
            <div className="popup__container">
                <button className="popup__button popup__button_type_close" type="button" onClick={props.onClose}/>
                <h3 className="popup__title">{props.title}</h3>
                <form className={`popup__form popup__form_type_${props.name}`} name={`${props.name}`} onSubmit={props.onSubmit} noValidate>
                    {props.children}
                </form>
            </div>
        </article>
    );
}

export default PopupWithForm;