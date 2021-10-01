import { initializeApp } from 'firebase/app'
import { getFirestore, collection,addDoc,getDocs,getDoc,doc,updateDoc,deleteDoc,orderBy,query } from 'firebase/firestore/lite';
import { createUserWithEmailAndPassword,getAuth,updateProfile,signInWithEmailAndPassword, signOut } from '@firebase/auth'
import {getStorage,uploadBytes,ref,getDownloadURL} from 'firebase/storage'
import firebaseConfig from './config'

class Firebase{
    constructor()
    {
        this.app = initializeApp(firebaseConfig)
        this.auth = getAuth()
        this.db = getFirestore(this.app)
        this.storageApp = getStorage(this.app)
        
    }

    async registrar(nombre,email,password)
    {
        const nuevoUsuario = await createUserWithEmailAndPassword(this.auth,email,password)
        return await updateProfile(nuevoUsuario.user,{
            displayName:nombre
        })
    }

    async login(email,password)
    {
        return await signInWithEmailAndPassword(this.auth,email,password)
    }

    async logout(){
        await signOut(this.auth)
    }

    async createProduct(nameCollection,data){
        await addDoc(collection(this.db,nameCollection),data)
    }
    
    async uploadFile(file){
        const storageRef = ref(this.storageApp,'productos-'+file.name)
        await uploadBytes(storageRef,file)
        return await getDownloadURL(storageRef)
    }

    async getProducts(order)
    {
        const productsCol = collection(this.db,'productos')
        const q = query(productsCol,orderBy(order,'desc'))
        const productSnapshot = await getDocs(q)
        const productList = await productSnapshot.docs.map(product => {
            return {
                id:product.id,
                ...product.data()
            }
        })
        return productList
    }

    async getProduct(id)
    {
        const docRef = doc(this.db,'productos',id)
        const docSnap = await getDoc(docRef)
        return docSnap
    }

    async update(id,data)
    {
        const docRef = doc(this.db,'productos',id)
        await updateDoc(docRef,data)
    }

    async delete(id)
    {
        const docRef = doc(this.db,'productos',id)
        await deleteDoc(docRef)
    }
}

const firebase = new Firebase()

export default firebase