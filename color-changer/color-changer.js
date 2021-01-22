load(chorus_js_api);

credits = 'Chorus';
version = '1.0.0';
description = 'This add-on allows changing color tone by moving the menu.'
image = 'https://i.imgur.com/soWjcJ8.png'

function onLoad() {
    translationMap = {
        'color_changer': {
            en: 'Color changer',
            it: 'Cambio di colore',
            de: 'Farbwechsler'
        }
    }
}

function onInit() {
    const translation = translate('color_changer');

    const edit = getMenuBarButton('edit');
    edit.addButton(translation, function () {
        const menu = new Menu(translation, true);
        menu.layoutX = 300;
        menu.layoutY = 300;
        menu.filters = [];

        const slider = new fxcontrols.Slider(.05, 1, 1);
        menu.opacityProperty().bind(slider.valueProperty());
        menu.children.add(slider);

        const root = chorus.root

        root.effect = new fx.effect.ColorAdjust();

        listen(menu.layoutXProperty(), () => {
            root.effect.hue = menu.layoutX / root.width;
        })

        listen(menu.layoutYProperty(), () => {
            root.effect.saturation = menu.layoutY / root.height - .5
        })

        menu.onClose = () => {
            root.effect = null;
        }

        menu.show();
    })
}