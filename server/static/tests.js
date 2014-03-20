var ListsResponse = {
    'success': true,
    'msg': '',
    'note_titles': ['my_note', 'your_note']
};

var ViewResponse = {
    'success': true,
    'msg': '',
    'note': '{"content":"<p>test content</p>", "title":"test_note"}'
};

//Mocks
var httpBackend;

//Injector
var injector;

//Controller
var ctrl;

//Scope
var ctrlScope;

//Data
var jsonResponse;

module("mainController", {
    setup: function () {
        
        var appMocks = angular.module("appMocks", ["ngMock"]);

        appMocks.config(function ($provide) {
            $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
        });

        injector = angular.injector(['ng', 'mainApp', 'appMocks']);
        
        jsonResponse = angular.toJson(ListsResponse);

        httpBackend = injector.get('$httpBackend');
        httpBackend.expectGET('/lists').respond(jsonResponse);

        //Creating a new scope
        ctrlScope = injector.get('$rootScope').$new();

        //Creating controller with assigning mocks instead of actual services
        ctrl = injector.get('$controller')('MainCtrl', { $scope: ctrlScope });
    },
    teardown: function () {

    }
});

test("Initially, there are 2 notes in the list", function () {
    httpBackend.flush();
    equal(ctrlScope.resultsCount['Main'], 2, 'There are 2 notes.');
});

test( "ajax", function() { //TODO: http://docs.angularjs.org/api/ngMock/service/$httpBackend
    //grabLists
    jsonResponse = angular.toJson(ListsResponse);
    httpBackend.expectGET('/lists').respond(jsonResponse);
    ctrlScope.grabLists();
    httpBackend.flush();
    equal(ctrlScope.resultsCount['Main'], 2, 'There are 2 notes.');

    //grabNote
    jsonResponse = angular.toJson(ViewResponse);
    httpBackend.expectGET('/view_note/test_note').respond(jsonResponse);
    ctrlScope.grabNote('test_note');
    httpBackend.flush();
    ctrlScope.initEditor();
    equal(ctrlScope.note['title'], 'test_note', 'The note title was updated.');
    equal(ctrlScope.note['content'], '<p>test content</p>', 'The note content was updated.');
});

// test( "search", function() {
//     //testing search
//     equal(this.$scope.search('Main'), undefined);
//     //TODO: more tests for search
//     //httpBackend.expectGET('/lists').respond({ note_titles: ['asdf', 'asdf2']});
//     //console.log(this.$http.get('/lists'));
//     //equal(this.$scope.resultsCount['Main'], 2);
// });

// test( "sort", function() {
//     //check that icon changes
//     equal(this.$scope.sort_by('Title', 'Main'), undefined);
//     equal(this.$scope.predicate['Main'], 'Title');
//     equal(this.$scope.setChar, '\u25bc');
//     //TODO: check items are sorted
    
//     //reverse
//     this.$scope.sort_by('Title', 'Main');
//     equal(this.$scope.predicate['Main'], 'Title');
//     equal(this.$scope.setChar, '\u25b2');
//     //TODO: check items sorted in reverse
    
//     //not a column
//     equal(this.$scope.sort_by('notAnActualColumn', 'Main'), undefined);
//     equal(this.$scope.predicate['Main'], 'notAnActualColumn'); //working as intended?
//     //not a table and not a column
//     //this.$scope.sort_by('Title', 'Main');
//     //equal(this.$scope.sort_by('notAnActualColumn', 'notAnActualTable'), undefined); //this breaks it. TODO: fix it
//     //equal(this.$scope.predicate['Main'], 'Title');
// });

// test( "paginate", function() {
//     //groupToPages (test DOM)
//     equal(this.$scope.groupToPages(), undefined);
    
