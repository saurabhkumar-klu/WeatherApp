import { LocationSuggestion } from '../types/weather';
import { biharLocations } from './biharLocations';

// Comprehensive Indian locations database with villages, towns, and pincodes
export const indianLocationsDatabase: LocationSuggestion[] = [
  // Major Cities with coordinates
  { name: 'Mumbai', region: 'Maharashtra', country: 'India', fullName: 'Mumbai, Maharashtra, India', pincode: '400001', type: 'city', lat: 19.0760, lon: 72.8777 },
  { name: 'Delhi', region: 'Delhi', country: 'India', fullName: 'Delhi, Delhi, India', pincode: '110001', type: 'city', lat: 28.7041, lon: 77.1025 },
  { name: 'New Delhi', region: 'Delhi', country: 'India', fullName: 'New Delhi, Delhi, India', pincode: '110001', type: 'city', lat: 28.6139, lon: 77.2090 },
  { name: 'Bangalore', region: 'Karnataka', country: 'India', fullName: 'Bangalore, Karnataka, India', pincode: '560001', type: 'city', lat: 12.9716, lon: 77.5946 },
  { name: 'Bengaluru', region: 'Karnataka', country: 'India', fullName: 'Bengaluru, Karnataka, India', pincode: '560001', type: 'city', lat: 12.9716, lon: 77.5946 },
  { name: 'Chennai', region: 'Tamil Nadu', country: 'India', fullName: 'Chennai, Tamil Nadu, India', pincode: '600001', type: 'city', lat: 13.0827, lon: 80.2707 },
  { name: 'Kolkata', region: 'West Bengal', country: 'India', fullName: 'Kolkata, West Bengal, India', pincode: '700001', type: 'city', lat: 22.5726, lon: 88.3639 },
  { name: 'Hyderabad', region: 'Telangana', country: 'India', fullName: 'Hyderabad, Telangana, India', pincode: '500001', type: 'city', lat: 17.3850, lon: 78.4867 },
  { name: 'Pune', region: 'Maharashtra', country: 'India', fullName: 'Pune, Maharashtra, India', pincode: '411001', type: 'city', lat: 18.5204, lon: 73.8567 },
  { name: 'Ahmedabad', region: 'Gujarat', country: 'India', fullName: 'Ahmedabad, Gujarat, India', pincode: '380001', type: 'city', lat: 23.0225, lon: 72.5714 },
  { name: 'Surat', region: 'Gujarat', country: 'India', fullName: 'Surat, Gujarat, India', pincode: '395001', type: 'city', lat: 21.1702, lon: 72.8311 },
  { name: 'Jaipur', region: 'Rajasthan', country: 'India', fullName: 'Jaipur, Rajasthan, India', pincode: '302001', type: 'city', lat: 26.9124, lon: 75.7873 },
  { name: 'Lucknow', region: 'Uttar Pradesh', country: 'India', fullName: 'Lucknow, Uttar Pradesh, India', pincode: '226001', type: 'city', lat: 26.8467, lon: 80.9462 },
  { name: 'Kanpur', region: 'Uttar Pradesh', country: 'India', fullName: 'Kanpur, Uttar Pradesh, India', pincode: '208001', type: 'city', lat: 26.4499, lon: 80.3319 },
  { name: 'Nagpur', region: 'Maharashtra', country: 'India', fullName: 'Nagpur, Maharashtra, India', pincode: '440001', type: 'city', lat: 21.1458, lon: 79.0882 },
  { name: 'Indore', region: 'Madhya Pradesh', country: 'India', fullName: 'Indore, Madhya Pradesh, India', pincode: '452001', type: 'city', lat: 22.7196, lon: 75.8577 },
  { name: 'Thane', region: 'Maharashtra', country: 'India', fullName: 'Thane, Maharashtra, India', pincode: '400601', type: 'city', lat: 19.2183, lon: 72.9781 },
  { name: 'Bhopal', region: 'Madhya Pradesh', country: 'India', fullName: 'Bhopal, Madhya Pradesh, India', pincode: '462001', type: 'city', lat: 23.2599, lon: 77.4126 },
  { name: 'Visakhapatnam', region: 'Andhra Pradesh', country: 'India', fullName: 'Visakhapatnam, Andhra Pradesh, India', pincode: '530001', type: 'city', lat: 17.6868, lon: 83.2185 },

  // Towns and Districts with coordinates
  { name: 'Alibaug', region: 'Maharashtra', country: 'India', fullName: 'Alibaug, Maharashtra, India', pincode: '402201', type: 'town', lat: 18.6414, lon: 72.8722 },
  { name: 'Mahabaleshwar', region: 'Maharashtra', country: 'India', fullName: 'Mahabaleshwar, Maharashtra, India', pincode: '412806', type: 'town', lat: 17.9242, lon: 73.6578 },
  { name: 'Lonavala', region: 'Maharashtra', country: 'India', fullName: 'Lonavala, Maharashtra, India', pincode: '410401', type: 'town', lat: 18.7537, lon: 73.4068 },
  { name: 'Khandala', region: 'Maharashtra', country: 'India', fullName: 'Khandala, Maharashtra, India', pincode: '410301', type: 'town', lat: 18.7645, lon: 73.3869 },
  { name: 'Matheran', region: 'Maharashtra', country: 'India', fullName: 'Matheran, Maharashtra, India', pincode: '410102', type: 'town', lat: 18.9847, lon: 73.2673 },
  { name: 'Shirdi', region: 'Maharashtra', country: 'India', fullName: 'Shirdi, Maharashtra, India', pincode: '423109', type: 'town', lat: 19.7645, lon: 74.4777 },
  
  // Rajasthan Towns with coordinates
  { name: 'Pushkar', region: 'Rajasthan', country: 'India', fullName: 'Pushkar, Rajasthan, India', pincode: '305022', type: 'town', lat: 26.4899, lon: 74.5511 },
  { name: 'Mount Abu', region: 'Rajasthan', country: 'India', fullName: 'Mount Abu, Rajasthan, India', pincode: '307501', type: 'town', lat: 24.5925, lon: 72.7156 },
  { name: 'Jaisalmer', region: 'Rajasthan', country: 'India', fullName: 'Jaisalmer, Rajasthan, India', pincode: '345001', type: 'town', lat: 26.9157, lon: 70.9083 },
  { name: 'Udaipur', region: 'Rajasthan', country: 'India', fullName: 'Udaipur, Rajasthan, India', pincode: '313001', type: 'city', lat: 24.5854, lon: 73.7125 },
  { name: 'Jodhpur', region: 'Rajasthan', country: 'India', fullName: 'Jodhpur, Rajasthan, India', pincode: '342001', type: 'city', lat: 26.2389, lon: 73.0243 },
  
  // Kerala Towns with coordinates
  { name: 'Munnar', region: 'Kerala', country: 'India', fullName: 'Munnar, Kerala, India', pincode: '685612', type: 'town', lat: 10.0889, lon: 77.0595 },
  { name: 'Alleppey', region: 'Kerala', country: 'India', fullName: 'Alleppey, Kerala, India', pincode: '688001', type: 'town', lat: 9.4981, lon: 76.3388 },
  { name: 'Alappuzha', region: 'Kerala', country: 'India', fullName: 'Alappuzha, Kerala, India', pincode: '688001', type: 'town', lat: 9.4981, lon: 76.3388 },
  { name: 'Kumarakom', region: 'Kerala', country: 'India', fullName: 'Kumarakom, Kerala, India', pincode: '686563', type: 'town', lat: 9.6178, lon: 76.4298 },
  { name: 'Thekkady', region: 'Kerala', country: 'India', fullName: 'Thekkady, Kerala, India', pincode: '685536', type: 'town', lat: 9.5916, lon: 77.1603 },
  { name: 'Wayanad', region: 'Kerala', country: 'India', fullName: 'Wayanad, Kerala, India', pincode: '673121', type: 'district', lat: 11.6854, lon: 76.1320 },
  { name: 'Kovalam', region: 'Kerala', country: 'India', fullName: 'Kovalam, Kerala, India', pincode: '695527', type: 'town', lat: 8.4004, lon: 76.9784 },
  { name: 'Kochi', region: 'Kerala', country: 'India', fullName: 'Kochi, Kerala, India', pincode: '682001', type: 'city', lat: 9.9312, lon: 76.2673 },
  { name: 'Thiruvananthapuram', region: 'Kerala', country: 'India', fullName: 'Thiruvananthapuram, Kerala, India', pincode: '695001', type: 'city', lat: 8.5241, lon: 76.9366 },
  
  // Himachal Pradesh Towns with coordinates
  { name: 'Shimla', region: 'Himachal Pradesh', country: 'India', fullName: 'Shimla, Himachal Pradesh, India', pincode: '171001', type: 'city', lat: 31.1048, lon: 77.1734 },
  { name: 'Manali', region: 'Himachal Pradesh', country: 'India', fullName: 'Manali, Himachal Pradesh, India', pincode: '175131', type: 'town', lat: 32.2396, lon: 77.1887 },
  { name: 'Dharamshala', region: 'Himachal Pradesh', country: 'India', fullName: 'Dharamshala, Himachal Pradesh, India', pincode: '176215', type: 'town', lat: 32.2190, lon: 76.3234 },
  { name: 'McLeod Ganj', region: 'Himachal Pradesh', country: 'India', fullName: 'McLeod Ganj, Himachal Pradesh, India', pincode: '176219', type: 'town', lat: 32.2396, lon: 76.3200 },
  { name: 'Kasol', region: 'Himachal Pradesh', country: 'India', fullName: 'Kasol, Himachal Pradesh, India', pincode: '175105', type: 'village', lat: 32.0997, lon: 77.3152 },
  { name: 'Dalhousie', region: 'Himachal Pradesh', country: 'India', fullName: 'Dalhousie, Himachal Pradesh, India', pincode: '176304', type: 'town', lat: 32.5448, lon: 75.9618 },
  { name: 'Kullu', region: 'Himachal Pradesh', country: 'India', fullName: 'Kullu, Himachal Pradesh, India', pincode: '175101', type: 'town', lat: 31.9578, lon: 77.1092 },
  
  // Uttarakhand Towns with coordinates
  { name: 'Rishikesh', region: 'Uttarakhand', country: 'India', fullName: 'Rishikesh, Uttarakhand, India', pincode: '249201', type: 'town', lat: 30.0869, lon: 78.2676 },
  { name: 'Haridwar', region: 'Uttarakhand', country: 'India', fullName: 'Haridwar, Uttarakhand, India', pincode: '249401', type: 'city', lat: 29.9457, lon: 78.1642 },
  { name: 'Nainital', region: 'Uttarakhand', country: 'India', fullName: 'Nainital, Uttarakhand, India', pincode: '263001', type: 'town', lat: 29.3803, lon: 79.4636 },
  { name: 'Mussoorie', region: 'Uttarakhand', country: 'India', fullName: 'Mussoorie, Uttarakhand, India', pincode: '248179', type: 'town', lat: 30.4598, lon: 78.0664 },
  { name: 'Dehradun', region: 'Uttarakhand', country: 'India', fullName: 'Dehradun, Uttarakhand, India', pincode: '248001', type: 'city', lat: 30.3165, lon: 78.0322 },
  
  // Goa Towns with coordinates
  { name: 'Panaji', region: 'Goa', country: 'India', fullName: 'Panaji, Goa, India', pincode: '403001', type: 'city', lat: 15.4909, lon: 73.8278 },
  { name: 'Margao', region: 'Goa', country: 'India', fullName: 'Margao, Goa, India', pincode: '403601', type: 'city', lat: 15.2700, lon: 73.9500 },
  { name: 'Calangute', region: 'Goa', country: 'India', fullName: 'Calangute, Goa, India', pincode: '403516', type: 'town', lat: 15.5438, lon: 73.7553 },
  { name: 'Baga', region: 'Goa', country: 'India', fullName: 'Baga, Goa, India', pincode: '403516', type: 'village', lat: 15.5567, lon: 73.7516 },
  { name: 'Anjuna', region: 'Goa', country: 'India', fullName: 'Anjuna, Goa, India', pincode: '403509', type: 'village', lat: 15.5735, lon: 73.7440 },
  
  // Tamil Nadu Towns with coordinates
  { name: 'Ooty', region: 'Tamil Nadu', country: 'India', fullName: 'Ooty, Tamil Nadu, India', pincode: '643001', type: 'town', lat: 11.4064, lon: 76.6932 },
  { name: 'Kodaikanal', region: 'Tamil Nadu', country: 'India', fullName: 'Kodaikanal, Tamil Nadu, India', pincode: '624101', type: 'town', lat: 10.2381, lon: 77.4892 },
  { name: 'Pondicherry', region: 'Puducherry', country: 'India', fullName: 'Pondicherry, Puducherry, India', pincode: '605001', type: 'city', lat: 11.9416, lon: 79.8083 },
  { name: 'Kanyakumari', region: 'Tamil Nadu', country: 'India', fullName: 'Kanyakumari, Tamil Nadu, India', pincode: '629702', type: 'town', lat: 8.0883, lon: 77.5385 },
  { name: 'Madurai', region: 'Tamil Nadu', country: 'India', fullName: 'Madurai, Tamil Nadu, India', pincode: '625001', type: 'city', lat: 9.9252, lon: 78.1198 },
  
  // Karnataka Towns with coordinates
  { name: 'Coorg', region: 'Karnataka', country: 'India', fullName: 'Coorg, Karnataka, India', pincode: '571201', type: 'district', lat: 12.3375, lon: 75.8069 },
  { name: 'Madikeri', region: 'Karnataka', country: 'India', fullName: 'Madikeri, Karnataka, India', pincode: '571201', type: 'town', lat: 12.4244, lon: 75.7382 },
  { name: 'Chikmagalur', region: 'Karnataka', country: 'India', fullName: 'Chikmagalur, Karnataka, India', pincode: '577101', type: 'town', lat: 13.3161, lon: 75.7720 },
  { name: 'Hassan', region: 'Karnataka', country: 'India', fullName: 'Hassan, Karnataka, India', pincode: '573201', type: 'town', lat: 13.0033, lon: 76.0953 },
  { name: 'Hampi', region: 'Karnataka', country: 'India', fullName: 'Hampi, Karnataka, India', pincode: '583239', type: 'village', lat: 15.3350, lon: 76.4600 },
  { name: 'Mysore', region: 'Karnataka', country: 'India', fullName: 'Mysore, Karnataka, India', pincode: '570001', type: 'city', lat: 12.2958, lon: 76.6394 },
  
  // West Bengal Towns with coordinates
  { name: 'Darjeeling', region: 'West Bengal', country: 'India', fullName: 'Darjeeling, West Bengal, India', pincode: '734101', type: 'town', lat: 27.0360, lon: 88.2627 },
  { name: 'Kalimpong', region: 'West Bengal', country: 'India', fullName: 'Kalimpong, West Bengal, India', pincode: '734301', type: 'town', lat: 27.0669, lon: 88.4685 },
  { name: 'Digha', region: 'West Bengal', country: 'India', fullName: 'Digha, West Bengal, India', pincode: '721428', type: 'town', lat: 21.6281, lon: 87.5069 },
  
  // Andhra Pradesh Towns with coordinates
  { name: 'Tirupati', region: 'Andhra Pradesh', country: 'India', fullName: 'Tirupati, Andhra Pradesh, India', pincode: '517501', type: 'city', lat: 13.6288, lon: 79.4192 },
  { name: 'Araku Valley', region: 'Andhra Pradesh', country: 'India', fullName: 'Araku Valley, Andhra Pradesh, India', pincode: '531149', type: 'town', lat: 18.3273, lon: 82.8739 },
  
  // Odisha Towns with coordinates
  { name: 'Puri', region: 'Odisha', country: 'India', fullName: 'Puri, Odisha, India', pincode: '752001', type: 'city', lat: 19.8135, lon: 85.8312 },
  { name: 'Konark', region: 'Odisha', country: 'India', fullName: 'Konark, Odisha, India', pincode: '752111', type: 'town', lat: 19.8876, lon: 86.0943 },
  { name: 'Bhubaneswar', region: 'Odisha', country: 'India', fullName: 'Bhubaneswar, Odisha, India', pincode: '751001', type: 'city', lat: 20.2961, lon: 85.8245 },
  
  // Assam Towns with coordinates
  { name: 'Guwahati', region: 'Assam', country: 'India', fullName: 'Guwahati, Assam, India', pincode: '781001', type: 'city', lat: 26.1445, lon: 91.7362 },
  { name: 'Kaziranga', region: 'Assam', country: 'India', fullName: 'Kaziranga, Assam, India', pincode: '785609', type: 'town', lat: 26.5775, lon: 93.1714 },
  
  // Meghalaya Towns with coordinates
  { name: 'Shillong', region: 'Meghalaya', country: 'India', fullName: 'Shillong, Meghalaya, India', pincode: '793001', type: 'city', lat: 25.5788, lon: 91.8933 },
  { name: 'Cherrapunji', region: 'Meghalaya', country: 'India', fullName: 'Cherrapunji, Meghalaya, India', pincode: '793108', type: 'town', lat: 25.3000, lon: 91.7000 },
  
  // Sikkim Towns with coordinates
  { name: 'Gangtok', region: 'Sikkim', country: 'India', fullName: 'Gangtok, Sikkim, India', pincode: '737101', type: 'city', lat: 27.3389, lon: 88.6065 },
  { name: 'Pelling', region: 'Sikkim', country: 'India', fullName: 'Pelling, Sikkim, India', pincode: '737113', type: 'town', lat: 27.2951, lon: 88.2158 },
  
  // Ladakh Towns with coordinates
  { name: 'Leh', region: 'Ladakh', country: 'India', fullName: 'Leh, Ladakh, India', pincode: '194101', type: 'city', lat: 34.1526, lon: 77.5771 },
  { name: 'Kargil', region: 'Ladakh', country: 'India', fullName: 'Kargil, Ladakh, India', pincode: '194103', type: 'town', lat: 34.5539, lon: 76.1313 },
  
  // Andaman & Nicobar with coordinates
  { name: 'Port Blair', region: 'Andaman and Nicobar Islands', country: 'India', fullName: 'Port Blair, Andaman and Nicobar Islands, India', pincode: '744101', type: 'city', lat: 11.6234, lon: 92.7265 },
  
  // Northeast states with coordinates
  { name: 'Imphal', region: 'Manipur', country: 'India', fullName: 'Imphal, Manipur, India', pincode: '795001', type: 'city', lat: 24.8170, lon: 93.9368 },
  { name: 'Aizawl', region: 'Mizoram', country: 'India', fullName: 'Aizawl, Mizoram, India', pincode: '796001', type: 'city', lat: 23.7271, lon: 92.7176 },
  { name: 'Kohima', region: 'Nagaland', country: 'India', fullName: 'Kohima, Nagaland, India', pincode: '797001', type: 'city', lat: 25.6751, lon: 94.1086 },
  { name: 'Agartala', region: 'Tripura', country: 'India', fullName: 'Agartala, Tripura, India', pincode: '799001', type: 'city', lat: 23.8315, lon: 91.2868 },
  { name: 'Itanagar', region: 'Arunachal Pradesh', country: 'India', fullName: 'Itanagar, Arunachal Pradesh, India', pincode: '791111', type: 'city', lat: 27.0844, lon: 93.6053 },
  
  // Gujarat Towns with coordinates
  { name: 'Dwarka', region: 'Gujarat', country: 'India', fullName: 'Dwarka, Gujarat, India', pincode: '361335', type: 'city', lat: 22.2394, lon: 68.9678 },
  { name: 'Somnath', region: 'Gujarat', country: 'India', fullName: 'Somnath, Gujarat, India', pincode: '362268', type: 'town', lat: 20.8880, lon: 70.4017 },
  { name: 'Kutch', region: 'Gujarat', country: 'India', fullName: 'Kutch, Gujarat, India', pincode: '370001', type: 'district', lat: 23.7337, lon: 69.8597 },
  { name: 'Bhuj', region: 'Gujarat', country: 'India', fullName: 'Bhuj, Gujarat, India', pincode: '370001', type: 'city', lat: 23.2420, lon: 69.6669 },
  { name: 'Vadodara', region: 'Gujarat', country: 'India', fullName: 'Vadodara, Gujarat, India', pincode: '390001', type: 'city', lat: 22.3072, lon: 73.1812 },
  { name: 'Rajkot', region: 'Gujarat', country: 'India', fullName: 'Rajkot, Gujarat, India', pincode: '360001', type: 'city', lat: 22.3039, lon: 70.8022 },
];

