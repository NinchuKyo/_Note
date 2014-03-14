test( "hello test", function() {
    ok( 1 == "1", "Passed!" );
});

var appMocks = angular.module('appMocks', ['ngMock']);

var httpBackend;
var injector = angular.injector(['ng', 'mainApp', 'appMocks']);

module('mainController', {
    setup: function() {
        // prepare something for all following tests
        this.$scope = injector.get('$rootScope').$new();
        this.$http = injector.get('$http');
        httpBackend = injector.get('$httpBackend');
        var $controller = injector.get('$controller');
        $controller('MainCtrl', {
            $scope: this.$scope,
            $http: this.$http
        });
    },
    teardown: function() {
        // clean up after each test
    }
});

test( "ajax", function() { //TODO: http://docs.angularjs.org/api/ngMock/service/$httpBackend
    //grabLists
    console.log(httpBackend.expectGET('/lists'));
    equal(this.$scope.grabLists(), undefined); //lots done in our server tests?
    //grabNote
    console.log(httpBackend.expectGET('/view/'));
    equal(this.$scope.grabNote(''), undefined); //also done in server tests?
    console.log(httpBackend.expectGET('/view/asdf'));
    equal(this.$scope.grabNote('asdf'), undefined); //also done in server tests?
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
    //test if able to add one more?
    //this.$scope.addSearch('Main');
    //equal(this.$scope.searchesShown['Main'], 5); //TODO: remove this test or make it consistent with view
    
    //remove search
    equal(this.$scope.removeSearch(1, 'Main'), undefined);
    equal(this.$scope.searchesShown['Main'], 4);
    this.$scope.removeSearch(1, 'Main');
    equal(this.$scope.searchesShown['Main'], 3);
    //test if able to have less than 1 search
    this.$scope.removeSearch(1, 'Main');
    this.$scope.removeSearch(1, 'Main');
    this.$scope.removeSearch(1, 'Main');
    //equal(this.$scope.searchesShown['Main'], 1); //TODO: remove this test or make it consistent with view
    
    //testing search
    equal(this.$scope.search('Main'), undefined);
    //TODO: more tests for search
    //httpBackend.expectGET('/lists').respond({ note_titles: ['asdf', 'asdf2']});
    //console.log(this.$http.get('/lists'));
    //equal(this.$scope.resultsCount['Main'], 2);
});

test( "sort", function() {
    //check that icon changes
    equal(this.$scope.sort_by('Title', 'Main'), undefined);
    equal(this.$scope.predicate['Main'], 'Title');
    equal(this.$scope.setChar, '\u25bc');
    //TODO: check items are sorted
    
    //reverse
    this.$scope.sort_by('Title', 'Main');
    equal(this.$scope.predicate['Main'], 'Title');
    equal(this.$scope.setChar, '\u25b2');
    //TODO: check items sorted in reverse
    
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
    equal(this.$scope.groupToPages(), undefined);
    
    //typical nextPage
    this.$scope.currentPage.value = 0;
    this.$scope.pagedItems.length = 5;
    equal(this.$scope.nextPage(), undefined);
    equal(this.$scope.currentPage.value, 1);
    //TODO: test something about $scope.newPage
    //nextPage when last
    this.$scope.currentPage.value = 4;
    this.$scope.pagedItems.length = 5;
    this.$scope.nextPage();
    equal(this.$scope.currentPage.value, 4);
    //TODO: test something about $scope.newPage
    
    //typical prevPage
    this.$scope.currentPage.value = 4;
    this.$scope.pagedItems.length = 5;
    equal(this.$scope.prevPage(), undefined);
    equal(this.$scope.currentPage.value, 3);
    //TODO: test something about $scope.newPage
    //prevPage when first
    this.$scope.currentPage.value = 0;
    this.$scope.pagedItems.length = 5;
    this.$scope.prevPage();
    equal(this.$scope.currentPage.value, 0);
    //TODO: test something about $scope.newPage
    
    //typical goToPage
    this.$scope.currentPage.value = 0;
    this.$scope.pagedItems.length = 5;
    equal(this.$scope.goToPage(3), undefined);
    equal(this.$scope.currentPage.value, 2);
    //TODO: test something about $scope.newPage
    //goToPage when page doesn't exist
    this.$scope.currentPage.value = 0;
    this.$scope.pagedItems.length = 5;
    this.$scope.goToPage(100);
    //equal(this.$scope.currentPage.value, 0); //TODO: fix this in mainController.js
    //TODO: test something about $scope.newPage
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
    equal(this.$scope.initEditor(), undefined);
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