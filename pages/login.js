import Router from 'next/router'
import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import {Formulario,Campo,InputSubmit,Titulo, Error} from '../components/ui/Formulario'
import firebase from '../firebase'
import useValidacion from '../hooks/useValidacion'
import validarIniciarSesion from '../validacion/validarIniciarSesion'


const STATE_INICIAL = {
    email:'',
    password:''
}

function Login() {
    const [error,setError] = useState(false)
    const {valores,errores,handleChange,handleSubmit,handleBlur} = useValidacion(STATE_INICIAL,validarIniciarSesion,iniciarSesion)
    
    const {email,password} = valores

    async function iniciarSesion(){
        try {
            const usuario = await firebase.login(email,password)
            Router.push('/')
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div>
            <Layout>
                <>
                    <Titulo>Iniciar Sesión</Titulo>
                    <Formulario onSubmit={handleSubmit}>
                        <Campo>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="Tu Email" name="email" value={email} onChange={handleChange} onBlur={handleBlur}/>
                        </Campo>
                        {errores.email && <Error>{errores.email}</Error>}
                        <Campo>
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" placeholder="Tu Contraseña" name="password" value={password} onChange={handleChange} onBlur={handleBlur}/>
                        </Campo>
                        {errores.password && <Error>{errores.password}</Error>}
                        {error && <Error>{error}</Error>}
                        <InputSubmit type="submit" value="Iniciar Sesión"/>
                    </Formulario>
                </>
            </Layout>
        </div>
    )
}

export default Login
