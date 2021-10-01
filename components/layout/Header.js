import React, { useContext } from 'react'
import Buscar from '../ui/Buscar'
import Navegacion from './Navegacion'
import Link from 'next/link'
import styled from 'styled-components'
import styles from '../../styles/Header.module.css'
import Boton from '../ui/Boton'
import { FirebaseContext } from '../../firebase'

const ContenedorHeader = styled.div`
    max-width: 1200px;
    width: 95%;
    margin: 0 auto;
    @media (min-width:768px){
        display: flex;
        justify-content: space-between;
    }
`

const Logo = styled.p`
    color:var(--naranja);
    font-size: 4rem;
    line-height: 0;
    font-weight:700;
    font-family: 'Roboto Slab',serif;
    margin-right: 2rem;
    &:hover{
        cursor: pointer;
    }
`

function Header() {
    const {usuario,firebase} = useContext(FirebaseContext)
    return (
        <header className={styles.header}>
            <ContenedorHeader>
                <div className={styles.contenedorLinks}>
                    <Link href="/">
                        <Logo>P</Logo>
                    </Link>
                    {/* Buscador aqui */}
                    <Buscar/>
                    {/* Nav aqui */}
                    <Navegacion/>
                </div>
                <div className={styles.login}>
                    {usuario
                    ? (
                        <>
                            <p className={styles.texto}>Hola: {usuario.displayName}</p>
                            <Boton type="button" bgColor onClick={()=>firebase.logout()}>Cerrar Sesión</Boton>
                        </>
                    )
                    :(
                        <>
                            <Link href="/login">
                                <Boton bgColor>Login</Boton>
                            </Link>
                            <Link href="/crear-cuenta">
                                <Boton>Crear Cuenta</Boton>
                            </Link>
                        </>
                    )}
                </div>
            </ContenedorHeader>
        </header>
    )
}

export default Header
