// discord.js

const express = require('express');
const axios = require("axios");
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login', (req, res) => {
    const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const REDIRECT_URI = 'http://localhost:3000/discord/auth-callback'
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify+email`);
});

router.get('/auth-callback', async (req, res) => {
    const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
    const REDIRECT_URI = 'http://localhost:3000/discord/auth-callback'

    const code = req.query.code;

    const userId = res.locals.userId;
    
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI
    });

    try {
        const tokenRes = await axios.post('https://discordapp.com/api/oauth2/token', params, {});
        const token = tokenRes.data.access_token;

        const userRes = await axios.get(`https://discord.com/api/v6/users/@me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Call a function to handle the user data
        await handleUserData(req, res, userRes.data, userId);

    } catch (err) {
        console.error('Error in /auth-callback:', err);
        return res.redirect('http://localhost:3000/login')
    }
});

// New endpoint for linking accounts
router.get('/link-account', (req, res) => {
    const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const REDIRECT_URI = 'http://localhost:3000/discord/auth-callback'
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify+email`);
});

// Modify handleUserData function to accept userId as an argument
async function handleUserData(req, res, data, userId) {
    //let userId = req.locals.userId; // Remove this line
    let discordId = data.id;
    let username = data.username;
    let avatar = "https://cdn.discordapp.com/avatars/" + discordId + "/" + data.avatar + ".png";
    let email = data.email;

    let token = await userController.loginDiscordUser(userId, discordId, username, avatar, email);
    if (token.error) {
        return res.status(409).render('500', { errorMessage: token.error });
    } else {
        res.cookie("token", token.token);
        return res.redirect('http://localhost:3000/profile');
    }
}

module.exports = router;