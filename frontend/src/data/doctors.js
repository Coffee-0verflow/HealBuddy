export const doctors = [
  // ===== JAMMU, KASHMIR & LADAKH =====
  { id:1, name:"SNM Hospital Leh", specialty:"General Hospital", lat:34.1557, lng:77.5855, cost:"₹100-500", languages:["Ladakhi","Hindi","English"], trustBadge:true, phone:"+91 1982 252014", rating:3.8, conditions:["fever","pain","injury","dizziness"] },
  { id:2, name:"Dr. Tsering Clinic", specialty:"General Physician", lat:34.1526, lng:77.577, cost:"₹300-600", languages:["Hindi","English"], trustBadge:true, phone:"+91 9419 123456", rating:4.0, conditions:["fever","pain","vomiting","allergy"] },
  { id:3, name:"SMHS Hospital Srinagar", specialty:"Emergency Care", lat:34.0747, lng:74.8, cost:"₹0-100", languages:["Kashmiri","Urdu","English"], trustBadge:true, phone:"+91 194 2504843", rating:3.9, conditions:["injury","fracture","chest pain","burns","bleeding"] },
  { id:4, name:"SKIMS Soura", specialty:"Specialist", lat:34.135, lng:74.802, cost:"₹500-1500", languages:["Urdu","English"], trustBadge:true, phone:"+91 194 2401013", rating:4.3, conditions:["chest pain","breathing","fracture","burns"] },
  { id:5, name:"GMC Jammu", specialty:"Emergency Care", lat:32.735, lng:74.857, cost:"₹0-100", languages:["Hindi","Dogri","English"], trustBadge:true, phone:"+91 191 2503104", rating:3.7, conditions:["injury","bleeding","fracture","fever"] },
  { id:6, name:"Kargil District Hosp", specialty:"General Hospital", lat:34.555, lng:76.134, cost:"₹0-50", languages:["Ladakhi","Urdu"], trustBadge:false, phone:"+91 1985 232233", rating:3.2, conditions:["fever","pain","dizziness"] },

  // ===== DELHI & NCR =====
  { id:7, name:"AIIMS New Delhi", specialty:"Hospital / Emergency", lat:28.5659, lng:77.209, cost:"₹0-50", languages:["Hindi","English"], trustBadge:true, phone:"+91 11 26588500", rating:4.6, conditions:["chest pain","breathing","fracture","burns","bleeding","injury","fever","allergy"] },
  { id:8, name:"Safdarjung Hospital", specialty:"Emergency Care", lat:28.5684, lng:77.2064, cost:"₹0-100", languages:["Hindi","English"], trustBadge:false, phone:"+91 11 26165060", rating:4.0, conditions:["injury","burns","bleeding","fracture","fever"] },
  { id:9, name:"Max Saket", specialty:"Specialist", lat:28.5273, lng:77.2183, cost:"₹1500-3000", languages:["English","Hindi"], trustBadge:true, phone:"+91 11 26515050", rating:4.5, conditions:["chest pain","breathing","fracture","allergy"] },
  { id:10, name:"Medanta Gurugram", specialty:"General Hospital", lat:28.4357, lng:77.0343, cost:"₹2000-5000", languages:["English","Hindi"], trustBadge:true, phone:"+91 124 4141414", rating:4.7, conditions:["chest pain","breathing","burns","fracture","injury"] },
  { id:11, name:"Apollo Indraprastha", specialty:"Specialist", lat:28.5398, lng:77.2858, cost:"₹2000-4500", languages:["English","Hindi","Bengali"], trustBadge:true, phone:"+91 11 29871090", rating:4.5, conditions:["chest pain","breathing","fracture","burns","fever"] },
  { id:12, name:"RML Hospital", specialty:"General Hospital", lat:28.6256, lng:77.1993, cost:"₹0-50", languages:["Hindi","English"], trustBadge:true, phone:"+91 11 23365525", rating:3.8, conditions:["fever","pain","vomiting","injury","dizziness"] },
  { id:13, name:"Fortis Noida", specialty:"Emergency Care", lat:28.6186, lng:77.3732, cost:"₹1000-3000", languages:["English","Hindi"], trustBadge:true, phone:"+91 120 4300222", rating:4.3, conditions:["injury","fracture","chest pain","burns","bleeding"] },
  { id:14, name:"GTB Hospital", specialty:"Emergency Care", lat:28.6833, lng:77.3083, cost:"₹0-50", languages:["Hindi","English"], trustBadge:true, phone:"+91 11 22586262", rating:3.6, conditions:["injury","fever","pain","fracture","bleeding"] },
  { id:15, name:"Lok Nayak Hospital", specialty:"Emergency Care", lat:28.6381, lng:77.2388, cost:"₹0-50", languages:["Hindi","English"], trustBadge:true, phone:"+91 11 23232400", rating:3.9, conditions:["fever","injury","burning","bleeding","fracture"] },
  { id:16, name:"BLK-Max Center", specialty:"Specialist", lat:28.6528, lng:77.1856, cost:"₹2000-5000", languages:["English","Hindi"], trustBadge:true, phone:"+91 11 30403040", rating:4.4, conditions:["chest pain","breathing","fracture","allergy","burns"] },

  // ===== PUNJAB, CHANDIGARH & HIMACHAL =====
  { id:17, name:"PGIMER Chandigarh", specialty:"Emergency Care", lat:30.7644, lng:76.7766, cost:"₹0-50", languages:["Hindi","Punjabi","English"], trustBadge:true, phone:"+91 172 2747585", rating:4.6, conditions:["chest pain","breathing","fracture","burns","bleeding","injury"] },
  { id:18, name:"Fortis Mohali", specialty:"Specialist", lat:30.6975, lng:76.7335, cost:"₹1500-4000", languages:["English","Punjabi","Hindi"], trustBadge:true, phone:"+91 172 4692222", rating:4.4, conditions:["chest pain","fracture","burns","allergy"] },
  { id:19, name:"Amritsar Amandeep", specialty:"General Hospital", lat:31.6366, lng:74.8872, cost:"₹800-2000", languages:["Punjabi","English"], trustBadge:true, phone:"+91 183 5051515", rating:4.1, conditions:["fever","pain","injury","fracture","vomiting"] },
  { id:20, name:"IGMC Shimla", specialty:"Emergency Care", lat:31.1011, lng:77.1548, cost:"₹0-100", languages:["Hindi","English"], trustBadge:true, phone:"+91 177 2658073", rating:3.9, conditions:["injury","fracture","bleeding","fever","pain"] },
  { id:21, name:"DMC Ludhiana", specialty:"General Hospital", lat:30.912, lng:75.856, cost:"₹200-800", languages:["Punjabi","Hindi","English"], trustBadge:true, phone:"+91 161 2302620", rating:4.2, conditions:["fever","pain","vomiting","injury","allergy"] },

  // ===== UTTARAKHAND =====
  { id:22, name:"AIIMS Rishikesh", specialty:"Emergency Care", lat:30.067, lng:78.314, cost:"₹0-50", languages:["Hindi","English"], trustBadge:true, phone:"+91 135 2462963", rating:4.4, conditions:["chest pain","breathing","fracture","burns","bleeding","injury"] },
  { id:23, name:"Doon Hospital Dehradun", specialty:"General Hospital", lat:30.319, lng:78.041, cost:"₹0-100", languages:["Hindi","English"], trustBadge:true, phone:"+91 135 2712381", rating:3.5, conditions:["fever","pain","dizziness","vomiting","injury"] },
  { id:24, name:"Haldwani Sushila Tiwari", specialty:"Emergency Care", lat:29.221, lng:79.518, cost:"₹0-50", languages:["Hindi","Kumaoni"], trustBadge:true, phone:"+91 5946 282282", rating:3.4, conditions:["injury","fever","pain","bleeding"] },
  { id:25, name:"Haridwar District Hosp", specialty:"General Hospital", lat:29.946, lng:78.162, cost:"₹0-100", languages:["Hindi"], trustBadge:false, phone:"+91 1334 226444", rating:3.2, conditions:["fever","pain","vomiting","dizziness"] },

  // ===== UTTAR PRADESH (DENSE) =====
  // -- Mathura & Agra Cluster --
  { id:26, name:"Mathura District Hosp", specialty:"General Hospital", lat:27.502, lng:77.673, cost:"₹0-100", languages:["Hindi"], trustBadge:true, phone:"+91 565 2501922", rating:3.4, conditions:["fever","pain","vomiting","dizziness","injury"] },
  { id:27, name:"Kailash Hospital Mathura", specialty:"General Hospital", lat:27.491, lng:77.686, cost:"₹300-1000", languages:["Hindi","English"], trustBadge:true, phone:"+91 565 2530333", rating:4.0, conditions:["fever","pain","fracture","injury","vomiting","allergy"] },
  { id:28, name:"Vrindavan Clinic", specialty:"General Physician", lat:27.579, lng:77.700, cost:"₹100-400", languages:["Hindi"], trustBadge:false, phone:"+91 565 2443322", rating:3.5, conditions:["fever","pain","dizziness","vomiting"] },
  { id:29, name:"S.N. Medical Agra", specialty:"General Hospital", lat:27.1767, lng:78.008, cost:"₹50-150", languages:["Hindi","Urdu"], trustBadge:true, phone:"+91 562 2260353", rating:3.7, conditions:["fever","pain","injury","fracture","bleeding","burns"] },
  { id:30, name:"Pushpanjali Agra", specialty:"Specialist", lat:27.188, lng:78.016, cost:"₹500-1500", languages:["Hindi","English"], trustBadge:true, phone:"+91 562 2851010", rating:4.1, conditions:["chest pain","breathing","fracture","burns","allergy"] },
  { id:31, name:"Paras Hospital Agra", specialty:"General Hospital", lat:27.213, lng:78.001, cost:"₹600-2000", languages:["Hindi","English"], trustBadge:true, phone:"+91 562 2530505", rating:4.2, conditions:["fever","injury","fracture","chest pain","vomiting","allergy"] },

  // -- Aligarh, Firozabad --
  { id:32, name:"AMU Medical College Aligarh", specialty:"Emergency Care", lat:27.913, lng:78.078, cost:"₹0-50", languages:["Hindi","Urdu","English"], trustBadge:true, phone:"+91 571 2721612", rating:4.0, conditions:["injury","fracture","bleeding","burns","fever","chest pain"] },
  { id:33, name:"Galhotra Hospital Aligarh", specialty:"General Hospital", lat:27.897, lng:78.088, cost:"₹300-800", languages:["Hindi","English"], trustBadge:true, phone:"+91 571 2401616", rating:3.9, conditions:["fever","pain","vomiting","dizziness","fracture"] },
  { id:34, name:"Firozabad District Hosp", specialty:"General Hospital", lat:27.151, lng:78.395, cost:"₹0-50", languages:["Hindi"], trustBadge:false, phone:"+91 5612 230222", rating:3.1, conditions:["fever","pain","injury","dizziness"] },

  // -- Lucknow, Kanpur, Bareilly --
  { id:35, name:"KGMU Lucknow", specialty:"Emergency Care", lat:26.8687, lng:80.9168, cost:"₹0-50", languages:["Hindi","English","Urdu"], trustBadge:true, phone:"+91 522 2257450", rating:4.3, conditions:["chest pain","breathing","fracture","burns","bleeding","injury","fever"] },
  { id:36, name:"SGPGI Lucknow", specialty:"Specialist", lat:26.7451, lng:80.9329, cost:"₹500-2000", languages:["Hindi","English"], trustBadge:true, phone:"+91 522 2494000", rating:4.5, conditions:["chest pain","breathing","allergy","burns"] },
  { id:37, name:"Medanta Lucknow", specialty:"General Hospital", lat:26.846, lng:80.979, cost:"₹1500-4000", languages:["Hindi","English"], trustBadge:true, phone:"+91 522 4505050", rating:4.6, conditions:["chest pain","breathing","fracture","burns","allergy"] },
  { id:38, name:"Regency Kanpur", specialty:"General Hospital", lat:26.476, lng:80.302, cost:"₹1000-2500", languages:["Hindi","English"], trustBadge:true, phone:"+91 512 3081111", rating:4.0, conditions:["fever","injury","fracture","chest pain","vomiting"] },
  { id:39, name:"Hallet Hosp Kanpur", specialty:"Emergency Care", lat:26.495, lng:80.306, cost:"₹0-50", languages:["Hindi"], trustBadge:false, phone:"+91 512 2535483", rating:3.4, conditions:["injury","bleeding","fever","fracture","pain"] },
  { id:40, name:"Bareilly District Hosp", specialty:"General Hospital", lat:28.364, lng:79.415, cost:"₹0-100", languages:["Hindi","Urdu"], trustBadge:false, phone:"+91 581 2510777", rating:3.3, conditions:["fever","pain","vomiting","dizziness","injury"] },
  { id:41, name:"Shahjahanpur Dist Hosp", specialty:"General Hospital", lat:27.883, lng:79.911, cost:"₹0-50", languages:["Hindi"], trustBadge:false, phone:"+91 5842 220222", rating:3.0, conditions:["fever","pain","injury","dizziness"] },

  // -- Varanasi, Prayagraj, Gorakhpur --
  { id:42, name:"BHU Hospital Varanasi", specialty:"Emergency Care", lat:25.273, lng:82.994, cost:"₹0-50", languages:["Hindi","English"], trustBadge:true, phone:"+91 542 2307461", rating:4.1, conditions:["chest pain","breathing","fracture","burns","bleeding","injury","fever"] },
  { id:43, name:"Heritage Varanasi", specialty:"General Hospital", lat:25.318, lng:82.974, cost:"₹600-1500", languages:["Hindi","English"], trustBadge:true, phone:"+91 542 2500600", rating:3.9, conditions:["fever","pain","vomiting","injury","fracture","allergy"] },
  { id:44, name:"Apollo Prayagraj", specialty:"Specialist", lat:25.436, lng:81.846, cost:"₹1000-2500", languages:["Hindi","English"], trustBadge:true, phone:"+91 532 2460500", rating:4.0, conditions:["chest pain","breathing","fracture","allergy","burns"] },
  { id:45, name:"Gorakhpur BRD Medical", specialty:"Emergency Care", lat:26.756, lng:83.364, cost:"₹0-50", languages:["Hindi","Bhojpuri"], trustBadge:true, phone:"+91 551 2505050", rating:3.5, conditions:["injury","fever","bleeding","fracture","pain"] },

  // -- Meerut, Noida, Ghaziabad --
  { id:46, name:"Yashoda Noida", specialty:"Specialist", lat:28.535, lng:77.391, cost:"₹1000-3000", languages:["Hindi","English"], trustBadge:true, phone:"+91 120 4123123", rating:4.2, conditions:["chest pain","breathing","allergy","fracture"] },
  { id:47, name:"Meerut District Hosp", specialty:"Emergency Care", lat:28.984, lng:77.706, cost:"₹0-50", languages:["Hindi"], trustBadge:true, phone:"+91 121 2660033", rating:3.3, conditions:["injury","fever","bleeding","pain","fracture"] },
  { id:48, name:"Moradabad District Hosp", specialty:"General Hospital", lat:28.838, lng:78.776, cost:"₹0-100", languages:["Hindi","Urdu"], trustBadge:false, phone:"+91 591 2414222", rating:3.1, conditions:["fever","pain","vomiting","injury"] },
  { id:49, name:"Etawah Saifai Hospital", specialty:"General Hospital", lat:26.774, lng:79.034, cost:"₹0-50", languages:["Hindi"], trustBadge:true, phone:"+91 5688 276777", rating:3.6, conditions:["fever","pain","injury","fracture","vomiting"] },
  { id:50, name:"Jhansi Medical College", specialty:"Emergency Care", lat:25.448, lng:78.568, cost:"₹0-50", languages:["Hindi"], trustBadge:true, phone:"+91 510 2440544", rating:3.5, conditions:["injury","fracture","bleeding","fever","burns"] },

  // ===== BIHAR & JHARKHAND =====
  { id:51, name:"PMCH Patna", specialty:"Emergency Care", lat:25.619, lng:85.158, cost:"₹0-50", languages:["Hindi","Bhojpuri"], trustBadge:true, phone:"+91 612 2300341", rating:3.8, conditions:["injury","fracture","bleeding","fever","burns"] },
  { id:52, name:"Paras Patna", specialty:"Specialist", lat:25.603, lng:85.094, cost:"₹1200-3000", languages:["Hindi","English"], trustBadge:true, phone:"+91 612 7107700", rating:4.3, conditions:["chest pain","breathing","fracture","allergy","burns"] },
  { id:53, name:"RIMS Ranchi", specialty:"Emergency Care", lat:23.362, lng:85.337, cost:"₹0-50", languages:["Hindi","Bengali","English"], trustBadge:true, phone:"+91 651 2545070", rating:3.7, conditions:["injury","fever","fracture","bleeding","pain"] },
  { id:54, name:"TMH Jamshedpur", specialty:"General Hospital", lat:22.805, lng:86.203, cost:"₹0-100", languages:["Hindi","Bengali","English"], trustBadge:true, phone:"+91 657 2345000", rating:4.0, conditions:["fever","pain","injury","fracture","vomiting"] },
  { id:55, name:"Gaya Anugrah Hosp", specialty:"General Hospital", lat:24.796, lng:84.999, cost:"₹0-50", languages:["Hindi","Magahi"], trustBadge:false, phone:"+91 631 2220222", rating:3.1, conditions:["fever","pain","dizziness","injury"] },
  { id:56, name:"Bhagalpur JLNMC", specialty:"Emergency Care", lat:25.242, lng:86.984, cost:"₹0-50", languages:["Hindi","English"], trustBadge:true, phone:"+91 641 2401444", rating:3.4, conditions:["injury","fracture","bleeding","fever"] },

  // ===== RAJASTHAN =====
  { id:57, name:"SMS Hospital Jaipur", specialty:"Emergency Care", lat:26.900, lng:75.817, cost:"₹50-200", languages:["Hindi","English"], trustBadge:true, phone:"+91 141 2560291", rating:4.1, conditions:["injury","fracture","bleeding","burns","fever","chest pain"] },
  { id:58, name:"Fortis Jaipur", specialty:"Specialist", lat:26.849, lng:75.802, cost:"₹1500-3500", languages:["English","Hindi"], trustBadge:true, phone:"+91 141 2547000", rating:4.5, conditions:["chest pain","breathing","fracture","allergy","burns"] },
  { id:59, name:"Manipal Jaipur", specialty:"General Hospital", lat:26.872, lng:75.793, cost:"₹1000-3000", languages:["Hindi","English"], trustBadge:true, phone:"+91 141 5110900", rating:4.3, conditions:["fever","injury","fracture","chest pain","vomiting","allergy"] },
  { id:60, name:"MDM Jodhpur", specialty:"Emergency Care", lat:26.263, lng:73.012, cost:"₹0-50", languages:["Hindi","Marwari"], trustBadge:true, phone:"+91 291 2434366", rating:3.7, conditions:["injury","bleeding","fracture","fever","pain"] },
  { id:61, name:"AIIMS Jodhpur", specialty:"General Hospital", lat:26.217, lng:73.008, cost:"₹0-100", languages:["Hindi","English"], trustBadge:true, phone:"+91 291 2742200", rating:4.4, conditions:["chest pain","breathing","fracture","burns","bleeding","injury"] },
  { id:62, name:"MBS Hospital Kota", specialty:"Emergency Care", lat:25.180, lng:75.865, cost:"₹0-50", languages:["Hindi"], trustBadge:true, phone:"+91 744 2323053", rating:3.5, conditions:["injury","fracture","bleeding","fever"] },
  { id:63, name:"GBH Hospital Udaipur", specialty:"General Hospital", lat:24.571, lng:73.710, cost:"₹0-100", languages:["Hindi","English"], trustBadge:true, phone:"+91 294 2528811", rating:3.9, conditions:["fever","pain","injury","vomiting","fracture"] },
  { id:64, name:"Bikaner PBM Hospital", specialty:"Emergency Care", lat:28.019, lng:73.308, cost:"₹0-50", languages:["Hindi","Marwari"], trustBadge:true, phone:"+91 151 2201013", rating:3.4, conditions:["injury","bleeding","fever","fracture","pain"] },
  { id:65, name:"Ajmer JLN Hospital", specialty:"General Hospital", lat:26.449, lng:74.639, cost:"₹0-100", languages:["Hindi"], trustBadge:true, phone:"+91 145 2627506", rating:3.5, conditions:["fever","pain","injury","dizziness","vomiting"] },
  { id:66, name:"Sikar District Hosp", specialty:"General Hospital", lat:27.615, lng:75.142, cost:"₹0-50", languages:["Hindi"], trustBadge:false, phone:"+91 1572 271222", rating:3.0, conditions:["fever","pain","dizziness","injury"] },

  // ===== MADHYA PRADESH & CHHATTISGARH =====
  { id:67, name:"Hamidia Bhopal", specialty:"Emergency Care", lat:23.260, lng:77.413, cost:"₹0-50", languages:["Hindi"], trustBadge:true, phone:"+91 755 2540500", rating:3.7, conditions:["injury","fracture","bleeding","fever","burns"] },
  { id:68, name:"AIIMS Bhopal", specialty:"General Hospital", lat:23.204, lng:77.434, cost:"₹0-50", languages:["Hindi","English"], trustBadge:true, phone:"+91 755 2672317", rating:4.3, conditions:["chest pain","breathing","fracture","burns","bleeding","injury"] },
  { id:69, name:"MY Hospital Indore", specialty:"Emergency Care", lat:22.716, lng:75.875, cost:"₹0-50", languages:["Hindi"], trustBadge:true, phone:"+91 731 2527301", rating:3.6, conditions:["injury","fracture","bleeding","fever"] },
  { id:70, name:"JAH Hospital Gwalior", specialty:"Emergency Care", lat:26.218, lng:78.183, cost:"₹0-50", languages:["Hindi"], trustBadge:true, phone:"+91 751 2403300", rating:3.5, conditions:["injury","fracture","bleeding","fever","burns"] },
  { id:71, name:"Jabalpur Medical College", specialty:"General Hospital", lat:23.181, lng:79.986, cost:"₹0-100", languages:["Hindi","English"], trustBadge:true, phone:"+91 761 2620744", rating:3.8, conditions:["fever","pain","injury","fracture","vomiting"] },
  { id:72, name:"AIIMS Raipur", specialty:"Emergency Care", lat:21.240, lng:81.635, cost:"₹0-50", languages:["Hindi","Chhattisgarhi","English"], trustBadge:true, phone:"+91 771 2572555", rating:4.2, conditions:["chest pain","breathing","fracture","burns","bleeding"] },
  { id:73, name:"Sagar District Hosp", specialty:"General Hospital", lat:23.839, lng:78.738, cost:"₹0-50", languages:["Hindi"], trustBadge:false, phone:"+91 7582 237222", rating:3.0, conditions:["fever","pain","dizziness","injury"] },
  { id:74, name:"Satna District Hosp", specialty:"General Hospital", lat:24.580, lng:80.832, cost:"₹0-50", languages:["Hindi"], trustBadge:false, phone:"+91 7672 224222", rating:3.0, conditions:["fever","pain","injury","dizziness"] },

  // ===== GUJARAT =====
  { id:75, name:"Civil Hosp Ahmedabad", specialty:"Emergency Care", lat:23.053, lng:72.603, cost:"₹0-50", languages:["Gujarati","Hindi"], trustBadge:true, phone:"+91 79 22680074", rating:4.0, conditions:["injury","fracture","bleeding","fever","burns","chest pain"] },
  { id:76, name:"Zydus Hospital", specialty:"General Hospital", lat:23.061, lng:72.520, cost:"₹1500-4000", languages:["English","Gujarati","Hindi"], trustBadge:true, phone:"+91 79 66190201", rating:4.5, conditions:["chest pain","breathing","fracture","allergy","burns"] },
  { id:77, name:"Surat Civil Hosp", specialty:"Emergency Care", lat:21.190, lng:72.824, cost:"₹0-50", languages:["Gujarati","Hindi"], trustBadge:true, phone:"+91 261 2244456", rating:3.8, conditions:["injury","fracture","bleeding","fever","burns"] },
  { id:78, name:"Vadodara SSG Hosp", specialty:"Emergency Care", lat:22.310, lng:73.188, cost:"₹0-50", languages:["Gujarati","Hindi"], trustBadge:true, phone:"+91 265 2424721", rating:3.7, conditions:["injury","fracture","bleeding","fever"] },
  { id:79, name:"Rajkot Civil Hosp", specialty:"General Hospital", lat:22.299, lng:70.797, cost:"₹0-100", languages:["Gujarati","Hindi"], trustBadge:true, phone:"+91 281 2223600", rating:3.6, conditions:["fever","pain","injury","vomiting","dizziness"] },
  { id:80, name:"Bhavnagar Sir T Hosp", specialty:"Emergency Care", lat:21.755, lng:72.155, cost:"₹0-50", languages:["Gujarati","Hindi"], trustBadge:true, phone:"+91 278 2426741", rating:3.4, conditions:["injury","fever","bleeding","pain"] },
  { id:81, name:"Junagadh Govt Hosp", specialty:"General Hospital", lat:21.522, lng:70.457, cost:"₹0-50", languages:["Gujarati"], trustBadge:false, phone:"+91 285 2620222", rating:3.1, conditions:["fever","pain","dizziness","injury"] },

  // ===== MAHARASHTRA =====
  { id:82, name:"KEM Hospital Mumbai", specialty:"Emergency Care", lat:19.003, lng:72.842, cost:"₹20-100", languages:["Marathi","Hindi","English"], trustBadge:true, phone:"+91 22 24107000", rating:4.2, conditions:["injury","fracture","bleeding","burns","fever","chest pain"] },
  { id:83, name:"Lilavati Hospital", specialty:"General Hospital", lat:19.051, lng:72.826, cost:"₹1500-4000", languages:["English","Marathi","Gujarati"], trustBadge:true, phone:"+91 22 26751000", rating:4.5, conditions:["chest pain","breathing","fracture","allergy","burns"] },
  { id:84, name:"Bombay Hospital", specialty:"Specialist", lat:18.941, lng:72.828, cost:"₹1000-3000", languages:["Hindi","English"], trustBadge:true, phone:"+91 22 22067676", rating:4.4, conditions:["chest pain","breathing","fracture","burns","allergy"] },
  { id:85, name:"Ruby Hall Pune", specialty:"General Hospital", lat:18.531, lng:73.876, cost:"₹500-1500", languages:["Marathi","English"], trustBadge:true, phone:"+91 20 66455100", rating:4.3, conditions:["fever","injury","fracture","chest pain","vomiting"] },
  { id:86, name:"Sassoon Pune", specialty:"Emergency Care", lat:18.528, lng:73.875, cost:"₹0-50", languages:["Marathi","Hindi","English"], trustBadge:true, phone:"+91 20 26128000", rating:3.9, conditions:["injury","fracture","bleeding","burns","fever"] },
  { id:87, name:"GMCH Nagpur", specialty:"Emergency Care", lat:21.128, lng:79.099, cost:"₹0-50", languages:["Marathi","Hindi"], trustBadge:true, phone:"+91 712 2743588", rating:3.8, conditions:["injury","fracture","bleeding","fever","burns"] },
  { id:88, name:"SMBT Nashik", specialty:"General Hospital", lat:20.001, lng:73.792, cost:"₹200-800", languages:["Marathi","Hindi"], trustBadge:false, phone:"+91 253 2234400", rating:3.5, conditions:["fever","pain","vomiting","dizziness","injury"] },
  { id:89, name:"Aurangabad GMCH", specialty:"Emergency Care", lat:19.876, lng:75.343, cost:"₹0-50", languages:["Marathi","Hindi","Urdu"], trustBadge:true, phone:"+91 240 2331272", rating:3.7, conditions:["injury","fracture","bleeding","fever"] },
  { id:90, name:"Kolhapur CPR Hosp", specialty:"Emergency Care", lat:16.705, lng:74.240, cost:"₹0-50", languages:["Marathi","Kannada"], trustBadge:true, phone:"+91 231 2654444", rating:3.5, conditions:["injury","fever","bleeding","pain"] },
  { id:91, name:"Solapur Civil Hosp", specialty:"General Hospital", lat:17.672, lng:75.912, cost:"₹0-50", languages:["Marathi","Hindi"], trustBadge:false, phone:"+91 217 2315222", rating:3.2, conditions:["fever","pain","injury","dizziness"] },

  // ===== GOA =====
  { id:92, name:"Goa Medical College", specialty:"General Hospital", lat:15.466, lng:73.844, cost:"₹10-100", languages:["English","Konkani"], trustBadge:true, phone:"+91 832 2495000", rating:4.0, conditions:["fever","injury","fracture","bleeding","vomiting"] },
  { id:93, name:"Manipal Goa", specialty:"Specialist", lat:15.401, lng:73.878, cost:"₹1200-3000", languages:["English","Konkani","Hindi"], trustBadge:true, phone:"+91 832 2882828", rating:4.3, conditions:["chest pain","breathing","fracture","allergy"] },

  // ===== KARNATAKA =====
  { id:94, name:"NIMHANS Bangalore", specialty:"Emergency Care", lat:12.938, lng:77.595, cost:"₹10-50", languages:["Kannada","English"], trustBadge:true, phone:"+91 80 26995000", rating:4.5, conditions:["chest pain","breathing","injury","bleeding","fracture"] },
  { id:95, name:"Manipal Bangalore", specialty:"General Hospital", lat:12.956, lng:77.650, cost:"₹1200-3500", languages:["English","Kannada","Telugu"], trustBadge:true, phone:"+91 80 25024444", rating:4.6, conditions:["chest pain","breathing","fracture","burns","allergy"] },
  { id:96, name:"Victoria Hospital BLR", specialty:"Emergency Care", lat:12.957, lng:77.574, cost:"₹0-50", languages:["Kannada","Hindi","English"], trustBadge:true, phone:"+91 80 26701150", rating:3.8, conditions:["injury","fracture","bleeding","fever","pain"] },
  { id:97, name:"JSS Hospital Mysore", specialty:"General Hospital", lat:12.297, lng:76.651, cost:"₹400-1500", languages:["Kannada","English"], trustBadge:true, phone:"+91 821 2335555", rating:4.1, conditions:["fever","pain","injury","fracture","vomiting","allergy"] },
  { id:98, name:"KMC Mangalore", specialty:"Emergency Care", lat:12.886, lng:74.839, cost:"₹500-1500", languages:["Kannada","English","Tulu"], trustBadge:true, phone:"+91 824 2445858", rating:4.2, conditions:["injury","fracture","bleeding","burns","fever"] },
  { id:99, name:"KIMS Hubli", specialty:"Emergency Care", lat:15.356, lng:75.126, cost:"₹0-100", languages:["Kannada","Hindi","English"], trustBadge:true, phone:"+91 836 2372555", rating:3.7, conditions:["injury","fracture","bleeding","fever"] },
  { id:100, name:"Bellary VIMS", specialty:"General Hospital", lat:15.144, lng:76.926, cost:"₹0-100", languages:["Kannada","Telugu"], trustBadge:true, phone:"+91 8392 260260", rating:3.4, conditions:["fever","pain","injury","dizziness"] },

  // ===== TAMIL NADU =====
  { id:101, name:"Rajiv Gandhi Govt Chennai", specialty:"Emergency Care", lat:13.083, lng:80.271, cost:"₹0-50", languages:["Tamil","English"], trustBadge:true, phone:"+91 44 25305000", rating:4.0, conditions:["injury","fracture","bleeding","burns","fever"] },
  { id:102, name:"Apollo Main Chennai", specialty:"Specialist", lat:13.062, lng:80.252, cost:"₹1500-3500", languages:["English","Tamil","Telugu"], trustBadge:true, phone:"+91 44 28290200", rating:4.6, conditions:["chest pain","breathing","fracture","burns","allergy"] },
  { id:103, name:"CMC Vellore", specialty:"Specialist", lat:12.922, lng:79.135, cost:"₹500-2000", languages:["Tamil","English","Telugu"], trustBadge:true, phone:"+91 416 2281000", rating:4.7, conditions:["chest pain","breathing","fracture","burns","allergy","injury"] },
  { id:104, name:"Coimbatore CMCH", specialty:"Emergency Care", lat:11.018, lng:76.965, cost:"₹0-50", languages:["Tamil","English"], trustBadge:true, phone:"+91 422 2301393", rating:3.8, conditions:["injury","fracture","bleeding","fever","burns"] },
  { id:105, name:"Salem Govt Hosp", specialty:"General Hospital", lat:11.664, lng:78.145, cost:"₹0-50", languages:["Tamil"], trustBadge:true, phone:"+91 427 2311454", rating:3.4, conditions:["fever","pain","dizziness","injury"] },
  { id:106, name:"Madurai Govt Hosp", specialty:"Emergency Care", lat:9.933, lng:78.119, cost:"₹0-50", languages:["Tamil"], trustBadge:true, phone:"+91 452 2532535", rating:3.6, conditions:["injury","fracture","bleeding","fever"] },

  // ===== KERALA =====
  { id:107, name:"AIMS Kochi", specialty:"Specialist", lat:10.038, lng:76.299, cost:"₹1000-3000", languages:["Malayalam","English"], trustBadge:true, phone:"+91 484 2801234", rating:4.4, conditions:["chest pain","breathing","fracture","allergy","burns"] },
  { id:108, name:"Medical College TVM", specialty:"Emergency Care", lat:8.523, lng:76.927, cost:"₹0-50", languages:["Malayalam","English"], trustBadge:true, phone:"+91 471 2528386", rating:4.0, conditions:["injury","fracture","bleeding","burns","fever"] },
  { id:109, name:"MIMS Calicut", specialty:"General Hospital", lat:11.258, lng:75.780, cost:"₹800-2000", languages:["Malayalam","English"], trustBadge:true, phone:"+91 495 2741234", rating:4.2, conditions:["fever","pain","injury","fracture","vomiting","allergy"] },
  { id:110, name:"Thrissur Jubilee Mission", specialty:"Specialist", lat:10.525, lng:76.216, cost:"₹800-2500", languages:["Malayalam","English"], trustBadge:true, phone:"+91 487 2436200", rating:4.3, conditions:["chest pain","breathing","allergy","fracture"] },

  // ===== TELANGANA & ANDHRA PRADESH =====
  { id:111, name:"Osmania General Hyd", specialty:"Emergency Care", lat:17.373, lng:78.472, cost:"₹0-50", languages:["Telugu","Hindi","Urdu"], trustBadge:true, phone:"+91 40 24600146", rating:3.9, conditions:["injury","fracture","bleeding","burns","fever"] },
  { id:112, name:"Apollo Jubilee Hills", specialty:"Specialist", lat:17.418, lng:78.412, cost:"₹2000-5000", languages:["English","Telugu","Hindi"], trustBadge:true, phone:"+91 40 23607777", rating:4.6, conditions:["chest pain","breathing","fracture","burns","allergy"] },
  { id:113, name:"NIMS Hyderabad", specialty:"Emergency Care", lat:17.398, lng:78.521, cost:"₹0-100", languages:["Telugu","Hindi","English"], trustBadge:true, phone:"+91 40 23389999", rating:4.2, conditions:["injury","fracture","bleeding","burns","fever","chest pain"] },
  { id:114, name:"KGH Visakhapatnam", specialty:"Emergency Care", lat:17.709, lng:83.301, cost:"₹0-100", languages:["Telugu","English"], trustBadge:true, phone:"+91 891 2553520", rating:3.8, conditions:["injury","fracture","bleeding","fever"] },
  { id:115, name:"Guntur Govt Hosp", specialty:"General Hospital", lat:16.306, lng:80.441, cost:"₹0-50", languages:["Telugu","Hindi"], trustBadge:true, phone:"+91 863 2233550", rating:3.5, conditions:["fever","pain","injury","dizziness","vomiting"] },
  { id:116, name:"Tirupati SVIMS", specialty:"Specialist", lat:13.644, lng:79.426, cost:"₹0-200", languages:["Telugu","English"], trustBadge:true, phone:"+91 877 2287777", rating:4.1, conditions:["chest pain","breathing","allergy","fracture"] },

  // ===== WEST BENGAL =====
  { id:117, name:"SSKM Hospital Kolkata", specialty:"Emergency Care", lat:22.540, lng:88.344, cost:"₹0-50", languages:["Bengali","English","Hindi"], trustBadge:true, phone:"+91 33 22041100", rating:4.0, conditions:["injury","fracture","bleeding","burns","fever","chest pain"] },
  { id:118, name:"Apollo Gleneagles", specialty:"Specialist", lat:22.572, lng:88.407, cost:"₹2000-5000", languages:["English","Bengali"], trustBadge:true, phone:"+91 33 23203040", rating:4.5, conditions:["chest pain","breathing","fracture","burns","allergy"] },
  { id:119, name:"NRS Medical Kolkata", specialty:"Emergency Care", lat:22.568, lng:88.365, cost:"₹0-50", languages:["Bengali","Hindi"], trustBadge:true, phone:"+91 33 22121636", rating:3.6, conditions:["injury","fever","bleeding","pain","fracture"] },
  { id:120, name:"Siliguri District Hosp", specialty:"General Hospital", lat:26.710, lng:88.427, cost:"₹0-100", languages:["Bengali","Hindi","Nepali"], trustBadge:true, phone:"+91 353 2432244", rating:3.3, conditions:["fever","pain","dizziness","injury","vomiting"] },

  // ===== ODISHA =====
  { id:121, name:"AIIMS Bhubaneswar", specialty:"Specialist", lat:20.236, lng:85.773, cost:"₹0-100", languages:["Odia","Hindi","English"], trustBadge:true, phone:"+91 674 2476200", rating:4.4, conditions:["chest pain","breathing","fracture","burns","bleeding","injury"] },
  { id:122, name:"SCB Medical Cuttack", specialty:"Emergency Care", lat:20.463, lng:85.882, cost:"₹0-50", languages:["Odia","Hindi"], trustBadge:true, phone:"+91 671 2414080", rating:3.7, conditions:["injury","fracture","bleeding","fever","burns"] },

  // ===== ASSAM & NORTHEAST =====
  { id:123, name:"GMCH Guwahati", specialty:"Emergency Care", lat:26.156, lng:91.760, cost:"₹0-50", languages:["Assamese","Hindi","English"], trustBadge:true, phone:"+91 361 2328056", rating:3.9, conditions:["injury","fracture","bleeding","fever","burns"] },
  { id:124, name:"NEIGRIHMS Shillong", specialty:"Specialist", lat:25.575, lng:91.880, cost:"₹0-200", languages:["Khasi","English","Hindi"], trustBadge:true, phone:"+91 364 2538060", rating:4.1, conditions:["chest pain","breathing","allergy","fracture"] },
  { id:125, name:"Agartala GBP Hosp", specialty:"Emergency Care", lat:23.836, lng:91.279, cost:"₹0-50", languages:["Bengali","Hindi","English"], trustBadge:true, phone:"+91 381 2324040", rating:3.4, conditions:["injury","fever","bleeding","pain"] },

  // ===== HARYANA =====
  { id:126, name:"PGI Rohtak", specialty:"Emergency Care", lat:28.882, lng:76.608, cost:"₹0-50", languages:["Hindi","English"], trustBadge:true, phone:"+91 1262 281307", rating:4.0, conditions:["injury","fracture","bleeding","burns","fever"] },
  { id:127, name:"Faridabad Metro Hosp", specialty:"General Hospital", lat:28.408, lng:77.313, cost:"₹500-1500", languages:["Hindi","English"], trustBadge:true, phone:"+91 129 4069000", rating:3.8, conditions:["fever","pain","vomiting","injury","fracture"] },
  { id:128, name:"Hisar PGIMS", specialty:"General Hospital", lat:29.152, lng:75.726, cost:"₹0-50", languages:["Hindi","Haryanvi"], trustBadge:true, phone:"+91 1662 244734", rating:3.5, conditions:["fever","pain","dizziness","injury"] },

  // ===== PUDUCHERRY =====
  { id:129, name:"JIPMER Puducherry", specialty:"Emergency Care", lat:11.960, lng:79.849, cost:"₹0-50", languages:["Tamil","English","Telugu"], trustBadge:true, phone:"+91 413 2272380", rating:4.5, conditions:["chest pain","breathing","fracture","burns","bleeding","injury","fever","allergy"] },

  // ===== GWALIOR Additions =====
  { id:130, name:"BIMR Hospitals Gwalior", specialty:"Multi-Specialty", lat:26.242, lng:78.204, cost:"₹1000-3000", languages:["Hindi","English"], trustBadge:true, phone:"+91 751 2432400", rating:4.4, conditions:["chest pain","breathing","fracture","allergy"] },
  { id:131, name:"Sahara Hospital Gwalior", specialty:"General Hospital", lat:26.208, lng:78.169, cost:"₹500-1500", languages:["Hindi","English"], trustBadge:true, phone:"+91 751 2445500", rating:4.1, conditions:["fever","injury","fracture","vomiting"] },
  { id:132, name:"Kalyan Memorial Gwalior", specialty:"Specialist", lat:26.220, lng:78.175, cost:"₹800-2000", languages:["Hindi"], trustBadge:true, phone:"+91 751 2341234", rating:4.3, conditions:["chest pain","burns","allergy","fracture"] },
  { id:133, name:"Apollo Spectra Gwalior", specialty:"Emergency Care", lat:26.210, lng:78.188, cost:"₹1500-3500", languages:["Hindi","English"], trustBadge:true, phone:"+91 751 4001111", rating:4.5, conditions:["injury","fracture","bleeding","fever","burns"] },
  { id:134, name:"District Hospital Morar", specialty:"General Hospital", lat:26.230, lng:78.225, cost:"₹0-50", languages:["Hindi"], trustBadge:false, phone:"+91 751 2368222", rating:3.2, conditions:["fever","pain","dizziness","injury"] },
];
