const clientId = '294b1296575c4c8ca926ff3c3ec9d7c6';
const redirectUri = 'http://localhost:3000/';


let accessToken = '';

const Spotify = {

    getAccessToken() {
        const url = window.location.href;
        const regexp1 = /access_token=([^&]*)/;
        const regexp2 = /expires_in=([^&]*)/;
        if (accessToken) {
            return accessToken;
        } else if (url.match(regexp1) && url.match(regexp2)) {
            accessToken = url.match(regexp1)[0];
            const expiresIn = url.match(regexp2)[0];
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        } else {
            const endpoint = `https://accounts.spotify.com/authorize?client_id=${clientId}}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location.assign(endpoint);
        }
    },

    search(term) {
        fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                let tracks = [];
                if (jsonResponse.tracks) {
                    tracks = jsonResponse.tracks.map(track => {
                        return track;
                    });
                    return tracks;
                };
                return tracks;
            })
    },

    savePlaylist(name, trackURIs) {
        if (!name && !trackURIs) {
            return;
        };
        const token = accessToken;
        const headers = {Authorization: `Bearer ${token}`};
        fetch('https://api.spotify.com/v1/me', {
            headers: headers
        })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                const userID = jsonResponse.id;
                const data = { name: name };
                fetch(`https://api.spotify.com//v1/users/${userID}/playlists`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
                })
                    .then(response => {
                        return response.json();
                    })
                    .then(jsonResponse => {
                        const playlistID = jsonResponse.id;
                        const data = { uris: trackURIs};
                        fetch(`/v1/playlists/${playlistID}/tracks`,{
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: {
                            'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
                        })
                            .then(response => {
                                return response.json();
                            })
                            .then(jsonResponse => {
                                return jsonResponse.snapshot_id;
                            })
                    })
            })
    }

}

export default Spotify;