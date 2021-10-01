import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DetalleProducto from "../components/layout/DetalleProducto";
import Layout from "../components/layout/Layout";
import useProductos from '../hooks/useProductos';

function Buscar() {
    const [resultado,setResultado] = useState([])
    const router = useRouter()
    const {query:{q}} = router

    const {productos} = useProductos('creado')
    useEffect(()=>{
        const busqueda = q.toLowerCase()
        const filtros = productos.filter(producto => {
            return (
                producto.nombre.toLowerCase().includes(busqueda) ||
                producto.descripcion.toLowerCase().includes(busqueda)
            )
        })
        setResultado(filtros)
    },[q,productos])
    return (
        <div>
            <Layout>
                <div className="listado-productos">
                <div className="contenedor">
                    <ul className="bg-white">
                    {resultado.map(resultado => (
                        <DetalleProducto  key={resultado.id} producto={resultado}/>
                    ))}
                    </ul>
                </div>
                </div>
            </Layout>
        </div>
    )
}

export default Buscar
