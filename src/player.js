import Vue from "./vue";
import NodeYoutube from "youtube-node";
import youtubePlayer from "youtube-player";

const yt = new NodeYoutube();
yt.setKey('AIzaSyBj5xgFWvh0Y8jfxMePjW4nNbb9BNyLt50');

const player = youtubePlayer('player');
let currentId = '';

function playVideo(id) {
    currentId = id;
    player.loadVideoById(id);
    player.playVideo();
}


player.on('stateChange', (event) => {
    if (event.data === 0) {
        yt.related(currentId, 1, (error, result) => {
            playVideo(result.items[0].id.videoId);
        });
    }
});

function searchVideo(query) {
    yt.search(query, 10, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            app.results = result.items;
        }
    });
}

let app = new Vue({
    el: "#searcher",
    data: {
        query: "",
        results: [],
        related: []
    },
    methods: {
        search: () => {
            searchVideo(app.query);
        },
        relate: (id) => {
            yt.related(id, 10, (error, result) => {
                app.related = [];
                result.items.map(item => {
                    yt.getById(item.id.videoId, (error, result) => {
                        if (error) {
                            console.log(error);
                        } else {
                            result.items.forEach(item => app.related.push(item));
                        }
                    });
                });
            })
        },
        play: playVideo
    }
});

let controls = new Vue({
    el: '#controls',
    data: {
        progress: "0.5%"
    }
});
module.exports.controls = controls;
module.exports.app = app;
module.exports.player = player;