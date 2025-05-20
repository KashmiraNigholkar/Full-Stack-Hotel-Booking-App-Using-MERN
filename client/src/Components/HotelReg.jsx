import React, { useState, useEffect } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const HotelReg = () => {
  const { setShowHotelReg, axios, setIsOwner, getToken } = useAppContext();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setAddress("");
    setContact("");
    setCity("");
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowHotelReg(false);
        resetForm();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setShowHotelReg]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (loading) return;

    if (!/^\d{10}$/.test(contact)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();

      const { data } = await axios.post(
        `/api/hotels/`,
        { name, contact, address, city },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsOwner(true);
        setShowHotelReg(false);
        resetForm();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowHotelReg(false);
    resetForm();
  };

  return (
    <div
      onClick={closeModal}
      className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/70"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex bg-white rounded-xl max-w-4xl max-md:mx-2"
      >
        <img
          src={assets.regImage}
          alt="Register Illustration"
          className="w-1/2 rounded-xl hidden md:block"
        />
        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
          <img
            src={assets.closeIcon}
            alt="Close"
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
            onClick={closeModal}
          />
          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

          {/* Hotel Name */}
          <div className="w-full mt-4">
            <label htmlFor="name" className="font-medium text-gray-500">
              Hotel Name
            </label>
            <input
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Type here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          {/* Phone */}
          <div className="w-full mt-4">
            <label htmlFor="contact" className="font-medium text-gray-500">
              Mobile Number
            </label>
            <input
              id="contact"
              type="tel"
              onChange={(e) => setContact(e.target.value)}
              value={contact}
              placeholder="10-digit mobile number"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
              pattern="[0-9]{10}"
              title="Enter a valid 10-digit mobile number"
            />
          </div>

          {/* Address */}
          <div className="w-full mt-4">
            <label htmlFor="address" className="font-medium text-gray-500">
              Address
            </label>
            <input
              id="address"
              type="text"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          {/* City Dropdown */}
          <div className="w-full mt-4 max-w-60 mr-auto">
            <label htmlFor="city" className="font-medium text-gray-500">
              City
            </label>
            <select
              id="city"
              onChange={(e) => setCity(e.target.value)}
              value={city}
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            >
              <option value="">Select City</option>
              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
            } transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
