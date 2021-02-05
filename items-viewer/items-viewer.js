credits = 'Chorus';
version = '1.0.1';
description = 'A simple menu that displays all the available items.';
image = 'https://i.imgur.com/raVNG01.png'

function onLoad() {
    translationMap = {
        'items': {
            en: 'Items',
            it: 'Item',
            de: 'Gegenstand',
        }
    }
}

function onDropMenuOpen(type, menu) {
    // Add the button to the 'show' sub-menu
    if (type == 'show') {
        menu.addButton(translate('items'), (area, x, y) => {
            const menu = generateMenu(getItems());
            menu.setLayoutX(x);
            menu.setLayoutY(y);
            menu.show();
        })
    }
}

// These JavaFX properties help us indirectly access text fields and label content

// Search query
const queryTextProperty = new fxproperty.SimpleStringProperty();

// Current item name
const itemTextProperty = new fxproperty.SimpleStringProperty();

function createTextField() {
    const textField = new TextField();
    textField.setPromptText('e.g. Cobblestone');
    textField.setStyle('-fx-padding: 10;');
    queryTextProperty.bind(textField.textProperty());
    return textField;
}

function createItemNameLabel() {
    const label = new Label();
    label.setStyle('-fx-padding: 10; -fx-font-weight: bold;');
    label.textProperty().bind(itemTextProperty);
    return label;
}

function generateMenu(items) {
    const menu = new Menu(translate('items'), true);
    menu.setAlignment(Alignment.CENTER);

    // A FlowPane makes a linear row that wraps to new lines if needed
    const flowPane = new fxlayout.FlowPane();
    flowPane.setStyle('-fx-padding: 5;');

    // Space between rows and columns
    flowPane.setHgap(5);
    flowPane.setVgap(5);

    // Width and height of the flow pane
    flowPane.setPrefWidth(500);
    flowPane.prefHeightProperty().bind(chorus.root.heightProperty().divide(2)); // Half window height

    // Update items on query change
    listen(queryTextProperty, function () {
        const query = queryTextProperty.get();
        const filteredItems = [];
        for (var i = 0; i < items.length; i++) {
            const item = items[i];
            // Apply query
            if (query.length == 0 || item.getName().replace('_', ' ').toLowerCase().indexOf(query.toLowerCase()) != -1) {
                filteredItems.push(item);
            }
        }
        updateContent(flowPane, filteredItems);
    });

    const scrollPane = new fxcontrols.ScrollPane(flowPane); // Wrap the FlowPane in a scroll pane
    scrollPane.setHbarPolicy(fxcontrols.ScrollPane.ScrollBarPolicy.NEVER); // Disable horizontal scroll
    menu.getChildren().addAll(createTextField(), createItemNameLabel(), scrollPane);
    return menu;
}

function updateContent(flowPane, items) {
    flowPane.getChildren().clear();
    items.forEach(
        item => {
            for (i = 0; i < item.getIcons().length; i++) {
                const image = new ImageView(item.getIcons()[i]);
                const pane = new fxlayout.Pane(image);
                pane.setOnMouseEntered(e => {
                    itemTextProperty.set(item.getFormalName()); // Display current item name, capitelized and with spaces
                })
                pane.setOnMouseExited(e => {
                    itemTextProperty.set('');
                })
                flowPane.getChildren().add(pane);
            }
        }
    )
}