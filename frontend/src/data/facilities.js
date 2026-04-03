export const facilities = [
  // DELHI
  {
    id:"f1",name:"AIIMS Delhi",city:"Delhi",area:"Ansari Nagar",
    type:"govt_hospital",lat:28.5672,lng:77.2100,distance:5.0,travelMin:25,
    specialties:["emergency","cardiology","neurology","general","pediatrics"],
    costConsultation:[0,30],costEmergency:[0,500],costBadge:"budget",
    languages:["Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"011-26588500",openNow:true,
    whyRecommended:"India's premier government hospital. Best for serious emergencies. Subsidized care."
  },
  {
    id:"f2",name:"Apollo Hospital Delhi",city:"Delhi",area:"Sarita Vihar",
    type:"private_hospital",lat:28.5355,lng:77.2910,distance:6.5,travelMin:30,
    specialties:["cardiology","emergency","general","orthopedics","neurology"],
    costConsultation:[900,1800],costEmergency:[2500,12000],costBadge:"premium",
    languages:["Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"011-29871011",openNow:true,
    whyRecommended:"World-class private hospital. Excellent for cardiac, trauma, and complex cases."
  },
  {
    id:"f3",name:"Safdarjung Hospital",city:"Delhi",area:"Safdarjung",
    type:"govt_hospital",lat:28.5685,lng:77.2060,distance:4.8,travelMin:22,
    specialties:["emergency","surgery","general","orthopedics","burns"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Hindi","English"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"011-26707444",openNow:true,
    whyRecommended:"Large central government hospital with trauma and burns unit. Free treatment."
  },
  {
    id:"f4",name:"Max Super Speciality Hospital Saket",city:"Delhi",area:"Saket",
    type:"private_hospital",lat:28.5274,lng:77.2159,distance:7.0,travelMin:32,
    specialties:["cardiology","neurology","oncology","orthopedics","emergency"],
    costConsultation:[1000,2000],costEmergency:[3000,15000],costBadge:"premium",
    languages:["Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"011-26515050",openNow:true,
    whyRecommended:"Top-tier private hospital in South Delhi. Excellent multi-specialty care."
  },
  // MUMBAI
  {
    id:"f5",name:"KEM Hospital Mumbai",city:"Mumbai",area:"Parel",
    type:"govt_hospital",lat:19.0010,lng:72.8410,distance:3.2,travelMin:20,
    specialties:["emergency","cardiology","general","surgery","pediatrics"],
    costConsultation:[0,50],costEmergency:[0,500],costBadge:"budget",
    languages:["Hindi","English","Marathi"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"022-24107000",openNow:true,
    whyRecommended:"Major government hospital. Full emergency capability. Near-zero cost for all."
  },
  {
    id:"f6",name:"Lilavati Hospital Mumbai",city:"Mumbai",area:"Bandra",
    type:"private_hospital",lat:19.0544,lng:72.8322,distance:4.8,travelMin:25,
    specialties:["cardiology","emergency","general","orthopedics"],
    costConsultation:[1000,2000],costEmergency:[3000,15000],costBadge:"premium",
    languages:["Hindi","English","Marathi"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"022-26751000",openNow:true,
    whyRecommended:"Top-tier private hospital. Best for cardiac, trauma, or complex emergencies."
  },
  {
    id:"f7",name:"Tata Memorial Hospital",city:"Mumbai",area:"Parel",
    type:"govt_hospital",lat:19.0042,lng:72.8427,distance:3.5,travelMin:22,
    specialties:["oncology","surgery","general"],
    costConsultation:[0,100],costEmergency:[0,500],costBadge:"budget",
    languages:["Hindi","English","Marathi"],touristFriendly:false,
    tags:["24x7","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"022-24177000",openNow:true,
    whyRecommended:"India's premier cancer hospital. Subsidized treatment for all income groups."
  },
  {
    id:"f8",name:"Kokilaben Dhirubhai Ambani Hospital",city:"Mumbai",area:"Andheri West",
    type:"private_hospital",lat:19.1334,lng:72.8270,distance:6.0,travelMin:28,
    specialties:["cardiology","neurology","orthopedics","emergency","oncology"],
    costConsultation:[1200,2500],costEmergency:[4000,20000],costBadge:"premium",
    languages:["Hindi","English","Marathi","Gujarati"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"022-42696969",openNow:true,
    whyRecommended:"State-of-the-art private hospital. Robotic surgery and advanced cardiac care."
  },
  // BANGALORE
  {
    id:"f9",name:"Nimhans",city:"Bangalore",area:"Hosur Road",
    type:"govt_hospital",lat:12.9399,lng:77.5955,distance:5.5,travelMin:25,
    specialties:["neurology","psychiatry","general"],
    costConsultation:[0,50],costEmergency:[0,300],costBadge:"budget",
    languages:["Kannada","Hindi","English"],touristFriendly:false,
    tags:["govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"080-46110007",openNow:true,
    whyRecommended:"Premier neuro and mental health institute. Subsidized care."
  },
  {
    id:"f10",name:"Manipal Hospital Bangalore",city:"Bangalore",area:"HAL Airport Road",
    type:"private_hospital",lat:12.9592,lng:77.6474,distance:4.2,travelMin:20,
    specialties:["cardiology","orthopedics","emergency","general","neurology"],
    costConsultation:[800,1500],costEmergency:[2000,10000],costBadge:"premium",
    languages:["Kannada","Hindi","English","Tamil"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"080-25024444",openNow:true,
    whyRecommended:"Top private hospital in Bangalore. Excellent multi-specialty and emergency care."
  },
  {
    id:"f11",name:"Victoria Hospital Bangalore",city:"Bangalore",area:"Krishnarajendra Road",
    type:"govt_hospital",lat:12.9716,lng:77.5730,distance:3.0,travelMin:18,
    specialties:["emergency","surgery","general","orthopedics"],
    costConsultation:[0,30],costEmergency:[0,200],costBadge:"budget",
    languages:["Kannada","Hindi","English"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"080-26703600",openNow:true,
    whyRecommended:"Major government hospital in central Bangalore. Free emergency care."
  },
  // CHENNAI
  {
    id:"f12",name:"Government General Hospital Chennai",city:"Chennai",area:"Park Town",
    type:"govt_hospital",lat:13.0827,lng:80.2707,distance:2.5,travelMin:15,
    specialties:["emergency","cardiology","general","surgery","pediatrics"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Tamil","English","Hindi"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"044-25305000",openNow:true,
    whyRecommended:"Largest government hospital in Tamil Nadu. Full emergency and specialty care."
  },
  {
    id:"f13",name:"Apollo Hospital Chennai",city:"Chennai",area:"Greams Road",
    type:"private_hospital",lat:13.0569,lng:80.2425,distance:5.0,travelMin:22,
    specialties:["cardiology","neurology","orthopedics","emergency","oncology"],
    costConsultation:[1000,2000],costEmergency:[3000,15000],costBadge:"premium",
    languages:["Tamil","English","Hindi","Telugu"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"044-28290200",openNow:true,
    whyRecommended:"Flagship Apollo hospital. World-class cardiac and multi-specialty care."
  },
  {
    id:"f14",name:"MIOT International Chennai",city:"Chennai",area:"Manapakkam",
    type:"private_hospital",lat:13.0108,lng:80.1760,distance:8.0,travelMin:35,
    specialties:["orthopedics","cardiology","emergency","general"],
    costConsultation:[900,1800],costEmergency:[2500,12000],costBadge:"premium",
    languages:["Tamil","English","Hindi"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"044-22490900",openNow:true,
    whyRecommended:"Renowned for orthopedics and joint replacement. Excellent private care."
  },
  // HYDERABAD
  {
    id:"f15",name:"Osmania General Hospital",city:"Hyderabad",area:"Afzalgunj",
    type:"govt_hospital",lat:17.3850,lng:78.4867,distance:3.0,travelMin:18,
    specialties:["emergency","general","surgery","cardiology"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Telugu","Urdu","Hindi","English"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"040-24600124",openNow:true,
    whyRecommended:"Largest government hospital in Hyderabad. Free emergency and general care."
  },
  {
    id:"f16",name:"Apollo Hospital Hyderabad",city:"Hyderabad",area:"Jubilee Hills",
    type:"private_hospital",lat:17.4239,lng:78.4071,distance:5.5,travelMin:25,
    specialties:["cardiology","neurology","orthopedics","emergency","oncology"],
    costConsultation:[900,1800],costEmergency:[2500,12000],costBadge:"premium",
    languages:["Telugu","Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"040-23607777",openNow:true,
    whyRecommended:"Top private hospital in Hyderabad. Excellent cardiac and emergency care."
  },
  {
    id:"f17",name:"NIMS Hyderabad",city:"Hyderabad",area:"Punjagutta",
    type:"govt_hospital",lat:17.4239,lng:78.4482,distance:4.0,travelMin:20,
    specialties:["neurology","cardiology","emergency","general","surgery"],
    costConsultation:[0,50],costEmergency:[0,400],costBadge:"budget",
    languages:["Telugu","Hindi","English"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"040-23489000",openNow:true,
    whyRecommended:"Nizams Institute of Medical Sciences. Premier government super-specialty hospital."
  },
  // KOLKATA
  {
    id:"f18",name:"SSKM Hospital Kolkata",city:"Kolkata",area:"AJC Bose Road",
    type:"govt_hospital",lat:22.5354,lng:88.3476,distance:3.5,travelMin:20,
    specialties:["emergency","cardiology","general","surgery","neurology"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Bengali","Hindi","English"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"033-22041739",openNow:true,
    whyRecommended:"Largest government hospital in West Bengal. Full emergency and specialty care."
  },
  {
    id:"f19",name:"Apollo Gleneagles Kolkata",city:"Kolkata",area:"Canal Circular Road",
    type:"private_hospital",lat:22.5726,lng:88.3639,distance:5.0,travelMin:25,
    specialties:["cardiology","orthopedics","emergency","general","oncology"],
    costConsultation:[900,1800],costEmergency:[2500,12000],costBadge:"premium",
    languages:["Bengali","Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"033-23201000",openNow:true,
    whyRecommended:"Top private hospital in Kolkata. Excellent cardiac and multi-specialty care."
  },
  // PUNE
  {
    id:"f20",name:"Sassoon General Hospital Pune",city:"Pune",area:"Pune Station",
    type:"govt_hospital",lat:18.5204,lng:73.8567,distance:2.0,travelMin:12,
    specialties:["emergency","general","surgery","pediatrics","orthopedics"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Marathi","Hindi","English"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"020-26128000",openNow:true,
    whyRecommended:"Main government hospital in Pune. Free emergency and general care."
  },
  {
    id:"f21",name:"Ruby Hall Clinic Pune",city:"Pune",area:"Sassoon Road",
    type:"private_hospital",lat:18.5314,lng:73.8741,distance:3.5,travelMin:18,
    specialties:["cardiology","orthopedics","emergency","general","neurology"],
    costConsultation:[800,1500],costEmergency:[2000,10000],costBadge:"premium",
    languages:["Marathi","Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"020-26163391",openNow:true,
    whyRecommended:"Leading private hospital in Pune. Excellent cardiac and emergency care."
  },
  // JAIPUR
  {
    id:"f22",name:"SMS Hospital Jaipur",city:"Jaipur",area:"Tonk Road",
    type:"govt_hospital",lat:26.9124,lng:75.7873,distance:3.5,travelMin:18,
    specialties:["general","pediatrics","emergency","cardiology","orthopedics"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Hindi","English","Rajasthani"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0141-2518501",openNow:true,
    whyRecommended:"Largest government hospital in Rajasthan. Full emergency and pediatric care."
  },
  {
    id:"f23",name:"Fortis Escorts Jaipur",city:"Jaipur",area:"Malviya Nagar",
    type:"private_hospital",lat:26.8631,lng:75.8069,distance:5.2,travelMin:25,
    specialties:["cardiology","emergency","general","orthopedics"],
    costConsultation:[800,1500],costEmergency:[2000,8000],costBadge:"premium",
    languages:["Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"0141-2547000",openNow:true,
    whyRecommended:"Premium private hospital. Best for cardiac emergencies in Jaipur."
  },
  // AHMEDABAD
  {
    id:"f24",name:"Civil Hospital Ahmedabad",city:"Ahmedabad",area:"Asarwa",
    type:"govt_hospital",lat:23.0469,lng:72.6005,distance:4.0,travelMin:22,
    specialties:["emergency","general","surgery","cardiology","pediatrics"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Gujarati","Hindi","English"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"079-22681000",openNow:true,
    whyRecommended:"Largest government hospital in Gujarat. Free emergency and specialty care."
  },
  {
    id:"f25",name:"Apollo Hospital Ahmedabad",city:"Ahmedabad",area:"Bhat",
    type:"private_hospital",lat:23.1136,lng:72.5837,distance:7.0,travelMin:30,
    specialties:["cardiology","orthopedics","emergency","general","neurology"],
    costConsultation:[900,1800],costEmergency:[2500,12000],costBadge:"premium",
    languages:["Gujarati","Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"079-66701800",openNow:true,
    whyRecommended:"Top private hospital in Ahmedabad. Excellent cardiac and multi-specialty care."
  },
  // LUCKNOW
  {
    id:"f26",name:"KGMU Lucknow",city:"Lucknow",area:"Chowk",
    type:"govt_hospital",lat:26.8650,lng:80.9462,distance:3.0,travelMin:18,
    specialties:["emergency","cardiology","neurology","general","surgery"],
    costConsultation:[0,30],costEmergency:[0,400],costBadge:"budget",
    languages:["Hindi","English","Urdu"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0522-2257540",openNow:true,
    whyRecommended:"King George's Medical University. Premier government hospital in UP."
  },
  {
    id:"f27",name:"Medanta Hospital Lucknow",city:"Lucknow",area:"Sushant Golf City",
    type:"private_hospital",lat:26.7606,lng:80.9462,distance:8.0,travelMin:35,
    specialties:["cardiology","neurology","orthopedics","emergency","oncology"],
    costConsultation:[1000,2000],costEmergency:[3000,15000],costBadge:"premium",
    languages:["Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"0522-4500000",openNow:true,
    whyRecommended:"World-class private hospital. Excellent cardiac and multi-specialty care in Lucknow."
  },
  // VARANASI
  {
    id:"f28",name:"Sir Sunderlal Hospital (BHU)",city:"Varanasi",area:"BHU Campus",
    type:"govt_hospital",lat:25.2677,lng:82.9913,distance:4.1,travelMin:22,
    specialties:["cardiology","emergency","general","neurology"],
    costConsultation:[0,50],costEmergency:[0,500],costBadge:"budget",
    languages:["Hindi","English","Bhojpuri"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0542-2307528",openNow:true,
    whyRecommended:"Premier government hospital with full cardiac and emergency capability."
  },
  // GOA
  {
    id:"f29",name:"Goa Medical College & Hospital",city:"Goa",area:"Bambolim",
    type:"govt_hospital",lat:15.4909,lng:73.8278,distance:6.0,travelMin:20,
    specialties:["emergency","orthopedics","general","surgery"],
    costConsultation:[0,50],costEmergency:[0,400],costBadge:"budget",
    languages:["Konkani","Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0832-2458727",openNow:true,
    whyRecommended:"Main government hospital in Goa. Emergency capable, English-speaking staff."
  },
  {
    id:"f30",name:"Manipal Hospital Goa",city:"Goa",area:"Dona Paula",
    type:"private_hospital",lat:15.4589,lng:73.8019,distance:4.5,travelMin:15,
    specialties:["orthopedics","emergency","general"],
    costConsultation:[700,1200],costEmergency:[1500,6000],costBadge:"premium",
    languages:["English","Hindi","Konkani"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"0832-2520888",openNow:true,
    whyRecommended:"Top private hospital in Goa. Excellent for tourists, English-speaking."
  },
  // RISHIKESH
  {
    id:"f31",name:"AIIMS Rishikesh",city:"Rishikesh",area:"Virbhadra Road",
    type:"govt_hospital",lat:30.1290,lng:78.3098,distance:5.5,travelMin:20,
    specialties:["emergency","gastro","general","surgery"],
    costConsultation:[0,30],costEmergency:[0,500],costBadge:"budget",
    languages:["Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0135-2462900",openNow:true,
    whyRecommended:"AIIMS-level care in Rishikesh. Free/subsidized treatment. Emergency capable."
  },
  // MANALI
  {
    id:"f32",name:"Zonal Hospital Manali",city:"Manali",area:"Mall Road",
    type:"govt_hospital",lat:32.2396,lng:77.1887,distance:1.2,travelMin:8,
    specialties:["general","emergency","orthopedics"],
    costConsultation:[0,50],costEmergency:[0,200],costBadge:"budget",
    languages:["Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:false,digitalPayment:false,phone:"01902-252379",openNow:true,
    whyRecommended:"Government hospital with emergency ward, zero consultation fee, closest to tourist zone."
  },
  // SPITI
  {
    id:"f33",name:"PHC Spiti Valley",city:"Spiti",area:"Kaza",
    type:"govt_hospital",lat:32.2270,lng:78.0720,distance:8.0,travelMin:40,
    specialties:["general","emergency_basic"],
    costConsultation:[0,0],costEmergency:[0,100],costBadge:"budget",
    languages:["Hindi","Spitian"],touristFriendly:false,
    tags:["govt_listed","verified"],
    femaleDoctorAvailable:false,digitalPayment:false,phone:"01906-222XXX",openNow:false,
    whyRecommended:"Only government facility in this remote area. Basic care only. Nearest full hospital is 4+ hours away."
  },
  // CHANDIGARH
  {
    id:"f34",name:"PGIMER Chandigarh",city:"Chandigarh",area:"Sector 12",
    type:"govt_hospital",lat:30.7650,lng:76.7780,distance:3.0,travelMin:15,
    specialties:["cardiology","neurology","emergency","general","oncology","pediatrics"],
    costConsultation:[0,50],costEmergency:[0,500],costBadge:"budget",
    languages:["Hindi","Punjabi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0172-2755555",openNow:true,
    whyRecommended:"Post Graduate Institute of Medical Education — one of India's top government hospitals. Subsidized world-class care."
  },
  {
    id:"f35",name:"Fortis Hospital Mohali",city:"Chandigarh",area:"Mohali Phase 8",
    type:"private_hospital",lat:30.7046,lng:76.7179,distance:6.5,travelMin:28,
    specialties:["cardiology","orthopedics","emergency","general","neurology"],
    costConsultation:[900,1800],costEmergency:[2500,12000],costBadge:"premium",
    languages:["Hindi","Punjabi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"0172-4692222",openNow:true,
    whyRecommended:"Top private hospital near Chandigarh. Excellent cardiac and orthopedic care."
  },
  // BHOPAL
  {
    id:"f36",name:"AIIMS Bhopal",city:"Bhopal",area:"Saket Nagar",
    type:"govt_hospital",lat:23.1765,lng:77.3963,distance:5.0,travelMin:22,
    specialties:["emergency","cardiology","general","surgery","pediatrics"],
    costConsultation:[0,30],costEmergency:[0,400],costBadge:"budget",
    languages:["Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0755-2672355",openNow:true,
    whyRecommended:"AIIMS-level care in central India. Free/subsidized treatment for all."
  },
  {
    id:"f37",name:"Bansal Hospital Bhopal",city:"Bhopal",area:"C-Sector Shahpura",
    type:"private_hospital",lat:23.1993,lng:77.4601,distance:4.5,travelMin:20,
    specialties:["cardiology","orthopedics","emergency","general"],
    costConsultation:[700,1400],costEmergency:[2000,9000],costBadge:"moderate",
    languages:["Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"0755-4000000",openNow:true,
    whyRecommended:"Leading private hospital in Bhopal. Good cardiac and emergency care at moderate cost."
  },
  // NAGPUR
  {
    id:"f38",name:"Government Medical College Nagpur",city:"Nagpur",area:"Hanuman Nagar",
    type:"govt_hospital",lat:21.1458,lng:79.0882,distance:3.5,travelMin:18,
    specialties:["emergency","general","surgery","cardiology","pediatrics"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Marathi","Hindi","English"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0712-2700000",openNow:true,
    whyRecommended:"Main government hospital in Vidarbha region. Free emergency and general care."
  },
  {
    id:"f39",name:"Wockhardt Hospital Nagpur",city:"Nagpur",area:"Ramdaspeth",
    type:"private_hospital",lat:21.1497,lng:79.0806,distance:2.5,travelMin:14,
    specialties:["cardiology","orthopedics","emergency","general"],
    costConsultation:[800,1500],costEmergency:[2000,10000],costBadge:"premium",
    languages:["Marathi","Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"0712-6622000",openNow:true,
    whyRecommended:"Top private hospital in Nagpur. Excellent cardiac and emergency care."
  },
  // KOCHI
  {
    id:"f40",name:"Government Medical College Kochi",city:"Kochi",area:"Ernakulam",
    type:"govt_hospital",lat:9.9312,lng:76.2673,distance:3.0,travelMin:16,
    specialties:["emergency","general","surgery","cardiology","pediatrics"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Malayalam","English","Hindi"],touristFriendly:true,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0484-2805000",openNow:true,
    whyRecommended:"Main government hospital in Kochi. Free emergency care. English-speaking staff."
  },
  {
    id:"f41",name:"Amrita Institute of Medical Sciences Kochi",city:"Kochi",area:"Ponekkara",
    type:"private_hospital",lat:9.9816,lng:76.2999,distance:6.0,travelMin:25,
    specialties:["cardiology","neurology","orthopedics","emergency","oncology"],
    costConsultation:[1000,2000],costEmergency:[3000,15000],costBadge:"premium",
    languages:["Malayalam","English","Hindi"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"0484-2801234",openNow:true,
    whyRecommended:"World-class private hospital in Kerala. Excellent multi-specialty and emergency care."
  },
  // INDORE
  {
    id:"f42",name:"MY Hospital Indore",city:"Indore",area:"MG Road",
    type:"govt_hospital",lat:22.7196,lng:75.8577,distance:2.5,travelMin:14,
    specialties:["emergency","general","surgery","cardiology","pediatrics"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Hindi","English"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0731-2527493",openNow:true,
    whyRecommended:"Maharaja Yeshwantrao Hospital — largest government hospital in MP. Free emergency care."
  },
  {
    id:"f43",name:"Bombay Hospital Indore",city:"Indore",area:"Ring Road",
    type:"private_hospital",lat:22.7244,lng:75.8839,distance:3.5,travelMin:18,
    specialties:["cardiology","orthopedics","emergency","general","neurology"],
    costConsultation:[800,1500],costEmergency:[2000,10000],costBadge:"premium",
    languages:["Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"0731-4077000",openNow:true,
    whyRecommended:"Top private hospital in Indore. Excellent cardiac and multi-specialty care."
  },
  // PATNA
  {
    id:"f44",name:"PMCH Patna",city:"Patna",area:"Ashok Rajpath",
    type:"govt_hospital",lat:25.6093,lng:85.1376,distance:3.0,travelMin:18,
    specialties:["emergency","general","surgery","cardiology","pediatrics"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Hindi","English","Maithili"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0612-2300000",openNow:true,
    whyRecommended:"Patna Medical College Hospital — largest government hospital in Bihar. Free emergency care."
  },
  {
    id:"f45",name:"Ruban Memorial Hospital Patna",city:"Patna",area:"Boring Road",
    type:"private_hospital",lat:25.6121,lng:85.1136,distance:4.0,travelMin:20,
    specialties:["cardiology","orthopedics","emergency","general"],
    costConsultation:[700,1400],costEmergency:[2000,9000],costBadge:"moderate",
    languages:["Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"0612-3290000",openNow:true,
    whyRecommended:"Leading private hospital in Patna. Good cardiac and emergency care."
  },
  // BHUBANESWAR
  {
    id:"f46",name:"AIIMS Bhubaneswar",city:"Bhubaneswar",area:"Sijua",
    type:"govt_hospital",lat:20.1863,lng:85.8245,distance:6.0,travelMin:25,
    specialties:["emergency","cardiology","general","surgery","pediatrics"],
    costConsultation:[0,30],costEmergency:[0,400],costBadge:"budget",
    languages:["Odia","Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0674-2476789",openNow:true,
    whyRecommended:"AIIMS-level care in Odisha. Free/subsidized treatment. Emergency capable."
  },
  {
    id:"f47",name:"Apollo Hospital Bhubaneswar",city:"Bhubaneswar",area:"Unit 15",
    type:"private_hospital",lat:20.2961,lng:85.8189,distance:4.5,travelMin:20,
    specialties:["cardiology","orthopedics","emergency","general","neurology"],
    costConsultation:[900,1800],costEmergency:[2500,12000],costBadge:"premium",
    languages:["Odia","Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"0674-6661066",openNow:true,
    whyRecommended:"Top private hospital in Odisha. Excellent cardiac and multi-specialty care."
  },
  // COIMBATORE
  {
    id:"f48",name:"Coimbatore Medical College Hospital",city:"Coimbatore",area:"Peelamedu",
    type:"govt_hospital",lat:11.0168,lng:77.0005,distance:4.0,travelMin:20,
    specialties:["emergency","general","surgery","cardiology","pediatrics"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Tamil","English","Hindi"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0422-2301393",openNow:true,
    whyRecommended:"Main government hospital in Coimbatore. Free emergency and general care."
  },
  {
    id:"f49",name:"PSG Hospitals Coimbatore",city:"Coimbatore",area:"Peelamedu",
    type:"private_hospital",lat:11.0238,lng:77.0024,distance:4.5,travelMin:22,
    specialties:["cardiology","orthopedics","emergency","general","neurology"],
    costConsultation:[800,1500],costEmergency:[2000,10000],costBadge:"moderate",
    languages:["Tamil","English","Hindi"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"0422-4345678",openNow:true,
    whyRecommended:"Top private hospital in Coimbatore. Excellent cardiac and emergency care at moderate cost."
  },
  // VISAKHAPATNAM
  {
    id:"f50",name:"King George Hospital Visakhapatnam",city:"Visakhapatnam",area:"Maharanipeta",
    type:"govt_hospital",lat:17.7231,lng:83.3012,distance:3.0,travelMin:16,
    specialties:["emergency","general","surgery","cardiology","pediatrics"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Telugu","English","Hindi"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0891-2564891",openNow:true,
    whyRecommended:"Largest government hospital in Andhra Pradesh. Free emergency and specialty care."
  },
  {
    id:"f51",name:"Care Hospital Visakhapatnam",city:"Visakhapatnam",area:"Ramnagar",
    type:"private_hospital",lat:17.7326,lng:83.3198,distance:4.0,travelMin:20,
    specialties:["cardiology","orthopedics","emergency","general","neurology"],
    costConsultation:[800,1600],costEmergency:[2000,10000],costBadge:"premium",
    languages:["Telugu","English","Hindi"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"0891-6767777",openNow:true,
    whyRecommended:"Top private hospital in Vizag. Excellent cardiac and emergency care."
  },
  // SURAT
  {
    id:"f52",name:"New Civil Hospital Surat",city:"Surat",area:"Majura Gate",
    type:"govt_hospital",lat:21.2049,lng:72.8365,distance:3.5,travelMin:18,
    specialties:["emergency","general","surgery","cardiology","pediatrics"],
    costConsultation:[0,30],costEmergency:[0,300],costBadge:"budget",
    languages:["Gujarati","Hindi","English"],touristFriendly:false,
    tags:["24x7","emergency_capable","govt_listed","verified"],
    femaleDoctorAvailable:true,digitalPayment:false,phone:"0261-2244000",openNow:true,
    whyRecommended:"Main government hospital in Surat. Free emergency and general care."
  },
  {
    id:"f53",name:"Kiran Hospital Surat",city:"Surat",area:"Katargam",
    type:"private_hospital",lat:21.2270,lng:72.8560,distance:5.0,travelMin:22,
    specialties:["cardiology","orthopedics","emergency","general","neurology"],
    costConsultation:[800,1500],costEmergency:[2000,10000],costBadge:"moderate",
    languages:["Gujarati","Hindi","English"],touristFriendly:true,
    tags:["24x7","emergency_capable","verified","tourist_friendly","digital_payment","female_doctor"],
    femaleDoctorAvailable:true,digitalPayment:true,phone:"0261-6191000",openNow:true,
    whyRecommended:"Leading private hospital in Surat. Good cardiac and emergency care at moderate cost."
  }
];

