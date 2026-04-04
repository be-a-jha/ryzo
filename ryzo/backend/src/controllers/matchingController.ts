import { Request, Response } from 'express';
import Match from '../models/Match';
import Order from '../models/Order';
import { findMatch, acceptMatch as acceptMatchService, declineMatch as declineMatchService } from '../services/matchingService';
import { logAgentDecision } from '../services/armoriqService';

export const triggerMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { order1Id, order2Id, riderId } = req.body;

    if (!order1Id || !order2Id) {
      res.status(400).json({ error: 'order1Id and order2Id are required' });
      return;
    }

    // Use the new matching service
    const result = await findMatch({ order1Id, order2Id, riderId });

    if (!result.success) {
      res.status(200).json({
        matched: false,
        reason: result.error,
        armoriqDecision: result.armoriqDecision,
      });
      return;
    }

    // Log ArmorIQ decision
    if (result.matchId && result.armoriqDecision) {
      await logAgentDecision(result.matchId, {
        ...result.armoriqDecision,
        confidence: result.armoriqDecision.confidence || 0.95,
        riskScore: result.armoriqDecision.riskScore || 0.05,
      });
    }

    res.status(201).json({
      matched: true,
      matchId: result.matchId,
      match: result.match,
      armoriqDecision: result.armoriqDecision,
    });
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
    const { riderId } = req.body;

    if (!riderId) {
      res.status(400).json({ error: 'riderId is required' });
      return;
    }

    const matchId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const success = await acceptMatchService(matchId, riderId);

    if (!success) {
      res.status(404).json({ error: 'Match not found or cannot be accepted' });
      return;
    }

    const match = await Match.findById(matchId);
    res.status(200).json({ match });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to accept match', details: message });
  }
};

export const declineMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { riderId } = req.body;

    if (!riderId) {
      res.status(400).json({ error: 'riderId is required' });
      return;
    }

    const matchId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const success = await declineMatchService(matchId, riderId);

    if (!success) {
      res.status(404).json({ error: 'Match not found or cannot be declined' });
      return;
    }

    const match = await Match.findById(matchId);
    res.status(200).json({ match });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to decline match', details: message });
  }
};