//     //typical nextPage
//     this.$scope.currentPage.value = 0;
//     this.$scope.pagedItems.length = 5;
//     equal(this.$scope.nextPage(), undefined);
//     equal(this.$scope.currentPage.value, 1);
//     //TODO: test something about $scope.newPage
//     //nextPage when last
//     this.$scope.currentPage.value = 4;
//     this.$scope.pagedItems.length = 5;
//     this.$scope.nextPage();
//     equal(this.$scope.currentPage.value, 4);
//     //TODO: test something about $scope.newPage
    
//     //typical prevPage
//     this.$scope.currentPage.value = 4;
//     this.$scope.pagedItems.length = 5;
//     equal(this.$scope.prevPage(), undefined);
//     equal(this.$scope.currentPage.value, 3);
//     //TODO: test something about $scope.newPage
//     //prevPage when first
//     this.$scope.currentPage.value = 0;
//     this.$scope.pagedItems.length = 5;
//     this.$scope.prevPage();
//     equal(this.$scope.currentPage.value, 0);
//     //TODO: test something about $scope.newPage
    
//     //typical goToPage
//     this.$scope.currentPage.value = 0;
//     this.$scope.pagedItems.length = 5;
//     equal(this.$scope.goToPage(3), undefined);
//     equal(this.$scope.currentPage.value, 2);
//     //TODO: test something about $scope.newPage
//     //goToPage when page doesn't exist
//     this.$scope.currentPage.value = 0;
//     this.$scope.pagedItems.length = 5;
//     this.$scope.goToPage(100);
//     //equal(this.$scope.currentPage.value, 0); //TODO: fix this in mainController.js
//     //TODO: test something about $scope.newPage
// });

// test( "display limit and results per page", function() {
//     //increaseDisplayLimit
//     equal(this.$scope.numItemsDisplayed, 100);
//     equal(this.$scope.increaseDisplayLimit(), undefined);
//     equal(this.$scope.numItemsDisplayed, 125);
    
//     //changeResultsPerPage
//     equal(this.$scope.changeResultsPerPage(), undefined);
//     equal(this.$scope.numItemsDisplayed, 100);
    
//     //possible DOM tests?
//     //increaseDisplayLimit + 25
//     //increaseDisplayLimit + something >25
//     //increaseDisplayLimit + something <25
//     //changeResultsPerPage + 25
//     //changeResultsPerPage + something >25
//     //changeResultsPerPage + something <25
// });

// test( "tinymce init", function() {
//     //initEditor (test DOM?)
//     equal(this.$scope.initEditor(), undefined);
// });
// qual(this.$scope.sort_by('Title', 'Main'), undefined);
// test( "validation", function() {
//     //keyPressed valid character
//     this.$scope.title = '%';
//     this.$scope.keyPressed(this.$scope);
//     equal(this.$scope.isValid, false);
    
//     //keyPressed invalid character
//     this.$scope.title = 's';
//     this.$scope.keyPressed(this.$scope);
//     equal(this.$scope.isValid, true);
// });

// test( "save", function() {
//     //ajaxSave no title (test DOM?)
//     equal(this.$scope.ajaxSave(), false);
//     equal(document.getElementById("msg").innerHTML, "You're missing the title.");
//     equal(this.$scope.showMsg.value, true);
    
//     //ajaxSave invalid character (test DOM?)
//     document.getElementById("title").value = 'this is not a valid title!';
//     equal(this.$scope.ajaxSave(), false);
//     equal(document.getElementById("msg").innerHTML, "Allowed characters: A-Z, a-z, 0-9, -, _");
//     equal(this.$scope.showMsg.value, true);
    
//     //ajaxSave valid title (test DOM?)
//     document.getElementById("title").value = 'this is a valid title';
//     equal(this.$scope.ajaxSave(), true);
//     console.log(httpBackend.expectGET('/save'));
// });

// test( "switchView", function() {
//     //switchView
//     equal(this.$scope.viewingList.value, true);
//     equal(this.$scope.switchView(), undefined);
//     equal(this.$scope.viewingList.value, false);
//     equal(this.$scope.showMsg.value, false);
    
//     //DOM tests to come
// });qual(this.$scope.sort_by('Title', 'Main'), undefined);}
