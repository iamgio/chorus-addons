load(chorus_js_api);

credits = 'Chorus';
version = '1.0.0';
description = 'A simple music player!';
image = 'https://i.imgur.com/dzdCNoM.png'

// SVG paths for buttons

const PLAY_SVG = 'M8,5.14V19.14L19,12.14L8,5.14Z';
const PAUSE_SVG = 'M14,19H18V5H14M6,19H10V5H6V19Z';
const NEXT_SVG = 'M16,18H18V6H16M6,18L14.5,12L6,6V18Z';
const PREVIOUS_SVG = 'M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z'

function onLoad() {
    allowSettings(true);
    createConfig({
        'music_folder': ''
    })
}

let menu; // Only one instance allowed

function onInit() {
    loadStylesheet('style.css')

    createMenuBarButton('Music', 'music')
        .addButton('Open player', function () {
            const folder = new File(getConfig().get('music_folder'));
            if(!folder.exists() || !folder.isDirectory() || (folder.isDirectory && folder.listFiles().length < 1)) return;
            if(!menu) {
                menu = new Menu('Music player', true);
                menu.prefWidth = 250;
                menu.filters = []; // Menu can be closed by clicking the X only
                const nameLabel = new Label(); // Label showing track name
                nameLabel.style = '-fx-padding: 10';
                const playPauseButton = new PlayerButton(PAUSE_SVG); // Play/pause button
                const previousButton = new PlayerButton(PREVIOUS_SVG); // Previous track button
                const nextButton = new PlayerButton(NEXT_SVG); // Next track button
                const buttonsHbox = new HBox(8); // Horizontal box with 8px spacing
                buttonsHbox.children.addAll(previousButton, playPauseButton, nextButton);
                buttonsHbox.alignment = Alignment.CENTER;
                buttonsHbox.styleClass.add('buttons-box');
                const player = new Player(folder, menu, nameLabel, playPauseButton, previousButton, nextButton); // Instantiating player
                menu.children.addAll(player, nameLabel, buttonsHbox);
            }
            menu.layoutX = 200.0;
            menu.layoutY = 200.0;
            menu.show();
        });
}

function Player(folder, menu, nameLabel, playPauseButton, previousButton, nextButton) {
    const view = new fx.media.MediaView();
    const files = folder.listFiles();
    let player;

    // Next track index
    function nextIndex(index) {
        return index + 1 == files.length ? 0 : index + 1;
    }

    // Previous track index
    function previousIndex(index) {
        return index - 1 < 0 ? files.length - 1 : index - 1;
    }

    // Updates player for new track
    function updatePlayer(index) {
        if(player) player.stop();
        const file = files[index]

        // Skip if file isn't valid
        try {
            player = new fx.media.MediaPlayer(new fx.media.Media(file.toURI().toString()));
        } catch (err) {
            updatePlayer(nextIndex(index));
            return;
        }

        // Update label with track name
        nameLabel.text = file.name.substr(0, file.name.lastIndexOf("."));

        // New track if the current one ends
        player.setOnEndOfMedia(() => {
            updatePlayer(nextIndex(index));
        })

        // The player stops whenever the menu is closed
        menu.onClose = () => {
            player.stop();
        }

        // Update play/pause button appearance
        player.onPlaying = () => {
            playPauseButton.graphic.style = '-fx-shape: "' + PAUSE_SVG + '"';
        }
        player.onPaused = () => {
            playPauseButton.graphic.style = '-fx-shape: "' + PLAY_SVG + '"';
        }

        // Play or pause
        const Status = fx.media.MediaPlayer.Status;
        playPauseButton.onAction = e => {
            if(player.status == Status.PAUSED
                || player.status == Status.READY
                || player.status == Status.STOPPED) {
                player.play();
            } else {
                player.pause();
            }
        }

        // Go to previous track or restart current track
        previousButton.onAction = e => {
            if(player.currentTime.toSeconds() < 5) {
                updatePlayer(previousIndex(index));
            } else {
                player.seek(player.startTime);
            }
        }

        // Go to next track
        nextButton.onAction = e => {
            updatePlayer(nextIndex(index));
        }

        player.play();
        view.player = player;
    }

    updatePlayer(0);
    return view;
}

function PlayerButton(svg) {
    // Button with SVG graphic
    const icon = new fx.layout.Region();
    icon.styleClass.add('button-icon');
    icon.style = '-fx-shape: "' + svg + '"';
    icon.prefWidth = icon.prefHeight = 20;
    const button = new Button();
    button.graphic = icon;
    return button;
}