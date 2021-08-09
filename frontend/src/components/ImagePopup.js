import React from 'react';

function ImagePopup({card, onClose}) {
    return (
        <article className={card.link ? "popup popup_type_zoomed popup_type_opened" : "popup popup_type_zoomed"} id="popup_type_zoomed">
            <div className="popup__zoomed">
                <button type="button" className="popup__button popup__button_type_close" aria-label="close" onClick={onClose}/>
                <img className="popup__picture" src={card.link} alt={card.name} />
                <p className="popup__caption">{card.name}</p>
            </div>
        </article>
    );
}

export default ImagePopup;