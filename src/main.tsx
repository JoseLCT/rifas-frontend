import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'
import { routerConfig } from './routes/RouterConfig'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider className='dark'>
      <RouterProvider router={routerConfig} />
    </NextUIProvider>
  </React.StrictMode>,
)
