/*
 * SETUP
 */
require('dotenv').config()

const { initializeApp } = require("firebase/app")
const { getFirestore, doc, setDoc, getDoc, query, collection, getDocs, deleteDoc, onSnapshot, updateDoc } = require("firebase/firestore")

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG)
const firebase_app = initializeApp(firebaseConfig)
const db = getFirestore(firebase_app)

console.log("Connected to Firebase!")

/*
 * EXPORTS
 */

/**
 * Returns an entire collection as an object with document IDs
 * as keys and document data as values
 * @param   {String} collection_name   Name of Firebase Collection
 * @returns {Object}                   Collection mapped as document to data
 */
const get_collection = async (collection_name) => {
   let q = query(collection(db, collection_name))
   let q_snap = await getDocs(q)
   let output = {}

   q_snap.forEach(doc => {
      output[doc.id] = doc.data()
   })

   return output
}

/**
 * Sets data of target document. Targts with a path, collection/document
 * @param {String} path Target Path (collection/document)
 * @param {Object} data New data to set
 */
const set_doc_path = async (path, data) => {
   let split_path = path.split("/")
   await set_doc(split_path[0], split_path[1], data)
}

/**
 * Sets data of target document.
 * @param {String} col_name   Name of Firebase Collection
 * @param {String} doc_name   ID of Firebase Document
 * @param {Object} data       New data to set
 */
const set_doc = async(col_name, doc_name, data) => {
   await setDoc(doc(db, col_name, doc_name), data)
}

/**
 * Returns data of document
 * @param   {String} col_name Name of Firebase Collection
 * @param   {String} doc_name ID of Firebase Document
 * @returns {Object}          Firebase Document Data
 */
const get_doc = async (col_name, doc_name) => {
   let doc_snap = await getDoc(doc(db, col_name, doc_name))

   if (doc_snap.exists()) 
      return doc_snap.data()
   return undefined
}

/**
 * Returns data of document
 * @param   {String} path Target Path (Collection/document)
 * @returns {Object}          Firebase Document Data
 */
const get_doc_path = async(path) => {
   let path_split = path.split("/")
   return get_doc(path_split[0], path_split[1])
}

/**
 * Updates data of a target document
 * @param   {String} col_name Name of Firebase Collection
 * @param   {String} doc_name ID of Firebase Document
 * @param {Object} data       New data to set
 * @returns {Object}          Firebase Document Data
 */
const update_doc = async (col_name, doc_name, data) => {
   await updateDoc(doc(db, col_name, doc_name), data)
}

/**
 * Updates data of target document
 * @param   {String} path Target Path (Collection/document)
 * @param {Object} data       New data to set
 * @returns {Object}          Firebase Document Data
 */
const update_doc_path = async(path, data) => {
   let path_split = path.split("/")
   return update_doc(path_split[0], path_split[1])
}

/**
 * Deletes an entire collection
 * @param {String} col_name Name of Firebase Collection
 */
const delete_collection = async(col_name) => {
   const q = query(collection(db, col_name))
   const q_snap = await getDocs(q)

   q_snap.forEach(async (doc_name) => {
      await deleteDoc(doc(db, col_name, doc_name.id))
   })
}

/**
 * Deletes a Document
 * @param {String} col_name Name of Firebase Collection
 * @param {String} doc_name ID of Firebase Document
 */
const delete_doc = async(col_name, doc_name) => {
   await deleteDoc(doc(db, col_name, doc_name))
}

/**
 * Deletes a Document by path
 * @param {String} path Target path (Collection/Document)
 */
const delete_doc_path = async(path) => {
   let path_split = path.split("/")
   await delete_doc(path_split[0], path_split[1])
}

/**
 * Listens to changes in a target collection, returning to a callback function
 * the most updated version
 * @param {String} col_name Target collection
 * @param {()} callback Function with argument as updated version
 */
const setup_collection_listener = (col_name, callback) => {
   let q = query(collection(db, col_name))
   let snap = onSnapshot(q, (q_snap) => {
      let output = {}

      q_snap.forEach(doc => {
         output[doc.id] = doc.data()
      })

      callback(output)
   })
}

/**
 * Listens to changes in a target document, starting a callback
 * function with the most updated version as an arg
 * @param col_name Collection Name
 * @param doc_id ID of target document
 * @param callback Function to call with most updated version as argument
 */
const setup_document_listener = (col_name, doc_id, callback) => {
   let snap = onSnapshot(doc(db, col_name, doc_id), (doc) => {
      callback(doc.data())
   })
}

/**
 * Listens to changes in a target document, starting a callback
 * function with the most updated version as an arg
 * @param path Path to document (collection/document)
 * @param callback Function to call with most updated version as argument
 */
const setup_document_listener_path = (path, callback) => {
   let path_split = path.split("/")
   let snap = onSnapshot(doc(db, path_split[0], path_split[1]), (doc) => {
      callback(doc.data())
   })
}

/*
 * bye bye !!
 */
module.exports = {
    get_collection,
    delete_collection,
    set_doc,
    set_doc_path,
    get_doc,
    get_doc_path,
    update_doc,
    update_doc_path,
    delete_doc,
    delete_doc_path,
    setup_collection_listener,
    setup_document_listener,
    setup_document_listener_path
 }