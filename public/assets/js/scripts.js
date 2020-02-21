$(function() {
	$(".editBtn").on("click", e => {
		e.preventDefault();
		const targetEl = $(e.target);
		console.log("pub js script editBtn");
		console.log(targetEl.data("id"));
	});

	$(".addBtn").on("click", e => {
		e.preventDefault();
		const targetEl = $(e.target);
		console.log("pub js script addBtn");
		console.log("kb:");
		console.log($("#addKb").val());
	});

	/*  $('#addForm').on("submit", (e) => {
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
    }) */
});
