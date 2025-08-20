import { db } from "./firebase";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

export const addLink = (uid, data) => addDoc(collection(db, "users", uid, "links"), data);
export const updateLink = (uid, id, data) => updateDoc(doc(db, "users", uid, "links", id), data);
export const removeLink = (uid, id) => deleteDoc(doc(db, "users", uid, "links", id));
