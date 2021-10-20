import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const AuthRoute = ({ component: Component, isAuth, ...rest }) => {
  return (
    <Route
      render={routerProps => {
        return (
          !isAuth
            ? <Component {...rest} />
            : <Redirect to={{ pathname: '/' }}/>
        )
      }}
    />
  )
}


const ProtectedRoute = ({ component: Component, isAuth, ...rest }) => {
    return (
      <Route
        render={routerProps => (
          isAuth
            ? <Component {...rest} />
            : <Redirect
              to={{ pathname: '/login' }}
            />
        )}
      />
    )
  }

export {AuthRoute, ProtectedRoute}