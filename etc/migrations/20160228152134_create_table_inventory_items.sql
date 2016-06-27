-- rambler up
CREATE TABLE inventory_items (
    household_id        INTEGER     NOT NULL,
    item_name           TEXT        NOT NULL,
    quantity_type_name  TEXT        NULL,
    quantity            DECIMAL     NULL DEFAULT NULL,
    expiration_date     TIMESTAMP   DEFAULT NULL,

    FOREIGN KEY (household_id) REFERENCES households(household_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY (item_name) REFERENCES items(name)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,
    FOREIGN KEY (quantity_type_name) REFERENCES quantity_types(name)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    ,

    PRIMARY KEY (household_id, item_name, quantity_type_name)
);

-- rambler down
DROP TABLE inventory_items;