import { useRouter } from 'next/router'
import React,{useContext, useEffect,useState} from 'react'
import { formatDistanceToNow } from 'date-fns'
import es from 'date-fns/locale/es'
import styled from 'styled-components'
import Error404 from '../../components/layout/404'
import Layout from '../../components/layout/Layout'
import { FirebaseContext } from '../../firebase'
import {Campo,InputSubmit} from '../../components/ui/Formulario'
import Boton from '../../components/ui/Boton'

const Titulo = styled.h1`
    text-align: center;
    margin-top: 5rem;
`
const ContenedorProducto = styled.div`
    @media (min-width:768px){
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`

const ComentariosTitulo = styled.h2`
    margin-top:2rem;
`

const TextoVotar = styled.p`
    text-align: center;
`

const ListaLi = styled.li`
    border:1px solid #e1e1e1;
    padding: 2rem;
    span{
        font-weight: bold;
    }
`

const CreadorProducto = styled.p`
    padding:.5rem;
    background-color: #da552f;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`

function Producto() {
    const [producto,setProducto] = useState({})
    const [error,setError] = useState(false)
    const [comentario,setComentario] = useState({})
    const router = useRouter()
    const id = router.query.id

    const {firebase,usuario} = useContext(FirebaseContext)

    useEffect(()=>{
        if(id){
            if(!usuario){
                router.push('/login')
                return
            }
            const obtenerProducto = async () => {
                const product = await firebase.getProduct(id)
                if(product.exists()){
                    setProducto(product.data())
                }else{
                    setError(true)
                }
            }
            obtenerProducto()
        }
    },[id,usuario])
    

    if(Object.keys(producto).length === 0 && !error) return 'Cargando...'

    const {comentarios,creado,descripcion,empresa,creador,nombre,url,haVotado,urlImagen,votos} = producto

    const votarProducto = () => {
        //verificar si el usuario actual ha votado
        if(haVotado.includes(usuario.uid)) return;

        const nuevoTotal = votos + 1

        const nuevoHaVotado = [...haVotado,usuario.uid]

        const actualizarVoto = async () => {
            await firebase.update(id,{
                votos:nuevoTotal,
                haVotado:nuevoHaVotado
            })
        }
        actualizarVoto()

        setProducto({
            ...producto,
            votos:nuevoTotal,
            haVotado:nuevoHaVotado
        })
    }

    const comentarioChange = e => {
        setComentario({
            ...comentario,
            [e.target.name]:e.target.value
        })
    }

    const esCreador = id => {
        if(creador.id === id){
            return true
        }
    }

    const agregarComentario = (e) => {
        e.preventDefault()
        
        comentario.usuarioId = usuario.uid
        comentario.usuarioNombre = usuario.displayName

        const nuevosComentarios = [...comentarios,comentario]

        const actualizarComentarios = async () => {
            await firebase.update(id,{
                comentarios:nuevosComentarios
            })
        }
        actualizarComentarios()

        setProducto({
            ...producto,
            comentarios:nuevosComentarios
        })
    }

    const puedeBorrar = () => {
        if(!usuario) return false
        if(creador.id === usuario.uid){
            return true
        }
    }

    const eliminarProducto = async () => {
        if(creador.id !== usuario.uid) return router.push('/')

        if(!usuario) return router.push('/login')

        try {
            await firebase.delete(id)
            router.push('/')
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <Layout>
            <>
                {error ? <Error404/> : (
                    <div className="contenedor">
                        <Titulo>{nombre}</Titulo>
                        <ContenedorProducto>
                            <div>
                                <p>Publicado hace: {formatDistanceToNow(new Date(creado),{locale:es})}</p>
                                <p>Por: {creador.nombre} de {empresa} </p>
                                <img src={urlImagen}/>
                                <p>{descripcion}</p>

                                {usuario && (
                                    <>
                                        <h2>Agrega tu comentario</h2>
                                        <form
                                            onSubmit={agregarComentario}
                                        >
                                            <Campo>
                                                <input
                                                    type="text"
                                                    name="mensaje"
                                                    onChange={comentarioChange}
                                                />
                                            </Campo>
                                            <InputSubmit type="submit" value="Agregar comentario"/>
                                        </form>
                                        <ComentariosTitulo>Comentarios</ComentariosTitulo>
                                        {comentarios.length === 0 ? 'Aún no hay comentarios' : (
                                            <ul>
                                                {comentarios.map((comentario,index) => (
                                                    <ListaLi key={`${comentario.usuarioId}-${index}`}>
                                                        <p>{comentario.mensaje}</p>
                                                        <p>Escrito por: <span>{comentario.usuarioNombre}</span></p>
                                                        {esCreador(comentario.usuarioId) && <CreadorProducto>Es Creador</CreadorProducto>}
                                                    </ListaLi>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                )}
                            </div>
                            <aside>
                                <Boton
                                    target="_blank"
                                    bgColor
                                    href={url}
                                >Visitar URL</Boton>
                                
                                <div>
                                    <TextoVotar>{votos} Votos</TextoVotar>
                                    {usuario && (
                                        <Boton
                                            onClick={votarProducto}
                                        >Votar</Boton>
                                    )}
                                </div>
                            </aside>
                        </ContenedorProducto>
                        {puedeBorrar() && (
                            <Boton
                                onClick={eliminarProducto}
                            >Eliminar Producto</Boton>
                        )}
                    </div>
                )}
                
            </>
        </Layout>
    )
}

export default Producto
