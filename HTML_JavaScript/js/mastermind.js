$(function() {

    $("body").on("click", "symbol", function(e) {

        //Klikamy kółko aby je usunąć
        if ($(this).parent().attr("class") == "guess") {


            var row = $(this).parent().attr("id")

            row = Math.floor(row / 10);

            //Gdy klikamy inny wiersz
            if (row != $("dane").attr("row")) {
                console.log(row);
                return false;
            }

            $(this).parent().html("&nbsp;");
            $("#" + $("dane").attr("row")).attr("disabled", true);

            return false;

        }

        var row = $("dane").attr("row");

        //   console.log(row);

        for (var i = 1; i <= 4; i++) {

            if ($("#" + row + "" + i + "").html() === "&nbsp;") {

                $("#" + row + "" + i + "").html($(this).clone());

                break;
            }
        }

        for (var i = 1; i <= 4; i++) {

            if ($("#" + row + "" + i + "").html() === "&nbsp;") {

                break;
            }

            if (i === 4) {
                $("#" + row).removeAttr("disabled");
            }

        }

        return false;

    });



    $("body").on("click", "button", function(e) {

        // player = [];

        var row = $("dane").attr("row");

        player = [$("#" + row + "" + 1).children("symbol").attr("class"), $("#" + row + "" + 2).children("symbol").attr("class"), $("#" + row + "" + 3).children("symbol").attr("class"), $("#" + row + "" + 4).children("symbol").attr("class")];

        console.log(player);

        result = evaluateSolution(window.rozwiazanie, player);

        if (result["exactMatches"] === 4) {
            alert("WIN");
        }
        
        if (row == $("dane").attr("max_rows")) {
            alert("LOSE");
        }

        var column = 5;

        for (var i = 1; i <= result["exactMatches"]; i++) {

            $("#" + $("dane").attr("row") + "" + column).html("<symbol class='black'></symbol>");
            column++;
        }

        for (var i = 1; i <= result["valueMatches"]; i++) {

            $("#" + $("dane").attr("row") + "" + column).html("<symbol class='white'></symbol>");
            column++;
        }

        console.log(column);

        $("#" + row + "1").parent().css("background-color", "#D2D0D0");

        row++;

        $(this).attr("disabled", true);

        $("dane").attr("row", row);

        return false;

    });



});

$(window).load(function() {

    var UrlToPass = 'action=main';


    var max_rows = $("dane").attr("max_rows");

    var do_zalaczenia = "";

    for (var i = 1; i <= max_rows; i++) {

        do_zalaczenia += "<tr>";

        for (var a = 1; a <= 8; a++) {

            do_zalaczenia += "<td id=" + i + "" + a + " class='guess'>&nbsp;</td>";

            if (a === 4) {
                do_zalaczenia += "<td><button disabled type='button' id=" + i + ">CHECK</button></td>";
            }

        }

        do_zalaczenia += "</tr>";

    }

    $("#guesses").replaceWith(do_zalaczenia);

    var colors = ["pink", "red", "yellow", "green", "aqua", "blue"];

    var rozwiazanie = [colors[Math.floor((Math.random() * 6))], colors[Math.floor((Math.random() * 6))], colors[Math.floor((Math.random() * 6))], colors[Math.floor((Math.random() * 6))]];

    console.log(rozwiazanie);

    window.rozwiazanie = rozwiazanie;

});

// Thanks to Flambino:
// http://codereview.stackexchange.com/questions/27710/how-can-i-improve-this-version-of-the-board-game-mastermind
function evaluateSolution(code, pegs) {
    var i, l,
            foundIndex,
            exactMatches = 0,
            valueMatches = 0;

    // copy the arrays, so we don't ruin the orignals
    code = code.slice(0);
    pegs = pegs.slice(0);

    // First pass: Look for value & position matches
    // We're looping "backwards", so we can safely remove items
    // "behind us"
    for (i = pegs.length - 1; i >= 0; i--) {
        // If there's a match, remove the matched index from both
        // the code and the pegs so it isn't matched again later.
        if (pegs[i] === code[i]) {
            exactMatches++;
            pegs.splice(i, 1);
            code.splice(i, 1);
        }
    }

    // Now, pegs and code only contain unmatched values

    // Second pass: Look for value matches anywhere in the code
    for (i = 0, l = pegs.length; i < l; i++) {
        // attempt to find the peg in the remaining code
        foundIndex = code.indexOf(pegs[i]);
        if (foundIndex !== -1) {
            valueMatches++;
            // remove the matched code peg, since it's been matched
            code.splice(foundIndex, 1);
        }
    }

    // Now, return the number of exact and inexact matches
    // as an object, so it's easy to use
    return {
        exactMatches: exactMatches,
        valueMatches: valueMatches,
        totalMatches: exactMatches + valueMatches
    };
}