const axios = require('axios');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const getGithubAccessToken = async (code) => {
    const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code,
        },
        {
            headers: {
                Accept: 'application/json',
            },
        }
    );
    return response.data.access_token;
};

const getGithubUser = async (accessToken) => {
    const response = await axios.get('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

module.exports = {
    getGithubAccessToken,
    getGithubUser,
};
