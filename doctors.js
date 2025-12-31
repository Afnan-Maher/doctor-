// // Doctors Database
// const doctors = [
//     {
//         id: '1',
//         name: 'Dr. Sarah Johnson',
//         specialty: 'Cardiology',
//         experience: 15,
//         photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
//         rating: 4.9,
//         reviews: 156,
//         phone: '+1 (555) 123-4567',
//         email: 'sarah.johnson@hospital.com',
//         about: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She specializes in preventive cardiology and cardiac rehabilitation.',
//         availableTimes: [
//             '2024-12-05 09:00',
//             '2024-12-05 10:00',
//             '2024-12-05 14:00',
//             '2024-12-06 09:00',
//             '2024-12-06 11:00',
//             '2024-12-06 15:00',
//             '2024-12-07 10:00',
//             '2024-12-07 13:00'
//         ]
//     },
//     {
//         id: '2',
//         name: 'Dr. Michael Chen',
//         specialty: 'Pediatrics',
//         experience: 12,
//         photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
//         rating: 4.8,
//         reviews: 203,
//         phone: '+1 (555) 234-5678',
//         email: 'michael.chen@hospital.com',
//         about: 'Dr. Michael Chen is dedicated to providing comprehensive care for children from infancy through adolescence. He has a special interest in childhood development and preventive care.',
//         availableTimes: [
//             '2024-12-05 08:00',
//             '2024-12-05 09:30',
//             '2024-12-05 11:00',
//             '2024-12-06 08:30',
//             '2024-12-06 10:00',
//             '2024-12-07 09:00',
//             '2024-12-07 11:30',
//             '2024-12-07 14:00'
//         ]
//     },
//     {
//         id: '3',
//         name: 'Dr. Emily Rodriguez',
//         specialty: 'Dermatology',
//         experience: 10,
//         photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
//         rating: 4.9,
//         reviews: 178,
//         phone: '+1 (555) 345-6789',
//         email: 'emily.rodriguez@hospital.com',
//         about: 'Dr. Emily Rodriguez is a skilled dermatologist specializing in both medical and cosmetic dermatology. She treats a wide range of skin conditions and offers advanced aesthetic procedures.',
//         availableTimes: [
//             '2024-12-05 10:00',
//             '2024-12-05 13:00',
//             '2024-12-05 15:00',
//             '2024-12-06 09:30',
//             '2024-12-06 12:00',
//             '2024-12-06 14:30',
//             '2024-12-07 10:30',
//             '2024-12-07 15:00'
//         ]
//     },
//     {
//         id: '4',
//         name: 'Dr. David Thompson',
//         specialty: 'Orthopedics',
//         experience: 18,
//         photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
//         rating: 4.7,
//         reviews: 142,
//         phone: '+1 (555) 456-7890',
//         email: 'david.thompson@hospital.com',
//         about: 'Dr. David Thompson is an experienced orthopedic surgeon with expertise in sports medicine and joint replacement. He has helped thousands of patients recover from injuries and chronic conditions.',
//         availableTimes: [
//             '2024-12-05 11:00',
//             '2024-12-05 14:00',
//             '2024-12-06 10:00',
//             '2024-12-06 13:00',
//             '2024-12-06 16:00',
//             '2024-12-07 09:30',
//             '2024-12-07 12:00',
//             '2024-12-07 14:30'
//         ]
//     },
//     {
//         id: '5',
//         name: 'Dr. Lisa Anderson',
//         specialty: 'Dentistry',
//         experience: 8,
//         photo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=400&fit=crop',
//         rating: 4.8,
//         reviews: 167,
//         phone: '+1 (555) 567-8901',
//         email: 'lisa.anderson@hospital.com',
//         about: 'Dr. Lisa Anderson provides comprehensive dental care with a focus on patient comfort and modern techniques. She specializes in cosmetic dentistry and preventive care.',
//         availableTimes: [
//             '2024-12-05 09:00',
//             '2024-12-05 11:30',
//             '2024-12-05 14:30',
//             '2024-12-06 08:00',
//             '2024-12-06 10:30',
//             '2024-12-06 13:30',
//             '2024-12-07 09:00',
//             '2024-12-07 13:00'
//         ]
//     },
//     {
//         id: '6',
//         name: 'Dr. James Wilson',
//         specialty: 'Neurology',
//         experience: 20,
//         photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
//         rating: 4.9,
//         reviews: 189,
//         phone: '+1 (555) 678-9012',
//         email: 'james.wilson@hospital.com',
//         about: 'Dr. James Wilson is a renowned neurologist specializing in the treatment of neurological disorders including epilepsy, stroke, and neurodegenerative diseases.',
//         availableTimes: [
//             '2024-12-05 10:00',
//             '2024-12-05 13:00',
//             '2024-12-06 09:00',
//             '2024-12-06 11:30',
//             '2024-12-06 14:00',
//             '2024-12-07 10:00',
//             '2024-12-07 12:30',
//             '2024-12-07 15:30'
//         ]
//     },
//     {
//         id: '7',
//         name: 'Dr. Maria Garcia',
//         specialty: 'Gynecology',
//         experience: 14,
//         photo: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop',
//         rating: 4.8,
//         reviews: 195,
//         phone: '+1 (555) 789-0123',
//         email: 'maria.garcia@hospital.com',
//         about: 'Dr. Maria Garcia provides compassionate care for women of all ages. She specializes in obstetrics, gynecology, and reproductive health.',
//         availableTimes: [
//             '2024-12-05 08:30',
//             '2024-12-05 10:30',
//             '2024-12-05 13:30',
//             '2024-12-06 09:00',
//             '2024-12-06 11:00',
//             '2024-12-06 14:00',
//             '2024-12-07 08:30',
//             '2024-12-07 11:00'
//         ]
//     },
//     {
//         id: '8',
//         name: 'Dr. Robert Lee',
//         specialty: 'Ophthalmology',
//         experience: 16,
//         photo: 'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400&h=400&fit=crop',
//         rating: 4.7,
//         reviews: 134,
//         phone: '+1 (555) 890-1234',
//         email: 'robert.lee@hospital.com',
//         about: 'Dr. Robert Lee is an expert ophthalmologist offering comprehensive eye care including cataract surgery, LASIK, and treatment of eye diseases.',
//         availableTimes: [
//             '2024-12-05 09:30',
//             '2024-12-05 12:00',
//             '2024-12-05 15:00',
//             '2024-12-06 08:30',
//             '2024-12-06 11:30',
//             '2024-12-06 15:00',
//             '2024-12-07 09:00',
//             '2024-12-07 13:30'
//         ]
//     }
// ];
