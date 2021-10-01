import { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../firebase'

function useProductos(orden) {
    const [productos,setProductos] = useState([])
    const {firebase} = useContext(FirebaseContext)
  
    useEffect(()=>{
      const obtenerProductos = async () => {
        const products = await firebase.getProducts(orden)
        setProductos(products)
      }
      obtenerProductos()
    },[])

    return {productos}
}

export default useProductos
