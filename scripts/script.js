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

        var outputField = document.getElementById('output');


            document.getElementById('submit-form').onclick = function (e) {

                var url = 'https://piknu.com/u/' + $('#username').val() + '/following';

                e.preventDefault();

                $('.col-sm-8').hide();

                doCORSRequest({
                    method: 'GET',
                    url: url
                }, function printResult(result) {

                    var newResult = result.split("<");
                    newResult.splice(0, 28);
                    newResult.unshift(" ");
                    newResult = newResult.join("<");


                    $('#output').show();

                    newResult = $.parseHTML(newResult);

                    $('#output').append("<button class='btn btn-custom' id='saveToDatabase'>Enter Into Database</button><button id='compare' class='btn btn-custom m-l' >Compare</button><a href='' class='btn btn-custom m-l'>Back</a>");
                    $('#output').append(newResult);

                    var fArray = [];
                    for ( i=0; i < $(".followx").length; i++ ) {
                      var item = $('.followx').children("a:nth-child(2)")[i].innerHTML;
                      fArray.push(item.toString());
                    }


                    $('#saveToDatabase').on('click', function() {

                      var data = JSON.stringify({user: $('#username').val(), following: fArray});

                      $.ajax({
                        url: "https://recently-followed.herokuapp.com/save",
                        method: "POST",
                        data: {user: $('#username').val(), following: fArray}
                      }).then(res => {
                        alert(res);
                      })

                    });


                    $('#compare').on('click', function() {

                      function compareEm (){
                        $.ajax({
                          url: "https://recently-followed.herokuapp.com/compare",
                          method: "POST",
                          data: {user: $('#username').val(), following: fArray},
                          success: handleResponse
                        })
                      }

                      function handleResponse(res) {
                        $('#output').html("<h1 class='lead-h1'>Who They Recently Followed:<h1><br>");

                        res = JSON.parse(res);

                        if (!res.includes("has not followed anyone new yet!")) {
                          res.map(user => {
                            $("#output").append("<p>" + res + "</p><br>");
                          })
                        } else {
                          $('#output').append("<p>" + res + "</p>");
                        }
                          
                        $('#ouput').append("<a href='' class='btn btn-custom m-t'>Back</a>");

                      };

                      compareEm();

                    });



                });
            };
    })();

});
