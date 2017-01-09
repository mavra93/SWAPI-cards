"use strict";

angular.module("Cards-app", ["templates"]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CardsService = function () {
    function CardsService($http) {
        _classCallCheck(this, CardsService);

        this.http = $http;
        this.api = "http://swapi.co/api/";
    }

    _createClass(CardsService, [{
        key: "getCards",
        value: function getCards(type) {
            return this.http.get(this.api + type).then(function (data) {
                if (data.status !== 200) {
                    // something goes wrong
                    throw new Error("Server responded with HTTP STATUS: " + data.status);
                }
                return data.data;
            });
        }
    }]);

    return CardsService;
}();

angular.module("Cards-app").service("CardsService", CardsService);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CardController = function () {
    function CardController($rootScope) {
        _classCallCheck(this, CardController);

        this.rootScope = $rootScope;
    }

    _createClass(CardController, [{
        key: "$onInit",
        value: function $onInit() {
            this.cardInfo = this.getCardDetails(this.info);
        }
    }, {
        key: "getCardDetails",
        value: function getCardDetails(info) {
            var returnValue = [];
            Object.keys(info).forEach(function (key) {
                var replacedString = null;
                if (key.includes("_")) {
                    replacedString = key.replace("_", " ");
                }
                if (!Array.isArray(info[key])) {
                    returnValue.push({ label: replacedString || key, value: info[key] });
                }
            });
            return returnValue;
        }
    }, {
        key: "getRibbonClass",
        value: function getRibbonClass(type) {
            if (this.rootScope.activeClass === "all") {
                return "ribbon-" + type;
            }
        }
    }]);

    return CardController;
}();

var card = {
    bindings: {
        info: "<"
    },
    controller: CardController,
    templateUrl: "components/card/card.template.html"
};
angular.module("Cards-app").component("card", card);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CardsController = function () {
    function CardsController(CardsService, $rootScope) {
        _classCallCheck(this, CardsController);

        this.CardsService = CardsService;
        this.rootScope = $rootScope;
    }

    _createClass(CardsController, [{
        key: "$onInit",
        value: function $onInit() {
            this.activeTab = "all";
            this.cards = this.getCardsByType("all");
            this.rootScope.activeClass = "all";
            this.tabs = ["all", "people", "planets", "starships"];
        }
    }, {
        key: "getCardsByType",
        value: function getCardsByType(type) {
            var _this = this;

            var cards = [];
            var allTypes = type === "all" ? ["people", "starships", "planets"] : [type];
            allTypes.forEach(function (type) {
                _this.CardsService.getCards(type).then(function (data) {
                    data.results.forEach(function (result) {
                        result.type = type;
                        cards.push(result);
                    });
                });
            });
            return cards;
        }
    }, {
        key: "changeTab",
        value: function changeTab(type) {
            this.cards = this.getCardsByType(type);
            this.activeTab = type;
            this.rootScope.activeClass = type;
        }
    }]);

    return CardsController;
}();

var cards = {
    controller: CardsController,
    templateUrl: "components/cards/cards.template.html"
};
angular.module("Cards-app").component("cards", cards);