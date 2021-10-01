import React from 'react'
import styled from 'styled-components'

const Titulo = styled.h1`
    margin-top: 5rem;
    text-align: center;
`

function Error404() {
    return (
        <Titulo>
            Producto no existente
        </Titulo>
    )
}

export default Error404
