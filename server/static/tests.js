var ListsResponse = {
    'success': true,
    'msg': '',
    'note_titles': ['my_note', 'your_note']
};

var emptyListsResponse = {
    'success': true,
    'msg': '',
    'note_titles': []
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

test( "ajax", function() {
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

test( "empty list response", function() {
    httpBackend.expectGET('/lists').respond(angular.toJson(emptyListsResponse));
    ctrlScope.grabLists();
    httpBackend.flush();
    equal(ctrlScope.resultsCount['Main'], 0);
});

test( "search", function() {
    //testing search
    
    //empty query
    httpBackend.flush();
    equal(ctrlScope.search('Main'), undefined);
    equal(ctrlScope.resultsCount['Main'], 2);
    
//    //query that returns all notes
//    ctrlScope.query = {
//        "Main": { 0: "_note" }
//    };
//    ctrlScope.search('Main');
//    equal(ctrlScope.resultsCount['Main'], 2);
    
//    //query that returns one note
//    ctrlScope.query = {
//        "Main": { 0: "my" }
//    };
//    ctrlScope.search('Main');
//    equal(ctrlScope.resultsCount['Main'], 1);
//    
//    //query that returns one note
//    ctrlScope.query = {
//        "Main": { 0: "their_note" }
//    };
//    ctrlScope.search('Main');
//    equal(ctrlScope.resultsCount['Main'], 0);
});

test( "sort", function() {
//    httpBackend.flush();
//    equal(ctrlScope.displayedData[0], 'my_note');
//    equal(ctrlScope.displayedData[1], 'your_note');
    
    //check that icon changes
    equal(ctrlScope.sort_by('Title', 'Main'), undefined);
    equal(ctrlScope.predicate['Main'], 'Title');
    equal(ctrlScope.setChar, '\u25bc');
    //TODO: check items are sorted
//    equal(ctrlScope.displayedData[0], 'my_note');
//    equal(ctrlScope.displayedData[1], 'your_note');

    //reverse
    ctrlScope.sort_by('Title', 'Main');
    equal(ctrlScope.predicate['Main'], 'Title');
    equal(ctrlScope.setChar, '\u25b2');
    //TODO: check items sorted in reverse
//    equal(ctrlScope.displayedData[1], 'my_note');
//    equal(ctrlScope.displayedData[0], 'your_note');

    //not a column
    equal(ctrlScope.sort_by('notAnActualColumn', 'Main'), undefined);
    equal(ctrlScope.predicate['Main'], 'notAnActualColumn'); //working as intended?
    //not a table and not a column
    //ctrlScope.sort_by('Title', 'Main');
    //equal(ctrlScope.sort_by('notAnActualColumn', 'notAnActualTable'), undefined); //this breaks it. TODO: fix it
    //equal(ctrlScope.predicate['Main'], 'Title');
});

test( "paginate", function() {
    //groupToPages (test DOM)
    equal(ctrlScope.groupToPages(), undefined);
 
    //typical nextPage
    ctrlScope.currentPage.value = 0;
    ctrlScope.pagedItems.length = 5;
    equal(ctrlScope.nextPage(), undefined);
    equal(ctrlScope.currentPage.value, 1);
    //TODO: test something about $scope.newPage
    //nextPage when last
    ctrlScope.currentPage.value = 4;
    ctrlScope.pagedItems.length = 5;
    ctrlScope.nextPage();
    equal(ctrlScope.currentPage.value, 4);
    //TODO: test something about $scope.newPage
 
    //typical prevPage
    ctrlScope.currentPage.value = 4;
    ctrlScope.pagedItems.length = 5;
    equal(ctrlScope.prevPage(), undefined);
    equal(ctrlScope.currentPage.value, 3);
    //TODO: test something about $scope.newPage
    //prevPage when first
    ctrlScope.currentPage.value = 0;
    ctrlScope.pagedItems.length = 5;
    ctrlScope.prevPage();
    equal(ctrlScope.currentPage.value, 0);
    //TODO: test something about $scope.newPage
 
    //typical goToPage
    ctrlScope.currentPage.value = 0;
    ctrlScope.pagedItems.length = 5;
    equal(ctrlScope.goToPage(3), undefined);
    equal(ctrlScope.currentPage.value, 2);
    //TODO: test something about $scope.newPage
    //goToPage when page doesn't exist
    ctrlScope.currentPage.value = 0;
    ctrlScope.pagedItems.length = 5;
    ctrlScope.goToPage(100);
    equal(ctrlScope.currentPage.value, 0);
    //TODO: test something about $scope.newPage
});

test( "display limit and results per page", function() {
    //increaseDisplayLimit
    equal(ctrlScope.numItemsDisplayed, 100);
    equal(ctrlScope.increaseDisplayLimit(), undefined);
    equal(ctrlScope.numItemsDisplayed, 125);
 
    //changeResultsPerPage
    equal(ctrlScope.changeResultsPerPage(), undefined);
    equal(ctrlScope.numItemsDisplayed, 100);
 
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
    equal(ctrlScope.initEditor(), undefined);
});

test( "validation", function() {
    //keyPressed valid character
    ctrlScope.title = '%';
    ctrlScope.keyPressed(ctrlScope);
    equal(ctrlScope.isValid, false);
 
    //keyPressed invalid character
    ctrlScope.title = 's';
    ctrlScope.keyPressed(ctrlScope);
    equal(ctrlScope.isValid, true);
});

test( "save", function() {
    //ajaxSave no title
    equal(ctrlScope.ajaxSave(), undefined);
    equal(document.getElementById("msg").innerHTML, "You're missing the title.");
    equal(ctrlScope.showMsg.value, true);
    
    //ajaxSave invalid character
    document.getElementById("title").value = 'this is not a valid title!';
    ctrlScope.ajaxSave();
    equal(document.getElementById("msg").innerHTML, "Allowed characters: A-Z, a-z, 0-9, -, _");
    equal(ctrlScope.showMsg.value, true);
    
    //ajaxSave valid title
    ctrlScope.initEditor();
    var note = angular.toJson({"content":"","title":"this is a valid title"});
    var postRequest = angular.toJson({"overwrite":false,"note":note});
    document.getElementById("title").value = 'this is a valid title';
    httpBackend.expectPOST('/save').respond(angular.toJson({'success': true, 'msg': 'Your note was saved successfully.'}));
    httpBackend.expectGET('/lists').respond(jsonResponse);
    ctrlScope.ajaxSave();
    httpBackend.flush();
    equal(document.getElementById("msg").innerHTML, "Your note was saved successfully.");
});

test( "switchView", function() {
    //switchView
    equal(ctrlScope.viewingList.value, true);
    equal(ctrlScope.switchView(), undefined);
    equal(ctrlScope.viewingList.value, false);
    equal(ctrlScope.showMsg.value, false);
 
    //DOM tests to come
});
