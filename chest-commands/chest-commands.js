load(chorus_js_api);

credits = 'Chorus';

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
                    item = item ? item.split(",")[0] : item;
                    var itemName = item ? item.contains(':') ? item.split(':')[0] : item : 'BEDROCK'
                    var meta = item ? item.contains(':') ? item.split(':')[1] : 0 : 0;
                    var x = itemSection.get('POSITION-X');
                    var y = itemSection.get('POSITION-Y');
                    items.push(
                        new GUIFormatItem(new GUIFormatPosition(x ? x : 0, y ? y : 0), itemName, meta)
                    )
                }
            })
            return items;
        }
    )
    format.setActive();
}