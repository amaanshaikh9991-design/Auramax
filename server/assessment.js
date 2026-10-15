
const express = require('express');
const router = express.Router();
const db = require('./db');

// POST /api/assessment — Save assessment results
router.post('/', async (req, res) => {
  try {
    const { student, responses, totalTime } = req.body;

    if (!student || !responses || !Array.isArray(responses)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate summary metrics
    const groups = ['reasoning', 'memory', 'attention', 'inhibition', 'flexibility'];
    const metrics = {};

    groups.forEach((key) => {
      const r = responses.filter((x) => x.module === key);
      metrics[key] = {
        score: r.length
          ? Math.round((r.reduce((a, b) => a + b.correct, 0) / r.length) * 100)
          : 0,
        avgRT: r.length
          ? Math.round(r.reduce((a, b) => a + b.response_time_ms, 0) / r.length)
          : 0,
        total: r.length
      };
    });

    const assessment = {
      student_id: student.id,
      age: student.age,
      grade: student.grade,
      total_time_ms: totalTime,
      metrics,
      responses,
      created_at: new Date().toISOString()
    };

    // Save to database (adjust based on your db.js implementation)
    const result = await db.saveAssessment(assessment);

    res.status(201).json({
      success: true,
      id: result.id,
      metrics
    });
  } catch (err) {
    console.error('Assessment save error:', err);
    res.status(500).json({ error: 'Failed to save assessment' });
  }
});

// GET /api/assessment/:studentId — Get all assessments for a student
router.get('/:studentId', async (req, res) => {
  try {
    const assessments = await db.getAssessmentsByStudent(req.params.studentId);
    res.json(assessments);
  } catch (err) {
    console.error('Assessment fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// GET /api/assessment/:studentId/latest — Get most recent assessment
router.get('/:studentId/latest', async (req, res) => {
  try {
    const assessment = await db.getLatestAssessment(req.params.studentId);
    if (!assessment) {
      return res.status(404).json({ error: 'No assessments found' });
    }
    res.json(assessment);
  } catch (err) {
    console.error('Assessment fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
});

module.exports = router;