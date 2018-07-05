$(document).ready(() => {

    $('#output').hide();
    $('#loading').hide();

    var cors_api_url = 'https://cors-anywhere.herokuapp.com/';

    function doCORSRequest(options, printResult) {
        var x = new XMLHttpRequest();
        x.open(options.method, cors_api_url + options.url);
        x.onload = x.onerror = function () {
            printResult(
                options.method + ' ' + options.url + '\n' +
                x.status + ' ' + x.statusText + '\n\n' +
                (x.responseText || '')
            );
        };
        if (/^POST/i.test(options.method)) {
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        x.send(options.data);
    }
    // Bind event
    (function () {

        let newResult;

        var outputField = document.getElementById('output');


            document.getElementById('submit-form').onclick = function (e) {

                var url = 'https://piknu.com/u/' + $('#username').val() + '/following';

                e.preventDefault();

                $('.col-sm-8').hide();
                $('#output').show();

                $('#loading').show();

                doCORSRequest({
                    method: 'GET',
                    url: url
                }, function printResult(result) {

                  var fArray = [];
                  newResult = result.split("<");
                  newResult.splice(0, 28);
                  newResult.unshift(" ");
                  newResult = newResult.join("<");

                  if (newResult.toString().includes("Fatal error")) {
                    fArray = null;
                    return $("#output").html("<p>This User Has Made Their Profile Private.</p><br><a href='' class='btn btn-custom m-l'>Back</a>");
                  } else {
                    newResult = $.parseHTML(newResult);
                    $('#loading').hide();
                    $('#output').append("<button class='btn btn-custom' id='saveToDatabase'>Enter Into Database</button><button id='compare' class='btn btn-custom m-l' >Compare</button><a href='' class='btn btn-custom m-l'>Back</a>");
                    $('#output').append(newResult);

                    for ( i=0; i < $(".followx").length; i++ ) {
                      var item = $('.followx').children("a:nth-child(2)")[i].innerHTML;
                      fArray.push(item.toString());
                    }
                  }


                    $('#saveToDatabase').on('click', function() {
                      
                      function save() {
                        $('#loading').show();
                        $.ajax({
                        url: "https://recently-followed.herokuapp.com/save",
                        method: "POST",
                        data: {user: $('#username').val(), following: fArray}
                        }).then(res => {
                          $('#loading').hide();
                          alert(res);
                        })
                      }
                      save();
                    });


                    $('#compare').on('click', function() {

                      function compareEm (){
                        $('#loading').show();
                        $.ajax({
                          url: "https://recently-followed.herokuapp.com/compare",
                          method: "POST",
                          data: {user: $('#username').val(), following: fArray},
                          success: handleResponse
                        })
                      }

                      function handleResponse(res) {
                        $('#loading').hide();
                        $('#output').html("<h1 class='lead-h1'>Who They Recently Followed:<h1><br>");

                        res = JSON.parse(res);

                        if (!res.includes("has not followed anyone new yet!")) {
                          res.map(user => {
                            var userArray = user.split("");
                            userArray.shift();
                            userArray = userArray.join("");
                            $("#output").append("<a target='_blank' class='result-a' href='https://instagram.com/" + userArray +  "' >" + user + "</a>");
                          });
                          $('#output').append("<br><a href='' class='btn btn-custom m-t'>Back</a>");
                        } else {
                          $('#output').append("<p>" + res + "</p><br><a href='' class='btn btn-custom m-t'>Back</a>");
                        }

                      };

                      compareEm();

                    });
                });
            };
    })();

});
