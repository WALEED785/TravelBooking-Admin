export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateBookingForm = (formData) => {
  const errors = {};
  
  if (!formData.userId) errors.userId = 'User ID is required';
  if (!formData.hotelId && !formData.flightId) {
    errors.bookingType = 'Either hotel or flight must be selected';
  }
  if (!formData.bookingDate) errors.bookingDate = 'Booking date is required';
  
  return Object.keys(errors).length ? errors : null;
};

export const validateHotelForm = (formData) => {
  const errors = {};
  
  if (!formData.name) errors.name = 'Name is required';
  if (!formData.destinationId) errors.destinationId = 'Destination is required';
  if (!formData.pricePerNight || formData.pricePerNight <= 0) {
    errors.pricePerNight = 'Valid price is required';
  }
  
  return Object.keys(errors).length ? errors : null;
};

export const validateFlightForm = (formData) => {
  const errors = {};
  
  if (!formData.airline) errors.airline = 'Airline is required';
  if (!formData.departureDestinationId) {
    errors.departureDestinationId = 'Departure destination is required';
  }
  if (!formData.arrivalDestinationId) {
    errors.arrivalDestinationId = 'Arrival destination is required';
  }
  if (!formData.departureTime) errors.departureTime = 'Departure time is required';
  if (!formData.arrivalTime) errors.arrivalTime = 'Arrival time is required';
  if (!formData.price || formData.price <= 0) {
    errors.price = 'Valid price is required';
  }
  
  return Object.keys(errors).length ? errors : null;
};