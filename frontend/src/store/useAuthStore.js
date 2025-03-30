import axios from "axios";
import { create } from "zustand";
import { axiosInstance } from "../lib/axious";
import toast from "react-hot-toast";
import io from "socket.io-client";

const BASE_URL = "http://localhost:3000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // ✅ Check Auth
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✅ Signup Function
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ✅ Login Function
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ✅ Logout Function
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Logout failed. Please try again.";
      toast.error(errorMessage);
    }
  },

  // ✅ Profile Update Function
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error in updateProfile:", error);
      const errorMessage =
        error?.response?.data?.message || "Profile update failed.";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ✅ Connect Socket Corrected Version
  connectSocket: () => {
    const { authUser, socket } = get();

    // If already connected or no authUser, return
    if (!authUser || socket?.connected) return;


    // Create a new socket connection
    const newSocket = io(BASE_URL, { query: { userId: authUser._id } });

    // Handle socket events properly
    newSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // ✅ Correctly attach the getOnlineUsers event to newSocket
    newSocket.on("getOnlineUsers", (userId) => {
    
      set({ onlineUsers: userId });
    });

    // ✅ Update socket in state
    set({ socket: newSocket });
  },

  // ✅ Disconnect Socket
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null, onlineUsers: [] }); // Clear socket and online users after disconnect
    }
  },
}));
