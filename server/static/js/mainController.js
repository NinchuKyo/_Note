'use strict';

/* Controllers */

var mainController = angular.module('mainController', []);

// Controller for the app
mainController.controller('MainCtrl', ['$scope', '$http', '$filter',
        function ($scope, $http, $filter) {

            /********** Members and Variables ***************************************/

            // Loading 
            $scope.doneLoading = false;
            var isUpdating = false;

            // Filtering
            var displayedData = [];
            var filteredData = [];

            $scope.searchesShown = {
                "Main": 1
            };
            $scope.showSearch = {
                "Main": { 0: true, 1: false, 2: false, 3: false, 4: false }
            };
            $scope.query = {
                "Main": { 0: "", 1: "", 2: "", 3: "", 4: "" }
            };
            $scope.resultsCount = {
                "Main": 0
            };

            // Mapping column names to item attributes
            var mainAttributesMap = {
                "Title": "Title"
            };

            // Sorting
            $scope.collapseChar = {
                "Main": { "Title": '\u25b2' }
            };
            $scope.predicate = {
                "Main": 'Title'
            };
            $scope.reverse = {
                "Main": false
            };

            // Pagination
            $scope.pagedItems = [];
            $scope.itemsPerPage = { value: 10 };
            $scope.currentPage = { value: 0 };
            $scope.numItemsDisplayed = 100;
            $scope.newPage = {};

            $scope.title = "";
            $scope.overwrite = false;
            $scope.viewingList = { value: true };

            /********** On Startup **************************************************/

            // Get values from config file and load initial list
            //$http.get('config/config.json').success(function (configResult) {
            //    config = configResult;
            //    $scope.grabLists();
            //});

            // Set up timer to update the list every 5 minutes
            setInterval(scheduledUpdate, (1000 * 60 * 5));

            /********** Functions ***************************************************/

            /********** Loading **********************/

            // Every time the timer elapses, updates the data from the BE
            function scheduledUpdate() {
                isUpdating = true;
                $scope.doneLoading = false;
                $scope.grabLists();
            }

           $scope.grabLists = function () {
               $http.get('/lists').success(function (response) {

                   $scope.lists = angular.fromJson(response).note_titles;

                   filteredData = $scope.lists;
                   $scope.search('Main');

                   if (isUpdating) {
                       isUpdating = false;
                   }
                   
                   $scope.doneLoading = true;
               }).error(function (response){

               });
           }

           $scope.grabNote = function (title) {
               $http.get('/view_note/' + title).success(function (response) {
                    var response = angular.fromJson(response);
                    if(response['success']) {
                        $scope.overwrite = true;
                        $scope.viewingList.value = false;
                        $scope.note = angular.fromJson(response.note);
                        document.getElementById("title").value = $scope.note["title"];
                        tinyMCE.activeEditor.setContent($scope.note["content"]);
                        document.getElementById("msg").innerHTML = "";
                    }
                    else {
                        document.getElementById("msg").innerHTML = response["msg"];
                        document.getElementById("msg").className = "alert alert-danger";
                    }
               }).error(function (response){

               });
           }

            /********** Filtering **********************/

            // Hides and disables a search
            $scope.removeSearch = function (index, tableName) {
                $scope.query[tableName][index] = "";
                $scope.showSearch[tableName][index] = false;
                $scope.search(tableName);
                $scope.searchesShown[tableName]--;
            }

            // Adds and enables a search
            $scope.addSearch = function (tableName) {
                for (var visible in $scope.showSearch[tableName]) {
                    if (!$scope.showSearch[tableName][visible]) {
                        $scope.showSearch[tableName][visible] = true;
                        break;
                    }
                }
                $scope.searchesShown[tableName]++;
            }

            // Returns true if any data member in item contains query
            var searchMatchAll = function (item, query) {
                if (!query) {
                    return true;
                }

                var doesContain = false;
                for (var column in item) {
                    if (item[column].toString().toLowerCase().indexOf(query.toString().toLowerCase()) !== -1) {
                        doesContain = true;
                        break;
                    }
                }

                return doesContain;
            };

            // Returns true if a specific data member in item contains query
            var searchMatchOne = function (item, query, attribute, attributeMap, matchWholeWord) {
                var attributeMapping = attributeMap[attribute];

                if (!query) {
                    return true;
                }

                var doesContain = false;

                if (!matchWholeWord) {
                    if (item[attributeMapping].toString().toLowerCase().indexOf(query.toString().toLowerCase().trim()) !== -1) {
                        doesContain = true;
                    }
                }
                else {
                    if (item[attributeMapping].toString().toLowerCase() === query.toString().toLowerCase().trim()) {
                        doesContain = true;
                    }
                }

                return doesContain;
            };

            // Filters the list of data based on all enabled searches
            $scope.search = function (tableName) {
                if (tableName === 'Main') {
                    displayedData = $filter('filter')(filteredData, function (data) {
                        var result = true;
                        for (var word in $scope.query['Main']) {
                            var tokens = $scope.query['Main'][word].split(":");
                            if (tokens.length === 2) {
                                if (!searchMatchOne(data, tokens[1], tokens[0], mainAttributesMap, false)) {
                                    result = false;
                                    break;
                                }
                            }
                            else {
                                if (!searchMatchAll(data, $scope.query['Main'][word])) {
                                    result = false;
                                    break;
                                }
                            }
                        }
                        return result;
                    });

                    // Take care of the sorting order
                    if ($scope.predicate['Main'] !== '') {
                        displayedData = $filter('orderBy')(displayedData, $scope.predicate['Main'], $scope.reverse['Main']);
                    }

                    $scope.resultsCount['Main'] = displayedData.length;

                    if (!isUpdating) {
                        $scope.currentPage.value = 0;
                    }

                    // Now group by pages
                    $scope.groupToPages();
                    $scope.newPage.value = $scope.currentPage.value + 1;
                }
            };

            /********** Sorting ************************/

            // Sorts a list by columnName.  Reverses the list if already being sorted by columnName
            $scope.sort_by = function (columnName, tableName) {
                if ($scope.predicate[tableName] === columnName) {
                    $scope.reverse[tableName] = !$scope.reverse[tableName];
                }

                $scope.predicate[tableName] = columnName;

                if ($scope.reverse[tableName]) {
                    $scope.setChar = '\u25bc';
                }
                else {
                    $scope.setChar = '\u25b2';
                }

                for (var attribute in $scope.collapseChar[tableName]) {
                    $scope.collapseChar[tableName][attribute] = '';
                }

                $scope.collapseChar[tableName][columnName] = $scope.setChar;

                if (tableName === 'Main') {
                    var currPage = $scope.currentPage.value;

                    $scope.search(tableName);
                    $scope.currentPage.value = currPage;
                    $scope.newPage.value = currPage + 1;
                }
            };

            /********** Pagination *********************/

            // Splits the list of data into pages based on $scope.itemsPerPage.value
            $scope.groupToPages = function () {
                $scope.pagedItems = [];

                if ($scope.itemsPerPage.value != 0) {
                    for (var i = 0; i < displayedData.length; i++) {
                        if (i % $scope.itemsPerPage.value == 0) {
                            $scope.pagedItems[Math.floor(i / $scope.itemsPerPage.value)] = [displayedData[i]];
                        }
                        else {
                            $scope.pagedItems[Math.floor(i / $scope.itemsPerPage.value)].push(displayedData[i]);
                        }
                    }
                }
                else {
                    $scope.pagedItems[0] = displayedData;
                }
            };

            // Navigates to the previous page
            $scope.nextPage = function () {
                if ($scope.currentPage.value < $scope.pagedItems.length - 1) {
                    $scope.currentPage.value++;
                }
                $scope.newPage.value = $scope.currentPage.value + 1;
            };

            // Navigates to the previous page
            $scope.prevPage = function () {
                if ($scope.currentPage.value > 0) {
                    $scope.currentPage.value--;
                }
                $scope.newPage.value = $scope.currentPage.value + 1;
            };

            // Navigates to a specific page
            $scope.goToPage = function (number) {
                var page = parseInt(number);
                $scope.currentPage.value = (page - 1);
            }

            // Reveals 25 more items when the 'More' button is pressed
            $scope.increaseDisplayLimit = function () {
                $scope.numItemsDisplayed += 25;
            };

            // Resets the # limit of displayed items to 100
            $scope.changeResultsPerPage = function () {
                $scope.numItemsDisplayed = 100;
                $scope.search('Main');
            };

            /********** _Note **************************/

            $scope.keyPressed = function ($scope) {
                if (/[^\w\s-]/.test($scope.title))
                {
                    //document.getElementById("msg").innerHTML = "The title can only contain alphanumeric characters as well as spaces, hyphens, and underscores.";
                    // document.getElementById("msg").innerHTML = 'The character "' + charTyped + '" is not allowed in the title.';
                    // document.getElementById("msg").className = "alert alert-warning";
                    // document.getElementById("warning").innerHTML = '"' + charTyped + '" is not allowed.';
                    $scope.isValid = false;
                    return;
                }

                //document.getElementById("warning").innerHTML = "";
                $scope.isValid = true;
                return;
            };

            $scope.initEditor = function() {
                tinymce.init({
                    selector: "textarea",
                    plugins: [
                        "advlist autolink lists link charmap print preview",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime table contextmenu paste"
                    ],
                    toolbar: "undo redo | styleselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link"
                });
            };

            $scope.ajaxSave = function() {
                var note = {};
                var data = {};
                note["content"] = tinyMCE.activeEditor.getContent();
                note["title"] = document.getElementById("title").value;
                data["overwrite"] = $scope.overwrite;
                data["note"] = note;

                if(!note["title"]) {
                    document.getElementById("msg").innerHTML = "You're missing the title.";
                    document.getElementById("msg").className = "alert alert-danger";
                }
                else if(/^[\w\s-]+$/.test(note["title"]) === false) {
                    document.getElementById("msg").innerHTML = "Allowed characters: A-Z, a-z, 0-9, -, _";
                    document.getElementById("msg").className = "alert alert-danger";
                }
                else {
                    tinymce.util.XHR.send({
                        url : "/save",
                        type : "POST",
                        content_type : "application/json",
                        data : tinymce.util.JSON.serialize(data),
                        success: function(response) {
                            console.debug(response);
                            var r = tinymce.util.JSON.parse(response);
                            document.getElementById("msg").innerHTML = r["msg"];
                            if(r["success"]) {
                                $scope.grabLists();
                                document.getElementById("msg").className = "alert alert-success";
                            }
                            else
                                document.getElementById("msg").className = "alert alert-danger";
                        },
                        error: function (text) {
                            console.debug(text);
                            document.getElementById("msg").innerHTML = "An unexpected error has occured.";
                            document.getElementById("msg").className = "alert alert-danger";
                        }
                    });
                }
            };

            $scope.switchView = function () {
                $scope.viewingList.value = !$scope.viewingList.value;
            };

            $scope.grabLists();
        } ]);