const path = require("path");

const ludoController = require('../../controllers/ludoController.js');







const router = express.Router();





// Example route
router.get("/", ludoController.test);

module.exports = router;

router
    .route('/')
    .get(ludoController.root);

router
    .route('/:ROOMCODE')
    .get(ludoController.room);

module.exports = router;
