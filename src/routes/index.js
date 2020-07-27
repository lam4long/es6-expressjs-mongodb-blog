import express from 'express';
const router = express.Router();

// Get index
router.get('/', (req, res) => {
	res.send(`Api server in running (${new Date()})`);
});

export default router;
