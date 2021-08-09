import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({isOpen, onClose, onAddPlace}) {

    const cardNameRef = React.useRef();
    const cardLinkRef = React.useRef();
    
    React.useEffect(() => {
      cardNameRef.current.value = '';
      cardLinkRef.current.value = '';
    }, [isOpen]);

    function handleSubmit(e) {
        e.preventDefault();
        onAddPlace({
          name: cardNameRef.current.value,
          link: cardLinkRef.current.value,
        });
      }
      
    return (
        <PopupWithForm title={'Новое место'} name={'add-card'} isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
              <input ref={cardNameRef} type="text" id="cardname" name="cardname" className="popup__input popup__input_type_card-name" placeholder="Название" minLength="2" maxLength="30" required/>
              <span className="popup__span-error" id="cardname-error"></span>
              <input ref={cardLinkRef} type="url" id="cardlink" name="cardlink" className="popup__input popup__input_type_card-link" placeholder="Ссылка на картинку" required/>
              <span className="popup__span-error" id="cardlink-error"></span>
              <button type="submit" className="popup__button popup__button_type_save popup__button_type_save-card">Создать</button>
        </PopupWithForm>
    )
}

export default AddPlacePopup;