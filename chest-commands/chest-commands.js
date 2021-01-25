load(chorus_js_api);

credits = 'Chorus';
version = '1.0.2';
description = 'This add-on brings ChestCommand support to Chorus by loading GUIs from selection.'
image = 'https://i.imgur.com/U3wp1qq.png'

function onInit() {
    const format = new GUIFormat(
        function getName(map) {
            const settings = map.get('menu-settings');
            return settings ? settings.get('name') : 'No title';
        },
        function getRows(map) {
            const settings = map.get('menu-settings');
            return settings ? settings.get('rows') : 1;
        },
        function getItems(map) {
            const items = [];
            map.keySet().forEach(key => {
                if (key != 'menu-settings') {
                    const itemSection = map.get(key);
                    let item = itemSection.get('ID');
                    if(!item) item = itemSection.get('MATERIAL');
                    item = item ? item.toString().split(",")[0] : item.toString(); // Remove amounts (wool:3, 10 -> wool:3)
                    const itemName = item ? item.contains(':') ? item.split(':')[0] : item : 'BEDROCK'; // If item is null, use Bedrock. Otherwise, remove meta
                    const meta = item ? item.contains(':') ? item.split(':')[1] : 0 : 0; // Extract meta if exists, otherwhise 0
                    const x = itemSection.get('POSITION-X');
                    const y = itemSection.get('POSITION-Y');

                    items.push(new GUIFormatItem(new GUIFormatPosition(x ? x - 1 : 0, y ? y - 1 : 0), itemName, meta));
                }
            });
            return items;
        });
    format.setActive('ChestCommands');
}