credits = 'Chorus';
version = '1.0.1';
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
        menu.setLayoutX(300);
        menu.setLayoutY(300);
        menu.filters = [];

        const slider = new fxcontrols.Slider(.05, 1, 1);
        menu.opacityProperty().bind(slider.valueProperty());
        menu.getChildren().add(slider);

        const root = chorus.root

        root.setEffect(new fx.effect.ColorAdjust());

        listen(menu.layoutXProperty(), () => {
            root.getEffect().setHue(menu.getLayoutX() / root.getWidth());
        })

        listen(menu.layoutYProperty(), () => {
            root.getEffect().setSaturation(menu.getLayoutY() / root.getHeight() - .5);
        })

        menu.setOnClose(() => {
            root.setEffect(null);
        });

        menu.show();
    })
}