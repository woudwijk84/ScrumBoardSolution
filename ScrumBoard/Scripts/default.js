/// <reference path="jquery-2.2.3.js" />

//window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.ms

$(document).ready(function () {
    scrumNS.initialize();
});

(function () {
    this.scrumNS = this.scrumNS || {};
    var scrum = this.scrumNS;
    var $columns = 4;
    var $destination;
    var $draggedIssue;
    var $currentIssue;
    var $issueCount = 0;
    var $indexedDB = window.indexedDB;
    //var openRequest = $indexedDB.open("scrumIssues", 1);
    var $db;

    scrum.initialize = function () {
        console.log('init');
        $('#btnSubmit').on('click', scrum.saveIssue);
        initDB();
        //scrum.getIssues();
        //mockIssue();
    }

    // #region Drag & drop


    function mockIssue() {
        var mock = '<div id="mockIssue" class="issue" draggable="true"><h5>MOCK</h5>test</div>';
        $('#backlogCol').append(mock);
        //dragEvents();
    }

    function dragEvents() {
        $('.issue').on('dragstart', dragging);
        $('.issue').on('dragend', draggingEnded);
        $('.scrumCol').on('dragenter', dragEnter);
        $('.scrumCol').on('dragover', preventDefault);
        $('.scrumCol').on('dragleave', dragLeave);
        $('.scrumCol').on('drop', dropIssue);
    }

    function dragging(e) {
        $(e.target).addClass('dragging');
        $draggedIssue = $(e.target);
    }

    function draggingEnded(e) {
        $(e.target).removeClass('dragging')
    }

    function dragEnter(e) {
        preventDefault(e);
        $(e.target).addClass('issueDroppoint');
    }

    function dragLeave(e) {
        preventDefault(e);
        $(e.target).removeClass('issueDroppoint');
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    function dropIssue(e) {
        var col = $(e.target);
        if (col.hasClass('scrumCol')) {
            $draggedIssue.detach();
            $draggedIssue.appendTo(col);
        }
        var droppableId = $(this).attr("id");
        if (droppableId === 'backlogCol') {
            $draggedIssue.status = 'todo';
        } else if (droppableId === 'doingCol') {
            $draggedIssue.status = 'doing';
        } else if (droppableId === 'doneCol') {
            $draggedIssue.status = 'done';
        }
        console.log($('#dragHistory'));
        $('#dragHistory').append('Issue ' + $draggedIssue.title + ' moved to ' + $draggedIssue.status + '<br/>');
        col.removeClass('issueDroppoint');
    }


    // #endregion

    function Issue(title, description, points, status) {
        $title = title;
        $description = description;
        $points = points;
        $status = status;
    }

    scrum.addIssueToBoard = function () {
        var title = $('#title').val().charAt(0) ? $('#title').val() : '';
        var description = $("#description").val().charAt(0) ? $('#description').val() : '';
        var points = $("#points").val().charAt(0) ? $('#points').val() : '';
        if (title !== '' && description !== '' && points !== '') {
            //var newIssue = new Issue(title, description, points, 'backlog');
            var html = '<div id="issue"' + $issueCount + ' class="issue" draggable="true"><h5>' + title +
                '</h5><p>' + description + '<br /><b>' + points + ' points</b></p></div>';
            $('#backlogCol').append(html);
            $issueCount++;
            dragEvents();
        } else {
            var errorMsg = '';
            console.log($('#title'));
            if (title === '') {
                errorMsg += '<span class="creationErr">Title is required </span><br />';
            }
            if (description === '') {
                errorMsg += '<span class="creationErr">Description is required </span><br />';
            }
            if (points === '') {
                errorMsg += '<span class="creationErr">Points is required </span><br />';
            }
            $('#dragHistory').append(errorMsg);
        }
    };

    function printIsseus(issues) {
        for (var i = 0; i < issues.length; i++) {
            var html = '';
            var status = '';
            var key = issues[i].key;
            var issue = issues[i].issue;
            html += '<div id="issue' + i + '" class="issue" draggable="true">' +
                    '<h5>' + issue.title + '</h5> ' +
                    '<a class="deleteIssue" href="javascript:void(0)" data-key=' + key + '>X</a>' +
                    '<p>' + issue.description + '<br /> ' +
                    '<b>' + issue.points + ' points</b></p></div>';
            status = issue.status;
            if (status === 'todo') {
                $('#backlogCol').append(html);
            } else if (status === 'doing') {
                $('#doingCol').append(html);
            } else if (status === 'doneCol') {
                $('#doneCol').append(html);
            }
        }
        $('.deleteIssue').on('click', scrum.deleteIssue);
        dragEvents();
    }

    scrum.deleteIssue = function (issue) {
        console.log(issue);
    }

    // #region IndexedDB

    function initDB() {
        var openRequest = indexedDB.open("scrumIssues", 1);

        openRequest.onupgradeneeded = function (response) {
            response.currentTarget.result.createObjectStore("Issues",
                {
                    keypath: 'id',
                    autoIncrement: true
                });
        }

        openRequest.onsuccess = function (response) {
            $db = openRequest.result;
            scrum.getIssues();
        }

        openRequest.onerror = function (response) {
            alert("Errorcode: " + response.target.errorcode);
        }
    }

    //function getRequest() {
    //    var db = $db || initDB();
    //    var transaction = db.transaction('Issues', 'readwrite');
    //    var request = transaction.objectStore('Issues');
    //    return request;
    //}

    scrum.getIssues = function () {
        $currentIssue = { key: null, issue: {} }
        var transaction = $db.transaction('Issues', 'readonly');
        var request = transaction.objectStore('Issues').openCursor();
        var issues = [];

        request.onsuccess = function (response) {
            var cursor = response.target.result;
            if (!cursor) {

                printIsseus(issues);
                return;
            }

            issues.push({ key: cursor.key, issue: cursor.value });
            cursor.continue();
        }
    }

    scrum.saveIssue = function () {
        console.log('creating issue');
        var issue = $currentIssue.issue;
        issue.title = $('#title').val();
        issue.description = $('#description').val();
        issue.points = $('#points').val();
        issue.status = 'todo';

        //var issueObjStore = getRequest();
        var transaction = $db.transaction('Issues', 'readwrite');
        var issueObjStore = transaction.objectStore('Issues');
        var request = $currentIssue.key != null ? issueObjStore.put(issue, $currentIssue.key) : issueObjStore.add(issue);

        request.onsuccess = function (response) {
            scrum.getIssues();
        }
    }

    // #endregion

})();
