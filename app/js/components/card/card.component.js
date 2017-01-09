class CardController {
    constructor($rootScope) {
        this.rootScope = $rootScope;
    }

    $onInit() {
        this.cardInfo = this.getCardDetails(this.info);
    }

    getCardDetails(info) {
        let returnValue = [];
        Object.keys(info).forEach(function(key) {
            let replacedString = null;
            if(key.includes("_")) {
                replacedString = key.replace("_", " ");
            }
            if(!Array.isArray(info[key])) {
                returnValue.push({label: replacedString || key, value:info[key]});
            }
        });
        return returnValue;
    }

    getRibbonClass(type) {
        if(this.rootScope.activeClass === "all") {
            return "ribbon-" + type;
        }
    }
}

const card = {
    bindings: {
        info: "<"
    },
    controller: CardController,
    templateUrl: "components/card/card.template.html"
};
angular.module("Cards-app").component("card", card);