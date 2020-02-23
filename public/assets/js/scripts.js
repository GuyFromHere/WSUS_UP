$(function() {


	const classifications = [
		{
			id: 1,
			value: "Security"
		},
		{
			id: 2,
			value: "Critical"
		}
	];
	const products = [
		{ id: 1, value: "Server 2019" },
		{ id: 2, value: "Server 2016" },
		{ id: 3, value: "Server 2012" },
		{ id: 4, value: "Windows 10 1803" },
		{ id: 5, value: "Windows 10 1903" },
		{ id: 6, value: "Office 2010" }
	];
	const statuses = [
		{ id: 1, value: "Unapproved" },
		{ id: 2, value: "Approved" },
		{ id: 3, value: "Declined" }
	];

	// takes select options list and outputs it to edit inputs
	// marks the currently selected option as selected in the edit form
	const getSelectOptions = function(selected, options) {
		let outStr = "";
		for ( let i = 0; i < options.length; i++ ) {
			if ( options[i].value == selected ) {
				outStr += '<option value="' + options[i].id +'" selected>' + options[i].value + '</option>'
			} else {
				outStr += '<option value="' + options[i].id + '">' + options[i].value + '</option>'
			}
		}
		return outStr;
	}

	// toggle .edit and .show 
	$(".editBtn").on("click", e => {
			console.log('here')
		e.preventDefault();
		// get row to update
		const rowId = $(e.target).data("id");
		const targetRow = $('#row' + rowId);
		// get current values
		const kb = $('#kb' + rowId).text();
		const classification = $('#classification' + rowId).text();
		const status = $('#status' + rowId).text();
		const details = $('#details' + rowId).text();
		const product = $('#product' + rowId).text();
		const editEls = `
			<form id="${rowId}" action="/edit" method="POST">
				<td><input type="text" value="${kb}"></td>
				<td>
					<select id="editClassification${rowId}">`+
					getSelectOptions(classification, classifications)+`
					</select>
				</td>
				<td>
					<select id="editStatus${rowId}">`+
					getSelectOptions(status, statuses) +`
					</select>
				</td>
				<td><input id="editDetails${rowId}" type="text" value="${details}"></td>
				<td>
					<select id="editProducts${rowId}">`+
					getSelectOptions(product, products)+`
					</select>
				</td>
				<td><input type="submit" class="submitEditBtn" data-id="${rowId}" value="Send" /></td>
			</form>`;
		targetRow.html(editEls);
	});

	$(".submitEditBtn").on("click", e => {
		console.log('scripts submiteditbtn');
		e.preventDefault();
		console.log('scripts submiteditbtn');
		const rowId = $(e.target).data('id');
		const editUpdate = {};
		editUpdate.kb = $("#addKb" + rowId).val();
		editUpdate.classification = $("#addClassification" + rowId).val();
		editUpdate.status = $("#addStatus" + rowId).val();
		editUpdate.details = $("#addDetails" + rowId).val();
		editUpdate.product = $("#addProduct" + rowId).val();
		console.log('scripts submitEditBtn');
		console.log(editUpdate);
	}) 

	$(".addBtn").on("click", e => {
		e.preventDefault();
		const newUpdate = {};
		newUpdate.kb = $("#addKb").val();
		newUpdate.classification = $("#addClassification").val();
		newUpdate.status = $("#addStatus").val();
		newUpdate.details = $("#addDetails").val();
		newUpdate.product = $("#addProduct").val();

		$.ajax("/add", {
			type: "POST",
			data: newUpdate
		}).then(() => {
			location.reload();
		});
	});

});
