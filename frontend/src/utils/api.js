class Api {
    constructor(config) {
        this._url = config.url;
        this._headers = config.headers;
    }
    
    getHeader() {
      const token = localStorage.getItem('token');
      return {
          ...this._headers,
          Authorization: `Bearer ${token}`,
      }
  }

  // проверка ответа сервера
  _getResponseData(res){
    if (res.ok) {
      return res.json();
    } return Promise.reject(`Произошла ошибка - ${res.status}`);
  }

    getInitialCards() {
        return fetch(`${this._url}/cards`, {
            method: 'GET',
            headers: this.getHeader(),
        }).then(this._getResponseData);
    }

    addNewCard(data) {
    return fetch(`${this._url}/cards`, {
        method: 'POST',
        headers: this.getHeader(),
        body: JSON.stringify({
          name: data.name,
          link: data.link
        })
      }).then(this._getResponseData);
  }

   deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      method: "DELETE",
      headers: this.getHeader(),
    }).then(this._getResponseData);
  }

  changeUserAvatar(avatar) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: this.getHeader(),
      body: JSON.stringify(avatar),
    }).then(this._getResponseData);
  }

  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
        method: 'GET',
        headers: this.getHeader(),
      }).then(this._getResponseData);
  }

  setUserInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this.getHeader(),
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
      }).then(this._getResponseData);
  }

  setLike(id) {
    return fetch(`${this._url}/cards/likes/${id}`, {
      method: "PUT",
      headers: this.getHeader(),
    }).then(this._getResponseData);
  }

  deleteLike(id) {
    return fetch(`${this._url}/cards/likes/${id}`, {
      method: "DELETE",
      headers: this.getHeader(),
    }).then(this._getResponseData);
  }

  changeLikeCardStatus(id, isLiked) {
    return fetch(`${this._url}/cards/likes/${id}`, {
      method: `${isLiked ? "PUT" : "DELETE"}`,
      headers: this.getHeader(),
    }).then(this._getResponseData);
  }

}

const api = new Api({
  url: 'oops.nomoredomains.club',
  headers: {
    //authorization: `8865dd26-fca5-4131-9c42-5dfb67b3f292`,
    "Content-Type": "application/json",
    'Accept': 'application/json'
  },
});

export default api;