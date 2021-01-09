load(chorus_js_api);

credits = 'Chorus';
version = '1.0.1';
description = 'This add-on brings ChestCommand support to Chorus by automatically loading GUIs from configuration files.'
image = 'https://i.imgur.com/U3wp1qq.png'

function onInit() {
    var format = new GUIFormat(
        function getName(map) {
            var settings = map.get('menu-settings');
            return settings ? settings.get('name') : 'No title';
        },
        function getRows(map) {
            var settings = map.get('menu-settings');
            return settings ? settings.get('rows') : 1;
        },
        function getItems(map) {
            var items = [];
            map.keySet().forEach(function (key) {
                if(key != 'menu-settings') {
                    var itemSection = map.get(key);
                    var item = itemSection.get('ID');
                    item = item ? item.toString().split(",")[0] : item.toString(); // Remove amounts (wool:3, 10 -> wool:3)
                    var itemName = item ? item.contains(':') ? item.split(':')[0] : item : 'BEDROCK'; // If item is null, use Bedrock. Otherwise, remove meta
                    var meta = item ? item.contains(':') ? item.split(':')[1] : 0 : 0; // Extract meta if exists, otherwhise 0
                    var x = itemSection.get('POSITION-X');
                    var y = itemSection.get('POSITION-Y');
                    items.push(
                        new GUIFormatItem(new GUIFormatPosition(x ? x - 1 : 0, y ? y - 1 : 0), itemName, meta)
                    );
                }
            });
            return items;
        }
    )
    format.setActive();
}