import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function verifyAdmin(uid: string): Promise<boolean> {
    try {
        const adminDocRef = doc(db, "admins", uid);
        const adminDoc = await getDoc(adminDocRef);
        return adminDoc.exists();
    } catch (error) {
        console.error("Error verifying admin:", error);
        return false;
    }
}
