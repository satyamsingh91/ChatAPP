import { create } from "zustand";
import toast from "react-hot-toast";
// import { axiosInstance } from "../lib/axios.js"; // Fixed typo
import { axiosInstance } from "../lib/axious.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/user");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) return; // Prevent calling with null ID

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage:async(messageData)=>{
    const {selectedUser,messages}=get()
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,  messageData)
      set({messages:[...messages,res.data]})
    } catch (error) {
      toast.error(error.response.data.  message)
      
    }
  },
  subscribeToMessages:()=>{
    const {selectedUser}= get()
    if(!selectedUser) return;
    const socket =useAuthStore.getState().socket;
    
    socket.on("newMessage",(newMessage)=>{
      const isMessageSentFromSelectedUser=newMessage.senderId===selectedUser._id
      if(!isMessageSentFromSelectedUser) return;
      set({
        messages:[...get().messages,newMessage ]
      })
    })
  },

  unsubscribeFromMessages:()=>{
    const socket =useAuthStore.getState().socket
    socket.off("newMessage")

  },

  setSelectedUser: (selectedUser) => {
    // console.log("Selected User Updated:", selectedUser); // Debugging log
    set({ selectedUser });
    get().getMessages(selectedUser?._id); // Fetch messages when selecting a user
  },
}));
