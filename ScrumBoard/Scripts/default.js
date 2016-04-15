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

    scrum.initialize = function () {
        $('#btnSubmit').on('click', scrum.addIssueToBoard);
        mockIssue();
        dragEvents();
    }

    function mockIssue() {
        var mock = '<div id="mockIssue" class="issue" draggable="true"><h5>MOCK</h5>test</div>';
        $('#backlogCol').append(mock);
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
        console.log(e);
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

        col.removeClass('issueDroppoint');
    }

    function Issue(title, description, points, status) {
        $title = title;
        $description = description;
        $points = points;
        $status = status;
    }

    scrum.addIssueToBoard = function () {

    }

})();
