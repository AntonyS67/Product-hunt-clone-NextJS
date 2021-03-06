import Router from 'next/router'
import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import {Formulario,Campo,InputSubmit,Titulo, Error} from '../components/ui/Formulario'
import firebase from '../firebase'
import useValidacion from '../hooks/useValidacion'
import validarCrearCuenta from '../validacion/validarCrearCuenta'

const STATE_INICIAL = {
    nombre:'',
    email:'',
    password:''
}



const CrearCuenta = () => {
    const [error,setError] = useState(false)
    const {valores,errores,submitForm,handleChange,handleSubmit,handleBlur} = useValidacion(STATE_INICIAL,validarCrearCuenta,crearCuenta)
    
    const {nombre,email,password} = valores
    
    async function crearCuenta(){
        try {
            await firebase.registrar(nombre,email,password)
            Router.push('/')
        } catch (error) {
            console.error('Hubo un error al crear usuario'+error)
            setError(error.message)
        }
    }

    return (
        <div>
            <Layout>
                <>
                    <Titulo>Crear Cuenta</Titulo>
                    <Formulario onSubmit={handleSubmit}>
                        <Campo>
                            <label htmlFor="nombre">Nombre</label>
                            <input type="text" id="nombre" placeholder="Tu Nombre" name="nombre" value={nombre} onChange={handleChange} onBlur={handleBlur}/>
                        </Campo>
                        {errores.nombre && <Error>{errores.nombre}</Error>}
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
                        <InputSubmit type="submit" value="Crear Cuenta"/>
                    </Formulario>
                </>
            </Layout>
        </div>
    )
}

export default CrearCuenta
