import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import HotelReg from './Components/HotelReg';
import Home from './pages/Home';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBooking from './pages/MyBooking';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import AddRoom from './pages/hotelOwner/AddRoom';
import ListRoom from './pages/hotelOwner/ListRoom';
import { useAppContext } from './context/AppContext';

const App = () => {
 
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showHotelReg } = useAppContext();

  return (
    <div>
      <Toaster />
      {/* Show Navbar for non-owner routes */}
      {!isOwnerPath && <Navbar />}
      {showHotelReg &&<HotelReg/>}
      


      <div className="min-h-[70vh]">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBooking />} />
          <Route path='/hotel-register' element={<HotelReg />} />

          {/* Owner routes with nested layout */}
          <Route path='/owner' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='add-room' element={<AddRoom />} />
            <Route path='list-room' element={<ListRoom />} />
          </Route>
        </Routes>
      </div>

      {/* Always show footer */}
      <Footer />
    </div>
  );
};

export default App;
