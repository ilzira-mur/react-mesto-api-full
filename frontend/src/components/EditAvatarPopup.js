import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {

    const EditAvatarRef = React.useRef('');

    React.useEffect(() => {
      EditAvatarRef.current.value = '';
    }, [isOpen]);

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateAvatar({
          avatar: EditAvatarRef.current.value,
        });
      }
    return (
        <PopupWithForm title={'Обновить аватар'} name={'avatar-edit'} isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
                <input ref={EditAvatarRef} type="url" id="avatarlink" name="avatarlink" className="popup__input popup__input_type_avatar-edit" placeholder="Ссылка на аватарку" required/>
                <span className="popup__span-error" id="avatarlink-error"></span>
                <button type="submit" className="popup__button popup__button_type_save popup__button_type_avatar-edit">Сохранить</button>
        </PopupWithForm>
    )

}

export default EditAvatarPopup;