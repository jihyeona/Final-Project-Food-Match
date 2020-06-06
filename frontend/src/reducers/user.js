import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  login: {
    accessToken: null,
    errorMessage: null,
    secretMessage: null,
    userName: null,
    profileImage: null,
    email: null,
  },
}

export const user = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setLoginResponse: (state, action) => {
      const { accessToken, userId, email } = action.payload
      console.log(`Access Token: ${accessToken}, User Id: ${userId}`)
      state.login.accessToken = accessToken
      state.login.userId = userId
      state.login.email = email
    },
    setSecretMessage: (state, action) => {
      const { secretMessage } = action.payload;
      console.log(`Secret Message: ${secretMessage}`);
      state.login.secretMessage = secretMessage;
    },
    setErrorMessage: (state, action) => {
      const { errorMessage } = action.payload;
      console.log(`Error Message: ${errorMessage}`);
      state.login.errorMessage = errorMessage;
    },
    setUserName: (state, action) => {
      const { userName } = action.payload;
      console.log(`User name: ${userName}`);
      state.login.userName = userName;
    },
    setProfileImage: (state, action) => {
      const { profileImage } = action.payload
      state.login.profileImage = profileImage
    },
  },
})

//Thunks
export const signup = (name, email, password) => {
  const SIGNUP_URL = 'http://localhost:8080/users'
  return (dispatch) => {
    console.log('Trying to sign up ...')
    fetch(SIGNUP_URL, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(console.log('posted registration info to API...'))
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw 'Could not creat account. Try a different username.'
      })
      .then((json) => {
        console.log(json)
        dispatch(user.actions.setLoginResponse({ accessToken: json.accessToken, userId: json.userId, email: json.email }))
        dispatch(user.actions.setUserName({ userName: json.name }))
        dispatch(user.actions.setErrorMessage({ errorMessage: null }))
      })
      .catch((err) => {
        dispatch(user.actions.setErrorMessage({ errorMessage: err }))
      })
  }
}

export const login = (name, password) => {
  const LOGIN_URL = 'http://localhost:8080/sessions'
  return (dispatch) => {
    fetch(LOGIN_URL, {
      method: 'POST',
      body: JSON.stringify({ name, password }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(console.log('Logging in...'))
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw 'Unable to log in. Please check your username and password'
      })
      .then((json) => {
        console.log(json)
        // Save the login info 
        dispatch(user.actions.setLoginResponse({ accessToken: json.accessToken, userId: json.userId, email: json.email }))
        dispatch(user.actions.setProfileImage({ profileImage: json.profileImage }))
        dispatch(user.actions.setUserName({ userName: json.name }))
        dispatch(user.actions.setErrorMessage({ errorMessage: null }))
      })
      .catch((err) => {
        dispatch(user.actions.setErrorMessage({ errorMessage: err }))
        dispatch(logout())
      })
  }
}

export const logout = () => {
  return (dispatch) => {
    console.log('trying to log out ...')
    dispatch(user.actions.setLoginResponse({ accessToken: null, userId: 0, email: null }))
    dispatch(user.actions.setSecretMessage({ secretMessage: null }))
    dispatch(user.actions.setUserName({ userName: null }))
    dispatch(user.actions.setProfileImage({ profileImage: null }))
  }
}

export const UpdateProfilePic = (profileImage) => {

  const PROFILE_URL = `http://localhost:8080/users`

  return (dispatch, getState) => {
    const userId = getState().user.login.userId
    const accessToken = getState().user.login.accessToken
    console.log('Trying to update the profile image ...')
    const formData = new FormData()
    formData.append('image', profileImage)

    fetch(`${PROFILE_URL}/${userId}`, { method: 'PUT', body: formData, headers: { Authorization: accessToken } })
      .then(console.log('posted new profile image file to API...'))
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw 'Could not update the profile image. Please try again.'
      })
      .then((json) => {
        console.log(json)
        dispatch(user.actions.setProfileImage({ profileImage: json.profileImage }))
        dispatch(user.actions.setErrorMessage({ errorMessage: null }))
      })
      .catch((err) => {
        dispatch(user.actions.setErrorMessage({ errorMessage: err }))
      })
  }
}

export const addpoll = (title, fileInput) => {
  const POLL_URL = 'http://localhost:8080/polls'
  const formData = new FormData()
  formData.append('pollimage', fileInput.current.files[0])
  formData.append('title', title)
  return (dispatch) => {
    console.log('Trying to create a poll ...')
    fetch(POLL_URL, {
      method: 'POST',
      body: formData,
    })
      .then(console.log('posted poll info to API...'))
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw 'Could not creat a poll. Try a different title.'
      })
      .then((json) => {
        console.log(json)
        // do something with the created poll info. probably add it to the state of poll?
      })
      .catch((err) => {
        dispatch(user.actions.setErrorMessage({ errorMessage: err }))
      })
  }
}

export const additem = (name, description, fileInput) => {
  const ITEM_URL = 'http://localhost:8080/polls/:pollId'
  const formData = new FormData()
  formData.append('itemimage', fileInput.current.files[0])
  formData.append('name', name)
  formData.append('description', description)
  return (dispatch) => {
    // console.log(`Trying to add an item to the poll id ${pollId}...`)
    fetch(ITEM_URL, {
      method: 'POST',
      body: formData,
    })
      .then(console.log('posted item info to API...'))
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw 'Could not add the item. Try again.'
      })
      .then((json) => {
        console.log(json)
        // do something with the created item.
      })
      .catch((err) => {
        dispatch(user.actions.setErrorMessage({ errorMessage: err }))
      })
  }
}


export const getSecretMessage = () => {
  const USERS_URL = 'http://localhost:8080/users'
  return (dispatch, getState) => {
    const accessToken = getState().user.login.accessToken
    const userId = getState().user.login.userId
    fetch(`${USERS_URL}/${userId}/secret`, {
      method: 'GET',
      // Include the accessToken to get the protected endpoint
      headers: { Authorization: accessToken },
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw 'Could not get information. Make sure you are logged in and try again.'
      })
      // SUCCESS: Do something with the information we got back
      .then((json) => {
        dispatch(user.actions.setSecretMessage({ secretMessage: JSON.stringify(json) }))
      })
      .catch((err) => {
        dispatch(user.actions.setErrorMessage({ errorMessage: err }))
      })
  }
}
