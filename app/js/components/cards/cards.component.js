class CardsController {
    constructor(CardsService, $rootScope) {
        this.CardsService = CardsService;
        this.rootScope = $rootScope;
    }
    $onInit() {
        this.activeTab = "all";
        this.cards = this.getCardsByType("all");
        this.rootScope.activeClass = "all";
        this.tabs = ["all", "people", "planets", "starships"];
    }

    getCardsByType(type)  {
        let cards = [];
        let allTypes = type === "all" ? ["people", "starships", "planets"] : [type];
        allTypes.forEach(type => {
            this.CardsService.getCards(type).then(data =>{
                data.results.forEach(result => {
                    result.type = type;
                    cards.push(result);
                });
            });
        });
        return cards;
    };

    changeTab(type) {
        this.cards = this.getCardsByType(type);
        this.activeTab = type;
        this.rootScope.activeClass = type;
    }
}

const cards = {
    controller: CardsController,
    templateUrl: "components/cards/cards.template.html"
};
angular.module("Cards-app").component("cards", cards);