import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth, useSession } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

// Set base URL globally
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken } = useAuth();
  const { session, isLoaded: sessionLoaded } = useSession();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);

  const [rooms, setRooms] = useState([]);

  const fetchRooms=async()=>{
    try{
      const {data}=await axios.get('/api/rooms/')
      if(data.success){
        setRooms(data.rooms)

      }else{
        toast.error(data.message)
      }
    }
    catch(error){
      toast.error(error.message)
    }
  }

  const fetchUser = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.warn("No token available yet");
        return;
      }

      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities || []);
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (userLoaded && sessionLoaded && user && session) {
      fetchUser();
    }
  }, [userLoaded, sessionLoaded, user, session]);

  useEffect(()=>{
    fetchRooms();
  },[])

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,rooms,setRooms
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
