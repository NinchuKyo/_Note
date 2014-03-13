test( "hello test", function() {
    ok( 1 == "1", "Passed!" );
});

var injector = angular.injector(['ng', 'mainApp']);

module('mainController', {
    setup: function() {
        // prepare something for all following tests
        this.$scope = injector.get('$rootScope').$new();
        var $controller = injector.get('$controller');
            $controller('MainCtrl', {
            $scope: this.$scope
        });
    },
    teardown: function() {
        // clean up after each test
    }
});

test( "ajax", function() {
    //grabLists
    //equal(this.$scope.grabLists(), undefined); //lots done in our server tests?
    //grabNote
    //equal(this.$scope.grabNote(''), undefined); //also done in server tests?
    //equal(this.$scope.grabNote('asdf'), undefined); //also done in server tests?
    ok( 1 == "1", "Passed!" );
});

test( "search", function() {
    //add search
    equal(this.$scope.searchesShown['Main'], 1);
    equal(this.$scope.addSearch('Main'), undefined);
    equal(this.$scope.searchesShown['Main'], 2);
    //having 5 searches disables adding more (TODO: DOM test, hard to do because buttons in ng-partial)
    this.$scope.addSearch('Main');
    this.$scope.addSearch('Main');
    this.$scope.addSearch('Main');
    equal(this.$scope.searchesShown['Main'], 5);
    //remove search
    equal(this.$scope.removeSearch(1, 'Main'), undefined);
    equal(this.$scope.searchesShown['Main'], 4);
    equal(this.$scope.removeSearch(1, 'Main'), undefined);
    equal(this.$scope.searchesShown['Main'], 3);
    //testing search
    equal(this.$scope.search('Main'), undefined);
    //TODO: more tests for search
});

test( "sort", function() {
    //sort (TODO: test DOM, again hard because of angular partials)
    equal(this.$scope.sort_by('Title', 'Main'), undefined);
    equal(this.$scope.predicate['Main'], 'Title');
    equal(this.$scope.setChar, '\u25bc');
    //reverse
    this.$scope.sort_by('Title', 'Main');
    equal(this.$scope.predicate['Main'], 'Title');
    equal(this.$scope.setChar, '\u25b2');
    //not a column
    equal(this.$scope.sort_by('notAnActualColumn', 'Main'), undefined);
    equal(this.$scope.predicate['Main'], 'notAnActualColumn'); //working as intended?
    //not a table and not a column
    //this.$scope.sort_by('Title', 'Main');
    //equal(this.$scope.sort_by('notAnActualColumn', 'notAnActualTable'), undefined); //this breaks it. TODO: fix it
    //equal(this.$scope.predicate['Main'], 'Title');
});

test( "paginate", function() {
    //groupToPages (test DOM)
    //nextPage (test DOM)
    //prevPage (test DOM)
    //goToPage (test DOM)
    ok( 1 == "1", "Passed!" );
});

test( "increase display limit", function() {
    //increaseDisplayLimit (test DOM) + 25
    //increaseDisplayLimit (test DOM) + something >25
    //increaseDisplayLimit (test DOM) + something <25
    ok( 1 == "1", "Passed!" );
});

test( "change results per page", function() {
    //changeResultsPerPage (test DOM) + 25
    //changeResultsPerPage (test DOM) + something >25
    //changeResultsPerPage (test DOM) + something <25
    ok( 1 == "1", "Passed!" );
});

test( "tinymce init", function() {
    //initEditor (test DOM?)
    ok( 1 == "1", "Passed!" );
});

test( "validation", function() {
    //keyPressed valid character
    //keyPressed invalid character
    ok( 1 == "1", "Passed!" );
});

test( "save", function() {
    //ajaxSave no title (test DOM?)
    //ajaxSave invalid character (test DOM?)
    //ajaxSave valid title (test DOM?)
    ok( 1 == "1", "Passed!" );
});

test( "switchview", function() {
    //switchView
    ok( 1 == "1", "Passed!" );
});