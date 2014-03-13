test( "hello test", function() {
    ok( 1 == "1", "Passed!" );
});

var injector = angular.injector(['ng', 'mainApp']);

var init = {
    setup: function() {
        this.$scope = injector.get('$rootScope').$new();
    }
};

module('MainCtrl', init);

test( "search", function() {
    var $controller = injector.get('$controller');
    $controller('MainCtrl', {
        $scope: this.$scope
    });
    //grabLists
    //grabNote
    //testing search
    equal(this.$scope.search('Main'), undefined);
    //remove search
    //add search
    //search match all
    //search match one
    //sort (test DOM)
    //groupToPages (test DOM)
    //nextPage (test DOM)
    //prevPage (test DOM)
    //goToPage (test DOM)
    //increaseDisplayLimit (test DOM) + 25
    //increaseDisplayLimit (test DOM) + something >25
    //increaseDisplayLimit (test DOM) + something <25
    //changeResultsPerPage (test DOM) + 25
    //changeResultsPerPage (test DOM) + something >25
    //changeResultsPerPage (test DOM) + something <25
    //keyPressed valid character
    //keyPressed invalid character
    //initEditor (test DOM?)
    //ajaxSave no title (test DOM?)
    //ajaxSave invalid character (test DOM?)
    //ajaxSave valid title (test DOM?)
    //switchView
    //grabList
});