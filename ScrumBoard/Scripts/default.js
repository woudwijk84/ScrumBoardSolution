/// <reference path="jquery-2.2.3.js" />

$(document).ready(function () {
    scrumNS.initialize();
});

(function () {
    this.scrumNS = this.scrumNS || {};
    var scrum = this.scrumNS;
    var $columns = 4;
    var $destination;
    var $draggedIssue;
    var $issueCount = 0;

    scrum.initialize = function () {
        console.log('init');
        $('#btnSubmit').on('click', scrum.addIssueToBoard);
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

})();
