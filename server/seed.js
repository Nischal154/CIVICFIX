const mongoose = require('mongoose');
const Complaint = require('./models/Complaint');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civicfix', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Complaint.deleteMany({});
        await User.deleteMany({});
        console.log('🗑️ Cleared existing data');

        // Create Mock Users
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash('password123', salt);

        const users = [
            { name: "Rahul Singh", email: "rahul@example.com", password: hashedPwd, role: "citizen" },
            { name: "Priya Sharma", email: "priya@example.com", password: hashedPwd, role: "citizen" },
            { name: "Amit Kumar", email: "amit@example.com", password: hashedPwd, role: "admin" } // Government Official
        ];

        const createdUsers = await User.insertMany(users);
        console.log('✅ Created 3 Mock Users');

        const userIds = createdUsers.map(u => u._id);

        // Complaints with Dhanbad location, images, and UPVOTES
        const complaints = [
            {
                user: userIds[0],
                title: "Deep Pothole at Bank More",
                description: "There is a very deep pothole near the traffic signal at Bank More. It causes heavy traffic jams and is dangerous for bikers.",
                location: "Bank More, Dhanbad, Jharkhand",
                category: "Roads",
                priority: "High",
                status: "Pending",
                department: "Roads Dept",
                isEmergency: false,
                imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600",
                upvotes: [userIds[1], userIds[2]], // 2 Upvotes
                aiAnalysis: {
                    category: "Roads",
                    priority: "High",
                    department: "Roads Dept",
                    summary: "Deep pothole causing traffic risk.",
                    isEmergency: false
                }
            },
            {
                user: userIds[1],
                title: "Streetlight not working in Hirapur",
                description: "The streetlights on the main road of Hirapur have been out for 3 days. It is pitch dark at night.",
                location: "Hirapur, Dhanbad, Jharkhand",
                category: "Electricity",
                priority: "Medium",
                status: "In Progress",
                department: "Electricity Dept",
                isEmergency: false,
                imageUrl: "https://images.unsplash.com/photo-1557682224-cca284379374?auto=format&fit=crop&q=80&w=600",
                upvotes: [userIds[0]], // 1 Upvote
                aiAnalysis: {
                    category: "Electricity",
                    priority: "Medium",
                    department: "Electricity Dept",
                    summary: "Streetlights malfunction.",
                    isEmergency: false
                }
            },
            {
                user: userIds[0],
                title: "Garbage Overflow at City Centre",
                description: "The garbage bin is overflowing and spelling bad smell near the City Centre bus stop. Needs immediate cleaning.",
                location: "City Centre, Dhanbad, Jharkhand",
                category: "Waste",
                priority: "Medium",
                status: "Pending",
                department: "Waste Management",
                isEmergency: false,
                imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600",
                upvotes: [], // 0 Upvotes
                aiAnalysis: {
                    category: "Waste",
                    priority: "Medium",
                    department: "Waste Management",
                    summary: "Garbage overflow issue.",
                    isEmergency: false
                }
            },
            {
                user: userIds[2],
                title: "Water Pipe Leakage in Saraidhela",
                description: "Clean drinking water is being wasted due to a pipe burst near Big Bazaar, Saraidhela.",
                location: "Saraidhela, Dhanbad, Jharkhand",
                category: "Water",
                priority: "High",
                status: "Pending",
                department: "Water Dept",
                isEmergency: false,
                imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=600",
                upvotes: [userIds[0], userIds[1], userIds[2]], // 3 Upvotes
                aiAnalysis: {
                    category: "Water",
                    priority: "High",
                    department: "Water Dept",
                    summary: "Major water pipe leakage.",
                    isEmergency: false
                }
            },
            {
                user: userIds[1],
                title: "Transformer Fire at ISM Gate",
                description: "A transformer has caught fire near the ISM Main Gate! Sparks are flying everywhere.",
                location: "ISM Main Gate, Dhanbad, Jharkhand",
                category: "Emergency Services",
                priority: "Emergency",
                status: "Pending",
                department: "Fire Dept",
                isEmergency: true,
                imageUrl: "https://images.unsplash.com/photo-1527490087278-9c75be0b8052?auto=format&fit=crop&q=80&w=600",
                upvotes: [userIds[0], userIds[1], userIds[2]], // 3 Upvotes (Everyone panic voted!)
                aiAnalysis: {
                    category: "Emergency Services",
                    priority: "Emergency",
                    department: "Fire Dept",
                    summary: "Transformer fire detected.",
                    isEmergency: true
                }
            }
        ];

        await Complaint.insertMany(complaints);
        console.log(`✅ Seeded ${complaints.length} complaints with upvotes successfully`);
        console.log('ℹ️  Test Credentials:');
        console.log('   Citizen: rahul@example.com / password123');
        console.log('   Admin:   amit@example.com / password123');

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
