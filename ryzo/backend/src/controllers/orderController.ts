import { Request, Response } from 'express';
import Order from '../models/Order';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, platform, type, deliveryType, pickup, drop, originalFare, items, estimatedTime } = req.body;

    if (!userId || !platform || !type || !deliveryType || !pickup || !drop || !originalFare) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const matchWindowExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const order = await Order.create({
      userId,
      platform,
      type,
      deliveryType,
      pickup: {
        location: { type: 'Point', coordinates: [pickup.lng, pickup.lat] },
        address: pickup.address,
      },
      drop: {
        location: { type: 'Point', coordinates: [drop.lng, drop.lat] },
        address: drop.address,
      },
      originalFare,
      discountedFare: deliveryType === 'flexible' ? originalFare * 0.9 : originalFare,
      items: items || [],
      matchWindowExpiry,
      estimatedTime: estimatedTime || '',
    });

    res.status(201).json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to create order', details: message });
  }
};

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.status(200).json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch order', details: message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'matched', 'active', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.status(200).json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to update order status', details: message });
  }
};
