import axios from "axios";
import ClientSession from "./client-session.js";

let API_BASE_URL = "https://aterera.herokuapp.com/api/";
// http://10.5.84.247:5000/explorer/
export default class Api {
  static API_BASE_URL = API_BASE_URL;

  static login = (email, password) => {
    const url = "users/login";
    if (email && password) {
      const regExp = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      return Api.create(url, {
        [regExp.test(email) ? "email" : "username"]: email,
        password: password,
        ttl: 300000000
      }).then(
        response => {
          ClientSession.storeAuth(response.data, err => {});
          return {
            success: true,
            message: "Logged in successfuly",
            user: response.data
          };
        },
        error => {
          if (error.response) {
            if (error.response.status === 401) {
              return {
                error: true,
                message: "Incorrect username or password"
              };
            }
            return {
              error: true,
              message: "Oops error occured please. Try Again"
            };
          }
          return {
            error: true,
            message: "Error: Not connected"
          };
        }
      );
    }
  };

  static logout = () => {
    ClientSession.getAccessToken(function(isLoggedIn, authData) {
      if (isLoggedIn && authData != null) {
        Api.create("users/logout", {})
          .then(response => {
            ClientSession.removeAuth(err => {});
            window.location = "#/login";
          })
          .catch(err => {
            ClientSession.removeAuth(err => {});
            window.location = "#/login";
          });
      }
    });
  };

  static signup = data => {};

  static create(pluralName, data, filter = null) {
    let url = API_BASE_URL + pluralName;
    if (filter) url += "?" + filter;

    return new Promise(function(resolve, reject) {
      ClientSession.getAccessToken(function(isLoggedIn, authData) {
        if (isLoggedIn && authData != null) {
          if (filter) url += "&access_token=" + authData.id;
          else url += "?access_token=" + authData.id;
        }

        axios
          .post(url, data)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }

  static createRelated(parentName, childName, id, data) {
    let url = API_BASE_URL + parentName + "/" + id + "/" + childName;

    return new Promise(function(resolve, reject) {
      ClientSession.getAccessToken(function(isLoggedIn, authData) {
        if (isLoggedIn && authData != null) {
          url += "?access_token=" + authData.id;
        }
        axios
          .post(url, data)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }

  static find(pluralName, id, filter) {
    let url = API_BASE_URL + pluralName;

    if (id) url += "/" + id;
    if (filter) url += "?" + filter;

    return new Promise(function(resolve, reject) {
      ClientSession.getAccessToken(function(isLoggedIn, authData) {
        if (isLoggedIn && authData != null) {
          if (filter) url += "&access_token=" + authData.id;
          else url += "?access_token=" + authData.id;
        }

        axios
          .get(url)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }

  static findRelated(parentName, childName, id, filter) {
    let url = API_BASE_URL + parentName + "/" + id + "/" + childName;
    if (filter) url += "?" + filter;

    return new Promise(function(resolve, reject) {
      ClientSession.getAccessToken(function(isLoggedIn, authData) {
        if (isLoggedIn && authData != null) {
          if (filter) url += "&access_token=" + authData.id;
          else url += "?access_token=" + authData.id;
        }

        axios
          .get(url)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }

  static update(pluralName, id, data) {
    let url = API_BASE_URL + pluralName + "/" + id;

    return new Promise(function(resolve, reject) {
      ClientSession.getAccessToken(function(isLoggedIn, authData) {
        if (isLoggedIn && authData != null) {
          url += "?access_token=" + authData.id;
        }

        axios({
          method: "patch",
          url: url,
          data: data
        })
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }

  static updateRelated(parentName, childName, parentId, childId, data) {
    let url = API_BASE_URL + parentName + "/" + parentId + "/" + childName;
    if (childId) url = url + "/" + childId;

    return new Promise(function(resolve, reject) {
      ClientSession.getAccessToken(function(isLoggedIn, authData) {
        if (isLoggedIn && authData != null) {
          url += "?access_token=" + authData.id;
        }

        axios({
          method: "put",
          url: url,
          data: data
        })
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }

  static destroy(pluralName, id) {
    let url = API_BASE_URL + pluralName + "/" + id;

    return new Promise(function(resolve, reject) {
      ClientSession.getAccessToken(function(isLoggedIn, authData) {
        if (isLoggedIn && authData != null) {
          url += "?access_token=" + authData.id;
        }
        axios({
          method: "delete",
          url: url
        })
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }

  static destroyAll(pluralName, whereJSON) {
    let url = API_BASE_URL + pluralName;

    let formData = new FormData();
    formData.append("where", JSON.stringify(whereJSON));

    return new Promise(function(resolve, reject) {
      ClientSession.getAccessToken(function(isLoggedIn, authData) {
        if (isLoggedIn && authData != null) {
          url += "?access_token=" + authData.id;
        }

        axios({
          method: "delete",
          url: url,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: "where=" + JSON.stringify(whereJSON)
        })
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }

  static upload(container, files, progressCallback) {
    let url = API_BASE_URL + "Containers/" + container + "/upload";

    let config = {
      onUploadProgress: progressCallback,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    let data = new FormData();
    for (let i in files) data.append("data", files[i]);

    return new Promise(function(resolve, reject) {
      ClientSession.getAccessToken(function(isLoggedIn, authData) {
        if (isLoggedIn && authData != null) {
          url += "?access_token=" + authData.id;
        }

        axios
          .post(url, data, config)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }

  static deleteFile(container, file) {
    let url = API_BASE_URL + "Containers/" + container + "/files/" + file;

    return new Promise(function(resolve, reject) {
      ClientSession.getAccessToken(function(isLoggedIn, authData) {
        if (isLoggedIn && authData != null) {
          url += "?access_token=" + authData.id;
        }

        axios({
          method: "delete",
          url: url
        })
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }

  static deleteFiles(container, files) {
    let url = API_BASE_URL + "Containers/deleteFiles";
    let options = { container, files };

    return new Promise(function(resolve, reject) {
      ClientSession.getAccessToken(function(isLoggedIn, authData) {
        if (isLoggedIn && authData != null) {
          url += "?access_token=" + authData.id;
        }

        axios
          .post(url, options)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }

  static replace(pluralName, data) {
    let url = API_BASE_URL + pluralName;

    return new Promise(function(resolve, reject) {
      ClientSession.getAccessToken(function(isLoggedIn, authData) {
        if (isLoggedIn && authData != null) {
          url += "?access_token=" + authData.id;
        }
        axios
          .put(url, data)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    });
  }
}
