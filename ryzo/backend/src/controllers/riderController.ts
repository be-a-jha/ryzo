import { Request, Response } from 'express';
import Rider from '../models/Rider';
import Order from '../models/Order';

export const getRiderProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const rider = await Rider.findById(req.params.id);

    if (!rider) {
      res.status(404).json({ error: 'Rider not found' });
      return;
    }

    res.status(200).json({ rider });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch rider profile', details: message });
  }
};

export const getRiderOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const rider = await Rider.findById(req.params.id);

    if (!rider) {
      res.status(404).json({ error: 'Rider not found' });
      return;
    }

    // Find orders that are matched and assigned to this rider
    const orders = await Order.find({
      status: { $in: ['matched', 'active'] },
      // In a real system, we'd have a riderId field on Order
      // For now, return orders near the rider's location
    }).limit(10);

    res.status(200).json({ orders, count: orders.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch rider orders', details: message });
  }
};

export const getNearbyRiders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng, radiusKm } = req.query;

    if (!lat || !lng) {
      res.status(400).json({ error: 'lat and lng query parameters are required' });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radius = parseFloat((radiusKm as string) || '5');

    // Approximate degree-based radius (1 degree ~ 111km)
    const degreeRadius = radius / 111;

    const riders = await Rider.find({
      status: 'online',
      'currentLocation.lat': { $gte: latitude - degreeRadius, $lte: latitude + degreeRadius },
      'currentLocation.lng': { $gte: longitude - degreeRadius, $lte: longitude + degreeRadius },
    }).limit(20);

    res.status(200).json({ riders, count: riders.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch nearby riders', details: message });
  }
};

export const updateRiderLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng } = req.body;

    if (lat === undefined || lng === undefined) {
      res.status(400).json({ error: 'lat and lng are required' });
      return;
    }

    const rider = await Rider.findByIdAndUpdate(
      req.params.id,
      { currentLocation: { lat, lng } },
      { new: true }
    );

    if (!rider) {
      res.status(404).json({ error: 'Rider not found' });
      return;
    }

    res.status(200).json({ rider });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to update rider location', details: message });
  }
};

export const updateRiderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!status || !['online', 'offline'].includes(status)) {
      res.status(400).json({ error: 'Status must be "online" or "offline"' });
      return;
    }

    const rider = await Rider.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!rider) {
      res.status(404).json({ error: 'Rider not found' });
      return;
    }

    res.status(200).json({ rider });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to update rider status', details: message });
  }
};
