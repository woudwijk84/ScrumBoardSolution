/// <reference path="jquery-2.2.3.js" />
/// <reference path="bootstrap.js" />


$(document).ready(function () {
    scrumNS.initialize();
    $('#btnSubmit').on('click', scrumNS.addIssueToBoard);
});

(function () {
    this.scrumNS = this.scrumNS || {};
    var scrum = this.scrumNS;
    var $columns = 4;
    var $destination;

    scrum.initialize = function () {

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
