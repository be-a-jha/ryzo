import { Request, Response } from 'express';
import Match from '../models/Match';
import Order from '../models/Order';
import { calculateRouteOverlap, generateMatchExplanation } from '../services/geminiService';
import { evaluateMatch } from '../agents/armoriqAgent';
import { pushMatchToSpacetime } from '../services/spacetimeService';

export const triggerMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { riderId, orderIds, platforms } = req.body;

    if (!riderId || !orderIds?.length || !platforms?.length) {
      res.status(400).json({ error: 'riderId, orderIds, and platforms are required' });
      return;
    }

    // Fetch orders to get route coordinates
    const orders = await Order.find({ _id: { $in: orderIds } });

    // Extract routes for Gemini analysis
    const routeA = orders[0]
      ? [
          { lat: orders[0].pickup.location.coordinates[1], lng: orders[0].pickup.location.coordinates[0] },
          { lat: orders[0].drop.location.coordinates[1], lng: orders[0].drop.location.coordinates[0] },
        ]
      : [{ lat: 23.2332, lng: 77.4342 }, { lat: 23.2122, lng: 77.4012 }];

    const routeB = orders[1]
      ? [
          { lat: orders[1].pickup.location.coordinates[1], lng: orders[1].pickup.location.coordinates[0] },
          { lat: orders[1].drop.location.coordinates[1], lng: orders[1].drop.location.coordinates[0] },
        ]
      : [{ lat: 23.2280, lng: 77.4350 }, { lat: 23.1950, lng: 77.4180 }];

    // Gemini AI: calculate route overlap
    const overlapResult = await calculateRouteOverlap(routeA, routeB);

    const individualEarnings = platforms.map((p: string) => ({
      platform: p,
      amount: p === 'swiggy' ? 78 : 64,
    }));
    const combinedEarnings = 142;
    const timeSaved = '~12 min';

    // Gemini AI: generate natural language explanation
    const explanation = await generateMatchExplanation({
      platforms,
      combinedEarnings,
      individualEarnings,
      distanceSaved: overlapResult.distanceSaved,
      timeSaved,
      overlapScore: overlapResult.overlapScore,
    });

    // ArmorIQ Agent: evaluate match against rules
    const agentResult = await evaluateMatch({
      overlapScore: overlapResult.overlapScore,
      detourPercent: 12,
      riderCurrentTasks: 0, // Will come from rider document in production
      timeConstraintMet: true,
    });

    if (agentResult.decision === 'BLOCKED') {
      res.status(200).json({
        matched: false,
        reason: agentResult.reason,
        agentLog: agentResult.logEntry,
      });
      return;
    }

    const match = await Match.create({
      riderId,
      orderIds,
      platforms,
      overlapScore: overlapResult.overlapScore,
      detourPercentage: 12,
      combinedEarnings,
      individualEarnings,
      timeSaved,
      fuelSaved: '~0.3L',
      distanceSaved: overlapResult.distanceSaved,
      explanation,
      optimalSequence: overlapResult.optimalSequence,
      status: 'pending',
      agentDecisionLog: [agentResult.logEntry],
    });

    // Update orders with match reference
    await Order.updateMany(
      { _id: { $in: orderIds } },
      { matchId: match._id, status: 'matched' }
    );

    // Push to SpacetimeDB for real-time sync across all 3 phones
    await pushMatchToSpacetime({
      matchId: String(match._id),
      riderId: String(riderId),
      orderIds: orderIds.map(String),
      platforms,
      overlapScore: overlapResult.overlapScore,
      combinedEarnings,
      status: 'pending',
    });

    res.status(201).json({ match });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to trigger match', details: message });
  }
};

export const getMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('orderIds')
      .populate('riderId');

    if (!match) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }

    res.status(200).json({ match });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch match', details: message });
  }
};

export const acceptMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }

    if (match.status !== 'pending') {
      res.status(400).json({ error: `Cannot accept match with status: ${match.status}` });
      return;
    }

    match.status = 'accepted';
    await match.save();

    // Update all linked orders to active
    await Order.updateMany(
      { _id: { $in: match.orderIds } },
      { status: 'active' }
    );

    res.status(200).json({ match });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to accept match', details: message });
  }
};

export const declineMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }

    if (match.status !== 'pending') {
      res.status(400).json({ error: `Cannot decline match with status: ${match.status}` });
      return;
    }

    match.status = 'declined';
    await match.save();

    // Reset linked orders to pending
    await Order.updateMany(
      { _id: { $in: match.orderIds } },
      { matchId: null, status: 'pending' }
    );

    res.status(200).json({ match });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to decline match', details: message });
  }
};
