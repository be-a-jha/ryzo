import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Rider from '../models/Rider';
import Order from '../models/Order';
import User from '../models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Rider.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create demo rider
    const rider = await Rider.create({
      _id: new mongoose.Types.ObjectId('679f1234567890abcdef1234'), // Fixed ID for demo
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      integratedPlatforms: [
        { platformId: 'swiggy', platformName: 'Swiggy', linkedAt: new Date() },
        { platformId: 'rapido', platformName: 'Rapido', linkedAt: new Date() },
        { platformId: 'zomato', platformName: 'Zomato', linkedAt: new Date() },
      ],
      currentLocation: {
        lat: 23.2215,
        lng: 77.4014,
      },
      status: 'online',
      currentTasks: [],
      todayEarnings: 847,
      todayOrders: 6,
      dailyGoal: 1247,
    });
    console.log('✅ Created demo rider:', rider.name);

    // Create demo user
    const user = await User.create({
      googleId: 'demo-google-id-123',
      email: 'user@example.com',
      name: 'Demo User',
      integratedPlatforms: [
        { platformId: 'swiggy', platformName: 'Swiggy', linkedAt: new Date() },
        { platformId: 'zomato', platformName: 'Zomato', linkedAt: new Date() },
      ],
      role: 'user',
    });
    console.log('✅ Created demo user:', user.name);

    // Create demo orders (pending, waiting for match)
    const order1 = await Order.create({
      userId: user._id,
      platform: 'swiggy',
      type: 'food',
      deliveryType: 'flexible',
      status: 'pending',
      pickup: {
        location: {
          type: 'Point',
          coordinates: [77.4126, 23.2599], // [lng, lat] for GeoJSON
        },
        address: "McDonald's, Arera Colony, Bhopal",
      },
      drop: {
        location: {
          type: 'Point',
          coordinates: [77.4395, 23.2156],
        },
        address: 'BHEL Sector, Bhopal',
      },
      originalFare: 78,
      discountedFare: 36,
      matchWindowExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    const order2 = await Order.create({
      userId: user._id,
      platform: 'rapido',
      type: 'ride',
      deliveryType: 'flexible',
      status: 'pending',
      pickup: {
        location: {
          type: 'Point',
          coordinates: [77.4500, 23.2400],
        },
        address: 'MP Nagar, Bhopal',
      },
      drop: {
        location: {
          type: 'Point',
          coordinates: [77.4200, 23.2100],
        },
        address: 'Sarvadharm, Bhopal',
      },
      originalFare: 92,
      discountedFare: 64,
      matchWindowExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    console.log('✅ Created demo orders:', order1._id, order2._id);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\nDemo Data:');
    console.log('- Rider ID:', rider._id);
    console.log('- User ID:', user._id);
    console.log('- Order 1 ID:', order1._id);
    console.log('- Order 2 ID:', order2._id);
    console.log('\nYou can now use these IDs in your API calls.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
