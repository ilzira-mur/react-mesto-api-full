import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({isOpen, onClose, onUpdateUser}) {

    const currentUser = React.useContext(CurrentUserContext);
    const [name, setName] = React.useState();
    const [description, setDescription] = React.useState();

    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
      }, [isOpen, currentUser]); 

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateUser({
          name: name,
          about: description,
        });
      } 

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }
   

    return (
      <PopupWithForm title={'Редактировать профиль'} name={'edit'} onSubmit={handleSubmit} isOpen={isOpen} onClose={onClose}>
            <input value={name || ''} onChange={handleNameChange} type="text" id ="profilename" name="profilename"  className="popup__input popup__input_type_name" placeholder="Имя" minLength="2" maxLength="40" required/>
            <span className="popup__span-error" id="profilename-error"></span>
            <input value={description || ''} onChange={handleDescriptionChange} type="text" id="profileabout" name="profileabout"  className="popup__input popup__input_type_about" placeholder="Профессия" minLength="2" maxLength="200" required/>
            <span className="popup__span-error" id="profileabout-error"></span>
            <button type="submit" className="popup__button popup__button_type_save popup__button_type_save-edit">Сохранить</button>
      </PopupWithForm>
    )
}

export default EditProfilePopup;