// International locations for comparison
export const internationalLocations: LocationSuggestion[] = [
  { name: 'New York', region: 'New York', country: 'United States', fullName: 'New York, New York, United States', type: 'city', lat: 40.7128, lon: -74.0060 },
  { name: 'Los Angeles', region: 'California', country: 'United States', fullName: 'Los Angeles, California, United States', type: 'city', lat: 34.0522, lon: -118.2437 },
  { name: 'London', region: 'England', country: 'United Kingdom', fullName: 'London, England, United Kingdom', type: 'city', lat: 51.5074, lon: -0.1278 },
  { name: 'Paris', region: 'Île-de-France', country: 'France', fullName: 'Paris, Île-de-France, France', type: 'city', lat: 48.8566, lon: 2.3522 },
  { name: 'Tokyo', region: 'Tokyo', country: 'Japan', fullName: 'Tokyo, Tokyo, Japan', type: 'city', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney', region: 'New South Wales', country: 'Australia', fullName: 'Sydney, New South Wales, Australia', type: 'city', lat: -33.8688, lon: 151.2093 },
  { name: 'Toronto', region: 'Ontario', country: 'Canada', fullName: 'Toronto, Ontario, Canada', type: 'city', lat: 43.6532, lon: -79.3832 },
];

// Combined database including all Bihar locations
export const allLocations: LocationSuggestion[] = [
  ...indianLocationsDatabase,
  ...biharLocations,
  ...internationalLocations,
];