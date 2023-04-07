import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import image from '../Images/dogs/image2.jpeg'
import { useSignup } from "../Hooks/useSignup"
import { useGoogleLogin } from '@react-oauth/google'


export default function Signup() {
  const [ firstname, setFirstName ] = useState('')
  const [ lastname, setLastName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const { signup, error, isLoading, dispatch, setIsLoading, setError } = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(firstname, lastname, email, password)
  }
  
  const googleLogin = useGoogleLogin({
      onSuccess: (codeResponse) => loginUsingToken(codeResponse.access_token),
      onError: (error) => console.log('Google: Signup Failed:', error)
  })

  const loginUsingToken = async (access_token) => {
  
      const response = await fetch('http://localhost:5000/signup', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ access_token })
      })

      const json = await response.json()

      console.log(json)

      if (!response.ok) {
          setIsLoading(false)
          setError(json.error)
      }

      if (response.ok) {
          // save the user to local storage
          localStorage.setItem('user', JSON.stringify(json))

          // update the auth context
          dispatch({type: 'LOGIN', payload: json})

          // update loading state
          setIsLoading(false)
      }
  }

  return (
    <>
      <div class="container">
        <div class="card shadow-lg o-hidden border-0 my-5">
            <div class="card-body p-0">
                <div class="row">
                    <div class="col-lg-5 d-none d-lg-flex">
                        <div class="flex-grow-1 bg-register-image" style={{backgroundImage: `url(${image})`}}></div>
                    </div>
                    <div class="col-lg-7">
                        <div class="p-5">
                            <div class="text-center">
                                <h4 class="text-dark mb-4">Create an Account!</h4>
                            </div>

                            {error ? 
                              <div class="alert alert-danger" role="alert">
                                  {error}
                              </div>
                              :
                              null
                            }

                            <form class="user" onSubmit={handleSubmit}>
                                <div class="row mb-3">
                                    <div class="col-sm-6 mb-3 mb-sm-0">
                                      <input 
                                        class="form-control form-control-user" 
                                        type="text" 
                                        placeholder="First Name"
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required={true}
                                      />
                                      </div>
                                    <div class="col-sm-6">
                                      <input 
                                        class="form-control form-control-user" 
                                        type="text" 
                                        placeholder="Last Name" 
                                        onChange={(e) => setLastName(e.target.value)}
                                        required={true}
                                      />
                                    </div>
                                </div>
                                <div class="mb-3">
                                  <input 
                                    class="form-control form-control-user" 
                                    type="email" 
                                    placeholder="Email Address" 
                                    name="email" 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    value={email}   
                                    required={true}
                                  />
                                </div>

                                <div class="mb-3">
                                  <input 
                                    class="form-control form-control-user" 
                                    type="password" 
                                    placeholder="Password" 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    value={password} 
                                    required={true}
                                  />
                                </div>
 
                                <button class="btn btn-primary d-block btn-user w-100" type="submit" disabled={isLoading}>Register Account</button>
                                <hr />
                                <button 
                                    class="btn btn-primary d-block btn-google btn-user w-100 mb-2" 
                                    onClick={() => googleLogin()}
                                    type="button"
                                >
                                    <i class="fab fa-google"></i>  Signup with Google
                                </button>
                                <hr />
                            </form>
                            <div class="text-center">
                              <NavLink className="nav-link" to="/login">
                                <a class="small" href="login.html">Already have an account? Login!</a>
                              </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}
