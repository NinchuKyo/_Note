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

            // Values from our config file
            var config = null;

            $scope.loggedIn = { value: false };

            /********** On Startup **************************************************/

            // Get values from config file and load initial list
            //$http.get('config/config.json').success(function (configResult) {
            //    config = configResult;
            //    $scope.grabData();
            //});

            // Set up timer to update the list every 5 minutes
            setInterval(scheduledUpdate, (1000 * 60 * 15));

            /********** Functions ***************************************************/

            /********** Loading **********************/

            // Every time the timer elapses, updates the data from the BE
            function scheduledUpdate() {
                isUpdating = true;
                $scope.doneLoading = false;
                $scope.grabData();
            }

            // Calls the BE API to get the data then displays them
            // $scope.grabData = function () {
            //     $scope.data = [
            //         { "Title": 'Harrison Note #1', "Description": 'Hi, I\'m Harrison and this is my 1st note!' },
            //         { "Title": 'Harrison Note #2', "Description": 'Hi, I\'m Harrison and this is my 2nd note!' },
            //         { "Title": 'Harrison Note #3', "Description": 'Hi, I\'m Harrison and this is my 3rd note!' },
            //         { "Title": 'Harrison Note #4', "Description": 'Hi, I\'m Harrison and this is my 4th note!' },
            //         { "Title": 'Harrison Note #5', "Description": 'Hi, I\'m Harrison and this is my 5th note!' },
            //         { "Title": 'David Note #1', "Description": 'Hi, I\'m David and this is my 1st note!' },
            //         { "Title": 'David Note #2', "Description": 'Hi, I\'m David and this is my 2nd note!' },
            //         { "Title": 'David Note #3', "Description": 'Hi, I\'m David and this is my 3rd note!' },
            //         { "Title": 'David Note #4', "Description": 'Hi, I\'m David and this is my 4th note!' },
            //         { "Title": 'David Note #5', "Description": 'Hi, I\'m David and this is my 5th note!' },
            //         { "Title": 'Tony Note #1', "Description": 'Hi, I\'m Tony and this is my 1st note!' },
            //         { "Title": 'Tony Note #2', "Description": 'Hi, I\'m Tony and this is my 2nd note!' },
            //         { "Title": 'Tony Note #3', "Description": 'Hi, I\'m Tony and this is my 3rd note!' },
            //         { "Title": 'Tony Note #4', "Description": 'Hi, I\'m Tony and this is my 4th note!' },
            //         { "Title": 'Tony Note #5', "Description": 'Hi, I\'m Tony and this is my 5th note!' },
            //         { "Title": 'Graeme Note #1', "Description": 'Hi, I\'m Graeme and this is my 1st note!' },
            //         { "Title": 'Graeme Note #2', "Description": 'Hi, I\'m Graeme and this is my 2nd note!' },
            //         { "Title": 'Graeme Note #3', "Description": 'Hi, I\'m Graeme and this is my 3rd note!' },
            //         { "Title": 'Graeme Note #4', "Description": 'Hi, I\'m Graeme and this is my 4th note!' },
            //         { "Title": 'Graeme Note #5', "Description": 'Hi, I\'m Graeme and this is my 5th note!' },
            //         { "Title": 'Lyndon Note #1', "Description": 'Hi, I\'m Lyndon and this is my 1st note!' },
            //         { "Title": 'Lyndon Note #2', "Description": 'Hi, I\'m Lyndon and this is my 2nd note!' },
            //         { "Title": 'Lyndon Note #3', "Description": 'Hi, I\'m Lyndon and this is my 3rd note!' },
            //         { "Title": 'Lyndon Note #4', "Description": 'Hi, I\'m Lyndon and this is my 4th note!' },
            //         { "Title": 'Lyndon Note #5', "Description": 'Hi, I\'m Lyndon and this is my 5th note!' },
            //         { "Title": 'Mathias Note #1', "Description": 'Hi, I\'m Mathias and this is my 1st note!' },
            //         { "Title": 'Mathias Note #2', "Description": 'Hi, I\'m Mathias and this is my 2nd note!' },
            //         { "Title": 'Mathias Note #3', "Description": 'Hi, I\'m Mathias and this is my 3rd note!' },
            //         { "Title": 'Mathias Note #4', "Description": 'Hi, I\'m Mathias and this is my 4th note!' },
            //         { "Title": 'Mathias Note #5', "Description": 'Hi, I\'m Mathias and this is my 5th note!' }
            //     ];

            //     filteredData = $scope.data;
            //     $scope.search('Main');

            //     if (isUpdating) {
            //         isUpdating = false;
            //     }

            //     $scope.doneLoading = true;
            // }

           $scope.grabData = function () {
               $http.get('/lists').success(function (data) {

                       $scope.data = angular.fromJson(data).note_titles;

                       filteredData = $scope.data;
                       $scope.search('Main');

                       if (isUpdating) {
                           isUpdating = false;
                       }
                       
                       $scope.doneLoading = true;
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

            /********** Items **************************/

            $scope.logInOrOut = function () {
                $scope.loggedIn.value = !$scope.loggedIn.value;
            }

            $scope.keyPressed = function (evt) {
                evt = evt || window.event;
                // exclude special keys in Gecko (Delete, Backspace, Arrow keys,... )
                if (evt.which !== 0)
                {
                    var charCode = evt.which === undefined ? evt.keyCode : evt.which;
                    var charTyped = String.fromCharCode(charCode);

                    if (/[\w\s\x08-]/.test(charTyped) === false)
                    {
                        return false;
                    }
                }
            };

            $scope.grabData();
        } ]);