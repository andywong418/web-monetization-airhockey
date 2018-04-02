const express = require('express');
const router = express.Router();
const WebMonetisation = require('./express-web-monetisation');
const monetization = new WebMonetisation({maxBalance : 1000});
const fs = require('fs');
const path = require('path');
// YOUR API ROUTES HERE

// SAMPLE ROUTE
router.get('/pay/:id', monetization.receiver());

router.get('/content/:id', monetization.paid({ price: 100 }), (req, res) => {
  res.json({
    paid: true
  });
})

router.use('/users', (req, res) => {
    res.json({ success: true });
});

module.exports = router;
