credits = 'Chorus';
version = '1.0.0';
description = 'Discord status / rich presence support for Windows and Linux.';
image = 'https://i.imgur.com/t8iPTt0.png'

// https://github.com/MinnDevelopment/java-discord-rpc
const drpcPackage = 'club.minnced.discord.rpc.';

let presence;
let lib;

// Updates the status
function update() {
    if(lib && presence) lib.Discord_UpdatePresence(presence);
}

// Changes presence details depending on 'Show file' setting value and current tab file
function changePresenceDetails(tab) {
    if(!getConfig().getBoolean('show_file')) {
        presence.details = '';
        return;
    }

    if(tab != null && tab.getFile() != null) {
        // If there is a file
        presence.details = translate('editing') + ' ' + tab.getFile().getName();
    } else {
        // If there is not a file (should not happen)
        presence.details = '';
    }
}

// Changes presence start timestamp depending on 'Show elapsed time' setting value
function changePresenceTimestamp() {
    presence.startTimestamp = getConfig().getBoolean('show_elapsed_time') ? java.lang.System.currentTimeMillis() : 0;
}

// Initializes rich presence
function initRPC() {
    // Loading library file
    // Not using loadJar since it causes errors when working with DLL files as the library internally does
    const loader = createClassLoader('java-discord-rpc-2.0.1-all.jar');

    // Getting DiscordRPC instance
    lib = type(drpcPackage + 'DiscordRPC', loader).getField('INSTANCE').get(null);

    // Creating handlers
    const DiscordEventHandlers = type(drpcPackage + 'DiscordEventHandlers', loader);
    const handlers = new DiscordEventHandlers();

    // Initializing the RPC
    lib.Discord_Initialize('808780942126612531', handlers, true, '');

    // Creating the presence
    const DiscordRichPresence = type(drpcPackage + 'DiscordRichPresence', loader);
    presence = new DiscordRichPresence();

    // Setting properties
    presence.details = '';
    presence.largeImageKey = 'logo';
    changePresenceTimestamp();
    update()

    // Callback every 2 seconds
    setInterval(() => lib.Discord_RunCallbacks(), 2000);
}

// Initializes the translation schemes
function initTranslations() {
    translationMap = {
        'editing': {
            en: 'Editing',
        },
        'config.show_file': {
            en: 'Show file',
            it: 'Mostra file',
            de: 'Datei anzeigen',
        },
        'config.show_file.text': {
            en: 'Shows the name of the file you are editing.',
            it: 'Mostra il nome del file che stai modificando.',
            de: 'Zeigt den Namen der Datei an, die Sie bearbeiten.',
        },
        'config.show_elapsed_time': {
            en: 'Show elapsed time',
            it: 'Mostra tempo trascorso',
            de: 'Abgelaufene Zeit anzeigen',
        },
        'config.show_elapsed_time.text': {
            en: 'Shows how much time you have spent on this session.',
            it: 'Mostra quanto tempo hai trascorso su questa sessione.',
            de: 'Zeigt an, wie viel Zeit Sie mit dieser Sitzung verbracht haben.',
        }
    }
}

// Loads config.yml
function initConfig() {
    // Creating the configuration
    createConfig({
        'show_file': true,
        'show_elapsed_time': true,
    });
    allowSettings(true);
    translateConfigSettings(true);

    // Handling changes when the user modifies the 'Show file' setting
    addConfigListener('show_file', () => {
        changePresenceDetails(getActiveTab());
        update();
    });

    // Handling changes when the user modifies the 'Show elapsed time' setting
    addConfigListener('show_elapsed_time', () => {
        changePresenceTimestamp();
        update();
    });
}

function onInit() {
    initTranslations()
    initConfig()
    initRPC();
}

function onTabSwitch(tab) {
    runLater(() => {
        // Updating the details
        if (presence) {
            changePresenceDetails(tab);
            update();
        }
    });
}

function onTabClose(tab) {
    // Emptying the details if there are no active tabs
    if(getTabs().isEmpty()) {
        presence.details = '';
        update();
    }
}