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
    //TODO: test $scope.showSearch
    
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
    //TODO: test $scope.showSearch
    
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

test( "display limit and results per page", function() {
    //increaseDisplayLimit
    equal(this.$scope.numItemsDisplayed, 100);
    equal(this.$scope.increaseDisplayLimit(), undefined);
    equal(this.$scope.numItemsDisplayed, 125);
    
    //changeResultsPerPage
    equal(this.$scope.changeResultsPerPage(), undefined);
    equal(this.$scope.numItemsDisplayed, 100);
    
    //possible DOM tests?
    //increaseDisplayLimit + 25
    //increaseDisplayLimit + something >25
    //increaseDisplayLimit + something <25
    //changeResultsPerPage + 25
    //changeResultsPerPage + something >25
    //changeResultsPerPage + something <25
});

test( "tinymce init", function() {
    //initEditor (test DOM?)
    equal(this.$scope.initEditor(), undefined);
});

test( "validation", function() {
    //keyPressed valid character
    this.$scope.title = '%';
    this.$scope.keyPressed(this.$scope);
    equal(this.$scope.isValid, false);
    
    //keyPressed invalid character
    this.$scope.title = 's';
    this.$scope.keyPressed(this.$scope);
    equal(this.$scope.isValid, true);
});

test( "save", function() {
    //ajaxSave no title (test DOM?)
    equal(this.$scope.ajaxSave(), undefined);
    equal(document.getElementById("msg").innerHTML, "You're missing the title.");
    equal(this.$scope.showMsg.value, true);
    
    //ajaxSave invalid character (test DOM?)
    document.getElementById("title").value = 'this is not a valid title!';
    this.$scope.ajaxSave();
    equal(document.getElementById("msg").innerHTML, "Allowed characters: A-Z, a-z, 0-9, -, _");
    equal(this.$scope.showMsg.value, true);
    
    //ajaxSave valid title (test DOM?)
    document.getElementById("title").value = 'this is a valid title';
    this.$scope.ajaxSave();
    console.log(httpBackend.expectGET('/save'));
});

test( "switchView", function() {
    //switchView
    equal(this.$scope.viewingList.value, true);
    equal(this.$scope.switchView(), undefined);
    equal(this.$scope.viewingList.value, false);
    equal(this.$scope.showMsg.value, false);
    
    //DOM tests to come
});