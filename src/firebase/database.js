import { ref, set, get } from 'firebase/database'; // Import necessary Firebase database functions
import { db } from './firebase';
export const saveUserChat = async (userId, chatData) => {
    try {
        const dbRef = ref(db, `usersAuthList/${userId}`); // Create a reference to the user's chat data
        await set(dbRef, chatData); // Set the chat data for the user
        console.log("Chat data saved successfully!");
    } catch (error) {
        console.error("Error saving chat data:", error);
        alert("Error saving chat data. Please try again later.");
    }
};
export const getUserData = async (userId) => {
    try {
        const dbRef = ref(db, `usersAuthList/${userId}`); // Create a reference to the user's chat data
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            return userData;
        } else {
            alert("No data available for the user.");
            return null;
        }
    } catch (error) {
        console.error("Error saving chat data:", error);
        alert("Error saving chat data. Please try again later.");
    }
};
