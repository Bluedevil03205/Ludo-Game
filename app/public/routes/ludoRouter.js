const path = require("path");
const ludoController = require(path.join(__dirname, "..", "..", "controllers", "ludoController"));


router
    .route('/')
    .get(ludoController.root);

router
    .route('/:ROOMCODE')
    .get(ludoController.room);

module.exports = router;
