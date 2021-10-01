import Router,{useRouter} from 'next/router'
import React, { useState,useContext } from 'react'
import Layout from '../components/layout/Layout'
import {Formulario,Campo,InputSubmit,Titulo, Error} from '../components/ui/Formulario'
import {FirebaseContext} from '../firebase'
import useValidacion from '../hooks/useValidacion'
import validarCrearProducto from '../validacion/validarCrearProducto'

const STATE_INICIAL = {
    nombre:'',
    empresa:'',
    // imagen:'',
    url:'',
    descripcion:''
}



function NuevoProducto() {
    const [nombreImagen,setNombreImagen] = useState('')
    const [subiendo,setSubiendo] = useState(false)
    const [progreso,setProgreso] = useState(0)
    const [urlImagen,setUrlImagen] = useState('')

    const [error,setError] = useState(false)
    const {valores,errores,submitForm,handleChange,handleSubmit,handleBlur} = useValidacion(STATE_INICIAL,validarCrearProducto,crearProducto)

    const {nombre,empresa,imagen,url,descripcion} = valores

    const router = useRouter()
    //context con las operaciones crud de firebase
    const {usuario,firebase} = useContext(FirebaseContext)

    async function crearProducto(){
        if(!usuario){
            return router.push('/login')
        }

        const producto = {
            nombre,
            empresa,
            url,
            urlImagen,
            descripcion,
            votos:0,
            comentarios:[],
            creado:Date.now(),
            creador:{
                id:usuario.uid,
                nombre:usuario.displayName
            },
            haVotado:[]
        }

        //insertarlo en la BD
        
        try {
            const urlImage = await firebase.uploadFile(nombreImagen)
            producto.urlImagen = urlImage
            await firebase.createProduct('productos',producto)
            router.push('/')
        } catch (error) {
            console.log(error.message);
        }
    }

    const onChange = async (e) => {
        const file = e.target.files[0]; // acceder al file subido con el input
        setNombreImagen(file)
    };

    if(!usuario) return router.push('/login')

    return (
        <div>
            <Layout>
                <>
                    <Titulo>Nuevo Producto</Titulo>
                    <Formulario onSubmit={handleSubmit}>
                        <fieldset>
                            <legend>Información General</legend>
                            <Campo>
                                <label htmlFor="nombre">Nombre</label>
                                <input type="text" id="nombre" placeholder="Nombre del producto" name="nombre" value={nombre} onChange={handleChange} onBlur={handleBlur}/>
                            </Campo>

                            {errores.nombre && <Error>{errores.nombre}</Error>}
                            <Campo>
                                <label htmlFor="empresa">Empresa</label>
                                <input type="text" id="empresa" placeholder="Nombre Empresa o Compañia" name="empresa" value={empresa} onChange={handleChange} onBlur={handleBlur}/>
                            </Campo>
                            {errores.empresa && <Error>{errores.empresa}</Error>}

                            <Campo>
                                <label htmlFor="imagen">Imagen</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="imagen"
                                    name="imagen"
                                    value={imagen}
                                    onChange={onChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            {errores.imagen && <Error>{errores.imagen}</Error>}

                            <Campo>
                                <label htmlFor="url">URL</label>
                                <input type="url" id="url" name="url" placeholder="URL de tu producto" value={url} onChange={handleChange} onBlur={handleBlur}/>
                            </Campo>
                            {errores.url && <Error>{errores.url}</Error>}
                        </fieldset>

                        <fieldset>
                            <legend>Sobre tu Producto</legend>
                            <Campo>
                                <label htmlFor="descripcion">Descripción</label>
                                <textarea id="descripcion" name="descripcion" value={descripcion} onChange={handleChange} onBlur={handleBlur}/>
                            </Campo>
                            {errores.descripcion && <Error>{errores.descripcion}</Error>}
                        </fieldset>

                        {error && <Error>{error}</Error>}
                        <InputSubmit type="submit" value="Crear Producto"/>
                    </Formulario>
                </>
            </Layout>
        </div>
    )
}

export default NuevoProducto
