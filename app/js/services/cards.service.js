class CardsService {
    constructor($http) {
        this.http = $http;
        this.api = "http://swapi.co/api/"
    }

    getCards(type) {
        return this.http.get(this.api + type).then(data => {
            if (data.status !== 200) {
                // something goes wrong
                throw new Error("Server responded with HTTP STATUS: " + data.status);
            }
            return data.data;
        });
    }

}

angular.module("Cards-app").service("CardsService", CardsService);