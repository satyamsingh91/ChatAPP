import axios from "axios"
import { create } from "zustand"
import { axiosInstance } from "../lib/axious"
import toast from "react-hot-toast"
import { LogOut } from "lucide-react"

export const useAuthStore = create((set) => ({
    authUser: null,
    isSignUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    // Check if the user is authenticated
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })
        } catch (error) {
            console.log("Error in checkAuth:", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    // Signup function
    signup: async (data) => {
        set({isSigningUp: true})
      try {
        const res=await axiosInstance.post("/auth/signup",data)
        set({authUser:res.data})
        toast.success("Account created successfully")
        
        
      } catch (error) {
        toast.error(error.response.data.message)
      } finally{
        set({isSigningUp:false})
      }
        
    },

    // Login Function
    login:async(data)=>{
      set({isLoggingIn:true});
      try {
        const res=await axiosInstance.post("/auth/login",data);
        set({authUser:res.data})
        toast.success("Logged in successfully") 
      } catch (error) {
        toast.error(error.response.data.message)
      } finally{
        set({isLoggingIn:false})
      }
    },


    // Logout Function
    logout:async ()=>{
      try {
        await axiosInstance.post("/auth/logout")
        set({authUser:null})
        toast.success("Logged out successfully")
      } catch (error) {
         toast.error(error.response.data.message)
      }

    },

    // updateProfile:async(data)=>{
    //   set({isUpdatingProfile:true});
    //   try {
    //     const res=await axiosInstance.put("/auth/update-profile",data)
    //     set({authUser:res.data})
    //     toast.success("Profile updated successfully") 
    //   } catch (error) {
    //     console.log("Error in update profile:",error);
    //     toast.error(error.response.data.message)
    //   } finally{
    //     set({isUpdatingProfile:false})
    //   }
    // }
    updateProfile: async (data) => {
      // console.log(data, "dfghjk");
  
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
        console.log("Error in update profile", error);
        toast.error(error.response.data.message);
      } finally {
        set({ isUpdatingProfile: false });
      }
    },
}))
