
$(function () {
    $('#addForm').on("submit", (e) => {
        // do something
        const age = $('#newAge').val();
        const quote = $('#newQuote').val();
        const context = $('#newContext').val();

        const newQuote = {
            age: $('#newAge').val(),
            quote: $('#newQuote').val(),
            context: $('#newContext').val()
        };

        $.ajax('/api/add_quote', {
            type: "POST",
            data: newQuote
        }).then(() => {
            console.log(newQuote);
            location.reload();
        })
    })
})